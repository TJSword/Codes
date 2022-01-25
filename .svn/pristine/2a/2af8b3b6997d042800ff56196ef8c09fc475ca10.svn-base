// pages/Index/Index.js
const app = getApp()
import { request,saveRequest} from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    isShowMenu:false,
    ani:false,
    isShowNav:false,
    showMenuIcon:true,
    hide_menu:true,
    condition_2:[{label:'进行中',value:'0'},{label:'已完成',value:'1'}],
    list:[], //卡片列表
    type:'demand',
    state:'0',
    domShow:'project',
    loading:false,
    isShowAlterBox:false
  },
  chooseCon_1(e){
    this.setData({
      type: e.currentTarget.dataset.type,
      touchIndex: -1
    })
    this.getList()
  },
  chooseCon_2(e){
    this.setData({
      state: e.currentTarget.dataset.state,
      touchIndex:-1
    })
    this.getList()
  },
  jumpToProDetail(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../ProDetail/ProDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  jumpToDemandDetail(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../DemandDetail/DemandDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  jumpToShareDetail(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../ShareDetail/ShareDetail?id=' + e.currentTarget.dataset.id,
    })
  },
 

  showMenu(){
    this.setData({
      isShowMenu: !this.data.isShowMenu
    })
    if (this.data.isShowMenu){
      this.setData({
        hide_menu: false
      })
      let animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      // animation.height("260rpx").opacity(1).step();
      animation.translateX(0).step()
      this.setData({
        ani: animation.export()
      })
     
    }else{
      let animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      // animation.height("0").opacity(0).step();
      animation.translateX(-800).step()
      this.setData({
        ani: animation.export()
      })
      setTimeout(()=>{
        this.setData({
          hide_menu:true
        })
      },480)
    }

  },
  hide_condition_box(){
    this.setData({
      isShowMenu:false,
    })
    let animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      // animation.height("0").opacity(0).step();
      animation.translateX(-800).step()
      this.setData({
        ani: animation.export()
      })
      setTimeout(() => {
        this.setData({
          hide_menu: true
        })
      }, 480)
    
  },
  showNav(){ //显示菜单动画
    this.setData({
      isShowNav: true,
      showMenuIcon:false
    })
    console.log(this.data.isShowNav)
    let animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })
    animation.rotate(0).opacity(1).step()
    this.setData({
      nav_ani: animation.export()
    })
  },
  hideNav(){
    this.setData({
      isShowNav: false
    })
    let animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })
    animation.rotate(180).opacity(0).step()
    this.setData({
      nav_ani: animation.export()
    })
    setTimeout(()=>{
      this.setData({
        showMenuIcon:true
      })
    },370)
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
    getList(){
    if(this.data.type === 'project'){
      this.getProList(this.data.state)
    }else if(this.data.type ==='demand'){
      this.getDemandList(this.data.state)
    }else if(this.data.type ==='myList'){
      this.getMyDemamdList(this.data.state)
    }else if(this.data.type === 'share'){
      this.getShareList(this.data.state)
    }
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
          list.forEach(item=>{
            item.daysDistance = this.daysDistance(item.expect_end_date)
          })
          this.setData({
            list,
            domShow:'project',
            loading:false
          })
        })
      })
    }else{
      request('/project/list', 'get', { title: '', state: state, pm: '' }).then(res => {
        let list = res.searchResult
        list.forEach(item => {
          item.daysDistance = this.daysDistance(item.expect_end_date)
        })
        this.setData({
          list,
          domShow:'project',
          loading:false
        })
      })
    }
  },
  getDemandList(state){
    this.setData({
      loading:true
    })
    if(state === "0"){
      request("/demand/list",'get',{title:'',projectId:'',state:'0',joiner:''}).then(res=>{
          let list =  res.searchResult
          list.forEach(item => {
            item.daysDistance = this.daysDistance(item.expect_end_date)
          })
          this.setData({
            list,
            domShow:'demand',
            loading:false
          })
          console.log(this.data.list)
      })
    }else if( state == '1'){
      request("/demand/list", 'get', { title: '', projectId: '', state:'1', joiner: '' }).then(res=>{
        request("/demand/list", 'get', { title: '', projectId: '', state:'2', joiner: '' }).then(res1=>{
          let list = res.searchResult.concat(res1.searchResult)
          list.forEach(item => {
            item.daysDistance = this.daysDistance(item.expect_end_date)
          })
          this.setData({
            list,
            domShow:'demand',
            loading: false
          })
        })
      })
    }
  },
  getMyDemamdList(state){
    this.setData({
      loading:true
    })
    request('/demand/mylist','get',{title:'',projectId:'',state:'0'}).then(res=>{
      request('/demand/mylist', 'get', { title: '', projectId: '', state: '3' }).then(res3=>{
        res3.searchResult.forEach(item => {
          item.audit = true
        })
        let list = res.searchResult.concat(res3.searchResult)
        list.forEach(item => {
          item.daysDistance = this.daysDistance(item.expect_end_date)
        })
        this.setData({
          list,
          domShow:'myList',
          loading:false
        })
        console.log(this.data.list)
      })
    })
  },
  getShareList(state){
    this.setData({
      loading:true
    })
    request('/share/search','get',{state:state}).then(res=>{
      console.log(res.searchResult)
      let list = res.searchResult
      // list.forEach(item=>{
      //   item.start_date = item.start_date.substr(0, item.start_date.length - 3)
      // })
      this.setData({
        list,
        domShow:'share',
        loading:false
      })
    })
  },
  search(e){ //搜索栏检索 前端
    console.log(e.detail.value)
    console.log(this.data.list)
    let title = e.detail.value;
    this.getList();
    //title project_name
    setTimeout(_=>{
     let timer =  setInterval(_=>{
        console.log(this.data.loading)
        if(!this.data.loading){
          let list = this.data.list
          clearInterval(timer)
          // list = list.filter(val => {
          //   // console.log(val.project_name)
          //   return val.project_name.indexOf(title) != -1 || (val.title ? val.title.indexOf(title) != -1 : false)
          // })
          if (this.data.type === 'project'){
            list = list.filter(val => {
              return val.project_name.indexOf(title) != -1 || val.pm_name.indexOf(title) != -1
            })
          } else if (this.data.type === 'demand'){
            list = list.filter(val => {
              return val.title.indexOf(title) != -1 || val.joiner_name.indexOf(title) != -1
            })
          } else if (this.data.type === 'myList'){
            list = list.filter(val => {
              return val.title.indexOf(title) != -1 
            })
          } else if (this.data.type === 'share'){
            list = list.filter(val => {
              return val.title.indexOf(title) != -1 || val.create_by_name.indexOf(title) != -1
            })
            
          }
          console.log(list)
          this.setData({
            list
          })

        }
      },100)
    },100)
    
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

  proTouchStart(e){
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY
    })
  },
  proTouchEnd(e){
     if(this.data.state === '0'){
        let endX= e.changedTouches[0].clientX;
        let endY= e.changedTouches[0].clientY;
        let direction =  this.slideDirection(this.data.startX, this.data.startY, endX, endY)
        if (direction ==='left'){
        
            this.setData({
              touchIndex: e.currentTarget.dataset.index,
              creater_id: e.currentTarget.dataset.createby
            })
        } else if (direction === 'right'){
          console.log(this.data.touchIndex)
          this.setData({
            touchIndex:-1
          })
        }
      }
  },
  terminationPro(e){
    console.log(this.data.creater_id)
    console.log(this.data.touchIndex)
    console.log(this.data.list[this.data.touchIndex].project_id)
    let pro_id = this.data.list[this.data.touchIndex].project_id
    if (this.data.creater_id == wx.getStorageSync('uid')){
      wx.vibrateLong()
      wx.showModal({
        content: '确认终止项目?',
        success:res=>{
          if(res.confirm){
            request('/project/operate','post',{
              id: pro_id,
              state:'2'
            }).then(res=>{
              console.log(res)
              wx.showToast({
                title: '已终止项目',
                icon:'none'
              })
              this.getProList(this.data.state)
              this.setData({
                touchIndex: -1
              })
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: '这不是你创建的项目',
        icon:'none'
      })
    }
  },
  showAlterBox(e){
    
    if (this.data.creater_id == wx.getStorageSync('uid')){
      this.setData({
        isShowAlterBox:true
      })
    }else{
      wx.showToast({
        title: '这不是你创建的项目',
        icon:'none'
      })
    }
  },
  hideAlterBox(){
    this.setData({
      isShowAlterBox:false
    })
  },
  alter_offer(e){
    if(this.isNumber(e.detail.value)){
      this.setData({
        alteredOffer:e.detail.value * 1
      })
    }else{
      this.setData({
        alteredOffer:null
      })
      wx.showToast({
        title: '请填写数字',
        icon:'none'
      })
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
  alter_rp(){
    let pro_id = this.data.list[this.data.touchIndex].project_id;
    console.log(this.data.alteredOffer)
    if(this.data.alteredOffer === undefined || this.data.alteredOffer === null){
      wx.showToast({
        title: '请填写研值',
        icon:'none'
      })
    }else{
      saveRequest('/project/update', 'post', { projectId: pro_id, offer: this.data.alteredOffer },'application/json').then(res=>{
        console.log(res.code)
        if(res.code === 0){
          this.getList();
          this.setData({
            isShowAlterBox:false
          })
          wx.showToast({
            title: '修改成功',
            icon:"none"
          })
        }else{
          wx.showToast({
            title: '未知错误，请联系管理员',
            icon:'none'
          })
        }
      })
    }
  },
  deletePro(e){
    let pro_id = this.data.list[this.data.touchIndex].project_id
    if (this.data.creater_id == wx.getStorageSync('uid')) {
      wx.vibrateLong()
      wx.showModal({
        content: '确认删除项目',
        success:res=>{
          if(res.confirm){
            request('/project/remove/' + pro_id,'get').then(res=>{
              console.log(res)
              wx.showToast({
                title: '已删除项目',
                icon: 'none'
              })
              this.getProList(this.data.state)
              this.setData({
                touchIndex: -1
              })
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: '这不是你创建的项目',
        icon: 'none'
      })
    }
  },
  demandTouchStart(e){
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY
    })
  },
  demandTouchEnd(e){
    if(this.data.state === '0'){
      let endX = e.changedTouches[0].clientX;
      let endY = e.changedTouches[0].clientY;
      let direction = this.slideDirection(this.data.startX, this.data.startY, endX, endY)
      if (direction === 'left') {
        this.setData({
          touchIndex: e.currentTarget.dataset.index,
          creater_id: e.currentTarget.dataset.createby
        })
      } else if (direction === 'right') {
        console.log(this.data.touchIndex)
        this.setData({
          touchIndex: -1
        })
      }
    }
  },
  terminationDemand(e){
    let demand_id = this.data.list[this.data.touchIndex].demand_id
    if (this.data.creater_id == wx.getStorageSync('uid')){
      wx.vibrateLong();
      wx.showModal({
        content: '确认终止任务?',
        success:res=>{
          if(res.confirm){
            request('/demand/operate','post',{
              id: demand_id,
              state:'2'
            }).then(res=>{
              console.log(res)
              wx.showToast({
                title: '已终止任务',
                icon: 'none'
              })
              this.getDemandList(this.data.state)
              this.setData({
                touchIndex: -1
              })
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: '这不是你创建的任务',
        icon: 'none'
      })
    }

  },
  deleteDemand(e){
    let demand_id = this.data.list[this.data.touchIndex].demand_id;
    if (this.data.creater_id == wx.getStorageSync('uid')) {
      wx.vibrateLong();
      wx.showModal({
        content: '确认删除任务?',
        success:res=>{
          if(res.confirm){
            request('/demand/remove/' + demand_id,'get').then(res=>{
              console.log(res)
              wx.showToast({
                title: '已删除任务',
                icon: 'none'
              })
              this.getDemandList(this.data.state)
              this.setData({
                touchIndex: -1
              })
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: '这不是你创建的任务',
        icon: 'none'
      })
    }
  },
  jumpToPublishPro(){
    wx.navigateTo({
      url: '../ProList/ProList',
    })
  },
  jumpToReleaseDemand(){
    wx.navigateTo({
      url: '../ReleaseDemand/ReleaseDemand',
    })
  },
  jumpToApportion(){
    wx.navigateTo({
      url: '../Chart/Chart',
    })
  },
  jumpToChart(){
    wx.navigateTo({
      url: '../TravelAdd/TravelAdd',
    })
  },
  jumpToReportList(e) {
      wx.navigateTo({
        url: '../EventAdd/EventAdd',
      })

  },
  jumpToIssuedShare(){
    let role = wx.getStorageSync('role')
    if(role === 'DS' || role === 'MM'){
      wx.showActionSheet({
        itemList: ['客户列表','合同列表'],
        success:res=>{
          if(res.tapIndex === 0){
            wx.navigateTo({
              url: '../ClientList/ClientList',
            })
          }else if(res.tapIndex === 1){
            wx.navigateTo({
              url: '../ContractList/ContractList',
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: '你没有相关权限',
        icon:'none'
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
    this.setData({
      isCreate:wx.getStorageSync('iscreate')
    })
  },
  onPageScroll:function(e){
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