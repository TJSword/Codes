// pages/ReleaseDemand/ReleaseDemand.js
const app = getApp()
import { request, saveRequest } from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    chooseAniBox: [false, false, false, false, false, false, false, false,false, false,false, false, false, false, false, false, false, false,false, false],
    chooseProArr:[],
    rpTypeIndex:[null,null],
    workTimeArr:[],
    showWorkTime:false,
    workTimeIndex:null,
    rpArr:['研值任务','佣金任务'],
    hard_easy:[1,2,3,4,5,6,7],
    images:[],
    batchArr:[1,2,3,4,5,6,7,8,9,10]
  },
  goBack: function (e) {//点击返回按钮 返回上一层页面
    wx.navigateBack()
  },
  choose_box(e) {
    let aniId = e.currentTarget.dataset.id
    let arr = this.data.chooseAniBox;
    arr[aniId] = true;
    this.setData({
      chooseAniBox: arr
    })
  },
  choosePro(e){
    this.setData({
      chooseProIndex: e.detail.value
    })
  },
  chooseProCancel(e){
    if (!this.data.chooseProIndex) {
      let aniId = e.currentTarget.dataset.id
      let arr = this.data.chooseAniBox;
      arr[aniId] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  showProInfo(e){
    wx.showModal({
      title:this.data.chooseProArrInfo[this.data.chooseProIndex].project_name,
      content: `${this.data.chooseProArrInfo[this.data.chooseProIndex].describe}\n研值：${this.data.chooseProArrInfo[this.data.chooseProIndex].offer}\n佣金：${this.data.chooseProArrInfo[this.data.chooseProIndex].commission}`,
      showCancel: false
    })
  },
  demand_name(e){
      this.setData({
        contractName:e.detail.value
      })
  },
  demand_name_blur(e){
    if (e.detail.value === "") {
      let arr = this.data.chooseAniBox;
      arr[1] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  payAmount(e){
    console.log(e.currentTarget.dataset.index)
    let payDOList = this.data.payDOList
    payDOList[e.currentTarget.dataset.index].payAmount = e.detail.value
    this.setData({
      payDOList: payDOList
    })
  },
  payAmount_blur(e){
    let id = e.currentTarget.dataset.id
    if (e.detail.value === "") {
      let arr = this.data.chooseAniBox;
      arr[id] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
    console.log(this.data.payDOList)
  },
  amount_money(e){
    this.setData({
      amount:e.detail.value
    })
},
amount_money_blur(e){
  if (e.detail.value === "") {
    let arr = this.data.chooseAniBox;
    arr[3] = false;
    this.setData({
      chooseAniBox: arr
    })
  }
},
batch(e){
  this.setData({
    batch:e.detail.value*1 + 1
  })
  let arr = []
  for(var i= 0 ; i < this.data.batch; i++){
    arr.push({
      "payDate":"",
      "payAmount":""
    })
  }
  this.setData({
    payDOList:arr
  })
  console.log(arr)
},
batch_blur(e){
if (e.detail.value === "") {
  let arr = this.data.chooseAniBox;
  arr[5] = false;
  this.setData({
    chooseAniBox: arr
  })
}
},
  company_name(e){
    this.setData({
      contactCorp:e.detail.value
    })
  },
  company_name_blur(e){
    if (e.detail.value === "") {
      let arr = this.data.chooseAniBox;
      arr[2] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  task_time(e){
    this.setData({
      taskTime:e.detail.value
    })
  },
  task_time_blur(e){
    if (e.detail.value === "") {
      let arr = this.data.chooseAniBox;
      arr[10] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  getRPtype(){
    request('/dict/commission_type','get').then(res=>{
      console.log(res.dicts[0].value)
      request('/dict/' + res.dicts[0].value, 'get').then(res1=>{
        console.log(res,res1)
        let rpType = [];
        rpType[0] = [];
        let rptype_info_1 = res.dicts
        res.dicts.forEach(item=>{
          rpType[0].push(item.name)
        })
        rpType[1] = []
        res1.dicts.forEach(item=>{
          rpType[1].push(item.name)
        })
        this.setData({
          demandLabelArrInfo:res1.dicts,
          demandLabelArr: rpType,
          rptype_info_1
        })
        console.log(this.data.demandLabelArr)
      })
    })
  },
  startDate(e) {
    console.log(e.detail.value);
    this.setData({
      startDate: e.detail.value
    })
  },
  startDateCancel(e) {
    if (!this.data.startDate) {
      let aniId = e.currentTarget.dataset.id
      let arr = this.data.chooseAniBox;
      arr[aniId] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  endDate(e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  endDateCancel(e) {
    if (!this.data.endDate) {
      let aniId = e.currentTarget.dataset.id
      let arr = this.data.chooseAniBox;
      arr[aniId] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  payDate(e) {
    console.log(e.currentTarget.dataset.index)
    let payDOList = this.data.payDOList
    payDOList[e.currentTarget.dataset.index].payDate = e.detail.value
    this.setData({
      payDOList: payDOList
    })
  },
  payDateCancel(e) {
    if (!this.data.payDOList[e.currentTarget.dataset.index].payDate) {
      let aniId = e.currentTarget.dataset.id
      let arr = this.data.chooseAniBox;
      arr[aniId] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  showInfo(){
    console.log(this.data.labelInfo)
    wx.showModal({
      title: '标签详情',
      content: `${this.data.labelInfo.remarks}\n佣金参考范围(每个任务):${this.data.labelInfo.min} ~ ${this.data.labelInfo.max}`,
      showCancel: false
    })
  },
  demand_label(e){
    console.log(e.detail.value)
    this.setData({
      rpTypeIndex:e.detail.value
    })
    let val = this.data.demandLabelArrInfo[this.data.rpTypeIndex[1] ? this.data.rpTypeIndex[1]:0].value
    console.log(val)
    request('/dict/info/'+ val,'get').then(res=>{
      console.log(res.dicts)
      this.setData({
        labelInfo:res.dicts
      })
      if (res.dicts.unit === ''){
        this.setData({
          showWorkTime:false
        })
      }else{
        let arr = []
        for(let i = 1;i < 100; i++){
          arr.push(i + '' + res.dicts.unit)
        }
        
        this.setData({
          workTimeArr:arr,
          showWorkTime: true,
          workTimeIndex:null
        })
      }
    })
  },
  demand_label_column(e){
    console.log(e.detail)
    if(e.detail.column === 0){
      console.log(this.data.rptype_info_1[e.detail.value].value)
      let val = this.data.rptype_info_1[e.detail.value].value;
      request('/dict/' + val,'get').then(res=>{
        let rp_list_2 = []
        res.dicts.forEach(item=>{
          rp_list_2.push(item.name)
        })
        let arr = this.data.demandLabelArr;
        arr[1] = rp_list_2
        this.setData({
          demandLabelArrInfo: res.dicts,
          demandLabelArr:arr
        })
      })
      let index = this.data.rpTypeIndex;
      index[0] = e.detail.value;
      this.setData({
        rpTypeIndex:index
      })
    } else if (e.detail.column === 1){
      let index = this.data.rpTypeIndex;
      index[1] = e.detail.value;
      this.setData({
        rpTypeIndex: index
      })
    }
  },
  demand_label_cancel(){
    if (this.data.rpTypeIndex[0] === null ){
      let arr = this.data.chooseAniBox;
      arr[2] = false;
      this.setData({
        chooseAniBox:arr
      })
    }
  },
  hard_easy_change(e){
    this.setData({
      hard_easy_num:e.detail.value
    })
  },
  demand_rp(e){
    this.setData({
      demandRp : e.detail.value
    })
  },
  demand_rp_blur(e){
    if (e.detail.value === "") {
      let arr = this.data.chooseAniBox;
      arr[3] = false;
      this.setData({
        chooseAniBox: arr
      })
    } else {
      if (!this.isNumber(e.detail.value)) {
        wx.showToast({
          title: '请输入数字',
          icon: 'none'
        })
      }
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
  work_time(e){
    console.log(e.detail.value)
    this.setData({
      workTimeIndex:e.detail.value
    })
  },
  workTimeCancel(e){
    console.log(this.data.workTimeIndex)
    if (!this.data.workTimeIndex) {
      let aniId = e.currentTarget.dataset.id
      let arr = this.data.chooseAniBox;
      arr[3] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  rp(e){
    console.log(e.detail.value)
    this.setData({
      rpIndex:e.detail.value
    })
  },
  rpCancel(e){
    if (!this.data.rpIndex) {
      let aniId = e.currentTarget.dataset.id
      let arr = this.data.chooseAniBox;
      arr[aniId] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  io(e){
    this.setData({
      ioIndex: e.detail.value
    })
  },
  ioCancel(e){
    if (!this.data.ioIndex) {
      let aniId = e.currentTarget.dataset.id
      let arr = this.data.chooseAniBox;
      arr[aniId] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  demand_content(e){
    this.setData({
      demandContent: e.detail.value
    })

  },
  demand_content_blur(e){
    if (e.detail.value === "") {
      let arr = this.data.chooseAniBox;
      arr[7] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  uploadImage(){
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success:res=> {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      console.log(res.tempFilePaths)
      this.setData({
        i:0
      })
      this.uploadImages(res.tempFilePaths)
      }
     })
  },
  preview(event){
    wx.previewImage({
      current: event.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: this.data.images // 需要预览的图片http链接列表
    })
  },
  uploadImages(data){
      wx.uploadFile({
        url: app.globalData.URL + '/file/upload', //仅为示例，非真实的接口地址
        filePath: data[this.data.i],
        name: 'file',
        header:{
          token:wx.getStorageSync('token')
        },
        success:res=>{
          console.log(JSON.parse(res.data))
          let imgurl = JSON.parse(res.data).fileId
          let images = this.data.images
          images.push(imgurl)
          this.setData({
            images:images
          })
        //do something
        },
        fail:err=>{
          console.log(err)
        },
        complete:()=>{
          this.setData({
            i:this.data.i + 1
          })
          if(this.data.i == data.length){
            console.log(`全部上传成功`);
            wx.showToast({
              title: '全部上传完成',
              icon:'none'
            })
          }else{
            wx.showToast({
              title: `第${this.data.i}个上传完成`,
              icon:'none'
            })
            this.uploadImages(data)
          }
        }
      })
  },
  getProList() {
    request('/project/list', 'get', {
      title: "",
      state: "0",
      pm: ""
    }).then(res => {
      console.log(res.searchResult)
      let arr = []
      res.searchResult.forEach(item => {
        arr.push(item.project_name)
      })
      this.setData({
        chooseProArr: arr,
        chooseProArrInfo: res.searchResult
      })
    })
  },
  submit(){
    console.log(this.data.startDate,this.data.endDate)
   if (this.data.contractName === "" || this.data.contractName===undefined){
      wx.showToast({
        title: '请填写合同名称',
        icon:'none'
      })
    }else  if (this.data.chooseProIndex === undefined){
      wx.showToast({
        title: '请选择对应项目',
        icon: 'none'
      })
    } 
     else if (this.data.contactCorp === "" || this.data.contactCorp===undefined){
      wx.showToast({
        title: '请填写合同公司',
        icon:'none'
      })
    }else if(this.data.rpIndex === undefined){
      wx.showToast({
        title: '请选择对应客户',
        icon:'none'
      })
    }
    else if (this.data.ioIndex  === undefined){
      wx.showToast({
        title: '请选择企业ID',
        icon: 'none'
      })
    } else if (this.data.startDate === undefined) {
      wx.showToast({
        title: '请选择开始时间',
        icon: 'none'
      })
    }else if (this.data.endDate === undefined) {
      wx.showToast({
        title: '请选择结束时间',
        icon: 'none'
      })
    } else if (this.data.amount === "" || this.data.amount===undefined){
      wx.showToast({
        title: '请填写合同金额',
        icon:'none'
      })
    }else if (this.data.batch  === undefined){
      wx.showToast({
        title: '请选择付款批次',
        icon: 'none'
      })
    }else{
      wx.showModal({
        content: '确认录入合同?',
        success:res=>{
          if(res.confirm){
            console.log(this.data.contractName)
            console.log(this.data.chooseProArrInfo[this.data.chooseProIndex].project_id)
            console.log(this.data.clientListInfo[this.data.rpIndex].id)
            console.log(this.data.contactCorp)
            console.log(this.data.ioArrInfo[this.data.ioIndex].value)
            console.log(this.data.amount)
            console.log(this.data.startDate)
            console.log(this.data.endDate)
            console.log(this.data.batch)
            console.log(this.data.images.join(','))
            console.log(this.data.payDOList)

            this.setData({
              loading: true
            })
            saveRequest('/contract/save','post',{
              "contractName": this.data.contractName,
              "projectId": this.data.chooseProArrInfo[this.data.chooseProIndex].project_id,
              "customId": this.data.clientListInfo[this.data.rpIndex].id,
              "contactCorp": this.data.contactCorp,
              "corpCode": this.data.ioArrInfo[this.data.ioIndex].value,
              "amount": this.data.amount,
               "startDate": this.data.startDate,
              "endDate": this.data.endDate,
              "batch": this.data.batch,
              "fileUrl":this.data.images.join(','),
              "payDOList":this.data.payDOList
            },'application/json').then(res=>{
              console.log(res)
              this.setData({
                loading: false
              })
              if(res.code === 0){
                wx.showToast({
                  title: '录入成功',
                  icon:'none'
                })
                setTimeout(() => {
                  wx.navigateTo({
                    url: '../ContractList/ContractList',
                  })
                }, 1000)
              }else{
                wx.showToast({
                  title: '录入失败，请联系管理员',
                  icon: "none"
                })
              }
            })
          }
        }
      })
    }
  },
  getcustomList(){
    request('/custom/search','get',{}).then(res=>{
      let data = res.searchRst
      let arr = []
      data.forEach(item=>{
        arr.push(item.name)
      })
      this.setData({
        clientList:arr,
        clientListInfo:res.searchRst
      })
    })
  },
 getDict(){
    request('/dict/contract_corp','get',{}).then(res=>{
      console.log(res)
      let dictArr = res.dicts
      let arr = []
      dictArr.forEach(item=>{
        arr.push(item.name)
      })
      this.setData({
        ioArr:arr,
        ioArrInfo: dictArr
      })
    })
  },
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRPtype()
    this.getProList()
    this.getcustomList()
    this.getDict()
    // this.getPercent()
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