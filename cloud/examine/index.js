// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"record-ikt1b"
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const _ = cloud.database().command
  let secret = event.id
  let res = cloud.database().collection('message').where({
    secret: _.eq(secret)
  }).get()
  return await res
}