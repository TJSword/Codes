// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "letter-tb92g"
})

// 云函数入口函数
exports.main = async (event, context) => {
  let phone = event.phone + ""
  const wxContext = cloud.getWXContext()
  const _ = cloud.database().command

  let sentMsg = cloud.database().collection('sentMessage').where({
    phone: _.eq(phone)
  }).orderBy('sendTime', 'desc').get()

  let sentLetter = cloud.database().collection('sentLetter').where({
    phone: _.eq(phone)
  }).orderBy('sendTime', 'desc').get()

  return {
    sentMsg: await sentMsg,
    sentLetter: await sentLetter
  }
}