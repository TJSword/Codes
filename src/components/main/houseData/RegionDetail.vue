<template>
    <dv-border-box-8 class="regionDetail_wrap">
        <i class="iconfont icon-guanbi" @click="close"></i>
        <Map :id="'regionDetailMap'" @map="getMap" />
        <dv-border-box-12 class="echarts_mask" v-if="this.form.type === 'WD'">
            <div id="charts"></div>
        </dv-border-box-12>
    </dv-border-box-8>
</template>
<script>
import Map from "./bgMap.vue"
import House from "../../../api/houseDataApi"
export default {
    props:['form'],
    components:{
        Map
    },
    methods:{
        getMap(map){
            this.map = map
        },
        close(){
            this.$emit('closeWindow',false)
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
                console.log(e.features[0].properties)
                let pointArr = e.features[0].properties.pointArr
                this.setPointLayer(eval(pointArr))
                let coordinates = [e.lngLat.lng, e.lngLat.lat];
                console.log(coordinates)
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
                let id = e.features[0].properties.id;
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
        hotSort(key){
            let data = this.regionData
            let arr = ["match", ["get", "id"]]
            let colors =  ['#f07605', '#f27a11', '#f27e18', '#f58320', '#f58625', '#f7862a', '#f78b31', '#f78d36', '#fa913c', '#fa9441', '#fc9e4c', '#fc9e4c', '#fca253', '#ffa759', '#ffa95e', '#ffac63', '#ffb06b', '#ffb370', '#ffb875', '#ffbc7d', '#ffbe82', '#ffc48a', '#ffc78f', '#ffcb96', '#ffcf9c', '#ffd3a3', '#ffd7a8', '#ffdab0', '#ffdfb8', '#ffe2bd', '#ffe7c4', '#ffebcc']
            if(data.length === 0){
               // this.houseDataMap.setPaintProperty('houseAllPoint',"circle-color", 'rgba(0,0,0,0)')
                return
            }
            let max = Math.max(... data.map(item=>item[key]))
            let min = Math.min(... data.map(item=>item[key]))
            let diff = (max-min) / 32
            data.forEach(item=>{
                arr.push(item.id)
                let i = Math.floor((max-item[key]) / diff)
                if(i > 31) i = 31
                arr.push(colors[i])
            })
            arr.push('rgba(0,0,0,0)')
            console.log(arr)
            setTimeout(_=>{
                this.map.setPaintProperty('houseAllPoint',"circle-color", arr)
            },600)
        }
    },
    created(){
        this.popupClick = new this.mbgl.Popup({
          offset:15,
          anchor:'left',
          closeButton:true,
          closeOnClick:true
        })
        if(this.form.type === 'QH'){
            setTimeout(_=>{
                    this.map.flyTo({
                        center:this.form.center,
                        zoom: 11,
                    })
               },500)
            if(this.form.kind === 'region'){
            let form = {regionnos:this.form.region,...this.form.form}
            House.getRegionDetail(form).then(res=>{
                this.regionData = res.data.data.list
                this.setHouseLayer(res.data.data.list)
                this.hotSort(this.form.sort)
              })
            }else if(this.form.kind === 'part'){
                let form = {partnos:this.form.part,...this.form.form}
                House.getRegionDetail(form).then(res=>{
                this.setHouseLayer(res.data.data.list)
                this.hotSort(this.form.sort)
                })
            }
        }else if(this.form.type === 'WD'){
            setTimeout(_=>{
                this.map.flyTo({
                    center:this.form.center,
                    zoom: 11,
                })
            },500)
            this.$nextTick(_=>{
                let myChart = this.$echarts.init(document.getElementById('charts'))
                let series = this.form.echartsData.map(item=>item[this.form.sort])
                let xAxis = this.form.echartsData.map(item=>item.range)
                var option = {
                    xAxis: {
                        type: 'category',
                        data: xAxis
                    },
                    yAxis: {
                        type: 'value'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                        type: 'shadow'
                        }
                    },
                    series: [
                        {
                        data: series,
                        type: 'bar',
                        itemStyle:{
                            color:'#0a9396'
                        }
                        }
                    ],
                    grid:{
                        top:60,
                        left:80,
                        bottom:30,
                        right:40
                    },
                    title:{
                        show:true,
                        text: this.form.title,
                        x:'center',
                        y:20,
                        textStyle:{
                            color:'#219ebc'
                        }
                    }
                };
                myChart.setOption(option,true);
            }) 
            console.log(this.form)
            if(this.form.kind === 'region'){
                this.form.form.codes = this.form.region
               
                House.getWDRegionMapData(this.form.form).then(res=>{
                    this.regionData = res.data.data
                    this.setHouseLayer(res.data.data)
                    this.hotSort(this.form.sort)
                })
            }else if(this.form.kind === 'part'){
                this.form.form.codes = this.form.part
                House.getWDRegionMapData(this.form.form).then(res=>{
                    this.regionData = res.data.data
                    this.setHouseLayer(res.data.data)
                    this.hotSort(this.form.sort)
              })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .regionDetail_wrap{
        position: fixed;
        top:10%;
        left:calc(10% + 342px);
        border-radius: 60px;
        height: 80%;
        width:calc(80% - 304px);
       &:before, &:after{
            position:absolute;
            content:"";
            top:100px;bottom:5px;left:30px;right:30px;
            z-index:-1;
            box-shadow:0 0 40px 13px #2c3c4c;
            border-radius:100px/20px;
        }
        .icon-guanbi{
            position: absolute;
            right: 14px;
            top:8px;
            z-index: 999999999;
            color:white;
            font-size: 20px;
            cursor: pointer;
            &:hover{
                transition: all 0.5s ease;
                transform: rotate(180deg);
            }
        }
        .echarts_mask{
                position: absolute;
                bottom:5%;
                left:15%;
                width:70%;
                height:25%;
                background: rgba(47,62,70,.8);
                border-radius: 8px;
            #charts{
                position: absolute;
                height:100%;
                width:100%;
            }
        }
    }
</style>