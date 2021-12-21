<template>
  <div class="addDIY_wrap">
    <!-- 添加按钮 -->
    <div :class="['add',curAddMode!==null?'add_active':'']" :style="{right:'30px'}">
      <div class="item" v-for="item in drawType" :key="item.value" 
      @click="addModeChange(item.value)" :style="{background:curAddMode==item.value?'#fff':'#068d54'}">
        <el-tooltip effect="dark" :content="item.name" placement="top">
          <i :class="['add_icon iconfont',item.icon]" :style="{color:curAddMode==item.value?'#ff9900':'#fff'}"></i>
        </el-tooltip>
      </div>
    </div>
     <div class="radius_box" :style="{'left':radiusStyle.left-20 + 'px','top':radiusStyle.top + 'px','opacity':radiusStyle.opacity}">
        <el-input placeholder="半径(km)" v-model="radius" size="mini" class="radius_input" >
        </el-input>
      <el-button type="primary" size="mini" style="margin-left:6px;" @click="drawCircleHandle">绘制</el-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { CircleMode,DragCircleMode,DirectMode,SimpleSelectMode } from 'mapbox-gl-draw-circle';
export default {
  name: "addDIY",
  props: {},
  components: {},
  data() {
    return {
      positionX:null,
      positionY:null,
      showCreat:false,//显示创建按钮
      drawType:[ //绘制模式数组
        { name:'',value:'1',icon:'' },
        { name:'绘制多边形',value:'polygon',icon:'icon-mian' },
        { name:'绘制圆',value:'circle',icon:'icon-dian' },
        { name:'',value:'OTHER',icon:'' },
      ],
      infoBoxShow:false,//信息提交窗口
      modifyPL:false,//修改模式
      drawMarker: null, //绘制marker
      makerEl: null, //marker Dom
      curAddMode: null, //当前添加模式
      featureId:null,//绘制图形ID
      plSubrules:{ //提交校验规则
        isOpen: [ { required: true, message: '请选择', trigger: 'change' } ],
        parcelLocation: [ { required: true, message: '请输入', trigger: 'blur' } ],
      },
      plInfo:{ //提交数据
        id:null,
        kind:'',//数据类型，Point、Line、Polygon
        isOpen:'0',
        coordinates:null,//图形坐标
        parcelLocation:'',
        regionno:'',
        landCityno:'',
        lineColor:null,
        lineWidth:null,
        lineHy:null,
        remarks:null
      },
      regionArr:[],//城区数据
      freshFlag:false,//提交点线数据更新个人地图
      coordinates:'',
      radiusStyle:{
        top:-100,
        left:0,
        opacity:0
      },
      radius:''
    };
  },
  mounted() {
  },
  computed:{
    ...mapGetters(['situationMap'])
  },
  watch:{
    situationMap(val){
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
      val.addControl(draw,'bottom-left')
      val.on('draw.create', (e)=> {
          this.coordinates = e.features[0].geometry.coordinates[0].join(';')
          this.drawMarker.remove()
          this.drawMarker = null
          val.getCanvas().style.cursor = 'default'

      });
      val.on('draw.update', (e)=> {
          this.coordinates = e.features[0].geometry.coordinates[0].join(';')
      });
      val.on('draw.delete', (e)=> {
          this.coordinates = e.features[0].geometry.coordinates[0].join(';')
      });
      val.on('mousemove', (e)=> {
        if(this.drawMarker){
           let coord = [e.lngLat.lng,e.lngLat.lat]
           this.drawMarker.setLngLat(coord).addTo(val)
        }
      });
    }
  },
  methods: {
      drawCircleHandle(){
        this.drawimgCircle = false
        let map = this.situationMap;
        this.radiusStyle={
            top:-100,
            left:0,
            opacity:0
          };
          let createGeoJSONCircle =(center, radiusInKm, points)=>{
              if(!points) points = 64;
              var coords = {
                  latitude: center[1],
                  longitude: center[0]
              };
              var km = radiusInKm;

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
              console.log(ret)
              this.coordinates = ret.join(';')
              return {
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [ret]
                        }
                    }]
                }
          };
          let source = map.getSource('circle')
          if(source === undefined){
            map.addSource("circle", {
                  "type": "geojson",
                  "data": createGeoJSONCircle([this.circlePoint.lng,this.circlePoint.lat], this.radius*1)
              });
            map.addLayer({
              "id": "circle",
              "type": "line",
              "source": "circle",
              "layout": {},
              "paint": {
                  "line-color": "#fcbf49",
                  "line-opacity": 1,
                  "line-dasharray":[3,4]
              }
          });
          }
          map.getSource('circle').setData(createGeoJSONCircle([this.circlePoint.lng,this.circlePoint.lat], this.radius*1))
          this.radius = ''
          this.drawMarker.remove()
          this.drawMarker = null
      },
    addModeChange(val){
       if(val === 'polygon'){
        // this.situationMap.setLayoutProperty('circle','visibility','none')
          var ele = document.createElement('div')
          ele.setAttribute('class','measure-result')
          ele.innerHTML = '点击绘制,双击结束绘制'
          var option = {
            element:ele,
            anchor:'left',
            offset:[18,0]
          }
          var marker = new this.mbgl.Marker(option)
          this.drawMarker = marker
          this.situationMap.getCanvas().style.cursor = 'crosshair';
          this.map_draw.changeMode('draw_polygon');
      }else if(val === 'circle'){
        this.map_draw.deleteAll()
        this.drawimgCircle = true
        var ele = document.createElement('div')
        ele.setAttribute('class','measure-result')
        ele.innerHTML = '点击确定中心点'
        var option = {
          element:ele,
          anchor:'left',
          offset:[18,0]
        }
        var marker = new this.mbgl.Marker(option)
        this.drawMarker = marker
        let map = this.situationMap
        map.on('click',e=>{
          if(this.drawimgCircle){
            this.radiusStyle.left = e.point.x;
            this.radiusStyle.top = e.point.y;
            this.radiusStyle.opacity = 1;
            this.circlePoint = e.lngLat
          }
        })
      }
    }
  },
};
</script>
<style lang="scss">
$button: #5628ee;
$icons: #fff;
$plus: #fff;
.addDIY_wrap {
  position: relative;
  .sub_box{
    position: fixed;
    width: 30vw;
    left: 55%;
    top: 28%;
    z-index: 999;
    background: rgba(4, 4, 4, 0.5);
    border-radius: 4px;
    padding: 10px;
    padding: 10px;
    .sub_wrap{
      background: #fff;
      border-radius: 4px;
      padding: 1%;
      .sub_head{
        border-bottom: #e4e7ed 1px solid;
        display:flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
        padding: 5px 8px 8px 8px;
      }
      .info_form{
        width: 100%;
        overflow: scroll;
        .item{
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          .el-form-item{
            width: 49%;
            margin-bottom: 4px;
            margin-top: 5px;
          }
        }
      }
    }
  }
  .add {
    position: fixed;
    right: 60px;
    bottom: 60px;
    width: 84px;
    height: 84px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    transform: scale(0.5);
    transform-origin: 50% 50%;
    transition: transform 0.4s ease;
    cursor: pointer;
    .item {
      display: block;
      position: relative;
      width: 50%;
      padding-bottom: 50%;
      background: $button;
      -webkit-backface-visibility: hidden;
      transition: border-radius 0.3s ease, transform 0.2s ease;
      .add_icon {
        display: block;
        color: #fff;
        width: 14px;
        height: 14px;
        position: absolute;
        left: 50%;
        top: 50%;
        margin: -11px 0 0 -11px;
        opacity: 0;
        fill: $icons;
        transform: scale(0.6) rotate(-45deg);
        transition: all 0.15s ease;
        -webkit-backface-visibility: hidden;
      }
      &:nth-child(1) {
        border-radius: 8px 0 0 0;
        font-weight: bold;
      }
      &:nth-child(2) {
        border-radius: 0 0 0 8px;
      }
      &:nth-child(3) {
        border-radius: 0 8px 0 0;
      }
      &:nth-child(4) {
        border-radius: 0 0 8px 0;
      }
    }
    &:before,
    &:after {
      content: "";
      width: 28px;
      height: 6px;
      border-radius: 3px;
      background: $plus;
      position: absolute;
      left: 50%;
      top: 50%;
      display: block;
      z-index: 1;
      transform-origin: 50% 50%;
      transition: transform 0.25s ease;
    }
    &:before {
      transform: translate(-50%, -50%) scaleY(0.76);
    }
    &:after {
      transform: translate(-50%, -50%) rotate(90deg) scaleY(0.76);
    }
    &:hover {
      transform: scale(1) rotate(45deg);
      transition: transform 0.4s ease 0.1s;
      .item {
        --scale: 1;
        // pointer-events: none;
        border-radius: 50%;
        animation: pointerEvent 0s linear forwards 0.4s;
        transition: border-radius 0.15s ease 0.1s, transform 0.25s ease 0.15s;
        cursor: pointer;
        &:nth-child(1) {
          transform: translate(6px, 6px) scale(0);
        }
        &:nth-child(2) {
          transform: translate(-6px, 6px) scale(var(--scale));
        }
        &:nth-child(3) {
          transform: translate(6px, -6px) scale(var(--scale));
        }
        &:nth-child(4) {
          transform: translate(6px, 6px) scale(0);
        }
        .add_icon {
          opacity: 1;
          transition: all 0.3s ease 0.2s;
          transform: scale(1) rotate(-45deg);
        }
        &:hover {
          --scale: 0.92;
          transition: border-radius 0.2s ease 0.1s, transform 0.25s ease 0s;
        }
      }
    }
    
  }
  .add_active{
    transform: scale(1) rotate(45deg) !important;
    transition: transform 0.4s ease 0.1s !important;
    .item {
      --scale: 1 !important;
      // pointer-events: none !important;
      border-radius: 50% !important;
      animation: pointerEvent 0s linear forwards 0.4s !important;
      transition: border-radius 0.15s ease 0.1s, transform 0.25s ease 0.15s !important;
      cursor: pointer;
      &:nth-child(1) {
        transform: translate(6px, 6px) scale(0) !important;
      }
      &:nth-child(2) {
        transform: translate(-6px, 6px) scale(var(--scale)) !important;
      }
      &:nth-child(3) {
        transform: translate(6px, -6px) scale(var(--scale)) !important;
      }
      &:nth-child(4) {
        transform: translate(6px, 6px) scale(0) !important;
      }
      .add_icon {
        opacity: 1 !important;
        transition: all 0.3s ease 0.2s !important;
        transform: scale(1) rotate(-45deg) !important;
      }
      &:hover {
        --scale: 0.92 !important;
        transition: border-radius 0.2s ease 0.1s, transform 0.25s ease 0s !important;
      }
    }
  }
  @keyframes pointerEvent {
    100% {
      pointer-events: auto;
    }
  }
}
.mapbox-gl-draw_trash{
  display: none !important;
}
.radius_box{
    position: fixed;
    z-index: 6000;
    display: flex;
    align-items: center;
    transition: opacity 0.3s ease;
    .radius_input{
      width: 100px;
    }
  }
</style>