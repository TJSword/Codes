<template>
    <div class="LandReport_wrap">
        <div class="top_header">
            <div class="menu" @click="choose('/landReport/reportList')"><i class="el-icon-tickets"></i> 我的报告</div>
            <div class="menu" @click="choose('/landReport/establish')"><i class="el-icon-document-add"></i> 新建报告</div>
            <!-- <div class="new" @click="choose('/landReport/cdtest/cd')">竞品页面测试</div> -->
        </div>
        <keep-alive include="Redact">
            <router-view></router-view>
        </keep-alive>
    </div>
</template>
<script>
//组件
export default {
    name:'LandReport',
    components:{
        
    },
    methods:{
        choose(path){
            this.$router.push({
                path:path 
            })
        }
    }
}
</script>
<style lang="scss">
.LandReport_wrap{
   position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    bottom: 0px;
    display: flex;
    background: linear-gradient(161deg, #0f0f13, #628ba9);
    .top_header{
        height:40px;
        width:100%;
        // background: #55654e;
        z-index:9;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .menu{
            font-size: 13px;
            border-radius: 4px;
            padding: 4px 10px;
            margin-right: 20px;
            cursor: pointer;
            -webkit-transition: all 0.3s;
            transition: all 0.3s;
            color: #ffffff;
            &:hover{
                background: #313131;
            }
        }
    }
}
</style>