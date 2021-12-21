<template>
    <!-- 当前土地在售项目信息 -->
    <div class="landsale_wrap">
        <div class="info_card" v-if="curLandSaleInfo!==null">
            <div class="info_header">
                <div style="color:#67c23a">{{curLandSaleInfo.name}}</div>
                <el-button type="text" @click="closeCard()">关闭</el-button>
            </div>
            <div class="info_body">
                <div class="item">周边在售项目查询</div>
                <div class="item">
                    <div class="title">项目业态：</div>
                    <div class="cont">
                        <el-radio-group v-model="propertyType">
                            <el-radio v-for="item in propertyTypeArr" :key="item.value" :label="item.value">{{item.label}}</el-radio>
                        </el-radio-group>
                    </div>
                </div>
                <div class="item">
                    <div class="title">时间范围：</div>
                    <div class="cont">
                        <el-date-picker
                            style="width:192px;"
                            v-model="dateRange"
                            size="small"
                            type="monthrange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始月"
                            end-placeholder="结束月"
                            value-format="yyyy-MM"
                            :picker-options="pickerOptions">
                        </el-date-picker>
                    </div>
                </div>
                <div class="item">
                    <div class="title">范围半径：</div>
                    <div class="cont">
                        <el-radio-group v-model="base_radius">
                            <el-radio :label="3">3公里</el-radio>
                            <el-radio :label="5">5公里</el-radio>
                        </el-radio-group>
                    </div>
                    <!-- <el-input v-model="custom_radius" placeholder="自定义半径" size="small"></el-input> -->
                </div>
                <div class="btns">
                    <el-button size="small" type="primary" @click="searLandSale()">查询</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    name:'landsale',
    data(){
        return {
            propertyType:'house',//业态
            propertyTypeArr:[
                {value:'house',label:'普通住宅'},
                {value:'business',label:'商业'},
                {value:'office',label:'办公'},
                {value:'praetorium',label:'别墅'},
                {value:'apartment',label:'公寓'},
            ],
            dateRange:'', //时间范围
            pickerOptions: { //快捷选择
                shortcuts: [{
                    text: '本月',
                    onClick(picker) {
                    picker.$emit('pick', [new Date(), new Date()]);
                    }
                }, {
                    text: '今年至今',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date(new Date().getFullYear(), 0);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setMonth(start.getMonth() - 3);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近六个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setMonth(start.getMonth() - 6);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一年',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setMonth(start.getMonth() - 12);
                    picker.$emit('pick', [start, end]);
                    }
                }]
            },
            base_radius:3,//查询半径
        }
    },
    mounted(){
        console.log('要查询项目信息的土地信息',this.curLandSaleInfo)
    },
    computed:{
        ...mapGetters(['curLandSaleInfo','ledger_map'])
    },
    methods:{
        //关闭
        closeCard(){
            this.$store.dispatch('setCurLandSaleInfo',null)
            var map = this.ledger_map
            var source = map.getSource('searchCircleSource')
            if(source!==undefined){
                map.getSource("searchCircleSource").setData({
                    type: "FeatureCollection",
                    features: []
                });
            }
        },
        //查询
        searLandSale(){
            this.setRadiusCircle()
        },
        //半径圆绘制
        setRadiusCircle(){
            var that = this
            let map = this.ledger_map;
            let layerFlag = map.getSource("searchCircleSource")
            if(layerFlag===undefined){
                map.addSource("searchCircleSource", {
                    type: "geojson",
                    data: {
                        type: "FeatureCollection",
                        features: [],
                    },
                });
                map.addLayer({
                    id: "radiusCircle_fill",
                    type: "fill",
                    source: "searchCircleSource",
                    "layout": {},
                    "paint": {
                        "fill-color": "#66b1ff",//"#7dfd3e","#409EFF"
                        "fill-opacity": 0.06
                    }
                });
                map.addLayer({
                    id: "radiusCircle_line",
                    type: "line",
                    source: "searchCircleSource",
                    "layout": {},
                    "paint": {
                        "line-color":"#66b1ff",
                        "line-dasharray": [2, 4],
                        "line-width":1.5,
                        "line-opacity": 0.9
                    }
                });
                map.addLayer({
                "id": "radiusCircle_symbol",
                "type": "symbol",
                "source": "searchCircleSource",
                "layout": {
                    "text-field":"半径 "+that.base_radius+'Km',
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

            var points = 64; //点的个数
            var km = that.base_radius; //半径
            var coords = that.curLandSaleInfo.center.split(',')
            var lngLat = { lng:JSON.parse(coords[0]),lat:JSON.parse(coords[1]) }; //中心点
            var ret = [];
            var distanceX = km/(111.320*Math.cos(lngLat.lat*Math.PI/180));
            var distanceY = km/110.574;
            var theta, x, y;
            for(var i=0; i<points; i++) {
                theta = (i/points)*(2*Math.PI);
                x = distanceX*Math.cos(theta);
                y = distanceY*Math.sin(theta);
                ret.push([lngLat.lng+x, lngLat.lat+y]);
            }
            ret.push(ret[0]);
            let geojsonData = {
                type: "FeatureCollection",
                features: [{
                    "type": "Feature",
                    "properties": { "name": '暂无'}, 
                    "geometry": {
                    "type": "Polygon",
                    "coordinates": [ret],
                    }
                }]
            }
            map.getSource("searchCircleSource").setData(geojsonData);
            that.filterCoords = ret
            console.log(that.filterCoords)
        },
    }
}
</script>
<style lang="scss">
.landsale_wrap{
    .info_card{
        position: fixed;
        z-index: 99;
        width: 300px;
        right: 50px;
        top: 50px;
        background: linear-gradient(45deg, rgba(2, 11, 21, 0.88), rgba(0, 0, 0, 0.82));
        border-top: #668855 1px solid;
        border-bottom: #668855 1px solid;
        color: #fff;
        padding: 0px 20px 10px 20px;
        .info_header{
            width: 100%;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .info_body{
            border-top: #668855 1px solid;
            padding-top: 10px;
            .item{
                display: flex;
                align-items: flex-start;
                margin-bottom: 10px;
                .title{
                    width: 70px;
                }
                .cont{
                    width: calc(100% - 70px);
                }
                .el-radio{
                    margin-top: 3px;
                }
                .el-radio__label{
                    color: #ececec;
                }
                
            }
            .btns{
                display: flex;
                justify-content: flex-end;
            }
        }
    }
}
</style>