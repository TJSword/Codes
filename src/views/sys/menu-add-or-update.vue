<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="type" :label="$t('menu.type')" size="mini">
        <el-radio-group v-model="dataForm.type" :disabled="!!dataForm.id">
          <el-radio :label="0">{{ $t("menu.type0") }}</el-radio>
          <el-radio :label="1">{{ $t("menu.type1") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="name" :label="$t('menu.name')">
        <el-input v-model="dataForm.name" :placeholder="$t('menu.name')"></el-input>
      </el-form-item>
      <el-form-item prop="parentName" :label="$t('menu.parentName')" class="menu-list">
        <el-popover v-model:visible="menuListVisible" ref="menuListPopover" placement="bottom-start" trigger="click" :width="400">
          <template v-slot:reference>
            <el-input v-model="dataForm.parentName" :readonly="true" :placeholder="$t('menu.parentName')">
              <template v-slot:suffix> <i v-if="dataForm.pid !== '0'" @click.stop="deptListTreeSetDefaultHandle()" class="el-icon-circle-close el-input__icon"></i></template>
            </el-input>
          </template>
          <el-tree :data="menuList" :props="{ label: 'name', children: 'children' }" node-key="id" ref="menuListTree" :highlight-current="true" :expand-on-click-node="false" accordion @current-change="menuListTreeCurrentChangeHandle"> </el-tree>
        </el-popover>
      </el-form-item>
      <el-form-item v-if="dataForm.type === 0" prop="url" :label="$t('menu.url')">
        <el-input v-model="dataForm.url" :placeholder="$t('menu.url')"></el-input>
      </el-form-item>
      <el-form-item prop="sort" :label="$t('menu.sort')">
        <el-input-number v-model="dataForm.sort" controls-position="right" :min="0" :label="$t('menu.sort')"></el-input-number>
      </el-form-item>
      <el-form-item v-if="dataForm.type === 0" prop="openStyle" :label="$t('menu.openStyle')" size="mini">
        <el-radio-group v-model="dataForm.openStyle">
          <el-radio :label="0">{{ $t("menu.openStyle0") }}</el-radio>
          <el-radio :label="1">{{ $t("menu.openStyle1") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="permissions" :label="$t('menu.permissions')">
        <el-input v-model="dataForm.permissions" :placeholder="$t('menu.permissionsTips')"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.type === 0" prop="icon" :label="$t('menu.icon')" class="icon-list">
        <el-popover v-model:visible="iconListVisible" ref="iconListPopover" placement="top-start" trigger="click" popper-class="mod-sys__menu-icon-popover">
          <template v-slot:reference> <el-input v-model="dataForm.icon" :readonly="true" :placeholder="$t('menu.icon')"></el-input></template>
          <div class="mod-sys__menu-icon-inner">
            <div class="mod-sys__menu-icon-list">
              <el-button v-for="(item, index) in iconList" :key="index" @click="iconListCurrentChangeHandle(item)" :class="{ 'is-active': dataForm.icon === item }">
                <svg class="icon-svg" aria-hidden="true"><use :xlink:href="`#${item}`"></use></svg>
              </el-button>
            </div>
          </div>
        </el-popover>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="visible = false">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import { defineComponent, reactive, toRefs } from "vue";
import baseService from "@/service/baseService";
import { getIconList, useDebounce } from "@/utils/utils";
import { IObject } from "@/types/interface";
export default defineComponent({
  setup() {
    const state = reactive({
      visible: false,
      menuList: [],
      menuListVisible: false,
      iconList: [] as string[],
      iconListVisible: false,
      dataForm: {
        id: "",
        type: 0,
        name: "",
        pid: "0",
        parentName: "",
        url: "",
        permissions: "",
        sort: 0,
        icon: "",
        openStyle: 0
      }
    });
    return { ...useView(state), ...toRefs(state) };
  },
  computed: {
    dataRule() {
      return {
        name: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        parentName: [{ required: true, message: this.$t("validate.required"), trigger: "change" }]
      };
    }
  },
  watch: {
    "dataForm.type"() {
      this.$refs["dataFormRef"].clearValidate();
    }
  },
  created() {
    this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
  },
  methods: {
    init(patientRow?: IObject) {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataFormRef"].resetFields();
        this.iconList = getIconList();
        if (patientRow) {
          this.dataForm.id = "";
          this.dataForm.pid = patientRow.id;
          this.dataForm.parentName = patientRow.name;
        } else {
          this.dataForm.parentName = this.$t("menu.parentNameDefault");
        }
        this.getMenuList().then(() => {
          if (this.dataForm.id) {
            this.getInfo();
          }
        });
      });
    },
    // 获取菜单列表
    getMenuList() {
      return baseService.get("/sys/menu/list?type=0").then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.menuList = res.data;
      });
    },
    // 获取信息
    getInfo() {
      baseService.get(`/sys/menu/${this.dataForm.id}`).then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        };
        if (this.dataForm.pid === "0") {
          return this.deptListTreeSetDefaultHandle();
        }
        this.$refs.menuListTree.setCurrentKey(this.dataForm.pid);
      });
    },
    // 上级菜单树, 设置默认值
    deptListTreeSetDefaultHandle() {
      this.dataForm.pid = "0";
      this.dataForm.parentName = this.$t("menu.parentNameDefault");
    },
    // 上级菜单树, 选中
    menuListTreeCurrentChangeHandle(data: IObject) {
      this.dataForm.pid = data.id;
      this.dataForm.parentName = data.name;
      this.menuListVisible = false;
    },
    // 图标, 选中
    iconListCurrentChangeHandle(icon: string) {
      this.dataForm.icon = icon;
      this.iconListVisible = false;
    },
    // 表单提交
    dataFormSubmitHandle() {
      this.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        (!this.dataForm.id ? baseService.post : baseService.put)("/sys/menu", this.dataForm).then((res) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.$message({
            message: this.$t("prompt.success"),
            type: "success",
            duration: 500,
            onClose: () => {
              this.visible = false;
              this.$emit("refreshDataList");
            }
          });
        });
      });
    }
  }
});
</script>

<style lang="less">
.el-popover.el-popper {
  overflow-x: hidden;
}
.mod-sys__menu {
  .menu-list,
  .icon-list {
    .el-input__inner,
    .el-input__suffix {
      cursor: pointer;
    }
  }
  &-icon-popover {
    width: 458px !important;
    overflow-y: hidden !important;
  }
  &-icon-inner {
    width: 478px;
    max-height: 258px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  &-icon-list {
    width: 458px !important;
    padding: 0;
    margin: -8px 0 0 -8px;
    > .el-button {
      padding: 8px;
      margin: 8px 0 0 8px;
      > span {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        font-size: 18px;
      }
    }
  }
}
</style>
