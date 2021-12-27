import app from "@/constants/app";
import { IObject, IServerMenus } from "@/types/interface";
import Layout from "@/layout/layout.vue";
import { toSysViewComponentPath } from "@/router";
import Iframe from "@/views/iframe.vue";
import { Router, RouteRecordNormalized, RouteRecordRaw } from "vue-router";
import { isExternalLink } from "./utils";

/**
 * 合并本地路由和服务端菜单，追加isIframe和isNewPage参数到meta中
 * @param serverRoutes
 * @param sysRouteMap
 * @returns
 */
export const mergeServerRoute = (
  serverRoutes: IServerMenus[],
  sysRouteMap: IObject
): RouteRecordRaw[] => {
  const rs: RouteRecordRaw[] = [];

  serverRoutes.forEach((x: IServerMenus) => {
    const [path, meta] = mergeRouteToOpenStyle(x.url, x);
    const viewComponent = sysRouteMap[toSysViewComponentPath(path)];
    const isNotMatchComponent =
      !viewComponent && !meta.isIframe && !meta.isNewPage && !(x.children && x.children.length);
    const r: RouteRecordRaw = {
      path,
      name: path,
      component: meta.isIframe ? Iframe : x.children && x.children.length ? Layout : viewComponent
    };
    r.meta = { title: x.name, icon: x.icon, openStyle: x.openStyle, id: x.id, url: x.url, ...meta };
    r.redirect =
      x.redirect ||
      (isNotMatchComponent ? { path: "/error", query: { to: 404 }, replace: true } : "");
    if (x.children && x.children.length) {
      r.children = mergeServerRoute(x.children, sysRouteMap);
    }
    rs.push(r);
  });
  return rs;
};

/**
 * 重置路由
 * @param router
 * @param routes
 */
export const resetRoute = (router: Router, routes: RouteRecordRaw[]): void => {
  routes.forEach((route: any) => {
    const { name } = route;
    router.hasRoute(name) && router.removeRoute(name);
  });
};

/**
 * 路由转换成对象格式
 * @param routes
 * @returns
 */
export const routesToObject = (routes: any[]): IObject<RouteRecordNormalized> => {
  const rs: IObject<RouteRecordNormalized> = {};
  const loop = (ms: any[]) => {
    ms.forEach((x: RouteRecordNormalized): void => {
      rs[x.path] = x;
      if (x.children && x.children.length) {
        loop(x.children);
      }
    });
  };
  loop(routes);
  return rs;
};

/**
 * 转化为有效的导航路由
 * @param routes
 * @returns
 */
export const toValidRoutes = (routes: RouteRecordRaw[]): RouteRecordRaw[] => {
  const rs: RouteRecordRaw[] = [];
  routes.forEach((x: RouteRecordRaw) => {
    if (x.meta && x.meta.isNavigationMenu !== false) {
      if (x.children && x.children.length) {
        x.children = toValidRoutes(x.children);
      }
      rs.push(x);
    }
  });
  return rs;
};

/**
 * 转换成多语言版菜单
 * @param routes
 * @param t
 * @returns
 */
export const toLangRoutes = (
  routes: RouteRecordRaw[],
  t: (key: string) => string
): RouteRecordRaw[] => {
  const rs: RouteRecordRaw[] = [];
  routes.forEach((x: RouteRecordRaw) => {
    if (x.meta && x.meta.title) {
      const key = x.meta.title as string;
      x.meta.title = t(key);
    }

    x.children = toLangRoutes(x.children || [], t);
    rs.push(x);
  });
  return rs;
};

/**
 * 注册路由
 * @param router
 * @param rs
 */
export const registerToRouter = (router: Router, rs: RouteRecordRaw[]): void => {
  rs.forEach((x: RouteRecordRaw) => {
    if (!router.hasRoute(x.path)) {
      router.addRoute(x);
    }
  });
};

export const mergeRouteToOpenStyle = (url: string, item: IServerMenus): [string, IObject] => {
  url = url || `/iframe/${item.id}`;
  let meta: IObject = {};
  const toRoutePath = (url: string): string => {
    return (url = !/^\//g.test(url) ? "/" + url : url);
  };
  //生成变量路由数据
  const renderVariableHook = (url: string): string => {
    return url.replace("{{ApiUrl}}", app.api);
  };
  if (item.openStyle === 1) {
    //外部
    if (isExternalLink(url)) {
      url = renderVariableHook(url);
      meta = { url, isNewPage: true };
      url = `/webview/${item.id}`; //虚拟无效地址
    } else {
      url = toRoutePath(url);
      meta = { url: `/#${url}?pop=true`, isNewPage: true };
    }
  } else {
    //内部
    if (isExternalLink(url)) {
      url = renderVariableHook(url);
      meta = { url, isIframe: true };
      url = `/iframe/${item.id}`;
    } else {
      url = toRoutePath(url);
    }
  }
  return [url, meta];
};
