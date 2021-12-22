// pages/about/about.js
const app = getApp()
const DB = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight, //自动获取胶囊高度
    feedbackAni:"",//反馈动画
    markShow:false,
    baseAni:"",
    moneyBoxAni:"",
    moneyBoxShow:false,
    moneyAni:"",
    moneyNumber:[
      { id: 0, value: 2 },
      { id: 1, value: 6 },
      { id: 2, value: 8 },
      { id: 3, value: 12 },
      { id: 4, value: 22 },
      { id: 5, value: 66 },
    ],
    isClicked:false,
    moneyValue:2
  },

  goBack: function (e) {//点击返回按钮 返回上一层页面
    wx.navigateBack()
  },

  toUser:function(e){
    setTimeout(()=>{
      wx.navigateTo({
        url: '../letterRead/letterRead?secret=12345678',
      })
    },500)
  },

  feedbackAni:function(e){  //反馈盒子打开动画
    this.setData({
      markShow:true
    })
    var feedbackAni = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    })
    feedbackAni.bottom(0).opacity(1).step()
    var baseAni = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    })
    baseAni.backgroundColor("rgba(0,0,0,0.75)").step()
    setTimeout(()=>{
      this.setData({
        feedbackAni: feedbackAni.export(),
        baseAni: baseAni.export()
      })
    },50)
  },
  feedbackAniEnd:function(e){ //反馈盒子收回动画
    var feedbackAni = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    })
    feedbackAni.bottom("-750rpx").opacity(0).step()
    var baseAni = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    })
    baseAni.backgroundColor("rgba(0,0,0,0)").step()
    this.setData({
      feedbackAni: feedbackAni.export(),
      baseAni: baseAni.export()
    })
    setTimeout(()=>{
      this.setData({
        markShow:false
      })
    },350)
  },
  notouch:function(e){ //防止实践冒泡的无触摸事件
    return
  },


  moneyAni:function(e){ //打赏盒子弹出动画
    this.setData({
      moneyBoxShow: true
    })
    var moneyAni = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    })
    moneyAni.bottom(0).opacity(1).step()
    var moneyBoxAni = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    })
    moneyBoxAni.backgroundColor("rgba(0,0,0,0.75)").step()
    setTimeout(() => {
      this.setData({
        moneyBoxAni: moneyBoxAni.export(),
        moneyAni: moneyAni.export()
      })
    }, 50)
  },

  moneyBoxAniEnd:function(e){ //打赏盒子收回动画
    var moneyAni = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    })
    moneyAni.bottom("-750rpx").opacity(0).step()
    var moneyBoxAni = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    })
    moneyBoxAni.backgroundColor("rgba(0,0,0,0)").step()
    this.setData({
      moneyAni: moneyAni.export(),
      moneyBoxAni: moneyBoxAni.export()
    })
    setTimeout(() => {
      this.setData({
        moneyBoxShow: false
      })
    }, 350)
  },

  suggest: function (e) { //建议赋值给data
    console.log(e.detail.value)
    this.setData({
      suggest: e.detail.value
    })
  },

  updateSuggest:function(e){ //上传建议
    console.log(this.data.suggest)
    if (this.data.suggest === "" || this.data.suggest === undefined){
      wx.showToast({
        title: '建议内容不能为空哦 \n(^～^;)ゞ',
        icon:"none"
      })
    }else{
      this.setData({
        isClicked:true
      })
      wx.cloud.callFunction({
        name: "addSuggest",
        data: {
          nickName: app.globalData.userInfo.nickName,
          avatarUrl: app.globalData.userInfo.avatarUrl,
          suggest: this.data.suggest
        },
        success: res => {
          console.log('调用云函数成功', res)
          wx.showToast({
            title: '我们会仔细阅读您的建议 \n(๑•̀ㅂ•́)و✧',
            icon: "none"
          })
          setTimeout(() => {
            this.feedbackAniEnd()
            this.setData({
              isClicked:false
            })
          }, 1000)
        },
        fail: res => {
          console.log('调用云函数失败', res)
          wx.showToast({
            title: '网络异常 (^～^;)ゞ',
            icon: "none"
          })
        }
      })
    }

  },
  chooseNumber:function(e){ //选中钱数
    console.log(e.currentTarget.dataset.value)
    this.setData({
      moneyValue: e.currentTarget.dataset.value
    })
  },
  buySugar:function(e){ //打赏按钮
    wx.cloud.callFunction({
      name:"pay",
      data:{
        orderid: Date.now(),
        money:this.data.moneyValue * 100
      },
      success:res=>{
        console.log("调用pay函数成功",res)
        wx.requestPayment({
          timeStamp: res.result.timeStamp,
          nonceStr: res.result.nonceStr,
          package: res.result.package,
          signType: "MD5",
          paySign: res.result.paySign,
          success: res => {
            console.log("支付成功", res)
            wx.showToast({
              title: '感谢你的支持  φ(゜▽゜*)♪',
              icon:"none"
            })
            wx.cloud.callFunction({
              name:"updateDonate",
              data:{
                money: this.data.moneyValue
              },
              success:succRes=>{
                console.log("更新成功",succRes)
              },
              fail:failRes=>{
                console.log("更新失败",failRes)
              }
            })
            this.moneyBoxAniEnd()
          },
          fail: res => {
            console.log("支付失败", res)
          }
        })
      },
      fail:res=>{
        console.log('调用pay函数失败',res)
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.loadFontFace({//动态加载字体
    //   family: "pingfang",
    //   source: 'url("https://github.com/perrychan1/fonts/raw/master/PingFang%20SC/PingFang%20SC.ttc")',
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
    return {
      title: app.globalData.config.indexText,
      path: "pages/index/index",
      imageUrl: app.globalData.config.shareUrl.tempFileURL
    }
  }
})