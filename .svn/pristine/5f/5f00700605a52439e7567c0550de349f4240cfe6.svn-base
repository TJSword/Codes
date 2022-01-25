// pages/ContractList/ContractList.js
import { request } from '../../utils/util.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    clientList:[]
  },
  goBack(){
    wx.navigateBack({
      delta: 0,
    })
  },
  addClient(){
    wx.navigateTo({
      url: '../AddClient/AddClient',
    })
  },
  goDetail(e){
    console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../ClientDetail/ClientDetail?id=' + id,
    })
  },
  operateClient(e){
    let id = e.currentTarget.dataset.id
    wx.showActionSheet({
      itemList: ['修改客户名片', '删除客户名片','拨打客户电话'],
      success :res=> {
        console.log(res.tapIndex)
        if(res.tapIndex == 0){
          wx.navigateTo({
            url: '../AddClient/AddClient?id=' + id,
          })
        }else if(res.tapIndex == 1){
          request('/custom/remove/' + id,'get',{}).then(res=>{
            if(res.code === 0){
              wx.showToast({
                title: '删除成功',
                icon:'none'
              })
            }
          })
        }else if(res.tapIndex == 2){
          wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.phone
          })
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request('/custom/search','get',{}).then(res=>{
      this.setData({
        clientList:res.searchRst
      })
    })
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