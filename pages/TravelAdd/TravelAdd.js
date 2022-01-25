// pages/TravelAdd/TravelAdd.js
import { request, saveRequest } from '../../utils/util.js';
const app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    chooseAniBox: [false, false, false, false, false, false, false, false,false,false],
    optionsBit:1
  },
  goBack: function (e) {//点击返回按钮 返回上一层页面
   wx.navigateBack({
     delta: 0,
   })
  },
  choose_box(e) {
    let aniId = e.currentTarget.dataset.id
    let arr = this.data.chooseAniBox;
    arr[aniId] = true;
    this.setData({
      chooseAniBox: arr
    })
  },
  getProList(){
    if(this.data.isPersonal){
      request('/project/list', 'get', {
        title: "",
        state:'',
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
    }else{
      request('/project/list', 'get', {
        title: "",
        state:'',
        pm: ''
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
    }
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
  place(e){
      this.setData({
        placeName:e.detail.value
      })
  },
  place_blur(e){
    if (e.detail.value === "") {
      let arr = this.data.chooseAniBox;
      arr[3] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
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
        personArr:arr,
        personArrInfo: res.serchResult
      })
    })
  },
  choosePerson(e){
    console.log(e.detail.value)
    console.log(this.data.personArr[e.detail.value])
    let people = this.data.people?this.data.people:''
    if(people === ''){
      this.setData({
        people: this.data.personArr[e.detail.value] 
      })
    }else{
      this.setData({
        people:people + '，' + this.data.personArr[e.detail.value] 
      })
    }
   
  },
  slicePerson(){
    let people = this.data.people;
    let arr = people.split('，')
    arr.pop()
    this.setData({
      people: arr.join('，')
    })
  },
  choosePersonCancel(e){
    if(this.data.people === undefined || this.data.people ===''){
      let arr = this.data.chooseAniBox;
      arr[4] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  traffic(e){
    this.setData({
      trafficMoney:e.detail.value
    })
  },
  traffic_blur(e){
    if (e.detail.value === "") {
      let arr = this.data.chooseAniBox;
      arr[5] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  repast(e){
    this.setData({
      repastMoney:e.detail.value
    })
  },
  repast_blur(e){
    if (e.detail.value === "") {
      let arr = this.data.chooseAniBox;
      arr[6] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  stay(e){
    this.setData({
      stayMoney:e.detail.value
    })
  },
  stay_blur(e){
    if (e.detail.value === "") {
      let arr = this.data.chooseAniBox;
      arr[7] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  else(e){
    this.setData({
      elseMoney:e.detail.value
    })
  },
  else_blur(e){
    if (e.detail.value === "") {
      let arr = this.data.chooseAniBox;
      arr[8] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  remark(e){
    this.setData({
      remark_content:e.detail.value
    })
  },
  remark_blur(e){
    if (e.detail.value === "") {
      let arr = this.data.chooseAniBox;
      arr[9] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  submit(){
    if(this.data.chooseProIndex === undefined){
      wx.showToast({
        title: '请选择项目',
        icon:'none'
      })
    }else if(this.data.startDate === undefined){
      wx.showToast({
        title: '请选择开始日期',
        icon:'none'
      })
    }else if(this.data.endDate === undefined){
      wx.showToast({
        title: '请选择结束日期',
        icon:'none'
      })
    }else if(this.data.placeName === undefined || this.data.placeName === ''){
      wx.showToast({
        title: '请填写出差地点',
        icon:'none'
      })
    }else if(this.data.people === undefined  || this.data.people === ''){
      wx.showToast({
        title: '请选择参与人',
        icon:'none'
      })
    }else{
      wx.showModal({
        content:'确认新增差旅记录?',
        success:res=>{
          if(res.confirm){
            this.setData({
              loading: true
            })
            saveRequest('/fee/save','post',{
              projectName:this.data.chooseProArr[this.data.chooseProIndex],
              projectId:this.data.chooseProArrInfo[this.data.chooseProIndex].project_id,
              startDate:this.data.startDate,
              endDate:this.data.endDate,
              address:this.data.placeName,
              joiner:this.data.people,
              trafficFee:this.data.trafficMoney?this.data.trafficMoney*1:0,
              repastFee:this.data.repastMoney?this.data.repastMoney*1:0,
              acdFee:this.data.stayMoney?this.data.stayMoney*1:0,
              otherFee:this.data.elseMoney?this.data.elseMoney*1:0,
              type:this.data.isPersonal?2:1,
              remark:this.data.remark_content
            },'application/json').then(res=>{
              this.setData({
                loading: false
              })
              if(res.code === 0){
                wx.showToast({
                  title: '新增差旅记录成功',
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
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ //判断是不是公司出的费用
      isPersonal:wx.getStorageSync('uid') === 132?false:true
    })
    this.getProList()
    this.getUserList()
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