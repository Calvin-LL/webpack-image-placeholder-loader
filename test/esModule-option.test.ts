import webpack from "webpack";

import compile from "./helpers/compile";
import execute from "./helpers/execute";
import getCompiler from "./helpers/getCompiler";
import readAsset from "./helpers/readAsset";

describe.each([4, 5] as const)('v%d "esModule" option', (webpackVersion) => {
  it("should work without value", async () => {
    const compiler = getCompiler(
      webpackVersion,
      undefined,
      "simple-require.js"
    );
    const stats = (await compile(webpackVersion, compiler)) as webpack.Stats;

    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
  });

  it('should work with "Boolean" value equal "true"', async () => {
    const compiler = getCompiler(
      webpackVersion,
      {
        esModule: true,
      },
      "simple-require.js"
    );
    const stats = (await compile(webpackVersion, compiler)) as webpack.Stats;

    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
  });

  it('should work with "Boolean" value equal "false"', async () => {
    const compiler = getCompiler(
      webpackVersion,
      {
        esModule: false,
      },
      "simple-require.js"
    );
    const stats = (await compile(webpackVersion, compiler)) as webpack.Stats;

    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
  });
});
