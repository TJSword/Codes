// pages/msgRead/msgRead.js
const app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
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
    goBack: function (e) {//点击返回按钮 返回上一层页面
    wx.navigateBack()
  },
  downloadImg(imageFileID, i,imagePaths){
    wx.showToast({
      title: '读取图片ing...',
      icon:'none'
    })
    wx.cloud.downloadFile({
      fileID: imageFileID[i],
      success: res => {
        console.log(res.tempFilePath)
        i=i+1;
        if(i === imageFileID.length){
          imagePaths.push(res.tempFilePath);
          wx.showToast({
            title: '读取成功 (๑•̀ㅂ•́) ☆',
            icon: 'none'
          })
          this.setData({
            imagePaths
          })
          console.log(this.data.imagePaths)
        }else{
          imagePaths.push(res.tempFilePath);
          console.log(imagePaths)
          this.downloadImg(imageFileID, i, imagePaths)
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  previewImage: function (e) {
    console.log(e.currentTarget.dataset.url)
    wx.previewImage({
      urls: [e.currentTarget.dataset.url]
    })
  },

  playVoice: function (e) {
    if (!this.data.isPlaying) {
      this.setData({
        isPlaying: true
      })
      this.setData({
        audioContext: wx.createInnerAudioContext()
      })
      this.data.audioContext.src = this.data.voiceFileID
      this.data.audioContext.play()
      this.data.audioContext.onPlay(() => {
        console.log("播放录音了")
      })
      this.data.audioContext.onEnded(()=>{
        this.data.audioContext.destroy()
        console.log("自动停止")
        this.setData({
          isPlaying: false
        })
      })
    } else {
      this.data.audioContext.stop();
      this.data.audioContext.onStop(() => {
        this.data.audioContext.destroy()
        console.log("停止播放")
      
        this.setData({
          isPlaying: false
        })
      })
    }

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    wx.showToast({
      title: '读取ing...',
      icon: 'none'
    })
    console.log(options)
    if (options){
      wx.cloud.callFunction({
        name:"searchMsg",
        data:options
      }).then(async res=>{
        await this.downloadImg(res.result.data[0].imageFileID,0,[])
        this.setData({
          msgDetail: res.result.data[0]
        })
        console.log(this.data.msgDetail)
        console.log(this.data.msgDetail.voiceFileID)
        console.log(this.data.msgDetail.imageFileID)
        if (this.data.msgDetail.voiceFileID === "" && this.data.msgDetail.imageFileID.length !==0){
          this.setData({
            case:1
          })
        } else if (this.data.msgDetail.voiceFileID !== "" && this.data.msgDetail.imageFileID.length ===0){
          this.setData({
            case:2
          })
        } else if (this.data.msgDetail.voiceFileID === "" && this.data.msgDetail.imageFileID.length === 0){
          this.setData({
            case:3
          })
        }
        
        let createDate = new Date(res.result.data[0].createTime)
        let createYear = createDate.getFullYear();
        let createMonth = createDate.getMonth() + 1;
        if (createMonth<10){
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

        wx.cloud.downloadFile({
          fileID: res.result.data[0].voiceFileID,
          success: res => {
            this.setData({
              voiceFileID: res.tempFilePath
            })
            console.log(this.data.voiceFileID)
          },
          fail: err => {
            console.log(err)
          }
        })
        
      }).catch(err=>{
        wx.showToast({
          title: '网络异常 (^～^;)ゞ',
          icon:"none"
        })
      })
    }
    setTimeout(()=>{
      console.log(this.data.msgDetail.voiceFileID)
      console.log(this.data.msgDetail.imageFileID)
      console.log(this.data.case)
    },2000)
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