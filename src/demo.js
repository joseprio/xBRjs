import {xbr2x, xbr3x, xbr4x} from './index.js';

function readURL(input) {
  if (input.files && input.files[0]) {
    let reader = new FileReader();
    reader.onload = function(e) {
      processURL(e.target.result);
    }

    reader.readAsDataURL(input.files[0]);
  }
}

export function applyXBR(image, factor) {
  const canvas = document.createElement('canvas');
  const
    sourceWidth = image.width,
    sourceHeight = image.height;
  canvas.width = sourceWidth;
  canvas.height = sourceHeight;

  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);

  const
    scaledWidth = sourceWidth * factor,
    scaledHeight = sourceHeight * factor,
    originalImageData = context.getImageData(
      0,
      0,
      sourceWidth,
      sourceHeight);

  const originalPixelView = new Uint32Array(originalImageData.data.buffer);

  let scaledPixelView;
  switch (factor) {
	  case 2:
		scaledPixelView = xbr2x(originalPixelView, sourceWidth, sourceHeight);
		break;
	  case 3:
		scaledPixelView = xbr3x(originalPixelView, sourceWidth, sourceHeight);
		break;
	  case 4:
		scaledPixelView = xbr4x(originalPixelView, sourceWidth, sourceHeight);
		break;
  }
  
  const scaledImageData = new ImageData(new Uint8ClampedArray(scaledPixelView.buffer), scaledWidth, scaledHeight);
  canvas.width = scaledWidth;
  canvas.height = scaledHeight;

  context.putImageData(scaledImageData, 0, 0);

  return canvas;
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

