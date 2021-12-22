// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const _ = cloud.database().command
  let donate =event.money
  return await cloud.database().collection('users').where({
    _openid: _.eq(wxContext.OPENID)
  }).update({
    data:{
      donate: _.inc(donate)
    },
    success:res=>{
      return res
    },
    fail:res=>{
      return res
    }
  })
}