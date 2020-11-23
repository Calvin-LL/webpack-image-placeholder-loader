import WIPLWebpackTestCompiler from "./helpers/WIPLWebpackTestCompiler";

describe.each([4, 5] as const)('v%d "esModule" option', (webpackVersion) => {
  it("should work without value", async () => {
    const compiler = new WIPLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      entryFileName: "index-require.js",
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });

  it('should work with "Boolean" value equal "true"', async () => {
    const compiler = new WIPLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      entryFileName: "index-require.js",
      loaderOptions: {
        esModule: true,
      },
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });

  it('should work with "Boolean" value equal "false"', async () => {
    const compiler = new WIPLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      entryFileName: "index-require.js",
      loaderOptions: {
        esModule: false,
      },
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });
});
