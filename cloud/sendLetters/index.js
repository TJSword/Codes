// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "letter-tb92g"
})
const db = cloud.database()
// 云函数入口函数
// 1.查询数据库 是否要待发送的信件
exports.main = async (event, context) => {
  const execTasks = []; // 待执行任务栈
  let sendLettersRes = await cloud.database().collection('unsentMessage').limit(100).get()
  let sendLetters = sendLettersRes.data // 是一个数组
//2.定时任务是否到达触发时间。只触发一次
  let now = new Date().getTime()
  try {
    for (var i = 0; i < sendLetters.length; i++) {
      if (sendLetters[i].sendTime <= now) { // 时间到
        execTasks.push(sendLetters[i]); // 存入待执行任务栈
        // 定时任务数据库中删除该任务
        await db.collection('sentMessage').add(sendLetters[i])
        await db.collection('unsentMessage').doc(sendLetters[i]._id).remove()
      }
    }
  } catch (e) {
    console.error(e)
  }
  //3.处理待执行的任务
  for (var j = 0; j < execTasks.length; j++) {
    var task = execTasks[j];
    try {
      const result = await cloud.openapi.subscribeMessage.send({
        touser: task.toUser,
        page: 'index',
        data: {
          name1: {
            value: '何遇'
          },
          time2: {
            value: '2019-12-10 14:40:26'
          },
          thing3: {
            value: task.content
          }
        },
        templateId: 'TLJXPFnWsuiRVLBw2vDC27cprFDSxBC6XaW0VwL8eqE'
      })
      console.log(result)
      return result
    } catch (err) {
      console.log(err)
      return err
    }
  }

}