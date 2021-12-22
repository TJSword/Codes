// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"record-ikt1b"
})


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let now = new Date().getTime()
  return await cloud.database().collection('message').add({
    data: {
      ...event,
      _openid: wxContext.OPENID,
      createTime: now
    }
  }).then(res => {
    return res
  }).catch(err => {
    return err
  })
}