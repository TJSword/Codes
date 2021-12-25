// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: "about-3g93ob8m8c4851d9"})
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let result = {}
  //喜欢与厌
  const _ = cloud.database().command
  let likeRes  = await cloud.database().collection('records').where({
    createBy: _.eq(wxContext.OPENID),
    kind:0
  }).orderBy('createTime', 'desc').get()
  result.likeData = likeRes.data.filter(item=>item.type === 0)
  result.unlikeData = likeRes.data.filter(item=>item.type === 1)
  //纪念日
  let commemorationData = await cloud.database().collection('records').where({
    createBy: _.eq(wxContext.OPENID),
    kind:1
  }).orderBy('createTime', 'desc').limit(2).get()
  
  result.commemorationData = commemorationData.data
  //要做的事
  let todoData = await cloud.database().collection('records').where({
    createBy: _.eq(wxContext.OPENID),
    kind:2
  }).orderBy('createTime', 'desc').limit(1).get()
  result.todoData = todoData.data

  //备忘录
  let memoData = await cloud.database().collection('records').where({
    createBy: _.eq(wxContext.OPENID),
    kind:3
  }).orderBy('createTime', 'desc').limit(2).get()
  result.memoData = memoData.data
  //照片
  let photos = await cloud.database().collection('records').where({
    createBy: _.eq(wxContext.OPENID),
    imagePaths:_.neq([]),
    kind:3
  }).orderBy('createTime', 'desc').limit(10).get()
  console.log(photos)
  let length = photos.data.length
  let randomIndex = parseInt(Math.random() * length)
  if(length == 0){
    result.photos = ''
  }else{
    result.photos = photos.data[randomIndex].imagePaths[0]
  }
  return result
}