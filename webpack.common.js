const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const multiPage = require("./multi.page");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //提取css文件
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin"); //压缩css
function resolve(dir) {
  return path.join(__dirname, "..", dir);
}
module.exports = {
  //   entry: {
  //     index: "./src/js/index.js",
  //     about: "./src/js/about.js"
  //   },
  entry: multiPage.getEntryPages(),
  output: {
    //[name] 输出名称等于输入名称   [contenthash:8] 八位hash
    filename: "[name].[contenthash:8].js",
    //你应该知道的node path 知识： http://nodejs.cn/api/path.html
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        // use: ["style-loader", "css-loader", "less-loader"],  不想提取的话可以用这条，但是要修改下其他地方的路径
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [require("autoprefixer")()]
            }
          },
          "less-loader"
        ],
        include: path.resolve(__dirname, "./src") // 制定路径提升性能
      },
      {
        test: /\.(svg|png|jpe?g|gif)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              name: "images/[name].[contenthash:8].[ext]",
              publicPath: "../"
            }
          },
          {
            loader: "image-webpack-loader",
            options: {
              pngquant: {
                quality: "70-80",
                speed: 1
              }
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: ["html-withimg-loader"]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "assets/[name].[contenthash:8].[ext]",
              publicPath: "../"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   filename: "index.html",
    //   template: "./src/index.html"
    // }),
    // new HtmlWebpackPlugin({
    //   filename: "about.html",
    //   template: "./src/about.html"
    // })
    ...multiPage.htmlPlugins(),
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:8].css" //生成八位hash
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require("cssnano"), //用于优化\最小化CSS的CSS处理器，默认为cssnano
      cssProcessorOptions: { safe: true, discardComments: { removeAll: true } }, //传递给cssProcessor的选项，默认为{}
      canPrint: true //一个布尔值，指示插件是否可以将消息打印到控制台，默认为true
    })
  ],
  resolve: {
    extensions: [".js", ".vue", ".json"],
    alias: {
      vue$: "vue/dist/vue.esm.js",
      "@": resolve("src")
    }
  }
};
