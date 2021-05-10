import WIPLWebpackTestCompiler from "./helpers/WIPLWebpackTestCompiler";

describe.each([4, 5] as const)('v%d "format" option', (webpackVersion) => {
  it("should work without value", async () => {
    const compiler = new WIPLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile();

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });

  it('should work with "base64" value', async () => {
    const compiler = new WIPLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        format: "base64",
      },
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });

  it('should work with "hex" value', async () => {
    const compiler = new WIPLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        format: "hex",
      },
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });

  it('should work with "rgb" value', async () => {
    const compiler = new WIPLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        format: "rgb",
      },
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });

  it('should work with "array" value', async () => {
    const compiler = new WIPLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        format: "array",
      },
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });

  it('should work with "blurred-svg" value', async () => {
    const compiler = new WIPLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        format: "blurred-svg",
        blurQuality: 0.01,
      },
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });
});
