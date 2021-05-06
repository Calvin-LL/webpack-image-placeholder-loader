const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "./src/index.js"),
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "main.js",
  },
  // to hide performance hints on compile, do not add this to your code
  performance: {
    hints: false,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      {
        test: /\.(png|jpe?g|svg|gif|webp|tiff?)$/i,
        oneOf: [
          {
            // if the import url looks like "some.png?placeholder..."
            resourceQuery: /placeholder/,
            use: {
              loader: "webpack-image-placeholder-loader",
              options: {
                format: "hex",
              },
            },
          },
          {
            // if no previous resourceQuery match
            use: "file-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./public/index.html"),
    }),
  ],
};
