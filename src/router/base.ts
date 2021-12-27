import Layout from "@/layout/layout.vue";
import Error from "@/views/error.vue";
import { RouteRecordRaw } from "vue-router";
import Login from "@/views/login.vue";
import Iframe from "@/views/iframe.vue";
import FirstPage from "@/views/newHome.vue"

/**
 * 框架基础路由
 */
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    meta: { title: "ui.router.pageWorkbench", icon: "icon-desktop" },
    children: [
      {
        path: "/home",
        component: () => import("@/views/home.vue"),
        meta: { title: "ui.router.pageHome", icon: "icon-home" }
      }
    ]
  },
  {
    path: "/firstPage",
    component: FirstPage,
    meta: { title: "ui.router.pageLogin", isNavigationMenu: false }
  },
  {
    path: "/login",
    component: Login,
    meta: { title: "ui.router.pageLogin", isNavigationMenu: false }
  },
  {
    path: "/user/password",
    component: () => import("@/views/sys/user-update-password.vue"),
    meta: { title: "ui.user.links.editPassword", requiresAuth: true, isNavigationMenu: false }
  },
  {
    path: "/iframe/:id?",
    component: Iframe,
    meta: { title: "iframe", isNavigationMenu: false }
  },
  {
    path: "/error",
    name: "error",
    component: Error,
    meta: { title: "ui.router.pageError", isNavigationMenu: false }
  }
];

export const errorRoute: Array<RouteRecordRaw> = [
  {
    path: "/:path(.*)*",
    redirect: { path: "/error", query: { to: 404 }, replace: true },
    meta: { isNavigationMenu: false }
  }
];

export default routes;
