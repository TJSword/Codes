<template>
  <!-- 竞品市场-竞品信息 -->
  <div class="cd_info_wrap">
    <el-table
      :data="cdInfos"
      border stripe
      style="width: 100%;text-align:center;">
      <el-table-column
        prop="buildingName"
        label="项目名称">
      </el-table-column>
      <el-table-column
        prop="typeNames"
        label="物业类型">
      </el-table-column>
      <el-table-column
        prop="opentime"
        label="首次开盘时间">
      </el-table-column>
      <el-table-column
        prop="volumeArea"
        label="总体量">
      </el-table-column>
      <el-table-column
        prop="volumeRatio"
        label="容积率">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import LandReportApi from '@/api/LandReportApi_zlq'
import Map from '@/components/common/MapComponent'
export default {
  name: "cdinfos",
  components: {
    Map
  },
  data() {
    return {
      reportId:'1306841780423069697',//报告ID
      cdInfos:[],//竞品信息
    };
  },
  mounted() {
    this.getCdInfos()
    setTimeout(() => {
      //this.setDeckLayer();
    }, 2500);
  },
  computed: {
    ...mapGetters(["CD_map"]),
  },
  watch: {},
  methods: {
     objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
    getCdInfos(){ //竞品信息
      var that = this
      LandReportApi.getCDinfos({reportId:that.reportId})
      .then(res=>{
        if(res.data.code===0){
          let data = res.data.data
          
          that.cdInfos = data
        }
      })
    },
  },
};
</script>
<style lang="scss">
.cd_info_wrap {
  width: 100%;
  height: 100%;
  z-index: 999;
  overflow-y: scroll;
}
</style>
