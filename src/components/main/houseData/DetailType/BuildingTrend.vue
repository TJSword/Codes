<template>
  <div class="buildingTrend_wrap">
      <el-form :inline="true" :model="formInline" size="small" style="margin-left:4px">
        <el-form-item label="">
            <el-select v-model="formInline.dataType" placeholder="数据类型"  clearable>
                <el-option :label="item.label" :value="item.value" v-for="item in dataArr" :key="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="" v-show="isShow">
            <el-select v-model="formInlineName" placeholder="请先选择数据类型" clearable multiple :collapse-tags="true">
            <el-option :label="item.label" :value="item.value" v-for="item in propertyArr" :key="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="">
            <el-select v-model="formInline.status" placeholder="数据分类" clearable :collapse-tags="true">
                <el-option :label="item.label" :value="item.value" v-for="item in statusArr" :key="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-date-picker type="month" placeholder="开始日期" v-model="formInline.startDate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
        </el-form-item>
            <el-form-item>
            <el-date-picker type="month" placeholder="结束日期" v-model="formInline.endDate"  value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item style="width:100px;">
              <div class="query_btn"  @click="onSubmit">查询</div>
        </el-form-item>
    </el-form>
    <dv-border-box-12 class="charts_box">
        <div id="charts"></div>
    </dv-border-box-12>
    
  </div>
</template>
<script>
import House from "@/api/houseDataApi.js"
export default {
    props:['id'],
    data(){
        return{
            formInline:{
                buildingId:'',
                dataType:'',
                name:"",
                startDate:"",
                endDate:"",
                status:''
            },
            dataArr:[],
            formInlineName:[],
            propertyArr:[],
            isShow:false,
            statusArr:[{
              label:'认购',
              value:'sub'
            },{
              label:'备案',
              value:'record'
            }]
        }
    },
    watch:{
        'formInline.dataType':{
            handler(newVal){
                console.log(newVal)
                if(newVal === ''){
                    this.isShow = false
                }else{
                    this.isShow = true
                    House.getDict(newVal).then(res=>this.propertyArr = res.data.data)
                }
            }
        },
        formInlineName:{
            handler(newVal){
                this.formInline.name = newVal.join(',')
            }
        }
    },
    methods:{
        drawChart(){
             let myChart = this.$echarts.init(document.getElementById('charts'))
             let option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            crossStyle: {
                                color: '#999'
                            }
                        }
                    },
                    legend: {
                        data: ['销售面积', '新增面积', '销售均价'],
                        textStyle:{
                        color:'white'
                        },
                        top:12,
                    },
                    dataZoom :{
                        orient:"horizontal", //水平显示
                        show:true, //显示滚动条
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: this.xAxis,
                            axisPointer: {
                                type: 'shadow'
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '面积(万㎡)',
                            axisLabel: {
                            show: true,
                            formatter: '{value} ',
                            textStyle: {
                                color: '#fff'
                            }
                        },
                        nameTextStyle:{
                            color:"white", 
                            fontSize:12,  
                            padding:10
                        },
                        splitLine:{
                    　　　　show:true
                    　　 }
                        },
                        {
                            type: 'value',
                            name: '销售均价(元/㎡)',
                            axisLabel: {
                            show: true,
                            formatter: '{value}',
                            textStyle: {
                                color: '#fff'
                            }
                        },
                        nameTextStyle:{
                            color:"white", 
                            fontSize:12,  
                            padding:10
                        },
                        splitLine:{
                    　　　　show:false
                    　　 }
                        }
                    ],
                    series: [
                        {
                            name: '销售面积',
                            type: 'bar',
                            data: this.xsarea,
                            itemStyle:{
                            normal:{
                                color: '#98c1d9'
                               }
                            },
                        },
                        {
                            name: '新增面积',
                            type: 'bar',
                            data: this.xzarea,
                            itemStyle:{
                                normal:{
                                    color: '#e09f3e'
                                }
                            },
                        },
                        {
                            name: '销售均价',
                            type: 'line',
                            yAxisIndex: 1,
                            data: this.xsamount,
                            symbol:'none',
                            smooth:true,
                            itemStyle:{
                                normal:{
                                    color: '#ee6c4d'
                                }
                            },
                        }
                    ]
                };
                myChart.setOption(option,true);
                myChart.getZr().on('click', params => {
                let pointInPixel = [params.offsetX, params.offsetY]
                if (myChart.containPixel('grid', pointInPixel)) {
                        let xIndex = myChart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0]
                        console.log(xIndex)
                    }
                })
        },
        onSubmit(){
                House.getTrendList(this.formInline).then(res=>{
                let data = res.data.data;
                console.log(data)
                let xAxis = [];
                let xsarea = [];
                let xzarea = [];
                let xsamount = [];
                data.forEach(item=>{
                   if(item.dd.length > 4){
                        xAxis.push(item.dd.slice(0,4) + '年' + item.dd.slice(5) + '月')
                    }else{
                        xAxis.push(item.dd.slice(0,4) + '年')
                    }
                    xsarea.push(item.xsarea)
                    xzarea.push(item.xzarea)
                    xsamount.push(item.ave)
                })
                this.xAxis = xAxis
                this.xsarea = xsarea
                this.xzarea = xzarea
                console.log(111111111111,xsamount)
                this.xsamount = xsamount
                this.$nextTick(_=>{
                    this.drawChart()
                })
            })
        }
    },
    created(){
        this.formInline.buildingId = this.id
        House.getTrendList(this.formInline).then(res=>{
            let data = res.data.data;
            console.log(data)
            let xAxis = [];
            let xsarea = [];
            let xzarea = [];
            let xsamount = [];
            data.forEach(item=>{
                if(item.dd.length > 4){
                    xAxis.push(item.dd.slice(0,4) + '年' + item.dd.slice(5) + '月')
                }else{
                    xAxis.push(item.dd.slice(0,4) + '年')
                }
                xsarea.push(item.xsarea)
                xzarea.push(item.xzarea)
                xsamount.push(item.ave)
            })
            console.log(xzarea)
            this.xAxis = xAxis
            this.xsarea = xsarea
            this.xzarea = xzarea
            this.xsamount = xsamount
            this.$nextTick(_=>{
                this.drawChart()
            })
        })
        House.getDict('data_type').then(res=>this.dataArr = res.data.data)
        House.getDict('property_type_newhouse').then(res=>this.propertyArr = res.data.data)
    },
    mounted(){
        
    }
}
</script>

<style lang="scss" scoped>
.buildingTrend_wrap{
    height:100%;
    width:100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .el-form-item{
      width:158px;
      margin-right: 14px;
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
     ::v-deep .el-select{
        width: 100%;
      }
     ::v-deep .el-select__tags{
        max-width: 180px!important;
        white-space: nowrap!important;
        display: flex!important;
      }
     ::v-deep .el-tag{
        background:  #4B79A1;
        color:white;
      }
      .query_btn{
        margin-left: 10px;
        margin-top:0;
        color:white;
        font-size:13px;
        height:34px;
        width:92px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: -webkit-linear-gradient(to right, #2a5298, #1e3c72);  /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #2a5298, #1e3c72); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        border-radius: 4px;
        user-select: none;
        cursor: pointer;
        &:active{
            opacity: 0.7;
        }
      }
    }
    .charts_box{
        height:calc(100% - 60px);
        width:100%;
        background: rgba(47,62,70,.8);
        border-radius: 8px;
        ::v-deep .border-box-content{
          position: relative;
          z-index: 666;
      }
    }
    #charts{
        margin-top:2%;
        height:90%;
        width:100%;
    }
}
</style>