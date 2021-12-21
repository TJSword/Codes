<template>
  <div class="quarter_selecter">
    <mark
      style="position:fixed;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,0);z-index:999;"
      v-show="showSeason"
      @click.stop="showSeason = false">
    </mark>
    <div class="season_range_box">
        <el-input
          placeholder="请选择季度"
          v-model="showValueStart"
          style="width:100px;"
          @focus="showSelect('start')">
        </el-input>
        <div class="range_title">至</div>
        <el-input
          placeholder="请选择季度"
          v-model="showValueEnd"
          style="width:100px;"
          @focus="showSelect('end')">
        </el-input>
        <el-card
          class="box-card"
          style=""
          v-show="showSeason">
          <div slot="header" class="clearfix" style="text-align:center;padding:0">
            <button
              type="button"
              aria-label="前一年"
              class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left"
              @click="prev">
            </button>
            <span role="button" class="el-date-picker__header-label">{{ year }}年</span>
            <button
              type="button"
              aria-label="后一年"
              @click="next"
              class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right">
            </button>
          </div>
          <div class="season_box">
            <el-button
              v-for="(item,index) in seasonArr" :key="index"
              type="text"
              size="medium"
              class="seasonItem"
              @click="selectSeason(index)"
              >{{item}}
            </el-button>
          </div>
        </el-card>
    </div>
    
  </div>
</template>
<script>
/**
 * @file:  View 组件 季节选择控件
 * @author: v_zhuchun
 * @date: 2019-05-23
 * @description: UI组件  可选择季节
 * @api: valueArr : 季度value defalut['01-03', '04-06', '07-09', '10-12'] 默认值待设置
 */
export default {
  props: {
    
  },
  data() {
    return {
      showSeason: false,
      curSelector:null, //选择开始还是结束时间
      seasonArr:['第一季度','第二季度','第三季度','第四季度'],
      year: new Date().getFullYear(),
      showValueStart: null,//展示开始季度
      showValueEnd: null, //展示结束季度
      seasonRange: [],//返回父元素的季度段
    };
  },
  created() {
    
  },
  watch: {},
  methods: {
    showSelect(str){
      this.showSeason = true
      this.curSelector = str
      this.year = new Date().getFullYear()
    },
    one() {
      this.showSeason = false;
    },
    prev() {
      this.year = this.year * 1 - 1;
    },
    next() {
      this.year = this.year * 1 + 1;
    },
    selectSeason(i) {
      this.showSeason = false;
      let num = this.year+'0'+(i+1)
      if(this.curSelector==="start"){
        if(num>this.showValueEnd&&this.showValueEnd!==null){
          this.showValueStart = JSON.parse(JSON.stringify(this.showValueEnd));
          this.seasonRange[0] = JSON.parse(JSON.stringify(this.seasonRange[1]));

          this.showValueEnd = `${this.year}年${i+1}季度`;
          this.seasonRange[1] = this.year+'0'+(i+1)
        }else{
          this.showValueStart = `${this.year}年${i+1}季度`;
          this.seasonRange[0] = this.year+'0'+(i+1)
        }
        
      }else{
        if(num<this.showValueStart&&this.showValueStart!==null){
          this.showValueEnd = JSON.parse(JSON.stringify(this.showValueStart));
          this.seasonRange[1] = JSON.parse(JSON.stringify(this.seasonRange[0]));

          this.showValueStart = `${this.year}年${i+1}季度`;
          this.seasonRange[0] = this.year+'0'+(i+1)
        }else{
          this.showValueEnd = `${this.year}年${i+1}季度`;
          this.seasonRange[1] = this.year+'0'+(i+1)
        }
      }
      if(this.seasonRange.length>1){
        console.log(this.seasonRange);
        this.$emit("quarterValue", this.seasonRange);
      }
    },
  },
};
</script>
<style lang="scss">
.quarter_selecter {
  .season_range_box{
    position: relative;
    display: flex;
    align-items: center;
    .range_title{
      font-size: 12px;
      margin: 0 10px;
      color: #e6a23c;
    }
    .box-card{
      width:322px;
      padding: 0 3px 20px;
      top: 40px;
      position: absolute;;
      z-index:9999
    }
  }
  .el-input__prefix{
    .el-input__icon,.el-icon-date {
      line-height: none !important;
    }
  }
  .el-input__inner {
    background: none;
    height: 28px;
    line-height: 28px;
    border: none;
    border-bottom: #383838 1px solid;
    border-radius: 0;
    padding-right: 0px;
    font-size: 12px;
    color: #fff;
  }
  .season_box{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .seasonItem{
      width:40%;color: #606266;
      margin-left: 0;
    }
  }
  
}
</style>
