<template>
    <div class="childDetail_wrap">
        <div class="first_box" v-if="showFirstBox">
            <div class="item" v-for="(item,index) in 6" :key="index">户型</div>
        </div>
        <div class="second_box">

        </div>
        <div class="header">
            <div class="block">
                <el-carousel trigger="click" height="350px">
                    <el-carousel-item v-for="item in imgArr" :key="item">
                       <img :src="item" alt="" class="item">
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div class="information_box">
                <div class="title">基本信息</div>
                <div class="line"></div>
                <div class="info_detail">
                   <div class="item" v-for="(item,index) in basicsDetail" :key="index">
                       <div class="item_title">{{item.label}}</div>
                       <!-- 所属项目，开发商，调研时间。区划 -->
                       <div class="item_value">{{item.value}}</div>
                   </div>
                </div>
            </div>
        </div>
        <Table :tableData = 'tableData'></Table>
        <ImageBabel :labelData = 'labelData'></ImageBabel>
        <Comments :commentsData='commentsData'></Comments>
        <Correlation :correlationData='correlationData'></Correlation>
    </div>
</template>
<script>
import Table from "@/components/main/projectevaluation/Table";
import ImageBabel from "@/components/main/projectevaluation/ImageBabel"
import Comments from "@/components/main/projectevaluation/comments";
import Correlation from "@/components/main/projectevaluation/Correlation"
import projectevaluation from "@/api/projectevaluation" //引入api
export default {
    name:'projectorienttation',
    data(){
        return{
            showFirstBox:true,
            id:'',
            basicsDetail:[],
            imgArr:[],
            tableData:{},
            id:'',
            correlationData:{}
        }
    },
    components:{
        Table,
        ImageBabel,
        Comments,
        Correlation
    },
    created(){
       
    },
    watch:{
        '$route':{
            handler(to,from){
                console.log(to)
                this.id = to.query.id
                if(to.name == 'Planning'){
                    this.showFirstBox = false
                    projectevaluation.getPlanningData(this.id).then(res=>{
                        console.log(res.data.data)
                        // 基本信息详情
                        let data = res.data.data.buildingGhDTO
                        this.basicsDetail = [{
                            label:'所属项目',
                            value:data.buildingName
                        },{
                            label:'开发商',
                            value:data.developer
                        },{
                            label:'调研时间',
                            value:data.buildingDate
                        },{
                            label:'所属区划',
                            value:data.region
                        }]
                        //轮播图
                        this.imgArr = data.imageUrl.split(',')
                        //项目规划标签
                        this.id = data.id
                        this.labelData = {
                            code:"",
                            pcode:'',
                            objId:this.id,
                        }
                        this.commentsData = {
                            topicId:this.id
                        }
                        //表格详情
                        this.tableData = {
                            type:'规划信息',
                            arr:[{
                                    label:'占地面积',
                                    value:data.coverArea
                                },{
                                    label:'容积率',
                                    value:data.volumeRatio
                                },{
                                    label:'车位占比',
                                    value:data.stallRate
                                },{
                                    label:'交付时间',
                                    value:data.deliveryDate
                                },{
                                    label:'车位数量',
                                    value:data.stallNum
                                },{
                                    label:'建筑面积',
                                    value:data.buildingArea
                                },{
                                    label:'总户数',
                                    value:data.householdsTotal
                                },{
                                    label:'首开时间',
                                    value:data.firstDate
                                },{
                                    label:'板块',
                                    value:data.partname
                                },{
                                    label:'绿化率',
                                    value:data.greenRate
                                },{
                                    label:'周边交通',
                                    value:''
                                },{
                                    label:'周边教育',
                                    value:''
                                },{
                                    label:'周边商业',
                                    value:''
                                },{
                                    label:'周边医疗',
                                    value:''
                             }]
                        }
                        this.correlationData={
                            type:'note',
                            path:to.name.toLowerCase(),
                            id:this.id
                        }
                    })
                }else if(to.name == 'Product'){
                    this.showFirstBox = true

                }else if(to.name == 'Marketing'){
                    this.showFirstBox = true
                }

            },
            immediate:true,
            deep:true
        },
        
    }
}
</script>
<style lang="scss" scoped>
    .childDetail_wrap{
        padding:20px 0;
        .first_box{
            display: flex;
            margin-bottom: 20px;
            .item{
                margin-right:100px;
                font-size:18px;
            }
        }
        .header{
            display: flex;
            .block{
                width:55%;
                background: hotpink;
                .item{
                    height:100%;
                    width:100%;
                }
            }
            .information_box{
                width:35%;
                margin-left:10%;
                .title{
                    font-size:20px;
                }
                .line{
                    width:100%;
                    height:1px;
                    background: rgba(0,0,0,0.17);
                    margin-top:14px;
                }
                .info_detail{
                    .item{
                        display: flex;
                        width:100%;
                        font-size:16px;
                        margin-top:25px;
                        .item_title{
                            white-space: nowrap;
                            color:rgba(166,166,166);
                            width:120px;
                        }
                    }
                }
            }
        }
    }
</style>