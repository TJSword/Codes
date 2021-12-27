<template>
  <router-view v-slot="{ Component }">
    <keep-alive v-if="enabledKeepAlive">
      <component :is="Component" :key="$route.fullPath" />
    </keep-alive>
    <component :is="Component" v-if="!enabledKeepAlive" />
  </router-view>
</template>
<script lang="ts">
import app from "@/constants/app";
import { defineComponent } from "vue";
export default defineComponent({
  setup() {
    return { enabledKeepAlive: app.enabledKeepAlive };
  }
});
</script>
