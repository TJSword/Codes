<template>
  <div class="basicInfo_wrap">
      <dv-border-box-12 class="echart_1_mask">
          <div class="title">楼盘关注度</div>
          <div id="echarts_1"></div>
      </dv-border-box-12>
      <dv-border-box-12 class="echart_2_mask">
          <div class="title">面积段关注度</div>
          <div id="echarts_2"></div>
      </dv-border-box-12>
      <dv-border-box-12 class="echart_3_mask">
          <div class="title">单价段关注度</div>
          <div id="echarts_3"></div>
      </dv-border-box-12>
      <dv-border-box-12 class="echart_4_mask">
          <div class="title">总价段关注度</div>
          <div id="echarts_4"></div>
      </dv-border-box-12>
  </div>
</template>

<script>
import House from "@/api/houseDataApi.js"
export default {
    props:['id'],
    methods:{
        drawEcharts_1(data){
            console.log(data)
            let xAxisData = data.map(item=>item.date)
            let seriesData = data.map(item=>item.rate)
            let option = {
                xAxis: {
                type: 'category',
                // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
                    left: '4%',
                    right: '4%',
                    bottom: '4%',
                    top:'12%',
                    containLabel: true
                },
                series: [
                {
                    // data: [820, 932, 901, 934, 1290, 1330, 1320],
                    data:seriesData,
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
            let myChart = this.$echarts.init(document.getElementById('echarts_1'))
            myChart.setOption(option,true);
        },
        drawEcharts_2(data){
            let xAxisData = data.map(item=>item.area_size)
            let seriesData = data.map(item=>item.rate.toFixed(2))
            let option = {
                xAxis: {
                    type: 'category',
                    // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    data:xAxisData,
                     axisLabel:{
                    textStyle:{
                        fontSize:12,
                        color:'white',
                    },
                    interval: 0
                },
                },
                axisLabel:{
                    textStyle:{
                        fontSize:12,
                        color:'white',
                    },
                  interval: 0
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
                    left: '4%',
                    right: '4%',
                    bottom: '4%',
                    top:'12%',
                    containLabel: true
                },
                series: [
                    {
                    // data: [120, 200, 150, 80, 70, 110, 130],
                    data:seriesData,
                    type: 'bar',
                    label: {
                            normal: {
                                show: true,
                                position: 'top',
                                color:'white',
                                formatter: '{c}'
                            }
                        },
                    }
                ]
            };
            let myChart = this.$echarts.init(document.getElementById('echarts_2'))
            myChart.setOption(option,true);
        },
        drawEcharts_3(data){
            let xAxisData = data.map(item=>item.avg_size)
            let seriesData = data.map(item=>item.rate.toFixed(2))
            let option = {
                xAxis: {
                    type: 'category',
                    // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    data:xAxisData,
                     axisLabel:{
                    textStyle:{
                        fontSize:12,
                        color:'white',
                    },
                    interval: 0
                },
                },
                axisLabel:{
                    textStyle:{
                        fontSize:12,
                        color:'white',
                    },
                  interval: 0
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
                    left: '4%',
                    right: '4%',
                    bottom: '4%',
                    top:'12%',
                    containLabel: true
                },
                series: [
                    {
                    // data: [120, 200, 150, 80, 70, 110, 130],
                    data:seriesData,
                    type: 'bar',
                    label: {
                            normal: {
                                show: true,
                                position: 'top',
                                color:'white',
                                formatter: '{c}'
                            }
                        },
                    }
                ]
            };
            let myChart = this.$echarts.init(document.getElementById('echarts_3'))
            myChart.setOption(option,true);
        },
        drawEcharts_4(data){
            let xAxisData = data.map(item=>item.total_size)
            let seriesData = data.map(item=>item.rate.toFixed(2))
            let option = {
                xAxis: {
                    type: 'category',
                    data: xAxisData,
                     axisLabel:{
                    textStyle:{
                        fontSize:12,
                        color:'white',
                    },
                    interval: 0
                },
                },
                axisLabel:{
                    textStyle:{
                        fontSize:12,
                        color:'white',
                    },
                  interval: 0
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
                    left: '4%',
                    right: '4%',
                    bottom: '4%',
                    top:'12%',
                    containLabel: true
                },
                series: [
                    {
                    data:seriesData,
                    type: 'bar',
                    label: {
                            normal: {
                                show: true,
                                position: 'top',
                                color:'white',
                                formatter: '{c}'
                            }
                        },
                    }
                ]
            };
            let myChart = this.$echarts.init(document.getElementById('echarts_4'))
            myChart.setOption(option,true);
        }
    },
    created(){
        House.getCustomerInfo(this.id).then(res=>{
            console.log(res.data.data)
            this.$nextTick(_=>{
                this.drawEcharts_1(res.data.data.dateLists)
                this.drawEcharts_2(res.data.data.areaLists)
                this.drawEcharts_3(res.data.data.avgLists)
                this.drawEcharts_4(res.data.data.totalLists)
            })
        })
    },
}
</script>

<style lang="scss" scoped>
.basicInfo_wrap{
    height: 100%;
    width: 100%;
    position: relative;
    font-size:1px;
    font-size: 16px;
    .title{
        margin-top:10px;
        margin-left:16px;
        color:#EFB508;
        font-weight: 700;
    }
    .echart_1_mask{
        position: absolute;
        top:2%;
        left:3%;
        width:45%;
        height:45%;
        background: rgba(47,62,70,.8);
        border-radius: 8px;
        #echarts_1{
            height: calc(100% - 40px);
            width: 100%;
        }
    }
    .echart_2_mask{
        position: absolute;
        top:2%;
        right:3%;
        width:45%;
        height:45%;
        background: rgba(47,62,70,.8);
        border-radius: 8px;
        #echarts_2{
            height: calc(100% - 40px);
            width: 100%;
        }
    }
    .echart_3_mask{
        position: absolute;
        bottom:2%;
        left:3%;
        width:45%;
        height:45%;
        background: rgba(47,62,70,.8);
        border-radius: 8px;
        #echarts_3{
            height: calc(100% - 40px);
            width: 100%;
        }
    }
    .echart_4_mask{
        position: absolute;
        bottom:2%;
        right:3%;
        width:45%;
        height:45%;
        background: rgba(47,62,70,.8);
        border-radius: 8px;
        #echarts_4{
            height: calc(100% - 40px);
            width: 100%;
        }
    }
}
</style>