<template>
  <div class="map_box">
    <!-- 地图容器 -->
    <div class="mapBox"></div>
    <div :id="baseMap_ID" class="basemap_container"></div>
    <div :id="map_ID" class="map_container"></div>
    <!-- 地图缩放级别 -->
    <div class="map_size">地图级别:{{mapSize}}</div>
    <!-- 地图类型 -->
    <div class="layer_change" @click="satelliteLayer()">
      <i :class="['icon iconfont',satellite?'icon-weixing':'icon-morenditu']"></i>
    </div>
    <!-- 未来规划-添加poi -->
    <el-button class="addpoi_btn" v-if="mapType=='FuturePlan'" @click="addPoi()" type="default" size="small">{{addState?'取消':'添加POI'}}</el-button>
    <div class="poi_info" v-show="poiinfoShow">
      <el-form ref="poiinfo_form" :model="poiInfoForm" :rules="infoRule" label-width="80px">
        <el-form-item label="poi名称" prop="name">
          <el-input v-model="poiInfoForm.name" placeholder="名称" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="一级类目" prop="firstClass">
          <el-select v-model="poiInfoForm.firstClass" placeholder="一级类目" size="mini" @change="selectSecongType">
            <el-option v-for="(item,index) in typeArr" :key="index" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级类目" prop="secondClass">
          <el-select v-model="poiInfoForm.secondClass" placeholder="二级类目" size="mini">
            <el-option v-for="(item,index) in secondType" :key="index" :label="item.name" :value="item.name" ></el-option>
          </el-select>
        </el-form-item>
        <div class="sub_btn">
          <el-button size="mini" type="primary" @click="addPoiInfosub()">添加</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { CircleMode,DragCircleMode,DirectMode,SimpleSelectMode } from 'mapbox-gl-draw-circle';
import * as turf from '@turf/turf'
import Compare from 'mapbox-gl-compare'
//API
import { mapGetters } from "vuex";
import { gdSiteSearch,gcj02towgs84 } from "@/utils/public"
import ledgerApi from '@/api/ledgerApi'
//组件
import Isocircle from '@/components/common/IsoCircle'
export default {
  name: "city_map",
  props: {
    mapType:{ //地图类型
      type:String,
      default:''
    }
  },
  components: {
    Isocircle
  },
  data() {
    return {
      map_ID:'mapbox_map',
      baseMap_ID:'base_map',
      satellite:false,//卫星图
      base_map:null,
      local_map:null,
      mapSize:9,//地图缩放等级
      map_draw:null,//地图绘制
      curBasicmap:'mapbox://styles/noconriander/ckjxqgg190k8q17qib182syt7', //当前底图
      basicMap:[ //底图
        { name:'基础图层',url:'mapbox://styles/noconriander/ckjxqgg190k8q17qib182syt7' },
        { name:'卫星地图',url:'mapbox://styles/noconriander/ck3e3v9w74je21dod3xdvro6u' },
      ],
      isBaseLayer:true,//是否为基础底图
      addState:false,//添加poi状态
      poiInfoForm:{ //poi信息
        name:'',
        firstClass:'',
        secondClass:''
      },
      infoRule:{
        name: [
          { required: true, message: '请输入poi名称', trigger: 'blur' },
          { max: 10, message: '长度<10个字符', trigger: 'blur' }
        ],
        firstClass: [
          { required: true, message: '请选择一级类目', trigger: 'change' }
        ],
        secondClass: [
          { required: true, message: '请选择二级类目', trigger: 'change' }
        ]
      },
      typeArr:[ //类目数组
        { name:'产业',children:[
          { name:'企业'}
        ]},
        { name:'市政',children:[
          { name:'医院'},{ name:'图书馆'},{ name:'大型运动场馆'},{ name:'公园'},{ name:'旅游景点'}
        ]},
        { name:'自然',children:[
          { name:'山体'},{ name:'海岸线'}
        ]},
        { name:'教育',children:[
          { name:'初中'},{ name:'小学'}
        ]},
        { name:'商业',children:[
          { name:'购物中心'}
        ]},
        { name:'交通',children:[
          { name:'地铁'},{ name:'干道'}
        ]},
      ],
      poiCoord:[],//当前添加的poi的经纬坐标
      secondType:[],//第二类目
      addpoiArr:[],//模拟添加的poi数组
      poiinfoShow:false,//点信息表单
    };
  },
  beforeMount(){
    this.map_ID = "mapbox_map" + parseInt(Math.random() * 100000); //设置地图ID
    this.baseMap_ID = 'base_map' + parseInt(Math.random() * 100000)
    this.$nextTick(()=>{
      this.mapSet()
    })
  },
  mounted() {
    if(this.mapType=='PlateCard'){ //板块名片
      setTimeout(()=>{
        this.loadProjectPlate()
      },2000)
    }else if(this.mapType=='LandInfo'){ //土地信息
      setTimeout(()=>{
        this.loadProjectOutline()
      },2000)
    }else if(this.mapType=='FuturePlan'){ //未来规划
      setTimeout(()=>{
        this.loadIsochron()
      },2000)
    }else if(this.mapType=='CityLand'){ //城市土地市场
      setTimeout(()=>{
        this.loadCityland()
      },2000)
    }else if(this.mapType=='AreaLand'){ //区域土地市场
      setTimeout(()=>{
        this.loadAreaLand()
      },2000)
    }else if(this.mapType=='PlateLand'){ //板块土地市场
      setTimeout(()=>{
        this.loadPlateLand()
      },2000)
    }else if(this.mapType=='CityMarket'){ //城市商品房市场
      setTimeout(()=>{
        this.loadCityMarket()
      },2000)
    }else if(this.mapType=='AreaMarket'){ //区域商品房市场
      setTimeout(()=>{
        this.loadAreaMarket()
      },2000)
    }else if(this.mapType=='PlateMarket'){ //板块商品房市场
      setTimeout(()=>{
        this.loadPlateMarket()
      },2000)
    }else if(this.mapType=='AreaMarketRank'){ //区域商品房市场—住宅—排行榜
      setTimeout(()=>{
        this.loadAreaMarketRank()
      },2000)
    }else if(this.mapType=='PlateMarketRank'){ //区域商品房市场—住宅—排行榜
      setTimeout(()=>{
        this.loadPlateMarketRank()
      },2000)
    }
    
  },
  watch:{

  },
  computed: {
    ...mapGetters(["cityCode",
    "reportAdd_map",
    "plateCenter",
    "classBoxFlag",
    "plateData",
    "cardFlag",
    "plate_color",
    "plateType",
    "queryMenuIndex",
    "isListedLand",
    "classificationObj"])
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
    //板块切换
    plateTypeChange(e){
      var map = this.local_map
      var filters = ['==', 'type', e]
      map.setFilter('plate_fill', filters);
      map.setFilter('plate_line', filters);
      map.setFilter('plate_labels', filters);
    },
    //地图加载
    mapSet() {
      if(this.mapType=='LandInfo'){ //卫星地图
        this.curBasicmap = 'mapbox://styles/noconriander/ck3e3v9w74je21dod3xdvro6u'
      }else{
        this.curBasicmap = 'mapbox://styles/noconriander/ckjxqgg190k8q17qib182syt7'
      }
      var that = this;
      that.mbgl.accessToken =
        "pk.eyJ1Ijoibm9jb25yaWFuZGVyIiwiYSI6ImNrMjQ1dGNrNDIwdWMzZXVnN3VwbnV4NW4ifQ.D7k8xizdEAG4ucy3vAhNFg";
      if (!that.mbgl.supported()) {
        alert("该浏览器不支持Mapbox GL,请更换浏览器");
      } else {
        that.mbgl.Compare = Compare
        var baseMap = new that.mbgl.Map({
          container: that.baseMap_ID,
          style: this.curBasicmap,
          center: [117.129848, 36.660955],
          zoom: 5,
          localIdeographFontFamily: "MSYH"
        });
        var map = new that.mbgl.Map({
          container: that.map_ID,
          style: 'mapbox://styles/noconriander/ckh5y3gd405kv19pavciyo2fu', //空白图层
          center: [117.129848, 36.660955],
          zoom: 5,
          minZoom:7,
          //maxZoom:16,
          localIdeographFontFamily: "MSYH"
        });
        var compareMap = new that.mbgl.Compare(baseMap, map, '.mapBox',{
          
          // Set this to enable comparing two maps by mouse movement:
          // mousemove: true
        });
        that.$store.dispatch("setReportAddMap", map);
        that.$store.dispatch("setReportBaseMap", map);
        that.local_map = map
        that.base_map = baseMap
        that.$emit('setMapObj',{map:map,baseMap:baseMap})
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
        if(this.mapType!='LandInfo'){
          that.geoserverLayerLoad()
        }
        that.mapEvent();
        that.mapIcons();
      }
    },

    geoserverLayerLoad(){ //geoserver图层
      let map = this.reportAdd_map
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
          filter: ["==", "type", this.mapType=="CityLand"||this.mapType=='CityMarket'||this.mapType=='AreaMarketRank'?'region':'part'],
          paint: {
            "fill-color": 'rgba(58, 88, 125, 1)',
            "fill-opacity": 
            ["case",
              ["boolean", ["feature-state", "hover"], false],
              0.1,
              0.4
            ]
          }
        });
        map.addLayer({  //通用板块-描边
          id: "plate_line",
          type: "line",
          source: "serverLayer_plates",
          "source-layer": code+"_plates",
          filter: ["==", "type", this.mapType=="CityLand"||this.mapType=='CityMarket'||this.mapType=='AreaMarketRank'?'region':'part'],
          layout: {},
          paint: {
            "line-color":'rgba(149, 149, 246,1)',
            "line-width": 
            ["case",
              ["boolean", ["feature-state", "hover"], false],
              2.5,
              1
            ],
            "line-opacity": 0.4,
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
          filter:['==', 'type', this.mapType=="CityLand"||this.mapType=='CityMarket'||this.mapType=='AreaMarketRank'?'region':'part'],
          layout: {
            "text-field": ["get", "name"],
            "symbol-avoid-edges":true,
            "text-size": 10,
            'text-ignore-placement':false,
            "text-justify": "auto"
          },
          paint:{
            "text-opacity":1,
            "text-color": 'rgba(255, 255, 255, 1)',
            "text-halo-color": "rgba(0,0,0,0.8)",
            "text-halo-width": 1.5,
            "text-halo-blur": 0.5
          }
        })
      })
    },
    //添加地图图标
    mapIcons(){
      let map = this.local_map
      map.loadImage("http://47.104.165.136:8099/test/site_icon.png", (error, markerA) => {
        if (error) throw error;
        map.addImage("markerA", markerA);
      })
      map.loadImage("http://47.104.165.136:8099/test/site_icon1.png", (error, markerB) => {
        if (error) throw error;
         map.addImage("markerB", markerB);
      })
    },
    //图层事件-板块
    mapEvent(){
      var that = this
      var map = that.local_map
      var hoveredStateId = null
      //图层事件
      map.on('click','plate_fill',e=>{
        console.log(e)
        let coord = [e.lngLat.lng,e.lngLat.lat]
        that.poiCoord = coord
        //未来规划-添加poi
        if(that.addState&&that.mapType=="FuturePlan"){
          that.poiinfoShow = true
          //添加临时poi
          let temporaryS = map.getSource('temporaryS')
          if(temporaryS===undefined){
            map.addSource('temporaryS',{
              "type":"geojson",
              "data":{
                "type":"FeatureCollection",
                "features":[{
                    "type": "Feature",
                    "geometry": {
                      "type": "Point",
                      "coordinates": coord
                    },
                    "properties": {
                      "title": "临时poi"
                    }
                  }]
              }
            })
            map.addLayer({
              "id": "temporary",
              "type": "symbol",
              "source": "temporaryS",
              "layout": {
                "icon-image": "markerB",
                "text-field": "{title}",
                "icon-size":0.5,
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                "text-offset": [0, 1.2],
                "text-anchor": "top",
                "text-size":13
              },
              "paint":{
                "text-color":"#ff7f4e"
              }
            });
          }else{
            let geodata = {
              "type":"FeatureCollection",
              "features":[{
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": coord
                },
                "properties": {
                  "title": "临时poi"
                }
              }]
            }
            map.getSource('temporaryS').setData(geodata)
          }

        }
      })
      map.on('wheel',e=>{
        that.mapSize = map.getZoom().toFixed(2)
      })
    },
    //板块名片
    loadProjectPlate(){
      //api：根据报告ID查询项目所在板块ID、中心点 regionno:3702030004 center:"120.38243832142615 36.13814195251889"
      let curId = '3702030004'
      let center = [120.38243832142615,36.13814195251889]
      let map = this.reportAdd_map
      var borderColor = [
        "match", ["get", "regionno"],
        curId,"rgba(85, 255, 0, 1)",
        "rgba(149, 149, 246,1)"
      ]
      var fillColor = [
        "match", ["get", "regionno"],
        curId,"rgba(230, 45, 45, 0.84)",
        'rgba(58, 88, 125, 1)'
      ]
      map.setPaintProperty("plate_line", "line-color", borderColor);
      map.setPaintProperty("plate_fill", "fill-color", fillColor);
      //跳转到该项目
      map.flyTo({
        center: center,
        zoom: 12,
        speed: 0.8,
        curve: 2
      })
    },
    //土地信息
    loadProjectOutline(){
      //api：根据报告ID查询项目的土地轮廓 以及项目中心点
      let map = this.reportAdd_map
      //获取我的台账
      ledgerApi.getMyLedgers()
      .then(res=>{
        if(res.data.code===0){
          let data = res.data.data.searchResult
          let project = data.filter(item=>item.name=='科技大学项目1')[0]
          let center = [project.lng,project.lat]
          //根据台账ID获取台账详情
          ledgerApi.getMyLedgerDetail(project.id)
          .then(res=>{
            if(res.data.code===0){
              let lands = res.data.data.searchResult
              let geojson = {
                type:"FeatureCollection",
                features:[]
              }
              lands.forEach(item=>{
                let coord = item.coordinates.split(';')
                coord.pop()
                let coordArr = []
                coord.forEach(coor=>{
                  coordArr.push(coor.split(','))
                })
                let obj = {
                  type:"Feature",
                  geometry:{
                    type:'Polygon',
                    coordinates:[coordArr]
                  },
                  properties:{
                    name:item.name,
                    purpose:item.purpose
                  }
                }
                geojson.features.push(obj)
              })
              map.addSource("landOutline_source", {
                type: "geojson",
                data: geojson
              });
              map.addLayer({
                id: "outline_fill",
                type: "fill",
                source: "landOutline_source",
                paint: {
                  "fill-color": [
                    'match',
                    ['get','purpose'],
                    'house','#ffff00',
                    'commerce_house','#dd3601',
                    'commerce','#ff0000',
                    'industry','#4d0000',
                    'other','#3a8ee6',
                    '#3a8ee6'
                  ],
                  "fill-opacity": 0.6
                }
              });
              map.addLayer({
                id: "outline_symbol",
                type: "symbol",
                source: "landOutline_source",
                layout:{
                  "text-field":["get","name"],
                  "text-font": ["DIN Offc Pro Bold"],
                  "text-allow-overlap": true,
                  "text-size": 16,
                  "text-letter-spacing": 0.1,
                },
                paint: {
                  "text-color": '#fff'
                }
              });
              //跳转到该项目
              map.flyTo({
                center: center,
                zoom: 14.5,
                speed: 0.8,
                curve: 2
              })
            }
          })
          
        }
      })
    },
    //未来规划
    loadIsochron(){
      let that = this
      //api：根据报告ID查询项目项目信息(中心点)
      let center = [120.38243832142615,36.13814195251889]
      let map = this.local_map
      map.flyTo({
        center: center,
        zoom: 12,
        speed: 0.8,
        curve: 2
      })
      //添加半径圆
      map.addSource("circle_source", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });
      map.addLayer({
        id: "circle_fill",
        type: "fill",
        source: "circle_source",
        "layout": {},
        "paint": {
          "fill-color": [
            "match",
            ["get","name"],
            "radiusCircle1","#ff7f4e",
            "radiusCircle2","#7dfd3e",
            "radiusCircle3","#409EFF",
            /* other */ '#ff7f4e'
          ],
          "fill-opacity": 0.06
        }
      });
      map.addLayer({
        id: "circle_line",
        type: "line",
        source: "circle_source",
        "layout": {},
        "paint": {
          "line-color":[
            "match",
            ["get","name"],
            "radiusCircle1","#ff7f4e",
            "radiusCircle2","#7dfd3e",
            "radiusCircle3","#409EFF",
            /* other */ '#ff7f4e'
          ],
          "line-dasharray": [2, 4],
          "line-width":1.5,
          "line-opacity": 0.9
        }
      });
      map.addLayer({
        "id": "circle_symbol",
        "type": "symbol",
        "source": "circle_source",
        "layout": {
          "text-field":"半径 5Km",
          "text-font": ["DIN Offc Pro Bold"],
          "symbol-placement": "line",
          "text-padding": 1,
          "text-max-angle": 90,
          "text-allow-overlap": true,
          "text-size": {
            base: 1.2,
            stops: [
              [8, 12],
              [22, 30],
            ],
          },
          "text-letter-spacing": 0.1,
        },
        "paint": {
          "text-halo-color": "hsl(55, 1%, 20%)",
          "text-color": "#ff7f4e",
          "text-halo-width": 2,
        }
      });
      let geojsonData = {
        type: "FeatureCollection",
        features: []
      }
      var points = 64; //点的个数
      var coords = {
        latitude: center[1],
        longitude: center[0]
      };
      var km = 5; //半径
      var ret = [];
      var distanceX = km/(111.320*Math.cos(coords.latitude*Math.PI/180));
      var distanceY = km/110.574;
      var theta, x, y;
      for(var i=0; i<points; i++) {
          theta = (i/points)*(2*Math.PI);
          x = distanceX*Math.cos(theta);
          y = distanceY*Math.sin(theta);
          ret.push([coords.longitude+x, coords.latitude+y]);
      }
      ret.push(ret[0]);
      geojsonData.features.push({
        "type": "Feature",
        "properties": { "name": "radiusCircle"}, 
        "geometry": {
          "type": "Polygon",
          "coordinates": [ret],
        }
      })
      map.getSource("circle_source").setData(geojsonData);
      //添加本项目poi点
      map.addLayer({
        "id": "project",
        "type": "symbol",
        "source": {
          "type": "geojson",
          "data": {
            "type": "FeatureCollection",
            "features": [{
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": center
              },
              "properties": {
                "title": "本项目"
              }
            }]
          }
        },
        "layout": {
          "icon-image": "markerA",
          "text-field": "{title}",
          "icon-size":0.5,
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-offset": [0, 1.2],
          "text-anchor": "top",
          "text-size":13
        },
        "paint":{
          "text-color":"#ff7f4e"
        }
      });
      //添加用户添加的poi
      that.loadFuturePoi()
    },
    //未来规划-添加poi
    addPoi(){
      let map = this.local_map
      if(!this.addState){
        map.getCanvas().style.cursor = "crosshair"
      }else{
        map.getCanvas().style.cursor = ""
        //清空临时点数据
        let temporaryS = map.getSource('temporaryS')
        if(temporaryS!==undefined){
          map.getSource('temporaryS').setData({
            type:'FeatureCollection',
            features:[]
          })
        }
        //重置信息框表单数据并隐藏信息框
        this.$refs['poiinfo_form'].resetFields();
        this.poiinfoShow = false
        this.secondType = []
      }
      this.addState = !this.addState
    },
    //选择poi二级类型
    selectSecongType(val){
      let cur = this.typeArr.filter(item=>{
        return item.name == val
      })[0]
      this.poiInfoForm.secondClass = cur.children[0].name
      this.secondType = cur.children
    },
    //提交添加poi
    addPoiInfosub(){
      var that = this
      var map = that.reportAdd_map
      that.$refs['poiinfo_form'].validate((valid) => {
        if (valid) {
          that.addpoiArr.push({
            name:that.poiInfoForm.name,
            firstClass:that.poiInfoForm.firstClass,
            secondClass:that.poiInfoForm.secondClass,
            coords:that.poiCoord
          })
          //加载用户添加的poi
          that.loadFuturePoi()
          //清空临时点数据
          map.getSource('temporaryS').setData({
            type:'FeatureCollection',
            features:[]
          })
          //重置信息框表单数据并隐藏信息框
          that.$refs['poiinfo_form'].resetFields();
          that.poiinfoShow = false
          that.secondType = []
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //显示未来规划-添加的poi
    loadFuturePoi(){
      var that = this
      var map = that.reportAdd_map
      //api：根据报告ID加载用户添加的poi
      let geojsonData = {
        type:'FeatureCollection',
        features:[]
      }
      that.addpoiArr.forEach(item=>{
        geojsonData.features.push({
          'type':'Feature',
          'properties':{ 'name':item.name,'firstClass':item.firstClass,'secondClass':item.secondClass },
          'geometry':{
            'type':'Point',
            'coordinates':item.coords
          }
        })
      })
      let addpoiSource = map.getSource('addpoiSource')
      if(addpoiSource===undefined){
        map.addSource('addpoiSource',{
          'type':'geojson',
          'data':{
            type:'FeatureCollection',
            features:[]
          }
        })
        map.addLayer({
          id:'addpoi_symbol',
          type:'symbol',
          source:'addpoiSource',
          layout: {
            "icon-image": "markerB",
            "text-field": "{name}",
            "icon-size":0.5,
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 1.2],
            "text-anchor": "top",
            "text-size":12
          },
          paint:{
            "text-color":"#ff7f4e"
          }
        })
      }
      map.getSource('addpoiSource').setData(geojsonData)
    },
    //城市土地市场
    loadCityland(){
      console.log(this.plateData)
      var map = this.reportAdd_map
      let chartsData = []
      this.plateData.region.forEach(item=>{
        chartsData.push({
          name:item.name,
          center:item.center,
          gyjm:13256,
          cjjm:5023
        })
      })
      chartsData.forEach((item,i)=>{
        var el = document.createElement('div');
        el.className = 'landEchart';
        el.id = 'landEchart_'+i;
        el.style.width = '100px';
        el.style.height = '100px';
        new this.mbgl.Marker(el)
        .setLngLat(item.center)
        .addTo(map);
        this.$nextTick(()=>{
          var option = {
            xAxis: {
                type: 'category',
                data: []
            },
            tooltip:{
                
            },
            yAxis: {
                show:false,
                type: 'value'
            },
            series: [{
                name:'供应建面',
                data: [item.gyjm],
                type: 'bar'
            },{
                name:'成交建面',
                data: [item.cjjm],
                type: 'bar'
            }]
          }
          var mychart = this.$echarts.init(document.getElementById('landEchart_'+i));
          mychart.setOption(option);
        })
      })
    },
    //随机数
    getRandom(m,n){
      return Math.floor(Math.random()*(n-m)) +m
    },
    //区域土地市场
    loadAreaLand(){
      //api:根据报告ID获取项目信息 模拟所在行政区regionno:"370203"
      let regionno = "370203"
      let curRegion = this.plateData.part.filter(item=>item.regionno == regionno)[0]
      let geojsonData = {
        type:'FeatureCollection',
        features:[]
      }
      curRegion.children.forEach(item=>{
        geojsonData.features.push({
          type:'Feature',
          properties:{
            cjjm:this.getRandom(10000,20000),
            gyjm:23500,
            name:item.name,
            regionno:item.regionno
          },
          geometry:{
            type:'Point',
            coordinates:item.center
          }
        })
      })
      let map = this.reportAdd_map
      map.flyTo({center: curRegion.center,zoom: 11.5,speed: 0.8,curve: 2})
      let areaLandResource = map.getSource('areaLandResource')
      if(areaLandResource===undefined){
        map.addSource('areaLandResource',{
          type:'geojson',
          data:{
            type:'FeatureCollection',
            features:[]
          }
        })
        map.addLayer({
          id:'areaLanddata_bubble',
          type:'circle',
          source:'areaLandResource',
          paint:{
            'circle-radius':[
              "interpolate",
              ["linear"],
              ["get", "cjjm"],
              10000, 1,
              20000, 25
            ],
            'circle-color':'rgba(58,134,21,0.8)',
            "circle-stroke-color": "white",
            "circle-stroke-width": 0
          }
        })
        var popup = new this.mbgl.Popup({closeButton:true})
        map.on('click','areaLanddata_bubble',e=>{
          let properties = e.features[0].properties
          let coordinates = [e.lngLat.lng,e.lngLat.lat];
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          } 
          let html = `
          <div class="">板块：${properties.name}</div>
          <div class="">供应面积：${properties.gyjm} ㎡</div>
          <div class="">成交面积：${properties.cjjm} ㎡</div>`
          popup.setLngLat(coordinates).setHTML(html).addTo(map)
        })
      }
      map.getSource('areaLandResource').setData(geojsonData)
    },
    //板块土地市场
    loadPlateLand(){
      //api:根据报告ID获取该项目所在版块所有土地信息
      let plateCenter = [120.38243832142615,36.13814195251889] //板块中心点
      //模拟板块内的土地数据
      let landArr = [
        { name:'地块1',center:[120.38283297134552,36.14988958174051] },
        { name:'地块2',center:[120.3835205568397,36.14322678885989] },
        { name:'地块3',center:[120.39196803577823,36.13751537309149] },
        { name:'地块4',center:[120.38450282183277,36.13069285937044] },
        { name:'地块5',center:[120.37733228738415,36.12791608513285] },
        { name:'地块6',center:[120.37468017190389,36.13600812459569] },
      ]
      let geojsonData = {
        type:'FeatureCollection',
        features:[]
      }
      landArr.forEach(item=>{
        geojsonData.features.push({
          type:'Feature',
          properties:{
            cjjm:this.getRandom(10000,20000),
            gyjm:23500,
            name:item.name
          },
          geometry:{
            type:'Point',
            coordinates:item.center
          }
        })
      })
      let map = this.reportAdd_map
      map.flyTo({center: plateCenter,zoom: 13,speed: 0.8,curve: 2})
      let plateLandResource = map.getSource('plateLandResource')
      if(plateLandResource===undefined){
        map.addSource('plateLandResource',{
          type:'geojson',
          data:{
            type:'FeatureCollection',
            features:[]
          }
        })
        map.addLayer({
          id:'plateLanddata_bubble',
          type:'circle',
          source:'plateLandResource',
          paint:{
            'circle-radius':[
              "interpolate",
              ["linear"],
              ["get", "cjjm"],
              10000, 1,
              20000, 25
            ],
            'circle-color':'rgba(58,134,21,0.8)',
            "circle-stroke-color": "white",
            "circle-stroke-width": 0
          }
        })
        var popup = new this.mbgl.Popup({closeButton:true})
        map.on('click','plateLanddata_bubble',e=>{
          let properties = e.features[0].properties
          let coordinates = [e.lngLat.lng,e.lngLat.lat];
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          } 
          let html = `
          <div class="">地块：${properties.name}</div>
          <div class="">供应建面：${properties.gyjm} ㎡</div>
          <div class="">成交建面：${properties.cjjm} ㎡</div>`
          popup.setLngLat(coordinates).setHTML(html).addTo(map)
        })
      }
      map.getSource('plateLandResource').setData(geojsonData)
    },
    //城市商品房市场
    loadCityMarket(){
      console.log(this.plateData)
      var map = this.reportAdd_map
      let chartsData = []
      this.plateData.region.forEach(item=>{
        chartsData.push({
          name:item.name,
          center:item.center,
          gymj:10,
          cjmj:3
        })
      })
      chartsData.forEach((item,i)=>{
        var el = document.createElement('div');
        el.className = 'landEchart';
        el.id = 'marketCityEchart_'+i;
        el.style.width = '80px';
        el.style.height = '130px';
        new this.mbgl.Marker(el)
        .setLngLat(item.center)
        .addTo(map);
        this.$nextTick(()=>{
          var option = {
            tooltip: {
            },
            grid: {
              left: '3%',
              right: '8%',
              bottom: '8%',
              top: '5%',
              containLabel: true
            },
            xAxis: {
              show:false,
              type: 'value',
              splitLine:{
                show:false
              },
              axisLine:{
                show:false
              }
            },
            yAxis: {
              show:false,
              type: 'category',
              splitLine:{
                show:false
              },
              axisLine:{
                show:false
              }
            },
            series: [
              {
                name: '供应面积',
                type: 'bar',
                label: {
                  show: true
                },
                data: [item.gymj]
              },
              {
                name: '成交面积',
                type: 'bar',
                label: {
                  show: true
                },
                data: [item.cjmj]
              },
              {
                name: '存量',
                type: 'bar',
                label: {
                  show: true
                },
                data: [item.gymj-item.cjmj]
              }
            ]
          }
          var mychart = this.$echarts.init(document.getElementById('marketCityEchart_'+i));
          mychart.setOption(option);
        })
      })
    },
    //区域商品房市场
    loadAreaMarket(){
      let map = this.reportAdd_map
      let regionno = "370203"
      let curRegion = this.plateData.part.filter(item=>item.regionno == regionno)[0]
      map.flyTo({center: curRegion.center,zoom: 11.5,speed: 0.8,curve: 2})
      curRegion.children.forEach((item,i)=>{
        var el = document.createElement('div');
        el.className = 'landEchart';
        el.id = 'marketAreaEchart_'+i;
        el.style.width = '80px';
        el.style.height = '130px';
        new this.mbgl.Marker(el)
        .setLngLat(item.center)
        .addTo(map);
        this.$nextTick(()=>{
          var option = {
            tooltip: {
            },
            grid: {
              left: '3%',
              right: '8%',
              bottom: '8%',
              top: '5%',
              containLabel: true
            },
            xAxis: {
              show:false,
              type: 'value',
              splitLine:{
                show:false
              },
              axisLine:{
                show:false
              }
            },
            yAxis: {
              show:false,
              type: 'category',
              splitLine:{
                show:false
              },
              axisLine:{
                show:false
              }
            },
            series: [
              {
                name: '供应面积',
                type: 'bar',
                label: {
                  show: true
                },
                data: [23569]
              },
              {
                name: '成交面积',
                type: 'bar',
                label: {
                  show: true
                },
                data: [this.getRandom(10000,20000)]
              },
              {
                name: '存量',
                type: 'bar',
                label: {
                  show: true
                },
                data: [5693]
              }
            ]
          }
          var mychart = this.$echarts.init(document.getElementById('marketAreaEchart_'+i));
          mychart.setOption(option);
        })
      })
    },
    //板块商品房市场
    loadPlateMarket(){
      //api:根据报告ID获取该项目所在版块所有商品房市场信息
      let plateCenter = [120.38243832142615,36.13814195251889] //板块中心点
      //模拟板块内的商品房市场数据
      let marketArr = [
        { name:'碧桂园蓝谷之光',center:[120.38283297134552,36.14988958174051] },
        { name:'三盛国际海岸',center:[120.3835205568397,36.14322678885989] },
        { name:'金茂智慧国际城',center:[120.39196803577823,36.13751537309149] },
        { name:'兴华景园',center:[120.38450282183277,36.13069285937044] },
        { name:'海信九贤府',center:[120.37733228738415,36.12791608513285] },
        { name:'中交中央公元',center:[120.37468017190389,36.13600812459569] },
      ]
      let geojsonData = {
        type:'FeatureCollection',
        features:[]
      }
      marketArr.forEach(item=>{
        geojsonData.features.push({
          type:'Feature',
          properties:{
            cjmj:this.getRandom(10000,20000),
            gymj:23500,
            name:item.name
          },
          geometry:{
            type:'Point',
            coordinates:item.center
          }
        })
      })
      let map = this.reportAdd_map
      map.flyTo({center: plateCenter,zoom: 13,speed: 0.8,curve: 2})
      let plateMarketResource = map.getSource('plateMarketResource')
      if(plateMarketResource===undefined){
        map.addSource('plateMarketResource',{
          type:'geojson',
          data:{
            type:'FeatureCollection',
            features:[]
          }
        })
        map.addLayer({
          id:'plateLanddata_bubble',
          type:'circle',
          source:'plateMarketResource',
          paint:{
            'circle-radius':[
              "interpolate",
              ["linear"],
              ["get", "cjmj"],
              10000, 1,
              20000, 25
            ],
            'circle-color':'rgba(58,134,21,0.8)',
            "circle-stroke-color": "white",
            "circle-stroke-width": 0
          }
        })
        var popup = new this.mbgl.Popup({closeButton:true})
        map.on('click','plateLanddata_bubble',e=>{
          let properties = e.features[0].properties
          let coordinates = [e.lngLat.lng,e.lngLat.lat];
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          } 
          let html = `
          <div class="">地块：${properties.name}</div>
          <div class="">供应面积：${properties.cjmj} ㎡</div>
          <div class="">成交面积：${properties.cjmj} ㎡</div>`
          popup.setLngLat(coordinates).setHTML(html).addTo(map)
        })
      }
      map.getSource('plateMarketResource').setData(geojsonData)
    },
    //区域商品房市场—住宅—排行榜
    loadAreaMarketRank(){
      let regionCenter = ["120.361804","36.111612"] //行政区中心点（市北区）
      //模拟行政区内市场排行榜
      let rankArr = [
        { name:'碧桂园蓝谷之光',xsje:222897,center:[120.38283297134552,36.14988958174051] },
        { name:'三盛国际海岸',xsje:139753,center:[120.38329455046431,36.11957795182994] },
        { name:'金茂智慧国际城',xsje:73620,center:[120.34255521527945,36.11579766351977] },
        { name:'兴华景园',xsje:66810,center:[120.408585647346,36.102660301076696] },
        { name:'海信九贤府',xsje:63256,center:[120.36078749876157,36.09071533766998] },
        { name:'中交中央公元',xsje:61591,center:[120.32383016738021,36.08553862300269] },
      ]
      rankArr.push({name:'本项目',center:regionCenter})
      let geojsonData = {
        type:'FeatureCollection',
        features:[]
      }
      rankArr.forEach(item=>{
        geojsonData.features.push({
          type:'Feature',
          properties:{
            xsje:item.xsje,
            name:item.name
          },
          geometry:{
            type:'Point',
            coordinates:item.center
          }
        })
      })
      let map = this.reportAdd_map
      map.flyTo({center: regionCenter,zoom: 11,speed: 0.8,curve: 2})
      let rankAreaMarketResource = map.getSource('rankAreaMarketResource')
      if(rankAreaMarketResource===undefined){
        map.addSource('rankAreaMarketResource',{
          type:'geojson',
          data:{
            type:'FeatureCollection',
            features:[]
          }
        })
        map.addLayer({
          "id": "rankProject",
          "type": "symbol",
          "source": "rankAreaMarketResource",
          "layout": {
            "icon-image": [
              'match',['get','name'],
              '本项目',"markerA",
              "markerB"
            ],
            "text-field": "{name}",
            "icon-size":0.5,
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 1.2],
            "text-anchor": "top",
            "text-size":12,
            "text-allow-overlap": true,
            "icon-allow-overlap":true,
            "icon-ignore-placement":true
          },
          "paint":{
            "text-color":[
              'match',['get','name'],
              '本项目',"#ffffff",
              "#ff7f4e"
            ]
          }
        });
        var popup = new this.mbgl.Popup({closeButton:true})
        map.on('click','rankProject',e=>{
          let properties = e.features[0].properties
          let coordinates = [e.lngLat.lng,e.lngLat.lat];
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          } 
          let html = `
          <div class="">项目名称：${properties.name}</div>
          <div class="">销售金额：${properties.xsje} 亿元</div>
          `
          if(properties.name=='本项目'){
            return
          }
          popup.setLngLat(coordinates).setHTML(html).addTo(map)
        })
      }
      map.getSource('rankAreaMarketResource').setData(geojsonData)
    },
    //板块商品房市场—住宅—排行榜
    loadPlateMarketRank(){
      let plateCenter = [120.38243832142615,36.13814195251889] //板块中心点（科技大学）
      //模拟板块内市场排行榜
      let rankArr = [
        { name:'碧桂园蓝谷之光',xsje:222897,center:[120.38283297134552,36.14988958174051] },
        { name:'三盛国际海岸',xsje:139753,center:[120.3835205568397,36.14322678885989] },
        { name:'金茂智慧国际城',xsje:73620,center:[120.39196803577823,36.13751537309149] },
        { name:'兴华景园',xsje:66810,center:[120.38450282183277,36.13069285937044] },
        { name:'海信九贤府',xsje:63256,center:[120.37733228738415,36.12791608513285] },
        { name:'中交中央公元',xsje:61591,center:[120.37468017190389,36.13600812459569] },
      ]
      rankArr.push({name:'本项目',center:plateCenter})
      let geojsonData = {
        type:'FeatureCollection',
        features:[]
      }
      rankArr.forEach(item=>{
        geojsonData.features.push({
          type:'Feature',
          properties:{
            xsje:item.xsje,
            name:item.name
          },
          geometry:{
            type:'Point',
            coordinates:item.center
          }
        })
      })
      let map = this.reportAdd_map
      map.flyTo({center: plateCenter,zoom: 13,speed: 0.8,curve: 2})
      let rankPlateMarketResource = map.getSource('rankPlateMarketResource')
      if(rankPlateMarketResource===undefined){
        map.addSource('rankPlateMarketResource',{
          type:'geojson',
          data:{
            type:'FeatureCollection',
            features:[]
          }
        })
        map.addLayer({
          "id": "rankProject",
          "type": "symbol",
          "source": "rankPlateMarketResource",
          "layout": {
            "icon-image": [
              'match',['get','name'],
              '本项目',"markerA",
              "markerB"
            ],
            "text-field": "{name}",
            "icon-size":0.5,
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 1.2],
            "text-anchor": "top",
            "text-size":12,
            "text-allow-overlap": true,
            "icon-allow-overlap":true,
            "icon-ignore-placement":true
          },
          "paint":{
            "text-color":[
              'match',['get','name'],
              '本项目',"#ffffff",
              "#ff7f4e"
            ]
          }
        });
        var popup = new this.mbgl.Popup({closeButton:true})
        map.on('click','rankProject',e=>{
          let properties = e.features[0].properties
          let coordinates = [e.lngLat.lng,e.lngLat.lat];
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          } 
          let html = `
          <div class="">项目名称：${properties.name}</div>
          <div class="">销售金额：${properties.xsje} 亿元</div>
          `
          if(properties.name=='本项目'){
            return
          }
          popup.setLngLat(coordinates).setHTML(html).addTo(map)
        })
      }
      map.getSource('rankPlateMarketResource').setData(geojsonData)
    },
  }
};
</script>
<style lang="scss">
.map_box {
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
  .map_size{
    position: absolute;
    font-size: 12px;
    color: #fff;
    left: 10px;
    bottom: 40px;
  }
  .addpoi_btn{
    position: absolute;
    left: 45%;
    bottom: 5%;
  }
  .poi_info{
    position: absolute;
    background: #fff;
    padding: 10px;
    left: 5px;
    top: 5px;
    max-width: 22%;
    border-radius: 5px;
    .el-form-item{
      margin-bottom: 0;
    }
    .sub_btn{
      display: flex;
      justify-content: center;
    }
  }
  .maptype_box{
    position: absolute;
    right: 10px;
    bottom: 40px;
    cursor: pointer;
    color:#b7b1a7;
    font-size: 20px;
  }
  .map_container {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    clip: unset !important;
  }
  .basemap_container{
    width: 100%;
    height: 100%;
  }
}
</style>