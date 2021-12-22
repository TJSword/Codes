// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "letter-tb92g"
})

// 云函数入口函数
exports.main = async (event, context) => {
  let avatarUrl = event.avatarUrl
  let nickName = event.nickName
  const wxContext = cloud.getWXContext()
  const _ = cloud.database().command

  return cloud.database().collection('users').where({
    _openid: _.eq(wxContext.OPENID)
  }).update({
    data: {
      avatarUrl: avatarUrl,
      nickName: nickName
    },
    success: res => {
      return res
    },
    fail: res => {
      return res
    }
  })
}