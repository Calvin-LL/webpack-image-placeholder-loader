module.exports = {
  publicPath: ".",
  chainWebpack: (config) => {
    config.module
      .rule("images")
      .test(/\.(png|jpe?g|gif|webp|tiff?)$/i)
      // if the import url looks like "some.png?placeholder..."
      .oneOf("placeholder")
      .resourceQuery(/placeholder/)
      .use("placeholder")
      .loader("webpack-image-placeholder-loader")
      .options({ format: "hex", esModule: false })
      .end()
      .end()
      // if no previous resourceQuery match
      .oneOf("normal")
      .use("normal")
      .loader(config.module.rule("images").use("url-loader").get("loader"))
      .options(config.module.rule("images").use("url-loader").get("options"));

    // remove `use` now that there is `oneOf`
    config.module.rule("images").uses.delete("url-loader");
  },
};
