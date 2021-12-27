<template>
  <div class="editor" ref="dom"></div>
</template>
<script lang="ts">
import { onMounted, ref, defineComponent, watch, onUnmounted, shallowRef } from "vue";
import * as monaco from "monaco-editor";
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";

//https://github.com/vitejs/vite/discussions/1791
export default defineComponent({
  name: "vsCode",
  props: {
    modelValue: {
      type: String,
      default: ""
    },
    theme: {
      type: String,
      default: "vs"
    },
    language: { type: String, default: "json" },
    options: Object
  },
  emits: ["change", "update:modelValue"],
  setup(props, { emit }) {
    const dom = ref();
    const vs = shallowRef();
    const self: any = window;

    self.MonacoEnvironment = {
      getWorker() {
        return new EditorWorker();
      }
    };

    onMounted(() => {
      const editor = monaco.editor.create(dom.value, {
        model: monaco.editor.createModel(props.modelValue, props.language),
        tabSize: 2,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        theme: props.theme,
        ...props.options
      });
      vs.value = editor;
      editor.onDidChangeModelContent(() => {
        const value = editor.getValue();
        emit("update:modelValue", value);
        emit("change", value);
      });
      watch(
        () => props.modelValue,
        (vl) => {
          if (vl !== editor.getValue()) {
            editor.setValue(vl);
          }
        }
      );
      watch(
        () => props.theme,
        (vl) => {
          monaco.editor.setTheme(vl);
        }
      );
      watch(
        () => props.language,
        (vl) => {
          monaco.editor.setModelLanguage(editor.getModel() as monaco.editor.ITextModel, vl);
        }
      );
      watch(
        () => props.options,
        (vl) => {
          editor.updateOptions(vl as monaco.editor.IEditorOptions);
        }
      );
    });

    onUnmounted(() => {
      vs.value && vs.value.dispose();
    });

    return { dom };
  }
});
</script>

<style scoped>
.editor {
  height: 100%;
}
</style>
