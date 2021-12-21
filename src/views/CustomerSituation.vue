<template>
  <div class="customerSituation_wrap">
    <MapComponent />
    <SituationNav />
    <!-- <AddDIY /> -->
  </div>
</template>

<script>
import MapComponent from "@/components/main/customerSituation/situationMap.vue";
import SituationNav from "@/components/main/customerSituation/situationNav.vue"
import ledgerApi from "@/api/ledgerApi"
// import AddDIY from "@/components/main/customerSituation/addDIY.vue"
export default {
    components:{
        MapComponent,
        SituationNav,
        // AddDIY
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
::v-deep  .mapboxgl-popup{
  max-width: 1000px!important;
}
 ::v-deep .mapboxgl-popup-content{
    width: fit-content;
    background: linear-gradient(45deg, rgb(2 11 21 / 79%), #00000078);
    border-top: #668855 1px solid;
    border-bottom: #668855 1px solid;
    color: #fff;
    padding: 30px 40px!important;
    .info_head{
     color:rgba(255, 193, 7, 1);
      font-size: 18px;
      margin-bottom: 10px;
    }
    .info_title{
      margin:6px 0;
      font-size:16px;
      color:rgba(255, 193, 7, 1);
    }
    .table_box{
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      .table_title{
        font-size: 14px;
        margin-bottom: 4px;
      }
      .content_box{
        width: 100%;
        .item{
          width: 100%;
          display: flex;
          flex-wrap: wrap;
           &:last-child{
             margin-bottom: 10px;
             .item_label,.item_value{
               border-bottom:1px solid rgba(255, 255, 255, 0.41);
             }
            }
          .item_label,.item_value{
            width: 48%;
            text-align: center;
            border:1px solid rgba(255, 255, 255, 0.41);
            border-bottom: 0;
            padding: 3px 0;
          }
          .item_value{
            border-left: 0;
          }
          .item_line{
            background: pink;
          }
        }
        
      }
    }
    .item_val{
      color: #7ce8fd;
    }
    .mapboxgl-popup-close-button{
      color:white;
      font-size:24px;
      &:focus{
        outline:0!important;
      }
    }
  }
}
</style>