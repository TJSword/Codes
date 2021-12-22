// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: "about-3g93ob8m8c4851d9"})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let now = new Date().getTime()
  return await cloud.database().collection('records').add({
    data: {
      ...event,
      createBy: wxContext.OPENID,
      createTime: now
    }
  }).then(res => {
    return res
  }).catch(err => {
    return err
  })
}