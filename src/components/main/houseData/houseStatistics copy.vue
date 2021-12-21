<template>
    <div class="houseStatistics_wrap">
      <Loading v-if="showLoading" />
      <HouseRegionDetail :type='formInline.kind' :regionno = chooseRegionno v-if="showRegionDetail" />
      <div class="diver">查询条件</div>
      <div class="from_box">
        <el-form :inline="true" :model="formInline" size="small" style="text-align: start;">
           <el-form-item label="">
            <el-select v-model="formInline.status" placeholder="数据口径" clearable :collapse-tags="true">
                <el-option :label="item.label" :value="item.value" v-for="item in statusArr" :key="item.value"></el-option>
            </el-select>
           </el-form-item>
          <el-form-item label="">
              <el-select v-model="formInline.kind" placeholder="区域类型" clearable @change="kindChange">
                <el-option :label="item.label" :value="item.value" v-for="item in regionArr" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
              <el-form-item label="">
              <el-select  v-model="propertyType" placeholder="物业类型" clearable multiple :collapse-tags="true">
               <el-option :label="item.label" :value="item.value" v-for="item in propertyArr" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-select  v-model="buildForm" placeholder="建筑形态" clearable multiple :collapse-tags="true">
                 <el-option :label="item.label" :value="item.value" v-for="item in buildArr" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
               <el-date-picker type="month" placeholder="开始月份" v-model="formInline.startDate" value-format="yyyy-MM-dd"  style="width: 100%;"></el-date-picker>
            </el-form-item>
             <el-form-item>
            <el-date-picker type="month" placeholder="结束月份"   v-model="formInline.endDate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <div class="sub_btn" @click="getViewList">点击查询</div>
            </el-form-item>
            </el-form>
        </div>
         <dv-border-box-12 :class="['list_mask',isShowEcharts?'list_mask_active':'']">
            <el-table 
            :data="tableData"
            style="width: 96%;margin-left:2%;margin-top:1%;background: transparent;color:white"
            :height="tableHeight"
            :cell-style="cellStyle"
            @cell-click="cellClick"
            >
           <el-table-column
            prop="name"
            label="区域">
          </el-table-column>
          <el-table-column
            prop="xsnum"
            label="销售套数">
          </el-table-column>
          <el-table-column
            prop="xsarea"
            label="销售面积(万㎡)"
            >
          </el-table-column>
          <el-table-column
            prop="xsamount"
            label="销售总价(万元)">
          </el-table-column>
          <el-table-column
            prop="ave"
            label="销售均价">
          </el-table-column>
          <el-table-column
            prop="xznum"
            label="新增套数">
          </el-table-column>
           <el-table-column
            prop="xzarea"
            label="新增面积(万㎡)">
          </el-table-column>
           <el-table-column
            prop="clnum"
            label="存量套数">
          </el-table-column>
           <el-table-column
            prop="clarea"
            label="存量面积(万㎡)">
          </el-table-column>
           <!-- <el-table-column
            prop="tfnum"
            label="退房套数">
          </el-table-column>
          <el-table-column
            prop="tfarea"
            label="退房面积(万㎡)">
          </el-table-column> -->
            </el-table>
             <el-pagination
            layout="prev, pager, next"
            :page-size="13"
            :total="totalPage"
            @current-change="pageChange">
          </el-pagination>
           <div class="instructions"> * 默认数据为20210101至今的认购口径统计数据</div>
        </dv-border-box-12>
        <dv-border-box-12 :class="['echarts_mask',isShowEcharts?'echarts_mask_active':'']">
          <div :class="['container',isShowEcharts?'container_active':'']" @click="showEcharts">
              <div class="chevron"></div>
              <div class="chevron"></div>
              <div class="chevron"></div>
          </div>
          <div id="charts"></div>
        </dv-border-box-12>
        
    </div>
</template>

<script>
import House from "@/api/houseDataApi.js"
import { mapGetters } from "vuex" 
import Loading from "@/components/tools/loading.vue"
import HouseRegionDetail from "./HouseRegionDetail"
export default {
  components:{
    Loading,HouseRegionDetail
  },
    computed:{
        ...mapGetters(['houseDataMap'])
    },
    data(){
        return{
          showLoading:false,
          chooseKind:'region',
          formInline:{
                kind:'region',
                startDate:'',
                endDate:'',
                propertyTypes:'',
                buildForms:'',
                status:'sub',
                page:1,
                limit:13
            },
            statusArr:[{
              label:'认购',
              value:'sub'
            },{
              label:'备案',
              value:'record'
            }],
            regionArr:[],
            propertyArr:[],
            buildArr:[],
            propertyType:[],
            buildForm:[],
            tableData:[],
            tableHeight:550,
            totalPage:0,
            chartData:[],
            showRegionDetail:false,
            isShowEcharts:false
        }
    },
    watch:{
        propertyType(newVal){
           this.formInline.propertyTypes = newVal.join(',')
        },
        buildForm(newVal){
           this.formInline.buildForms = newVal.join(',')
        },
    },

    methods:{
      showEcharts(){
        this.isShowEcharts = !this.isShowEcharts;
        if(this.isShowEcharts)  this.tableHeight = window.innerHeight * 0.49
        else this.tableHeight = window.innerHeight * 0.71
      },
      kindChange(val){
            let map = this.houseDataMap
            map.setLayoutProperty('plate_fill','visibility',val==='part'?'none':'visible')
            map.setLayoutProperty('plate_line','visibility',val==='part'?'none':'visible')
            map.setLayoutProperty('plate_labels','visibility',val==='part'?'none':'visible')
            map.setLayoutProperty('plates_fill','visibility',val==='part'?'visible':'none')
            map.setLayoutProperty('plates_line','visibility',val==='part'?'visible':'none')
            map.setLayoutProperty('plates_labels','visibility',val==='part'?'visible':'none')
        },
        getViewList(){
          this.chooseKind = this.formInline.kind
          this.showLoading = true
            House.getTable(this.formInline).then(res=>{
             this.tableData = res.data.data.list
             this.totalPage = res.data.data.total
            })
            let obj = JSON.parse(JSON.stringify(this.formInline))
            obj.limit = 999
            obj.page = 1
            House.getTable(obj).then(res=>{
              this.chartData = res.data.data.list
              this.regionData = res.data.data.list
              this.showLoading = false
              this.drawEcharts()
            })
        },
        cellStyle(row, column, rowIndex, columnIndex){
      if(row.column.label === '区域'){
            return 'color:#fcbf49;font-weight:700;cursor:pointer'
           }
        },
        cellClick(row, column, cell, event){
            if(column.label === '区域'){
                this.chooseRegionno = row.code
                this.showRegionDetail = true
            }
        },
        hideBox(){
           this.showRegionDetail = false
        },
        drawEcharts(){
            console.log(this.chartData)
            let chartData = this.chartData
            let xAxis = []
            let series = [{
                name:'成交面积',
                type:'bar',
                data:[],
                itemStyle:{
                normal:{
                    color: '#e09f3e'
                }
                },
            },{
                name:'新增面积',
                type:'bar',
                data:[],
                itemStyle:{
                normal:{
                    color: '#98c1d9'
                }
                },
            },
            {
                name:'存量面积',
                type:'bar',
                data:[],
                itemStyle:{
                normal:{
                    color: '#ee6c4d'
                }
                },
            },{
                name: '成交均价',
                smooth:true,
                symbol:'none',
                type: 'line',
                yAxisIndex: 1,
                data: [],
                itemStyle:{
                normal:{
                    color: '#e0fbfc'
                }
                },
            }]
            chartData.forEach(item=>{
                xAxis.push(item.name)
                series[0].data.push(item.xsarea)
                series[1].data.push(item.xzarea)
                series[2].data.push(item.clarea)
                series[3].data.push(item.ave)
            })
            let myChart = this.$echarts.init(document.getElementById('charts'))
            var colors = ['#5470C6', '#91CC75', '#EE6666'];
            var option = {
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
                    data: ['成交面积', '新增面积', '存量面积','成交均价'],
                    textStyle:{
                    color:'white'
                    },
                    top:12,
                    
                },
                dataZoom :{
                      orient:"horizontal", //水平显示
                      show:true, //显示滚动条
                  },
                xAxis: [
                    {
                        type: 'category',
                        data:xAxis,
                        axisPointer: {
                            type: 'shadow'
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#fff'
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '面积(万㎡)',
                        axisLabel: {
                            show: true,
                            formatter: '{value} ',
                            textStyle: {
                                color: '#fff'
                            }
                        },
                        nameTextStyle:{
                            color:"white", 
                            fontSize:12,  
                            padding:10
                        },
                        splitLine:{
                    　　　　show:true
                    　　 }
                    },
                    {
                        type: 'value',
                        name: '均价(元/㎡)',
                        axisLabel: {
                            show: true,
                            formatter: '{value}',
                            textStyle: {
                                color: '#fff'
                            }
                        },
                        nameTextStyle:{
                            color:"white", 
                            fontSize:12,  
                            padding:10
                        },
                        splitLine:{
                    　　　　show:false
                    　　 }
                    }
                ],
                series: series
            };
            myChart.setOption(option,true);
        },
        pageChange(i){
          this.formInline.page=i;
          this.getViewList()
        },
        setRegionLayer(){
          let map = this.houseDataMap
          var code = '510100'
          var cityPolygonLayer = this.geoserverURL+'/geoserver/gwc/service/tms/1.0.0/city_100000:city_polygon@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf'
          map.addSource("part_data", {
            type: "vector",
              scheme: "tms",
              tiles: [cityPolygonLayer]
          });
          map.addLayer({ //通用板块-填充
            id: "plate_fill",
            type: "fill",
            source: "part_data",
            "source-layer": "city_polygon",
            paint: {
              "fill-color": "#fcbf49",
              "fill-opacity": 
              ["case",
                ["boolean", ["feature-state", "hover"], false],
                0.1,
                0.2
              ]
            },
            layout: {
              "visibility": "visible"
            }
          });
          map.addLayer({  //通用板块-描边
            id: "plate_line",
            type: "line",
            source: "part_data",
            "source-layer": "city_polygon",
            layout: {
              "visibility": "visible"
            },
            paint: {
              "line-color":"#fcbf49",
              "line-width": 
              ["case",
                ["boolean", ["feature-state", "hover"], false],
                2.5,
                1
              ],
              "line-opacity": 0.2,
              //"line-dasharray": [4,4]
            }
          });
          map.addLayer({ //文字symbol
            id: "plate_labels",
            type: "symbol",
            source: "part_data",
            "source-layer": "city_polygon",
            layout: {
              "text-field": ["get", "name"],
              "text-allow-overlap": false,
              "text-size": 10,
              "visibility":"visible"
            },
            paint:{
              "text-opacity":1,
              "text-color": "#11b4da",
              "text-halo-color": "rgba(0,0,0,0.8)",
              "text-halo-width": 1.5,
              "text-halo-blur": 0.5
            }
          });
          let filter = [
            'all',
            ["==", "tree_level", 3],
            ["==","pid",JSON.parse(code)]
          ]
          map.setFilter("plate_fill",filter)
          map.setFilter("plate_line",filter)
          map.setFilter("plate_labels",filter)

          let source = map.getSource('region_data')
            if(source===undefined){
                var code = this.cityCode?this.cityCode:'510100'
                var cityPlatesLayer = this.geoserverURL+'/geoserver/gwc/service/tms/1.0.0/touziyun:tzy_city_plates@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf'
                map.addSource('region_data',{
                    type: "vector",
                    scheme: "tms",
                    tiles: [cityPlatesLayer]
                })
                map.addLayer({ //通用板块-填充
                    id: "plates_fill",
                    type: "fill",
                    source: "region_data",
                    "source-layer":"tzy_city_plates",
                    filter:["==","land_cityno",code],
                    paint: {
                        "fill-color": "#fcbf49",
                        "fill-opacity": 0.2
                    },
                    layout: {
                        "visibility":"none"
                    }
                });
                map.addLayer({  //通用板块-描边
                    id: "plates_line",
                    type: "line",
                    source: "region_data",
                    "source-layer":"tzy_city_plates",
                    filter:["==","land_cityno",code],
                    paint: {
                        "line-color":'#fcbf49',
                        "line-width":1,
                        "line-opacity": 0.1
                    },
                    layout: {
                        "visibility":"none"
                    }
                });
                map.addLayer({ //文字symbol
                    id: "plates_labels",
                    type: "symbol",
                    source: "region_data",
                    "source-layer":"tzy_city_plates",
                    filter:["==","land_cityno",code],
                    layout: {
                        "text-field": ["get", "name"],
                        "text-allow-overlap": false,
                        "text-size": 10,
                        "visibility":"none"
                    },
                    paint:{
                        "text-opacity":1,
                        "text-color": '#11b4da',
                        "text-halo-color": "rgba(0,0,0,0.8)",
                        "text-halo-width": 1.5,
                        "text-halo-blur": 0.5
                    }
                });
            }
        },
    },
    created(){
        House.getDict('region_type').then(res=>this.regionArr = res.data.data)
        House.getDict('property_type_newhouse').then(res=>this.propertyArr = res.data.data)
        House.getDict('build_form_newhouse').then(res=>this.buildArr = res.data.data)
        this.tableHeight = window.innerHeight * 0.71
    },
    mounted(){
      this.getViewList()
      setTimeout(_=>{
        this.houseDataMap.flyTo({
            center:[104.3157969744969,30.66129397743849],
            zoom: 8.5,
        })
      },1500)
      // this.setRegionLayer()
    }
}
</script>

<style lang="scss" scoped>
.houseStatistics_wrap{
    height:800px;
    width:300px;
    position: relative;
    .diver{
        padding: 10px 20px;
        border-bottom: #464646 1px solid;
        font-size: 14px;
        color: #8bc34a;
    }
    .from_box{
      margin-top:20px;
      margin-left:5%;
      width: 90%;
      .el-form-item{
        width:100%;
        margin-right: 14px;
        ::v-deep .el-form-item__label{
          color:#fcbf49;
          font-weight: 700;
        }
        ::v-deep .el-input__inner{
          padding-right:30px;
          background: transparent;
          color: #fcbf49;
          font-weight: 700;
          padding-left: 15px;
        }
        ::v-deep .el-select{
          width: 100%;
        }
        ::v-deep .el-select__tags{
          max-width: 180px!important;
          white-space: nowrap!important;
          display: flex!important;
        }
        ::v-deep .el-tag{
          background:  #4B79A1;
          color:white;
        }
        ::v-deep .el-input__prefix{
          display: none;
        }
        .sub_btn{
          color:white;
          font-size:13px;
          height:34px;
          width:92px;
          text-align: center;
          line-height: 34px;
          background: -webkit-linear-gradient(to right, #2a5298, #1e3c72);  /* Chrome 10-25, Safari 5.1-6 */
          background: linear-gradient(to right, #2a5298, #1e3c72); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
          border-radius: 4px;
          user-select: none;
          cursor: pointer;
          margin-left: 120px;
          &:active{
              opacity: 0.7;
          }
        }
      }
    }
  .list_mask{
    position: fixed;
    top:10%;
    right:4%;
    width:calc(92% - 380px);
    height:84%;
    background: rgba(47,62,70,.8);
    border-radius: 8px;
    transition: all 1.5s ease;
    &::-webkit-scrollbar { width: 0 !important }
    ::v-deep .el-table__body-wrapper{
        &::-webkit-scrollbar{
        background-color: #212e3e !important;
        opacity: 1!important;
        height:10px;
        width: 0px;
      }
      &::-webkit-scrollbar-thumb {
          /*滚动条里面小方块*/
          border-radius: 10px;
          background-color: #02adf7;
          background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);
      }
    }
     ::v-deep .el-table__row{
      background: transparent;
    }
    ::v-deep .el-table tr{
      background-color: transparent!important;
    }
    ::v-deep .el-table th{
      background-color: transparent!important;
    }
    ::v-deep .el-table__row>td{
      border: none;
    }
    ::v-deep .el-table::before {
      height: 0px;
    }
    ::v-deep .is-leaf{
      color:white;
    }
    ::v-deep .el-table--enable-row-hover .el-table__body tr:hover>td{
      background-color: #212e3e !important;
    }
    .el-pagination{
      text-align: right;
      margin-right:6%;
      margin-top:8px;
    }
    ::v-deep .btn-prev{
       background: transparent;
       color:white
    }
    ::v-deep .btn-next{
       background: transparent;
       color:white
    }
    ::v-deep .el-icon-more{
      background: transparent;
      color:white;
    }
    ::v-deep .el-icon-d-arrow-right{
       background: transparent;
      color:white;
    }
    ::v-deep .el-icon-d-arrow-left{
       background: transparent;
      color:white;
    }
    ::v-deep .number{
      background: transparent;
      color:white
    }
    ::v-deep  .active{
      color:#219ebc;
    }
  }
  .list_mask_active{
    height: 60%;
    transition: all 1.5s ease;
  }
  .echarts_mask{
        position: fixed;
        bottom:5%;
        right:4%;
        width:calc(92% - 380px);
        height:22%;
        background: rgba(47,62,70,.8);
        border-radius: 8px;
        transform: translateX(106%);
        transition: all 1.5s ease;
        .container{
            position: absolute;
            bottom: 30%;
            left: -6%;
            cursor: pointer;
            width:80px;
            height:80px;
            transform: rotate(90deg);
            transition: all 1.5s ease;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            pointer-events: auto;
        }
        .container_active{
            transform: rotate(270deg);
            transition: all 1.5s ease;
        }
        .chevron {
            position: absolute;
            top:12px;
            width: 28px;
            height: 8px;
            opacity: 0;
            transform: scale3d(0.5, 0.5, 0.5);
            animation: move 3s ease-out infinite;
            cursor: pointer;
        }
        .chevron:first-child {
            animation: move 3s ease-out 1s infinite;
        }
        .chevron:nth-child(2) {
            animation: move 3s ease-out 2s infinite;
        }
        .chevron:before,
        .chevron:after {
            content: ' ';
            position: absolute;
            top: 0;
            height: 100%;
            width: 51%;
            background: #fff;
        }
        .chevron:before {
            left: 0;
            transform: skew(0deg, 30deg);
        }
        .chevron:after {
            right: 0;
            width: 50%;
            transform: skew(0deg, -30deg);
        }
        @keyframes move {
            25% {
                opacity: 1;
            }
            33% {
                opacity: 1;
                transform: translateY(30px);
            }
            67% {
                opacity: 1;
                transform: translateY(40px);
            }
            100% {
                opacity: 0;
                transform: translateY(55px) scale3d(0.5, 0.5, 0.5);
            }
        }
      #charts{
          position: absolute;
          height:116%;
          width:96%;
          left:2.5%;
      }
  }
  .echarts_mask_active{
    transform: translateX(0);
    transition: all 1.5s ease;
  }
  .instructions{
      text-align: right;
      margin-right:80px;
      margin-top: 20px;
      color:gray;
    }
}
</style>