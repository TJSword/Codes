<template>
  <el-dialog v-model="visible" :title="$t('mail.send')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="mailTo" :label="$t('mail.mailTo')">
        <el-input v-model="dataForm.mailTo" :placeholder="$t('mail.mailTo')"></el-input>
      </el-form-item>
      <el-form-item prop="mailCc" :label="$t('mail.mailCc')">
        <el-input v-model="dataForm.mailCc" :placeholder="$t('mail.mailCc')"></el-input>
      </el-form-item>
      <el-form-item prop="params" :label="$t('mail.params')">
        <el-input v-model="dataForm.params" :placeholder="$t('mail.paramsTips')"></el-input>
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
import { isEmail, useDebounce } from "@/utils/utils";
import { IObject } from "@/types/interface";
export default defineComponent({
  setup() {
    return reactive({
      visible: false,
      dataForm: {
        id: "",
        mailTo: "",
        mailCc: "",
        params: ""
      }
    });
  },
  computed: {
    dataRule() {
      var validateEmail = (rule: IObject, value: string, callback: (e?: Error) => any) => {
        if (!isEmail(value)) {
          return callback(new Error(this.$t("validate.format", { attr: this.$t("user.email") })));
        }
        callback();
      };
      return {
        mailTo: [
          { required: true, message: this.$t("validate.required"), trigger: "blur" },
          { validator: validateEmail, trigger: "blur" }
        ]
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
      });
    },
    // 表单提交
    dataFormSubmitHandle() {
      this.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        baseService
          .post("/message/mailtemplate/send", this.dataForm, {
            "content-type": "application/x-www-form-urlencoded"
          })
          .then((res) => {
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
