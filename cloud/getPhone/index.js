// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "letter-tb92g"
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const _ = cloud.database().command
  let data = await cloud.getOpenData({
      list:[event.cloudID]
    })
  console.log(data)
  let res = cloud.database().collection('users').where({
    _openid: _.eq(wxContext.OPENID)
  }).update({
    data: {
      phone: data.list[0].data.phoneNumber
    }
  })
  return await res, data.list[0].data.phoneNumber
}