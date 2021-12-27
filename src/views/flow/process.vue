<template>
  <div class="mod__process">
    <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.processName" :placeholder="$t('process.name')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.key" :placeholder="$t('process.key')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="deployHandle()">{{ $t("process.deployFile") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="id" :label="$t('process.id')" header-align="center" align="center" width="280"></el-table-column>
      <el-table-column prop="name" :label="$t('process.name')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="key" :label="$t('process.key')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="version" :label="$t('process.version')" header-align="center" align="center">
        <template v-slot="scope">
          <el-tag size="small">v{{ scope.row.version }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="resourceName" :label="$t('process.resourceName')" header-align="center" align="center" :show-overflow-tooltip="true" width="100">
        <template v-slot="scope">
          <a :href="getResourceURL(scope.row.deploymentId, scope.row.resourceName)" target="_blank">{{ scope.row.resourceName }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="diagramResourceName" :label="$t('process.diagramResourceName')" header-align="center" align="center" :show-overflow-tooltip="true" width="100">
        <template v-slot="scope">
          <a :href="getResourceURL(scope.row.deploymentId, scope.row.diagramResourceName)" target="_blank">{{ scope.row.diagramResourceName }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="deploymentTime" :label="$t('process.deploymentTime')" header-align="center" align="center" width="180"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="scope.row.suspended" type="text" size="small" @click="activeHandle(scope.row.id)">{{ $t("process.active") }}</el-button>
          <el-button v-else type="text" size="small" @click="suspendHandle(scope.row.id)">{{ $t("process.suspend") }}</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.deploymentId)">{{ $t("delete") }}</el-button>
          <el-button type="text" size="small" @click="convertToModelHandle(scope.row.id)">{{ $t("process.convertToModel") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 部署流程文件 -->
    <deploy v-if="deployVisible" ref="deploy" @refreshDataList="getDataList"></deploy>
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import { defineComponent, reactive, toRefs } from "vue";
import Deploy from "./process-deploy.vue";
import qs from "qs";
import app from "@/constants/app";
import { getToken } from "@/utils/cache";
import baseService from "@/service/baseService";
export default defineComponent({
  components: {
    Deploy
  },
  setup() {
    const state = reactive({
      getDataListURL: "/flow/process/page",
      getDataListIsPage: true,
      deleteURL: "/flow/process",
      deleteIsBatch: true,
      deleteIsBatchKey: "deploymentId",
      dataForm: {
        processName: "",
        key: ""
      },
      deployVisible: false
    });
    return { ...useView(state), ...toRefs(state) };
  },

  methods: {
    // 获取流程(xml/image)url地址
    getResourceURL(id: string, name: string) {
      const params = qs.stringify({
        access_token: getToken(),
        deploymentId: id,
        resourceName: name
      });
      return `${app.api}/flow/process/resource?${params}`;
    },
    // 部署流程文件
    deployHandle() {
      this.deployVisible = true;
      this.$nextTick(() => {
        this.$refs.deploy.init();
      });
    },
    // 激活
    activeHandle(id: string) {
      this.$confirm(this.$t("prompt.info", { handle: this.$t("process.active") }), this.$t("prompt.title"), {
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      })
        .then(() => {
          baseService.put(`/flow/process/active/${id}`).then((res) => {
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
    },
    // 挂起
    suspendHandle(id: string) {
      this.$confirm(this.$t("prompt.info", { handle: this.$t("process.suspend") }), this.$t("prompt.title"), {
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      })
        .then(() => {
          baseService.put(`/flow/process/suspend/${id}`).then((res) => {
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
    },
    // 转换为模型
    convertToModelHandle(id: string) {
      this.$confirm(this.$t("prompt.info", { handle: this.$t("process.convertToModel") }), this.$t("prompt.title"), {
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      })
        .then(() => {
          baseService.post(`/flow/process/convertToModel/${id}`).then((res) => {
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
