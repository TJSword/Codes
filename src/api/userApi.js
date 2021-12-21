import request from "@/utils/request";

const user = {
  //登录
  login({ username, password,captcha,uuid }) {
    return request({
      url: "/login",
      method: "post",
      params: {
        username,
        password,
        captcha,
        uuid
      }
    });
  },
  //登出
  logOut({ token }) {
    return request({
      url: "/logout",
      method: "post",
      params: {
        token
      }
    });
  },
  //获取手机验证码
  getMobileCode(phone){
    return request({
      url: "/mcode/"+phone,
      method: "get",
      params: {}
    })
  },
  //注册
  userRegister(data) {
    return request({
      url: "/register",
      method: "post",
      params: data
    });
  },
  //修改密码
  modifyPassword(data) {
    return request({
      url: "/sys/user/password",
      method: "put",
      params: data
    });
  },
  //修改用户信息
  modifyUserInfo(form){
    return request({
      url: "/sys/user/updateinfo",
      method: "put",
      params: form
    });
  },
  //密码找回
  findPassword(data) {
    return request({
      url: "/retrieve",
      method: "post",
      params: data
    });
  },
  //获取注册人数
  getRegisterNum() {
    return request({
      url: "/checknum",
      method: "get",
      params: {}
    });
  },
  //获取用户信息
  getUserInfo(){
    return request({
      url:'/sys/user/info',
      method:'get',
      params:{}
    })
  },
  //管理员下载官方土地数据
  adminDownLoadFile(obj){
    return request({
      url:'/lms/work/account/exportall',
      method:'get',
      responseType:'arraybuffer',
      params:obj
    })
  },
};
export default user;