<template>
  <!-- 图例 -->
  <div class="legend_wrap">
    <div class="color_bar">
      <div class="color_item" 
      v-for="(item,i) in color" :key="i"
      v-show="i<legendInfo.section"
      :style="{'background':item.value}"></div>
    </div>
    <div class="value_bar">
      <div class="value_item" v-for="item in value" :key="item">{{item}}</div>
    </div>
  </div>
</template>
<script>
export default {
  name:'legends',
  props:{
    legendInfo:{
      type:Object, //{min:min,max:max,section:5}
      default:()=>{
        return {min:0,max:10,section:10}
      }
    }
  },
  data(){
      return{
        color:[
          {name:'< 1',value:'#f1e774'},
          {name:'< 2',value:'#f2d972'},
          {name:'< 3',value:'#f2c76f'},
          {name:'< 4',value:'#f2b46d'},
          {name:'< 5',value:'#f3a06a'},
          {name:'< 6',value:'#f38c67'},
          {name:'< 7',value:'#f47964'},
          {name:'< 8',value:'#f46862'},
          {name:'< 9',value:'#f55960'},
          {name:'< 10',value:'#f54e5e'}
        ],
        value:[]
      }
  },
  mounted(){
    this.setColorBar()
  },
  methods:{
    setColorBar(){ //设置颜色条
      let ave = (this.legendInfo.max-this.legendInfo.min)/this.legendInfo.section
      for(let i=0;i<this.legendInfo.section+1;i++){
        this.value.push((this.legendInfo.min+ave*i).toFixed(1))
      }
    },
  }
}
</script>
<style lang="scss">
  .legend_wrap {
    background:rgba(0,0,0,0.3);
    position: fixed;
    left: 35%;
    bottom: 10px;
    z-index: 99999;
    padding: 15px 10px 10px 20px;
    .color_bar{
      display: flex;
      align-items: center;
      .color_item{
        width: 40px;
        height: 20px;
      }
    }
    .value_bar{
      display: flex;
      align-items: center;
      position: relative;
      margin-top: 10px;
      margin-left: -6px;
      .value_item{
        width: 40px;
        height: 20px;
        text-align: left;
        color: #fff;
        font-size: 12px;
      }
      .value_item:last-child{
        width:auto;
      }
    }
  }
</style>