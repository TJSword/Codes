// pages/Chart/Chart.js
import * as echarts from '../../ec-canvas/echarts';
import { request, saveRequest } from '../../utils/util.js';
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    contribution: [],
    ec: {
      lazyLoad: false // 延迟加载
    }, //饼图
    ec_1: {
      lazyLoad: false // 延迟加载
    }, //饼图
    ec_2: {
      lazyLoad: false // 延迟加载
    }, //饼图
    startDate: '2019-01-01',
    endDate: '2020-03-24',
    type: 0,
    isCreate: wx.getStorageSync('iscreate'),
    userId: wx.getStorageSync('uid'),
    showDemandList: true,
    isrp:true
  },
  goBack: function (e) {//点击返回按钮 返回上一层页面
    wx.navigateBack()
  },
  bindStartDateChange(e) {
    console.log(e.detail.value)
    this.setData({
      startDate: e.detail.value
    })
    console.log(this.data.startDate)
    this.getPie(this.data.startDate, this.data.endDate, this.data.type, this.data.userId,this.data.isrp)
  },
  bindEndDateChange(e) {
    console.log(e.detail.value)
    this.setData({
      endDate: e.detail.value
    })
    console.log(this.data.startDate)
    this.getPie(this.data.startDate, this.data.endDate, this.data.type, this.data.userId,this.data.isrp)
    this.getcontributeList()
  },
  //初始化图表--饼图
  init_pieCharts: function () {
    this.piechartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      const pieChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      pieChart.setOption(this.getPieOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return pieChart;
    });
  },
  init_pieCharts_1:function(){
    this.piechartsComponnet_1.init((canvas, width, height) => {
      // 初始化图表
      const pieChart_1 = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      pieChart_1.setOption(this.getPieOption_1());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return pieChart_1;
    });
  },
  init_pieCharts_2:function(){
    this.piechartsComponnet_2.init((canvas, width, height) => {
      // 初始化图表
      const pieChart_2 = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      pieChart_2.setOption(this.getPieOption_2());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return pieChart_2;
    });
  },

  //饼图
  getPieOption: function () {
    let option = {
      xAxis: {
          type: 'category',
          data:this.data.barXAis
      },
      yAxis: {
          type: 'value'
      },
      series: [{
          data:this.data.barYAis,
          type: 'bar',
      }]
    }
    return option;
  },
  getPieOption_1:function(){
    let option = {
      title: {
        text: '全部员工的课题分布',
        left: 'center',
        textStyle:{
          fontSize:12
        }
      },
   
    color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
    series: [{
      label: {
        normal: {
          fontSize: 14
        }
      },
      type: 'pie',
      data: this.data.pie_1
    }]
    }
    return option;
  },
  getPieOption_2:function(){
    let option = {
      title: {
        text: '全部员工的业务分布',
        left: 'center',
        textStyle:{
          fontSize:12
        }
      },
    color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
    series: [{
      label: {
        normal: {
          fontSize: 14
        }
      },
      type: 'pie',
      data: this.data.pie_2
    }]
    }
    return option;
  },
  getBar(startDate, endDate, userId){
    request('/statistics/contribute','get',{startDate,endDate,userId}).then(res=>{
      console.log(res.contributeList)
      let data = res.contributeList
      let barXAis= []
      let barYAis= []
      data.forEach(item=>{
        barXAis.push(item.title)
        barYAis.push(item.level * item.work_time)
      })
      this.setData({
        barXAis,barYAis
      })
      setTimeout(_=>{
        this.init_pieCharts()
      },100)
    })
  },
  getPie_1(startDate,endDate){
    request('/statistics/taskStructure','get',{startDate,endDate,type:1}).then(res=>{
      console.log(res.rst)
      let arr = []
      let data = res.rst 
      data.forEach(item=>{
        arr.push({
          value:item.work_time,
          name:item.name
        })
      })
      console.log(arr)
      this.setData({
        pie_1:arr
      })
      setTimeout(_=>{
        this.init_pieCharts_1()
      },50)
    })
  },
  getPie_2(startDate,endDate){
    request('/statistics/taskStructure','get',{startDate,endDate,type:2}).then(res=>{
      console.log(res.rst)
      let arr = []
      let data = res.rst 
      data.forEach(item=>{
        arr.push({
          value:item.work_time,
          name:item.name
        })
      })
      console.log(arr)
      this.setData({
        pie_2:arr
      })
      setTimeout(_=>{
        this.init_pieCharts_2()
      },50)
    })
  },
  today(e) {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    let today = year + '-' + month + '-' + day
    this.setData({
      endDate: today
    })
  },
  bindPeopleChange(e) {
    this.setData({
      peopleIndex: e.detail.value,
      userId: this.data.peopleDetail[e.detail.value].user_id
    })
    this.getPie(this.data.startDate, this.data.endDate, this.data.type, this.data.userId,this.data.isrp)
  },
  getUserList() {
    wx.request({
      url: app.globalData.URL + '/user/list',
      method: "GET",
      header: {
        token: wx.getStorageSync("token")
      },
      success: res => {
        let peopleDetail = res.data.serchResult
        let peopleName = [];
        let userInfo = []
        peopleDetail.forEach(item => {
          peopleName.push(item.name)
          userInfo.push({
            name: item.name,
            offer: item.offer,
            commission:item.commission
          })
        })
        console.log(peopleName)
        console.log(userInfo)
        this.setData({
          peopleDetail: peopleDetail,
          peopleName: peopleName,
          userInfo: userInfo
        })
        console.log(this.data.userInfo)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.today()
    this.getUserList()
    this.getBar(this.data.startDate,this.data.endDate,wx.getStorageSync('uid'))
    this.getPie_1(this.data.startDate,this.data.endDate)
    this.getPie_2(this.data.startDate,this.data.endDate)
    this.setData({
      isCreate: wx.getStorageSync('iscreate')
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.piechartsComponnet = this.selectComponent('#mychart-dom-bar'); //饼图
    this.init_pieCharts()
    this.piechartsComponnet_1 = this.selectComponent("#mychart-dom-pie_1")
    this.init_pieCharts_1()
    this.piechartsComponnet_2 = this.selectComponent("#mychart-dom-pie_2")
    this.init_pieCharts_2()
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