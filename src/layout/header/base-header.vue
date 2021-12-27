<script lang="ts">
import logo from "@/assets/images/logo.png";
import { EMitt, ESidebarLayoutEnum, EThemeSetting } from "@/constants/enum";
import emits from "@/utils/emits";
import { getThemeConfigCacheByKey } from "@/utils/theme";
import { defineComponent, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import BaseSidebar from "../sidebar/base-sidebar.vue";
import Breadcrumb from "./breadcrumb.vue";
import CollapseSidebarBtn from "./collapse-sidebar-btn.vue";
import Expand from "./expand.vue";
import HeaderMixNavMenus from "./header-mix-nav-menus.vue";
import Logo from "./logo.vue";
import "@/assets/css/header.less";

/**
 * 顶部主区域
 */
export default defineComponent({
  name: "Header",
  components: { BaseSidebar, Breadcrumb, CollapseSidebarBtn, Expand, HeaderMixNavMenus, Logo },
  setup() {
    const { t } = useI18n();
    const store = useStore();
    const state = reactive({
      sidebarLayout: getThemeConfigCacheByKey(EThemeSetting.NavLayout)
    });
    emits.on(EMitt.OnSetNavLayout, (vl) => {
      state.sidebarLayout = vl;
    });
    const onRefresh = () => {
      emits.emit(EMitt.OnReloadTabPage);
    };
    return { store, state, t, onRefresh, logo, ESidebarLayoutEnum };
  }
});
</script>
<template>
  <div class="rr-header-ctx">
    <div class="rr-header-ctx-logo hidden-xs-only">
      <logo :logoUrl="logo" :logoName="t('ui.app.productName')"></logo>
    </div>
    <div class="rr-header-right">
      <div class="rr-header-right-left">
        <div class="rr-header-right-items rr-header-action" :style="`display:${state.sidebarLayout === ESidebarLayoutEnum.Top ? 'none' : ''}`">
          <collapse-sidebar-btn></collapse-sidebar-btn>
          <div @click="onRefresh" style="cursor: pointer">
            <i class="el-icon-refresh-right"></i>
          </div>
        </div>
        <div class="rr-header-right-left-br ele-scrollbar-hide hidden-xs-only">
          <base-sidebar v-if="state.sidebarLayout === ESidebarLayoutEnum.Top" mode="horizontal" :router="true"></base-sidebar>
          <header-mix-nav-menus v-else-if="state.sidebarLayout === ESidebarLayoutEnum.Mix"></header-mix-nav-menus>
          <breadcrumb v-else></breadcrumb>
        </div>
      </div>
      <div style="flex-shrink: 0">
        <expand :userName="store.state.user.username"></expand>
      </div>
    </div>
  </div>
</template>
