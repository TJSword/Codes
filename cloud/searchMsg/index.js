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
  return await cloud.database().collection('sentMessage').where({
    secret: _.eq(secret)
  }).get()
}