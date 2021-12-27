<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="name" :label="$t('mail.name')">
        <el-input v-model="dataForm.name" :placeholder="$t('mail.name')"></el-input>
      </el-form-item>
      <el-form-item prop="subject" :label="$t('mail.subject')">
        <el-input v-model="dataForm.subject" :placeholder="$t('mail.subject')"></el-input>
      </el-form-item>
      <el-form-item prop="content" :label="$t('mail.content')">
        <!-- 富文本编辑器, 容器 -->
        <div id="J_quillEditor" style="height: 200px"></div>
        <!-- 自定义上传图片功能 (使用element upload组件) -->
        <el-upload :action="uploadUrl" :show-file-list="false" :before-upload="uploadBeforeUploadHandle" :on-success="uploadSuccessHandle" style="display: none">
          <el-button ref="uploadBtn" type="primary" size="small">{{ $t("upload.button") }}</el-button>
        </el-upload>
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
import "quill/dist/quill.snow.css";
import Quill from "quill";
import { IObject } from "@/types/interface";
import app from "@/constants/app";
import { getToken } from "@/utils/cache";
import { useDebounce } from "@/utils/utils";
export default defineComponent({
  setup() {
    return reactive({
      visible: false,
      quillEditor: null as Quill | any,
      quillEditorToolbarOptions: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block", "image"],
        [{ header: 1 }, { header: 2 }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ["clean"]
      ],
      uploadUrl: "",
      dataForm: {
        id: "",
        name: "",
        subject: "",
        content: ""
      }
    });
  },
  computed: {
    dataRule() {
      const validateContent = (rule: IObject, value: string, callback: (e?: Error) => any) => {
        if (this.quillEditor && this.quillEditor.getLength() <= 1) {
          return callback(new Error(this.$t("validate.required")));
        }
        callback();
      };
      return {
        name: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        subject: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        content: [
          { required: true, message: this.$t("validate.required"), trigger: "blur" },
          { validator: validateContent, trigger: "blur" }
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
        if (this.quillEditor) {
          this.quillEditor.deleteText(0, this.quillEditor.getLength());
        } else {
          this.quillEditorHandle();
        }
        this.$refs["dataFormRef"].resetFields();
        if (this.dataForm.id) {
          this.getInfo();
        }
      });
    },
    // 富文本编辑器
    quillEditorHandle() {
      this.quillEditor = new Quill("#J_quillEditor", {
        modules: {
          toolbar: this.quillEditorToolbarOptions
        },
        theme: "snow"
      });
      // 自定义上传图片功能 (使用element upload组件)
      this.uploadUrl = `${app.api}/oss/file/upload?access_token=${getToken()}`;
      this.quillEditor.getModule("toolbar").addHandler("image", () => {
        this.$refs.uploadBtn.$el.click();
      });
      // 监听内容变化，动态赋值
      this.quillEditor.on("text-change", () => {
        if (this.quillEditor) {
          this.dataForm.content = this.quillEditor.root.innerHTML;
        }
      });
    },
    // 上传图片之前
    uploadBeforeUploadHandle(file: IObject) {
      if (file.type !== "image/jpg" && file.type !== "image/jpeg" && file.type !== "image/png" && file.type !== "image/gif") {
        this.$message.error(this.$t("upload.tip", { format: "jpg、png、gif" }));
        return false;
      }
    },
    // 上传图片成功
    uploadSuccessHandle(res: IObject) {
      if (res.code !== 0) {
        return this.$message.error(res.msg);
      }
      if (this.quillEditor) {
        const selection = this.quillEditor.getSelection();
        if (selection) {
          this.quillEditor.insertEmbed(selection.index, "image", res.data.url);
        }
      }
    },
    // 获取信息
    getInfo() {
      baseService.get(`/message/mailtemplate/${this.dataForm.id}`).then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        if (this.quillEditor) {
          this.dataForm = res.data;
          this.quillEditor.root.innerHTML = this.dataForm.content;
        }
      });
    },
    // 表单提交
    dataFormSubmitHandle() {
      this.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        (!this.dataForm.id ? baseService.post : baseService.put)("/message/mailtemplate", this.dataForm, {
          "content-type": "application/x-www-form-urlencoded"
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
