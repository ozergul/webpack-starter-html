const WebpackMerge = require("webpack-merge");
const WebpackCommon = require("./common.config");

module.exports = WebpackMerge(WebpackCommon, {
  mode: "development",
  // Use cheap-source-maps for faster builds
  devtool: "inline-eval-cheap-source-map",
  devServer: {
    port: 9000,
    stats: {
      children: false,
      chunks: false,
      chunkModules: false,
      modules: false,
      reasons: false,
      useExports: false,
    },
  }
});
