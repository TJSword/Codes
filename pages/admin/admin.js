// pages/admin/admin.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    current:0
  },
  swiperChanged:function(e){
    console.log(e.detail.current)
    this.setData({
      current: e.detail.current
    })
  },
  currentChange:function(e){
    console.log(e.currentTarget.dataset.current)
    this.setData({
      current: e.currentTarget.dataset.current * 1
    })
  },
  goBack: function (e) {//点击返回按钮 返回上一层页面
    wx.navigateBack()
  },
  toDate(timeStamp){
    let date = new Date(timeStamp)
    let year = date.getFullYear() + ""
    let month = date.getMonth() + 1;
    if(month<10){
      month = "0" + month
    }

    let day = date.getDate();
    if (day < 10) {
      day = "0" + day
    }
    return {
      year,month,day
    }
  },
  postalInput:function(e){
    let index = e.target.dataset.index
    let unsentLetters = this.data.unsentLetters
    unsentLetters[index].postalNum = e.detail.value 
    this.setData({
      unsentLetters:unsentLetters
    })
    console.log(this.data.unsentLetters)
    // if (e.detail.value.length <= 14 && e.detail.value.length >=8){
    //   this.setData({
    //     postalNumber: e.detail.value
    //   })
    // }else{
    //   wx.showToast({
    //     title: '请输入正确的邮政号码  \n(^～^;)ゞ',
    //     icon:"none"
    //   })
    //   this.setData({
    //     postalNumber: ""
    //   })
    // }
   
  },
  sent:function(e){
    let index = e.target.dataset.index
    let unsentLetters = this.data.unsentLetters
    console.log(unsentLetters[index].postalNum)
    let postalNum = unsentLetters[index].postalNum
    if(postalNum === ''||postalNum===undefined){
      wx.showToast({
        title: '请输入邮政单号:(',
        icon:"none"
      })
    }else if(postalNum.length < 8 || postalNum.length > 14){
      wx.showToast({
        title: '邮政单号错误:(',
        icon:"none"
      })
    }else{
      wx.showActionSheet({
        itemList: ["发送信件"],
        success:res=>{
          if (res.tapIndex === 0){
            console.log(unsentLetters[index])
            wx.cloud.callFunction({
              name:'adminAddLetter',
              data:unsentLetters[index]
            }).then(res=>{
              console.log(res)
              wx.cloud.callFunction({
                name:'adminRemoveLetter',
                data:{
                  id:unsentLetters[index]._id
                }
              }).then(removeRes=>{
                console.log(removeRes)
                wx.showToast({
                  title: '发送成功:)',
                  icon:"none"
                })
                this.refresh()
              }).catch(error=>{
                wx.showToast({
                  title: '发送失败,请联系管理员',
                  icon:"none"
                })
              })
            }).catch(error=>{
              wx.showToast({
                title: '发送失败,请联系管理员',
                icon:"none"
              })
            })
          }
        }
      })
    }
    // if (this.data.postalNumber === "" || this.data.postalNumber === undefined){
    //   wx.showToast({
    //     title: '请输入正确的邮政号码  \n(^～^;)ゞ',
    //     icon: "none"
    //   })
    // }else{
    //   wx.showActionSheet({
    //     itemList: ["发送信件"],
    //     success: res => {
    //       if (res.tapIndex === 0) {
    //        console.log(this.data.unsentLetters[index])
    //         // let id = e.currentTarget.dataset.id
    //         // console.log(id)
    //         // let postalNumber = this.data.postalNumber
    //         // db.collection('unsentLetter').where({
    //         //   _id:_.eq(id)
    //         // }).get().then(res=>{
    //         //   console.log(res)
    //         //   console.log(app.globalData.userInfo._openid)
    //         //   let openid = app.globalData.userInfo._openid;
    //         //   delete res.data[0]._id
    //         //   delete res.data[0]._openid
    //         //   console.log(res.data[0])
    //         //   db.collection("sentLetter").add({
    //         //     data: {
    //         //       ...res.data[0],
    //         //       sendAdmin: openid,
    //         //       postalNumber
    //         //     }
    //         //   }).then(addRes=>{
    //         //     console.log(addRes)
    //         //     db.collection('unsentLetter').doc(id).remove().then(removeRes=>{
    //         //       console.log(removeRes)
    //         //       wx.showToast({
    //         //         title: '发送成功',
    //         //         icon:"none"
    //         //       })
    //         //       this.refresh()
    //         //     })
    //         //   }).catch(err=>{
    //         //     console.log(err)
    //         //   })
    //         // })
    //       }
    //     }
    //   })
    // }
  },
  open:function(e){
    console.log(e.currentTarget.dataset.secret)
    wx.navigateTo({
      url: '../letterRead/letterRead?secret=' + e.currentTarget.dataset.secret,
    })
  },
  openUnsent:function(e){
    wx.navigateTo({
      url: '../letterRead/letterRead?unsentSecret=' + e.currentTarget.dataset.secret,
    })
  },
  notouch:function(e){
    return
  },
  showUnsentAddress:function(e){
    console.log(e.currentTarget.dataset.index)
    let i = e.currentTarget.dataset.index
    console.log(this.data.unsentLetters[i])
    let detail = this.data.unsentLetters[i]
    wx.showModal({
      title: '地址详情',
      content: `邮政编码：${detail.postCode} \n地址：${detail.site + detail.detailedSite}\n姓名：${detail.toWho}\n电话：${detail.phone}\n密钥：${detail.secret}\n收信日期：${detail.sendDateYMD.year}年${detail.sendDateYMD.month}月${detail.sendDateYMD.day}日`,
      showCancel:false,
      confirmText:'我知道了'
    })
  },
  showSentAddress:function(e){
    console.log(e.currentTarget.dataset.index)
    let i = e.currentTarget.dataset.index
    console.log(this.data.sentLetters[i])
    let detail = this.data.sentLetters[i]
    wx.showModal({
      title: '地址详情',
      content: `邮政编码：${detail.postCode} \n地址：${detail.site + detail.detailedSite}\n姓名：${detail.toWho}\n电话：${detail.phone}\n密钥：${detail.secret}\n收信日期：${detail.sendDateYMD.year}年${detail.sendDateYMD.month}月${detail.sendDateYMD.day}日\n邮政单号：${detail.postalNum}`,
      showCancel: false,
      confirmText: '我知道了'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  refresh(){
    wx.cloud.callFunction({
      name: "adminLetters",
      data: {},
      success: res => {
        this.toDate()
        console.log(res.result)
        let unsentLetters = res.result.unsentLetterRes.data;
        let sentLetters = res.result.sentLetterRes.data;
        console.log(unsentLetters)
        unsentLetters.forEach(item => {
          item.sendDateYMD = this.toDate(item.sendDate * 1)
        })
        sentLetters.forEach(item => {
          // item.sendDateYMD = this.toDate(item.sendDate * 1)
        })
        this.setData({
          unsentLetters: unsentLetters,
          sentLetters: sentLetters
        })
        console.log(this.data.sentLetters)
        
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  onLoad: function (options) {
    this.refresh()
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