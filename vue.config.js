
//是否为生产环境
const isProduction = process.env.NODE_ENV !=='dev'
// 代码压缩
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin')

const path = require("path");

module.exports = {
  productionSourceMap: false,
  configureWebpack: (config) => {
    config.resolve = {
      extensions: ['*', '.mjs', '.js', '.json', '.vue','.css'],
      alias: {
        "@": path.resolve("./src"),
        "@c": path.resolve("./src/components"),
        "@v": path.resolve("./src/views")
      }
    }
    // 生产环境相关配置
    if(isProduction){
      
      // 代码压缩
      config.plugins.push(
        new UglifyJsPlugin({
            uglifyOptions: {
              //生产环境自动删除console
              compress: {
                // warnings: false, // 若打包错误，则注释这行
                drop_debugger: true,
                drop_console: true,
                pure_funcs: ['console.log']
              }
            },
            sourceMap: false,
            parallel: true
        })
      )
      // gzip压缩
      const productionGzipExtensions = ['html', 'js', 'css']
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240, // 只有大小大于该值的资源会被处理 10240
          minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
          deleteOriginalAssets: false // 删除原文件
        })
      )
      // 公共代码抽离
      // config.optimization = {
      //   splitChunks: {
      //     cacheGroups: {
      //       vendor: {
      //         chunks: 'all',
      //         test: /node_modules/,
      //         name: 'vendor',
      //         minChunks: 1,
      //         maxInitialRequests: 5,
      //         minSize: 0,
      //         priority: 100
      //       },
      //       common: {
      //         chunks: 'all',
      //         test: /[\\/]src[\\/]js[\\/]/,
      //         name: 'common',
      //         minChunks: 2,
      //         maxInitialRequests: 5,
      //         minSize: 0,
      //         priority: 60
      //       },
      //       styles: {
      //         name: 'styles',
      //         test: /\.(sa|sc|c)ss$/,
      //         chunks: 'all',
      //         enforce: true
      //       },
      //       runtimeChunk: {
      //         name: 'manifest'
      //       }
      //     }
      //   }
      // }
    }else{
      
    }
  },
  chainWebpack: config => {
    // 图片压缩
    config.module
    .rule('images')
    .use('image-webpack-loader')
    .loader('image-webpack-loader')
    .options({ bypassOnDebug: true })
    .end()

    config.plugin("define").tap(args => {
      args[0]["process.env"].BASE_URL = JSON.stringify(process.env.BASE_URL);
      return args;
    });
  },
  lintOnSave:false,
  // devServer: {
  //   proxy: { // 为天气接口配置代理，解决跨域
  //     '/proxy/': {
  //       'target': 'http://api.baidu.com', //天气接口地址
  //       'secure': false, // false为http访问，true为https访问
  //       'changeOrigin': true, // 跨域访问设置，true代表跨域
  //       'pathRewrite': { // 路径改写规则
  //         '^/proxy': '' // 以/proxy/为开头的改写为''
  //       }
  //     }
  //   }
  // }
};