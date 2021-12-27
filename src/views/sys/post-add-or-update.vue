<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-form-item :label="$t('post.postCode')" prop="postCode">
        <el-input v-model="dataForm.postCode"></el-input>
      </el-form-item>
      <el-form-item :label="$t('post.postName')" prop="postName">
        <el-input v-model="dataForm.postName"></el-input>
      </el-form-item>
      <el-form-item :label="$t('post.sort')" prop="sort">
        <el-input-number v-model="dataForm.sort" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item :label="$t('post.status')" prop="status">
        <ren-radio-group v-model="dataForm.status" dict-type="post_status"></ren-radio-group>
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
        id: "",
        postCode: "",
        postName: "",
        sort: 0,
        status: 1
      }
    });
  },
  computed: {
    dataRule() {
      return {
        postCode: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        postName: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        sort: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        status: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }]
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
      baseService.get("/sys/post/" + this.dataForm.id).then((res) => {
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
        (!this.dataForm.id ? baseService.post : baseService.put)("/sys/post/", this.dataForm).then((res) => {
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
