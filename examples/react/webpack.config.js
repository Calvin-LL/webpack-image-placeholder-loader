const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
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
      {
        test: /\.(png|jpe?g|svg|gif|webp|tiff?)$/i,
        resourceQuery: /placeholder/,
        use: {
          loader: "webpack-image-placeholder-loader",
          options: {
            format: "hex",
          },
        },
      },
      {
        test: /\.(png|jpe?g|svg|gif|webp|tiff?)$/i,
        resourceQuery: { not: [/placeholder/] },
        use: "file-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./public/index.html"),
    }),
  ],
};
