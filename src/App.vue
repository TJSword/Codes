<script lang="ts">
import "@/assets/css/app.less";
import Layout from "@/layout/index.vue";
import "@/assets/theme/index.less";
import { defineComponent, onMounted, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import app from "./constants/app";
import { EMitt, EPageLayoutEnum, EThemeColor, EThemeSetting } from "./constants/enum";
import { getLocaleLang } from "./i18n";
import { IObject } from "./types/interface";
import FullscreenLayout from "@/layout/fullscreen-layout.vue";
import "@/assets/theme/mobile.less";
import emits from "./utils/emits";
import { getThemeConfigCache, setThemeColor, updateTheme } from "./utils/theme";

export default defineComponent({
  name: "App",
  components: { Layout, FullscreenLayout },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const { t, locale } = useI18n();
    const state = reactive({
      layout: location.href.includes("pop=true") ? EPageLayoutEnum.fullscreen : EPageLayoutEnum.page
    });
    const onInitLang = (vl: string, oldVl?: string) => {
      window.document.querySelector("html")?.setAttribute("lang", vl);
      document.title = t("ui.app.productName");
      if (oldVl && route.path !== "/login") {
        store.commit("updateState", { appIsReady: false });
        location.reload();
      }
    };
    onMounted(() => {
      //读取主题色缓存
      const themeCache = getThemeConfigCache();
      const themeColor = themeCache[EThemeSetting.ThemeColor];
      setThemeColor(EThemeColor.ThemeColor, themeColor);
      updateTheme(themeColor);
      onInitLang(getLocaleLang());
    });
    watch(() => locale.value, onInitLang);
    watch(
      () => [route.path, route.query],
      ([path, query]) => {
        state.layout = app.fullscreenPages.includes(path as string) || (query as IObject)["pop"] ? EPageLayoutEnum.fullscreen : EPageLayoutEnum.page;
      }
    );
    watch(
      () => route.fullPath,
      (vl) => {
        if (!route.query.pop) {
          emits.emit(EMitt.OnPushMenuToTabs, {
            label: route.query._mt || router.currentRoute.value.meta.title || route.path,
            value: vl,
            mete: router.currentRoute.value.meta
          });
        }
      }
    );
    return {
      store,
      state,
      pageTag: EPageLayoutEnum.page
    };
  }
});
</script>
<template>
  <div v-if="!store.state.appIsRender" v-loading="true" :element-loading-fullscreen="true" :element-loading-lock="true" style="width: 100vw; height: 100vh; position: absolute; top: 0; left: 0; z-index: 99999; background: #fff"></div>
  <template v-if="store.state.appIsReady">
    <layout v-if="state.layout === pageTag"> </layout>
    <fullscreen-layout v-else></fullscreen-layout>
  </template>
</template>
