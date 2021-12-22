// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "letter-tb92g"
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const _ = cloud.database().command

  let sentRes = cloud.database().collection('sentLetter').where({
    _openid: _.eq(wxContext.OPENID)
  }).orderBy('createTime', 'desc').get()

  let unsentRes = cloud.database().collection('unsentLetter').where({
    _openid: _.eq(wxContext.OPENID)
  }).orderBy('sendDate', 'asc').get()

  return {
    sentLetterRes: await sentRes,
    unsentLetterRes: await unsentRes
  }
}