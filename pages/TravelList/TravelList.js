// pages/TravelList/TravelList.js
const app = getApp()
import { request, saveRequest } from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
  },
  getList(id){
    request('/fee/list','get',{projectId:id}).then(res=>{
      console.log(res.searchRst)
      this.setData({
        list:res.searchRst
      })
    })
  },
  goBack(){
    wx.navigateBack()
  },
  touchStart(e){
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY
    })
  },
  touchEnd(e){
    let endX= e.changedTouches[0].clientX;
    let endY= e.changedTouches[0].clientY;
    let direction =  this.slideDirection(this.data.startX, this.data.startY, endX, endY)
    if (direction ==='left'){
      this.setData({
        touchIndex: e.currentTarget.dataset.index
      })
    } else if (direction === 'right'){
      console.log(this.data.touchIndex)
      this.setData({
        touchIndex:-1
      })
    }
    console.log(this.data.touchIndex)
  },

  slideDirection(startX,startY,endX,endY){
    let direction = ''
    if (endX - startX > 80 && Math.abs(endY - startY) < 80){
      direction = 'right'
    } else if (endX - startX < -80 && Math.abs(endY - startY) < 80){
      direction = 'left'
    }
    return direction
  },
  deleteItem(e){
    console.log(e.currentTarget.dataset.id)
    console.log(e.currentTarget.dataset.creator)
    if(e.currentTarget.dataset.creator === wx.getStorageSync('uid')){
      wx.showModal({
        content:'确认删除此条记录?',
        success:res=>{
          if(res.confirm){
            this.setData({
              loading:true
            })
            request('/fee/remove','post',{id:e.currentTarget.dataset.id}).then(res=>{
              console.log(res)
              if(res.code === 0){
                this.setData({
                  loading:false,
                  touchIndex:-1
                })
                wx.showToast({
                  title: '删除成功',
                  icon:'none'
                })
                this.getList(this.data.id)
              }else{
                this.setData({
                  loading:false
                })
                wx.showToast({
                  title: '未知错误，请联系管理员',
                  icon:'none'
                })
              }
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: '你没有这个权限',
        icon:'none'
      })
    }
  },
  jumpToUpdate(e){
    if(e.currentTarget.dataset.creator === wx.getStorageSync('uid')){
      wx.navigateTo({
        url: '../TravelUpdate/TravelUpdate?id=' + e.currentTarget.dataset.id,
      })
    }else{
      wx.showToast({
        title: '你没有这个权限',
        icon:'none'
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList(options.id);
    this.setData({
      id:options.id
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