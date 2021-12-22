// pages/messageAddress/msgAddress.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    
  },
  goBack: function (e) {//点击返回按钮 返回上一层页面
    wx.navigateBack()
  },
  showDate:function(e){ //弹出上拉选择日期
    console.log(e)
    this.setData({
      date: e.detail.value,
      isRotateDate:false //改变旗帜渲染动画
    })
  },
  showTime:function(e){
    this.setData({
      time: e.detail.value,
      isRotateTime:false
    })
  },
  rotateDate:function(e){
    this.setData({
      isRotateDate:true,
      isRotateTime: false
    })
  },
  rotateTime: function (e) {
    this.setData({
      isRotateTime: true,
      isRotateDate: false
    })
  },
  rotatePhone:function(e){
    this.setData({
      isRotatePhone: true,
      isRotateTime: false,
      isRotateDate: false,
      isPhoneNumber: false,
      notPhone: false
    })
  },
  rotateAddress: function (e) {
    this.setData({
      isRotateAddress: true,
      isRotateTime: false,
      isRotateDate: false
    })
  },
  addressBlur: function (e) {
    this.setData({
      isRotateAddress: false,
      toWho:e.detail.value
    })
  },
  phoneBlur:function(e){
    this.setData({
      isRotatePhone: false,
      phoneNumber:e.detail.value
    })
    console.log(e.detail.value)
    if (/^1[3456789]\d{9}$/.test(e.detail.value)) {
      this.setData({
        isPhoneNumber:true
      })
    }else{
      this.setData({
        isPhoneNumber: false,
        notPhone:true
      })
      if (e.detail.value === ""){
        wx.showToast({
          title: '手机号为空  (^～^;)ゞ',
          icon: 'none'
        })
      }else{
        wx.showToast({
          title: '手机号有误  (^～^;)ゞ',
          icon: 'none'
        })
      }

    } 
  },
  now:function(e){
    let now = new Date()
    console.log(now.getFullYear(), now.getMonth() + 1, now.getDate())
    let nowstr = now.getFullYear() + "-" + (now.getMonth() + 1) + "-"+ now.getDate()
    let timestr = now.getHours() + ":" + now.getMinutes()
    this.setData({
      now:nowstr,
      timeNow: timestr
    })
    

  },
  allReady: function (e) { 
    console.log(this.data.date,this.data.time)
    console.log(new Date(this.data.date+" "+ this.data.time).getTime())
    let timeStr = this.data.date + " " + this.data.time
    timeStr = timeStr.replace(/-/g, "/")
    let timeStamp = new Date(timeStr).getTime()
    console.log(timeStamp)
    console.log(this.data.phoneNumber)
    console.log(this.data.toWho)
    if (this.data.date && this.data.time && this.data.toWho && this.data.isPhoneNumber){
      wx.navigateTo({
        url: '../msgWrite/msgWrite?timeStamp=' + timeStamp + "&toWho=" + this.data.toWho + "&phone=" + this.data.phoneNumber,
      })
    }else{
      wx.showToast({
        title: '请补全信息 (^～^;)ゞ',
        icon:'none'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.now()
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

  }
})