import path from "path";

import { Volume, createFsFromVolume } from "memfs";
import webpack from "webpack";
import webpack5 from "webpack5";

export default (
  webpackVersion: 4 | 5,
  loaderOptions?: any,
  fileName = "simple.js"
) => {
  const fixturesDir = path.resolve(__dirname, "..", "fixtures");
  const fullConfig = {
    mode: "production",
    devtool: false,
    context: fixturesDir,
    entry: path.resolve(fixturesDir, fileName),
    output: {
      path: path.resolve(__dirname, "..", "outputs"),
      filename: "[name].bundle.js",
      chunkFilename: "[name].chunk.js",
    },
    module: {
      rules: [
        {
          test: /(png|jpg|svg)/i,
          rules: [
            {
              loader: path.resolve(__dirname, "..", "..", "dist"),
              options: loaderOptions,
            },
          ],
        },
      ],
    },
    plugins: [],
  };

  const wp = (webpackVersion === 5 ? webpack5 : webpack) as typeof webpack;
  const compiler = wp(fullConfig as webpack.Configuration);

  const outputFileSystem = createFsFromVolume(new Volume());
  // Todo remove when we drop webpack@4 support
  // @ts-expect-error
  outputFileSystem.join = path.join.bind(path);

  // @ts-expect-error
  compiler.outputFileSystem = outputFileSystem;

  return compiler;
};
