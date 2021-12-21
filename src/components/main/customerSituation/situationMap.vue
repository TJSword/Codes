<template>
  <div class="map_box" :style="{'z-index':mapMode?'999999':'0'}">
    <!-- 地图工具1 -->
    <div class="map_tool">
      <div class="tool_item" @click="showMapSelect = !showMapSelect">
        <el-tooltip class="item" effect="light" content="底图选择" placement="bottom-end">
          <i class="iconfont icon-morenditu" :style="{'color':showMapSelect?'#f56c6c':'#333'}"></i>
        </el-tooltip>
      </div>
      <div class="tool_item" @click="ranging()">
        <el-tooltip class="item" effect="light" content="测距离" placement="bottom-end">
          <i class="iconfont icon-ceju" :style="{'color':measureLengthState?'#f56c6c':'#333'}"></i>
        </el-tooltip>
      </div>
      <div class="tool_item" @click="surveyArea()">
        <el-tooltip class="item" effect="light" content="测面积" placement="bottom-end">
          <i class="iconfont icon-cemianji" :style="{'color':measureAreaState?'#f56c6c':'#333'}"></i>
        </el-tooltip>
      </div>
      <div class="tool_item" @click="mapModeChange()">
        <el-tooltip class="item" effect="light" :content="mapMode?'清爽模式':'普通模式'" placement="bottom-end">
          <i :class="['iconfont',mapMode?'icon-ditu':'icon-yingyong']" style="font-weight:bold"></i>
        </el-tooltip>
      </div>
    </div>
    
    <!-- 地图容器 -->
    <div class="mapBox"></div>
    <div id="situation_map" class="basemap_container"></div>
    <div :id="map_ID" class="map_container"></div>
    
    <!-- 地图缩放级别 -->
    <div class="map_size">地图级别:{{mapSize}}</div>
    <!-- 地图工具2 -->
    <div class="tools">
      <el-tooltip class="item" effect="light" :content="item.name" 
      placement="left" v-for="(item,index) in tools" :key="index">
        <i :class="item.icon" :style="{'color':cur_tool==index?'#fff800':'#00ff96'}"
        v-if="item.show"
        @click="toolClick(index,item)"
        ></i>
      </el-tooltip>
    </div>
    <!-- 工具盒子 -->
    <div class="tool_box">
      <!-- 搜索 -->
      <div class="tool_search" v-if="cur_tool===0">
        <div class="input_box">
          <el-input v-model="searchInfo" size="mini" @input="mapSearch" clearable placeholder="请输入地点查询"></el-input>
        </div>
        <div class="result_box">
          <div class="item" @click="toSearchPoi(item)" v-for="(item,index) in searchResult" :key="index">
            <div class="head">
              <div class="name">{{index+1}}、{{item.name}}</div>
              <el-tag size="mini">{{item.adname}}</el-tag>
            </div>
            <div class="cont">{{item.address}}</div>
          </div>
        </div>
      </div>
      <!-- 图层样式 -->
      <div class="layer_style" v-if="cur_tool===1">
        <div class="color_map">
          <div class="color_item">
            <el-color-picker v-model="color_symbol" show-alpha size="mini" @change="symbolColorChange()"></el-color-picker>
            <div class="color_label">文字</div>
          </div>
          <div class="color_item">
            <el-color-picker v-model="color_border" show-alpha size="mini" @change="borderColorChange()"></el-color-picker>
            <div class="color_label">描边</div>
          </div>
          <div class="color_item">
            <el-color-picker v-model="color_fill" show-alpha size="mini" @change="fillColorChange()"></el-color-picker>
            <div class="color_label">填充</div>
          </div>
        </div>
        <div style="border:rgba(96,92,92,0.5) 1px solid;margin:10px 0;"></div>
        <div class="tool_opacity">
          <div class="opacity_fill">
            <span class="demonstration">图层填充透明度：{{fill_opacity}}</span>
            <el-slider
              v-model="fill_opacity"
              :step="0.1"
              :min="0"
              :max="1"
              @change="fillOpacityChange()"
              show-stops>
            </el-slider>
          </div>
          <div class="opacity_border">
            <span class="demonstration">图层描边透明度：{{border_opacity}}</span>
            <el-slider
              v-model="border_opacity"
              :step="0.1"
              :min="0"
              :max="1"
              @change="borderOpacityChange()"
              show-stops>
            </el-slider>
          </div>
        </div>
        <div style="border:rgba(96,92,92,0.5) 1px solid;margin:10px 0;"></div>
        <div class="plate_layer">
          
        </div>
      </div>
      <!-- 透明度 -->
      <div class="" v-if="cur_tool===2">
        
      </div>
      <!-- 图层 -->
      <div class="tool_layer" v-if="cur_tool===3">
        <div class="tool_wrap">
        </div>
      </div>
      <!-- 底图 -->
      <div class="tool_basicmap" v-if="showMapSelect">
          <el-radio-group v-model="curBasicmap" @change="changeBsicMap">
            <el-radio v-for="(item,i) in basicMap" :label="item.url" :key="i">{{item.name}}</el-radio>
          </el-radio-group>
      </div>
      <!-- 围栏 -->
      <div class="tool_enclosure" v-if="cur_tool===5">
        <div class="tool_wrap">
          <el-radio-group v-model="curEnclosure" @change="changeEnclosure">
            <el-radio v-for="(item,i) in enclosureType" :label="item.value" :key="i">{{item.name}}</el-radio>
          </el-radio-group>
        </div>
        <div class="isochronous_box" v-if="curEnclosure==='isochronous'">
          <Isocircle :startCoordinate="isoPoint" @geojson="setIsochronous" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { CircleMode,DragCircleMode,DirectMode,SimpleSelectMode } from 'mapbox-gl-draw-circle';
import * as turf from '@turf/turf'
import Compare from 'mapbox-gl-compare'
//API
import commonApi from '@/api/commonApi'
import { mapGetters } from "vuex";
import { gdSiteSearch,gcj02towgs84 } from "@/utils/public"
//组件
import Isocircle from '@/components/common/IsoCircle'
export default {
  name: "city_map",
  props: {
    mapType:{ //使用地图的页面名称
      type:String,
      default:'dataQuery'
    }
  },
  components: {
    Isocircle
  },
  data() {
    return {
      map_ID:'mapbox_map',
      showMapSelect:false,//底图
      mapMode:false,//地图模式
      measureLengthState:false,//测距状态
      measureAreaState:false,//测量面积
      points:[],//测距点
      jsonPoint:{
        'type': 'FeatureCollection',
        'features': []
      },
      jsonLine:{
        'type': 'FeatureCollection',
        'features': []
      },
      markers:[],
      situation_map:null,
      local_map:null,
      mapSize:9,//地图缩放等级
      heigth_false:(window.innerHeight-33)+'px',
      heigth_true:(window.innerHeight-200)+'px',
      height_ohter:(window.innerHeight)+'px',
      layerArr:[
        // {value:'3d_building',name:'3D建筑物'}
      ],
      layer_3dbuilding:false,//3d建筑物显示
      tools:[ //地图工具
        {name:'搜索',icon:'el-icon-search',show:true},
        {name:'板块样式',icon:'el-icon-set-up',show:true},
        {name:'透明度',icon:'el-icon-s-help',show:false},
        {name:'图层',icon:'el-icon-s-grid',show:false},
        {name:'底图',icon:'el-icon-location-information',show:false},
        {name:'围栏',icon:'el-icon-crop',show:false},
        {name:'文章留言',icon:'el-icon-chat-dot-round',show:true},
        {name:'用户使用手册',icon:'el-icon-question',show:true},
      ],
      map_draw:null,//地图绘制
      cur_tool:null, //当前地图工具索引
      searchInfo:'',//地图搜索
      searchResult:[], //地图搜索结果(高德)
      curBasicmap:'mapbox://styles/noconriander/ckjxqgg190k8q17qib182syt7', //当前底图
      basicMap:[ //底图
        { name:'默认地图',url:'mapbox://styles/noconriander/ckjxqgg190k8q17qib182syt7' },
        { name:'卫星地图',url:'mapbox://styles/noconriander/ck3e3v9w74je21dod3xdvro6u' },
        { name:'街道地图',url:'mapbox://styles/noconriander/ckhn5n4xt0a8j1apx3pvnqgei' },
        { name:'暗色地图',url:'mapbox://styles/noconriander/cknihe9io0j4017odnittuw8e' },
        { name:'亮色地图',url:'mapbox://styles/noconriander/cknihl8w80j9817p5g64nycg7' },
        
      ],
      enclosureType:[ //围栏类型
        { name:'半径圆',value:'circle'},
        { name:'自定义多边形',value:'polygon'},
        { name:'等时圈',value:'isochronous'},
      ],
      curEnclosure:null,//当前围栏
      isoPoint:'',//等时圈起始点
      colors:[], //板块渲染颜色
      color_symbol:'rgba(255, 255, 255, 1)',//图层symbol颜色
      color_border:'rgba(149, 149, 246,1)',//图层描边颜色
      color_fill:'rgba(58, 88, 125, 1)',//图层填充颜色
      fill_opacity:0.2,//图层填充透明度
      border_opacity:0.4,//图层描边透明度
      tooltip:null,
      measureTip:null,
      screenWidth:'',//屏幕宽度
    };
  },
  beforeMount(){
    this.map_ID = "mapbox_map" + parseInt(Math.random() * 100000); //设置地图ID
    this.colors = this.plate_color
    console.log('地图设置')
    setTimeout(()=>{
      this.mapSet()
    },100)
  },
  mounted() {
    var that = this
    window.addEventListener("resize", function() {
      return (() => {
        window.screenWidth= document.body.clientWidth;
        that.screenWidth= window.screenWidth;
      })();
    })
  },
  watch:{
    cur_tool:{
      handler(val){
        let map = this.local_map
        let flag = map.getLayer("searchPoints")
        if(flag!==undefined){
          if(val===0){
            map.setLayoutProperty('searchPoints','visibility','visible')
          }else{
            map.setLayoutProperty('searchPoints','visibility','none')
          }
        }
        if(val!==5){
          this.changeEnclosure(null)
          this.curEnclosure = null
        }
      }
    },
    colors:{
      handler(newVal){
        this.$store.dispatch("setPlateColor",newVal)
      },
      deep:true
    },
    screenWidth: {
      handler(newValue) {
        if(this.situation_map!==null){
          this.situation_map.resize()
          this.local_map.resize()
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters([
      "cityCode",
      "plateData",
      "plate_color",
      "mapIsload",
      "landTypeTab"])
  },
  methods: {
    //界面模式
    mapModeChange(){
      this.mapMode = !this.mapMode
      if(this.mapMode){
        this.local_map.setLayoutProperty("plate_fill", "visibility", 'none');
        this.local_map.setLayoutProperty("plate_line", "visibility", 'none');
        this.local_map.setLayoutProperty("plate_labels", "visibility", 'none');
      }else{
        this.local_map.setLayoutProperty("plate_fill", "visibility", 'visible');
        this.local_map.setLayoutProperty("plate_line", "visibility", 'visible');
        this.local_map.setLayoutProperty("plate_labels", "visibility", 'visible');
      }
    },
    //测距
    ranging(){
      this.measureLengthState = !this.measureLengthState
      this.$store.dispatch('setMesureState',true) //测量状态
      if(this.measureLengthState){
        this.measureAreaState = false
        this.measureLength()
      }
    },
    //测面积
    surveyArea(){
      this.measureAreaState = !this.measureAreaState
      this.$store.dispatch('setMesureState',true) //测量状态
      if(this.measureAreaState){
        this.measureLengthState = false
        this.measureArea()
      }
    },
    //地点搜索
    mapSearch(val){
      let results = gdSiteSearch(val)
      console.log(results)
      this.searchResult = results
      //地图上添加搜索点
      let fc = {
        "type": "FeatureCollection",
        "features": []
      }
      results.forEach((item,i)=>{
        let localtion = item.location.split(',')
        fc.features.push({
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": gcj02towgs84(localtion[0],localtion[1])
          },
          "properties": {
              "name": item.name,
              "index": i+1,
              "type": item.type,
              "address": item.address
          }
        })
      })
      let map = this.local_map
      let source_searchPois = map.getSource("source_searchPois")
      if(source_searchPois==undefined){
        //地图搜索点
        map.addSource("source_searchPois", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });
        map.addLayer({
          id: "searchPoints",
          type: "symbol",
          source: "source_searchPois",
          layout: {
            "icon-image": "poimarker",
            "text-field": "{index}",
            "icon-allow-overlap":true,
            "icon-ignore-placement":true,
            "text-offset": [0, -1],
            "text-anchor": "top",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-size": 13,
            "icon-size": 0.5,
            "visibility":"visible"
          },
          paint: {
            "text-opacity": 1,
            "text-color": "#fff",
          },
        });
      }
      map.getSource('source_searchPois').setData(fc)
    },
    //跳转到选择的poi查询点
    toSearchPoi(item){ 
      let localtion = item.location.split(',')
      let center = gcj02towgs84(localtion[0],localtion[1])
      // this.mapFlyTo(center,13)
    },
    //地图工具
    mapFlyTo(center,zoom){ //地图飞行到
      var map = this.local_map
      map.flyTo({
        center: center,
        zoom: zoom,
        speed: 0.8,
        curve: 2
      })
    },
    //工具选择
    toolClick(index,item){ 
      if(index===7){ //用户使用手册
        window.open('http://118.190.150.38:8282/dmc-web/files/template/投资云地图操作指南.pdf','_blank')
        return 
      }
      if(index==this.cur_tool){
        this.cur_tool = null
        if(index===5){ //退出围栏模式
          this.$store.dispatch("setEnclosure",false)
          this.$store.dispatch("setEnclosureCoor",null)
        }
      }else{
        this.cur_tool = index
        if(index===5){ //进入围栏模式
          this.$store.dispatch("setEnclosure",true)
          this.$store.dispatch("setEnclosureCoor",null)
        }
      }
      if(item.name==='文章留言'){ //文章留言
        this.$store.dispatch('setShowMessage',this.cur_tool===index?true:false)
      }
    },
    fillOpacityChange(){ //图层填充透明度改变
      this.local_map.setPaintProperty("plate_fill", "fill-opacity", this.fill_opacity);
    },
    borderOpacityChange(){ //图层描边透明度改变
      this.local_map.setPaintProperty("plate_line", "line-opacity", this.border_opacity);
    },
    symbolColorChange(){ //图层symbol颜色改变
      this.local_map.setPaintProperty("plate_labels", "text-color", this.color_symbol);
    },
    borderColorChange(){ //图层border颜色改变
      this.local_map.setPaintProperty("plate_line", "line-color", this.color_border);
    },
    fillColorChange(){ //图层填充颜色改变
      console.log(this.color_fill)
      this.local_map.setPaintProperty("plate_fill", "fill-color", this.color_fill);
    },
    layer3dChange(){ //3d建筑图层显示隐藏添加
      var map = this.local_map
      let resource_3dbuilding = map.getLayer("layer_3dbuilding")
      if(this.layer_3dbuilding){
        if(resource_3dbuilding===undefined){
          let code = this.cityCode
          var workSpace_layer = 'touziyun:'+code+'_3dbuilding'
          let url = this.geoserverURL+'/geoserver/gwc/service/tms/1.0.0/'+workSpace_layer+'@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf'
          map.addSource("layer_3dbuilding_resource", {
            type: "vector",
            scheme: "tms",
            tiles: [url]
          });
          map.addLayer({
            'id': 'layer_3dbuilding',
            'source': 'layer_3dbuilding_resource',
            'source-layer': code+"_3dbuilding",
            'type': 'fill-extrusion',
            'minzoom': 13,
            'paint': {
              'fill-extrusion-color': '#91aed2',
              'fill-extrusion-height': [
              "interpolate", ["linear"], ["zoom"],
                13, 0,
                15.05, ['to-number',["get", "height"]]
              ],
              // 'fill-extrusion-base': [
              //   "interpolate", ["linear"], ["zoom"],
              //   15, 0,
              //   15.05, ["get", "min_height"]
              // ],
              'fill-extrusion-opacity': .6
            },
            'layout':{
              'visibility':'visible'
            }
          },"plate_fill");
          map.moveLayer("plate_fill","layer_3dbuilding")
         
        }else{
          map.setLayoutProperty('layer_3dbuilding', 'visibility', 'visible')
        }
      }else{
        map.setLayoutProperty('layer_3dbuilding', 'visibility', 'none') 
      }
      
    },
    //地图切换
    changeBsicMap(e){
      this.situation_map.setStyle(e)
    },
    changeEnclosure(val){ //围栏方式切换
      console.log(val)
      let map = this.local_map
      //移除以前的围栏
      if(this.map_draw.getAll().features.length>0){
        this.map_draw.deleteAll()
      }
      //移除dom
      let measure_result = document.getElementsByClassName("measure_result");
      let l = measure_result.length
      if(measure_result.length>0){
        for(let i=0;i<l;i++){
          measure_result[0].remove()
        }
      }
      //隐藏等时圈图层
      let source = map.getSource('isoline_source')
      if(source){
        map.getSource('isoline_source').setData({
          type: "FeatureCollection",
          features: []
        });
      }
      //更改绘制模式
      if(val!==null){
        this.local_map.getCanvas().style.cursor = 'crosshair';
        if(val === 'circle'){
          this.map_draw.changeMode('drag_circle')
        }else if(val === 'polygon'){
          this.map_draw.changeMode('draw_polygon')
        }else if(val === 'isochronous'){
          this.map_draw.changeMode('draw_point')
        }
      }else{
        this.local_map.getCanvas().style.cursor = '';
      }
    },
    //板块切换
    plateTypeChange(e){
      
      var map = this.local_map
      var filters = ['==', 'type', e]
      
      map.setFilter('plate_fill', filters);
      map.setFilter('plate_line', filters);
      map.setFilter('plate_labels', filters);

      this.borderOpacityChange()
      this.symbolColorChange()
      this.borderColorChange()
      this.fillColorChange()
    },
    //地图加载
    mapSet() {
      var that = this;
      //chengdu_touziyun
      that.mbgl.accessToken = "pk.eyJ1Ijoibm9jb25yaWFuZGVyIiwiYSI6ImNrbXliMnRsejAyYWYyd28wc3RxYzN3ZjEifQ.9iGOZBik4yAVuNKMgrPPsA";
      if (!that.mbgl.supported()) {
        alert("该浏览器不支持Mapbox GL,请更换浏览器");
      } else {
        that.mbgl.Compare = Compare
        let center = localStorage.getItem('cityCenter')
        var baseMap = new that.mbgl.Map({
          container: 'situation_map',
          style: this.curBasicmap,
          center: center?JSON.parse(center):[104.063115,30.669457],
          zoom: 8,
          pitch:0,
          localIdeographFontFamily: "MSYH"
        });
        var map = new that.mbgl.Map({
          container: that.map_ID,
          style: 'mapbox://styles/noconriander/ckh5y3gd405kv19pavciyo2fu', //空白图层
          center: center?JSON.parse(center):[104.063115,30.669457],
          zoom: 8,
          pitch:0,
          localIdeographFontFamily: "MSYH"
        });
        var compareMap = new that.mbgl.Compare(baseMap, map, '.mapBox',{
          
          // Set this to enable comparing two maps by mouse movement:
          // mousemove: true
        });
        
        that.local_map = map
        that.$store.dispatch("setLocalMap", map);

        that.situation_map = baseMap
        var draw = new MapboxDraw({
          //defaultMode: "drag_circle",
          //userProperties: true,
          modes: {
            ...MapboxDraw.modes,
            draw_circle  : CircleMode,
            drag_circle  : DragCircleMode,
            direct_select: DirectMode,
            simple_select: SimpleSelectMode
          },
          keybindings:true,
          displayControlsDefault: false,
          controls: {
            polygon: false,
            line_string:false,
            point:false,
            trash: true,
          }
        });
        this.map_draw = draw
        that.$store.dispatch("setLedgerDraw", draw);
        //添加地图组件
        //map.addControl(new that.mbgl.NavigationControl())
        //map.addControl(new that.mbgl.FullscreenControl());
        //that.situation_map.addControl(new that.mbgl.FullscreenControl());
        map.addControl(new that.mbgl.NavigationControl(), 'top-right');
        // map.addControl(draw,'bottom-left')
        //地图是否加载完
        map.on('load', e => {
          that.$store.dispatch("setSituationMap", map);
          //geoserver图层加载
          // that.geoserverLayerLoad()
          
          //统计地图调用次数
          that.staMapLoad()
          setTimeout(_=>{
            that.$store.dispatch('setMapisload',true)
          },800)
        })
        //图层事件-板块
        that.mapEvent();
        //地图测量事件
        that.measureEvent()
        //添加天空跟地形
        that.loadMapLayers()
        
        map.loadImage("http://47.104.165.136:8099/test/poi-marker1.png",  (error, poimarker) => {
          if (error) throw error;
          map.addImage("poimarker", poimarker);
        })
        //已请求城市中心点数据则飞行到中心点
        // setTimeout(_=>{
        //   map.flyTo({
        //     center: center?JSON.parse(center):[104.063115,30.669457],
        //     zoom: 9,
        //     speed: 0.6,
        //     curve: 1.8,
        //     pitch:0,
        //   })
        // },1500)
      }
    },
    //统计地图调用次数
    staMapLoad(){
      commonApi.statisticsMapLoad()
      .then(res=>{
        if(res.data.code===0){
          console.log('地图调用次数+1')
        }
      })
    },
    loadMapLayers(){ //添加天空跟地形
      let map = this.local_map
      map.on('load',()=>{
        map.addSource('mapbox-dem', {
          'type': 'raster-dem',
          'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
          'tileSize': 512,
          'maxzoom': 14
        });
        //map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
          
        map.addLayer({
          'id': 'sky',
          'type': 'sky',
          'paint': {
            'sky-type': 'gradient',
            'sky-gradient': [
              'interpolate', ['linear'], ['sky-radial-progress'],
              0.8, 'rgba(135, 206, 235, 1.0)',
              1, 'rgba(0,0,0,0.1)'
            ],
            'sky-gradient-center': [0, 0],
            'sky-gradient-radius': 90,
            'sky-opacity': [
              'interpolate', ['exponential', 0.1], ['zoom'],
              5, 0,
              22, 1
            ]
          }
          });
      })
    },
    geoserverLayerLoad(){ //geoserver图层
      let map = this.local_map

      var code = this.cityCode?this.cityCode:'510100'
      // var workSpace_layer = 'city_'+code+':'+code+'_'
      // var url_head = this.geoserverURL+'/geoserver/gwc/service/tms/1.0.0/'
      // var url_end = '@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf'
      // //通用板块
      // var plates_layer = url_head+workSpace_layer+'plates'+url_end
        var cityPolygonLayer = this.geoserverURL+'/geoserver/gwc/service/tms/1.0.0/city_100000:city_polygon@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf'
        console.log(cityPolygonLayer)
        map.addSource("serverLayer_plates", {
          type: "vector",
          scheme: "tms",
          tiles: [cityPolygonLayer]
        });
        map.addLayer({ //通用板块-填充
          id: "plate_fill",
          type: "fill",
          source: "serverLayer_plates",
          "source-layer": "city_polygon",
          filter: ["==", "tree_level", 3],
          paint: {
            "fill-color": this.color_fill,
            "fill-opacity": 
            ["case",
              ["boolean", ["feature-state", "hover"], false],
              0.1,
              this.fill_opacity
            ]
          },
          layout: {
            "visibility": this.landTypeTab=="citymap"?"none":"visible"
          }
        });
         
        map.addLayer({  //通用板块-描边
          id: "plate_line",
          type: "line",
          source: "serverLayer_plates",
          "source-layer": "city_polygon",
          filter: ["==", "tree_level", 3],
          layout: {
            "visibility": this.landTypeTab=="citymap"?"none":"visible"
          },
          paint: {
            "line-color":this.color_border,
            "line-width": 
            ["case",
              ["boolean", ["feature-state", "hover"], false],
              2.5,
              1
            ],
            "line-opacity": this.border_opacity,
            //"line-dasharray": [4,4]
          }
        });
        map.addLayer({ //文字symbol
          id: "plate_labels",
          type: "symbol",
          source: "serverLayer_plates",
          "source-layer": "city_polygon",
          filter:['==', "tree_level", 3],
          layout: {
            "text-field": ["get", "name"],
            "text-allow-overlap": false,
            "text-size": 10,
            "visibility": this.landTypeTab=="citymap"?"none":"visible"
          },
          paint:{
            "text-opacity":1,
            "text-color": this.color_symbol,
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
        
        //数据查询菜单缩放地图缩放
        this.$('.menu_toggle').on('click',()=>{
          map.resize()
          map.flyTo({
              center: this.plateData.curCityInfo.center,
              zoom: 9,
              speed: 0.8,
              curve: 2
          })
        })
      
    },
    //图层事件-板块
    mapEvent(){
      var that = this
      var map = that.local_map
      var hoveredStateId = null
      //图层事件
      map.on('click',e=>{
        //console.log(e)
      })
      map.on("mouseleave", "plate_fill", e => {
        if(that.mapType==="dataQuery"){
        }
        //map.getCanvas().style.cursor = '';
      });
      map.on('click','plate_fill',e=>{
        //console.log(e)
        //阻止上层图层的点击事件穿透
        // if (e.originalEvent.cancelBubble) {
        //   return;
        // }
      })
      map.on('mouseup',(e)=>{
        //地理围栏
        if(that.cur_tool===5&&that.mapType==='dataQuery'&&that.map_draw.getAll().features.length>0){
          let feaCol = that.map_draw.getAll()
          console.log(feaCol)
          //移除dom
          let measure_result = document.getElementsByClassName("measure_result");
          let l = measure_result.length
          if(measure_result.length>0){
            for(let i=0;i<l;i++){
              measure_result[0].remove()
            }
          }
          //存储围栏坐标
          let coorStr = ''
          if(that.curEnclosure==='circle'){ //半径圆
            let radiusInKm = feaCol.features[0].properties.radiusInKm
            if(radiusInKm){
              let radius = (radiusInKm).toFixed(2)
              let coords = feaCol.features[0].properties.center
              that.addMeasureRes(coords,`半径:${radius} km`)
              that.local_map.getCanvas().style.cursor = '';
            }
            //存储围栏坐标
            let coordinates = feaCol.features[0].geometry.coordinates[0]
            coordinates.forEach(item=>{
              coorStr += `${item[0]},${item[1]};`
            })
            that.$store.dispatch("setEnclosureCoor",coorStr)
            console.log(coorStr)
          }else if(that.curEnclosure==='polygon'){  //自定义多边形
            //添加边长marker
            let feaCol = that.map_draw.getAll()
            let points = feaCol.features[0].geometry.coordinates[0]
            if(points.length>2){
              let featuresArr = []
              points.forEach((item,i)=>{
                
                if(i<points.length-1){
                  let from = turf.point(item);
                  let to = turf.point(points[i+1]);
                  let opt = {units:'kilometers'}
                  let len = JSON.parse(turf.distance(from,to,opt).toFixed(2))
                  let midPointCoor = turf.midpoint(from, to).geometry.coordinates;
                  console.log(len,midPointCoor)
                  if(len>0){
                    that.addMeasureRes(midPointCoor,`${len} km`)
                    featuresArr.push(turf.point(item))
                  }
                }
              })
              if(points.length>3){
                //添加面积marker
                var features = turf.featureCollection(featuresArr);
                let featureCenter = turf.center(features).geometry.coordinates;
                let pol = turf.polygon([points])
                let area1 = turf.area(pol)
                let area2 = (area1/1000000).toFixed(2)
                that.addMeasureRes(featureCenter,`${area2} k㎡`)
                //存储围栏坐标
                let coordinates = feaCol.features[0].geometry.coordinates[0]
                coordinates.forEach(item=>{
                  coorStr += `${item[0]},${item[1]};`
                })
                that.$store.dispatch("setEnclosureCoor",coorStr)
                console.log(coorStr)
              }
            }
          }else if(that.curEnclosure==='isochronous'){ //等时圈
            console.log(e)
            let coor = feaCol.features[0].geometry.coordinates
            if(coor.length>0){
              that.isoPoint = coor[0].toFixed(6)+','+coor[1].toFixed(6)
              that.addMeasureRes(coor,`起始点`)
            }else{
              that.isoPoint = e.lngLat.lng.toFixed(6)+','+e.lngLat.lat.toFixed(6)
              that.addMeasureRes([e.lngLat.lng,e.lngLat.lat],`起始点`)
            }
            that.local_map.getCanvas().style.cursor = '';
          }
        }
      })
      map.on('zoom',e=>{
        that.mapSize = map.getZoom().toFixed(2)
      })
      var searchPoiPopup = new that.mbgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });
      map.on("mousemove", "searchPoints", function(e) {
        map.getCanvas().style.cursor = "pointer";
        let coordinates = [e.lngLat.lng, e.lngLat.lat];
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        var name = e.features[0].properties.name;
        var address = e.features[0].properties.address;
        var type = e.features[0].properties.type;

        var info = `<P class="item_head">${name}</p>
          <div class="item_name">地址：<span class="item_val">${address}</span></div>
          <div class="item_name">类型：<span class="item_val">${type}</span></div>`;
        searchPoiPopup
        .setLngLat(coordinates)
        .setHTML(info)
        .addTo(map);
      });
      map.on("mouseleave", "searchPoints", function() {
        map.getCanvas().style.cursor = "";
        searchPoiPopup.remove();
      });
    },
    addMeasureRes(coor,str){ //添加绘制marker
      let map = this.local_map
      //添加dom
      let ele = document.createElement('div');
      ele.setAttribute('class', 'measure_result');
      let option = {
        element: ele,
        anchor: 'center',
        offset: [0, 20]
      };
      ele.innerHTML = str;
      var marker = new this.mbgl.Marker(option);
      marker.setLngLat(coor).addTo(map);
    },
    setIsochronous(val){ //围栏等时圈json结果
      console.log('等时圈json',val)
      let map = this.local_map
      let source = map.getSource('isoline_source')
      if(source){
        map.getSource('isoline_source').setData(val);
      }else{
        map.addSource('isoline_source', {
          type: 'geojson',
          data: val
        });
        map.addLayer({
          id: "isoline_fill",
          type: "fill",
          source: "isoline_source",
          paint: {
            "fill-color": '#3bb2d0',
            "fill-opacity": 0.1
          }
        });
        map.addLayer({
          id: "isoline_line",
          type: "line",
          source: "isoline_source",
          layout: {},
          paint: {
            "line-color":'#3bb2d0',
            "line-width":1,
            "line-opacity": 1
          }
        });
      }
      //存储围栏坐标
      let coorStr = ''
      let coordinates = val.features[0].geometry.coordinates[0]
      coordinates.forEach(item=>{
        coorStr += `${item[0]},${item[1]};`
      })
      this.$store.dispatch("setEnclosureCoor",coorStr)
      console.log(coorStr)
    },
    measureEvent(){ //地图测量事件
      var that = this
      var map = that.local_map

      map.on('click', _e => {
        if(that.measureLengthState) { //测距
          var coords = [_e.lngLat.lng, _e.lngLat.lat];
          that.addMeasureMaker(coords);
          that.addPoint(coords);
          that.points.push(coords);
        }
        if(that.measureAreaState){ //测面积
          var coords = [_e.lngLat.lng, _e.lngLat.lat];
          that.points.push(coords);
          that.addAreaPoint(coords);
        }
      });
      map.on('mousemove', _e => {
        if(that.measureLengthState) { //测长度
          var coords = [_e.lngLat.lng, _e.lngLat.lat];
          if (that.jsonPoint.features.length > 0) {
            var prev = that.jsonPoint.features[that.jsonPoint.features.length - 1];
            var json = {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: [prev.geometry.coordinates, coords]
              }
            };
            map.getSource('line-move').setData(json);
            that.measureTip.innerHTML = that.getLength(coords);

          } else {
            that.measureTip.innerHTML = '点击测量-双击结束';
          }
          that.tooltip.setLngLat(coords);
        }
        if(that.measureAreaState){ //测面
          var coords = [_e.lngLat.lng, _e.lngLat.lat];
          var len = that.jsonPoint.features.length;
          if (len === 0) {
            that.measureTip.innerHTML = '点击测量-双击结束';
          } else if (len ===1) {
            that.measureTip.innerHTML = '点击继续绘制-双击结束';
          } else {
            var pts = that.points.concat([coords]);
            pts = pts.concat([that.points[0]]);
            var json = {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [pts]
              }
            };
            map.getSource('line-area').setData(json);
            that.measureTip.innerHTML = that.getArea(coords);
          }
          that.tooltip.setLngLat(coords);
        }
      });

      map.on('dblclick', _e => {
          if(that.measureLengthState){ //测距
            
            var coords = [_e.lngLat.lng, _e.lngLat.lat];
            that.addPoint(coords);
            that.measureLengthState = false;
            map.getCanvas().style.cursor = '';
            // that.jsonPoint.features = [];
            // that.jsonLine.features = [];
            that.tooltip.remove();
            that.tooltip = null
            // 添加关闭按钮
            const ele = document.createElement('div');
            ele.setAttribute('class', 'measure-result close');
            var option = {
              element: ele,
              anchor: 'bottom-left',
              offset: [-5, -10]
            };
            ele.innerHTML = '×';
            new that.mbgl.Marker(option).setLngLat(coords).addTo(map);

            ele.onclick = function (__e) {
              __e.stopPropagation();
              map.doubleClickZoom.enable();
              that.clearMeasure();
            }
            this.$store.dispatch('setMesureState',false) //退出测量
          }
          if(that.measureAreaState){ //测面
            var coords = [_e.lngLat.lng, _e.lngLat.lat];
            that.points.push(coords);
            that.measureAreaState = false;
            map.getCanvas().style.cursor = '';
            that.jsonPoint.features = [];
            that.jsonLine.features = [];
            that.tooltip.remove();
            that.tooltip = null
            // 添加测算面积
            var area_ele = document.createElement('div');
            area_ele.setAttribute('class', 'measure-result');
            var option_area = {
              element: area_ele,
              anchor: 'bottom-left',
              offset: [-5, -10]
            };
            let center = that.getCenterCoor(coords)
            area_ele.innerHTML = that.getArea(coords);
            new that.mbgl.Marker(option_area).setLngLat(center).addTo(map);
            // 添加关闭按钮
            var _ele = document.createElement('div');
            _ele.setAttribute('class', 'measure-result close');
            var option = {
              element: _ele,
              anchor: 'bottom-left',
              offset: [-5, -10]
            };
            _ele.innerHTML = '×';
            new that.mbgl.Marker(option).setLngLat(coords).addTo(map);

            _ele.onclick = function (__e) {
              __e.stopPropagation();
              map.doubleClickZoom.enable();
              that.clearMeasure();
            }
            this.$store.dispatch('setMesureState',false) //退出测量
          }
      });
    },
    measureLength() { //测量距离
      var that = this
      var map = this.local_map
      that.clearMeasure();
      //绘制提示maker
      if(that.tooltip===null){
        that.measureTip = document.createElement('div');
        that.measureTip.setAttribute('class', 'measure-result');
        that.measureTip.innerHTML = '点图上点击开始测量'
        var option = {
          element: that.measureTip,
          anchor: 'left',
          offset: [8, 0]
        };
        that.tooltip = new that.mbgl.Marker(option).setLngLat([0, 0]).addTo(map);
      }
      // 禁止双击缩放
      map.doubleClickZoom.disable();
      map.getCanvas().style.cursor = 'crosshair';
      
      var jsonPoint = that.jsonPoint
      var jsonLine = that.jsonLine

      var source = map.getSource('points');
      if(source) {
        map.getSource('points').setData(jsonPoint);
        map.getSource('line-move').setData(jsonLine);
        map.getSource('line').setData(jsonLine);
      } else {
        map.addSource('points', {
          type: 'geojson',
          data: jsonPoint
        });
        map.addSource('line', {
          type: 'geojson',
          data: jsonLine
        });
        map.addSource('line-move', {
          type: 'geojson',
          data: jsonLine
        });
        map.addLayer({
          id: 'line-move',
          type: 'line',
          source: 'line-move',
          paint: {
            'line-color': '#ff0000',
            'line-width': 2,
            'line-opacity': 0.65,
            //'line-dasharray':[3,4]
          }
        });
        map.addLayer({
          id: 'line',
          type: 'line',
          source: 'line',
          paint: {
            'line-color': '#ff0000',
            'line-width': 2,
            'line-opacity': 0.65
          }
        });
        map.addLayer({
          id: 'points',
          type: 'circle',
          source: 'points',
          paint: {
            'circle-color': '#ffffff',
            'circle-radius': 3,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ff0000'
          }
        });
      }
      
    },
    clearMeasure() {
      var that = this
      var map = this.local_map
      that.$(".measure-result").remove();
      var source = map.getSource('points');
      var json = {
        'type': 'FeatureCollection',
        'features': []
      };
      if(source) {
        map.getSource('points').setData(json);
        map.getSource('line-move').setData(json);
        map.getSource('line').setData(json);
      }
      var sourceArea = map.getSource('points-area');
      if(sourceArea) {
        map.getSource('points-area').setData(json);
        map.getSource('line-area').setData(json);
      }
      this.points = []
      this.markers = []
      this.jsonPoint = {
        'type': 'FeatureCollection',
        'features': []
      }
      this.jsonLine = {
        'type': 'FeatureCollection',
        'features': []
      }
    },
    addPoint(coords) {
      var map = this.local_map
      var jsonPoint = this.jsonPoint
      if(this.measureLengthState&&jsonPoint.features.length > 0) { //测距
        var prev = jsonPoint.features[jsonPoint.features.length - 1];
        this.jsonLine.features.push({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [prev.geometry.coordinates, coords]
          }
        });
        map.getSource('line').setData(this.jsonLine);
      }
      this.jsonPoint.features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: coords
        }
      });
      map.getSource('points').setData(jsonPoint);
    },
    getLength(coords) {
      var _points = this.points.concat([coords]);
      var line = turf.lineString(_points);
      var len = turf.length(line);
      if(len < 1) {
        len = Math.round(len * 1000) + 'm';
      } else {
        len = len.toFixed(2) + 'km';
      }
      return len;
    },
    addMeasureMaker(coords) {
      var map = this.local_map
      var ele = document.createElement('div');
      ele.setAttribute('class', 'measure-result');
      var option = {
        element: ele,
        anchor: 'left',
        offset: [8, 0]
      };
      ele.innerHTML = this.points.length === 0 ? '起点' : this.getLength(coords);
      var marker = new this.mbgl.Marker(option)
      .setLngLat(coords)
      .addTo(map);
      this.markers.push(marker);
    },
    measureArea() { //测量面积
      var that = this
      var map = this.local_map
      that.clearMeasure();
      //绘制提示maker
      if(that.tooltip===null){
        that.measureTip = document.createElement('div');
        that.measureTip.setAttribute('class', 'measure-result');
        that.measureTip.innerHTML = '点图上点击开始测量'
        var option = {
          element: that.measureTip,
          anchor: 'top',
          offset: [0, -35]
        };
        that.tooltip = new that.mbgl.Marker(option).setLngLat([0,0]).addTo(map);
      }
      // 禁止双击缩放
      map.doubleClickZoom.disable();
      map.getCanvas().style.cursor = 'crosshair';
      var source = map.getSource('points-area');
      

      var jsonPoint = that.jsonPoint
      var jsonLine = that.jsonLine
      if(source) {
        map.getSource('points-area').setData(jsonPoint);
        map.getSource('line-area').setData(jsonLine);
      } else {
        map.addSource('points-area', {
          type: 'geojson',
          data: jsonPoint
        });
        map.addSource('line-area', {
          type: 'geojson',
          data: jsonLine
        });
        map.addLayer({
          id: 'line-area',
          type: 'fill',
          source: 'line-area',
          paint: {
            'fill-color': '#ff0000',
            'fill-opacity': 0.1
          }
        });
        map.addLayer({
          id: 'line-area-stroke',
          type: 'line',
          source: 'line-area',
          paint: {
            'line-color': '#ff0000',
            'line-width': 2,
            'line-opacity': 0.65
          }
        });
        map.addLayer({
          id: 'points-area',
          type: 'circle',
          source: 'points-area',
          paint: {
            'circle-color': '#ffffff',
            'circle-radius': 3,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ff0000'
          }
        });
      }
    },
    getArea(coords) {
      var pts = this.points.concat([coords]);
      pts = pts.concat([this.points[0]]);
      var polygon = turf.polygon([pts]);
      var area = turf.area(polygon);
      area = Math.round(area) //平方米
      var area1 = (area * 0.0015).toFixed(2) //亩
      var str = area+' ㎡; '+area1+' 亩'
      return str;
    },
    getCenterCoor(coords){
      var pts = this.points.concat([coords]);
      pts = pts.concat([this.points[0]]);
      var polygon = turf.polygon([pts]);
      var center = turf.center(polygon).geometry.coordinates;
      return center
    },
    addAreaPoint(coords) {
      var map = this.local_map
      this.jsonPoint.features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: coords
        }
      });
      map.getSource('points-area').setData(this.jsonPoint);
    }
  }
};
</script>
<style lang="scss">
.mapboxgl-ctrl-top-right {
  top: 38%;
  right: 0;
}
.mapboxgl-ctrl-attrib-button{
  display: none;
}
.map_box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  .map_tool{
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 99;
    display: flex;
  }
  .tool_item{
    width: 29px;
    height: 29px;
    box-shadow: 0 0 0 2px rgba(0,0,0,.1);
    border-radius: 4px;
    background: #fff;
    color: #333;
    cursor: pointer;
    margin-left: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    .icon{
      font-size: 20px;
    }
  }
  .mapboxgl-map{
    font:unset;
  }
  .measure_result {
    background-color: white;
    border-radius: 3px;
    height: 16px;
    line-height: 16px;
    padding: 0 3px;
    font-size: 12px;
    box-shadow: 0 0 0 1px #ccc;
  }
  .land_table_kg{
    width: 30%;
    height: 95%;
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 9999;
  }
  .land_legend{
    position: absolute;
    padding: 10px;
    background: rgba(0, 0, 0, 0.46);
    right: 6px;
    bottom: 27px;
    z-index: 999;
    color: #dadada;
    .deal_state{
      .items{
        display: flex;
        align-items: center;
        .point{
          width: 10px;
          height: 10px;
          border-radius: 100%;
        }
        .label{
          font-size: 12px;
          margin-left: 15px;
        }
      }
    }
    .land_use{
      margin-top: 6px;
      .items{
        display: flex;
        align-items: center;
        .color{
          width: 10px;
          height: 10px;
          margin-right: 8px;
        }
        .sign{
          size: 14px;
          font-weight: bold;
          width: 25px;
        }
        .label{
          font-size: 12px;
          margin-left: 5px;
        }
      }
    }
  }
  .pipe_legend_layer{
    position: absolute;
    padding: 10px 20px;
    background: rgba(0, 0, 0, 0.46);
    right: 6px;
    bottom: 27px;
    z-index: 999;
    color: #dadada;
    max-width: 26%;
    display: flex;
    .title{
      font-size: 12px;
      color: #9595f6;
      margin-bottom: 10px;
    }
    .el-checkbox__label{
      color: #fff;
      font-size: 12px;
    }
    .layer{
      width: 30%;
      margin-right: 15%;
    }
    .legend{
      width: 55%;
      .cont{
        
        .pipe_legend_item{
          display: flex;
          align-items: center;
          margin-bottom: 3px;
          .line{
            width: 30%;
            height: 4px;
            border-radius: 4px;
          }
          .point{
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-left: 20px;
            margin-right: 30px;
          }
          .label{
            font-size: 12px;
          }
        }
      }
    }
  }
  .map_size{
    position: absolute;
    font-size: 12px;
    color: #fff;
    left: 10px;
    bottom: 40px;
  }
  .mapboxgl-popup-content{
    width: fit-content;
    max-width: 360px;
    background: linear-gradient(45deg, rgb(2 11 21 / 79%), #00000078);
    border-top: #668855 1px solid;
    border-bottom: #668855 1px solid;
    color: #fff;
    padding: 10px 20px;
    .item_head{
      color: #3cff43;
    }
    .item_name{
      color: #dabc62;
    }
    .item_val{
      color: #7ce8fd;
    }
  }
  .mapboxgl-popup-tip {
    border-right-color: rgba(0, 0, 0, 0.41);
}
.basemap_container{
  width: 100%;
  height: 100%;
}
  .map_container {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    clip: unset !important;
  }
  .tools{
    position: absolute;
    top: 60px;
    right: 10px;
    z-index: 99;
    i{
      color: #e6a23c;
      font-size: 16px;
      margin-bottom: 10px;
      cursor: pointer;
      transition: all 0.5s;
      margin-right: 10px;
      display: block;
    }
    i:hover{
      color: #f60;
    }
  }
  .tool_box{
    position: absolute;
    z-index: 99;
    top: 40px;
    right: 35px;
    padding: 10px;
    .tool_search{
      background: rgba(0,0,0,0.6);
      padding: 10px 20px;
      position: relative;
      .el-input__inner{
        background: none;
        border: none;
        border-radius: 0;
        border-bottom: #81858a 1px solid;
        color: #e6a23c;
      }
      .result_box{
        max-width: 250px;
        max-height: 300px;
        color: #fff;
        margin-top: 20px;
        overflow-y: scroll;
        .item{
          cursor: pointer;
          padding: 10px;
          .head{
            display: flex;
            align-items: center;
            .name{
              font-size: 12px;
              font-weight: bold;
              color: #9595f6;
              margin-right: 10px;
            }
          }
          .cont{
            font-size: 12px;
            text-align: left;
            margin-top: 5px;
            color: #c0c4cc;
          }
        }
        .item:hover{
          background: rgba(140,140,140,0.2);
        }
      }
    }
    .layer_style{
      background: rgba(0,0,0,0.3);
      min-width: 250px;
      padding: 20px;
      .color_map{
        padding: 10px;
        display:flex;
        .color_item{
          text-align: center;
          color: #fff;
          margin-right: 30px;
          .color_label{
            user-select: none;
          }
        }
      }
      .demonstration{
        color: #fff;
      }
      .tool_opacity{
        padding: 10px;
        .opacity_fill,.opacity_border{
          width: 100%;
        }
      }
    }
    
    .tool_layer{
      display: flex;
      width: auto;
      height: 100%;
      align-items: center;
      justify-content: space-between;
      background: rgba(0,0,0,0.3);
      padding: 10px;
      .el-checkbox__label{
        color: #fff;
      }
    }
    .tool_basicmap,.tool_enclosure{
      width: auto;
      height: 100%;
      background: rgba(0,0,0,0.3);
      padding: 10px 20px 20px 20px;
      position: relative;
      .el-radio{
        display: block;
        margin-top: 10px;
      }
      .el-radio__label{
        color: #fff;
      }
    }
    .isochronous_box{
      margin-top: 20px;
      padding: 10px 0;
      border-top: #233035 1px solid;
    }
    .tool_land{
      display: flex;
      width: 65%;
      height: 100%;
      align-items: center;
      justify-content: space-between;
      background: rgba(0,0,0,0.3);
      padding: 10px;
      .demonstration{
        color: #fff;
      }
      .el-checkbox__label{
        color: #b9b9b9;
      }
    }
    .tool_wrap{
      display:flex;
      .tool_item{
        display: flex;
        align-items: center;
        .t_head{
          border-left: #333 1px solid;
          color: #e6a23c;
          padding: 0 10px;
          margin-right: 10px;
          height: 100%;
        }
      }
    }
  }
  .el-table {
    background: rgba(0,0,0,0.6);
    color: rgb(143, 143, 143);
    font-size: 12px;
  }
  .el-table .cell{
    position:relative;
  }
  .el-table .caret-wrapper{
    position: absolute;
    top: -5px;
    right: -3px;
  }
  .el-table td,
  .el-table th.is-leaf,
  .el-table--border,
  .el-table--group {
    border-color: #44444488;
  }
  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background-color: #44444481;
  }
  .el-table .row1 {
    background: rgba(0,0,0,0.8);
  }

  .el-table .row2 {
    background: #101010ee;
  }
  .el-table td{
    padding: 4px 0;
  }
  .el-table th {
    padding: 6px 0;
    font-size: 12px;
    font-weight: normal;
  }
  .el-table__body-wrapper {
    background: none;
  }
}

</style>