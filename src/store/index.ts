import { CacheToken } from "@/constants/cacheKey";
import { IObject } from "@/types/interface";
import { getSysRouteMap } from "@/router";
import baseService from "@/service/baseService";
import { removeCache } from "@/utils/cache";
import { mergeServerRoute } from "@/utils/router";
import { createStore } from "vuex";
import app from "./app";

export default createStore({
  state: {
    appIsLogin: false, //是否登录
    appIsReady: false, //app数据是否就绪
    appIsRender: false, //app是否开始渲染内容
    permissions: [], //权限集合
    user: {
      createDate: "",
      deptId: "",
      deptName: "",
      email: "",
      gender: 0,
      headUrl: "",
      id: "",
      mobile: "",
      postIdList: "",
      realName: "",
      roleIdList: "",
      status: 0,
      superAdmin: 0,
      username: ""
    }, //用户信息
    dicts: [], //字典
    routes: [], //最终的路由集合
    menus: [], //菜单集合
    tabs: [], //tab标签页集合
    activeTabName: "" //tab当前焦点页
  } as IObject,
  mutations: {
    updateState(state, payload) {
      Object.keys(payload).forEach((x: string) => {
        state[x] = payload[x];
      });
    }
  },
  actions: {
    updateState(ctx, { payload }) {
      ctx.commit("updateState", payload);
    },
    initApp(ctx) {
      return Promise.all([
        baseService.get("/sys/menu/nav"), //加载菜单
        baseService.get("/sys/menu/permissions"), //加载权限
        baseService.get("/sys/user/info"), //加载用户信息
        baseService.get("/sys/dict/type/all") //加载字典
      ]).then(([menus, permissions, user, dicts]) => {
        if (user.code !== 0) {
          console.error("初始化用户数据错误", user.msg);
        }
        ctx.commit("updateState", {
          permissions: permissions.data || [],
          user: user.data || {},
          dicts: dicts.data || [],
          menus: []
        });
        return mergeServerRoute(menus.data || [], getSysRouteMap());
      });
    },
    //退出
    logout(ctx) {
      removeCache(CacheToken, true);
      ctx.commit("updateState", {
        appIsLogin: false,
        permissions: [],
        user: {},
        dicts: [],
        menus: [],
        routes: [],
        tabs: [],
        activeTabName: ""
      });
    }
  },
  modules: {
    app: app
  }
});
