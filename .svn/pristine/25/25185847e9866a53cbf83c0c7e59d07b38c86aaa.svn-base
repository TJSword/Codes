// pages/PublishPro/PublishPro.js
import { request, saveRequest } from '../../utils/util.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    chooseAniBox:[false,false,false,false,false,false,false,false,false,false,false],
    proTypeyArr:[],
    difficultyArr: [],
    pmArr:[],
    optionsBit:1,
    optionsArr:[null],
    indexArr:[null,null,null,null,null]
  },
  goBack: function (e) {//点击返回按钮 返回上一层页面
    wx.navigateBack({
      delta: 0,
    })
  },
  choose_box(e){
    let aniId = e.currentTarget.dataset.id
    let arr = this.data.chooseAniBox;
    arr[aniId] = true;
    this.setData({
      chooseAniBox:arr
    })
  },
  proType(e){
    console.log(e)
    this.setData({
      proTypeIndex: e.detail.value
    })
  },
  proTypeCancel(e){ //用户点击取消
    console.log(e.currentTarget.dataset.id)
    if (!this.data.proTypeIndex){
      let aniId = e.currentTarget.dataset.id
      let arr = this.data.chooseAniBox;
      arr[aniId] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  proLabel(e){
    console.log(e)
    this.setData({
      proLabelIndex: e.detail.value
    })
  },
  proLabelCancel(e){ //用户点击取消
    console.log(e.currentTarget.dataset.id)
    if (!this.data.proTypeIndex){
      let aniId = e.currentTarget.dataset.id
      let arr = this.data.chooseAniBox;
      arr[aniId] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  difficulty(e){
    this.setData({
      difficultyIndex: e.detail.value
    })
  },
  difficultyCancel(e){
    console.log(e.currentTarget.dataset.id)
    if (!this.data.difficultyIndex) {
      let aniId = e.currentTarget.dataset.id
      let arr = this.data.chooseAniBox;
      arr[aniId] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  date(e){
    this.setData({
      remindDate: e.detail.value
    })
  },
  dateCancel(){
    if(!this.data.remindDate){
      let aniId = e.currentTarget.dataset.id
      let arr = this.data.chooseAniBox;
      arr[aniId] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  startDate(e){
    console.log(e.detail.value);
    this.setData({
      startDate:e.detail.value
    })
  },
  startDateCancel(e){
    if (!this.data.startDate) {
      let aniId = e.currentTarget.dataset.id
      let arr = this.data.chooseAniBox;
      arr[aniId] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  endDate(e){
    this.setData({
      endDate: e.detail.value
    })
  },
  endDateCancel(e){
    if (!this.data.endDate) {
      let aniId = e.currentTarget.dataset.id
      let arr = this.data.chooseAniBox;
      arr[aniId] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  pro_name(e){
    this.setData({
      proName: e.detail.value
    })
  },
  pro_name_blur(e){
    if (e.detail.value === "") {
      let arr = this.data.chooseAniBox;
      arr[0] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  pro_rp(e){
    this.setData({
      proRp: e.detail.value
    })
  },
  pro_rp_blur(e){
    if (e.detail.value === "") {
      let arr = this.data.chooseAniBox;
      arr[1] = false;
      this.setData({
        chooseAniBox: arr
      })
    } else {
      if (!this.isNumber(e.detail.value)) {
        wx.showToast({
          title: '请输入数字',
          icon: 'none'
        })
      }
    }
  },
  pro_commission(e){
    this.setData({
      proCommission: e.detail.value
    })
  },
  pro_commission_blur(e){
    if (e.detail.value === "") {
      let arr = this.data.chooseAniBox;
      arr[8] = false;
      this.setData({
        chooseAniBox: arr
      })
    } else {
      if (!this.isNumber(e.detail.value)) {
        wx.showToast({
          title: '请输入数字',
          icon: 'none'
        })
      }
    }
  },
  pro_content(e){
    this.setData({
      proContent:e.detail.value
    })
  },
  pro_content_blur(e){
    if (e.detail.value === "") {
      let arr = this.data.chooseAniBox;
      arr[7] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  isNumber(val) {
    var regPos = /^\d+(\.\d+)?$/; //整数
    if (regPos.test(val) || "") {
      return true;
    } else {
      return false;
    }
  },
  submit(e){
    if (this.data.proName === "" || this.data.proName === undefined){
      wx.showToast({
        title: '请填写事件名称',
        icon:'none'
      })
    } else if (this.data.remindDate === undefined){
      wx.showToast({
        title: '请选择提醒日期',
        icon: 'none'
      })
    }else if(this.data.optionsArr.includes(null)){
      wx.showToast({
        title: '请补充完整提醒人',
        icon:'none'
      })
    } else{
      wx.showModal({
        content: '确认新增事件?',
        success:res=>{
          if(res.confirm){
            this.setData({
              loading:true
            })
            let optionsArr = this.data.optionsArr
            let arr=  []
            optionsArr.forEach(item=>{
              arr.push(item.value)
            })
            saveRequest('/event/save','post',{
              name:this.data.proName,
              remindDate:this.data.remindDate,
              reminder:arr.join(',')
            },'application/json').then(res=>{
              this.setData({
                loading: false
              })
              console.log(res)
              if(res.code === 0){
                wx.showToast({
                  title: '新增事件成功',
                  icon:'none'
                })
                setTimeout(() => {
                  wx.redirectTo({
                    url: '../Index/Index',
                  })
                }, 1000)
              }else{
                wx.showToast({
                  title: '发布失败，请联系管理员',
                  icon: "none"
                })
              }
            })
          }
        }
      })
      console.log('表单全部填充完毕')
    }
  },
  chooseFile(){
    wx.chooseMessageFile({
      count: 1,
      type:'file',
      extension:['pdf'],
      success:res=>{
        console.log(res.tempFiles[0])
        console.log(app.globalData.URL)
        wx.uploadFile({
          filePath: res.tempFiles[0].path,
          name: 'file',
          url: app.globalData.URL + '/file/upload',
          header:{
            "content-type":"multipart/form-data",
            'token':wx.getStorageSync('token')
          },
          success:res1=>{
            console.log(JSON.parse(res1.data))
            let data = JSON.parse(res1.data)
            this.setData({
              fileId:data.fileId,
              fileName:res.tempFiles[0].name
            })
          },
          fail:err=>{
            console.log(err)
          }
        })
      },
      fail:err=>{
        console.log(err)
        wx.showToast({
          title: '你未选择文件:(',
          icon:'none'
        })
      }
    })
  },
  addOption(){
    let bit = this.data.optionsBit + 1;
    let arr = this.data.optionsArr;
    arr.push(null)
    this.setData({
      optionsBit: bit,
      optionsArr: arr
    })
  },
  minus(e){
    let bit = this.data.optionsBit - 1;
    let arr = this.data.optionsArr;
    arr.pop()
    this.setData({
      optionsBit: bit,
      optionsArr:arr
    })
  },
  choosePattern(e){
    let value = this.data.rylb[e.detail.value].user_id
    let index = e.currentTarget.dataset.index
    let optionsArr = this.data.optionsArr

    console.log(index)
    optionsArr[index] = {
      value,
      label:this.data.rylb[e.detail.value].name
    }
    console.log(optionsArr)
    this.setData({
      optionsArr
    })
  },
  // getNYCD(){
  //   request('/dict/ndxz','get').then(res=>{
  //     console.log(res)
  //     let nycd = [];
  //     res.dicts.forEach(item => {
  //       nycd.push(item.name)
  //     })
  //     this.setData({
  //       nycd:res.dicts,
  //       difficultyArr: nycd
  //     })
  //   })
  // },
  getRYLB(){
    request('/user/list','get').then(res=>{
      console.log(res)
      let rylb = [];
      res.serchResult.unshift({
        name:'全体成员',
        user_id:0
      })
      res.serchResult.forEach(item => {
        rylb.push(item.name)
      })
      this.setData({
        rylb: res.serchResult,
        remindArr: rylb
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getXMLX()
    // this.getNYCD()
    this.getRYLB()
    // this.getLabelList()
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