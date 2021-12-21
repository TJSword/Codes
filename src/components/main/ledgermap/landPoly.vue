<template>
  <!-- 土地聚合图层 -->
  <div class="landpoly_wrap">
    <Loading v-if="showLoading" />
  </div>
</template>
<script>
import ledgerApi from "@/api/ledgerApi";
import { mapGetters } from "vuex";
import Loading from '@/components/tools/loading'
export default {
  name: "landpoly",
  props: {
    landData: { //符合条件的土地数据
      type: Object,
      default: () => {
        return {};
      },
    }, 
    landListType:{ //当前列表类型
      type:String,
      default:'gov'
    },
    showLandAll:{ //显示隐藏所有土地
      type:Boolean,
      default:false
    },
  },
  components: {
    Loading
  },
  data() {
    return {
      mapSize: null, //地图缩放等级
      landIdArr: [], //土地ID数组
      queryIdArr: [], //已请求的ID数组
      hasQueryLandInfo: [], //已请求的土地数据
      layerIsload:false,//图层是否加载
      landDataIsload:false,//土地数据是否加载

      filterLandArr:null,
      filterFolderArr:null,
      regionList:[],//城市行政区
      cityInfos:null,//土地城市统计信息
      showLoading:false,
    };
  },
  beforeMount(){
    this.getCityRegions()
  },
  mounted() {},
  watch: {
    landData: {
      handler(newVal) {
        //重置数据
        let map = this.ledger_map
        if(this.layerIsload){
          this.hasQueryLandInfo = []
          this.setLandPolyLayer()
          map.getSource("landOutline").setData({
            type: "FeatureCollection",
            features: [],
          });
          map.getSource("landpoint_source").setData({
            type: "FeatureCollection",
            features: [],
          });
          map.getSource("points_source").setData({
            type: "FeatureCollection",
            features: [],
          });
          map.getSource("lines_source").setData({
            type: "FeatureCollection",
            features: [],
          });
          
          // let center = localStorage.getItem('cityCenter')
          // this.mapFly(center?JSON.parse(center):[104.063115,30.669457],9)
          
        }
        this.queryIdArr = []
        this.regionList.forEach(item=>{
          item.num = 0
        })
        if(this.landDataIsload){
          this.setLandPolyLayer()
          this.setLandPolyData(newVal,'change');
        }else{
          if(!this.landDataIsload&&this.mapIsload){
            this.setLandPolyLayer()
            this.setLandPolyData(newVal,'change');
            this.landDataIsload = true
          }
        }
      },
      deep: true,
    },
    mapIsload: {
      handler(newVal) {
        if (newVal) {
          //this.setLandPolyLayer();
          this.setMapEvents();
          if(!this.landDataIsload&&this.landData.land_list){
            this.setLandPolyLayer()
            this.setLandPolyData(this.landData);
            this.landDataIsload = true
          }
        }
      },
      deep: true,
    },
    cityCode:{
      handler(newVal){
        this.getCityRegions()
      },
      deep:true
    },
    cmNotice:{
      handler(newVal){
        if(newVal!=null&&this.landTypeTab=="self"){
          this.setCMData(newVal)
        }
      },
      deep:true
    },
  },
  computed: {
    ...mapGetters(["mapIsload", "ledger_map","cityCode","cmNotice","landTypeTab"]),
  },
  methods: {
    //获取城市的城区数据
    getCityRegions(){
      var that = this
      let cityCode = localStorage.getItem('cityCode')
      //根据城市获取特定顺序的行政区
      ledgerApi.getRegions({cityCode:cityCode?cityCode:'510100'})
      .then(res=>{
        if(res.data.code===0){
          that.regionList = res.data.data.searchRst
          that.regionList.forEach(item=>{
            item.num = 0
          })
          console.log(that.regionList)
        }
      })
    },
    //添加土地及统计图层
    setLandPolyLayer() {
      var that = this;
      var map = this.ledger_map;
      //添加图层
      let source = map.getSource("source_land");
      if (source === undefined) {
        map.addSource("source_land", { //土地图层
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });
        map.addLayer({
          id: "poly_land",
          type: "circle",
          source: "source_land",
          layout: {
            visibility: "visible",
          },
          paint: {
            "circle-color": "#11b4da",
            "circle-radius": 0,
            "circle-stroke-width": 0,
            "circle-stroke-color": "#fff",
          },
          minzoom:8
        });
      }
    },
    //设置土地图层数据
    setLandPolyData(data,type) {
      var that = this;
      var map = this.ledger_map;
      //土地
      let landPoints = {
        type: "FeatureCollection",
        features: [],
      };
      let landIdArr = [];
      let cityNum = 0
      data.land_list.forEach((item) => {
        //城市，城区数据统计
        cityNum += 1
        that.regionList.forEach(region=>{
          if(region.id === item.regionno){
            region.num += 1
          }
        })
        landIdArr.push(item.id);
        let outCenter;
        if (item.center) {
          outCenter = item.center.split(",");
          let obj_landpoint = {
            geometry: {
              coordinates: outCenter,
              type: "Point",
            },
            properties: {
              id: item.id, //土地ID
            },
            type: "Feature",
          };
          landPoints.features.push(obj_landpoint);
        }
      });
      that.cityInfos = {
        num: cityNum,
        name: data.landCity,
        center: data.cityCenter
      }
      map.getSource("source_land").setData(landPoints);
      if(type==='change'&&that.mapIsload&&that.layerIsload){
        that.setUnqueryLand(null,landIdArr);
      }
      that.layerIsload = true
    },
    //添加地图事件
    setMapEvents() {
      var that = this;
      let map = that.ledger_map;
      map.on("zoom", (e) => {
        that.mapSize = map.getZoom().toFixed(2);
        //设置图层
        // map.setLayoutProperty(
        //   "landOutline_fill",
        //   "visibility",
        //   that.mapSize < 10 ? "none" : "visible"
        // );
        // map.setLayoutProperty(
        //   "landOutline_line",
        //   "visibility",
        //   that.mapSize < 10 ? "none" : "visible"
        // );
        // map.setLayoutProperty(
        //   "landOutline_line_ps",
        //   "visibility",
        //   that.mapSize < 10 ? "none" : "visible"
        // );
        // map.setLayoutProperty(
        //   "landpoint_label",
        //   "visibility",
        //   that.mapSize < 10 ? "none" : "visible"
        // );
        // map.setLayoutProperty(
        //   "layer_point",
        //   "visibility",
        //   that.mapSize < 10 ? "none" : "visible"
        // );
        // map.setLayoutProperty(
        //   "layer_line",
        //   "visibility",
        //   that.mapSize < 10 ? "none" : "visible"
        // );
        // map.setLayoutProperty(
        //   "layer_line_symbol",
        //   "visibility",
        //   that.mapSize < 10 ? "none" : "visible"
        // );
      });
      map.on("zoomend", (e) => {
        if (that.mapSize > 8) {
          if(that.filterLandArr==null&&that.filterFolderArr==null){
            return
          }
          let areaLandFeatrues = map.queryRenderedFeatures({
            layers: ["poly_land"],
          });
          that.setUnqueryLand(areaLandFeatrues);
        }
      });
      map.on("moveend", (e) => {
        if (that.mapSize > 8) {
          if(!that.showLandAll){
            return
          }
          let areaLandFeatrues = map.queryRenderedFeatures({
            layers: ["poly_land"],
          });
          that.setUnqueryLand(areaLandFeatrues);
        }
      });
    },
    //新建或修改数据
    setCMData(info){
      var that = this
      if(info.type=="delete"){
        that.hasQueryLandInfo = that.hasQueryLandInfo.filter(item=>{
          return item.id !== info.id
        })
        that.setLandLayer();
        // if(info.kind=="POLYGON"){
        //   that.ledger_map.removeFeatureState(info.id,'landOutline')
        // }
        that.$store.dispatch('setCmNotice',null)
      }else{
        ledgerApi.getIdlandsInfo({ ids: [info.id] ,datatype:that.landListType}).then((res) => {
          if (res.data.code === 0) {
            let data = res.data.data;
            if (data.length > 0) {
              let arr = []
              data.forEach((item) => {
                arr.push({
                  kind: item.kind, //图形类型
                  id: item.id, //土地ID
                  center: item.center,
                  coordinates: item.coordinates,
                  isself: item.isself ? "1" : "0", //是否为自己创建的土地
                  isGov: item.isGov, //是否为公共土地
                  isOpen: item.isOpen, //是否公开
                  purpose: item.purpose, //用地性质
                  state: item.state, //交易状态
                  fillColor: item.fillColor, //填充颜色
                  fillHy: item.fillHy, //填充透明度
                  lineColor: item.lineColor, //描边颜色
                  lineHy: item.lineHy, //描边透明度
                  lineWidth: item.lineWidth, //描边宽度
                  name: item.name, //宗地名称
                  landNumber: item.landNumber, //宗地编号
                  buildingName: item.buildingName, //关联项目名
                  recordName: item.recordName==''?null:item.recordName, //备案名
                  parcelLocation: item.parcelLocation,
                  code: item.code,
                });
              });
              if(info.type=="create"){ //新建
                that.hasQueryLandInfo.push(arr[0])
              }else if(info.type=="modify"){
                that.hasQueryLandInfo.forEach((item,i)=>{
                  if(item.id==info.id){
                    that.hasQueryLandInfo[i] = arr[0]
                  }
                })
              }
              that.setLandLayer();
              that.$store.dispatch('setCmNotice',null)
            }else{
              that.$message.error(res.data.msg)
              that.$store.dispatch('setCmNotice',null)
            }
          }
        });
      }
    },
    //设置还未查询详细信息的土地数据
    setUnqueryLand(data,ids) {
      var that = this;
      let arr = [];
      if(ids){
        ids.forEach((item) => {
          if (!that.queryIdArr.includes(item)) {
            that.queryIdArr.push(item);
            arr.push(item);
          }
        });
      }else{
        data.forEach((item) => {
          let id = item.properties.id;
          if (!that.queryIdArr.includes(id)) {
            that.queryIdArr.push(id);
            arr.push(id);
          }
        });
      }
      console.log("要设置图层数据的ID", arr);
      if (arr.length === 0) {
        return false;
      }
      //请求数据，获取为请求土地的轮廓
      that.showLoading = true
      ledgerApi.getIdlandsInfo({ ids:arr ,datatype:that.landListType}).then((res) => {
        if (res.data.code === 0) {
          console.log(res);
          let data = res.data.data;
          if (data.length > 0) {
            data.forEach((item) => {
              that.hasQueryLandInfo.push({
                kind: item.kind, //图形类型
                id: item.id, //土地ID
                center: item.center,
                coordinates: item.coordinates,
                isself: item.isself ? "1" : "0", //是否为自己创建的土地
                isGov: item.isGov, //是否为公共土地
                isOpen: item.isOpen, //是否公开
                purpose: item.purpose, //用地性质
                state: item.state, //交易状态
                fillColor: item.fillColor, //填充颜色
                fillHy: item.fillHy, //填充透明度
                lineColor: item.lineColor, //描边颜色
                lineHy: item.lineHy, //描边透明度
                lineWidth: item.lineWidth, //描边宽度
                name: item.name, //宗地名称
                landNumber: item.landNumber, //宗地编号
                buildingName: item.buildingName, //关联项目名
                recordName: item.recordName==''?null:item.recordName, //备案名
                nickName: item.nickName,//已成交为关联项目=>交易时间+竞得者简称+出让面积（亩）
                parcelLocation: item.parcelLocation,
                code: item.code,
              });
            });
            that.setLandLayer();
          }
          that.showLoading = false
        }else{
          that.$message.error(res.data.msg)
          that.showLoading = false
        }
      });
    },
    //更新土地图层数据
    setLandLayer() {
      var that = this;
      var map = this.ledger_map;
      //添加图层数据
      let arr_land = [];
      let arr_landpoint = [];
      let arr_points = [];
      let arr_lines = [];
      let data = that.hasQueryLandInfo;

      let noSupply = []
      if(that.filterFolderArr){
        noSupply = that.filterFolderArr.filter(item => item!=='supply')
      }
      if(that.filterFolderArr){ //此处处理 其他 包含流拍、终止、其他，但筛选只包含other 补充streaming、termination
        that.filterFolderArr.forEach(item=>{
          if(item.indexOf('other')!==-1){
            let streaming = item.replace(/other/,'streaming')
            let termination = item.replace(/other/,'termination')
            that.filterFolderArr.unshift(streaming,termination)
          }
        })
      }
      data.forEach((item) => {
        if(that.filterLandArr||that.filterFolderArr){
          let idflag,codeflag
          idflag = that.filterLandArr?that.filterLandArr.includes(item.id):false
          if(!idflag&&item.code){ //土地ID匹配后不需要通过code匹配
            if(item.state==='supply_cls'){ //集中公告supply_cls与计划supply的字典值冲突，此处判断为集中公告时把计划supply抛除掉
              codeflag = that.filterFolderArr?noSupply.some(a => item.code.indexOf(a)!==-1):false
            }else{
              codeflag = that.filterFolderArr?that.filterFolderArr.some(a => item.code.indexOf(a)!==-1):false
            }
          }
          if(idflag||codeflag){
            if(item.kind=="POLYGON"){ //土地面
              //土地点
              if (item.center) {
                let feature = that.setFeature(item,"POINT")
                arr_landpoint.push(feature);
              }
              //土地轮廓
              if (item.coordinates) {
                let feature = that.setFeature(item,"POLYGON")
                arr_land.push(feature);
              }
            }else if(item.kind=="LINE"){ //线
              if (item.coordinates) {
                let feature = that.setFeature(item,"LINE")
                arr_lines.push(feature);
              }
            }else if(item.kind=="POINT"){ //点
              if (item.center) {
                let feature = that.setFeature(item,"POINT")
                arr_points.push(feature);
              }
            }
          }
        }else{
          if(item.kind=="POLYGON"){ //土地面
            //土地点
            if (item.center) {
              let feature = that.setFeature(item,"POINT")
              arr_landpoint.push(feature);
            }
            //土地轮廓
            if (item.coordinates) {
              let feature = that.setFeature(item,"POLYGON")
              arr_land.push(feature);
            }
          }else if(item.kind=="LINE"){ //线
            if (item.coordinates) {
              let feature = that.setFeature(item,"LINE")
              arr_lines.push(feature);
            }
          }else if(item.kind=="POINT"){ //点
            if (item.center) {
              let feature = that.setFeature(item,"POINT")
              arr_points.push(feature);
            }
          }
        }
      });
      var geojson_land = {
        type: "FeatureCollection",
        features: arr_land,
      };
      var geojson_landpoint = {
        type: "FeatureCollection",
        features: arr_landpoint,
      };
      var geojson_points = {
        type: "FeatureCollection",
        features: arr_points,
      };
      var geojson_lines = {
        type: "FeatureCollection",
        features: arr_lines,
      };
      map.getSource("landOutline").setData(geojson_land);
      map.getSource("landpoint_source").setData(geojson_landpoint);
      map.getSource("points_source").setData(geojson_points);
      map.getSource("lines_source").setData(geojson_lines);

      that.landSetfilter();
    },
    setFeature(item,type){
      let obj = {
        id:item.id,
        geometry: {
          coordinates: [],
          type: "",
        },
        properties: {
          // kind:item.kind,
          // id: item.id, //土地ID
          // isself: item.isself ? "1" : "0", //是否为自己创建的土地
          // isGov: item.isGov, //是否为公共土地
          // isOpen: item.isOpen, //是否公开
          // purpose: item.purpose, //用地性质
          // state: item.state, //交易状态
          // fillColor: item.fillColor, //填充颜色
          // fillHy: item.fillHy, //填充透明度
          // lineColor: item.lineColor, //描边颜色
          // lineHy: item.lineHy, //描边透明度
          // lineWidth: item.lineWidth, //描边宽度
          // name: item.name, //宗地名称
          // landNumber: item.landNumber, //宗地编号
          // parcelLocation: item.parcelLocation,
          // code: item.code,
        },
        type: "Feature",
      }
      if(type=="POLYGON"||type=="LINE"){
        let outlineStr = item.coordinates.split(";");
        let outlineArr = [];
        outlineStr.forEach((str) => {
          let coord = str.split(",");
          if(coord.length>1){
            outlineArr.push([JSON.parse(coord[0]).toFixed(6),JSON.parse(coord[1]).toFixed(6)]);
          }
          
        });
        //outlineArr.pop();
        obj.geometry.type = type=="POLYGON"?"Polygon":"LineString"
        obj.geometry.coordinates = type=="POLYGON"?[outlineArr]:outlineArr
        
        if(type=="POLYGON"){
          obj.properties = {
            kind:item.kind,
            id: item.id, //土地ID
            purpose: item.purpose, //用地性质
            state: item.state, //交易状态
            fillColor: item.fillColor, //填充颜色
            lineColor: item.lineColor, //描边颜色
            lineHy: item.lineHy, //描边透明度
            lineWidth: item.lineWidth, //描边宽度
            fillHy: item.fillHy, //填充透明度
            code: item.code,
            center: item.center,
          }
        }else{
          obj.properties = {
            kind:item.kind,
            id: item.id, //土地ID
            lineColor: item.lineColor, //描边颜色
            lineHy: item.lineHy, //描边透明度
            lineWidth: item.lineWidth, //描边宽度
            landNumber: item.landNumber, //宗地编号
            buildingName: item.buildingName, //关联项目名
            recordName: item.recordName, //备案名
            nickName:item.nickName,
            parcelLocation: item.parcelLocation,
            code: item.code,
          }
        }
        
      }else if(type=="POINT"){
        let centerCoord = item.center.split(",");
        obj.geometry.type = "Point"
        obj.geometry.coordinates = centerCoord

        obj.properties = {
          kind:item.kind,
          id: item.id, //土地ID
          landNumber: item.landNumber, //宗地编号
          buildingName: item.buildingName, //关联项目名
          recordName: item.recordName, //备案名
          nickName:item.nickName,
          parcelLocation: item.parcelLocation,
          state:item.state,
          code: item.code,
          center:item.center
        }
      }
      return obj
    },
    //土地默认筛选
    landSetfilter() {
      let filter = ["has", "id"];
      let filterLine = [
        "all",
        ["has", "id"],
        [
          "in",
          "state",
          "announcement",
          "supply_cls",
          "traded",
          "streaming",
          "termination",
          "other"
        ],
      ];
      let filterLinePs = [
        "all",
        ["has", "id"],
        ["in", "state", "plan","plan_focus","supply"],
      ];
      var map = this.ledger_map;
      map.setFilter("landOutline_fill", filter);
      map.setFilter("landOutline_line", filterLine);
      map.setFilter("landOutline_line_ps", filterLinePs);
      map.setFilter("landpoint_label", ['!in','state','plan']);
    },
    //地图飞行
    mapFly(center,zoom){
      let map = this.ledger_map
      map.flyTo({
        center:center,
        zoom:zoom,
      })
    },
    //控制图层显示(父组件传递的方法)
    controlLayer(landArr,folderArr){
      console.log(landArr,folderArr)
      this.filterLandArr = landArr
      this.filterFolderArr = folderArr
      this.setLandLayer()
      //this.updateNumLayer()
    },
    //统计数量图层更新
    updateNumLayer(){
      var that = this
      var map = that.ledger_map
      this.regionList.forEach(item=>{
        item.num = 0
      })
      let cityNum = 0
      this.landData.land_list.forEach(item=>{
        if(that.filterLandArr||that.filterFolderArr){
          let idflag,codeflag
          idflag = that.filterLandArr?that.filterLandArr.includes(item.id):false
          if(!idflag&&item.code){ //土地ID匹配后不需要通过code匹配
            codeflag = that.filterFolderArr?that.filterFolderArr.some(a => item.code.indexOf(a)!==-1):false
          }
          if(idflag||codeflag){
            cityNum += 1
            that.regionList.forEach(region=>{
              if(region.id === item.regionno){
                region.num += 1
              }
            })
          }
        }else{
          cityNum += 1
          that.regionList.forEach(region=>{
            if(region.id === item.regionno){
              region.num += 1
            }
          })
        }
      })
      
    },
  },
};
</script>