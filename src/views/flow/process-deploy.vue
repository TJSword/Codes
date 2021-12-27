<template>
  <el-dialog v-model="visible" :title="$t('process.deployFile')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-upload name="processFile" :action="url" :file-list="fileList" drag :before-upload="beforeUploadHandle" :on-success="successHandle" class="text-center">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text" v-html="$t('upload.text')"></div>
      <template v-slot:tip>
        <div class="el-upload__tip">
          {{ $t("upload.tip", { format: "zip、bpmn20.xml、bpmn" }) }}
        </div>
      </template>
    </el-upload>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import app from "@/constants/app";
import { getToken } from "@/utils/cache";
import { IObject } from "@/types/interface";
export default defineComponent({
  setup() {
    return reactive({
      visible: false,
      url: "",
      fileList: []
    });
  },
  methods: {
    init() {
      this.visible = true;
      this.url = `${app.api}/flow/process/deploy?access_token=${getToken()}`;
      this.fileList = [];
    },
    // 上传之前
    beforeUploadHandle(file: IObject) {
      if (!/.+\.zip$/.test(file.name) && !/.+\.xml$/.test(file.name) && !/.+\.bar$/.test(file.name) && !/.+\.bpmn$/.test(file.name)) {
        this.$message.error(this.$t("upload.tip", { format: "zip、xml、bar、bpmn" }));
        return false;
      }
    },
    // 上传成功
    successHandle(res: IObject) {
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
    }
  }
});
</script>
