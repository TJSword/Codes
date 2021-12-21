<template>
  <div class="houseQuery_wrap">
    <Loading v-if="showLoadng" />
    <ProjectDetail :proPoi="proPoi" :proId="proId" :proTitle="proTitle" v-if="showDetail" />
    <div class="diver">查询条件</div>
    <div class="from_box">
        <el-form ref="form" :model="form"  :inline="true" size="small">
            <el-form-item >
            <el-input v-model="form.name" placeholder="请先写项目名称" clearable></el-input>
            </el-form-item>
            <el-form-item >
            <el-select v-model="regionnos" placeholder="请选择行政区" multiple :collapse-tags="true">
                <el-checkbox style="margin-left:20px;margin-top:6px;" :indeterminate="isAllRegionnos" v-model="regionnosAll" @change="regionsAllChange">全选</el-checkbox>
                <el-option :label="item.name" :value="item.id" v-for="(item,index) in regionsArr" :key="index"></el-option>
            </el-select>
            </el-form-item>
            <el-form-item>
            <el-select v-model="partnos" placeholder="请选择板块" multiple :collapse-tags="true">
                <el-checkbox style="margin-left:20px;margin-top:6px;" :indeterminate="isAllPlates" v-model="platesAll" @change="platesAllChange">全选</el-checkbox>
                <el-option :label="item.name" :value="item.id" v-for="(item,index) in partNosArr" :key="index"></el-option>
            </el-select>
        </el-form-item>
            <!-- <el-form-item >
            <el-select v-model="partdefine" placeholder="请选择自定义板块" multiple :collapse-tags="true" clearable>
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
            </el-select>
        </el-form-item> -->
            <el-form-item >
            <el-select v-model="buildForms" placeholder="建筑形态" multiple :collapse-tags="true" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item,index) in buildArr" :key="index"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item >
            <el-select v-model="propertyTypes" placeholder="物业类型" multiple :collapse-tags="true" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item,index) in propertyArr" :key="index"></el-option>
            </el-select>
        </el-form-item>
            <el-form-item>
            <el-input v-model="form.developer" placeholder="请选择开发商" clearable></el-input>
        </el-form-item>
            <el-form-item >
            <el-select v-model="saleState" placeholder="项目状态" multiple :collapse-tags="true" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item,index) in buildingState" :key="index"></el-option>
            </el-select>
        </el-form-item>
            <!-- <el-form-item label="总建筑面积(亩)">
            <el-col :span="11">
                <el-input v-model="form.totalAreaStart" placeholder="最小面积"  style="width: 100%;" clearable></el-input>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
                <el-input v-model="form.totalAreaEnd" placeholder="最大面积" style="width: 100%;" clearable></el-input>
            </el-col>
            </el-form-item> -->
            <!-- <el-form-item label="成交均价(万元/亩)" >
            <el-col :span="11">
                <el-input v-model="form.avePriceStart" placeholder="最小均价"  style="width: 100%;" clearable></el-input>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
                <el-input v-model="form.avePriceEnd" placeholder="最大均价" style="width: 100%;" clearable></el-input>
            </el-col>
            </el-form-item> -->
            <el-form-item label="自选区域">
            <!-- <el-col :span="7" style="color:white;font-weight:700">{{tip}}</el-col> -->
            <el-col :span="12" style="width:226px;display:flex;justify-content:space-between;margin-top:6px" >
                <el-button type="primary" @click="drawCircle">绘制圆</el-button>
                <el-button type="warning" @click="drawPolygon">多边形</el-button>
                <el-button type="danger" @click="deleteAll">清除</el-button>
            </el-col>
            </el-form-item>
            <el-form-item>
            <!-- <div class="submit_btn"></div> -->
            <el-button style="width:100%"  @click="getProList" type="primary">点击查询</el-button>
            </el-form-item>
            <el-form-item style="width:234px;display:flex;justify-content:space-between;margin-top:6px">
            <span style="color:white;margin-right:20px;">显示地图</span>
            <el-switch
                    v-model="showMap"
                    active-color="#fcbf49"
                    @change="showMapHandler">
                </el-switch>
                <span style="color:white;margin-left:20px;">显示图表</span>
            </el-form-item>
        </el-form>
    </div>
        <div class="radius_box" :style="{'left':radiusStyle.left-20 + 'px','top':radiusStyle.top + 'px','opacity':radiusStyle.opacity}">
            <el-input placeholder="半径(km)" v-model="radius" size="mini" class="radius_input" >
            </el-input>
        <el-button type="primary" size="mini" style="margin-left:6px;" @click="drawCircleHandle">绘制</el-button>
    </div>
    <!-- @row-click="rowClick" -->
    <div :class="['list_mask',showMap?'list_mask_hide':'']">
        <el-table 
          :data="tableData"
          style="width: 94%;margin-left:3%;margin-top:2%;background: transparent;color:white"
          :height="tableHeight"
          :cell-style="cellStyle"
          @cell-click="cellClick"
          >
          <el-table-column
            prop="name"
            label="项目名称"
           >
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
            label="物业类型">
          </el-table-column>
          <el-table-column
            prop="buildArea"
            label="总建筑面积">
          </el-table-column>
          <el-table-column
            prop="developer"
            label="开发商">
          </el-table-column>
        </el-table>
        <el-pagination
          layout="prev, pager, next"
          :page-size="form.limit"
          :total="totalPage"
          @current-change="pageChange">
        </el-pagination> 
        <!-- <div class="query_btn" @click="showForm = true">条件筛选</div> -->
      </div>
  </div>
</template>

<script>
import House from "@/api/houseDataApi.js"
import { mapGetters } from "vuex"
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { CircleMode,DragCircleMode,DirectMode,SimpleSelectMode } from 'mapbox-gl-draw-circle';
import Loading from "@/components/tools/loading.vue"
import ProjectDetail from "./ProjectDetail.vue"
export default {
    components:{
        Loading,ProjectDetail
    },
    data(){
        return{
          showForm:false,
          showLoadng:false,
          totalPage:0,
          pagerCount:4,
          tableData: [],
          showMap:false,
          regionnosAll:false,
          form: {
                name: '',
                regionnos: "",
                partnos: "",
                partdefine: "",
                buildForms:"",
                propertyTypes: "house",
                developer: "",
                saleState: "",
                totalAreaStart:'',
                totalAreaEnd:'',
                avePriceStart:'',
                avePriceEnd:'',
                coordinates:'',
                page:1,
                limit:15,
          },
          tip:'未绘制',
          regionsArr:[],
          partNosArr:[],
          buildArr:[],
          propertyArr:[],
          buildingState:[],
          regionnos:[],
          partnos:[],
          partdefine:[],
          buildForms:[],
          propertyTypes:['house'],
          saleState:[],
          showDetail:false,
          radiusStyle:{
            top:-100,
            left:0,
            opacity:0
          },
          radius:'',
          popupClick:null,
          isAllRegionnos:false,
          isAllPlates:false,
          platesAll:false,
        }
        
    },
    watch:{
        regionnos(val){this.form.regionnos = val.join(',');this.isAllRegionnos = val.length >0 && val.length < this.regionsArr.length},
        partnos(val){this.form.partnos = val.join(',');this.isAllPlates = val.length >0 && val.length < this.partNosArr.length},
        buildForms(val){this.form.buildForms = val.join(',')},
        propertyTypes(val){this.form.propertyTypes = val.join(',')},
        saleState(val){this.form.saleState = val.join(',')},
        houseDataMap:{
            handler(map){
                if(map === null) return
                this.map = map
                // map.on('click','plate_fill',e=>{
                //    console.log(e.features[0].properties)
                // })
                if(this.popupClick === null){
                    this.popupClick = new this.mbgl.Popup({
                        offset:15,
                        anchor:'left',
                        closeButton:true,
                        closeOnClick:false
                    })
                }
                map.flyTo({
                    center:[104.3157969744969,30.66129397743849],
                    zoom: 8.5,
                })
                map.on('draw.create', (e)=> {
                    this.form.coordinates = e.features[0].geometry.coordinates[0].join(';')
                    this.tip="已绘制"
                    this.drawMarker.remove()
                    this.drawMarker = null
                    map.getCanvas().style.cursor = 'default'
                });
                //it's ugly but useful
                map.on('draw.update', (e)=> {
                    this.form.coordinates = e.features[0].geometry.coordinates[0].join(';')
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
                this.getProList()
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
            },
            immediate:true
        }
    },
    computed:{
        ...mapGetters(['houseDataMap'])
    },
    beforeDestroy(){
        console.log('销毁了')
        this.deleteAll()
        console.log(this.popupClick)
        this.popupClick.remove()
    },
    methods:{
        regionsAllChange(val){
            this.regionnos = val?this.regionsArr.map(item=>item.id):[]
        },
        platesAllChange(val){
            this.partnos = val?this.partNosArr.map(item=>item.id):[]
        },
        showMapHandler(val){
            console.log(val)
        },
        closeDetail(){
            this.showDetail = false
        },
        pageChange(i){
            this.form.page = i
            this.getProList()
        },
        getProList(){
            this.showLoadng = true
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
                this.showLoadng = false
            })
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
            if(column.label != '项目名称'){
                this.setPointLayer(row.coordinate.split(','))
                let map = this.houseDataMap
                // if(this.popupClick) this.popupClick.remove()
                // this.popupClick = new this.mbgl.Popup({
                //     offset:15,
                //     anchor:'left',
                //     closeButton:true,
                //     closeOnClick:true
                // })
                map.flyTo({
                    center:[row.coordinate.split(',')[0] * 1 + 0.05,row.coordinate.split(',')[1]], //偏移一点配合样式
                    speed:0.4,
                    zoom:12
                })
                House.getBasicInfo(row.id).then(res=>{
                    if(res.data.code===0){
                    let data = res.data.data.build_info
                    var htmlInfo = `<div class="house_infoWrap">
                        <div class="info_content">
                        <div class="info_head">${data.name}</div>
                            <div class="info">城区：<span class="val">${data.region}</span></div>
                            <div class="info">板块：<span class="val">${data.partname}</span></div>
                            <div class="info">占地面积：<span class="val">${data.useArea}</span></div>
                            <div class="info">总建面积：<span class="val">${data.buildArea}</span></div>
                            <div class="info">容积率：<span class="val">${data.plotRatio}</span></div>
                            <div class="info">绿化率：<span class="val">${data.greenRatio}</span></div>
                            <div class="info">物业类型：<span class="val">${data.type}</span></div>
                            <div class="info">销售状态：<span class="val">${data.saleState}</span></div>
                            <div class="info">开发商名称：<span class="val">${data.developer}</span></div>
                            <div class="info">产权年限：<span class="val">${data.rightYear}</span></div>
                            <div class="info">总户数：<span class="val">${data.houseTotal}</span></div>
                            <div class="info">楼栋总数：<span class="val">${data.floorTotal}</span></div>
                            <div class="info">停车位：<span class="val">${data.park}</span></div>
                            <div class="info">物业公司：<span class="val">${data.propertyCompany}</span></div>
                            <div class="info">物业费：<span class="val">${data.fee}</span></div>
                            <div class="info">交房时间：<span class="val">${data.subDate}</span></div>
                        </div>
                        </div>`
                    this.popupClick.setLngLat(row.coordinate.split(',')).setHTML(htmlInfo).addTo(map);
                    }
                })
            }
        },
        setPointLayer(point){
            let map = this.houseDataMap;
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
            let pointSource = map.getSource('pointSource')
            if(pointSource === undefined){
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
            }
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
        setHouseLayer(data){
            let _this = this
            let map = this.houseDataMap
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
                "circle-radius": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  9, 2,
                  16, 10
                ],
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
                // if(this.popupClick === null){
                //     this.popupClick = new this.mbgl.Popup({
                //         offset:15,
                //         anchor:'left',
                //         closeButton:true,
                //         closeOnClick:true
                //     })
                // }
                let pointArr = e.features[0].properties.pointArr
                this.setPointLayer(eval(pointArr))
                let coordinates = [e.lngLat.lng, e.lngLat.lat];
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
                var id = e.features[0].properties.id;
                House.getBasicInfo(id).then(res=>{
                    if(res.data.code===0){
                    let data = res.data.data.build_info
                    console.log(data)
                    var htmlInfo = `<div class="house_infoWrap">
                        <div class="info_content">
                        <div class="info_head">${data.name}</div>
                            <div class="info">城区：<span class="val">${data.region}</span></div>
                            <div class="info">板块：<span class="val">${data.partname}</span></div>
                            <div class="info">占地面积：<span class="val">${data.useArea}</span></div>
                            <div class="info">总建面积：<span class="val">${data.buildArea}</span></div>
                            <div class="info">容积率：<span class="val">${data.plotRatio}</span></div>
                            <div class="info">绿化率：<span class="val">${data.greenRatio}</span></div>
                            <div class="info">物业类型：<span class="val">${data.type}</span></div>
                            <div class="info">销售状态：<span class="val">${data.saleState}</span></div>
                            <div class="info">开发商名称：<span class="val">${data.developer}</span></div>
                            <div class="info">产权年限：<span class="val">${data.rightYear}</span></div>
                            <div class="info">总户数：<span class="val">${data.houseTotal}</span></div>
                            <div class="info">楼栋总数：<span class="val">${data.floorTotal}</span></div>
                            <div class="info">停车位：<span class="val">${data.park}</span></div>
                            <div class="info">物业公司：<span class="val">${data.propertyCompany}</span></div>
                            <div class="info">物业费：<span class="val">${data.fee}</span></div>
                            <div class="info">交房时间：<span class="val">${data.subDate}</span></div>
                        </div>
                        </div>`
                    this.popupClick.setLngLat(coordinates).setHTML(htmlInfo).addTo(map);
                    }
                })
            })
            }
            map.getSource('houseAllSource').setData(geojsonData)
        },
        drawCircle(){
            this.showMap = true
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
            let map = this.houseDataMap
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
            this.showMap = true
            this.houseDataMap.setLayoutProperty('circle','visibility','none')
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
            this.houseDataMap.getCanvas().style.cursor = 'crosshair';
            this.map_draw.changeMode('draw_polygon');
            this.tip="已绘制"
            },
            deleteAll(){
                this.showMap = true
                this.houseDataMap.setLayoutProperty('circle','visibility','none')
                this.map_draw.deleteAll()
                this.tip="未绘制"
                this.form.coordinates=""
                },
                drawCircleHandle(){
                let map = this.houseDataMap;
                let source = map.getSource('circle')
                if(source){
                    this.houseDataMap.setLayoutProperty('circle','visibility','visible')
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
        },
    },
    created(){
      this.tableHeight = window.innerHeight * 0.88
      House.getRegionnos().then(res=>this.regionsArr = res.data.data.searchRst)
      House.getPartNos().then(res=>this.partNosArr = res.data.data)
      House.getDict('build_form_newhouse').then(res=>this.buildArr = res.data.data)
      House.getDict('property_type_newhouse').then(res=>this.propertyArr = res.data.data)
      House.getDict('property_sales').then(res=>this.buildingState = res.data.data)
      this.getProList()
  },
  beforeDestroy(){
      this.houseDataMap.removeLayer('houseAllPoint')
      this.houseDataMap.removeSource('houseAllSource')
      this.houseDataMap.removeImage('land-dot')
      this.houseDataMap.removeLayer('house_point')
      this.houseDataMap.removeSource('pointSource')
    }
}
</script>

<style lang="scss" scoped>
.houseQuery_wrap{
    height: 820px;
    overflow-y:scroll;
    overflow:hidden;
    .diver{
        padding: 10px 20px;
        border-bottom: #464646 1px solid;
        font-size: 14px;
        color: #8bc34a;
    }
    ::v-deep .el-form{
        margin-top:10px;
        width: 90%;
        margin-left: 5%;
    }
    .from_box{
      margin-top:10px;
    //   margin-left:5%;
      width: 90%;
    }
    .el-form-item{
        width: 100%;
        margin-top:3px;
        ::v-deep .el-form-item__label{
            color:#fcbf49;
            font-weight: 700;
        }
       ::v-deep .el-input__inner{
            padding-right:30px;
            background: transparent;
            color: #fcbf49;
            font-weight: 700;
        }
        
        ::v-deep .el-form-item__content{
            width:100%;
        }
        
        ::v-deep .el-select{
            width: 100%;
        }
        
        ::v-deep .el-tag{
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
            margin-left:140px;
            &:active{
                opacity: 0.7;
            }
        }
    }
   .list_mask{
    position: fixed;
    top:0%;
    right:0%;
    width:calc(100% - 380px);
    height:100%;
    background: rgba(47,62,70,.95);
    // border-radius: 8px;
    z-index: 9;
    transition: all 0.3s ease;
    // ::v-deep .el-table__body-wrapper{
    //     &::-webkit-scrollbar{
    //     // background-color: #212e3e !important;
    //     // opacity: 1!important;
    //     // height:10px;
    //     // width: 0px;
    //   }
    //   &::-webkit-scrollbar-thumb {
    //       /*滚动条里面小方块*/
    //       border-radius: 10px;
    //       background-color: #02adf7;
    //       background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);
    //   }
    // }
    ::v-deep .el-table__row{
      background: transparent;
    }
    ::v-deep .el-table tr{
      background-color: transparent!important;
    }
    ::v-deep .el-table th{
      background-color: transparent!important;
    }
    ::v-deep .el-table__row>td{
      border: none;
    }
    ::v-deep .el-table::before {
      height: 0px;
    }
    ::v-deep .is-leaf{
      color:white;
    }
    ::v-deep .el-table--enable-row-hover .el-table__body tr:hover>td{
    background-color: #212e3e !important;
    }
    .el-pagination{
      text-align: right;
      margin-right:6%;
      margin-top:16px;
    }
    ::v-deep .btn-prev{
       background: transparent;
       color:white
    }
    ::v-deep .btn-next{
       background: transparent;
       color:white
    }
    ::v-deep .el-icon-more{
      background: transparent;
      color:white;
    }
    ::v-deep .el-icon-d-arrow-right{
       background: transparent;
      color:white;
    }
    ::v-deep .el-icon-d-arrow-left{
       background: transparent;
      color:white;
    }
    ::v-deep .number{
      background: transparent;
      color:white
    }
    ::v-deep  .active{
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
    opacity: 0;
    z-index: -99999;
    transition: all 0.3s ease;
    pointer-events: none;
  }    
}
</style>