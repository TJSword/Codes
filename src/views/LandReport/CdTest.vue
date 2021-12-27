<template>
    <!-- 测试页面 -->
    <div class="cd_test">
        <div class="head">
            <div class="head_item" v-for="item in routerArr" :key="item.router" @click="toPath(item.router)">{{item.name}}</div>
        </div>
        <div class="cont" :style="{'width':pageW+'px','height':pageH+'px'}">
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </div>
    </div>
</template>
<script>
//组件

export default {
    name:'cd_test',
    components:{
        
    },
    data(){
        return{
            pageW:window.innerWidth*0.7,
            pageH:window.innerWidth*0.7*9/16,
            routerArr:[
                { name:'竞品选择',router:'/landReport/cdtest/cd' },
                { name:'竞品信息',router:'/landReport/cdtest/cdinfo' },
                { name:'竞品去化销量',router:'/landReport/cdtest/cdqh' },
                { name:'户型配比',router:'/landReport/cdtest/houseratio' },
                { name:'价格拟合',router:'/landReport/cdtest/pricefitting' }
            ]
        }
    },
    methods:{
        toPath(path){
            this.$router.push({
                path:path 
            })
        }
    }
}
</script>
<style lang="scss">
.cd_test{
    position: absolute;
    padding: 0 10%;
    width: 80%;
    left: 0;
    top: 40px;
    bottom: 0px;
    display: flex;
    flex-wrap: wrap;
    background:#fff;
    justify-content: center;
    .head{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 4%;
        .head_item{
            font-size: 20px;
            font-weight: bold;
            padding: 0 10px;
            color: #333;
            cursor: pointer;
        }
    }
    .cont{
        box-shadow: 0 0 3rem -1rem rgba(0,0,0,0.4);
    }
}
</style>