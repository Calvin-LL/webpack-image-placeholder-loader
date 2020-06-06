import loaderUtils from "loader-utils";
import validateOptions from "schema-utils";
import { JSONSchema7 } from "schema-utils/declarations/validate";
import { loader } from "webpack";

import schema from "./options.json";

export default function () {}

export function pitch(this: loader.LoaderContext) {
  const options = loaderUtils.getOptions(this);

  if (options)
    validateOptions(schema as JSONSchema7, options, {
      name: "Image Placeholder Loader",
      baseDataPath: "options",
    });
}

export const raw = true;
