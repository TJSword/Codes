// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: "remember-9g9uezjvfd43fe89"})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const _ =cloud.database().command
  let res  = await cloud.database().collection('users').where({
    _openid: _.eq(wxContext.OPENID)
  }).get()
  if(res.data.length == 0){
    let now = new Date().getTime()
    let res = await cloud.database().collection('users').add({
      data:{
        _openid: wxContext.OPENID,
        meetTime:now
      }
    })
    return {
      code:0,
      msg:'用户为新用户'
    }
  }else{
    return {
      code:200,
      msg:'用户为老用户'
    }
  }
}