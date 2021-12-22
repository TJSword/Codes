// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "letter-tb92g"
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const _ = cloud.database().command
  let _id = event.id;
  let postalNumber = event.postalNumber
  await cloud.database().collection('unsentLetter').where({
    _id: _.eq(_id)
  }).get().then(res=>{
    let result = null
    console.log(res.data[0])
    delete res.data[0]._id;
    cloud.database().collection("sentLetter").add({
      data: {
        ...res.data[0],
        sendAdmin: wxContext.OPENID,
        postalNumber
      }
    }).then(res => {
      console.log(res)
      cloud.database().collection('unsentLetter').where({
        _id: _.eq(_id)
      }).remove().then(res => {
        console.log("移除成功", res)
      })
    })
  })
}
