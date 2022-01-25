
const app = getApp()
import { request, saveRequest } from '../../utils/util.js';
import * as echarts from '../../ec-canvas/echarts';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    piechartsComponnet:null,
    ec: {
      lazyLoad: false // 延迟加载
    }, //饼图
    // currentYear:2021,
    // currentMonth:2,
    currentMonthDateLen: 0, // 当月天数
		preMonthDateLen: 0, // 当月中，上月多余天数
		allArr:[], // 当月所有数据
  },
		// 获取某年某月总共多少天
		getDateLen(year, month) { 
			let actualMonth = month - 1;
			let timeDistance = +new Date(year, month) - +new Date(year, actualMonth);
			return timeDistance / (1000 * 60 * 60 * 24);
		},
		// 获取某月1号是周几
		getFirstDateWeek(year, month) { 
			return new Date(year, month - 1, 1).getDay()
		},
		// 上月 年、月
		preMonth(year, month) { 
			if (month == 1) {
				return {
					year: --year,
					month: 12
				}
			} else {
				return {
					year: year,
					month: --month
				}
			}
		},
		// 下月 年、月
		nextMonth(year, month) { 
			if (month == 12) {
				return {
					year: ++year,
					month: 1
				}
			} else {
				return {
					year: year,
					month: ++month
				}
			}
		},
		// 获取当月数据，返回数组
		getCurrentArr(){ 
			let currentMonthDateLen = this.getDateLen(this.data.currentYear, this.data.currentMonth) // 获取当月天数
			let currentMonthDateArr = [] // 定义空数组
			if (currentMonthDateLen > 0) {
				for (let i = 1; i <= currentMonthDateLen; i++) {
					currentMonthDateArr.push({
						month: 'current', // 只是为了增加标识，区分上下月
						date: i
					})
				}
			}
			this.setData({
				currentMonthDateLen
			})
			return currentMonthDateArr
		},
		// 获取当月中，上月多余数据，返回数组
		getPreArr(){ 
			let preMonthDateLen = this.getFirstDateWeek(this.data.currentYear, this.data.currentMonth) // 当月1号是周几 == 上月残余天数）
            let preMonthDateArr = [] // 定义空数组
			if (preMonthDateLen > 0) {
				let { year, month } = this.preMonth(this.data.currentYear, this.data.currentMonth) // 获取上月 年、月
				let date = this.getDateLen(year, month) // 获取上月天数
				for (let i = 0; i < preMonthDateLen; i++) {
					preMonthDateArr.unshift({ // 尾部追加
                        month: 'pre', // 只是为了增加标识，区分当、下月
						date: date
					})
					date--
				}
			}
			this.setData({
				preMonthDateLen
			})
			return preMonthDateArr
		},
		// 获取当月中，下月多余数据，返回数组
		getNextArr() { 
			let nextMonthDateLen = 42 - this.data.preMonthDateLen - this.data.currentMonthDateLen // 下月多余天数
			let nextMonthDateArr = [] // 定义空数组
			if (nextMonthDateLen > 0) {
				for (let i = 1; i <= nextMonthDateLen; i++) {
					nextMonthDateArr.push({
            month: 'next',// 只是为了增加标识，区分当、上月
						date: i
					})
				}
			}
			return nextMonthDateArr
		},
		// 整合当月所有数据
		getAllArr(){ 
			let preArr = this.getPreArr()
			let currentArr = this.getCurrentArr()
			let nextArr = this.getNextArr()
			let allArr = [...preArr, ...currentArr, ...nextArr]
			this.setData({
				allArr
			})
			console.log(this.data.allArr)
		},
		// 点击 上月
		gotoPreMonth(){ 
			let { year, month } = this.preMonth(this.data.currentYear, this.data.currentMonth)
			this.setData({
				currentYear: year,
				currentMonth: month
			})
			this.getAllArr()
			let currentmonth = this.data.currentMonth
			if(currentmonth < 10){
				currentmonth = '0' + currentmonth
			}
			this.getEvents(this.data.currentYear + '-' + currentmonth)
		},
		// 点击 下月
		gotoNextMonth() { 
			let { year, month } = this.nextMonth(this.data.currentYear, this.data.currentMonth)
			this.setData({
				currentYear: year,
				currentMonth: month
			})
			this.getAllArr()
			let currentmonth = this.data.currentMonth
			if(currentmonth < 10){
				currentmonth = '0' + currentmonth
			}
			this.getEvents(this.data.currentYear + '-' + currentmonth)
		},
		getToday(){
			console.log(new Date())
			let year = new Date().getFullYear()
			let month = new Date().getMonth()
			month++
			if(month < 10){
				month = '0' + month
			}
			this.setData({
				currentYear:year,
				currentMonth:month
			})
		},
    //canvas绘制
    init_pieCharts: function () {
      this.piechartsComponnet.init((canvas, width, height) => {
        // 初始化图表
        const pieChart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        pieChart.setOption(this.getPieOption());
        // 注意这里一定要返回 chart 实例，否则会影响事件处理等
        return pieChart;
      });
		},
		showInfo(e){
			let birthArr = []
			let taskArr= []
			let sxArr = []
			let data = e.currentTarget.dataset.item
			data.birth.forEach(item=>{
				birthArr.push(item.name)
			})
			data.task.forEach(item=>{
				taskArr.push(item.title)
			})
			data.sx.forEach(item=>{
				sxArr.push(item.name)
			})
			let birthStr = birthArr.join(',')
			let taskStr = taskArr.join(',\n')
			let sxStr = sxArr.join(',\n')
			if(birthArr.length === 0 && taskArr.length === 0 && sxArr.length === 0 ){
				return false
			}
			wx.showModal({
				content:`${data.birth.length === 0?'':birthStr + '过生日，祝生日快乐，又老了一岁\n'}${data.task.length === 0?'':taskStr+'等任务于今日截止'}${data.sx.length === 0?'':'今日提醒\n' + sxStr}`,
				showCancel:false
			})
		},
    getPieOption: function () {
      var option = {
				color: ["#457b9d", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51", "#FF9F7F"],
				tooltip:{
					show:false
				},
				title:{
					text:"本月共计\n{num|20}个",
					textStyle:{
						align:'center',
						'fontSize':12,
						color:'#023047',
						lineHeight:24,
						rich:{
							num:{
								fontSize:16,
								fontWeight:700,
								color:'#EEA644'
							},
						}
					},
					textAlign:'center',
					top:'42%',
					left:'48%',
				},
				series: [{
          label: {
            normal: {
							fontSize: 14,
							show:false,
						},
						position:'inside'
          },
          type: 'pie',
          center: ['50%', '50%'],
          radius: ['40%', '60%'],
          data: [{
            value: 55,
            name: '北京'
          }, {
            value: 20,
            name: '武汉'
          }, {
            value: 10,
            name: '杭州'
          }, {
            value: 20,
            name: '广州'
          }]
        }]
      };
      return option;
		},
		getEvents(date){
			request('/event/search','get',{date}).then(res=>{
				console.log(this.data.allArr)
				let data = res.rst
				data.forEach(item=>{
					item.day = item.time.split('-')[1] *1
				
					if(item.time.split('-')[0] < this.data.currentMonth){
						item.month = 'pre'
					}
					if(item.time.split('-')[0] == this.data.currentMonth){
						item.month = 'current'
					}
					if(item.time.split('-')[0] > this.data.currentMonth){
						item.month = 'next'
					}
					if(item.time.split('-')[0] == 12 && this.data.currentMonth == '01'){
						item.month = 'pre'
					}
					if(item.time.split('-')[0] == '01' && this.data.currentMonth ==12){
						item.month = 'next'
					}
				})
				console.log(data)
				let allArr = this.data.allArr
				allArr.forEach(item=>{
					data.forEach(item1=>{
						if(item.month === item1.month && item.date === item1.day){
							item.task = item1.task
							item.sx = item1.sx
							item.birth = item1.birth
							item.remindFlag = item1.remindFlag
						}
					})
				})
				console.log(allArr)
				this.setData({
					allArr
				})
			})
		},
		jumpToIndex(){
			wx.navigateTo({
				url: '../Index/Index',
			})
		},
		getInfo(){
			request("/synthesis",'get',{}).then(res=>{
				let data =res.rst
				let tq = []
				let hl = []
				let xz = []
				console.log(data)
				data.forEach(item=>{
					tq.push(item.tq)
					hl.push(item.hl)
					xz.push(item.xz)
				})
				tq.forEach(item=>{
					item.hoursArr = item.hours.slice(0,6)
				})
				hl.forEach(item=>{
					item.newslist[0].yiArr = item.newslist[0].fitness.split('.').slice(0,4);
					item.newslist[0].jiArr = item.newslist[0].taboo.split('.').slice(0,4);
				})
				xz.forEach(item=>{
					item.star = parseInt(parseInt(item.newslist[0].content) / 20)
					item.hasHalfStar = parseInt(item.newslist[0].content)/10 % 2
				})
				this.setData({
					tq,hl,xz
				})
				console.log(this.data.tq)
				console.log(this.data.hl)
				console.log(this.data.xz)
			})
		},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		this.getToday()
		this.getAllArr()
		this.getInfo()
		this.getEvents(this.data.currentYear + '-' + this.data.currentMonth)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
		// this.piechartsComponnet = this.selectComponent('#mychart-dom-pie'); //饼图
    // setTimeout(_=>{
    //   this.init_pieCharts()
    // },50)
   
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