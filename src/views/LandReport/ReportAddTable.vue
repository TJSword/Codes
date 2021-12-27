<template>
  <!-- 添加表格 -->
  <div class="reportaddtable_wrap">
    <HotTable v-if="showTable" class="chat_table" :settings="hotSettings" 
    :rowHeaders="true" :colHeaders="true" 
    style="height:100%;width:100%" />
  </div>
  
</template>
<script>
import { mapGetters } from "vuex";
import LandReportApi from "@/api/LandReportApi_zlq";
import { HotTable } from '@handsontable/vue' //表格组件
export default {
  name: "reportaddtable",
  props:{
    colrow:{ //表格行列数
      type:Object,
      default(){
        return { col:5,row:5,w:500,h:300 }
      }
    }
  },
  components: {
    HotTable
  },
  data() {
    return {
      reportId: "1306841780423069697", //报告ID
      showTable:false,
      hotSettings:{
        data: null,
        minCols:5,
        minRows:5,
        fixedRowsTop:0,
        fixedRowsLeft:0,
        rowHeaders:false,
        colHeaders:false,
        manualColumnResize: true, // 当值为true时，允许拖动，当为false时禁止拖动
        manualRowResize: true, // 当值为true时，允许拖动，当为false时禁止拖动
        manualColumnMove: true, // 当值为true时，列可拖拽移动到指定列
        manualRowMove: true, // 当值为true时，行可拖拽至指定行
        contextMenu: true,//右键显示更多功能,
        licenseKey:'ab3e4-1bee8-ed01c-4d94b-08cfe', //key
        afterChange:(changes, source) => { //数据改变时触发此方法
          console.log(changes,source)
          this.tableDataChange()
        }
      },
    }
  },
  mounted() {
    this.hotSettings.minCols = this.colrow.col
    this.hotSettings.minRows = this.colrow.row
    if(this.colrow.data==null){ //新建
      let data = []
      for(let i=0;i<this.colrow.row;i++){
        let row = []
        for(let j=0;j<this.colrow.col;j++){
          row.push(null)
        }
        data.push(row)
      }
      this.hotSettings.data = data
      this.$emit('tableData',data)
    }else{ //加载
      this.hotSettings.data = JSON.parse(JSON.stringify(this.colrow.data))
    }
    
    this.showTable = true
  },
  computed: {
    ...mapGetters([]),
  },
  watch: {
    colrow:{
      handler(newVal){
        
      },
      deep:true
    }
  },
  methods: {
    //向父组件传输表格数据
    tableDataChange(){
      console.log(this.hotSettings.data)
      this.$emit('tableData',this.hotSettings.data)
    }
  },
};
</script>
<style lang="scss">
.reportaddtable_wrap {
  background: #fff;
  width: 100%;
  height: 100%;
  .ht_master{
    width: 100% !important;
    height: 100% !important;
    .wtHolder{
      width: 100% !important;
      height: 100% !important;
    }
    .wtHider{
      width: 100% !important;
      height: 100% !important;
    }
    .wtSpreader{
      width: 100% !important;
      height: 100% !important;
    }
    .htCore{
      width: 100% !important;
      height: 100% !important;
      table-layout: unset !important;
      td{
        height: unset;
      }
    }
  }
  
  // .htCore,.wtSpreader,.wtHider,.wtHolder,.handsontable{
  //   width: 100% !important;
  //   height: 100% !important;
  // }
}
</style>
