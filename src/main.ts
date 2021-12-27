import "@/assets/icons/iconfont/iconfont.js";
import RenDeptTree from "@/components/ren-dept-tree";
import RenProcessDetail from "@/components/ren-process-detail";
import RenProcessRunning from "@/components/ren-process-running";
import RenRadioGroup from "@/components/ren-radio-group";
import RenRegionTree from "@/components/ren-region-tree";
import RenSelect from "@/components/ren-select";
import ElementPlus from "element-plus";
import { ElMessageBoxShortcutMethod } from "element-plus/lib/el-message-box/src/message-box.type";
import { IMessage } from "element-plus/lib/el-message/src/types";
import "element-plus/lib/theme-chalk/display.css";
import "element-plus/lib/theme-chalk/index.css";
import Sortable from "sortablejs";
import "vite-plugin-svg-icons/register";
import { createApp } from "vue";
import { Store } from "vuex";
import VXETable from "vxe-table";
import "vxe-table/lib/style.css";
import "xe-utils";
import App from "./App.vue";
import { initI18n } from "./i18n";
import { IObject } from "./types/interface";
import router from "./router";
import store from "./store";

//bug:https://www.zhihu.com/question/437009843
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    /**
     * vuex存储库
     */
    $store: Store<IObject>;
    /**
     * ref引用
     */
    $refs: any;
    /**
     * element-plus消息方法
     */
    $message: IMessage;
    /**
     * element-plus弹窗确认
     */
    $confirm: ElMessageBoxShortcutMethod;
    /**
     * element-plus弹窗
     */
    $alert: ElMessageBoxShortcutMethod;
    /**
     * vue3 v-model绑定默认字段名称
     */
    modelValue: any;
    /**
     * sortablejs组件
     */
    sortable: Sortable;
  }
}
VXETable.setup({
  zIndex: 3000,
  select: {
    transfer: true
  }
});
const app = createApp(App);

app
  .use(store)
  .use(router)
  .use(RenRadioGroup)
  .use(RenSelect)
  .use(RenDeptTree)
  .use(RenRegionTree)
  .use(RenProcessRunning)
  .use(RenProcessDetail)
  .use(ElementPlus, { i18n: initI18n.global.t, size: "small" })
  .use(VXETable)
  .use(initI18n)
  .mount("#app");
