import FastAverageColor from "fast-average-color";
import loaderUtils from "loader-utils";
import validateOptions from "schema-utils";
import { JSONSchema7 } from "schema-utils/declarations/validate";
import sharp from "sharp";
import tinycolor from "tinycolor2";
import { loader } from "webpack";

import schema from "./options.json";

interface OPTIONS {
  format: "base64" | "hex" | "rgb" | "array";
  size: number | "original";
  color:
    | string
    | "simple"
    | "sqrt"
    | "dominant"
    | tinycolor.ColorInputWithoutInstance;
  backgroundColor: string | tinycolor.ColorInputWithoutInstance;
  esModule: boolean;
}

export default async function (
  this: loader.LoaderContext,
  content: ArrayBuffer
) {
  const callback = this.async();
  const options = loaderUtils.getOptions(this) as Readonly<OPTIONS> | null;

  if (options)
    validateOptions(schema as JSONSchema7, options, {
      name: "Image Placeholder Loader",
      baseDataPath: "options",
    });

  const format = options?.format ?? "base64";
  const size = options?.size ?? 1;
  const color = options?.color ?? "sqrt";
  const backgroundColor = options?.backgroundColor ?? "#FFF";
  const esModule = options?.esModule ?? true;

  validateColor(color);
  validatebackgroundColor(backgroundColor);

  const { rgb: resultColor, size: imageSize } = await getColor(
    Buffer.from(content),
    color,
    backgroundColor
  );

  const result = await getResult(resultColor, size, format, imageSize);

  callback?.(
    null,
    `${esModule ? "export default" : "module.exports ="} ${JSON.stringify(
      result
    )}`
  );
}

export const raw = true;

async function getColor(
  buffer: Buffer,
  color: OPTIONS["color"],
  backgroundColor: OPTIONS["backgroundColor"]
) {
  const tcColor = tinycolor(color);

  const sharpImage = sharp(buffer);
  const { height, width } = await sharpImage.metadata();

  if (tcColor.isValid())
    return {
      rgb: rgbaToRgb(tcColor.toRgb()),
      size: { width, height },
    };

  const backgroundColorRgb = rgbaToRgb(tinycolor(backgroundColor).toRgb());

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

  return {
    rgb: { r: resultRgba[0], g: resultRgba[1], b: resultRgba[2] },
    size: { width, height },
  };
}

async function getResult(
  color: tinycolor.ColorFormats.RGB,
  size: OPTIONS["size"],
  format: OPTIONS["format"],
  imageSize: { width: number | undefined; height: number | undefined }
) {
  const tcColor = tinycolor(color);

  if (format === "rgb") return tcColor.toRgbString();
  if (format === "hex") return tcColor.toHexString();
  if (format === "array") return rgbToRgbaArray(tcColor.toRgb());

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
      .png()
      .toBuffer()
  ).toString("base64")}`;
}

function rgbToRgbaArray(rgb: tinycolor.ColorFormats.RGB) {
  return [rgb.r, rgb.g, rgb.b, 255] as IFastAverageColorRgba;
}

function rgbaToRgb({ r, g, b }: tinycolor.ColorFormats.RGBA) {
  return { r, g, b };
}

function validateColor(color: OPTIONS["color"]) {
  switch (color) {
    case "simple":
      return true;
    case "sqrt":
      return true;
    case "dominant":
      return true;

    default:
      const tc = tinycolor(color);
      if (tc.isValid()) return true;

      throw `Invalid options object. Image Placeholder Loader has been initialised using an options object that does not match the API schema.
      - options.color ${color} is not a valid color.`;
  }
}

function validatebackgroundColor(backgroundColor: OPTIONS["backgroundColor"]) {
  const tc = tinycolor(backgroundColor);
  if (tc.isValid()) return true;

  throw `Invalid options object. Image Placeholder Loader has been initialised using an options object that does not match the API schema.
      - options.backgroundColor ${backgroundColor} is not a valid color.`;
}
