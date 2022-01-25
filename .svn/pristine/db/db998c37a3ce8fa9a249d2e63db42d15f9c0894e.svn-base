// pages/ReleaseDemand/ReleaseDemand.js
const app = getApp()
import { request, saveRequest } from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    chooseAniBox: [false, false, false, false, false, false, false, false,false,false],
    chooseProArr:[],
    rpTypeIndex:[null,null],
    workTimeArr:[],
    showWorkTime:false,
    workTimeIndex:null,
    rpArr:['男','女'],
    hard_easy:[1,2,3,4,5,6,7]
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
        name:e.detail.value
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
  company_name(e){
    this.setData({
      company:e.detail.value
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
  dept_name(e){
    this.setData({
      dept:e.detail.value
    })
  },
  dept_name_blur(e){
    if (e.detail.value === "") {
      let arr = this.data.chooseAniBox;
      arr[10] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  position_name(e){
    this.setData({
      position:e.detail.value
    })
  },
  position_name_blur(e){
    if (e.detail.value === "") {
      let arr = this.data.chooseAniBox;
      arr[9] = false;
      this.setData({
        chooseAniBox: arr
      })
    }
  },
  tel_name(e){
    this.setData({
      telphone:e.detail.value
    })
  },
  tel_name_blur(e){
    if (e.detail.value === "") {
      let arr = this.data.chooseAniBox;
      arr[9] = false;
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
  getUserList(){
    request('/user/list','get').then(res=>{
      console.log(res.serchResult)
      let arr = []
      res.serchResult.forEach(item=>{
        arr.push(item.name)
      })
      console.log(arr)
      this.setData({
        ioArr:arr,
        ioArrInfo: res.serchResult
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
      birth: e.detail.value
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
      sex:e.detail.value
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
      address: e.detail.value
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
    if (this.data.name === "" || this.data.name===undefined){
      wx.showToast({
        title: '请填写客户姓名',
        icon:'none'
      })
    }else if(this.data.company === "" || this.data.company===undefined){
      wx.showToast({
        title: '请填写公司名称',
        icon:'none'
      })
    } else if (this.data.sex === undefined){
      wx.showToast({
        title: '请选择性别',
        icon:'none'
      })
    }else if(this.data.ioIndex === undefined){
      wx.showToast({
        title: '请选择企业ID',
        icon:'none'
      })
    }else if(this.data.dept === "" || this.data.dept===undefined){
      wx.showToast({
        title: '请填写部门',
        icon:'none'
      })
    }else if(this.data.position === "" || this.data.position===undefined){
      wx.showToast({
        title: '请填写职位',
        icon:'none'
      })
    }
    // else if (this.data.birth === undefined) {
    //   wx.showToast({
    //     title: '请选择生日',
    //     icon: 'none'
    //   })
    // }
    else if(this.data.telphone === "" || this.data.telphone===undefined){
      wx.showToast({
        title: '请填写手机',
        icon:'none'
      })
    }
    // else if(this.data.address === "" || this.data.address===undefined){
    //   wx.showToast({
    //     title: '请填写邮寄地址',
    //     icon:'none'
    //   })
    // }
    else{
      wx.showModal({
        content: this.data.isUpdate?'确认修改客户?':'确认新增客户',
        success:res=>{
          if(res.confirm){
            if(this.data.isUpdate){
              this.setData({
                loading: true
              })
              saveRequest('/custom/update','put',{
                id:this.data.id,
                "name": this.data.name,
                "sex": this.data.sex,
                "company": this.data.company,
                "dept": this.data.dept,
                "position": this.data.position,
                "birth":this.data.birth,
                 "telphone":this.data.telphone,
                "address": this.data.address,
                "corpCode": this.data.ioArrInfo[this.data.ioIndex].value
              },'application/json').then(res=>{
                console.log(res)
                this.setData({
                  loading: false
                })
                if(res.code === 0){
                  wx.showToast({
                    title: '修改客户成功',
                    icon:'none'
                  })
                  setTimeout(() => {
                    wx.navigateTo({
                      url: '../ClientList/ClientList',
                    })
                  }, 1000)
                }else{
                  wx.showToast({
                    title: '修改失败，请联系管理员',
                    icon: "none"
                  })
                }
              })
            }else{
              this.setData({
                loading: true
              })
              saveRequest('/custom/save','post',{
                "name": this.data.name,
                "sex": this.data.sex,
                "company": this.data.company,
                "dept": this.data.dept,
                "position": this.data.position,
                "birth":this.data.birth,
                 "telphone":this.data.telphone,
                "address": this.data.address,
                "corpCode": this.data.ioArrInfo[this.data.ioIndex].value
              },'application/json').then(res=>{
                console.log(res)
                this.setData({
                  loading: false
                })
                if(res.code === 0){
                  wx.showToast({
                    title: '新增客户成功',
                    icon:'none'
                  })
                  setTimeout(() => {
                    wx.navigateTo({
                      url: '../ClientList/ClientList',
                    })
                  }, 1000)
                }else{
                  wx.showToast({
                    title: '新增失败，请联系管理员',
                    icon: "none"
                  })
                }
              })
            }
          }
        }
      })
    }
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
    // this.getPercent()
    this.getDict()
    if(options.id){
      request('/custom/view/' + options.id,'get',{}).then(res=>{
        console.log(res.searchResult)
        let data = res.searchResult
        console.log(this.data.ioArrInfo)
        setTimeout(_=>{
          let ioArrInfo = this.data.ioArrInfo
          ioArrInfo.forEach((item,index)=>{
            if(item.value === data.corpCode){
              this.setData({
                ioIndex:index
              })
            }
          })
        },50)
        this.setData({
          chooseAniBox:[true,true,true,true,true,true,true,true,true,true,true,true,true,true],
          name:data.name,
          company:data.company,
          sex:data.sex === '男'?0:1,
          dept:data.dept,
          position:data.position,
          birth:data.birth,
          telphone:data.telphone,
          address:data.address,
          id:data.id,
          isUpdate:true
        })
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