/**
 * Copyright (c) 2020 Google Inc
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// Adopted from
// https://github.com/google/eleventy-high-performance-blog/blob/60902bfdaf764f5b16b2af62cf10f63e0e74efbc/_11ty/blurry-placeholder.js

import sharp from "sharp";

const DatauriParser = require("datauri/parser");
const parser = new DatauriParser();

interface imgRect {
  width: number | undefined;
  height: number | undefined;
}

function getBitmapDimensions_(imgRect: imgRect, quality: number): {
  width: number;
  height: number;
} {
  const PIXEL_TARGET = Math.round(10000 * (quality * 0.01));

  // Aims for a bitmap of ~P pixels (w * h = ~P).
  // Gets the ratio of the width to the height. (r = w0 / h0 = w / h)
  const ratioWH = Number(imgRect.width) / Number(imgRect.height);
  // Express the width in terms of height by multiply the ratio by the
  // height. (h * r = (w / h) * h)
  // Plug this representation of the width into the original equation.
  // (h * r * h = ~P).
  // Divide the bitmap size by the ratio to get the all expressions using
  // height on one side. (h * h = ~P / r)
  let bitmapHeight = PIXEL_TARGET / ratioWH;
  // Take the square root of the height instances to find the singular value
  // for the height. (h = sqrt(~P / r))
  bitmapHeight = Math.sqrt(bitmapHeight);
  // Divide the goal total pixel amount by the height to get the width.
  // (w = ~P / h).
  const bitmapWidth = PIXEL_TARGET / bitmapHeight;
  return { width: Math.round(bitmapWidth), height: Math.round(bitmapHeight) };
}

export default async function getDataSvg(sharpImage: sharp.Sharp, imageSize: imgRect, blurQuality: number): Promise<string> {
  const imgDimension = getBitmapDimensions_(imageSize, blurQuality);
  const buffer = await sharpImage
    .rotate() // Manifest rotation from metadata
    .resize(imgDimension.width, imgDimension.height)
    .png()
    .toBuffer();

  const dataUri = parser.format(".png", buffer).content;

  const ESCAPE_TABLE: any = {
    "#": "%23",
    "%": "%25",
    ":": "%3A",
    "<": "%3C",
    ">": "%3E",
    '"': "'",
  };
  const ESCAPE_REGEX = new RegExp(Object.keys(ESCAPE_TABLE).join("|"), "g");
  function escaper(match: any): any {
    return ESCAPE_TABLE[match];
  }

  let svg =
    `<svg xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 ${imageSize.width} ${imageSize.height}">
      <filter id="b" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation=".5"></feGaussianBlur>
        <feComponentTransfer>
          <feFuncA type="discrete" tableValues="1 1"></feFuncA>
        </feComponentTransfer>
      </filter>
      <image filter="url(#b)" preserveAspectRatio="none"
        height="100%" width="100%"
        xlink:href="${dataUri}">
      </image>
    </svg>`;

  // Optimizes dataURI length by deleting line breaks, and
  // removing unnecessary spaces.
  svg = svg.replace(/\s+/g, " ");
  svg = svg.replace(/> </g, "><");
  svg = svg.replace(ESCAPE_REGEX, escaper);

  const URI = `data:image/svg+xml;charset=utf-8,${svg}`;
  return URI;
}