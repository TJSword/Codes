// pages/letterWrite/letterWrite.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    contentDetail:""
  },
  canSend: function (e) {

    if (e.detail.value === "") {
      this.setData({
        canSend: false
      })
    } else {
      this.setData({
        canSend: true
      })
    }
    this.setData({
      contentDetail:e.detail.value
    })

  },
  goBack: function (e) {//点击返回按钮 返回上一层页面
    if(this.data.canSend){
      wx.showModal({
        content: '确定要退出本页面吗？退出后内容将会清空',
        cancelText: "再写一写",
        confirmText: "我要退出",
        cancelColor: "#000000",
        confirmColor: "#576B95",
        success:res=>{
          if (res.confirm) {
            wx.navigateBack()
          }
        }
      })
    }else{
      wx.navigateBack()
    }
  },
  send: function (e) {
        wx.showToast({
          title: '正在校验内容..',
          icon:"none",
          mask:true
        })
      wx.cloud.callFunction({
        name: "msgCheck",
        data: {
          content: this.data.contentDetail
        }
      }).then(res=>{
        wx.hideToast()
        console.log(res)
        if(res.result.errCode === 0){
          wx.showModal({
            content: '确定要寄出了吗？寄出之后不可编辑，且时间未到不可查看',
            cancelText: "再看一眼",
            confirmText: "未来再见",
            cancelColor: "#000000",
            confirmColor: "#576B95",
            success: res => {
              if (res.confirm) {
                wx.cloud.callFunction({
                  name: "pay",
                  data: {
                    orderid: new Date().getTime(),
                    money: app.globalData.config.money.letter
                  },
                  success: res => {
                    console.log("调用pay函数成功", res)
                    wx.requestPayment({
                      timeStamp: res.result.timeStamp,
                      nonceStr: res.result.nonceStr,
                      package: res.result.package,
                      signType: "MD5",
                      paySign: res.result.paySign,
                      success: res => {
                        console.log("支付成功", res)
                        let secret = Math.floor(Math.random() * 2821109907455).toString(36).toUpperCase()
                        wx.cloud.callFunction({
                          name: "uploadLetter",
                          data: {
                            writer: app.globalData.userInfo.nickName,
                            ...this.data.addressDetail,
                            contentTitle: this.data.title || "展信佳",
                            contentDetail: this.data.contentDetail,
                            secret
                          },
                          success: res => {
                            console.log(res)
                            wx.showToast({
                              title: '上传成功 (๑•̀ㅂ•́) ☆',
                              icon: "none"
                            })
                            setTimeout(() => {
                              wx.reLaunch({
                                url: '../index/index'
                              })
                            }, 1000)
                          }
                        })
                      },
                      fail: res => {
                        console.log("支付失败", res)
                        wx.showToast({
                          title: '网络异常 (^～^;)ゞ',
                          icon: "none"
                        })
                      }
                    })
                  },
                  fail: res => {
                    console.log("调用云函数失败", res)
                    wx.showToast({
                      title: '网络异常 (^～^;)ゞ',
                      icon: "none"
                    })
                  }
                })
              }
            }
          })
        }else{
          wx.showToast({
            title: '内容违规 (^～^;)ゞ',
            icon:"none"
          })
        }
      })
  },
  letter_title:function(e){
    console.log(e)
    this.setData({
      title:e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.cloud.callFunction({
      name: "getConfig"
    }).then(res => {
      console.log(res)
      app.globalData.config = res.result
    })

    
    console.log(options)
    this.setData({
      addressDetail:options
    })
    console.log()
   
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