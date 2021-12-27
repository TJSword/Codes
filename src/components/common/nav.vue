<template>
  <div class="nav_wrap">
      <div :class="['iconfont',navData.icon]"></div>
      <div class="title">{{navData.title}}</div>
      <div :class="['menu_item',$route.path === item.path?'menu_item_active':'']" v-for="(item,index) in navData.menu" :key="index" @click="skip(item.path)">{{item.name}}</div>
      <div class="back_btn" @click="skipHome">返回主页</div>
  </div>
</template>

<script>
export default {
    props:['navData'],
    // {
    //     title:'土地数据',
    //     icon:' icon-tudi',
    //     menu:[{
    //         name:'土地查询',
    //         path:'land/query'
    //     },{
    //         name:'土地统计',
    //         path:'land/statistics'
    //     },{
    //         name:'土地排行',
    //         path:'land/rank'
    //     }]
    // }
    methods:{
        skip(path){
            if(this.$route.path !== path){ //判断当前路由是否是要跳转的路由
                this.$router.push(path)
            }
        },
        skipHome(){
            this.$router.push('/')
        }
    }
}
</script>

<style lang="scss" scoped>
.nav_wrap{
    height: 59px;
    width: 100%;
    background: rgba(25,22,22,1);
    border-bottom:1px solid rgba(255,255,255,.2);
    display: flex;
    align-items: center;
    position: relative;
    z-index: 10;
    .iconfont{
        color:white;
        margin-left:50px;
    }
    .title{
        font-size:22px;
        color:white;
        margin-left:10px;
        font-weight: 700;
        user-select: none;
    }
    .menu_item{
        color:white;
        font-size:15px;
        margin-left:140px;
        cursor: pointer;
        user-select: none;
    }
    .menu_item_active{
        color:#219ebc;
        font-weight: 700;
    }
    .back_btn{
        position: absolute;
        right:60px;
        color:white;
        font-size:12px;
        padding:8px 12px;
        background: #4B79A1;  /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #283E51, #4B79A1);  /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #283E51, #4B79A1); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        border-radius: 4px;
        user-select: none;
        cursor: pointer;
        &:active{
            opacity: 0.7;
        }
    }
}

</style>