const path = require("path");
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
module.exports = {
  configureWebpack: () => ({
    resolve: {
      alias: {
        "@": path.resolve("./src")
      }
    },
    plugins: [
      // 配置compression-webpack-plugin压缩
      new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      })
    ]
  }),
  chainWebpack: config => {
    config.plugin("define").tap(args => {
      args[0]["process.env"].BASE_URL = JSON.stringify(process.env.BASE_URL);
      return args;
    });
  },
  lintOnSave:false,
};