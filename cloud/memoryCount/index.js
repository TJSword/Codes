// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: "remember-9g9uezjvfd43fe89"})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const _ =cloud.database().command
  let world =  await cloud.database().collection('memorys').count()
  let person = await cloud.database().collection('memorys').where({
    _openid: _.eq(wxContext.OPENID)
  }).count()
  return{
    world,person
  }
}