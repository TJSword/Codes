
import Storage from "@/utils/storage";
import store from "@/store/index";
import userApi from "@/api/userApi";
import commonApi from "@/api/commonApi";
import { MY_ROUTES } from "@/router"
const user = {
  state: {
    token: Storage.get("token") || null,
    userInfo: [],
    userInfoUpdate:false,
    isSuperUser:false,//用户是否为超级用户
    isAdmin:false,//是否为管理员
    userDeptName:null,//用户部门名称
    isLogin:false,//登录后
    userRouterInfo:[],//用户路由信息
    
    routers:MY_ROUTES, //路由数据
    addRouters:{},//要添加的路由
    freshMenu:false,//刷新菜单
    controlShare:false,//控规图层分享权限
  },

  mutations: {
    setRouters:(state,routers)=>{
      let add = {
        path: "/home",
        name: "Home",
        component: () => import("@/views/Home.vue"),
        children:routers,
        redirect:routers[0].path
      }
      state.addRouters = add
      state.routers = MY_ROUTES.push(add);
    },
    SET_USER_ROUTER_INFO: (state, arr) => {
      state.userRouterInfo = arr;
    },
    SET_ISADMIN: (state, flag) => {
      state.isAdmin = flag;
    },
    SET_ISLOGIN: (state, flag) => {
      state.isLogin = flag;
    },
    SET_SUPER_USER: (state, flag) => {
      state.isSuperUser = flag;
    },
    SET_USER_DEPT_NAME: (state, str) => {
      state.userDeptName = str;
    },
    SET_TOKEN: (state, token) => {
      Storage.set("token", token);
      state.token = token;
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo;
    },
    SET_INFO_UPDATE: (state, flag) => {
      state.userInfoUpdate = flag;
    },
    SET_FRESH_MENU: (state, flag) => {
      state.freshMenu = flag;
    },
    SET_CONTROL_SHARE: (state, flag) => {
      state.controlShare = flag;
    }
  },

  actions: {
    generateRoutes({ commit }){
      return new Promise(resolve => {
        commonApi.getMenuTree().then(res =>{
          let data = res.data.data
          let accessedRouters = []
          data.forEach(item=>{
            if(item.name==='前端配置'){
              item.children.forEach(child=>{
                if(child.name==='菜单配置'){
                  child.children.forEach(cd=>{
                    accessedRouters.push({
                      path: cd.url,
                      name: cd.unit,
                      component: resolve => require([`@/views/${cd.unit}.vue`], resolve)
                    })
                  })
                }
              })
            }
          })
          commit("setRouters", accessedRouters);
          resolve({
            path: "/",
            name: "Home",
            component: () => import("@/views/Home.vue"),
            children:accessedRouters,
            redirect:accessedRouters[0].path
          })
          store.dispatch('setUserRouterInfo',accessedRouters)
        })
      })
    },
    setUserRouterInfo({ commit }, arr) {
      commit("SET_USER_ROUTER_INFO", arr);
    },
    setIsAdmin({ commit }, flag) {
      commit("SET_ISADMIN", flag);
    },
    setIsLogin({ commit }, flag) {
      commit("SET_ISLOGIN", flag);
    },
    setSuperUser({ commit }, flag) {
      commit("SET_SUPER_USER", flag);
    },
    setUserDeptName({ commit }, str) {
      commit("SET_USER_DEPT_NAME", str);
    },
    setToken({ commit }, token) {
      commit("SET_TOKEN", token);
    },
    setInfoUpdate({ commit }, flag) {
      commit("SET_INFO_UPDATE", flag);
    },
    setFreshMenu({ commit }, flag) {
      commit("SET_FRESH_MENU", flag);
    },
    setControlShare({ commit }, flag) {
      commit("SET_CONTROL_SHARE", flag);
    },
    //用户信息
    getUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        userApi
          .getInfo({ token: state.token })
          .then(res => {
            if (res.data) {
              commit("SET_USER_INFO", res.data.models);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    //登出
    logOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        userApi
          .logOut({ token: state.token })
          .then(() => {
            commit("SET_TOKEN", "");
            Storage.cle();
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  }
};
function loadView(view){
  return resolve => require([`@/views/${view}.vue`], resolve)
}
export default user;