 // pages/mine/mine.js
const app = getApp()
const DB = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    current:0,
    hasSendLetter:true,
    isUpdate:false,
    userInfo:{},
    havePhone:app.globalData.havePhone,
    bgUrl: ""
  },


  goBack: function (e) {//点击返回按钮 返回上一层页面
    wx.navigateBack()
  },

  toAbout:function(e){//跳转到关于页面
    wx.navigateTo({
      url: '../about/about',
    })
  },
  toWrite:function(e){
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
  },

  swiperChanged:function(e){//轮播图变化时去修改current的值
    this.setData({
      current: e.detail.current
    })
  },
  tabChanged: function (e) {//tabbar变化时去修改current的值
    this.setData({
      current: e.target.dataset.current
    })
  },
  update:function(e){
    this.setData({
      isUpdate:true
    })
    wx.getUserProfile({
      desc: '用于完善会员资料', 
      success:infoRes=>{
        console.log(infoRes.userInfo)
        wx.cloud.callFunction({
          name:"updateUserInfo",
          data:{
            avatarUrl: infoRes.userInfo.avatarUrl,
            nickName: infoRes.userInfo.nickName
          },
          success:res=>{
            console.log(res)
            wx.showToast({
              title: '更新资料成功 (๑•̀ㅂ•́) ☆',
              icon:'none'
            })
            this.setData({
              isUpdate:false
            })
            app.globalData.userInfo.avatarUrl = infoRes.userInfo.avatarUrl,
            app.globalData.userInfo.nickName = infoRes.userInfo.nickName
            this.setData({
              userInfo:app.globalData.userInfo
            })
            
          },
          fail:res=>{
            wx.showToast({
              title: '网络异常 (^～^;)ゞ',
              icon:"none"
            })
            console.log(res)
            this.setData({
              isUpdate: false
            })
          }
        })
        
      }
    })
  },
  getPhoneNumber:function(e){
    wx.cloud.callFunction({
      name: "getPhone",
      data: {
        cloudID: e.detail.cloudID
      },
      success: res => {
        console.log("获取成功", res)
        this.setData({
          havePhone:true
        });
        app.globalData.havePhone = true
        app.globalData.userInfo.phone = res.result
        wx.showToast({
          title: '绑定成功 (๑•̀ㅂ•́) ☆',
          icon:"none"
        })
      },
      fail: err => {
        console.log("获取失败", err)
      },
      complete: res => {
        
      }
    })
  },
  toDate(timeStamp){ //封装时间戳转换成xx年xx月xx日
    let date = new Date(timeStamp);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return {
      year,
      month,
      day
    }
  },
  downImg(path){
    return new Promise((resolve, reject) => {
      wx.cloud.downloadFile({
        fileID: path,
        success: res => resolve(res),
        fail: err => reject(err)
      })
    })

  },
  distance(timestamp){
    let res = timestamp - new Date().getTime() 
    return Math.floor(res/1000)
  },

  showDetail:function(e){
    console.log(e.currentTarget.dataset.secret)
    let secret = e.currentTarget.dataset.secret;
    wx.navigateTo({
      url: '../msgRead/msgRead?secret=' + secret,
    })
  },
  showLetterDetail:function(e){
    console.log(e.currentTarget.dataset.secret)
    let secret = e.currentTarget.dataset.secret;
    wx.navigateTo({
      url: '../letterRead/letterRead?secret=' + secret,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      havePhone: app.globalData.havePhone
    })
    console.log(app.globalData.config.bgUrl.tempFileURL)
    this.setData({
      userInfo:app.globalData.userInfo,
      bgUrl: app.globalData.config.bgUrl.tempFileURL
    })
    console.log(app.globalData.userInfo)
    var timeStart = app.globalData.userInfo.meetTime
    var timeNow = new Date().getTime()
    var apart = timeNow - timeStart
    apart = Math.ceil(apart / (24 * 60 *60 *1000))
    this.setData({
      apart
    })
    
    wx.cloud.callFunction({
      name:"searchMineMsg",
      data:{}
    }).then(res=>{
      console.log(res.result)
      let sentMsg = res.result.sentRes.data
      let unsentMsg = res.result.unsentRes.data
      sentMsg.forEach(async item => {
        item.createTime = this.toDate(item.createTime)
        if (item.imageFileID[0]){
          let res = this.downImg(item.imageFileID[0])
          item.imageFileID = await res
        }
        console.log(item.imageFileID)
        this.setData({
          sentMsg: sentMsg,
        })
      })
      let timeFlag = true;
      unsentMsg.forEach(async item => {
        item.createTime = this.toDate(item.createTime)
        item.distance = await this.distance(item.sendTime)
        console.log(item.imageFileID[0])
        if (item.imageFileID[0]){
          let res = this.downImg(await item.imageFileID[0])
          item.imageFileID = await res
        }
        console.log(item.imageFileID)
        this.setData({
          unsentMsg
        })
        console.log(this.data.unsentMsg)
        if (timeFlag){
          setInterval(() => {
            let unsentMsg = this.data.unsentMsg;
            unsentMsg.forEach(item => {
              item.distance--
            });
            this.setData({
              unsentMsg
            })
          }, 1000)
          timeFlag = false
        }else{
          timeFlag = false
        }
        console.log(this.data.unsentMsg)
      })

    }).catch(err=>{
      console.log(err)
    })
    
    wx.cloud.callFunction({
      name:"searchMineLetter",
      success:res=>{
        console.log(res.result.unsentLetterRes.data, res.result.sentLetterRes.data)
        let unsentLetter = res.result.unsentLetterRes.data
        let sentLetter = res.result.sentLetterRes.data
        sentLetter.forEach(async item => {
          item.createTime = this.toDate(item.createTime)
          this.setData({
            sentLetter: sentLetter,
          })
        })
        let timeFlag = true;
        unsentLetter.forEach(async item => {
          item.createTime = this.toDate(item.createTime)
          item.distance = await this.distance(item.sendDate)
          if (timeFlag) {
            setInterval(() => {
              let unsentLetter = this.data.unsentLetter;
              unsentLetter.forEach(item => {
                item.distance--
              });
              this.setData({
                unsentLetter
              })
            }, 1000)
            timeFlag = false
          } else {
            timeFlag = false
          }
          this.setData({
            unsentLetter: unsentLetter,
          })
        })
        console.log(this.data.unsentLetter,this.data.sentLetter)
      }
    })


    wx.cloud.callFunction({
      name:"searchReceivedMsgLetter",
      data:{
        phone:app.globalData.userInfo.phone
      },
      success:res=>{
        console.log(res.result.sentLetter.data)
        console.log(res.result.sentMsg.data)
        let receivedMsg = res.result.sentMsg.data
        let receivedLetter = res.result.sentLetter.data
        receivedMsg.forEach(async item=>{
          item.createTime = this.toDate(item.createTime)
          if (item.imageFileID[0]) {
            let res = this.downImg(item.imageFileID[0])
            item.imageFileID = await res
          }
          console.log(item.imageFileID.tempFilePath)
          console.log(this.data.receivedMsg)
          console.log(this.data.sentMsg)
          this.setData({
            receivedMsg
          })
        })

        receivedLetter.forEach( async item=>{
          item.createTime = this.toDate(item.createTime)
          this.setData({
            receivedLetter
          })
        })
        console.log(this.data.receivedMsg,this.data.receivedLetter)
      },
      fail:err=>{
        console.log(err)
      }
    })
      setTimeout(()=>{
        console.log(this.data.sentMsg,this.data.unsentMsg,this.data.sentLetter,this.data.unsentLetter)
        console.log(this.data.receivedMsg,this.data.receivedLetter)
      },2000)
      // console.log(app.globalData.config.isTester)
      // this.setData({
      //   isTester: app.globalData.config.isTester
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