<template>
  <el-card shadow="never" class="aui-card--fill">
    <h4>{{ $t("process.flowImage") }}</h4>
    <img :src="getDiagramImage()" class="image" />
    <h4>{{ $t("process.circulation") }}</h4>
    <div class="mod-sys__dict">
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%">
        <el-table-column prop="activityName" :label="$t('process.taskName')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="assigneeName" :label="$t('process.assignee')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="startTime" :label="$t('task.startTime')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="endTime" :label="$t('task.endTime')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="comment" :label="$t('process.comment')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="durationInSeconds" :label="$t('task.durationInSeconds')" header-align="center" align="center" width="180"></el-table-column>
      </el-table>
      <el-pagination v-if="dataForm.pid === '0'" :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
    </div>
  </el-card>
</template>
<style scoped>
.image {
  width: 60%;
  display: block;
  margin: 0 auto 30px auto;
}
</style>

<script lang="ts">
import qs from "qs";
import useView from "@/hooks/useView";
import { defineComponent, reactive, toRefs } from "vue";
import { getToken } from "@/utils/cache";
import app from "@/constants/app";
export default defineComponent({
  name: "RenProcessDetail",
  setup() {
    const state = reactive({
      getDataListURL: "/flow/common/historic/list",
      getDataListIsPage: false,
      createdIsNeed: false,
      dataForm: {
        processInstanceId: "",
        pid: ""
      }
    });
    return { ...useView(state), ...toRefs(state) };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.dataForm.processInstanceId = this.$route.query.processInstanceId as string;
      this.getDiagramImage();
      this.getDataList();
    },
    getDiagramImage() {
      const params = qs.stringify({
        access_token: getToken(),
        processInstanceId: this.dataForm.processInstanceId
      });
      return `${app.api}/flow/common/diagram/image?${params}`;
    }
  }
});
</script>
