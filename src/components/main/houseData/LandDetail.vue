<template>
  <div :class="['landDetail_wrap',ani?'landDetail_wrap_active':'']">
      <dv-border-box-12 :class="['detail_box',ani?'detail_box_acitve':'']">
          <i class="iconfont icon-guanbi" @click="close"></i>
          <div class="map_box">
            <Map :id="'detailMap'" @map="getMap" />
            <dv-border-box-12 class="detail_mask">
                <div class="title" @click="openNew">{{title}}</div>
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
import House from "@/api/houseDataApi.js"
import { Encrypt } from '@/utils/public'
import Map from "./bgMap"
export default {
    props:['landId'],
    components:{
        Map
    },
    data(){
        return{
            title:'',
            tableData:[],
            ani:false
        }
    },
    methods:{
        openNew(){
            let key = Encrypt(this.landId)
            window.open('http://www.tzymap.com/#/shareland?id='+key)
        },
        close(){
                this.ani = false
                setTimeout(_=>{
                    this.$parent.closeDetail()
                },300)
                },
        getMap(map){
            this.map = map
        },
        setPointLayer(point){
        let map = this.map;
        map.flyTo({
            center:point
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
        getDict(type){
            House.getDict(type).then(res=>this[type] = res.data.data)
        } 
    },
    created(){
        this.getDict('sell_type')
        this.getDict('land_type')
        this.getDict('land_use')
        setTimeout(_=>{
            House.getLandInfoDetail(this.landId).then(res=>{
             let data = res.data.data
             this.$nextTick(_=>{
                 setTimeout(_=>{
                     this.setPointLayer(data.center.split(','))
                 },300)
                 
             })
             this.title = data.address
             this.tableData = [{
                    label:'土地编号',
                    value:data.landNumber
                },{
                    label:'用途',
                    value: this.land_use.filter(item=>item.value === data.purpose)[0].label
                },{
                    label:'计容建筑面积',
                    value:data.buildArea
                },{
                    label:'起拍单价',
                    value:data.startPrice
                },{
                    label:'起拍总价',
                    value:data.startTotalPrice
                },{
                    label:'成交日期',
                    value:data.date
                },{
                    label:'成交总价',
                    value:data.totalPrice
                },{
                    label:'容积率',
                    value:data.volumeRatio
                },{
                    label:'溢价率',
                    value:data.premiumRatio
                },{
                    label:'竞得单位',
                    value:data.competeCompany
                },{
                    label:'板块代码',
                    value:data.partno
                },{
                    label:'拍卖规则',
                    value:data.auctionRules
                },{
                    label:'板块名称',
                    value:data.partname
                },{
                    label:'区划名称',
                    value:data.region
                },{
                    label:'区划代码',
                    value:data.regionno
                },{
                    label:'公告时间',
                    value:data.annoTime
                },{
                    label:'出让方式',
                    value: this.sell_type.filter(item=>item.value === data.sellType)[0].label
                },{
                    label:'竞无偿移交',
                    value:data.freeTransInfo
                },{
                    label:'商住比例',
                    value:data.rcScale
                },{
                    label:'建筑密度',
                    value:data.buildingDensity
                },{
                    label:'绿化率',
                    value:data.greenRate
                },{
                    label:'建筑高度',
                    value:data.buildingHeight
                },{
                    label:'其他配建信息',
                    value:data.otherInfo
                },{
                    label:'备注',
                    value:data.remarks
                },{
                    label:'土地状态',
                    value: this.land_type.filter(item=>item.value === data.state)[0].label
                },{
                    label:'保证金',
                    value:data.bond
                },{
                    label:'计划上市时间',
                    value:data.marketTime
                },{
                    label:'开发商',
                    value:data.developers
                },{
                    label:'商业/办公/住宅累计开盘面积',
                    value:data.openingArea
                },{
                    label:'商业/办公/住宅累计存量面积',
                    value:data.stockArea
                },{
                    label:'项目案名',
                    value:data.caseName
                },{
                    label:'容积率',
                    value:data.ratio
                },{
                    label:'起拍楼面价',
                    value:data.startFloorPrice
                },{
                    label:'宗地位置',
                    value:data.parcelLocation
                },{
                    label:'公告号',
                    value:data.annoId
                },{
                    label:'环域',
                    value:data.torus
                },{
                    label:'土地性质',
                    value:data.landNature
                },{
                    label:'使用年限',
                    value:data.userYears
                },{
                    label:'出让时间',
                    value:data.sellTime
                },{
                    label:'出让备注',
                    value:data.sellRemark
                },{
                    label:'交易状态',
                    value:data.tradingStatus
                },{
                    label:'成交单价',
                    value:data.tradePrice
                },{
                    label:'成交备注',
                    value:data.tradeRemark
                },{
                    label:'参拍信息',
                    value:data.auction
                }]
         })
        },300)

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
        ::v-deep .dv-border-svg-container{
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
            top:1.5%;
            left: 0.5%;
            height: 99%;
            width: 100%;
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
                ::v-deep .border-box-content{
                    position: relative;
                    z-index: 60;
                    display: flex;
                    align-items: center;
                    align-content: flex-start;
                    justify-content: flex-start;
                    flex-wrap: wrap;
                    overflow-y: scroll;
                     &::-webkit-scrollbar{
                    background-color: #212e3e !important;
                    opacity: 1!important;
                    height:10px;
                    width: 0px;
                }
                }
                .title{
                    color:white;
                    font-size: 22px;
                    width: 100%;
                    text-align: center;
                    margin-top:20px;
                    margin-bottom:6px;
                    cursor: pointer;
                    text-decoration: underline;
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