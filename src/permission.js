import router from "./router";
import store from "./store";
import Storage from "@/utils/storage"; // 验权
const whiteList = ["/login","/shareland"]; // 不重定向白名单
router.beforeEach((to, from, next) => {
  if (Storage.get("token")) {
    if (to.path === "/login") {
      next({ path: "/" });
    } else {
      if(store.getters.userRouterInfo.length === 0){
        store.dispatch('generateRoutes').then( accessRouters => {
          // 根据roles权限生成可访问的路由表
          router.addRoute(accessRouters); // 动态添加可访问路由表
          router.addRoute({ path: "*", redirect: "/404" });
          next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
        })
      }else{
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`); // 否则全部重定向到登录页
    }
  }
});

