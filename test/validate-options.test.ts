import webpack from "webpack";

import compile from "./helpers/compile";
import getCompiler from "./helpers/getCompiler";

describe("validate options", () => {
  const tests = {
    format: {
      success: ["base64", "hex", "rgb", "array"],
      failure: [true],
    },
    size: {
      success: [1, 100, "original"],
      failure: [0, -1],
    },
    color: {
      success: ["simple", "sqrt", "dominant", "#000", "#038281"],
      failure: [true, "#0"],
    },
  };

  async function createTestCase(
    key: string,
    value: any,
    type: "success" | "failure"
  ) {
    it(`should ${
      type === "success" ? "successfully validate" : "throw an error on"
    } the "${key}" option with "${value}" value`, async () => {
      const compiler = getCompiler({ [key]: value });

      let stats;

      try {
        stats = await compile(compiler);
      } finally {
        if (type === "success") {
          expect((stats as webpack.Stats).hasErrors()).toBe(false);
        } else if (type === "failure") {
          const {
            compilation: { errors },
          } = stats as any;

          expect(errors).toHaveLength(1);
          expect(() => {
            throw new Error(errors[0].error.message);
          }).toThrowErrorMatchingSnapshot();
        }
      }
    });
  }

  for (const [key, values] of Object.entries(tests)) {
    for (const type of Object.keys(values) as ("success" | "failure")[]) {
      for (const value of values[type]) {
        createTestCase(key, value, type);
      }
    }
  }
});
