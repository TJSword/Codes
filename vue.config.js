const path = require("path");
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const productionGzipExtensions = ['js', 'css']
const Version = new Date().getTime()
module.exports = {
  
  configureWebpack:{
    output:{ // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
      // filename: utils.assetsPath('js/[name].[chunkhash].'+Version+'js'),
      // chunkFilename: utils.assetsPath('js/[id].[chunkhash].'+Version+'js')
      filename: `js/[name].${Version}.js`,
      chunkFilename: `js/[name].${Version}.js`
    },
    plugins:[
      new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      })
    ]
  },
  chainWebpack: config => {
    config.plugin("define").tap(args => {
      args[0]["process.env"].BASE_URL = JSON.stringify(process.env.BASE_URL);
      return args;
    });
  },
  //eslint校验
  lintOnSave:false,
};