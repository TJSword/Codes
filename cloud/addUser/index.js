// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "letter-tb92g"
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let avatarUrl = event.avatarUrl;
  let nickName = event.nickName;


  return await cloud.database().collection('users').add({
    data: {
      avatarUrl: avatarUrl,
      nickName: nickName,
      donate:0,
      meetTime:new Date().getTime(),
      _openid: wxContext.OPENID
    }
  })
}