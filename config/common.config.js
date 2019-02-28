// Plugins
const Webpack = require("webpack");
const Path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const StyleLintPlugin = require('stylelint-webpack-plugin');

const opts = {
  rootDir: process.cwd(),
  devBuild: process.env.NODE_ENV !== "production"
};

module.exports = {
  entry: {
    index: Path.resolve(__dirname, "../src/js/index.js")
  },
  output: {
    path: Path.join(opts.rootDir, "dist"),
    pathinfo: opts.devBuild,
    filename: "js/[name].js"
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
    splitChunks: {
      chunks: "all",
      name: false
    }
  },
  plugins: [
    // Clean dist
    new CleanWebpackPlugin(["dist"], { root: Path.resolve(__dirname, "..") }),

    //StyleLint
    new StyleLintPlugin({}),

    // for jQuery
    new Webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),

    // Extract css files to seperate bundle
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      chunkFilename: "css/[id].css"
    }),
    // Copy fonts and images to dist
    new CopyWebpackPlugin([
      { from: "src/fonts", to: "fonts" },
      { from: "src/img", to: "img" }
    ]),

    /* INDEX */
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: Path.resolve(__dirname, "../src/index.html"),
      inject: true,
      chunks: ["index"],
      minify: false,
      collapseWhitespace: false
    })
  ],
  module: {
    rules: [
      // HTML-loader
      {
        test: /\.html$/,
        loader: "html-loader",
        options: {
          interpolate: true,
          withImports: true,
          minimize: true,
          removeComments: false,
          collapseWhitespace: false
        }
      },
      // ES-Lint-loader
      {
        test: /\.(js)$/,
        include: Path.resolve(__dirname, "../src"),
        enforce: "pre",
        loader: "eslint-loader",
        options: {
          emitWarning: true
        }
      },

      // Babel-loader
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: ["babel-loader"]
      },

      {
        test: /\.css$/,
        use:['css-loader']
      },
      // Css-loader & sass-loader
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader,
          
          "css-loader",
          "sass-loader",
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                require('autoprefixer')({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9',
                  ],
                })
              ]
            }
          }
        ]
      },
      // Load fonts
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        loader: "url-loader",
        options: {
          limit: 1
        }
      },
      // Load images
      {
        test: /\.(png|jpg|jpeg|gif?)(\?[a-z0-9=&.]+)?$/,
        loader: "url-loader",
        options: {
          limit: 1,
          name: "./img/[name].[ext]"
        }
      }
    ]
  },
  resolve: {
    extensions: [".js", ".scss"],
    modules: ["node_modules"],
    alias: {
      request$: "xhr"
    }
  }
};
