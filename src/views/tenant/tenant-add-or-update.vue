<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="tenantCode" :label="$t('tenant.tenantCode')">
        <el-input v-model="dataForm.tenantCode" :placeholder="$t('tenant.tenantCode')" :disabled="!!dataForm.id"></el-input>
      </el-form-item>
      <el-form-item prop="tenantName" :label="$t('tenant.tenantName')">
        <el-input v-model="dataForm.tenantName" :placeholder="$t('tenant.tenantName')" :disabled="!!dataForm.id"></el-input>
      </el-form-item>
      <el-form-item prop="username" :label="$t('tenant.username')">
        <el-input v-model="dataForm.username" :placeholder="$t('tenant.username')"></el-input>
      </el-form-item>
      <el-form-item prop="password" :label="$t('tenant.password')" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.password" type="password" :placeholder="$t('tenant.password')"></el-input>
      </el-form-item>
      <el-form-item prop="realName" :label="$t('tenant.realName')">
        <el-input v-model="dataForm.realName" :placeholder="$t('tenant.realName')"></el-input>
      </el-form-item>
      <el-form-item prop="email" :label="$t('tenant.email')">
        <el-input v-model="dataForm.email" :placeholder="$t('tenant.email')"></el-input>
      </el-form-item>
      <el-form-item prop="mobile" :label="$t('tenant.mobile')">
        <el-input v-model="dataForm.mobile" :placeholder="$t('tenant.mobile')"></el-input>
      </el-form-item>
      <el-form-item prop="remark" :label="$t('tenant.remark')">
        <el-input v-model="dataForm.remark" :placeholder="$t('tenant.remark')"></el-input>
      </el-form-item>
      <el-form-item prop="roleIdList" :label="$t('tenant.roleIdList')" class="role-list">
        <el-select v-model="dataForm.roleIdList" multiple :placeholder="$t('tenant.roleIdList')">
          <el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="status" :label="$t('tenant.status')" size="mini">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">{{ $t("tenant.status0") }}</el-radio>
          <el-radio :label="1">{{ $t("tenant.status1") }}</el-radio>
        </el-radio-group>
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
import { isEmail, isMobile, isNumber, useDebounce } from "@/utils/utils";
import { IObject } from "@/types/interface";
export default defineComponent({
  setup() {
    return reactive({
      visible: false,
      roleList: [] as IObject,
      roleIdListDefault: [] as string[],
      dataForm: {
        id: "",
        tenantCode: "",
        tenantName: "",
        username: "",
        password: "",
        realName: "",
        email: "",
        mobile: "",
        remark: "",
        roleIdList: [] as string[],
        status: 1
      }
    });
  },
  computed: {
    dataRule() {
      const validateNumber = (rule: IObject, value: string, callback: (e?: Error) => any) => {
        if (!isNumber(value)) {
          return callback(new Error(this.$t("tenant.validate.number")));
        }
        callback();
      };
      const validatePassword = (rule: IObject, value: string, callback: (e?: Error) => any) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          return callback(new Error(this.$t("validate.required")));
        }
        callback();
      };
      const validateEmail = (rule: IObject, value: string, callback: (e?: Error) => any) => {
        if (!isEmail(value)) {
          return callback(new Error(this.$t("validate.format", { attr: this.$t("tenant.email") })));
        }
        callback();
      };
      const validateMobile = (rule: IObject, value: string, callback: (e?: Error) => any) => {
        if (!isMobile(value)) {
          return callback(new Error(this.$t("validate.format", { attr: this.$t("tenant.mobile") })));
        }
        callback();
      };
      return {
        username: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        tenantCode: [
          { required: true, message: this.$t("validate.required"), trigger: "blur" },
          { validator: validateNumber, trigger: "blur" }
        ],
        tenantName: [{ required: true, message: this.$t("validate.required"), trigger: "change" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
        realName: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        email: [
          { required: true, message: this.$t("validate.required"), trigger: "blur" },
          { validator: validateEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: this.$t("validate.required"), trigger: "blur" },
          { validator: validateMobile, trigger: "blur" }
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
        this.roleIdListDefault = [];
        Promise.all([this.getRoleList()]).then(() => {
          if (this.dataForm.id) {
            this.getInfo();
          }
        });
      });
    },
    // 获取角色列表
    getRoleList() {
      return baseService.get("/sys/tenant/role/list").then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.roleList = res.data;
      });
    },
    // 获取信息
    getInfo() {
      baseService.get(`/sys/tenant/${this.dataForm.id}`).then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data,
          roleIdList: []
        };
        // 角色配置, 区分是否为默认角色
        for (var i = 0; i < res.data.roleIdList.length; i++) {
          if (this.roleList.filter((item: IObject) => item.id === res.data.roleIdList[i])[0]) {
            this.dataForm.roleIdList.push(res.data.roleIdList[i]);
            continue;
          }
          this.roleIdListDefault.push(res.data.roleIdList[i]);
        }
      });
    },
    // 表单提交
    dataFormSubmitHandle() {
      this.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        (!this.dataForm.id ? baseService.post : baseService.put)("/sys/tenant", {
          ...this.dataForm,
          roleIdList: [...this.dataForm.roleIdList, ...this.roleIdListDefault]
        }).then((res) => {
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

<style lang="less">
.mod-tenant__tenant {
  .role-list {
    .el-select {
      width: 100%;
    }
  }
}
</style>
