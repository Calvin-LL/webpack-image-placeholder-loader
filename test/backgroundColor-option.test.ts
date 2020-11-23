import WIPLWebpackTestCompiler from "./helpers/WIPLWebpackTestCompiler";

describe.each([4, 5] as const)(
  'v%d "backgroundColor" option',
  (webpackVersion) => {
    it("should work without value", async () => {
      const compiler = new WIPLWebpackTestCompiler({ webpackVersion });
      const bundle = await compiler.compile();

      expect(bundle.execute("main.js")).toMatchSnapshot("result");
    });

    it('should work with "string" value', async () => {
      const compiler = new WIPLWebpackTestCompiler({ webpackVersion });
      const bundle = await compiler.compile({
        loaderOptions: {
          backgroundColor: "blue",
        },
      });

      expect(bundle.execute("main.js")).toMatchSnapshot("result");
    });

    it('should work with "object" value', async () => {
      const compiler = new WIPLWebpackTestCompiler({ webpackVersion });
      const bundle = await compiler.compile({
        loaderOptions: {
          backgroundColor: { r: 255, g: 255, b: 255 },
        },
      });

      expect(bundle.execute("main.js")).toMatchSnapshot("result");
    });

    it("should work with transparent color", async () => {
      const compiler = new WIPLWebpackTestCompiler({ webpackVersion });
      const bundle = await compiler.compile({
        loaderOptions: {
          color: "transparent",
          backgroundColor: "green",
        },
      });

      expect(bundle.execute("main.js")).toMatchSnapshot("result");
    });
  }
);
