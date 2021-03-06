const Webpack = require("webpack");
const WebpackMerge = require("webpack-merge");
const WebpackCommon = require("./common.config");

module.exports = WebpackMerge(WebpackCommon, {
  mode: "production",
  devtool: "source-map",
  bail: true,
  plugins: [
    new Webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    })
  ]
});
