(function () {
	'use strict';

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var tinycolor = createCommonjsModule(function (module) {
	// TinyColor v1.4.1
	// https://github.com/bgrins/TinyColor
	// Brian Grinstead, MIT License

	(function(Math) {
	  var trimLeft = /^\s+/,
	  trimRight = /\s+$/,
	  tinyCounter = 0,
	  mathRound = Math.round,
	  mathMin = Math.min,
	  mathMax = Math.max,
	  mathRandom = Math.random;

	  function tinycolor (color, opts) {

	    color = (color) ? color : '';
	    opts = opts || { };

	    // If input is already a tinycolor, return itself
	    if (color instanceof tinycolor) {
	     return color;
	   }
	    // If we are called as a function, call using new instead
	    if (!(this instanceof tinycolor)) {
	      return new tinycolor(color, opts);
	    }

	    var rgb = inputToRGB(color);
	    this._originalInput = color,
	    this._r = rgb.r,
	    this._g = rgb.g,
	    this._b = rgb.b,
	    this._a = rgb.a,
	    this._roundA = mathRound(100*this._a) / 100,
	    this._format = opts.format || rgb.format;
	    this._gradientType = opts.gradientType;

	    // Don't let the range of [0,255] come back in [0,1].
	    // Potentially lose a little bit of precision here, but will fix issues where
	    // .5 gets interpreted as half of the total, instead of half of 1
	    // If it was supposed to be 128, this was already taken care of by `inputToRgb`
	    if (this._r < 1) { this._r = mathRound(this._r); }
	    if (this._g < 1) { this._g = mathRound(this._g); }
	    if (this._b < 1) { this._b = mathRound(this._b); }

	    this._ok = rgb.ok;
	    this._tc_id = tinyCounter++;
	  }

	  tinycolor.prototype = {
	    isDark: function() {
	      return this.getBrightness() < 128;
	    },
	    isLight: function() {
	      return !this.isDark();
	    },
	    isValid: function() {
	      return this._ok;
	    },
	    getOriginalInput: function() {
	      return this._originalInput;
	    },
	    getFormat: function() {
	      return this._format;
	    },
	    getAlpha: function() {
	      return this._a;
	    },
	    getBrightness: function() {
	        //http://www.w3.org/TR/AERT#color-contrast
	        var rgb = this.toRgb();
	        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
	      },
	      getLuminance: function() {
	        //http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
	        var rgb = this.toRgb();
	        var RsRGB, GsRGB, BsRGB, R, G, B;
	        RsRGB = rgb.r/255;
	        GsRGB = rgb.g/255;
	        BsRGB = rgb.b/255;

	        if (RsRGB <= 0.03928) {R = RsRGB / 12.92;} else {R = Math.pow(((RsRGB + 0.055) / 1.055), 2.4);}
	        if (GsRGB <= 0.03928) {G = GsRGB / 12.92;} else {G = Math.pow(((GsRGB + 0.055) / 1.055), 2.4);}
	        if (BsRGB <= 0.03928) {B = BsRGB / 12.92;} else {B = Math.pow(((BsRGB + 0.055) / 1.055), 2.4);}
	        return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
	      },
	      setAlpha: function(value) {
	        this._a = boundAlpha(value);
	        this._roundA = mathRound(100*this._a) / 100;
	        return this;
	      },
	      toHsv: function() {
	        var hsv = rgbToHsv(this._r, this._g, this._b);
	        return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a };
	      },
	      toHsvString: function() {
	        var hsv = rgbToHsv(this._r, this._g, this._b);
	        var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
	        return (this._a == 1) ?
	        "hsv("  + h + ", " + s + "%, " + v + "%)" :
	        "hsva(" + h + ", " + s + "%, " + v + "%, "+ this._roundA + ")";
	      },
	      toHsl: function() {
	        var hsl = rgbToHsl(this._r, this._g, this._b);
	        return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a };
	      },
	      toHslString: function() {
	        var hsl = rgbToHsl(this._r, this._g, this._b);
	        var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
	        return (this._a == 1) ?
	        "hsl("  + h + ", " + s + "%, " + l + "%)" :
	        "hsla(" + h + ", " + s + "%, " + l + "%, "+ this._roundA + ")";
	      },
	      toHex: function(allow3Char) {
	        return rgbToHex(this._r, this._g, this._b, allow3Char);
	      },
	      toHexString: function(allow3Char) {
	        return '#' + this.toHex(allow3Char);
	      },
	      toHex8: function(allow4Char) {
	        return rgbaToHex(this._r, this._g, this._b, this._a, allow4Char);
	      },
	      toHex8String: function(allow4Char) {
	        return '#' + this.toHex8(allow4Char);
	      },
	      toRgb: function() {
	        return { r: mathRound(this._r), g: mathRound(this._g), b: mathRound(this._b), a: this._a };
	      },
	      toRgbString: function() {
	        return (this._a == 1) ?
	        "rgb("  + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" :
	        "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
	      },
	      toPercentageRgb: function() {
	        return { r: mathRound(bound01(this._r, 255) * 100) + "%", g: mathRound(bound01(this._g, 255) * 100) + "%", b: mathRound(bound01(this._b, 255) * 100) + "%", a: this._a };
	      },
	      toPercentageRgbString: function() {
	        return (this._a == 1) ?
	        "rgb("  + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" :
	        "rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
	      },
	      toName: function() {
	        if (this._a === 0) {
	          return "transparent";
	        }

	        if (this._a < 1) {
	          return false;
	        }

	        return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
	      },
	      toString: function(format) {
	        var formatSet = !!format;
	        format = format || this._format;

	        var formattedString = false;
	        var hasAlpha = this._a < 1 && this._a >= 0;
	        var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "hex4" || format === "hex8" || format === "name");

	        if (needsAlphaFormat) {
	            // Special case for "transparent", all other non-alpha formats
	            // will return rgba when there is transparency.
	            if (format === "name" && this._a === 0) {
	              return this.toName();
	            }
	            return this.toRgbString();
	          }
	          if (format === "rgb") {
	            formattedString = this.toRgbString();
	          }
	          if (format === "prgb") {
	            formattedString = this.toPercentageRgbString();
	          }
	          if (format === "hex" || format === "hex6") {
	            formattedString = this.toHexString();
	          }
	          if (format === "hex3") {
	            formattedString = this.toHexString(true);
	          }
	          if (format === "hex4") {
	            formattedString = this.toHex8String(true);
	          }
	          if (format === "hex8") {
	            formattedString = this.toHex8String();
	          }
	          if (format === "name") {
	            formattedString = this.toName();
	          }
	          if (format === "hsl") {
	            formattedString = this.toHslString();
	          }
	          if (format === "hsv") {
	            formattedString = this.toHsvString();
	          }

	          return formattedString || this.toHexString();
	        },
	        clone: function() {
	          return tinycolor(this.toString());
	        },

	        _applyModification: function(fn, args) {
	          var color = fn.apply(null, [this].concat([].slice.call(args)));
	          this._r = color._r;
	          this._g = color._g;
	          this._b = color._b;
	          this.setAlpha(color._a);
	          return this;
	        },
	        lighten: function() {
	          return this._applyModification(lighten, arguments);
	        },
	        brighten: function() {
	          return this._applyModification(brighten, arguments);
	        },
	        darken: function() {
	          return this._applyModification(darken, arguments);
	        },
	        desaturate: function() {
	          return this._applyModification(desaturate, arguments);
	        },
	        saturate: function() {
	          return this._applyModification(saturate, arguments);
	        },
	        greyscale: function() {
	          return this._applyModification(greyscale, arguments);
	        },
	        spin: function() {
	          return this._applyModification(spin, arguments);
	        },

	        _applyCombination: function(fn, args) {
	          return fn.apply(null, [this].concat([].slice.call(args)));
	        },
	        analogous: function() {
	          return this._applyCombination(analogous, arguments);
	        },
	        complement: function() {
	          return this._applyCombination(complement, arguments);
	        },
	        monochromatic: function() {
	          return this._applyCombination(monochromatic, arguments);
	        },
	        splitcomplement: function() {
	          return this._applyCombination(splitcomplement, arguments);
	        },
	        triad: function() {
	          return this._applyCombination(triad, arguments);
	        },
	        tetrad: function() {
	          return this._applyCombination(tetrad, arguments);
	        }
	      };

	// If input is an object, force 1 into "1.0" to handle ratios properly
	// String input requires "1.0" as input, so 1 will be treated as 1
	tinycolor.fromRatio = function(color, opts) {
	  if (typeof color == "object") {
	    var newColor = {};
	    for (var i in color) {
	      if (color.hasOwnProperty(i)) {
	        if (i === "a") {
	          newColor[i] = color[i];
	        }
	        else {
	          newColor[i] = convertToPercentage(color[i]);
	        }
	      }
	    }
	    color = newColor;
	  }

	  return tinycolor(color, opts);
	};

	// Given a string or object, convert that input to RGB
	// Possible string inputs:
	//
	//     "red"
	//     "#f00" or "f00"
	//     "#ff0000" or "ff0000"
	//     "#ff000000" or "ff000000"
	//     "rgb 255 0 0" or "rgb (255, 0, 0)"
	//     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
	//     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
	//     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
	//     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
	//     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
	//     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
	//
	function inputToRGB(color) {

	  var rgb = { r: 0, g: 0, b: 0 };
	  var a = 1;
	  var s = null;
	  var v = null;
	  var l = null;
	  var ok = false;
	  var format = false;

	  if (typeof color == "string") {
	    color = stringInputToObject(color);
	  }

	  if (typeof color == "object") {
	    if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
	      rgb = rgbToRgb(color.r, color.g, color.b);
	      ok = true;
	      format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
	    }
	    else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
	      s = convertToPercentage(color.s);
	      v = convertToPercentage(color.v);
	      rgb = hsvToRgb(color.h, s, v);
	      ok = true;
	      format = "hsv";
	    }
	    else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
	      s = convertToPercentage(color.s);
	      l = convertToPercentage(color.l);
	      rgb = hslToRgb(color.h, s, l);
	      ok = true;
	      format = "hsl";
	    }

	    if (color.hasOwnProperty("a")) {
	      a = color.a;
	    }
	  }

	  a = boundAlpha(a);

	  return {
	    ok: ok,
	    format: color.format || format,
	    r: mathMin(255, mathMax(rgb.r, 0)),
	    g: mathMin(255, mathMax(rgb.g, 0)),
	    b: mathMin(255, mathMax(rgb.b, 0)),
	    a: a
	  };
	}


	// Conversion Functions
	// --------------------

	// `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
	// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

	// `rgbToRgb`
	// Handle bounds / percentage checking to conform to CSS color spec
	// <http://www.w3.org/TR/css3-color/>
	// *Assumes:* r, g, b in [0, 255] or [0, 1]
	// *Returns:* { r, g, b } in [0, 255]
	function rgbToRgb(r, g, b){
	  return {
	    r: bound01(r, 255) * 255,
	    g: bound01(g, 255) * 255,
	    b: bound01(b, 255) * 255
	  };
	}

	// `rgbToHsl`
	// Converts an RGB color value to HSL.
	// *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
	// *Returns:* { h, s, l } in [0,1]
	function rgbToHsl(r, g, b) {

	  r = bound01(r, 255);
	  g = bound01(g, 255);
	  b = bound01(b, 255);

	  var max = mathMax(r, g, b), min = mathMin(r, g, b);
	  var h, s, l = (max + min) / 2;

	  if(max == min) {
	        h = s = 0; // achromatic
	      }
	      else {
	        var d = max - min;
	        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	        switch(max) {
	          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
	          case g: h = (b - r) / d + 2; break;
	          case b: h = (r - g) / d + 4; break;
	        }

	        h /= 6;
	      }

	      return { h: h, s: s, l: l };
	    }

	// `hslToRgb`
	// Converts an HSL color value to RGB.
	// *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
	// *Returns:* { r, g, b } in the set [0, 255]
	function hslToRgb(h, s, l) {
	  var r, g, b;

	  h = bound01(h, 360);
	  s = bound01(s, 100);
	  l = bound01(l, 100);

	  function hue2rgb(p, q, t) {
	    if(t < 0) t += 1;
	    if(t > 1) t -= 1;
	    if(t < 1/6) return p + (q - p) * 6 * t;
	    if(t < 1/2) return q;
	    if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
	    return p;
	  }

	  if(s === 0) {
	        r = g = b = l; // achromatic
	      }
	      else {
	        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	        var p = 2 * l - q;
	        r = hue2rgb(p, q, h + 1/3);
	        g = hue2rgb(p, q, h);
	        b = hue2rgb(p, q, h - 1/3);
	      }

	      return { r: r * 255, g: g * 255, b: b * 255 };
	    }

	// `rgbToHsv`
	// Converts an RGB color value to HSV
	// *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
	// *Returns:* { h, s, v } in [0,1]
	function rgbToHsv(r, g, b) {

	  r = bound01(r, 255);
	  g = bound01(g, 255);
	  b = bound01(b, 255);

	  var max = mathMax(r, g, b), min = mathMin(r, g, b);
	  var h, s, v = max;

	  var d = max - min;
	  s = max === 0 ? 0 : d / max;

	  if(max == min) {
	        h = 0; // achromatic
	      }
	      else {
	        switch(max) {
	          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
	          case g: h = (b - r) / d + 2; break;
	          case b: h = (r - g) / d + 4; break;
	        }
	        h /= 6;
	      }
	      return { h: h, s: s, v: v };
	    }

	// `hsvToRgb`
	// Converts an HSV color value to RGB.
	// *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
	// *Returns:* { r, g, b } in the set [0, 255]
	function hsvToRgb(h, s, v) {

	  h = bound01(h, 360) * 6;
	  s = bound01(s, 100);
	  v = bound01(v, 100);

	  var i = Math.floor(h),
	  f = h - i,
	  p = v * (1 - s),
	  q = v * (1 - f * s),
	  t = v * (1 - (1 - f) * s),
	  mod = i % 6,
	  r = [v, q, p, p, t, v][mod],
	  g = [t, v, v, q, p, p][mod],
	  b = [p, p, t, v, v, q][mod];

	  return { r: r * 255, g: g * 255, b: b * 255 };
	}

	// `rgbToHex`
	// Converts an RGB color to hex
	// Assumes r, g, and b are contained in the set [0, 255]
	// Returns a 3 or 6 character hex
	function rgbToHex(r, g, b, allow3Char) {

	  var hex = [
	  pad2(mathRound(r).toString(16)),
	  pad2(mathRound(g).toString(16)),
	  pad2(mathRound(b).toString(16))
	  ];

	    // Return a 3 character hex if possible
	    if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
	      return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
	    }

	    return hex.join("");
	  }

	// `rgbaToHex`
	// Converts an RGBA color plus alpha transparency to hex
	// Assumes r, g, b are contained in the set [0, 255] and
	// a in [0, 1]. Returns a 4 or 8 character rgba hex
	function rgbaToHex(r, g, b, a, allow4Char) {

	  var hex = [
	  pad2(mathRound(r).toString(16)),
	  pad2(mathRound(g).toString(16)),
	  pad2(mathRound(b).toString(16)),
	  pad2(convertDecimalToHex(a))
	  ];

	    // Return a 4 character hex if possible
	    if (allow4Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1) && hex[3].charAt(0) == hex[3].charAt(1)) {
	      return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
	    }

	    return hex.join("");
	  }

	// `rgbaToArgbHex`
	// Converts an RGBA color to an ARGB Hex8 string
	// Rarely used, but required for "toFilter()"
	function rgbaToArgbHex(r, g, b, a) {

	  var hex = [
	  pad2(convertDecimalToHex(a)),
	  pad2(mathRound(r).toString(16)),
	  pad2(mathRound(g).toString(16)),
	  pad2(mathRound(b).toString(16))
	  ];

	  return hex.join("");
	}

	// `equals`
	// Can be called with any tinycolor input
	tinycolor.equals = function (color1, color2) {
	  if (!color1 || !color2) { return false; }
	  return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
	};


	// Modification Functions
	// ----------------------
	// Thanks to less.js for some of the basics here
	// <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>

	function desaturate(color, amount) {
	  amount = (amount === 0) ? 0 : (amount || 10);
	  var hsl = tinycolor(color).toHsl();
	  hsl.s -= amount / 100;
	  hsl.s = clamp01(hsl.s);
	  return tinycolor(hsl);
	}

	function saturate(color, amount) {
	  amount = (amount === 0) ? 0 : (amount || 10);
	  var hsl = tinycolor(color).toHsl();
	  hsl.s += amount / 100;
	  hsl.s = clamp01(hsl.s);
	  return tinycolor(hsl);
	}

	function greyscale(color) {
	  return tinycolor(color).desaturate(100);
	}

	function lighten (color, amount) {
	  amount = (amount === 0) ? 0 : (amount || 10);
	  var hsl = tinycolor(color).toHsl();
	  hsl.l += amount / 100;
	  hsl.l = clamp01(hsl.l);
	  return tinycolor(hsl);
	}

	function brighten(color, amount) {
	  amount = (amount === 0) ? 0 : (amount || 10);
	  var rgb = tinycolor(color).toRgb();
	  rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * - (amount / 100))));
	  rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * - (amount / 100))));
	  rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * - (amount / 100))));
	  return tinycolor(rgb);
	}

	function darken (color, amount) {
	  amount = (amount === 0) ? 0 : (amount || 10);
	  var hsl = tinycolor(color).toHsl();
	  hsl.l -= amount / 100;
	  hsl.l = clamp01(hsl.l);
	  return tinycolor(hsl);
	}

	// Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
	// Values outside of this range will be wrapped into this range.
	function spin(color, amount) {
	  var hsl = tinycolor(color).toHsl();
	  var hue = (hsl.h + amount) % 360;
	  hsl.h = hue < 0 ? 360 + hue : hue;
	  return tinycolor(hsl);
	}

	// Combination Functions
	// ---------------------
	// Thanks to jQuery xColor for some of the ideas behind these
	// <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

	function complement(color) {
	  var hsl = tinycolor(color).toHsl();
	  hsl.h = (hsl.h + 180) % 360;
	  return tinycolor(hsl);
	}

	function triad(color) {
	  var hsl = tinycolor(color).toHsl();
	  var h = hsl.h;
	  return [
	  tinycolor(color),
	  tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
	  tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
	  ];
	}

	function tetrad(color) {
	  var hsl = tinycolor(color).toHsl();
	  var h = hsl.h;
	  return [
	  tinycolor(color),
	  tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
	  tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
	  tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
	  ];
	}

	function splitcomplement(color) {
	  var hsl = tinycolor(color).toHsl();
	  var h = hsl.h;
	  return [
	  tinycolor(color),
	  tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
	  tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l})
	  ];
	}

	function analogous(color, results, slices) {
	  results = results || 6;
	  slices = slices || 30;

	  var hsl = tinycolor(color).toHsl();
	  var part = 360 / slices;
	  var ret = [tinycolor(color)];

	  for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results; ) {
	    hsl.h = (hsl.h + part) % 360;
	    ret.push(tinycolor(hsl));
	  }
	  return ret;
	}

	function monochromatic(color, results) {
	  results = results || 6;
	  var hsv = tinycolor(color).toHsv();
	  var h = hsv.h, s = hsv.s, v = hsv.v;
	  var ret = [];
	  var modification = 1 / results;

	  while (results--) {
	    ret.push(tinycolor({ h: h, s: s, v: v}));
	    v = (v + modification) % 1;
	  }

	  return ret;
	}

	// Big List of Colors
	// ------------------
	// <http://www.w3.org/TR/css3-color/#svg-color>
	var names = tinycolor.names = {};

	// Make it easy to access colors via `hexNames[hex]`
	var hexNames = tinycolor.hexNames = flip(names);


	// Utilities
	// ---------

	// `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
	function flip(o) {
	  var flipped = { };
	  for (var i in o) {
	    if (o.hasOwnProperty(i)) {
	      flipped[o[i]] = i;
	    }
	  }
	  return flipped;
	}

	// Return a valid alpha value [0,1] with all invalid values being set to 1
	function boundAlpha(a) {
	  a = parseFloat(a);

	  if (isNaN(a) || a < 0 || a > 1) {
	    a = 1;
	  }

	  return a;
	}

	// Take input from [0, n] and return it as [0, 1]
	function bound01(n, max) {
	  if (isOnePointZero(n)) { n = "100%"; }

	  var processPercent = isPercentage(n);
	  n = mathMin(max, mathMax(0, parseFloat(n)));

	    // Automatically convert percentage into number
	    if (processPercent) {
	      n = parseInt(n * max, 10) / 100;
	    }

	    // Handle floating point rounding errors
	    if ((Math.abs(n - max) < 0.000001)) {
	      return 1;
	    }

	    // Convert into [0, 1] range if it isn't already
	    return (n % max) / parseFloat(max);
	  }

	// Force a number between 0 and 1
	function clamp01(val) {
	  return mathMin(1, mathMax(0, val));
	}

	// Parse a base-16 hex value into a base-10 integer
	function parseIntFromHex(val) {
	  return parseInt(val, 16);
	}

	// Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
	// <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
	function isOnePointZero(n) {
	  return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
	}

	// Check to see if string passed in is a percentage
	function isPercentage(n) {
	  return typeof n === "string" && n.indexOf('%') != -1;
	}

	// Force a hex value to have 2 characters
	function pad2(c) {
	  return c.length == 1 ? '0' + c : '' + c;
	}

	// Replace a decimal with it's percentage value
	function convertToPercentage(n) {
	  if (n <= 1) {
	    n = (n * 100) + "%";
	  }

	  return n;
	}

	// Converts a decimal to a hex value
	function convertDecimalToHex(d) {
	  return Math.round(parseFloat(d) * 255).toString(16);
	}
	// Converts a hex value to a decimal
	function convertHexToDecimal(h) {
	  return (parseIntFromHex(h) / 255);
	}

	var matchers = (function() {

	    // <http://www.w3.org/TR/css3-values/#integers>
	    var CSS_INTEGER = "[-\\+]?\\d+%?";

	    // <http://www.w3.org/TR/css3-values/#number-value>
	    var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

	    // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
	    var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

	    // Actual matching.
	    // Parentheses and commas are optional, but not required.
	    // Whitespace can take the place of commas or opening paren
	    var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
	    var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

	    return {
	      CSS_UNIT: new RegExp(CSS_UNIT),
	      rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
	      rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
	      hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
	      hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
	      hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
	      hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
	      hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
	      hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
	      hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
	      hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
	    };
	  })();

	// `isValidCSSUnit`
	// Take in a single string / number and check to see if it looks like a CSS unit
	// (see `matchers` above for definition).
	function isValidCSSUnit(color) {
	  return !!matchers.CSS_UNIT.exec(color);
	}

	// `stringInputToObject`
	// Permissive string parsing.  Take in a number of formats, and output an object
	// based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
	function stringInputToObject(color) {

	  color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();
	  var named = false;
	  if (names[color]) {
	    color = names[color];
	    named = true;
	  }
	  else if (color == 'transparent') {
	    return { r: 0, g: 0, b: 0, a: 0, format: "name" };
	  }

	    // Try to match string input using regular expressions.
	    // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
	    // Just return an object and let the conversion functions handle that.
	    // This way the result will be the same whether the tinycolor is initialized with string or object.
	    var match;
	    if ((match = matchers.rgb.exec(color))) {
	      return { r: match[1], g: match[2], b: match[3] };
	    }
	    if ((match = matchers.rgba.exec(color))) {
	      return { r: match[1], g: match[2], b: match[3], a: match[4] };
	    }
	    if ((match = matchers.hsl.exec(color))) {
	      return { h: match[1], s: match[2], l: match[3] };
	    }
	    if ((match = matchers.hsla.exec(color))) {
	      return { h: match[1], s: match[2], l: match[3], a: match[4] };
	    }
	    if ((match = matchers.hsv.exec(color))) {
	      return { h: match[1], s: match[2], v: match[3] };
	    }
	    if ((match = matchers.hsva.exec(color))) {
	      return { h: match[1], s: match[2], v: match[3], a: match[4] };
	    }
	    if ((match = matchers.hex8.exec(color))) {
	      return {
	        r: parseIntFromHex(match[1]),
	        g: parseIntFromHex(match[2]),
	        b: parseIntFromHex(match[3]),
	        a: convertHexToDecimal(match[4]),
	        format: named ? "name" : "hex8"
	      };
	    }
	    if ((match = matchers.hex6.exec(color))) {
	      return {
	        r: parseIntFromHex(match[1]),
	        g: parseIntFromHex(match[2]),
	        b: parseIntFromHex(match[3]),
	        format: named ? "name" : "hex"
	      };
	    }
	    if ((match = matchers.hex4.exec(color))) {
	      return {
	        r: parseIntFromHex(match[1] + '' + match[1]),
	        g: parseIntFromHex(match[2] + '' + match[2]),
	        b: parseIntFromHex(match[3] + '' + match[3]),
	        a: convertHexToDecimal(match[4] + '' + match[4]),
	        format: named ? "name" : "hex8"
	      };
	    }
	    if ((match = matchers.hex3.exec(color))) {
	      return {
	        r: parseIntFromHex(match[1] + '' + match[1]),
	        g: parseIntFromHex(match[2] + '' + match[2]),
	        b: parseIntFromHex(match[3] + '' + match[3]),
	        format: named ? "name" : "hex"
	      };
	    }

	    return false;
	  }

	// Node: Export function
	if (typeof module !== "undefined" && module.exports) {
	  module.exports = tinycolor;
	}
	// Browser: Expose to window
	else {
	  window.tinycolor = tinycolor;
	}

	})(Math);
	});

	var tinycolor$1 = (tinycolor && typeof tinycolor === 'object' && 'default' in tinycolor ? tinycolor['default'] : tinycolor);

	var fancy = "M83.5244052,130.453237 L129.059785,84.9178576 L174.595164,130.453237 L144.213452,130.453237 L144.213452,186.792818 L113.896389,186.792818 L113.896389,130.453237 L83.5244052,130.453237 Z M64.431707,68.715835 L64.431707,75.0983746 L193.678134,75.0983746 L193.678134,68.715835 L64.431707,68.715835 Z";

	var line = "M88.4020203,153.455844 L128,113.857864 L167.59798,153.455844 L173.254834,147.79899 L128,102.544156 L125.171573,105.372583 L82.745166,147.79899 L88.4020203,153.455844 Z";

	var pointer = "M92.9062438,130.532138 C89.0010007,134.437382 82.6693513,134.437382 78.7641081,130.532138 C74.858865,126.626895 74.858865,120.295246 78.7641081,116.390003 L115.887214,79.2668969 L121.190515,73.963596 C125.095758,70.0583529 131.427408,70.0583529 135.332651,73.963596 L140.635951,79.2668969 L177.759058,116.390003 C181.664301,120.295246 181.664301,126.626895 177.759058,130.532138 C173.853814,134.437382 167.522165,134.437382 163.616922,130.532138 L138,104.915217 L138,175 C138,180.522848 133.522848,185 128,185 C122.477152,185 118,180.522848 118,175 L118,105.438382 L92.9062438,130.532138 Z";

	var triangle = "M185.081032,156.382867 L128.006097,99.3079319 L70.9311613,156.382867 L185.081032,156.382867 Z";

var ICONS = Object.freeze({
		fancy: fancy,
		line: line,
		pointer: pointer,
		triangle: triangle
	});

	function easeInOutQuad(t, b, c, d) {
	  t /= d / 2;
	  if (t < 1) return c / 2 * t * t + b;
	  t--;
	  return -c / 2 * (t * (t - 2) - 1) + b;
	}

	(function () {
	  if (!window.addEventListener) return; // Check for IE9+

	  var getComputedStyle = document.defaultView.getComputedStyle || window.getComputedStyle;
	  var topThreshhold = 100; // px
	  var animation = null;
	  var duration = null; // ms
	  var startTime = null;
	  var startPosition = null;
	  var backToTopping = false;

	  var options = INSTALL_OPTIONS;
	  var element = void 0;
	  var xmlns = "http://www.w3.org/2000/svg";
	  var icon = document.createElementNS(xmlns, "svg");

	  icon.setAttribute("class", "eager-icon");
	  icon.setAttributeNS(null, "viewBox", "0 0 256 256");
	  icon.setAttributeNS(null, "version", "1.1");

	  function getColors() {
	    var strategy = options.color.strategy;


	    var backgroundColor = function () {
	      if (strategy === "dark") return tinycolor$1("#000000");
	      if (strategy === "light") return tinycolor$1("#ffffff");
	      if (strategy === "custom") return tinycolor$1(options.color.custom);

	      // Find contrasting color.

	      var _getComputedStyle = getComputedStyle(document.body);

	      var backgroundColor = _getComputedStyle.backgroundColor;

	      var components = tinycolor$1(backgroundColor).toHsl();

	      components.l = Math.abs((components.l + 0.5) % 1) + (1 - components.s) * 0.15;

	      return tinycolor$1(components);
	    }();

	    var iconColor = backgroundColor.clone();

	    backgroundColor.setAlpha(0.2);
	    iconColor.setAlpha(0.9);

	    return {
	      backgroundColor: backgroundColor.toRgbString(),
	      iconColor: iconColor.toRgbString()
	    };
	  }

	  function resetPositions() {
	    startTime = null;
	    startPosition = null;
	    backToTopping = false;
	  }

	  function animateLoop(time) {
	    if (!startTime) startTime = time;

	    var timeSoFar = time - startTime;
	    var easedPosition = easeInOutQuad(timeSoFar, startPosition, -startPosition, duration);

	    window.scrollTo(0, easedPosition);

	    if (timeSoFar < duration) {
	      animation = requestAnimationFrame(animateLoop);
	    } else {
	      resetPositions();
	    }
	  }

	  function backToTop() {
	    if (backToTopping) return;

	    backToTopping = true;
	    startPosition = document.documentElement.scrollTop || document.body.scrollTop;
	    duration = startPosition / 2;

	    requestAnimationFrame(animateLoop);
	  }

	  function setVisibility() {
	    if (!element) return;

	    var visibility = window.scrollY > topThreshhold ? "visible" : "hidden";

	    element.setAttribute("visibility", visibility);
	  }

	  function setColors() {
	    if (!element) return;

	    var _getColors = getColors();

	    var backgroundColor = _getColors.backgroundColor;
	    var iconColor = _getColors.iconColor;


	    element.style.backgroundColor = backgroundColor;
	    icon.style.fill = iconColor;
	  }

	  function setIcon() {
	    icon.innerHTML = "";
	    var path = document.createElementNS(xmlns, "path");

	    path.setAttributeNS(null, "d", ICONS[options.icon]);
	    icon.appendChild(path);
	  }

	  function setShape() {
	    if (!element) return;

	    element.setAttribute("shape", options.shape);
	  }

	  function updateElement() {
	    element = document.createElement("eager-app");

	    element.setAttribute("app-id", "back-to-top-button");
	    element.addEventListener("click", backToTop);

	    setVisibility();
	    setIcon();
	    element.appendChild(icon);

	    setShape();
	    setColors();

	    document.body.appendChild(element);
	  }

	  function bootstrap() {
	    updateElement();

	    window.addEventListener("blur", function () {
	      if (backToTopping) {
	        cancelAnimationFrame(animation);
	        resetPositions();
	        window.scrollTo(0, 0);
	      }
	    });

	    window.addEventListener("scroll", setVisibility);
	  }

	  if (document.readyState === "loading") {
	    document.addEventListener("DOMContentLoaded", bootstrap);
	  } else {
	    bootstrap();
	  }

	  window.INSTALL_SCOPE = {
	    updateColors: function updateColors(nextOptions) {
	      options = nextOptions;

	      setColors();
	    },
	    updateIcon: function updateIcon(nextOptions) {
	      options = nextOptions;

	      setIcon();
	    },
	    updateShape: function updateShape(nextOptions) {
	      options = nextOptions;

	      setShape();
	    }
	  };
	})();

}());