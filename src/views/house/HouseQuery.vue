<template>
  <div class="houseQuery_wrap">
      <Map @map="getMap"></Map>
      <ProjectDetail :proPoi="proPoi" :proId="proId" :proTitle="proTitle" v-if="showDetail" />
      <dv-border-box-12 :class="['list_mask',showList?'':'list_mask_hide']">
        <el-table 
          :data="tableData"
          style="width: 96%;margin-left:2%;margin-top:1%;background: transparent;color:white"
          :height="tableHeight"
          :cell-style="cellStyle"
          @cell-click="cellClick"
          @row-click="rowClick"
          >
          <el-table-column
            prop="name"
            label="项目名称"
            width="140">
          </el-table-column>
          <el-table-column
            prop="region"
            label="城区">
          </el-table-column>
          <el-table-column
            prop="partname"
            label="板块"
            >
          </el-table-column>
          <el-table-column
            prop="type"
            label="物业类型"
            width="140">
          </el-table-column>
          <el-table-column
            prop="totalArea"
            label="总建筑面积">
          </el-table-column>
          <el-table-column
            prop="decorateSituation"
            label="装修情况">
          </el-table-column>
        </el-table>
        <el-pagination
          layout="prev, pager, next"
          :page-size="form.limit"
          :total="totalPage"
          @current-change="pageChange">
        </el-pagination>
        <div class="query_btn" @click="showForm = true">条件筛选</div>
      </dv-border-box-12>
      <dv-border-box-8  :class="['form_mask',showForm?'form_mask_active':'']">
        <el-form ref="form" :model="form" label-width="130px" :inline="true" size="small">
            <el-form-item label="项目名称">
            <el-input v-model="form.name" placeholder="请先写项目名称" clearable></el-input>
            </el-form-item>
           <el-form-item label="城区">
            <el-select v-model="regionnos" placeholder="请选择城区" multiple :collapse-tags="true" clearable>
                <el-option :label="item.name" :value="item.regionno" v-for="(item,index) in regionsArr" :key="index"></el-option>
            </el-select>
            </el-form-item>
             <el-form-item label="板块">
          <el-select v-model="partnos" placeholder="请选择板块" multiple :collapse-tags="true" clearable>
            <el-option :label="item.name" :value="item.regionno" v-for="(item,index) in partNosArr" :key="index"></el-option>
          </el-select>
        </el-form-item>
           <el-form-item label="自定义板块">
          <el-select v-model="partdefine" placeholder="请选择自定义板块" multiple :collapse-tags="true" clearable>
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
            <el-form-item label="建筑形态" >
          <el-select v-model="buildForms" placeholder="建筑形态" multiple :collapse-tags="true" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item,index) in buildArr" :key="index"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="物业类型" >
          <el-select v-model="propertyType" placeholder="物业类型" multiple :collapse-tags="true" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item,index) in propertyArr" :key="index"></el-option>
          </el-select>
        </el-form-item>
             <el-form-item label="开放商">
          <el-input v-model="form.developer" placeholder="开放商" clearable></el-input>
        </el-form-item>
            <el-form-item label="项目状态" >
          <el-select v-model="states" placeholder="项目状态" multiple :collapse-tags="true" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item,index) in buildingState" :key="index"></el-option>
          </el-select>
        </el-form-item>
            <el-form-item label="总建筑面积(亩)">
            <el-col :span="11">
               <el-input v-model="form.totalAreaStart" placeholder="最小面积"  style="width: 100%;" clearable></el-input>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
                <el-input v-model="form.totalAreaEnd" placeholder="最大面积" style="width: 100%;" clearable></el-input>
            </el-col>
            </el-form-item>
            <el-form-item label="成交均价(万元/亩)" >
            <el-col :span="11">
               <el-input v-model="form.avePriceStart" placeholder="最小面积"  style="width: 100%;" clearable></el-input>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
                <el-input v-model="form.avePriceEnd" placeholder="最大面积" style="width: 100%;" clearable></el-input>
            </el-col>
            </el-form-item>
            <el-form-item label="自选区域">
            <el-col :span="7" style="color:white;font-weight:700">{{tip}}</el-col>
            <el-col :span="9" style="display:flex;justify-content:space-between">
                <el-button type="primary" @click="drawCircle">绘制圆</el-button>
                <el-button type="warning" @click="drawPolygon">多边形</el-button>
                <el-button type="danger" @click="deleteAll">清除</el-button>
            </el-col>
            </el-form-item>
            <el-form-item>
            <div class="submit_btn" @click="getProList">点击查询</div>
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
import House from "../../api/House"
import Map from "../../components/common/map"
import ProjectDetail from "../../components/House/ProjectDetail"
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { CircleMode,DragCircleMode,DirectMode,SimpleSelectMode } from 'mapbox-gl-draw-circle';
export default {
    components:{
        Map,
        ProjectDetail
    },
    data(){
        return{
            showForm:false,
            showList:true,
            tableData:[],
            tableHeight:680,
            totalPage:0,
            form: {
                name: '',
                regionnos: "",
                partnos: "",
                partdefine: "",
                buildForms:"",
                propertyType: "",
                developer: "",
                states: "",
                totalAreaStart:'',
                totalAreaEnd:'',
                avePriceStart:'',
                avePriceEnd:'',
                coordinates:'',
                page:1,
                limit:12
            },
            regionsArr:[],
            partNosArr:[],
            buildArr:[],
            propertyArr:[],
            buildingState:[],
            regionnos:[],
            partnos:[],
            partdefine:[],
            buildForms:[],
            propertyType:[],
            states:[],
            showDetail:false,
            proId:'',
            MapData:[],
            map_draw:null,
            tip:'未绘制',
            radiusStyle:{
              top:-100,
              left:0,
              opacity:0
            },
            radius:''
        }
    },
    watch:{ 
        regionnos(newVal){this.form.regionnos = newVal.join(',')},
        partnos(newVal){this.form.partnos = newVal.join(',')},
        partdefine(newVal){this.form.partdefine = newVal.join(',')},
        buildForms(newVal){ this.form.buildForms = newVal.join(',')},
        propertyType(newVal){this.form.propertyType = newVal.join(',')},
        states(newVal){ this.form.states = newVal.join(',')}
    },
    methods:{
        getMap(map){
          this.map = map
          map.flyTo({
            center:[102.20958588574217,25.089342016906524],
            zoom: 9.2,

          })
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
        cellStyle(row, column, rowIndex, columnIndex){
            if(row.column.label === '项目名称'){
                return 'color:#fcbf49;font-weight:700;cursor:pointer'
            }
        },
        cellClick(row, column, cell, event){
           if(column.label === '项目名称'){
             this.proId = row.id
             this.proTitle = row.name
             this.proPoi = row.coordinate.split(',')
             this.showDetail = true
           }
        },
        rowClick(row, column, event){
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
              center:[row.coordinate.split(',')[0]-0.05,row.coordinate.split(',')[1]], //偏移一点配合样式
              speed:0.4,
              zoom:12
          })
        House.getBasicInfo(row.id).then(res=>{
              console.log(res.data)
              if(res.data.code===0){
                let data = res.data.data.buildingInfo
                console.log(data)
                var htmlInfo = `<div class="house_infoWrap">
         <svg width="220" height="355" class="dv-border-svg-container"><defs><filter id="borderr-box-12-filterId-4e84cc78df5d4ca8961b54959d1e2790" height="150%" width="150%" x="-25%" y="-25%"><feMorphology operator="dilate" radius="1" in="SourceAlpha" result="thicken"></feMorphology><feGaussianBlur in="thicken" stdDeviation="2" result="blurred"></feGaussianBlur><feFlood flood-color="rgba(124,231,253,0.7)" result="glowColor"><animate attributeName="flood-color" values="
              rgba(124,231,253,0.7);
              rgba(124,231,253,0.3);
              rgba(124,231,253,0.7);
            " dur="3s" begin="0s" repeatCount="indefinite"></animate></feFlood><feComposite in="glowColor" in2="blurred" operator="in" result="softGlowColored"></feComposite><feMerge><feMergeNode in="softGlowColored"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter></defs><path fill="transparent" stroke-width="2" stroke="#2e6099" d="
        M15 5 L 205 5 Q 215 5, 215 15
        L 215 340 Q 215 350, 205 350
        L 15, 350 Q 5 350 5 340 L 5 15
        Q 5 5 15 5
      "></path><path stroke-width="2" fill="transparent" stroke-linecap="round" filter="url(#borderr-box-12-filterId-4e84cc78df5d4ca8961b54959d1e2790)" d="M 20 5 L 15 5 Q 5 5 5 15 L 5 20" stroke="#7ce7fd"></path><path stroke-width="2" fill="transparent" stroke-linecap="round" filter="url(#borderr-box-12-filterId-4e84cc78df5d4ca8961b54959d1e2790)" d="M 200 5 L 205 5 Q 215 5 215 15 L 215 20" stroke="#7ce7fd"></path><path stroke-width="2" fill="transparent" stroke-linecap="round" filter="url(#borderr-box-12-filterId-4e84cc78df5d4ca8961b54959d1e2790)" d="
        M 200 350 L 205 350
        Q 215 350 215 340
        L 215 335
      " stroke="#7ce7fd"></path><path stroke-width="2" fill="transparent" stroke-linecap="round" filter="url(#borderr-box-12-filterId-4e84cc78df5d4ca8961b54959d1e2790)" d="
        M 20 350 L 15 350
        Q 5 350 5 340
        L 5 335
      " stroke="#7ce7fd"></path></svg>
                  <div class="info_content">
                  <div class="info_head">${data.name}</div>
                    <div class="info">城区：<span class="val">${data.region}</span></div>
                    <div class="info">板块：<span class="val">${data.partname}</span></div>
                    <div class="info">项目地图：<span class="val">${data.address}</span></div>
                    <div class="info">片区：<span class="val">${data.district}</span></div>
                    <div class="info">占地面积：<span class="val">${data.coverArea}万㎡</span></div>
                    <div class="info">总建面积：<span class="val">${data.totalArea}万㎡</span></div>
                    <div class="info">容积率：<span class="val">${data.plotRatio}%</span></div>
                    <div class="info">建筑密度：<span class="val">${data.buildingDensity}</span></div>
                    <div class="info">绿化率：<span class="val">${data.greenRatio}</span></div>
                    <div class="info">物业类型：<span class="val">${data.type}</span></div>
                    <div class="info">销售状态：<span class="val">${data.saleState}</span></div>
                    <div class="info">状态持续时间：<span class="val">${data.saleDate}</span></div>
                    <div class="info">开发商名称：<span class="val">${data.developer}</span></div>
                    <div class="info">关联开发企业：<span class="val">${data.releDeve}</span></div>
                  </div>
                </div>`
                this.popupClick.setLngLat(row.coordinate.split(',')).setHTML(htmlInfo).addTo(map);
              }
            })
        },
        closeDetail(){
          this.showDetail = false
        },
        pageChange(i){
            this.form.page = i
            this.getProList()
        },
        getProList(){
          House.getProList(this.form).then(res=>{
              this.tableData = res.data.data.list
              this.totalPage = res.data.data.total
              this.showForm = false
              this.showList = true
          })
          let obj = JSON.parse(JSON.stringify(this.form))
          obj.limit = ''
          obj.page = ''
          House.getProList(obj).then(res=>{
            this.MapData = res.data.data
            this.setHouseLayer(res.data.data)
         })
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
        deleteAll(){
          this.map.setLayoutProperty('circle','visibility','none')
          this.map_draw.deleteAll()
          this.tip="未绘制"
          this.form.coordinates=""
        },
         drawCircleHandle(){
           let map = this.map;
           let source = map.getSource('circle')
           if(source){
              this.map.setLayoutProperty('circle','visibility','visible')
           }
          this.drawimgCircle = false
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
      setHouseLayer(data){
        let map = this.map
        let geojsonData = {
          type:'FeatureCollection',
          features:[]
        }
        data.forEach(item=>{
          if(item.coordinate){
            let coordinate = item.coordinate.split(',')
            geojsonData.features.push({
              type:'Feature',
              geometry:{
                type:'Point',
                coordinates:coordinate
              },
              properties:{
                id:item.id,
                name:item.name,
                pointArr:item.coordinate.split(',')
              }
            })
          }
        })
        console.log(geojsonData)
        let houseAllSource = map.getSource('houseAllSource')
        if(houseAllSource==undefined){
          map.addSource('houseAllSource',{
            type:'geojson',
            data:{
              type:'FeatureCollection',
              features:[]
            }
          })
          map.addLayer({
            id:'houseAllPoint',
            type:'circle',
            source:'houseAllSource',
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
          map.on('mousemove','houseAllPoint',e=>{
            map.getCanvas().style.cursor = 'pointer'
            let coordinates = [e.lngLat.lng, e.lngLat.lat];
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            var name = e.features[0].properties.name;
            var htmlInfo = `<P class="item_head">${name}</p>`
            popup.setLngLat(coordinates).setHTML(htmlInfo).addTo(map);
          })
          map.on('mouseleave','houseAllPoint',e=>{
            popup.remove()
            map.getCanvas().style.cursor = 'default'
          })
          map.on('click','houseAllPoint',e=>{
            let pointArr = e.features[0].properties.pointArr
            this.setPointLayer(eval(pointArr))
            let coordinates = [e.lngLat.lng, e.lngLat.lat];
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            var id = e.features[0].properties.id;
            console.log(id)
            House.getBasicInfo(id).then(res=>{
              console.log(res.data)
              if(res.data.code===0){
                let data = res.data.data.buildingInfo
                console.log(data)
                var htmlInfo = `<div class="house_infoWrap">
   <svg width="220" height="355" class="dv-border-svg-container"><defs><filter id="borderr-box-12-filterId-4e84cc78df5d4ca8961b54959d1e2790" height="150%" width="150%" x="-25%" y="-25%"><feMorphology operator="dilate" radius="1" in="SourceAlpha" result="thicken"></feMorphology><feGaussianBlur in="thicken" stdDeviation="2" result="blurred"></feGaussianBlur><feFlood flood-color="rgba(124,231,253,0.7)" result="glowColor"><animate attributeName="flood-color" values="
              rgba(124,231,253,0.7);
              rgba(124,231,253,0.3);
              rgba(124,231,253,0.7);
            " dur="3s" begin="0s" repeatCount="indefinite"></animate></feFlood><feComposite in="glowColor" in2="blurred" operator="in" result="softGlowColored"></feComposite><feMerge><feMergeNode in="softGlowColored"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter></defs><path fill="transparent" stroke-width="2" stroke="#2e6099" d="
        M15 5 L 205 5 Q 215 5, 215 15
        L 215 340 Q 215 350, 205 350
        L 15, 350 Q 5 350 5 340 L 5 15
        Q 5 5 15 5
      "></path><path stroke-width="2" fill="transparent" stroke-linecap="round" filter="url(#borderr-box-12-filterId-4e84cc78df5d4ca8961b54959d1e2790)" d="M 20 5 L 15 5 Q 5 5 5 15 L 5 20" stroke="#7ce7fd"></path><path stroke-width="2" fill="transparent" stroke-linecap="round" filter="url(#borderr-box-12-filterId-4e84cc78df5d4ca8961b54959d1e2790)" d="M 200 5 L 205 5 Q 215 5 215 15 L 215 20" stroke="#7ce7fd"></path><path stroke-width="2" fill="transparent" stroke-linecap="round" filter="url(#borderr-box-12-filterId-4e84cc78df5d4ca8961b54959d1e2790)" d="
        M 200 350 L 205 350
        Q 215 350 215 340
        L 215 335
      " stroke="#7ce7fd"></path><path stroke-width="2" fill="transparent" stroke-linecap="round" filter="url(#borderr-box-12-filterId-4e84cc78df5d4ca8961b54959d1e2790)" d="
        M 20 350 L 15 350
        Q 5 350 5 340
        L 5 335
      " stroke="#7ce7fd"></path></svg>
                  <div class="info_content">
                  <div class="info_head">${data.name}</div>
                    <div class="info">城区：<span class="val">${data.region}</span></div>
                    <div class="info">板块：<span class="val">${data.partname}</span></div>
                    <div class="info">项目地图：<span class="val">${data.address}</span></div>
                    <div class="info">片区：<span class="val">${data.district}</span></div>
                    <div class="info">占地面积：<span class="val">${data.coverArea}万㎡</span></div>
                    <div class="info">总建面积：<span class="val">${data.totalArea}万㎡</span></div>
                    <div class="info">容积率：<span class="val">${data.plotRatio}%</span></div>
                    <div class="info">建筑密度：<span class="val">${data.buildingDensity}</span></div>
                    <div class="info">绿化率：<span class="val">${data.greenRatio}</span></div>
                    <div class="info">物业类型：<span class="val">${data.type}</span></div>
                    <div class="info">销售状态：<span class="val">${data.saleState}</span></div>
                    <div class="info">状态持续时间：<span class="val">${data.saleDate}</span></div>
                    <div class="info">开发商名称：<span class="val">${data.developer}</span></div>
                    <div class="info">关联开发企业：<span class="val">${data.releDeve}</span></div>
                  </div>
                </div>`
                this.popupClick.setLngLat(coordinates).setHTML(htmlInfo).addTo(map);
              }
            })
          })
        }
        map.getSource('houseAllSource').setData(geojsonData)
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
            id: "house_point",
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
    },
    created(){
        this.tableHeight = window.innerHeight * 0.71
        House.getRegionnos().then(res=>this.regionsArr = res.data.data)
        House.getPartNos().then(res=>this.partNosArr = res.data.data)
        House.getDict('build_form').then(res=>this.buildArr = res.data.data)
        House.getDict('property_type').then(res=>this.propertyArr = res.data.data)
        House.getDict('building_state').then(res=>this.buildingState = res.data.data)
        this.getProList()
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
.houseQuery_wrap{
  height:calc(100% - 60px);
  width:100%;
  background: rgba(25,22,22,1);
  position: relative;
  /deep/.mapboxgl-popup-content>.item_head{
    background: rgba(47,62,70,.5);
    border-radius: 6px;
    padding: 10px 20px;
    
  }
  /deep/.mapboxgl-popup-content{
    background: transparent;
    color:white;
    .house_infoWrap{
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
        outline:0!important;
      }
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
      margin-top:16px;
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
  }
   .list_mask_hide{
    left:-36.5%;
    opacity: 0;
    transition: all 0.3s ease;
  }
    .form_mask{
            transition: all .3s ease;
            opacity: 0;
            position: absolute;
            bottom:-60%;
            right:1.5%;
            width:55%;
            height:350px;
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
}
</style>