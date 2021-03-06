import React from "react";
import Webcam from "react-webcam";
import { Post, Get } from "../../service/service.setup";
import CustomLoader from "../loader/loader";
const videoConstraints = {
  width: 720,
  height: 720,
  facingMode: "user",
};

function converBase64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || "";
  sliceSize = sliceSize || 512;

  var b64DataString = b64Data.substr(b64Data.indexOf(",") + 1);
  var byteCharacters = atob(b64DataString);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {
    type: contentType,
  });
  return blob;
}
function blobToFile(theBlob, fileName) {
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}
const WebcamCapture = ({ id, imgSrc, setImgSrc }) => {
  const webcamRef = React.useRef(null);
  const [file, setFile] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();

    setFile(blobToFile(converBase64toBlob(imageSrc, "image/jpeg"), "test.png"));

    setImgSrc([imageSrc, ...imgSrc]);
  }, [webcamRef, setImgSrc, imgSrc]);
  const upload = async () => {
    new File([file], "name.png");
    const formData = new FormData();
    var d = new Date();
    let imageName = d.getTime();
    imageName = `jpg_${imageName}.jpg`;
    formData.append("files", new File([file], imageName));

    try {
      setIsLoading(true);
      let res = await Post("/uploadImage", formData, {
        headers: {
          fileId: id,
          "Content-Type": "multipart/form-data",
        },
      });
      alert(res.data.message);
      setIsLoading(false);
      window.location.reload();
    } catch (err) {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <div>
        {isLoading && <CustomLoader />}
        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
        <button className="btn-success btn" onClick={capture}>
          Capture photo
        </button>

        {file ? (
          <button className="btn-primary btn ml-4" onClick={upload}>
            Upload
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default WebcamCapture;
