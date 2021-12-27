<template>
  <div class="mod-sys__region">
    <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
      <el-form-item>
        <el-button v-if="hasPermission('sys:region:save')" type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="elTable" v-loading="dataListLoading" :data="dataList" row-key="id" border lazy :load="load" style="width: 100%" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column prop="name" :label="$t('region.name')" header-align="center" min-width="180">
        <template v-slot="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column prop="id" :label="$t('region.id')" header-align="center" min-width="180">
        <template v-slot="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column prop="treeLevel" :label="$t('region.type')" header-align="center" min-width="150">
        <template v-slot="scope">
          <span v-if="scope.row.treeLevel === 1">{{ $t("region.province") }}</span>
          <span v-else-if="scope.row.treeLevel === 2">{{ $t("region.city") }}</span>
          <span v-else>{{ $t("region.county") }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sort" :label="$t('region.sort')" header-align="center" align="center" min-width="150"></el-table-column>
      <el-table-column prop="updateDate" :label="$t('region.updateDate')" header-align="center" align="center" min-width="150"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="hasPermission('sys:region:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
          <el-button v-if="hasPermission('sys:region:delete')" type="text" size="small" @click="deleteRow(scope.row)">{{ $t("delete") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshData"></add-or-update>
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import { defineComponent, reactive, toRefs } from "vue";
import AddOrUpdate from "./region-add-or-update.vue";
import baseService from "@/service/baseService";
import { IObject, IFunction } from "@/types/interface";
export default defineComponent({
  components: {
    AddOrUpdate
  },
  setup() {
    const state = reactive({
      getDataListURL: "/sys/region/list",
      deleteURL: "/sys/region",
      nodeMaps: new Map()
    });
    return { ...useView(state), ...toRefs(state) };
  },
  methods: {
    load(tree: IObject, treeNode: IObject, resolve: IFunction) {
      this.nodeMaps.set(tree.id, { tree, treeNode, resolve });
      baseService.get(`/sys/region/list?pid=${tree.id}`).then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        resolve(res.data);
      });
    },
    deleteRow(row: IObject) {
      const { id, pid } = row;
      this.deleteHandle(id, pid).then(() => {
        const { tree, treeNode, resolve } = this.nodeMaps.get(pid) || {};
        if (tree) {
          this.load(tree, treeNode, resolve);
        } else {
          this.getDataList();
        }
      });
    },
    refreshData(row: IObject) {
      const { pid } = row;
      const { tree, treeNode, resolve } = this.nodeMaps.get(pid) || {};
      if (tree) {
        this.load(tree, treeNode, resolve);
      } else {
        this.getDataList();
      }
    }
  }
});
</script>
