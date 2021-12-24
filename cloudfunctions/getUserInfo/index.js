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
  let result = {
    heText:`亦舒妹妹，本想抄两句优美的情话给你，让你觉得我很用心。
    但转念一想，我的愿望只是想陪在你身边。`,
    yuText:'遇见你是一件很幸运的事',
    indexText:'双击修改自定义文字'
  }
  if(res.data.length === 0){
    let now = new Date().getTime()
    let res = await cloud.database().collection('users').add({
      data:{
        _openid: wxContext.OPENID,
        meetTime:now,
        indexText:'双击修改自定义文字'
      }
    })
    return result
  }else{
    result.indexText = res.data[0].indexText
    return result
  }
}