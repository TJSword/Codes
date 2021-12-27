<template>
  <div class="reportaddchart_wrap">
    <!-- 图表功能按钮 -->
    <div class="chart_btn">
      <i class="btn el-icon-date" @click="yearBox = !yearBox" :style="{'color':yearBox?'#f60':'#606266'}"></i>
      <i class="btn el-icon-edit"></i>
    </div>
    <!-- 年份段选择 -->
    <div class="years_box" v-if="yearBox">
      <el-date-picker
        v-model="start"
        type="year"
        format="yyyy 年"
        value-format="yyyy"
        placeholder="开始年"
        size="mini"
        :clearable="false"
        @change="changeRange">
      </el-date-picker>
      <label>-</label>
      <el-date-picker
        v-model="end"
        type="year"
        format="yyyy 年"
        value-format="yyyy"
        placeholder="结束年"
        size="mini"
        :clearable="false"
        @change="changeRange">
      </el-date-picker>
    </div>
    <!-- 图表容器 -->
    <div :id="chartId" class="chart_wrap"></div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name:'reportaddchart',
  props:{
    dataInfo:{ //图表的数据类型
      type:Object,
      default(){
        return {}
      }
    },
  },
  components:{

  },
  data(){
    return{
      chartId:null,
      yearBox:false, //时间选择器
      start:null, //开始年
      end:null, //结束年
      chartsList: [ //图表数据
        { 
          dataType:'GDPTrend',
          chartStyle: 'ColumnarLine', //柱状图+折线
          legend: ['GDP', '增速'],
          name: '青岛市GDP及增速年度走势',
          cover: 'https://www.echartsjs.com/ecg-storage/ec_gallery_thumbnail/xWemXPZm45.png?v=1599032503022',
          options: {
            title: {
              left: 'center',
              text: ''
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                crossStyle: {
                  color: '#999'
                }
              }
            },
            legend: {
              //data: ['GDP', '增速'],
              left: 'center',
              bottom: '3%'
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '12%',
              containLabel: true
            },
            xAxis: [{
              type: 'category',
              //data: ['2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020'],
              axisPointer: {
                type: 'shadow'
              }
            }],
            yAxis: [{
                type: 'value',
                name: 'GDP(亿)',
                // min: 0,
                // max: 250,
                // interval: 50,
                axisLabel: {
                  formatter: '{value}'
                }
              },
              {
                type: 'value',
                name: '增速(%)',
                min: 0,
                max: 25,
                interval: 5,
                axisLabel: {
                  formatter: '{value}'
                }
              }
            ],
            series: [{
                name: 'GDP',
                type: 'bar',
                //data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8]
              },
              {
                name: '增速',
                type: 'line',
                yAxisIndex: 1,
                //data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5]
              }
            ]
          }
        },
        {
          dataType:'StructuralChange',
          chartStyle: 'StackedColumnar', //堆叠柱状图
          legend: ['第一产业', '第二产业', '第三产业'],
          name: '青岛市产业结构变化趋势',
          cover: 'https://www.echartsjs.com/ecg-storage/ec_gallery_thumbnail/xWemXPZm45.png?v=1599032503022',
          options: {
            title: {
              left: 'center',
              text: ''
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            legend: {
              //data: ['第一产业', '第二产业', '第三产业'],
              left: 'center',
              bottom: '3%'
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '12%',
              containLabel: true
            },
            yAxis: {
              type: 'value'
            },
            xAxis: {
              type: 'category',
              //data: ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018']
            },
            series: []
          }
        },
      ],
      chart:null, //图表的实例化
    }
  },
  mounted(){
    //初始时间段设置
    let date = new Date()
    this.end = JSON.stringify(date.getFullYear())
    this.start = JSON.stringify(date.getFullYear()-10)
    //初始化chartId
    if(this.dataInfo.chartId){
      this.chartId = this.dataInfo.chartId
    }else{
      this.chartId = Number(Math.random().toString().substr(3,length) + Date.now()).toString(36) + '' 
    }
    this.loadChart(this.dataInfo)
    
  },
  watch:{
    
  },
  computed:{
    ...mapGetters([])
  },
  methods:{
    //切换年份
    changeRange(val){
      console.log(val)
      if(this.start>this.end){
        let s = JSON.parse(JSON.stringify(this.start))
        this.start = JSON.parse(JSON.stringify(this.end))
        this.end = this.end<=val?s:val
      }
    },
    loadChart(dataInfo){ //加载图表
      let curChart = this.chartsList.filter(item=>dataInfo.dataType==item.dataType)[0]
      let option
      if(dataInfo.chartOption){ //加载保存的
        option = dataInfo.chartOption
      }else{ //新增图表
        option = curChart.options
        option.title.text = curChart.name
        option.legend.data = curChart.legend
        //模拟图表请求数据
        let queryData 
        if(curChart.dataType=='GDPTrend'){
          //模拟数据
          queryData= [
            { year:'2010',data0:5200,data1:12.8 },
            { year:'2011',data0:6321,data1:11.5 },
            { year:'2012',data0:6866,data1:10.2 },
            { year:'2013',data0:7236,data1:9.3 },
            { year:'2014',data0:8810,data1:9.1 },
            { year:'2015',data0:9930,data1:8.7 },
            { year:'2016',data0:11236,data1:7.9 },
            { year:'2017',data0:13505,data1:7.1 },
            { year:'2018',data0:14009,data1:6.8 }
          ]
          let year = []
          let data0 = []
          let data1 = []
          queryData.forEach(item=>{
            year.push(item.year)
            data0.push(item.data0)
            data1.push(item.data1)
          })
          option.xAxis[0].data = year
          option.series[0].data = data0
          option.series[1].data = data1
        }else if(curChart.dataType=='StructuralChange'){
          queryData= [
            { year:'2010',data0:4.9,data1:48.7,data2:46.6 },
            { year:'2011',data0:4.6,data1:47.6,data2:47.7 },
            { year:'2012',data0:4.4,data1:46.6,data2:49.0 },
            { year:'2013',data0:4.4,data1:45.5,data2:50.1 },
            { year:'2014',data0:4.2,data1:44.7,data2:51.2 },
            { year:'2015',data0:3.9,data1:43.3,data2:52.8 },
            { year:'2016',data0:3.7,data1:41.6,data2:54.7 },
            { year:'2017',data0:3.5,data1:41.2,data2:55.4 },
            { year:'2018',data0:3.2,data1:40.4,data2:56.4 }
          ]
          let year = []
          let seriesArr = []
          curChart.legend.forEach(item=>{
            seriesArr.push({
              name: item,
              type: 'bar',
              stack: '总量',
              label: {
                show: true,
                position: ''
              },
              data: []
            })
          })
          queryData.forEach(item=>{
            year.push(item.year)
            seriesArr.forEach((s,i)=>{
              s.data.push(item['data'+i])
            })
          })
          option.xAxis.data = year
          option.series = seriesArr
        }
      }
      this.$nextTick(()=>{
        this.$("#"+this.chartId).css({
          "width":dataInfo.chartOption?dataInfo.w+'px':'500px',
          "height":dataInfo.chartOption?dataInfo.h+'px':'300px'
        });
        let myChart = this.$echarts.init(document.getElementById(this.chartId))
        myChart.setOption(option);
        myChart.on('click',params=>{
          console.log(params)
        })
        this.chart = myChart
        let flag = dataInfo.chartOption===undefined
        
        this.$emit('putChartOption',{chartOption:flag?option:null,chartId:flag?this.chartId:null,chart:myChart})
        
        this.chartId = null
      })
      //this.$emit("update:dataType",'')
    },
  }
}
</script>
<style lang="scss">
.reportaddchart_wrap{
  width: 100%;
  height: 100%; 
  position: relative;
  .chart_btn{
    position: absolute;
    right: 10px;
    top: 3px;
    z-index: 999;
    display: none;
    .btn{
      font-size: 18px;
      cursor: pointer;
      color: #606266;
      margin-left: 10px;
      &:hover{
          color:#f60;
      }
    }
  }
  .years_box{
    position: absolute;
    right: 10px;
    top: -43px;
    z-index: 999999;
  }
  .chart_wrap{
    width: 100% !important;
    height: 100% !important;
  }
  &:hover .chart_btn{
    display: block;
  }
  .years_box {
    .el-input__inner{
      border: none;
    }
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 90px;
    }
    .el-input--suffix .el-input__inner {
      padding-right: 0;
    }
  }
}
</style>