import WIPLWebpackTestCompiler from "./helpers/WIPLWebpackTestCompiler";

describe.each([4, 5] as const)('v%d "size" option', (webpackVersion) => {
  it("should work without value", async () => {
    const compiler = new WIPLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile();

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });

  it('should work with "original" value', async () => {
    const compiler = new WIPLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        size: "original",
      },
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });

  it('should work with "number" value', async () => {
    const compiler = new WIPLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        size: 10,
      },
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });
});
