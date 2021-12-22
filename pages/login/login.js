//index.js
//获取应用实例
const app = getApp()
const DB = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    isLogining:false,
    now:{}
  },
  goBack:function(e){//点击返回按钮 返回上一层页面
    wx.navigateBack()
  },

  getUserInfo:function(e){
    this.setData({
      isLogining: true
    })
    wx.getUserProfile({
      desc: '用于完善会员资料', 
      success:res=>{
        console.log(res.userInfo)
        console.log(this.data.isLogining)
        let userInfo = res.userInfo
        app.globalData.userInfo = userInfo
        app.globalData.userInfo.meetTime= new Date().getTime()
        wx.cloud.callFunction({
          name:"addUser",
          data:{
            nickName: userInfo.nickName,
            avatarUrl: userInfo.avatarUrl,
            phone:wx.getStorageSync("phone")
          },
          success:res=>{
            console.log('调用云函数成功', res)
            wx.showToast({
              title: '登录成功 (๑•̀ㅂ•́) ☆',
              icon:"none"
            })
            app.globalData.isFirst = false
            setTimeout(()=>{
              wx.navigateBack()
            },1200)
          },
          fail:res=>{
            console.log('调用云函数失败',res)
            wx.showToast({
              title: '网络异常 (^～^;)ゞ',
              icon:"none"
            })
          }
        })


        // DB.collection("users").add({ //登录 数据添加到数据库
        //   data:{
        //     nickName:userInfo.nickName,
        //     avatarUrl: userInfo.avatarUrl,
        //     donate:0,
        //     meetTime: DB.serverDate()
        //   },
        //   success:res=>{
        //     wx.showToast({
        //       title: '登录成功 (๑•̀ㅂ•́) ☆',
        //       icon:"none"
        //     })
            
        //     app.globalData.isFirst = false
        //     setTimeout(()=>{
        //       wx.navigateBack()
        //     },1500)
        //   },
        //   fail:res=>{
        //     wx.showToast({
        //       title: '网络异常 (^～^;)ゞ',
        //     })
        //   }
        // })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // wx.loadFontFace({
    //   family: "pingfang",
    //   source: 'url("https://github.com/successdream/pingfang/raw/master/font/%E8%8B%B9%E6%96%B9%E9%BB%91%E4%BD%93-%E4%B8%AD%E9%BB%91-%E7%AE%80.ttf")',
    //   success: res => {
    //     console.log("字体加载成功")
    //   },
    //   fail: res => {
    //     console.log("字体加载失败")
    //   }
    // })
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
