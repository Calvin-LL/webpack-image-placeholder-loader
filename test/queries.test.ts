import WIPLWebpackTestCompiler from "./helpers/WIPLWebpackTestCompiler";

describe.each([4, 5] as const)("v%d queries", (webpackVersion) => {
  it('should be overridden by json query `{"r":255,"g":255,"b":255}`', async () => {
    const compiler = new WIPLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        color: { r: 0, g: 0, b: 0 },
        esModule: false,
      },
      fileContentOverride: `__export__ = require('./Macaca_nigra_self-portrait_large.jpg?{"color":{"r":255,"g":255,"b":255}}')`,
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });

  it("should be overridden by query size=10", async () => {
    const compiler = new WIPLWebpackTestCompiler({ webpackVersion });
    const bundle = await compiler.compile({
      loaderOptions: {
        size: 1,
        esModule: false,
      },
      fileContentOverride:
        '__export__ = require("./Macaca_nigra_self-portrait_large.jpg?size=10")',
    });

    expect(bundle.execute("main.js")).toMatchSnapshot("result");
  });
});
