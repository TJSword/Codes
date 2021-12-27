<template>
  <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
    <el-form-item :label="$t('updatePassword.username')">
      <span>{{ user.username }}</span>
    </el-form-item>
    <el-form-item prop="password" :label="$t('updatePassword.password')">
      <el-input v-model="dataForm.password" type="password" :placeholder="$t('updatePassword.password')"></el-input>
    </el-form-item>
    <el-form-item prop="newPassword" :label="$t('updatePassword.newPassword')">
      <el-input v-model="dataForm.newPassword" type="password" :placeholder="$t('updatePassword.newPassword')"></el-input>
    </el-form-item>
    <el-form-item prop="confirmPassword" :label="$t('updatePassword.confirmPassword')">
      <el-input v-model="dataForm.confirmPassword" type="password" :placeholder="$t('updatePassword.confirmPassword')"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="dataFormSubmitHandle">{{ $t("confirm") }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { IObject } from "@/types/interface";
import baseService from "@/service/baseService";
import { useStore } from "vuex";
import { useDebounce } from "@/utils/utils";
export default defineComponent({
  setup() {
    const store = useStore();
    return reactive({
      user: store.state.user,
      dataForm: {
        password: "",
        newPassword: "",
        confirmPassword: ""
      }
    });
  },
  created() {
    this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
  },
  computed: {
    dataRule() {
      const validateConfirmPassword = (rule: IObject, value: string, callback: (e?: Error) => any) => {
        if (this.dataForm.newPassword !== value) {
          return callback(new Error(this.$t("updatePassword.validate.confirmPassword")));
        }
        callback();
      };
      return {
        password: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        newPassword: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        confirmPassword: [
          { required: true, message: this.$t("validate.required"), trigger: "blur" },
          { validator: validateConfirmPassword, trigger: "blur" }
        ]
      };
    }
  },
  methods: {
    // 表单提交
    dataFormSubmitHandle() {
      this.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        baseService.put("/sys/user/password", this.dataForm).then((res) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.$message({
            message: this.$t("prompt.success"),
            type: "success",
            duration: 500,
            onClose: () => {
              this.$router.replace("/login");
            }
          });
        });
      });
    }
  }
});
</script>
