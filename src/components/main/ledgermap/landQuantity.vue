<template>
    <!-- 全国土地数量统计 -->
    <div class="landnum_wrap"></div>
</template>
<script>
import ledgerApi from '@/api/ledgerApi'
import { mapGetters } from 'vuex'
export default {
    name:'landnum',
    data(){
        return{

        }
    },
    mounted(){

    },
    computed:{
        ...mapGetters(['ledger_map','mapIsload','landTypeTab'])
    },
    watch:{
        mapIsload:{
            handler(newVal){
                if(newVal){
                    this.setLandNum()
                }
            },
            deep:true
        },
        landTypeTab:{
            handler(newVal){
                this.setLandNum()
            },
            deep:true
        },
    },
    methods:{
        //添加土地统计图层并设置数据
        setLandNum(){
            var that = this
            var map = this.ledger_map
            var source = map.getSource('source_landnum')
            if(source===undefined){
                map.addSource('source_landnum',{
                    type:'geojson',
                    data:{
                        type:'FeatureCollection',
                        features:[]
                    }
                })
                map.addLayer({
                    id: "province_num",
                    type: "circle",
                    source: "source_landnum",
                    filter:['==','type','province'],
                    layout: {
                        "visibility": "visible"
                    },
                    paint: {
                        "circle-color": "rgba(0,121,248,0.8)",
                        "circle-radius": 40,
                        //"circle-stroke-width": 1,
                        //"circle-stroke-color": "#fff",
                    },
                    maxzoom:6
                });
                map.addLayer({
                    id: "province_num_symbol",
                    type: "symbol",
                    source: "source_landnum",
                    filter:['==','type','province'],
                    layout: {
                        "text-field": [
                        "format",["get", "name"],"\n",["get","num"]
                        ],
                        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                        "text-size": 14,
                        "visibility": "visible"
                    },
                    paint:{
                        "text-opacity":1,
                        "text-color": "#fff",
                    },
                    maxzoom:6
                });
                map.on('click','province_num',e=>{
                    let center = e.features[0].properties.center.split(',')
                    this.mapFly(center,6.1)
                })
                map.on('click','province_num_symbol',e=>{
                    let center = e.features[0].properties.center.split(',')
                    this.mapFly(center,6.1)
                })
                map.addLayer({
                    id: "city_num",
                    type: "circle",
                    source: "source_landnum",
                    filter:['==','type','city'],
                    layout: {
                        "visibility": "visible"
                    },
                    paint: {
                        "circle-color": "rgba(255,129,0,0.8)",
                        "circle-radius": 30,
                        //"circle-stroke-width": 1,
                        //"circle-stroke-color": "#fff",
                    },
                    minzoom:6,
                    maxzoom:8
                });
                map.addLayer({
                    id: "city_num_symbol",
                    type: "symbol",
                    source: "source_landnum",
                    filter:['==','type','city'],
                    layout: {
                        "text-field": [
                        "format",["get", "name"],"\n",["get","num"]
                        ],
                        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                        "text-size": 12,
                        "visibility": "visible"
                    },
                    paint:{
                        "text-opacity":1,
                        "text-color": "#fff",
                    },
                    minzoom:6,
                    maxzoom:8
                });
                map.on('click','city_num',e=>{
                    //阻止上层图层的点击事件穿透
                    if (e.originalEvent.cancelBubble) {
                        return;
                    }
                    let center = e.features[0].properties.center.split(',')
                    let code = e.features[0].properties.id
                    let name = e.features[0].properties.name
                    this.mapFly(center,11)
                    this.changeCity(code,name,center)
                })
                map.on('click','city_num_symbol',e=>{
                    //阻止点击事件穿透到底部图层
                    e.originalEvent.cancelBubble = true;
                    let center = e.features[0].properties.center.split(',')
                    let code = e.features[0].properties.id
                    let name = e.features[0].properties.name
                    this.mapFly(center,11)
                    this.changeCity(code,name,center)
                })
            }
            ledgerApi.getLandAccount({datatype:that.landTypeTab})
            .then(res=>{
                if(res.data.code===0){
                    console.log('土地数量统计',res)
                    let data = res.data.data
                    let geojson = {
                        type:'FeatureCollection',
                        features:[]
                    }
                    data.city.forEach(item=>{
                        if(item.center){
                            let coord = item.center.split(',')
                            geojson.features.push({
                                type:'Feature',
                                geometry:{
                                    type:'Point',
                                    coordinates:coord
                                },
                                properties:{
                                    id:item.id,
                                    name:item.name,
                                    num:item.num,
                                    center:item.center,
                                    type:'city'
                                }
                            })
                        }
                    })
                    data.province.forEach(item=>{
                        if(item.center){
                            let coord = item.center.split(',')
                            geojson.features.push({
                                type:'Feature',
                                geometry:{
                                    type:'Point',
                                    coordinates:coord
                                },
                                properties:{
                                    id:item.id,
                                    name:item.name,
                                    num:item.num,
                                    center:item.center,
                                    type:'province'
                                }
                            })
                        }
                    })
                    map.getSource('source_landnum').setData(geojson)
                }
            })
        },
        //地图飞行
        mapFly(center,zoom){
            let map = this.ledger_map
            map.flyTo({
                center:center,
                zoom:zoom,
            })
        },
        //切换城市
        changeCity(code,name,center){
            this.$store.dispatch('setCityCode',code)
            localStorage.setItem('cityCode',code)
            localStorage.setItem('cityName',name)
            localStorage.setItem('cityCenter',JSON.stringify(center))
            //控制城市图层
            let map = this.ledger_map
            let filter = [
                'all',
                ["==", "tree_level", 3],
                ["==","pid",JSON.parse(code)]
            ]
            map.setFilter("plate_fill",filter)
            map.setFilter("plate_line",filter)
            map.setFilter("plate_labels",filter)
        },
    }
}
</script>
<style lang="scss">

</style>