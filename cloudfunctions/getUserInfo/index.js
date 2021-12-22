// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: "about-3g93ob8m8c4851d9"})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const _ =cloud.database().command
  let res  = await cloud.database().collection('users').where({
    _openid: _.eq(wxContext.OPENID)
  }).get()
  if(res.data.length === 0){
    let now = new Date().getTime()
    let res = await cloud.database().collection('users').add({
      data:{
        _openid: wxContext.OPENID,
        meetTime:now,
        indexText:''
      }
    })
    return ''
  }else{
    return res.data[0].indexText
  }
}