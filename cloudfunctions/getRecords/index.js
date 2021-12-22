// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: "about-3g93ob8m8c4851d9"})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const _ =cloud.database().command
  let res  = await cloud.database().collection('records').where({
    createBy: _.eq(wxContext.OPENID),
    kind:event.kind
  }).orderBy('createTime','desc').get()
  return res
}