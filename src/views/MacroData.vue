<template>
    <div class="macrodata_wrap">
        <div class="side_bar" :style="{'width':sidebarW+'px'}">
            <div class="handle" @mousedown="changeSidebar"></div>
            <el-tabs class="cm_tab" v-model="curTab" @tab-click="changeTab">
                <el-tab-pane label="宏观" name="macro_data">
                    <MarcroHome />
                </el-tab-pane>
            </el-tabs>
        </div>
        <MapComponent mapType="macroMap" />
    </div>
</template>
<script>
import MapComponent from "@/components/common/MapComponent.vue";
import MarcroHome from "@/components/main/macroData/marcroHome.vue";
import { mapGetters } from "vuex";

export default {
    name:"macrodata",
    components:{
        MapComponent,
        MarcroHome
    },
    data(){
        return {
            sidebarW:300,//侧边栏宽度
            curTab:"macro_data",
        }
    },
    created(){
    },
    mounted(){

    },
    computed:{
        ...mapGetters(['cityCode','macro_map','macroMapIsload'])
    },
    watch:{
        macroMapIsload:{
            handler(newVal){
                if(newVal){
                    setTimeout(_=>{
                        this.loadPlates()
                    },1000)
                }
            },
            deep:true
        },
        cityCode:{
            handler(newVal){
                if(this.macroMapIsload){
                    let map = this.macro_map
                    map.setFilter('plates_fill_macro',["==","land_cityno",newVal])
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
        //加载板块数据
        loadPlates(){
            var that = this
            var map = this.macro_map
            let source = map.getSource('source_cityplates_macro')
            if(source===undefined){
                var code = this.cityCode?this.cityCode:'510100'
                var cityPlatesLayer = this.geoserverURL+'/geoserver/gwc/service/tms/1.0.0/touziyun:tzy_city_plates@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf'
                map.addSource('source_cityplates_macro',{
                    type: "vector",
                    scheme: "tms",
                    tiles: [cityPlatesLayer]
                })
                map.addLayer({ //通用板块-填充
                    id: "plates_fill_macro",
                    type: "fill",
                    source: "source_cityplates_macro",
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
                    id: "plates_line_macro",
                    type: "line",
                    source: "source_cityplates_macro",
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
                    id: "plates_labels_macro",
                    type: "symbol",
                    source: "source_cityplates_macro",
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
        changeTab(val){

        },
    }
}
</script>
<style lang="scss">
.macrodata_wrap{
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
            padding: 10px 20px;
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
}
</style>