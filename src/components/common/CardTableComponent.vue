<template>
  <div class="dataCard">
    <div class="table_wrap">
      <el-table
        class="card_table"
        ref="singleTable"
        height="100%"
        :data="cardData"
        highlight-current-row
        @current-change="handleCurrentChange"
        border
        :header-cell-style="{ background: '#222222', color: '#fff' }"
        :row-class-name="tableRowClassName"
        >
        <el-table-column type="index" width="50" style="background:black">
        </el-table-column>
        <el-table-column label="指标">
          <template slot-scope="scope">
            <span :style="{ color: scope.row.color }">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column property="value" label="数值"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "cardtable",
  props: {
    // 接收父组件传递过来的信息
    cardData: {
      type: Array, //此处可以为Array或者Object或者其它，根据需求来。
      default: () => []
    }
  },
  data() {
    return {
      currentRow: null
    };
  },

  methods: {
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    tableRowClassName({rowIndex}) {
      if (rowIndex % 2 === 0) {
        return 'row2';
      } else if (rowIndex % 2 === 1) {
        return 'row1';
      }
      return '';
    },
  },
  created: function() {
    function randomColor() {
      //十六进制颜色随机
      var r = Math.floor(Math.random() * 256);
      var g = Math.floor(Math.random() * 256);
      var b = Math.floor(Math.random() * 256);
      var color = "#" + r.toString(16) + g.toString(16) + b.toString(16);
      return color;
    }
    console.log(randomColor());
    console.log(this.cardData);
    let data = this.cardData;
    data.forEach(item => {
      item.color = randomColor();
    });
    this.cardData = data;
  }
};
</script>

<style lang="scss" scope>
.dataCard {
  width: 100%;
  height: 100%;
  .table_wrap{
    width: 100%;
    height: 100%;
    .card_table{
      width: 100%;
      height: 100%;
    }
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    color: black !important;
    font-weight: bold !important;
  }
  .el-table__body tr.current-row > td {
    background-color: #fff !important;
    font-weight: bold !important;
  }
  .el-table td,
  .el-table th.is-leaf,
  .el-table--border,
  .el-table--group {
    border-color: #444444;
  }
  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background-color: #444444;
  }
  .el-table .row1 {
    background: #000000;
  }

  .el-table .row2 {
    background: #101010;
  }
  .el-table td,
  .el-table th {
    padding: 0;
  }
  .el-table__body-wrapper {
    background: #040506;
  }
}
</style>
