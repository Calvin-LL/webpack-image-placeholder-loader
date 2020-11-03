import webpack from "webpack";

import compile from "./helpers/compile";
import execute from "./helpers/execute";
import getCompiler from "./helpers/getCompiler";
import readAsset from "./helpers/readAsset";

describe.each([4, 5] as const)(
  'v%d "backgroundColor" option',
  (webpackVersion) => {
    it("should work without value", async () => {
      const compiler = getCompiler(webpackVersion, {});
      const stats = await compile(webpackVersion, compiler);

      expect(
        execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
      ).toMatchSnapshot("result");
    });

    it('should work with "string" value', async () => {
      const compiler = getCompiler(webpackVersion, {
        backgroundColor: "blue",
      });
      const stats = await compile(webpackVersion, compiler);

      expect(
        execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
      ).toMatchSnapshot("result");
    });

    it('should work with "object" value', async () => {
      const compiler = getCompiler(webpackVersion, {
        backgroundColor: { r: 255, g: 255, b: 255 },
      });
      const stats = await compile(webpackVersion, compiler);

      expect(
        execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
      ).toMatchSnapshot("result");
    });

    it("should work with transparent color", async () => {
      const compiler = getCompiler(webpackVersion, {
        color: "transparent",
        backgroundColor: "green",
      });
      const stats = await compile(webpackVersion, compiler);

      expect(
        execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
      ).toMatchSnapshot("result");
    });
  }
);
