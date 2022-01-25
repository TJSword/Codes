// pages/ProDetail/ProDetail.js
import { request } from '../../utils/util.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    steps:[{
      icon:'icon-sanjiaotop',
      name:'正在进行'
    },
    {
      icon: 'icon-duihao',
      name: '任务完成'
    },{
        icon: 'icon-yuanquan',
        name: '导师评定'
    }],
    step:0,
    loading: false
    
  },
  goBack: function (e) {//点击返回按钮 返回上一层页面
    wx.navigateBack()
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
  getDemandInfo(id){
    this.setData({
      loading:true
    })
    request('/demand/view/' + id,'get').then(res=>{
      console.log(res.searchResult)
      this.setData({
        demandInfo: res.searchResult,
        step:res.searchResult.state
      })
      this.setData({
        loading: false
      })
    }).catch(err=>{
      this.setData({
        loading: false
      })
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
  hideBox(){
    this.setData({
      showBox:false
    })
  },
  hideBox_daoshi(){
    this.setData({
      showBox_daoshi:false
    })
  },
  demand_evaluate(e){
    console.log(e.detail.value)
    this.setData({
      remark:e.detail.value
    })
  },
  demand_evaluate_daoshi(e){
    this.setData({
      remark_daoshi:e.detail.value
    })
  },
  submit(){
      this.setData({
        loading: true
      })
      request('/demand/operate', 'post', { id: this.data.demandInfo.demand_id, state: '1',remark:this.data.remark }).then(res => {
        if (res.code == 0) {
          this.setData({
            step: 1,
            loading: false,
            showBox:false
          })
          wx.showToast({
            title: '任务完成',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '未知错误，请联系管理员',
            icon: 'none'
          })
          this.setData({
            loading:false
          })
        }
      })
  },
  submit_daoshi(e){
    this.setData({
      loading: true
    })
    request('/demand/operate', 'post', { id: this.data.demandInfo.demand_id, state: '2',remark:this.data.remark_daoshi }).then(res => {
      if (res.code == 0) {
        this.setData({
          step: 2,
          loading: false,
          showBox_daoshi:false
        })
        wx.showToast({
          title: '评定成功',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '未知错误，请联系管理员',
          icon: 'none'
        })
        this.setData({
          loading:false
        })
      }
    })
  },
  apply(e){
    console.log(e.currentTarget.dataset.index)
    if (e.currentTarget.dataset.index === 1){
      if (wx.getStorageSync('uid') != this.data.demandInfo.creater){
        wx.showToast({
          title: '这不是你创建任务,想啥呢',
          icon:'none'
        })
      }else if(wx.getStorageSync('uid') == this.data.demandInfo.creater && this.data.step == 2){
        wx.showToast({
          title: '别点了，都完成了(｡ŏ_ŏ)',
          icon:'none'
        })
      }
      else if (wx.getStorageSync('uid') == this.data.demandInfo.creater && this.data.step == 1){
        wx.showToast({
          title: '都完成了，还点!(｡ŏ_ŏ)',
          icon:'none'
        })
      } else if (wx.getStorageSync('uid') == this.data.demandInfo.creater && this.data.step == 0){
        wx.vibrateLong()
        wx.showModal({
          content: '确认申请完成?',
          success:res=>{
            if (res.confirm){
              if(this.daysDistance(this.data.demandInfo.expect_end_date) < 0){
                this.setData({
                  showBox:true
                })
              }else{
                console.log(1)
                this.submit()
              }
            }
          }
        })
      }
    }else if(e.currentTarget.dataset.index === 2){
      if (wx.getStorageSync('uid') != this.data.demandInfo.create_by){
        wx.showToast({
          title: '你不是这个任务的导师,想啥呢',
          icon:'none'
        })
      }else if(wx.getStorageSync('uid') == this.data.demandInfo.create_by && this.data.step == 0){
        wx.showToast({
          title: '别点了，任务未完成(｡ŏ_ŏ)',
          icon:'none'
        })
      }
      else if (wx.getStorageSync('uid') == this.data.demandInfo.create_by && this.data.step == 2){
        wx.showToast({
          title: '都评定完了，还点!(｡ŏ_ŏ)',
          icon:'none'
        })
      } else if (wx.getStorageSync('uid') == this.data.demandInfo.create_by && this.data.step == 1){
        wx.vibrateLong()
        wx.showModal({
          content: '确认导师评定?',
          success:res=>{
            if (res.confirm){
              this.setData({
                showBox_daoshi:true
              })
            }
          }
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDemandInfo(options.id)
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