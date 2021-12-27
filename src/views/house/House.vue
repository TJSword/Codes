<template>
  <div class="house_wrap">
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
                title:'房产数据',
                icon:'icon-fangchan',
                menu:[{
                    name:'项目查询',
                    path:'/house/query'
                },{
                    name:'数据统计',
                    path:'/house/statistics'
                },{
                    name:'楼盘动态',
                    path:'/house/news'
                },{
                    name:'房产排行',
                    path:'/house/rank'
                }]
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.house_wrap{
  height:100%;
  width:100%;
  overflow: hidden;
}

</style>