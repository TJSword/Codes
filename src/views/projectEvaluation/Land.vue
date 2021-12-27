<template>
    <div class="land_wrap">
        <div class="first_box">
            <div :class="['item',index === chooseIndex?'active':'']" v-for="(item,index) in landData" :key="index" @click="chooseLand(index)">土地{{index + 1}}</div>
        </div>
       <template v-if="isShow">
           <Table v-for="(item,index) in tableData" :key="index" :tableData='item' ></Table>
       </template>
    </div>
</template>
<script>
import Table from "@/components/main/projectevaluation/Table"
import projectevaluation from "@/api/projectevaluation" //引入api
export default {
    name:'land',
    data(){
        return{
            landData:[],
            isShow:true
        }
    },
    components:{
        Table
    },
    created(){
        console.log(this.$route.query.id)
        projectevaluation.getLand('thwU0tBd4pxIs85p').then(res=>{
            console.log(res.data.data)
            this.landData = res.data.data;
            this.chooseLand(0)
        })
       
    },
    methods:{
        chooseLand(i){
            console.log(i)
            this.chooseIndex = i;
            let data = this.landData[i]
            this.isShow = false
            this.tableData = [{
                    type:'板块基础信息',
                    arr:[{
                        label:'宗地位置',
                        value:data.address
                    },{
                        label:'宗地编号',
                        value:data.parcelNo
                    },{
                        label:'城区',
                        value:data.region
                    },{
                        label:'板块',
                        value:data.partname
                    },{
                        label:'公告号',
                        value:data.noticeNo
                    },{
                        label:'公告单位',
                        value:'政府'
                    },{
                        label:'出让方式',
                        value:data.sellType
                    },{
                        label:'公告时间',
                        value:data.noticeDate
                    },{
                        label:'出让时间',
                        value:data.sellDate
                    }]
                },{
                    type:'地块指标',
                    arr:[{
                        label:'净用地面积',
                        value:data.landArea
                    },{
                        label:'土地用途分类',
                        value:data.landUseLabel
                    },{
                        label:'商业占比上限',
                        value:data.businessRate
                    },{
                        label:'使用年限',
                        value:data.serviceLife
                    },{
                        label:'计算容积率',
                        value:data.computeRatio
                    },{
                        label:'可开发体量',
                        value:data.devVolume
                    },{
                        label:'起拍单价',
                        value:data.startPrice
                    },{
                        label:'起拍总价',
                        value:data.startSum
                    },{
                        label:'起始楼面地价',
                        value:data.floorPrice
                    },{
                        label:'保证金',
                        value:data.deposit
                    },{
                        label:'容积率',
                        value:data.volumeRatio
                    },{
                        label:'建筑密度',
                        value:data.buildingDensity
                    },{
                        label:'建筑高度',
                        value:data.buildHeigh
                    },{
                        label:'绿地率',
                        value:data.greenDensity
                    },{
                        label:'其他补充指标',
                        value:data.remark
                    }]
            }]
            console.log(this.tableData)
            this.isShow = true
        }
    }
}
</script>
<style lang="scss" scoped>
    .land_wrap{
        padding:20px 0;
        .first_box{
            display: flex;
            .item{
                margin-right:80px;
                font-size:18px;
                letter-spacing: px;
                cursor: pointer;
                transition: all 0.5s;
            }
            .active{
                color:#0084ff;
                transition: all 0.5s;
            }
        }
    }
</style>