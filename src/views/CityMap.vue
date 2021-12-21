<template>
    <div class="citymap_home">
        <div class="side_bar" :style="{'width':sidebarW+'px'}">
            <div class="handle" @mousedown="changeSidebar"></div>
            <el-tabs class="cm_tab" v-model="curCitymap" @tab-click="changeCmTab">
                <el-tab-pane label="图层" name="market_data">
                    <MarketData :curTab="curCitymap" />
                </el-tab-pane>
                <!-- <el-tab-pane label="评估" name="plate_assess">
                    <PlateAssess :curTab="curCitymap" />
                </el-tab-pane> -->
                <el-tab-pane label="矩阵" name="gebo">
                    <GeboMatrix :curTab="curCitymap" :sidebarW="sidebarW" />
                </el-tab-pane>
            </el-tabs>
        </div>
        <MapComponent mapType="cityMap" />
    </div>
</template>
<script>
import MarketData from "@/components/main/citymap/marketData.vue"
import GeboMatrix from "@/components/main/citymap/geboMatrix.vue"
import PlateAssess from "@/components/main/citymap/plateAssess.vue"
import MapComponent from "@/components/common/MapComponent.vue"

import { mapGetters } from "vuex" 
export default {
    name:'citymap_home',
    components:{
        MarketData,
        GeboMatrix,
        PlateAssess,
        MapComponent
    },
    data(){
        return {
            sidebarW:300,//侧边栏宽度
            curCitymap:"market_data",//当前城市地图模块
        }
    },
    created(){
    },
    mounted(){

    },
    computed:{
        ...mapGetters(['cityCode','city_map','cityMapIsload'])
    },
    watch:{
        cityMapIsload:{
            handler(newVal){
                if(newVal){
                    setTimeout(_=>{
                        this.loadPlates()
                        //this.initLayer()
                    },1000)
                }
            },
            deep:true
        },
        cityCode:{
            handler(newVal){
                if(this.cityMapIsload){
                    let map = this.city_map
                    map.setFilter('plates_fill',["==","land_cityno",newVal])
                    map.setFilter('plate_line',["==","land_cityno",newVal])
                    map.setFilter('plate_labels',["==","land_cityno",newVal])
                }
            },
            deep:true
        },
    },
    methods:{
        //修改侧边栏宽度
        changeSidebar(e){
            let e1 = e.currentTarget;
            let e2 = e.target;
            if(e1 === e2){ //阻止子元素冒泡
                document.onmousemove = (e)=>{
                    //更新移动量
                    this.sidebarW += e.movementX;
                };
                document.onmouseup = (e) => {
                document.onmousemove = null;
                document.onmouseup = null;
                };
            }
        },
        //初始化图层
        initLayer(){
            var map = this.city_map
            map.setLayoutProperty('plate_fill','visibility','none')
            map.setLayoutProperty('plate_line','visibility','none')
            map.setLayoutProperty('plate_labels','visibility','none')
            map.setLayoutProperty('plates_fill','visibility','visible')
            map.setLayoutProperty('plates_line','visibility','visible')
            map.setLayoutProperty('plates_labels','visibility','visible')
            map.setPaintProperty('plate_line','line-color','#fff')
        },
        //切换城市地图子菜单
        changeCmTab(val){
            console.log(val)
            var map = this.city_map
            if(val!=='market_data'){
                map.setLayoutProperty('plates_fill','visibility','visible')
                map.setLayoutProperty('plates_line','visibility','visible')
                map.setLayoutProperty('plates_labels','visibility','visible')
                map.setLayoutProperty('plate_fill','visibility','none')
                map.setLayoutProperty('plate_line','visibility','none')
                map.setLayoutProperty('plate_labels','visibility','none')
                map.setPaintProperty("plate_fill", "fill-color","rgba(58, 88, 125, 1)");
                map.setPaintProperty("plate_fill", "fill-opacity", 0.2);
                map.setPaintProperty("plate_line", "line-opacity", 0.1);
            }
        },
        //加载板块数据
        loadPlates(){
            var that = this
            var map = this.city_map
            let source = map.getSource('source_cityplates')
            if(source===undefined){
                var code = this.cityCode?this.cityCode:'510100'
                var cityPlatesLayer = this.geoserverURL+'/geoserver/gwc/service/tms/1.0.0/touziyun:tzy_city_plates@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf'
                map.addSource('source_cityplates',{
                    type: "vector",
                    scheme: "tms",
                    tiles: [cityPlatesLayer]
                })
                map.addLayer({ //通用板块-填充
                    id: "plates_fill",
                    type: "fill",
                    source: "source_cityplates",
                    "source-layer":"tzy_city_plates",
                    filter:["==","land_cityno",code],
                    paint: {
                        "fill-color": "rgba(58, 88, 125, 1)",
                        "fill-opacity": 0.2
                    },
                    layout: {
                        "visibility":"none"
                    }
                });
                map.addLayer({  //通用板块-描边
                    id: "plates_line",
                    type: "line",
                    source: "source_cityplates",
                    "source-layer":"tzy_city_plates",
                    filter:["==","land_cityno",code],
                    paint: {
                        "line-color":'rgba(255, 255, 255,1)',
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
                    source: "source_cityplates",
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
                        "text-color": 'rgba(255, 255, 255, 1)',
                        "text-halo-color": "rgba(0,0,0,0.8)",
                        "text-halo-width": 1.5,
                        "text-halo-blur": 0.5
                    }
                });
            }
        },
    }
}
</script>
<style lang="scss">
.citymap_home{
    .side_bar{
        position: fixed;
        top: 0;
        left: 80px;
        bottom: 0;
        width: 300px;
        z-index: 99999;
        background: rgba(19,37,43,0.9);
        user-select: none;
        .handle{
            position: absolute;
            right: 0px;
            top: 0;
            width: 5px;
            background: none;
            cursor: w-resize;
            height: 100%;
        }
        .cm_tab{
            padding: 10px 10px;
            .el-tabs__nav-wrap::after{
                background: linear-gradient(90deg, rgba(0,188,212,0.71), rgba(33,150,243,0.76));
            }
            .el-tabs__active-bar{
                background-color: #ffc107;
            }
            .el-tabs__item{
                color: #c0c4cc;
            }
            .el-tabs__item.is-active {
                font-weight: bold;
                font-size: 18px;
                color: #ffc107;
            }
        }
        
    }
    .el-tree{
        background: none;
        color: #ebeef5;
        padding-right: 5px;
    }
    .el-tree-node__content{
        color: #99faff;
        background: none !important;
    }
    .land_name:hover{
        color: #ffb700 !important;
        font-weight: bold;
    }
    .el-tree-node:focus>.el-tree-node__content{
        background: none !important;
    }
    .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content .land_name{
        background: none;
        color: #ffb700 !important;
        font-weight: bold;
    }
    .el-tree-node__expand-icon.is-leaf{
        display: none;
    }
    .mapboxgl-popup-close-button{
        color: #fff;
        
    }
    .infos_wrap{
        width: 300px;
    }
    .item_name{
        width: 100% !important;
        margin-bottom: 8px;
    }
}
</style>