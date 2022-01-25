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
    pmArr:[]
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
  pm(e){
    console.log(e)
    this.setData({
      pmIndex: e.detail.value
    })
  },
  pmCancel(e){
    console.log(e.currentTarget.dataset.id)
    if (!this.data.pmIndex) {
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
        title: '请填写项目名称',
        icon:'none'
      })
    } else if (this.data.pmIndex === undefined){
      wx.showToast({
        title: '请选择PM',
        icon:'none'
      })
    } else if (this.data.proContent === "" || this.data.proContent === undefined){
      wx.showToast({
        title: '请填写项目简介',
        icon: 'none'
      })
    }else{
      wx.showModal({
        content: '确认发布项目?',
        success:res=>{
          if(res.confirm){
            this.setData({
              loading:true
            })
            saveRequest('/project/save','post',{
              projectName:this.data.proName,
              pm: this.data.rylb[this.data.pmIndex].user_id,
              describe: this.data.proContent,
              // projectType:this.data.xmlx[this.data.proTypeIndex].value,
            },'application/json').then(res=>{
              this.setData({
                loading: false
              })
              console.log(res)
              if(res.code === 0){
                wx.showToast({
                  title: '发布项目成功',
                  icon:'none'
                })
                setTimeout(() => {
                  wx.navigateTo({
                    url: '../ProList/ProList',
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
  // getXMLX(){
  //   request('/dict/xmlx','get').then(res=>{
  //     console.log(res)
  //     let xmlx = [];
  //     res.dicts.forEach(item => {
  //       xmlx.push(item.name)
  //     })
  //     this.setData({
  //       xmlx: res.dicts,
  //       proTypeyArr:xmlx
  //     })
  //   })
  // },
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
      res.serchResult.forEach(item => {
        rylb.push(item.name)
      })
      this.setData({
        rylb: res.serchResult,
        pmArr: rylb
      })
    })
  },
  // getLabelList(){
  //   request('/tag/list','get',{
  //     creator:wx.getStorageSync('uid')
  //   }).then(res=>{
  //     console.log(res)
  //     let labelList = []
  //     res.searchRst.forEach(item=>{
  //       labelList.push(item.name)
  //     })
  //     this.setData({
  //       xzbq:labelList,
  //       labelList:res.searchRst
  //     })
  //   })
  // },
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