<template>
    <!-- 控规矢量图层 -->
    <div class="controlreq_layer">
        <div class="control_bar">
            <div class="item" style="display:flex;margin-bottom:10px;">
                <div class="title">显示控规图层：</div>
                <el-switch v-model="showLayer"></el-switch>
            </div>
            <div class="tips">Tips:数据量较大，首次加载速度较慢。</div>
            <div class="item">
                <div class="title">控规图层透明度:{{opacity}}</div>
                <el-slider :disabled="!showLayer" style="width:100%;margin-top:5px;" v-model="opacity" :step="0.1" ::min="0" :max="1" show-stops @change="changeOpacity"></el-slider>
            </div>
            <div class="item" v-if="controlShare">
                <div style="display:flex;align-items:center;margin-top:20px;margin-bottom:10px;">
                    <div class="title">生成分享码口令给好友：</div>
                    <el-button size="small" @click="setSecretKey()">生成</el-button>
                </div>
                <el-input v-model="secretKey" size="small">
                    <el-button slot="append" size="small"
                    v-clipboard:copy="secretKey"
                    v-clipboard:success="onCopy"
                    v-clipboard:error="onError">复制</el-button>
                </el-input>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import ledgerApi from '@/api/ledgerApi'
export default {
    name:'controlreq',
    props:{
        isShow:{
            type:Boolean,
            default:false
        }
    },
    data(){
        return {
            showLayer:false,
            opacity:1,
            secretKey:'',
        }
    },
    mounted(){

    },
    computed:{
        ...mapGetters(['ledger_map','mapIsload','isAdmin','isSuperUser','userDeptName','controlShare'])
    },
    watch:{
        showLayer:{
            handler(newVal){
                this.loadGeoserverLayers()
                var map = this.ledger_map
                map.setLayoutProperty('geolayer_polygon_fill','visibility',newVal?'visible':'none')
            },
            deep:true
        }
    },
    methods:{
        //获取分享口令
        setSecretKey(){
            var that = this
            ledgerApi.getSecretKey()
            .then(res=>{
                if(res.data.code===0){
                    that.secretKey = res.data.data
                    that.$message.success('分享码已生成')
                }else{
                    that.$message.error(res.data.msg)
                }
            })
        },
        //剪切板拷贝成功
        onCopy(e){
        console.log('You just copied: ' + e.text)
        this.$message.success('分享码已拷贝')
        },
        //剪切板拷贝失败
        onError(e){
        console.log('拷贝失败')
        },
        changeOpacity(val){
            
            var map = this.ledger_map
            map.setPaintProperty('geolayer_polygon_fill','fill-opacity',val)
        },
        //加载geoserver的土地数据
        loadGeoserverLayers(){
            var that = this
            var map = this.ledger_map
            let geo_polygon = map.getSource("geo_polygon")
            if(geo_polygon===undefined){
                //管理员跟成都城投用户享有最新控规权限
                var sourceLayer = that.userDeptName=='成都城投'||that.isAdmin?'chengdu_kg2':'chengdu_kg0'
                var layerUrl = this.geoserverURL+'/geoserver/gwc/service/tms/1.0.0/touziyun:'+sourceLayer+'@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf'
                var popup = new that.mbgl.Popup({
                    closeButton: false,
                    closeOnClick: false,
                    anchor:'left',
                    offset:20
                });
                map.addSource("geo_polygon", {
                    type: "vector",
                    scheme: "tms",
                    tiles: [layerUrl]
                });
                map.addLayer({ 
                    id: "geolayer_polygon_fill",
                    type: "fill",
                    source: "geo_polygon",
                    "source-layer": sourceLayer,
                    paint: {
                        "fill-color": [
                        "coalesce",
                        ['get','fill_color'],
                        ['match',
                            ['get','purpose'],
                            'house','#fefe89',
                            'house_commerce','#ff6a00',
                            'commerce_house','#ff6a00',
                            'commerce','#ff0000',
                            'industry','#8b6f59',
                            'other','#ecf5ff',
                            '#ecf5ff'
                        ]
                        ],
                        "fill-opacity": [
                        "coalesce",
                            ['get','fill_hy'],
                            0.5
                        ]
                    },
                    layout:{
                        "visibility":"none"
                    },
                },"landOutline_fill");
                map.on('click','geolayer_polygon_fill',e=>{
                    //阻止上层图层的点击事件穿透
                    if (e.originalEvent.cancelBubble) {
                        return;
                    }
                    console.log(e)
                    //this.setClickInfo(e)
                })
                map.on("mousemove", "geolayer_polygon_fill", e => {
                    map.getCanvas().style.cursor = "pointer";
                    let coordinates = [e.lngLat.lng, e.lngLat.lat];
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }
                    var name = e.features[0].properties.parcel_location;
                    var info = `<P class="item_head">${name}</p>`;
                    popup.setLngLat(coordinates).setHTML(info).addTo(map);
                });
                map.on("mouseleave", "geolayer_polygon_fill", e => {
                    map.getCanvas().style.cursor = "";
                    popup.remove();
                });
                map.addLayer({
                    id: "geolayer_polygon_symbol",
                    type: "symbol",
                    source: "geo_polygon",
                    filter:['!in','state','plan'],
                    "source-layer": sourceLayer,
                    layout: {
                        "text-field": [
                            "coalesce",['get','land_number'],['get','parcel_location'] //返回第一个非空值
                        ],
                        "text-font": ["DIN Offc Pro Bold"],
                        "text-allow-overlap": true,
                        "text-offset": [0, -1],
                        "text-anchor": "bottom",
                        "text-size":[
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        0, 0,
                        11,4,
                        16, 16
                        ],
                        "text-letter-spacing": 0.1,
                        "text-max-width":10,
                        "text-padding":5,
                        
                        "icon-image": "landPoint",
                        "icon-allow-overlap":true,
                        "icon-ignore-placement":true,
                        "icon-size": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        0, 0,
                        11,0,
                        16, 0.7
                        ],
                        "visibility":"none"
                    },
                    paint: {
                        "text-color": "#202",
                        "text-halo-color": "#fff",
                        "text-halo-width": 2
                    },
                });
                map.on('click','geolayer_polygon_symbol',e=>{
                    //阻止点击事件穿透到底部图层
                    e.originalEvent.cancelBubble = true;
                    console.log(e)
                    //this.setClickInfo(e)
                })
            }
        },
        loadTest(){
            var that = this
            var map = this.ledger_map
            var geo_polygon = map.getSource('geo_polygon')
            if(geo_polygon===undefined){
                var popup = new that.mbgl.Popup({
                    closeButton: false,
                    closeOnClick: false,
                    anchor:'left',
                    offset:20
                });
                map.addSource('geo_polygon',{
                    type:'vector',
                    tiles:["http://192.168.3.117:8282/dmc-web/dms/pt/traffic/road_l/section/polygon/{z}/{x}/{y}"]
                })
                map.addLayer({ 
                    id: "geolayer_polygon_fill",
                    type: "fill",
                    source: "geo_polygon",
                    "source-layer": "polygon",
                    paint: {
                        "fill-color": [
                        "coalesce",
                        ['get','fill_color'],
                        ['match',
                            ['get','purpose'],
                            'house','#fefe89',
                            'house_commerce','#ff6a00',
                            'commerce_house','#ff6a00',
                            'commerce','#ff0000',
                            'industry','#8b6f59',
                            'other','#ecf5ff',
                            '#ecf5ff'
                        ]
                        ],
                        "fill-opacity": [
                        "coalesce",
                            ['get','fill_hy'],
                            0.5
                        ]
                    }
                },'landOutline_fill');
                map.on('click','geolayer_polygon_fill',e=>{
                    //阻止上层图层的点击事件穿透
                    if (e.originalEvent.cancelBubble) {
                        return;
                    }
                    console.log(e)
                    //this.setClickInfo(e)
                })
                map.on("mousemove", "geolayer_polygon_fill", e => {
                    map.getCanvas().style.cursor = "pointer";
                    let coordinates = [e.lngLat.lng, e.lngLat.lat];
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }
                    var name = e.features[0].properties.parcel_location;
                    var info = `<P class="item_head">${name}</p>`;
                    popup.setLngLat(coordinates).setHTML(info).addTo(map);
                });
                map.on("mouseleave", "geolayer_polygon_fill", e => {
                    map.getCanvas().style.cursor = "";
                    popup.remove();
                });
                map.addLayer({
                    id: "geolayer_polygon_symbol",
                    type: "symbol",
                    source: "geo_polygon",
                    filter:['!in','state','plan'],
                    "source-layer": "polygon",
                    layout: {
                        "text-field": [
                            "coalesce",['get','land_number'],['get','parcel_location'] //返回第一个非空值
                        ],
                        "text-font": ["DIN Offc Pro Bold"],
                        "text-allow-overlap": true,
                        "text-offset": [0, -1],
                        "text-anchor": "bottom",
                        "text-size":[
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        0, 0,
                        11,4,
                        16, 16
                        ],
                        "text-letter-spacing": 0.1,
                        "text-max-width":10,
                        "text-padding":5,
                        
                        "icon-image": "landPoint",
                        "icon-allow-overlap":true,
                        "icon-ignore-placement":true,
                        "icon-size": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        0, 0,
                        11,0,
                        16, 0.7
                        ],
                        "visibility":"none"
                    },
                    paint: {
                        "text-color": "#202",
                        "text-halo-color": "#fff",
                        "text-halo-width": 2
                    },
                });
                map.on('click','geolayer_polygon_symbol',e=>{
                    //阻止点击事件穿透到底部图层
                    e.originalEvent.cancelBubble = true;
                    console.log(e)
                    //this.setClickInfo(e)
                })
            }
        },
    }
}
</script>
<style lang="scss">
.controlreq_layer{
    .control_bar{
        position: fixed;
        width: 250px;
        top: 50px;
        right: 100px;
        background: #fff;
        padding: 18px;
        border-radius: 4px;
        z-index: 1;
        .tips{
            font-size: 12px;
            color: #f60;
            margin-bottom: 10px;
        }
    } 
}
</style>