<script lang="ts">
import { CacheLang } from "@/constants/cacheKey";
import { getLangName, supportLangs } from "@/i18n";
import { setCache } from "@/utils/cache";
import { defineComponent, ref } from "vue";
import { useI18n } from "vue-i18n";

/**
 * 多语言切换
 */
export default defineComponent({
  name: "Lang",
  props: {
    onChange: Function
  },
  setup(props, { slots }) {
    const { locale } = useI18n();
    const langName = ref(getLangName(locale.value));
    const onClick = (lang: string) => {
      setCache(CacheLang, lang);
      locale.value = lang;
      langName.value = getLangName(lang);
      props.onChange && props.onChange();
    };
    return { langName, langs: Object.keys(supportLangs), supportLangs, onClick, slots };
  }
});
</script>

<template>
  <el-dropdown @command="onClick">
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="x in langs" :key="x" :command="x">{{ supportLangs[x].langName }}</el-dropdown-item>
      </el-dropdown-menu>
    </template>
    <template v-if="slots.default">
      <slot></slot>
    </template>
    <span v-else class="el-dropdown-link">
      {{ langName }}
      <i class="el-icon-arrow-down el-icon--right"></i>
    </span>
  </el-dropdown>
</template>
