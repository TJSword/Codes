<template>
  <div class="mod-sys__post">
    <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.username" :placeholder="$t('online.username')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="userId" :label="$t('online.userId')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="username" :label="$t('online.username')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="realName" :label="$t('online.realName')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="loginDate" :label="$t('online.loginDate')" sortable="custom" header-align="center" align="center"></el-table-column>
      <el-table-column prop="expireDate" :label="$t('online.expireDate')" sortable="custom" header-align="center" align="center"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button type="text" size="small" @click="logoutHandle(scope.row.userId)">{{ $t("online.kickout") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import { defineComponent, reactive, toRefs } from "vue";
import baseService from "@/service/baseService";
export default defineComponent({
  setup() {
    const state = reactive({
      getDataListURL: "/sys/online/page",
      getDataListIsPage: true,
      deleteIsBatch: false,
      dataForm: {
        username: ""
      }
    });
    return { ...useView(state), ...toRefs(state) };
  },
  methods: {
    logoutHandle(id: string) {
      this.$confirm(this.$t("prompt.info", { handle: this.$t("online.kickout") }), this.$t("prompt.title"), {
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      })
        .then(() => {
          baseService.post("/sys/online/logout?id=" + id).then((res) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg);
            }
            this.$message({
              message: this.$t("prompt.success"),
              type: "success",
              duration: 500,
              onClose: () => {
                this.query();
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
