import webpack from "webpack";

import compile from "./helpers/compile";
import execute from "./helpers/execute";
import getCompiler from "./helpers/getCompiler";
import readAsset from "./helpers/readAsset";

describe.each([4, 5] as const)('v%d "format" option', (webpackVersion) => {
  it("should work without value", async () => {
    const compiler = getCompiler(webpackVersion, {});
    const stats = await compile(webpackVersion, compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  it('should work with "base64" value', async () => {
    const compiler = getCompiler(webpackVersion, {
      format: "base64",
    });
    const stats = await compile(webpackVersion, compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  it('should work with "hex" value', async () => {
    const compiler = getCompiler(webpackVersion, {
      format: "hex",
    });
    const stats = await compile(webpackVersion, compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  it('should work with "rgb" value', async () => {
    const compiler = getCompiler(webpackVersion, {
      format: "rgb",
    });
    const stats = await compile(webpackVersion, compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  it('should work with "array" value', async () => {
    const compiler = getCompiler(webpackVersion, {
      format: "array",
    });
    const stats = await compile(webpackVersion, compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });
});
