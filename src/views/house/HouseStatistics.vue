<template>
    <div class="houseStatistics_wrap">
      <HouseRegionDetail :regionno = chooseRegionno v-if="showRegionDetail" />
      <ProjectDetail :proPoi="proPoi" :proId="proId" :proTitle="proTitle" v-if="showDetail" />
      <Map @map="getMap" />
      <div class="from_box">
        <el-form :inline="true" :model="formInline" size="small" style="text-align: start;">
          <el-form-item label="">
              <el-select v-model="formInline.kind" placeholder="区域类型" clearable >
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
               <el-date-picker type="date" placeholder="开始日期" v-model="formInline.startDate" value-format="yyyy-MM-dd"  style="width: 100%;"></el-date-picker>
            </el-form-item>
             <el-form-item>
            <el-date-picker type="date" placeholder="结束日期"   v-model="formInline.endDate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <div class="query_btn" @click="getViewList">查询</div>
            </el-form-item>
            </el-form>
        </div>
         <dv-border-box-12 class="list_mask">
            <el-table 
            :data="tableData"
            style="width: 96%;margin-left:2%;margin-top:1%;background: transparent;color:white"
            :height="tableHeight"
            :cell-style="cellStyle"
            @cell-click="cellClick"
            >
           <el-table-column
            prop="region"
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
           <el-table-column
            prop="tfnum"
            label="退房套数">
          </el-table-column>
          <el-table-column
            prop="tfarea"
            label="退房面积(万㎡)">
          </el-table-column>
            </el-table>
             <el-pagination
            layout="prev, pager, next"
            :page-size="10"
            :total="totalPage"
            @current-change="pageChange">
          </el-pagination>
        </dv-border-box-12>
        <dv-border-box-12 class="echarts_mask">
            <div id="charts"></div>
        </dv-border-box-12>
    </div>
    
</template>

<script>
import House from "../../api/House"
import Map from "../../components/common/map"
import HouseRegionDetail from "../../components/House/HouseRegionDetail"
export default {
    components:{
            Map,HouseRegionDetail
    },
    data(){
        return{
            formInline:{
                kind:'region',
                startDate:'',
                endDate:'',
                propertyType:'',
                buildForm:'',
                page:1,
                limit:10
            },
            regionArr:[],
            propertyArr:[],
            buildArr:[],
            propertyType:[],
            buildForm:[],
            tableData:[],
            tableHeight:550,
            totalPage:0,
            chartData:[],
            showRegionDetail:false
        }
    },
    watch:{
        propertyType(newVal){
           this.formInline.propertyType = newVal.join(',')
        },
        buildForm(newVal){
           this.formInline.buildForm = newVal.join(',')
        }
    },
    methods:{
        getMap(map){
            this.map = map
            map.flyTo({
              center:[102.20958588574217,25.089342016906524],
              zoom: 9.2,
            })
        },
        getViewList(){
            House.getTable(this.formInline).then(res=>{
             this.tableData = res.data.data.list
             this.totalPage = res.data.data.total
            })
            let obj = JSON.parse(JSON.stringify(this.formInline))
            obj.limit = 999
            House.getTable(obj).then(res=>{
              this.chartData = res.data.data.list
              this.regionData = res.data.data.list
              console.log(this.regionData)
              this.drawEcharts()
              this.setRegionLayer()
            })
        },
        cellStyle(row, column, rowIndex, columnIndex){
      if(row.column.label === '区域'){
            return 'color:#fcbf49;font-weight:700;cursor:pointer'
           }
        },
        cellClick(row, column, cell, event){
            if(column.label === '区域'){
                this.chooseRegionno = row.regionno
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
                xAxis.push(item.region)
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
          let map = this.map
          let data = []
          this.regionData.forEach((item,index)=>{
            if(item.coordinates){
              if(item.coordinates.includes('|')){
                let arr = item.coordinates.split('|')
                let regionArr = []
                arr.forEach(item=>{
                  regionArr.push(item.split(';'))
                })
                let regionArr2 =[]
                regionArr.forEach((item1,index1)=>{
                  regionArr2.push([[]])
                  item1.forEach(item2=>{
                    regionArr2[index1][0].push(item2.split(','))
                  })
                })
                data.push({
                    "type": "Feature",
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates":regionArr2
                    },
                    "properties": {
                      "title": item.region,
                  }
                })
              }else{
                let regionArr = []
                let arr =  item.coordinates.split(';')
                arr.forEach(item1=>{
                    regionArr.push(item1.split(','))
                })
                data.push({
                    "type": "Feature",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates":[regionArr]
                    },
                    "properties": {
                      "title": item.region,
                  }
                })
              }
            }
          })
            map.addSource("region", {
                  "type": "geojson",
                  "data": {
                    "type": "FeatureCollection",
                    "features": data
                  }
            });
            map.addLayer({
                "id": "region",
                "type": "line",
                "source": "region",
                "layout": {},
                "paint": {
                    "line-color": "#fcbf49",
                    "line-opacity": 1,
                }
            });
            map.addLayer({
                "id": "regionLayer",
                "type": "fill",
                "source": "region",
                "layout": {},
                "paint": {
                    "fill-color": "#fcbf49",
                    "fill-opacity": 0.2,
                }
            });
            map.addLayer({
                  "id": "regionName",
                  "type": "symbol",   /* symbol类型layer，一般用来绘制点*/
                  "source": "region",
                  "paint": {
                  "text-color": "#11b4da",
                  },
                  "layout": {
                      "text-field": "{title}", 
                  }
              });
          
        },
    },
    created(){
        House.getDict('region_type').then(res=>this.regionArr = res.data.data)
        House.getDict('property_type').then(res=>this.propertyArr = res.data.data)
        House.getDict('build_form').then(res=>this.buildArr = res.data.data)
        this.getViewList()
        this.tableHeight = window.innerHeight * 0.52
    }
}
</script>

<style lang="scss" scoped>
.houseStatistics_wrap{
    height:calc(100% - 60px);
    width:100%;
    background: rgba(25,22,22,1);
    position: relative;
    .from_box{
    position: absolute;
    top:3%;
    left:1.5%;
    .el-form-item{
      width:158px;
      margin-right: 14px;
       /deep/.el-form-item__label{
        color:#fcbf49;
        font-weight: 700;
      }
      /deep/.el-input__inner{
        padding-right:30px;
        background: transparent;
        color: #fcbf49;
        font-weight: 700;
      }
      /deep/.el-select{
        width: 100%;
      }
      /deep/.el-select__tags{
        max-width: 180px!important;
        white-space: nowrap!important;
        display: flex!important;
      }
      /deep/.el-tag{
        background:  #4B79A1;
        color:white;
      }
      .query_btn{
        color:white;
        font-size:13px;
        height:34px;
        width:92px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: -webkit-linear-gradient(to right, #2a5298, #1e3c72);  /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #2a5298, #1e3c72); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        border-radius: 4px;
        user-select: none;
        cursor: pointer;
        &:active{
            opacity: 0.7;
        }
      }
    }
  }
  .list_mask{
    position: absolute;
    top:calc(3% + 50px);
    left:1.5%;
    width:49.8%;
    height:64%;
    background: rgba(47,62,70,.8);
    border-radius: 8px;
    /deep/.el-table__body-wrapper{
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
     /deep/.el-table__row{
      background: transparent;
    }
    /deep/.el-table tr{
      background-color: transparent!important;
    }
    /deep/.el-table th{
      background-color: transparent!important;
    }
    /deep/.el-table__row>td{
      border: none;
    }
    /deep/.el-table::before {
      height: 0px;
    }
    /deep/.is-leaf{
      color:white;
    }
    /deep/.el-table--enable-row-hover .el-table__body tr:hover>td{
      background-color: #212e3e !important;
    }
    .el-pagination{
      text-align: right;
      margin-right:6%;
      margin-top:8px;
    }
    /deep/.btn-prev{
       background: transparent;
       color:white
    }
    /deep/.btn-next{
       background: transparent;
       color:white
    }
    /deep/.el-icon-more{
      background: transparent;
      color:white;
    }
    /deep/.el-icon-d-arrow-right{
       background: transparent;
      color:white;
    }
    /deep/.el-icon-d-arrow-left{
       background: transparent;
      color:white;
    }
    /deep/.number{
      background: transparent;
      color:white
    }
    /deep/ .active{
      color:#219ebc;
    }
  }
    .echarts_mask{
        position: absolute;
        bottom:2.5%;
        left:1.5%;
        width:49.8%;
        height:22%;
        background: rgba(47,62,70,.8);
        border-radius: 8px;
    #charts{
        position: absolute;
        height:116%;
        width:96%;
        left:2.5%;
    }
  }
}
</style>