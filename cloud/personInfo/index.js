// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: "remember-9g9uezjvfd43fe89"})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const _ =cloud.database().command
  const count = await cloud.database().collection('memorys').where({
    _id:_.nin(event.idArr),
    _openid:_.eq(wxContext.OPENID),
  }).count()
  const random = parseInt(Math.random() * count.total)
  return cloud.database().collection('memorys').where({
    _openid:_.eq(wxContext.OPENID),
    _id:_.nin(event.idArr)
  }).skip(random).limit(1).get()
}