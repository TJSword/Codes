<template>
  <el-dialog v-model="visible" :title="$t('process.entrustTask')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-form-item :label="$t('process.assignee')">
        <el-input v-model="dataForm.userName" class="input-with-select">
          <template v-slot:append>
            <el-button icon="el-icon-search" @click="selectUserInfo()"></el-button>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="visible = false">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="delegateTask()">{{ $t("confirm") }}</el-button>
    </template>
    <select-user v-if="selectUserVisible" ref="selectUser"></select-user>
  </el-dialog>
</template>

<script lang="ts">
import SelectUser from "./select-user.vue";
import useView from "@/hooks/useView";
import { defineComponent, reactive, toRefs } from "vue";
import baseService from "@/service/baseService";
import { IObject } from "@/types/interface";
export default defineComponent({
  components: {
    SelectUser
  },
  setup() {
    const state = reactive({
      createdIsNeed: false,
      visible: false,
      selectUserVisible: false,
      dataForm: {
        id: "",
        userId: "",
        userName: "",
        taskId: ""
      }
    });
    return { ...useView(state), ...toRefs(state) };
  },
  computed: {
    dataRule() {
      return {
        userName: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }]
      };
    }
  },

  methods: {
    init() {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataFormRef"].resetFields();
      });
    },
    dataFormSubmitHandle() {
      //
    },
    // 委托
    delegateTask() {
      if (!this.dataForm.userId) {
        this.$message.error(this.$t("process.entrustError"));
        return;
      }
      var task = {
        taskId: this.dataForm.taskId,
        userId: this.dataForm.userId
      };
      baseService
        .post("/flow/common/delegate", task, {
          "content-type": "application/x-www-form-urlencoded"
        })
        .then((res) => {
          if (res.code !== 0) {
            this.$message.error(res.msg);
            return;
          }
          this.$message({
            message: this.$t("prompt.success"),
            type: "success",
            duration: 500,
            onClose: () => {
              this.visible = false;
              this.closeCurrentTab();
            }
          });
        });
    },
    selectUserInfo() {
      this.selectUserVisible = true;
      this.$nextTick(() => {
        this.$refs.selectUser.dataForm.id = "";
        this.$refs.selectUser.init(this.setUserInfo);
      });
    },
    setUserInfo(userInfo: IObject) {
      this.dataForm.userId = userInfo.id;
      this.dataForm.userName = userInfo.realName;
    }
  }
});
</script>
