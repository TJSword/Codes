<script lang="ts">
import app from "@/constants/app";
import { EMitt, EThemeSetting } from "@/constants/enum";
import emits from "@/utils/emits";
import { getThemeConfigCacheByKey } from "@/utils/theme";
import { defineComponent, nextTick, reactive } from "vue";
import { useStore } from "vuex";
import Tabs from "./tabs.vue";

/**
 * 业务内容视图框架
 */
export default defineComponent({
  name: "View",
  components: { Tabs },
  setup() {
    const store = useStore();
    const state = reactive({
      openTabsPage: getThemeConfigCacheByKey(EThemeSetting.OpenTabsPage),
      isShowView: true
    });
    emits.on(EMitt.OnSetThemeTabsPage, (vl) => {
      state.openTabsPage = vl;
    });
    emits.on(EMitt.OnReloadTabPage, () => {
      state.isShowView = false;
      nextTick(() => {
        state.isShowView = true;
      });
    });
    return { state, store, enabledKeepAlive: app.enabledKeepAlive };
  }
});
</script>

<template>
  <tabs v-if="state.openTabsPage" :tabs="store.state.tabs" :activeTabName="store.state.activeTabName"></tabs>
  <div class="rr-view-ctx">
    <el-card shadow="never" class="rr-view-ctx-card">
      <router-view v-if="state.isShowView" v-slot="{ Component }">
        <keep-alive v-if="enabledKeepAlive">
          <component :is="Component" :key="$route.fullPath" />
        </keep-alive>
        <component :is="Component" v-if="!enabledKeepAlive" />
      </router-view>
    </el-card>
  </div>
</template>
