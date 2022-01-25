// pages/Login/Login.js
const app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:false
  },
  getUserInfo(e){
    this.setData({
      loading:true
    })
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        app.globalData.userInfo = res.userInfo
        wx.login({
          success:res=>{
            console.log(res)
            if(res.code){
              wx.request({
                url:  app.globalData.URL + '/login',
                method:"POST",
                header:{
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                  code: res.code,
                  nickName: app.globalData.userInfo.nickName,
                  avatarUrl: app.globalData.userInfo.avatarUrl
                },
                success:res=>{
                  if(res.data.code === 0){
                    console.log('登录成功了', res)
                    wx.setStorageSync('token', res.data.token)
                    wx.setStorageSync('uid', res.data.uid)
                    wx.setStorageSync('iscreate', res.data.iscreate)
                    wx.setStorageSync('role', res.data.role)
                    setTimeout(()=>{
                      wx.reLaunch({
                        url: '../ToDoList/ToDoList',
                      })
                    },200)
                    
                  }else{
                    wx.showToast({
                      title: '肥肠抱歉，你没有权限',
                      icon:"none"
                    })
                  }
                },
                fail: err=>{
                  console.log(err)
                },
                complete:res=>{
                  this.setData({
                    loading:false
                  })
                }
              })
            }
          }
        })
      }
    })
   

  },
  showDetail(){
    wx.showModal({
      title: '客研社TRS',
      content: '客研社TaskResourceStation是一款客研社内部的OA系统。\n小程序内部集工作流程、以研值（RP）为赏金，最大限度地提高工作效率和质量。\n只有最酷的人才能进入，赶快去授权登录吧~，',
      showCancel: false,
      confirmText: "Sign Up",
      success: res => {
        if (res.confirm) {
          
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo;
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })

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