<template>
    <div class="infomation_plate" :style="{
            'top':classBoxFlag?'203px':'40px',
            'height':classBoxFlag?heigth_true:heigth_false
        }">
        <div class="chart_map">
            <!-- <div class="title _head">
                <div class="left">{{1}}</div>
                <div class="mid">时间选择</div>
                <div class="right">总值：{{1}} 平均值：{{1}}</div>
            </div> -->
            <div class="content">
                <!-- 配套信息 -->
                <MatchingInfo class="matching_box" v-if="queryMenuIndex==1" />
                <!-- 宏观信息 -->
                <div class="macroscopic_box" v-show="queryMenuIndex==0">
                    <!-- 所选板块的类别数据 -->
                    <MacroscopicInfo v-show="!cardFlag" />
                    <!-- 板块名片 -->
                    <PlateCard v-show="cardFlag" />
                </div>
                <!-- 市场数据 -->
                <MarketInfo class="market_box" v-if="queryMenuIndex==2" />
                <!-- 土地数据 -->
                <LandInfo class="market_box" v-if="queryMenuIndex==3" />
                <div class="map">
                    <!-- 地图组件 -->
                    <MapComponent mapType="dataQuery" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
//API
import request from "@/utils/request";
import dataqueryApi from '@/api/dataqueryApi'
//store
import { mapGetters } from "vuex"
//组件
import MapComponent from '../../common/MapComponent'
import PlateCard from './PlateCard'
import MatchingInfo from './matchingInfo'
import MacroscopicInfo from './macroscopicInfo'
import MarketInfo from './marketInfo'
import LandInfo from './landInfo'

export default {
    name:'infomationplate',
    components:{
        MacroscopicInfo,
        MapComponent,
        PlateCard,
        MatchingInfo,
        MarketInfo,
        LandInfo
    },
    data(){
        return{
            heigth_false:(window.innerHeight-33)+'px',
            heigth_true:(window.innerHeight-200)+'px',
            parentObj:null,//指标父元素对象
            prevClickObj:null,//上次点击的对象
            curDistrictID:null,//选择的学校ID
            landuseArr:[],//用地性质字典
            curRegulatoryId:null,//当前选择宗地的关联控规的ID
            fenceLayer:null,//上次围栏的图层
        }
    },
    mounted(){
        this.getLandUserDict()
        console.log(this.plate_color)
    },
    computed:{
        ...mapGetters(["map_style","cardFlag","cityCode","userMenuList","plateType","queryMenuIndex","plateData","classification","classificationObj","plateArr","plateCenter","mapbox_map","plate_color","classBoxFlag","enclosure","enclosureCoor"])
    },
    watch:{
        classification:{
            handler(){
                if(this.queryMenuIndex===1){
                    this.dataQuery()
                }
                //管道图层控制
                let flag_pipe = this.mapbox_map.getLayer("poi_szgw")
                if(this.classificationObj.length>0){
                    if(this.classificationObj[0].url==="pipe"){
                        if(flag_pipe===undefined){
                            this.addPipeSource()
                        }else{
                            this.mapbox_map.setLayoutProperty("poi_szgw","visibility","visible")
                            this.mapbox_map.setLayoutProperty("szgw_symbol","visibility","visible")
                            this.mapbox_map.setLayoutProperty("line_szgw_l","visibility","visible")
                            this.mapbox_map.setLayoutProperty("line_szgw_symbol","visibility","visible")
                        }
                    }else{
                        if(flag_pipe!==undefined){
                            this.mapbox_map.setLayoutProperty("poi_szgw","visibility","none")
                            this.mapbox_map.setLayoutProperty("szgw_symbol","visibility","none")
                            this.mapbox_map.setLayoutProperty("line_szgw_l","visibility","none")
                            this.mapbox_map.setLayoutProperty("line_szgw_symbol","visibility","none")
                        }
                    }
                }else{
                    if(flag_pipe!==undefined){
                        this.mapbox_map.setLayoutProperty("poi_szgw","visibility","none")
                        this.mapbox_map.setLayoutProperty("szgw_symbol","visibility","none")
                        this.mapbox_map.setLayoutProperty("line_szgw_l","visibility","none")
                        this.mapbox_map.setLayoutProperty("line_szgw_symbol","visibility","none")
                    }
                }
            },
            deep:true
        },
        plateArr:{
            handler(newVal){
                //当配套数据时，板块选择可以与地图互动
                this.selectPlates()
                
                if(this.queryMenuIndex===1){
                    this.dataQuery()
                }
                // if(newVal.length>0){
                //     if(this.queryMenuIndex===2){
                //         this.setMarketLayer()
                //     }else if(this.queryMenuIndex===3){
                //         this.setLandLayer()
                //     }
                // }
            },
            deep:true
        },
        queryMenuIndex:{
            immediate:true,
            handler(newVal){
                setTimeout(()=>{
                    var map = this.mapbox_map
                    let flag_market = map.getLayer("sc_buildings")
                    let flag_land = map.getLayer("td_parcel")
                    if(newVal===2){ //显示市场图层
                        this.setMarketLayer()
                        if(flag_land!==undefined){
                            map.setLayoutProperty('td_parcel', 'visibility', 'none') 
                            map.setLayoutProperty('td_parcel_symbol', 'visibility', 'none') 
                            map.setLayoutProperty('td_regulatory', 'visibility', 'none') 
                            map.setLayoutProperty('td_regulatory_line', 'visibility', 'none') 
                            map.setLayoutProperty('td_regulatory_symbol', 'visibility', 'none') 
                        }
                        //配套图层隐藏
                        this.hideMatchingLayers()
                    }else if(newVal===3){ //显示土地图层
                        this.setLandLayer()
                        if(flag_market!==undefined){
                            map.setLayoutProperty('sc_buildings', 'visibility', 'none') 
                            map.setLayoutProperty('sc_buildings_symbol', 'visibility', 'none') 
                        }
                        //配套图层隐藏
                        this.hideMatchingLayers()
                    }else{
                        if(flag_land!==undefined){
                            map.setLayoutProperty('td_parcel', 'visibility', 'none') 
                            map.setLayoutProperty('td_parcel_symbol', 'visibility', 'none') 
                            map.setLayoutProperty('td_regulatory', 'visibility', 'none') 
                            map.setLayoutProperty('td_regulatory_line', 'visibility', 'none') 
                            map.setLayoutProperty('td_regulatory_symbol', 'visibility', 'none') 
                        }
                        if(flag_market!==undefined){
                            map.setLayoutProperty('sc_buildings', 'visibility', 'none') 
                            map.setLayoutProperty('sc_buildings_symbol', 'visibility', 'none') 
                        }
                        //配套图层隐藏
                        this.hideMatchingLayers()
                    }
                },2000)
            },
            deep:true
        },
        enclosureCoor:{
            handler(newVal){
                if(this.enclosure&&newVal!==null&&this.classification.length>0){
                    this.fenceMode(this.fenceLayer)
                }
            },
            deep:true
        },
        map_style:{
            handler(){
                if(this.queryMenuIndex===2){
                    setTimeout(()=>{
                        this.setMarketLayer() 
                        this.mapbox_map.moveLayer("plate_fill","sc_buildings")
                    },2000)
                }else if(this.queryMenuIndex===3){
                    setTimeout(()=>{
                        this.setLandLayer() 
                        this.mapbox_map.moveLayer("plate_fill","td_regulatory")
                    },2000)
                }
            },
            deep:true
        }
    },
    methods:{
        getLandUserDict(){ //获取土地用途字典
            dataqueryApi.getTypeDict('land_use')
            .then(res=>{
                if(res.data.code===0){
                this.landuseArr = res.data.data
                }
            });
        },
        selectPlates(){ //设置地图板块选中效果
            console.log(this.plateArr)
            var that = this
            let map = this.mapbox_map
            if(map===null){
                return
            }
            var borderWidth = ["match", ["get", "regionno"]];
            var borderColor = ["match", ["get", "regionno"]];
            var borderOpocity = ["match", ["get", "regionno"]];
             var borderDasharray = ["match", ["get", "regionno"]];
            if(this.plateArr.length>0){
                this.plateArr.forEach(item=>{
                    borderWidth.push(item, 1.5);
                    borderColor.push(item, "rgba(85, 255, 0, 1)");
                    borderOpocity.push(item, 1);
                    borderDasharray.push(item,['literal',[4,4]]);
                })
            }else{
                borderWidth = borderWidth.concat(1)
                borderColor = borderColor.concat(["rgba(149, 149, 246,1)","rgba(149, 149, 246,1)"])
                borderOpocity= borderOpocity.concat(1)
                borderDasharray = borderDasharray.push(['literal',[0,0]]);
            }
            borderWidth.push(1.5)
            borderColor.push("rgba(149, 149, 246,1)")
            borderOpocity.push(0.4)
            borderDasharray.push(['literal',[4,4]]);

            map.setPaintProperty("plate_line", "line-width", borderWidth);
            map.setPaintProperty("plate_line", "line-color", borderColor);
            //this.mapbox_map.setPaintProperty("plate_line", "line-width", borderWidth);
            map.setPaintProperty("plate_line", "line-opacity", borderOpocity);
            //("plate_line", "line-dasharray", borderDasharray);
            
            // let flag = this.plateArr.length==0
            // this.mapbox_map.flyTo({
            //     center: flag?this.plateData.curCityInfo.center:center,
            //     zoom: flag?9:11,
            //     speed: 0.8,
            //     curve: 2
            // })

        },
        fenceMode(layerArr){ //配套查询围栏模式
            let map = this.mapbox_map
            if(this.enclosureCoor!==null){
                let obj = {
                    type:this.classificationObj[0].url,
                    coordinates: this.enclosureCoor
                }
                dataqueryApi.getFencePoiList(obj)
                .then(res=>{
                    console.log(res)
                    if(res.data.code===0){
                        let arr = []
                        let data = res.data.data
                        data.forEach(item=>{
                            arr.push(item.id)
                        })
                        let filter = ["in","id"].concat(arr)
                        layerArr.forEach(item=>{
                            map.setFilter(item,filter)
                            map.setLayoutProperty(item, 'visibility', 'visible')
                        })
                        if(data.length==0){
                            this.$message('未查询到围栏内的'+this.classificationObj[0].name+'数据')
                        }
                    }   
                })
                
                
            }
            
        },
        dataQuery(){ //根据类别获取各版块得分,或筛选配套数据
            if((this.plateArr.length>0&&this.classification.length>0)||
            (this.classification.length>0&&this.enclosure)){
                this.matchingQuery();
            }else{
                this.hideMatchingLayers() 
                this.fenceLayer = null
            }
        },
        hideMatchingLayers(){ //配套图层隐藏
            var map = this.mapbox_map
            if(map!==null){
                let flag_school = map.getLayer("poi_school")
                let flag_resource = map.getLayer("poi_resource")
                if(flag_school!==undefined){
                    map.setLayoutProperty('poi_school', 'visibility', 'none') 
                    map.setLayoutProperty('school_symbol', 'visibility', 'none') 
                    map.setLayoutProperty('district_fill', 'visibility', 'none')
                    map.setLayoutProperty('district_line', 'visibility', 'none')
                    map.setLayoutProperty('district_symbol', 'visibility', 'none')
                }
                if(flag_resource!==undefined){
                    map.setLayoutProperty('poi_resource', 'visibility', 'none') 
                    map.setLayoutProperty('resource_symbol', 'visibility', 'none')
                }
                if(this.prevClickObj!==null){
                    map.setLayoutProperty(this.prevClickObj.url, 'visibility', 'none')
                    map.setLayoutProperty(this.prevClickObj.url+'_symbol', 'visibility', 'none')
                    if(this.prevClickObj.ismonth==="2"){
                        map.setLayoutProperty(this.prevClickObj.url+'_line', 'visibility', 'none')
                    }
                }
            }
        },
        matchingQuery(){ //配套数据查询
            console.log('配套数据查询')
            let curObj = this.classificationObj[0]
            //当选择的为行政区时，转为板块
            let plate_arr = this.plateArr
            // if(this.plateType==="region"){
            //     this.plateData.part.forEach(item=>{
            //         if(this.plateArr.indexOf(item.regionno)!==-1){
            //             plate_arr.push(item.regionno) //把行政区的regionno放进去
            //             item.children.forEach(child=>{
            //                 plate_arr.push(child.regionno)
            //             })
            //         }
            //     })
            // }else{
            //     plate_arr = this.plateArr
            // }
            //查找元素父类
            let pid = this.classificationObj[0].pid
            let pObj = this.userMenuList.filter(item=>pid===item.id)[0]
            this.parentObj = pObj

            //地图filter
            var map = this.mapbox_map
            
            //隐藏上次筛选的图层
            if(this.prevClickObj!==null){
                map.setLayoutProperty(this.prevClickObj.url, 'visibility', 'none')
                map.setLayoutProperty(this.prevClickObj.url+'_symbol', 'visibility', 'none')
                if(this.prevClickObj.ismonth==='2'){
                    map.setLayoutProperty(this.prevClickObj.url+'_line', 'visibility', 'none')
                }
            }
            let flag_school = map.getLayer("poi_school")
            let flag_resource = map.getLayer("poi_resource")
            if(flag_school!==undefined){
                map.setLayoutProperty('poi_school', 'visibility', 'none')
                map.setLayoutProperty('school_symbol', 'visibility', 'none')

                map.setLayoutProperty('district_fill', 'visibility', 'none')
                map.setLayoutProperty('district_line', 'visibility', 'none')
                map.setLayoutProperty('district_symbol', 'visibility', 'none')
            }
            if(flag_resource!==undefined){
                map.setLayoutProperty('poi_resource', 'visibility', 'none')
                map.setLayoutProperty('resource_symbol', 'visibility', 'none')
            }
            
            if(pObj.name==="教育"){ //教育点筛选
                if(flag_school===undefined){
                    this.addSchoolPoi()
                }
                var filters = [
                    'all',
                    ['==','school_type',curObj.url],
                    ['in', this.plateType==='region'?'regionno':'partno'].concat(plate_arr)
                ];
               
                if(this.enclosure){ //围栏模式
                    this.fenceMode(['poi_school','school_symbol'])
                }else{ //板块查询模式
                    map.setFilter('poi_school', filters);
                    map.setFilter('school_symbol', filters);  
                    map.setLayoutProperty('poi_school', 'visibility', 'visible')
                    map.setLayoutProperty('school_symbol', 'visibility', 'visible')
                }
                this.fenceLayer = ['poi_school','school_symbol']
            }else if(pObj.name==="市政"){ //市政点筛选
                if(curObj.url==='pipe'){ //管道网络图层
                    
                }else{ //市政图层
                    if(flag_resource===undefined){
                        this.addResourcePoi()
                    }
                    var filters = [
                        'all',
                        ['any',
                            ['==','data',curObj.url],
                            ['==','classify_code',curObj.url]
                        ],
                        ['in', this.plateType==='region'?'regionno':'partno'].concat(plate_arr)
                    ];
                    if(this.enclosure){ //围栏模式
                        this.fenceMode(['poi_resource','resource_symbol'])
                    }else{ //板块查询模式
                        map.setFilter('poi_resource', filters);
                        map.setFilter('resource_symbol', filters);  
                        map.setLayoutProperty('poi_resource', 'visibility', 'visible')
                        map.setLayoutProperty('resource_symbol', 'visibility', 'visible')
                    }
                    this.fenceLayer = ['poi_resource','resource_symbol']
                }
                
            }else if(pObj.name==="不利因素"){ //不利因素
                if(flag_resource===undefined){
                    this.addResourcePoi()
                }
                var filters = [
                    'all',
                    ['==','classify_code',curObj.url],
                    ['in', this.plateType==='region'?'regionno':'partno'].concat(plate_arr)
                ];
                if(this.enclosure){ //围栏模式
                    this.fenceMode(['poi_resource','resource_symbol'])
                }else{ //板块查询模式
                    map.setFilter('poi_resource', filters);
                    map.setFilter('resource_symbol', filters);  
                    map.setLayoutProperty('poi_resource', 'visibility', 'visible')
                    map.setLayoutProperty('resource_symbol', 'visibility', 'visible')
                }
                this.fenceLayer = ['poi_resource','resource_symbol']
            }else{ //商业、交通、自然、规划图层筛选
                this.prevClickObj = curObj
                this.matchingLayerFilter(curObj,plate_arr)
            }
        },
        matchingLayerFilter(obj,arr){ //配套图层筛选器
            let code = this.cityCode
            var map = this.mapbox_map
            let flag = map.getLayer(obj.url)
            if(obj.ismonth!==undefined){ //此处D2D后台使用isMonth(是否支持月度)配置图层类型
                if(flag===undefined){
                    let color = "" //图层颜色
                    if(obj.unit!==null&&obj.unit!==""){
                        color = obj.unit //此处D2D后台使用unit(单位)配置颜色
                    }else{
                        color = "#ffffff"
                    }
                    //添加数据源
                    let workSpace_layer = 'city_'+code+':'+code+'_'+obj.url
                    let url = 'http://47.104.165.136:8070/geoserver/gwc/service/tms/1.0.0/'+workSpace_layer+'@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf'
                    map.addSource("source_"+obj.url, {
                        type: "vector",
                        scheme: "tms",
                        tiles: [url]
                    })
                    //添加图层
                    if(obj.ismonth==='0'){ //0 点图层
                        map.addLayer({ //poi
                            "id": obj.url,
                            "type": "circle",
                            "source": "source_"+obj.url,
                            "source-layer": code+"_"+obj.url,
                            "paint":{
                                'circle-radius': {
                                    'base': 2,
                                    'stops': [[8, 2], [16, 5]]
                                },
                                'circle-color': color
                            },
                            'layout': {
                                'visibility':'none'
                            }
                        })
                        map.addLayer({  // 点图层symbol
                            "id": obj.url+"_symbol",
                            "type": "symbol",
                            "source": "source_"+obj.url,
                            "source-layer": code+"_"+obj.url,
                            'layout': {
                                "text-field": ["get", "name"],
                                "text-size": 10,
                                'text-ignore-placement':false,
                                "text-justify": "auto",
                                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                                "text-offset": [0,-1.5],
                                'visibility':'none'
                            },
                            "paint": {
                                'text-color': color
                            }
                        });
                    }else if(obj.ismonth==='1'){ //线图层
                        map.addLayer({ //line
                            "id": obj.url,
                            "type": "line",
                            "source": "source_"+obj.url,
                            "source-layer": code+"_"+obj.url,
                            "paint":{
                                'line-width': {
                                    'base': 1,
                                    'stops': [[12, 1], [15, 2]]
                                },
                                'line-color': color
                            },
                            'layout': {
                                'visibility':'none'
                            }
                        })
                        map.addLayer({  // 线图层symbol
                            "id": obj.url+"_symbol",
                            "type": "symbol",
                            "source": "source_"+obj.url,
                            "source-layer": code+"_"+obj.url,
                            'layout': {
                                "text-field": ["get", "name"],
                                "text-size": 10,
                                'text-ignore-placement':false,
                                "text-justify": "auto",
                                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                                "text-offset": [0,-1.5],
                                'visibility':'none'
                            },
                            "paint": {
                                'text-color': color
                            }
                        });
                    }else if(obj.ismonth==='2'){ //面图层
                        map.addLayer({ //polygon
                            "id": obj.url,
                            "type": "fill",
                            "source": "source_"+obj.url,
                            "source-layer": code+"_"+obj.url,
                            "paint":{
                                'fill-color':color,
                                "fill-opacity":0.5
                            },
                            'layout': {
                                'visibility':'none'
                            }
                        })
                        map.addLayer({ 
                            "id": obj.url+"_line",
                            "type": "line",
                            "source": "source_"+obj.url,
                            "source-layer": code+"_"+obj.url,
                            'layout': {
                                'visibility':'none'
                            },
                            "paint": {
                                "line-color":"#fff",
                                "line-width":1,
                                "line-opacity":0.5
                            }
                        });
                        map.addLayer({ 
                            "id": obj.url+"_symbol",
                            "type": "symbol",
                            "source": "source_"+obj.url,
                            "source-layer": code+"_"+obj.url,
                            'layout': {
                                "text-field": ["get", "name"],
                                "text-size": 10,
                                'text-ignore-placement':false,
                                "text-justify": "auto",
                                'visibility':'none'
                            },
                            "paint": {
                                "text-color":"#fff",
                                "text-halo-color":'rgba(0,0,0,0.3)',
                                "text-halo-width":2.5
                            }
                        });
                    }
                    
                    var matchingPopup = new this.mbgl.Popup({
                        closeButton: false,
                        closeOnClick: false
                    });
                    map.on('mousemove', obj.url ,e=>{
                        map.getCanvas().style.cursor = 'pointer';
                        let coordinates = [e.lngLat.lng,e.lngLat.lat];
                        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                        } 
                        let info = e.features[0].properties
                        let popupHtml = `<p class="item_head">${info.name?info.name:info.linename}</p>`
                        matchingPopup.setLngLat(coordinates)
                        .setHTML(popupHtml)
                        .addTo(map);
                    })
                    map.on('mouseleave', obj.url ,e=>{
                        map.getCanvas().style.cursor = '';
                        matchingPopup.remove();
                    })
                }
                let filter = ['in',obj.ismonth==='1'||obj.ismonth==='2'?'regionno':(this.plateType==='region'?'regionno':'partno')].concat(arr)
                
                if(this.enclosure){ //围栏模式
                    this.fenceMode([obj.url,obj.url+"_symbol"])
                    
                }else{ //板块查询模式
                    map.setFilter(obj.url, filter);
                    map.setFilter(obj.url+"_symbol", filter); 
                    map.setLayoutProperty(obj.url, 'visibility', 'visible')
                    map.setLayoutProperty(obj.url+"_symbol", 'visibility', 'visible')
                }
                this.fenceLayer = [obj.url,obj.url+"_symbol"]
                if(obj.ismonth==='2'){
                    if(this.enclosure){ //围栏模式
                        this.fenceMode([obj.url+"_line"])
                        
                    }else{ //板块查询模式
                        map.setFilter(obj.url+"_line", filter);
                        map.setLayoutProperty(obj.url+"_line", 'visibility', 'visible')
                    }
                    this.fenceLayer = [obj.url,obj.url+"_symbol",obj.url+"_line"]
                }
               
            }else{
                this.message('未配置配套图层类型,地图无法筛选该配套图层,请先后台配置')
            }
            
        },
        addSchoolPoi(){ //添加学校poi、学区 geoserverLayer
            var map = this.mapbox_map
            let code = this.cityCode
            //学区
            var workSpace_layer_xq = 'city_'+code+':'+code+'_school_district'
            let url_xq = 'http://47.104.165.136:8070/geoserver/gwc/service/tms/1.0.0/'+workSpace_layer_xq+'@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf'
            map.addSource("serverLayer_district", {
                type: "vector",
                scheme: "tms",
                tiles: [url_xq]
            });
            map.addLayer({ //学区填充
                "id": "district_fill",
                "type": "fill",
                "source": "serverLayer_district",
                "source-layer": code+"_school_district",
                "paint":{
                    'fill-color':'#ff6600',
                    "fill-opacity":0.5
                },
                'layout': {
                    'visibility':'none'
                }
            })
            map.addLayer({  //学区描边
                "id": "district_line",
                "type": "line",
                "source": "serverLayer_district",
                "source-layer": code+"_school_district",
                'layout': {
                    'visibility':'none'
                },
                "paint": {
                    "line-color":"#fff",
                    "line-width":1,
                    "line-opacity":0.5
                }
            });
            map.addLayer({  //学区名称
                "id": "district_symbol",
                "type": "symbol",
                "source": "serverLayer_district",
                "source-layer": code+"_school_district",
                'layout': {
                    "text-field": ["get", "name"],
                    "text-size": 10,
                    'text-ignore-placement':false,
                    "text-justify": "auto",
                    'visibility':'none'
                },
                "paint": {
                    "text-color":"#fff",
                    "text-halo-color":'rgba(0,0,0,0.3)',
                    "text-halo-width":2.5
                }
            });
            map.on('click','district_fill',e=>{
                console.log('学区',e)
            })
            //学校
            let workSpace_layer_xx = 'city_'+code+':'+code+'_school_poi'
            let url_xx = 'http://47.104.165.136:8070/geoserver/gwc/service/tms/1.0.0/'+workSpace_layer_xx+'@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf'
            map.addSource("serverLayer_school", {
                type: "vector",
                scheme: "tms",
                tiles: [url_xx]
            });
            map.addLayer({ //学校poi
                "id": "poi_school",
                "type": "circle",
                "source": "serverLayer_school",
                "source-layer": code+"_school_poi",
                "paint":{
                    'circle-radius': {
                    'base': 2,
                    'stops': [[8, 2], [15, 10]]
                    },
                    'circle-color': [
                    'match',
                    ['get', 'school_type'],
                    'nursery_school', '#fbb03b',
                    'primary_school', '#f56c6c',
                    'junior_middle_school', '#00f3ff',
                    'senior_middle_school', '#cd8cff',
                    'college', '#33c377',
                    /* other */ '#ccc'
                    ]
                },
                'layout': {
                    'visibility':'none'
                }
            },"district_fill")
            map.addLayer({  //学校名称
                "id": "school_symbol",
                "type": "symbol",
                "source": "serverLayer_school",
                "source-layer": code+"_school_poi",
                'layout': {
                    "text-field": ["get", "name"],
                    "text-size": 10,
                    'text-ignore-placement':false,
                    "text-justify": "auto",
                    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                    "text-offset": [0,-1.5],
                    'visibility':'none'
                },
                "paint": {
                    'text-color': [
                    'match',
                    ['get', 'school_type'],
                    'nursery_school', '#fbb03b',
                    'primary_school', '#f56c6c',
                    'junior_middle_school', '#00f3ff',
                    'senior_middle_school', '#cd8cff',
                    'college', '#33c377',
                    /* other */ '#ccc'
                    ]
                }
            });
            //移动图层poi_school到district_fill之上
            // map.moveLayer("plate_fill","poi_school")
            var popup_poi = new this.mbgl.Popup({
                closeButton: false,
                closeOnClick: false
            });
            map.on('mousemove','school_symbol',e=>{
                map.getCanvas().style.cursor = 'pointer';
                let coordinates = [e.lngLat.lng,e.lngLat.lat];
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                } 
                let info = e.features[0].properties
                let flag = info.school_type==="primary_school"||info.school_type==="junior_middle_school" //小学初中显示学区提示
                //小学对口初中、初中对口小学
                let str = ''
                if(info.school_type==="primary_school"){
                    str = '对口初中：'
                }else if(info.school_type==="junior_middle_school"){
                    str = '对口小学：'
                }
                let popupHtml = `<p class="item_head">${info.name}</p>
                <div class="item_name">教育成果奖：<span class="item_val">${info.edu_reward?info.edu_reward:'暂无'}</span></div>
                <div class="item_name">科研优秀成果奖：<span class="item_val">${info.major_reward?info.major_reward:'暂无'}</span></div>
                <div class="item_name">评定优质课：<span class="item_val">${info.quality_course?info.quality_course:'暂无'}</span></div>
                <div class="item_name">名师数量：<span class="item_val">${info.famous_master?info.famous_master:'暂无'}</span></div>
                <div class="item_name">教育能手：<span class="item_val">${info.expert_edu?info.expert_edu:'暂无'}</span></div>
                <div class="item_name">生源数量：<span class="item_val">${info.biogeny?info.biogeny:'暂无'}</span></div>
                <div class="item_name">口碑评分：<span class="item_val">${info.public_praise?info.public_praise:'暂无'}</span></div>
                <div class="item_name">板块：<span class="item_val">${info.partname}</span></div>
                <div class="item_name">行政区：<span class="item_val">${info.region}</span></div>
                <div class="item_name">地址：<span class="item_val">${info.address?info.address:'暂无'}</span></div>
                <div class="item_name">${str===''?'':str}<span class="item_val">${str===''?'':info.relation?info.relation:'暂无'}</span></div>
                <div style="margin-top:8px;color:#c76700;">${flag?'tips:点击名称显示学区':''}</div>
                `
                popup_poi.setLngLat(coordinates)
                .setHTML(popupHtml)
                .addTo(map);
            })
            map.on('mouseleave','school_symbol',e=>{
                map.getCanvas().style.cursor = '';
                popup_poi.remove();
            })
            map.on('click','school_symbol',e=>{
                //阻止点击事件穿透到底部图层
                e.originalEvent.cancelBubble = true;
                console.log(e)
                
                let schoolType = e.features[0].properties.school_type
                let schoolID = e.features[0].properties.id
                let relation = e.features[0].properties.relation //市区小学初中存在该字段
                if(this.curDistrictID==schoolID){
                    this.curDistrictID=null
                    map.setLayoutProperty('district_fill', 'visibility', 'none')
                    map.setLayoutProperty('district_line', 'visibility', 'none')
                    map.setLayoutProperty('district_symbol', 'visibility', 'none')
                }else{
                    let filter = []
                    if(relation!==undefined&&schoolType=="junior_middle_school"){ //市区初中
                        let relation_id = e.features[0].properties.relation_id
                        let counterpart = relation_id.split(',')
                        filter = ['in','school_id'].concat(counterpart)
                    }else{ //市区小学、郊区小学、初中
                        filter = ['==','school_id',schoolID]
                    }
                    map.setLayoutProperty('district_fill', 'visibility', 'visible')
                    map.setLayoutProperty('district_line', 'visibility', 'visible')
                    map.setLayoutProperty('district_symbol', 'visibility', 'visible')
                    map.setFilter('district_fill', filter);
                    map.setFilter('district_line', filter);
                    map.setFilter('district_symbol', filter);
                    this.curDistrictID=schoolID
                }
            })
        },
        addResourcePoi(){ //添加市政poi geoserverLayer
            var map = this.mapbox_map
            let code = this.cityCode
            let workSpace_layer = 'city_'+code+':'+code+'_resource'
            let poi_resource = 'http://47.104.165.136:8070/geoserver/gwc/service/tms/1.0.0/'+workSpace_layer+'@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf'
            map.addSource("serverLayer_resource", {
                type: "vector",
                scheme: "tms",
                tiles: [poi_resource]
            });
            map.addLayer({ //市政poi
                "id": "poi_resource",
                "type": "circle",
                "source": "serverLayer_resource",
                "source-layer": code+"_resource",
                "paint":{
                    'circle-radius': {
                    'base': 2,
                    'stops': [[8, 2], [15, 10]]
                    },
                    'circle-color': 
                        [
                            'match',
                            ['get', 'data'],
                            'medical', '#fbb03b',
                            'yljg', '#f56c6c',
                            'ggylss', '#00f3ff',
                            'zjfw', '#cd8cff',
                            'funeral', '#fbb03b',
                            'energy', '#f56c6c',
                            'travel_resource','#ff6600',
                            /* other */ '#71d05d'
                        ]
                    
                },
                'layout': {
                    'visibility':'none'
                }
            })
            map.addLayer({  //市政名称
                "id": "resource_symbol",
                "type": "symbol",
                "source": "serverLayer_resource",
                "source-layer": code+"_resource",
                'layout': {
                    "text-field": ["get", "name"],
                    "text-size": 10,
                    'text-ignore-placement':false,
                    "text-justify": "auto",
                    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                    "text-offset": [0,-1.5],
                    'visibility':'none'
                },
                "paint": {
                    'text-color': [
                        'match',
                        ['get', 'data'],
                        'medical', '#fbb03b',
                        'yljg', '#f56c6c',
                        'ggylss', '#00f3ff',
                        'zjfw', '#cd8cff',
                        'funeral', '#fbb03b',
                        'energy', '#f56c6c',
                        'travel_resource','#ff6600',
                        /* other */ '#71d05d'
                    ]
                }
            });
            var popup_poi = new this.mbgl.Popup({
                closeButton: false,
                closeOnClick: false
            });
            map.on('mousemove','poi_resource',e=>{
                map.getCanvas().style.cursor = 'pointer';
                let coordinates = [e.lngLat.lng,e.lngLat.lat];
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                } 
                let info = e.features[0].properties
                let popupHtml = `<p class="item_head">${info.name}</p>`
                popup_poi.setLngLat(coordinates)
                .setHTML(popupHtml)
                .addTo(map);
            })
            map.on('mouseleave','poi_resource',e=>{
                map.getCanvas().style.cursor = '';
                popup_poi.remove();
            })
        },
        addPipeSource(){ //添加市政-管网点线图层
            var map = this.mapbox_map
            let code = this.cityCode
            //管网点图层
            let workSpace_layer = 'city_'+code+':'+code+'_szgw'
            let poi_szgw = 'http://47.104.165.136:8070/geoserver/gwc/service/tms/1.0.0/'+workSpace_layer+'@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf'
            map.addSource("serverLayer_szgw", {
                type: "vector",
                scheme: "tms",
                tiles: [poi_szgw]
            });
            map.addLayer({
                "id": "poi_szgw",
                "type": "circle",
                "source": "serverLayer_szgw",
                "source-layer": code+"_szgw",
                "paint":{
                    'circle-radius': {
                    'base': 2,
                    'stops': [[8, 2], [15, 10]]
                    },
                    'circle-color': [
                        'match',
                        ['get', 'type'],
                        'communication', '#fbb03b',
                        'feedwater', '#f56c6c',
                        'gas', '#00f3ff',
                        'heating', '#cd8cff',
                        'power', '#33c377',
                        'rainwater', '#fbb03b',
                        'reclaimed_water', '#f56c6c',
                        'sewage', '#00f3ff',
                        /* other */ '#ccc'
                    ]
                },
                'layout': {
                    'visibility':'visible'
                }
            })
            map.addLayer({ 
                "id": "szgw_symbol",
                "type": "symbol",
                "source": "serverLayer_szgw",
                "source-layer": code+"_szgw",
                'layout': {
                    "text-field": ["get", "name"],
                    "text-size": 10,
                    'text-ignore-placement':false,
                    "text-justify": "auto",
                    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                    "text-offset": [0,-1.5],
                    'visibility':'visible'
                },
                "paint": {
                    'text-color': [
                        'match',
                        ['get', 'type'],
                        'communication', '#fbb03b',
                        'feedwater', '#f56c6c',
                        'gas', '#00f3ff',
                        'heating', '#cd8cff',
                        'power', '#33c377',
                        'rainwater', '#fbb03b',
                        'reclaimed_water', '#f56c6c',
                        'sewage', '#00f3ff',
                        /* other */ '#ccc'
                    ]
                }
            });
            //管网线图层
            let workSpace_layer_l = 'city_'+code+':'+code+'_szgw_l'
            let poi_szgw_l = 'http://47.104.165.136:8070/geoserver/gwc/service/tms/1.0.0/'+workSpace_layer_l+'@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf'
            map.addSource("serverLayer_szgw_l", {
                type: "vector",
                scheme: "tms",
                tiles: [poi_szgw_l]
            });
            map.addLayer({ //line
                "id": "line_szgw_l",
                "type": "line",
                "source": "serverLayer_szgw_l",
                "source-layer": code+"_szgw_l",
                "paint":{
                    'line-width': {
                        'base': 1,
                        'stops': [[12, 1], [15, 2]]
                    },
                    'line-color': [
                        'match',
                        ['get', 'type'],
                        'communication', '#fbb03b',
                        'feedwater', '#f56c6c',
                        'gas', '#00f3ff',
                        'heating', '#cd8cff',
                        'power', '#33c377',
                        'rainwater', '#fbb03b',
                        'reclaimed_water', '#f56c6c',
                        'sewage', '#00f3ff',
                        /* other */ '#ccc'
                    ]
                },
                'layout': {
                    'visibility':'visible'
                }
            })
            map.addLayer({  // 线图层symbol
                "id":"line_szgw_symbol",
                "type": "symbol",
                "source": "serverLayer_szgw_l",
                "source-layer": code+"_szgw_l",
                'layout': {
                    "text-field": ["get", "name"],
                    "text-size": 10,
                    'text-ignore-placement':false,
                    "text-justify": "auto",
                    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                    "text-offset": [0,-1.5],
                    'visibility':'visible'
                },
                "paint": {
                    'text-color': [
                        'match',
                        ['get', 'type'],
                        'communication', '#fbb03b',
                        'feedwater', '#f56c6c',
                        'gas', '#00f3ff',
                        'heating', '#cd8cff',
                        'power', '#33c377',
                        'rainwater', '#fbb03b',
                        'reclaimed_water', '#f56c6c',
                        'sewage', '#00f3ff',
                        /* other */ '#ccc'
                    ]
                }
            });
        },
        setMarketLayer(){ //添加市场图层
            let code = this.cityCode
            var map = this.mapbox_map

            let flag = map.getLayer("sc_buildings")
            if(flag===undefined){
                //添加数据源
                let workSpace_layer = 'city_'+code+':'+code+'_sc_buildings'
                let url = 'http://47.104.165.136:8070/geoserver/gwc/service/tms/1.0.0/'+workSpace_layer+'@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf'
                map.addSource("source_sc_buildings", {
                    type: "vector",
                    scheme: "tms",
                    tiles: [url]
                })
                //添加图层
                map.addLayer({ //poi
                    "id": "sc_buildings",
                    "type": "circle",
                    "source": "source_sc_buildings",
                    "source-layer": code+"_sc_buildings",
                    "paint":{
                        'circle-radius': {
                            'base': 2,
                            'stops': [[8, 2], [15, 10]]
                        },
                        'circle-color': "#f60"
                    },
                    'layout': {
                        'visibility':'none'
                    }
                })
                map.addLayer({  // 点图层symbol
                    "id":"sc_buildings_symbol",
                    "type": "symbol",
                    "source": "source_sc_buildings",
                    "source-layer": code+"_sc_buildings",
                    'layout': {
                        "text-field": ["get", "name"],
                        "text-size": 10,
                        'text-ignore-placement':false,
                        "text-justify": "auto",
                        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                        "text-offset": [0,-1.5],
                        'visibility':'none'
                    },
                    "paint": {
                        'text-color': "#f60"
                    }
                });
                //map.moveLayer("plate_fill","sc_buildings")
            }
            // var filters = ['in', this.plateType==='region'?'regionno':'partno'].concat(this.plateArr)
            // map.setLayoutProperty('sc_buildings', 'visibility', 'visible')
            // map.setLayoutProperty('sc_buildings_symbol', 'visibility', 'visible')
            // map.setFilter('sc_buildings', filters);
            // map.setFilter('sc_buildings_symbol', filters);
        },
        setLandLayer(){ //添加土地图层
            let code = this.cityCode
            var map = this.mapbox_map

            let flag = map.getLayer("td_parcel")
            if(flag===undefined){
                //添加数据源-控规
                let workSpace_layer_kg = 'city_'+code+':'+code+'_td_regulatory'
                let url_kg = 'http://47.104.165.136:8070/geoserver/gwc/service/tms/1.0.0/'+workSpace_layer_kg+'@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf'
                map.addSource("source_td_regulatory", {
                    type: "vector",
                    scheme: "tms",
                    tiles: [url_kg]
                })
                //添加图层
                map.addLayer({ //polygon
                    "id": "td_regulatory",
                    "type": "fill",
                    "source": "source_td_regulatory",
                    "source-layer": code+"_td_regulatory",
                    "paint":{
                        'fill-color':[
                            'match',
                            ['get', 'type'],
                            'house', "#ffff00",
                            'commerce_house', '#dd3601',
                            'commerce', '#ff0000',
                            'industry', '#4d0000',
                            /* other */ '#3a8ee6'
                        ],
                        "fill-opacity":0.7
                    },
                    'layout': {
                        'visibility':'none'
                    }
                })
                map.addLayer({ 
                    "id": "td_regulatory_line",
                    "type": "line",
                    "source": "source_td_regulatory",
                    "source-layer": code+"_td_regulatory",
                    'layout': {
                        'visibility':'none'
                    },
                    "paint": {
                        "line-color":"#fff",
                        "line-width":1,
                        "line-opacity":0.5
                    }
                });
                map.addLayer({ 
                    "id": "td_regulatory_symbol",
                    "type": "symbol",
                    "source": "source_td_regulatory",
                    "source-layer": code+"_td_regulatory",
                    'layout': {
                        "text-field": [
                            'match',
                            ['get', 'type'],
                            'house', 'R',
                            'commerce_house', 'CR',
                            'commerce', 'C',
                            'industry', 'I',
                            /* other */ 'E'
                        ],
                        "text-size": 10,
                        'text-ignore-placement':false,
                        "text-justify": "auto",
                        'visibility':'none'
                    },
                    "paint": {
                        "text-color":"#fff",
                        "text-halo-color":'rgba(0,0,0,0.3)',
                        "text-halo-width":2.5
                    }
                });
                //map.moveLayer("plate_fill","td_regulatory")
                //添加数据源-宗地
                let workSpace_layer_zd = 'city_'+code+':'+code+'_td_parcel'
                let url_zd = 'http://47.104.165.136:8070/geoserver/gwc/service/tms/1.0.0/'+workSpace_layer_zd+'@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf'
                map.addSource("source_td_parcel", {
                    type: "vector",
                    scheme: "tms",
                    tiles: [url_zd]
                })
                //添加图层
                map.addLayer({ //poi
                    "id": "td_parcel",
                    "type": "circle",
                    "source": "source_td_parcel",
                    "source-layer": code+"_td_parcel",
                    "paint":{
                        'circle-radius': {
                            'base': 2,
                            'stops': [[8, 2], [15, 10]]
                        },
                        'circle-color': [
                            'match',
                            ['get', 'deal_state'],
                            'deal', '#fbb03b',
                            'undeal', '#f56c6c',
                            'dealing', '#00f3ff',
                            /* other */ '#ccc'
                        ]
                    },
                    'layout': {
                        'visibility':'none'
                    }
                },"td_regulatory")
                map.addLayer({  // 点图层symbol
                    "id":"td_parcel_symbol",
                    "type": "symbol",
                    "source": "source_td_parcel",
                    "source-layer": code+"_td_parcel",
                    'layout': {
                        "text-field": ['concat',
                            [
                                'match',
                                ['get', 'land_use'],
                                'house', 'R',
                                'commerce_house', 'CR',
                                'commerce', 'C',
                                'industry', 'I',
                                /* other */ 'E'
                            ],' ',['round',['to-number',['get','land_area']]],'㎡'],
                        "text-size": {
                            'base': 10,
                            'stops': [[8, 10], [15, 11]]
                        },
                        'text-ignore-placement':false,
                        "text-justify": "auto",
                        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                        "text-offset": [0,-1.5],
                        'visibility':'none'
                    },
                    "paint": {
                        'text-color': [
                            'match',
                            ['get', 'deal_state'],
                            'deal', '#fbb03b',
                            'undeal', '#f56c6c',
                            'dealing', '#00f3ff',
                            /* other */ '#ccc'
                        ]
                    }
                });
                //map.moveLayer("plate_fill","td_parcel")
                var popup_poi = new this.mbgl.Popup({
                    closeButton: false,
                    closeOnClick: false
                });
                map.on('mousemove','td_parcel',e=>{
                    map.getCanvas().style.cursor = 'pointer';
                    let coordinates = [e.lngLat.lng,e.lngLat.lat];
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    } 
                    let info = e.features[0].properties
                    let land_use = this.landuseArr.filter(item=>info.land_use===item.value)[0].label
                    let popupHtml = `<p class="item_head">${info.address}</p>
                    <div class="item_name">净用地面积：<span class="item_val">${info.land_area!==undefined?JSON.parse(info.land_area).toFixed(2):'暂无'}㎡</span></div>
                    <div class="item_name">土地用途：<span class="item_val">${land_use}</span></div>
                    <div class="item_name">商业占比上限：<span class="item_val">${info.business_rate}</span></div>
                    <div class="item_name">可开发体量：<span class="item_val">${info.dev_volume}万㎡</span></div>
                    <div class="item_name">出让时间：<span class="item_val">${info.sell_date}</span></div>
                    <div class="item_name">交易状态：<span class="item_val">${info.deal_state==="deal"?'已成交':info.deal_state==="undeal"?'未成交':'交易中'}</span></div>
                    <div class="item_name">楼面地价：<span class="item_val">${info.total_floor_price!==undefined?parseInt(info.total_floor_price):'暂无'}元/㎡</span></div>
                    <div class="item_name">呈现项目：<span class="item_val">${info.name!==undefined?info.name:'暂无'}</span></div>
                    <div class="item_name">竞得者：<span class="item_val">${info.winner}</span></div>
                    `
                    popup_poi.setLngLat(coordinates)
                    .setHTML(popupHtml)
                    .addTo(map);
                })
                map.on('mouseleave','td_parcel',e=>{
                    map.getCanvas().style.cursor = '';
                    popup_poi.remove();
                })
                map.on('click','td_parcel',e=>{
                    //阻止点击事件穿透到底部图层
                    e.originalEvent.cancelBubble = true;
                    console.log(e)
                    let regulatory_id = e.features[0].properties.regulatory_id
                    if(this.curRegulatoryId==regulatory_id){
                        this.curRegulatoryId=null
                        map.setLayoutProperty('td_regulatory', 'visibility', 'none')
                        map.setLayoutProperty('td_regulatory_line', 'visibility', 'none')
                        map.setLayoutProperty('td_regulatory_symbol', 'visibility', 'none')
                    }else{
                        let filter = ['==','id',regulatory_id]
                        map.setLayoutProperty('td_regulatory', 'visibility', 'visible')
                        map.setLayoutProperty('td_regulatory_line', 'visibility', 'visible')
                        map.setLayoutProperty('td_regulatory_symbol', 'visibility', 'visible')
                        map.setFilter('td_regulatory', filter);
                        map.setFilter('td_regulatory_line', filter);
                        map.setFilter('td_regulatory_symbol', filter);
                        this.curRegulatoryId=regulatory_id
                    }
                    
                })
            }
        },
    }
}
</script>
<style lang="scss" scoped>
    .infomation_plate{
        width: 100%;
        background-color: #001020; 
        overflow: hidden;
        position: absolute;
        top: 40px;
        transition: all 0.5s;
        .chart_map{
            margin-top: -1px;
            height: 100%;
           .content{
               display: flex;
               justify-content: space-between;
               height: 100%;
               .macroscopic_box,.matching_box,.market_box{
                   width: 50%;
                   overflow: hidden;
                   transition: all 0.5s;
               }
               .map{
                   width: 50%;
                   transition: all 0.5s;
               }
           } 
        }
    }
</style>