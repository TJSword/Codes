<template>
  <!-- 等时圈 -->
  <div class="mapiso_box">
    <!-- 地图容器 -->
    <MapComponent mapType="pointGrade" class="pointgrade_map" />
    <!-- 等时圈内的数据 -->
    <div class="option_box" v-if="false" :style="{ height: areaDataArr.length > 0 ? '96%' : 'auto' }">
      <div class="search_condition">
        <div class="search_title">查询条件</div>
        <div class="conditionA">
          <label>出行方式：</label>
          <el-select v-model="cxfs" @change="travelTypeChange" size="mini">
            <el-option
              v-for="(item, index) in cxfsArr"
              :key="index"
              :disabled="item.disabled"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="conditionB">
          <label>出行时间：</label>
          <el-select v-model="cxsj" @change="travelTimeChange" size="mini">
            <el-option
              v-for="(item, index) in cxsjArr"
              :disabled="item.disabled"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="conditionC">
          <label>起始位置：</label>
          <div class="sAddress">{{ startAddress }}</div>
        </div>
      </div>
      <div class="search_result" :style="{ height: areaDataArr.length > 0 ? '73%' : 'auto' }">
        <div class="search_title">配套poi数量展示</div>
        <div class="result_warp">
          <Loading class="loading" v-if="loading" :loadingText="'LOADING'" />
          <!-- poi数量 -->
          <div class="result_box">
            <div class="result_item" v-for="(item, index) in areaDataArr" :key="index">
              <div class="name">{{ item.itemName }}</div>
              <div class="value_box">
                <div class="r_value">{{ item.value }} {{ item.unit }}</div>
              </div>
            </div>
          </div>
          <!-- poi数量扇形图 -->
          <div id="word_pie"></div>
          <!-- poi数量词云 -->
          <div id="word_clound"></div>
        </div>
      </div>
    </div>
    <!-- 评分配置 -->
    <div class="score_type">
      <div v-if="!hideOption">
        <el-checkbox v-model="contrastFlag" @change="setEnclosure">多点对比</el-checkbox>
        <label class="type_label" style="margin-right:20px">(勾选此项多点对比)</label>
        <el-checkbox v-model="isoSircleFlag" @change="setEnclosure">等时圈</el-checkbox>
        <label class="type_label">(取消勾选绘制半径圆)</label>
      </div>
      <div class="isoSetting" v-if="isoSircleFlag">
        <label class="type_label" style="margin-right:20px;color:#409EFF;">等时圈配置</label>
        <label class="type_label">出行方式：</label>
        <el-select v-model="cxfs" @change="travelTypeChange" size="mini">
          <el-option
            v-for="(item, index) in cxfsArr"
            :key="index"
            :disabled="item.disabled"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <label class="type_label">出行时间：</label>
        <el-select v-model="cxsj" @change="travelTimeChange" size="mini">
          <el-option
            v-for="(item, index) in cxsjArr"
            :disabled="item.disabled"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
    </div>
    <!-- 点地出分的数据 -->
    <div class="text_show" :style="{'top':isoSircleFlag?'100px':'60px'}">
      <div class="score_box">
        <div class="score_head" v-if="scoreText.length>0">
          <div class="head_item" v-for="(item,i) in scoreHead" :key="i">
              <div class="main_title">
                <i v-if="false" :class="['text_icon iconfont ' + item.icon]"></i>
                <span class="main_label" @click="showLandScore(item.itemCode)">{{item.name}}</span>
              </div>
              <div class="sec_wrap" v-if="showScore.indexOf(item.itemCode) !==-1">
                <div class="sec_title" v-for="(second,j) in item.chidren" :key="j">
                  <el-checkbox :disabled="!layerReady" v-model="second.checked" @change="checked=>layerControl(checked,second.layerName)"></el-checkbox>
                  <label class="second_label">{{second.name}}</label>
                </div>
              </div>
          </div>  
        </div> 
        <div class="score_wrap" v-for="(arr,i) in scoreText" :key="i">
          <div class="point_name">
            <img class="img" :src="i===0?'http://47.104.165.136:8099/test/site_icon.png':i===1?'http://47.104.165.136:8099/test/site_icon1.png':'http://47.104.165.136:8099/test/site_icon2.png'" alt="">
            <div class="label">项目 {{i+1}}</div>
            <i class="el-icon-error delete_icon" @click="deletePoint(i)"></i>
          </div>
          <div class="score_item" v-for="(item, j) in arr" :key="j">
              <div class="main_score">{{ item.score }}</div>
              <div class="ex_score" :style="{ height: showScore.indexOf(item.itemCode) !==-1 ? 'auto' : '0'}">
                <div class="ex_score_item" v-for="(ex, k) in item.children" :key="k">{{ ex.score }}</div>
              </div>
          </div>
        </div>
      </div>
      
    </div>
    <!-- <div id="map_isochronous" class="map_container"></div> -->
  </div>
</template>
<script>
import * as turf from "@turf/turf";
import { Conrec } from "conrec";
import { mapGetters } from "vuex";
import { treeToArray1, wgs84togcj02, gcj02towgs84 } from "@/utils/public.js";
//api
import isochronousApi from "@/api/isochronousApi";
import analysistoolsApi from "@/api/analysistoolsApi";

// 引入echarts
import "echarts-wordcloud";

//组件
import MapComponent from '@/components/common/MapComponent'
import Loading from "@/components/tools/loading";
export default {
  name: "map_isochronous",
  props: {
    reportCoord:{ //报告土地评分
      type:Array,
      default:() => []
    }
  },
  components: {
    MapComponent,
    Loading,
  },
  data() {
    return {
      contrastFlag:false,//是否对比评分
      cityJSON: null, //城市轮廓
      accessToken:
        "pk.eyJ1Ijoibm9jb25yaWFuZGVyIiwiYSI6ImNrMjQ1dGNrNDIwdWMzZXVnN3VwbnV4NW4ifQ.D7k8xizdEAG4ucy3vAhNFg",
      local_map: null,
      cxfsArr: [
        //出行方式数组
        { label: "驾车", value: "driving", disabled: false },
        { label: "步行", value: "walking", disabled: false },
        { label: "骑行", value: "cycling", disabled: false },
        { label: "公共交通", value: "publicing", disabled: true },
      ],
      cxfs: "driving",
      cxfsLabel: "驾车",
      cxsjArr: [
        //出行时间数组
        { label: "15", value: "15", disabled: false },
        { label: "30", value: "30", disabled: false },
        { label: "45", value: "45", disabled: false },
        { label: "60", value: "60", disabled: false },
      ],
      cxsj: "15",
      startPoint: { lng: null, lat: null }, //起始坐标wgs84
      startAddress: "暂无", //起始地址
      curPlateType: "part", //工具栏显示的板块类型
      grid: null, //生成的网格
      areaDataArr: [], //区域内各项数据
      startPointCoor: null, //点拖动存储移动后的点的坐标
      loading: false,
      scoreHead:[ //评分头部信息
        { name:'产业综合强度', itemCode: "DDPT06",score:false,icon:"icon-chanye",chidren:[
          { name:'企业', itemCode: "DDPT0601",score:false,checked:false,layerName:'plan_enterprise' }
        ]},
        { name:'市政资源强度', itemCode: "DDPT05",score:false,icon:"icon-shizheng",chidren:[
          { name:'医院', itemCode: "DDPT0505",score:false,checked:false,layerName:'medical' },
          { name:'图书馆', itemCode: "DDPT0504",score:false,checked:false,layerName:'library' },
          { name:'大型运动场馆', itemCode: "DDPT0503",score:false,checked:false,layerName:'sports_venues' },
          { name:'公园', itemCode: "DDPT0502",score:false,checked:false,layerName:'park' },
          { name:'旅游景点', itemCode: "DDPT0501",score:false,checked:false,layerName:'attractions' }
        ]},
        { name:'自然资源强度', itemCode: "DDPT04",score:false,icon:"icon-ziran",chidren:[
          { name:'山体', itemCode: "DDPT0402",score:false,checked:false,layerName:null },
          { name:'海岸线', itemCode: "DDPT0401",score:false,checked:false,layerName:null }
        ]},
        { name:'教育综合强度', itemCode: "DDPT03",score:false,icon:"icon-jiaoyu",chidren:[
          { name:'初中', itemCode: "DDPT0302",score:false,checked:false,layerName:'junior_middle_school' },
          { name:'小学', itemCode: "DDPT0301",score:false,checked:false,layerName:'primary_school' }
        ]},
        { name:'商业综合强度', itemCode: "DDPT02",score:false,icon:"icon-shangye",chidren:[
          { name:'购物中心', itemCode: "DDPT0201",score:false,checked:false,layerName:'mall'}
        ]},
        { name:'交通综合强度', itemCode: "DDPT01",score:false,icon:"icon-jiaotong",chidren:[
          { name:'地铁', itemCode: "DDPT0102",score:false,checked:false,layerName:'subway' },
          { name:'干道', itemCode: "DDPT0101",score:false,checked:false,layerName:null }
        ]},
        { name:'总分', itemCode: "DDPT00",score:false,icon:"icon-zongfen"}
      ],
      scoreText: [], //点地评分结果数组
      showScore: [], //展示的点地评分项code
      pointCenter:[], //对比点坐标数据
      pointCircle:[], //对比点辐射圈数据
      pointIso:[], //对比点等时圈数据
      isoSircleFlag:true,//是否为等时圈显示poi
      popup:[{popup:null},{popup:null},{popup:null}],//弹出菜单
      clickPointFlag:false,//点击项目点
      poiLayers:[ //poi图层
        { name:"企业",val:'plan_enterprise', resource:'plan_enterprise' ,color: '#00f3ff',icon:'icon_qy',
          filter:['all',['has','id']]
        },
        { name:"地铁",val:'subway', resource:'subway',color: '#cd8cff',icon:'icon_dt',
          filter:['all',['has','name'],['has','id']]
        },
        { name:"购物中心",val:'mall', resource:'mall',color: '#fbb03b',icon:'icon_gwzx',
          filter:['all',['has','id']]
        },
        { name:"公立小学",val:'primary_school', resource:'school_poi',color: '#f56c6c',icon:'icon_glxx',
          filter:['all',['==','hosting_nature','state_run'],['==','school_type','primary_school']] 
        },
        { name:"公立初中",val:'junior_middle_school', resource:'school_poi',color: '#f60',icon:'icon_glcz',
          filter:['all',['==','hosting_nature','state_run'],['==','school_type','junior_middle_school']] 
        },
        { name:"三甲医院",val:'medical', resource:'resource' ,color: '#00f3ff',icon:'icon_sjyy',
          filter:['all',['has','name'],['==','attribute_code','KAB']]
        },
        { name:"图书馆",val:'library', resource:'resource' ,color: '#00f3ff',icon:'icon_tsg',
          filter:['all',['has','name'],['==','classify_code',"library"]]
        },
        { name:"运动场馆",val:'sports_venues', resource:'resource' ,color: '#00f3ff',icon:'icon_ydcg',
          filter:['all',['has','name'],['==','classify_code','sports_venues']]
        },
        { name:"公园",val:'park', resource:'resource' ,color: '#00f3ff',icon:'icon_gy',
          filter:['all',['has','id']]
        },
        { name:"旅游景点",val:'attractions', resource:'resource' ,color: '#00f3ff',icon:'icon_jd',
          filter:['all',['has','id']]
        }
      ],
      layerReady:false,//等时圈内的poi是否查询完成
      hideOption:false,//隐藏多点对比
    };
  },
  created(){
    var that = this
    window.delPoint = that.deletePoint
  },
  beforeMount() {},
  mounted() {
    this.getCityOutline();
    setTimeout(()=>{
      this.mapEvent();
      this.mapLayerLoad();
      setTimeout(()=>{
        this.setCircleLater()
      },1000)
    },1500)
    
  },
  watch: {
    reportCoord:{
      handler(newVal){
        setTimeout(()=>{
          this.landScore(newVal)
          this.startPoint = {lng:newVal[0],lat:newVal[1]}
          var map = this.pointgrade_map;
          this.hideOption = true
          map.flyTo({
            center: newVal,
            zoom: 11,
            speed: 0.8,
            curve: 2
          })
        },2000)
        
      }
    },
    deep:true
  },
  computed: {
    ...mapGetters([
      "cityCode",
      "pointgrade_map",
      "plateData",
      "plateType",
    ]),
  },
  methods: {
    //获取当前城市轮廓
    getCityOutline() {
      isochronousApi.getCityJSON(this.cityCode).then((res) => {
        if (res.data.code === 0) {
          console.log(res);
          let data = JSON.parse(res.data.data.coordinates);
          let obj = {
            type: "Feature",
            geometry: {
              type: "MultiPolygon",
              coordinates: data,
            },
          };
          this.cityJSON = obj;
          this.startPointCoor = {
            lng: this.plateData.curCityInfo.center[0],
            lat: this.plateData.curCityInfo.center[1],
          };
        }
      });
    },
    mapLayerLoad() {
      var colorSchemes = {
        mono: [
          [0, "lime"],
          [600, "green"],
          [1200, "blue"],
          [1800, "purple"],
        ],
        rainbow: [
          [0, "red"],
          [400, "orange"],
          [800, "yellow"],
          [1200, "green"],
          [1600, "blue"],
          [2000, "indigo"],
          [2400, "violet"],
        ],
        altColor: [
          [150, "#f54e5e"],
          [900, "#f9886c"],
          [1500, "#f1f075"],
          [2100, "#56b881"],
          [2700, "#3887be"],
          [3450, "#4a4a8b"],
        ],
        pendleton: [
          [150, "#eae49a"],
          [300, "#e3ce4f"],
          [600, "#eeab50"],
          [900, "#ec8353"],
          [1200, "#c88e9c"],
          [1500, "#b0517d"],
          [1800, "#375b97"],
        ],
      };
      var ddsColor = {
        property: "duration",
        type: "exponential",
        stops: colorSchemes.altColor,
      };
      var map = this.pointgrade_map;
      var code = this.cityCode;
      map.on("load", () => {
        //缓冲区临时点
        map.addSource("buffer_point", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });
        map.addLayer({
          id: "buffer_point",
          type: "circle",
          source: "buffer_point",
          paint: {
            "circle-radius": 3,
            "circle-color": "#ccc",
          },
          layout: {
            visibility: "visible",
          },
        });
        //缓冲区临时点
        map.addSource("gd_point", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });
        map.addLayer({
          id: "gaode_point",
          type: "circle",
          source: "gd_point",
          paint: {
            "circle-radius": 3,
            "circle-color": "#f60",
          },
          layout: {
            visibility: "visible",
          },
        });
        map.addLayer({
          id: "gaode_labels",
          type: "symbol",
          source: "gd_point",
          layout: {
            "text-field": ["get", "duration"],
            "text-size": 10,
            "text-ignore-placement": false,
            "text-justify": "auto",
            "text-offset": [0, -1.5],
          },
          paint: {
            "text-opacity": 1,
            "text-color": "#fff",
          },
        });
        //等时线
        map.addSource("soline", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });
        map.addLayer({
          id: "soline_fill",
          type: "fill",
          source: "soline",
          paint: {
            "fill-color": [
              "match",
              ["get", "duration"],
              900,
              "#f54e5e",
              1800,
              "#f1f075",
              2700,
              "#56b881",
              3600,
              "#3887be",
              //500,'#4a4a8b',
              "#f60",
            ],
            "fill-opacity": 1,
          },
        });
        map.addLayer({
          id: "soline_labels",
          type: "symbol",
          source: "soline",
          layout: {
            "text-field": ["get", "duration"],
            "text-size": 10,
            "text-ignore-placement": false,
            "text-justify": "auto",
          },
          paint: {
            "text-opacity": 1,
            "text-color": "#fff",
          },
        });
        //mapbox等时区(多层)
        map.addSource("mapboxSoline", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });
        map.addLayer({
          id: "mapboxSoline_fill",
          type: "fill",
          source: "mapboxSoline",
          paint: {
            "fill-color": ddsColor,
            "fill-opacity": 1,
          },
        });
        map.addLayer({
          id: "mapboxSoline_line",
          type: "line",
          source: "mapboxSoline",
          layout: {
            visibility: "none",
          },
          paint: {
            "line-color": {
              property: "duration",
              type: "interval",
              stops: colorSchemes.altColor.map(function(pair) {
                var edited = [pair[0] - 300, pair[1]];
                return edited;
              }),
            },
            "line-opacity": 0.25,
            "line-width": {
              base: 1.5,
              stops: [
                [10, 1],
                [22, 4],
              ],
            },
          },
        });
        map.addLayer({
          id: "mapboxSoline_labels",
          type: "symbol",
          source: "mapboxSoline",
          layout: {
            "text-field": ["get", "duration"],
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
          paint: {
            "text-halo-color": "hsl(55, 1%, 20%)",
            "text-color": {
              property: "duration",
              type: "interval",
              stops: colorSchemes.altColor,
            },
            "text-halo-width": 6,
          },
        });
        //mapbox等时区(单层)
        map.addSource("mapboxSoline_single", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });
        map.addLayer({ 
          id: "mapboxSolineSingle_fill",
          type: "fill",
          source: "mapboxSoline_single",
          paint: {
            "fill-color": '#3bb2d0',
            "fill-opacity": 0.1
          }
        });
        map.addLayer({
          id: "mapboxSolineSingle_line",
          type: "line",
          source: "mapboxSoline_single",
          layout: {},
          paint: {
            "line-color":'#3bb2d0',
            "line-width":1,
            "line-opacity": 1
          }
        });
      });
    },
    //图层事件-板块
    mapEvent() {
      var map = this.pointgrade_map;
      map.on("click", (e) => {
        if(this.reportCoord.length>0){ //报告引用土地评分时，禁止触发点地评分
          return false
        }
        this.setStartPoint(e.lngLat)
      });
      map.on("mousemove", "plate_fill", (e) => {
        this.addMeasureRes(
          [e.lngLat.lng, e.lngLat.lat],
          "点击以此为中心绘制等时圈"
        );
        map.getCanvas().style.cursor = "crosshair";
      });
      map.on("mouseleave", "plate_fill", (e) => {
        let resultDom = document.getElementsByClassName("measure_result");
        if (resultDom.length > 0) {
          resultDom[0].remove();
        }
        map.getCanvas().style.cursor = "";
      });
      
      map.loadImage("http://47.104.165.136:8099/test/site_icon.png", (error, markerA) => {
        if (error) throw error;
        map.addImage("markerA", markerA);
      })
      map.loadImage("http://47.104.165.136:8099/test/site_icon1.png", (error, markerB) => {
        if (error) throw error;
        map.addImage("markerB", markerB);
      })
      map.loadImage("http://47.104.165.136:8099/test/site_icon2.png", (error, markerC) => {
        if (error) throw error;
        map.addImage("markerC", markerC);
      })
      map.loadImage("http://47.104.165.136:8099/test/D2D/icons/icon_gwzx.png", (error, icon_gwzx) => {
        if (error) throw error;
        map.addImage("icon_gwzx", icon_gwzx);
      })
      map.loadImage("http://47.104.165.136:8099/test/D2D/icons/icon_glxx.png", (error, icon_glxx) => {
        if (error) throw error;
        map.addImage("icon_glxx", icon_glxx);
      })
      map.loadImage("http://47.104.165.136:8099/test/D2D/icons/icon_glcz.png", (error, icon_glcz) => {
        if (error) throw error;
        map.addImage("icon_glcz", icon_glcz);
      })
      map.loadImage("http://47.104.165.136:8099/test/D2D/icons/icon_sjyy.png", (error, icon_sjyy) => {
        if (error) throw error;
        map.addImage("icon_sjyy", icon_sjyy);
      })
      map.loadImage("http://47.104.165.136:8099/test/D2D/icons/icon_tsg.png", (error, icon_tsg) => {
        if (error) throw error;
        map.addImage("icon_tsg", icon_tsg);
      })
      map.loadImage("http://47.104.165.136:8099/test/D2D/icons/icon_ydcg.png", (error, icon_ydcg) => {
        if (error) throw error;
        map.addImage("icon_ydcg", icon_ydcg);
      })
      map.loadImage("http://47.104.165.136:8099/test/D2D/icons/icon_dt.png", (error, icon_dt) => {
        if (error) throw error;
        map.addImage("icon_dt", icon_dt);
      })
      map.loadImage("http://47.104.165.136:8099/test/D2D/icons/icon_sc.png", (error, icon_sc) => {
        if (error) throw error;
        map.addImage("icon_sc", icon_sc);
      }) 
      map.loadImage("http://47.104.165.136:8099/test/D2D/icons/icon_gy.png", (error, icon_gy) => {
        if (error) throw error;
        map.addImage("icon_gy", icon_gy);
      })
      map.loadImage("http://47.104.165.136:8099/test/D2D/icons/icon_jd.png", (error, icon_jd) => {
        if (error) throw error;
        map.addImage("icon_jd", icon_jd);
      })
      map.loadImage("http://47.104.165.136:8099/test/D2D/icons/icon_qy.png", (error, icon_qy) => {
        if (error) throw error;
        map.addImage("icon_qy", icon_qy);
      }) 
    },
    addMeasureRes(coor, str) {
      //添加绘制marker
      let map = this.pointgrade_map;
      //添加dom
      let resultDom = document.getElementsByClassName("measure_result");
      if (resultDom.length === 0) {
        var ele = document.createElement("div");
        ele.setAttribute("class", "measure_result");
        ele.innerHTML = str;
      } else {
        resultDom[0].innerHTML = str;
      }
      let option = {
        element: resultDom.length === 0 ? ele : resultDom[0],
        anchor: "center",
        offset: [0, 40],
      };

      var marker = new this.mbgl.Marker(option);
      marker.setLngLat(coor).addTo(map);
    },
    travelTypeChange(e) {
      console.log(e);
      if (e === "publicing") {
        this.cxsjArr[0].disabled = true;
        this.cxsj = "30";
      } else {
        this.cxsjArr[0].disabled = false;
      }
      this.cxfsLabel = this.cxfsArr.filter(item=>{
        return item.value === e
      })[0].label
      if(!this.contrastFlag){ //点点评分改变条件更改等时圈
        this.setStartPoint(this.startPoint,true)
      }
    },
    travelTimeChange() {
      if(!this.contrastFlag){ //点点评分改变条件更改等时圈
        this.setStartPoint(this.startPoint,true);
      }
    },
    //判断点是否查询过
    checkPointSearch() {
      let obj = {
        point: this.startPoint.lng + "," + this.startPoint.lat,
        circleTime: this.cxsj,
        circleType: this.cxfs,
      };
      isochronousApi.checkPointSave(obj).then((res) => {
        if (res.data.code === 0) {
          console.log("该点是否查询过", res);
          let isSearch = false;
          if (res.data.data !== null) {
            if (res.data.data.length > 0) {
              isSearch = true;
              this.areaDataArr = res.data.data;
              //词云图表
              this.dataWordClound(res.data.data);
              this.dataPieChart(res.data.data);
            }
          }
          // mapbox等时圈
          // this.setTurfGrid([
          //   JSON.parse(this.startPoint.lng),
          //   JSON.parse(this.startPoint.lat),
          // ]);
          
          this.mapboxIsoline(obj.point,isSearch)//mapbox api
          
        }
      });
    },

    //点击地图获得起始点
    setStartPoint(spoint,isChange) { //isChange true改变条件
      if(this.clickPointFlag){ return false } //点击项目点显示信息不添加项目
      if(!isChange){
        this.startPoint = {
          lng: spoint.lng.toFixed(6),
          lat: spoint.lat.toFixed(6),
        }
      }
      console.log('点击的点',spoint)
      //判断点是否在城市行政区内
      let pt = turf.point([spoint.lng, spoint.lat])
      let poly = this.cityJSON
      let isInFlag = turf.booleanPointInPolygon(pt, poly)
      if (!isInFlag) {
        this.$message(
          "请将点移入" + this.plateData.curCityInfo.name + "之内进行操作"
        )
        return
      }
      
      // //查询起始点位置
      // this.getGaodeAdress();
      // console.log(isInFlag);
      // //判断是否查询过
      // this.checkPointSearch();
      //点地评分
      let coorStr = this.startPoint.lng + "," + this.startPoint.lat;
      this.landScore([spoint.lng, spoint.lat]);

    },
    //高德地图坐标反查API
    getGaodeAdress() {
      this.$.ajax({
        type: "get",
        url: "https://restapi.amap.com/v3/geocode/regeo",
        cache: false,
        dataType: "json",
        data: {
          key: "d222a0cc9d49fe7a60ab4b123a20c34a",
          location: this.startPoint.lng + "," + this.startPoint.lat,
          poitype: "",
          radius: 200,
          extensions: "all",
          batch: false,
          roadlevel: 0,
        },
        success: (data) => {
          console.log(data);
          if (data && data.status === "1") {
            let address = data.regeocode.formatted_address;
            this.startAddress = address;
          }
        },
      });
    },
    
    //点击地图生成turf网格
    setTurfGrid(startPoint) {
      var centerPoint = turf.point(startPoint);
      //生成缓冲区
      let r = 0;
      let c = 0;
      if (this.cxfs == "walking") {
        r = 4; // 8.75
        c = 1; // 1.75
      } else if (this.cxfs == "cycling") {
        r = 5;
        c = 0.5;
      } else if (this.cxfs == "driving") {
        r = 50;
        c = 5;
      } else {
        r = 20;
        c = 5;
      }
      var buffered = turf.buffer(centerPoint, r, { units: "kilometers" }); //根据公交平均车速35km/h设置网格半径
      //根据缓冲区生成bbox
      var bbox = turf.bbox(buffered);
      var cellSide = c;
      var options = { units: "kilometers" };
      //生成网格
      var grid = turf.pointGrid(bbox, cellSide, options);
      //网格点筛选（是否在城市之内）
      grid.features = grid.features.filter((item) => {
        let pt = turf.point([
          item.geometry.coordinates[0],
          item.geometry.coordinates[1],
        ]);
        let poly = this.cityJSON;
        let isInFlag = turf.booleanPointInPolygon(pt, poly);
        return isInFlag;
      });
      this.grid = grid;
      console.log(grid);
      let map = this.pointgrade_map;
      map.getSource("buffer_point").setData(grid);

      this.getSiteTime(startPoint, grid.features, this.cxfs);
      //this.getSiteTime_GD(startPoint,grid.features,"publicing")
    },
    //计算网格各点到中心点的时间(mapbox接口)
    getSiteTime(startPoint, endPoints, travelType) {
      if (endPoints.length > 0) {
        var features = [];
        let num = Math.ceil(endPoints.length / 24);
        console.log(num);
        for (let n = 0; n < num; n++) {
          var url =
            "https://api.mapbox.com/directions-matrix/v1/mapbox/" +
            travelType +
            "/" +
            startPoint[0].toFixed(4) +
            "," +
            startPoint[1].toFixed(4) +
            ";";
          let pointsArr = endPoints.slice(n * 24, (n + 1) * 24);
          for (var i = 0; i < pointsArr.length; i++) {
            url =
              url +
              pointsArr[i].geometry.coordinates[0].toFixed(4) +
              "," +
              pointsArr[i].geometry.coordinates[1].toFixed(4) +
              ";";
          }

          url =
            url +
            "?sources=0&destinations=all&access_token=" +
            this.accessToken;
          url = url.replace(";?", "?");
          this.$.ajax({
            type: "get",
            async: false,
            url: url,
            dataType: "json",
            success: (json) => {
              var destinations = json.destinations;
              var durations = json.durations;
              for (var i = 1; i < destinations.length; i++) {
                var feature = turf.point(destinations[i].location, {
                  duration: parseInt(durations[0][i]),
                });
                features.push(feature);
              }
            },
            error: function() {
              console.log("fail");
            },
          });
        }
        console.log(features);
        this.setIsoline(features);
      }
    },
    //计算网格各点到中心点的时间(高德接口)
    getSiteTime_GD(startPoint, endPoints, travelType) {
      let start_point = wgs84togcj02(startPoint[0], startPoint[1]);
      if (endPoints.length > 0) {
        let features = [];
        endPoints.forEach((item) => {
          let itemCor = wgs84togcj02(
            item.geometry.coordinates[0],
            item.geometry.coordinates[1]
          );
          let startCor =
            start_point[0].toFixed(4) + "," + start_point[1].toFixed(4);
          let endCor = itemCor[0].toFixed(4) + "," + itemCor[1].toFixed(4);

          if (travelType === "publicing") {
            //公共交通
            let url =
              "https://restapi.amap.com/v3/direction/transit/integrated?" +
              "origin=" +
              startCor +
              "&destination=" +
              endCor +
              "&city=" +
              this.cityCode +
              "&output=json&key=d222a0cc9d49fe7a60ab4b123a20c34a";
            this.$.ajax({
              type: "get",
              async: false,
              url: url,
              dataType: "json",
              success: (e) => {
                //console.log(e)
                if (e.route.transits.length > 0) {
                  let arr = [];
                  e.route.transits.forEach((item) => {
                    arr.push(parseInt(item.duration));
                  });
                  let minduration = Math.min.apply(null, arr);
                  let feature = turf.point(item.geometry.coordinates, {
                    duration: minduration,
                  });
                  features.push(feature);
                }
              },
            });
          } else {
            //驾车、步行
            let url =
              "https://restapi.amap.com/v3/direction/" +
              travelType +
              "?origin=" +
              startCor +
              "&destination=" +
              endCor +
              "&extensions=all&output=json&key=d222a0cc9d49fe7a60ab4b123a20c34a";
            this.$.ajax({
              type: "get",
              async: false,
              url: url,
              dataType: "json",
              success: (e) => {
                //console.log(e)
                let steps = e.route.paths[0].steps;
                let duration = 0;
                steps.forEach((item) => {
                  duration += parseInt(item.duration);
                  let corArr = item.polyline.split(";");
                  let endCor = corArr[corArr.length - 1].split(",");
                  endCor = gcj02towgs84(endCor[0], endCor[1]);
                  let feature = turf.point(endCor, {
                    duration: parseInt(duration),
                  });
                  features.push(feature);
                });
              },
              error: (err) => {
                console.log(err);
              },
            });
          }
        });
        let gdjson = turf.featureCollection(features);
        let map = this.pointgrade_map;
        map.getSource("gd_point").setData(gdjson);

        this.setIsoline(features);
      }
    },
    //获取最接近的点
    getNearestPoint(x, y, pts) {
      var ptsjson = turf.featureCollection(pts);
      var targetPoint = turf.point([x, y]);
      var nearest = turf.nearestPoint(targetPoint, ptsjson);
      return nearest;
    },
    //生成等值线
    setIsoline(features) {
      let xs = [];
      let ys = [];
      let grid = this.grid;
      for (var i = 0; i < grid.features.length; i++) {
        if (
          xs.indexOf(
            parseFloat(grid.features[i].geometry.coordinates[0].toFixed(4))
          ) == -1
        ) {
          xs.push(
            parseFloat(grid.features[i].geometry.coordinates[0].toFixed(4))
          );
        }

        if (
          ys.indexOf(
            parseFloat(grid.features[i].geometry.coordinates[1].toFixed(4))
          ) == -1
        ) {
          ys.push(
            parseFloat(grid.features[i].geometry.coordinates[1].toFixed(4))
          );
        }
      }
      var zs = [0];
      let num = JSON.parse(this.cxsj);
      for (let i = 1; i < num + 1; i++) {
        zs.push(i * 60);
      }

      var data = [];
      for (var y = 0; y < ys.length; y++) {
        var rowData = [];
        for (var x = 0; x < xs.length; x++) {
          var nearest = this.getNearestPoint(xs[x], ys[y], features);
          let duration = nearest.properties.duration;
          rowData.push(duration);
        }
        data.push(rowData);
      }

      var c = new Conrec();
      c.contour(
        data,
        0,
        xs.length - 1,
        0,
        ys.length - 1,
        xs,
        ys,
        zs.length,
        zs
      );
      console.log(c.contourList());
      this.polygonize(c.contourList());
    },
    polygonize(contourList) {
      var shapes = [];
      var results = [];
      var polygons = [];
      for (var cIndex = 0; cIndex < contourList.length; cIndex++) {
        var c = contourList[cIndex];
        var level = c.level;
        var shape = [];
        for (var k = 0; k < c.length; k++) {
          shape.push([c[k].x, c[k].y]);
        }
        shape.push(shape[0]);
        for (var p = shape.length; p < 4; p++) {
          shape.push(shape[0]);
        }
        var polygon = turf.polygon([shape], { duration: level });
        shapes.push(polygon);
      }
      results.push(shapes[0]);
      for (var i = 1; i < shapes.length; i++) {
        var duration = shapes[i].properties.duration;
        var difference = turf.difference(shapes[i], shapes[i - 1]);
        if (difference != null) {
          difference.properties.duration = duration;
          results.push(difference);
        }
      }
      //return shapes;
      let data = turf.featureCollection(results);
      console.log(data);
      let map = this.pointgrade_map;
      map.getSource("mapboxSoline").setData(data);
    },
    //请求等时圈内的数据
    getIsoScore(pointCoor, polygonCoor) {
      this.loading = true;
      //等时圈内的数据
      let obj = {
        coordinate: pointCoor,
        coordinates: polygonCoor,
        coordinateType: "wgs84",
        circleTime: this.cxsj,
        circleType: this.cxfs,
      };
      isochronousApi.getIsochronousScore(obj).then((res) => {
        if (res.data.code === 0) {
          console.log("区域内的数据", res);
          let dataList = res.data.data;
          this.areaDataArr = dataList;
          //词云图表
          this.dataWordClound(dataList);
          this.dataPieChart(dataList);
          this.loading = false;
        }
      });
    },
    //设置等时圈或者半径圆
    setEnclosure(val){
      let map = this.pointgrade_map
      this.scoreText = []
      this.pointCenter = []
      this.pointCircle = []
      this.pointIso = []
      let pointCenter = map.getSource('pointCenter')
      // this.popup.forEach(item=>{
      //   if(item.popup!==null){
      //     item.popup.remove()
      //     item.popup = null
      //   }
      // })
      let geojson = {
        type: "FeatureCollection",
        features: [],
      }
      if(pointCenter!==undefined){
        map.getSource('pointCenter').setData(geojson)
      }
      let mapboxSoline_single = map.getSource('mapboxSoline_single')
      if(mapboxSoline_single!==undefined){
        map.getSource('mapboxSoline_single').setData(geojson)
      }
      let radiusCircle = map.getSource('radiusCircle')
      if(radiusCircle!==undefined){
        map.getSource('radiusCircle').setData(geojson)
      }
    },
    delPoint(i){
      console.log(i)
    },
    //绘制点marker
    drawPointMarker(center){
      var that = this
      if(center){
        if(that.contrastFlag){ //多点
          let nullIndex = that.pointCenter.indexOf(null)
          if(nullIndex===-1){
            that.pointCenter.push(center)
          }else{
            that.pointCenter[nullIndex] = center
          }
        }else{
          that.pointCenter = [center]
        }
      }
      if(that.isoSircleFlag){
        //等时圈绘制
        that.mapboxIsoline()
      }else{
        //半径圆绘制
        that.radiusCircle()
      }
      

      let map = that.pointgrade_map
      let data = {
        "type": "FeatureCollection",
        "features":[]
      }
      
      that.pointCenter.forEach((item,i)=>{
        if(item){
          //添加点feature
          data.features.push({
            "type": "Feature", 
            "properties": { "name": "项目"+(i+1),"id":i }, 
            "geometry": { 
              "type": "Point", 
              "coordinates": item
            } 
          })
        }
      })
      let pointCenter = map.getSource('pointCenter')
      
      if(pointCenter===undefined){
        map.addSource("pointCenter", {
          type: "geojson",
          data: data
        });
        map.addLayer({
          id: "pointcenter_symbol",
          type: "symbol",
          source: "pointCenter",
          layout: {
            "icon-image": 
            ['match',
              ['get','name'],
              '项目1','markerA',
              '项目2','markerB',
              '项目3','markerC',
              'markerA'
            ],
            "text-field": "{name}",
            "text-offset": [0, -3],
            "text-font": ["DIN Offc Pro Bold"],
            "icon-size":0.5,
            "text-anchor": "top",
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
            "text-color": "#fff",
            "text-halo-width": 2,
          }
        });
        let pointPopup = new that.mbgl.Popup({offset:15,anchor:'left'})
        map.on('mousemove','pointcenter_symbol',e=>{
          map.getCanvas().style.cursor = "pointer"
          that.clickPointFlag = true
        })
        map.on('click','pointcenter_symbol',e=>{
          return false
          let coordinates = [e.lngLat.lng,e.lngLat.lat];
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          } 
          let i = e.features[0].properties.id
          let curItem = that.scoreText.filter((item,index)=>{
            return i===index
          })[0]
          let htmlStr = `<div class="no_animation"><div class="btn_box"><span class="name">项目${i+1}</span>
        <span class="detail">详细</span><span class="del">删除</span></div>`
          curItem.forEach(scoe=>{
            htmlStr += `<div class="score_item">
              <span class="label">${ scoe.name }</span>
              <span class="value">${ scoe.score }</span>`
            if(scoe.children){
              htmlStr += `<div class="score_ex">`
              scoe.children.forEach(child=>{
                htmlStr += `<div class="score_exitem">
                  <span class="label">${ child.name }</span>
                  <span class="value">${ child.score }</span>
                </div>`
              })
              htmlStr += `</div>`
            }
            htmlStr += `</div>`
          })
          htmlStr += '</div>'
          that.$('.score_item').click((e)=>{
            console.log(111)
            that.$(this).children('score_ex').slideToggle()
          })
          pointPopup.setLngLat(coordinates).setHTML(htmlStr).addTo(map)
        })
        map.on('mouseleave', 'pointcenter_symbol' ,e=>{
          that.clickPointFlag = false
        })
      }else{
        map.getSource('pointCenter').setData(data)
      }
      
      
    },
    //mapbox等时圈
    mapboxIsoline() {
      var that = this
      let map = this.pointgrade_map;
      let layerFlag = map.getSource("mapboxSoline_single")
      if(layerFlag===undefined){
        //mapbox等时区(单层)
        map.addSource("mapboxSoline_single", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });
        map.addLayer({
          id: "mapboxSolineSingle_line",
          type: "line",
          source: "mapboxSoline_single",
          "layout": {
            "line-join": "round",
            "line-cap": "round"
          },
          "paint": {
            "line-color":[
              "match",
              ["get","name"],
              "isoCircle1","#ff7f4e",
              "isoCircle2","#7dfd3e",
              "isoCircle3","#409EFF",
              /* other */ '#ccc'
            ],
            "line-width":7,
            "line-opacity": 0.4,
            "line-blur":3
          }
        });
        map.addLayer({
          id: "mapboxSolineSingle_line1",
          type: "line",
          source: "mapboxSoline_single",
          "layout": {
            "line-join": "round",
            "line-cap": "round"
          },
          "paint": {
            "line-color":'#fff',
            "line-width":1,
            "line-opacity": 1
          }
        });
        map.addLayer({
          "id": "mapboxSolineSingle_fill",
          "type": "fill",
          "source": "mapboxSoline_single",
          "layout": {
           
          },
          "paint": {
            "fill-color": [
              "match",
              ["get","name"],
              "isoCircle1","#ff7f4e",
              "isoCircle2","#7dfd3e",
              "isoCircle3","#409EFF",
              /* other */ '#ccc'
            ],
            "fill-opacity": 0.1
          }
        },"mall");
      }
      //
      let geojsonData = {
        type: "FeatureCollection",
        features: []
      }
      this.pointCenter.forEach((item,i)=>{
        if(item!==null){
          let spoint = item[0]+','+item[1]
          let url = "https://api.mapbox.com/isochrone/v1/mapbox/" + this.cxfs + "/" +
          spoint + "?contours_minutes=" + this.cxsj + "&polygons=true&access_token=" + this.accessToken;
          this.$.ajax({
            type: "get",
            async: false, //同步请求
            url: url,
            dataType: "json",
            success: (json) => {
              console.log('等时圈geojson',JSON.stringify(json));
              let coord = json.features[0].geometry.coordinates
              geojsonData.features.push({
                type: "Feature",
                geometry:{
                  type:"Polygon",
                  coordinates:coord
                },
                properties:{ name:'isoCircle'+(i+1) }
              })
              this.pointIso[i] = coord[0]
            },
            error: function() {
              console.log("fail");
            },
          });
        }else{
          this.pointIso[i] = null
        }
      })
      map.getSource("mapboxSoline_single").setData(geojsonData);
      //查询范围内的poi
      this.getCirclePoi(this.pointIso)
    },
    //半径圆绘制
    radiusCircle(){
      var that = this
      let map = this.pointgrade_map;
      let layerFlag = map.getSource("radiusCircle")
      if(layerFlag===undefined){
        map.addSource("radiusCircle", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });
        map.addLayer({
          id: "radiusCircle_fill",
          type: "fill",
          source: "radiusCircle",
          "layout": {},
          "paint": {
            "fill-color": [
              "match",
              ["get","name"],
              "radiusCircle1","#ff7f4e",
              "radiusCircle2","#7dfd3e",
              "radiusCircle3","#409EFF",
              /* other */ '#ccc'
            ],
            "fill-opacity": 0.06
          }
        });
        map.addLayer({
          id: "radiusCircle_line",
          type: "line",
          source: "radiusCircle",
          "layout": {},
          "paint": {
            "line-color":[
              "match",
              ["get","name"],
              "radiusCircle1","#ff7f4e",
              "radiusCircle2","#7dfd3e",
              "radiusCircle3","#409EFF",
              /* other */ '#ccc'
            ],
            "line-dasharray": [2, 4],
            "line-width":1.5,
            "line-opacity": 0.9
          }
        });
        map.addLayer({
          "id": "radiusCircle_symbol",
          "type": "symbol",
          "source": "radiusCircle",
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
            "text-color": "#fff",
            "text-halo-width": 2,
          }
        });
      }
      //
      let geojsonData = {
        type: "FeatureCollection",
        features: []
      }
      this.pointCenter.forEach((item,index)=>{
        if(item!==null){
          var points = 64; //点的个数
          var coords = {
            latitude: item[1],
            longitude: item[0]
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
            "properties": { "name": "radiusCircle"+(index+1)}, 
            "geometry": {
              "type": "Polygon",
              "coordinates": [ret],
            }
          })
          this.pointCircle[index] = ret
        }else{
          this.pointCircle[index] = null
        }
      })
      map.getSource("radiusCircle").setData(geojsonData);
      //查询范围内的poi
      this.getCirclePoi(this.pointCircle)
    },
    //添加poi图层
    setCircleLater(){
      var that = this
      var map = this.pointgrade_map
      let code = this.cityCode
      this.poiLayers.forEach(item=>{
        
        let workSpace_layer = 'city_'+code+':'+code+'_'+item.resource
        let tileUrl = 'http://47.104.165.136:8070/geoserver/gwc/service/tms/1.0.0/'+workSpace_layer+'@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf'
        map.addSource(item.val+"_resource", {
          type: "vector",
          scheme: "tms",
          tiles: [tileUrl]
        });
        map.addLayer({ 
          "id": item.val,
          "type": "symbol",
          "source": item.val+"_resource",
          "source-layer": code+"_"+item.resource,
          //"filter":item.filter,
          'layout': {
            "icon-image":item.icon,
            "icon-size":0.6,
            "icon-allow-overlap":true,
            "icon-ignore-placement":true,
            "icon-keep-upright":true,
            "symbol-avoid-edges":true,
            // "text-field": "{name}",
            // "text-offset": [0, -3],
            // "text-anchor": "top",
            // "text-padding": 1,
            // "text-max-angle": 90,
            "text-allow-overlap": true,
            // "text-size": 10,
            // "text-letter-spacing": 0.1,
            "visibility":'none'
          },
          "paint": {
            "text-halo-color": "hsl(55, 1%, 20%)",
            "text-color": "#fff",
            "text-opacity":0,
            "text-halo-width": 1,
          }
        });
        let popup = new that.mbgl.Popup({offset:15,anchor:'bottom',closeButton:false})
        map.on('mousemove',item.val,(e) => {
          map.getCanvas().style.cursor = "pointer"
          let coordinates = [e.lngLat.lng,e.lngLat.lat];
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          } 
          let name = e.features[0].properties.name
          let htmlStr = `<div style="color:#fff">${name}</div>`
          popup.setLngLat(coordinates).setHTML(htmlStr).addTo(map)
        })
        map.on('mouseleave', item.val ,(e) => {
          popup.remove()
        })
      })
    },
    //查询范围内的poi
    getCirclePoi(circleArr){
      var that = this
      var map = that.pointgrade_map
      //项目中心点坐标串，查学区使用
      let points = ''
      this.pointCenter.forEach(item=>{
        if(item){
          points += (item[0]+','+item[1]+';')
        }
      })
      let typeStr = ''
      this.poiLayers.forEach(item=>{
        typeStr += (item.val+',')
      })
      let coordStr = ''
      circleArr.forEach(item=>{
        if(item){
          item.forEach(coord=>{
            coordStr += (coord[0]+','+coord[1]+';')
          })
          coordStr += '_'
        }
      })
      let obj = {
        points:points,
        coordinates:coordStr,
        type:typeStr
      }
      isochronousApi.queryCirclePoi(obj)
      .then(res=>{
        console.log(res)
        if(res.data.code===0){
          let data = res.data.data
          for(let key in data){
            let cur = that.poiLayers.filter(item => {
              return item.val === key
            })[0]
            if(cur){
              let pointID = ['in','id']
              data[key].forEach(info=>{
                pointID.push(info.id)
              })
              let filters = JSON.parse(JSON.stringify(cur.filter))
              filters.push(pointID)
              //map.setLayoutProperty(key, 'visibility', 'visible')
              map.setFilter(key,filters)
              console.log(filters)
            }
          }
          that.layerReady = true
        }
      })
    },
    //控制poi显示
    layerControl(checked,layerName){
      let map = this.pointgrade_map
      console.log(checked,layerName)
      if(checked&&layerName===null){
        this.$message('图层未添加')
      }
      if(layerName!==null){
        if(checked){
          map.setLayoutProperty(layerName,'visibility','visible')
        }else{
          map.setLayoutProperty(layerName,'visibility','none')
        }
      }
    },
    //云图
    dataWordClound(list) {
      let data = [];
      list.forEach((item) => {
        data.push({
          name: item.itemName,
          value: item.value,
        });
      });
      var option = {
        tooltip: {
          show: true,
        },
        series: [
          {
            type: "wordCloud",
            gridSize: 6,
            sizeRange: [12, 50],
            width: 500,
            height: 500,
            textStyle: {
              normal: {
                color: function() {
                  return (
                    "rgb(" +
                    [
                      Math.round(Math.random() * 160),
                      Math.round(Math.random() * 160),
                      Math.round(Math.random() * 160),
                    ].join(",") +
                    ")"
                  );
                },
              },
              emphasis: {
                shadowBlur: 10,
                shadowColor: "#333",
              },
            },
            data: data,
          },
        ],
      };
      let myChart = this.$echarts.init(document.getElementById("word_clound"));
      myChart.setOption(option);
      console.log("1111111111");
      window.onresize = function() {
        myChart.resize();
      };
    },
    //扇形图
    dataPieChart(list) {
      let data = [];
      list.forEach((item) => {
        data.push({
          name: item.itemName,
          value: item.value,
        });
      });
      let option = {
        grid: {
          top: "45%",
          left: "5%",
          right: "5%",
          bottom: "10%",
          containLabel: true,
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} <br/> {c} ({d}%)",
        },
        series: [
          {
            type: "pie",
            radius: "70%",
            center: ["50%", "55%"],
            data: data,
            label: {
              show: true,
              formatter: (params) => {
                return params.name.length > 2
                  ? params.name.slice(0, 2) + "..."
                  : params.name;
              },
            },
            itemStyle: {
              normal: {
                shadowBlur: 200,
                shadowOffsetX: 5,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      let myChart = this.$echarts.init(document.getElementById("word_pie"));
      myChart.setOption(option);
      window.addEventListener("resize", myChart.resize);
    },
    //点地评分
    landScore(coord) {
      var that = this
      let map = this.pointgrade_map
      this.showScore = [];
      let iconArr = [
        "icon-chanye",
        "icon-shizheng",
        "icon-ziran",
        "icon-jiaoyu",
        "icon-shangye",
        "icon-jiaotong",
      ];
      let curScoreAr = that.scoreText.filter(item=>item!==null)
      if(curScoreAr.length>2){
        this.$message('最多添加三个项目')
        return
      }
      
      
      let coordStr = coord[0]+','+coord[1]
      analysistoolsApi.getLandScore(coordStr).then((res) => {
        console.log("点地评分得分", res);
        if (res.data.code === 0) {
          let list = res.data.data[0].children[0].children;
          list.forEach((item, i) => {
            item.icon = iconArr[i];
            //计算得分
            let sum = 0;
            item.children.forEach((child) => {
              child.score = JSON.parse(
                child.score ? child.score : 0
              );
              sum += JSON.parse(child.score ? child.score : 0);
            });
            item.score = sum / item.children.length
          });
          let allSum = 0;
          list.forEach((item) => {
            allSum += item.score;
          });
          let sum = JSON.parse(allSum / list.length)
          list.push({
            name: "总得分",
            score: sum,
            icon: "icon-zongfen",
          });
          console.log(list);
          let arr = that.handleScoreFormat(list);

          let nullIndex = that.scoreText.indexOf(null)
          if(that.contrastFlag){ //多点
            if(curScoreAr.length>2){
              this.$message('最多添加三个项目')
            }else{
              
              if(nullIndex===-1){
                that.scoreText.push(arr)
              }else{
                that.scoreText[nullIndex] = arr
              }
            }
          }else{ //单点
            that.scoreText = [arr]
          }
          //添加popup
          let i
          if(nullIndex!==-1){
            i=nullIndex
          }else{
            i = that.scoreText.length-1
          }
          //得分信息
          // let htmlStr = `<div class="score_box"><div class="btn_box"><span class="name">项目${i+1}</span>
          // <span class="del" onclick="delPoint(${i})">删除</span></div>`
          // arr.forEach(scoe=>{
          //   htmlStr += `<div class="score_item">
          //     <span class="label">${ scoe.name }</span>
          //     <span class="value">${ scoe.score }</span>`
          //   if(scoe.children){
          //     htmlStr += `<div class="score_ex">`
          //     scoe.children.forEach(child=>{
          //       htmlStr += `<div class="score_exitem">
          //         <span class="label">${ child.name }</span>
          //         <span class="value">${ child.score }</span>
          //       </div>`
          //     })
          //     htmlStr += `</div>`
          //   }
          //   htmlStr += `</div>`
          // })
          // htmlStr += '</div>'
          // that.popup[i].popup = new that.mbgl.Popup({offset:15,anchor:'left',closeButton:false,closeOnClick:!that.contrastFlag})
          // that.popup[i].popup.setLngLat(coord).setHTML(htmlStr).addTo(map)

          // that.$('.score_item').click(()=>{
          //   console.log(111)
          //   that.$(this).children('.score_ex').slideToggle()
          // })
          //绘制中心点
          this.drawPointMarker(coord)
        }
      });
    },
    //处理得分格式
    handleScoreFormat(arr){
      arr.forEach(item=>{
        item.score = this.changeFourDecimal(item.score)
        if(item.children){
          item.children.forEach(child=>{
            child.score = this.changeFourDecimal(child.score)
          })
        }
      })
      return arr
    },
    //取小数点后四位小数不足0补全
    changeFourDecimal(x) { 
      if (isNaN(x)) {
        alert('function:changeTwoDecimal->parameter error');
        return false;
      }
      var num = x.toString();
      let arr = num.split('.')
      if(arr[1]){
        if(arr[1].length>2){
          num = JSON.parse(num).toFixed(2)
        }else{
          while (num.split('.')[1].length < 2) {
            num += '0';
          }
        }
      }else{
        num += '.00'
      }
      //num = parseFloat(num)
      return num;
    },
    //展示的点地评分项code
    showLandScore(code) {
      if (this.showScore.indexOf(code) !== -1) {
        this.showScore = this.showScore.filter((item) => {
          return item != code;
        });
      } else {
        this.showScore.push(code);
      }
    },
    //删除添加的评分点
    deletePoint(i){
      // this.popup[i].popup.remove()
      // this.popup[i].popup = null
      this.scoreText.splice(i,1,null)
      this.pointCenter.splice(i,1,null)
      this.pointCircle.splice(i,1,null)
      this.drawPointMarker()
    },
  },
};
</script>
<style lang="scss">
@keyframes scaleOpcity{
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
.mapiso_box {
  width: 100%;
  height: 100%;
  position: relative;
  .mapboxgl-popup-content{
    background: linear-gradient(to bottom,rgba(0, 0, 0, 0.77),rgba(0, 0, 0, 0));
    max-width: 300px;
    border-top: none;
    border-bottom: none;
    border-radius: 8px;
    color: unset;
    padding: 10px 20px;
    box-shadow: none;
  }
  .mapboxgl-popup-close-button{
    top: 2px;
    font-size: 14px;
    color: #dcdcdc;
  }
  .score_box{
    animation-name: scaleOpcity;
    animation-duration: 0.5s;
    animation-timing-function: ease-in-out;
    animation-fill-mode: both;
    .btn_box{
      font-size:12px;
      user-select: none;
      .name{
        color: #fff;
        margin-right: 15px;
      }
      .detail{
        color: #e5a13c;
        margin-right: 10px;
        cursor: pointer;
      }
      .del{
        color: #f56c6c;
        cursor: pointer;
      }
    }
    
  }
  .pointgrade_map{
    width: 100%;
    height: 100%;
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
  .option_box {
    position: absolute;
    z-index: 99;
    left: 200px;
    top: 20px;
    height: 96%;
    width: 18%;
  }
  .score_type{
    position: absolute;
    z-index: 99;
    top: 10px;
    right: 60px;
    background: rgba(0,0,0,0.4);
    border-radius: 30px;
    padding: 10px 20px;
    width: fit-content;
    margin-bottom: 10px;
    .type_label{
      font-size: 14px;
      color: #e6a23c;
    }
    .el-checkbox{
      margin-right: 15px;
    }
    .el-checkbox__label{
      color: rgb(214, 214, 214);
    }
    .el-checkbox__input.is-checked+.el-checkbox__label {
      color: #409EFF !important;
    }
    .isoSetting{
      margin-top: 5px;
      padding-top: 5px;
      .el-input__inner{
        width: 100px;
        border: none;
        background: none;
        color: #b7bbc3;
      }
    }
  }
  .text_show {
    position: absolute;
    z-index: 999;
    right: 30px;
    top: 60px;
    bottom: 30px;
    overflow-y: scroll;
    .score_box{
      display: flex;
      justify-content: space-between;
      width: 100%;
      .score_head{
        margin-top: 31px;
        .head_item{
          margin-bottom: 15px;
          position: relative;
          .main_title{
            background: rgba(62, 96, 138, 0.5);
            color: #fff;
            font-size: 14px;
            cursor: pointer;
            user-select: none;
            position: relative;
            display: flex;
            align-items: center;
            padding: 0 20px;
            height: 30px;
            line-height: 30px;
          }
          .sec_title{
            margin-top: 8px;
            padding: 0 8px;
            height: 28px;
            line-height: 28px;
            background: rgba(0, 0, 0, 0.54);
            font-size: 12px;
            user-select: none;
            color: #fff;
          }
        }
      }
      .score_wrap{
        margin-left: 20px;
        .point_name{
          font-size: 14px;
          font-weight: bold;
          display: flex;
          align-items: center;
          color: #fff;
          margin-bottom: 10px;
          .img{
            width: 20px;
            margin-right: 10px;
          }
          .delete_icon{
            margin-left: 10px;
            cursor: pointer;
            font-size: 18px;
          }
          .delete_icon:hover{
            color: #F56C6C;
          }
        }
        .score_item {
          text-align: center;
          margin-bottom: 15px;
          position: relative;
          transition: all 0.8s;
          .main_score {
            background: rgba(54, 170, 96, 0.71);
            color: #fff;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            user-select: none;
            position: relative;
            height: 30px;
            line-height: 30px;
            .shadow {
              position: absolute;
              z-index: -1;
              width: 0%;
              height: 100%;
              left: 0;
              top: 0;
              background: rgba(0, 142, 224, 0.65);
              transition: all 0.5s;
            }
            .label {
              letter-spacing: 4px;
            }
            .value {
              margin-left: 10px;
              font-size: 24px;
              color: #e6a23c;
            }
          }
          .ex_score {
            overflow: hidden;
            transition: all 0.5s;
            .ex_score_item {
              margin-top: 8px;
              padding: 0 8px;
              height: 28px;
              line-height: 28px;
              background: rgba(0, 0, 0, 0.54);
              font-size: 12px;
              font-weight: bold;
              user-select: none;
              color: #fff;
              .label {
                letter-spacing: 4px;
                color: #9595f6;
              }
              .value {
                margin-left: 10px;
                font-size: 16px;
                color: #e6a23c;
              }
            }
          }
        }
      }
    }
  }
  .search_condition,
  .search_result {
    padding: 10px 20px;
    border-left: #60608e 1px solid;
    border-right: #60608e 1px solid;
    overflow: hidden;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.3);
    color: #fff;
    margin-bottom: 10px;
    .search_title {
      text-align: center;
      color: #e6a23c;
      margin-bottom: 10px;
    }
    .conditionB {
      margin: 10px 0;
    }
    .conditionC {
      display: flex;
      .sAddress {
        color: #14f4ff;
      }
    }
    .el-input__inner {
      background: none;
      color: #9595f6;
      border-color: #60608e;
    }
  }
  .search_result {
    height: 73%;
    position: relative;
    .loading {
      position: absolute;
      z-index: 99;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
    .result_warp {
      height: 94%;
      .result_box {
        height: 26%;
        overflow-y: scroll;
        .result_item {
          display: flex;
          justify-content: space-between;
        }
      }

      #word_clound,
      #word_pie {
        width: 100%;
        height: 200px;
        margin-top: 20px;
      }
    }
    .name {
      color: #9595f6;
      font-size: 14px;
      font-weight: bold;
    }
    .value_box {
      display: flex;
      align-items: center;
      margin-bottom: 6px;
      .r_value {
        color: #e4e4e4;
        margin-right: 10px;
      }
    }
  }
  .area_score {
    position: absolute;
    z-index: 99;
    right: 20px;
    top: 170px;
    padding: 20px;
    min-width: 253px;
    border-left: #60608e 1px solid;
    border-right: #60608e 1px solid;
    overflow: hidden;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.3);
    .el-tree {
      background: none;
    }
    .custom-tree-node {
      color: #fff;
    }
    .el-tree-node__content:hover {
      background-color: #44b9a3;
    }
    .el-tree--highlight-current
      .el-tree-node.is-current
      > .el-tree-node__content {
      background: none;
    }
    .score_label {
      color: #fff;
    }
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
    }
  }
}
</style>
