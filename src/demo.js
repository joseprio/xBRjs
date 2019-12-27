import {applyXBR} from './index.js';

function readURL(input) {
  if (input.files && input.files[0]) {
    let reader = new FileReader();
    reader.onload = function(e) {
      processURL(e.target.result);
    }

    reader.readAsDataURL(input.files[0]);
  }
}

function processURL(url) {
  let image = new Image();
  image.src=url;

  /*When image loads...*/
  image.onload =  function(e) {
    image.setAttribute('width', image.width);
    image.setAttribute('height', image.height);
    /*Apply 2xBR*/
    let resultCanvas = applyXBR(image, 2);

    document.body.appendChild(resultCanvas);
    resultCanvas = applyXBR(image, 3);

    document.body.appendChild(resultCanvas);
    resultCanvas = applyXBR(image, 4);

    document.body.appendChild(resultCanvas);
  }

  document.body.appendChild(image);
}

window.onload = function() {
  var inputFile = document.getElementById('processImage');
  inputFile.addEventListener('change', () => readURL(inputFile));

  let original = document.getElementById("original");
  processURL("image.png");
}

