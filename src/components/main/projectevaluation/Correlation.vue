<template>
    <div class="correlation_wrap">
         <div class="header">
           <div class="title">{{correlationData.type ==='note'?'相关笔记':'相关案例'}}</div>
           <el-button type="primary" size="medium" v-if="correlationData.type ==='note'" @click="jumpToWriteNote">新建笔记</el-button>
       </div>
        <div class="line"></div>
       <div class="correlation_box">
           <Card v-for="(item,index) in showAll?cardArr:cardArr.slice(0,4)" :key="index" :cardData='item'></Card>
       </div>
       <div class="tip" @click="showAll = !showAll">{{showAll?'收起':'查看更多笔记'}}</div>
    </div>
</template>
<script>
import Card  from "./Card"
import projectevaluation from "@/api/projectevaluation" //引入api
export default {
    name:'correlation',
    props:{
        correlationData:Object
    },
    components:{
        Card
    },
    data(){
        return{
            cardArr:[],
            showAll:false
        }
    },
    watch:{
        correlationData:{
            handler(newVal){
                if(this.correlationData.type ==='note'){
                    projectevaluation.getCorrelation(newVal.id).then(res=>{
                      console.log(res.data.data)
                      this.cardArr =res.data.data
                    })
                }
                
            }
        }
    },
    created(){

    },
    methods:{
        jumpToWriteNote(){
            this.$router.push({
                path:'/projectDetail/' +correlationData.path + '/writeNote'
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .correlation_wrap{
        margin-top:20px;
        .header{
            display: flex;
            align-items: center;
            justify-content: space-between;
            .title{
                font-size:20px;
                user-select: none;
            }
        }
        .line{
            width:100%;
            height:1px;
            background: rgba(0,0,0,0.17);
            margin-top:14px;
        }
        .correlation_box{
            padding-top:20px;
            display: flex;
            flex-wrap: wrap;
            overflow: hidden;
        }
        .tip{
            width:100%;
            text-align: center;
            margin-top:2px;
            margin-bottom: 10px;
            cursor: pointer;
            user-select: none;
        }
    }
</style>