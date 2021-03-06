import React, { useState, useEffect } from "react";
import { Post } from "../../service/service.setup";
import { connect } from "react-redux";
import { setCurrentUser } from "../../redux/user/user.actions";
import "./lon.style.scss";
import LeftSideBar from "../sidebar/left.sidebar.compoent";
import DisplayImages from "../display-uploaded-images.component/display-uploded-images";
import DisplayImageDescription from "../display-discription/display-discription";
import TopHeaderWithBack from "../top-header/simple-top.back";
import SharedHeader from "../top-header/shared-header";
import { setFolderFlag } from "../../redux/shared-folder/folder.actions";
import { Link } from "react-router-dom";
import CustomLoader from "../loader/loader";
import Paginate from "../common/paginate";
import {
  getNotificationsIndex as getStartIndex,
  getNotificationCount as getPageCount,
  NOTIFICATION_OFF_SET as PAGE_OFF_SET,
} from "../common/pagination.config";

const UploadFile = ({ match, history, sharedWithMe, setFolderFlag }) => {
  const [file, setFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [paginateImages, setPaginateImages] = useState([]);
  const [currentFolderName, setCurrentFolderName] = useState("");
  const [imageDescription, setImagesDescription] = useState("Hi");
  const [pageNumber, setPageNumber] = useState("");
  const [date, setDate] = useState("");
  const [iSDisplayDiv, setIsDisplayDiv] = useState(false);
  const currentIndex = sharedWithMe == "SHARED" ? 1 : 0;
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const [folderId, setFolderId] = useState(match.params.id);
  const [imagesUpdate, setImagesUpdate] = useState([]);
  const [filteredImages, setFilteredImages] = useState("");
  const [searchImage, setSearchImage] = useState("");
  const [isShowLoader, setShowLoader] = useState(false);
  const [currentPagination, setCurrentPagination] = useState(1);

  const sideBarStyle = {
    border: "1px solid rgba(0, 0, 0, 0.125)",
    height: "90vh",
  };
  const paginationStyle = {
    position: "absolute",
    bottom: "14%",
    left: "40%",
  };
  const searchImageHandler = (e) => {
    setSearchImage(e.target.value);
    setFilteredImages(
      images.filter((item) => {
        if (item.title) {
          return item.title
            .toLowerCase()
            .includes(e.target.value.toLowerCase());
        }
      })
    );
  };

  const totalEle = ["My Books", "Shared Books", "Default Page"];
  const [LiElement, setLiEl] = useState(totalEle);
  const handleActive = (e) => {
    setActiveIndex(LiElement.indexOf(e));
    if (LiElement.indexOf(e) == 0) {
      setFolderFlag("HOME");
    }
    if (LiElement.indexOf(e) == 1) {
      setFolderFlag("SHARED");
    }
    if (LiElement.indexOf(e) == 2) {
      setFolderFlag("PENDING");
    }
    // setSharedWithMe(!sharedWithMe);
    setLiEl(totalEle);
  };
  const otpHandler = () => {};
  const showContentHandler = (pageNo, des, date) => {
    setIsDisplayDiv(true);
    setImagesDescription(des);
    setPageNumber(pageNo);
    setDate(date);
  };
  const hideContentHandler = (flag) => {
    setIsDisplayDiv(flag);
  };
  useEffect(() => {
    if (sharedWithMe == "HOME") {
      getOwnImage();
    } else {
      getSharedWithMeImage();
    }
  }, []);
  async function getSharedWithMeImage() {
    setShowLoader(true);
    try {
      const request = { fileId: match.params.id, allPageAcess: true };
      const images = await Post("/getAllSharedFileImages", request);
      if (images.data.code == 201) {
        alert(images.data.error);
        history.push("/logout");
      }
      setImages(images.data.imageInput);
      const temp = [...images.data.imageInput];
      setPaginateImages(temp.splice(0, PAGE_OFF_SET));

      setCurrentFolderName(images.data.fileName);
      setIsLoading(false);
      setShowLoader(false);
    } catch (error) {
      setShowLoader(false);
    }
  }
  async function getOwnImage() {
    setShowLoader(true);
    try {
      setIsLoading(true);
      const requestFile = { id: match.params.id };
      const images = await Post("/getAllFileImages", requestFile);
      if (images.data.code == 201) {
        alert(images.data.error);
        history.push("/logout");
      }
      setImages(images.data.imageInput);
      const temp = [...images.data.imageInput];
      setPaginateImages(temp.splice(0, PAGE_OFF_SET));

      setCurrentFolderName(images.data.fileName);
      setIsLoading(false);
      setShowLoader(false);
    } catch (error) {
      setShowLoader(false);
    }
  }
  const updateHandler = (list) => {
    setImagesUpdate(list);
  };
  const paginate = (number) => {
    const allImages = [...images];
    setPaginateImages(allImages.splice(getStartIndex(number), PAGE_OFF_SET));
    setCurrentPagination(number);
  };

  const groupNextPrev = (type) => {
    if (type === "NEXT") {
      if (currentPagination == getPageCount(images)) return;
      paginate(currentPagination + 1);
    } else {
      if (currentPagination == 1) return;
      paginate(currentPagination - 1);
    }
  };
  return (
    <>
      {sharedWithMe == "HOME" && (
        <TopHeaderWithBack
          id={match.params.id}
          updateImages={imagesUpdate}
          history={history}
          images={images}
          setImages={setImages}
          currentFolder={currentFolderName}
          searchImageHandler={searchImageHandler}
          imageSearchInput={searchImage}
          setShowLoader ={setShowLoader}
        />
      )}
      {sharedWithMe == "SHARED" && <SharedHeader history={history} />}
      <div className="row">
        <div className="col-md-2 custom-pad-li  d-none d-sm-block">
          <Link className="logo-container" to="/">
            <ul className="list-group ul-pad" style={sideBarStyle}>
              {totalEle.map((item, index) => (
                <LeftSideBar
                  item={item}
                  key={index}
                  isActive={activeIndex == index ? true : false}
                  changeActive={handleActive}
                />
              ))}
              {/* <DisplayImageDescription
                pageNumber={pageNumber}
                iSDisplayDiv={iSDisplayDiv}
                isShowNumber={true}
                date={date}
                imageDescription={imageDescription}
              /> */}
            </ul>
          </Link>
        </div>
        <div className="col-md-10">
          {isShowLoader && <CustomLoader />}
          <DisplayImages
            history={history}
            onHove={showContentHandler}
            onLeave={hideContentHandler}
            images={paginateImages}
            folderId={folderId}
            updateHandler={updateHandler}
            isLoading={isLoading}
            filteredImages={filteredImages}
            searchInput={searchImage}
          />
          {images.length > 0 && (
            <Paginate
              elStyle={paginationStyle}
              setCurrentSelected={paginate}
              active={currentPagination}
              count={getPageCount(images)}
              NextPrev={groupNextPrev}
            />
          )}
        </div>
      </div>
    </>
  );
};
const mapStateToPros = ({ sharedWithMe: { sharedWithMe } }) => ({
  sharedWithMe,
});
const mapDispatchToProps = (dispatch) => ({
  setFolderFlag: (flag) => dispatch(setFolderFlag(flag)),
});

export default connect(mapStateToPros, mapDispatchToProps)(UploadFile);
//export default UploadFile;
