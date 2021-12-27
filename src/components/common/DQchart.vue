<template>
  <!-- 数据查询图表 -->
  <div class="DQchart_wrap">
    <div class="head">
      <div class="headText">{{ categoryObj.name }}（{{categoryObj.unit}}）</div>
      <div class="class_child" v-if="classChildren.length>0">
        <span class="name">选择子分类：</span>
        <div class="item_wrap">
          <div 
          class="item"
          size="mini"
          :style="{'background':curChild==item.id?'#3a8ee6':'','color':curChild==item.id?'#fff':'#3d3d3d',}"
          @click="chooseClassChild(item)"
          v-for="(item,index) in classChildren" 
          :key="index">{{item.name}}</div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="DQ_chart" 
      v-loading="loading"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.6)"
      :style="{'width':classChildren.length>0?'50%':'100%'}">
        <div class="data_tip" v-if="dataFlag">未查询到录入数据</div>
        <div :id="echartsID" class="chart" ref="echarts" :style="{'width':classChildren.length>0?mainChartWidth*0.5+'px':mainChartWidth+'px'}"></div>
        <div :id="echartsID_line" class="chart" ref="echarts1" :style="{'width':classChildren.length>0?mainChartWidth*0.5+'px':mainChartWidth+'px'}"></div>
        <div class="time_range">
          <el-slider
              v-model="timeRange"
              range
              show-stops
              :marks="timeYearMarks"
              :min="minYear"
              :max="maxYear"
              @input="timeYearInput"
              @change="timeValueChange">
            </el-slider>
        </div>
      </div>
      <div class="node_chart" 
      v-loading="loading1"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.6)"
        v-show="classChildren.length>0"
        :style="{'width':classChildren.length>0?'50%':'0%'}">
          <div class="node_head">
            <div class="node_title">{{nodeData.name}}</div>
            <!-- <div class="btn_box">
              <el-tooltip v-for="(item,index) in btnArr" :key="index" 
              :content="item.name" placement="bottom" effect="dark">
                <i :class="item.icon" 
                @click="changeInfoInfoStyle(index)"
                :style="{'color':curBtn==index?'#e6a23c':'#a6aaad'}"
                ></i>
              </el-tooltip>
            </div> -->
          </div>
          <div class="data_tip" v-if="nodeData.info.length==0">未查询到录入数据</div>
          <div class="node_content">
            <!-- 饼图 -->
            <div class="node_content3">
              <div class="node_piechart" :style="{'width':pieWidth}" :id="nodePiechartID"></div>
            </div>
            <div class="right">
              <!-- 柱状图 -->
              <div class="node_content2">
                <div class="node_histogram" :style="{'width':hisWidth}"  :id="nodeHistogramID"></div>
              </div>
              <!-- 列表 -->
              <div class="node_content1">
                <div class="info_item" v-for="(item,index) in nodeData.info" :key="index">
                  <div class="tags" effect="dark" :style="{'background':setTagType(index)}" size="mini">{{item.name}}</div>
                  <span class="values">{{item.value}}</span>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
//store
import { mapGetters } from "vuex";
//Api
import dataQueryApi from "@/api/dataqueryApi"

export default {
  name: "DQchart",
  props: {
    // 接收父组件传递过来的信息
    categoryObj: {
      type: Object, //指标对象
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      timeRange:[],//年份范围
      minYear:null,
      maxYear:null,
      timeYearMarks:{
        2010:'2010'
      },//年份范围标注
      chartData:{ //大柱状图数据
        xData:[],
        yData:[],
        sum:null,
        average:null
      },
      nodeData:{ //子节点数据
        name:'',
        info:[
          //{name:'制造业',value:1203}
        ]
      },
      classChildren:[], //传入指标类别的子元素数组
        
      curChild:null,//当前选择的指标子元素

      btnArr:[ //小按钮数组
        {name:'扇形图',icon:'el-icon-s-help'},
        {name:'柱状图',icon:'el-icon-s-data'},
        {name:'列表',icon:'el-icon-s-order'}
        
      ],
      curBtn:0,//当前小按钮
      nodeWidth:window.innerWidth*0.34+'px',
      mainChartWidth:window.innerWidth,
      pieWidth:window.innerWidth*0.3+'px',
      hisWidth:window.innerWidth*0.2+'px',
      dataFlag:false,//主图表是否有数据提示
      loading:false,//主图表loading
      loading1:false,//子图表loading
    };
  },
  mounted() {
    //设置初始时间范围
    let date = new Date()
    let year = date.getFullYear()
    this.timeRange = [year-9,year-1]
    this.minYear = year-10
    this.maxYear = year
    //设置选择的类别名称跟子项
    setTimeout(()=>{
      this.setClassNameChildren()
      //获取客观指标时间段内数据
      if(this.categoryObj.url){
        this.getCategoryData(this.categoryObj.url)
      }
    },600)
    
    
  },
  watch:{
    nodeData:{
      handler(){
        // this.setNodeHistogram()
        // this.setNodePiechart()
      },
      deep:true
    }
  },
  computed: {
    ...mapGetters(["userMenuList","classification","plateData","cityCode"]),
    
    echartsID() { //动态大柱状图ID
      return "echarts" + Math.random() * 100000;
    },
    echartsID_line() { //动态大折线图ID
      return "echarts_line" + Math.random() * 100000;
    },
    nodeHistogramID() { //动态柱状图容器ID
      return "nodeHistogram" + Math.random() * 100000;
    },
    nodePiechartID() { //动态扇形图容器ID
      return "nodePiechart" + Math.random() * 100000;
    },
    
  },
  methods: {
    timeYearInput(val){ //年份范围切换label切换
      this.timeYearMarks={
        2010:'2010'
      }
      for(let i = this.minYear;i<=this.maxYear;i++){
        if(i===val[0]){
          this.timeYearMarks[i]={
            style: {
              color: '#1989FA'
            },
            label: this.$createElement('strong', i+' ')
          }
        }else if(i===val[1]){
          this.timeYearMarks[i]={
            style: {
              color: '#1989FA'
            },
            label: this.$createElement('strong', i+' ')
          }
        }else{
          this.timeYearMarks[i]=i+' '
        }
      }
    },
    timeValueChange(){ //年份范围切换请求数据
      this.getCategoryData(this.categoryObj.url)
      if(this.classChildren.length>0){ //存在子指标，请求子指标数据
        this.getNodeCategoryData()
      }
    },
    getCategoryData(url){ //获取客观指标时间段内数据
      
      let obj = {
        minTime:this.timeRange[0],
        maxTime:this.timeRange[1],
        regionno:this.cityCode,
        operation:'issingle' // 时间段内每个时间颗粒度的数据
      }
      console.log(obj)
      this.loading = true
      dataQueryApi.getCategory(url,obj)
      .then(res=>{
        if(res.data.code===0){
          console.log(res)
          let list = res.data.data
          let sum = null
          let xData = []
          let yData = []
          if(list.length>0){
            list.forEach(item=>{
              if(item.data!==null&&item.data!==undefined){
                xData.push(item.dueTime)
                yData.push(parseInt(item.data))
                sum += item.data
              }
              
            })
            this.chartData.xData = xData
            this.chartData.yData = yData
            if(yData.length==0){
              this.dataFlag = true
            }
            //this.chartData.sum = sum.toFixed(2)
            //this.chartData.average = Math.floor(sum/list.length).toFixed(2)
            //图表绘制
            this.drawChart()
          }else{
            this.$message('未查询到该时间段的数据,请重新选择时间范围')
          }
        }else{
          this.$message({
            type:'warning',
            message:'数据加载出错'
          })
        }
        this.loading = false
      })
      setTimeout(() => {
        if(this.loading===true){
          this.loading = false
        }
      }, 10000);
    },
    getNodeCategoryData(singleTime){ //获取子类指标数据
      //获取指标请求的URL
      if(this.classChildren.length>0){
        var url = this.classChildren.filter(item=>item.id==this.curChild)[0].url
        var name = this.classChildren.filter(item=>item.id==this.curChild)[0].name
      }
      if(singleTime==undefined //singleTime 当前选择单个时间点时传入
        &&url==undefined){ //没有子类时不做请求
        return
      }
      let obj = {}
      if(singleTime){ //时间点
        obj ={
          minTime:JSON.parse(singleTime),
          maxTime: '',
          regionno:this.cityCode
        }
      }else{ //时间范围
        obj = {
          minTime:this.timeRange[0],
          maxTime:this.timeRange[1],
          regionno:this.cityCode
        }
      }
      this.loading1 = true
      dataQueryApi.getCategory(url,obj)
      .then(res=>{
        if(res.data.code===0){
          console.log('子类数据',res)
          let list = res.data.data
          let arr = []
          list.forEach(item=>{
            arr.push({
              name:item.label,
              value:item.data
            })
          })
          this.nodeData.info = arr
          this.nodeData.name = (singleTime?singleTime:(obj.minTime+'-'+obj.maxTime))+' '+name
          
          this.setNodeHistogram()
          this.setNodePiechart()
        }else{
          this.$message({
            type:'warning',
            message:'数据加载出错'
          })
        }
        this.loading1 = false
      })
      setTimeout(() => {
        if(this.loading1===true){
          this.loading1 = false
        }
      }, 10000);
    },
    setTagType(i){ //随机设置tag类型
      let arr = [
        'rgba(64, 158, 255,0.7)','rgba(61, 125, 29,0.7)','rgba(144, 147, 153,0.7)','rgba(230, 162, 60,0.7)','rgba(245, 108, 108,0.7)',
        "rgba(0, 92, 146,0.7)","rgba(33, 117, 67,0.7)","rgba(129, 18, 165,0.7)","rgba(156, 40, 40,0.7)","rgba(36, 112, 130,0.7)",
      
        'rgba(64, 158, 255,0.7)','rgba(61, 125, 29,0.7)','rgba(144, 147, 153,0.7)','rgba(230, 162, 60,0.7)','rgba(245, 108, 108,0.7)',
        "rgba(0, 92, 146,0.7)","rgba(33, 117, 67,0.7)","rgba(129, 18, 165,0.7)","rgba(156, 40, 40,0.7)","rgba(36, 112, 130,0.7)"
      ]
      return arr[i]
    },
    setClassNameChildren(){ //设置选择的类别名称跟子项
      let children = this.userMenuList.filter(item=>{
        return item.pid == this.categoryObj.id
      })
      this.classChildren = children?children:[]
      this.curChild = children.length>0?children[0].id:null

      if(children.length>0){ //有子类，请求子类第一个子类数据
        this.getNodeCategoryData()
      }
      setTimeout(()=>{
         this.drawChart();
      },100)
     
    },
    chooseClassChild(item){ //选择指标子元素并请求数据
      this.curChild = item.id
      this.getNodeCategoryData()
    },
    drawChart() {
      const that = this;
      let myChart = that.$echarts.init(document.getElementById(this.echartsID));
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: `{b}年 ${this.categoryObj.name}： <br/> {c} ${this.categoryObj.unit}`
        },
        grid: {
          top: "10%",
          left: "1%",
          right: "1%",
          bottom: "6%",
          containLabel: true
        },
        toolbox: {
          show: false,
          //orient: 'vertical',
          left: 'right',
          top: '2%',
          feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar']},
              //restore: {show: true},
              saveAsImage: {show: true}
          }
        },
        dataZoom: [
            {
              type: 'inside'
            }
        ],
        xAxis: [
          {
            type: "category",
            color: "#59588D",
            boundaryGap: true,
            axisLabel: {
              margin: 20,
              color: "#fff",
              textStyle: {
                fontSize: 13
              }
            },
            axisLine: {
              lineStyle: {
                color: "#5387c1"
              }
            },
            axisTick: {
              show: true
            },
            data: that.chartData.xData
          }
        ],
        yAxis: [
          {
            type: "value",
            splitNumber: 4,
            axisLabel: {
              formatter: "{value}",
              margin: 20,
                textStyle: {
                    color: '#d1e6eb',

                },
            },
            axisLine: {
              lineStyle: {
                color: "#5387c1"
              }
            },
            axisTick: {
              show: true
            },
            splitLine: {
              lineStyle: {
                color: "rgba(131,101,101,0.2)",
                type: "dashed"
              }
            }
          }
        ],
        series: [
          {
            //name: that.chartData.title,
            type: "bar",
            barWidth: "35%",
            itemStyle: {
              normal: {
                color: new that.$echarts.graphic.LinearGradient(
                  0,0,0,1,
                  [
                    {
                      offset: 0,
                      color: "rgba(43, 144, 255,0.8)" // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "rgba(43, 144, 255,0)" // 100% 处的颜色
                    }
                  ],
                  false
                ),
                shadowBlur: 20,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                barBorderRadius: [8, 8, 0, 0]
              }
            },
            label: {
              normal: {
                show: true,
                fontSize: 12,
                fontWeight: "bold",
                color: "#bbb",
                position: "top"
              }
            },
            data: that.chartData.yData
          }
        ]
      };
      // 清除画布
      myChart.clear();
      myChart.setOption(option);
      window.addEventListener("resize", myChart.resize);
      // 在渲染点击事件之前先清除点击事件
      myChart.off("click");
      let curIndex = null
      myChart.on('click', params => {
        console.log(params)
        
        option.series[0].itemStyle.normal.color = param=>{
          if(params.dataIndex==param.dataIndex&&curIndex==params.dataIndex){
            return new that.$echarts.graphic.LinearGradient(
              0,0,0,1,
              [
                {
                  offset: 0,
                  color: "rgba(255, 177, 0,0.8)" // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "rgba(255, 177, 0,0)" // 100% 处的颜色
                }
              ],
              false
            )
          }else{
            return new that.$echarts.graphic.LinearGradient(
              0,0,0,1,
              [
                {
                  offset: 0,
                  color: "rgba(43, 144, 255,0.8)" // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "rgba(43, 144, 255,0)" // 100% 处的颜色
                }
              ],
              false
            )
          }
        }
        if(curIndex==params.dataIndex){
          curIndex = null
          this.getNodeCategoryData()
        }else{
          curIndex = params.dataIndex
          this.getNodeCategoryData(params.name)
        }
        myChart.setOption(option);
      });
      //折线图
      this.drawChartLine()
    },
    drawChartLine() {
      const that = this;
      let myChart = that.$echarts.init(document.getElementById(this.echartsID_line));
      let option = {
        tooltip: {
          trigger: 'axis',
          formatter: `{b}年 ${this.categoryObj.name}： <br/> {c} ${this.categoryObj.unit}`,
          axisPointer: {
            lineStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: 'rgba(0, 255, 233,0)'
                }, {
                  offset: 0.5,
                  color: 'rgba(255, 255, 255,1)',
                }, {
                  offset: 1,
                  color: 'rgba(0, 255, 233,0)'
                }],
                global: false
              }
            },
          },
        },
        grid: {
          top: '10%',
          left: '7%',
          right: '3%',
          bottom: '15%',
          // containLabel: true
        },
        dataZoom: [
            {
              type: 'inside'
            }
        ],
        xAxis: [{
          type: 'category',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#9581F5'
            },
          },
          splitArea: {
            // show: true,
            color: '#f00',
            lineStyle: {
              color: '#f00'
            },
          },
          axisLabel: {
            margin: 20,
            color: '#fff'
          },
          splitLine: {
            show: false
          },
          boundaryGap: false,
          data: that.chartData.xData,

        }],
        yAxis: [{
            type: 'value',
            min: 0,
            // max: 140,
            splitNumber: 4,
            splitLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(255,255,255,0.1)',
                    type: "dashed"
                }
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#9581F5'
                },
            },
            axisLabel: {
                show: true,
                margin: 20,
                textStyle: {
                    color: '#d1e6eb',

                },
            },
            axisTick: {
                show: true,
            },
        }],
        series: [{
          type: 'line',
          // smooth: true, //是否平滑
          showAllSymbol: true,
          // symbol: 'image://./static/images/guang-circle.png',
          symbol: 'circle',
          symbolSize: 20,
          lineStyle: {
              normal: {
                  color: "#6c50f3",
                  shadowColor: 'rgba(0, 0, 0, .3)',
                  shadowBlur: 0,
                  shadowOffsetY: 5,
                  shadowOffsetX: 5,
              },
          },
          label: {
              show: true,
              position: 'top',
              textStyle: {
                  color: '#6c50f3',
                  fontWeight: "bold"
              }
          },
          itemStyle: {
              color: "#6c50f3",
              borderColor: "#fff",
              borderWidth: 3,
              shadowColor: 'rgba(0, 0, 0, .3)',
              shadowBlur: 0,
              shadowOffsetY: 2,
              shadowOffsetX: 2,
          },
          tooltip: {
              show: true
          },
          areaStyle: {
              normal: {
                  color: new that.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                          offset: 0,
                          color: 'rgba(108,80,243,0.3)'
                      },
                      {
                          offset: 1,
                          color: 'rgba(108,80,243,0)'
                      }
                  ], false),
                  shadowColor: 'rgba(108,80,243, 0.9)',
                  shadowBlur: 20
              }
          },
          data: that.chartData.yData
        }]
      };
      // 清除画布
      myChart.clear();
      myChart.setOption(option);
      window.addEventListener("resize", myChart.resize);
      // 通过hook监听组件销毁钩子函数，并取消监听事件
      this.$once('hook:activated', () => {
        window.removeEventListener('resize', myChart.resize)
      })
    },
    changeInfoInfoStyle(i){ //切换内容展示形式
      this.curBtn = i
      
    },
    setNodeHistogram(){ //设置子元素柱状图
      let data = this.nodeData.info
      let xData=[]
      let yData = []
      data.forEach(item=>{
        xData.push(item.value) //数值
        yData.push(item.name) //类别
      })
      let myChart = this.$echarts.init(document.getElementById(this.nodeHistogramID));
      let option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}： <br/> {c}'
        },
        dataZoom: [
          {
            type: 'inside',
            yAxisIndex:[0]
          }
        ],
        grid: {
          top: "4%",
          left: "3%",
          right: "14%",
          bottom: "0%",
          containLabel: true
        },
        xAxis:{
          type:'value',
          splitLine: {
            show:false
          },
          axisLabel: {
            rotate: 30,
            color: "#9ca7ab",
          },
        },
        yAxis:{
          type:'category',
          axisLabel: {
            rotate: 30,
            color: "#9ca7ab",
            fontSize:10,
            formatter: function (name) {
              return (name.length > 4 ? (name.slice(0,4)+"...") : name );
            },
          },
          data:yData
        },
        series:[
          {
            //name: that.chartData.title,
            type: "bar",
            barWidth: (144/data.length).toFixed(2)+"px",
            itemStyle: {
              normal:{
                color: params=>{
                  return new this.$echarts.graphic.LinearGradient(
                  0,0,1,0,
                  [
                    {
                      offset: 1,
                      color: this.setTagType(params.dataIndex) // 0% 处的颜色
                    },
                    {
                      offset: 0,
                      color: "rgba(43, 144, 255,0)" // 100% 处的颜色
                    }
                  ],
                  false
                  )
                },
                
                barBorderRadius: [0, 0, 0, 0]
              }
            },
            label: {
              normal: {
                show: true,
                fontSize: 10,
                color: "#9ca7ab",
                position: "right"
              }
            },
            data: xData
          }
        ]
      };
      myChart.setOption(option);
      window.addEventListener("resize", myChart.resize);
      
    },
    setNodePiechart(){ //设置子元素饼图
      let option = {
        grid: {
          top: "0",
          left: "5%",
          right: "10%",
          bottom: "0%",
          containLabel: true
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} <br/> {c} ({d}%)'
        },
        series: [
            {
                type: 'pie',
                radius: ['30%','60%'],
                center: ['45%', '50%'],
                data: this.nodeData.info.sort(function(a, b) {
                  return a.value - b.value
                }),
                label:{
                  formatter: params=> {
                    return (params.name.length > 6 ? (params.name.slice(0,4)+"...") : params.name );
                  },
                },
                itemStyle: {
                  normal: {
                    shadowBlur: 200,
                    shadowOffsetX: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
            }
        ]
      };
      let myChart = this.$echarts.init(document.getElementById(this.nodePiechartID));
      myChart.setOption(option);
      window.addEventListener("resize", myChart.resize);
    },
  },
  
  
  created: () => {}
};
</script>

<style lang="scss">
.DQchart_wrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .head{
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: #383838 1px solid;
    padding: 0 10px;
    height: 7%;
    .headText {
      color: #d2d2d2;
      font-weight: bold;
    }
    .class_child{
      display: flex;
      .name{
        color: #e6a23c;
      }
      .item_wrap{
        display: flex;
        .item{
          margin-left: 10px;
          user-select: none;
          padding: 2px 6px;
          border-radius: 20px;
          font-size: 12px;
          color: #333;
          background: #fff;
          cursor: pointer;
        }
      }
    }
  }
  .content{
    display: flex;
    width: 100%;
    height: 93%;
    .DQ_chart{
      transition: all 0.5s;
      padding-right: 15px;
      position: relative;
      .time_range{
        width:90%;
        margin: auto;
        .month_year{
          .el-slider__bar{
            background: none;
          }
        }
        .el-slider__marks-text{
          font-size: 12px;
        }
        .el-slider__button{
          width: 12px;
          height: 12px;
          border: 3px solid #409EFF;
        }
      }
        
      .data_tip{
        color: #67696e;
        width: 60%;
        text-align: center;
        position: absolute;
        z-index: 9;
        top: 140px;
        }
      .chart {
        width: 100%;
        height: 44%;
        z-index: 1;
        /* margin-top:30px; */
      }
    }
    .node_chart{
      border-left: #373b44 1px dashed;
      position: relative;
        .node_head{
          display: flex;
          height: 7%;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px;
          border-bottom: #383838 1px solid;
          .node_title{
            color: #e6a23c;
            font-size: 12px;
          }
          .btn_box{
            i{
              color: #a6aaad;
              margin-left: 10px;
              cursor: pointer;
            }
          }
          
        }
        .data_tip{
          color: #67696e;
          width: 100%;
          text-align: center;
          position: absolute;
          z-index: 9;
          top: 140px;
        }
        .node_content{
          display: flex;
          flex-wrap: wrap;
          width: 100%;
          height: 93%;
        }
        .right{
          width: 40%;
          height: 100%;
        }
        .node_content1{
          width: 100%;
          height: 50%;
          transition: all 0.5s;
          overflow-y: scroll;
          .info_item{
            margin-top: 12px;
            margin-left: 20px;
            display: flex;
            align-items: center;
            user-select: none;
            .tags{
              margin-right: 10px;
              color: #fff;
              padding: 2px 8px;
              border-radius: 3px;
              font-size: 12px;
              cursor: pointer;
              transform: skewX(-8deg);
            }
            .values{
              color: #cacaca; //#6bc858
            }
          }
        }
        .node_content2{
          width: 100%;
          height: 50%;
          padding: 10px;
          border-bottom: #373b44 1px dashed;
        }
        .node_content3{
          width: 59%;
          height: 100%;
          border-right: #373b44 1px dashed;
        }
        .node_content2 .node_histogram,.node_content3 .node_piechart{
          width: 100%;
          height: 100%;
        }
    }
  }
  
}


</style>
