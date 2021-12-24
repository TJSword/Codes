import {getRecords,delteRecords,getDaysBetween} from "../../utils.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showOpeartion:false,
    chooseIndex:null,
    commemorationData:[]
  },
  getRecords(){
    getRecords(1).then(res=>{
      let data = res.result.data
      if(data.length !== 0){
        wx.setNavigationBarColor({
          frontColor: '#000000', 
          backgroundColor: '#F5F5F5',
        })
      }
      data.forEach(item=>{
        item.days = getDaysBetween(item.type,item.date)
      })
      this.setData({
        commemorationData:data
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRecords()
  },
  touchStart(e) {
    // console.log(e)
    this.setData({
      touchX: e.changedTouches[0].clientX,
      touchY: e.changedTouches[0].clientY
    });
  },
  getTouchData (endX, endY, startX, startY) {
    let turn = "";
    if (endX - startX > 50 && Math.abs(endY - startY) < 50) {      //右滑
      turn = "right";
    } else if (endX - startX < -50 && Math.abs(endY - startY) < 50) {   //左滑
      turn = "left";
    }
    return turn;
  },
  touchEnd(e) {
    let x = e.changedTouches[0].clientX;
    let y = e.changedTouches[0].clientY;
    if(this.getTouchData(x,y,this.data.touchX,this.data.touchY) === 'left'){
      this.setData({
        showOpeartion:true,
        chooseIndex:e.currentTarget.dataset.index
      })
    }
  },
  recovery(){
    this.setData({chooseIndex:null})
  },
  deleteCard(e){
    wx.showModal({
      content: '确定删除这条记录吗',
      confirmText:'删除',
      cancelColor: "#000000",
      confirmColor: "#576B95",
      success:res=> {
        if (res.confirm) {
          delteRecords(e.currentTarget.dataset.id).then(res=>{
            wx.showToast({
              title: '删除啦~',
              icon:'none'
            })
            this.getRecords()
            this.recovery()
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  noTouch(){
    return;
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