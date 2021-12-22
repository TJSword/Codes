// pages/letterWrite/letterWrite.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight
  },
  goBack: function (e) {//点击返回按钮 返回上一层页面
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(options.unsentSecret){
      wx.cloud.callFunction({
        name:'searchUnsentLetter',
        data:options
      }).then(res=>{
        console.log(res.result.data[0])
        this.setData({
          letterDetail: res.result.data[0]
        })
        let createDate = new Date(res.result.data[0].createTime)
        let createYear = createDate.getFullYear();
        let createMonth = createDate.getMonth() + 1;
        if (createMonth < 10) {
          createMonth = "0" + createMonth
        }
        let createDay = createDate.getDate();
        if (createDay < 10) {
          createDay = "0" + createDay
        }
        let createHour = createDate.getHours();
        if (createHour < 10) {
          createHour = "0" + createHour
        }
        let createMinute = createDate.getMinutes();
        if (createMinute < 10) {
          createMinute = "0" + createMinute
        }
        let createSconds = createDate.getSeconds();
        if (createSconds < 10) {
          createSconds = "0" + createSconds
        }
        this.setData({
          createDate: `${createYear}年${createMonth}月${createDay}日 ${createHour}:${createMinute}:${createMinute}`
        })
        }).catch(err => {
          console.log(err)
        })
    }else{
      wx.cloud.callFunction({
        name: "searchLetter",
        data: {
          secret: options.secret
        }
      }).then(res => {
        console.log(res.result.data[0])
        this.setData({
          letterDetail: res.result.data[0]
        })
        let createDate = new Date(res.result.data[0].createTime)
        let createYear = createDate.getFullYear();
        let createMonth = createDate.getMonth() + 1;
        if (createMonth < 10) {
          createMonth = "0" + createMonth
        }
        let createDay = createDate.getDate();
        if (createDay < 10) {
          createDay = "0" + createDay
        }
        let createHour = createDate.getHours();
        if (createHour < 10) {
          createHour = "0" + createHour
        }
        let createMinute = createDate.getMinutes();
        if (createMinute < 10) {
          createMinute = "0" + createMinute
        }
        let createSconds = createDate.getSeconds();
        if (createSconds < 10) {
          createSconds = "0" + createSconds
        }
        this.setData({
          createDate: `${createYear}年${createMonth}月${createDay}日 ${createHour}:${createMinute}:${createMinute}`
        })
      }).catch(err => {
        console.log(err)
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: app.globalData.config.indexText,
      path: "pages/index/index",
      imageUrl: app.globalData.config.shareUrl.tempFileURL
    }
  }
})