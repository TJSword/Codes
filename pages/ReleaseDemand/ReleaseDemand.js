// pages/ReleaseDemand/ReleaseDemand.js
const app = getApp()
import { request, saveRequest } from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    chooseAniBox: [false, false, false, false, false, false, false, false,false,false],
    chooseProArr:[],
    rpTypeIndex:[null,null],
    workTimeArr:[],
    showWorkTime:false,
    workTimeIndex:null,
    rpArr:['研值任务','佣金任务'],
    hard_easy:[1,2,3,4,5,6,7]
  },
  goBack: function (e) {//点击返回按钮 返回上一层页面
    wx.navigateBack()
  },
  choose_box(e) {
    let aniId = e.currentTarget.dataset.id
    let arr = this.data.chooseAniBox;
    arr[aniId] = true;
    this.setData({
      chooseAniBox: arr
    })
  },
  choosePro(e){
    this.setData({
      chooseProIndex: e.detail.value
    })
  },
  chooseProCancel(e){
    if (!this.data.chooseProIndex) {
      let aniId = e.currentTarget.dataset.id
      let arr = this.data.chooseAniBox;
      arr[aniId] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  showProInfo(e){
    wx.showModal({
      title:this.data.chooseProArrInfo[this.data.chooseProIndex].project_name,
      content: `${this.data.chooseProArrInfo[this.data.chooseProIndex].describe}\n研值：${this.data.chooseProArrInfo[this.data.chooseProIndex].offer}\n佣金：${this.data.chooseProArrInfo[this.data.chooseProIndex].commission}`,
      showCancel: false
    })
  },
  demand_name(e){
      this.setData({
        demandName:e.detail.value
      })
  },
  demand_name_blur(e){
    if (e.detail.value === "") {
      let arr = this.data.chooseAniBox;
      arr[1] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  task_time(e){
    this.setData({
      taskTime:e.detail.value
    })
  },
  task_time_blur(e){
    if (e.detail.value === "") {
      let arr = this.data.chooseAniBox;
      arr[10] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  getRPtype(){
    request('/dict/commission_type','get').then(res=>{
      console.log(res.dicts[0].value)
      request('/dict/' + res.dicts[0].value, 'get').then(res1=>{
        console.log(res,res1)
        let rpType = [];
        rpType[0] = [];
        let rptype_info_1 = res.dicts
        res.dicts.forEach(item=>{
          rpType[0].push(item.name)
        })
        rpType[1] = []
        res1.dicts.forEach(item=>{
          rpType[1].push(item.name)
        })
        this.setData({
          demandLabelArrInfo:res1.dicts,
          demandLabelArr: rpType,
          rptype_info_1
        })
        console.log(this.data.demandLabelArr)
      })
    })
  },
  getUserList(){
    request('/user/list','get').then(res=>{
      console.log(res.serchResult)
      let arr = []
      res.serchResult.forEach(item=>{
        arr.push(item.name)
      })
      console.log(arr)
      this.setData({
        ioArr:arr,
        ioArrInfo: res.serchResult
      })
    })
  },
  startDate(e) {
    console.log(e.detail.value);
    this.setData({
      startDate: e.detail.value
    })
  },
  startDateCancel(e) {
    if (!this.data.startDate) {
      let aniId = e.currentTarget.dataset.id
      let arr = this.data.chooseAniBox;
      arr[aniId] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  endDate(e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  endDateCancel(e) {
    if (!this.data.endDate) {
      let aniId = e.currentTarget.dataset.id
      let arr = this.data.chooseAniBox;
      arr[aniId] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  showInfo(){
    console.log(this.data.labelInfo)
    wx.showModal({
      title: '标签详情',
      content: `${this.data.labelInfo.remarks}\n佣金参考范围(每个任务):${this.data.labelInfo.min} ~ ${this.data.labelInfo.max}`,
      showCancel: false
    })
  },
  demand_label(e){
    console.log(e.detail.value)
    this.setData({
      rpTypeIndex:e.detail.value
    })
    let val = this.data.demandLabelArrInfo[this.data.rpTypeIndex[1] ? this.data.rpTypeIndex[1]:0].value
    console.log(val)
    request('/dict/info/'+ val,'get').then(res=>{
      console.log(res.dicts)
      this.setData({
        labelInfo:res.dicts
      })
      if (res.dicts.unit === ''){
        this.setData({
          showWorkTime:false
        })
      }else{
        let arr = []
        for(let i = 1;i < 100; i++){
          arr.push(i + '' + res.dicts.unit)
        }
        
        this.setData({
          workTimeArr:arr,
          showWorkTime: true,
          workTimeIndex:null
        })
      }
    })
  },
  demand_label_column(e){
    console.log(e.detail)
    if(e.detail.column === 0){
      console.log(this.data.rptype_info_1[e.detail.value].value)
      let val = this.data.rptype_info_1[e.detail.value].value;
      request('/dict/' + val,'get').then(res=>{
        let rp_list_2 = []
        res.dicts.forEach(item=>{
          rp_list_2.push(item.name)
        })
        let arr = this.data.demandLabelArr;
        arr[1] = rp_list_2
        this.setData({
          demandLabelArrInfo: res.dicts,
          demandLabelArr:arr
        })
      })
      let index = this.data.rpTypeIndex;
      index[0] = e.detail.value;
      this.setData({
        rpTypeIndex:index
      })
    } else if (e.detail.column === 1){
      let index = this.data.rpTypeIndex;
      index[1] = e.detail.value;
      this.setData({
        rpTypeIndex: index
      })
    }
  },
  demand_label_cancel(){
    if (this.data.rpTypeIndex[0] === null ){
      let arr = this.data.chooseAniBox;
      arr[2] = false;
      this.setData({
        chooseAniBox:arr
      })
    }
  },
  hard_easy_change(e){
    this.setData({
      hard_easy_num:e.detail.value
    })
  },
  demand_rp(e){
    this.setData({
      demandRp : e.detail.value
    })
  },
  demand_rp_blur(e){
    if (e.detail.value === "") {
      let arr = this.data.chooseAniBox;
      arr[3] = false;
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
  isNumber(val) {
    var regPos = /^\d+(\.\d+)?$/; //整数
    if (regPos.test(val) || "") {
      return true;
    } else {
      return false;
    }
  },
  work_time(e){
    console.log(e.detail.value)
    this.setData({
      workTimeIndex:e.detail.value
    })
  },
  workTimeCancel(e){
    console.log(this.data.workTimeIndex)
    if (!this.data.workTimeIndex) {
      let aniId = e.currentTarget.dataset.id
      let arr = this.data.chooseAniBox;
      arr[3] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  rp(e){
    console.log(e.detail.value)
    this.setData({
      rpIndex:e.detail.value
    })
  },
  rpCancel(e){
    if (!this.data.rpIndex) {
      let aniId = e.currentTarget.dataset.id
      let arr = this.data.chooseAniBox;
      arr[aniId] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  io(e){
    this.setData({
      ioIndex: e.detail.value
    })
  },
  ioCancel(e){
    if (!this.data.ioIndex) {
      let aniId = e.currentTarget.dataset.id
      let arr = this.data.chooseAniBox;
      arr[aniId] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  demand_content(e){
    this.setData({
      demandContent: e.detail.value
    })

  },
  demand_content_blur(e){
    if (e.detail.value === "") {
      let arr = this.data.chooseAniBox;
      arr[7] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  getProList() {
    request('/project/list', 'get', {
      title: "",
      state: "0",
      pm: wx.getStorageSync("uid")
    }).then(res => {
      console.log(res.searchResult)
      let arr = []
      res.searchResult.forEach(item => {
        arr.push(item.project_name)
      })
      this.setData({
        chooseProArr: arr,
        chooseProArrInfo: res.searchResult
      })
    })
  },
  submit(){
    console.log(this.data.startDate,this.data.endDate)
    if (this.data.chooseProIndex === undefined){
      wx.showToast({
        title: '请选择项目',
        icon: 'none'
      })
    } else if (this.data.demandName === "" || this.data.demandName===undefined){
      wx.showToast({
        title: '请填写任务名称',
        icon:'none'
      })
    } else if (this.data.rpTypeIndex[1] === null){
      wx.showToast({
        title: '请选择任务标签',
        icon:'none'
      })
    }else if(this.data.rpIndex === undefined){
      wx.showToast({
        title: '请选择任务类型',
        icon:'none'
      })
    }
    else if (this.data.ioIndex  === undefined){
      wx.showToast({
        title: '请选择IO',
        icon: 'none'
      })
    } else if (this.data.taskTime === '' || this.data.taskTime === undefined){
      wx.showToast({
        title: '请填写任务工时',
        icon: 'none'
      })
    }else if (this.data.hard_easy_num === undefined){
      wx.showToast({
        title: '请选择任务难度',
        icon: 'none'
      })
    } else if (this.data.endDate === undefined) {
      wx.showToast({
        title: '请选择结束时间',
        icon: 'none'
      })
    } else if (this.data.demandContent === "" || this.data.demandContent === undefined){
      wx.showToast({
        title: '请填写任务简介',
        icon: 'none'
      })
    }else{
      wx.showModal({
        content: '确认发布任务?',
        success:res=>{
          if(res.confirm){
            this.setData({
              loading: true
            })
            saveRequest('/demand/save','post',{
              projectId: this.data.chooseProArrInfo[this.data.chooseProIndex].project_id,
              title:this.data.demandName,
              demand: this.data.demandContent,
              joiner: this.data.ioArrInfo[this.data.ioIndex].user_id,
              demandType:this.data.rpIndex*1 + 1 + '',
              workTime:this.data.taskTime,
              level:this.data.hard_easy_num *1 +1 +'',
              tagType:this.data.labelInfo.type,
              tagValue:this.data.labelInfo.value,
              expectEndDate:this.data.endDate
            },'application/json').then(res=>{
              console.log(res)
              this.setData({
                loading: false
              })
              if(res.code === 0){
                wx.showToast({
                  title: '发布任务成功',
                  icon:'none'
                })
                setTimeout(() => {
                  wx.navigateTo({
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
    }
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRPtype()
    this.getUserList()
    this.getProList()
    // this.getPercent()
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