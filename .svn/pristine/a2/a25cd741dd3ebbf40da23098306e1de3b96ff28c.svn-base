// pages/TaskList/TaskList.js
const app = getApp()
import { request ,saveRequest } from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    isUpdate:false
  },
  goBack: function (e) {//点击返回按钮 返回上一层页面
    wx.navigateBack()
  },
  getList(id){
    request('/demand/search','get',{projectId:id}).then(res=>{
      let data = res.searchResult
      console.log(data)
      let sum = 0
      data.forEach(item=>{
        sum+=item.level * item.work_time
      })
      data.forEach(item=>{
        item.ratioVal =  (item.level * item.work_time / sum * 100).toFixed(1)
      })
      this.setData({
        task_list : data
      })
    })
  },
  levelChange(e){
    let index = e.currentTarget.dataset.index
    let data = this.data.task_list
    data[index].level =  e.detail.value
    let sum = 0
    data.forEach(item=>{
      sum+=item.level * item.work_time
    })
    data.forEach(item=>{
      item.ratioVal =  (item.level * item.work_time / sum * 100).toFixed(1)
    })
    this.setData({
      task_list : data
    })
    let list = []
    data.forEach(item=>{
      list.push({
        demandId:item.demand_id,
        level:item.level,
        workTime:item.work_time
      })
    })
    this.setData({
      demandDOList:list,
      isUpdate:true
    })
  },
  hourChange(e){
    let index = e.currentTarget.dataset.index
    let data = this.data.task_list
    data[index].work_time =  e.detail.value
    let sum = 0
    data.forEach(item=>{
      sum+=item.level * item.work_time
    })
    data.forEach(item=>{
      item.ratioVal =  (item.level * item.work_time / sum * 100).toFixed(1)
    })
    this.setData({
      task_list : data
    })
    let list = []
    data.forEach(item=>{
      list.push({
        demandId:item.demand_id,
        level:item.level,
        workTime:item.work_time
      })
    })
    this.setData({
      demandDOList:list,
      isUpdate:true
    })
  },
  submit(){
    saveRequest('/demand/adjust','post',{
      demandDOList:this.data.demandDOList
    },'application/json').then(res=>{
      console.log(res)
      if(res.code === 0){
        wx.showToast({
          title: '修改成功',
          icon:'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList(options.id)
    console.log(options)
    if(options.pm == wx.getStorageSync('uid')){
      this.setData({
        isPm:true
      })
    }
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