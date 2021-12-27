<template>
  <div class="land_wrap">
      <Nav :navData ='navData'></Nav>
      <router-view></router-view>
  </div>
</template>

<script>
import Nav from '../../components/common/nav'
export default {
    components:{
        Nav
    },
    data(){
        return{
            navData:{
                title:'市场资讯',
                icon:' icon-news',
                menu:[{
                    name:'市场资讯',
                    path:'/market/news'
                },{
                    name:'新闻地图',
                    path:'/market/newsmap'
                }]
            }
        }
    }
}
</script>

<style>
.land_wrap{
    height:100%;
    width:100%;
    overflow: hidden;
}
</style>