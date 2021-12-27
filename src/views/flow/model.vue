<template>
  <div class="mod__model">
    <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.name" :placeholder="$t('model.name')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.modelKey" :placeholder="$t('model.key')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addModel()">{{ $t("add") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="id" label="ID" header-align="center" align="center" width="280"></el-table-column>
      <el-table-column prop="name" :label="$t('model.name')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="modelKey" :label="$t('model.key')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="version" :label="$t('model.version')" header-align="center" align="center">
        <template v-slot="scope">
          <el-tag size="small">v{{ scope.row.version }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created" :label="$t('model.createTime')" header-align="center" align="center" width="160"></el-table-column>
      <el-table-column prop="lastUpdated" :label="$t('model.lastUpdateTime')" header-align="center" align="center" width="160"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <a :href="getModelerURL(scope.row.id)" target="_blank" class="el-button el-button--text el-button--small">{{ $t("model.design") }}</a>
          <el-button type="text" size="small" @click="deployHandle(scope.row.id)">{{ $t("model.deploy") }}</el-button>
          <a :href="getExportURL(scope.row.id)" target="_blank" class="el-button el-button--text el-button--small">{{ $t("export") }}</a>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import { defineComponent, reactive, toRefs } from "vue";
import app from "@/constants/app";
import baseService from "@/service/baseService";
export default defineComponent({
  setup() {
    const state = reactive({
      getDataListURL: "/flow/model/page",
      getDataListIsPage: true,
      dataForm: {
        name: "",
        modelKey: ""
      }
    });
    return { ...useView(state), ...toRefs(state) };
  },
  methods: {
    addModel() {
      window.open(`${app.api}/flow/modeler/index.html`);
    },
    // 获取在线设计url地址
    getModelerURL(id: string) {
      return `${app.api}/flow/modeler/index.html#/editor/${id}`;
    },
    // 获取导出url地址
    getExportURL(id: string) {
      return `${app.api}/flow/app/rest/models/${id}//bpmn20`;
    },
    // 部署
    deployHandle(id: string) {
      this.$confirm(this.$t("prompt.info", { handle: this.$t("model.deploy") }), this.$t("prompt.title"), {
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      })
        .then(() => {
          baseService.post(`/flow/model/deploy/${id}`).then((res) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg);
            }
            this.$message({
              message: this.$t("prompt.success"),
              type: "success",
              duration: 500,
              onClose: () => {
                this.getDataList();
              }
            });
          });
        })
        .catch(() => {
          //
        });
    }
  }
});
</script>
