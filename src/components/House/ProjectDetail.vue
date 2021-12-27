<template>
  <div :class="['houseDetail_wrap',ani?'houseDetail_wrap_active':'']">
      <LandDetail :landId="landId" v-if="showLandDetail" />
      <DynamicInfo :landId="landId" v-if="showDynamicInfo" />
      <HDDynamicInfo :landId="landId" v-if="showHDDynamicInfo" />
      <dv-border-box-12  :class="['detail_box',ani?'detail_box_acitve':'']">
          <i class="iconfont icon-guanbi" @click="close"></i>
          <div class="map_box">
            <Map :id="'detailMap'" @map="getMap" />
            <div class="title">{{proTitle}}</div>
            <div class="tab_wrap">
                <div class="tab_box">
                    <div :class="['tab',index === tabIndex?'tab_active':'']" v-for="(item,index) in tabs" :key="index" @click="tabClick(index)">{{item}}</div>
                </div>
            </div>
            <div class="swiper_box">
                <el-carousel  ref="swiper" arrow="never" :autoplay="false" indicator-position="none">
                <el-carousel-item>
                    <BasicInfo :id="proId"/>
                </el-carousel-item>
                <el-carousel-item>
                    <LandInfo :id="proId" @showLandDetail="showLandDetailHandler" />
                </el-carousel-item>
                <el-carousel-item>
                    <ProDynamic :id="proId" @showDynamicInfo ="showDynamicInfoHandler" @showHDDynamicInfo ="showHDDynamicInfoHandler"/>
                </el-carousel-item>
                <el-carousel-item>
                     <PresellInfo :id="proId"></PresellInfo>
                </el-carousel-item>
                <el-carousel-item>
                    <BuildingInfo :id="proId"></BuildingInfo>
                </el-carousel-item>
                <el-carousel-item>
                    <DoorList :id="proId"></DoorList>
                </el-carousel-item>
                <el-carousel-item>
                    <GYCJList :id="proId"></GYCJList>
                </el-carousel-item>
                <el-carousel-item>
                    <BuildingTrend :id="proId"></BuildingTrend>
                </el-carousel-item>
                 <el-carousel-item>
                    <Latitude :id="proId"></Latitude>
                </el-carousel-item>
                  <el-carousel-item>
                    <ProImg :id="proId"></ProImg>
                </el-carousel-item>
                  <el-carousel-item>
                    <PlanGraph :id="proId"></PlanGraph>
                </el-carousel-item>
                 <el-carousel-item>
                    <ProReport :id="proId"></ProReport>
                </el-carousel-item>
            </el-carousel>
            </div>
          </div>
      </dv-border-box-12>
  </div>
</template>

<script>
import House from "../../api/House"
import Map from "../common/map"
import BasicInfo from "./DetailType/BasicInfo"
import LandInfo from "./DetailType/LandInfo"
import ProDynamic from "./DetailType/ProDynamic"
import PresellInfo from './DetailType/PresellInfo'
import BuildingInfo from './DetailType/BuildingInfo'
import DoorList from "./DetailType/DoorList"
import GYCJList from "./DetailType/GYCJList"
import BuildingTrend from "./DetailType/BuildingTrend"
import Latitude from "./DetailType/Latitude"
import ProImg from "./DetailType/ProImg"
import PlanGraph from "./DetailType/PlanGraph"
import ProReport from "./DetailType/ProReport"
import LandDetail from "./LandDetail"
import DynamicInfo from "./DynamicInfo"
import HDDynamicInfo from "./HDDynamicInfo"
export default {
    components:{
        Map,BasicInfo,LandInfo,ProDynamic,PresellInfo,BuildingInfo,DoorList,GYCJList,BuildingTrend,Latitude,ProImg,PlanGraph,ProReport,LandDetail,DynamicInfo,HDDynamicInfo
    },
    props:['proId','proTitle','proPoi'],
    data(){
        return{
            title:'',
            tableData:[],
            tabIndex:0,
            ani:false,
            showLandDetail:false,
            showDynamicInfo:false,
            showHDDynamicInfo:false,
            tabs:['基本信息','土地信息','项目动态','预售证信息','楼栋信息','户型配比','供应与成交','项目走势图','分维度统计','项目图片','总平图','项目报告']
        }
    },
    methods:{
        tabClick(i){
            this.tabIndex = i;
            this.$refs.swiper.setActiveItem(i)
        },
        close(){
            this.ani = false,
            setTimeout(_=>{
                this.$parent.closeDetail()
            },300)
        },
        getMap(map){
            this.map = map
            this.$nextTick(_=>{
                setTimeout(_=>{
                     this.setPointLayer(this.proPoi)
                },300)
            })
        },
        showLandDetailHandler(id){
            console.log(id)
            this.landId = id
            this.showLandDetail = true
        },
        showDynamicInfoHandler(id){
            this.landId = id
            this.showDynamicInfo = true
        },
        showHDDynamicInfoHandler(id){
             this.landId = id
             this.showHDDynamicInfo = true
        },
        closeDetail(){
            this.showLandDetail = false
            this.showDynamicInfo = false
            this.showHDDynamicInfo = false
        },
        setPointLayer(point){
          let map = this.map;
          map.flyTo({
            center:[point[0]-0.15,point[1]]
          })
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
        
    },
    mounted(){
        setTimeout(_=>{
            this.ani = true
        },50)
    }
}
</script>
<style lang="scss" scoped>
.houseDetail_wrap{
    position: absolute;
    top:0;
    left:0;
    height: 100%;
    width: 100%;
    background: #41454a00;
    z-index: 30;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
    .detail_box{
        height: 92%;
        width: 92%;
        background: rgba(47, 62, 70, 1);
        border-radius: 8px;
        position: relative;
        transform: scaleY(0.1);
        opacity: 0;
        transition:  all 0.3s  ease ;
        /deep/.dv-border-svg-container{
            z-index: 10;
        }
        .icon-guanbi{
            position: absolute;
            right: 22px;
            top:18px;
            color:white;
            font-size:20px;
            z-index: 21;
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
            .title{
                color:white;
                position: absolute;
                top:10px;;
                margin:auto;
                width: 100%;
                text-align: center;
                font-weight: 700;
                font-size:26px;
                letter-spacing: 4px;
            }
            .tab_wrap{
                position: absolute;
                height:34px;
                top:60px;
                display: flex;
                align-items: center;
                border-radius: 4px;
                font-size:15px;
                color:white;
                text-align: center;
                width:100%;
                justify-content: center;
            }
            .tab_box{
                height:34px;
                display: flex;
                align-items: center;
                border-radius: 4px;
                border:1px solid #f1faee;
                font-size:15px;
                color:#f1faee;
                text-align: center;
                background: #41454a99;
                overflow: hidden;
                .tab{
                    padding: 0 16px;
                    height:34px;
                    line-height:34px;
                    border-right:1px solid #f1faee;
                    letter-spacing: 1px;
                    cursor: pointer;
                    &:last-child{
                        border:0
                    }
                }
                .tab_active{
                    color:white;
                    background:rgba(33,158,188,.6);
                }
            }
            .swiper_box{
                position: absolute;
                top:116px;
                left:7%;
                width:86%;
                height: calc(100% - 116px);
                // border:1px solid white;
                z-index: 30;
                .el-carousel{
                    height:100%;
                }
                /deep/.el-carousel__container{
                    height:100%!important;
                }
                .el-carousel__item{
                    height:100%;
                }
            }
        }
    }
    .detail_box_acitve{
        transform: scaleY(1);
        opacity: 1;
        transition:  all 0.3s  ease ;
    }
    
}
.houseDetail_wrap_active{
    background: #41454a78;
    transition: all 0.3s ease;
}
</style>