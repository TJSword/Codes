<template>
  <div style="text-align: center; font-size: 28px">{{ dataForm.title }}</div>
  <el-divider></el-divider>
  <div v-html="dataForm.content"></div>
  <div>
    <hr size="1" color="#ddd" style="margin: 30px 0 10px 0" />
    <span><i class="el-icon-user-solid" style="color: #e6444a"></i> {{ $t("notice.senderName") }}：{{ dataForm.senderName }}</span>
    <el-divider direction="vertical"></el-divider>
    <span><i class="el-icon-time" style="color: #e6444a"></i> {{ $t("notice.senderDate") }}：{{ dataForm.senderDate }}</span>
    <el-divider direction="vertical" style="margin: 0px; padding: 0px"></el-divider>
    <span>
      <i class="el-icon-s-order" style="color: #e6a23c"></i> {{ $t("notice.type") }}：
      {{ getDictLabel("notice_type", dataForm.type) }}
    </span>
    <hr size="1" color="#ddd" style="margin: 10px 0 30px 0" />
  </div>
  <div style="text-align: center">
    <el-button type="danger" @click="closeCurrentTab()">{{ $t("notice.close") }}</el-button>
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import { defineComponent, reactive, toRefs } from "vue";
import baseService from "@/service/baseService";
export default defineComponent({
  setup() {
    const state = reactive({
      getDataListURL: "/sys/notice/user/page",
      createdIsNeed: false,
      activatedIsNeed: false,
      getDataListIsPage: true,
      dataForm: {
        id: "",
        type: 0,
        senderDate: "",
        senderName: "",
        content: "",
        title: ""
      }
    });
    return { ...useView(state), ...toRefs(state) };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.dataForm.id = this.$route.query.id as string;
      this.dataForm.content = "";
      this.dataForm.senderDate = "";
      this.dataForm.senderName = "";
      this.dataForm.title = "";
      this.getInfo();
      this.query();
    },
    // 获取信息
    getInfo() {
      baseService.get(`/sys/notice/${this.dataForm.id}`).then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        };
      });
    }
  }
});
</script>
