<script lang="ts">
import { IObject } from "@/types/interface";
import { defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";

interface ITip {
  title: string;
  message: string;
}

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { to } = route.query;
    const tips: IObject = {
      404: {
        title: "ui.router.error.404.title",
        message: "ui.router.error.404.des"
      },
      error: {
        title: "ui.router.error.error.title",
        message: "ui.router.error.error.des"
      }
    };
    const tip: ITip = tips[to?.toString() ?? "error"];
    const onBack = () => {
      router.back();
    };
    const onToHome = () => {
      router.replace("/");
    };
    return { tip, onBack, onToHome };
  }
});
</script>

<template>
  <div class="rr-error">
    <el-result>
      <template v-slot:icon>
        <i class="el-icon-warning" style="font-size: 64px; color: #f5222d"></i>
      </template>
      <template v-slot:title>
        <span style="font-size: 48px; font-weight: 800">{{ $t(tip.title) }}</span>
      </template>
      <template v-slot:subTitle>
        <span style="font-size: 36px">{{ $t(tip.message) }}</span>
      </template>
      <template v-slot:extra>
        <el-space :size="30">
          <el-button type="info" plain @click="onBack">
            {{ $t("ui.router.error.backBtn") }}
          </el-button>
          <el-button type="primary" @click="onToHome">
            {{ $t("ui.router.error.homeBtn") }}
          </el-button>
        </el-space>
      </template>
    </el-result>
  </div>
</template>
