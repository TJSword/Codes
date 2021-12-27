<template>
  <div class="reportaddchart_wrap">
    <!-- 图表功能按钮 -->
    <div class="chart_btn">
      <i class="btn el-icon-date" @click="yearBox = !yearBox" :style="{'color':yearBox?'#f60':'#606266'}"></i>
      <i class="btn el-icon-edit"></i>
    </div>
    <!-- 年份段选择 -->
    <div class="years_box" v-if="yearBox">
      <div class="year_range" v-if="timeType=='yearRange'">
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
      <div class="single_year" v-if="timeType=='singleYear'">
        <el-date-picker
          v-model="curYear"
          type="year"
          format="yyyy 年"
          value-format="yyyy"
          placeholder="选择年份"
          size="mini"
          :clearable="false"
          @change="singleYearChange">
        </el-date-picker>
      </div>
    </div>
    <!-- 用地类型 -->
    <div class="landuse_box" v-if="showUseLand">
      <el-tree
        :data="useLandData"
        :props="proProps"
        :default-expand-all="true"
        :default-checked-keys="useLandChecked"
        :expand-on-click-node="false"
        node-key="value"
        show-checkbox
        @check="checkLanduse">
      </el-tree>
    </div>
    <!-- 物业类型 -->
    <div class="property_box" v-if="showProperty">
      <el-tree
        :data="propertyArr"
        :props="proProps"
        :default-expand-all="true"
        :default-checked-keys="propertyChecked"
        :expand-on-click-node="false"
        node-key="value"
        show-checkbox
        @check="checkProperty">
      </el-tree>
    </div>
    <!-- 物业类型住宅、别墅 -->
    <div class="pro_switch" v-if="showProSwicth">
      <el-switch
        v-model="isHouse"
        active-text="住宅"
        inactive-text="别墅"
        @change="proSwitchChange">
      </el-switch>
    </div>
    <!-- 图表容器 -->
    <div :id="chartId" class="chart_wrap"></div>
  </div>
</template>
<script>
import LandReportApi from '@/api/LandReportApi_zlq'
import { mapGetters } from 'vuex'
export default {
  name:'reportaddchart',
  props:{
    reportId:{ //报告ID
      type:String,
      default:''
    },
    dataInfo:{ //图表的数据类型
      type:Object,
      default(){
        return {}
      }
    },
  },
  components:{

  },
  computed:{
    
  },
  data(){
    return{
      chartId:null,
      yearBox:false, //时间选择器
      start:null, //开始年
      end:null, //结束年
      curYear:null,//单年份
      searchRange:'city',//数据查询地理范围
      areaCode:null,//区域代码
      chartsList: [ //图表数据
        { 
          chartType: 'ColumnarLine', //柱状图+折线
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
              data: [],
              left: 'center',
              bottom: '3%'
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '12%',
              containLabel: true
            },
            dataZoom: [
              {
                type: 'inside'
              }
            ],
            xAxis: {
              type: 'category',
              data: [],
              axisPointer: {
                type: 'shadow'
              }
            },
            yAxis: [
              {
                type: 'value',
                name: '',
                axisLabel: {
                  formatter: '{value}'
                }
              },{
                type: 'value',
                name: '',
                axisLabel: {
                  formatter: '{value}'
                }
              }
            ],
            series: [
              {
                name: '',
                type: 'bar',
                data: []
              },{
                name: '',
                type: 'line',
                yAxisIndex: 1,
                data: []
              }
            ]
          }
        },
        { 
          chartType: 'DbColumnarLine', //双柱状图+折线
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
              data: [],
              left: 'center',
              bottom: '3%'
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '12%',
              containLabel: true
            },
            dataZoom: [
              {
                type: 'inside'
              }
            ],
            xAxis: {
              type: 'category',
              data: [],
              axisPointer: {
                type: 'shadow'
              }
            },
            yAxis: [
              {
                type: 'value',
                name: '',
                axisLabel: {
                  formatter: '{value}'
                }
              },{
                type: 'value',
                name: '',
                axisLabel: {
                  formatter: '{value}'
                }
              }
            ],
            series: [
              {
                name: '',
                type: 'bar',
                data: []
              },{
                name: '',
                type: 'bar',
                data: []
              },{
                name: '',
                type: 'line',
                yAxisIndex: 1,
                data: []
              }
            ]
          }
        },
        {
          chartType: 'StackedColumn', //堆叠图(普通)
          options: {
            title: {
              left: 'center',
              text: ''
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {
              data: [],
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
              type: 'value',
              name:''
            },
            dataZoom: [
              {
                type: 'inside'
              }
            ],
            xAxis: {
              type: 'category',
              data: []
            },
            series: []
          }
        },
        {
          chartType: 'StackedColumnA', //堆叠图(横向)
          options:{
            tooltip: {
              trigger: 'axis',
              axisPointer: { 
                type: 'shadow'
              }
            },
            legend: {
              left: 'center',
              bottom: '3%',
              data: []
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '14%',
              top:'3%',
              containLabel: true
            },
            xAxis: {
              type: 'value'
            },
            yAxis: {
              type: 'category',
              data: []
            },
            series: [
              // {
              //   name: 'Direct',
              //   type: 'bar',
              //   stack: 'total',
              //   label: {
              //     show: true
              //   },
              //   emphasis: {
              //     focus: 'series'
              //   },
              //   data: [320, 302, 301, 334, 390, 330, 320]
              // }  
            ]
          }
        },
        {
          chartType:'Columnar', //单柱状图
          options:{
            title: {
              left: 'center',
              text: ''
            },
            xAxis: {
              type: 'category',
              data: []
            },
            yAxis: {
              type: 'value',
              name:''
            },
            series: [{
              data: [],
              type: 'bar',
              showBackground: true,
              backgroundStyle: {
                color: 'rgba(220, 220, 220, 0.8)'
              }
            }]
          }
        },
        {
          chartType:'MixedChart1',//混合图表
          options:{
            title: [{
              left: '25%',
              top: '4%',
              textAlign: 'center',
              text: '城市土地成交走势'
            },{
              left: '28%',
              top: '58%',
              textAlign: 'center',
              text: '成交土地宗数占比'
            },{
              left: '68%',
              top: '58%',
              textAlign: 'center',
              text: '供应土地宗数占比'
            }],
            grid: [
              {left: '7%', right: '7%',top:'12%', height: '32%'},//折线图位置控制
            ],
            tooltip: {},
            legend: [{
              top:'50%',
              left: "35%",
              data: ['供应建面','成交建面','楼面地价']
            },{
              show:false,
              orient: 'vertical',
              top:'75%',
              left: "45%",
              data: ['住宅','商住']
            }],
            xAxis: [{
              type: 'category',
              data: [],
              axisPointer: {
                type: 'shadow'
              }
            }],
            yAxis: [{
                type: 'value',
                name: '面积(万㎡)',
                axisLabel: {
                  formatter: '{value}'
                }
              },
              {
                type: 'value',
                name: '价格(元/㎡)',
                axisLabel: {
                  formatter: '{value}'
                }
              }
            ],
            series: [{
                name: '供应建面',
                type: 'bar',
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: []
              },
              {
                name: '成交建面',
                type: 'bar',
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: []
              },
              {
                name: '楼面地价',
                type: 'line',
                xAxisIndex: 0,
                yAxisIndex: 1,
                data: []
              },
              { 
                type: 'pie',
                radius: '30%',
                center: ['28%', '80%'],
                data: []
              }
            ]
          }
        },

      ],
      chart:null, //图表的实例化
      cityInfos:{},//城市数据
      showUseLand:false,//用地类型选择
      useLandData:[],//物业类型数组
      useLandChecked:[],//默认选择
      proProps:{
        children: 'children',
        label: 'label'
      },
      showProperty:false,//物业类型
      propertyArr:[],//物业类型数组
      propertyChecked:[],//默认物业类型
      showProSwicth:false,//物业类型住宅、别墅switch切换
      isHouse:true,//物业类型（住宅、别墅）
    }
  },
  beforeMount(){
    //获取用地类型
    this.setLandUse()
    //获取物业类型
    this.setProperty()
    //获取台账信息
    this.getLedgerInfo()
  },
  mounted(){
    //设置城市数据
    this.cityInfos = JSON.parse(sessionStorage.getItem('plate_data'))
    //初始时间段设置
    let date = new Date()
    this.curYear = JSON.stringify(date.getFullYear()-2)
    this.end = JSON.stringify(date.getFullYear())
    this.start = JSON.stringify(date.getFullYear()-10)
    //初始化chartId
    if(this.dataInfo.chartId){
      this.chartId = this.dataInfo.chartId
    }else{
      this.chartId = Number(Math.random().toString().substr(3,length) + Date.now()).toString(36) + '' 
    }
    //时间选择器类型
    this.timeType = this.dataInfo.chartInfo.timeType
    //数据查询地理范围
    this.searchRange = this.dataInfo.chartInfo.searchRange
    //用地类型选择
    this.showUseLand = this.dataInfo.chartInfo.showUseLand
    //物业类型选择
    this.showProperty = this.dataInfo.chartInfo.showProperty
    //物业类型switch
    this.showProSwicth = this.dataInfo.chartInfo.showProSwicth

    //加载图表数据
    setTimeout(_=>{
      this.loadChart(this.dataInfo)
    },500)
    
  },
  watch:{
    
  },
  computed:{
    ...mapGetters(['cityCode'])
  },
  methods:{
    //获取用地类型
    setLandUse(){
      var that = this
      LandReportApi.getTypeDict('land_use')
      .then(res=>{
        console.log('用地类型',res)
        if(res.data.code===0){
          that.useLandChecked = ['house']
          that.useLandData = [{
            value:'all',
            label:'全部',
            children:res.data.data
          }]
        }
      })
    },
    //用地类型切换
    async checkLanduse(checkedNodes,checkedKeys){
      this.useLandChecked = checkedKeys.checkedKeys
      let option = await this.setDataOption(this.dataInfo.chartInfo)
      this.chart.setOption(option)
    },
    //获取物业类型
    setProperty(){
      var that = this
      LandReportApi.getTypeDict('property_type')
      .then(res=>{
        console.log('物业类型',res)
        if(res.data.code===0){
          that.propertyChecked = ['house']
          that.propertyArr = [{
            value:'all',
            label:'全部',
            children:res.data.data
          }]
        }
      })
    },
    
    //物业类型切换
    async checkProperty(checkedNodes,checkedKeys){
      this.propertyChecked = checkedKeys.checkedKeys
      let option = await this.setDataOption(this.dataInfo.chartInfo)
      this.chart.setOption(option)
    },
    //物业类型switch
    async proSwitchChange(val){
      if(val){
        this.propertyChecked = ['house']
      }else{
        this.propertyChecked = ['praetorium']
      }
      let option = await this.setDataOption(this.dataInfo.chartInfo)
      this.chart.setOption(option)
    },
    //根据报告ID获取台账信息,根据图表传入的数据查询范围配置areaCode
    getLedgerInfo(){
      var that = this
      LandReportApi.getLedgerInfoByReportId(that.reportId)
      .then(res=>{
        if(res.data.code===0){
          console.log('报告台账信息',res.data.data)
          let plateCode = res.data.data.account.partno
          if(that.searchRange=='city'){
            that.areaCode = that.cityInfos.curCityInfo.regionno
          }else if(that.searchRange=='region'){
            that.areaCode = plateCode.substr(0,6)
          }else if(that.searchRange=='plate'){
            that.areaCode = plateCode
          }else if(that.searchRange=='nultiRegion'){
            let str = ''
            that.cityInfos.region.forEach(item=>{
              str += (item.regionno+',')
            })
            that.areaCode = str
          }else if(that.searchRange=='multiPlate'){
            
            let curRegionno = plateCode.substr(0,6)
            let curRegion = that.cityInfos.part.filter(item=>item.regionno==curRegionno)
            if(curRegion){
              let str = ''
              curRegion[0].children.forEach(item=>{
                str += (item.regionno+',')
              })
              that.areaCode = str
            }
            
          }
          
        }
      })
    },
    //时间选择器切换-年范围
    async changeRange(val){
      console.log(val)
      if(this.start>this.end){
        let s = JSON.parse(JSON.stringify(this.start))
        this.start = JSON.parse(JSON.stringify(this.end))
        this.end = this.end<=val?s:val
      }
      let option = await this.setDataOption(this.dataInfo.chartInfo)
      this.chart.setOption(option)
    },
    //时间选择器切换-单年
    async singleYearChange(val){
      let option = await this.setDataOption(this.dataInfo.chartInfo)
      this.chart.setOption(option)
    },
    async loadChart(dataInfo){ //加载图表
      
      let option
      if(dataInfo.chartOption){ //加载保存的
        option = dataInfo.chartOption
      }else{ //新增图表
        option = await this.setDataOption(dataInfo.chartInfo)
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
    //根据图表类型处理数据生成返回option
    setDataOption(chartInfo){
      var that = this
      let curChart = this.chartsList.filter(item=>chartInfo.chartType==item.chartType)[0]
      if(curChart==undefined){
        this.$message('添加图表出错')
        return false
      }
      let option = curChart.options
      let legend,yAxisName,xAxisName,apiUrl
      if(curChart.chartType!=='MixedChart1'){
        legend = chartInfo.legend
        yAxisName = chartInfo.yAxisName
        xAxisName = chartInfo.xAxisName
        apiUrl = chartInfo.apiUrl
        if(option.title){
          option.title.text = chartInfo.name
        }
        if(option.legend){
          option.legend.data = legend
        }
      }
      if(chartInfo.chartType==='ColumnarLine'){
        option.yAxis[0].name = yAxisName[0]
        option.yAxis[1].name = yAxisName[1]
        option.series[0].name = legend[0]
        option.series[1].name = legend[1]
        //数据请求
        let propertyStr = ''
        that.propertyChecked.forEach(item=>{
          propertyStr += (item+',')
        })
        let obj = {
          table:chartInfo.reqinfo.tableName,
          code:chartInfo.reqinfo.code,
          regionno:that.areaCode,
          type:propertyStr,//物业类型
          minTime:JSON.parse(that.start),
          maxTime:JSON.parse(that.end)
        }
        return LandReportApi.columnarLineChart(obj,apiUrl)
        .then(res=>{
          if(res.data.code===0){
            let data = res.data.data
            console.log('图表数据',data)
            option.xAxis.data = []
            option.series[0].data = []
            option.series[1].data = []
            data.forEach(item=>{
              option.xAxis.data.push(item.date?item.date:item.name)
              option.series[0].data.push(item.data1)
              if(legend[1]=='增速'){
                option.series[1].data.push(item.data2!=null?(item.data2*100).toFixed(2):null)
              }else{
                option.series[1].data.push(item.data2)
              }
              
              
              
            })
            console.log(option)
            return option
          }
        })
      }if(chartInfo.chartType==='DbColumnarLine'){
        option.yAxis[0].name = yAxisName[0]
        option.yAxis[1].name = yAxisName[1]
        option.series[0].name = legend[0]
        option.series[1].name = legend[1]
        option.series[2].name = legend[2]
        //数据请求
        let propertyStr = ''
        that.propertyChecked.forEach(item=>{
          propertyStr += (item+',')
        })
        let obj = {
          minTime:JSON.parse(that.start),
          maxTime:JSON.parse(that.end),
          type:propertyStr,//物业类型
          dataType:chartInfo.reqinfo.dataType,
          regionno:that.areaCode
        }
        return LandReportApi.columnarLineChart(obj,apiUrl)
        .then(res=>{
          if(res.data.code===0){
            let data = res.data.data
            console.log('图表数据',data)
            option.xAxis.data = []
            option.series[0].data = []
            option.series[1].data = []
            option.series[2].data = []
            data.forEach(item=>{
              option.xAxis.data.push(item.date?item.date:item.name)
              option.series[0].data.push(item.data1.toFixed(0))
              option.series[1].data.push(item.data2.toFixed(0))
              option.series[2].data.push(item.data3.toFixed(0))
            })
            console.log(option)
            return option
          }
        })
      }else if(chartInfo.chartType==='StackedColumn'){
        option.yAxis.name = yAxisName[0]
        //数据请求
        let propertyStr = ''
        that.propertyChecked.forEach(item=>{
          propertyStr += (item+',')
        })
        let obj = {
          regionno:that.areaCode,
          type:propertyStr,//物业类型
          dataType:chartInfo.reqinfo.dataType,
          minTime:JSON.parse(that.start),
          maxTime:JSON.parse(that.end)
        }
        return LandReportApi.commonChart(obj,apiUrl)
        .then(res=>{
          if(res.data.code===0){
            let data = res.data.data
            console.log('图表数据',data)
            option.series = []
            legend.forEach(item=>{
              option.series.push({
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
            option.xAxis.data = []
            data.forEach(item=>{
              option.xAxis.data.push(item.due_time)
              option.series[0].data.push(parseInt(item.one*100))
              option.series[1].data.push(parseInt(item.two*100))
              option.series[2].data.push(parseInt(item.three*100))
            })
            console.log(option)
            return option
          }
        })
      }else if(chartInfo.chartType==='StackedColumnA'){
        option.xAxis.name = xAxisName[0]
        //数据请求
        let propertyStr = ''
        that.propertyChecked.forEach(item=>{
          propertyStr += (item+',')
        })
        let obj = {
          regionno:that.areaCode,
          type:propertyStr,//物业类型
          dataType:chartInfo.reqinfo.dataType,
          minTime:JSON.parse(that.start),
          maxTime:JSON.parse(that.end)
        }
        return LandReportApi.commonChart(obj,apiUrl)
        .then(res=>{
          if(res.data.code===0){
            let data = res.data.data
            console.log('图表数据',data)
            let ledgendData = []
            data.area_size.forEach(area=>{
              ledgendData.push(area.dictValue)
            })
            option.series = []
            option.legend.data = ledgendData
            option.yAxis.data = []
            ledgendData.forEach(key=>{
              let seriesObj = {
                name: key,
                type: 'bar',
                stack: 'total',
                label: {
                  show: true
                },
                emphasis: {
                  focus: 'series'
                },
                data: []
              }
              data.data.forEach(item=>{
                if(item.area_size==key){
                  seriesObj.data.push(item.num)
                }
              })
              option.series.push(seriesObj)
            })
            for(let i=obj.minTime;i<obj.maxTime+1;i++){
              option.yAxis.data.push(i)
            }
            console.log(option)
            return option
          }
        })
      }else if(chartInfo.chartType==='Columnar'){
        option.yAxis.name = yAxisName[0]
        //数据请求
        let obj = {
          dueTime:JSON.parse(that.curYear),
          regionno:that.areaCode
        }
        option.xAxis.data = []
        option.series[0].data = []
        return LandReportApi.commonChart(obj,apiUrl)
        .then(res=>{
          if(res.data.code===0){
            let data = res.data.data
            console.log('图表数据',data)
            data.forEach(item=>{
              option.xAxis.data.push(item.region)
              option.series[0].data.push(item.data)
            })
            return option
          }
        })
      }else if(chartInfo.chartType==='MixedChart1'){
        //数据请求
        let landUseStr = ''
        that.useLandChecked.forEach(item=>{
          landUseStr += (item+',')
        })
        let obj = {
          minTime:JSON.parse(that.start),
          maxTime:JSON.parse(that.end),
          dataType:chartInfo.reqinfo.dataType,
          regionno:that.areaCode,
          landUse:landUseStr
        }
        //柱状图+折线
        return LandReportApi.commonChart(obj,'/dms/td/parcel/chart')
        .then(res=>{
          if(res.data.code===0){
            let data = res.data.data
            console.log('图表数据',data)
            option.xAxis[0].data = []
            option.series[0].data = []
            option.series[1].data = []
            option.series[2].data = []
            data.bar.forEach(item=>{
              option.xAxis[0].data.push(item.date)
              option.series[0].data.push(item.data1.toFixed(0))
              option.series[1].data.push(item.data2.toFixed(0))
              option.series[2].data.push(item.data3.toFixed(0))
            })
            data.pie.forEach(item=>{
              item.value = item.total
            })
            option.series[3].data = data.pie
            return option
          }
        })
      }
      
      
    },
  }
}
</script>
<style lang="scss">
.reportaddchart_wrap{
  width: 100%;
  height: 100%; 
  position: relative;
  .el-tree-node{
    display: flex;
  }
  .el-tree-node.is-expanded>.el-tree-node__children{
    display: flex;
  }
  .el-tree-node__expand-icon.is-leaf{
    display: none;
  }
  .el-tree-node__content{
    padding-left: 10px !important;
  }
  .el-tree-node__content>.el-tree-node__expand-icon{
    display: none;
  }
  .el-switch__core:after{
    background-color: #409eff;
  }
  .el-switch.is-checked .el-switch__core {
    border-color: #DCDFE6;
    background-color: #DCDFE6;
  }
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
  .landuse_box{
    position: absolute;
    right: 68px;
    top: -12px;
    z-index: 99;
  }
  .property_box{
    position: absolute;
    right: 180px;
    top: -32px;
    z-index: 99;
  }
  .pro_switch{
    position: absolute;
    right: 30px;
    top: -32px;
    z-index: 99;
  }
  .years_box{
    position: absolute;
    right: 10px;
    top: -43px;
    z-index: 99;
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