<template>
  <div class="dataCard">
    <div class="title">
      <span style="margin-left:35px">板块数据名片</span>
    </div>
    <el-table
      ref="singleTable"
      :data="cardData"
      highlight-current-row
      @current-change="handleCurrentChange"
      style="width: 90%;height:80%;background:black"
      :header-cell-style="{ background: 'black', color: 'white' }"
      :row-style="{ background: 'black', color: 'white' }"
    >
      <el-table-column type="index" width="50" style="background:black">
      </el-table-column>
      <el-table-column label="指标" width="1400">
        <template slot-scope="scope">
          <span :style="{ color: scope.row.color }">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column property="value" label="数值"> </el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {
  name: "DataCard",
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
  computed:{
    
  },
  methods: {
    handleCurrentChange(val) {
      this.currentRow = val;
    }
  },
  created() {
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

<style>
.dataCard {
  margin-left: 5%;
}
.title {
  color: white;
  width: 90%;
  background: #001525;
  height: 58px;
  font-size: 26px;
  line-height: 58px;
}
.el-table__body tr:hover > td {
  background-color: white !important;
  color: black !important;
}
</style>
