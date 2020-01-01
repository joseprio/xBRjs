# xBRjs

[![NPM Version](https://img.shields.io/npm/v/xbr-js.svg)](https://www.npmjs.com/package/xbr-js)

JS implementation of the xBR image scaling algorytm by Hyllian.

## Installation

```sh
# npm
npm install xbr-js --save

# yarn
yarn add xbr-js
```

## Usage

```js
import {xbr2x, xbr3x, xbr4x} from 'xbr-js';

...

const
  scaledWidth = sourceWidth * 2,
  scaledHeight = sourceHeight * 2,
  originalImageData = context.getImageData(
    0,
    0,
    sourceWidth,
    sourceHeight);

const originalPixelView = new Uint32Array(originalImageData.data.buffer);

const scaledPixelView = xbr2x(originalPixelView, sourceWidth, sourceHeight);

const scaledImageData = new ImageData(new Uint8ClampedArray(scaledPixelView.buffer), scaledWidth, scaledHeight);
canvas.width = scaledWidth;
canvas.height = scaledHeight;

context.putImageData(scaledImageData, 0, 0);
```


## API

### xbr2x([array], [width], [height], [options]) ⇒ `Uint32Array`
Returns a typed array with the pixels that form the scaled image.

| Param | Type | Description |
|-------|------|-------------|
| array | Uint32Array | The input pixels in ARGB format |
| width | number | The width of the original image |
| height | number | The height of the original image |
| [options.blendColors] | boolean | Determines if new colors will be created. Defaults to true. |
| [options.scaleAlpha] | boolean | Determines whether to upscale the alpha channel using the xBR algorythm. Defaults to false. |

## Demo

Check it out [here](http://joseprio.github.io/xBRjs/demo/demo.html).
