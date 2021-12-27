<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="username" :label="$t('user.username')">
        <el-input v-model="dataForm.username" :placeholder="$t('user.username')"></el-input>
      </el-form-item>
      <el-form-item prop="deptName" :label="$t('user.deptName')">
        <ren-dept-tree v-model="dataForm.deptId" :placeholder="$t('dept.title')" v-model:deptName="dataForm.deptName"></ren-dept-tree>
      </el-form-item>
      <el-form-item prop="password" :label="$t('user.password')" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.password" type="password" :placeholder="$t('user.password')"></el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword" :label="$t('user.confirmPassword')" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.confirmPassword" type="password" :placeholder="$t('user.confirmPassword')"></el-input>
      </el-form-item>
      <el-form-item prop="realName" :label="$t('user.realName')">
        <el-input v-model="dataForm.realName" :placeholder="$t('user.realName')"></el-input>
      </el-form-item>
      <el-form-item prop="gender" :label="$t('user.gender')">
        <ren-radio-group v-model="dataForm.gender" dict-type="gender"></ren-radio-group>
      </el-form-item>
      <el-form-item prop="email" :label="$t('user.email')">
        <el-input v-model="dataForm.email" :placeholder="$t('user.email')"></el-input>
      </el-form-item>
      <el-form-item prop="mobile" :label="$t('user.mobile')">
        <el-input v-model="dataForm.mobile" :placeholder="$t('user.mobile')"></el-input>
      </el-form-item>
      <el-form-item prop="roleIdList" :label="$t('user.roleIdList')" class="role-list">
        <el-select v-model="dataForm.roleIdList" multiple :placeholder="$t('user.roleIdList')">
          <el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="postIdList" :label="$t('user.postIdList')" class="role-list">
        <el-select v-model="dataForm.postIdList" multiple :placeholder="$t('user.postIdList')">
          <el-option v-for="post in postList" :key="post.id" :label="post.postName" :value="post.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="status" :label="$t('user.status')" size="mini">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">{{ $t("user.status0") }}</el-radio>
          <el-radio :label="1">{{ $t("user.status1") }}</el-radio>
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
import { isEmail, isMobile, useDebounce } from "@/utils/utils";
import { IObject } from "@/types/interface";
export default defineComponent({
  setup() {
    const state = reactive({
      dataForm: {
        id: "",
        username: "",
        deptId: "",
        deptName: "",
        password: "",
        confirmPassword: "",
        realName: "",
        gender: 0,
        email: "",
        mobile: "",
        roleIdList: [] as IObject[],
        postIdList: [] as IObject[],
        status: 1
      },
      visible: false,
      roleList: [] as IObject[],
      roleIdListDefault: [] as IObject[],
      postList: [] as IObject[]
    });
    return state;
  },
  computed: {
    dataRule() {
      const validatePassword = (rule: any, value: string, callback: (e?: Error) => any): any => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          return callback(new Error(this.$t("validate.required")));
        }
        callback();
      };
      const validateConfirmPassword = (rule: any, value: string, callback: (e?: Error) => any): any => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          return callback(new Error(this.$t("validate.required")));
        }
        if (this.dataForm.password !== value) {
          return callback(new Error(this.$t("user.validate.confirmPassword")));
        }
        callback();
      };
      const validateEmail = (rule: any, value: string, callback: (e?: Error) => any): any => {
        if (value && !isEmail(value)) {
          return callback(new Error(this.$t("validate.format", { attr: this.$t("user.email") })));
        }
        callback();
      };
      const validateMobile = (rule: any, value: string, callback: (e?: Error) => any): any => {
        if (value && !isMobile(value)) {
          return callback(new Error(this.$t("validate.format", { attr: this.$t("user.mobile") })));
        }
        callback();
      };
      return {
        username: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        deptName: [{ required: true, message: this.$t("validate.required"), trigger: "change" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
        confirmPassword: [{ validator: validateConfirmPassword, trigger: "blur" }],
        realName: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        email: [{ validator: validateEmail, trigger: "blur" }],
        mobile: [{ validator: validateMobile, trigger: "blur" }]
      };
    }
  },
  created() {
    this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
  },
  methods: {
    init() {
      this.visible = true;
      this.dataForm.deptId = "";
      this.$nextTick(() => {
        this.$refs["dataFormRef"].resetFields();
        this.roleIdListDefault = [];
        Promise.all([this.getRoleList(), this.getPostList()]).then(() => {
          if (this.dataForm.id) {
            this.getInfo();
          }
        });
      });
    },
    // 获取角色列表
    getRoleList() {
      return baseService.get("/sys/role/list").then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.roleList = res.data;
      });
    },
    // 获取岗位列表
    getPostList() {
      return baseService.get("/sys/post/list").then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.postList = res.data;
      });
    },
    // 获取信息
    getInfo() {
      baseService.get(`/sys/user/${this.dataForm.id}`).then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data,
          roleIdList: []
        };
        // 角色配置, 区分是否为默认角色
        for (let i = 0; i < res.data.roleIdList.length; i++) {
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
        (!this.dataForm.id ? baseService.post : baseService.put)("/sys/user", {
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

<style lang="less" scoped>
.mod-sys__user {
  .role-list {
    .el-select {
      width: 100%;
    }
  }
}
</style>
