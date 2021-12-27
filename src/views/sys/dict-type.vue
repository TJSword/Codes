<template>
  <div class="mod-sys__dict">
    <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.dictName" :placeholder="$t('dict.dictName')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.dictType" :placeholder="$t('dict.dictType')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="hasPermission('sys:dict:save')" type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="hasPermission('sys:dict:delete')" type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="dictName" :label="$t('dict.dictName')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="dictType" :label="$t('dict.dictType')" header-align="center" align="center">
        <template v-slot="scope">
          <el-button type="text" @click="showTypeList(scope.row)">{{ scope.row.dictType }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="sort" :label="$t('dict.sort')" sortable="custom" header-align="center" align="center"></el-table-column>
      <el-table-column prop="remark" :label="$t('dict.remark')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createDate" :label="$t('dict.createDate')" sortable="custom" header-align="center" align="center" width="180"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="hasPermission('sys:dict:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
          <el-button v-if="hasPermission('sys:dict:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!-- 字典类型数据 -->
    <el-drawer :title="focusDictTypeTitle" v-model="dictTypeListVisible" :size="800" close-on-press-escape="false" custom-class="rr-drawer"> <DictTypeList :dictTypeId="focusDictTypeId"></DictTypeList></el-drawer>
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import { defineComponent, reactive, toRefs } from "vue";
import AddOrUpdate from "./dict-type-add-or-update.vue";
import DictTypeList from "./dict-data.vue";
import { IObject } from "@/types/interface";
export default defineComponent({
  components: {
    AddOrUpdate,
    DictTypeList
  },
  setup() {
    const state = reactive({
      getDataListURL: "/sys/dict/type/page",
      getDataListIsPage: true,
      deleteURL: "/sys/dict/type",
      deleteIsBatch: true,
      dataForm: {
        id: "0",
        dictName: "",
        dictType: ""
      },
      dictTypeListVisible: false,
      focusDictTypeId: "",
      focusDictTypeTitle: ""
    });
    return { ...useView(state), ...toRefs(state) };
  },

  methods: {
    showTypeList(row: IObject) {
      this.dictTypeListVisible = true;
      this.focusDictTypeId = row.id;
      this.focusDictTypeTitle = `${this.$route.meta.title} - ${row.dictType}`;
    }
  }
});
</script>
