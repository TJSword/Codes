<template>
  <el-dialog v-model="visible" :title="$t('mail.config')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="smtp" :label="$t('mail.config')">
        <el-input v-model="dataForm.smtp" :placeholder="$t('mail.config')"></el-input>
      </el-form-item>
      <el-form-item prop="port" :label="$t('mail.port')">
        <el-input v-model="dataForm.port" :placeholder="$t('mail.port')"></el-input>
      </el-form-item>
      <el-form-item prop="username" :label="$t('mail.username')">
        <el-input v-model="dataForm.username" :placeholder="$t('mail.username')"></el-input>
      </el-form-item>
      <el-form-item prop="password" :label="$t('mail.password')">
        <el-input v-model="dataForm.password" :placeholder="$t('mail.password')"></el-input>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="visible = false">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import baseService from "@/service/baseService";
import { useDebounce } from "@/utils/utils";
export default defineComponent({
  setup() {
    return reactive({
      visible: false,
      dataForm: {
        smtp: "",
        port: "",
        username: "",
        password: ""
      }
    });
  },
  computed: {
    dataRule() {
      return {
        smtp: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        port: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        username: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        password: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }]
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
        this.getInfo();
      });
    },
    // 获取信息
    getInfo() {
      baseService.get("/message/mailtemplate/config").then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.dataForm = res.data;
      });
    },
    // 表单提交
    dataFormSubmitHandle() {
      this.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        baseService.post("/message/mailtemplate/saveConfig", this.dataForm).then((res) => {
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
