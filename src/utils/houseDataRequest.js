import axios from "axios";
import router from "../router";
import Storage from "@/utils/storage"; // 验权

// 创建axios实例
const houseDataService = axios.create({
  baseURL: "http://118.190.150.38:8283/dmc-web", // api 的 base_url
  timeout: 50000 // 请求超时时间
});
// request拦截器
houseDataService.interceptors.request.use(
  config => {
    config.headers["token"] = '8243906ec5696d1467c6917da6154276'
    // if (localStorage.getItem("token")) {
    //   config.headers["token"] = localStorage.getItem("token")
    // }
    if (config.method === "post") {
      config.data = config.params;
      config.params = "";
    }
    if (config.method === "delete") {
      config.data = config.params;
      config.params = "";
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
houseDataService.interceptors.response.use(
  response => {
    let { data, status } = response;
    if (status !== 200) {
      return Promise.resolve(false);
    } else {
      if(data.code===401){ //处理token过期等
        // Storage.cle()
        // router.push('/login');
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

export default houseDataService;