// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: "remember-9g9uezjvfd43fe89"})

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const res = await cloud.openapi.security.msgSecCheck({
      content: event.content
    })
    return res;
  } catch (err) {
    return err;
  }
}