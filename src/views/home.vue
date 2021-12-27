<template>
  <div class="mod-home">
    <h3>{{ $t("home.desc.title") }}</h3>
    <ul>
      <li v-for="item in list" :key="item" v-html="item"></li>
    </ul>
  </div>
</template>

<style lang="less">
.mod-home {
  table {
    width: 100%;
    border: 1px solid #ebeef5;
    border-collapse: collapse;
    th,
    td {
      padding: 12px 10px;
      border: 1px solid #ebeef5;
    }
    th {
      width: 30%;
    }
  }
}
</style>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useI18n } from "vue-i18n";
export default defineComponent({
  setup() {
    const { t } = useI18n();
    const list = ref(t("home.desc.list").split("\n"));
    return { list };
  }
});
</script>
