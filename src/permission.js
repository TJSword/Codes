import router from "./router";
import store from "./store";
import Storage from "@/utils/storage"; // 验权
console.log(store.getters.userInfo)
const whiteList = ["/login"]; // 不重定向白名单
const banList = ["/exhibition"]//未开放菜单
router.beforeEach((to, from, next) => {
  if (Storage.get("token")) {
    if (to.path === "/login") {
      next({ path: "/" });
    } else {
      if(banList.indexOf(to.path) !== -1){
        console.log("该板块暂未开放")
        return
        
      }else{
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login`); // 否则全部重定向到登录页
    }
  }
});
router.afterEach(() => {
  // 结束
});
