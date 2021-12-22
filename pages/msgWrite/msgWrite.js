// pages/write/write.js
const app = getApp()
const RecorderManager = wx.getRecorderManager()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    imagePaths:[],
    recording:false,
    isPlaying:false,
    second:0,
    content:"",
    line: [
      { height: 8, cls: 'row1' },
      { height: 18, cls: 'row3' },
      { height: 25, cls: 'row5' },
      { height: 45, cls: 'row2' },
      { height: 32, cls: 'row8' },
      { height: 25, cls: 'row1' },
      { height: 18, cls: 'row6' },
      { height: 8, cls: 'row2' },
      { height: 32, cls: 'row8' },
      { height: 25, cls: 'row4' },
      { height: 48, cls: 'row2' },
      { height: 8, cls: 'row1' },
      { height: 8, cls: 'row6' },
      { height: 18, cls: 'row8' },
      { height: 25, cls: 'row1' },
      { height: 32, cls: 'row7' },
      { height: 32, cls: 'row1' },
      { height: 25, cls: 'row8' },
      { height: 18, cls: 'row5' },
      { height: 8, cls: 'row7' },
      { height: 45, cls: 'row2' },
      { height: 32, cls: 'row4' },
      { height: 25, cls: 'row1' },
      { height: 18, cls: 'row6' },
      { height: 45, cls: 'row3' },
      { height: 32, cls: 'row4' },
      { height: 25, cls: 'row2' },
      { height: 18, cls: 'row8' },
      { height: 8, cls: 'row5' },
    ], //声音条每个view的高度 
  },
  chooseImage:function(e){ // 选择图片
    wx.chooseImage({
      count:3 - this.data.imagePaths.length,
      success:res=>{
        console.log(res.tempFilePaths)
        if(this.data.imagePaths.length === 0){
          let imagePaths =[]
          imagePaths = imagePaths.concat(res.tempFilePaths)
          this.setData({
            imagePaths
          })
        }else{
          this.setData({
            imagePaths: this.data.imagePaths.concat(res.tempFilePaths)
          })
        }
        
        console.log(this.data.imagePaths)
      }
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
  recordVoiceStart:function(e){ //记录声音开始
    wx.authorize({
      scope: 'scope.record',
      success:res=>{
        console.log("获取用户权限",res)
        if (!this.data.recording) {
          RecorderManager.start({
            duration: 1800000
          })
          RecorderManager.onStart(() => {
            console.log("开始录制")
            this.setData({
              recording: true
            })
          })
          let second = 0
          this.setData({
            timer: setInterval(() => {
              second++
              console.log(second)
              this.setData({
                second
              })
            }, 1000)
          })
        } else { //停止记录
          RecorderManager.stop();
          RecorderManager.onStop(res => {
            console.log("录音结束", res)
            clearInterval(this.data.timer)
            this.setData({
              recording: false,
              voice: res,
              second:0
            })
          });

        }
      },
      fail:res=>{
        console.log("获取录音权限失败",res)
        wx.showToast({
          title: '如需再次开启授权，\n请删除小程序后重新添加',
          icon:"none"
        })
      }
    })

  },
  playVoice:function(e){
    if(!this.data.isPlaying){
      this.setData({
        isPlaying: true
      })
      this.setData({
        audioContext: wx.createInnerAudioContext()
      })
      this.data.audioContext.src = this.data.voice.tempFilePath
      this.data.audioContext.play()
      this.data.audioContext.onPlay(() => {
        console.log("播放录音了")
      })
      this.data.audioContext.onEnded(() => {
        this.data.audioContext.destroy()
        console.log("自动停止")
        this.setData({
          isPlaying: false
        })
      })
    }else{
      this.data.audioContext.stop();
      this.data.audioContext.onStop(()=>{
      this.data.audioContext.destroy()
        console.log("停止播放")
        this.setData({
          isPlaying:false
        })
      })
    }

  },

  canSend:function(e){
    this.setData({
      title: e.detail.value
    })
    if(e.detail.value === ""){
      this.setData({
        canSend: false
      })
    }else{
      this.setData({
        canSend: true
      })
    }

  },
  textarea:function(e){
    this.setData({
      content:e.detail.value
    })
  },


  uploadImg(imagePaths, i, secret, imageFileID) {
    wx.showToast({
      title: '上传图片ing...',
      icon:'none',
      mask: true,
      duration:600000
    })
    wx.cloud.uploadFile({
      cloudPath: `photos/${secret}_${i + 1}.png`,
      filePath: imagePaths[i],
      fail:res=>{
        wx.showToast({
          title: '服务器崩惹 (^～^;)ゞ',
          icon:'none'
        })
      },
      success: res => {
        console.log(res)
        i = i + 1
        if (i  === imagePaths.length) {//上传成功
          imageFileID.push(res.fileID)
          console.log(imageFileID)
          this.uploadInfo(imageFileID, secret)
          return imageFileID
        } else {//还没上传完毕 继续上传
          imageFileID.push(res.fileID)
          this.uploadImg(imagePaths, i, secret, imageFileID);
        }
      }
    })
  },
  uploadInfo(imageFileID, secret){
    if (this.data.voice) {
      wx.showToast({
        title: '上传录音ing...',
        icon:'none',
        mask:true,
        duration: 600000
      })
      let voiceFileID = "";
      wx.cloud.uploadFile({
        cloudPath: `voice/${secret}.acc`,
        filePath: this.data.voice.tempFilePath
      }).then(res => {
        voiceFileID = res.fileID
        wx.cloud.callFunction({
          name: "uploadMsg",
          data: {
            writer: app.globalData.userInfo.nickName,
            phone: this.data.msgAddress.phone,
            sendTime: this.data.msgAddress.timeStamp * 1,
            toWho: this.data.msgAddress.toWho,
            contentTitle: this.data.title,
            contentDetail: this.data.content,
            imageFileID,
            voiceFileID,
            secret
          }
        }).then(res => {
          console.log(res)
          wx.showToast({
            title: '上传成功 (๑•̀ㅂ•́) ☆',
            icon:"none"
          })
          setTimeout(()=>{
            wx.reLaunch({
              url: '../index/index'
            })
          },1000)
        })
      }).catch(err=>{
        wx.showToast({
          title: '服务器崩惹 (^～^;)ゞ',
          icon: 'none'
        })
      })
    } else {
      wx.cloud.callFunction({
        name: "uploadMsg",
        data: {
          writer: app.globalData.userInfo.nickName,
          phone: this.data.msgAddress.phone,
          sendTime: this.data.msgAddress.timeStamp * 1,
          toWho:this.data.msgAddress.toWho,
          contentTitle: this.data.title || "展信佳",
          contentDetail: this.data.content || "",
          imageFileID: imageFileID,
          voiceFileID: '',
          secret
        }
      }).then(res => {
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
      })
    }
  },

  send:function(e){
    wx.showToast({
      title: '正在校验内容..',
      icon:"none",
      mask:true
    })
    wx.cloud.callFunction({
      name: "msgCheck",
      data: {
        content: this.data.content
      }
    }).then(res=>{
      wx.hideToast()
      if(res.result.errCode === 0){
        wx.showModal({
          content: '确定要寄出了吗？寄出之后不可编辑，且时间未到不可查看',
          cancelText: "再看一眼",
          confirmText: "未来再见",
          cancelColor: "#000000",
          confirmColor: "#576B95",
          success: res => {
            if (res.confirm) {
              if(app.globalData.config.isFree){
                let secret = Math.floor(Math.random() * 2821109907455).toString(36).toUpperCase()
                let imagePaths = this.data.imagePaths
                let imageFileID = [];
                if (imagePaths.length === 0) {
                  this.uploadInfo(imageFileID, secret)
                } else {
                  this.uploadImg(imagePaths, 0, secret, [])
                }

              }else{
                wx.cloud.callFunction({
                  name: "pay",
                  data: {
                    orderid: new Date().getTime(),
                    money: app.globalData.config.money.msg
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
                        let imagePaths = this.data.imagePaths
                        let imageFileID = [];
                        if (imagePaths.length === 0) {
                          this.uploadInfo(imageFileID, secret)
                        } else {
                          this.uploadImg(imagePaths, 0, secret, [])
                        }
  
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
          }
        })
      }else{
        wx.showToast({
          title: '内容违规 (^～^;)ゞ',
          icon: "none"
        })
      }
    })
  },
  voiceRemove:function(e){
    this.setData({
      voiceRemoving:true
    })
    setTimeout(()=>{
      this.setData({
        voiceRemoving: false
      })
    },1000)
    wx.vibrateShort()
    wx.showActionSheet({
      itemList:['删除'],
      itemColor:"#FA5151",
      success:res=>{
        console.log(res.tapIndex)
        if(res.tapIndex === 0){
          var animation =  wx.createAnimation({
            duration: 300,
            timingFunction: 'ease'
          })
          animation.left("105%").step()
          this.setData({
            voiceAni: animation.export()
          })
        }
        setTimeout(()=>{
          this.setData({
            voice: null,
            voiceAni: ""
          })
        },310)
      },
      fail:res=>{
        console.log(res)
      }
    })
  },
  previewImage:function(e){
    console.log(e.currentTarget.dataset.url)
    wx.previewImage({
      urls: [e.currentTarget.dataset.url]
    })
  },
  imageRemove:function(e){
    wx.vibrateShort()
    console.log(e.target.dataset.index)
    wx.showActionSheet({
      itemList: ['删除'],
      itemColor: "#FA5151",
      success:res=>{
        if (res.tapIndex === 0) {
          this.setData({
            imageRemoveIndex: e.target.dataset.index
          })
          setTimeout(()=>{
            let imagePaths = this.data.imagePaths
            imagePaths.splice(e.target.dataset.index, 1)
            this.setData({
              imageRemoveIndex: "",
              imagePaths,
            })
          },310)
        }
      },
      fail:res=>{
        this.setData({
          imageRemoveIndex: null
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.cloud.callFunction({
    //   name: "getConfig"
    // }).then(res => {
    //   console.log(res)
    //   app.globalData.config = res.result
    //   console.log(app.globalData.config.isTester)
    //   this.setData({
    //     isTester: app.globalData.config.isTester
    //   })
    // })

    this.setData({
      msgAddress:options
    })
    console.log(this.data.msgAddress)
    console.log(app.globalData)
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
    clearInterval(this.data.playTimer)
    clearInterval(this.data.timer)
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