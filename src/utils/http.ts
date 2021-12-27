import app from "@/constants/app";
import { CacheTenantCode } from "@/constants/cacheKey";
import { getLocaleLang } from "@/i18n";
import { IHttpResponse, IObject } from "@/types/interface";
import router from "@/router";
import axios, { AxiosRequestConfig } from "axios";
import qs from "qs";
import { getCache, getToken } from "./cache";
import { getValueByKeys } from "./utils";

const http = axios.create({
  baseURL: app.api,
  timeout: app.requestTimeout
});

const requestPending: IObject = {};

const getRequestIdentify = (config: AxiosRequestConfig) => {
  return encodeURIComponent(config.url + qs.stringify(config.params, { addQueryPrefix: true }));
};

http.interceptors.request.use(
  function (config) {
    config.headers["X-Requested-With"] = "XMLHttpRequest";
    config.headers["Request-Start"] = new Date().getTime();
    config.headers["Accept-Language"] = getLocaleLang();
    config.headers["tenantCode"] = getCache(CacheTenantCode, { isParse: false }) || "";
    const token = getToken();
    if (token && config.url !== "/auth/oauth/token") {
      config.headers["Authorization"] = "Bearer " + token;
    }
    if (config.method?.toUpperCase() === "GET") {
      config.params = { ...config.params, _t: new Date().getTime() };
    }
    if (Object.values(config.headers).includes("application/x-www-form-urlencoded")) {
      config.data = qs.stringify(config.data);
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
http.interceptors.response.use(
  (response) => {
    if (response.data.code === 401) {
      //自定义业务状态码
      redirectLogin();
    }
    return response;
  },
  (error) => {
    const status = getValueByKeys(error, "response.status", 500);
    const httpCodeLabel: IObject<string> = {
      400: "请求参数错误",
      401: "未授权，请登录",
      403: "拒绝访问",
      404: `请求地址出错: ${getValueByKeys(error, "response.config.url", "")}`,
      408: "请求超时",
      500: "API接口报500错误",
      501: "服务未实现",
      502: "网关错误",
      503: "服务不可用",
      504: "网关超时",
      505: "HTTP版本不受支持"
    };
    if (error && error.response) {
      console.error("请求错误", error.response.data);
    }
    if (status === 401) {
      redirectLogin();
    }
    return Promise.reject(new Error(httpCodeLabel[status] || "接口错误"));
  }
);

const redirectLogin = () => {
  router.replace("/login");
  return;
};

export default (o: AxiosRequestConfig): Promise<IHttpResponse> => {
  const key = getRequestIdentify(o);
  if (requestPending[key]) {
    return Promise.reject("-999");
  } else {
    requestPending[key] = 1;
  }
  return new Promise((resolve, reject) => {
    http(o)
      .then((res) => {
        delete requestPending[key];
        return resolve(res.data);
      })
      .catch(reject);
  });
};
