// 云函数入口文件
const cloud = require('wx-server-sdk')
const rq = require('request')
const baseUrl = 'https://smsdeveloper.zhenzikj.com'
const appId = '100148'
const appSecret = '5ba62113-4dbc-4785-907c-2bbbd5e6cf66'
cloud.init({
  env: "letter-tb92g"
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const execTasks = []; // 待执行任务栈
  await cloud.database().collection('unsentMessage').orderBy('sendTime', 'asc').limit(10).get().then(async res => {
    let sendLetters = res.data
    console.log(sendLetters)   // 是一个数组
    //2.定时任务是否到达触发时间。只触发一次
    let now = new Date().getTime()
    try {
      for (let i = 0; i < sendLetters.length; i++) {
        if (sendLetters[i].sendTime <= now) {// 时间到
          await db.collection('unsentMessage').doc(sendLetters[i]._id).remove().then(async res => {
            console.log(sendLetters[i].phone, res)
            delete sendLetters[i]._id
            await db.collection('sentMessage').add({ data: sendLetters[i] }).then(res => console.log(sendLetters[i].phone, res)).catch(error => console.err(err));
          }).catch(
            error => 
            console.err(err)
            ) 
          execTasks.push(sendLetters[i]); // 存入待执行任务栈
        }
      }
    } catch (e) {
      console.log(e)
    }
    console.log(execTasks)
    //处理任务
    for (let i = 0; i < execTasks.length; i++) {
      console.log(execTasks[i])
     await new Promise((resolve, reject) => {
        rq({
          url: baseUrl + '/sms/send.html',
          method: "POST",
          json: true,
          form: {
            apiUrl: 'https://sms.zhenzikj.com',
            appId: appId,
            appSecret: appSecret,
            message: `${execTasks[i].writer}在时光空间里给你留言了，想要收听的话，请复制密钥：「${execTasks[i].secret}」，前往「时光与信」小程序去查看吧！`,
            number: execTasks[i].phone
          }
        },  async (error, response, body)=> {
          resolve({ body: body, error: error })
          console.log(body, error)
          console.log(body.code)
        });
      })
    }
  })
}