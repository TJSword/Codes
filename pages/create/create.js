// pages/create/create.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    second:10,
    progress_num:0,
    menu_list:[{
      id:0,
      imgSrc:"https://st-cn.meishij.net/r/181/98/13899681/s13899681_159667457408138.jpg",
      dsc:'不同地方的韭菜盒子形状也各有不同，有月牙形的，三角形的，圆形的……韭菜盒子是北方的一种特色小吃，常常出现在早餐餐桌上，外皮酥软有嚼劲，馅料饱满嫩鲜香。韭菜盒子最大的魅力在于：原本看上去油腻腻的，没太大食欲，但是只要你尝上一口之后基本就停不下来了，那种感觉，只可意会，不可言传！'
    },{
      id:1,
      imgSrc:'https://st-cn.meishij.net/r/06/177/6419256/s6419256_159614632498328.jpg',
      dsc:'黑芝麻大家平时吃的量不是很大，除了当装饰或者调味品以外，好像没有什么美食是用量非常大的，其实我们可以把黑芝麻打成粉，做成黑芝麻馅，给孩子包汤圆或者做黑芝麻馅的包子、糖饼，这样食用量就会多了一些，也可以用黑芝麻打豆浆或者米糊，尤其是作为早餐，好喝又营养还补钙。而且黑色食物还有益气补血的功效，黑芝麻对乌发也有很好的帮助，爱美的女生更不能错过。'
    },{
      id:2,
      imgSrc:'https://st-cn.meishij.net/r/73/127/10031823/s10031823_159673007099042.jpg',
      dsc:'豆角的营养价值非常丰富,常吃豆角对人体健康是非常有好处的。夏天天气炎热。所以在夏天可以多吃一些豆角可以有效消暑,并起到青口的作用。因为豆角中含有丰富的维生素B、和维生素C和植物蛋白质,能够使人头脑清晰,有解渴健脾、益气生津的功效'
    },{
      id:3,
      imgSrc:'https://st-cn.meishij.net/r/06/177/6419256/s6419256_159614771515930.jpg',
      dsc:'鸡肉高蛋白低脂肪，而且肉质细腻，又好消化，是很好的营养滋补佳品，不论是煲汤还是炖煮都非常营养好吃，但是孩子们比较喜欢吃烤的，比如烤鸡翅、烤鸡腿，今天烤了鸡翅根，非常好吃。'
    },{
      id:4,
      imgSrc:'https://st-cn.meishij.net/r/06/177/6419256/s6419256_159614838282554.jpg',
      dsc:'三伏天，不想做饭有懒人方法，肉菜饭一锅出特省事，孩子能吃2大碗。这个鸡腿焖饭真的是超级好吃，米粒吸足的肉汤的精华，土豆和胡萝卜软糯咸香，鸡腿更是味道鲜美，满满一大锅都不够吃，不用炒菜，炖肉，蒸米饭了，三合一，一锅出，太省事了，里边的蔬菜还可以放香菇、南瓜、芋头都可以，鸡肉也可以换成猪肉块，根据自己的口味来选择，是不是特别方便？'
    }]
  },
  jumpToListDetail(e){
    console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../examine/examine?cuisineId=' + id,
    })
  },
  changeContent(e){
    console.log(e.detail.value)
    this.setData({
      content:e.detail.value
    })
  },
  sliderChange(e){
    console.log(e.detail.value)
    this.setData({
      second:e.detail.value
    })
  },
  upload(e){
    if(!this.data.fisrtClicked){
      if(this.data.content === undefined || this.data.content === ""){
        wx.showToast({
          title: '不打算写点什么嘛:(',
          icon:'none'
        })
      }else{
        this.setData({
          fisrtClicked:true
        })
        wx.cloud.callFunction({
          name: "msgCheck",
          data: {
            content: this.data.content
          }
        }).then(res=>{
          console.log(res)
          if(res.result.errCode === 0){
            this.setData({
              uploading:true
            })
            setTimeout(()=>{
              this.setData({
                isShowTips:true
              })
            },1600)
            let num = 0;
            let timer = setInterval(_=>{
              num++
              this.setData({
                progress_num:num
              })
              console.log(num)
              if(num === 100){
                wx.showToast({
                  title: '加密完成:)',
                  icon:'none'
                })
                clearInterval(timer)
              }
            },12)
            let secret = Math.floor(Math.random() * 2821109907455).toString(36).toUpperCase();
            this.setData({
              secret
            })
            wx.cloud.callFunction({
              name: "create",
              data:{
                second:this.data.second,
                content:this.data.content,
                secret
              },
              success:res=>{
                console.log(res)
              
              }
            })
          }else{
            wx.showToast({
              title: '你编辑的消息不符合规范:(',
              icon:"none"
            })
          }
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name:'getConfig',
      success:res=>{
        console.log(res.result.checkStatus)
        this.setData({
          checkStatus:res.result.checkStatus
        })
      }
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
    this.setData({
      content:null,
      uploading:false,
      second:10,
      fisrtClicked:false
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      content:null,
      uploading:false,
      second:10,
      fisrtClicked:false
    })
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
  onShareAppMessage: function (e) {
    if(e.from === 'button'){
      return{
        title:'这里有一则你的消息',
        path:"/pages/examine/examine?id=" + this.data.secret,
        imageUrl:'../../images/share.png'
      }
    }
  }
})