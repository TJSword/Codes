<template>
  <div class="intialAdjustment_wrap">
      <div class="LandParameter_box">
          <dv-border-box-2 class="info_box">
            <div class="title">配置各项成本</div>
            <div id="costRing"></div>
             <div class="intialAdjustment_box">
                 <div class="info_title">
                     <div style="width:50%;text-align:center">成本类别</div>
                     <div style="width:50%;text-align:center">成本总价(万元)</div>
                 </div>
                 <div class="item">
                     <div style="width:50%;text-align:center">土地成本</div>
                     <el-input v-model="form.costLand" placeholder="请输入成本" size="mini" style="width:40%;margin-left:5%"></el-input>
                 </div>
                  <div class="item">
                     <div style="width:50%;text-align:center">建安成本</div>
                     <el-input v-model="form.costTake" placeholder="请输入成本" size="mini" style="width:40%;margin-left:5%"></el-input>
                 </div>
                  <div class="item">
                     <div style="width:50%;text-align:center">设计成本</div>
                     <el-input v-model="form.costDesign" placeholder="请输入成本" size="mini" style="width:40%;margin-left:5%"></el-input>
                 </div>
                  <div class="item">
                     <div style="width:50%;text-align:center">销售成本</div>
                     <el-input v-model="form.costSalse" placeholder="请输入成本" size="mini" style="width:40%;margin-left:5%"></el-input>
                 </div>
                  <div class="item">
                     <div style="width:50%;text-align:center">其他成本</div>
                     <el-input v-model="form.costOther" placeholder="请输入成本" size="mini" style="width:40%;margin-left:5%"></el-input>
                 </div>
                 <div class="total">
                     <div style="width:50%;text-align:center">总计</div>
                     <div style="width:50%;text-align:center">{{(form.costLand*1)+(form.costTake*1)+(form.costDesign*1)+(form.costSalse*1)+(form.costOther*1)}}</div>
                 </div>
                 <div class="save_btn" @click="saveCost">保存</div>
             </div>
          </dv-border-box-2>
          <div class="next_btn" @click="currentMenu">下一步</div>
      </div>
      <dv-border-box-2 class="res_box">
          <div class="title">初步客研结果</div>
          <div id="hxpbEchart"></div>
         <dv-loading v-if="showLoading">正在计算...</dv-loading>
          <div class="bottom_box" v-else>
              <div class="bottom_left_box">
                    <div class="item_res" @mouseenter="showPriceBox = true" @mouseleave="showPriceBox = false">
                        <div class="title">建议销售均价</div>
                        <div class="value">
                            <span class="value_num">{{priceInfo.price_zt}}</span>
                            <span class="unit">元/㎡</span>
                        </div>
                    </div>
                    <div class="item_res">
                        <div class="title">预估去化周期</div>
                        <div class="value">
                            <span class="value_num">{{qhzq}}</span>
                            <span class="unit">年</span>
                        </div>
                    </div>
                    <div class="item_res">
                        <div class="title">预估利润率</div>
                        <div class="value">
                            <span class="value_num">{{lrl?lrl:'-'}}</span>
                            <span class="unit">%</span>
                        </div>
                    </div>
              </div>
              <div class="bottom_right_box">
                   <dv-active-ring-chart :config="ringConfig" style="width:120%;height:120%;"/>
              </div>
          </div>
          <dv-border-box-7 :class="['price_box',showPriceBox?'price_box_active':'']">
              <div class="pic_title">
                  <span style="font-size:18px;color:rgba(255, 141, 26, 1);font-weight:700;margin-right:6px">精装</span>建议销售均价
              </div>
              <div class="pic_num">
                   <span style="font-size:24px;color:rgba(255, 141, 26, 1);font-weight:700;margin-right:6px">{{priceInfo.price_jz=== 0?'-':priceInfo.price_jz}}</span>元/㎡
              </div>
               <div class="pic_title" style="margin-top:2px">
                  <span style="font-size:18px;color:rgba(255, 141, 26, 1);font-weight:700;margin-right:6px;">毛坯</span>建议销售均价
              </div>
              <div class="pic_num">
                   <span style="font-size:24px;color:rgba(255, 141, 26, 1);font-weight:700;margin-right:6px">{{priceInfo.price_mp === 0?'-':priceInfo.price_mp}}</span>元/㎡
              </div>
          </dv-border-box-7>
      </dv-border-box-2>
  </div>
</template>

<script>
import locationResearch from "../../api/locationResearch"
import { mapGetters } from "vuex"
import { suDoorRatio } from '@/utils/report_qh'
export default {
    computed:{
        ...mapGetters(['locationId','point','circleTime','map'])
    },
    data(){
        return{
            token:'pk.eyJ1IjoiMTU5MDk4Mzk1NjQiLCJhIjoiY2tpZmt0MThrMGtwcTJ5bngxN2xqNnYzeCJ9.erBGt3UuT5gNjeD-d_p_VA',
            echartsData:[],
            showRing:true,
            isSave:false,
            lrl:null,
            form:{
                costLand:'',
                costTake:'',
                costDesign:'',
                costSalse:'',
                costOther:'',
                locationId:''
            },
            showPriceBox:false,
            qhzq:'',
            showLoading:true,
            priceInfo:{},
            ringConfig:{
                data:[],
                activeTimeGap:1500,
                radius:'60%',
                activeRadius:'65%',
                lineWidth:20,
                color:['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#f07167', '#e76f51','#cb997e','#4361ee','#073b4c','#577590','#197278','#84a98c']
             },
             ringData:[
                 {
                    name:'土地成本',
                    value:1
                },{
                    name:'建安成本',
                    value:1
                },{
                    name:'设计成本',
                    value:1
                },{
                    name:'销售成本',
                    value:1
                },{
                    name:'其他成本',
                    value:1
                }
             ]
        }
    },
    methods:{
        costRing_init(){
            let myChart = this.$echarts.init(document.getElementById('costRing'))
            let option = {
                 title: {
                    text: '成本环形图',
                    left: 'center',
                    top:'center',
                    textStyle:{
                        color:'white'
                    }
                },
                tooltip: {
                    trigger: 'item',
                     formatter: '{b} {c}万元 ({d}%)',
                },
                label: {
                    alignTo: 'edge',
                   
                    minMargin: 5,
                    edgeDistance: 10,
                    lineHeight: 15,
                    rich: {
                        time: {
                            fontSize: 10,
                            color: '#999'
                        }
                    }
                },
                series: [
                    {
                        name: '成本类别',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        data: this.ringData
                    }
                ]
            };
            myChart.setOption(option,true);
        },
        hxpbEchart_init(){
            let myChart = this.$echarts.init(document.getElementById('hxpbEchart'))
            // var colors = ['#5470C6', '#91CC75', '#EE6666'];
            let echartsData = this.echartsData
            let yAxisData = []
            let xAxisData = []
            echartsData.forEach(item=>{
                yAxisData.push(item.areaSize)
                xAxisData.push(item.areaVal)
            })
            var option = {
                title: {
                    text: '户型配比(%)',
                    left:"5%",
                    textStyle:{
                        color:"#eee",
                        fontWeight:100,
                        fontSize:16
                     }
                },
                
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter:"{b}<br/> {c}%"
                },
                grid: {
                    top: '15%',
                    bottom: '0%',
                    left:'1%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    nameTextStyle:{
                        color:'#eee'
                    },
                   
                },
                yAxis: {
                    type: 'category',
                    data: yAxisData,
                    axisLabel: {
                        show: true,
                        interval: 0,
                        textStyle: {
                            color: '#eee',  //更改坐标轴文字颜色
                            fontSize : 14      //更改坐标轴文字大小
                        },
                        axisLine:{
                            show:false
                        }
                    },
                },
                series: [
                    {
                        type: 'bar',
                        data: xAxisData,
                        label: {
                            show: true,
                            position: 'right'
                        },
                    }
                ],
            };
        myChart.setOption(option,true);
        },
        getHXPB(){
            locationResearch.getHxpb(this.locationId).then(res=>{
                let data = suDoorRatio(res.data.data.data,res.data.data.area)
                let arr = []
                console.log(data)
                for(var key in data){
                    if(data[key] >0.01){
                        arr.push({
                            areaSize:key,
                            ratio:data[key],
                            sort:key.split('-')[0] * 1
                        })
                    }
                }
                function compare(key){
                    return function(a,b){
                        return  b[key] - a[key] 
                    }
                }
                arr.sort(compare('sort'))
                arr.forEach(item=>{
                   // item.areaVal = ((item.ratio * res.data.data.house_area)/((item.areaSize.split('-')[0]*1 + item.areaSize.split('-')[1]*1)/2)).toFixed(0)
                    item.areaVal = (item.ratio* 100).toFixed(1)
                })
                console.log(arr) 
                this.echartsData = arr
                locationResearch.computedPrice({
                    locationId:this.locationId,
                    ratioList:arr
                }).then(res=>{
                    this.showLoading = false
                    console.log(res.data.data)
                    this.priceInfo = res.data.data
                    let data = res.data.data.form
                    let customer = []
                    data.forEach(item=>{
                        if(item.ratio != 0 ){
                            customer.push({
                                name:item.moduleName,
                                value:item.ratio
                            })
                        }
                    })
                    this.ringConfig.data = customer
                })
                locationResearch.getCycle(this.locationId).then(res=>{
                    this.qhzq = res.data.data.qhzq
                })
                this.$nextTick(_=>{
                    this.hxpbEchart_init()
                })
                
            })
        },
        saveCost(){
                if(this.form.costLand === '' || this.form.costTake === ''||this.form.costDesign === ''||this.form.costSalse === ''||this.form.costOther === ''){
                    this.$message({
                        type:'warning',
                        message:'请完善所有成本'
                    })
                    return
                }
                this.ringData = [{
                    name:'土地成本',
                    value:this.form.costLand
                },{
                    name:'建安成本',
                    value:this.form.costTake
                },{
                    name:'设计成本',
                    value:this.form.costDesign
                },{
                    name:'销售成本',
                    value:this.form.costSalse
                },{
                    name:'其他成本',
                    value:this.form.costOther
                }]
                this.costRing_init()
                locationResearch.saveCost(this.form).then(res=>{
                    if(res.data.code === 0){
                        this.isSave = true
                        this.lrl = (res.data.data.lrl *100).toFixed(2)
                        this.$message({
                            type:'success',
                            message:'成本保存成功'
                        })
                    }
                })
         },
         currentMenu(){
             if(!this.isSave){
                 this.$message({
                     type:'warning',
                     message:'请先保存成本'
                 })
                 return
             }
            this.map.removeLayer('goodsPoints')
            this.map.removeLayer('goodsName')
            this.map.removeLayer('house_point')
            this.map.removeLayer('timeCircle_fill')
            this.map.removeLayer('timeCircle_line')
            this.map.removeSource('pointSource')
            this.map.removeSource('timeCircle')
            this.map.removeImage('land-dot')
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'    
            });
            setTimeout(() => {
                loading.close();
                this.$router.push({
                    name:'LocationDecision'
                    })
            }, 1000);
        },
    },
    created(){
        this.form.locationId = this.locationId
        this.getHXPB()
    },
    mounted(){
        this.costRing_init()
    }
}
</script>

<style lang="scss" scoped>
.intialAdjustment_wrap{
    height: calc(100% - 60px);
    width: 100%;
    position: fixed;
    top:60px;
    pointer-events: none;
    .LandParameter_box{
        position: absolute;
        padding: 30px 0 ;
        height: calc(100% - 60px);
        width: 25%;
        left:0;
        top:0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        pointer-events:auto;
        .info_box{
            height: 85%;
            width: 76%;
            background: rgba(47,62,70,.7);
            flex-shrink:1;
            border-radius: 8px;
            padding: 0 2%;
            display: flex;
            flex-direction: column;
            #costRing{
                height: 36%;
                width: 100%;
            }
            .title{
                color: rgba(191, 191, 191, 1);
                font-size: 14px;
                margin-top:16px;
                text-align: center;
            }
            .intialAdjustment_box{
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                height: 55%;
                .info_title{
                    display: flex;
                    color:white;
                    font-size: 18px;
                    margin-bottom: 20px;
                }
                .item{
                    display: flex;
                    color:white;
                    font-size: 16px;
                    margin-bottom: 12px;
                    ::v-deep .el-input__inner{
                        background: transparent;
                        color: white;
                    }
                }
                .total{
                    display: flex;
                    color:white;
                    font-size: 18px;
                }
                .save_btn{
                    margin-top:20px;
                    border-radius: 8px;
                    position: relative;
                    color:white;
                    font-size:12px;
                    padding:8px 20px;
                    width: fit-content;
                    margin-left: 70%;
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
    .res_box{
        position: absolute;
        height:74%;
        width: 22%;
        right:4%;
        bottom:16%;
        display: flex;
        align-items: center;
        background: rgba(47,62,70,.7);
        border-radius: 8px;
        pointer-events:auto;
        .title{
            color: rgba(191, 191, 191, 1);
            font-size: 14px;
            margin-top:16px;
            text-align: center;
        }
        #hxpbEchart{
            width: 90%;
            height: 40%;
            margin-left: 5%;
        }
        .dv-loading{
            height: 50%;
            width: 100%;
            color:white;
        }
        .bottom_box{
            height: 50%;
            width: 100%;
            display: flex;
            align-items: center;
            .bottom_left_box{
                width: 50%;
                height: 100%;
                .item_res{
                    width: 70%;
                    padding: 10px 0;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    margin-left:30%;
                    .title{
                        color:rgba(191, 191, 191, 1);
                        font-size: 14px;
                    }
                    .value{
                        white-space: nowrap;
                        .value_num{
                            color:rgba(255, 141, 26, 1);
                            font-size: 30px;
                            font-weight: 700;
                        }
                        .unit{
                            color:white;
                            margin-left: 4px;
                            font-size: 14px;
                        }
                    }
                }
            }
            .bottom_right_box{
                width: 60%;
                height: 120%;
                display: flex;
                justify-content: center;
                align-content: center;
            }
        }
        .price_box{
            height: 130px;
            width: 128px;
            background: rgba(47,62,70,.7);
            border-radius: 8px;
            position: absolute;
            bottom: 32%;
            left:-160px;
            padding: 10px 16px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            transform: scale(0);
            transition: all 0.3s ease;
            .pic_title{
                color:rgba(191, 191, 191, 1);
                font-size: 14px;
            }
            .pic_num{
                 color:rgba(191, 191, 191, 1);
                font-size: 16px;
            }
        }
        .price_box_active{
            transform: scale(1);
            transition: all 0.3s ease;
        }
    }
}
</style>