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
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="name" :label="$t('process.name')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="key" :label="$t('process.key')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="version" :label="$t('process.version')" header-align="center" align="center">
        <template v-slot="scope">
          <el-tag size="small">v{{ scope.row.version }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="diagramResourceName" :label="$t('process.diagramResourceName')" header-align="center" align="center" :show-overflow-tooltip="true">
        <template v-slot="scope">
          <a :href="getResourceURL(scope.row.deploymentId, scope.row.diagramResourceName)" target="_blank">{{ scope.row.diagramResourceName }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="deploymentTime" :label="$t('process.deploymentTime')" header-align="center" align="center" width="180"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button type="text" size="small" @click="createProcessInstance(scope.row)">{{ $t("process.createInstance") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import { defineComponent, reactive, toRefs } from "vue";
import qs from "qs";
import { getToken } from "@/utils/cache";
import app from "@/constants/app";
import { IObject } from "@/types/interface";
import { registerDynamicToRouterAndNext } from "@/router";
export default defineComponent({
  setup() {
    const state = reactive({
      getDataListURL: "/flow/common/start/page",
      getDataListIsPage: true,
      dataForm: {
        processName: "",
        key: ""
      }
    });
    return { ...useView(state), ...toRefs(state) };
  },
  methods: {
    // 获取流程(image)url地址
    getResourceURL(id: string, name: string) {
      const params = qs.stringify({
        access_token: getToken(),
        deploymentId: id,
        resourceName: name
      });
      return `${app.api}/flow/process/resource?${params}`;
    },
    // 发起流程
    createProcessInstance(row: IObject) {
      const routeParams = {
        path: `/flow-form/${row.key}/form`,
        query: {
          processDefinitionId: row.id,
          processDefinitionKey: row.key,
          _mt: `${row.name}`
        }
      };
      registerDynamicToRouterAndNext(routeParams);
    }
  }
});
</script>
