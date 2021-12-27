<template>
  <el-dialog v-model="visible" :title="handleTitle" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-form-item :label="$t('process.comment')" prop="comment">
        <el-input type="textarea" v-model="dataForm.comment" :placeholder="$t('process.comment')"></el-input>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="visible = false">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import { defineComponent, reactive, toRefs } from "vue";
import baseService from "@/service/baseService";
import { useDebounce } from "@/utils/utils";
export default defineComponent({
  setup() {
    const state = reactive({
      createdIsNeed: false,
      visible: false,
      handleType: "",
      handleTitle: "",
      dataForm: {
        comment: "",
        taskId: ""
      }
    });
    return { ...useView(state), ...toRefs(state) };
  },
  created() {
    this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
    this.rejectTask = useDebounce(this.rejectTask);
    this.completeTask = useDebounce(this.completeTask);
  },
  computed: {
    dataRule() {
      return {
        comment: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }]
      };
    }
  },
  methods: {
    init() {
      this.visible = true;
      if (this.handleType === "complete") {
        this.handleTitle = this.$t("process.completeTask");
      } else if (this.handleType === "reject") {
        this.handleTitle = this.$t("process.rejectTask");
      }
      this.$nextTick(() => {
        this.$refs["dataFormRef"].resetFields();
      });
    },
    // 表单提交
    dataFormSubmitHandle() {
      if (this.handleType === "complete") {
        this.completeTask();
      } else if (this.handleType === "reject") {
        this.rejectTask();
      }
    },
    // 驳回
    rejectTask() {
      this.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        if (!this.dataForm.taskId) {
          return false;
        }
        const params = {
          taskId: this.dataForm.taskId,
          comment: this.dataForm.comment
        };
        baseService
          .post("/flow/common/reject", params, {
            "content-type": "application/x-www-form-urlencoded"
          })
          .then((res) => {
            if (res.code !== 0) {
              this.$message.error(res.msg);
              return;
            }
            this.$message({
              message: this.$t("prompt.success"),
              type: "success",
              duration: 500,
              onClose: () => {
                this.visible = false;
                this.closeCurrentTab();
              }
            });
          });
      });
    },
    // 通过
    completeTask() {
      this.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        if (!this.dataForm.taskId) {
          return false;
        }
        const params = {
          taskId: this.dataForm.taskId,
          comment: this.dataForm.comment
        };
        baseService
          .post("/flow/common/complete?", params, {
            "content-type": "application/x-www-form-urlencoded"
          })
          .then((res) => {
            if (res.code !== 0) {
              this.$message.error(res.msg);
              return;
            }
            this.$message({
              message: this.$t("prompt.success"),
              type: "success",
              duration: 500,
              onClose: () => {
                this.visible = false;
                this.closeCurrentTab();
              }
            });
          });
      });
    }
  }
});
</script>
