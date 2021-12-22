// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const _ =cloud.database().command
  return await cloud.database().collection('memorys').where({
    _id:_.eq(event.id)
  }).get()
}