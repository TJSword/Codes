<template>
  <div :class="['areaInfo_wrap',ani?'areaInfo_wrap_active':'']">
     <dv-border-box-12  :class="['detail_box',ani?'detail_box_acitve':'']">
          <div class="title">{{this.form.name}}</div>
          <i class="iconfont icon-guanbi" @click="close"></i>
          <div class="map_box">
            <Map :id="'LandDetailMap'" @map="getMap" />
          </div>
          <dv-border-box-12 class="basicInfo_box">
            <div class="info_content">
              <div class="num_box">
                  <div class="info_title">关注用户指数</div>
                  <div class="info_value">{{hotScore}}</div>
              </div>
              <!-- <div class="info_title">面积段关注度TOP3</div>
              <div class="table_box">
                <div class="content_box">
                      <div class="item" v-for="item in 3" :key="item"> 
                        <div class="item_label">80-90㎡</div>
                        <div class="item_label">860</div>
                      </div>
                </div>
              </div>
              <div class="info_title">单价段关注度TOP3</div>
              <div class="table_box">
                <div class="content_box">
                  <div class="item" v-for="item in 3" :key="item"> 
                        <div class="item_label">80-90㎡</div>
                        <div class="item_label">860</div>
                      </div>
                </div>
                </div>
              <div class="info_title">总价段关注度TOP3</div>
              <div class="table_box">
                  <div class="content_box">
                    <div class="item" v-for="item in 3" :key="item"> 
                        <div class="item_label">80-90㎡</div>
                        <div class="item_label">860</div>
                      </div>
                  </div>
              </div> -->
              <div class="trend_box">
                 <div class="info_title">板块关注度</div>
                 <div id="trend"></div >
              </div>
            </div>
          </dv-border-box-12>
          <dv-border-box-12 class="echarts_1_box">
            <div class="tabs">
              <div class="tab_active">面积段关注度</div>
            </div>
            <div id="echarts_1"></div>
          </dv-border-box-12>
           <dv-border-box-12 class="echarts_2_box">
            <div class="tabs">
              <div class="tab_active">单价段关注度</div>
            </div>
            <div id="echarts_2"></div>
          </dv-border-box-12>
           <dv-border-box-12 class="echarts_3_box">
            <div class="tabs">
              <div class="tab_active">总价段关注度</div>
            </div>
            <div id="echarts_3"></div>
          </dv-border-box-12>
      </dv-border-box-12>
  </div>
</template>

<script>
import situationApi from "../../../api/situationApi.js"
import Map from "./bgMap"
export default {
  props:['form','center'],
  data(){
    return{
      ani:false,
      hotScore:''
    }
  },
  components:{
    Map
  },
  methods:{
    close(){
        this.ani = false,
        setTimeout(_=>{
            this.$parent.closeDetail()
        },300)
    },
    getMap(map){
      this.map = map
      map.flyTo({
          center:this.center,
          speed:0.8,
          zoom:8.5
      })
      situationApi.getAreaBuilding(this.form).then(res=>{
        this.$nextTick(_=>{
          setTimeout(_=>{
            this.setHouseLayer(res.data.data)
          },1000)
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
                situationApi.getBasicInfo(id).then(res=>{
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
    drawTrend(data){
      let xAxisData = data.map(item=>item.date)
      let seriesData = data.map(item=>item.rate.toFixed(2))
      let option = {
        xAxis: {
          type: 'category',
          data:xAxisData,
          axisLabel:{
              textStyle:{
                  fontSize:12,
                  color:'white',
              },
              interval: 0
          },
        },
        yAxis: {
          type: 'value',
          axisLabel:{
              textStyle:{
                  fontSize:12,
                  color:'white',
              },
              interval: 0
          },
        },
        grid: {
            left: '2%',
            right: '2%',
            bottom: '6%',
            top:'12%',
            containLabel: true
        },
        series: [
          {
            data: seriesData,
            type: 'line',
            smooth: true,
            lineStyle:{
              normal:{
                color:'white'
              }
            },
            symbol:'circle',
            symbolSize:[2,2]
          }
        ]
      };
      let myChart = this.$echarts.init(document.getElementById('trend'))
      myChart.setOption(option,true);
    },
    drawEcharts_1(data){
      let xAxisData = data.map(item=>item.area_size)
      let seriesData = data.map(item=>item.rate.toFixed(2))
      let option = {
        xAxis: {
          type: 'category',
          data: xAxisData,
          axisLabel:{
              textStyle:{
                    fontSize:10,
                  color:'white',
                  },
              interval: 0
              },
        },
        grid:{
          top:'10%',
          left:'10%',
          right:'6%',
          bottom:'20%',
        },
        yAxis: {
          type: 'value',
           axisLabel:{
              textStyle:{
                  fontSize:12,
                  color:'white',
              },
              interval: 0
          },
        },
        series: [
          {
            data: seriesData,
            type: 'bar'
          }
        ]
      };
      let myChart = this.$echarts.init(document.getElementById('echarts_1'))
      myChart.setOption(option,true);
    },
    drawEcharts_2(data){
      let xAxisData = data.map(item=>item.avg_size)
      let seriesData = data.map(item=>item.rate.toFixed(2))
      let option = {
        xAxis: {
          type: 'category',
          data: xAxisData,
          axisLabel:{
              textStyle:{
                  fontSize:10,
                  color:'white',
                  },
              interval: 0
              },
        },
        grid:{
          top:'10%',
          left:'10%',
          right:'6%',
          bottom:'20%',
        },
        yAxis: {
          type: 'value',
           axisLabel:{
                    textStyle:{
                        fontSize:12,
                        color:'white',
                    },
                    interval: 0
                },
        },
        series: [
          {
            data: seriesData,
            type: 'bar'
          }
        ]
      };
      let myChart = this.$echarts.init(document.getElementById('echarts_2'))
      myChart.setOption(option,true);
    },
    drawEcharts_3(data){
      let xAxisData = data.map(item=>item.total_size)
      let seriesData = data.map(item=>item.rate.toFixed(2))
      let option = {
        xAxis: {
          type: 'category',
          data:xAxisData,
          axisLabel:{
            textStyle:{
                fontSize:10,
                color:'white',
                },
            interval: 0
            },
        },
        grid:{
          top:'10%',
          left:'10%',
          right:'6%',
          bottom:'20%',
        },
        yAxis: {
          type: 'value',
           axisLabel:{
                    textStyle:{
                        fontSize:12,
                        color:'white',
                    },
                    interval: 0
                },
        },
        series: [
          {
            data: seriesData,
            type: 'bar'
          }
        ]
      };
      let myChart = this.$echarts.init(document.getElementById('echarts_3'))
      myChart.setOption(option,true);
    }
  },
  created(){
    situationApi.getHotDetail(this.form).then(res=>{
      let data = res.data.data
      this.hotScore = data.dateLists[0].rate
      this.$nextTick(_=>{
         this.drawEcharts_1(data.areaLists)
         this.drawEcharts_2(data.avgLists)
         this.drawEcharts_3(data.totalLists)
         this.drawTrend(data.dateLists)
      })
    })
     this.popupClick = new this.mbgl.Popup({
          offset:15,
          anchor:'left',
          closeButton:true,
          closeOnClick:true
      })
  },
  mounted(){
    setTimeout(_=>{
        this.ani = true;
    },50)
  }
    
}
</script>

<style lang="scss" scoped>
.areaInfo_wrap{
  position: fixed;
  top:0;
  left:0;
  height: 100%;
  width: 100%;
  background: #41454a00;
  z-index: 999999;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  overflow: hidden;
  .detail_box{
        height: 92%;
        width: 92%;
        background: rgba(47, 62, 70, 1);
        border-radius: 8px;
        position: relative;
        transform: scaleY(0.1);
        opacity: 0;
        transition:  all 0.3s  ease ;
        ::v-deep .dv-border-svg-container{
            z-index: 10;
        }
        .title{
          position: absolute;
          top:2%;
          height: 54px;
          z-index: 99;
          width: 100%;
          text-align: center;
          font-size:36px;
          color:white;
          font-weight: 700;
          letter-spacing: 2px;
        }
        .icon-guanbi{
            position: absolute;
            right: 22px;
            top:18px;
            color:white;
            font-size:20px;
            z-index: 100;
            &:hover{
                transform: rotate(180deg);
                transition: all 0.3s ease;
            }
        }
        .map_box{
            position: absolute;
            top:1%;
            left: 0.5%;
            height: 98%;
            width: 99%;
            z-index: 20;
            .map_wrap{
                position: static!important;
            }
       }
       .basicInfo_box{
          position: fixed;
          bottom:4%;
          left:5%;
          width:49%;
          height:28%;
          background: rgba(47,62,70,.8);
          border-radius: 8px;
          transition: all 1.5s ease;
          z-index: 999999;
          .info_content{
            height: 100%;
            width: 100%;
            display: flex;
            .num_box{
              width:25%;
              height: 100%;
              .info_title{
                margin-top:16px;
                margin-left:24px;
              }
              .info_value{
                height: calc(100% - 60px);
                width: 100%;
                font-size:36px;
                display: flex;
                align-items: center;
                justify-content: center;
              }
            }
            .trend_box{
              width: 75%;
              height: 100%;
              .info_title{
                margin-top:16px;
              }
            }
            .info_head{
              color:rgba(255, 193, 7, 1);
              font-size: 18px;
              margin-bottom: 10px;
            }
            .info_title{
              margin:6px 0;
              font-size:16px;
              color:rgba(255, 193, 7, 1);
            }
            .info_value{
               font-size:32px;
               line-height:20px;
               color:white;
               width:100%;
               text-align:center;
               font-weight:700
            }
            .table_box{
              width: 100%;
              height: auto;
              display: flex;
              flex-direction: column;
              align-items: center;
              .table_title{
                font-size: 14px;
                margin-bottom: 4px;
              }
              .content_box{
                width: 100%;
                .item{
                  width: 100%;
                  display: flex;
                  flex-wrap: wrap;
                  color:white;
                  &:last-child{
                    margin-bottom: 10px;
                    .item_label,.item_value{
                      border-bottom:1px solid rgba(255, 255, 255, 0.41);
                    }
                    }
                  .item_label,.item_value{
                    width: 48%;
                    text-align: center;
                    border:1px solid rgba(255, 255, 255, 0.41);
                    border-bottom: 0;
                    padding: 3px 0;
                  }
                  .item_value{
                    border-left: 0;
                  }
                  .item_line{
                    background: pink;
                  }
                }
                
              }
            }
            #trend{
              height: calc(100% - 60px);
              width: 100%;
              overflow: hidden;
            }
          }
       }
       .echarts_1_box{
          position: fixed;
          top:4%;
          right:5%;
          width:36%;
          height:28%;
          background: rgba(47,62,70,.8);
          border-radius: 8px;
          transition: all 1.5s ease;
          z-index: 999999;
          .tabs{
            height:30px;
            width: 100%;
            margin-top:16px;
            margin-left:12px;
            display: flex;
            color:white;
            .tab_active{
              margin-left:10px;
              font-size:16px;
              cursor: pointer;
              color:white;
              transition: all 0.3s ease;
              color:rgba(255, 193, 7, 1);
              font-weight: 700;
              transition: all 0.3s ease;
            }
          }
          #echarts_1{
            width: 100%;
            height: calc(100% - 50px);
          }
       }
       .echarts_2_box{
          position: fixed;
          top:36%;
          right:5%;
          width:36%;
          height:28%;
          background: rgba(47,62,70,.8);
          border-radius: 8px;
          transition: all 1.5s ease;
          z-index: 999999;
          .tabs{
            height:30px;
            width: 100%;
            margin-top:16px;
            margin-left:12px;
            display: flex;
            color:white;
            .tab_active{
              margin-left:10px;
              font-size:16px;
              cursor: pointer;
              color:white;
              transition: all 0.3s ease;
              color:rgba(255, 193, 7, 1);
              font-weight: 700;
              transition: all 0.3s ease;
            }
          }
          #echarts_2{
            width: 100%;
            height: calc(100% - 50px);
          }
       }
       .echarts_3_box{
          position: fixed;
          top:68%;
          right:5%;
          width:36%;
          height:28%;
          background: rgba(47,62,70,.8);
          border-radius: 8px;
          transition: all 1.5s ease;
          z-index: 999999;
          .tabs{
            height:30px;
            width: 100%;
            margin-top:16px;
            margin-left:12px;
            display: flex;
            color:white;
            .tab_active{
              margin-left:10px;
              font-size:16px;
              cursor: pointer;
              color:white;
              transition: all 0.3s ease;
              color:rgba(255, 193, 7, 1);
              font-weight: 700;
              transition: all 0.3s ease;
            }
          }
          #echarts_3{
            width: 100%;
            height: calc(100% - 50px);
          }
       }
  }
  .detail_box_acitve{
      transform: scaleY(1);
      opacity: 1;
      transition:  all 0.3s  ease ;
  }
}
.areaInfo_wrap_active{
  background: #41454a78;
  transition: all 0.3s ease;
}

</style>