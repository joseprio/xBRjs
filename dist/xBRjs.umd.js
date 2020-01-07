(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["xBRjs"] = factory();
	else
		root["xBRjs"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xbr2x", function() { return xbr2x; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xbr3x", function() { return xbr3x; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xbr4x", function() { return xbr4x; });
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Options
var USE_3X_ORIGINAL_IMPLEMENTATION = false;
var REDMASK = 0x000000FF,
    // &MASK	>>0
GREENMASK = 0x0000FF00,
    // &MASK	>>8
BLUEMASK = 0x00FF0000,
    // &MASK	>>16
ALPHAMASK = 0xFF000000,
    // &MASK	>>24
THRESHHOLD_Y = 48,
    THRESHHOLD_U = 7,
    THRESHHOLD_V = 6; // Convert an ARGB byte to YUV

function getYuv(p) {
  var r = p & REDMASK,
      g = (p & GREENMASK) >> 8,
      b = (p & BLUEMASK) >> 16,
      y = r * .299000 + g * .587000 + b * .114000,
      u = r * -.168736 + g * -.331264 + b * .500000,
      v = r * .500000 + g * -.418688 + b * -.081312;
  return [y, u, v];
}

function yuvDifference(A, B, scaleAlpha) {
  var alphaA = (A & ALPHAMASK) >> 24 & 0xff,
      alphaB = (B & ALPHAMASK) >> 24 & 0xff;

  if (alphaA === 0 && alphaB === 0) {
    return 0;
  }

  if (!scaleAlpha && (alphaA < 255 || alphaB < 255)) {
    // Very large value not attainable by the thresholds
    return 1000000;
  }

  if (alphaA === 0 || alphaB === 0) {
    // Very large value not attainable by the thresholds
    return 1000000;
  }

  var yuvA = getYuv(A),
      yuvB = getYuv(B);
  /*Add HQx filters threshold & return*/

  return Math.abs(yuvA[0] - yuvB[0]) * THRESHHOLD_Y + Math.abs(yuvA[1] - yuvB[1]) * THRESHHOLD_U + Math.abs(yuvA[2] - yuvB[2]) * THRESHHOLD_V;
}

function isEqual(A, B, scaleAlpha) {
  var alphaA = (A & ALPHAMASK) >> 24 & 0xff,
      alphaB = (B & ALPHAMASK) >> 24 & 0xff;

  if (alphaA === 0 && alphaB === 0) {
    return true;
  }

  if (!scaleAlpha && (alphaA < 255 || alphaB < 255)) {
    return false;
  }

  if (alphaA === 0 || alphaB === 0) {
    return false;
  }

  var yuvA = getYuv(A),
      yuvB = getYuv(B);

  if (Math.abs(yuvA[0] - yuvB[0]) > THRESHHOLD_Y) {
    return false;
  }

  if (Math.abs(yuvA[1] - yuvB[1]) > THRESHHOLD_U) {
    return false;
  }

  if (Math.abs(yuvA[2] - yuvB[2]) > THRESHHOLD_V) {
    return false;
  }

  return true;
}

function pixelInterpolate(A, B, q1, q2) {
  var alphaA = (A & ALPHAMASK) >> 24 & 0xff,
      alphaB = (B & ALPHAMASK) >> 24 & 0xff;
  /*Extract each value from 32bit Uint & blend colors together*/

  var r, g, b, a;

  if (alphaA === 0) {
    r = B & REDMASK;
    g = (B & GREENMASK) >> 8;
    b = (B & BLUEMASK) >> 16;
  } else if (alphaB === 0) {
    r = A & REDMASK;
    g = (A & GREENMASK) >> 8;
    b = (A & BLUEMASK) >> 16;
  } else {
    r = (q2 * (B & REDMASK) + q1 * (A & REDMASK)) / (q1 + q2);
    g = (q2 * ((B & GREENMASK) >> 8) + q1 * ((A & GREENMASK) >> 8)) / (q1 + q2);
    b = (q2 * ((B & BLUEMASK) >> 16) + q1 * ((A & BLUEMASK) >> 16)) / (q1 + q2);
  }

  a = (q2 * alphaB + q1 * alphaA) / (q1 + q2);
  /*The bit hack '~~' is used to floor the values like Math.floor, but faster*/

  return ~~r | ~~g << 8 | ~~b << 16 | ~~a << 24;
}

function getRelatedPoints(oriPixelView, oriX, oriY, oriW, oriH) {
  var xm1 = oriX - 1;

  if (xm1 < 0) {
    xm1 = 0;
  }

  var xm2 = oriX - 2;

  if (xm2 < 0) {
    xm2 = 0;
  }

  var xp1 = oriX + 1;

  if (xp1 >= oriW) {
    xp1 = oriW - 1;
  }

  var xp2 = oriX + 2;

  if (xp2 >= oriW) {
    xp2 = oriW - 1;
  }

  var ym1 = oriY - 1;

  if (ym1 < 0) {
    ym1 = 0;
  }

  var ym2 = oriY - 2;

  if (ym2 < 0) {
    ym2 = 0;
  }

  var yp1 = oriY + 1;

  if (yp1 >= oriH) {
    yp1 = oriH - 1;
  }

  var yp2 = oriY + 2;

  if (yp2 >= oriH) {
    yp2 = oriH - 1;
  }

  return [oriPixelView[xm1 + ym2 * oriW],
  /* a1 */
  oriPixelView[oriX + ym2 * oriW],
  /* b1 */
  oriPixelView[xp1 + ym2 * oriW],
  /* c1 */
  oriPixelView[xm2 + ym1 * oriW],
  /* a0 */
  oriPixelView[xm1 + ym1 * oriW],
  /* pa */
  oriPixelView[oriX + ym1 * oriW],
  /* pb */
  oriPixelView[xp1 + ym1 * oriW],
  /* pc */
  oriPixelView[xp2 + ym1 * oriW],
  /* c4 */
  oriPixelView[xm2 + oriY * oriW],
  /* d0 */
  oriPixelView[xm1 + oriY * oriW],
  /* pd */
  oriPixelView[oriX + oriY * oriW],
  /* pe */
  oriPixelView[xp1 + oriY * oriW],
  /* pf */
  oriPixelView[xp2 + oriY * oriW],
  /* f4 */
  oriPixelView[xm2 + yp1 * oriW],
  /* g0 */
  oriPixelView[xm1 + yp1 * oriW],
  /* pg */
  oriPixelView[oriX + yp1 * oriW],
  /* ph */
  oriPixelView[xp1 + yp1 * oriW],
  /* pi */
  oriPixelView[xp2 + yp1 * oriW],
  /* i4 */
  oriPixelView[xm1 + yp2 * oriW],
  /* g5 */
  oriPixelView[oriX + yp2 * oriW],
  /* h5 */
  oriPixelView[xp1 + yp2 * oriW]
  /* i5 */
  ];
} // This is the XBR2x by Hyllian (see http://board.byuu.org/viewtopic.php?f=10&t=2248)


function computeXbr2x(oriPixelView, oriX, oriY, oriW, oriH, dstPixelView, dstX, dstY, dstW, blendColors, scaleAlpha) {
  var relatedPoints = getRelatedPoints(oriPixelView, oriX, oriY, oriW, oriH);

  var _relatedPoints = _slicedToArray(relatedPoints, 21),
      a1 = _relatedPoints[0],
      b1 = _relatedPoints[1],
      c1 = _relatedPoints[2],
      a0 = _relatedPoints[3],
      pa = _relatedPoints[4],
      pb = _relatedPoints[5],
      pc = _relatedPoints[6],
      c4 = _relatedPoints[7],
      d0 = _relatedPoints[8],
      pd = _relatedPoints[9],
      pe = _relatedPoints[10],
      pf = _relatedPoints[11],
      f4 = _relatedPoints[12],
      g0 = _relatedPoints[13],
      pg = _relatedPoints[14],
      ph = _relatedPoints[15],
      pi = _relatedPoints[16],
      i4 = _relatedPoints[17],
      g5 = _relatedPoints[18],
      h5 = _relatedPoints[19],
      i5 = _relatedPoints[20];

  var e0, e1, e2, e3;
  e0 = e1 = e2 = e3 = pe;

  var _kernel2Xv = kernel2Xv5(pe, pi, ph, pf, pg, pc, pd, pb, f4, i4, h5, i5, e1, e2, e3, blendColors, scaleAlpha);

  var _kernel2Xv2 = _slicedToArray(_kernel2Xv, 3);

  e1 = _kernel2Xv2[0];
  e2 = _kernel2Xv2[1];
  e3 = _kernel2Xv2[2];

  var _kernel2Xv3 = kernel2Xv5(pe, pc, pf, pb, pi, pa, ph, pd, b1, c1, f4, c4, e0, e3, e1, blendColors, scaleAlpha);

  var _kernel2Xv4 = _slicedToArray(_kernel2Xv3, 3);

  e0 = _kernel2Xv4[0];
  e3 = _kernel2Xv4[1];
  e1 = _kernel2Xv4[2];

  var _kernel2Xv5 = kernel2Xv5(pe, pa, pb, pd, pc, pg, pf, ph, d0, a0, b1, a1, e2, e1, e0, blendColors, scaleAlpha);

  var _kernel2Xv6 = _slicedToArray(_kernel2Xv5, 3);

  e2 = _kernel2Xv6[0];
  e1 = _kernel2Xv6[1];
  e0 = _kernel2Xv6[2];

  var _kernel2Xv7 = kernel2Xv5(pe, pg, pd, ph, pa, pi, pb, pf, h5, g5, d0, g0, e3, e0, e2, blendColors, scaleAlpha);

  var _kernel2Xv8 = _slicedToArray(_kernel2Xv7, 3);

  e3 = _kernel2Xv8[0];
  e0 = _kernel2Xv8[1];
  e2 = _kernel2Xv8[2];
  dstPixelView[dstX + dstY * dstW] = e0;
  dstPixelView[dstX + 1 + dstY * dstW] = e1;
  dstPixelView[dstX + (dstY + 1) * dstW] = e2;
  dstPixelView[dstX + 1 + (dstY + 1) * dstW] = e3;
}

function computeXbr3x(oriPixelView, oriX, oriY, oriW, oriH, dstPixelView, dstX, dstY, dstW, blendColors, scaleAlpha) {
  var relatedPoints = getRelatedPoints(oriPixelView, oriX, oriY, oriW, oriH);

  var _relatedPoints2 = _slicedToArray(relatedPoints, 21),
      a1 = _relatedPoints2[0],
      b1 = _relatedPoints2[1],
      c1 = _relatedPoints2[2],
      a0 = _relatedPoints2[3],
      pa = _relatedPoints2[4],
      pb = _relatedPoints2[5],
      pc = _relatedPoints2[6],
      c4 = _relatedPoints2[7],
      d0 = _relatedPoints2[8],
      pd = _relatedPoints2[9],
      pe = _relatedPoints2[10],
      pf = _relatedPoints2[11],
      f4 = _relatedPoints2[12],
      g0 = _relatedPoints2[13],
      pg = _relatedPoints2[14],
      ph = _relatedPoints2[15],
      pi = _relatedPoints2[16],
      i4 = _relatedPoints2[17],
      g5 = _relatedPoints2[18],
      h5 = _relatedPoints2[19],
      i5 = _relatedPoints2[20];

  var e0, e1, e2, e3, e4, e5, e6, e7, e8;
  e0 = e1 = e2 = e3 = e4 = e5 = e6 = e7 = e8 = pe;

  var _kernel3X = kernel3X(pe, pi, ph, pf, pg, pc, pd, pb, f4, i4, h5, i5, e2, e5, e6, e7, e8, blendColors, scaleAlpha);

  var _kernel3X2 = _slicedToArray(_kernel3X, 5);

  e2 = _kernel3X2[0];
  e5 = _kernel3X2[1];
  e6 = _kernel3X2[2];
  e7 = _kernel3X2[3];
  e8 = _kernel3X2[4];

  var _kernel3X3 = kernel3X(pe, pc, pf, pb, pi, pa, ph, pd, b1, c1, f4, c4, e0, e1, e8, e5, e2, blendColors, scaleAlpha);

  var _kernel3X4 = _slicedToArray(_kernel3X3, 5);

  e0 = _kernel3X4[0];
  e1 = _kernel3X4[1];
  e8 = _kernel3X4[2];
  e5 = _kernel3X4[3];
  e2 = _kernel3X4[4];

  var _kernel3X5 = kernel3X(pe, pa, pb, pd, pc, pg, pf, ph, d0, a0, b1, a1, e6, e3, e2, e1, e0, blendColors, scaleAlpha);

  var _kernel3X6 = _slicedToArray(_kernel3X5, 5);

  e6 = _kernel3X6[0];
  e3 = _kernel3X6[1];
  e2 = _kernel3X6[2];
  e1 = _kernel3X6[3];
  e0 = _kernel3X6[4];

  var _kernel3X7 = kernel3X(pe, pg, pd, ph, pa, pi, pb, pf, h5, g5, d0, g0, e8, e7, e0, e3, e6, blendColors, scaleAlpha);

  var _kernel3X8 = _slicedToArray(_kernel3X7, 5);

  e8 = _kernel3X8[0];
  e7 = _kernel3X8[1];
  e0 = _kernel3X8[2];
  e3 = _kernel3X8[3];
  e6 = _kernel3X8[4];
  dstPixelView[dstX + dstY * dstW] = e0;
  dstPixelView[dstX + 1 + dstY * dstW] = e1;
  dstPixelView[dstX + 2 + dstY * dstW] = e2;
  dstPixelView[dstX + (dstY + 1) * dstW] = e3;
  dstPixelView[dstX + 1 + (dstY + 1) * dstW] = e4;
  dstPixelView[dstX + 2 + (dstY + 1) * dstW] = e5;
  dstPixelView[dstX + (dstY + 2) * dstW] = e6;
  dstPixelView[dstX + 1 + (dstY + 2) * dstW] = e7;
  dstPixelView[dstX + 2 + (dstY + 2) * dstW] = e8;
}

function computeXbr4x(oriPixelView, oriX, oriY, oriW, oriH, dstPixelView, dstX, dstY, dstW, blendColors, scaleAlpha) {
  var relatedPoints = getRelatedPoints(oriPixelView, oriX, oriY, oriW, oriH);

  var _relatedPoints3 = _slicedToArray(relatedPoints, 21),
      a1 = _relatedPoints3[0],
      b1 = _relatedPoints3[1],
      c1 = _relatedPoints3[2],
      a0 = _relatedPoints3[3],
      pa = _relatedPoints3[4],
      pb = _relatedPoints3[5],
      pc = _relatedPoints3[6],
      c4 = _relatedPoints3[7],
      d0 = _relatedPoints3[8],
      pd = _relatedPoints3[9],
      pe = _relatedPoints3[10],
      pf = _relatedPoints3[11],
      f4 = _relatedPoints3[12],
      g0 = _relatedPoints3[13],
      pg = _relatedPoints3[14],
      ph = _relatedPoints3[15],
      pi = _relatedPoints3[16],
      i4 = _relatedPoints3[17],
      g5 = _relatedPoints3[18],
      h5 = _relatedPoints3[19],
      i5 = _relatedPoints3[20];

  var e0, e1, e2, e3, e4, e5, e6, e7, e8, e9, ea, eb, ec, ed, ee, ef;
  e0 = e1 = e2 = e3 = e4 = e5 = e6 = e7 = e8 = e9 = ea = eb = ec = ed = ee = ef = pe;

  var _kernel4Xv = kernel4Xv2(pe, pi, ph, pf, pg, pc, pd, pb, f4, i4, h5, i5, ef, ee, eb, e3, e7, ea, ed, ec, blendColors, scaleAlpha);

  var _kernel4Xv2 = _slicedToArray(_kernel4Xv, 8);

  ef = _kernel4Xv2[0];
  ee = _kernel4Xv2[1];
  eb = _kernel4Xv2[2];
  e3 = _kernel4Xv2[3];
  e7 = _kernel4Xv2[4];
  ea = _kernel4Xv2[5];
  ed = _kernel4Xv2[6];
  ec = _kernel4Xv2[7];

  var _kernel4Xv3 = kernel4Xv2(pe, pc, pf, pb, pi, pa, ph, pd, b1, c1, f4, c4, e3, e7, e2, e0, e1, e6, eb, ef, blendColors, scaleAlpha);

  var _kernel4Xv4 = _slicedToArray(_kernel4Xv3, 8);

  e3 = _kernel4Xv4[0];
  e7 = _kernel4Xv4[1];
  e2 = _kernel4Xv4[2];
  e0 = _kernel4Xv4[3];
  e1 = _kernel4Xv4[4];
  e6 = _kernel4Xv4[5];
  eb = _kernel4Xv4[6];
  ef = _kernel4Xv4[7];

  var _kernel4Xv5 = kernel4Xv2(pe, pa, pb, pd, pc, pg, pf, ph, d0, a0, b1, a1, e0, e1, e4, ec, e8, e5, e2, e3, blendColors, scaleAlpha);

  var _kernel4Xv6 = _slicedToArray(_kernel4Xv5, 8);

  e0 = _kernel4Xv6[0];
  e1 = _kernel4Xv6[1];
  e4 = _kernel4Xv6[2];
  ec = _kernel4Xv6[3];
  e8 = _kernel4Xv6[4];
  e5 = _kernel4Xv6[5];
  e2 = _kernel4Xv6[6];
  e3 = _kernel4Xv6[7];

  var _kernel4Xv7 = kernel4Xv2(pe, pg, pd, ph, pa, pi, pb, pf, h5, g5, d0, g0, ec, e8, ed, ef, ee, e9, e4, e0, blendColors, scaleAlpha);

  var _kernel4Xv8 = _slicedToArray(_kernel4Xv7, 8);

  ec = _kernel4Xv8[0];
  e8 = _kernel4Xv8[1];
  ed = _kernel4Xv8[2];
  ef = _kernel4Xv8[3];
  ee = _kernel4Xv8[4];
  e9 = _kernel4Xv8[5];
  e4 = _kernel4Xv8[6];
  e0 = _kernel4Xv8[7];
  dstPixelView[dstX + dstY * dstW] = e0;
  dstPixelView[dstX + 1 + dstY * dstW] = e1;
  dstPixelView[dstX + 2 + dstY * dstW] = e2;
  dstPixelView[dstX + 3 + dstY * dstW] = e3;
  dstPixelView[dstX + (dstY + 1) * dstW] = e4;
  dstPixelView[dstX + 1 + (dstY + 1) * dstW] = e5;
  dstPixelView[dstX + 2 + (dstY + 1) * dstW] = e6;
  dstPixelView[dstX + 3 + (dstY + 1) * dstW] = e7;
  dstPixelView[dstX + (dstY + 2) * dstW] = e8;
  dstPixelView[dstX + 1 + (dstY + 2) * dstW] = e9;
  dstPixelView[dstX + 2 + (dstY + 2) * dstW] = ea;
  dstPixelView[dstX + 3 + (dstY + 2) * dstW] = eb;
  dstPixelView[dstX + (dstY + 3) * dstW] = ec;
  dstPixelView[dstX + 1 + (dstY + 3) * dstW] = ed;
  dstPixelView[dstX + 2 + (dstY + 3) * dstW] = ee;
  dstPixelView[dstX + 3 + (dstY + 3) * dstW] = ef;
}

function alphaBlend32W(dst, src, blendColors) {
  if (blendColors) {
    return pixelInterpolate(dst, src, 7, 1);
  }

  return dst;
}

function alphaBlend64W(dst, src, blendColors) {
  if (blendColors) {
    return pixelInterpolate(dst, src, 3, 1);
  }

  return dst;
}

function alphaBlend128W(dst, src, blendColors) {
  if (blendColors) {
    return pixelInterpolate(dst, src, 1, 1);
  }

  return dst;
}

function alphaBlend192W(dst, src, blendColors) {
  if (blendColors) {
    return pixelInterpolate(dst, src, 1, 3);
  }

  return src;
}

function alphaBlend224W(dst, src, blendColors) {
  if (blendColors) {
    return pixelInterpolate(dst, src, 1, 7);
  }

  return src;
}

function leftUp2_2X(n3, n2, pixel, blendColors) {
  var blendedN2 = alphaBlend64W(n2, pixel, blendColors);
  return [alphaBlend224W(n3, pixel, blendColors), blendedN2, blendedN2];
}

function left2_2X(n3, n2, pixel, blendColors) {
  return [alphaBlend192W(n3, pixel, blendColors), alphaBlend64W(n2, pixel, blendColors)];
}

function up2_2X(n3, n1, pixel, blendColors) {
  return [alphaBlend192W(n3, pixel, blendColors), alphaBlend64W(n1, pixel, blendColors)];
}

function dia_2X(n3, pixel, blendColors) {
  return alphaBlend128W(n3, pixel, blendColors);
}

function kernel2Xv5(pe, pi, ph, pf, pg, pc, pd, pb, f4, i4, h5, i5, n1, n2, n3, blendColors, scaleAlpha) {
  var ex = pe != ph && pe != pf;

  if (!ex) {
    return [n1, n2, n3];
  }

  var e = yuvDifference(pe, pc, scaleAlpha) + yuvDifference(pe, pg, scaleAlpha) + yuvDifference(pi, h5, scaleAlpha) + yuvDifference(pi, f4, scaleAlpha) + (yuvDifference(ph, pf) << 2),
      i = yuvDifference(ph, pd, scaleAlpha) + yuvDifference(ph, i5, scaleAlpha) + yuvDifference(pf, i4, scaleAlpha) + yuvDifference(pf, pb, scaleAlpha) + (yuvDifference(pe, pi, scaleAlpha) << 2),
      px = yuvDifference(pe, pf, scaleAlpha) <= yuvDifference(pe, ph, scaleAlpha) ? pf : ph;

  if (e < i && (!isEqual(pf, pb, scaleAlpha) && !isEqual(ph, pd, scaleAlpha) || isEqual(pe, pi, scaleAlpha) && !isEqual(pf, i4, scaleAlpha) && !isEqual(ph, i5, scaleAlpha) || isEqual(pe, pg, scaleAlpha) || isEqual(pe, pc, scaleAlpha))) {
    var ke = yuvDifference(pf, pg, scaleAlpha),
        ki = yuvDifference(ph, pc, scaleAlpha),
        ex2 = pe != pc && pb != pc,
        ex3 = pe != pg && pd != pg;

    if (ke << 1 <= ki && ex3 || ke >= ki << 1 && ex2) {
      if (ke << 1 <= ki && ex3) {
        var leftOut = left2_2X(n3, n2, px, blendColors);
        n3 = leftOut[0];
        n2 = leftOut[1];
      }

      if (ke >= ki << 1 && ex2) {
        var upOut = up2_2X(n3, n1, px, blendColors);
        n3 = upOut[0];
        n1 = upOut[1];
      }
    } else {
      n3 = dia_2X(n3, px, blendColors);
    }
  } else if (e <= i) {
    n3 = alphaBlend64W(n3, px, blendColors);
  }

  return [n1, n2, n3];
}

function leftUp2_3X(n7, n5, n6, n2, n8, pixel, blendColors) {
  var blendedN7 = alphaBlend192W(n7, pixel, blendColors),
      blendedN6 = alphaBlend64W(n6, pixel, blendColors);
  return [blendedN7, blendedN7, blendedN6, blendedN6, pixel];
}

function left2_3X(n7, n5, n6, n8, pixel, blendColors) {
  return [alphaBlend192W(n7, pixel, blendColors), alphaBlend64W(n5, pixel, blendColors), alphaBlend64W(n6, pixel, blendColors), pixel];
}

function up2_3X(n5, n7, n2, n8, pixel, blendColors) {
  return [alphaBlend192W(n5, pixel, blendColors), alphaBlend64W(n7, pixel, blendColors), alphaBlend64W(n2, pixel, blendColors), pixel];
}

function dia_3X(n8, n5, n7, pixel, blendColors) {
  return [alphaBlend224W(n8, pixel, blendColors), alphaBlend32W(n5, pixel, blendColors), alphaBlend32W(n7, pixel, blendColors)];
}

function kernel3X(pe, pi, ph, pf, pg, pc, pd, pb, f4, i4, h5, i5, n2, n5, n6, n7, n8, blendColors, scaleAlpha) {
  var ex = pe != ph && pe != pf;

  if (!ex) {
    return [n2, n5, n6, n7, n8];
  }

  var e = yuvDifference(pe, pc, scaleAlpha) + yuvDifference(pe, pg, scaleAlpha) + yuvDifference(pi, h5, scaleAlpha) + yuvDifference(pi, f4, scaleAlpha) + (yuvDifference(ph, pf, scaleAlpha) << 2),
      i = yuvDifference(ph, pd, scaleAlpha) + yuvDifference(ph, i5, scaleAlpha) + yuvDifference(pf, i4, scaleAlpha) + yuvDifference(pf, pb, scaleAlpha) + (yuvDifference(pe, pi, scaleAlpha) << 2);
  var state;

  if (USE_3X_ORIGINAL_IMPLEMENTATION) {
    state = e < i && (!isEqual(pf, pb, scaleAlpha) && !isEqual(ph, pd, scaleAlpha) || isEqual(pe, pi, scaleAlpha) && !isEqual(pf, i4, scaleAlpha) && !isEqual(ph, i5, scaleAlpha) || isEqual(pe, pg, scaleAlpha) || isEqual(pe, pc, scaleAlpha));
  } else {
    state = e < i && (!isEqual(pf, pb, scaleAlpha) && !isEqual(pf, pc, scaleAlpha) || !isEqual(ph, pd, scaleAlpha) && !isEqual(ph, pg, scaleAlpha) || isEqual(pe, pi, scaleAlpha) && (!isEqual(pf, f4, scaleAlpha) && !isEqual(pf, i4, scaleAlpha) || !isEqual(ph, h5, scaleAlpha) && !isEqual(ph, i5, scaleAlpha)) || isEqual(pe, pg, scaleAlpha) || isEqual(pe, pc, scaleAlpha));
  }

  if (state) {
    var ke = yuvDifference(pf, pg, scaleAlpha),
        ki = yuvDifference(ph, pc, scaleAlpha),
        ex2 = pe != pc && pb != pc,
        ex3 = pe != pg && pd != pg,
        px = yuvDifference(pe, pf, scaleAlpha) <= yuvDifference(pe, ph, scaleAlpha) ? pf : ph;

    if (ke << 1 <= ki && ex3 && ke >= ki << 1 && ex2) {
      var _leftUp2_3X = leftUp2_3X(n7, n5, n6, n2, n8, px, blendColors);

      var _leftUp2_3X2 = _slicedToArray(_leftUp2_3X, 5);

      n7 = _leftUp2_3X2[0];
      n5 = _leftUp2_3X2[1];
      n6 = _leftUp2_3X2[2];
      n2 = _leftUp2_3X2[3];
      n8 = _leftUp2_3X2[4];
    } else if (ke << 1 <= ki && ex3) {
      var _left2_3X = left2_3X(n7, n5, n6, n8, px, blendColors);

      var _left2_3X2 = _slicedToArray(_left2_3X, 4);

      n7 = _left2_3X2[0];
      n5 = _left2_3X2[1];
      n6 = _left2_3X2[2];
      n8 = _left2_3X2[3];
    } else if (ke >= ki << 1 && ex2) {
      var _up2_3X = up2_3X(n5, n7, n2, n8, px, blendColors);

      var _up2_3X2 = _slicedToArray(_up2_3X, 4);

      n5 = _up2_3X2[0];
      n7 = _up2_3X2[1];
      n2 = _up2_3X2[2];
      n8 = _up2_3X2[3];
    } else {
      var _dia_3X = dia_3X(n8, n5, n7, px, blendColors);

      var _dia_3X2 = _slicedToArray(_dia_3X, 3);

      n8 = _dia_3X2[0];
      n5 = _dia_3X2[1];
      n7 = _dia_3X2[2];
    }
  } else if (e <= i) {
    n8 = alphaBlend128W(n8, yuvDifference(pe, pf, scaleAlpha) <= yuvDifference(pe, ph, scaleAlpha) ? pf : ph, blendColors);
  }

  return [n2, n5, n6, n7, n8];
} // 4xBR


function leftUp2(n15, n14, n11, n13, n12, n10, n7, n3, pixel, blendColors) {
  var blendedN13 = alphaBlend192W(n13, pixel, blendColors),
      blendedN12 = alphaBlend64W(n12, pixel, blendColors);
  return [pixel, pixel, pixel, blendedN12, blendedN12, blendedN12, blendedN13, n3];
}

function left2(n15, n14, n11, n13, n12, n10, pixel, blendColors) {
  return [pixel, pixel, alphaBlend192W(n11, pixel, blendColors), alphaBlend192W(n13, pixel, blendColors), alphaBlend64W(n12, pixel, blendColors), alphaBlend64W(n10, pixel, blendColors)];
}

function up2(n15, n14, n11, n3, n7, n10, pixel, blendColors) {
  return [pixel, alphaBlend192W(n14, pixel, blendColors), pixel, alphaBlend64W(n3, pixel, blendColors), alphaBlend192W(n7, pixel, blendColors), alphaBlend64W(n10, pixel, blendColors)];
}

function dia(n15, n14, n11, pixel, blendColors) {
  return [pixel, alphaBlend128W(n14, pixel, blendColors), alphaBlend128W(n11, pixel, blendColors)];
}

function kernel4Xv2(pe, pi, ph, pf, pg, pc, pd, pb, f4, i4, h5, i5, n15, n14, n11, n3, n7, n10, n13, n12, blendColors, scaleAlpha) {
  var ex = pe != ph && pe != pf;

  if (!ex) {
    return [n15, n14, n11, n3, n7, n10, n13, n12];
  }

  var e = yuvDifference(pe, pc, scaleAlpha) + yuvDifference(pe, pg, scaleAlpha) + yuvDifference(pi, h5, scaleAlpha) + yuvDifference(pi, f4, scaleAlpha) + (yuvDifference(ph, pf, scaleAlpha) << 2),
      i = yuvDifference(ph, pd, scaleAlpha) + yuvDifference(ph, i5, scaleAlpha) + yuvDifference(pf, i4, scaleAlpha) + yuvDifference(pf, pb, scaleAlpha) + (yuvDifference(pe, pi, scaleAlpha) << 2),
      px = yuvDifference(pe, pf, scaleAlpha) <= yuvDifference(pe, ph, scaleAlpha) ? pf : ph;

  if (e < i && (!isEqual(pf, pb, scaleAlpha) && !isEqual(ph, pd, scaleAlpha) || isEqual(pe, pi, scaleAlpha) && !isEqual(pf, i4, scaleAlpha) && !isEqual(ph, i5, scaleAlpha) || isEqual(pe, pg, scaleAlpha) || isEqual(pe, pc, scaleAlpha))) {
    var ke = yuvDifference(pf, pg, scaleAlpha),
        ki = yuvDifference(ph, pc, scaleAlpha),
        ex2 = pe != pc && pb != pc,
        ex3 = pe != pg && pd != pg;

    if (ke << 1 <= ki && ex3 || ke >= ki << 1 && ex2) {
      if (ke << 1 <= ki && ex3) {
        var _left = left2(n15, n14, n11, n13, n12, n10, px, blendColors);

        var _left2 = _slicedToArray(_left, 6);

        n15 = _left2[0];
        n14 = _left2[1];
        n11 = _left2[2];
        n13 = _left2[3];
        n12 = _left2[4];
        n10 = _left2[5];
      }

      if (ke >= ki << 1 && ex2) {
        var _up = up2(n15, n14, n11, n3, n7, n10, px, blendColors);

        var _up2 = _slicedToArray(_up, 6);

        n15 = _up2[0];
        n14 = _up2[1];
        n11 = _up2[2];
        n3 = _up2[3];
        n7 = _up2[4];
        n10 = _up2[5];
      }
    } else {
      var _dia = dia(n15, n14, n11, px, blendColors);

      var _dia2 = _slicedToArray(_dia, 3);

      n15 = _dia2[0];
      n14 = _dia2[1];
      n11 = _dia2[2];
    }
  } else if (e <= i) {
    n15 = alphaBlend128W(n15, px, blendColors);
  }

  return [n15, n14, n11, n3, n7, n10, n13, n12];
}

function parseOptions(rawOpts) {
  var blendColors = true,
      scaleAlpha = false;

  if (rawOpts) {
    if (rawOpts.blendColors === false) {
      blendColors = false;
    }

    if (rawOpts.scaleAlpha === true) {
      scaleAlpha = true;
    }
  }

  return {
    blendColors: blendColors,
    scaleAlpha: scaleAlpha
  };
}

function xbr2x(pixelArray, width, height, options) {
  var _parseOptions = parseOptions(options),
      blendColors = _parseOptions.blendColors,
      scaleAlpha = _parseOptions.scaleAlpha;

  var scaledPixelArray = new Uint32Array(width * height * 4);

  for (var c = 0; c < width; c++) {
    for (var d = 0; d < height; d++) {
      computeXbr2x(pixelArray, c, d, width, height, scaledPixelArray, c * 2, d * 2, width * 2, blendColors, scaleAlpha);
    }
  }

  return scaledPixelArray;
}
function xbr3x(pixelArray, width, height, options) {
  var _parseOptions2 = parseOptions(options),
      blendColors = _parseOptions2.blendColors,
      scaleAlpha = _parseOptions2.scaleAlpha;

  var scaledPixelArray = new Uint32Array(width * height * 9);

  for (var c = 0; c < width; c++) {
    for (var d = 0; d < height; d++) {
      computeXbr3x(pixelArray, c, d, width, height, scaledPixelArray, c * 3, d * 3, width * 3, blendColors, scaleAlpha);
    }
  }

  return scaledPixelArray;
}
function xbr4x(pixelArray, width, height, options) {
  var _parseOptions3 = parseOptions(options),
      blendColors = _parseOptions3.blendColors,
      scaleAlpha = _parseOptions3.scaleAlpha;

  var scaledPixelArray = new Uint32Array(width * height * 16);

  for (var c = 0; c < width; c++) {
    for (var d = 0; d < height; d++) {
      computeXbr4x(pixelArray, c, d, width, height, scaledPixelArray, c * 4, d * 4, width * 4, blendColors, scaleAlpha);
    }
  }

  return scaledPixelArray;
}

/***/ })
/******/ ]);
});