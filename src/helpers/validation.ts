import tinycolor from "tinycolor2";

import { FullOptions } from "../index";

export function validateColor(color: FullOptions["color"]): true {
  switch (color) {
    case "simple":
      return true;
    case "sqrt":
      return true;
    case "dominant":
      return true;
    default: {
      const tc = tinycolor(color);
      if (tc.isValid()) return true;

      throw `Invalid options object. Image Placeholder Loader has been initialised using an options object that does not match the API schema.
      - options.color ${JSON.stringify(color)} is not a valid color.`;
    }
  }
}

export function validatebackgroundColor(
  backgroundColor: FullOptions["backgroundColor"]
): true {
  const tc = tinycolor(backgroundColor);
  if (tc.isValid() && tc.getAlpha() === 1) return true;

  throw `Invalid options object. Image Placeholder Loader has been initialised using an options object that does not match the API schema.
      - options.backgroundColor ${JSON.stringify(
        backgroundColor
      )} is not a valid color.`;
}
