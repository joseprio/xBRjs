/******/ (function(modules) { // webpackBootstrap
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

// CONCATENATED MODULE: ./src/index.js
// Options
const USE_3X_ORIGINAL_IMPLEMENTATION = false;

const
  REDMASK   = 0x000000FF, // &MASK	>>0
  GREENMASK = 0x0000FF00, // &MASK	>>8
  BLUEMASK  = 0x00FF0000, // &MASK	>>16
  ALPHAMASK = 0xFF000000, // &MASK	>>24
  THRESHHOLD_Y = 48,
  THRESHHOLD_U = 7,
  THRESHHOLD_V = 6;

// Convert an ARGB byte to YUV
function getYuv(p) {
  const
    r = (p & REDMASK),
    g = (p & GREENMASK) >> 8,
    b = (p & BLUEMASK) >> 16,
    y = r * .299000 + g * .587000 + b * .114000,
    u = r *  - .168736 + g *  - .331264 + b * .500000,
    v = r * .500000 + g *  - .418688 + b *  - .081312;
  return [y, u, v];
}

function yuvDifference(A, B, scaleAlpha) {
  const
    alphaA = ((A & ALPHAMASK) >> 24) & 0xff,
    alphaB = ((B & ALPHAMASK) >> 24) & 0xff;

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

  const
    yuvA = getYuv(A),
    yuvB = getYuv(B);

  /*Add HQx filters threshold & return*/
  return Math.abs(yuvA[0] - yuvB[0]) * THRESHHOLD_Y
       + Math.abs(yuvA[1] - yuvB[1]) * THRESHHOLD_U
       + Math.abs(yuvA[2] - yuvB[2]) * THRESHHOLD_V;
}

function isEqual(A, B, scaleAlpha) {
  const
    alphaA = ((A & ALPHAMASK) >> 24) & 0xff,
    alphaB = ((B & ALPHAMASK) >> 24) & 0xff;

  if (alphaA === 0 && alphaB === 0) {
    return true;
  }

  if (!scaleAlpha && (alphaA < 255 || alphaB < 255)) {
    return false;
  }

  if (alphaA === 0 || alphaB === 0) {
    return false;
  }

  const
    yuvA = getYuv(A),
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
  const
    alphaA = ((A & ALPHAMASK) >> 24) & 0xff,
    alphaB = ((B & ALPHAMASK) >> 24) & 0xff;

  /*Extract each value from 32bit Uint & blend colors together*/
  let r, g, b, a;

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
  return ((~~r) | ((~~g) << 8) | ((~~b) << 16) | ((~~a) << 24));
}

function getRelatedPoints(oriPixelView, oriX, oriY, oriW, oriH) {
  let xm1 = oriX - 1;
  if (xm1 < 0) {
    xm1 = 0;
  }
  let xm2 = oriX - 2;
  if (xm2 < 0) {
    xm2 = 0;
  }
  let xp1 = oriX + 1;
  if (xp1 >= oriW) {
    xp1 = oriW - 1;
  }
  let xp2 = oriX + 2;
  if (xp2 >= oriW) {
    xp2 = oriW - 1;
  }
  let ym1 = oriY - 1;
  if (ym1 < 0) {
    ym1 = 0;
  }
  let ym2 = oriY - 2;
  if (ym2 < 0) {
    ym2 = 0;
  }
  let yp1 = oriY + 1;
  if (yp1 >= oriH) {
    yp1 = oriH - 1;
  }
  let yp2 = oriY + 2;
  if (yp2 >= oriH) {
    yp2 = oriH - 1;
  }

  return [
    oriPixelView[xm1 + ym2 * oriW],  /* a1 */
    oriPixelView[oriX + ym2 * oriW], /* b1 */
    oriPixelView[xp1 + ym2 * oriW],  /* c1 */

    oriPixelView[xm2 + ym1 * oriW],  /* a0 */
    oriPixelView[xm1 + ym1 * oriW],  /* pa */
    oriPixelView[oriX + ym1 * oriW], /* pb */
    oriPixelView[xp1 + ym1 * oriW],  /* pc */
    oriPixelView[xp2 + ym1 * oriW],  /* c4 */

    oriPixelView[xm2 + oriY * oriW], /* d0 */
    oriPixelView[xm1 + oriY * oriW], /* pd */
    oriPixelView[oriX + oriY * oriW],/* pe */
    oriPixelView[xp1 + oriY * oriW], /* pf */
    oriPixelView[xp2 + oriY * oriW], /* f4 */

    oriPixelView[xm2 + yp1 * oriW],  /* g0 */
    oriPixelView[xm1 + yp1 * oriW],  /* pg */
    oriPixelView[oriX + yp1 * oriW], /* ph */
    oriPixelView[xp1 + yp1 * oriW],  /* pi */
    oriPixelView[xp2 + yp1 * oriW],  /* i4 */

    oriPixelView[xm1 + yp2 * oriW],  /* g5 */
    oriPixelView[oriX + yp2 * oriW], /* h5 */
    oriPixelView[xp1 + yp2 * oriW]   /* i5 */
  ];
}

// This is the XBR2x by Hyllian (see http://board.byuu.org/viewtopic.php?f=10&t=2248)
function computeXbr2x(oriPixelView, oriX, oriY, oriW, oriH, dstPixelView, dstX, dstY, dstW, blendColors, scaleAlpha) {
  const relatedPoints = getRelatedPoints(oriPixelView, oriX, oriY, oriW, oriH);
  const
    [a1,
     b1,
     c1,
	 a0,
     pa,
     pb,
     pc,
     c4,
     d0,
     pd,
     pe,
     pf,
     f4,
     g0,
     pg,
     ph,
     pi,
     i4,
     g5,
     h5,
     i5] = relatedPoints;
  let e0, e1, e2, e3;
  e0 = e1 = e2 = e3 = pe;

  [e1, e2, e3] = kernel2Xv5(pe, pi, ph, pf, pg, pc, pd, pb, f4, i4, h5, i5, e1, e2, e3, blendColors, scaleAlpha);
  [e0, e3, e1] = kernel2Xv5(pe, pc, pf, pb, pi, pa, ph, pd, b1, c1, f4, c4, e0, e3, e1, blendColors, scaleAlpha);
  [e2, e1, e0] = kernel2Xv5(pe, pa, pb, pd, pc, pg, pf, ph, d0, a0, b1, a1, e2, e1, e0, blendColors, scaleAlpha);
  [e3, e0, e2] = kernel2Xv5(pe, pg, pd, ph, pa, pi, pb, pf, h5, g5, d0, g0, e3, e0, e2, blendColors, scaleAlpha);

  dstPixelView[dstX + dstY * dstW] = e0;
  dstPixelView[dstX + 1 + dstY * dstW] = e1;
  dstPixelView[dstX + (dstY + 1) * dstW] = e2;
  dstPixelView[dstX + 1 + (dstY + 1) * dstW] = e3;  
}

function computeXbr3x(oriPixelView, oriX, oriY, oriW, oriH, dstPixelView, dstX, dstY, dstW, blendColors, scaleAlpha) {
  const relatedPoints = getRelatedPoints(oriPixelView, oriX, oriY, oriW, oriH);
  const
    [a1,
     b1,
     c1,
	 a0,
     pa,
     pb,
     pc,
     c4,
     d0,
     pd,
     pe,
     pf,
     f4,
     g0,
     pg,
     ph,
     pi,
     i4,
     g5,
     h5,
     i5] = relatedPoints;
  let e0, e1, e2, e3, e4, e5, e6, e7, e8;
  e0 = e1 = e2 = e3 = e4 = e5 = e6 = e7 = e8 = pe;

  [e2, e5, e6, e7, e8] = kernel3X(pe, pi, ph, pf, pg, pc, pd, pb, f4, i4, h5, i5, e2, e5, e6, e7, e8, blendColors, scaleAlpha);
  [e0, e1, e8, e5, e2] = kernel3X(pe, pc, pf, pb, pi, pa, ph, pd, b1, c1, f4, c4, e0, e1, e8, e5, e2, blendColors, scaleAlpha);
  [e6, e3, e2, e1, e0] = kernel3X(pe, pa, pb, pd, pc, pg, pf, ph, d0, a0, b1, a1, e6, e3, e2, e1, e0, blendColors, scaleAlpha);
  [e8, e7, e0, e3, e6] = kernel3X(pe, pg, pd, ph, pa, pi, pb, pf, h5, g5, d0, g0, e8, e7, e0, e3, e6, blendColors, scaleAlpha);

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
  const relatedPoints = getRelatedPoints(oriPixelView, oriX, oriY, oriW, oriH);
  const
    [a1,
     b1,
     c1,
	 a0,
     pa,
     pb,
     pc,
     c4,
     d0,
     pd,
     pe,
     pf,
     f4,
     g0,
     pg,
     ph,
     pi,
     i4,
     g5,
     h5,
     i5] = relatedPoints;
  let e0, e1, e2, e3, e4, e5, e6, e7, e8, e9, ea, eb, ec, ed, ee, ef;
  e0 = e1 = e2 = e3 = e4 = e5 = e6 = e7 = e8 = e9 = ea = eb = ec = ed = ee = ef = pe;

  [ef, ee, eb, e3, e7, ea, ed, ec] = kernel4Xv2(pe, pi, ph, pf, pg, pc, pd, pb, f4, i4, h5, i5, ef, ee, eb, e3, e7, ea, ed, ec, blendColors, scaleAlpha);
  [e3, e7, e2, e0, e1, e6, eb, ef] = kernel4Xv2(pe, pc, pf, pb, pi, pa, ph, pd, b1, c1, f4, c4, e3, e7, e2, e0, e1, e6, eb, ef, blendColors, scaleAlpha);
  [e0, e1, e4, ec, e8, e5, e2, e3] = kernel4Xv2(pe, pa, pb, pd, pc, pg, pf, ph, d0, a0, b1, a1, e0, e1, e4, ec, e8, e5, e2, e3, blendColors, scaleAlpha);
  [ec, e8, ed, ef, ee, e9, e4, e0] = kernel4Xv2(pe, pg, pd, ph, pa, pi, pb, pf, h5, g5, d0, g0, ec, e8, ed, ef, ee, e9, e4, e0, blendColors, scaleAlpha);

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
  const blendedN2 = alphaBlend64W(n2, pixel, blendColors);
  return [
    alphaBlend224W(n3, pixel, blendColors),
    blendedN2,
    blendedN2
  ];
}

function left2_2X(n3, n2, pixel, blendColors) {
  return [
    alphaBlend192W(n3, pixel, blendColors),
    alphaBlend64W(n2, pixel, blendColors)
  ];
}

function up2_2X(n3, n1, pixel, blendColors) {
  return [
    alphaBlend192W(n3, pixel, blendColors),
    alphaBlend64W(n1, pixel, blendColors)
  ];
}

function dia_2X(n3, pixel, blendColors) {
  return alphaBlend128W(n3, pixel, blendColors);
}

function kernel2Xv5(pe, pi, ph, pf, pg, pc, pd, pb, f4, i4, h5, i5, n1, n2, n3, blendColors, scaleAlpha) {
  let ex = (pe != ph && pe != pf);
  if (!ex) {
    return [n1, n2, n3];
  }
  let
    e = (yuvDifference(pe, pc, scaleAlpha) + yuvDifference(pe, pg, scaleAlpha) + yuvDifference(pi, h5, scaleAlpha) + yuvDifference(pi, f4, scaleAlpha)) + (yuvDifference(ph, pf) << 2),
    i = (yuvDifference(ph, pd, scaleAlpha) + yuvDifference(ph, i5, scaleAlpha) + yuvDifference(pf, i4, scaleAlpha) + yuvDifference(pf, pb, scaleAlpha)) + (yuvDifference(pe, pi, scaleAlpha) << 2),
    px = (yuvDifference(pe, pf, scaleAlpha) <= yuvDifference(pe, ph, scaleAlpha)) ? pf : ph;

  if ((e < i) && (!isEqual(pf, pb, scaleAlpha) && !isEqual(ph, pd, scaleAlpha) || isEqual(pe, pi, scaleAlpha) && (!isEqual(pf, i4, scaleAlpha) && !isEqual(ph, i5, scaleAlpha)) || isEqual(pe, pg, scaleAlpha) || isEqual(pe, pc, scaleAlpha))) {
    let
      ke = yuvDifference(pf, pg, scaleAlpha),
      ki = yuvDifference(ph, pc, scaleAlpha),
      ex2 = (pe != pc && pb != pc),
      ex3 = (pe != pg && pd != pg);
    if (((ke << 1) <= ki) && ex3 || (ke >= (ki << 1)) && ex2) {
      if (((ke << 1) <= ki) && ex3) {
        let leftOut = left2_2X(n3, n2, px, blendColors);
        n3 = leftOut[0];
        n2 = leftOut[1];
      }
      if ((ke >= (ki << 1)) && ex2) {
        let upOut = up2_2X(n3, n1, px, blendColors);
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
  const
    blendedN7 = alphaBlend192W(n7, pixel, blendColors),
    blendedN6 = alphaBlend64W(n6, pixel, blendColors);
  return [
    blendedN7,
    blendedN7,
    blendedN6,
    blendedN6,
	pixel
  ];
}

function left2_3X(n7, n5, n6, n8, pixel, blendColors) {
  return [
    alphaBlend192W(n7, pixel, blendColors),
    alphaBlend64W(n5, pixel, blendColors),
    alphaBlend64W(n6, pixel, blendColors),
    pixel
  ];
}

function up2_3X(n5, n7, n2, n8, pixel, blendColors) {
  return [
    alphaBlend192W(n5, pixel, blendColors),
    alphaBlend64W(n7, pixel, blendColors),
    alphaBlend64W(n2, pixel, blendColors),
    pixel
  ];
}

function dia_3X(n8, n5, n7, pixel, blendColors) {
  return [
    alphaBlend224W(n8, pixel, blendColors),
    alphaBlend32W(n5, pixel, blendColors),
    alphaBlend32W(n7, pixel, blendColors)
  ];
}

function kernel3X(pe, pi, ph, pf, pg, pc, pd, pb, f4, i4, h5, i5, n2, n5, n6, n7, n8, blendColors, scaleAlpha) {
  const ex = (pe != ph && pe != pf);
  if (!ex) {
    return [n2, n5, n6, n7, n8];
  }

  const
    e = (yuvDifference(pe, pc, scaleAlpha) + yuvDifference(pe, pg, scaleAlpha) + yuvDifference(pi, h5, scaleAlpha) + yuvDifference(pi, f4, scaleAlpha)) + (yuvDifference(ph, pf, scaleAlpha) << 2),
    i = (yuvDifference(ph, pd, scaleAlpha) + yuvDifference(ph, i5, scaleAlpha) + yuvDifference(pf, i4, scaleAlpha) + yuvDifference(pf, pb, scaleAlpha)) + (yuvDifference(pe, pi, scaleAlpha) << 2);

  let state;
  if (USE_3X_ORIGINAL_IMPLEMENTATION) {
    state = ((e < i) && (!isEqual(pf, pb, scaleAlpha) && !isEqual(ph, pd, scaleAlpha) || isEqual(pe, pi, scaleAlpha) && (!isEqual(pf, i4, scaleAlpha) && !isEqual(ph, i5, scaleAlpha)) || isEqual(pe, pg, scaleAlpha) || isEqual(pe, pc, scaleAlpha)));
  } else {
    state = ((e < i) && (!isEqual(pf, pb, scaleAlpha) && !isEqual(pf, pc, scaleAlpha) || !isEqual(ph, pd, scaleAlpha) && !isEqual(ph, pg, scaleAlpha) || isEqual(pe, pi, scaleAlpha) && (!isEqual(pf, f4, scaleAlpha) && !isEqual(pf, i4, scaleAlpha) || !isEqual(ph, h5, scaleAlpha) && !isEqual(ph, i5, scaleAlpha)) || isEqual(pe, pg, scaleAlpha) || isEqual(pe, pc, scaleAlpha)));
  }

  if (state) {
    const
      ke = yuvDifference(pf, pg, scaleAlpha),
      ki = yuvDifference(ph, pc, scaleAlpha),
      ex2 = (pe != pc && pb != pc),
      ex3 = (pe != pg && pd != pg),
      px = (yuvDifference(pe, pf, scaleAlpha) <= yuvDifference(pe, ph, scaleAlpha)) ? pf : ph;
    if (((ke << 1) <= ki) && ex3 && (ke >= (ki << 1)) && ex2) {
      [n7, n5, n6, n2, n8] = leftUp2_3X(n7, n5, n6, n2, n8, px, blendColors);
    } else if (((ke << 1) <= ki) && ex3) {
      [n7, n5, n6, n8] = left2_3X(n7, n5, n6, n8, px, blendColors);
    } else if ((ke >= (ki << 1)) && ex2) {
      [n5, n7, n2, n8] = up2_3X(n5, n7, n2, n8, px, blendColors);
    } else {
      [n8, n5, n7] = dia_3X(n8, n5, n7, px, blendColors);
    }
  } else if (e <= i) {
    n8 = alphaBlend128W(n8, ((yuvDifference(pe, pf, scaleAlpha) <= yuvDifference(pe, ph, scaleAlpha)) ? pf : ph), blendColors);
  }
  return [n2, n5, n6, n7, n8];
}

// 4xBR
function leftUp2(n15, n14, n11, n13, n12, n10, n7, n3, pixel, blendColors) {
  const
    blendedN13 = alphaBlend192W(n13, pixel, blendColors),
    blendedN12 = alphaBlend64W(n12, pixel, blendColors);

  return [pixel, pixel, pixel, blendedN12, blendedN12, blendedN12, blendedN13, n3];
}

function left2(n15, n14, n11, n13, n12, n10, pixel, blendColors) {
  return [
    pixel,
	pixel,
	alphaBlend192W(n11, pixel, blendColors),
	alphaBlend192W(n13, pixel, blendColors),
	alphaBlend64W(n12, pixel, blendColors),
	alphaBlend64W(n10, pixel, blendColors)
  ];
}

function up2(n15, n14, n11, n3, n7, n10, pixel, blendColors) {
  return [
	pixel,
	alphaBlend192W(n14, pixel, blendColors),
	pixel,
	alphaBlend64W(n3, pixel, blendColors),
	alphaBlend192W(n7, pixel, blendColors),
	alphaBlend64W(n10, pixel, blendColors)
  ];
}

function dia(n15, n14, n11, pixel, blendColors) {
  return [
	pixel,
	alphaBlend128W(n14, pixel, blendColors),
	alphaBlend128W(n11, pixel, blendColors)
  ];
}

function kernel4Xv2(pe, pi, ph, pf, pg, pc, pd, pb, f4, i4, h5, i5, n15, n14, n11, n3, n7, n10, n13, n12, blendColors, scaleAlpha) {
  var ex = (pe != ph && pe != pf);
  if (!ex) {
    return [n15, n14, n11, n3, n7, n10, n13, n12];
  }
  const
    e = (yuvDifference(pe, pc, scaleAlpha) + yuvDifference(pe, pg, scaleAlpha) + yuvDifference(pi, h5, scaleAlpha) + yuvDifference(pi, f4, scaleAlpha)) + (yuvDifference(ph, pf, scaleAlpha) << 2),
    i = (yuvDifference(ph, pd, scaleAlpha) + yuvDifference(ph, i5, scaleAlpha) + yuvDifference(pf, i4, scaleAlpha) + yuvDifference(pf, pb, scaleAlpha)) + (yuvDifference(pe, pi, scaleAlpha) << 2),
    px = (yuvDifference(pe, pf, scaleAlpha) <= yuvDifference(pe, ph, scaleAlpha)) ? pf : ph;
  if ((e < i) && (!isEqual(pf, pb, scaleAlpha) && !isEqual(ph, pd, scaleAlpha) || isEqual(pe, pi, scaleAlpha) && (!isEqual(pf, i4, scaleAlpha) && !isEqual(ph, i5, scaleAlpha)) || isEqual(pe, pg, scaleAlpha) || isEqual(pe, pc, scaleAlpha))) {
    const
      ke = yuvDifference(pf, pg, scaleAlpha),
      ki = yuvDifference(ph, pc, scaleAlpha),
      ex2 = (pe != pc && pb != pc),
      ex3 = (pe != pg && pd != pg);
    if (((ke << 1) <= ki) && ex3 || (ke >= (ki << 1)) && ex2) {
      if (((ke << 1) <= ki) && ex3) {
        [n15, n14, n11, n13, n12, n10] = left2(n15, n14, n11, n13, n12, n10, px, blendColors);
      }
      if ((ke >= (ki << 1)) && ex2) {
        [n15, n14, n11, n3, n7, n10] = up2(n15, n14, n11, n3, n7, n10, px, blendColors);
      }
    } else {
      [n15, n14, n11] = dia(n15, n14, n11, px, blendColors);
    }

  } else if (e <= i) {
    n15 = alphaBlend128W(n15, px, blendColors);
  }

  return [n15, n14, n11, n3, n7, n10, n13, n12];
}

function parseOptions(rawOpts) {
  let
    blendColors = true,
    scaleAlpha = false;

  if (rawOpts) {
	if (rawOpts.blendColors === false) {
	  blendColors = false;
	}
		
	if (rawOpts.scaleAlpha === true) {
      scaleAlpha = true;
    }
  }
	
  return {blendColors, scaleAlpha};
}

function xbr2x(pixelArray, width, height, options) {
  const {blendColors, scaleAlpha} = parseOptions(options);
  const scaledPixelArray = new Uint32Array(width * height * 4);
  for (let c = 0; c < width; c++) {
    for (let d = 0; d < height; d++) {
      computeXbr2x(pixelArray, c, d, width, height, scaledPixelArray, c * 2, d * 2, width * 2, blendColors, scaleAlpha);
    }
  }
  return scaledPixelArray;
}

function xbr3x(pixelArray, width, height, options) {
  const {blendColors, scaleAlpha} = parseOptions(options);
  const scaledPixelArray = new Uint32Array(width * height * 9);
  for (let c = 0; c < width; c++) {
    for (let d = 0; d < height; d++) {
      computeXbr3x(pixelArray, c, d, width, height, scaledPixelArray, c * 3, d * 3, width * 3, blendColors, scaleAlpha);
    }
  }
  return scaledPixelArray;
}

function xbr4x(pixelArray, width, height, options) {
  const {blendColors, scaleAlpha} = parseOptions(options);
  const scaledPixelArray = new Uint32Array(width * height * 16);
  for (let c = 0; c < width; c++) {
    for (let d = 0; d < height; d++) {
      computeXbr4x(pixelArray, c, d, width, height, scaledPixelArray, c * 4, d * 4, width * 4, blendColors, scaleAlpha);
    }
  }
  return scaledPixelArray;
}
// CONCATENATED MODULE: ./src/demo.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "applyXBR", function() { return applyXBR; });


function readURL(input) {
  if (input.files && input.files[0]) {
    let reader = new FileReader();
    reader.onload = function(e) {
      processURL(e.target.result);
    }

    reader.readAsDataURL(input.files[0]);
  }
}

function applyXBR(image, factor) {
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



/***/ })
/******/ ]);