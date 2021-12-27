<template>
  <div class="goosDetail_com">
       <div class="LandParameter_box">
          <dv-border-box-2 class="info_box">
              <div class="title">项目信息</div>
              <div class="pro_info">
                  <div class="item" v-for="(item,index) in buildingInfo" :key="index">
                      <div class="label">{{item.label}}</div>
                      <div class="value">{{item.value}}</div>
                  </div>
              </div>
          </dv-border-box-2>
      </div>
      <dv-border-box-2 class="gql_box">
          <div class="title">产品评分</div>
          <div class="total_score">
              <span class="total">Total</span>
              <span class="score">{{landEchartsData.scoreCp}}</span>
              <span class="unit">分</span>
          </div>
          <div class="bottom_box">
              <div class="bottom_left_box">
                  <div id="hxpbEcharts"></div>
              </div>
              <div class="bottom_right_box">
                  <div class="score_box">
                      <div class="hx">
                          <span style="color:#ffffff;font-size:18px;font-weight:700">户型</span >
                          <span style="color:#ff8d1a;font-size:24px;font-weight:700;margin:2px 5px 0;line-height:26px;">{{landEchartsData.scoreHx}}</span>
                          <span style="color:#e5e5e5;font-size:14px">分</span>
                      </div>
                      <div class="jz">
                          <span style="color:#ffffff;font-size:18px;font-weight:700">精装</span >
                          <span style="color:#ff8d1a;font-size:24px;font-weight:700;margin:2px 5px 0;line-height:26px;">{{landEchartsData.scoreJz}}</span>
                          <span style="color:#e5e5e5;font-size:14px">分</span>
                      </div>
                      <div class="yl">
                          <span style="color:#ffffff;font-size:18px;font-weight:700">园林</span >
                          <span style="color:#ff8d1a;font-size:24px;font-weight:700;margin:2px 5px 0;line-height:26px;">{{landEchartsData.scoreYl}}</span>
                          <span style="color:#e5e5e5;font-size:14px">分</span>
                      </div>
                  </div>
                  <div class="score_info">
                      <div class="info_title">
                        <div class="bxTitle" style="color:">户型名称</div>
                          <div class="area">面积</div>
                          <div class="hxScore">总分</div>
                      </div>
                      <div class="info_box">
                        <div class="info_item" v-for="item in houseList" :key="item">
                            <div class="bxTitle" style="color:">{{item.houseName}}</div>
                            <div class="area">{{item.buildArea}}㎡</div>
                            <div class="hxScore">{{item.score}}分</div>
                        </div>
                      </div>
                  </div>
              </div>
          </div>
      </dv-border-box-2>
      <dv-border-box-2 class="client_box">
        <div class="title">市场客户构成</div>
        <dv-loading v-if="showLoading">Loading...</dv-loading>
        <div class="client_box_child" v-else>
            <div class="left_box">
                <div class="info_title" >
                    <div class="bxTitle" >客户模型</div>
                    <div class="area">供应(万㎡)</div>
                    <div class="hxScore">成交(万㎡)</div>
                </div>
                <div class="info_box">
                     <div class="info_item" v-for="item in modelInfo" :key="item">
                        <div class="bxTitle" style="color:">{{item.moduleName}}</div>
                        <div class="area">{{item.areaIncreased}}</div>
                        <div class="hxScore">{{item.salesArea}}</div>
                    </div>
                </div>
            </div>  
            <dv-active-ring-chart :config="ringChartConfig" style="width:40%;height:100%"/>
        </div>
        
      </dv-border-box-2>
      <dv-border-box-2 class="sellInfo_box">
          <div class="title">销售情况</div>
          <div class="sellInfo">
              <div class="sell_item" v-for="(item,index) in sellInfo" :key="index">
                  <div class="sell_key">{{item.label}}</div>
                  <div class="sell_val">{{item.value}}</div>
              </div>
          </div>
      </dv-border-box-2>
      <dv-border-box-2 class="landInfo_box">
          <div class="title">土地评分</div>
           <div class="total_score">
              <span class="total">Total</span>
              <span class="score">{{landEchartsData.scoreTotal}}</span>
              <span class="unit">分</span>
          </div>
          <div class="landInfo">
              <div id="landEcharts"></div>
          </div>
      </dv-border-box-2>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import locationResearch  from "../../../api/locationResearch"
import { suDoorRatio } from '@/utils/report_qh'
export default {
    computed:{
        ...mapGetters(['locationId'])
    },
    props:['goodsId'],
    data(){
        return{
             ringChartConfig:{
                data:[],
                lineWidth:15,
                radius:'80%',
                activeRadius:'85%',
                activeTimeGap:1500
             },
             buildingInfo:[],
             sellInfo:[],
             landEchartsData:{},
             showLoading:true,
             modelInfo:[],
             houseList:[],
             hxpbArr:[]
        }
    },
    methods:{
        hxpbEcharts_init(){
            let myChart = this.$echarts.init(document.getElementById('hxpbEcharts'))
            let hxpbArr = this.hxpbArr
            let area = []
            let val = []
            hxpbArr.forEach(item=>{
                area.push(item.area)
                val.push(item.value)
            })
            
            // var colors = ['#5470C6', '#91CC75', '#EE6666'];
            var option = {
                title: {
                    text: '户型配比',
                    textStyle:{
                        color:'white'
                    },
                    left:'45%',
                    top:'0%'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                
                grid: {
                    left: '3%',
                    right: '0%',
                    bottom: '10%',
                    top:'18%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: area
                },
                series: [
                    {
                        type: 'bar',
                        data:val,
                        // label: {
                        //     show: true,
                        //     position: 'right'
                        // },
                    }
                ],
            };
        myChart.setOption(option,true);
        },
        landEcharts_init(){
            let myChart_1 = this.$echarts.init(document.getElementById('landEcharts'))
            // var colors = ['#5470C6', '#91CC75', '#EE6666'];
            let data = [this.landEchartsData.scoreCy,this.landEchartsData.scoreSz,this.landEchartsData.scoreZr,
            this.landEchartsData.scoreJy,this.landEchartsData.scoreSy,this.landEchartsData.scoreJt,]
            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01],
                    axisLabel: {
                            show: true,
                            formatter: '{value} ',
                            textStyle: {
                                color: '#fff'
                            }
                        },
                },
                
                yAxis: {
                    type: 'category',
                    data: ['产业综合', '市政资源', '自然资源', '教育资源', '商业资源', '交通综合'],
                    axisLabel: {
                            show: true,
                            formatter: '{value} ',
                            textStyle: {
                                color: '#fff'
                            }
                        },
                },
               grid: {
                    top: '10%',
                    bottom: '1%',
                    left:'8%',
                    containLabel: true
                },
                series: [
                    {
                        type: 'bar',
                        data:data,
                        label: {
                            show: true,
                            position: 'right'
                        },
                    }
                ],
            };
        myChart_1.setOption(option,true);
        }
    },
    watch:{
        goodsId(newVal){
            locationResearch.getGoodsDetail({buildingId:newVal,locationId:this.locationId}).then(res=>{
                console.log(res.data.data)
                let data =res.data.data.bi
                this.buildingInfo = [{
                    label:'项目名称',
                    value:data.name
                },{
                    label:'销售均价',
                    value:data.avg
                },
                // {
                //     label:'开发商',
                //     value:data.developer
                // },
                // {
                //     label:'楼盘地址',
                //     value:data.address
                // },
                {
                    label:'物业类别',
                    value:data.type
                },{
                    label:'建筑形态',
                    value:data.buildFormLabel
                },
                // {
                //     label:'交房时间',
                //     value:data.completeDate
                // },
                {
                    label:'占地面积',
                    value:data.coverArea
                },{
                    label:'建筑面积',
                    value:data.buildArea
                },{
                    label:'容积率',
                    value:data.plotRatio
                },{
                    label:'绿化率',
                    value:data.greenRatio
                },{
                    label:'停车数',
                    value:data.park
                },{
                    label:'楼栋总数',
                    value:data.buildingNum
                },{
                    label:'总户数',
                    value:data.houseNum
                },{
                    label:'物业费',
                    value:data.propertyFee
                },{
                    label:'物业公司',
                    value:data.propertyCompany
                }]
                let sellInfo = res.data.data.si
                this.sellInfo = [{
                    label:'住宅均价',
                    value:sellInfo.house
                },{
                    label:'已取证(%)',
                    value:''
                },{
                    label:'商业均价',
                    value:sellInfo.buisiness
                },{
                    label:'存量销售',
                    value:sellInfo.stock
                },{
                    label:'车位均价',
                    value:sellInfo.carport
                },{
                    label:'整体销售',
                    value:sellInfo.sales_stock
                },{
                    label:'开盘时间',
                    value:sellInfo.sale_date
                },{
                    label:'去化周期',
                    value:sellInfo.qhzq
                }]
                this.landEchartsData = res.data.data.mi
                this.houseList = res.data.data.house
                let  hxpb =  suDoorRatio(res.data.data.data,res.data.data.area)
                let hxpbArr = []
                for(var key in hxpb){
                    if(hxpb[key] != 0){
                        hxpbArr.push({
                            area:key,
                            value:hxpb[key]
                        })
                    }
                }
                this.hxpbArr = hxpbArr
                this.$nextTick(_=>{
                    this.landEcharts_init()
                    this.hxpbEcharts_init()
                })
                
            })
            locationResearch.getCustomerInfo({buildingId:newVal,locationId:this.locationId}).then(res=>{
                this.showLoading = false
                console.log(res.data.data)
                this.modelInfo = res.data.data.rst
                this.modelInfo.forEach(item=>{
                    if(item.ratio != 0){
                        this.ringChartConfig.data.push({
                            name: item.moduleName,
                            value: item.ratio
                        })
                    }
                })
            })
        }
    },
    mounted(){
        
    }
}
</script>

<style lang="scss" scoped>
.goosDetail_com{
    height: calc(100% - 60px);
    width: 100%;
    position: fixed;
    top:60px;
    pointer-events:none;
    .LandParameter_box{
        position: absolute;
        padding: 30px 0 ;
        height: calc(100% - 60px);
        width: 27%;
        left:0;
        top:0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        pointer-events:auto;
        .chooseLand_box{
            height: 40px;
            width: 80%;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            .select{
                margin-left:6%;
            }
            ::v-deep .el-input__inner{
                background: transparent;
                color:white;
            }
            .new_btn{
                position: relative;
                color:white;
                font-size:12px;
                padding:8px 16px;
                letter-spacing: 1.5px;
                background: #457fca;  /* fallback for old browsers */
                background: -webkit-linear-gradient(to right, #5691c8, #457fca);  /* Chrome 10-25, Safari 5.1-6 */
                background: linear-gradient(to right, #5691c8, #457fca); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
                border-radius: 4px;
                user-select: none;
                cursor: pointer;
                &:active{
                    opacity: 0.7;
                }
            }
        }
        .info_box{
            height: 100%;
            width: 76%;
            background: rgba(47,62,70,.7);
            flex-shrink:1;
            border-radius: 8px;
            padding: 0 2%;
            display: flex;
            flex-direction: column;
            .title{
                color: rgba(191, 191, 191, 1);
                font-size: 14px;
                margin-top:16px;
                text-align: center;
            }
            .pro_info{
                padding: 2%;
                width: 96%;
                display: flex;
                flex-direction: column;
                height: 88%;
                justify-content: space-between;
                .item{
                    display: flex;
                    width: 100%;
                    .label{
                        color:#e5e5e5;
                        font-size:16px;
                        width: 30%;
                        margin-left: 15%;
                    }
                    .value{
                        margin-left: 20px;
                        color:#e5e5e5;
                        font-size:16px;
                        width: 30%;
                        margin-left: 15%;
                        color:#fcbf49;
                    }
                }
            }
           
        }
        .next_btn{
            margin-left:60%;
            border-radius: 8px;
            position: relative;
            color:white;
            font-size:12px;
            padding:8px 16px;
            letter-spacing: 1.5px;
            background: #457fca;  /* fallback for old browsers */
            background: -webkit-linear-gradient(to right, #5691c8, #457fca);  /* Chrome 10-25, Safari 5.1-6 */
            background: linear-gradient(to right, #5691c8, #457fca); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
            border-radius: 4px;
            user-select: none;
            cursor: pointer;
            &:active{
                opacity: 0.7;
            }
        }
    }
    .gql_box{
        position: absolute;
        height:30%;
        width: 40%;
        left:28%;
        bottom:2%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        background: rgba(47,62,70,.7);
        border-radius: 8px;
        pointer-events:auto;
        .title{
            text-align: center;
            color: rgba(191, 191, 191, 1);
            font-size: 14px;
            margin-top:16px;
            text-align: center;
        }
        .total_score{
            width: 100%;
            display: flex;
            text-align: center;
            justify-content: center;
            margin-top: 6px;
            margin-bottom: 6px;
            .total{
                color:#e5e5e5;
                font-size: 16px;
                line-height: 26px;
            }
            .score{
                color:#ff8d1a;
                font-size: 26px;
                font-weight: 700;
                margin-left: 10px;
                line-height: 18px;
            }
            .unit{
                color: white;
                font-size: 14px;
                margin-left: 2px;
                line-height: 26px;
            }
        }
        .bottom_box{
            height: 72%;
            width: 100%;
            display: flex;
            .bottom_left_box{
                width: 40%;
                height: 106%;
                margin-top:-3%;
                #hxpbEcharts{
                    height: 100%;
                    width: 100%;
                }
            }
            .bottom_right_box{
                width: 52%;
                height: 100%;
                margin:0 4%;
                .score_box{
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    .hx,.jz,.yl{
                        display:table-cell; /*按照单元格的样式显示元素*/
                        vertical-align:bottom; /*底对齐*/
                    }
                }
                .score_info{
                    margin-top:10px;
                    height: 70%;
                    .info_title{
                        display: flex;
                        color:white;
                        padding: 0 10%;
                        justify-content: space-around;
                        flex-shrink: 1;
                        height: 36px;
                        .bxTitle{
                            width: 50%;
                            text-align: center;
                           
                        }
                        .area{
                            width: 25%;
                            text-align: center;
                        }
                        .hxScore{
                            width: 25%;
                            text-align: center;
                        }
                    }
                    .info_box{
                        overflow-y: scroll;
                        height: 70%;
                    }
                    .info_item{
                        display: flex;
                        color:white;
                        padding: 0 10%;
                        justify-content: space-around;
                        flex-shrink: 1;
                        height: 35px;
                        .bxTitle{
                            width: 50%;
                            text-align: center;
                             text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                        }
                        .area{
                            width: 25%;
                            text-align: center;
                        }
                        .hxScore{
                            width: 25%;
                            text-align: center;
                        }
                    }
                }
            }
        }
    }
    .client_box{
        position: absolute;
        height:30%;
        width: 24%;
        right:4%;
        bottom:2%;
        background: rgba(47,62,70,.7);
        border-radius: 8px;
        pointer-events:auto;
         ::v-deep .border-box-content{
            display: flex;
            flex-direction: column;
        }
         .title{
            text-align: center;
            color: rgba(191, 191, 191, 1);
            font-size: 14px;
            margin-top:16px;
            text-align: center;
        }
        .dv-loading{
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index:999;
            color:white;
        }
        .client_box_child{
             width: 96%;
            height: 70%;
            margin: 6% 2% 0;
            display: flex;
            .left_box{
                width: 60%;
                height: 90%;
                .info_title{
                        display: flex;
                        color:white;
                        height: 40px;
                        flex-shrink: 0;
                        width: 100%;
                        justify-content: space-around;
                        .bxTitle{
                            width:30%;
                            text-align: center;
                        }
                        .area{
                            width: 35%;
                            text-align: center;
                        }
                        .hxScore{
                            width: 35%;
                            text-align: center;
                        }
                }
                .info_box{
                    height: 85%;
                    overflow-y:scroll;
                    &::-webkit-scrollbar {display:none!important}
                }
                .info_item{
                        display: flex;
                        color:white;
                        justify-content: space-around;
                        height: 35px;
                        .bxTitle{
                            width:30%;
                            text-align: center;
                        }
                        .area{
                            width: 35%;
                            text-align: center;
                        }
                        .hxScore{
                            width: 35%;
                            text-align: center;
                        }
                    }
                }
        }
        
    }
    .sellInfo_box{
        position: absolute;
        height:30%;
        width: 24%;
        right:4%;
        top:2%;
        background: rgba(47,62,70,.7);
        border-radius: 8px;
        pointer-events:auto;
         ::v-deep .border-box-content{
            display: flex;
            flex-direction: column;
        }
         .title{
            text-align: center;
            color: rgba(191, 191, 191, 1);
            font-size: 14px;
            margin-top:16px;
            text-align: center;
        }
        .sellInfo{
            width: 96%;
            height: 70%;
            padding: 6% 2% ;
            display: flex;
            flex-wrap: wrap;
            .sell_item{
                width: 50%;
                display: flex;
                color: white;
                justify-content: space-around;
                font-size: 16px;
                .sell_key{
                    width: 55%;
                    text-align: center;
                }
                .sell_val{
                    width: 45%;
                    text-align: center;
                    color:#ff8d1a;
                    font-weight: 700;
                }
            }
        }
    }
    .landInfo_box{
        position: absolute;
        height:30%;
        width: 24%;
        right:4%;
        top:35%;
        background: rgba(47,62,70,.7);
        border-radius: 8px;
        pointer-events:auto;
         ::v-deep .border-box-content{
            display: flex;
            flex-direction: column;
        }
         .title{
            text-align: center;
            color: rgba(191, 191, 191, 1);
            font-size: 14px;
            margin-top:16px;
            text-align: center;
        }
        .total_score{
            width: 100%;
            display: flex;
            text-align: center;
            justify-content: center;
            margin-top: 4px;
            .total{
                color:#e5e5e5;
                font-size: 16px;
                line-height: 26px;
            }
            .score{
                color:#ff8d1a;
                font-size: 26px;
                font-weight: 700;
                margin-left: 10px;
                line-height: 18px;
            }
            .unit{
                color: white;
                font-size: 14px;
                margin-left: 2px;
                line-height: 26px;
            }
        }
        .landInfo{
            height: 100%;
            width: 100%;
            #landEcharts{
                height: 90%;
                width: 100%;
            }
        
        }
    }
}
</style>