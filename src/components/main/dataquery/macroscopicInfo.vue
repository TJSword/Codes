<template>
  <!-- 宏观信息 -->
  <div class="macrospic">
    <div class="table_wrap">
      <el-table
        class="plate_table"
        ref="tableA"
        height="100%"
        :data="tableData"
        border
        :header-cell-style="{ background: '#222222', color: '#fff' }"
        :row-class-name="tableRowClassName"
        highlight-current-row
        @row-click="selectPlate"
        @selection-change="selectPlates"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="板块名称" width="140" header-align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px;color:#66b1ff">{{
              scope.row.region
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="占比" width="100" header-align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px;color:#e6a23c;">{{ scope.row.percent }}%</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center">
          <template slot-scope="scope">
            <div
              :style="{
                background: 'linear-gradient(to right, rgba(58, 142, 230, 0), #3a8ee6)',
                width: (scope.row.data / valueMax) * 100 + '%'
              }"
              class="line"
            >
              {{ scope.null }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          label="数值"
          width="150"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px;color:#66b1ff;">{{ scope.row.data }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="plateType!='region'" label="名片" align="center" width="100%">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click.stop="enter_card(scope.row.regionno)"
            >
              进入
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="time_dimension">
      <div class="year_span">时间选择：</div>
      <div class="yearBox" v-if="rangeYear">
        <div class="yearBegin">
          <el-date-picker
            v-model="yearBegin"
            @change="yearRangeChange()"
            type="year"
            size="mini"
            format=""
            class="year"
            placeholder="开始年"
            align="center"
            value-format="yyyy"
          >
          </el-date-picker>
        </div>
        <span class="year_span"
          >至</span
        >
        <div class="yearEnd">
          <el-date-picker
            v-model="yearEnd"
            @change="yearRangeChange()"
            type="year"
            placeholder="结束年"
            size="mini"
            format=""
            value-format="yyyy"
            class="year"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="month" v-else>
        <el-date-picker
          v-model="monthRange"
          @change="monthRangeChange()"
          type="monthrange"
          range-separator="至"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
          size="mini"
          format=""
          value-format="yyyyMM"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </div>
      <el-tooltip class="range_tip" effect="dark" :content="rangeYear?'切换到月颗粒度':'切换到年颗粒度'" placement="top-start">
        <i class="el-icon-sort" @click="rangeTypeChange()"></i>
      </el-tooltip>
      <div class="unit">单位：{{classificationObj[0]?classificationObj[0].unit:'暂无'}}</div>
    </div>
    <div class="macrospic_chart" id="macrospicChart"></div>
  </div>
</template>

<script>
//Api
import dataQueryApi from "@/api/dataqueryApi"
import { setPlateColor,generateLegend } from "@/utils/public"
//插件
import { mapGetters } from "vuex"
export default {
  name: "tableA",
  props: {},
  data() {
    return {
      tableData:[],//根据板块和数据类别查询的数值
      sum: null,
      valueMax: null,
      select_plateID: null, //选择的板块ID
      //时间维度选择
      yearBegin: null,
      yearEnd: null,
      monthRange: [],
      pickerOptions: {
        shortcuts: [{
          text: '本月',
          onClick(picker) {
            picker.$emit('pick', [new Date(), new Date()]);
          }
        }, {
          text: '今年至今',
          onClick(picker) {
            const end = new Date();
            const start = new Date(new Date().getFullYear(), 0);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近六个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 6);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      rangeYear:true, //时间选择器类型，默认年颗粒度
    };
  },
  mounted(){
    setTimeout(()=>{
      this.mapEvent()
    },2000)
    //设置初始时间段
    let date = new Date()
    this.yearEnd = JSON.stringify(date.getFullYear())
    this.yearBegin = JSON.stringify(date.getFullYear() - 10)
  },
  watch:{
    classification:{
        handler(){
          if(this.queryMenuIndex===0){
            this.dataQuery()
          }
        },
        deep:true
    },
    plateArr:{
        handler(){
          if(this.queryMenuIndex===0){
            this.dataQuery()
          }
        },
        deep:true
    },
    plate_color:{
        handler(){
            if(this.tableData.length>0){
                this.setFillColor(this.tableData)
            }
        },
        deep:true
    },
    queryMenuIndex:{
        handler(){
          if(this.tableData.length>0){
            this.setFillColor(this.tableData)
          }
          this.setFillColor([])
        },
        deep:true
    }
  },
  computed:{
    ...mapGetters(["mapbox_map","plateType","plateCenter","plateData","classification","plateArr","plate_color","queryMenuIndex","classificationObj"])
  },
  methods: {
    mapEvent(){
      var that = this
      let map = this.mapbox_map
      var popup = new this.mbgl.Popup({
        closeButton: false,
        closeOnClick: false
      });
      map.on('mousemove','plate_fill',e=>{
        if(that.queryMenuIndex!==0){
          return
        }
        map.getCanvas().style.cursor = 'pointer';
        if(this.tableData.length>0){
          let coordinates = [e.lngLat.lng,e.lngLat.lat];
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          } 
          let regionno = e.features[0].properties.regionno
          let cur = this.tableData.filter(item=>item.regionno===regionno)[0]
          let popupHtml = `<p class="item_head">${this.classificationObj[0].name}(${this.classificationObj[0].unit})</p>
          <div class="item_name">数值：<span class="item_val">${cur!==undefined?cur.data:'暂无'}</span></div>
          <div class="item_name">时间：<span class="item_val">${this.yearBegin+'-'+this.yearEnd}</span></div>
          `
          popup.setLngLat(coordinates)
          .setHTML(popupHtml)
          .addTo(map);
        }
      })
      map.on("mouseleave", "plate_fill", e => {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });
    },
    dataQuery(){ //根据类别获取各版块得分,或筛选配套数据
      if(this.plateArr.length>0&&this.classification.length>0){
          
          switch(this.queryMenuIndex){
              case 0:
                  this.macroscopicQuery();
                  break;
              default:
                  console.log('其他数据查询')
                  break
          }
      }else{
          this.tableData = []
          this.setTableData()
          this.setFillColor([])
      }
  },
  macroscopicQuery(){ //宏观数据查询
      console.log('宏观数据查询')
      //当时间范围未闭合不请求数据
      if(this.yearBegin==null||this.yearEnd==null||this.monthRange==[]){
        return
      }
      let url = this.classificationObj[0].url
      let regionnoArr = ""
      this.plateArr.forEach(item=>{
          regionnoArr += (item+',')
      })
      //多板块求和
      let obj = {
        minTime:this.rangeYear?JSON.parse(this.yearBegin):JSON.parse(this.monthRange[0]),
        maxTime:this.rangeYear?JSON.parse(this.yearEnd):JSON.parse(this.monthRange[1]),
        regionno:regionnoArr,
        sFlag:'total'
      }
      dataQueryApi.getCategory(url,obj)
      .then(res=>{
        if(res.data.code===0){
          let list = JSON.parse(JSON.stringify(res.data.data))
          console.log('多板块宏观数据',list)
          list = list.filter(item=>item.data!=null)
          // let colors = ['#c79c6e','#f58cba','#ffff8f','#a330c9','#69ccf0','#4dbb98','#abd473',"#ffa330"]
          // list.forEach((item,i)=>{
          //   item.color = colors[i%8]
          // })
          if(list.length==0){
             this.$message('未查询到数据')  
          }
          this.tableData = list
          this.setTableData()
          this.setFillColor(list)
          
        }else{
          console.log('查询数据失败')
        }
        
      })
      
    },
    //地图操作
    flyPlateCenter(id){ //获取板块中心点数据
      console.log(id)
      var map = this.mapbox_map
      let curCenter = []
      let center = this.plateData.curCityInfo.center //城市中心点
      if(id){
        var curPlate = this.plateCenter.filter(item=>{
          return item.regionno == id
        })
        curCenter = curPlate.length>0?curPlate[0].center:center
      }
      map.flyTo({
        center: id?curCenter:center,
        zoom: id?10:8,
        speed: 1,
        curve: 1
      })
    },
    enter_card(id) {
      //进入板块名片
      console.log(id);
      //进入板块名片状态
      this.$store.dispatch("setCardFlag", true);
      //store存储选择的板块名片ID
      this.$store.dispatch("setPlateID", id);
      //store存储板块ID数组
      //this.$store.dispatch("setPlateArr", [id]);
      //地图飞行至板块中心
      this.flyPlateCenter(id)
    },
    selectPlate(row) {
      //选中，取消表格的某一行
      //console.log(row,column)
      
      if (this.select_plateID != row.regionno) {
        this.select_plateID = row.regionno;
        this.flyPlateCenter(row.regionno)
      } else {
        this.select_plateID = null;
        this.$refs.tableA.setCurrentRow();
        this.flyPlateCenter()
      }
    },
    selectPlates(val){ //选中板块获取板块的单年内的数据
      console.log(val)
      let url = this.classificationObj[0].url
      let regionnoArr = ""
      val.forEach(item=>{
        regionnoArr += (item.regionno+',')
      })
      if(regionnoArr == ""){ return }
      let obj = {
        minTime:this.rangeYear?JSON.parse(this.yearBegin):JSON.parse(this.monthRange[0]),
        maxTime:this.rangeYear?JSON.parse(this.yearEnd):JSON.parse(this.monthRange[1]),
        regionno:regionnoArr,
        sFlag:'detail'
      }
      dataQueryApi.getCategory(url,obj)
      .then(res=>{
        if(res.data.code===0){
          console.log('多板块单年',res.data.data)
          let data = res.data.data
          let plate = []
          let dataArr = []
          data.forEach(item=>{
            let index = plate.indexOf(item.region)
            if(index===-1){
              plate.push(item.region)
              dataArr.push({
                plate:item.region,
                year:[item.dueTime],
                data:[item.data]
              })
            }else{
              dataArr[index].plate = item.region
              dataArr[index].year.push(item.dueTime)
              dataArr[index].data.push(item.data)
            }
          })
          console.log(plate,dataArr)
          let chartObj = {
            plate:plate,
            data:dataArr,
            year:dataArr[0].year
          }
          this.setMacrospicChart(chartObj)
        }
      })
    },
    setTableData(){ //设置表格数据
      //console.log(this.tableData);
      let data = this.tableData.sort(this.sortBy("data", true, parseInt));
      let sum = null;
      let valueArr = [];
      data.forEach(item => {
        sum += item.data;
        valueArr.push(item.data);
      });
      this.sum = sum;
      //console.log(this.sum);
      this.tableData.forEach(item => {
        
        if(item.data){
          item.percent = ((item.data / sum) * 100).toFixed(2);
          item.data=JSON.parse((item.data).toFixed(2))
        }else{
          item.data=0
        }
        
      });
      let valueMax = Math.max(...valueArr);
      this.valueMax = valueMax;
    },
    //设置瓦片填充颜色
    setFillColor(data) {
      setPlateColor(data,this.mapbox_map,this.plate_color)
      console.log('分段值',generateLegend(data))
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "row2";
      } else if (rowIndex % 2 === 1) {
        return "row1";
      }
      return "";
    },

    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    sortBy(filed, rev, primer) { //排序
      rev = rev ? -1 : 1;
      return function(a, b) {
        a = a[filed]==null?0:a[filed];
        b = b[filed]==null?0:b[filed];
        if (typeof primer != "undefined") {
          a = primer(a);
          b = primer(b);
        }
        if (a < b) {
          return rev * -1;
        }
        if (a > b) {
          return rev * 1;
        }
        return 1;
      };
    },
    rangeTypeChange(){ //切换时间段类型
      this.rangeYear = !this.rangeYear
    },
    monthRangeChange(){ //月份段选择
      this.dataQuery()
    },
    yearRangeChange(){ //年份段选择
      let begin = this.yearBegin
      let end = this.yearEnd
      if(begin>end&&begin&&end){
        this.yearBegin = end
        this.yearEnd = begin
      }
      this.dataQuery()
    },
    setMacrospicChart(obj){ //多板块年份段内
      let seriesArr = []
      obj.data.forEach(item=>{
        seriesArr.push({
          name: item.plate,
          type: 'bar',
          data: item.data
        })
      })
      let option = {
        
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          top:10,
          textStyle:{
            color:'#ccc'
          },
          data: obj.plate
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
            restore: {show: true},
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
            axisTick: {show: true},
            data: obj.year
          }
        ],
        yAxis: [
          {
            type: 'value',
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
          }
        ],
        series: seriesArr
      };
      let myChart = this.$echarts.init(document.getElementById("macrospicChart"))
      // 清除画布
      myChart.clear();
      myChart.setOption(option)
    },
  },
};
</script>
<style lang="scss">
.macrospic {
  width: 100%;
  height: 100%;
  position: relative;
  .macrospic_chart{
    height: 50%;
    background: #040506;
    border-right: #444444 1px solid;
    border-left: #444444 1px solid;
  }
  .table_wrap{
    width: 100%;
    height: 50%;
    .el-table{
      background: #040506;
    }
    .plate_table {
      width: 100%;
    }
  }
  .line {
    display: block;
    height: 10px;
    width: 500px;
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    color: black !important;
    font-weight: bold !important;
  }
  .el-table__body tr.current-row > td {
    background-color: #fff !important;
    font-weight: bold !important;
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
    padding: 5px 0;
  }
  .el-table th {
    padding: 0;
  }
  .el-table__body-wrapper {
    background: #040506;
  }
  .time_dimension{
    position: absolute;
    top: 3px;
    left: 37%;
    display: flex;
    align-items: center;
    .unit{
      color: #fff;
      margin-left: 30px;
      font-size: 12px;
    }
    .range_tip{
      margin-left: 20px;
      cursor: pointer;
      cursor: pointer;
      color: #5f646f;
      transition: all 0.5s;
      font-weight: bold;
      font-size: 16px;
    }
    .range_tip:hover{
      color: #fff;
    }
    .year_span{
      font-size: 12px;
      color: #e6a23c;
    }
    .yearBox {
      display: flex;
      align-items: center;
      background: none;
      height: 28px;
      color: #e6a23c;
      .year {
        width: 83px !important;
        margin-left: 12px;
      }
      .el-input--suffix .el-input__inner{
        padding-right: 0;
      }
      .el-range-editor--mini.el-input__inner {
        background: none;
        height: 30px !important;
        border: 1px solid #64666b;
        padding-right: 0;
      }
      .el-range-editor--mini .el-range-input,
      .el-input--mini .el-input__inner {
        background:none;
        border-radius: 0;
      }
      .el-range-editor--mini .el-range-separator {
        color: white;
      }
      .el-range-editor--mini .el-range-input,
      .el-input--mini .el-input__inner {
        border: 0;
        border-bottom: #4f565d 1px solid;
        cursor: pointer;
        color: #ecf5ff;
      }
      
    }
    .month {
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
      }
      .el-date-editor .el-range-separator{
        color: #e6a23c;
      }
    }
  }
}
</style>
