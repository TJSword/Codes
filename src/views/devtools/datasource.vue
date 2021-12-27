<template>
  <div class="mod-datasource">
    <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.connName" placeholder="连接名" clearable></el-input>
      </el-form-item>
      <el-form-item prop="dbType">
        <el-select v-model="dataForm.dbType" clearable placeholder="数据库类型" class="w-percent-100">
          <el-option value="MySQL" label="MySQL"></el-option>
          <el-option value="Oracle" label="Oracle"></el-option>
          <el-option value="SQLServer" label="SQLServer"></el-option>
          <el-option value="PostgreSQL" label="PostgreSQL"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="deleteHandle()">删除</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="connName" label="连接名" header-align="center" align="center"></el-table-column>
      <el-table-column prop="dbType" label="数据库类型" header-align="center" align="center"></el-table-column>
      <el-table-column prop="connUrl" label="数据库URL" header-align="center" align="center"></el-table-column>
      <el-table-column prop="username" label="用户名" header-align="center" align="center"></el-table-column>
      <el-table-column prop="password" label="密码" header-align="center" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" sortable="custom" header-align="center" align="center">
        <template v-slot="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="success">启用</el-tag>
          <el-tag v-else size="small" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button type="text" size="small" @click="datasourceHandle(scope.row.id)">连接测试</el-button>
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">编辑</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import baseService from "@/service/baseService";
import { defineComponent, reactive, toRefs } from "vue";
import AddOrUpdate from "./datasource-add-or-update.vue";
export default defineComponent({
  components: {
    AddOrUpdate
  },
  setup() {
    const state = reactive({
      getDataListURL: "/devtools/datasource/page",
      getDataListIsPage: true,
      deleteURL: "/devtools/datasource",
      deleteIsBatch: true,
      dataForm: {
        connName: "",
        dbType: ""
      }
    });
    return { ...useView(state), ...toRefs(state) };
  },
  methods: {
    datasourceHandle(id: string) {
      baseService.get("/devtools/datasource/test/" + id).then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        } else {
          return this.$message.success(res.data);
        }
      });
    }
  }
});
</script>
