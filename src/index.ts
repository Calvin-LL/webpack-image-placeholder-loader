import FastAverageColor from "fast-average-color";
import { validate } from "schema-utils";
import { Schema } from "schema-utils/declarations/validate";
import sharp from "sharp";
import tinycolor from "tinycolor2";
import { loader } from "webpack";

import { getOptions } from "@calvin-l/webpack-loader-util";

import {
  mixRgbaWithRgb,
  rgbToRgbArray,
  rgbToRgbaArray,
  rgbaToRgb,
} from "./helpers/color";
import getBlurredSvg from "./helpers/getBlurredSvg";
import { validateColor, validatebackgroundColor } from "./helpers/validation";
import schema from "./options.json";

export interface ImgSize {
  width: number | undefined;
  height: number | undefined;
}

export interface Options {
  readonly format?: "base64" | "blurred-svg" | "hex" | "rgb" | "array";
  readonly size?: number | "original";
  readonly color?:
    | string
    | "simple"
    | "sqrt"
    | "dominant"
    | tinycolor.ColorInputWithoutInstance;
  readonly backgroundColor?: string | tinycolor.ColorInputWithoutInstance;
  readonly esModule?: boolean;
  readonly blurQuality: number;
}

export type FullOptions = Required<Options>;

export const raw = true;

export default function (
  this: loader.LoaderContext,
  content: ArrayBuffer
): void {
  const callback = this.async() as loader.loaderCallback;
  const defaultOptions: FullOptions = {
    format: "base64",
    size: 1,
    color: "sqrt",
    backgroundColor: "#FFF",
    esModule: true,
    blurQuality: 1,
  };
  const options: FullOptions = {
    ...defaultOptions,
    ...getOptions<Options>(this, true, true),
  };

  validate(schema as Schema, options, {
    name: "Image Placeholder Loader",
    baseDataPath: "options",
  });

  const {
    format,
    size,
    color,
    backgroundColor,
    esModule,
    blurQuality,
  } = options;

  validateColor(color);
  validatebackgroundColor(backgroundColor);

  processImage(content, { format, size, color, backgroundColor, blurQuality })
    .then((result) => {
      callback(
        null,
        `${esModule ? "export default" : "module.exports ="} ${JSON.stringify(
          result
        )}`
      );
    })
    .catch((e) => {
      throw e;
    });
}

async function processImage(
  content: ArrayBuffer,
  {
    format,
    size,
    color,
    backgroundColor,
    blurQuality,
  }: Omit<FullOptions, "esModule">
): Promise<string | [number, number, number]> {
  const sharpImage = sharp(Buffer.from(content));
  const resultColor = await getColor(sharpImage, color, backgroundColor);
  const imageSize = await getSize(sharpImage);
  const output = await getOutput(
    resultColor,
    size,
    format,
    imageSize,
    sharpImage,
    blurQuality
  );

  return output;
}

async function getColor(
  sharpImage: sharp.Sharp,
  color: FullOptions["color"],
  backgroundColor: FullOptions["backgroundColor"]
): Promise<tinycolor.ColorFormats.RGB> {
  const tcColor = tinycolor(color);

  const backgroundColorRgb = rgbaToRgb(tinycolor(backgroundColor).toRgb());

  if (tcColor.isValid())
    return mixRgbaWithRgb(tcColor.toRgb(), backgroundColorRgb);

  const data = await sharpImage
    .flatten({ background: backgroundColorRgb })
    .ensureAlpha()
    .raw()
    .toBuffer();

  const fac = new FastAverageColor();
  const resultRgba = fac.getColorFromArray4(data, {
    algorithm: color as "simple" | "sqrt" | "dominant",
    defaultColor: rgbToRgbaArray(backgroundColorRgb),
  });
  fac.destroy();

  return { r: resultRgba[0], g: resultRgba[1], b: resultRgba[2] };
}

async function getSize(sharpImage: sharp.Sharp): Promise<ImgSize> {
  const { height, width } = await sharpImage.metadata();

  return { width, height };
}

/**
 * combine all the given information to generate the final output of this loader
 */
async function getOutput(
  color: tinycolor.ColorFormats.RGB,
  size: FullOptions["size"],
  format: FullOptions["format"],
  imageSize: ImgSize,
  sharpImage: sharp.Sharp,
  blurQuality: number
): Promise<string | [number, number, number]> {
  const tcColor = tinycolor(color);

  if (format === "rgb") return tcColor.toRgbString();
  if (format === "hex") return tcColor.toHexString();
  if (format === "array") return rgbToRgbArray(tcColor.toRgb());
  if (format === "blurred-svg")
    return getBlurredSvg(sharpImage, imageSize, blurQuality);

  const width = size === "original" ? imageSize.width : size;
  const height = size === "original" ? imageSize.height : size;

  return `data:image/png;base64,${(
    await sharp({
      create: {
        width: width ?? 1,
        height: height ?? 1,
        channels: 3,
        background: rgbaToRgb(tcColor.toRgb()),
      },
    })
      .png({
        compressionLevel: 9,
      })
      .toBuffer()
  ).toString("base64")}`;
}
