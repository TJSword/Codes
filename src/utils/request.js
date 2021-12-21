import axios from "axios";
import store from "../store";
import router from "../router";
import Storage from "@/utils/storage"; // 验权
import {Message} from "element-ui"

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_URL, // api 的 base_url
  timeout: 100000 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers["token"] = store.getters.token;
    }
    if (config.method === "post") {
      config.data = config.params;
      config.params = "";
    }
    if (config.method === "delete") {
      config.data = config.params;
      config.params = "";
    }
    if (config.method === "put") {
      config.data = config.params;
      config.params = "";
    }
    if(config.responseType){
      config.headers["responseType"] = config.responseType;
    }
    return config;
  },
  error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// response 拦截器
service.interceptors.response.use(
  response => {
    let { data, status } = response;
    if (status !== 200) {
      return Promise.resolve(false);
    } else {
      if(data.code===401){ //处理token过期等
        Storage.cle()
        router.push('/login');
      }else if(data.code === 500){
        Message.error(data.msg)
      }else{
        return { data };
      }
      
    }
  },
  error => {
    console.log("err" + error); // for debug
    return Promise.reject(error);
  }
);

export default service;