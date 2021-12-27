<template>
    <div class="basics_wrap">
       <div class="header">
            <div class="swiper">
                <el-carousel trigger="click" height="350px">
                <el-carousel-item v-for="(item,index) in imgArr" :key="index">
                    <img :src="item" alt="" class="swiper_item">
                </el-carousel-item>
                </el-carousel>
           </div>
           <div class="map">地图</div>
       </div>
       <Table :tableData="tableData"></Table>
       <ImageBabel :labelData="labelData"></ImageBabel>
       <Comments :commentsData="commentsData"></Comments>
       <!-- <Correlation></Correlation> -->
    </div>
</template>
<script>
import Table from '@/components/main/projectevaluation/Table';
import ImageBabel from '@/components/main/projectevaluation/ImageBabel';
import Comments from "@/components/main/projectevaluation/comments";
import Correlation from "@/components/main/projectevaluation/Correlation"
import projectevaluation from "@/api/projectevaluation" //引入api
export default {
    name:'basics',
    data(){
        return{
            labelData:{},
            tableData:{},
            imgArr:[],
            commentsData:{}
        }
    },
    components:{
        Table,
        ImageBabel,
        Comments,
        Correlation
    },
    created(){
        projectevaluation.getjcgk(this.$route.query.id).then(res=>{
            console.log(res)
            let jcxx = res.data.data.buildingDTO; //基础信息表格
            console.log(jcxx)
            let jcxxArr = [{
                    label:'项目名称',
                    value:jcxx.name
                },{
                    label:'楼盘地址',
                    value:jcxx.address
                },{
                    label:'开发商',
                    value:jcxx.developer
                },{
                    label:'物业公司',
                    value:jcxx.propertyCompany
                },{
                    label:'所属板块',
                    value:jcxx.partname
                },{
                    label:'建筑形态',
                    value:jcxx.buildForm
                },{
                    label:'物业类型',
                    value:jcxx.type
                },{
                    label:'开盘时间',
                    value:jcxx.saleDate
                },{
                    label:'交付时间',
                    value:jcxx.completeDate
                },{
                    label:'销售状态',
                    value:jcxx.saleState
            }]
            let jcxxObj = {
                type:'基础信息',
                arr:jcxxArr
            }
            this.tableData = jcxxObj
            this.labelData = { //印象标签
                code:"",
                pcode:'',
                objId:this.$route.query.id,
            }
            let imgArr = jcxx.imageUrl.split(',') //轮播图
            this.imgArr = imgArr
             //评论详情传值
            this.commentsData = {
                topicId:this.$route.query.id
            }
        })
    }
}
</script>
<style lang="scss" scoped>
    .basics_wrap{
        padding:20px 0;
        .header{
            display: flex;
            justify-content: space-between;
            .swiper{
                width:45%;
                height:350px;
                .swiper_item{
                    object-fit: cover;
                    height:100%;
                    width:100%;
                }
            }
            .map{
                height:350px;
                width:45%;
                border:1px solid black;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size:40px;
            }
        }
         
    }
   
</style>