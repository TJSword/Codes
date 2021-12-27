<template>
  <div class="condition_table">
    <el-table
      :data="filterPlateData"
      style="width: 100%;height:100%;"
      height="100%"
      border
      :header-cell-style="{ background: '#0c1015', color: '#c4d0de' }"
      :row-class-name="tableRowClassName">
      <el-table-column
        label="#"
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="platename"
        label="板块">
      </el-table-column>
      <el-table-column
        sortable=""
        v-for="(item,index) in filterTableHead"
        :key="index"
        :prop="'data'+index"
        :label='item'>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
//插件
import { mapGetters } from "vuex"
export default {
  name: "conditiontable",
  props: {
    // 接收父组件传递过来的数据
    filterPlateData: {
      type: Array, 
      default: () => []
    },
    // 接收父组件传递过来的表头
    filterTableHead: {
      type: Array, 
      default: () => []
    }
  },
  data() {
    return {
      
    };
  },
  mounted(){
  },
  watch:{
    
  },
  computed:{
    ...mapGetters(["mapbox_map"])
    
  },
  methods: {
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "row2";
      } else if (rowIndex % 2 === 1) {
        return "row1";
      }
      return "";
    },
  },
  
  beforeUpdate(){}
};
</script>
<style lang="scss">
  .condition_table{
    width: 100%;
    height: 100%;
    .el-table{
      background: #0c1015;
    }
    .el-table .row1 {
      background: #0c121b;
    }

    .el-table .row2 {
      background: #14202d;
    }
    .el-table--enable-row-hover .el-table__body tr:hover > td {
      color: rgb(35, 41, 51) !important;
      font-weight: bold !important;
    }
    .el-table td,
    .el-table th {
      padding: 4px 0;
    }
    .el-table__body-wrapper {
      background: #0c1015;
    }
    .el-table td,
    .el-table th.is-leaf,
    .el-table--border,
    .el-table--group {
      border-color: #263950;
      color: #c4d0de;
    }
    .el-table--border{
      border: none;
    }
    .el-table--border::after,
    .el-table--group::after,
    .el-table::before {
      width: 0;
      border: none;
    }
    
  }
</style>
