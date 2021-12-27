<template>
  <div class="years_selecter">
    <el-date-picker
      v-model="start"
      type="year"
      format="yyyy 年"
      value-format="yyyy"
      placeholder="开始年"
      size="mini"
      :clearable="false"
      @change="changeRange">
    </el-date-picker>
    <label>-</label>
    <el-date-picker
      v-model="end"
      type="year"
      format="yyyy 年"
      value-format="yyyy"
      placeholder="结束年"
      size="mini"
      :clearable="false"
      @change="changeRange">
    </el-date-picker>
  </div>
</template>
<script>
/**
 * @file:  View 组件 年范围选择控件
 * @author: zlq
 * @date: 2020-10-21
 * @description: elementUI组件库
 * @api: valueArr : 季度value defalut['01-03', '04-06', '07-09', '10-12'] 默认值待设置
 */
export default {
  props: {
    
  },
  data() {
    return {
      start:null,
      end:null,
    };
  },
  created() {
    
  },
  mounted(){
    let date = new Date()
    this.end = JSON.stringify(date.getFullYear())
    this.start = JSON.stringify(date.getFullYear()-10)
  },
  watch: {},
  methods: {
    changeRange(val){
      console.log(val)
      if(this.start>this.end){
        let s = JSON.parse(JSON.stringify(this.start))
        this.start = JSON.parse(JSON.stringify(this.end))
        this.end = this.end<=val?s:val
      }
      this.$emit('getYearsRange',[this.start,this.end])
    },
  },
};
</script>
<style lang="scss">
.years_selecter {
  .el-input__inner{
    border: none;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 90px;
  }
  .el-input--suffix .el-input__inner {
    padding-right: 0;
  }
}
</style>
