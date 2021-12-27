<template>
  <div class="ren-region">
    <el-input v-model="showName" :placeholder="placeholder" @click="treeDialog">
      <template v-slot:append>
        <el-button icon="el-icon-search" @click="treeDialog"></el-button>
      </template>
    </el-input>
    <el-input :value="modelValue" style="display: none"></el-input>
    <el-dialog v-model="visibleTree" width="360px" :modal="false" :title="placeholder" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form size="mini" :inline="true">
        <el-form-item :label="$t('keyword')">
          <el-input v-model="filterText" :input-style="{ width: '150px' }"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default">{{ $t("query") }}</el-button>
        </el-form-item>
      </el-form>
      <el-tree class="filter-tree" :data="dataList" :default-expanded-keys="expandedKeys" :props="{ label: 'name', children: 'children' }" :expand-on-click-node="false" :filter-node-method="filterNode" :highlight-current="true" node-key="id" ref="tree"> </el-tree>
      <template v-slot:footer>
        <el-button type="default" @click="cancelHandle()" size="mini">{{ $t("cancel") }}</el-button>
        <el-button type="info" @click="clearHandle()" size="mini">{{ $t("clear") }}</el-button>
        <el-button type="primary" @click="commitHandle()" size="mini">{{ $t("confirm") }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<style lang="less" scoped>
.ren-region {
  .filter-tree {
    max-height: 230px;
    overflow: auto;
  }
  .el-dialog__body {
    padding: 0px 0px 0px 20px;
  }
  .el-dialog__footer {
    padding: 10px 20px 8px 20px;
  }
}
</style>
<script lang="ts">
import { defineComponent } from "vue";
import { treeDataTranslate } from "@/utils/utils";
import { IObject } from "@/types/interface";
import baseService from "@/service/baseService";
export default defineComponent({
  name: "RenRegionTree",
  data() {
    return {
      filterText: "",
      visibleTree: false,
      dataList: [] as IObject[],
      showName: "",
      expandedKeys: [] as string[],
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  props: {
    modelValue: [Number, String],
    parentName: String,
    placeholder: String
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    parentName(val) {
      this.showName = val;
    }
  },
  methods: {
    treeDialog() {
      this.expandedKeys = [];
      if (this.$refs.tree) {
        this.$refs.tree.setCurrentKey(null);
      }
      this.visibleTree = true;
      this.getDataList(this.modelValue);
    },
    filterNode(value: string, data: IObject) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    getDataList(id: string) {
      return baseService.get("/sys/region/tree").then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.dataList = treeDataTranslate(res.data);
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(id);
          this.expandedKeys = [id];
        });
      });
    },
    cancelHandle() {
      this.visibleTree = false;
      this.dataList = [];
      this.filterText = "";
    },
    clearHandle() {
      this.$emit("update:modelValue", "0");
      this.$emit("update:parentName", "");
      this.showName = "";
      this.visibleTree = false;
      this.dataList = [];
      this.filterText = "";
    },
    commitHandle() {
      const node = this.$refs.tree.getCurrentNode();
      if (!node) {
        this.$message.error(this.$t("choose"));
        return;
      }
      this.$emit("update:modelValue", node.id);
      this.$emit("update:parentName", node.name);
      this.showName = node.name;
      this.visibleTree = false;
      this.dataList = [];
      this.filterText = "";
    }
  }
});
</script>
