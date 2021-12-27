<template>
  <!-- 等时圈 -->
  <div class="isocircle_wrap">
    <div class="condition">
      <label>出行方式：</label>
      <el-select v-model="curType" @change="travelTypeChange" size="mini">
        <el-option 
        v-for="(item,index) in travelType" 
        :key="index"
        :disabled="item.disabled"
        :label="item.label"
        :value="item.value"></el-option>
      </el-select>
    </div>
    <div class="condition">
      <label>出行时间：</label>
      <el-select v-model="curTime" @change="travelTimeChange" size="mini">
        <el-option 
        v-for="(item,index) in travelTime" 
        :disabled="item.disabled"
        :key="index"
        :label="item.label"
        :value="item.value"></el-option>
      </el-select>
    </div>
    <div class="tip">tips:地图上点击确定等时圈起始点,拖动点更改位置</div>
  </div>
</template>
<script>

export default {
  name:'isocircle',
  props:{
    startCoordinate:{ //传入的起始点坐标，格式 'lng,lat'
      type:String,
      default:''
    }
  },
  components:{},
  data(){
    return{
      accessToken:"pk.eyJ1Ijoibm9jb25yaWFuZGVyIiwiYSI6ImNrMjQ1dGNrNDIwdWMzZXVnN3VwbnV4NW4ifQ.D7k8xizdEAG4ucy3vAhNFg",
      travelType:[ //出行方式数组
        {label:'驾车',value:'driving',disabled:false},
        {label:'步行',value:'walking',disabled:false},
        {label:'骑行',value:'cycling',disabled:false}
      ],
      curType:'driving',
      travelTime:[ //出行时间数组
        {label:'15',value:'15',disabled:false},
        {label:'30',value:'30',disabled:false},
        {label:'45',value:'45',disabled:false},
        {label:'60',value:'60',disabled:false}
      ],
      curTime:'15',
    }
  },
  watch:{
    startCoordinate:{
      handler(val){
        console.log(val)
        this.mapboxIsoline()
      }
    }
  },
  methods:{
    travelTypeChange(){ //出行方式
      this.mapboxIsoline()
    },
    travelTimeChange(){ //出行时间
      this.mapboxIsoline()
    },
    mapboxIsoline(){ //mapbox等时圈
      let url = 'https://api.mapbox.com/isochrone/v1/mapbox/'
      +this.curType+'/'+this.startCoordinate+'?contours_minutes='+this.curTime
      +'&polygons=true&access_token='+this.accessToken
      this.$.ajax({
        type : "get",
        async:false,
        url : url,
        dataType : "json",
        success : json=>{
          //console.log(json)
          this.$emit("geojson", json);
        },
        error:function(){
          console.log('fail');
        }
      });
    },
  }
}
</script>
<style lang="scss">
.isocircle_wrap{
  width: 100%;
  .condition{
    color: #fff;
    margin-top: 15px;
    .el-input__inner {
      background: none;
      color: #14f4ff;
      border-color: #378f9e;
    }
  }
  .tip{
    font-size: 12px;
    color: #bfbcbc;
    margin-top: 10px;
  }
}
</style>