<template>
  <el-card shadow="never" class="aui-card--fill">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-form-item :label="$t('correction.post')" prop="applyPost">
        <el-input v-model="dataForm.applyPost" :disabled="fieldDisabled" :placeholder="$t('correction.post')"></el-input>
      </el-form-item>
      <el-row :gutter="40">
        <el-col :span="12">
          <el-form-item :label="$t('correction.entryDate')" prop="entryDate">
            <el-date-picker v-model="dataForm.entryDate" :disabled="fieldDisabled" value-format="YYYY-MM-DD" :placeholder="$t('correction.entryDate')" style="width: 100%"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('correction.correctionDate')" prop="correctionDate">
            <el-date-picker v-model="dataForm.correctionDate" :disabled="fieldDisabled" value-format="YYYY-MM-DD" :placeholder="$t('correction.correctionDate')" style="width: 100%"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="$t('correction.workContent')" prop="workContent">
        <el-input type="textarea" v-model="dataForm.workContent" :disabled="fieldDisabled" :placeholder="$t('correction.workContent')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('correction.achievement')" prop="achievement">
        <el-input type="textarea" v-model="dataForm.achievement" :disabled="fieldDisabled" :placeholder="$t('correction.achievement')"></el-input>
      </el-form-item>
    </el-form>
    <el-row :gutter="640" v-if="!fieldDisabled">
      <el-col :span="4" :offset="1">
        <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t("process.createInstance") }}</el-button>
      </el-col>
    </el-row>
    <ren-process-running v-if="runningHandleVisible" ref="renProcessRunning"></ren-process-running>
    <ren-process-detail v-if="processDetailVisible" ref="renProcessDetail"></ren-process-detail>
  </el-card>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import { IObject } from "@/types/interface";
import baseService from "@/service/baseService";
import { useDebounce } from "@/utils/utils";
import { defineComponent, reactive, toRefs } from "vue";
export default defineComponent({
  setup() {
    const state = reactive({
      createdIsNeed: false,
      // 表单属性是否可编辑
      fieldDisabled: false,
      // 是否任务处理
      runningHandleVisible: false,
      // 是否显示流程处理详情
      processDetailVisible: false,
      dataForm: {
        id: "",
        applyPost: "",
        entryDate: "",
        correctionDate: "",
        workContent: "",
        achievement: "",
        //必传
        processDefinitionId: ""
      }
    });
    return { ...useView(state), ...toRefs(state) };
  },
  created() {
    this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
    this.init();
  },
  activated() {
    this.init();
  },
  computed: {
    dataRule(): IObject {
      return {
        applyPost: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        entryDate: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        correctionDate: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        workContent: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        achievement: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        createTime: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }]
      };
    }
  },
  methods: {
    init() {
      const showType = this.$route.query.showType;
      this.dataForm.id = this.$route.query.businessKey as string;
      this.dataForm.processDefinitionId = this.$route.query.processDefinitionId as string;
      this.$nextTick(() => {
        this.$refs.dataFormRef.resetFields();
        //表单已存在，不允许编辑
        if (this.dataForm.id) {
          this.fieldDisabled = true;
          this.getInfo();
        }

        //查看流程
        if (showType === "detail") {
          this.processDetailVisible = true;
        } else if (showType === "taskHandle") {
          //处理流程
          this.runningHandleVisible = true;
        } else {
          this.processDetailVisible = false;
          this.runningHandleVisible = false;
          this.fieldDisabled = false;
        }
      });
    },
    // 启动流程
    dataFormSubmitHandle() {
      this.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        (!this.dataForm.id ? baseService.post : baseService.put)("/flow/demo/correction/start", this.dataForm).then((res) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.$message({
            message: this.$t("prompt.success"),
            type: "success",
            duration: 500,
            onClose: () => {
              this.closeCurrentTab();
            }
          });
        });
      });
    },
    // 获取表单信息
    getInfo() {
      baseService.get(`/flow/demo/correction/${this.dataForm.id}`).then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        };
      });
    }
  }
});
</script>
