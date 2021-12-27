<script lang="ts">
import { EMitt, ESidebarLayoutEnum, EThemeSetting } from "@/constants/enum";
import { IObject } from "@/types/interface";
import emits from "@/utils/emits";
import { getThemeConfigCacheByKey } from "@/utils/theme";
import { defineComponent, reactive } from "vue";
import { useI18n } from "vue-i18n";
import SettingSwitch from "@/components/base/setting-switch.vue";

/**
 * 导航模式设置
 */
export default defineComponent({
  name: "SettingNavLayout",
  components: { SettingSwitch },
  props: { value: Object, onChange: Function },
  setup(props) {
    const { t } = useI18n();
    const layout = [
      { label: "ui.setting.sidebarLayoutLeft", value: ESidebarLayoutEnum.Left },
      { label: "ui.setting.sidebarLayoutTop", value: ESidebarLayoutEnum.Top },
      { label: "ui.setting.sidebarLayoutMix", value: ESidebarLayoutEnum.Mix }
    ];
    const layoutToTheme: IObject<string> = {
      left: "side dark",
      top: "header dark",
      mix: "header dark mix"
    };
    const state = reactive<IObject>({
      active: {
        layout: getThemeConfigCacheByKey(EThemeSetting.NavLayout, props.value),
        full: getThemeConfigCacheByKey(EThemeSetting.ContentFull, props.value)
      },
      themeClass: {}
    });
    const onSetTheme = (type: string, key: EThemeSetting, value: string | boolean) => {
      onSet(type, key, value);
      emits.emit(EMitt.OnSetNavLayout, value);
    };
    const onSet = (type: string, key: EThemeSetting, value: string | boolean) => {
      state.active[type] = value;
      state.themeClass[key] = value;
      emits.emit(EMitt.OnSetTheme, [key, `${key}-${value}`]);
      props.onChange && props.onChange(key, value);
    };
    const onSetContentFull = () => {
      onSet("full", EThemeSetting.ContentFull, !state.active.full);
    };
    return { state, layout, layoutToTheme, onSetTheme, onSetContentFull, t, EThemeSetting };
  }
});
</script>
<template>
  <el-space direction="vertical" :size="15" alignment="flex-start" class="rr-theme">
    <span class="rr-setting-title text-2">{{ t("ui.setting.title2") }}</span>
    <el-space>
      <el-tooltip v-for="x in layout" :key="x.value" :class="`card navlayout ${layoutToTheme[x.value]} ${state.active.layout === x.value ? 'active' : ''}`" effect="dark" :content="t(x.label)" placement="top">
        <span @click="onSetTheme('layout', EThemeSetting.NavLayout, x.value)"></span>
      </el-tooltip>
    </el-space>
    <setting-switch :title="t('ui.setting.contentFull')" :value="state.active.full" :onChange="onSetContentFull"></setting-switch>
  </el-space>
</template>
