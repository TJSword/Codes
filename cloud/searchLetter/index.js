// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "letter-tb92g"
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const _ = cloud.database().command
  let secret = event.secret
  let res = cloud.database().collection('sentLetter').where({
    secret: _.eq(secret)
  }).get()
  return await res
}