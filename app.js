//app.js
const app = getApp()
App({
  onLaunch: function () {
    wx.cloud.init({
      env: "letter-tb92g",//环境ID 在云开发中 设置内查找
      traceUser: true
    }) 
  },

  globalData: {
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    isFirst:true,
    havePhone:false
  }
})