<template>
  <div class="basicInfo_wrap">
      <dv-border-box-12 class="basic_mask">
           <div class="detail_item" v-for="(item,index) in tableData" :key="index">
                <div class="label">{{item.label}}</div>
                <div class="value">{{item.value?item.value:'暂无'}}</div>
            </div>
      </dv-border-box-12>
  </div>
</template>

<script>
import House from "../../../api/House"
export default {
    props:['id'],
    data(){
        return{
            tableData:[]
        }
    },
    created(){
        console.log(this.id)
         House.getBasicInfo(this.id).then(res=>{
            let data = res.data.data
            this.tableData = [{
                    label:'城区',
                    value:data.buildingInfo.region
                },{
                    label:'板块',
                    value:data.buildingInfo.partname
                },{
                    label:'项目地址',
                    value:data.buildingInfo.address
                },{
                    label:'占地面积(㎡)',
                    value:data.buildingInfo.coverArea
                },{
                    label:'总建面积(万㎡)',
                    value:data.buildingInfo.totalArea
                },{
                    label:'容积率(%)',
                    value:data.buildingInfo.plotRatio
                },{
                    label:'建筑密度',
                    value:data.buildingInfo.buildingDensity
                },{
                    label:'绿化率(%)',
                    value:data.buildingInfo.greenRatio
                },{
                    label:'物业类型',
                    value:data.buildingInfo.type
                },{
                    label:'销售状态',
                    value:data.buildingInfo.saleState
                },{
                    label:'状态持续时间',
                    value:data.buildingInfo.saleDate
                },{
                    label:'开发商名称',
                    value:data.buildingInfo.developer
                },{
                    label:'关联开发企业',
                    value:data.buildingInfo.releDeve
                },{
                    label:'商业配套',
                    value:data.business
                },{
                    label:'交通配套',
                    value:data.traffic
                },{
                    label:'教育配套',
                    value:data.school
                },{
                    label:'医疗配套',
                    value:data.medical
                }]
         })
    }
}
</script>

<style lang="scss" scoped>
.basicInfo_wrap{
    height: 100%;
    width: 100%;
    position: relative;
    .basic_mask{
        position: absolute;
        top:12%;
        left:5%;
        width:40%;
        height:70%;
        background: rgba(47,62,70,.8);
        border-radius: 8px;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        align-content: flex-start;
        justify-content: flex-start;
        flex-wrap: wrap;
        padding-left:2%;
        /deep/.border-box-content{
            display: flex;
            align-items: center;
            align-content: flex-start;
            justify-content: flex-start;
            flex-wrap: wrap;
        }
        .detail_item{
            display: flex;
            align-items: center;
            color:white;
            width: 50%;
            height:36px;
            margin-top:14px;
            justify-content: space-around;
            .label{
                color:#fcbf49;
                font-weight: 700;
                width: 20%;
                text-align: left;
                white-space: nowrap;
            }
            .value{
                width: 70%;
                text-align: center;
            }
        }
    }
}
</style>