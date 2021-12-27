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
  //头像上传 用户昵称更新
  updateUserInfo(data){
    return request({
      url:'/sys/user/web/update',
      method:'put',
      data:data
    })
  },
  changePassword(data){
    return request({
      url:'/sys/user/password',
      method:'put',
      data:data
    })
  }
  
};
export default user;