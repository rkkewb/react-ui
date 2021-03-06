import React, { useState } from "react";
import CreateFolder from "../create-folder/create-folder.component";
import TestButton from "../create-folder/create.btn.component";
import GetLoader from "../../ui/loder";
import { ReactComponent as Tick } from "../../assets/tick.svg";
import "./create-image.style.scss";

const DisplayImages = ({
  images,
  folderId,

  onLeave,
  history,
  updateHandler,
  filteredImages,
  searchInput,
  isShowLoader,
  isSharedFolder,
}) => {
  const [isEditShow, setIsEditShow] = useState(false);
  const [imagesList, setImagesList] = useState([]);

  let localRender = searchInput == "" ? images : filteredImages;
  if (!isShowLoader && images.length === 0) {
    return (
      <div className="col-md-12 loader-display mt-4">
        <h5 className="mt-4"> This book is empty</h5>
      </div>
    );
  } else {
    const toggleEl = (id, e) => {
      //const toggleValue = !displayClass;
      // setDisplayClass(toggleValue);
      if (!e.target.parentElement.parentElement.classList.contains("bold")) {
        e.target.parentElement.parentElement.classList = "bold tick";
        e.target.parentElement.parentElement.nextElementSibling.classList =
          "editIcon active-cus";
        //  images.filter(item=>item.id = id)
        const newArr = imagesList.concat(
          images.filter((item) => item.id == id)
        );
        setImagesList(newArr);
        updateHandler(newArr);
      } else {
        e.target.parentElement.parentElement.classList = "tick";
        const removed = imagesList.filter((item) => item.id != id);
        setImagesList(removed);
        updateHandler(removed);
        e.target.parentElement.parentElement.nextElementSibling.classList =
          "editIcon";
      }
      // selectedFolderCount(id, toggleValue);
    };

    return (
      <div
        onMouseEnter={() => setIsEditShow()}
        onMouseLeave={() => setIsEditShow(false)}
        style={{ display: "flex", flexWrap: "wrap" }}
      >
        {localRender.map(
          (item, index) =>
            !item.is_comment && (
              <div className="image-top-container" key={item.id}>
                <div
                  className="image-container"
                  onMouseLeave={() => onLeave(false)}
                  key={index}
                >
                  <div className="editIcon"></div>
                  <img
                    style={{ height: "96%" }}
                    src={require("../../assets/spiral.png")}
                  ></img>
                  <img
                    className="image-display"
                    src={item.raw_image_org}
                    onClick={() =>
                      history.push(`/original/${item.id}/${folderId}`)
                    }
                  ></img>
                </div>
                {item.title && (
                  <span className="img-title">
                    {item.title}
                    {item.pageNumber ? `(${item.pageNumber})` : ""}(
                    {grtDate(item.updatedTimeMillisecond)})
                  </span>
                )}
              </div>
            )
        )}
      </div>
    );
  }
};
function grtDate(time) {
  var date = new Date(time);
  return date.toLocaleDateString();
}
export default DisplayImages;
