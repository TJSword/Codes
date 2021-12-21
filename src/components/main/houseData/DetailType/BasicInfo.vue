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
import House from "@/api/houseDataApi.js"
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
             console.log(res)
            let data = res.data.data.build_info
            this.tableData = [{
                    label:'城区',
                    value:data.region
                },{
                    label:'板块',
                    value:data.partname
                },{
                    label:'占地面积',
                    value:data.useArea
                },{
                    label:'总建面积',
                    value:data.buildArea
                },{
                    label:'容积率',
                    value:data.plotRatio
                },{
                    label:'绿化率',
                    value:data.greenRatio
                },{
                    label:'物业类型',
                    value:data.type
                },{
                    label:'销售状态',
                    value:data.saleState
                },{
                    label:'开发商名称',
                    value:data.developer
                },{
                    label:'产权年限',
                    value:data.rightYear
                },{
                    label:'总户数',
                    value:data.houseTotal 
                },{
                    label:'楼栋总数',
                    value:data.floorTotal
                },{
                    label:'停车位',
                    value:data.park
                },{
                    label:'物业公司',
                    value:data.propertyCompany
                },{
                    label:'物业费',
                    value:data.fee
                },{
                    label:'交房时间',
                    value:data.subDate
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
    font-size:1px;
    font-size: 16px;
    .basic_mask{
        position: absolute;
        top:calc(48% - 250px);
        left:5%;
        width:622px;
        height:500px;
        background: rgba(47,62,70,.8);
        border-radius: 8px;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        align-content: flex-start;
        justify-content: flex-start;
        flex-wrap: wrap;
        padding-left:2%;
        ::v-deep .border-box-content{
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
            margin-top:16px;
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