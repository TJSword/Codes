// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "letter-tb92g"
})

// 云函数入口函数
exports.main = async (event, context) => {
  const _ = cloud.database().command
  return await cloud.database().collection("unsentLetter").doc(event.id).remove()
}