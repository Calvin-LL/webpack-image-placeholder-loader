import webpack from "webpack";

import compile from "./helpers/compile";
import execute from "./helpers/execute";
import getCompiler from "./helpers/getCompiler";
import readAsset from "./helpers/readAsset";

describe('"backgroundColor" option', () => {
  it("should work without value", async () => {
    const compiler = getCompiler({});
    const stats = await compile(compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  it('should work with "string" value', async () => {
    const compiler = getCompiler({
      backgroundColor: "blue",
    });
    const stats = await compile(compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  it('should work with "object" value', async () => {
    const compiler = getCompiler({
      backgroundColor: { r: 255, g: 255, b: 255 },
    });
    const stats = await compile(compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });

  it("should work with transparent color", async () => {
    const compiler = getCompiler({
      color: "transparent",
      backgroundColor: "green",
    });
    const stats = await compile(compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats as webpack.Stats))
    ).toMatchSnapshot("result");
  });
});
