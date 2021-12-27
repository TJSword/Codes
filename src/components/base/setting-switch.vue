<script lang="ts">
import { defineComponent } from "vue";

/**
 * Switch开关组件
 */
export default defineComponent({
  name: "SettingSwitch",
  props: {
    title: String,
    value: Boolean,
    onChange: Function
  },
  setup(props) {
    return { props };
  }
});
</script>
<template>
  <el-space class="rr-switch">
    <span>{{ props.title }}</span>
    <el-switch v-model="props.value" @change="props.onChange"></el-switch>
  </el-space>
</template>
