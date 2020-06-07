import webpack from "webpack";

import compile from "./helpers/compile";
import execute from "./helpers/execute";
import getCompiler from "./helpers/getCompiler";
import readAsset from "./helpers/readAsset";

describe('"esModule" option', () => {
  it("should work without value", async () => {
    const compiler = getCompiler();
    const stats = (await compile(compiler)) as webpack.Stats;

    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
  });

  it('should work with "Boolean" value equal "true"', async () => {
    const compiler = getCompiler({
      esModule: true,
    });
    const stats = (await compile(compiler)) as webpack.Stats;

    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
  });

  it('should work with "Boolean" value equal "false"', async () => {
    const compiler = getCompiler({
      esModule: false,
    });
    const stats = (await compile(compiler)) as webpack.Stats;

    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
  });
});
