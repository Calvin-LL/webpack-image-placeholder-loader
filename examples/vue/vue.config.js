module.exports = {
  publicPath: ".",
  chainWebpack: (config) => {
    config.module
      .rule("images-placeholder")
      .test(/\.(png|jpe?g|svg|gif|webp|tiff?)$/i)
      .use("placeholder")
      .loader("webpack-query-loader")
      .options({
        resourceQuery: "placeholder",
        use: {
          loader: "webpack-image-placeholder-loader",
          options: { esModule: false },
        },
      });

    config.module
      .rule("images")
      .use("images-without-query")
      .loader("webpack-query-loader")
      .options({
        resourceQuery: "!placeholder",
        use: {
          loader: config.module.rule("images").use("url-loader").get("loader"),
          options: config.module
            .rule("images")
            .use("url-loader")
            .get("options"),
        },
      });

    config.module.rule("images").uses.delete("url-loader");
  },
};
