const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "./src/index.js"),
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "main.js",
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.(png|jpe?g)/i,
        use: [
          {
            loader: "webpack-query-loader",
            options: {
              resourceQuery: "placeholder",
              use: {
                loader: "webpack-image-placeholder-loader",
                options: {
                  format: "hex",
                },
              },
            },
          },
          {
            loader: "webpack-query-loader",
            options: {
              resourceQuery: "!placeholder",
              use: {
                loader: "file-loader",
              },
            },
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
