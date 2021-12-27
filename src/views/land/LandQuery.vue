<template>
  <div class="landQuery_wrap">
    <Map @map='getMap'/>
    <dv-border-box-12 :class="['list_mask',showList?'':'list_mask_hide']">
       <el-table 
          :data="tableData"
          style="width: 96%;margin-left:2%;margin-top:1%;background: transparent;color:white"
          :height="tableHeight"
          :cell-style="cellStyle"
          @cell-click="cellClick"
          >
          <el-table-column
            prop="address"
            label="土地位置"
            width="220">
          </el-table-column>
          <el-table-column
            prop="parcelNo"
            label="宗地编号"
            width="100"
            >
          </el-table-column>
          <el-table-column
            prop="region"
            label="城区"
            >
          </el-table-column>
          <el-table-column
            prop="landUseLabel"
            label="土地用途"
            width="120">
          </el-table-column>
          <el-table-column
            prop="landArea"
            label="用地面积">
          </el-table-column>
          <el-table-column
            prop="yjl"
            label="溢价率">
          </el-table-column>
        </el-table>
        <el-pagination
          layout="prev, pager, next"
          :page-size="9"
          :total="totalPage"
          @current-change="pageChange">
        </el-pagination>
        <div class="query_btn" @click="showForm = true">条件筛选</div>
    </dv-border-box-12>
    <dv-border-box-8 :class="['form_mask',showForm?'form_mask_active':'']">
       <el-form ref="form" :model="form" label-width="100px" :inline="true" size="small">
        <el-form-item label="土地位置">
          <el-input v-model="form.name" placeholder="位置或宗地编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="政府平台公司" >
          <el-select v-model="form.isgov" placeholder="政府平台公司" clearable>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出让方式" >
          <el-select v-model="sellTypes" placeholder="请选择出让方式" multiple :collapse-tags="true" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item,index) in sellTypeArr" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城区">
          <el-select v-model="regionnos" placeholder="请选择城区" multiple :collapse-tags="true" clearable>
            <el-option :label="item.name" :value="item.regionno" v-for="(item,index) in regionnosArr" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易状态">
          <el-select v-model="dealStates" placeholder="交易状态" multiple :collapse-tags="true" clearable>
           <el-option :label="item.label" :value="item.value" v-for="(item,index) in dealStateArr" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="板块">
          <el-select v-model="partnos" placeholder="请选择板块" multiple :collapse-tags="true" clearable>
             <el-option :label="item.name" :value="item.regionno" v-for="(item,index) in partNosArr" :key="index"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="自定义板块">
          <el-select v-model="partDefine" placeholder="请选择自定义板块" multiple :collapse-tags="true" clearable>
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="竞得人">
          <el-input v-model="form.winner" placeholder="请输入竞得人" clearable></el-input>
        </el-form-item>
         <el-form-item label="呈现项目" >
            <el-input v-model="form.presentProject" placeholder="请输入呈现项目" clearable></el-input>
        </el-form-item>
         <el-form-item label="是否呈现项目" >
          <el-select v-model="form.ifpresent" placeholder="是否呈现项目" clearable>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="是否联合拿地">
          <el-select v-model="form.ifunite" placeholder="是否联合拿地" clearable>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公告时间" >
          <el-col :span="11">
            <el-date-picker type="date" v-model="form.noticeDateStart" placeholder="开始日期" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="结束日期"  v-model="form.noticeDateEnd" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="出让时间">
          <el-col :span="11" >
              <el-date-picker type="date" v-model="form.sellDateStart" placeholder="开始日期" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">—</el-col>
          <el-col :span="11" >
              <el-date-picker type="date" v-model="form.sellDateEnd" placeholder="结束日期" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="自选区域">
          <!-- <el-col :span="5">
           <el-input v-model="form.coordinates" placeholder="按钮绘制" style="width:100%" disabled></el-input>
          </el-col> -->
          <el-col :span="7" style="color:white;font-weight:700">{{tip}}</el-col>
          <el-col :span="9" style="display:flex;justify-content:space-between">
            <el-button type="primary" @click="drawCircle">绘制圆</el-button>
            <el-button type="warning" @click="drawPolygon">多边形</el-button>
            <el-button type="danger" @click="deleteAll">清除</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="土地用途" >
          <el-select v-model="form.landUses" placeholder="土地用途" >
            <el-option :label="item.label" :value="item.value" v-for="(item,index) in landUseArr" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="submit_btn" @click="getParcelList">点击查询</div>
        </el-form-item>
      </el-form>
      <i class="iconfont icon-guanbi" @click="showForm = false"></i>
    </dv-border-box-8>
    <div class="radius_box" :style="{'left':radiusStyle.left-20 + 'px','top':radiusStyle.top + 'px','opacity':radiusStyle.opacity}">
        <el-input placeholder="半径(km)" v-model="radius" size="mini" class="radius_input" >
        </el-input>
      <el-button type="primary" size="mini" style="margin-left:6px;" @click="drawCircleHandle">绘制</el-button>
    </div>
  </div>
</template>
<script>
import Land from '../../api/Land'
import Map  from '../../components/common/map'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { CircleMode,DragCircleMode,DirectMode,SimpleSelectMode } from 'mapbox-gl-draw-circle';
export default {
  components:{
    Map 
  },
  data(){
    return{
      showForm:false,
      showList:true,
      tableData:[],
      totalPage:0,
      tableHeight:680,
      sellTypes:[],
      regionnos:[],
      dealStates:[],
      partnos:[],
      partDefine:[],
      sellTypeArr:[],
      dealStateArr:[],
      landUseArr:[],
      regionnosArr:[],
      partNosArr:[],
      MapData:[],
      form:{
        name: '',
        sellTypes: '',
        regionnos: '',
        dealStates: '',
        partnos: "",
        areaMin: "",
        areaMax: '',
        partDefine: '',
        noticeDateStart:'',
        noticeDateEnd: '',
        sellDateStart: '',
        sellDateEnd: '',
        winner: '',
        isgov: "",
        presentProject: '',
        ifpresent:'',
        ifunite:'',
        coordinates:'',
        landUses:'',
        page:1,
        limit:9
      },
      popupClick:null,
      drawimgCircle:false,
      radius:"",
      radiusStyle:{
        top:-100,
        left:0,
        opacity:0
      },
      map_draw:null,
      tip:'未绘制'
    }
  },
  watch:{
    sellTypes(newVal){this.form.sellTypes = newVal.join(',')},
    regionnos(newVal){this.form.regionnos = newVal.join(',')},
    dealStates(newVal){this.form.dealStates = newVal.join(',')},
    partnos(newVal){this.form.partnos = newVal.join(',')},
    partDefine(newVal){this.form.partDefine = newVal.join(',')}
  },
  methods:{
    deleteAll(){
      this.map.setLayoutProperty('circle','visibility','none')
      this.map_draw.deleteAll()
      this.tip="未绘制"
      this.form.coordinates=""
    },
    drawPolygon(){
      this.map.setLayoutProperty('circle','visibility','none')
      this.showList = false;
      this.drawimgCircle = false
      this.landDrawPolygon = true;
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
      this.map.getCanvas().style.cursor = 'crosshair';
      this.map_draw.changeMode('draw_polygon');
      this.tip="已绘制"
    },
  drawCircleHandle(){
    this.map.setLayoutProperty('circle','visibility','visible')
    this.drawimgCircle = false
    let map = this.map;
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
          this.form.coordinates = ret.join(';')
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
      this.tip='已绘制'
    },
    drawCircle(){
      this.map_draw.deleteAll()
      this.showList = false;
      this.landDrawPolygon = false
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
      let map = this.map
      map.on('click',e=>{
        if(this.drawimgCircle){
          this.radiusStyle.left = e.point.x;
          this.radiusStyle.top = e.point.y;
          this.radiusStyle.opacity = 1;
          this.circlePoint = e.lngLat
        }
      })
    },
    getMap(map){
      this.map = map
      map.on('draw.create', (e)=> {
          this.form.coordinates = e.features[0].geometry.coordinates[0].join(';')
          this.tip="已绘制"
          this.drawMarker.remove()
          this.drawMarker = null
          map.getCanvas().style.cursor = 'default'
      });
      map.on('draw.update', (e)=> {
          this.form.coordinates = e.features[0].geometry.coordinates[0].join(';')
           console.log(this.coordinates)
      });
      map.on('draw.delete', (e)=> {
          this.form.coordinates = e.features[0].geometry.coordinates[0].join(';')
          this.tip="未绘制"
      });
      map.on('mousemove', (e)=> {
        if(this.drawMarker){
           let coord = [e.lngLat.lng,e.lngLat.lat]
           this.drawMarker.setLngLat(coord).addTo(map)
        }
      });
    },
    pageChange(i){
      this.form.page = i
      Land.getParcelList(this.form).then(res=>{
         this.tableData = res.data.data.list
      })
    },
    cellStyle(row, column, rowIndex, columnIndex){
      if(row.column.label === '土地位置'){
        return 'color:#fcbf49;font-weight:700;cursor:pointer'
      }
    },
    cellClick(row, column, cell, event){
      this.setPointLayer(row.coordinate.split(','))
      let map = this.map
      this.popupClick.remove()
      this.popupClick = new this.mbgl.Popup({
        offset:15,
        anchor:'left',
        closeButton:true,
        closeOnClick:true
      })
      map.flyTo({
            center:[row.coordinate.split(',')[0]-0.1,row.coordinate.split(',')[1]], //偏移一点配合样式
            speed:0.5
        })
     
      Land.getParcelInfo(row.id).then(res=>{
            if(res.data.code===0){
              let data = res.data.data
              var htmlInfo = `<div class="land_infoWrap">
            <svg width="220" height="535" class="dv-border-svg-container"><defs><filter id="borderr-box-12-filterId-cbe1d9dd97ac4903a5a401b61ed19efb" height="150%" width="150%" x="-25%" y="-25%"><feMorphology operator="dilate" radius="1" in="SourceAlpha" result="thicken"></feMorphology><feGaussianBlur in="thicken" stdDeviation="2" result="blurred"></feGaussianBlur><feFlood flood-color="rgba(124,231,253,0.7)" result="glowColor"><animate attributeName="flood-color" values="
              rgba(124,231,253,0.7);
              rgba(124,231,253,0.3);
              rgba(124,231,253,0.7);
            " dur="3s" begin="0s" repeatCount="indefinite"></animate></feFlood><feComposite in="glowColor" in2="blurred" operator="in" result="softGlowColored"></feComposite><feMerge><feMergeNode in="softGlowColored"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter></defs><path fill="transparent" stroke-width="2" stroke="#2e6099" d="
        M15 5 L 205 5 Q 215 5, 215 15
        L 215 520 Q 215 530, 205 530
        L 15, 530 Q 5 530 5 520 L 5 15
        Q 5 5 15 5
      "></path><path stroke-width="2" fill="transparent" stroke-linecap="round" filter="url(#borderr-box-12-filterId-cbe1d9dd97ac4903a5a401b61ed19efb)" d="M 20 5 L 15 5 Q 5 5 5 15 L 5 20" stroke="#7ce7fd"></path><path stroke-width="2" fill="transparent" stroke-linecap="round" filter="url(#borderr-box-12-filterId-cbe1d9dd97ac4903a5a401b61ed19efb)" d="M 200 5 L 205 5 Q 215 5 215 15 L 215 20" stroke="#7ce7fd"></path><path stroke-width="2" fill="transparent" stroke-linecap="round" filter="url(#borderr-box-12-filterId-cbe1d9dd97ac4903a5a401b61ed19efb)" d="
        M 200 530 L 205 530
        Q 215 530 215 520
        L 215 515
      " stroke="#7ce7fd"></path><path stroke-width="2" fill="transparent" stroke-linecap="round" filter="url(#borderr-box-12-filterId-cbe1d9dd97ac4903a5a401b61ed19efb)" d="
        M 20 530 L 15 530
        Q 5 530 5 520
        L 5 515
      " stroke="#7ce7fd"></path></svg>
                <div class="info_content">
                 <div class="info_head">${data.address}</div>
                  <div class="info">宗地编号：<span class="val">${data.parcelNo}</span></div>
                  <div class="info">城区：<span class="val">${data.region}</span></div>
                  <div class="info">板块：<span class="val">${data.partname}</span></div>
                  <div class="info">方位：<span class="val">${data.region}</span></div>
                  <div class="info">片区：<span class="val">${data.district}</span></div>
                  <div class="info">公告单位：<span class="val">${data.noticeOrg}</span></div>
                  <div class="info">公告媒体：<span class="val">${data.noticeMedia}</span></div>
                  <div class="info">公告时间：<span class="val">${data.noticeDate}</span></div>
                  <div class="info">出让方式：<span class="val">${data.sellTypeLabel}</span></div>
                  <div class="info">出让时间：<span class="val">${data.sellDate}</span></div>
                  <div class="info">净用地面积：<span class="val">${data.areaMu}</span>亩</div>
                  <div class="info">净用地面积：<span class="val">${data.landArea}</span>㎡</div>
                  <div class="info">土地用途分类：<span class="val">${data.landUseType}</span></div>
                  <div class="info">土地用途：<span class="val">${data.landUseLabel}</span></div>
                  <div class="info">使用年限：<span class="val">${data.serviceLife}</span></div>
                  <div class="info">计算容积率：<span class="val">${data.computeRatio}</span></div>
                  <div class="info">可开发体量：<span class="val">${data.devVolume}</span></div>
                  <div class="info">起拍单价：<span class="val">${data.startPrice}</span></div>
                  <div class="info">起拍总价：<span class="val">${data.startSum}</span></div>
                  <div class="info">其实楼面地价：<span class="val">${data.floorPrice}</span></div>
                  <div class="info">保证金：<span class="val">${data.deposit}</span></div>
                  <div class="info">容积率：<span class="val">${data.volumeRatio}</span></div>
                  <div class="info">建筑密度：<span class="val">${data.buildingDensity}</span></div>
                  <div class="info">绿化率：<span class="val">${data.greenDensity}</span></div>
                </div>
              </div>`
              this.popupClick.setLngLat(row.coordinate.split(',')).setHTML(htmlInfo).addTo(map);
            }
          })
    },
    onSubmit(){
      Land.getParcelList(this.form).then(res=>{
        this.totalPage = res.data.data.total
        this.tableData = res.data.data.list
        this.showForm = false
      })
    },
    getParcelList(){
      this.showList = true
      Land.getParcelList(this.form).then(res=>{
        this.totalPage = res.data.data.total
        this.tableData = res.data.data.list
     })
      this.showForm = false
      let obj = JSON.parse(JSON.stringify(this.form))
      obj.page = ''
      obj.limit = ''
      Land.getParcelList(obj).then(res=>{
          this.MapData = res.data.data
          this.$nextTick(_=>{
            setTimeout(_=>{
              this.setLandLayer(res.data.data)
            },300)
          })
      })
    },
    setPointLayer(point){
      let map = this.map;
      var size= 100;
      let source = map.getSource('pointSource')
      if(source === undefined){
       var pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        onAdd: function() {
          var canvas = document.createElement("canvas");
          canvas.width = this.width;
          canvas.height = this.height;
          this.context = canvas.getContext("2d");
        },
        render: function() {
          var duration = 1000;
          var t = (performance.now() % duration) / duration;

          var radius = (size / 2) * 0.3;
          var outerRadius = (size / 2) * 0.7 * t + radius;
          var context = this.context;

          // draw outer circle
          context.clearRect(0, 0, this.width, this.height);
          context.beginPath();
          context.arc(
              this.width / 2,
              this.height / 2,
              outerRadius,
              0,
              Math.PI * 2
          );
          context.fillStyle = "rgba(255, 200, 200," + (1 - t) + ")";
          context.fill();

          // draw inner circle
          context.beginPath();
          context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
          context.fillStyle = "rgba(255, 100, 100, 1)";
          context.strokeStyle = "white";
          context.lineWidth = 2 + 4 * (1 - t);
          context.fill();
          context.stroke();

          // update this image's data with data from the canvas
          this.data = context.getImageData(0, 0, this.width, this.height).data;

          // keep the map repainting
          map.triggerRepaint();

          // return `true` to let the map know that the image was updated
          return true;
        }
      };
      map.addImage("land-dot", pulsingDot, { pixelRatio: 2 });
      map.addSource('pointSource',{
        type:'geojson',
        data:{
          type:'FeatureCollection',
          features:[{
              "type": "Feature",
              "geometry": {
                  "type": "Point",
                  "coordinates": point
              },
             
          }]
        }
      })
      map.addLayer({
            id: "land_point",
            type: "symbol",
            source: 'pointSource',
            layout: {
            "icon-image": "land-dot",
            }
         });
      }
      map.getSource('pointSource').setData({
          type:'FeatureCollection',
          features:[{
              "type": "Feature",
              "geometry": {
                  "type": "Point",
                  "coordinates": point
              },
             
          }]
        })
    },
    setLandLayer(data){
      let map = this.map
      let geojsonData = {
        type:'FeatureCollection',
        features:[]
      }
      data.forEach(item=>{
        let coordinate = item.coordinate.split(',')
        geojsonData.features.push({
          type:'Feature',
          geometry:{
            type:'Point',
            coordinates:coordinate
          },
          properties:{
            id:item.id,
            name:item.address,
            pointArr:item.coordinate.split(',')
          }
        })
      })
      let landAllSource = map.getSource('landAllSource')
      if(landAllSource==undefined){
        map.addSource('landAllSource',{
          type:'geojson',
          data:{
            type:'FeatureCollection',
            features:[]
          }
        })
        map.addLayer({
          id:'landAllPoint',
          type:'circle',
          source:'landAllSource',
          paint: {
            'circle-color': '#fcbf49',
             "circle-radius": 5,
            'circle-stroke-width': 0.2,
            'circle-stroke-color': 'white'
          }
        })
        let popup = new this.mbgl.Popup({
          offset:15,
          anchor:'left',
          closeButton:false,
          closeOnClick:false
        })
        this.popupClick = new this.mbgl.Popup({
          offset:15,
          anchor:'left',
          closeButton:true,
          closeOnClick:true
        })
        map.on('mousemove','landAllPoint',e=>{
          map.getCanvas().style.cursor = 'pointer'
          let coordinates = [e.lngLat.lng, e.lngLat.lat];
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          var name = e.features[0].properties.name;
          var htmlInfo = `<P class="item_head">${name}</p>`
          popup.setLngLat(coordinates).setHTML(htmlInfo).addTo(map);
        })
        map.on('mouseleave','landAllPoint',e=>{
          popup.remove()
          map.getCanvas().style.cursor = 'default'
        })
        map.on('click','landAllPoint',e=>{
          let pointArr = e.features[0].properties.pointArr
          this.setPointLayer(eval(pointArr))
          let coordinates = [e.lngLat.lng, e.lngLat.lat];
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
          var id = e.features[0].properties.id;
          Land.getParcelInfo(id).then(res=>{
            if(res.data.code===0){
              let data = res.data.data
              var htmlInfo = `<div class="land_infoWrap">
            <svg width="220" height="535" class="dv-border-svg-container"><defs><filter id="borderr-box-12-filterId-cbe1d9dd97ac4903a5a401b61ed19efb" height="150%" width="150%" x="-25%" y="-25%"><feMorphology operator="dilate" radius="1" in="SourceAlpha" result="thicken"></feMorphology><feGaussianBlur in="thicken" stdDeviation="2" result="blurred"></feGaussianBlur><feFlood flood-color="rgba(124,231,253,0.7)" result="glowColor"><animate attributeName="flood-color" values="
              rgba(124,231,253,0.7);
              rgba(124,231,253,0.3);
              rgba(124,231,253,0.7);
            " dur="3s" begin="0s" repeatCount="indefinite"></animate></feFlood><feComposite in="glowColor" in2="blurred" operator="in" result="softGlowColored"></feComposite><feMerge><feMergeNode in="softGlowColored"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter></defs><path fill="transparent" stroke-width="2" stroke="#2e6099" d="
        M15 5 L 205 5 Q 215 5, 215 15
        L 215 520 Q 215 530, 205 530
        L 15, 530 Q 5 530 5 520 L 5 15
        Q 5 5 15 5
      "></path><path stroke-width="2" fill="transparent" stroke-linecap="round" filter="url(#borderr-box-12-filterId-cbe1d9dd97ac4903a5a401b61ed19efb)" d="M 20 5 L 15 5 Q 5 5 5 15 L 5 20" stroke="#7ce7fd"></path><path stroke-width="2" fill="transparent" stroke-linecap="round" filter="url(#borderr-box-12-filterId-cbe1d9dd97ac4903a5a401b61ed19efb)" d="M 200 5 L 205 5 Q 215 5 215 15 L 215 20" stroke="#7ce7fd"></path><path stroke-width="2" fill="transparent" stroke-linecap="round" filter="url(#borderr-box-12-filterId-cbe1d9dd97ac4903a5a401b61ed19efb)" d="
        M 200 530 L 205 530
        Q 215 530 215 520
        L 215 515
      " stroke="#7ce7fd"></path><path stroke-width="2" fill="transparent" stroke-linecap="round" filter="url(#borderr-box-12-filterId-cbe1d9dd97ac4903a5a401b61ed19efb)" d="
        M 20 530 L 15 530
        Q 5 530 5 520
        L 5 515
      " stroke="#7ce7fd"></path></svg>
                <div class="info_content">
                 <div class="info_head">${data.address}</div>
                  <div class="info">宗地编号：<span class="val">${data.parcelNo}</span></div>
                  <div class="info">城区：<span class="val">${data.region}</span></div>
                  <div class="info">板块：<span class="val">${data.partname}</span></div>
                  <div class="info">方位：<span class="val">${data.region}</span></div>
                  <div class="info">片区：<span class="val">${data.district}</span></div>
                  <div class="info">公告单位：<span class="val">${data.noticeOrg}</span></div>
                  <div class="info">公告媒体：<span class="val">${data.noticeMedia}</span></div>
                  <div class="info">公告时间：<span class="val">${data.noticeDate}</span></div>
                  <div class="info">出让方式：<span class="val">${data.sellTypeLabel}</span></div>
                  <div class="info">出让时间：<span class="val">${data.sellDate}</span></div>
                  <div class="info">净用地面积：<span class="val">${data.areaMu}</span>亩</div>
                  <div class="info">净用地面积：<span class="val">${data.landArea}</span>㎡</div>
                  <div class="info">土地用途分类：<span class="val">${data.landUseType}</span></div>
                  <div class="info">土地用途：<span class="val">${data.landUseLabel}</span></div>
                  <div class="info">使用年限：<span class="val">${data.serviceLife}</span></div>
                  <div class="info">计算容积率：<span class="val">${data.computeRatio}</span></div>
                  <div class="info">可开发体量：<span class="val">${data.devVolume}</span></div>
                  <div class="info">起拍单价：<span class="val">${data.startPrice}</span></div>
                  <div class="info">起拍总价：<span class="val">${data.startSum}</span></div>
                  <div class="info">其实楼面地价：<span class="val">${data.floorPrice}</span></div>
                  <div class="info">保证金：<span class="val">${data.deposit}</span></div>
                  <div class="info">容积率：<span class="val">${data.volumeRatio}</span></div>
                  <div class="info">建筑密度：<span class="val">${data.buildingDensity}</span></div>
                  <div class="info">绿化率：<span class="val">${data.greenDensity}</span></div>
                </div>
              </div>`
              this.popupClick.setLngLat(coordinates).setHTML(htmlInfo).addTo(map);
            }
          })
        })
      }
      map.getSource('landAllSource').setData(geojsonData)
    }
  },
  created(){
    Land.getDict('sell_type').then(res=>this.sellTypeArr = res.data.data)
    Land.getDict('deal_state').then(res=>this.dealStateArr = res.data.data)
    Land.getDict('land_use').then(res=>this.landUseArr = res.data.data)
    Land.getRegionnos().then(res=>this.regionnosArr = res.data.data)
    Land.getPartNos().then(res=>this.partNosArr = res.data.data)
    this.tableHeight = window.innerHeight * 0.71
    this.getParcelList()
  },
  mounted(){
    setTimeout(_=>{
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
        this.map.addControl(draw,'bottom-left')
      },100)
  }
}
</script>

<style lang="scss" scoped>
.landQuery_wrap{
  height:calc(100% - 60px);
  width:100%;
  background: rgba(25,22,22,1);
  position: fixed;
  top:60px;
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
  .list_mask{
    position: absolute;
    top:5%;
    left:1.5%;
    width:37%;
    height:84%;
    background: rgba(47,62,70,.8);
    border-radius: 8px;
    transition: all 0.3s ease;
    /deep/.el-table__body-wrapper{
        &::-webkit-scrollbar{
        background-color: #212e3e !important;
        opacity: 1!important;
        height:10px;
        width: 0px;
      }
      &::-webkit-scrollbar-thumb {
          /*滚动条里面小方块*/
          border-radius: 10px;
          background-color: #02adf7;
          background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);
      }
    }
    /deep/.el-table__row{
      background: transparent;
    }
    /deep/.el-table tr{
      background-color: transparent!important;
    }
    /deep/.el-table th{
      background-color: transparent!important;
    }
    /deep/.el-table__row>td{
      border: none;
    }
    /deep/.el-table::before {
      height: 0px;
    }
    /deep/.is-leaf{
      color:white;
    }
    /deep/.el-table--enable-row-hover .el-table__body tr:hover>td{
    background-color: #212e3e !important;
    }
    .el-pagination{
      text-align: right;
      margin-right:6%;
    }
    /deep/.btn-prev{
       background: transparent;
       color:white
    }
    /deep/.btn-next{
       background: transparent;
       color:white
    }
    /deep/.el-icon-more{
      background: transparent;
      color:white;
    }
    /deep/.el-icon-d-arrow-right{
       background: transparent;
      color:white;
    }
    /deep/.el-icon-d-arrow-left{
       background: transparent;
      color:white;
    }
    /deep/.number{
      background: transparent;
      color:white
    }
    /deep/ .active{
      color:#219ebc;
    }
    .query_btn{
      color:white;
      font-size:13px;
      height:36px;
      width:100px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #1e3c72;  /* fallback for old browsers */
      background: -webkit-linear-gradient(to right, #2a5298, #1e3c72);  /* Chrome 10-25, Safari 5.1-6 */
      background: linear-gradient(to right, #2a5298, #1e3c72); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
      border-radius: 4px;
      user-select: none;
      cursor: pointer;
      position: absolute;
      right: 40px;
      bottom:-60px;
      &:active{
            opacity: 0.7;
        }
    }
    &:hover{
      .containerUp{
        display: block;
        opacity: 1;
        transition: all 0.3s ease;
      }
    }
  }
  .list_mask_hide{
    left:-36.5%;
    opacity: 0;
    transition: all 0.3s ease;
  }
  .arrow_box{
    position: absolute;
    right:-8%;
    top:48%;
    width: 60px;
    height: 40px;
  }
  .containerUp {
      position: absolute;
      top:0;
      right:0;
      width: 24px;
      height: 24px;
      transform:rotate(90deg);
      z-index: 999999;
      cursor: pointer;
      display: none;
      opacity: 0;
      transition: all 0.3s ease;
      &:hover{
        display: block;
        opacity: 1;
      }
    .chevronUp {
      position: absolute;
      width: 28px;
      height: 8px;
      opacity: 0;
      transform: scale3d(0.5, 0.5, 0.5);
      animation: move 3s ease-out infinite;
      cursor: pointer;
      &:hover{
        display: block;
        opacity: 1;
      }
    }
    .chevronUp:first-child {
        animation: move 3s ease-out 1s infinite;
        &:hover{
        display: block;
        opacity: 1;
      }
        
    }
    .chevronUp:nth-child(2) {
        animation: move 3s ease-out 2s infinite;
        &:hover{
        display: block;
        opacity: 1;
      }
        
    }
    .chevronUp:before,
    .chevronUp:after {
        content: ' ';
        position: absolute;
        top: 0;
        height: 100%;
        width: 51%;
        background: #fff;
        &:hover{
        display: block;
        opacity: 1;
      }
        
    }
    .chevronUp:before {
        left: 0;
        transform: skew(0deg, 30deg);
        &:hover{
        display: block;
        opacity: 1;
      }
        
    }
    .chevronUp:after {
        right: 0;
        width: 50%;
        transform: skew(0deg, -30deg);
        &:hover{
        display: block;
        opacity: 1;
      }
    }
    @keyframes move {
        25% {
            opacity: 1;
        }
        33% {
            opacity: 1;
            transform: translateY(30px);
        }
        67% {
            opacity: 1;
            transform: translateY(40px);
        }
        100% {
            opacity: 0;
            transform: translateY(55px) scale3d(0.5, 0.5, 0.5);
        }
    }
  }
  .form_mask{
    transition: all .3s ease;
    opacity: 0;
    position: absolute;
    bottom:-60%;
    right:1.5%;
    width:55%;
    height:462px;
    background: rgba(47,62,70,.8);
    border-radius: 8px;
    overflow-y: scroll;
     &::-webkit-scrollbar{
      width:0px!important
    }
    .el-form{
      margin-top:20px;
    }
    .el-form-item{
      width: 48%;
      margin-top:3px;
      /deep/.el-form-item__label{
        color:#fcbf49;
        font-weight: 700;
      }
      /deep/.el-input__inner{
        padding-right:30px;
        background: transparent;
        color: #fcbf49;
        font-weight: 700;
      }
      /deep/.el-form-item__content{
        width:60%;
      }
      /deep/.el-select{
        width: 100%;
      }
      /deep/.el-tag{
        background:  #4B79A1;
        color:white;
      }
      .submit_btn{
        color:white;
        font-size:13px;
        height:36px;
        width:100px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #1e3c72;  /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #2a5298, #1e3c72);  /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #2a5298, #1e3c72); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        border-radius: 8px;
        user-select: none;
        cursor: pointer;
        margin-left:160px;
        &:active{
              opacity: 0.7;
          }
      }
    }
    .icon-guanbi{
      color:white;
      position: absolute;
      right:15px;;
      top:-5px;
      cursor: pointer;
      color:white;
      font-size:20px;
      z-index: 21;
      &:hover{
          transform: rotate(180deg);
          transition: all 0.3s ease;
      }
    }
  }
  .form_mask_active{
    bottom:11%;
    transition: all .3s ease;
    opacity: 1;
  }
  /deep/.mapboxgl-popup-content>.item_head{
    background: rgba(47,62,70,.5);
    border-radius: 6px;
    padding: 10px 20px;
  }
  /deep/.mapboxgl-popup-content{
    background: transparent;
    color:white;
    .land_infoWrap{
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(47,62,70,0.9);
      .info_content{
        position: absolute;
        top:20px;
        width:80%;
        .info_head{
          font-weight: 700;
          color:#fcbf49;
          font-size:13px;
        }
      }
    }
    .mapboxgl-popup-close-button{
      color:white;
      font-size:24px;
      &:focus{
        outline: 0!important;
      }
    }
  }
 
}
 .measure-result {
    background-color: white;
    border-radius: 3px;
    height: 16px;
    line-height: 16px;
    padding: 0 3px;
    font-size: 12px;
    box-shadow: 0 0 0 1px #ccc;
    color:white;
    &.close {
      cursor: pointer;
      width: 14px;
      height: 14px;
      line-height: 16px;
      text-align: center;
      padding: 0;
    }
  }
  /deep/.mapboxgl-marker{
    color:white;
  }
</style>