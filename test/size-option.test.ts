import webpack from "webpack";

import compile from "./helpers/compile";
import execute from "./helpers/execute";
import getCompiler from "./helpers/getCompiler";
import readAsset from "./helpers/readAsset";

describe.each([4, 5] as const)('v%d "size" option', (webpackVersion) => {
  it("should work without value", async () => {
    const compiler = getCompiler(webpackVersion, {});
    const stats = await compile(webpackVersion, compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  it('should work with "original" value', async () => {
    const compiler = getCompiler(webpackVersion, {
      size: "original",
    });
    const stats = await compile(webpackVersion, compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  it('should work with "number" value', async () => {
    const compiler = getCompiler(webpackVersion, {
      size: 10,
    });
    const stats = await compile(webpackVersion, compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });
});
