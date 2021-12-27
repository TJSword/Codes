<template>
  <!-- 土地信息 -->
  <div class="landInfo">
    <div class="land_head" v-if="isListedLand">
      <!-- 时间条 -->
      <div class="time_bar">
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
      <div class="time_particle">
        <el-select  class="timeParticle_select" @change="timeParticleChange()" v-model="timeParticle" placeholder="请选择">
            <el-option
            v-for="item in timeParticleArr"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
      </div>
      <!-- 时间类型 -->
      <div class="time_type">
        <el-select  class="timeType_select" @change="timeTypeChange()" v-model="timeType" placeholder="请选择">
          <el-option
          v-for="item in timeTypeArr"
          :key="item.value"
          :label="item.label"
          :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <!-- 土地信息 -->
    <div class="land_cont" :style="{'height':isListedLand?'94%':'100%'}">
      <!-- 已上市土地-信息图表 -->
      <div class="land_chart_box" 
      v-show="isListedLand"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
        <!-- x轴类别 -->
        <el-select  class="xType_select" @change="changeXType" v-model="xType" placeholder="请选择">
          <el-option label="时间" value="bytime"></el-option>
          <el-option label="区域" value="byregion"></el-option>
        </el-select>
        <div id="land_chart"></div>
      </div>
      <!-- 已上市土地-信息表格 -->
      <div class="land_table_box" 
      v-show="isListedLand"
      v-loading="loading1"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-table
          class="land_table"
          ref="landTable"
          height="100%"
          width="100%"
          :data="landInfoData"
          border
          :header-cell-style="{ background: '#222222', color: '#fff' }"
          :row-class-name="tableRowClassName"
          highlight-current-row
          @row-click="showLand"
        >
          <el-table-column label="土地位置" align="center" prop="address"></el-table-column>
          <el-table-column label="区域" align="center" prop="areaname"></el-table-column>
          <el-table-column label="土地用途" align="center" prop="landuselabel"></el-table-column>
          <el-table-column sortable label="商业占比" align="center" prop="businessrate"></el-table-column>
          <el-table-column label="出让方式" align="center" prop="selltypelabel"></el-table-column>
          <el-table-column label="出让时间" align="center" prop="selldate"></el-table-column>
          <el-table-column sortable label="容积率" align="center" prop="volumeratio"></el-table-column>
          <el-table-column sortable label="净用地面积(㎡)" align="center" prop="landarea"></el-table-column>
          <el-table-column sortable label="可开发体量(万/㎡)" align="center" prop="devvolume"></el-table-column>
          <el-table-column sortable label="楼面地价(元/㎡)" align="center" prop="floorprice"></el-table-column>
          <el-table-column sortable label="溢价率" align="center" prop="premiumrate"></el-table-column>
          <el-table-column label="竞得者" align="center" prop="winner"></el-table-column>
          <el-table-column label="呈现项目" align="center" prop="name"></el-table-column>
        </el-table>
      </div>
      <!-- 潜供土地-信息表格 -->
      <div class="qgland_table_box" 
        v-show="!isListedLand"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-table
          class="land_table"
          ref="qgLandTable"
          height="100%"
          width="100%"
          :data="landKGInfoData"
          border
          :header-cell-style="{ background: '#222222', color: '#fff' }"
          :row-class-name="tableRowClassName"
          highlight-current-row
          @row-click="showLand_qg"
        >
          <el-table-column :label="plateType==='region'?'行政区':'板块'" align="center" :prop="plateType==='region'?'region':'partname'"></el-table-column>
          <el-table-column label="土地类型占比" align="center" width="400">
            <template slot-scope="scope">
              <div class="lin_box">
                <div class="line_wrap" :style="{'width':scope.row.idnum/maxIdnum*100+'%'}">
                  <div :style="{
                    'background':'#ffff00',
                    width: (scope.row.house?scope.row.house:0 / scope.row.idnum) * 100 + '%'
                  }"
                  class="line"
                  ></div>
                  <div :style="{
                      'background':'#dd3601',
                      width: (scope.row.commerce_house?scope.row.commerce_house:0 / scope.row.idnum) * 100 + '%'
                    }"
                    class="line"
                  ></div>
                  <div :style="{
                      'background':'#ff0000',
                      width: (scope.row.commerce?scope.row.commerce:0 / scope.row.idnum) * 100 + '%'
                    }"
                    class="line"
                  ></div>
                  <div :style="{
                      'background':'#4d0000',
                      width: (scope.row.industry?scope.row.industry:0 / scope.row.idnum) * 100 + '%'
                    }"
                    class="line"
                  ></div>
                  <div :style="{
                      'background':'#3a8ee6',
                      width: (scope.row.other?scope.row.other:0 / scope.row.idnum) * 100 + '%'
                    }"
                    class="line"
                  ></div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column sortable label="宗数" align="center" prop="idnum"></el-table-column>
          <el-table-column sortable label="用地面积(㎡)" align="center" prop="area"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
//Api
import dataqueryApi from "@/api/dataqueryApi"

//插件
import { mapGetters } from "vuex"
//组件
import QuarterSelecter from "@/components/tools/quarterSelecter"
export default {
  name:'landInfo',
  props:{},
  components:{
    QuarterSelecter
  },
  data(){
    return{
      landMenuArr:[],//土地菜单数据

      timeRange:[],//年份范围
      minYear:null,
      maxYear:null,
      timeYearMarks:{
        2010:'2010'
      },//年份范围标注
      monthYear:null,//月份年
      timeMonthMarks:{
        2010:'2010'
      },//年份范围标注
      timeParticle:'year',//时间颗粒度
      timeParticleArr:[ //时间颗粒度数组
        {label:'月度',value:'month'},
        //{label:'季度',value:'season'},
        {label:'年度',value:'year'}
      ],
      timeType:'dealDate',//当前时间类型 
      timeTypeArr:[ //时间类型
        {label:'交易时间',value:'dealDate'},
        {label:'公告时间',value:'noticeDate'}
      ],

      xType:'bytime',
      chartData:[],//统计图表数据
      landInfoData:[], // 项目数据
      curLandID:null,//当前选择的宗地ID
      curQgLandID:null,//当前选择的潜供用地ID
      isListedLand:true,//是否为已上市土地
      landKGInfoData:[],//查询返回的潜供用地列表
      loading:false,//loading
      loading1:false,//loading
      maxIdnum:null,//潜供土地合计总数最大值
    }
  },
  mounted(){
    //设置初始时间范围
    let date = new Date()
    let year = date.getFullYear()
    this.timeRange = [year-9,year-1]
    this.minYear = year-10
    this.maxYear = year
    this.monthYear = year-1
    //设置土地菜单数据
    this.userMenu.children.forEach(item=>{
      if(item.name==="数据查询"){
        item.children.forEach(child=>{
          if(child.name==="土地"){
            this.landMenuArr = child.children
            
          }
        })
      }
    })
    console.log('土地菜单',this.landMenuArr)
    //this.setLandChart()
    setTimeout(()=>{
      this.mapEvent()
    },1500)
    
  },
  watch:{
    plateArr:{
      handler(){
        this.landInfoQuery()
        this.landKGInfoData = []
      },
      deep:true
    },
    classification:{
      handler(newVal){
        let curState = this.landMenuArr[0].children.filter(item=>{
          return newVal.indexOf(item.id)!==-1
        })
        if(curState.length>0){
          if(curState[0].name==="已上市土地"){
            this.isListedLand = true
          }else{
            this.isListedLand = false
          }
          this.$store.dispatch('setIsListedLand',this.isListedLand)
          this.landInfoQuery()
        }
      },
      deep:true
    }
  },
  computed:{
    ...mapGetters(["plateType","userMenu","classification","plateArr","mapbox_map","plateData"])
  },
  methods:{
    mapEvent(){
      var map = this.mapbox_map
      var popup_kg = new this.mbgl.Popup({
            closeButton: false,
            closeOnClick: false
        });
      map.on('mousemove','td_regulatory',e=>{
        map.getCanvas().style.cursor = 'pointer';
        let coordinates = [e.lngLat.lng,e.lngLat.lat];
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        } 
        let area = e.features[0].properties.area
        let popupHtml = `
        <div class="item_name">用地面积：<span class="item_val">${area?parseInt(area):'暂无'}㎡</span></div>
        `
        popup_kg.setLngLat(coordinates)
        .setHTML(popupHtml)
        .addTo(map);
      })
      map.on('mouseleave','td_regulatory',e=>{
          map.getCanvas().style.cursor = '';
          popup_kg.remove();
      })
    },
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
      this.landInfoQuery()
    },
    landInfoQuery(){ //土地信息查询条件设置
      let curState = this.landMenuArr[0].children.filter(item=>{
        return this.classification.indexOf(item.id)!==-1
      })
      if(curState.length>0){
        if(curState[0].name==='已上市土地'){
          this.getListedLandInfo()
        }else if(curState[0].name==='潜供土地'){
          this.getPotentialLandInfo()
        }
      }
    },
    getPotentialLandInfo(){ //潜供土地查询条件
      
      let landUsesSelectArr = this.landMenuArr[2].children.filter(item=>{
        return this.classification.indexOf(item.id)!==-1
      })
      if(landUsesSelectArr.length>0&&this.plateArr.length>0){
        //板块ID
        let regionno = ''
        let regionnoArr = []
        this.plateArr.forEach(item=>{
          regionno += (item+',')
          regionnoArr.push(item)
        })
        //潜供土地-土地用途
        let regulatoryTypes = ''
        let regulatoryTypesArr = []
        landUsesSelectArr.forEach(item=>{
          regulatoryTypes += (item.url+',')
          regulatoryTypesArr.push(item.url)
        })
        let obj = {
          regionno:regionno,
          regulatoryTypes:regulatoryTypes,
          type:this.plateType
        }
        this.loading = true
        dataqueryApi.getKGLandInfo(obj)
        .then(res=>{
          if(res.data.code===0){
            console.log('潜供用地查询',res)
            let list = res.data.data
            //数据处理,合并板块数据
            let arr = []
            let arr_id = []
            list.forEach(item=>{
              let i = arr_id.indexOf(this.plateType==='region'?item.regionno:item.partno)
              if(i===-1){ 
                item.area = parseInt(item.area)
                item.idnum = parseInt(item.idnum)
                item[item.type] = parseInt(item.idnum)

                arr.push(item)
                arr_id.push(this.plateType==='region'?item.regionno:item.partno)
              }else{
                arr[i].area +=  parseInt(item.area)
                arr[i].idnum += parseInt(item.idnum)
                arr[i][item.type] = parseInt(item.idnum)
              }
            })
            this.landKGInfoData = arr
            //求的所有版块中合计总数的最大值
            let idnumArr = []
            arr.forEach(item=>{
              idnumArr.push(item.idnum)
            })
            this.maxIdnum = Math.max.apply(null,idnumArr)
            console.log(this.maxIdnum)
            //控规土地筛选

            this.filterKgLand(regulatoryTypesArr,regionnoArr)
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
      }else{
        this.$message('请选择'+(this.plateArr.length==0?'板块':'土地用途'))
      }
    },
    filterKgLand(type,plate){ //潜供土地筛选
      var map = this.mapbox_map
      var filters = ['all',
        ['in', this.plateType==='region'?'regionno':'partno'].concat(plate),
        ['in','type'].concat(type)
      ]
      map.setLayoutProperty('td_regulatory', 'visibility', 'visible')
      map.setLayoutProperty('td_regulatory_line', 'visibility', 'visible')
      map.setLayoutProperty('td_regulatory_symbol', 'visibility', 'visible')
      map.setFilter('td_regulatory', filters);
      map.setFilter('td_regulatory_line', filters);
      map.setFilter('td_regulatory_symbol', filters);
    },
    getListedLandInfo(){ //已上市土地查询条件
      let timeRangeFlag = null
      if(this.plateArr.length>0){
        //板块ID
        let regionno = ''
        this.plateArr.forEach(item=>{
          regionno += (item+',')
        })
        //出让方式
        let sellTypes = ''
        this.landMenuArr[1].children.forEach(item=>{
          if(this.classification.indexOf(item.id)!==-1){
            if(item.name==='招拍挂'){ //招拍挂合三为一，请求时拆分开
              let url = item.url.split(',')
              let urlStr = ''
              url.forEach(u=>{urlStr += (u+',')})
              sellTypes += urlStr
            }else{
              sellTypes += (item.url+',')
            }
          }
        })
        //土地用途
        let landUses = ''
        this.landMenuArr[2].children.forEach(item=>{
          if(this.classification.indexOf(item.id)!==-1){
            landUses += (item.url+',')
          }
        })
        //交易状态
        let dealStates = ''
        this.landMenuArr[3].children.forEach(item=>{
          if(this.classification.indexOf(item.id)!==-1){
            dealStates += (item.url+',')
          }
        })
        let obj_c = {
          type:this.plateType, //板块类型
          regionno:regionno,//选择的板块
          sellTypes:sellTypes, //出让方式
          landUses:landUses,//土地用途
          dealStates:dealStates,//交易状态
          kind:this.timeParticle, //时间单位
          statistics:this.xType //统计方式(板块、时间)
        }
        let obj_t = {
          type:this.plateType, //板块类型
          regionno:regionno,//选择的板块
          sellTypes:sellTypes, //出让方式
          landUses:landUses,//土地用途
          dealStates:dealStates,//交易状态
          kind:this.timeParticle, //时间单位
          statistics:'byparcel' //统计方式(板块、时间)
        }
        //公告时间,交易时间
        let searchTime = ''
        if(this.timeParticle==="month"){
          searchTime = this.monthYear+'01,'+this.monthYear+'12'
        }else if(this.timeParticle==="year"){
          searchTime = this.timeRange[0]+','+this.timeRange[1]
        }
        if(this.timeType==='dealDate'){ //交易时间
          obj_c.months = searchTime
          obj_t.months = searchTime
        }else{ //公告时间
          obj_c.noticeDates = searchTime
          obj_t.noticeDates = searchTime
        }
        this.getLandChartData(obj_c)
        this.getLandTableData(obj_t)
      }else{
        //this.$message('请选择'+(this.plateArr.length==0?'板块':'时间范围'))
      }
    },
    getLandChartData(obj){ //土地图表信息请求
      this.loading = true
      dataqueryApi.getLandInfo(obj)
      .then(res=>{
        if(res.data.code===0){
          let data = JSON.parse(JSON.stringify(res.data.data))
          console.log('土地-宗地图表数据',res)
          data.forEach(item=>{
            if(item.buildarea==0){
              item.landaveprice = 0
            }else{
              item.landaveprice = (item.landsum/item.buildarea).toFixed(2)
            }
          })
          this.chartData = data
          this.setLandChart(data)
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
    getLandTableData(obj){ //土地表格信息请求
      this.loading1 = true
      dataqueryApi.getLandInfo(obj)
      .then(res=>{
        if(res.data.code===0){
          let data = JSON.parse(JSON.stringify(res.data.data))
          console.log('土地-宗地表格数据',res)
          data.forEach(item=>{
            item.areaname = this.plateType==='region'?item.region:item.partname
          })
          //设置表格
          this.landInfoData = data
          if(data.length===0){
            this.$message('未查询到符合条件的宗地数据')
          }
          //地图筛选土地
          let landIDs = []
          data.forEach(item=>{landIDs.push(item.id)})
          var map = this.mapbox_map
          var filters = ['all',
            ['in', this.plateType==='region'?'regionno':'partno'].concat(this.plateArr),
            ['in','id'].concat(landIDs)
          ]
          map.setLayoutProperty('td_parcel', 'visibility', 'visible')
          map.setLayoutProperty('td_parcel_symbol', 'visibility', 'visible')
          map.setFilter('td_parcel', filters);
          map.setFilter('td_parcel_symbol', filters);
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
    changeXType(){ //切换图表x轴类别
      //this.getLandChartData()
      this.landInfoQuery()
    },
    setLandChart(data){ //设置图表
      let xData = []
      let yData1 = []
      let yData2= []
      let yData3 = []
      let yData4 = []
      data.forEach(item=>{
        let name = ''
        if(this.xType==="bytime"){
          if(this.timeParticle==="season"&&this.xType==="bytime"){
            name = item.datasize.substring(0,4)+'年'+item.datasize.substring(5,6)+'季度'
          }else{
            name = item.datasize
          }
        }else{
          name = this.plateType==="region"?item.region:item.partname
        }
        xData.push(name)
        yData1.push(item.landnum)
        yData2.push(item.buildarea)
        yData3.push(item.landaveprice)
        yData4.push(item.landsum)
      })
      let myChart = this.$echarts.init(document.getElementById("land_chart"));
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        grid: {
          top: "23%",
          left: "6%",
          right: "6%",
          bottom: "4%",
          containLabel: true
        },
        toolbox: {
          feature: {
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        legend: {
          top:20,
          textStyle:{
            color:'#fff'
          },
          data: ['宗地数量', '成交建面', '楼面地价','成交总价']
        },
        xAxis: [
          {
            type: 'category',
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
            data: xData,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '宗',
            position : 'left',
            axisLabel: {
              formatter: "{value}",
              color: "#999",
              textStyle: {
                fontSize: 12
              }
            },
            nameTextStyle:{
              color: "#999",
            },
            axisLine: {
              lineStyle: {
                color: "rgba(107,107,107,0.37)"
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
          },{
            type: 'value',
            position : 'left',
				    offset : 40,
            name: '万㎡',
            axisLabel: {
              formatter: "{value}",
              color: "#999",
              textStyle: {
                fontSize: 12
              }
            },
            nameTextStyle:{
              color: "#999",
            },
            axisLine: {
              lineStyle: {
                color: "rgba(107,107,107,0.37)"
              }
            },
            axisTick: {
              show: true
            },
            splitLine: {
              show:false,
              lineStyle: {
                color: "rgba(131,101,101,0.2)",
                type: "dashed"
              }
            }
          },{
            type: 'value',
            position : 'right',
            name: '元/㎡',
            axisLabel: {
              formatter: "{value}",
              color: "#999",
              textStyle: {
                fontSize: 12
              }
            },
            nameTextStyle:{
              color: "#999",
            },
            axisLine: {
              lineStyle: {
                color: "rgba(107,107,107,0.37)"
              }
            },
            axisTick: {
              show: true
            },
            splitLine: {
              show:false,
              lineStyle: {
                color: "rgba(131,101,101,0.2)",
                type: "dashed"
              }
            }
          },{
            type: 'value',
            position : 'right',
				    offset : 40,
            name: '万元',
            axisLabel: {
              formatter: "{value}",
              color: "#999",
              textStyle: {
                fontSize: 12
              }
            },
            nameTextStyle:{
              color: "#999",
            },
            axisLine: {
              lineStyle: {
                color: "rgba(107,107,107,0.37)"
              }
            },
            axisTick: {
              show: true
            },
            splitLine: {
              show:false,
              lineStyle: {
                color: "rgba(131,101,101,0.2)",
                type: "dashed"
              }
            }
          }
        ],
        series: [
          {
            name: '宗地数量',
            type: 'bar',
            yAxisIndex: 0,
            data: yData1
          },{
            name: '成交建面',
            type: 'bar',
            yAxisIndex: 1,
            data: yData2
          },{
            name: '楼面地价',
            type: 'line',
            yAxisIndex: 2,
            data: yData3
          },{
            name: '成交总价',
            type: 'bar',
            yAxisIndex: 3,
            data: yData4
          }
        ]
      };
      // 清除画布
      myChart.clear();
      myChart.setOption(option);
      window.addEventListener("resize", myChart.resize);
    },
    timeParticleChange(){ //时间颗粒度类型切换
      this.landInfoQuery()
    },
    timeTypeChange(){ //时间类型切换
      this.landInfoQuery()
    },
    showLand(row){ //点击飞往宗地位置
      if (this.curLandID != row.id) {
        this.curLandID = row.id;
        this.flyPlateCenter([row.lng,row.lat])
      } else {
        this.curLandID = null;
        this.$refs.landTable.setCurrentRow();
        this.flyPlateCenter()
      }
    },
    showLand_qg(row){
      console.log(row)
      // if (this.curQgLandID != row.id) {
      //   let i = row.center.indexOf(')')
      //   let c = row.center.substring(6,i)
      //   let center = c.split(' ')
      //   this.curQgLandID = row.id;
      //   this.flyPlateCenter(center)
      // } else {
      //   this.curQgLandID = null;
      //   this.$refs.qgLandTable.setCurrentRow();
      //   this.flyPlateCenter()
      // }
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
.landInfo{
  width: 100%;
  height: 100%;
  border-right: #383838 1px solid;
  background: #040506;
  .timeParticle_select input,.timeType_select input{
    background: none;
    color: #ffffff;
    font-size: 12px;
    border: none;
    user-select: none;
    width: 60px;
    padding-left: 0px;
  }
  .timeType_select input{
    width: 85px;
  }
  .land_title{
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
  .land_head{
    height: 8%;
    background: #222222;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    display: flex;
    align-items:center;
    .time_type{
      width: 9%;
    }
    .time_particle{
      width: 4%;
    }
    .time_bar{
      width:75%;
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
    .land_query,.land_export{
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
      margin-left: 18px;
    }
    .land_export{
      background-color: #116001;
    }
  }
  .land_cont{
    width: 100%;
    height: 92%;
    position: relative;
    .qgland_table_box{
      width: 100%;
      height: 100%;
    }
    .lin_box{
      width: 380px;
      padding: 0 20px;
      .line_wrap{
        display: flex;
        align-items: center;
        height: 10px;
      }
      .line{
        height: 10px;
      }
    }
    
    .land_chart_box,.land_table_box{
      width: 100%;
      height: 50%;
      position: relative;
      .xType_select{
        position: absolute;
        z-index: 99;
        right: 30px;
        bottom: -1px;
        input{
          background: none;
          color: #e6a23c;
          font-size: 12px;
          border: none;
          user-select: none;
          width: 60px;
          padding-left: 0px;
        }
      }
    }
    #land_chart{
      width: 100%;
      height: 100%;
    }
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