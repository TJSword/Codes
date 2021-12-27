<template>
  <div class="goosMarket_com">
      <div class="LandParameter_box">
          <div class="chooseLand_box">
               <el-select v-model="time" placeholder="选择等时圈范围" size="small" class="select">
                    <el-option
                    v-for="item in timeArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                 <el-autocomplete
                    class="inline-input"
                    style="width:180px"
                    v-model="name"
                    :fetch-suggestions="querySearch"
                    placeholder="搜索项目名称"
                    :trigger-on-focus="false"
                    @select="handleSelect"
                    size="small"
                    value-key="name"
                ></el-autocomplete>
          </div>
          <dv-border-box-2 class="info_box">
              <div class="title">竞品列表</div>
              <el-table
                  :data="tableData"
                  style="width:100%;background:transparent;color:white;margin-top:2px;"
                  height="600">
                  <el-table-column
                    prop="name"
                    label="项目名"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="area_increased"
                    label="供应面积(万㎡)"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="area_sales"
                    label="成交面积(万㎡)"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="qhzq"
                    label="去化周期(年)"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="avg"
                    label="成交均价(元/㎡)"
                    align="center">
                  </el-table-column>
                </el-table>
          </dv-border-box-2>
          <div class="next_btn" @click="currentMenu">下一步</div>
      </div>
      <dv-border-box-2 class="gql_box">
          <div class="title">市场供求价</div>
          <div id="qglEcharts"></div>
      </dv-border-box-2>
      <dv-border-box-2 class="client_box">
        <div class="title">市场客户构成</div>
        <dv-loading v-if="showLoading">Loading...</dv-loading>
        <dv-active-ring-chart v-else :config="ringChartConfig" style="width:100%;height:100%"/>
      </dv-border-box-2>
      <dv-border-box-2 class="marketInfo_box">
          <div class="item">
              <div class="title">市场均价</div>
              <div class="value">
                  <span class="value_num">{{marketInfo.marketAvg}}</span>
                  <span class="unit">元/㎡</span>
               </div>
          </div>
           <div class="item">
              <div class="title">价格区间</div>
              <div class="value">
                  <span class="value_num">{{marketInfo.sec}}</span>
                  <span class="unit">元/㎡</span>
               </div>
          </div>
           <div class="item">
              <div class="title">供应量(近一年)</div>
              <div class="value">
                  <span class="value_num">{{marketInfo.market_supply}}</span>
                  <span class="unit">万㎡</span>
               </div>
          </div>
          <div class="item">
              <div class="title">成交量(近一年)</div>
              <div class="value">
                  <span class="value_num">{{marketInfo.market_salse}}</span>
                  <span class="unit">万㎡</span>
               </div>
          </div>
          <div class="item">
              <div class="title">市场存量</div>
              <div class="value">
                  <span class="value_num">{{marketInfo.market_cl}}</span>
                  <span class="unit">万㎡</span>
               </div>
          </div>
          <div class="item">
              <div class="title">市场去化周期</div>
              <div class="value">
                  <span class="value_num">{{marketInfo.market_qhzq}}</span>
                  <span class="unit">年</span>
               </div>
          </div>
      </dv-border-box-2>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import locationResearch  from "../../../api/locationResearch"

export default {
    computed:{
        ...mapGetters(['point','locationId','map'])
    },
    data(){
        return{
             token:'pk.eyJ1IjoiMTU5MDk4Mzk1NjQiLCJhIjoiY2tpZmt0MThrMGtwcTJ5bngxN2xqNnYzeCJ9.erBGt3UuT5gNjeD-d_p_VA',
             tableData:[],
             marketInfo:{},
             goodsIds:[],
             allGoodsInfo:[],
             showLoading:true,
             time:'',
             name:'',
             ringChartConfig:{
                data:[],
                lineWidth:20,
                radius:'60%',
                activeRadius:'65%',
                activeTimeGap:1500
             },
             timeArr:[{
                 label:'等时圈范围：10min',
                 value:'10'
             },{
                 label:'等时圈范围：15min',
                 value:'15'
             },{
                 label:'等时圈范围：20min',
                 value:'20'
             },{
                 label:'等时圈范围：25min',
                 value:'25'
             },{
                 label:'等时圈范围：30min',
                 value:'30'
             },{
                 label:'等时圈范围：35min',
                 value:'35'
             },{
                 label:'等时圈范围：40min',
                 value:'40'
             }]
        }
    },
    watch:{
        time:{
            handler(newVal){
                this.getTImeCircle(newVal)
                this.showLoading = true
                this.$store.dispatch('setCircleTime',newVal)
            }
        }
    },
    methods:{
        handleSelect(item){
            console.log(item)
            locationResearch.getGoodsInfo(item.id).then(res=>{
                console.log(res.data.data)
                let point = res.data.data.coordinate.split(',')
                this.map.flyTo({
                    center:[point[0]-0.015,point[1]],
                    zoom: 12.5,
                    pitch: 45
                })
                console.log(this.allGoodsInfo)
                let data = this.allGoodsInfo
                let flag = true
                data.forEach(item=>{
                    if(item.id === res.data.data.id){
                        flag = false
                    }
                })
                console.log(flag)
                if(flag){
                    data.push(res.data.data)
                    this.setGoodsLayer(data)
                }
            })
        },
        querySearch(name,cb){
            console.log(name)
            locationResearch.getSearching(name).then(res=>{
                cb(res.data.data)
            })
        },
         currentMenu(){
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
                });
            //注销地图事件
            this.map.off('click','goodsPoints',this.goodsPoiHandle)
            this.map.off('click','goodsName',this.goodsNameHandle)
            this.map.off('click',this.mapHandle)
            locationResearch.saveGoods({
                locationId:this.locationId,
                ids:this.goodsIds.join(','),
                duration:this.time
            }).then(res=>{
                if(res.data.code === 0){
                    setTimeout(_=>{
                        loading.close();
                        this.$router.push({
                            name:'InitialAdjustment'
                        })
                    },1000)
                   
                }else{
                    this.$message({
                        message: '未知错误,请联系管理员',
                        type: 'error'
                    })
                }
                
            })
        },
        getTImeCircle(time){
            this.$.ajax({
                type: "get",
                async: false, //同步请求
                url: "https://api.mapbox.com/isochrone/v1/mapbox/" + 'driving' + "/" + this.point.join(',') + "?contours_minutes=" + time + "&polygons=true&access_token=" + this.token,
                dataType: "json",
                success: res => {
                    let data = res.features[0].geometry.coordinates
                    this.setTimeCircle(res.features[0])
                    let coordinatesStr = []
                    data[0].forEach(item=>{
                        coordinatesStr.push(item.join(','))
                    })
                    coordinatesStr = coordinatesStr.join(';')
                    let params = {
                        coordinates:coordinatesStr,
                        locationId:this.locationId,
                    }
                    this.reloadGoods = true
                    this.getGoosLIst(params)
                    this.getCustomerInfo(params)
                },
          });
        },
        getGoosLIst(data){
            locationResearch.getGoodsList(data).then(res=>{
                console.log(res.data.data.competitorsRst)
                if(this.reloadGoods){
                    this.goodsIds = res.data.data.competitorsRst
                    this.setGoodsLayer(this.goodsIds)
                    this.allGoodsInfo =  res.data.data.competitorsRst
                }
                this.chartData = res.data.data.qgRst
                this.tableData = res.data.data.competitorsRst
                let {marketAvg,sec,market_supply,market_salse,market_cl,market_qhzq} = res.data.data
                this.marketInfo = {marketAvg,sec,market_supply,market_salse,market_cl,market_qhzq}
                console.log(this.marketInfo)
                this.goodsIds = []
                this.tableData.forEach(item=>{
                    this.goodsIds.push(item.id)
                })
                
                let map = this.map
                let color = ["match", ["get", "id"],this.goodsIds,'#fcbf49','#463f3a']
                map.setPaintProperty("goodsPoints", "circle-color",color)
                this.qglEchartsInit()
            })
        },
        //获取市场客户模型
        getCustomerInfo(data){
            locationResearch.getCustomerInfo(data).then(res=>{
                console.log(res.data.data.rst)
                let data = res.data.data.rst
                let ringData = []
                data.forEach(item=>{
                    if(item.ratio != 0 ){
                        ringData.push({
                            name:item.moduleName,
                            value:item.ratio
                        })
                    }
                })
                this.ringChartConfig.data = ringData
                this.showLoading = false
            })
        },
        goodsPoiHandle(e){
            let map = this.map
            e.originalEvent.cancelBubble = true;
            let data = e.features[0].properties
            if(this.goodsIds.includes(data.id)){
                this.goodsIds.splice(this.goodsIds.findIndex(item=>item === data.id),1)
            }else{
                this.goodsIds.push(data.id)
            }
            //点亮点灭
            let color = ["match", ["get", "id"],this.goodsIds,'#fcbf49','#463f3a']
            map.setPaintProperty("goodsPoints", "circle-color",color)

            //请求变化后数据
            let params = {
                locationId:this.locationId,
                ids:this.goodsIds.join(',')
            }
            this.showLoading = true
            this.reloadGoods = false
            this.getGoosLIst(params)
            this.getCustomerInfo(params)
        },
        goodsNameHandle(e){
              e.originalEvent.cancelBubble = true;
              this.$emit('goodId',{
                  id:e.features[0].properties.id,
                  showGoodsInfo:true
              })
        }, 
        mapHandle(e){
              if (e.originalEvent.cancelBubble)return;
               this.$emit('goodId',{
                  showGoodsInfo:false
              })
        },
        setGoodsLayer(data){
            console.log(data)
            let map = this.map
            let geojsonData = {
                type:'FeatureCollection',
                features:[]
            }
            data.forEach(item=>{
                if(item.coordinate){
                    let coordinate = item.coordinate.split(',')
                    geojsonData.features.push({
                    type:'Feature',
                    geometry:{
                        type:'Point',
                        coordinates:coordinate
                    },
                    properties:{
                            id:item.id,
                            title:item.name,
                            point:item.coordinate.split(',')
                        }
                    })
                }
            })
            console.log(geojsonData)
            let goodsSource = map.getSource('goodsSource')
            if(goodsSource==undefined){
            map.addSource('goodsSource',{
                type:'geojson',
                data:{
                type:'FeatureCollection',
                features:[]
                }
            })
            map.addLayer({
                id:'goodsPoints',
                type:'circle',
                source:'goodsSource',
                paint: {
                    'circle-color': '#fcbf49',
                    "circle-radius": 8,
                    'circle-stroke-width': 0.5,
                    'circle-stroke-color': 'white'
                }
            },'house_point')
             map.addLayer({
              id: "goodsName",
              type: "symbol",   /* symbol类型layer，一般用来绘制点*/
              source: "goodsSource",
              paint: {
                 "text-color": "#11b4da",
              },
              layout: {
                  'symbol-placement':'point', //默认值
                  "text-field": "{title}",
                  "text-offset": [0, -2],
                  "text-anchor": "top" ,
                  "icon-allow-overlap":true,
                  "icon-ignore-placement":true
              }
          },'house_point');
          map.on('click','goodsPoints',this.goodsPoiHandle)
          map.on('click','goodsName',this.goodsNameHandle)
          map.on('click',this.mapHandle)
        }
        map.getSource('goodsSource').setData(geojsonData)
        },
        setTimeCircle(data){
            console.log(this.map)
            let map = this.map
            let source = map.getSource('timeCircle')
            if(source === undefined){
                map.addSource("timeCircle", {
                        "type": "geojson",
                        "data": {
                            "type": "FeatureCollection",
                            "features": []
                        }
                    });
                map.addLayer({
                    "id": "timeCircle_fill",
                    "type": "fill",
                    "source": "timeCircle",
                    "layout": {
                        // "visibility":"visible"
                    },
                    "paint": {
                        "fill-color": "#fcbf49",
                        "fill-opacity": 0.2,
                    }
                });
                map.addLayer({
                    "id": "timeCircle_line",
                    "type": "line",
                    "source": "timeCircle",
                    "layout": {},
                    "paint": {
                        "line-color": "#fcbf49",
                        "line-opacity": 1,
                    }
        });
            }
            map.getSource('timeCircle').setData({
                "type": "FeatureCollection",
                "features": [data]
            })
        },
        qglEchartsInit(){
            let chartData = this.chartData
            console.log(chartData)
            let xAxis = []
            let series = [{
                name:'供应面积',
                type:'bar',
                data:[],
                itemStyle:{
                normal:{
                    color: '#e09f3e'
                }
                },
            },{
                name:'成交面积',
                type:'bar',
                data:[],
                itemStyle:{
                normal:{
                    color: '#98c1d9'
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
                    color: '#f4a261'
                }
                },
            }]
            chartData.forEach(item=>{
                xAxis.push(item.month)
                series[0].data.push(item.supply_area)
                series[1].data.push(item.sales_area)
                series[2].data.push(item.avg)
            })
            let myChart = this.$echarts.init(document.getElementById('qglEcharts'))
            // var colors = ['#5470C6', '#91CC75', '#EE6666'];
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
                    data: ['供应面积', '成交面积','成交均价'],
                    textStyle:{
                    color:'white'
                    },
                    top:12,
                    
                },
                grid:{
                    top: '20%',
                    bottom: '12%',
                    left:'5%',
                    right:'5%',
                    containLabel: true
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
                        name: '建筑面积(万㎡)',
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
                        name: '成交均价(元/㎡)',
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
        }
    },
    created(){
        this.time = '15'
    },
}
</script>
<style lang="scss" scoped>
.goosMarket_com{
    height: calc(100% - 60px);
    width: 100%;
    position: fixed;
    top:60px;
    pointer-events:none;
    .LandParameter_box{
        position: absolute;
        padding: 30px 0 ;
        height: calc(100% - 60px);
        width: 30%;
        left:0;
        top:0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        pointer-events:auto;
        .chooseLand_box{
            height: 40px;
            width: 80%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .select{
                width:180px ;
            }
            ::v-deep .el-input__inner{
                background: transparent;
                color: rgb(252, 191, 73);
                border-color: white;
            }
            .new_btn{
                position: relative;
                color:white;
                font-size:12px;
                padding:8px 16px;
                letter-spacing: 1.5px;
                background: #457fca;  /* fallback for old browsers */
                background: -webkit-linear-gradient(to right, #5691c8, #457fca);  /* Chrome 10-25, Safari 5.1-6 */
                background: linear-gradient(to right, #5691c8, #457fca); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
                border-radius: 4px;
                user-select: none;
                cursor: pointer;
                &:active{
                    opacity: 0.7;
                }
            }
        }
        .info_box{
            height: 85%;
            width: 76%;
            background: rgba(47,62,70,.7);
            flex-shrink:1;
            border-radius: 8px;
            padding: 0 2%;
            display: flex;
            flex-direction: column;
            .title{
                color: rgba(191, 191, 191, 1);
                font-size: 14px;
                margin-top:16px;
                text-align: center;
            }
            ::v-deep .el-table__body-wrapper{
            &::-webkit-scrollbar{
            background-color: #212e3e !important;
            opacity: 1!important;
            height:10px;
            width: 5px;
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
            border-color: rgba(255, 255, 255, .3);
        }
        ::v-deep .el-table--enable-row-hover .el-table__body tr:hover>td{
        background-color: #212e3e !important;
        }
        }
        .next_btn{
            margin-left:60%;
            border-radius: 8px;
            position: relative;
            color:white;
            font-size:12px;
            padding:8px 16px;
            letter-spacing: 1.5px;
            background: #457fca;  /* fallback for old browsers */
            background: -webkit-linear-gradient(to right, #5691c8, #457fca);  /* Chrome 10-25, Safari 5.1-6 */
            background: linear-gradient(to right, #5691c8, #457fca); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
            border-radius: 4px;
            user-select: none;
            cursor: pointer;
            &:active{
                opacity: 0.7;
            }
        }
    }
    .gql_box{
        position: absolute;
        height:30%;
        width: 47%;
        left:30%;
        bottom:2%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        background: rgba(47,62,70,.7);
        border-radius: 8px;
        pointer-events:auto;
        #qglEcharts{
            height: 85%;
            width: 100%;
        }
        .title{
            text-align: center;
            color: rgba(191, 191, 191, 1);
            font-size: 14px;
            margin-top:16px;
            text-align: center;
        }
    }
    .client_box{
        position: absolute;
        height:30%;
        width: 16%;
        right:4%;
        bottom:2%;
        background: rgba(47,62,70,.7);
        border-radius: 8px;
        pointer-events:auto;
         ::v-deep .border-box-content{
            display: flex;
            flex-direction: column;
        }
        .dv-loading{
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index:999;
            color:white;
        }
         .title{
            text-align: center;
            color: rgba(191, 191, 191, 1);
            font-size: 14px;
            margin-top:16px;
            text-align: center;
        }
        
    }
    .marketInfo_box{
        position: absolute;
        height:54%;
        width: 14%;
        padding: 1%;
        right:4%;
        bottom:37%;
        display: flex;
        align-items: center;
        background: rgba(47,62,70,.7);
        border-radius: 8px;
        pointer-events:auto;
        ::v-deep .border-box-content{
            display: flex;
            flex-wrap: wrap;
            align-content:space-around;
            padding-left: 30px;
        }
        .item{
            width: 100%;
            padding: 5px 0;
            .title{
                color:rgba(191, 191, 191, 1);
                font-size: 14px;
            }
            .value{
                 white-space: nowrap;
                .value_num{
                    color:rgba(255, 141, 26, 1);
                    font-size: 30px;
                    font-weight: 700;
                }
                .unit{
                    color:white;
                    margin-left: 4px;
                    font-size: 14px;
                }
            }
        }
    }
}

</style>