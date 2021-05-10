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

import DataURIParser from "datauri/parser";
import sharp from "sharp";

import { ImgSize } from "../index";

const parser = new DataURIParser();

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

export default async function getBlurredSvg(
  sharpImage: sharp.Sharp,
  imageSize: ImgSize,
  blurQuality: number
): Promise<string> {
  // divide the number by 100 and bound from 0 to 1
  const resultSizeRatio = Math.max(0, Math.min(1, blurQuality / 100));
  // if in the rare situation where width or height isn't found, default to 100
  const imageWidth = imageSize.width ?? 100;
  const imageHeight = imageSize.height ?? 100;
  const targerImageWidth = Math.max(
    1,
    Math.round(imageWidth * resultSizeRatio)
  );
  const targerImageHeight = Math.max(
    1,
    Math.round(imageHeight * resultSizeRatio)
  );
  const buffer = await sharpImage
    .rotate() // Manifest rotation from metadata
    .resize(targerImageWidth, targerImageHeight)
    .png()
    .toBuffer();

  const dataUri = parser.format(".png", buffer).content;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 ${imageWidth} ${imageHeight}">
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
