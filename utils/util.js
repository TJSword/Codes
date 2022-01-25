const app = getApp();

const request = (url,methods,data= {}) =>{
  let token = wx.getStorageSync('token')
  return new Promise((resolve,reject) =>{
    wx.request({
      url: app.globalData.URL + url,
      method:methods,
      header:{
        'content-type': methods.toUpperCase() == 'GET' ? 'application/json' : 'application/x-www-form-urlencoded',
        token:token
      },
      data:data,
      complete: msg => {
        if (msg.statusCode != 200) {
          reject(msg);
          console.error({
            msg: '警告：接口异常',
            code: 'http状态码：' + msg.statusCode,
            url: '接口地址：' + url,
            type: '请求类型：' + methods.toUpperCase(),
            data: data
          });
        }else if(msg.data.code === 401){
          wx.navigateTo({
            url: '../Login/Login',
          })
        } else {
          resolve(msg.data);
        }
      }
    })
  })
}
const saveRequest = (url, methods, data = {},contentType) => {
  let token = wx.getStorageSync('token')
  return new Promise((resolve, reject) => {
    wx.request({
      url: app.globalData.URL + url,
      method: methods,
      header: {
        'content-type': contentType,
        token: token
      },
      data: data,
      complete: msg => {
        if (msg.statusCode != 200) {
          reject(msg);
          console.error({
            msg: '警告：接口异常',
            code: 'http状态码：' + msg.statusCode,
            url: '接口地址：' + url,
            type: '请求类型：' + methods.toUpperCase(),
            data: data
          });
        } else if (msg.data.code === 401) {
          wx.navigateTo({
            url: '../Login/Login',
          })
        } else {
          resolve(msg.data);
        }
      }
    })
  })
}
module.exports = {
  request,
  saveRequest
}
