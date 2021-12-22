// pages/index/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ani:"", //向下按钮的动画效果
    isBefore:true,
    fogani:"",
    statusBarHeight: app.globalData.statusBarHeight,
    markShow:false,
    markAni:"",
    layani:"",
    userInfo:{},
    isFirst:true,
    passwordRight:true
  },
  toAdmin:function(e){
    wx.cloud.callFunction({
      name:"checkAdmin"
    }).then(res=>{
      console.log(res)
      if(res.result){
        wx.navigateTo({
          url: '../admin/admin',
        })
      }
    })
  },

  aniStart: function (e) {  //向下按钮的动画效果
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease'
    });
    this.ani = animation
    var next = true;
     setInterval(function () {
        if (next) {
          //根据需求实现相应的动画
          this.ani.top("94%").step()
          next = !next;
        } else {
          this.ani.top("92%").step()
          next = !next;
        }
        this.setData({
          //导出动画到指定控件animation属性
          ani: animation.export()
        })
      }.bind(this), 800) 

  },

  after:function(e){ // 点击或者滑动向下按钮触发
    clearInterval(this.data.interval)
    var animation = wx.createAnimation({
      duration: 1300,
      timingFunction: 'linear'
    });
    animation.top("105%").opacity(0).step()

    this.setData({
      ani: animation.export()
    })
    var foganimation = wx.createAnimation({
      duration:600,
      timingFunction:"linear"
    });
    foganimation.opacity(1).step()

    setTimeout(()=>{
      this.setData({
        isBefore:false,      
      },
      setTimeout(()=>{
        this.setData({
          fogani: foganimation.export()
        })
      },50)
      )
    },800)
  },


  before:function(e){ //点击烟雾跳回原来的页面
    var foganimation = wx.createAnimation({
      duration: 600,
      timingFunction: "linear"
    });
    foganimation.opacity(0).step()
    this.setData({
      fogani: foganimation.export()
    })
    setTimeout(()=>{
      this.setData({
        isBefore: true
      })
      this.aniStart
    },600)


  },

  // inform: function (e) {//获取用户推送权限
  //   wx.requestSubscribeMessage({
  //     tmplIds: ['TLJXPFnWsuiRVLBw2vDC27cprFDSxBC6XaW0VwL8eqE'],
  //     success: res => {
  //       console.log('调用成功接口', res)
  //     },
  //     complete: res => {
  //       console.log('成功与否都会执行', res)
  //       var markani = wx.createAnimation({//向上弹出动画
  //         duration: 300,
  //         timingFunction: 'ease'
  //       })
  //       markani.top("35%").opacity(0).step()

  //       var layerani = wx.createAnimation({
  //         duration: 300,
  //         timingFunction: 'ease'
  //       })
  //       layerani.backgroundColor("rgba(0,0,0,0)").step()

  //       this.setData({
  //         markAni: markani.export(),
  //         layani: layerani.export()
  //       })
  //       setTimeout(()=>{
  //         this.setData({
  //           markShow:false
  //         })
  //       },350)
  //     }
  //   })
  // },

  // getPhoneNumber:function(e){
  //   wx.cloud.callFunction({
  //     name:"getPhone",
  //     data:{
  //       cloudID:e.detail.cloudID
  //     },
  //     success:res=>{
  //       console.log("获取成功", res.result.list[0].data.phoneNumber)
  //       wx.setStorageSync("phone", res.result.list[0].data.phoneNumber)
  //     },
  //     fail:err=>{
  //       console.log("获取失败", err)
  //     },
  //     complete:res=>{
  //       var markani = wx.createAnimation({//向上弹出动画
  //         duration: 300,
  //         timingFunction: 'ease'
  //       })
  //       markani.top("35%").opacity(0).step()

  //       var layerani = wx.createAnimation({
  //         duration: 300,
  //         timingFunction: 'ease'
  //       })
  //       layerani.backgroundColor("rgba(0,0,0,0)").step()

  //       this.setData({
  //         markAni: markani.export(),
  //         layani: layerani.export()
  //       })
  //       setTimeout(()=>{
  //         this.setData({
  //           markShow:false
  //         })
  //       },350)
  //     }
  //   })
  // },

  iSee:function(e){
    var markani = wx.createAnimation({//向上弹出动画
      duration: 300,
      timingFunction: 'ease'
    })
    markani.top("35%").opacity(0).step()

    var layerani = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    })
    layerani.backgroundColor("rgba(0,0,0,0)").step()

    this.setData({
      markAni: markani.export(),
      layani: layerani.export()
    })
    setTimeout(() => {
      this.setData({
        markShow: false
      })
    }, 350)
  },

  aniMarkStart:function(e){ //弹出说明页动画
    this.setData({
      markShow:true
    })
    var markani = wx.createAnimation({//向上弹出动画
      duration: 300,
      timingFunction: 'ease'
    })
    markani.top("22%").opacity(1).step()

    var layerani = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    })
    layerani.backgroundColor("rgba(0,0,0,0.74)").step()


    setTimeout(()=>{
      this.setData({
        markAni: markani.export(),
        layani: layerani.export()
      })
    },50)
  },
  notouch: function (e) {
    return
  },
  password_focus:function(e){
    this.setData({
      focusing:true
    })
  },
  password_blur:function(e){
    console.log(e.detail.value)
    wx.showToast({
      title: '读取中...',
      icon:'none'
    })
    let secret = e.detail.value
    if(secret === "12345678"){
      this.setData({
        passwordCode: 2
      })

      setTimeout(() => {
        wx.navigateTo({
          url: '../letterRead/letterRead?secret=12345678',
        })
      }, 500)
    }else{
      wx.cloud.callFunction({
        name: "searchMsg",
        data: {
          secret,
        }
      }).then(res => {
        console.log(res.result.data)
        if (e.detail.value === "") {
          this.setData({
            focusing: false
          })
        } else if (res.result.data.length === 1) {
          this.setData({
            passwordCode: 2
          })

          setTimeout(() => {
            wx.navigateTo({
              url: '../msgRead/msgRead?secret=' + e.detail.value,
            })
          }, 800)
        } else {
          this.setData({
            passwordError: true,
            passwordCode: 1
          })
          wx.vibrateShort()
          let timer = setInterval(() => {
            wx.vibrateShort()
          }, 15)
          setTimeout(() => {
            this.setData({
              passwordError: false
            })
            clearInterval(timer)
          }, 310)
        }
      }).catch(err => {
        console.log(err)
      })
    }

  },
  password_input:function(e){
    this.setData({
      passwordCode: 0
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */

  toLogin: function (e) {
    if (this.data.isFirst) {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      wx.navigateTo({
        url: '../mine/mine',
      })
    }

  },

  touchStart: function (e) {
    this.setData({
      startPoint: e.changedTouches[0].clientY,
      startPointX: e.changedTouches[0].clientX
    })
  },
  touchEnd: function (e) {
    if (this.data.startPoint - e.changedTouches[0].clientY > 50) {
      this.after()
    }
    if (this.data.startPointX - e.changedTouches[0].clientX > 80){
      if (app.globalData.isFirst) {
        wx.navigateTo({
          url: '../login/login'
        })
      }else{
        wx.navigateTo({
          url: '../mine/mine',
        })
      }
    }

  },
  toWrite:function(e){
    if(app.globalData.isFirst){
      wx.navigateTo({
        url: '../login/login'
      })
    }else{
      wx.showActionSheet({
        itemList: ['时空密钥', '拾光邮寄'],
        success: res => {
          if (res.tapIndex === 0) {
            wx.navigateTo({
              url: '../msgAddress/msgAddress',
            })
          } else if (res.tapIndex === 1) {
            wx.navigateTo({
              url: '../letterAddress/letterAddress',
            })
          }
        }
      })
    }
  },



  onLoad: function (options) {
    this.aniStart()
    var time = new Date()
    var timeArr =time.toString().split(" ")
    var timeObj = {
      year: timeArr[3],
      month:timeArr[1],
      day:timeArr[2]
    }
    this.setData({
      now:timeObj
    })
    wx.cloud.callFunction({
      name:"getConfig"
    }).then(res=>{
      console.log(res.result)
      this.setData({
        bgUrl: res.result.bgUrl.tempFileURL,
        indexText:res.result.indexText,
        indexTextWriter: res.result.indexTextWriter,
        explain: res.result.explain
        // isTester: res.result.isTester
      })
      app.globalData.config = res.result
    }).catch(err=>{
      console.log(err)
    })

    wx.cloud.callFunction({
      name: "firstCheck",
      success: res => {
        console.log("获取数据成功",res)
        if(res.result.data.length === 0){
          console.log("用户第一次登录")
          app.globalData.isFirst = true;
          this.aniMarkStart()
          this.setData({
            isFirst:true,
            isDone:true
          })
        }
        if(res.result.data.length >= 1){
          console.log("用户为老用户")
          app.globalData.isFirst = false;
          app.globalData.userInfo = res.result.data[0];
          if (res.result.data[0].phone === undefined){
            app.globalData.havePhone = false
            console.log("该用户没有绑定手机号")
          }else{
            app.globalData.havePhone = true
            console.log("该用户已绑定手机号")
          }
          console.log(app.globalData.userInfo)
          this.setData({
            userInfo:res.result.data[0],
            isFirst:false,
            isDone: true
          })
        }
        
      },
      fail: res => {
        console.log("获取数据失败",res)
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
    if(!app.globalData.isFirst){
      this.setData({
        isFirst:false,
        userInfo:app.globalData.userInfo
      })
    }
    console.log(app.globalData)
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
  onShareAppMessage: function (e) {
      return{
        title: app.globalData.config.indexText,
        path: "pages/index/index",
        imageUrl: app.globalData.config.shareUrl.tempFileURL
      }
  }
})