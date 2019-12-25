(function (win) {
  // Options
  var blendColors = true;
  var use3xOriginalImplementation = false;

  const REDMASK = 0x000000FF; // &MASK	>>0
  const GREENMASK = 0x0000FF00; // &MASK	>>8
  const BLUEMASK = 0x00FF0000; // &MASK	>>16
  const ALPHAMASK = 0xFF000000; // &MASK	>>24
  const THRESHHOLD_Y = 48;
  const THRESHHOLD_U = 7;
  const THRESHHOLD_V = 6;

  // Convert an ARGB byte to YUV
  function _getYuv(p) {
    var r = (p & REDMASK);
    var g = (p & GREENMASK) >> 8;
    var b = (p & BLUEMASK) >> 16;
    var y = r * .299000 + g * .587000 + b * .114000;
    var u = r *  - .168736 + g *  - .331264 + b * .500000;
    var v = r * .500000 + g *  - .418688 + b *  - .081312;
    var output = [y, u, v];
	
    return output;
  }

  function _YuvDifference(A, B) {
    var alphaA = (A & ALPHAMASK) >> 24;
    var alphaB = (B & ALPHAMASK) >> 24;

    if (alphaA === 0 && alphaB === 0) {
      return 0;
    }

    if (alphaA === 0 || alphaB === 0) {
      // Very large value not attainable by the thresholds
      return 1000000;
    }

    var yuvA = _getYuv(A);
    var yuvB = _getYuv(B);

    /*Add HQx filters threshold & return*/
    return Math.abs(yuvA[0] - yuvB[0]) * THRESHHOLD_Y
         + Math.abs(yuvA[1] - yuvB[1]) * THRESHHOLD_U
         + Math.abs(yuvA[2] - yuvB[2]) * THRESHHOLD_V;
  }

  function _IsEqual(A, B) {
    var alphaA = (A & ALPHAMASK) >> 24;
    var alphaB = (B & ALPHAMASK) >> 24;

    if (alphaA === 0 && alphaB === 0) {
      return true;
    }

    if (alphaA === 0 || alphaB === 0) {
      return false;
    }

    var yuvA = _getYuv(A);
    var yuvB = _getYuv(B);

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
    var alphaA = (A & ALPHAMASK) >> 24;
    var alphaB = (B & ALPHAMASK) >> 24;

    /*Extract each value from 32bit Uint & blend colors together*/
    var r, g, b ,a;

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
    // TODO: remove to allow alpha channel
    return ((~~r) | ((~~g) << 8) | ((~~b) << 16) | ((~~a) << 24));
  }

  /// <summary>
  /// This is the XBR2x by Hyllian (see http://board.byuu.org/viewtopic.php?f=10&t=2248)
  /// </summary>
  function computeXbr(oriPixelView, oriX, oriY, oriW, oriH, dstPixelView, dstX, dstY, dstW, factor, allowAlphaBlending) {
    var xm2 = oriX - 2;
    if (xm2 < 0) {
      xm2 = 0;
    }
    var xm1 = oriX - 1;
    if (xm1 < 0) {
      xm1 = 0;
    }
    var xp0 = oriX;
    var xp1 = oriX + 1;
    if (xp1 >= oriW) {
      xp1 = oriW - 1;
    }
    var xp2 = oriX + 2;
    if (xp2 >= oriW) {
      xp2 = oriW - 1;
    }

    var ym2 = oriY - 2;
    if (ym2 < 0) {
      ym2 = 0;
    }
    var ym1 = oriY - 1;
    if (ym1 < 0) {
      ym1 = 0;
    }
    var yp0 = oriY;
    var yp1 = oriY + 1;
    if (yp1 >= oriH) {
      yp1 = oriH - 1;
    }
    var yp2 = oriY + 2;
    if (yp2 >= oriH) {
      yp2 = oriH - 1;
    }

    var a1 = oriPixelView[xm1 + ym2 * oriW];
    var b1 = oriPixelView[xp0 + ym2 * oriW];
    var c1 = oriPixelView[xp1 + ym2 * oriW]

      var a0 = oriPixelView[xm2 + ym1 * oriW];
    var pa = oriPixelView[xm1 + ym1 * oriW];
    var pb = oriPixelView[xp0 + ym1 * oriW];
    var pc = oriPixelView[xp1 + ym1 * oriW];
    var c4 = oriPixelView[xp2 + ym1 * oriW];

    var d0 = oriPixelView[xm2 + yp0 * oriW];
    var pd = oriPixelView[xm1 + yp0 * oriW];
    var pe = oriPixelView[xp0 + yp0 * oriW];
    var pf = oriPixelView[xp1 + yp0 * oriW];
    var f4 = oriPixelView[xp2 + yp0 * oriW];

    var g0 = oriPixelView[xm2 + yp1 * oriW];
    var pg = oriPixelView[xm1 + yp1 * oriW];
    var ph = oriPixelView[xp0 + yp1 * oriW];
    var pi = oriPixelView[xp1 + yp1 * oriW];
    var i4 = oriPixelView[xp2 + yp1 * oriW];

    var g5 = oriPixelView[xm1 + yp2 * oriW];
    var h5 = oriPixelView[xp0 + yp2 * oriW];
    var i5 = oriPixelView[xp1 + yp2 * oriW];

    var e0,
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
      var out1 = _Kernel2Xv5(pe, pi, ph, pf, pg, pc, pd, pb, f4, i4, h5, i5, e1, e2, e3, allowAlphaBlending);
      e1 = out1[0];
      e2 = out1[1];
      e3 = out1[2];

      var out2 = _Kernel2Xv5(pe, pc, pf, pb, pi, pa, ph, pd, b1, c1, f4, c4, e0, e3, e1, allowAlphaBlending);
      e0 = out2[0];
      e3 = out2[1];
      e1 = out2[2];

      var out3 = _Kernel2Xv5(pe, pa, pb, pd, pc, pg, pf, ph, d0, a0, b1, a1, e2, e1, e0, allowAlphaBlending);
      e2 = out3[0];
      e1 = out3[1];
      e0 = out3[2];

      var out4 = _Kernel2Xv5(pe, pg, pd, ph, pa, pi, pb, pf, h5, g5, d0, g0, e3, e0, e2, allowAlphaBlending);
      e3 = out4[0];
      e0 = out4[1];
      e2 = out4[2];

      dstPixelView[dstX + dstY * dstW] = e0;
      dstPixelView[dstX + 1 + dstY * dstW] = e1;
      dstPixelView[dstX + (dstY + 1) * dstW] = e2;
      dstPixelView[dstX + 1 + (dstY + 1) * dstW] = e3;
    } else if (factor === 3) {
      var out1 = _Kernel3X(pe, pi, ph, pf, pg, pc, pd, pb, f4, i4, h5, i5, e2, e5, e6, e7, e8, allowAlphaBlending, use3xOriginalImplementation);
      e2 = out1[0];
      e5 = out1[1];
      e6 = out1[2];
      e7 = out1[3];
      e8 = out1[4];
      var out2 = _Kernel3X(pe, pc, pf, pb, pi, pa, ph, pd, b1, c1, f4, c4, e0, e1, e8, e5, e2, allowAlphaBlending, use3xOriginalImplementation);
      e0 = out2[0];
      e1 = out2[1];
      e8 = out2[2];
      e5 = out2[3];
      e2 = out2[4];
      var out3 = _Kernel3X(pe, pa, pb, pd, pc, pg, pf, ph, d0, a0, b1, a1, e6, e3, e2, e1, e0, allowAlphaBlending, use3xOriginalImplementation);
      e6 = out3[0];
      e3 = out3[1];
      e2 = out3[2];
      e1 = out3[3];
      e0 = out3[4];
      var out4 = _Kernel3X(pe, pg, pd, ph, pa, pi, pb, pf, h5, g5, d0, g0, e8, e7, e0, e3, e6, allowAlphaBlending, use3xOriginalImplementation);
      e8 = out4[0];
      e7 = out4[1];
      e0 = out4[2];
      e3 = out4[3];
      e6 = out4[4];

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
      var out1 = _Kernel4Xv2(pe, pi, ph, pf, pg, pc, pd, pb, f4, i4, h5, i5, ef, ee, eb, e3, e7, ea, ed, ec, allowAlphaBlending);
      ef = out1[0];
      ee = out1[1];
      eb = out1[2];
      e3 = out1[3];
      e7 = out1[4];
      ea = out1[5];
      ed = out1[6];
      ec = out1[7];
      var out2 = _Kernel4Xv2(pe, pc, pf, pb, pi, pa, ph, pd, b1, c1, f4, c4, e3, e7, e2, e0, e1, e6, eb, ef, allowAlphaBlending);
      e3 = out2[0];
      e7 = out2[1];
      e2 = out2[2];
      e0 = out2[3];
      e1 = out2[4];
      e6 = out2[5];
      eb = out2[6];
      ef = out2[7];
      var out3 = _Kernel4Xv2(pe, pa, pb, pd, pc, pg, pf, ph, d0, a0, b1, a1, e0, e1, e4, ec, e8, e5, e2, e3, allowAlphaBlending);
      e0 = out3[0];
      e1 = out3[1];
      e4 = out3[2];
      ec = out3[3];
      e8 = out3[4];
      e5 = out3[5];
      e2 = out3[6];
      e3 = out3[7];
      var out4 = _Kernel4Xv2(pe, pg, pd, ph, pa, pi, pb, pf, h5, g5, d0, g0, ec, e8, ed, ef, ee, e9, e4, e0, allowAlphaBlending);
      ec = out4[0];
      e8 = out4[1];
      ed = out4[2];
      ef = out4[3];
      ee = out4[4];
      e9 = out4[5];
      e4 = out4[6];
      e0 = out4[7];

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

  function _AlphaBlend32W(dst, src, blend) {
    if (blend) {
      dst = pixelInterpolate(dst, src, 7, 1);
    }

    return dst;
  }

  function _AlphaBlend64W(dst, src, blend) {
    if (blend) {
      dst = pixelInterpolate(dst, src, 3, 1);
    }
    return dst;
  }

  function _AlphaBlend128W(dst, src, blend) {
    if (blend) {
      dst = pixelInterpolate(dst, src, 1, 1);
    }
    return dst;
  }

  function _AlphaBlend192W(dst, src, blend) {
    if (blend) {
      dst = pixelInterpolate(dst, src, 1, 3);
    } else {
      dst = src;
    }
    return dst;
  }

  function _AlphaBlend224W(dst, src, blend) {
    if (blend) {
      dst = pixelInterpolate(dst, src, 1, 7);
    } else {
      dst = src;
    }
    return dst;
  }

  function _LeftUp2_2X(n3, n2, pixel, blend) {
    n3 = _AlphaBlend224W(n3, pixel, blend);
    n2 = _AlphaBlend64W(n2, pixel, blend);
    n1 = n2;
    return [n3, n2, n1];
  }

  function _Left2_2X(n3, n2, pixel, blend) {
    n3 = _AlphaBlend192W(n3, pixel, blend);
    n2 = _AlphaBlend64W(n2, pixel, blend);
    return [n3, n2];
  }
  function _Up2_2X(n3, n1, pixel, blend) {
    n3 = _AlphaBlend192W(n3, pixel, blend);
    n1 = _AlphaBlend64W(n1, pixel, blend);
    return [n3, n1];
  }

  function _Dia_2X(n3, pixel, blend) {
    return _AlphaBlend128W(n3, pixel, blend);
  }

  function _Kernel2Xv5(pe, pi, ph, pf, pg, pc, pd, pb, f4, i4, h5, i5, n1, n2, n3, blend) {
    var ex = (pe != ph && pe != pf);
    if (!ex) {
      return [n1, n2, n3];
    }
    var e = (_YuvDifference(pe, pc) + _YuvDifference(pe, pg) + _YuvDifference(pi, h5) + _YuvDifference(pi, f4)) + (_YuvDifference(ph, pf) << 2);
    var i = (_YuvDifference(ph, pd) + _YuvDifference(ph, i5) + _YuvDifference(pf, i4) + _YuvDifference(pf, pb)) + (_YuvDifference(pe, pi) << 2);
    var px = (_YuvDifference(pe, pf) <= _YuvDifference(pe, ph)) ? pf : ph;
    if ((e < i) && (!_IsEqual(pf, pb) && !_IsEqual(ph, pd) || _IsEqual(pe, pi) && (!_IsEqual(pf, i4) && !_IsEqual(ph, i5)) || _IsEqual(pe, pg) || _IsEqual(pe, pc))) {
      var ke = _YuvDifference(pf, pg);
      var ki = _YuvDifference(ph, pc);
      var ex2 = (pe != pc && pb != pc);
      var ex3 = (pe != pg && pd != pg);
      if (((ke << 1) <= ki) && ex3 || (ke >= (ki << 1)) && ex2) {
        if (((ke << 1) <= ki) && ex3) {
          var leftOut = _Left2_2X(n3, n2, px, blend);
          n3 = leftOut[0];
          n2 = leftOut[1];
        }
        if ((ke >= (ki << 1)) && ex2) {
          var upOut = _Up2_2X(n3, n1, px, blend);
          n3 = upOut[0];
          n1 = upOut[1];
        }
      } else {
        n3 = _Dia_2X(n3, px, blend);
      }

    } else if (e <= i) {
      n3 = _AlphaBlend64W(n3, px, blend);
    }
    return [n1, n2, n3];
  }

  function _LeftUp2_3X(n7, n5, n6, n2, n8, pixel, blend) {
    n7 = _AlphaBlend192W(n7, pixel, blend);
    n6 = _AlphaBlend64W(n6, pixel, blend);
    n5 = n7;
    n2 = n6;
    n8 = pixel;
    return [n7, n5, n6, n2, n8];
  }

  function _Left2_3X(n7, n5, n6, n8, pixel, blend) {
    n7 = _AlphaBlend192W(n7, pixel, blend);
    n5 = _AlphaBlend64W(n5, pixel, blend);
    n6 = _AlphaBlend64W(n6, pixel, blend);
    n8 = pixel;
    return [n7, n5, n6, n8];
  }

  function _Up2_3X(n5, n7, n2, n8, pixel, blend) {
    n5 = _AlphaBlend192W(n5, pixel, blend);
    n7 = _AlphaBlend64W(n7, pixel, blend);
    n2 = _AlphaBlend64W(n2, pixel, blend);
    n8 = pixel;
    return [n5, n7, n2, n8];
  }

  function _Dia_3X(n8, n5, n7, pixel, blend) {
    n8 = _AlphaBlend224W(n8, pixel, blend);
    n5 = _AlphaBlend32W(n5, pixel, blend);
    n7 = _AlphaBlend32W(n7, pixel, blend);
    return [n8, n5, n7];
  }

  function _Kernel3X(pe, pi, ph, pf, pg, pc, pd, pb, f4, i4, h5, i5, n2, n5, n6, n7, n8, blend, useOriginalImplementation) {
    var ex = (pe != ph && pe != pf);
    if (!ex) {
      return [n2, n5, n6, n7, n8];
    }

    var e = (_YuvDifference(pe, pc) + _YuvDifference(pe, pg) + _YuvDifference(pi, h5) + _YuvDifference(pi, f4)) + (_YuvDifference(ph, pf) << 2);
    var i = (_YuvDifference(ph, pd) + _YuvDifference(ph, i5) + _YuvDifference(pf, i4) + _YuvDifference(pf, pb)) + (_YuvDifference(pe, pi) << 2);

    var state;
    if (useOriginalImplementation) {
      state = ((e < i) && (!_IsEqual(pf, pb) && !_IsEqual(ph, pd) || _IsEqual(pe, pi) && (!_IsEqual(pf, i4) && !_IsEqual(ph, i5)) || _IsEqual(pe, pg) || _IsEqual(pe, pc)));
    } else {
      state = ((e < i) && (!_IsEqual(pf, pb) && !_IsEqual(pf, pc) || !_IsEqual(ph, pd) && !_IsEqual(ph, pg) || _IsEqual(pe, pi) && (!_IsEqual(pf, f4) && !_IsEqual(pf, i4) || !_IsEqual(ph, h5) && !_IsEqual(ph, i5)) || _IsEqual(pe, pg) || _IsEqual(pe, pc)));
    }

    if (state) {
      var ke = _YuvDifference(pf, pg);
      var ki = _YuvDifference(ph, pc);
      var ex2 = (pe != pc && pb != pc);
      var ex3 = (pe != pg && pd != pg);
      var px = (_YuvDifference(pe, pf) <= _YuvDifference(pe, ph)) ? pf : ph;
      if (((ke << 1) <= ki) && ex3 && (ke >= (ki << 1)) && ex2) {
        var leftUpOut = _LeftUp2_3X(n7, n5, n6, n2, n8, px, blend);
        n7 = leftUpOut[0];
        n5 = leftUpOut[1];
        n6 = leftUpOut[2];
        n2 = leftUpOut[3];
        n8 = leftUpOut[4];
      } else if (((ke << 1) <= ki) && ex3) {
        var leftOut = _Left2_3X(n7, n5, n6, n8, px, blend);
        n7 = leftOut[0];
        n5 = leftOut[1];
        n6 = leftOut[2];
        n8 = leftOut[3];
      } else if ((ke >= (ki << 1)) && ex2) {
        var upOut = _Up2_3X(n5, n7, n2, n8, px, blend);
        n5 = upOut[0];
        n7 = upOut[1];
        n2 = upOut[2];
        n8 = upOut[3];
      } else {
        var diaOut = _Dia_3X(n8, n5, n7, px, blend);
        n8 = diaOut[0];
        n5 = diaOut[1];
        n7 = diaOut[2];
      }
    } else if (e <= i) {
      n8 = _AlphaBlend128W(n8, ((_YuvDifference(pe, pf) <= _YuvDifference(pe, ph)) ? pf : ph), blend);
    }
    return [n2, n5, n6, n7, n8];
  }

  // 4xBR
  function _LeftUp2(n15, n14, n11, n13, n12, n10, n7, n3, pixel, blend) {
    n13 = _AlphaBlend192W(n13, pixel, blend);
    n12 = _AlphaBlend64W(n12, pixel, blend);
    n15 = n14 = n11 = pixel;
    n10 = n3 = n12;
    n7 = n13;

    return [n15, n14, n11, n13, n12, n10, n7, n3];
  }

  function _Left2(n15, n14, n11, n13, n12, n10, pixel, blend) {
    n11 = _AlphaBlend192W(n11, pixel, blend);
    n13 = _AlphaBlend192W(n13, pixel, blend);
    n10 = _AlphaBlend64W(n10, pixel, blend);
    n12 = _AlphaBlend64W(n12, pixel, blend);
    n14 = pixel;
    n15 = pixel;

    return [n15, n14, n11, n13, n12, n10];
  }

  function _Up2(n15, n14, n11, n3, n7, n10, pixel, blend) {
    n14 = _AlphaBlend192W(n14, pixel, blend);
    n7 = _AlphaBlend192W(n7, pixel, blend);
    n10 = _AlphaBlend64W(n10, pixel, blend);
    n3 = _AlphaBlend64W(n3, pixel, blend);
    n11 = pixel;
    n15 = pixel;

    return [n15, n14, n11, n3, n7, n10];
  }

  function _Dia(n15, n14, n11, pixel, blend) {
    n11 = _AlphaBlend128W(n11, pixel, blend);
    n14 = _AlphaBlend128W(n14, pixel, blend);
    n15 = pixel;

    return [n15, n14, n11];
  }

  function _Kernel4Xv2(pe, pi, ph, pf, pg, pc, pd, pb, f4, i4, h5, i5, n15, n14, n11, n3, n7, n10, n13, n12, blend) {
    var ex = (pe != ph && pe != pf);
    if (!ex) {
      return [n15, n14, n11, n3, n7, n10, n13, n12];
    }
    var e = (_YuvDifference(pe, pc) + _YuvDifference(pe, pg) + _YuvDifference(pi, h5) + _YuvDifference(pi, f4)) + (_YuvDifference(ph, pf) << 2);
    var i = (_YuvDifference(ph, pd) + _YuvDifference(ph, i5) + _YuvDifference(pf, i4) + _YuvDifference(pf, pb)) + (_YuvDifference(pe, pi) << 2);
    var px = (_YuvDifference(pe, pf) <= _YuvDifference(pe, ph)) ? pf : ph;
    if ((e < i) && (!_IsEqual(pf, pb) && !_IsEqual(ph, pd) || _IsEqual(pe, pi) && (!_IsEqual(pf, i4) && !_IsEqual(ph, i5)) || _IsEqual(pe, pg) || _IsEqual(pe, pc))) {
      var ke = _YuvDifference(pf, pg);
      var ki = _YuvDifference(ph, pc);
      var ex2 = (pe != pc && pb != pc);
      var ex3 = (pe != pg && pd != pg);
      if (((ke << 1) <= ki) && ex3 || (ke >= (ki << 1)) && ex2) {
        if (((ke << 1) <= ki) && ex3) {
          var leftOut = _Left2(n15, n14, n11, n13, n12, n10, px, blend);
          n15 = leftOut[0];
          n14 = leftOut[1];
          n11 = leftOut[2];
          n13 = leftOut[3];
          n12 = leftOut[4];
          n10 = leftOut[5];
        }
        if ((ke >= (ki << 1)) && ex2) {
          var upOut = _Up2(n15, n14, n11, n3, n7, n10, px, blend);
          n15 = upOut[0];
          n14 = upOut[1];
          n11 = upOut[2];
          n3 = upOut[3];
          n7 = upOut[4];
          n10 = upOut[5];
        }
      } else {
        var diaOut = _Dia(n15, n14, n11, px, blend);
        n15 = diaOut[0];
        n14 = diaOut[1];
        n11 = diaOut[2];

      }

    } else if (e <= i) {
      n15 = _AlphaBlend128W(n15, px, blend);
    }

    return [n15, n14, n11, n3, n7, n10, n13, n12];
  }

  function applyXBR(image, factor) {

    var canvas = document.createElement("canvas");
    var sourceWidth = image.width;
    var sourceHeight = image.height;
    canvas.width = sourceWidth;
    canvas.height = sourceHeight;

    var context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);

    var scaledWidth = sourceWidth * factor;
    var scaledHeight = sourceHeight * factor;
    var originalImageData = context.getImageData(
        0,
        0,
        sourceWidth,
        sourceHeight);
    /*32bit View (4 bytes: Red,Greed,Blue,Alpha)*/
    var originalPixelView = new Uint32Array(originalImageData.data.buffer);

    /**
     * ImageData scaledImageData
     * Scaled image's data, below this variable is the scaledPixelView,
     * a 32bit ArrayView of the 8bit data array inside the scaledImageData's
     * buffer (scaledImageData.data.buffer)
     **/
    var scaledImageData = context.createImageData(
        scaledWidth,
        scaledHeight);
    /*32bit View (4 bytes: Red,Greed,Blue,Alpha)*/
    var scaledPixelView = new Uint32Array(scaledImageData.data.buffer);
    for (var c = 0; c < sourceWidth; c++) {
      for (var d = 0; d < sourceHeight; d++) {
        computeXbr(originalPixelView, c, d, sourceWidth, sourceHeight, scaledPixelView, c * factor, d * factor, scaledWidth, factor, blendColors);
      }
    }

    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    context.putImageData(scaledImageData, 0, 0);

    return canvas;
  }
  
  // Expose function
  win.applyXBR = applyXBR;
})(window);
