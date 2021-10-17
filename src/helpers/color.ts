import type { IFastAverageColorRgba } from "fast-average-color";

export function rgbToRgbaArray(
  rgb: tinycolor.ColorFormats.RGB
): IFastAverageColorRgba {
  return [rgb.r, rgb.g, rgb.b, 255] as IFastAverageColorRgba;
}

export function rgbToRgbArray(
  rgb: tinycolor.ColorFormats.RGB
): [number, number, number] {
  return [rgb.r, rgb.g, rgb.b];
}

export function rgbaToRgb({
  r,
  g,
  b,
}: tinycolor.ColorFormats.RGBA): tinycolor.ColorFormats.RGB {
  return { r, g, b };
}

export function mixRgbaWithRgb(
  { r: r1, g: g1, b: b1, a }: tinycolor.ColorFormats.RGBA,
  { r: r2, g: g2, b: b2 }: tinycolor.ColorFormats.RGB
): tinycolor.ColorFormats.RGB {
  return {
    r: mixColorValues(r1, r2, a),
    g: mixColorValues(g1, g2, a),
    b: mixColorValues(b1, b2, a),
  };
}

export function mixColorValues(
  foregroundColor: number,
  backgroundColor: number,
  alpha: number
): number {
  return Math.max(
    0,
    Math.min(
      Math.round(foregroundColor * alpha + backgroundColor * (1 - alpha)),
      255
    )
  );
}
