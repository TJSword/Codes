// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: "remember-9g9uezjvfd43fe89"})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let now = new Date().getTime()
  let year = new Date().getFullYear()
  let month =  new Date().getMonth() * 1 + 1
  let day = new Date().getDate()
  return await cloud.database().collection('memorys').add({
    data: {
      ...event,
      _openid: wxContext.OPENID,
      createTime: now,
      date:{
        year,month,day
      }
    }
  })
}