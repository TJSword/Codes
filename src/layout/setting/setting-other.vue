<script lang="ts">
import { themeSetting } from "@/constants/config";
import { EMitt, EThemeSetting } from "@/constants/enum";
import { IObject } from "@/types/interface";
import emits from "@/utils/emits";
import { defineComponent, reactive } from "vue";
import { useI18n } from "vue-i18n";
import SettingSwitch from "@/components/base/setting-switch.vue";

/**
 * 其他设置
 */
export default defineComponent({
  name: "SettingOther",
  components: { SettingSwitch },
  props: {
    value: Object,
    onChange: Function
  },
  setup(props) {
    const { t } = useI18n();
    const state = reactive({
      items: [
        {
          label: "ui.setting.logoAuto",
          value: themeSetting.logoAuto,
          key: EThemeSetting.LogoAuto,
          emit: null
        },
        {
          label: "ui.setting.colorIcon",
          value: themeSetting.colorIcon,
          key: EThemeSetting.ColorIcon,
          emit: null
        },
        {
          label: "ui.setting.sidebarUniOpened",
          value: themeSetting.sidebarUniOpened,
          key: EThemeSetting.SidebarUniOpened,
          emit: EMitt.OnSetThemeNotUniqueOpened
        },
        {
          label: "ui.setting.openTabsPage",
          value: themeSetting.openTabsPage,
          key: EThemeSetting.OpenTabsPage,
          emit: EMitt.OnSetThemeTabsPage
        }
      ],
      tabStyles: [
        { label: "ui.setting.tabStyles1", value: "default" },
        { label: "ui.setting.tabStyles2", value: "dot" },
        { label: "ui.setting.tabStyles3", value: "card" }
      ],
      tabStyle: props.value ? props.value[EThemeSetting.TabStyle] : themeSetting.tabStyle
    });
    state.items.forEach((x) => {
      if (props.value && Object.prototype.hasOwnProperty.call(props.value, x.key)) {
        x.value = props.value[x.key];
      }
    });
    const onSetSwitch = (index: number, { key, emit }: IObject) => {
      const value = !state.items[index].value;
      state.items[index].value = value;
      emit && emits.emit(emit, value);
      emits.emit(EMitt.OnSetTheme, [key, `${key}-${value}`]);
      props.onChange && props.onChange(key, value);
    };
    const onSetTabStyle = (value: string) => {
      const key = EThemeSetting.TabStyle;
      state.tabStyle = value;
      emits.emit(EMitt.OnSetTheme, [key, `${key}-${value}`]);
      props.onChange && props.onChange(key, value);
    };
    return { state, t, onSetSwitch, onSetTabStyle };
  }
});
</script>
<template>
  <el-space direction="vertical" alignment="flex-start" :size="30" class="rr-other">
    <span class="rr-setting-title text-2">{{ t("ui.setting.title3") }}</span>
    <setting-switch v-for="(x, index) in state.items" :key="x.label" :title="t(x.label)" :value="x.value" :onChange="onSetSwitch.bind(this, index, x)"></setting-switch>
    <el-space class="rr-switch">
      <span>{{ t("ui.setting.tabStyles") }}</span>
      <el-select v-model="state.tabStyle" :placeholder="t('ui.widget.selectTips')" size="mini" style="max-width: 80px" @change="onSetTabStyle">
        <el-option v-for="x in state.tabStyles" :key="x.value" :label="t(x.label)" :value="x.value"></el-option>
      </el-select>
    </el-space>
  </el-space>
</template>
