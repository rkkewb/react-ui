import React, { useEffect, useState } from "react";
import CreateFolder from "../create-folder/create-folder.component";
import TestButton from "../create-folder/create.btn.component";
import GetLoader from "../../ui/loder";
import { Post, Get } from "../../service/service.setup";
import "./create-image.style.scss";
import { ReactComponent as Cross } from "../../assets/cross.svg";
import ImageSlider from "./image.slider";
import { ToastContainer, toast } from "react-toastify";
import TopSingleHeader from "../top-header/new.header";
import LoadLookup from "../pending-data/display-page-lookup";
import { connect } from "react-redux";
import SharedHeader from "../top-header/shared-header";
import { getPendingPageById } from "../../service/pendingData";
import LeftSideBar from "../sidebar/left.sidebar.compoent";
import { Link } from "react-router-dom";
import CustomLoader from "../loader/loader";
import ShowMessages from "../common/display-message-modal";
import { setFolderFlag } from "../../redux/shared-folder/folder.actions";
import RightSharedPeopleList from "../right-side-bar/RightSharedPeopleList";
import { useDispatch, useSelector } from "react-redux";
import SideBarBooks from "../SideBooks/SideBarBooks";
import DefaultSideBar from "../sidebar/DefaultSideBar";
import { setCurrentBookId } from "../../redux/all-books/allBooks.actions";
import DefaultPageData from "../pending-data/display-default-page-data";

const DisplayOriginalImage = ({
  match,
  history,
  sharedWithMe,
  setFolderFlag,
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [searchItem, setSearchHandler] = useState("");
  const [filteredFolder, setFilteredFolder] = useState("");
  const [imageId, setImageId] = useState(match.params.id);
  const allBooks = useSelector((state) => state.userBooks.books);

  const currentFolderId = useSelector((state) => state.userBooks.currentBookId);
  const [allImages, setAllImages] = useState([]);
  const [currentFolderName, setCurrentFolderName] = useState("");
  const [currentLookup, setCurrentLookup] = useState(false);
  const [isShowLoader, setShowLoader] = useState(false);
  const [allPendingLIst, setAllPendingList] = useState([]);
  const [currentPendingFolderId, setPendingFolderId] = useState("");
  const dispatch = useDispatch();
  const [defaultPageEditMode, setDefaultPageEditMode] = useState(false);
  const [lookupPageState, setLookupPageState] = useState({
    fileId: 0,
    shareId: 0,
    title: "",
    description: "",
    date: new Date(),
    pendingFolderId: 0,
    imageId: 0,
    pageNumber: 0,
    id: 0,
    segmentation: "",
  });
  const [isPrimerUser, setIsPrimerUser] = useState("");
  
  // loader and alert box
  const [showPopUp, setShowPop] = useState(false);
  const [responseMgs, setResponseMgs] = useState("");

  const searchHandler = (e) => {
    setSearchHandler(e.target.value);
    setFilteredFolder(
      allBooks.filter(
        (item) =>
          item.fileName.toLowerCase().includes(e.target.value.toLowerCase()) ||
          (item.file_tag &&
            item.file_tag
              .toLowerCase()
              .includes(e.target.value.toLowerCase())) ||
          (item.owner &&
            item.owner.toLowerCase().includes(e.target.value.toLowerCase())) ||
          (item.fileDescription &&
            item.fileDescription
              .toLowerCase()
              .includes(e.target.value.toLowerCase()))
      )
    );
  };
  const setFolderIdHandler = (id, flagValue) => {
    dispatch(setCurrentBookId(id));
    if (flagValue) {
      setFolderFlag("SHARED");
    } else {
      setFolderFlag("HOME");
    }
    setDefaultPageEditMode(false);
    history.push(`/?id=${id}`);
  };
  const nextHandler = () => {
    let index = allPendingLIst.indexOf(parseInt(imageId));
    if (index == allPendingLIst.length - 1) {
      setResponseMgs("You've reached last image in the file ");
      setShowPop(true);
      return;
    }
    setImageId(allPendingLIst[index + 1]);
  };
  const prevHandler = () => {
    let index = allPendingLIst.indexOf(parseInt(imageId));
    if (index == 0) {
      setResponseMgs("You've reached first image in the file ");
      setShowPop(true);
      return;
    }
    setImageId(allPendingLIst[index - 1]);
  };

  useEffect(() => {
    // getCurrentPage();
    const IMAGE_ORIGINAL_URL =
      sharedWithMe == "HOME" ? "getAnyCloudImages" : "getAnySharedCloudImages";
    const requestFile = { ids: [match.params.id], imagetype: "_align.jpg" };

    Post(`/${IMAGE_ORIGINAL_URL}`, requestFile).then((res) => {
      if (res.data.code == 201) {
        // alert(res.data.error);
        responseMgs(res.data.error);
        setShowPop(true);
        history.push("/logout");
      }

      setImageUrl(res.data.imageInput[0].raw_image_org);
    });
    const requestImages = { id: match.params.folderId };
    const sharedRequest = { fileId: match.params.folderId, allPageAcess: true };
    const allImagesRequest =
      sharedWithMe == "HOME" ? requestImages : sharedRequest;
    const IMAGE_URL =
      sharedWithMe == "HOME" ? "getAllFileImages" : "getAllSharedFileImages";

    Post(`/${IMAGE_URL}`, allImagesRequest).then((res) => {
      if (res.data.code == 201) {
        //alert(res.data.error);
        responseMgs(res.data.error);
        setShowPop(true);

        history.push("/logout");
      }
      const allCloud = [];
      setCurrentFolderName(res.data.fileName);
      res.data.imageInput.forEach((image) => allCloud.push(image.id));
      setAllPendingList(allCloud);
      const IMAGE_SMALL_URL =
        sharedWithMe == "HOME"
          ? "getAnyCloudImages"
          : "getAnySharedCloudImages";

      Post(`/${IMAGE_SMALL_URL}`, {
        ids: allCloud,
        imagetype: "_align_small.jpg",
      }).then((res) => {
        if (res.data.code == 201) {
          //  alert(res.data.error);
          setResponseMgs(res.data.error);
          setShowPop(true);
          history.push("/logout");
        }
        setAllImages(res.data.imageInput);
      });
    });
  }, []);
  useEffect(() => {
    const pendingBook = allBooks.filter((item) => item.pending === true);
    if (pendingBook[0]) {
     
      setPendingFolderId(pendingBook[0].id);
    }
  }, []);
  useEffect(() => {
    getCurrentPage();
  }, [imageId]);
  // page lookup
  const getCurrentPage = async () => {
    setShowLoader(true);
    const response = await getPendingPageById(imageId);
    setCurrentLookup(response.data && response.data);
    // setLookupPageState(response.data && response.data.pageLookup);
    if (response) {
      setLookupPageState(removeNull(response.data.pageLookup));
      if (
        response.data.user_membership == 1 ||
        response.data.user_membership == 2
      ) {
        setIsPrimerUser(1);
      } else {
        setIsPrimerUser(0);
      }
    }
    setShowLoader(false);
  };
  const removeNull = (data) => {
    const tempData = { ...data };
    for (let attr in data) {
      if (tempData[attr] == null && attr != "userList") {
        tempData[attr] = "";
      }
    }
    if (tempData.date == "") tempData.date = new Date();
    return tempData;
  };
  // handle input
  const pageLookUpHandler = (e) => {
    const currentState = { ...lookupPageState };

    const { name, value } = e.target ? e.target : { name: "shareId", ...e };
    if (name == "fileId" || name == "tag") {
      let folder = currentState.file.filter((item) => item.id == value);
      let tag = folder.length > 0 ? folder[0].fileTag : "";
      if (!tag) tag = "";
      currentState["fileId"] = value;
      currentState["tag"] = value;
    } else {
      currentState[name] = value;
    }
    setLookupPageState(currentState);
  };

  const styleImage = {
    width: "80vh",
    height: "80vh",
  };
  const crossStyle = {
    position: "absolute",
    width: "4rem",
    height: "2rem",
    top: "5rem",
    right: "3rem",
  };
  const saveUpdateData = async () => {
    setShowLoader(true);
    try {
      const request = {
        ...lookupPageState,
        admin_updated: lookupPageState.admin_updated == 1 ? true : false,
      };
      const response = await Post("/savePageLookup", request);

      if (response.data.code == "200") {
        // alert("Saved Successfully");
        setResponseMgs("Saved Successfully");
        setShowPop(true);
        // if (response.data.isFileMoved) removeSavedImageId();
      }
      setShowLoader(false);
      setDefaultPageEditMode(false);
    } catch (e) {
      setShowLoader(false);
      setDefaultPageEditMode(false);
    }
  };
  const pageLookUpDateHandler = (e) => {
    const currentState = { ...lookupPageState };
    currentState.date = e;
    setLookupPageState(currentState);
  };
  const setDefaultFolderId = () => {
    setFolderFlag("PENDING");
    dispatch(setCurrentBookId(currentPendingFolderId));
    history.push(`/?id=${currentPendingFolderId}`);
  };
  return (
    <>
      {isShowLoader && <CustomLoader />}
      <ShowMessages
        hide={() => setShowPop(false)}
        message={responseMgs}
        show={showPopUp}
      />
      {sharedWithMe == "HOME" && (
        <TopSingleHeader
          imageId={imageId}
          images={allImages}
          history={history}
          currentFolder={currentFolderName}
          folderId={match.params.folderId}
          next={nextHandler}
          prev={prevHandler}
          pageSaveHandler={saveUpdateData}
          toggleModal={setShowPop}
          setResponseMgs={setResponseMgs}
          toggleLoader={setShowLoader}
          defaultPageEditMode={defaultPageEditMode}
          setDefaultPageEditMode={setDefaultPageEditMode}
          searchHandler={searchHandler}
          searchItem={searchItem}
        />
      )}
      {sharedWithMe == "SHARED" && (
        <SharedHeader
          isHideButton={sharedWithMe == "SHARED" ? true : false}
          next={nextHandler}
          prev={prevHandler}
          history={history}
        />
      )}
      <div className="row">
        {isShowLoader && <CustomLoader />}
        <div className="col-md-3 pl-0">
          <SideBarBooks
            setCurrentFolderId={setFolderIdHandler}
            searchItem={searchItem}
            allBooks={allBooks}
            filteredBooks={filteredFolder}
            bookId={currentFolderId}
          />
          <DefaultSideBar setDefaultFolderId={setDefaultFolderId} />
        </div>
        <div className={defaultPageEditMode ? "col-md-9" : "col-md-6"}>
          {currentLookup && defaultPageEditMode ? (
            <LoadLookup
              data={currentLookup}
              currentImageId={imageId}
              history={history}
              pendingFolderId={1}
              pageData={lookupPageState}
              pageLookUpHandler={pageLookUpHandler}
              isMemberShip={isPrimerUser}
              isRedirectLast={true}
              pageLookUpDateHandler={pageLookUpDateHandler}
              isDisabled={sharedWithMe == "SHARED" ? true : false}
              startLoader={setShowLoader}
              setResponseMgs={setResponseMgs}
              setShowPop={setShowPop}
            ></LoadLookup>
          ) : (
            currentLookup && (
              <DefaultPageData
                data={currentLookup}
                currentImageId={imageId}
                history={history}
                pendingFolderId={1}
                pageData={lookupPageState}
                pageLookUpHandler={pageLookUpHandler}
                isMemberShip={isPrimerUser}
                isRedirectLast={true}
                pageLookUpDateHandler={pageLookUpDateHandler}
                isDisabled={sharedWithMe == "SHARED" ? true : false}
                startLoader={setShowLoader}
                setResponseMgs={setResponseMgs}
                setShowPop={setShowPop}
              ></DefaultPageData>
            )
          )}

          {/* {DefaultPageData == "SHARED" && (
            <ImageSlider
              current={match.params.id}
              history={history}
              setImageId={setImageId}
              images={allImages}
            ></ImageSlider>
          )} */}
        </div>
        {!defaultPageEditMode && (
          <div className="col-md-3 bg-sideBar">
            <RightSharedPeopleList
              isSharedFolder={sharedWithMe === "SHARED" ? true : false}
              pageId={imageId}
              bookId={match.params.folderId}
            />
          </div>
        )}
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
export default connect(
  mapStateToPros,
  mapDispatchToProps
)(DisplayOriginalImage);
//export default DisplayOriginalImage ;
