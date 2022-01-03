import {getDaysBetween,transformDate} from "../../utils.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    menuHeight: app.globalData.menuHeight,
    indexText:'',
    inputDisabled:true,
    scrollTop:0,
    keyBoardHeight:0,
    popover_box_top:-1000,
    popover_box_left:0,
    isAdding:false,
    animationEnd:false,
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
    content:'',
    imagePaths:[],
    imageRemoveIndex:"",
    eggsHidden:true,
    eggsAnimation:false,
    commemorationData:[],
    likeData:[],
    memoData:[],
    photos:'',
    todoData:[],
    unlikeData:[],
    eggContent:'',
    debounce:false,
    hideAll:true,
    inputDisabled:true,
  },
  contentIpnut(e){
    this.setData({content:e.detail.value})
  },
  submit(){
    if(this.data.content === ''&& this.data.imagePaths.length === 0){
      wx.showToast({
        title: '还请输入文字再提交哦(°▽°)ﾉ',
        icon:'none'
      })
      return
    }
    wx.showToast({
      title: '正在保存...',
      icon:'none',
      mask:true
    })
    if(this.data.imagePaths.length === 0){
      this.submitInfo([])
    }else{
      let secret = Math.floor(Math.random() * 2821109907455).toString(36).toUpperCase()
      let imagePaths = this.data.imagePaths
      this.uploadImg(imagePaths, 0, secret, [])
    }
  },
  submitInfo(imagePaths){
    wx.cloud.callFunction({
      name: "submitRecord",
      data: {
        kind:this.data.chooseKindIndex,
        type:this.data.chooseItemTypeIndex,
        imagePaths,
        date:this.data.date,
        content:this.data.content
      }
    }).then(res=>{
      if(res.result.code === 500){
        wx.showToast({
          title: res.result.msg,
          icon:'none'
        })
        return
      }
      wx.showToast({
        title: '保存成功o(≧∇≦)o',
        icon:"none"
      })
      this.setData({
        imagePaths:[],
        content:''
      })
      this.hideAddForm()
    })
  },
  noTouch(){
    return;
  },
  //修改主页文字
  updateIndexText(e){
    if(this.data.debounce) return
    this.setData({debounce:true})
    setTimeout(_=>{this.setData({debounce:false})},300)
    console.log(e.detail.value)
    wx.cloud.callFunction({
      name:'updateIndexText',
      data:{
        indexText:e.detail.value
      }
    }).then(res=>{
      this.setData({
        inputDisabled:true
      })
      wx.showToast({
        title: '保存成功o(≧∇≦)o',
        icon:'none'
      })
    })
  },
  dateChange(e){
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
    if(this.data.photoDisabled) return;
    if(this.data.imagePaths.length === 3) return;
    wx.chooseImage({
      count:3 - this.data.imagePaths.length,
      success:res=>{
        console.log(res.tempFilePaths)
        if(this.data.imagePaths.length === 0){
          let imagePaths =[]
          imagePaths = imagePaths.concat(res.tempFilePaths)
          this.setData({
            imagePaths
          })
        }else{
          this.setData({
            imagePaths: this.data.imagePaths.concat(res.tempFilePaths)
          })
        }
        console.log(this.data.imagePaths)
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
  //上传图片
  uploadImg(imagePaths, i, secret, imageFileID) {
    wx.showToast({
      title: '上传图片ing...',
      icon:'none',
      mask: true,
      duration:600000
    })
    wx.cloud.uploadFile({
      cloudPath: `photos/${secret}_${i + 1}.png`,
      filePath: imagePaths[i],
      fail:res=>{
        wx.showToast({
          title: '服务器崩惹 (^～^;)ゞ',
          icon:'none'
        })
      },
      success: res => {
        console.log(res)
        i = i + 1
        if (i  === imagePaths.length) {//上传成功
          imageFileID.push(res.fileID)
          console.log(imageFileID)
          this.submitInfo(imageFileID)
          // return imageFileID
        } else {//还没上传完毕 继续上传
          imageFileID.push(res.fileID)
          this.uploadImg(imagePaths, i, secret, imageFileID);
        }
      }
    })
  },
  //显示删除mask
  showDeleteImgMask(e){
    wx.vibrateShort()
    console.log(e.currentTarget.dataset.index)
    this.setData({
      imageRemoveIndex: e.currentTarget.dataset.index
    })
  },
  //删除图片
  imageRemove:function(e){
    let imagePaths = this.data.imagePaths
    imagePaths.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      imageRemoveIndex: "",
      imagePaths,
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
            photoDisabled:true,
            imagePaths:[],
            date:''
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
            photoDisabled:true,
            imagePaths:[],
            date:this.getNow()
          })
        }else if(res.tapIndex === 2){
          this.setData({
            itemTypeDisabled:true,
            dateDisabled:true,
            photoDisabled:true,
            chooseItemTypeIndex:'',
            imagePaths:[],
            date:''
          })
        }else if(res.tapIndex === 3){
          this.setData({
            itemTypeDisabled:true,
            dateDisabled:true,
            photoDisabled:false,
            date:'',
            chooseItemTypeIndex:''
          })
        }
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
  },
  editInput(e){
     var thisTime = e.timeStamp;
     var lastTime = this.data.lastTime;
     if (lastTime != 0 && thisTime - this.data.lastTime < 300) {
         this.setData({
           inputDisabled:false
         })
     }
     // 赋值
     this.setData({
       lastTime: thisTime
     })
  },
  hideAddForm(){
    this.setData({
      isAdding:false
    })
    setTimeout(_=>this.setData({animationEnd:false}),310)
  },
  updateTodoState(e){
    let dataset = e.currentTarget.dataset
    console.log(dataset)
    let data = {
      id:dataset.id,
      isDone:dataset.state?0:1
    }
    console.log(data)
    wx.cloud.callFunction({
      name:'updateTodoState',
      data:{
        ...data
      }
    }).then(res=>{
      console.log(res)
      this.setData({
        'todoData[0].isDone':dataset.state?0:1
      })
    })
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
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1;
    if(month < 10) month = '0' + month
    let day = date.getDate() 
    if(day < 10) day = '0' + day
    let now = `${year}-${month}-${day}`
    return now
  },
  showEggs(e){
    console.log(e.currentTarget.dataset.content)
    this.setData({
      eggContent:e.currentTarget.dataset.content,
      eggsHidden:false
    })
    setTimeout(_=>{
      this.setData({
        eggsAnimation:true
      })
    },10)
  },
  hideEggs(){
    this.setData({
      eggsAnimation:false
    })
    setTimeout(_=>{
      this.setData({
        eggsHidden:true
      })
    },310)
  },
  getIndexDetail(){
    wx.showToast({
      title: '正在玩命加载数据...',
      icon:'none'
    })
    this.setData({hideAll:true})
    wx.cloud.callFunction({
      name:'getIndexDetail'
    }).then(res=>{
      console.log(res.result)
      let data = res.result
      data.commemorationData.forEach(item=>{item.days = getDaysBetween(item.type,item.date)})
      data.memoData.forEach(item=>item.date = transformDate(item.createTime))
      this.setData({
        ...data
      })
      if(data.commemorationData.length === 0 && data.likeData.length === 0 && data.memoData.length === 0 && data.photos === '' && data.todoData.length === 0 && data.unlikeData.length === 0){
        wx.stopPullDownRefresh()
        wx.showToast({
          title: '加载成功喽~',icon:'none'
        })
        return
      }
      setTimeout(_=>{
        this.setData({hideAll:false});
        wx.showToast({
          title: '加载成功喽~',icon:'none'
        })},30)
      wx.stopPullDownRefresh()
    })
  },
  previewImage(e){
    console.log(e.currentTarget.dataset.url)
    wx.previewImage({
      urls: [e.currentTarget.dataset.url],
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      date:this.getNow(),
      rangeDate:this.getNow()
    })
    //获取用户信息
    wx.cloud.callFunction({
      name:'getUserInfo'
    }).then(res=>{
      this.setData({
        ...res.result
      }) 
    })
    this.getIndexDetail()
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
      this.getIndexDetail()
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