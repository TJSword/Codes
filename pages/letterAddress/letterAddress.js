// pages/messageAddress/msgAddress.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    site:[]

  },
  goBack: function (e) {//点击返回按钮 返回上一层页面
    wx.navigateBack()
  },
  showDate: function (e) { //弹出上拉选择日期
    console.log(e)
    let dateStr = e.detail.value;
    dateStr = dateStr.replace(/-/g, "/")
    this.setData({
      date: e.detail.value,
      isRotateDate: false, //改变旗帜渲染动画
      sendDate: new Date(dateStr).getTime()
    })
    console.log(this.data.sendDate)
  },
  showSite: function (e) {
    console.log(e.detail)
    this.setData({
      site: e.detail.value.join(""),
      isRotateTime: false,
      postCode:e.detail.postcode
    })
  },
  rotateDate: function (e) {
    this.setData({
      isRotateDate: true,
      isRotateTime: false
    })
  },
  rotateTime: function (e) {
    this.setData({
      isRotateTime: true,
      isRotateDate: false
    })
  },
  rotateAddress: function (e) {
    this.setData({
      isRotateAddress: true,
      isRotateTime: false,
      isRotateDate: false
    })
  },
  rotateSite: function (e) {
    this.setData({
      isRotateSite: true,
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
  siteBlur: function (e) {
    this.setData({
      isRotateSite: false,
      detailedSite:e.detail.value
    })

  },
  rotatePhone: function (e) {
    this.setData({
      isRotatePhone: true,
      isRotateTime: false,
      isRotateDate: false,
      isPhoneNumber: false,
      notPhone: false
    })
  },
  phoneBlur: function (e) {
    this.setData({
      isRotatePhone: false
    })
    console.log(e.detail.value)
    if (/^1[3456789]\d{9}$/.test(e.detail.value)) {
      this.setData({
        isPhoneNumber: true,
        phone: e.detail.value
      })
    } else {
      this.setData({
        isPhoneNumber: false,
        notPhone: true
      })
      if (e.detail.value === "") {
        wx.showToast({
          title: '手机号为空  (^～^;)ゞ',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '手机号有误  (^～^;)ゞ',
          icon: 'none'
        })
      }

    }
  },
  now: function (e) {
    let now = new Date()
    now.setDate(now.getDate() + 7)
    console.log(now.getFullYear(), now.getMonth() + 1, now.getDate())
    let nowstr = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate()
    let timestr = now.getHours() + ":" + now.getMinutes()
    this.setData({
      now: nowstr,
      timeNow: timestr
    })

  },
  toWrite:function(e){
    console.log(this.data.sendDate,this.data.toWho,this.data.site,this.data.detailedSite,this.data.phone)
    if (this.data.sendDate && this.data.toWho && this.data.site && this.data.detailedSite && this.data.isPhoneNumber){
      wx.navigateTo({
        url: '../letterWrite/letterWrite?sendDate=' + this.data.sendDate + '&toWho=' + this.data.toWho + '&site=' + this.data.site + '&detailedSite=' + this.data.detailedSite + "&phone=" + this.data.phone + '&postCode=' + this.data.postCode
      })
    }else{
      wx.showToast({
        title: '请补全信息 (^～^;)ゞ',
        icon: 'none'
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