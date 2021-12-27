<template>
  <div class="report_addmap">
    <!-- 排行榜 -->
    <div class="rank_cont" v-if="mapType=='AreaMarketRank'||mapType=='PlateMarketRank'" style="width:60%;height:100%;overflow-y:scroll;">
      <div class="rank_tip">销售金额为默认排名</div>
      <el-table :data="rankData" border stripe style="width: 100%;" @sort-change="rankSort"
        :default-sort = "{prop: 'date', order: 'descending'}">
        <el-table-column type="index" label="排名" width="50"></el-table-column>
        <el-table-column prop="name" width="120" label="项目" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="data1" width="100" label="销售套数" sortable></el-table-column>
        <el-table-column prop="data2" width="120" label="销售面积(㎡)" sortable></el-table-column>
        <el-table-column prop="data3" width="120" label="销售金额(万元)" sortable></el-table-column>
        <el-table-column prop="data4" width="130" label="销售均价(元/㎡)" sortable></el-table-column>
        <el-table-column prop="data5" width="120" label="供应套数" sortable></el-table-column>
        <el-table-column prop="data6" width="120" label="供应面积(㎡)" sortable></el-table-column>
        <el-table-column prop="data7" width="120" label="存量套数" sortable></el-table-column>
        <el-table-column prop="data8" width="120" label="存量面积(㎡)" sortable></el-table-column>
      </el-table>
    </div> 
    <!-- 未来规划 -->
    <div class="plan_points" v-if="mapType=='FuturePlan'" style="width:40%;height:100%;overflow-y:scroll;">
      <el-table :data="addpoiArr" :span-method="arraySpanMethod" border style="width: 100%;height:100%;">
        <el-table-column prop="firstClass" label="类别"></el-table-column>
        <el-table-column type="index" label="序号" width="100"></el-table-column>
        <el-table-column prop="name" label="未来规划"></el-table-column>
      </el-table>
    </div>
    <!-- 点地评分 -->
    <MapIsochronous v-if="mapType=='LandEva'" :reportCoord="ledgerCenter" />
    <!-- 地图容器 -->
    <div class="map_cont" v-else :style="{'width':converseMapWidth(mapType)}">
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
      <div class="setting_box">
        <!-- 用地类型 -->
        <div class="landuse_box" v-if="mapType=='CityLand'||mapType=='AreaLand'||mapType=='PlateLand'">
          <el-tree :data="useLandData" :props="proProps"
            :default-expand-all="true" :default-checked-keys="useLandChecked"
            :expand-on-click-node="false" node-key="value" show-checkbox
            @check="checkLanduse">
          </el-tree>
        </div>
        <!-- 物业类型 -->
        <div class="property_box" v-if="mapType=='CityMarket'||mapType=='AreaMarket'||mapType=='AreaMarketRank'||mapType=='PlateMarket'||mapType=='PlateMarketRank'">
          <el-tree :data="propertyArr" :props="proProps"
            :default-expand-all="true" :default-checked-keys="propertyChecked"
            :expand-on-click-node="false" node-key="value" show-checkbox
            @check="checkProperty">
          </el-tree>
        </div>
        <!-- 单年份 -->
        <div class="single_year" v-if="mapType=='CityLand'||mapType=='AreaLand'||mapType=='PlateLand'||mapType=='CityMarket'||mapType=='AreaMarket'||mapType=='PlateMarket'||mapType=='AreaMarketRank'||mapType=='PlateMarketRank'">
          <el-date-picker
            style="margin-top:10px"
            v-model="curYear"
            type="year"
            format="yyyy 年"
            value-format="yyyy"
            placeholder="选择年份"
            size="mini"
            :clearable="false"
            @change="singleYearChange">
          </el-date-picker>
        </div> 
      </div>
      <!-- 图例 -->
      <div class="legend" v-if="mapType=='CityLand'||mapType=='AreaLand'||mapType=='CityMarket'||mapType=='AreaMarket'">
        <div class="legend_title" v-if="mapType=='CityLand'||mapType=='AreaLand'">楼面地价 元/㎡</div>
        <div class="legend_title" v-if="mapType=='CityMarket'||mapType=='AreaMarket'">成交均价 元/㎡</div>
        <div class="color_item" v-for="(item,i) in colorBar" :key="i">
          <div class="color" :style="{'background':item.color}"></div>
          <div class="value">{{item.value}}</div>
        </div>
      </div>
      <!-- 未来规划-添加poi -->
      <el-button class="addpoi_btn" v-if="mapType=='FuturePlan'&&isEdit" @click="addPoi()" type="default" size="small">{{addState?'取消':'添加POI'}}</el-button>
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
    <!-- 土地图片 -->
    <div class="landImgbox" v-if="mapType=='LandImg'">
      <div class="img" v-for="(item,i) in landImgList" :key="i">
        <el-image :src="item.url" fit="contain"></el-image>
      </div>
    </div> 
    <!-- 土地信息 -->
    <div class="land_info" v-if="mapType=='LandInfo'">
      <div class="info_wrap">
        <div class="info_head">
          <div class="head_item" v-for="(item,i) in landInfoHead" :key="i">{{item}}</div> 
        </div>
        <div class="info_cont">
          <div class="col_item" v-for="(item,i) in landInfo" :key="i">
            <div class="info_item" :style="{'background':converseLandColor(item.purpose),'fontWeight':'bold'}">{{i+1}}</div>
            <div class="info_item">{{item.name}}</div>
            <div class="info_item">{{converseLandType(item.purpose)}}</div>
            <div class="info_item">{{item.landArea}}</div>
            <div class="info_item">{{item.volumeRatio}}</div>
            <div class="info_item">{{item.buildArea}}</div>
            <div class="info_item">{{item.startTotalPrice}}</div>
            <div class="info_item">{{item.date}}</div>
            <div class="info_item">{{item.totalPrice}}</div>
            <div class="info_item">{{item.startPrice}}</div>
            <div class="info_item">{{item.price}}</div>
            <div class="info_item">{{item.premiumRatio}}</div>
            <div class="info_item">{{item.competeCompany}}</div>
          </div>
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
import { mapGetters } from "vuex";
import { gdSiteSearch,gcj02towgs84 } from "@/utils/public"
import ledgerApi from '@/api/ledgerApi'
import LandReportApi from '@/api/LandReportApi_zlq'
//组件
import Isocircle from '@/components/common/IsoCircle'
import MapIsochronous from '@/components/main/analysistools/MapIsochronous'
export default {
  name: "city_map",
  props: {
    reportId:{ //报告ID
      type:String,
      default:''
    },
    mapInfo:{ //地图参数
      type:Object,
      default(){
        return {}
      }
    },
    isEdit:{ //是否为编辑状态
      type:Boolean,
      default:true
    }
  },
  components: {
    Isocircle,
    MapIsochronous
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
      spanArr:[],//合并项
      poiinfoShow:false,//点信息表单
      cityInfos:null,//城市信息
      areaCenters:null,//地区中心点信息
      queryArea:null,//数据查询范围
      areaCode:null,//当前范围的地区代码
      ledgerCenter:null,//台账经纬度
      landImgList:[],//土地图片列表
      curYear:null,//当前年
      useLandData:[],//用地类型数组
      useLandChecked:[],//默认用地类型
      proProps:{
        children: 'children',
        label: 'label'
      },
      propertyArr:[],//物业类型数组
      propertyChecked:[],//默认物业类型
      makerBox:[],//maker储存
      colorBar:[],//图例
      rankData: [],//排行榜数据
      DomID:null,//DOM id
      landInfoHead:['类别','地块名','土地用途','占地面积(㎡)','容积率','建筑面积(㎡)','起拍总价(万元)','成交时间','成交总价(万元)','起拍楼面价(元/㎡)','成交楼面价(元/㎡)','溢价率','竞得单位'],
      landInfo:[],//土地地块信息
      flyInfo:null,//地图飞往信息
    };
  },
  beforeMount(){
    this.map_ID = "mapbox_map" + parseInt(Math.random() * 100000); //设置地图ID
    this.baseMap_ID = 'base_map' + parseInt(Math.random() * 100000)
    //初始时间段设置
    let date = new Date()
    this.curYear = JSON.stringify(date.getFullYear()-2)
    //地图类型
    this.mapType = this.mapInfo.chartInfo.type
    //DOM id
    this.DomID = this.mapInfo.tid
    //地图是否保存过未来规划信息
    let planPoints =  this.mapInfo.mapPlanPoints
    console.log('未来规划poi',planPoints)
    if(planPoints){
      this.addpoiArr = JSON.parse(planPoints)
      this.handleTableData()
    }
    //地图加载
    this.$nextTick(()=>{
      if(this.mapType!=='LandEva'){
        this.mapSet()
      }
    })
    //获取用地类型
    this.setLandUse()
    //获取物业类型
    this.setProperty()
  },
  mounted() {
    //设置城市数据
    this.cityInfos = JSON.parse(sessionStorage.getItem('plate_data'))
    this.areaCenters = JSON.parse(sessionStorage.getItem('plate_center'))
    this.queryArea = this.mapInfo.chartInfo.queryArea
    //获取台账信息
    this.getLedgerInfo()
    //地图加载内容
    setTimeout(()=>{
      this.setMapInfo()
    },2000)
  },
  watch:{
    
  },
  computed: {
    ...mapGetters(["cityCode","reportAdd_map","plateCenter","plateData","pointgrade_map","baseLayerMap"])
  },
  methods: {
    //地图加载内容
    setMapInfo(){
      var map = this.local_map
      map.flyTo(this.flyInfo?this.flyInfo:{
        center: this.plateData.curCityInfo.center,
        zoom: 9,
        speed: 0.8,
        curve: 2
      })
      if(this.mapType=='PlateCard'){ //板块名片
        this.loadProjectPlate()
      }else if(this.mapType=='LandInfo'){ //台账地块
        this.loadLandOutline()
      }else if(this.mapType=='LandImg'){ //土地四至
        this.loadLandOutline()
      }else if(this.mapType=='LandEva'){ //土地评分
        this.loadLandEva()
      }else if(this.mapType=='FuturePlan'){ //未来规划
        this.loadIsochron()
      }else if(this.mapType=='CityLand'){ //城市土地市场
        this.loadCityland()
      }else if(this.mapType=='AreaLand'){ //区域土地市场
        this.loadAreaLand()
      }else if(this.mapType=='PlateLand'){ //板块土地市场
        this.loadPlateLand()
      }else if(this.mapType=='CityMarket'){ //城市商品房市场
        this.loadCityMarket()
      }else if(this.mapType=='AreaMarket'){ //区域商品房市场
        this.loadAreaMarket()
      }else if(this.mapType=='PlateMarket'){ //板块商品房市场
        this.loadPlateMarket()
      }else if(this.mapType=='AreaMarketRank'){ //区域商品房市场—住宅—排行榜
        this.loadAreaMarketRank()
      }else if(this.mapType=='PlateMarketRank'){ //区域商品房市场—住宅—排行榜
        this.loadPlateMarketRank()
      }
    },
    //用地类型转化
    converseLandType(val) {
      var name = ''
      this.useLandData[0].children.forEach(item=>{
        if(item.value==val){
          name = item.label
        }
      })
      return name
    },
    converseLandColor(val){
      let color = ''
      switch(val){
        case 'house':
          color = '#ffff00';
          break;
        case 'commerce_house':
          color = '#dd3601';
          break;
        case 'commerce':
          color = '#ff0000';
          break;
        case 'industry':
          color = '#4d0000';
          break;
        case 'other':
          color = '#3a8ee6';
          break;
        default:
          color = '#3a8ee6';
          break
      }
      return color
    },
    converseMapWidth(val){
      let width = ''
      switch(val){
        case 'AreaMarketRank':
          width = '40%';
          break;
        case 'PlateMarketRank':
          width = '40%';
          break;
        case 'FuturePlan':
          width = '60%';
          break;
        case 'LandInfo':
          width = '40%';
          break;
        case 'LandImg':
          width = '50%';
          break;
        default:
          width = '100%';
          break
      }
      return width
    },
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
    //获取用地类型
    setLandUse(){
      var that = this
      LandReportApi.getTypeDict('land_use')
      .then(res=>{
        console.log('用地类型',res)
        if(res.data.code===0){
          that.useLandChecked = ['house']
          that.useLandData = [{
            value:'all',
            label:'全部',
            children:res.data.data
          }]
        }
      })
    },
    //用地类型切换
    checkLanduse(checkedNodes,checkedKeys){
      this.useLandChecked = checkedKeys.checkedKeys
      if(this.makerBox.length>0){
        this.makerBox.forEach(item=>{
          item.remove()
        })
      }
      this.setMapInfo()
    },
    //获取物业类型
    setProperty(){
      var that = this
      LandReportApi.getTypeDict('property_type')
      .then(res=>{
        console.log('物业类型',res)
        if(res.data.code===0){
          that.propertyChecked = ['house']
          that.propertyArr = [{
            value:'all',
            label:'全部',
            children:res.data.data
          }]
        }
      })
    },
    
    //物业类型切换
    checkProperty(checkedNodes,checkedKeys){
      this.propertyChecked = checkedKeys.checkedKeys
      if(this.makerBox.length>0){
        this.makerBox.forEach(item=>{
          item.remove()
        })
      }
      this.setMapInfo()
    },
    //年份切换
    singleYearChange(){
      if(this.makerBox.length>0){
        this.makerBox.forEach(item=>{
          item.remove()
        })
      }
      this.setMapInfo()
    },
    //根据报告ID获取台账信息,根据图表传入的数据查询范围配置areaCode
    getLedgerInfo(){
      var that = this
      LandReportApi.getLedgerInfoByReportId(that.reportId)
      .then(res=>{
        if(res.data.code===0){
          console.log('报告台账信息',res.data.data)
          let data = res.data.data.account
          that.ledgerCenter = [data.lng,data.lat]
          let plateCode = res.data.data.account.partno
          if(that.queryArea=='city'){
            that.areaCode = that.cityInfos.curCityInfo.regionno
            that.areaCenters.forEach(item=>{
              if(item.regionno==that.areaCode){
                that.flyInfo = {
                  center: item.center,
                  zoom: 9,
                  speed: 1,
                  curve: 2
                }
              }
            })
          }else if(that.queryArea=='region'){
            that.areaCode = plateCode.substr(0,6)
            that.areaCenters.forEach(item=>{
              if(item.regionno==that.areaCode){
                that.flyInfo = {
                  center: item.center,
                  zoom: 10,
                  speed: 1,
                  curve: 2
                }
              }
            })
          }else if(that.queryArea=='plate'){
            that.areaCode = plateCode
              that.areaCenters.forEach(item=>{
              if(item.regionno==that.areaCode){
                that.flyInfo = {
                  center: item.center,
                  zoom: 11,
                  speed: 1,
                  curve: 2
                }
              }
            })
          }else if(that.queryArea=='nultiRegion'){
            let str = ''
            that.cityInfos.region.forEach(item=>{
              str += (item.regionno+',')
            })
            that.areaCode = str
          }else if(that.queryArea=='multiPlate'){
            
            let curRegionno = plateCode.substr(0,6)
            let curRegion = that.cityInfos.part.filter(item=>item.regionno==curRegionno)
            if(curRegion){
              let str = ''
              curRegion[0].children.forEach(item=>{
                str += (item.regionno+',')
              })
              that.areaCode = str
            }
            that.areaCenters.forEach(item=>{
              if(item.regionno==curRegionno){
                that.flyInfo = {
                  center: item.center,
                  zoom: 10,
                  speed: 1,
                  curve: 2
                }
              }
            })
          }
          
        }
      })
    },
    //板块渲染
    plateRending(data){
      let map = this.reportAdd_map
      let valueArr = []
      data.forEach(item=>{
        valueArr.push(item.value)
      })
      let max = Math.max(...valueArr)
      let average = Math.ceil(max/10)
      //设置图例
      let colorBar = []
      let colorArr = ['#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', 
      '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
      for(let i=9;i>0;i--){
        colorBar.push({
          value:(i+1)*average,
          color:colorArr[i]
        })
      }
      colorBar.push({value:0,color:'none'})
      this.colorBar = colorBar
      //板块颜色
      let fillColor = [
        "match",["get","regionno"]
      ]
      data.forEach(item=>{
        fillColor.push(item.regionno)
        fillColor.push(color(item.value,average))
      })
      fillColor.push('rgba(58, 88, 125, 1)')
      map.setPaintProperty("plate_fill", "fill-color", fillColor);
      //颜色分配
      function color(value,average){
        let color = ''
        if (value>0&&value<=average){
          color = '#4575b4';
        }else if(value>average&&value<=2*average){
          color = '#74add1';
        }else if(value>2*average&&value<=3*average){
          color = '#abd9e9';
        }else if(value>3*average&&value<=4*average){
          color = '#e0f3f8';
        }else if(value>4*average&&value<=5*average){
          color = '#ffffbf';
        }else if(value>5*average&&value<=6*average){
          color = '#fee090';
        }else if(value>6*average&&value<=7*average){
          color = '#fdae61';
        }else if(value>7*average&&value<=8*average){
          color = '#f46d43';
        }else if(value>8*average&&value<=9*average){
          color = '#d73027';
        }else{
          color = '#a50026';
        }
        return color
      }
    },

    //板块名片
    loadProjectPlate(){
      //api：根据报告ID查询项目所在板块ID、中心点 regionno:3702030004 center:"120.38243832142615 36.13814195251889"
      let curId = this.areaCode
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
        center: this.ledgerCenter,
        zoom: 12,
        speed: 0.8,
        curve: 2
      })
    },
    //土地信息
    loadLandOutline(){
      //api：根据报告ID查询项目的土地轮廓 以及项目中心点
      var that = this
      let map = this.reportAdd_map
      //根据报告ID获取台账详情
      LandReportApi.getLedgerInfoByReportId(that.reportId)
      .then(res=>{
        if(res.data.code===0){
          if(that.mapType=='LandImg'){ //台账上传的土地图片
            that.landImgList = res.data.data.files
          }
          let lands = res.data.data.searchResult
          //土地表格数据
          that.landInfo = res.data.data.searchResult
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
              "text-size": 12,
              "text-letter-spacing": 0.1,
            },
            paint: {
              "text-color": '#fff'
            }
          });
          //跳转到该项目
          map.flyTo({
            center: that.ledgerCenter,
            zoom: 14.5,
            speed: 0.8,
            curve: 2
          })
        }
      })
    },
    //土地评分
    loadLandEva(){
      setTimeout(() => {
        this.$emit('setMapObj',{map:this.pointgrade_map,baseMap:this.baseLayerMap})
      },1500);
    },
    //未来规划
    loadIsochron(){
      let that = this
      let map = this.local_map
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
        latitude: that.ledgerCenter[1],
        longitude: that.ledgerCenter[0]
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
                "coordinates": that.ledgerCenter
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
          that.handleTableData()
          that.$emit('savePlanPoints',{points:JSON.stringify(that.addpoiArr),tid:that.DomID})
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
      that.addpoiArr.forEach((item,i)=>{
        geojsonData.features.push({
          'type':'Feature',
          'properties':{ 'name':item.name,'firstClass':item.firstClass,'secondClass':item.secondClass,'index':i },
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
        var popup = new this.mbgl.Popup({closeButton:true})
        map.on('click','addpoi_symbol',e=>{
          if(isEdit){
            let properties = e.features[0].properties
            let coordinates = [e.lngLat.lng,e.lngLat.lat];
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            } 
            let html = `<div class="del_plan_point">删除该点</div>`
            popup.setLngLat(coordinates).setHTML(html).addTo(map)
            that.$('.del_plan_point').click(()=>{
              that.addpoiArr.splice(properties.index,1)
              that.updataPlanPoints()
              popup.remove()
              that.$emit('savePlanPoints',{points:JSON.stringify(that.addpoiArr),tid:that.DomID})
              that.handleTableData()
            })
          }
        })
      }
      map.getSource('addpoiSource').setData(geojsonData)
    },
    //更新未来规划点数据
    updataPlanPoints(){
      var that = this
      var map = that.reportAdd_map
      //api：根据报告ID加载用户添加的poi
      let geojsonData = {
        type:'FeatureCollection',
        features:[]
      }
      that.addpoiArr.forEach((item,i)=>{
        geojsonData.features.push({
          'type':'Feature',
          'properties':{ 'name':item.name,'firstClass':item.firstClass,'secondClass':item.secondClass,'index':i },
          'geometry':{
            'type':'Point',
            'coordinates':item.coords
          }
        })
      })
      map.getSource('addpoiSource').setData(geojsonData)
    },
    //合并类别
    arraySpanMethod( { row, column, rowIndex, columnIndex } ){
      if(columnIndex === 0){
        const _row = this.spanArr[rowIndex]
        const _col = _row>0?1:0;
        return{
          rowspan:_row,
          colspan:_col                  
        }
      }
    },
    //处理图表
    handleTableData(){
      //同类别排序
      let classArr = []
      this.addpoiArr.forEach(item=>{
        if(classArr.indexOf(item.firstClass)==-1){
          classArr.push(item.firstClass)
        }
      })
      let arr = []
      classArr.forEach(item=>{
        this.addpoiArr.forEach(p=>{
          if(p.firstClass==item){
            arr.push(p)
          }
        })
      })
      this.addpoiArr = arr
      console.log(arr)
      //同类别合并
      this.spanArr = []
      let contactDot = 0;
      this.addpoiArr.forEach((item,index) => {
        item.index = index;
        if(index === 0){
          this.spanArr.push(1);
        }else{
          if(item.firstClass === this.addpoiArr[index - 1].firstClass){
            this.spanArr[contactDot] +=1;
            this.spanArr.push(0);
          }else{
            this.spanArr.push(1);
            contactDot = index;
          }
        }
      });
      console.log(this.spanArr)
    },
    //城市土地市场
    loadCityland(){
      var that = this
      var map = this.reportAdd_map
      that.makerBox = []
      //数据请求
      let landUseStr = ''
      that.useLandChecked.forEach(item=>{
        landUseStr += (item+',')
      })
      let obj = {
        dataType:'city',
        dueTime:that.curYear,
        regionno:that.areaCode,
        landUse:landUseStr
      }
      LandReportApi.getMapLandData(obj)
      .then(res=>{
        console.log('城市土地市场',res)
        if(res.data.code===0){
          let data = res.data.data
          let pendingData = []
          data.forEach((item,i)=>{
            pendingData.push({
              value:item.data3,
              regionno:item.regionno
            })
            let center  = item.center.split(' ')
            var el = document.createElement('div');
            el.className = 'landEchart';
            el.id = 'landCityEchart_'+i;
            el.style.width = '100px';
            el.style.height = '100px';
            let maker = new this.mbgl.Marker({
              element: el,
              offset: [0, -25]
            })
            that.makerBox.push(maker)
            maker.setLngLat(center)
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
                    type: 'value',
                    min:0,
                    max:500
                },
                series: [{
                    name:'供应建面(万㎡)',
                    data: [item.data1?item.data1.toFixed(2):0],
                    type: 'bar',
                    label: {
                      show: true,
                      position: 'top',
                      color:'#fff'
                    }
                },{
                    name:'成交建面(万㎡)',
                    data: [item.data2?item.data2.toFixed(2):0],
                    type: 'bar',
                    label: {
                      show: true,
                      position: 'top',
                      color:'#fff'
                    }
                }]
              }
              var mychart = this.$echarts.init(document.getElementById('landCityEchart_'+i));
              mychart.setOption(option);
            })
          })
          //板块渲染
          if(pendingData.length>0){
            that.plateRending(pendingData)
          }
        }
      })
      
    },
    //随机数
    getRandom(m,n){
      return Math.floor(Math.random()*(n-m)) +m
    },
    //区域土地市场
    loadAreaLand(){
      var that = this
      let map = this.reportAdd_map
      //数据请求
      let landUseStr = ''
      that.useLandChecked.forEach(item=>{
        landUseStr += (item+',')
      })
      let obj = {
        dataType:'region',
        dueTime:that.curYear,
        regionno:that.areaCode,
        landUse:landUseStr
      }
      LandReportApi.getMapLandData(obj)
      .then(res=>{
        console.log('区域土地市场',res)
        if(res.data.code===0){
          let data = res.data.data
          let pendingData = []
          data.forEach((item,i)=>{
            pendingData.push({
              value:item.data3,
              regionno:item.regionno
            })
            let center  = item.center.split(' ')
            var el = document.createElement('div');
            el.className = 'landEchart';
            el.id = 'landAreaEchart_'+i;
            el.style.width = '100px';
            el.style.height = '100px';
            let maker = new this.mbgl.Marker({
              element: el,
              offset: [0, -25]
            })
            that.makerBox.push(maker)
            maker.setLngLat(center)
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
                    type: 'value',
                    min:0,
                    max:50
                },
                series: [{
                    name:'供应建面(万㎡)',
                    data: [item.data1?item.data1.toFixed(2):0],
                    type: 'bar',
                    label: {
                      show: true,
                      position: 'top',
                      color:'#fff'
                    }
                },{
                    name:'成交建面(万㎡)',
                    data: [item.data2?item.data2.toFixed(2):0],
                    type: 'bar',
                    label: {
                      show: true,
                      position: 'top',
                      color:'#fff'
                    }
                }]
              }
              var mychart = this.$echarts.init(document.getElementById('landAreaEchart_'+i));
              mychart.setOption(option);
            })
          })
          //板块渲染
          if(pendingData.length>0){
            that.plateRending(pendingData)
          }
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
                  0, 10,
                  100, 30
                ],
                'circle-color':'rgba(58,134,21,0.8)',
                "circle-stroke-color": "white",
                "circle-stroke-width": 0,
              }
            })
            map.addLayer({
              id:'areaLanddata_symbol',
              type:'symbol',
              source:'areaLandResource',
              layout:{
                'text-field':'成交建面 '+'{cjjm}',
                "text-size":10,
              },
              paint:{
                "text-color":'#fff'
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
              <div class="">供应面积：${properties.gyjm?properties.gyjm:'暂无'} ㎡</div>
              <div class="">成交面积：${properties.cjjm?properties.cjjm:'暂无'} ㎡</div>`
              popup.setLngLat(coordinates).setHTML(html).addTo(map)
            })
          }
          map.getSource('areaLandResource').setData(geojsonData)
        }
      })
      
    },
    //板块土地市场
    loadPlateLand(){
      var that = this
      let map = this.reportAdd_map
      //数据请求
      let landUseStr = ''
      that.useLandChecked.forEach(item=>{
        landUseStr += (item+',')
      })
      let obj = {
        dataType:'part',
        dueTime:that.curYear,
        regionno:that.areaCode,
        landUse:landUseStr
      }
      LandReportApi.getMapLandData(obj)
      .then(res=>{
        console.log('板块土地市场',res)
        if(res.data.code===0){
          let data = res.data.data
          let geojsonData = {
            type:'FeatureCollection',
            features:[]
          }
          data.forEach(item=>{
            let center = item.coordinate.split(',')
            geojsonData.features.push({
              type:'Feature',
              properties:{
                cjjm:item.data2,
                gyjm:item.data1,
                lmdj:item.data3,
                name:item.parcel_no
              },
              geometry:{
                type:'Point',
                coordinates:center
              }
            })
          })
          
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
                  0, 10,
                  100, 100
                ],
                'circle-color':'rgba(58,134,21,0.8)',
                "circle-stroke-color": "white",
                "circle-stroke-width": 0
              }
            })
            map.addLayer({
              id:'plateLanddata_symbol',
              type:'symbol',
              source:'plateLandResource',
              layout:{
                'text-field':'{name}',
                "text-size":10,
              },
              paint:{
                "text-color":'#fff'
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
              <div class="">供应建面：${properties.gyjm?properties.gyjm.toFixed(2):'暂无'} 万㎡</div>
              <div class="">成交建面：${properties.cjjm?properties.cjjm.toFixed(2):'暂无'} 万㎡</div>
              <div class="">楼面地价：${properties.lmdj?properties.lmdj.toFixed(0):'暂无'} 元/㎡</div>`
              popup.setLngLat(coordinates).setHTML(html).addTo(map)
            })
          }
          map.getSource('plateLandResource').setData(geojsonData)
        }
      })
      
    },
    //城市商品房市场
    loadCityMarket(){
      var that = this
      var map = this.reportAdd_map
      that.makerBox = []
      //数据请求
      let propertyStr = ''
      that.propertyChecked.forEach(item=>{
        propertyStr += (item+',')
      })
      let obj = {
        dataType:'city',
        dueTime:that.curYear,
        regionno:that.areaCode,
        type:propertyStr
      }
      LandReportApi.getMapMarketData(obj)
      .then(res=>{
        console.log('城市商品房市场',res)
        if(res.data.code===0){
          let data = res.data.data
          let pendingData = []
          data.forEach((item,i)=>{
            pendingData.push({
              value:item.data3, //成交均价
              regionno:item.regionno
            })
            let center  = item.center.split(' ')
            var el = document.createElement('div');
            el.className = 'marketEchart';
            el.id = 'marketCityEchart_'+i;
            el.style.width = '130px';
            el.style.height = '80px';
            let marker = new this.mbgl.Marker({
              element: el,
              offset: [0, -25]
            })
            that.makerBox.push(marker)
            marker.setLngLat(center)
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
                yAxis: {
                  min:0,
                  max:30000000,
                  show:false,
                  type: 'value',
                  splitLine:{
                    show:false
                  },
                  axisLine:{
                    show:false
                  }
                },
                xAxis: {
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
                    name: '供应面积(㎡)',
                    type: 'bar',
                    label: {
                      show: false,
                      color:'#fff'
                    },
                    data: [item.data1]
                  },
                  {
                    name: '成交面积(㎡)',
                    type: 'bar',
                    label: {
                      show: false,
                      color:'#fff'
                    },
                    data: [item.data2]
                  },
                  {
                    name: '存量(㎡)',
                    type: 'bar',
                    label: {
                      show: false,
                      color:'#fff'
                    },
                    data: [item.data4]
                  }
                ]
              }
              var mychart = this.$echarts.init(document.getElementById('marketCityEchart_'+i));
              mychart.setOption(option);
            })
          })
          //板块渲染
          if(pendingData.length>0){
            that.plateRending(pendingData)
          }
        }
      })
      
    },
    //区域商品房市场
    loadAreaMarket(){
      var that = this
      var map = this.reportAdd_map
      that.makerBox = []
      //数据请求
      let propertyStr = ''
      that.propertyChecked.forEach(item=>{
        propertyStr += (item+',')
      })
      let obj = {
        dataType:'region',
        dueTime:that.curYear,
        regionno:that.areaCode,
        type:propertyStr
      }
      LandReportApi.getMapMarketData(obj)
      .then(res=>{
        console.log('区域商品房市场',res)
        if(res.data.code===0){
          let data = res.data.data
          let pendingData = []
          data.forEach((item,i)=>{
            pendingData.push({
              value:item.data3, //成交均价
              regionno:item.regionno
            })
            let center  = item.center.split(' ')
            var el = document.createElement('div');
            el.className = 'marketEchart';
            el.id = 'marketCityEchart_'+i;
            el.style.width = '130px';
            el.style.height = '80px';
            let marker = new this.mbgl.Marker({
              element: el,
              offset: [0, -25]
            })
            that.makerBox.push(marker)
            marker.setLngLat(center)
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
                yAxis: {
                  min:0,
                  max:2000000,
                  show:false,
                  type: 'value',
                  splitLine:{
                    show:false
                  },
                  axisLine:{
                    show:false
                  }
                },
                xAxis: {
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
                    name: '供应面积(㎡)',
                    type: 'bar',
                    label: {
                      show: false,
                      color:'#fff'
                    },
                    data: [item.data1]
                  },
                  {
                    name: '成交面积(㎡)',
                    type: 'bar',
                    label: {
                      show: false,
                      color:'#fff'
                    },
                    data: [item.data2]
                  },
                  {
                    name: '存量(㎡)',
                    type: 'bar',
                    label: {
                      show: false,
                      color:'#fff'
                    },
                    data: [item.data4]
                  }
                ]
              }
              var mychart = this.$echarts.init(document.getElementById('marketCityEchart_'+i));
              mychart.setOption(option);
            })
          })
          //板块渲染
          if(pendingData.length>0){
            that.plateRending(pendingData)
          }
        }
      })
    },
    //板块商品房市场
    loadPlateMarket(){
      var that = this
      let map = this.reportAdd_map
      //数据请求
      let propertyStr = ''
      that.propertyChecked.forEach(item=>{
        propertyStr += (item+',')
      })
      let obj = {
        dataType:'part',
        dueTime:that.curYear,
        regionno:that.areaCode,
        type:propertyStr
      }
      LandReportApi.getMapMarketData(obj)
      .then(res=>{
        console.log('板块商品房市场',res)
        if(res.data.code===0){
          let data = res.data.data
          let geojsonData = {
            type:'FeatureCollection',
            features:[]
          }
          data.forEach(item=>{
            let center = item.coordinate.split(',')
            geojsonData.features.push({
              type:'Feature',
              properties:{
                cjjm:item.data2,
                gyjm:item.data1,
                cjjj:item.data3,
                cl:item.data4,
                name:item.name
              },
              geometry:{
                type:'Point',
                coordinates:center
              }
            })
          })
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
                  ["get", "gyjm"],
                  10000, 1,
                  20000, 40
                ],
                'circle-color':'rgba(58,134,21,0.8)',
                "circle-stroke-color": "white",
                "circle-stroke-width": 0
              }
            })
            map.addLayer({
              id:'plateLanddata_symbol',
              type:'symbol',
              source:'plateMarketResource',
              layout:{
                'text-field':'{name}',
                "text-size":10,
              },
              paint:{
                "text-color":'#fff'
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
              <div class="">项目：${properties.name}</div>
              <div class="">供应面积：${properties.gyjm} ㎡</div>
              <div class="">成交面积：${properties.cjjm} ㎡</div>
              <div class="">成交均价：${properties.cjjj} 元/㎡</div>
              <div class="">存量：${properties.cl} ㎡</div>`
              popup.setLngLat(coordinates).setHTML(html).addTo(map)
            })
          }
          map.getSource('plateMarketResource').setData(geojsonData)
        }
      })
      
    },
    //排行榜排序
    rankSort(column, prop, order ){
      console.log(column, prop, order )
    },
    //区域商品房市场—排行榜
    loadAreaMarketRank(){
      var that = this
      let map = this.reportAdd_map
      //数据请求
      let propertyStr = ''
      that.propertyChecked.forEach(item=>{
        propertyStr += (item+',')
      })
      let obj = {
        dataType:'region',
        dueTime:that.curYear,
        regionno:that.areaCode,
        type:propertyStr
      }
      LandReportApi.getMapMarketRank(obj)
      .then(res=>{
        console.log('区域商品房市场排行榜',res)
        if(res.data.code===0){
          let data = res.data.data
          that.rankData = data
          let geojsonData = {
            type:'FeatureCollection',
            features:[]
          }
          data.forEach((item,i)=>{
            let center = item.coordinate.split(',')
            geojsonData.features.push({
              type:'Feature',
              properties:{
                rank:i+1,
                name:item.name,
                data1:item.data1,
                data2:item.data2,
                data3:item.data3,
                data4:item.data4,
                data5:item.data5,
                data6:item.data6,
                data7:item.data7,
                data8:item.data8
              },
              geometry:{
                type:'Point',
                coordinates:center
              }
            })
          })
          
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
              "id": "rankAreaProC",
              "type": "circle",
              "source": "rankAreaMarketResource",
              "layout": {
                
              },
              "paint":{
                'circle-radius': [
                  "interpolate",
                  ["linear"],
                  ["get", "rank"],
                  1, 20,
                  10, 5
                ],
                'circle-color': [
                  'match',
                  ['get','rank'],
                  10,'#4575b4', 
                  9,'#74add1', 
                  8,'#abd9e9', 
                  7,'#e0f3f8', 
                  6,'#ffffbf', 
                  5,'#fee090', 
                  4,'#fdae61', 
                  3,'#f46d43', 
                  2,'#d73027', 
                  1,'#a50026',
                  '#a50026'
                ]
              }
            });
            map.addLayer({
              "id": "rankAreaProS",
              "type": "symbol",
              "source": "rankAreaMarketResource",
              "layout": {
                "text-field": "{name}",
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                "text-offset": [0, 1.2],
                "text-anchor": "top",
                "text-size":10,
                "text-allow-overlap": true,
              },
              "paint":{
                "text-color":'#fff'
              }
            });
            var popup = new this.mbgl.Popup({closeButton:true})
            map.on('click','rankAreaProC',e=>{
              let properties = e.features[0].properties
              let coordinates = [e.lngLat.lng,e.lngLat.lat];
              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              } 
              let html = `
              <div class="">项目名称：${properties.name}</div>
              <div class="">销售套数：${properties.data1}</div>
              <div class="">销售面积：${properties.data2} ㎡</div>
              <div class="">销售金额：${properties.data3} 万元</div>
              <div class="">销售均价：${properties.data4} 元/㎡</div>
              <div class="">供应套数：${properties.data5}</div>
              <div class="">供应面积：${properties.data6} ㎡</div>
              <div class="">存量套数：${properties.data7}</div>
              <div class="">存量面积：${properties.data8} ㎡</div>
              `
              popup.setLngLat(coordinates).setHTML(html).addTo(map)
            })
          }
          map.getSource('rankAreaMarketResource').setData(geojsonData)
        }
      })
      
    },
    //板块商品房市场—住宅—排行榜
    loadPlateMarketRank(){
      var that = this
      let map = this.reportAdd_map
      //数据请求
      let propertyStr = ''
      that.propertyChecked.forEach(item=>{
        propertyStr += (item+',')
      })
      let obj = {
        dataType:'part',
        dueTime:that.curYear,
        regionno:that.areaCode,
        type:propertyStr
      }
      LandReportApi.getMapMarketRank(obj)
      .then(res=>{
        console.log('板块商品房市场排行榜',res)
        if(res.data.code===0){
          let data = res.data.data
          that.rankData = data
          let geojsonData = {
            type:'FeatureCollection',
            features:[]
          }
          data.forEach((item,i)=>{
            let center = item.coordinate.split(',')
            geojsonData.features.push({
              type:'Feature',
              properties:{
                rank:i+1,
                name:item.name,
                data1:item.data1,
                data2:item.data2,
                data3:item.data3,
                data4:item.data4,
                data5:item.data5,
                data6:item.data6,
                data7:item.data7,
                data8:item.data8
              },
              geometry:{
                type:'Point',
                coordinates:center
              }
            })
          })
          
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
              "id": "rankPlateProC",
              "type": "circle",
              "source": "rankPlateMarketResource",
              "layout": {
                
              },
              "paint":{
                'circle-radius': [
                  "interpolate",
                  ["linear"],
                  ["get", "rank"],
                  1, 20,
                  10, 5
                ],
                'circle-color': [
                  'match',
                  ['get','rank'],
                  10,'#4575b4', 
                  9,'#74add1', 
                  8,'#abd9e9', 
                  7,'#e0f3f8', 
                  6,'#ffffbf', 
                  5,'#fee090', 
                  4,'#fdae61', 
                  3,'#f46d43', 
                  2,'#d73027', 
                  1,'#a50026',
                  '#a50026'
                ]
              }
            });
            map.addLayer({
              "id": "rankPlateProS",
              "type": "symbol",
              "source": "rankPlateMarketResource",
              "layout": {
                "text-field": "{name}",
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                "text-offset": [0, 1.2],
                "text-anchor": "top",
                "text-size":10,
                "text-allow-overlap": true,
              },
              "paint":{
                "text-color":"#fff"
              }
            });
            var popup = new this.mbgl.Popup({closeButton:true})
            map.on('click','rankPlateProC',e=>{
              let properties = e.features[0].properties
              let coordinates = [e.lngLat.lng,e.lngLat.lat];
              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              } 
              let html = `
              <div class="">项目名称：${properties.name}</div>
              <div class="">销售套数：${properties.data1}</div>
              <div class="">销售面积：${properties.data2} ㎡</div>
              <div class="">销售金额：${properties.data3} 万元</div>
              <div class="">销售均价：${properties.data4} 元/㎡</div>
              <div class="">供应套数：${properties.data5}</div>
              <div class="">供应面积：${properties.data6} ㎡</div>
              <div class="">存量套数：${properties.data7}</div>
              <div class="">存量面积：${properties.data8} ㎡</div>
              `
              popup.setLngLat(coordinates).setHTML(html).addTo(map)
            })
          }
          map.getSource('rankPlateMarketResource').setData(geojsonData)
        }
      })
    },
  }
};
</script>
<style lang="scss">
.report_addmap {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  .el-tree-node.is-current>.el-tree-node__content{
    height: 36px;
    background: none !important;
  }
  
  .el-tree-node__content:hover{
    background: linear-gradient(to right, #2722229e, transparent) !important;
  }
  .rank_cont{
    position: relative;
    .rank_tip{
      position: absolute;
      bottom: 10px;
      left: 0;
      font-size: 12px;
      color: #f60;
    }
  }
  .el-table .cell{
    text-align: center;
    padding-left: 0;
  }
  .el-table th>.cell{
    text-align: center;
    padding-right: 0;
  }
  .del_plan_point{
    cursor: pointer;
    text-decoration: underline;
  }
  .legend{
    position: absolute;
    right: 30px;
    bottom: 40px;
    z-index: 99;
    .legend_title{
      font-size: 12px;
      color: #e6a23c;
      margin-bottom: 10px;
    }
    .color_item{
      width: 30px;
      height: 20px;
      position: relative;
      .color{
        width: 100%;
        height: 100%;
        opacity: 0.6;
      }
      .value{
        position: absolute;
        right: -45px;
        top: -5px;
        color: #fff;
        font-size: 10px;
        width: 35px;
        text-align: left;
      }
    }
  }
  .setting_box{
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: 99;
    
    .el-radio__label{
      color: #fff;
    }
    .el-input__inner{
      background: #333;
      width: 110px;
      color: #e6a23c;
      border: #909399  1px solid;
      cursor: pointer;
    }
    .el-tree{
      background: none;
      color: #fff;
    }
  }
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
  .landImgbox{
    width: 50%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    .img{
      margin-bottom: 10px;
      margin-left: 10px;
      width: 45%;
      height: 170px;
      border: #333 2px dashed;
      text-align: center;
      cursor: pointer;
      overflow: hidden;
    }
  }
  .poi_info{
    position: absolute;
    background: #fff;
    padding: 10px;
    left: 5px;
    top: 5px;
    max-width: 180px;
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
  .land_info{
    width:70%;
    height:100%;
    overflow-y:scroll;
    display: flex;
    align-items: center;
  }
  .info_wrap{
    display: flex;
    width: fit-content;
    margin-left: 20px;
    border-right: #ccc 1px solid;
    border-bottom: #ccc 1px solid;
    .info_head{
      .head_item{
        width: 140px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 14px;
        color: #333;
        font-weight: bold;
        background: rgb(235, 235, 235);
        border-top: #ccc 1px solid;
        border-left: #ccc 1px solid;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .info_cont{
      display: flex;
      .col_item{
        .info_item{
          width: 120px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          font-size: 12px;
          color: #333;
          border-top: #ccc 1px solid;
          border-left: #ccc 1px solid;
        }
      }
    }
  }
  .map_cont{
    position: relative;
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