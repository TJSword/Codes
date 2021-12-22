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
  let suggest = event.suggest


  return await cloud.database().collection('suggest').add({
    data: {
      avatarUrl: avatarUrl,
      nickName: nickName,
      creatTime: new Date().getTime(),
      _openid: wxContext.OPENID,
      suggest: suggest
    }
  })
}