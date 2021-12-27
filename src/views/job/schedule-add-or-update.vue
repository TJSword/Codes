<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="beanName" :label="$t('schedule.beanName')">
        <el-input v-model="dataForm.beanName" :placeholder="$t('schedule.beanNameTips')"></el-input>
      </el-form-item>
      <el-form-item prop="params" :label="$t('schedule.params')">
        <el-input v-model="dataForm.params" :placeholder="$t('schedule.params')"></el-input>
      </el-form-item>
      <el-form-item prop="cronExpression" :label="$t('schedule.cronExpression')">
        <el-popover v-model:visible="cronPopover" popper-class="schedule-cron-popover">
          <Cron @submit="changeCron" @close="cronPopover = false" :lang="$i18n.locale"></Cron>
          <template v-slot:reference>
            <el-input v-model="dataForm.cronExpression" @click="cronPopover = true" :placeholder="$t('schedule.cronExpressionTips')"></el-input>
          </template>
        </el-popover>
      </el-form-item>
      <el-form-item prop="remark" :label="$t('schedule.remark')">
        <el-input v-model="dataForm.remark" :placeholder="$t('schedule.remark')"></el-input>
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
import Cron from "@/components/cron/index";
export default defineComponent({
  components: { Cron },
  setup() {
    return reactive({
      visible: false,
      dataForm: {
        id: "",
        beanName: "",
        params: "",
        cronExpression: "",
        remark: "",
        status: 0
      },
      cronPopover: false
    });
  },
  computed: {
    dataRule() {
      return {
        beanName: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        cronExpression: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }]
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
    changeCron(val: any) {
      this.dataForm.cronExpression = val;
    },
    // 获取信息
    getInfo() {
      baseService.get(`/job/schedule/${this.dataForm.id}`).then((res) => {
        if (res.code !== 0) {
          this.$message.error(res.msg);
          return;
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
        const fn = !this.dataForm.id ? baseService.post("/job/schedule", this.dataForm) : baseService.put("/job/schedule", this.dataForm);
        fn.then((res) => {
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
.schedule-cron {
  &-popover {
    width: auto !important;
    min-width: 550px !important;
  }
}
</style>
