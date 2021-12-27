<template>
  <div :class="['landDetail_wrap',ani?'landDetail_wrap_active':'']">
      <dv-border-box-12 :class="['detail_box',ani?'detail_box_acitve':'']">
          <i class="iconfont icon-guanbi" @click="close"></i>
          <div class="map_box">
            <Map :id="'detailMap'" @map="getMap"/>
            <dv-border-box-12 class="detail_mask">
                <div class="title">{{title}}</div>
                <div class="detail_item" v-for="(item,index) in tableData" :key="index">
                    <div class="label">{{item.label}}</div>
                    <div class="value">{{item.value?item.value:'暂无'}}</div>
                </div>
            </dv-border-box-12>
          </div>
      </dv-border-box-12>
  </div>
</template>

<script>
import Land from "../../api/Land"
import Map from "../common/map"
export default {
    components:{
        Map
    },
    props:['landId'],
    data(){
        return{
            title:'',
            tableData:[],
            ani:false
        }
    },
    methods:{
        close(){
           this.ani = false
           setTimeout(_=>{
               this.$parent.closeDetail()
           },300)
        },
        getMap(map){
          this.map = map;
          map.flyTo({
            center
          })
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
      Land.getParcelInfo(this.landId).then((res) => {
      console.log(res.data.data);
      
      let data = res.data.data;
      this.setPointLayer(data.coordinate.split(','))
      this.title = data.address;
      this.tableData = [
            {
              label: "宗地编号",
              value: data.parcelNo,
            },
            {
              label: "城区",
              value: data.region,
            },
            {
              label: "板块",
              value: data.partname,
            },
            {
              label: "方位",
              value: data.region,
            },
            {
              label: "片区",
              value: data.district,
            },
            {
              label: "公告单位",
              value: data.noticeOrg,
            },
            {
              label: "公告媒体",
              value: data.noticeMedia,
            },
            {
              label: "公告时间",
              value: data.noticeDate,
            },
            {
              label: "出让方式",
              value: data.sellTypeLabel,
            },
            {
              label: "出让时间",
              value: data.sellDate,
            },
            {
              label: "净用地面积(亩)",
              value: data.areaMu,
            },
            {
              label: "净用地面积(㎡)",
              value: data.landArea,
            },
            {
              label: "土地用途分类",
              value: data.landUseType,
            },
            {
              label: "土地用途",
              value: data.landUseLabel,
            },
            {
              label: "使用年限",
              value: data.serviceLife,
            },
            {
              label: "计算容积率",
              value: data.computeRatio,
            },
            {
              label: "可开发体量",
              value: data.devVolume,
            },
            {
              label: "起拍单价",
              value: data.startPrice,
            },
            {
              label: "起拍总价",
              value: data.startSum,
            },
            {
              label: "其实楼面地价",
              value: data.floorPrice,
            },
            {
              label: "保证金",
              value: data.deposit,
            },
            {
              label: "容积率",
              value: data.volumeRatio,
            },
            {
              label: "建筑密度",
              value: data.buildingDensity,
            },
            {
              label: "绿化率",
              value: data.greenDensity,
            }
      ];
    });
    },
    mounted(){
        setTimeout(_=>{
            this.ani = true
        },50)
    }
}
</script>
<style lang="scss" scoped>
.landDetail_wrap{
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
            .detail_mask{
                position: absolute;
                top:6%;
                left:5%;
                width:600px;
                height:88%;
                padding:0 0 0 3%;
                background: rgba(47,62,70,.8);
                border-radius: 8px;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                align-content: flex-start;
                justify-content: flex-start;
                flex-wrap: wrap;
                overflow-y:scroll;
                &::-webkit-scrollbar{
                    background-color: #212e3e !important;
                    opacity: 1!important;
                    height:10px;
                    width: 0px;
                }
                /deep/.border-box-content{
                     display: flex;
                align-items: center;
                align-content: flex-start;
                justify-content: flex-start;
                flex-wrap: wrap;
                }
                .title{
                    color:white;
                    font-size: 22px;
                    width: 100%;
                    text-align: center;
                    margin-top:20px;
                    margin-bottom:6px;
                }
                .detail_item{
                    display: flex;
                    align-items: center;
                    color:white;
                    width: 50%;
                    height:36px;
                    margin-top:12px;
                    .label{
                        color:#fcbf49;
                        font-weight: 700;
                        width: 20%;
                        text-align: left;
                        white-space: nowrap;
                    }
                    .value{
                        width: 80%;
                        text-align: center;
                        white-space: nowrap;
                    }
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
.landDetail_wrap_active{
    background: #41454a78;
    transition: all 0.3s ease;
}
</style>