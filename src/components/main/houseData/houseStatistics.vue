<template>
    <div class="houseStatistics_wrap">
      <div class="diver">数据统计维度</div>
       <el-select v-model="dimension" size="small" @change="selectChange" placeholder="数据统计维度" :clearable="false" style="margin:20px 0 4px 15px">
          <el-option :label="item.label" :value="item.value" v-for="item in dimensions" :disabled="item.disabled" :key="item.value"></el-option>
      </el-select>
      <div class="diver">
        <span>查询条件</span>
        <!-- <i class="iconfont icon-set_icon" @click="showSettingHandle"></i> -->
      </div>
      <QHStatistics v-if="dimension === 'QH'" />
      <WDStatistics v-if="dimension === 'WD'" />
      <FQStatistics v-if="dimension === 'FQ'" />
      <JPStatistics v-if="dimension === 'JP'" />
      <PHStatistics v-if="dimension === 'PH'" />
      <PieceWise ref="setting" />
    </div>
</template>

<script>
// import House from "@/api/houseDataApi.js"
import { mapGetters } from "vuex" 
import QHStatistics from "./QHStatistics.vue"
import WDStatistics from "./WDStatistics.vue"
import FQStatistics from "./FQStatistics.vue"
import JPStatistics from "./JPStatistics.vue"
import PHStatistics from "./PHStatistics.vue"
import PieceWise from "./Piecewise.vue"
export default {
  components:{QHStatistics,WDStatistics,FQStatistics,JPStatistics,PHStatistics,PieceWise},
    computed:{
        ...mapGetters(['houseDataMap'])
    },
    data(){
        return{
          dimension:'QH',
          showSetting:false,
          dimensions:[{
            label:'区划统计',
            value:'QH',
            disabled:false
          },{
            label:'维度统计',
            value:'WD',
            disabled:false
          },{
            label:'房企统计',
            value:'FQ',
            disabled:false
          },{
            label:'竞品统计',
            value:'JP',
            disabled:false
          },{
            label:'排行榜',
            value:'PH',
            disabled:false
          }]
        }
    },
    watch:{
       
    },

    methods:{
      showSettingHandle(){
       this.$refs.setting.dialogVisible = true
      },
      selectChange(val){
        console.log(val)
        // if(val === 'WD' || val === 'QH'){
        //   this.houseDataMap.setLayoutProperty('plates_fill',"visibility", 'visible')
        //   this.houseDataMap.setLayoutProperty('plate_line',"visibility", 'visible')
        //   this.houseDataMap.setLayoutProperty('plate_labels',"visibility", 'visible')
        //   this.houseDataMap.setLayoutProperty('plate_fill',"visibility", 'visible')
        //   this.houseDataMap.setLayoutProperty('plates_line',"visibility", 'visible')
        //   this.houseDataMap.setLayoutProperty('plates_labels',"visibility", 'visible')
        //   this.houseDataMap.setPaintProperty('plates_fill',"fill-color", '#fcbf49')
        //   this.houseDataMap.setPaintProperty('plate_fill',"fill-color", '#fcbf49')
        // }else{
        //   this.houseDataMap.setLayoutProperty('plates_fill',"visibility", 'none')
        //   this.houseDataMap.setLayoutProperty('plate_line',"visibility", 'none')
        //   this.houseDataMap.setLayoutProperty('plate_labels',"visibility", 'none')
        //   this.houseDataMap.setLayoutProperty('plate_fill',"visibility", 'none')
        //   this.houseDataMap.setLayoutProperty('plates_line',"visibility", 'none')
        //   this.houseDataMap.setLayoutProperty('plates_labels',"visibility", 'none')
        // }
        
      },
      setRegionLayer(){
          let map = this.houseDataMap
          console.log(map)
          var code = '510100'
          var cityPolygonLayer = this.geoserverURL+'/geoserver/gwc/service/tms/1.0.0/city_100000:city_polygon@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf'
          map.addSource("part_data", {
            type: "vector",
              scheme: "tms",
              tiles: [cityPolygonLayer]
          });
          map.addLayer({ //通用行政区-填充
            id: "plate_fill",
            type: "fill",
            source: "part_data",
            "source-layer": "city_polygon",
            paint: {
              "fill-color": "#fcbf49",
              "fill-opacity": 0.45
              // ["case",
              //   ["boolean", ["feature-state", "hover"], false],
              //   0.1,
              //   0.2
              // ]
            },
            layout: {
              "visibility": "none"
            }
          });
          map.addLayer({  //通用行政区-描边
            id: "plate_line",
            type: "line",
            source: "part_data",
            "source-layer": "city_polygon",
            layout: {
              "visibility": "none"
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
              "visibility":"none"
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
                        "fill-opacity": 0.45
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
     
    },
    mounted(){
      setTimeout(_=>{
        this.setRegionLayer()
      },1500)
    },
    beforeDestroy(){
      console.log('触发了')
    }
}
</script>
<style>
.el-table .success-row {
    background: #f0f9eb;
  }
</style>
<style lang="scss" scoped>
.houseStatistics_wrap{
    height:800px;
    width:300px;
    position: relative;
    .diver{
        padding: 6px 20px;
        border-bottom: #464646 1px solid;
        font-size: 14px;
        color: #8bc34a;
        display: flex;
        align-items: center;
        width: 215px;
        justify-content: space-between;
        .icon-set_icon{
            color:white;
            font-size: 18px;
            cursor: pointer;
        }
    }
    ::v-deep .el-select{
      background: transparent!important;
      width: 221px;
      ::v-deep .el-input{
        background: transparent!important;
      }
     
    }
    .el-select{
      ::v-deep .el-input__inner {
        background: transparent!important;
        padding-right: 30px;
        background: transparent;
        color: #fcbf49!important;
        font-weight: 700;
        padding-left: 15px;
      }
    }
}
</style>