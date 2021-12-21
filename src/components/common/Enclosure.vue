<template>
  <!-- 围栏 -->
  <div class="enclosure_wrap">
    <!-- 围栏方式选择 -->
    <el-radio-group v-model="enclosureType" @change="enclosureTypeChange">
      <el-radio label="dsq">等时圈</el-radio>
      <el-radio label="bjy">半径圆</el-radio>
    </el-radio-group>
    <!-- 等时圈 -->
    <div class="dsq_box" v-show="enclosureType==='dsq'">
      <div class="condition">
        <label>出行方式：</label>
        <el-select v-model="curType" @change="travelTypeChange" size="mini">
          <el-option 
          v-for="(item,index) in travelType" 
          :key="index"
          :disabled="item.disabled"
          :label="item.label"
          :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="condition">
        <div>出行时间：</div>
        <el-input v-model="curTime" @blur="travelTimeChange" size="mini"></el-input>
        <div>分钟</div>
      </div>
    </div>
    <!-- 半径圆 -->
    <div class="bjy_box" v-show="enclosureType==='bjy'">
      <div class="condition">
        <div>围栏半径：</div>
        <el-input v-model="circleRadius" @blur="circleRadiusChange" size="mini"></el-input>
        <div>km</div>
      </div>
    </div>
    <div class="tip">tips:地图上选择台账绘制围栏</div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name:'isocircle',
  props:{
    startCoordinate:{ //传入的起始点坐标，格式 'lng,lat'
      type:String,
      default:''
    }
  },
  components:{},
  data(){
    return{
      accessToken:"pk.eyJ1Ijoibm9jb25yaWFuZGVyIiwiYSI6ImNrMjQ1dGNrNDIwdWMzZXVnN3VwbnV4NW4ifQ.D7k8xizdEAG4ucy3vAhNFg",
      enclosureType:'dsq',//围栏方式
      travelType:[ //出行方式数组
        {label:'驾车',value:'driving',disabled:false},
        {label:'步行',value:'walking',disabled:false},
        {label:'骑行',value:'cycling',disabled:false}
      ],
      curType:'driving',
      curTime:15,
      circleRadius:5
    }
  },
  computed:{
    ...mapGetters(["ledger_map"])
  },
  watch:{
    startCoordinate:{
      handler(val){
        console.log(val)
        if(val == ''){ return }
        if(this.enclosureType==="dsq"){ //等时圈
          this.mapboxIsoline()
        }else if(this.enclosureType==="bjy"){ //半径圆
          this.radiuCircle()
        }
        
      }
    }
  },
  methods:{
    enclosureTypeChange(val){ //围栏方式切换
      console.log(val)
      //子元素修改props 父元素传参需要加 .sync
      this.$emit('update:startCoordinate', '')
      let map = this.ledger_map
      let data = {
        type: "FeatureCollection",
        features: []
      }
      if(val==='dsq'){
        let layerFlag = map.getSource("radiusCircle")
        if(layerFlag!==undefined){
          map.getSource("radiusCircle").setData(data);
        }
      }else{
        let layerFlag = map.getSource("mapboxSoline")
        if(layerFlag!==undefined){
          map.getSource("mapboxSoline").setData(data);
        }
      }
    },
    travelTypeChange(){ //出行方式
      this.mapboxIsoline()
    },
    travelTimeChange(){ //出行时间
      this.mapboxIsoline()
    },
    circleRadiusChange(){ //半径圆
      this.radiuCircle()
    },
    mapboxIsoline(){ //mapbox等时圈
       var that = this
      let map = this.ledger_map;
      let layerFlag = map.getSource("mapboxSoline")
      if(layerFlag===undefined){
        //mapbox等时区(单层)
        map.addSource("mapboxSoline", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });
        map.addLayer({
          id: "mapboxSoline_line",
          type: "line",
          source: "mapboxSoline",
          "layout": {
            "line-join": "round",
            "line-cap": "round"
          },
          "paint": {
            "line-color":"#409EFF",
            "line-width":1,
            "line-opacity": 0.9
          }
        });
        map.addLayer({
          "id": "mapboxSoline_fill",
          "type": "fill",
          "source": "mapboxSoline",
          "layout": {
           
          },
          "paint": {
            "fill-color": "#409EFF",
            "fill-opacity": 0.1
          }
        },"ledgerPoint");
      }
      //
      let geojsonData = {
        type: "FeatureCollection",
        features: []
      }

      let url = 'https://api.mapbox.com/isochrone/v1/mapbox/'
      +this.curType+'/'+this.startCoordinate+'?contours_minutes='+this.curTime
      +'&polygons=true&access_token='+this.accessToken
      this.$.ajax({
        type : "get",
        async:false,
        url : url,
        dataType : "json",
        success : json=>{
          //console.log(json)
          this.$emit("geojson", {
            type:'dsq',
            coord:json.features[0].geometry.coordinates[0]
          });
          map.getSource("mapboxSoline").setData(json);
        },
        error:function(){
          console.log('fail');
        }
      });
    },
    radiuCircle(){ //半径圆
      var that = this
      let map = this.ledger_map;
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
            "fill-color": "#409EFF",
            "fill-opacity": 0.06
          }
        },"ledgerPoint");
        map.addLayer({
          id: "radiusCircle_line",
          type: "line",
          source: "radiusCircle",
          "layout": {},
          "paint": {
            "line-color":"#409EFF",
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
            "text-field":"半径"+that.circleRadius+"Km",
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
      
      let poins = that.startCoordinate.split(',')
      var pointsNum = 64; //点的个数
      var coords = {
        latitude: JSON.parse(poins[1]),
        longitude: JSON.parse(poins[0])
      };
      var km = that.circleRadius; //半径
      var ret = [];
      var distanceX = km/(111.320*Math.cos(coords.latitude*Math.PI/180));
      var distanceY = km/110.574;
      var theta, x, y;
      for(var i=0; i<pointsNum; i++) {
          theta = (i/pointsNum)*(2*Math.PI);
          x = distanceX*Math.cos(theta);
          y = distanceY*Math.sin(theta);
          ret.push([coords.longitude+x, coords.latitude+y]);
      }
      ret.push(ret[0]);
      geojsonData.features.push({
        "type": "Feature",
        "properties": {}, 
        "geometry": {
          "type": "Polygon",
          "coordinates": [ret],
        }
      })
      map.getSource("radiusCircle").setData(geojsonData);
      this.$emit("geojson", {
        type:'bjy',
        coord:ret
      });
    },
  }
}
</script>
<style lang="scss">
.enclosure_wrap{
  width: 100%;
  min-height: 145px;
  .condition{
    color: #fff;
    margin-top: 15px;
    display: flex;
    align-items: center;
    font-size: 13px;
    
    .el-input--mini{
      width: 145px;
    }
    .el-input__inner {
      background: none;
      color: #409eff;
      border: none;
      border-bottom: #409eff 1px solid;
      border-radius: 0;
      
    }
  }
  .tip{
    font-size: 12px;
    color: #bfbcbc;
    margin-top: 10px;
  }
}
</style>