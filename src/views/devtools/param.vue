<template>
  <div>
    <el-space style="justify-content: space-between; width: 100%; border-bottom: 1px solid #ebeef5; margin-top: -10px; margin-bottom: 15px; padding-bottom: 10px">
      <span>代码生成参数配置</span>
      <el-button style="float: right; padding: 3px 0" type="text" @click="updateParam">修改</el-button>
    </el-space>
  </div>
  <div class="mod-home">
    <el-row>
      <el-col :span="24">
        <table>
          <tr>
            <td style="width: 200px">默认包名</td>
            <td>{{ param.packageName }}</td>
          </tr>
          <tr>
            <td>默认版本号</td>
            <td>{{ param.version }}</td>
          </tr>
          <tr>
            <td>默认作者</td>
            <td>{{ param.author }}</td>
          </tr>
          <tr>
            <td>作者邮箱</td>
            <td>{{ param.email }}</td>
          </tr>
          <tr>
            <td>后端生成路径</td>
            <td>{{ param.backendPath }}</td>
          </tr>
          <tr>
            <td>前端生成路径</td>
            <td>{{ param.frontendPath }}</td>
          </tr>
        </table>
      </el-col>
    </el-row>
    <param-update v-if="paramUpdateVisible" ref="paramUpdate" @refreshDataList="getGenParam"></param-update>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import ParamUpdate from "./param-update.vue";
import baseService from "@/service/baseService";
export default defineComponent({
  components: {
    ParamUpdate
  },
  setup() {
    return reactive({
      paramUpdateVisible: false,
      param: {
        packageName: "",
        version: "",
        author: "",
        email: "",
        frontendPath: "",
        backendPath: ""
      }
    });
  },
  created() {
    this.getGenParam();
  },
  methods: {
    getGenParam() {
      baseService.get("/devtools/param/info").then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.param = res.data;
      });
    },
    // 修改
    updateParam() {
      this.paramUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.paramUpdate.init();
      });
    }
  }
});
</script>

<style lang="less">
.mod-home {
  table {
    width: 100%;
    border: 1px solid #ebeef5;
    border-collapse: collapse;
    th,
    td {
      padding: 12px 10px;
      border: 1px solid #ebeef5;
    }
    th {
      width: 30%;
    }
  }
}
</style>
