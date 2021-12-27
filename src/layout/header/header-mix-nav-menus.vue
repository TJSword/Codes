<script lang="ts">
import { EMitt, ESidebarLayoutEnum, EThemeSetting } from "@/constants/enum";
import emits from "@/utils/emits";
import { getThemeConfigCacheByKey } from "@/utils/theme";
import { getValueByKeys } from "@/utils/utils";
import { computed, defineComponent, reactive, watch } from "vue";
import { RouteRecordRaw, useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import BaseSidebar from "../sidebar/base-sidebar.vue";

/**
 * 顶部导航菜单，混合布局模式下用到
 */
export default defineComponent({
  name: "HeaderMixNavMenus",
  components: { BaseSidebar },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const routers = router.options.routes;
    const state = reactive({
      currRoute: getValueByKeys(router.currentRoute.value.matched[0], "path", "")
    });
    watch(
      () => route.path,
      () => {
        if (getThemeConfigCacheByKey(EThemeSetting.NavLayout) === ESidebarLayoutEnum.Mix) {
          const route = getValueByKeys(router.currentRoute.value.matched[0], "path", "");
          state.currRoute = route;
          emits.emit(EMitt.OnSelectHeaderNavMenusByMixNav, route);
        }
      }
    );
    const topHeaderMenus = computed(() => {
      const rs: any[] = [];
      store.state.routes.forEach((x: RouteRecordRaw) => {
        rs.push({
          path: x.path,
          children: [],
          meta: x.meta ? x.meta : {}
        });
      });
      return rs;
    });
    const onSelect = (path: string) => {
      const curr = routers.find((x) => x.path === path);

      if (!curr?.children?.length) {
        router.push(path);
      } else {
        state.currRoute = path;
        emits.emit(EMitt.OnSelectHeaderNavMenusByMixNav, path);
      }
    };
    return { state, topHeaderMenus, onSelect };
  }
});
</script>
<template>
  <base-sidebar mode="horizontal" :menus="topHeaderMenus" :router="false" :currRoute="state.currRoute" :is-mobile="false" :onSelect="onSelect"></base-sidebar>
</template>
