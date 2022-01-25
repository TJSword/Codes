// pages/ProList/ProList.js
const app = getApp()
import { request,saveRequest} from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    condition:[{label:'进行中',value:'0'},{label:'已完成',value:'1'}],
    state: '0',
    list:[]
  },
  goBack(){
    wx.navigateBack({
      delta: 0,
    })
  },
  goDetail(e){
    console.log(e)
    wx.navigateTo({
      url: '../TaskList/TaskList?id=' + e.currentTarget.dataset.id + '&pm=' + e.currentTarget.dataset.pm,
    })
  },
  operatePro(e){
    wx.showActionSheet({
      itemList: ['差旅列表','改变项目状态'],
      success:res=>{
        if(res.tapIndex === 0){
          wx.navigateTo({
            url: '../TravelList/TravelList?id=' + e.currentTarget.dataset.id,
          })
        }else if(res.tapIndex === 1){
                if(e.currentTarget.dataset.state === '0'){
                    wx.showModal({
                      content:'是否将项目标记为已完成',
                      success:res=>{
                        if(res.confirm){
                          request('/project/operate','post',{id:e.currentTarget.dataset.id,state:'1'}).then(res=>{
                            if(res.code === 0){
                              wx.showToast({
                                title: '标记成功',
                                icon:'none'
                              })
                              this.getProList('0')
                            }
                          })
                        }
                      }
                    })
                  }else if(e.currentTarget.dataset.state === '1'){
                    wx.showModal({
                      content:'是否将项目标记为进行中',
                      success:res=>{
                        if(res.confirm){
                          request('/project/operate','post',{id:e.currentTarget.dataset.id,state:'0'}).then(res=>{
                            if(res.code === 0){
                              wx.showToast({
                                title: '标记成功',
                                icon:'none'
                              })
                              this.getProList('1')
                            }
                          })
                        }
                      }
                    })
                  }
        }
      }
    })


  },
  getProList(state){ //请求项目列表
    this.setData({
      loading:true
    })
    if(state === "0"){
      request('/project/list', 'get', { title: '', state: '0', pm: '' }).then(res => {
        console.log(res.searchResult)
        request('/project/list', 'get', { title: '', state: '3', pm: '' }).then(res3=>{
          res3.searchResult.forEach(item => {
            item.audit = true
          })
          let list = res.searchResult.concat(res3.searchResult)
          this.setData({
            list:list,
            domShow:'project',
            loading:false
          })
        })
      })
    }else{
      request('/project/list', 'get', { title: '', state: state, pm: '' }).then(res => {
        let list = res.searchResult
        this.setData({
          list,
          domShow:'project',
          loading:false
        })
      })
    }
  },
  chooseCon(e){
    this.setData({
      state:e.currentTarget.dataset.state
    })
    this.getProList(e.currentTarget.dataset.state)
  },
  jumpToIssuePro(e){
    wx.navigateTo({
      url: '../PublishPro/PublishPro'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProList('0')
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