const path = require("path");
var merge = require("lodash.merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const RemoveEmptyScriptsPlugin = require("webpack-remove-empty-scripts");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");

const BUILD_DIR = path.resolve(__dirname, "assets/build");

const COMMON_CONFIG = {
  context: path.resolve(__dirname, "assets/src"),
  entry: {
    bootstrap: "./js/bootstrap/entry",
    custom: "./js/custom/entry",
    main: "./sass/main.scss",
    otherEntry: "./otherEntry",
  },
  output: {
    assetModuleFilename: "[path][name][ext]",
    path: BUILD_DIR,
    filename: "js/[name].js",
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: [
        "./js/otherEntry.js",
        "./js/bootstrap.js.LICENSE.txt",
      ], // remove trash after compilation
    }),
    new RemoveEmptyScriptsPlugin(),
    new MiniCssExtractPlugin({ filename: "css/[name].css" }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: [/node_modules/],
        use: [
          // translate CommonJS to seperate CSS files
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
};

const PROD_CONFIG = merge({}, COMMON_CONFIG, {
  mode: "production",
  optimization: {
    minimizer: [
      new TerserJSPlugin(),
      new CssMinimizerPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            // Lossless optimization with custom option
            // Feel free to experiment with options for better result for you
            plugins: [
              ["gifsicle", { interlaced: true, optimizationLevel: 3 }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              // Svgo configuration here https://github.com/svg/svgo#configuration
              [
                "svgo",
                {
                  plugins: [
                    {
                      name: "preset-default",
                      params: {
                        overrides: {
                          removeViewBox: false,
                          addAttributesToSVGElement: {
                            params: {
                              attributes: [
                                { xmlns: "http://www.w3.org/2000/svg" },
                              ],
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
  },
});

const DEV_CONFIG = merge({}, COMMON_CONFIG, {
  mode: "development",
  devtool: "source-map",
});

module.exports = (env, argv) => {
  return argv.mode === "production" ? PROD_CONFIG : DEV_CONFIG;
};
