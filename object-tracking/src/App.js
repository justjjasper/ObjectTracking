import { useState } from 'react';
import img from './assets/images.js'
function App() {

  let model = true;
  const checkWebCam = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
  };

  const enableCam = (event) => {
    if (!model) return;

    let video = document.getElementById('camView')
    const constraints = {
      video: true
    };

    navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
      console.log('inside navigaor', stream)
      video.srcObject = stream
    })
    .catch(err => console.log('error in webcam'))
  };

  const handleClick = (event) => {
    if (checkWebCam()) {
      enableCam()
    } else {
      console.log('No WebCam available')
    }
  };

  const predictWebCam = () => {
    console.log('yes')
  }

  return (
    <div className= "app">
      Hello World
      <button onClick = {handleClick}>
        Identify Object
      </button>

      <video
      id ="camView"
      autoPlay muted
      width="640"
      height="480"
      onLoadedData={predictWebCam}
      >
    </video>
      {img}
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
