// miniprogram/pages/Home/home.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    menuHeight: app.globalData.menuHeight,
    indexText:app.globalData.indexText,
    inputDisabled:true,
    scrollTop:0,
    keyBoardHeight:0,
    popover_box_top:-1000,
    popover_box_left:0,
    isAdding:true,
    animationEnd:true,
    chooseKind:'纪念日',
    chooseKindIndex:1,
    menuBox:[{
      icon:'xqah_icon',
      text:'喜欢与厌',
      background:'linear-gradient(225deg, #FF8BDF 0%, #FBCBFF 100%)',
      path:'../Likes/Likes'
    },{
      icon:'jnr_icon',
      text:'纪念日',
      background:'linear-gradient(225deg, #79DDFF 0%, #86FFF5 100%)',
      path:'../Commemoration/Commemoration'
    },{
      icon:'yzds_icon',
      text:'要做的事',
      background:'linear-gradient(225deg, #FFC37D 0%, #FFF6A4 100%)',
      path:'../Todo/Todo'
    },{
      icon:'bwl_icon',
      text:'备忘录',
      background:'linear-gradient(225deg, #79FF8F 0%, #96FFFF 100%)',
      path:'../Memo/Memo'
    }],
    kindList:[{
      id:0,
      label:'喜欢与厌'
    },{
      id:1,
      label:'纪念日'
    },{
      id:2,
      label:'要做的事'
    },{
      id:3,
      label:'备忘录'
    }],
    itemTypeList:[{
      id:0,
      label:'累计日'
    },{
      id:1,
      label:'倒数日'
    }],
    chooseItemType:'TA喜欢的',
    chooseItemTypeIndex:0,
    date:null,
    itemTypeDisabled:false,
    dateDisabled:false,
    photoDisabled:true,
  },
  noTouch(){
    return;
  },
  //修改主页文字
  updateIndexText(e){
    console.log(e.detail.value)
  },
  dateChange(e){
    console.log(e)
    this.setData({
      date:e.detail.value
    })
  },
  //切换菜单
  currentMenu(e){
    console.log(e.currentTarget.dataset.path)
    wx.navigateTo({
      url: e.currentTarget.dataset.path,
    })
  },
  chooseImage(){
    if(this.data.chooseImage) return;
    wx.chooseImage({
      count: 3,
      sourceType:['album'],
      success:res=>{
        console.log(res)
        this.setData({
          imagePath:res.tempFilePaths[0]
        })
      }
    })
  },
  dateTypeChange(){
    if(this.data.itemTypeDisabled) return;
    wx.showActionSheet({
      itemList: this.data.itemTypeList.map(item=>item.label),
      success :res=> {
        this.setData({
          chooseItemTypeIndex:res.tapIndex
        })
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
  },
  //记录类型change事件
  recordTypeChange(){
    wx.showActionSheet({
      itemList:this.data.kindList.map(item=>item.label),
      success:res=> {
        this.setData({
          chooseKindIndex:res.tapIndex
        })
        if(res.tapIndex === 0){
          this.setData({
            itemTypeList:[{
              id:0,label:'TA喜欢的'
            },{
              id:1,label:'TA不喜欢的'
            }],
            chooseItemType:'TA喜欢的',
            chooseItemTypeIndex:0,
            itemTypeDisabled:false,
            dateDisabled:true,
            photoDisabled:true
          })
        }else if(res.tapIndex === 1){
          this.setData({
            itemTypeList:[{
              id:0,
              label:'累计日'
            },{
              id:1,
              label:'倒数日'
            }],
            chooseItemType:'累计日',
            chooseItemTypeIndex:0,
            itemTypeDisabled:false,
            dateDisabled:false,
            photoDisabled:true
          })
        }else if(res.tapIndex === 2){
          this.setData({
            itemTypeDisabled:true,
            dateDisabled:true,
            photoDisabled:true
          })
        }else if(res.tapIndex === 3){
          this.setData({
            itemTypeDisabled:true,
            dateDisabled:true,
            photoDisabled:false
          })
        }
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
  },
  inputBlur(e){
    this.setData({
      putFocus:true,
    })
  },
  hideAddForm(){
    this.setData({
      isAdding:false
    })
    setTimeout(_=>this.setData({animationEnd:false}),310)
  },
  add(){
    this.setData({
      animationEnd:true,
    })
    setTimeout(_=>this.setData({isAdding:true}),10)
  },
  onPageScroll(e){
    this.setData({
      scrollTop:e.scrollTop
    })
  },
  getNow(){
    console.log(new Date())
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1;
    if(month < 10) month = '0' + month
    let day = date.getDate() 
    if(day < 10) day = '0' + day
    let now = `${year}-${month}-${day}`
    return now
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('触发了onload')
    this.setData({
      date:this.getNow()
    })
    //获取用户信息
    wx.cloud.callFunction({
      name:'getUserInfo'
    }).then(res=>{
      this.setData({
        indexText:res.result
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
    wx.showToast({
      title: '下拉了',
    })
    setTimeout(_=>{
      wx.stopPullDownRefresh()
    },1000)
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