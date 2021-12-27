<script lang="ts">
import SvgIcon from "@/components/base/svg-icon";
import { EThemeSetting } from "@/constants/enum";
import { getThemeConfigCache, setThemeConfigToCache } from "@/utils/theme";
import { copyToClipboard } from "@/utils/utils";
import { ElMessage } from "element-plus";
import { defineComponent, reactive } from "vue";
import { useI18n } from "vue-i18n";
import SettingNavLayout from "./setting-nav-layout.vue";
import SettingOther from "./setting-other.vue";
import SettingTheme from "./setting-theme.vue";
import "@/assets/css/setting.less";

/**
 * 可视化设置窗口
 */
export default defineComponent({
  name: "SettingSidebar",
  components: { SettingNavLayout, SettingOther, SettingTheme, SvgIcon },
  setup() {
    const { t } = useI18n();
    const themeConfigCache = getThemeConfigCache();
    const state = reactive({ openDrawer: false, config: themeConfigCache });

    const onOpenSettingThemeWindow = () => {
      state.openDrawer = true;
    };
    const onChange = (key: EThemeSetting, value: string | boolean | number) => {
      setThemeConfigToCache(key, value);
    };
    const onCopySetting = () => {
      const vl = getThemeConfigCache();
      copyToClipboard(JSON.stringify({ ...vl, "//": t("ui.setting.settingTips") }, null, 2));
      ElMessage.success(t("ui.setting.copySuccess"));
    };
    return { state, onOpenSettingThemeWindow, onChange, onCopySetting, t };
  }
});
</script>

<template>
  <div @click="onOpenSettingThemeWindow">
    <span class="rr-header-right-items-icon">
      <svg-icon name="morevertical"></svg-icon>
    </span>
    <el-drawer :title="t('ui.setting.pageTitle')" v-model="state.openDrawer" :append-to-body="true" :size="300" custom-class="rr-setting-wrap">
      <div class="rr-setting">
        <setting-theme :value="state.config" :onChange="onChange"></setting-theme>
        <el-divider></el-divider>
        <setting-nav-layout :value="state.config" :onChange="onChange"></setting-nav-layout>
        <el-divider></el-divider>
        <setting-other :value="state.config" :onChange="onChange"></setting-other>
        <el-divider></el-divider>
        <el-alert :title="t('ui.setting.settingTips')" type="warning" class="ele-alert-border" :closable="false"></el-alert>
        <div class="copybtn" :onClick="onCopySetting">
          <el-button size="small" :round="false" icon="el-icon-document-copy" style="width: 100%; margin: 15px 0 30px 0; font-weight: 400">
            {{ t("ui.setting.copyBtn") }}
          </el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
