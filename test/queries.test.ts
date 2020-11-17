import webpack from "webpack";

import compile from "./helpers/compile";
import execute from "./helpers/execute";
import getCompiler from "./helpers/getCompiler";
import readAsset from "./helpers/readAsset";

describe.each([4, 5] as const)("v%d queries", (webpackVersion) => {
  it('should be overridden by json query `{"r":255,"g":255,"b":255}`', async () => {
    const compiler = getCompiler(
      webpackVersion,
      {
        color: { r: 0, g: 0, b: 0 },
        esModule: false,
      },
      "index.js",
      `__export__ = require('./Macaca_nigra_self-portrait_large.jpg?{"color":{"r":255,"g":255,"b":255}}')`
    );
    const stats = await compile(webpackVersion, compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  it("should be overridden by query size=10", async () => {
    const compiler = getCompiler(
      webpackVersion,
      {
        size: 1,
        esModule: false,
      },
      "index.js",
      '__export__ = require("./Macaca_nigra_self-portrait_large.jpg?size=10")'
    );
    const stats = await compile(webpackVersion, compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });
});
