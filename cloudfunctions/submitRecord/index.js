// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: "about-5gpmavp7ed2c5b7b"})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const result = await cloud.openapi.security.msgSecCheck({
    "openid": wxContext.OPENID,
    "scene": 4,
    "version": 2,
    "content": event.content
  })
  if(result.result.label != 100) return {code:500,msg: '内容违规了 汪:('}
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