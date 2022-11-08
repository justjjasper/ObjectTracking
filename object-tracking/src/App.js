
function App() {
  let img = <img
  crossOrigin='anonymous'
  id = 'img'
  src='https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?cs=srgb&dl=pexels-pixabay-45201.jpg&fm=jpg'/>



  // console.log('does this work', cocoSsd.load().then(model => model.detect(img).then(predictions => {
  //   console.log('predict', predictions)
  // })))
  const handleClick = async () => {
    let intel = document.getElementById('img')

           // eslint-disable-next-line no-undef
    let model = await cocoSsd.load();

    let predictions = await model.detect(intel)

    console.log('predicitons', predictions)


  };

  return (
    <div className= "app">
      Hello World
      <button onClick = {handleClick}>
        Identify Object
      </button>
      {img}
    </div>
  );
}

export default App;
