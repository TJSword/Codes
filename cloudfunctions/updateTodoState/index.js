// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: "about-3g93ob8m8c4851d9"})
// 云函数入口函数
exports.main = async (event, context) => {
  const _ =cloud.database().command
  cloud.database().collection('records').where({
    _id: _.eq(event.id)
  }).update({
    data: {
      isDone: event.isDone
    }
  })
}