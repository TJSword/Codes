<template>
  <!-- 市场信息 -->
  <div class="marketInfo">
    <div class="market_A">
        <div class="market_head">
          <!-- 时间选择条 -->
          <div class="time_range">
            <el-slider
              v-if="timeParticle==='year'"
              v-model="timeRange"
              range
              show-stops
              :marks="timeYearMarks"
              :min="minYear"
              :max="maxYear"
              @input="timeYearInput"
              @change="timeValueChange">
            </el-slider>
            <el-slider
              class="month_year"
              v-if="timeParticle==='month'"
              v-model="monthYear"
              :marks="timeMonthMarks"
              :step="1"
              :min="minYear"
              :max="maxYear"
              show-stops
              @input="timeMonthInput"
              @change="timeValueChange">
            </el-slider>
          </div>
          <!-- 时间颗粒度 -->
          <div class="time_type">
            <el-select  class="timeParticle_select" @change="timeParticleChange()" v-model="timeParticle" placeholder="请选择">
                <el-option
                v-for="item in timeParticleArr"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
          </div>
        </div>
        <!-- 柱状图环状图 -->
        <div class="market_chart" 
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
          <div class="chartA_box">
            <div class="data_type">
              <el-select  class="dataType_select" @change="changeDataType" v-model="dataType" placeholder="请选择">
                  <el-option
                    v-for="item in dataTypeArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </div>
            <!-- 柱状图 -->
            <div class="market_chartA" id="market_chartA"></div>
          </div>
          <!-- 环状图 -->
          <div class="chartB_box">
            <div class="market_chartB" id="market_chartB"></div>
          </div>
        </div>
    </div>
    <!-- 项目列表 -->
    <div class="market_B" 
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-table
        class="market_table"
        ref="marketTable"
        height="100%"
        width="100%"
        :data="marketInfoData"
        border
        :header-cell-style="{ background: '#222222', color: '#fff' }"
        :row-class-name="tableRowClassName"
        highlight-current-row
        @row-click="showProject"
      >
        <el-table-column
          label="项目名称"
          width="150"
          header-align="center"
          align="center"  
          prop="name"
        >
        </el-table-column>
        <el-table-column sortable label="合计成交套数(套)" align="center" prop="volume"></el-table-column>
        <el-table-column sortable label="合计成交面积(㎡)" align="center" prop="volumearea"></el-table-column>
        <el-table-column sortable label="合计成交均价(元/㎡)" align="center" prop="volumaveprice"></el-table-column>
        <el-table-column sortable label="合计成交额(万元)" align="center" prop="volumeprice"></el-table-column>
        <el-table-column sortable label="合计供应套数(套)" align="center" prop="supply"></el-table-column>
        <el-table-column sortable label="合计供应面积(㎡)" align="center" prop="supplyarea"></el-table-column>
        <el-table-column sortable label="在售存量套数(套)" align="center" prop="stock"></el-table-column>
        <el-table-column sortable label="在售存量面积(㎡)" align="center" prop="stockarea"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
//Api
import dataQueryApi from "@/api/dataqueryApi"
//插件
import { mapGetters } from "vuex"
//组件
import QuarterSelecter from "@/components/tools/quarterSelecter"
export default {
  name:'marketInfo',
  props:{},
  components:{
    QuarterSelecter
  },
  data(){
    return{
      marketMenuArr:[],//市场菜单数据
      timeRange:[],//年份范围
      minYear:null,
      maxYear:null,
      timeYearMarks:{
        2010:'2010'
      },//年份范围标注
      monthYear:null,//月份年
      timeMonthMarks:{
        2010:'2010'
      },//月份范围标注
      timeParticle:'year',//时间颗粒度
      timeParticleArr:[ //时间颗粒度数组
        {label:'年度',value:'year'},
        {label:'月度',value:'month'},
        //{label:'季度',value:'season'}
        
      ],
      dataType:'volumeprice',//当前数据类型
      typeName:'合计成交额(万元)',
      dataTypeArr:[ //市场数据类型
        {label:'合计成交套数(套)',value:'volume'},
        {label:'合计成交面积(㎡)',value:'volumearea'},
        {label:'合计成交均价(元/㎡)',value:'volumaveprice'},
        {label:'合计成交额(万元)',value:'volumeprice'},
        {label:'合计供应套数(套)',value:'supply'},
        {label:'合计供应面积(㎡)',value:'supplyarea'},
        {label:'在售存量套数(套)',value:'stock'},
        {label:'在售存量面积(㎡)',value:'stockarea'},
      ],
      marketInfoData:[ // 项目数据
        //{ name:'天一锦城',volume:562,volumearea:11200,volumaveprice:12030,volumeprice:12900 }
      ],
      chartData:[],//左侧图表数据
      areaData:[], //右侧图表数据
      curProjectID:null,//选中的项目ID
      loading:false, //loading
    }
  },
  mounted(){
    //设置市场菜单数据
    this.userMenu.children.forEach(item=>{
      if(item.name==="数据查询"){
        item.children.forEach(child=>{
          if(child.name==="市场"){
            this.marketMenuArr = child.children
          }
        })
      }
    })
    console.log('市场菜单',this.marketMenuArr)
    //设置初始时间范围
    let date = new Date()
    let year = date.getFullYear()
    this.timeRange = [year-9,year-1]
    this.minYear = year-10
    this.maxYear = year
    this.monthYear = year-1
  },
  watch:{
    plateArr:{
      handler(){
        this.marketInfoQuery()
      },
      deep:true
    },
    classification:{
      handler(){
        this.marketInfoQuery()
      },
      deep:true
    }
  },
  computed:{
    ...mapGetters(["plateType","userMenu","classification","plateArr","mapbox_map","plateData"])
  },
  methods:{
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
    timeMonthInput(val){ //月份年切换
      this.timeMonthMarks={
        2010:'2010'
      }
      for(let i = this.minYear;i<=this.maxYear;i++){
        if(i===val){
          this.timeMonthMarks[i]={
            style: {
              color: '#1989FA'
            },
            label: this.$createElement('strong', i+' ')
          }
        }else{
          this.timeMonthMarks[i]=i+' '
        }
      }
    },
    timeValueChange(){ //年份范围切换请求数据
      this.marketInfoQuery()
    },
    timeParticleChange(){ //时间颗粒度类型切换
      this.marketInfoQuery()
    },
    changeDataType(){ //切换市场数据类型
      this.typeName = this.dataTypeArr.filter(item=>this.dataType===item.value)[0].label
      this.setChartA(this.chartData)
      this.setChartB(this.areaData)
      
    },
    marketInfoQuery(){ //市场信息查询条件设置
      if(this.plateArr.length>0){
        let regionno = ''
        this.plateArr.forEach(item=>{
          regionno += (item+',')
        })
        let rimerange = ''
        if(this.timeParticle==="month"){
          rimerange = this.monthYear+'01,'+this.monthYear+'12'
        }else if(this.timeParticle==="year"){
          rimerange = this.timeRange[0]+','+this.timeRange[1]
        }
        
        //交易状态
        let saleStates = ''
        this.marketMenuArr[0].children.forEach(item=>{
          if(this.classification.indexOf(item.id)!==-1){
            saleStates += (item.url+',')
          }
        })
        //物业类型
        let propertyType = ''
        this.marketMenuArr[1].children.forEach(item=>{
          if(this.classification.indexOf(item.id)!==-1){
            propertyType += item.url
          }
        })
        //建筑形态
        let buildForms = ''
        this.marketMenuArr[2].children.forEach(item=>{
          if(this.classification.indexOf(item.id)!==-1){
            buildForms += (item.url+',')
          }
        })
        //面积段
        let areaSizes = ''
        this.marketMenuArr[3].children.forEach(item=>{
          if(this.classification.indexOf(item.id)!==-1){
            areaSizes += (item.url+',')
          }
        })
        let obj = {
          type:this.plateType, //板块类型
          regionno:regionno,//选择的板块
          saleStates:saleStates,//交易状态
          propertyType:propertyType, //物业类型
          buildForms:buildForms,//建筑形态
          areaSizes:areaSizes,//面积
          kind:this.timeParticle, //时间单位
          months:rimerange //时间范围
        }
        this.getMarketData(obj)
      }else{
        //this.$message('请选择'+(this.plateArr.length==0?'板块':'时间范围'))
        this.setChartA([])
        this.setChartB([])
        this.marketInfoData = []
        var map = this.mapbox_map
        map.setLayoutProperty('sc_buildings', 'visibility', 'none')
        map.setLayoutProperty('sc_buildings_symbol', 'visibility', 'none')
      }
    },
    getMarketData(obj){ //市场信息请求
      this.loading = true
      dataQueryApi.getMarketInfo(obj)
      .then(res=>{
        if(res.data.code===0){
          let data = JSON.parse(JSON.stringify(res.data.data))
          console.log('市场-项目数据',res)
          //设置表格数据
          let stockbuildmarkets = data.stockbuildmarkets
          let table_data = data.buildmarkets
          table_data.forEach(item=>{
            let curStock_build = stockbuildmarkets.filter(stock=>stock.id===item.id)
            if(curStock_build.length>0){
              item.stock = parseInt(curStock_build[0].stock) //在售存量套数
              item.stockarea = parseInt(curStock_build[0].stockarea) //在售存量面积
            }else{
              item.stock = 0
              item.stockarea = 0
            }

            item.volume = parseInt(item.volume)
            item.volumearea = parseInt(item.volumearea)
            item.volumeprice = parseInt(item.volumeprice)
            item.supply = parseInt(item.supply) //合计供应套数
            item.supplyarea = parseInt(item.supplyarea) //合计供应面积
            if(item.volumearea==0){
              item.volumaveprice = 0
            }else{
              item.volumaveprice = parseInt(item.volumeprice/item.volumearea*10000)
            }
          })
          this.marketInfoData = table_data

          //设置图表数据
          let stockMarketData = data.stockmarkets
          let charts_data = data.timemarkets
          charts_data.forEach(item=>{
            let curStock_market = stockMarketData.filter(stock=>stock.datasize===item.datasize)
            if(curStock_market.length>0){
              item.stock = parseInt(curStock_market[0].stock) //在售存量套数
              item.stockarea = parseInt(curStock_market[0].stockarea) //在售存量面积
            }else{
              item.stock = 0
              item.stockarea = 0
            }

            item.volume = parseInt(item.volume)
            item.volumearea = parseInt(item.volumearea)
            item.volumeprice = parseInt(item.volumeprice)
            item.supply = parseInt(item.supply) //合计供应套数
            item.supplyarea = parseInt(item.supplyarea) //合计供应面积
            if(item.volumearea==0){
              item.volumaveprice = 0
            }else{
              item.volumaveprice = parseInt(item.volumeprice/item.volumearea*10000)
            }
          })
          if(charts_data.length===0){
            this.$message('未查询到符合条件的项目')
          }
          //设置左侧图表
          this.chartData = charts_data
          this.setChartA(charts_data)
          //设置右侧侧图表
          let areamarkets = data.areamarkets
          let stockAreaData = data.stockareamarkets
          areamarkets.forEach(item=>{
            let curStock_area = stockAreaData.filter(stock=>stock.areasize===item.areasize)
            if(curStock_area.length>0){
              item.stock = parseInt(curStock_area[0].stock) //在售存量套数
              item.stockarea = parseInt(curStock_area[0].stockarea) //在售存量面积
            }else{
              item.stock = 0
              item.stockarea = 0
            }

            item.volume = parseInt(item.volume)
            item.volumearea = parseInt(item.volumearea)
            item.volumeprice = parseInt(item.volumeprice)
            item.supply = parseInt(item.supply) //合计供应套数
            item.supplyarea = parseInt(item.supplyarea) //合计供应面积
            if(item.volumearea==0){
              item.volumaveprice = 0
            }else{
              item.volumaveprice = parseInt(item.volumeprice/item.volumearea*10000)
            }
          })
          this.areaData = areamarkets
          this.setChartB(areamarkets)

          this.loading = false
          //地图筛选项目
          let marketIDs = []
          table_data.forEach(item=>{marketIDs.push(item.id)})
          var map = this.mapbox_map
          var filters = ['all',
            ['in', this.plateType==='region'?'regionno':'partno'].concat(this.plateArr),
            ['in','id'].concat(marketIDs)
          ]
          map.setLayoutProperty('sc_buildings', 'visibility', 'visible')
          map.setLayoutProperty('sc_buildings_symbol', 'visibility', 'visible')
          map.setFilter('sc_buildings', filters);
          map.setFilter('sc_buildings_symbol', filters);
        }else{
          this.$message({
            type:"danger",
            message:'数据加载出错'
          })
          this.loading = false
        }
      })
    },
    setChartA(data){ //设置柱状图
      const that = this;
      let xData = []
      let yData = []
      data.forEach(item=>{
        let name = ''
        if(this.timeParticle==="season"){
          name = item.datasize.substring(0,4)+'年'+item.datasize.substring(5,6)+'季度'
        }else{
          name = item.datasize
        }
        xData.push(name)
        yData.push(item[this.dataType])
      })
      let myChart = that.$echarts.init(document.getElementById("market_chartA"));
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}： <br/> {c}'
        },
        grid: {
          top: "17%",
          left: "4%",
          right: "4%",
          bottom: "4%",
          containLabel: true
        },
        toolbox: {
          show: true,
          //orient: 'vertical',
          right: '1%',
          top: '1%',
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
              color: "#999",
              textStyle: {
                fontSize: 12
              }
            },
            axisLine: {
              lineStyle: {
                color: "rgba(107,107,107,0.37)"
              }
            },
            axisTick: {
              show: false
            },
            data: xData
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              formatter: "{value}",
              color: "#999",
              textStyle: {
                fontSize: 12
              }
            },
            axisLine: {
              lineStyle: {
                color: "rgba(107,107,107,0.37)"
              }
            },
            axisTick: {
              show: false
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
            barWidth: "20px",
            itemStyle: {
              normal: {
                color: new that.$echarts.graphic.LinearGradient(
                  0,0,0,1,
                  [
                    {
                      offset: 0,
                      color: "#FF9A22" // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#FFD56E" // 100% 处的颜色
                    }
                  ],
                  false
                ),
                barBorderRadius: [2, 2, 0, 0]
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
            data: yData
          }
        ]
      };
      // 清除画布
      myChart.clear();
      myChart.setOption(option);
      window.addEventListener("resize", myChart.resize);
    },
    setChartB(data){ //设置饼图
      const that = this;
      let c_data = []
      data.forEach(item=>{
        c_data.push({
          name:item.areasize+'㎡',
          value:item[this.dataType]
        })
      })
      
      let myChart = that.$echarts.init(document.getElementById("market_chartB"));
      let option = {
        title:{
          text:this.typeName,
          textStyle:{
            color:'#fff',
            fontSize:12,
            fontWeight:'normal',
          },
          left: 'center',
          top:20
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} <br/> {c} ({d}%)'
        },
        series: [
          {
            type: 'pie',
            radius: ['30%', '50%'],
            emphasis: {
              label: {
                show: true,
                fontSize: '12',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: true
            },
            data: c_data
          }
        ]
      };
      // 清除画布
      myChart.clear();
      myChart.setOption(option);
      window.addEventListener("resize", myChart.resize);
    },
    showProject(row){ //选中项目并飞行到项目位置
      if (this.curProjectID != row.id) {
        this.curProjectID = row.id;
        this.flyPlateCenter([row.lng,row.lat])
      } else {
        this.curProjectID = null;
        this.$refs.marketTable.setCurrentRow();
        this.flyPlateCenter()
      }
    },
    flyPlateCenter(center){ //飞行到目标位置
      var map = this.mapbox_map
      let cityCenter = this.plateData.curCityInfo.center //城市中心点
      map.flyTo({
        center: center?center:cityCenter,
        zoom: center?14:8,
        speed: 1.5,
        curve: 1
      })
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "row2";
      } else if (rowIndex % 2 === 1) {
        return "row1";
      }
      return "";
    },
  }
}
</script>
<style lang="scss">
.marketInfo{
  width: 100%;
  height: 100%;
  border-right: #383838 1px solid;
  background: #040506;
  .market_A{
    height: 50%;
    width: 100%;
    .timeParticle_select input,.dataType_select input{
      background: none;
      color: #ffffff;
      font-size: 12px;
      border: none;
      user-select: none;
      width: 70px;
      padding-left: 0px;
    }
    .dataType_select input{
      width: 150px;
    }
    .market_title{
      font-size: 12px;
      color: #e6a23c;
    }
    .yearBox{
      display: flex;
      align-items: center;
      .year {
        width: 83px !important;
        float: left;
        .el-input__inner{
          background: none;
          border-radius: 0;
          border: none;
          border-bottom: #383838 1px solid;
          padding-right: 0;
          color: #fff;
        }
      }
      .year_span{
        font-size: 12px;
        margin: 0 10px;
        color: #e6a23c;
      }
    }
    .seasonBox{
      display: flex;
      align-items: center;
      .season_span{
        font-size: 12px;
        margin: 0 10px;
        color: #e6a23c;
      }
    }
    .market_head{
      height: 14%;
      background: #222222;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
      border-bottom: 1px solid #383838;
      display: flex;
      align-items:center;
      .time_type{
        width: 7%;
      }
      .time_range{
        width:86%;
        margin-top: -18px;
        margin-left: 20px;
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
      .left{
        display: flex;
        align-items: center;
        .headB{
          display: flex;
          align-items: center;
          margin-left: 30px;
          .el-range-editor.el-input__inner{
            background: none;
            border: none;
            width: 224px;
            height: 30px;
          }
          .el-date-editor .el-range-input{
            background: none;
            border-bottom: #4f565d 1px solid;
            cursor: pointer;
            color: #fff;
          }
          .el-date-editor .el-range-separator{
            color: #e6a23c;
          }
        }
      }
      .market_query{
        z-index: 1;
        position: relative;
        font-size: inherit;
        font-family: inherit;
        color: white;
        padding: 0.3em 1.2em;
        outline: none;
        border: none;
        font-size: 12px;
        background-color: #1c7be1;
        cursor:pointer;
      }
    }
    .market_chart{
      display: flex;
      width: 100%;
      height: 86%;
      .chartA_box{
        width: 70%;
        height: 100%;
        position: relative;
        border-right: #383838 1px dashed;
        .data_type{
          position: absolute;
          left: 10px;
          z-index: 99;
        }
        .market_chartA{
          width: 100%;
          height: 100%;
        }
      }
      .chartB_box{
        width: 30%;
        height: 100%;
        .market_chartB{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .market_B{
    width: 100%;
    height: 50%;
  }
  .el-table {
      background-color: #040506;
  }
  .el-table .cell{
    position:relative;
  }
  .el-table .caret-wrapper{
    position: absolute;
    top: -5px;
    right: -3px;
  }
  .el-table td,
  .el-table th.is-leaf,
  .el-table--border,
  .el-table--group {
    border-color: #444444;
  }
  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background-color: #444444;
  }
  .el-table .row1 {
    background: #000000;
  }

  .el-table .row2 {
    background: #101010;
  }
  .el-table td{
    padding: 4px 0;
  }
  .el-table th {
    padding: 6px 0;
    font-size: 12px;
    font-weight: normal;
  }
  .el-table__body-wrapper {
    background: #040506;
  }
}
</style>