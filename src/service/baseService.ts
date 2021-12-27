import { IHttpResponse, IObject } from "@/types/interface";
import { Method } from "axios";
import http from "../utils/http";

/**
 * 常用CRUD
 */
export default {
  /**
   * 删除
   * @param path
   * @param params
   * @returns
   */
  delete(path: string, params: IObject): Promise<IHttpResponse> {
    return http({
      url: path,
      data: params,
      method: "DELETE"
    });
  },
  get(path: string, params?: IObject, headers?: IObject): Promise<IHttpResponse> {
    return new Promise((resolve, reject) => {
      http({
        url: path,
        params,
        headers,
        method: "GET"
      })
        .then(resolve)
        .catch((error) => {
          if (error !== "-999") {
            reject(error);
          }
        });
    });
  },
  put(path: string, params?: IObject, headers?: IObject): Promise<IHttpResponse> {
    return http({
      url: path,
      data: params,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        ...headers
      },
      method: "PUT"
    });
  },
  /**
   * 通用post方法
   * @param path
   * @param body
   * @returns
   */
  post(path: string, body?: IObject, headers?: IObject): Promise<IHttpResponse> {
    return http({
      url: path,
      method: "post",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        ...headers
      },
      data: body
    });
  },

  /**
   * 下载文件
   * @param {*} url
   * @param {*} params
   * @param {*} filename
   * @param {*} method
   */
  download(
    path: string,
    params?: IObject,
    filename?: string,
    method: Method = "get"
  ): Promise<IHttpResponse> {
    const opt: any = { url: path, params, method, responseType: "blob" };
    if (method.toLowerCase() === "post") {
      opt.data = params;
      delete opt.params;
    }
    return http(opt).then((res): any => {
      const a = document.createElement("a");
      const evt = document.createEvent("MouseEvents");
      evt.initEvent("click", false, false);
      a.download = filename || new Date().getTime().toString();
      a.href = URL.createObjectURL(res);
      a.dispatchEvent(evt);
    });
  }
};
