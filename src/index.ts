import FastAverageColor from "fast-average-color";
import loaderUtils from "loader-utils";
import validateOptions from "schema-utils";
import { JSONSchema7 } from "schema-utils/declarations/validate";
import sharp from "sharp";
import tinycolor from "tinycolor2";
import { loader } from "webpack";

import {
  mixRgbaWithRgb,
  rgbToRgbArray,
  rgbToRgbaArray,
  rgbaToRgb,
} from "./helpers/color";
import { validateColor, validatebackgroundColor } from "./helpers/validation";
import schema from "./options.json";

export interface OPTIONS {
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

export const raw = true;
export default function (this: loader.LoaderContext, content: ArrayBuffer) {
  const callback = this.async();
  const options = loaderUtils.getOptions(this) as Readonly<OPTIONS> | null;
  const params = this.resourceQuery
    ? (loaderUtils.parseQuery(this.resourceQuery) as Partial<OPTIONS>)
    : undefined;

  if (options)
    validateOptions(schema as JSONSchema7, options, {
      name: "Image Placeholder Loader",
      baseDataPath: "options",
    });

  const format = params?.format ?? options?.format ?? "base64";
  const size = params?.size ?? options?.size ?? 1;
  const color = params?.color ?? options?.color ?? "sqrt";
  const backgroundColor =
    params?.backgroundColor ?? options?.backgroundColor ?? "#FFF";

  validateColor(color);
  validatebackgroundColor(backgroundColor);

  processImage(content, { format, size, color, backgroundColor })
    .then((result) => {
      const esModule = params?.esModule ?? options?.esModule ?? true;

      callback?.(
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
  { format, size, color, backgroundColor }: Omit<Readonly<OPTIONS>, "esModule">
) {
  const { rgb: resultColor, size: imageSize } = await getColor(
    Buffer.from(content),
    color,
    backgroundColor
  );

  const result = await getResult(resultColor, size, format, imageSize);

  return result;
}

async function getColor(
  buffer: Buffer,
  color: OPTIONS["color"],
  backgroundColor: OPTIONS["backgroundColor"]
) {
  const tcColor = tinycolor(color);

  const backgroundColorRgb = rgbaToRgb(tinycolor(backgroundColor).toRgb());

  const sharpImage = sharp(buffer);
  const { height, width } = await sharpImage.metadata();

  if (tcColor.isValid())
    return {
      rgb: mixRgbaWithRgb(tcColor.toRgb(), backgroundColorRgb),
      size: { width, height },
    };

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
  if (format === "array") return rgbToRgbArray(tcColor.toRgb());

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
