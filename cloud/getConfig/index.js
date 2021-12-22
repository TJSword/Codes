// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"record-ikt1b"
})

// 云函数入口函数
exports.main = async (event, context) => {
  return {
    checkStatus:1
  }
}