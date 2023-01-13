/* eslint-disable no-undef */
import { useState } from 'react';
import styles from './input.css'

function App() {
  const [disabled, setDisabled] = useState('true')
  let children = []
  let model = undefined;

  // Load the models from the cocoSsd module
  (async () => {
    let loadedModel = await cocoSsd.load()
    model = loadedModel

    if (model) {
      setDisabled('')
    }
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

  const predictWebcam = () => {
    let video = document.getElementById('webcam');
    let liveView = document.getElementById('liveView');

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
              console.log('what is bbox', predictions)
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
    <div id= "app" className="bg bg-pink-500 ">

      <section id="text">
      <h2> Object Identification </h2>
      <span> Wait for the button to load and then click on it.</span>
      <span> Hold an object in front of your webcam and that item will be identified! </span>


      <button
        className="text-decoration-line: line-through bg-amber-700"
        onClick = {handleClick}
        disabled = {disabled}>
        Enable Camera
      </button>
      </section>


      <section id= "liveView" className= "camView">
        <video
        id ="webcam"
        autoPlay muted
        width="640"
        height="480"
        onLoadedData={predictWebcam}>
      </video>
      </section>

    </div>
  );
}

export default App;