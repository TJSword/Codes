// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "letter-tb92g"
})

// 云函数入口函数
exports.main = async (event, context) => { //检查用户是否是第一次登录
  const wxContext = cloud.getWXContext()
  const _ =cloud.database().command
  return cloud.database().collection('users').where({
    _openid: _.eq(wxContext.OPENID)
  }).get()
}