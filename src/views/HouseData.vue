<template>
  <div class="customerSituation_wrap">
    <MapComponent />
    <HouseDataNav />
  </div>
</template>

<script>
import MapComponent from "@/components/main/houseData/map.vue";
import HouseDataNav  from "@/components/main/houseData/houseDataNav.vue"
import ledgerApi from "@/api/ledgerApi"
export default {
    components:{
        MapComponent,
        HouseDataNav,
    },
    mounted(){
      ledgerApi.getRegions({cityCode:510100}).then(res=>{
        console.log(res.data)
      })
    },
    methods:{
      map(map){
        console.log(map)
      }
    }
}
</script>

<style lang="scss" scoped>
.customerSituation_wrap{
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  bottom: 0px;
  background: #0c1015;
}
</style>