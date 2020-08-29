import React from "react";
import { ReactComponent as Next } from "../../assets/next.svg";
import { ReactComponent as Back } from "../../assets/back.svg";
import UploadForm from "../upload-image/upload-images";
import { Post, Get } from "../../service/service.setup";
const PendingHeader = ({
  prev,
  next,
  pendingFolderId,
  currentImageId,
  all,
  saveHandler,
  ...props
}) => {
  const uploadImageHandler = async (e) => {
    //  e.preventDefault();
    props.toggleLoader(true)
    const formData = new FormData();
    var d = new Date();
    let imageName = d.getTime();
    imageName = `jpg_${imageName}.jpg`;

    formData.append("files", e, imageName);
    try {
      let res = await Post("/reUploadImage", formData, {
        headers: {
          fileId: pendingFolderId,
          imageId: currentImageId,
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status == 200) {
        props.resMgs(res.data.message);
        props.setShowPop(true)
        props.toggleLoader(false)
        window.location.reload();
      } else {
        alert("Something went wrong try later");
      }
    } catch (err) {
    
    }
  };
  return (
    <main className="">
      <div className ="row">
      <div className ="col-md-2" style= {{background:"rgba(0, 0, 0, 0.125)"}}></div>
      <div className ="col-md-10 main">
     
      <div>
        <UploadForm submitHandler={uploadImageHandler}></UploadForm>
      </div>
      <div>
        <button onClick ={()=>saveHandler()}>Save</button>
      </div>
      <div>
        <span className="info"> Total Pending </span>
        <span className="badge badge-info">{all.length}</span>
      </div>
      <div>
        <span className="info">Current</span>
        <span className="badge badge-info">
          {all.indexOf(currentImageId) + 1}
        </span>
      </div>
      <div>
        <Back className="header-svg" onClick={prev} />
      </div>
      <div>
        <Next className="header-svg" onClick={next} />
      </div>
      </div>
      </div>
    </main>
  );
};

export default PendingHeader;
