<template>
  <!-- antv/l7地图 -->
  <div class="add_mapA">
    <div id="l7Map"></div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name:'add_mapA',
  props:{
    mapType:{
      type:String,
      default:''
    }
  },
  data(){
    return{
      local_map:null,
    }
  },
  mounted(){
    this.loadL7Map()
  },
  computed: {
    ...mapGetters(["cityCode","plateData"])
  },
  methods:{
   
  }
}
</script>
<style lang="scss">
.add_mapA{
  width: 100%;
  height: 100%;
  #l7Map{
    width: 100%;
    height: 100%;
  }
}
</style>