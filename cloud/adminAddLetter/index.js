// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "letter-tb92g"
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let openid = wxContext.OPENID
  event.sendAdmin = openid;
  delete event._id
  return await cloud.database().collection("sentLetter").add({
    data:event
  })
}