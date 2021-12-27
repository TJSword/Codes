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
                title:'土地数据',
                icon:' icon-tudi',
                menu:[{
                    name:'土地查询',
                    path:'/land/query'
                },{
                    name:'土地统计',
                    path:'/land/statistics'
                },{
                    name:'土地排行',
                    path:'/land/rank'
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