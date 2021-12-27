<template>
  <editor api-key="wem3vxcrufyxbecsk5c7ffa8w6358pq3cnqqdoxho5cek6bj" v-model="value" :init="options"></editor>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import Editor from "@tinymce/tinymce-vue";
import { getToken } from "@/utils/cache";
import app from "@/constants/app";
import { getLocaleLang } from "@/i18n";

export default defineComponent({
  name: "Tinymce",
  components: { editor: Editor },
  emits: ["update:modelValue"],
  props: {
    modelValue: String,
    init: Object
  },
  setup(props, { emit }) {
    const value = ref("");
    const lang = getLocaleLang();
    const options = {
      height: 300,
      language: lang === "zh-CN" ? "zh_CN" : "en_US",
      branding: false,
      images_upload_url: `${app.api}/oss/file/tinymce/upload?access_token=${getToken()}`,
      plugins: [
        "advlist anchor autolink autosave code codesample directionality emoticons fullscreen hr image imagetools insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textpattern visualblocks visualchars wordcount"
      ],
      toolbar:
        "code searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent blockquote removeformat subscript superscript codesample hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen",
      ...props.init
    };
    watch(
      () => value.value,
      (vl) => {
        emit("update:modelValue", vl);
      }
    );
    watch(
      () => props.modelValue,
      (vl) => {
        value.value = vl || "";
      }
    );
    return { props, options, value };
  }
});
</script>
