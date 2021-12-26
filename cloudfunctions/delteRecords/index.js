// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: "about-5gpmavp7ed2c5b7b"})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const _ =cloud.database().command
  let res  = await cloud.database().collection('records').where({
    _id:event.id
  }).remove()
  return res
}