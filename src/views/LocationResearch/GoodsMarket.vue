<template>
  <div class="GoodsMarket_wrap">
      <GoodsMarketCom :map="map" @goodId="getGoodId"  :class="['show',!showGoodsInfo?'hide':'']"/>
      <GoodsDetailCom :goodsId='goodsId' :class="['show',showGoodsInfo?'hide':'']" />
  </div>
</template>

<script>
import Map from "../../components/main/locationResearch/map"
import GoodsMarketCom from "../../components/main/locationResearch/goodsMarket"
import GoodsDetailCom from "../../components/main/locationResearch/goosDetail"

export default {
    components:{
        Map,GoodsMarketCom,GoodsDetailCom
    },
   
    data(){
        return{
          map:null,
          goodsId:'',
          showGoodsInfo:false
        }
    },
    methods:{
        getGoodId(data){
            this.goodsId = data.id
            this.showGoodsInfo = data.showGoodsInfo
        },
         showToast(){
            this.$message({
                type:'warning',
                message:'当前模块已锁定，如需更改，请点击“我要重做”'
            })
        },
    }
   
}
</script>

<style lang="scss" scoped>
.GoodsMarket_wrap{
    height: calc(100% - 60px);
    width: 100%;
    position: fixed;
    top:60px;
    pointer-events:none;
    .show{
        opacity: 0;
        transition: all 2s ease;
        position: fixed;
        z-index: -9999;
    }
    .hide{
        position: fixed;
        opacity: 1;
        transition: all 2s ease;
        z-index: 9999;
    }
}
</style>