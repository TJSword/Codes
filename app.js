// app.js
App({
  onLaunch() {
    wx.cloud.init({
      env: "remember-9g9uezjvfd43fe89",//环境ID 在云开发中 设置内查找
      traceUser: true
    }) 
  },
  globalData: {
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
  }
})
