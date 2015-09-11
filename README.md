xBRjs
=====

JS implementation of the xBR image scaling algorytm by Hyllian.

How to use
----------

* 2x, 3x and 4x modes
* Option to disabling alpha blending
* Option to use the original implementation of the 3x mode

Usage: 
```javascript
var resultCanvas = applyXBR(image, 2);
```
The first parameter is a loaded image, and the second is the scaling factor (2, 3 or 4).
A canvas with the scaled image will be returned.

Demo
----

Check it out [here](http://joseprio.github.io/xBRjs/ide.html).
