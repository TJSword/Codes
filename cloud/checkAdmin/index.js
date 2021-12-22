// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(wxContext.OPENID)
  if (wxContext.OPENID === "o8thO5ccX0yhc_ZOSuRX8UG8Deug" || wxContext.OPENID ==='o8thO5V2s5d4IiwfyOFr6paBGluc'){
    return true
  }else{
    return false
  }
}