<template>
  <el-dialog v-model="visible" title="Excel导入" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-upload name="file" :action="url" :file-list="fileList" drag :before-upload="beforeUploadHandle" :on-success="successHandle" class="text-center">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text" v-html="$t('upload.text')"></div>
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
      this.url = `${app.api}/sys/excel/import?access_token=${getToken()}`;
      this.fileList = [];
    },
    // 上传之前
    beforeUploadHandle() {
      //
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
