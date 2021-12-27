<template>
  <div class="template-code">
    <el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '编辑'" :close-on-click-modal="false" :close-on-press-escape="false" :fullscreen="true">
      <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" label-width="80px" size="mini">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="模板名" prop="name">
              <el-input v-model="dataForm.name" placeholder="模板名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文件名" prop="fileName">
              <el-input v-model="dataForm.fileName" placeholder="文件名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="生成路径" prop="path">
              <el-input v-model="dataForm.path" placeholder="生成路径"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="dataForm.status">
                <el-radio :label="0">启用</el-radio>
                <el-radio :label="1">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="内容" prop="content">
          <monaco-editor class="editor" v-model="dataForm.content" theme="vs" language="java" style="height: 480px; border: 1px solid #ccc" />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmitHandle()">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from "vue";
import baseService from "@/service/baseService";
import { useDebounce } from "@/utils/utils";
import MonacoEditor from "@/components/monaco-editor";
export default defineComponent({
  components: {
    MonacoEditor
  },
  setup() {
    return reactive({
      visible: false,
      dataForm: {
        id: "",
        name: "",
        content: "",
        fileName: "",
        path: "",
        status: 0
      }
    });
  },
  computed: {
    dataRule() {
      return {
        name: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
        content: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
        path: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
        fileName: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
      };
    }
  },

  created() {
    this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
  },
  methods: {
    init() {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataFormRef"].resetFields();
        if (this.dataForm.id) {
          this.getInfo();
        }
      });
    },
    // 获取信息
    getInfo() {
      baseService.get(`/devtools/template/${this.dataForm.id}`).then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        };
      });
    },
    // 表单提交
    dataFormSubmitHandle() {
      this.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        (!this.dataForm.id ? baseService.post : baseService.put)("/devtools/template", this.dataForm).then((res) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.$message({
            message: this.$t("prompt.success"),
            type: "success",
            duration: 500,
            onClose: () => {
              this.visible = false;
              this.$emit("refreshDataList");
            }
          });
        });
      });
    }
  }
});
</script>
<style type="less">
.template-code .el-dialog__body {
  padding: 10px 30px 0 20px;
}
.template-code .el-dialog__footer {
  padding: 0px 20px 10px;
}
</style>
