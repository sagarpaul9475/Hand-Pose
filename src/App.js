import React, { useRef, useState, useEffect } from "react";
import "./App.css";
import * as handpose from "@tensorflow-models/handpose";
import * as fp from "fingerpose";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";

// Load gesture descriptions
import { ThumbsUpGesture } from "./gestures/ThumbsUp";
import { VictoryGesture } from "./gestures/Victory";

// Load utility to draw hand
import { drawHand } from "./utilities";

// Image assets
import thumbs_up_img from "./assets/thumbs_up.png";
import victory_img from "./assets/victory.png";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [gestureName, setGestureName] = useState("No gesture yet");
  const [emoji, setEmoji] = useState(null);

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("Handpose model loaded.");

    setInterval(() => {
      detect(net);
    }, 200);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const hand = await net.estimateHands(video);

      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, videoWidth, videoHeight); // clear before drawing
      drawHand(hand, ctx); // ✅ draw hand on canvas

      if (hand.length > 0) {
        const GE = new fp.GestureEstimator([
          ThumbsUpGesture,
          VictoryGesture,
        ]);
        const estimatedGestures = await GE.estimate(hand[0].landmarks, 7.5);

        if (
          estimatedGestures.gestures !== undefined &&
          estimatedGestures.gestures.length > 0
        ) {
          const confidence = estimatedGestures.gestures.map(
            (prediction) => prediction.score
          );
          const maxConfidence = confidence.indexOf(Math.max(...confidence));
          const gesture = estimatedGestures.gestures[maxConfidence].name;

          setGestureName(gesture);
          if (gesture === "thumbs_up") {
            setEmoji(thumbs_up_img);
          } else if (gesture === "victory") {
            setEmoji(victory_img);
          }
        }
      } else {
        setGestureName("No gesture yet");
        setEmoji(null);
      }
    }
  };

  useEffect(() => {
    runHandpose();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
        {emoji && (
          <img
            src={emoji}
            alt="Gesture"
            style={{
              position: "absolute",
              top: 20,
              left: "50%",
              transform: "translateX(-50%)",
              height: 100,
              zIndex: 10,
            }}
          />
        )}
        <p
          style={{
            position: "absolute",
            bottom: 20,
            fontSize: 24,
            fontWeight: "bold",
          }}
        >
          Detected Gesture: {gestureName}
        </p>
      </header>
    </div>
  );
}

export default App;
