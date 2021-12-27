<template>
  <el-dialog v-model="visible" :title="$t('oss.upload')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-upload :action="url" :file-list="fileList" drag multiple :before-upload="beforeUploadHandle" :on-success="successHandle" class="text-center">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text" v-html="$t('upload.text')"></div>
      <template v-slot:tip>
        <div class="el-upload__tip">
          {{ $t("upload.tip", { format: "jpg、png、gif" }) }}
        </div>
      </template>
    </el-upload>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { getToken } from "@/utils/cache";
import { IObject } from "@/types/interface";
import app from "@/constants/app";
export default defineComponent({
  setup() {
    return reactive({
      visible: false,
      url: "",
      num: 0,
      fileList: [] as IObject[]
    });
  },
  methods: {
    init() {
      this.visible = true;
      this.url = `${app.api}/oss/file/upload?access_token=${getToken()}`;
      this.num = 0;
      this.fileList = [];
    },
    // 上传之前
    beforeUploadHandle(file: IObject) {
      if (file.type !== "image/jpg" && file.type !== "image/jpeg" && file.type !== "image/png" && file.type !== "image/gif") {
        this.$message.error(this.$t("upload.tip", { format: "jpg、png、gif" }));
        return false;
      }
      this.num++;
    },
    // 上传成功
    successHandle(res: IObject, file: IObject, fileList: IObject[]) {
      if (res.code !== 0) {
        return this.$message.error(res.msg);
      }
      this.fileList = fileList;
      this.num--;
      if (this.num === 0) {
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
  }
});
</script>
