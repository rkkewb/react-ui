import React, { useEffect, useState } from "react";
import TestButton from "../create-folder/create.btn.component";
import GetLoader from "../../ui/loder";
import { Post, Get } from "../../service/service.setup";
//import './create-image.style.scss' ;
import { ReactComponent as Cross } from "../../assets/edit.svg";

const SelectPoints = ({ match, history }) => {
  var Markers = new Array();
  var [points, setPoints] = useState(0);
  var [reset, setReset] = useState([]);
  var [src, setSrc] = useState("");

  useEffect(() => {
    var mapSprite = new Image();
    Post("/getAnyCloudImages", {
      ids: [match.params.url],
      imagetype: "raw_small",
    }).then((res) => {
      if (res.data.code == 201) {
        alert(res.data.error);
        history.push("/logout");
      }
      mapSprite.src = res.data.imageInput[0].raw_image_small;
      var img = new Image();
      img.src = mapSprite.src;
      setSrc(res.data.imageInput[0].raw_image_small);
    });

    // mapSprite.src ='https://mydiginotes.s3.ap-south-1.amazonaws.com/data/518/751/align_img_jpg_1590134938540_jpg.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200604T090034Z&X-Amz-SignedHeaders=host&X-Amz-Expires=160&X-Amz-Credential=AKIAQ2W5L2TKVNFH6CZY%2F20200604%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=03f41d0450c01589fb55cffa6d4163eb185b1524950905454eba62f4261323a6';
    var canvas = document.getElementById("Canvas");
    var context = canvas.getContext("2d");
    // Map sprite
    // Create a basic class which will be used to create a marker
    var Marker = function () {
      this.Sprite = new Image();
      this.Sprite.src =
        "http://www.clker.com/cliparts/w/O/e/P/x/i/map-marker-hi.png";
      this.Width = 12;
      this.Height = 20;
      this.XPos = 0;
      this.YPos = 0;
    };

    // Array of markers

    // When the user clicks their mouse on our canvas run this code
    var mouseClicked = function (mouse) {
      // Get corrent mouse coords
      var rect = canvas.getBoundingClientRect();
      var mouseXPos = mouse.x - rect.left;
      var mouseYPos = mouse.y - rect.top;

      // Move the marker when placed to a better location
      var marker = new Marker();
      marker.XPos = Math.floor(mouseXPos - marker.Width / 2);
      marker.YPos = Math.floor(mouseYPos - marker.Height);

      // Push our new marker to our Markers array
      //alert((Markers.indexOf(marker)));

      let isExist = false;
      Markers.forEach((item) => {
        if (item.XPos == marker.XPos && item.YPos == marker.YPos) {
          Markers.pop(item);
          isExist = true;
        }
      });
      if (Markers.length >= 4) {
        alert("Max Four Point Allowed on a image");
        return;
      }

      if (!isExist) Markers.push(marker);

      setPoints(Markers.length);
      if (Markers.length == 4);
      setReset([Markers]);
    };

    // Add mouse click event listener to canvas
    canvas.addEventListener("mousedown", mouseClicked, false);

    // Run this once so we setup text rendering
    var firstLoad = function () {
      context.font = "15px Georgia";
      context.textAlign = "center";
    };

    firstLoad();

    // This will be called 60 times a second, look at the code at the bottom `setInterval`
    var main = function () {
      // Update our canvas
      draw();
    };

    var draw = function () {
      // Clear Canvas
      context.fillStyle = "#000";
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Draw map
      // Sprite, X location, Y location, Image width, Image height
      // You can leave the image height and width off, if you do it will draw the image at default size
      context.drawImage(mapSprite, 0, 0, 700, 700);

      // Draw markers

      for (var i = 0; i < Markers.length; i++) {
        var tempMarker = Markers[i];
        // Draw marker
        context.drawImage(
          tempMarker.Sprite,
          tempMarker.XPos,
          tempMarker.YPos,
          tempMarker.Width,
          tempMarker.Height
        );

        // Calculate position text
        var markerText =
          "Postion (X:" +
          Math.floor(tempMarker.XPos) +
          ", Y:" +
          Math.floor(tempMarker.YPos) +
          ")";

        // Draw a simple box so you can see the position
        var textMeasurements = context.measureText(markerText);
        context.fillStyle = "#666";
        context.globalAlpha = 0.7;
        context.fillRect(
          tempMarker.XPos - textMeasurements.width / 2,
          tempMarker.YPos - 15,
          textMeasurements.width,
          20
        );
        context.globalAlpha = 1;

        // Draw position above
        context.fillStyle = "#000";
        const IMG = document.getElementById("img");
     

        context.fillText(markerText, tempMarker.XPos, tempMarker.YPos);
      }
    };
    setInterval(main, 1000 / 60);
  }, []);
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
  const updatePoints = async () => {
    const data = {};
    const allPoints = new Array();
    reset[0].forEach((reset, i) => {
      allPoints.push({ X: reset.XPos, Y: reset.YPos });
    });
    let small = allPoints[0];
    let topRight = allPoints[0];
    let bottomRight = allPoints[0];
    let bottomLeft = allPoints[0];
    allPoints.forEach((item) => {
      if (item.X < small.X && item.Y < small.Y) small = item;

      if (item.X > small.X && item.Y < small.Y) topRight = item;
      if (item.X > small.X && item.Y > small.Y) bottomRight = item;
      if (item.Y > small.Y && item.X < small.X) bottomLeft = item;
    });

    const IMG = document.getElementById("img");
    const width = IMG.width / 700;
    const height = IMG.height / 700;

    const requestPayLoad = {};
    requestPayLoad["id"] = match.params.url;
    requestPayLoad["bottomleftx"] = ((bottomLeft.X * width) / IMG.width) * 100;
    requestPayLoad["bottomlefty"] =
      ((bottomLeft.Y * height) / IMG.height) * 100;
    requestPayLoad["bottomrightx"] =
      ((bottomRight.X * width) / IMG.width) * 100;
    requestPayLoad["bottomrighty"] =
      ((bottomRight.Y * height) / IMG.height) * 100;
    requestPayLoad["topleftx"] = ((small.X * width) / IMG.width) * 100;
    requestPayLoad["toplefty"] = ((small.Y * height) / IMG.height) * 100;
    requestPayLoad["toprightx"] = ((topRight.X * width) / IMG.width) * 100;
    requestPayLoad["toprighty"] = ((topRight.Y * height) / IMG.height) * 100;

    try {
      let res = await Post("/uploadSingleImagePoints", requestPayLoad);

      alert(res.data.message);
      history.goBack();
    } catch (err) {
    }
  };
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      <canvas id="Canvas" width="700" height="700"></canvas>
      <div>
        <button
          onClick={updatePoints}
          disabled={points == 4 ? false : true}
          className="save-points btn btn-success ml-4 mt-2"
        >
          Save Points
        </button>
        <button
          onClick={() => window.location.reload()}
          className="save-points btn btn-info ml-2 mt-2"
        >
          Clear All Points
        </button>
      </div>
      <div style={{ display: "none" }}>
        <img id="img" src={src}></img>
      </div>
    </div>
  );
};

export default SelectPoints;
