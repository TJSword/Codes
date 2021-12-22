// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "letter-tb92g"
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const _ = cloud.database().command

 let sentRes = cloud.database().collection('sentMessage').where({
    _openid: _.eq(wxContext.OPENID)
 }).orderBy('createTime', 'desc').get()

  let unsentRes = cloud.database().collection('unsentMessage').where({
    _openid: _.eq(wxContext.OPENID)
  }).orderBy('sendTime', 'asc').get()
  
  return {
    sentRes: await sentRes,
    unsentRes: await unsentRes
  }
}