const cloud = require('wx-server-sdk')
cloud.init({
  env: "letter-tb92g"
})
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: "o8thO5ccX0yhc_ZOSuRX8UG8Deug",
      page: 'index',
      data: {
        name1: {
          value: '何遇'
        },
        time2: {
          value: '2019-12-10 14:40:26'
        },
        thing3: {
          value: '你还好吗'
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