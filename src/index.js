// Options
var blendColors = true;
var use3xOriginalImplementation = false;

const
  REDMASK = 0x000000FF, // &MASK	>>0
  GREENMASK = 0x0000FF00, // &MASK	>>8
  BLUEMASK = 0x00FF0000, // &MASK	>>16
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

function yuvDifference(A, B) {
  const
    alphaA = (A & ALPHAMASK) >> 24,
    alphaB = (B & ALPHAMASK) >> 24;

  if (alphaA === 0 && alphaB === 0) {
    return 0;
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

function isEqual(A, B) {
  const
    alphaA = (A & ALPHAMASK) >> 24,
    alphaB = (B & ALPHAMASK) >> 24;

  if (alphaA === 0 && alphaB === 0) {
    return true;
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
    alphaA = (A & ALPHAMASK) >> 24,
    alphaB = (B & ALPHAMASK) >> 24;

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
  a = (q2 * ((B & ALPHAMASK) >> 24) + q1 * ((A & ALPHAMASK) >> 24)) / (q1 + q2);
  /*The bit hack '~~' is used to floor the values like Math.floor, but faster*/
  return ((~~r) | ((~~g) << 8) | ((~~b) << 16) | ((~~a) << 24));
}

/// <summary>
/// This is the XBR2x by Hyllian (see http://board.byuu.org/viewtopic.php?f=10&t=2248)
/// </summary>
function computeXbr(oriPixelView, oriX, oriY, oriW, oriH, dstPixelView, dstX, dstY, dstW, factor, allowAlphaBlending) {
  let xm2 = oriX - 2;
  if (xm2 < 0) {
    xm2 = 0;
  }
  let xm1 = oriX - 1;
  if (xm1 < 0) {
    xm1 = 0;
  }
  let xp0 = oriX;
  let xp1 = oriX + 1;
  if (xp1 >= oriW) {
    xp1 = oriW - 1;
  }
  let xp2 = oriX + 2;
  if (xp2 >= oriW) {
    xp2 = oriW - 1;
  }

  let ym2 = oriY - 2;
  if (ym2 < 0) {
    ym2 = 0;
  }
  let ym1 = oriY - 1;
  if (ym1 < 0) {
    ym1 = 0;
  }
  let yp0 = oriY;
  let yp1 = oriY + 1;
  if (yp1 >= oriH) {
    yp1 = oriH - 1;
  }
  let yp2 = oriY + 2;
  if (yp2 >= oriH) {
    yp2 = oriH - 1;
  }

  let
    a1 = oriPixelView[xm1 + ym2 * oriW],
    b1 = oriPixelView[xp0 + ym2 * oriW],
    c1 = oriPixelView[xp1 + ym2 * oriW],

    a0 = oriPixelView[xm2 + ym1 * oriW],
    pa = oriPixelView[xm1 + ym1 * oriW],
    pb = oriPixelView[xp0 + ym1 * oriW],
    pc = oriPixelView[xp1 + ym1 * oriW],
    c4 = oriPixelView[xp2 + ym1 * oriW],

    d0 = oriPixelView[xm2 + yp0 * oriW],
    pd = oriPixelView[xm1 + yp0 * oriW],
    pe = oriPixelView[xp0 + yp0 * oriW],
    pf = oriPixelView[xp1 + yp0 * oriW],
    f4 = oriPixelView[xp2 + yp0 * oriW],

    g0 = oriPixelView[xm2 + yp1 * oriW],
    pg = oriPixelView[xm1 + yp1 * oriW],
    ph = oriPixelView[xp0 + yp1 * oriW],
    pi = oriPixelView[xp1 + yp1 * oriW],
    i4 = oriPixelView[xp2 + yp1 * oriW],

    g5 = oriPixelView[xm1 + yp2 * oriW],
    h5 = oriPixelView[xp0 + yp2 * oriW],
    i5 = oriPixelView[xp1 + yp2 * oriW],

    e0,
    e1,
    e2,
    e3,
    e4,
    e5,
    e6,
    e7,
    e8,
    e9,
    ea,
    eb,
    ec,
    ed,
    ee,
    ef;
  e0 = e1 = e2 = e3 = e4 = e5 = e6 = e7 = e8 = e9 = ea = eb = ec = ed = ee = ef = pe;

  if (factor === 2) {
    [e1, e2, e3] = kernel2Xv5(pe, pi, ph, pf, pg, pc, pd, pb, f4, i4, h5, i5, e1, e2, e3, allowAlphaBlending);

    [e0, e3, e1] = kernel2Xv5(pe, pc, pf, pb, pi, pa, ph, pd, b1, c1, f4, c4, e0, e3, e1, allowAlphaBlending);

    [e2, e1, e0] = kernel2Xv5(pe, pa, pb, pd, pc, pg, pf, ph, d0, a0, b1, a1, e2, e1, e0, allowAlphaBlending);

    [e3, e0, e2] = kernel2Xv5(pe, pg, pd, ph, pa, pi, pb, pf, h5, g5, d0, g0, e3, e0, e2, allowAlphaBlending);

    dstPixelView[dstX + dstY * dstW] = e0;
    dstPixelView[dstX + 1 + dstY * dstW] = e1;
    dstPixelView[dstX + (dstY + 1) * dstW] = e2;
    dstPixelView[dstX + 1 + (dstY + 1) * dstW] = e3;
  } else if (factor === 3) {
    [e2, e5, e6, e7, e8] = kernel3X(pe, pi, ph, pf, pg, pc, pd, pb, f4, i4, h5, i5, e2, e5, e6, e7, e8, allowAlphaBlending, use3xOriginalImplementation);

    [e0, e1, e8, e5, e2] = kernel3X(pe, pc, pf, pb, pi, pa, ph, pd, b1, c1, f4, c4, e0, e1, e8, e5, e2, allowAlphaBlending, use3xOriginalImplementation);

    [e6, e3, e2, e1, e0] = kernel3X(pe, pa, pb, pd, pc, pg, pf, ph, d0, a0, b1, a1, e6, e3, e2, e1, e0, allowAlphaBlending, use3xOriginalImplementation);

    [e8, e7, e0, e3, e6] = kernel3X(pe, pg, pd, ph, pa, pi, pb, pf, h5, g5, d0, g0, e8, e7, e0, e3, e6, allowAlphaBlending, use3xOriginalImplementation);

    dstPixelView[dstX + dstY * dstW] = e0;
    dstPixelView[dstX + 1 + dstY * dstW] = e1;
    dstPixelView[dstX + 2 + dstY * dstW] = e2;
    dstPixelView[dstX + (dstY + 1) * dstW] = e3;
    dstPixelView[dstX + 1 + (dstY + 1) * dstW] = e4;
    dstPixelView[dstX + 2 + (dstY + 1) * dstW] = e5;
    dstPixelView[dstX + (dstY + 2) * dstW] = e6;
    dstPixelView[dstX + 1 + (dstY + 2) * dstW] = e7;
    dstPixelView[dstX + 2 + (dstY + 2) * dstW] = e8;
  } else if (factor === 4) {
    [ef, ee, eb, e3, e7, ea, ed, ec] = kernel4Xv2(pe, pi, ph, pf, pg, pc, pd, pb, f4, i4, h5, i5, ef, ee, eb, e3, e7, ea, ed, ec, allowAlphaBlending);

    [e3, e7, e2, e0, e1, e6, eb, ef] = kernel4Xv2(pe, pc, pf, pb, pi, pa, ph, pd, b1, c1, f4, c4, e3, e7, e2, e0, e1, e6, eb, ef, allowAlphaBlending);

    [e0, e1, e4, ec, e8, e5, e2, e3] = kernel4Xv2(pe, pa, pb, pd, pc, pg, pf, ph, d0, a0, b1, a1, e0, e1, e4, ec, e8, e5, e2, e3, allowAlphaBlending);

    [ec, e8, ed, ef, ee, e9, e4, e0] = kernel4Xv2(pe, pg, pd, ph, pa, pi, pb, pf, h5, g5, d0, g0, ec, e8, ed, ef, ee, e9, e4, e0, allowAlphaBlending);

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
}

function alphaBlend32W(dst, src, blend) {
  if (blend) {
    return pixelInterpolate(dst, src, 7, 1);
  }

  return dst;
}

function alphaBlend64W(dst, src, blend) {
  if (blend) {
    return pixelInterpolate(dst, src, 3, 1);
  }
  return dst;
}

function alphaBlend128W(dst, src, blend) {
  if (blend) {
    return pixelInterpolate(dst, src, 1, 1);
  }
  return dst;
}

function alphaBlend192W(dst, src, blend) {
  if (blend) {
    return pixelInterpolate(dst, src, 1, 3);
  }
  return src;
}

function alphaBlend224W(dst, src, blend) {
  if (blend) {
    return pixelInterpolate(dst, src, 1, 7);
  }
  return src;
}

function leftUp2_2X(n3, n2, pixel, blend) {
  const blendedN2 = alphaBlend64W(n2, pixel, blend);
  return [
    alphaBlend224W(n3, pixel, blend),
    blendedN2,
    blendedN2
  ];
}

function left2_2X(n3, n2, pixel, blend) {
  n3 = alphaBlend192W(n3, pixel, blend);
  n2 = alphaBlend64W(n2, pixel, blend);
  return [n3, n2];
}
function up2_2X(n3, n1, pixel, blend) {
  return [
    alphaBlend192W(n3, pixel, blend),
    alphaBlend64W(n1, pixel, blend)
  ];
}

function dia_2X(n3, pixel, blend) {
  return alphaBlend128W(n3, pixel, blend);
}

function kernel2Xv5(pe, pi, ph, pf, pg, pc, pd, pb, f4, i4, h5, i5, n1, n2, n3, blend) {
  let ex = (pe != ph && pe != pf);
  if (!ex) {
    return [n1, n2, n3];
  }
  let
    e = (yuvDifference(pe, pc) + yuvDifference(pe, pg) + yuvDifference(pi, h5) + yuvDifference(pi, f4)) + (yuvDifference(ph, pf) << 2),
    i = (yuvDifference(ph, pd) + yuvDifference(ph, i5) + yuvDifference(pf, i4) + yuvDifference(pf, pb)) + (yuvDifference(pe, pi) << 2),
    px = (yuvDifference(pe, pf) <= yuvDifference(pe, ph)) ? pf : ph;

  if ((e < i) && (!isEqual(pf, pb) && !isEqual(ph, pd) || isEqual(pe, pi) && (!isEqual(pf, i4) && !isEqual(ph, i5)) || isEqual(pe, pg) || isEqual(pe, pc))) {
    let
      ke = yuvDifference(pf, pg),
      ki = yuvDifference(ph, pc),
      ex2 = (pe != pc && pb != pc),
      ex3 = (pe != pg && pd != pg);
    if (((ke << 1) <= ki) && ex3 || (ke >= (ki << 1)) && ex2) {
      if (((ke << 1) <= ki) && ex3) {
        let leftOut = left2_2X(n3, n2, px, blend);
        n3 = leftOut[0];
        n2 = leftOut[1];
      }
      if ((ke >= (ki << 1)) && ex2) {
        let upOut = up2_2X(n3, n1, px, blend);
        n3 = upOut[0];
        n1 = upOut[1];
      }
    } else {
      n3 = dia_2X(n3, px, blend);
    }

  } else if (e <= i) {
    n3 = alphaBlend64W(n3, px, blend);
  }
  return [n1, n2, n3];
}

function leftUp2_3X(n7, n5, n6, n2, n8, pixel, blend) {
  const
    blendedN7 = alphaBlend192W(n7, pixel, blend),
    blendedN6 = alphaBlend64W(n6, pixel, blend);
  return [
    blendedN7,
    blendedN7,
    blendedN6,
    blendedN6,pixel
  ];
}

function left2_3X(n7, n5, n6, n8, pixel, blend) {
  return [
    alphaBlend192W(n7, pixel, blend),
    alphaBlend64W(n5, pixel, blend),
    alphaBlend64W(n6, pixel, blend),
    pixel
  ];
}

function up2_3X(n5, n7, n2, n8, pixel, blend) {
  return [
    alphaBlend192W(n5, pixel, blend),
    alphaBlend64W(n7, pixel, blend),
    alphaBlend64W(n2, pixel, blend),
    pixel
  ];
}

function dia_3X(n8, n5, n7, pixel, blend) {
  return [
    alphaBlend224W(n8, pixel, blend),
    alphaBlend32W(n5, pixel, blend),
    alphaBlend32W(n7, pixel, blend)
  ];
}

function kernel3X(pe, pi, ph, pf, pg, pc, pd, pb, f4, i4, h5, i5, n2, n5, n6, n7, n8, blend, useOriginalImplementation) {
  const ex = (pe != ph && pe != pf);
  if (!ex) {
    return [n2, n5, n6, n7, n8];
  }

  const
    e = (yuvDifference(pe, pc) + yuvDifference(pe, pg) + yuvDifference(pi, h5) + yuvDifference(pi, f4)) + (yuvDifference(ph, pf) << 2),
    i = (yuvDifference(ph, pd) + yuvDifference(ph, i5) + yuvDifference(pf, i4) + yuvDifference(pf, pb)) + (yuvDifference(pe, pi) << 2);

  let state;
  if (useOriginalImplementation) {
    state = ((e < i) && (!isEqual(pf, pb) && !isEqual(ph, pd) || isEqual(pe, pi) && (!isEqual(pf, i4) && !isEqual(ph, i5)) || isEqual(pe, pg) || isEqual(pe, pc)));
  } else {
    state = ((e < i) && (!isEqual(pf, pb) && !isEqual(pf, pc) || !isEqual(ph, pd) && !isEqual(ph, pg) || isEqual(pe, pi) && (!isEqual(pf, f4) && !isEqual(pf, i4) || !isEqual(ph, h5) && !isEqual(ph, i5)) || isEqual(pe, pg) || isEqual(pe, pc)));
  }

  if (state) {
    const
      ke = yuvDifference(pf, pg),
      ki = yuvDifference(ph, pc),
      ex2 = (pe != pc && pb != pc),
      ex3 = (pe != pg && pd != pg),
      px = (yuvDifference(pe, pf) <= yuvDifference(pe, ph)) ? pf : ph;
    if (((ke << 1) <= ki) && ex3 && (ke >= (ki << 1)) && ex2) {
      [n7, n5, n6, n2, n8] = leftUp2_3X(n7, n5, n6, n2, n8, px, blend);
    } else if (((ke << 1) <= ki) && ex3) {
      [n7, n5, n6, n8] = left2_3X(n7, n5, n6, n8, px, blend);
    } else if ((ke >= (ki << 1)) && ex2) {
      [n5, n7, n2, n8] = up2_3X(n5, n7, n2, n8, px, blend);
    } else {
      [n8, n5, n7] = dia_3X(n8, n5, n7, px, blend);
    }
  } else if (e <= i) {
    n8 = alphaBlend128W(n8, ((yuvDifference(pe, pf) <= yuvDifference(pe, ph)) ? pf : ph), blend);
  }
  return [n2, n5, n6, n7, n8];
}

// 4xBR
function leftUp2(n15, n14, n11, n13, n12, n10, n7, n3, pixel, blend) {
  const
    blendedN13 = alphaBlend192W(n13, pixel, blend),
    blendedN12 = alphaBlend64W(n12, pixel, blend);

  return [pixel, pixel, pixel, blendedN12, blendedN12, blendedN12, blendedN13, n3];
}

function left2(n15, n14, n11, n13, n12, n10, pixel, blend) {
  n11 = alphaBlend192W(n11, pixel, blend);
  n13 = alphaBlend192W(n13, pixel, blend);
  n10 = alphaBlend64W(n10, pixel, blend);
  n12 = alphaBlend64W(n12, pixel, blend);
  n14 = pixel;
  n15 = pixel;

  return [n15, n14, n11, n13, n12, n10];
}

function up2(n15, n14, n11, n3, n7, n10, pixel, blend) {
  n14 = alphaBlend192W(n14, pixel, blend);
  n7 = alphaBlend192W(n7, pixel, blend);
  n10 = alphaBlend64W(n10, pixel, blend);
  n3 = alphaBlend64W(n3, pixel, blend);
  n11 = pixel;
  n15 = pixel;

  return [n15, n14, n11, n3, n7, n10];
}

function dia(n15, n14, n11, pixel, blend) {
  n11 = alphaBlend128W(n11, pixel, blend);
  n14 = alphaBlend128W(n14, pixel, blend);
  n15 = pixel;

  return [n15, n14, n11];
}

function kernel4Xv2(pe, pi, ph, pf, pg, pc, pd, pb, f4, i4, h5, i5, n15, n14, n11, n3, n7, n10, n13, n12, blend) {
  var ex = (pe != ph && pe != pf);
  if (!ex) {
    return [n15, n14, n11, n3, n7, n10, n13, n12];
  }
  const
    e = (yuvDifference(pe, pc) + yuvDifference(pe, pg) + yuvDifference(pi, h5) + yuvDifference(pi, f4)) + (yuvDifference(ph, pf) << 2),
    i = (yuvDifference(ph, pd) + yuvDifference(ph, i5) + yuvDifference(pf, i4) + yuvDifference(pf, pb)) + (yuvDifference(pe, pi) << 2),
    px = (yuvDifference(pe, pf) <= yuvDifference(pe, ph)) ? pf : ph;
  if ((e < i) && (!isEqual(pf, pb) && !isEqual(ph, pd) || isEqual(pe, pi) && (!isEqual(pf, i4) && !isEqual(ph, i5)) || isEqual(pe, pg) || isEqual(pe, pc))) {
    const
      ke = yuvDifference(pf, pg),
      ki = yuvDifference(ph, pc),
      ex2 = (pe != pc && pb != pc),
      ex3 = (pe != pg && pd != pg);
    if (((ke << 1) <= ki) && ex3 || (ke >= (ki << 1)) && ex2) {
      if (((ke << 1) <= ki) && ex3) {
        [n15, n14, n11, n13, n12, n10] = left2(n15, n14, n11, n13, n12, n10, px, blend);
      }
      if ((ke >= (ki << 1)) && ex2) {
        [n15, n14, n11, n3, n7, n10] = up2(n15, n14, n11, n3, n7, n10, px, blend);
      }
    } else {
      [n15, n14, n11] = dia(n15, n14, n11, px, blend);
    }

  } else if (e <= i) {
    n15 = alphaBlend128W(n15, px, blend);
  }

  return [n15, n14, n11, n3, n7, n10, n13, n12];
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
  /*32bit View (4 bytes: Red,Greed,Blue,Alpha)*/
  const originalPixelView = new Uint32Array(originalImageData.data.buffer);

  /**
   * ImageData scaledImageData
   * Scaled image's data, below this variable is the scaledPixelView,
   * a 32bit ArrayView of the 8bit data array inside the scaledImageData's
   * buffer (scaledImageData.data.buffer)
   **/
  const scaledImageData = context.createImageData(
      scaledWidth,
      scaledHeight);
  /*32bit View (4 bytes: Red,Greed,Blue,Alpha)*/
  const scaledPixelView = new Uint32Array(scaledImageData.data.buffer);
  for (let c = 0; c < sourceWidth; c++) {
    for (let d = 0; d < sourceHeight; d++) {
      computeXbr(originalPixelView, c, d, sourceWidth, sourceHeight, scaledPixelView, c * factor, d * factor, scaledWidth, factor, blendColors);
    }
  }

  canvas.width = scaledWidth;
  canvas.height = scaledHeight;

  context.putImageData(scaledImageData, 0, 0);

  return canvas;
}
