/* eslint-disable no-undef */

import { useState } from 'react';
import img from './assets/images.js'
function App() {
  let model = undefined;


  (async () => {
    let loadedModel = await cocoSsd.load()
    model = loadedModel
  })()

  // Check if user has a working webcam
  const checkWebCam = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
  };

  // Turns webcam on
  const enableCam = async (event) => {

    if (!model) return;

    try {
      let video = document.getElementById('webcam');
      let stream = await navigator.mediaDevices.getUserMedia({video:true})
      video.srcObject = stream
    }
    catch(err) { console.log('error in webcam') }
  };

  let children = []

  const predictWebcam = () => {
    let video = document.getElementById('webcam');
    let liveView = document.getElementById('liveView');
    console.log('what are tou video', video)
    // Now let's start classifying a frame in the stream.
    // Model.detect's output is the object
    model.detect(video).then(function (predictions) {
      // Remove any highlighting we did previous frame.
      for (let i = 0; i < children.length; i++) {
        liveView.removeChild(children[i]);
      }
      children.splice(0);

      // Now lets loop through predictions and draw them to the live view if
      // they have a high confidence score.
      for (let n = 0; n < predictions.length; n++) {
        // If we are over 66% sure we are sure we classified it right, draw it!
        if (predictions[n].score > 0.66) {
          const p = document.createElement('p');
          p.innerText = predictions[n].class  + ' - with '
              + Math.round(parseFloat(predictions[n].score) * 100)
              + '% confidence.';
          p.style = 'margin-left: ' + predictions[n].bbox[0] + 'px; margin-top: '
              + (predictions[n].bbox[1] - 10) + 'px; width: '
              + (predictions[n].bbox[2] - 10) + 'px; top: 0; left: 0;';

          const highlighter = document.createElement('div');
          highlighter.setAttribute('class', 'highlighter');
          highlighter.style = 'left: ' + predictions[n].bbox[0] + 'px; top: '
              + predictions[n].bbox[1] + 'px; width: '
              + predictions[n].bbox[2] + 'px; height: '
              + predictions[n].bbox[3] + 'px;';

          liveView.appendChild(highlighter);
          liveView.appendChild(p);
          children.push(highlighter);
          children.push(p);
        }
      }

      // Call this function again to keep predicting when the browser is ready.
      window.requestAnimationFrame(predictWebcam);
    });
  }

  const handleClick = (event) => {
    if (checkWebCam()) {
      enableCam()
    } else {
      console.log('No WebCam available')
    }
  };

  return (
    <div className= "app">
      Hello World
      <button onClick = {handleClick}>
        Enable Camera
      </button>

      <div id= "liveView" className= "camView">
        <video
        id ="webcam"
        autoPlay muted
        width="640"
        height="480"
        onLoadedData={predictWebcam}
        >
      </video>
      </div>
    </div>
  );
}

export default App;












// const handleClick = async () => {
//   let intel = document.getElementById('img')

//   // eslint-disable-next-line no-undef
//   let model = await cocoSsd.load();

//   let predictions = await model.detect(intel)

//   console.log('predicitons', predictions)


// };
