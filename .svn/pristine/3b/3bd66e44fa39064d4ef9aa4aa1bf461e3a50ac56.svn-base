// pages/ProDetail/ProDetail.js
import { request } from '../../utils/util.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    pro_detail:{},
    demand_list:[],
    loading: false
  },
  goBack: function (e) {//点击返回按钮 返回上一层页面
    wx.navigateBack({
      delta: 0,
    })
  },
  daysDistance(date) { //距离结束日期到当前日期的时间
    let today = new Date();
    let str = "";
    str += today.getFullYear() + "-";
    let month = today.getMonth() + 1;
    if (month < 10) {
      str += "0";
    }
    str += month + "-";
    let day = today.getDate();
    if (day < 10) {
      str += "0";
    }
    str += day;//计算当前日期
    date = Date.parse(date);
    str = Date.parse(str);
    let ms = date - str;
    let days = Math.ceil(ms / (24 * 3600 * 1000));
    return days;
  },
  getDetail(id){
    request('/project/view/' + id,'get',{}).then(res=>{
      console.log(res.searchResult)
      this.setData({
        pro_detail: res.searchResult
      })
    })
  },
  getDemandList(id){
    this.setData({
      loading:true
    })
    request('/demand/list', 'get', {title: "",projectId: id,state: "",joiner: ""}).then(res=>{
      console.log(res.searchResult)
      let demand_list = res.searchResult
      demand_list.forEach(item=>{
        item.daysDistance = this.daysDistance(item.expect_end_date)
      })
      this.setData({
        demand_list
      })
      this.setData({
        loading: false
      })
    })
  },
  jumpToDemandDetail(e){
    wx.navigateTo({
      url: '../DemandDetail/DemandDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  jumpToTravelList(e){
    wx.navigateTo({
      url: '../TravelList/TravelList?id=' + this.data.pro_detail.project_id
    })
  },
  openPDF(){
    wx.downloadFile({
      url: this.data.pro_detail.file_id,
      success:res=>{
        console.log(res)
        wx.openDocument({
          filePath: res.tempFilePath,
        })
      },
      fail:err=>{
        console.log(err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDetail(options.id)
    this.getDemandList(options.id)
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