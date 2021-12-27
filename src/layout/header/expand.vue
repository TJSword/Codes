<script lang="ts">
import Lang from "@/components/base/lang";
import SvgIcon from "@/components/base/svg-icon";
import TenantSwitch from "@/components/tenant-switch";
import baseService from "@/service/baseService";
import ui from "@/utils/ui";
import { checkPermission } from "@/utils/utils";
import { useFullscreen } from "@vueuse/core";
import { computed, defineComponent, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import SettingSidebar from "../setting/index.vue";
import userLogo from "@/assets/images/user.png";
import "@/assets/css/header.less";

interface IExpand {
  userName?: string;
}

/**
 * 顶部右侧扩展区域
 */
export default defineComponent({
  name: "Expand",
  components: { SettingSidebar, SvgIcon, Lang, TenantSwitch },
  props: {
    userName: String
  },
  setup(props: IExpand) {
    const { t } = useI18n();
    const router = useRouter();
    const store = useStore();
    const { isFullscreen, toggle } = useFullscreen();
    const messageCount = ref(0);
    const tenantSwitch = ref(false);
    const tenantSwitchRef = ref(null);

    watch(
      () => store.state.appIsLogin,
      (vl) => {
        if (vl) {
          getUnReadMessageCount();
        }
      }
    );

    const getUnReadMessageCount = () => {
      baseService.get("/sys/notice/mynotice/unread").then((res) => {
        messageCount.value = res.data;
      });
    };

    const onClickUserMenus = (path: string) => {
      if (path === "/login") {
        ui.confirm(t("prompt.info", { handle: t("logout") }), t("prompt.title"), {
          confirmButtonText: t("confirm"),
          cancelButtonText: t("cancel"),
          type: "warning"
        })
          .then(() => {
            router.push(path);
          })
          .catch(() => {
            //
          });
      } else {
        router.push(path);
      }
    };
    const onClickMessage = () => {
      router.push("/sys/notice-user");
    };
    const onSwitchTenant = () => {
      if (store.state.user.superAdmin === 1) {
        tenantSwitch.value = true;
        if (tenantSwitchRef.value) {
          const refs: any = tenantSwitchRef.value;
          refs.init();
        }
      }
    };
    const messagePermission = computed(() => checkPermission(store.state.permissions, "sys:notice:all"));
    return {
      props,
      store,
      isFullscreen,
      messageCount,
      tenantSwitch,
      tenantSwitchRef,
      messagePermission,
      userLogo,
      onClickUserMenus,
      onClickMessage,
      onSwitchTenant,
      toggle,
      t
    };
  }
});
</script>
<template>
  <div class="rr-header-right-items">
    <div class="hidden-xs-only" @click="onSwitchTenant">
      <svg-icon name="team" :style="`margin-right: 5px`"></svg-icon>
      <span> {{ t("ui.user.links.tenantSwitch") }}：{{ store.state.user.tenantName }} </span>
    </div>
    <div @click="toggle">
      <span>
        <svg-icon :name="isFullscreen ? 'tuichuquanping' : 'fullscreen2'"></svg-icon>
      </span>
    </div>
    <div v-if="messagePermission">
      <el-badge :value="messageCount > 0 ? messageCount : null" type="danger" :max="99" @click="onClickMessage">
        <i class="el-icon-bell icon"></i>
      </el-badge>
    </div>
    <div>
      <lang></lang>
    </div>
    <div style="display: flex; justify-content: center; align-items: center">
      <img :src="userLogo" :alt="props.userName" style="width: 30px; height: 30px; border-radius: 50%; margin-top: 3px; margin-right: 5px" />
      <el-dropdown @command="onClickUserMenus">
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="el-icon-lock" command="/user/password">
              {{ t("ui.user.links.editPassword") }}
            </el-dropdown-item>
            <el-dropdown-item icon="el-icon-switch-button" divided command="/login">
              {{ t("ui.user.links.logout") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
        <span class="el-dropdown-link">
          {{ props.userName }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
      </el-dropdown>
    </div>
    <setting-sidebar></setting-sidebar>
    <tenant-switch v-if="tenantSwitch" ref="tenantSwitchRef"></tenant-switch>
  </div>
</template>
