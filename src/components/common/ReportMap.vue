<template>
  <div class="population_map">
    <!-- 卫星地图切换按钮 -->
    <div class="layer_change" @click="satelliteLayer()">
      <i :class="['icon iconfont',satellite?'icon-weixing':'icon-morenditu']"></i>
    </div>
    <!-- 地图容器 -->
    <div class="mapBox"></div>
    <div id="base_map" class="basemap_container"></div>
    <div :id="map_ID"  class="map_container"></div>
    <!-- 地图缩放级别 -->
    <div class="map_size">地图级别:{{mapSize}}</div>
    <!-- 搜索 -->
    <div class="tool_search">
      <div class="input_box">
        <i class="icons el-icon-search"></i>
        <el-input v-model="searchInfo" size="mini" @input="mapSearch" clearable placeholder="请输入地点查询"></el-input>
      </div>
      <div class="result_box">
        <div class="item" @click="toSearchPoi(item)" v-for="(item,index) in searchResult" :key="index">
          <div class="head">
            <div class="name">{{index+1}}、{{item.name}}</div>
            <!-- <el-tag size="mini">{{item.adname}}</el-tag> -->
          </div>
          <div class="cont">{{item.address}}</div>
        </div>
      </div>
    </div>
    <!-- 地图工具 -->
    <div class="tools">
      <el-tooltip class="item" effect="dark" :content="item.name" 
      placement="left" v-for="(item,index) in tools" :key="index">
        <i :class="item.icon" :style="{'color':cur_tool==index?'#e6a23c':'#909399'}"
        v-if="item.show"
        @click="toolClick(index)"
        ></i>
      </el-tooltip>
    </div>
    <!-- 工具盒子 -->
    <div class="tool_box" v-if="cur_tool!=null">
      <!-- 颜色 -->
      <div class="tool_color" v-if="cur_tool===1">
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
      </div>
      <!-- 透明度 -->
      <div class="tool_opacity" v-if="cur_tool===2">
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
      <!-- 图层 -->
      <div class="tool_layer" v-if="cur_tool===3">
        <div class="tool_wrap">
          <div class="tool_item" style="margin-right:30px;">
            <el-checkbox v-model="layer_3dbuilding" @change="layer3dChange()">3D建筑物</el-checkbox>
          </div>
        </div>
      </div>
      <!-- 底图 -->
      <div class="tool_basicmap" v-if="cur_tool===4">
        <div class="tool_wrap">
          <el-radio-group v-model="curBasicmap" @change="changeBsicMap">
            <el-radio v-for="(item,i) in basicMap" :label="item.url" :key="i">{{item.name}}</el-radio>
          </el-radio-group>
        </div>
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
import dataqueryApi from '@/api/dataqueryApi'
import { mapGetters } from "vuex";
import { gdSiteSearch,gcj02towgs84 } from "@/utils/public"
//组件
import Isocircle from '@/components/common/IsoCircle'
export default {
  name: "city_map",
  props: {
    mapType:{ //使用地图的页面名称
      type:String,
      default:'CompetitorDistribution'
    }
  },
  components: {
    Isocircle
  },
  data() {
    return {
      map_ID:'mapbox_map',
      satellite:false,//卫星图
      base_map:null,
      local_map:null,
      mapSize:9,//地图缩放等级
      layerArr:[
        {value:'3d_building',name:'3D建筑物'}
      ],
      layer_3dbuilding:false,//3d建筑物显示
      tools:[ //地图工具
        {name:'搜索',icon:'el-icon-search',show:false},
        {name:'颜色',icon:'el-icon-s-open',show:true},
        {name:'透明度',icon:'el-icon-s-help',show:true},
        {name:'图层',icon:'el-icon-s-grid',show:true},
        {name:'底图',icon:'el-icon-menu',show:true},
        {name:'围栏',icon:'el-icon-crop',show:false},
      ],
      map_draw:null,//地图绘制
      cur_tool:null, //当前地图工具索引
      searchInfo:'',//地图搜索
      searchResult:[], //地图搜索结果(高德)
      curBasicmap:'mapbox://styles/noconriander/ckjxqgg190k8q17qib182syt7', //当前底图
      basicMap:[ //底图
        { name:'基础图层',url:'mapbox://styles/noconriander/ckjxqgg190k8q17qib182syt7' },
        { name:'卫星地图',url:'mapbox://styles/noconriander/ck3e3v9w74je21dod3xdvro6u' },
        { name:'街道图',url:'mapbox://styles/noconriander/ckhn5n4xt0a8j1apx3pvnqgei' }
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
      fill_opacity:0.4,//图层填充透明度
      border_opacity:0.4,//图层描边透明度
     
    };
  },
  beforeMount(){
    this.map_ID = "mapbox_map" + parseInt(Math.random() * 100000); //设置地图ID
    this.$nextTick(()=>{
      this.mapSet()
    })
  },
  mounted() { },
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
    plateType:{
      handler(newVal){
        
      },
      deep:true
    },
    plateData:{
      handler(newVal){
        if(this.local_map!=null){
          this.mapFlyTo(newVal.curCityInfo.center,9)
        }
      },
      deep:true
    },
  },
  computed: {
    ...mapGetters(
      [ "cityCode",
        "CD_map",
        "plateCenter",
        "plateData",
        "plateType",
        "classificationObj"
      ]
    )
  },
  methods: {
    satelliteLayer(){
      var map = this.base_map
      this.satellite = !this.satellite
      if(this.satellite){ //卫星图
        map.setStyle('mapbox://styles/noconriander/ck3e3v9w74je21dod3xdvro6u')
      }else{
        map.setStyle('mapbox://styles/noconriander/ckjxqgg190k8q17qib182syt7')
      }
    },
    mapSearch(val){
      let results = gdSiteSearch(val,this.cityCode)
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
      map.getSource('source_searchPois').setData(fc)
    },
    toSearchPoi(item){ //跳转到选择的poi查询点
      let localtion = item.location.split(',')
      let center = gcj02towgs84(localtion[0],localtion[1])
      this.mapFlyTo(center,13)
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
    toolClick(index){ //选择
      var map = this.mapbox_map
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
          var workSpace_layer = 'city_'+code+':'+code+'_3dbuilding'
          let url = 'http://47.104.165.136:8070/geoserver/gwc/service/tms/1.0.0/'+workSpace_layer+'@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf'
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
          map.on('click','layer_3dbuilding',e=>{
            console.log(e)
          })
        }else{
          map.setLayoutProperty('layer_3dbuilding', 'visibility', 'visible')
        }
      }else{
        map.setLayoutProperty('layer_3dbuilding', 'visibility', 'none') 
      }
      
    },
    //地图切换
    changeBsicMap(e){
      console.log(e)
      this.mapSet()
      this.$store.dispatch('setMapStyle',e)
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
      that.mbgl.accessToken =
        "pk.eyJ1Ijoibm9jb25yaWFuZGVyIiwiYSI6ImNrMjQ1dGNrNDIwdWMzZXVnN3VwbnV4NW4ifQ.D7k8xizdEAG4ucy3vAhNFg";
      if (!that.mbgl.supported()) {
        alert("该浏览器不支持Mapbox GL,请更换浏览器");
      } else {
        that.mbgl.Compare = Compare
        var baseMap = new that.mbgl.Map({
          container: 'base_map',
          style: this.curBasicmap,
          center: [117.129848, 36.660955],
          zoom: 5,
          localIdeographFontFamily: "MSYH"
        });
        var map = new that.mbgl.Map({
          container: that.map_ID,
          style: 'mapbox://styles/noconriander/ckh5y3gd405kv19pavciyo2fu', //空白图层,
          center: [117.129848, 36.660955],
          zoom: 5,
          localIdeographFontFamily: "MSYH"
        });
        //地图关联
        var compareMap = new that.mbgl.Compare(baseMap, map, '.mapBox',{
          
          // Set this to enable comparing two maps by mouse movement:
          // mousemove: true
        });
        if(that.mapType==='CompetitorDistribution'){ //竞品分布地图
          that.$store.dispatch("setCDMap", map);
        }
        that.base_map = baseMap
        that.local_map = map
        //已请求城市中心点数据则飞行到中心点
        if(this.plateData!=null){
          if(this.plateData.curCityInfo.center.length>0){
            map.flyTo({
              center: this.plateData.curCityInfo.center,
              zoom: 9,
              speed: 0.8,
              curve: 2
            })
          }
        }
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
            trash: false
          }
        });
        this.map_draw = draw
        //添加地图组件
        //map.addControl(new that.mbgl.FullscreenControl());
        //geoserver图层加载
        that.geoserverLayerLoad()
        map.addControl(draw,'bottom-left')
        //图层事件-板块
        that.mapEvent();
        
      }
    },
    geoserverLayerLoad(){ //geoserver图层
      let map = this.local_map
      if(this.mapType==='dataQuery'){ //
        map = this.CD_map;
      }
      //设置项目图标
      map.loadImage("http://47.104.165.136:8099/test/D2D/icons/project_self.png", (error, icon) => {
        if (error) throw error;
        map.addImage("project_self", icon);
      })
      map.loadImage("http://47.104.165.136:8099/test/D2D/icons/isCircle.png", (error, icon) => {
        if (error) throw error;
        map.addImage("isCircle", icon);
      })
      map.loadImage("http://47.104.165.136:8099/test/D2D/icons/unCircle.png", (error, icon) => {
        if (error) throw error;
        map.addImage("unCircle", icon);
      })
      //板块中心点数据
      let centerFeatureData = {
        type: "FeatureCollection",
        features: []
      }
      this.plateCenter.forEach(item=>{
        centerFeatureData.features.push({
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": item.center
          },
          "properties":item
        })
      })
      console.log('板块中心点数据',centerFeatureData)

      var code = this.cityCode
      var workSpace_layer = 'city_'+code+':'+code+'_'
      var url_head = 'http://47.104.165.136:8070/geoserver/gwc/service/tms/1.0.0/'
      var url_end = '@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf'
      //通用板块
      var plates_layer = url_head+workSpace_layer+'plates'+url_end
      map.on("load", () => {
        map.addSource("serverLayer_plates", {
          type: "vector",
          scheme: "tms",
          tiles: [plates_layer]
        });
        map.addLayer({ //通用板块-填充
          id: "plate_fill",
          type: "fill",
          source: "serverLayer_plates",
          "source-layer": code+"_plates",
          filter: ["==", "type", 'part'],
          paint: {
            "fill-color": this.color_fill,
            "fill-opacity": 
            ["case",
              ["boolean", ["feature-state", "hover"], false],
              0.1,
              this.fill_opacity
            ]
          }
        });
        map.addLayer({  //通用板块-描边
          id: "plate_line",
          type: "line",
          source: "serverLayer_plates",
          "source-layer": code+"_plates",
          filter: ["==", "type",'part'],
          layout: {},
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
        map.addSource('centerSource', {
          'type': 'geojson',
          'data': centerFeatureData
        });
        map.addLayer({ //文字symbol
          id: "plate_labels",
          type: "symbol",
          source: "centerSource",
          filter:['==', 'type', 'part'],
          layout: {
            "text-field": ["get", "name"],
            "symbol-avoid-edges":true,
            "text-size": 10,
            'text-ignore-placement':false,
            "text-justify": "auto"
          },
          paint:{
            "text-opacity":1,
            "text-color": this.color_symbol,
            "text-halo-color": "rgba(0,0,0,0.8)",
            "text-halo-width": 1.5,
            "text-halo-blur": 0.5
          }
        });

        //地图搜索点
        map.loadImage("http://47.104.165.136:8099/test/poi-marker1.png", function(
          error,
          poimarker
        ) {
          if (error) throw error;
          map.addImage("poimarker", poimarker);
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
        });
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
      })
    },
    //图层事件-板块
    mapEvent(){
      var that = this
      var map = that.local_map
      var hoveredStateId = null
      //图层事件
      map.on('mousemove','plate_fill',e=>{
        
      })
      map.on("mouseleave", "plate_fill", e => {
        
      });
      map.on('click','plate_fill',e=>{
        //console.log(e)
        //阻止上层图层的点击事件穿透
        if (e.originalEvent.cancelBubble) {
          return;
        }
      })
      map.on('mouseup',(e)=>{
        //地理围栏
        if(that.cur_tool===5&&that.map_draw.getAll().features.length>0){
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
      map.on('wheel',e=>{
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
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
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
    
  }
};
</script>
<style lang="scss">
.population_map {
  width: 100%;
  height: 100%;
  position: relative;
  .layer_change{
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 99;
    width: 29px;
    height: 29px;
    box-shadow: 0 0 0 2px rgba(0,0,0,.1);
    border-radius: 4px;
    background: #fff;
    color: #333;
    cursor: pointer;
    text-align: center;
    line-height: 18px;
    .icon{
      font-size: 20px;
    }
  }
  .basemap_container{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    clip: unset !important;
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
  .tool_search{
    position: absolute;
    top: 30px;
    width: 200px;
    right: 10%;
    z-index: 99;
    .input_box{
      background: #506071;
      border-radius: 20px;
      display: flex;
      align-items: center;
      .icons{
        font-size: 18px;
        margin-left: 6px;
        color: #bacaca;
      }
      .el-input__inner{
        background: none;
        border: none;
        border-radius: 0;
        color: #ffc164;
      }
    }
    
    .result_box{
      max-width: 250px;
      max-height: 300px;
      color: #fff;
      margin-top: 9px;
      overflow-y: scroll;
      background: #506071;
      border-radius: 10px;
      .item{
        cursor: pointer;
        padding: 10px;
        .head{
          display: flex;
          align-items: center;
          .name{
            font-size: 12px;
            font-weight: bold;
            color: #ffc164;
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
  .mapboxgl-popup-content{
    background: rgba(0, 0, 0, 0.41);
    /* min-width: 200px; */
    max-width: 300px;
    border-top: rgb(0, 167, 255) 1px solid;
    border-bottom: rgb(0, 167, 255) 1px solid;
    /* border-radius: 8px; */
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
  .map_container {
    width: 100%;
    height: 100%;
  }
  .tools{
    position: absolute;
    top: 10px;
    left: 10px;
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
    top: 0px;
    left: 3.5%;
    padding: 10px;
    text-align: center;
    .tool_color{
      display: flex;
      align-items: center;
      background: rgba(0,0,0,0.3);
      padding: 10px;
      .color_evaluate,.color_map{
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
      
    }
    .tool_opacity{
      display: flex;
      min-width: 500px;
      align-items: center;
      justify-content: space-between;
      background: rgba(0,0,0,0.3);
      padding: 10px;
      .opacity_fill,.opacity_border{
        width: 47%;
      }
      .demonstration{
        color: #fff;
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
      padding: 10px;
      position: relative;
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