import React from "react";
import CreateFolder from "../create-folder/create-folder.component";
import TestButton from "../create-folder/create.btn.component";
import GetLoader from "../../ui/loder";
import "./create-image.style.scss";

const DisplayImages = ({
  images,
  folderId,
  isLoading,
  onLeave,
  onHove,
  history,
}) => {
  if (isLoading) {
    return (
      <div className="loader-display">
        <GetLoader />
      </div>
    );
  } else {
    return (
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {images.map((item, index) => (
          <div className="image-container" key={index}>
            <img
              src={item.align_image_thumb}
              onClick={() => history.push(`/original/${item.id}/${folderId}`)}
              onMouseEnter={() =>
                onHove(
                  item.pageNumber,
                  item.description,
                  item.ff_local_datetime
                )
              }
              onMouseLeave={() => onLeave(false)}
            ></img>
          </div>
        ))}
      </div>
    );
  }
};
export default DisplayImages;