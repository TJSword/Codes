// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "letter-tb92g"
})


// 云函数入口函数
exports.main = async (event, context) => {
  const fileList = [
    'cloud://letter-tb92g.6c65-letter-tb92g-1300874524/background/0.png',
    'cloud://letter-tb92g.6c65-letter-tb92g-1300874524/background/1.png',
    'cloud://letter-tb92g.6c65-letter-tb92g-1300874524/background/2.png',
    'cloud://letter-tb92g.6c65-letter-tb92g-1300874524/background/3.png',
    'cloud://letter-tb92g.6c65-letter-tb92g-1300874524/background/4.png',
    'cloud://letter-tb92g.6c65-letter-tb92g-1300874524/background/5.png',
    'cloud://letter-tb92g.6c65-letter-tb92g-1300874524/background/6.png',
    'cloud://letter-tb92g.6c65-letter-tb92g-1300874524/background/7.png',
    'cloud://letter-tb92g.6c65-letter-tb92g-1300874524/background/8.png',
    'cloud://letter-tb92g.6c65-letter-tb92g-1300874524/background/9.png',
    'cloud://letter-tb92g.6c65-letter-tb92g-1300874524/background/10.png',
    ]
  const result = await cloud.getTempFileURL({
    fileList: fileList,
  })
  const sharePhotos = [
    "cloud://letter-tb92g.6c65-letter-tb92g-1300874524/sharePhotos/0.jpg",
    "cloud://letter-tb92g.6c65-letter-tb92g-1300874524/sharePhotos/1.jpg",
    "cloud://letter-tb92g.6c65-letter-tb92g-1300874524/sharePhotos/2.jpg",
    "cloud://letter-tb92g.6c65-letter-tb92g-1300874524/sharePhotos/3.jpg"
  ]
  const shareResult = await cloud.getTempFileURL({
    fileList: sharePhotos,
  })
  console.log(shareResult)
  let bgRandom = Math.floor(Math.random() * 11)
  const indexTextArr = [
    { text: "除了这一生，我们又没有别的时间", writer: "" },
    { text: "喜乐有分享，共度日月长", writer: "" },
    { text: "生活原本沉闷，但跑起来就有风", writer: "" },
    { text: "花开如火，也如寂寞", writer: "顾城" },
    { text: "那就在一起，晨昏与四季", writer: "" },
    { text:'年年有风，风吹年年，慢慢即漫漫',writer:''},
    { text:"愿以云翳，装点黄昏。",writer:''},
    { text:"相爱的人一定会相爱",writer:''}
  ]
  let textRandom = Math.floor(Math.random() * 20)
  console.log(textRandom)
  return {
      // bgUrl: result.fileList[bgRandom],
      // indexText: indexTextArr[textRandom].text,
      // indexTextWriter: indexTextArr[textRandom].writer
    bgUrl: result.fileList[3],
    indexText: indexTextArr[7].text,
    indexTextWriter: indexTextArr[7].writer,
    shareUrl: shareResult.fileList[1],
    explain:{
      title:"关于时光与信",
      annotation:"除了这一生，我们又没有别的时间",
      paragraph_1: "「时光与信」是一个给未来的留言板,你可以为自己、爱人、家人、朋友或者任何人留下你现在想对他们说的话,并且设置一个未来能够开封的时间,这样他们就能在未来读到你的留言。",
      paragraph_2: "1.时空密钥:当到了用户指定的时间，系统会给收信人发一条带密钥的短信，通过密钥来获取信件;",
      paragraph_3: "2.拾光邮寄:我们会写一封实体信(挂号信),在到达你指定时间时为你寄出;8元/封",
      paragraph_4: "输入密钥'12345678'去了解更多"
      //  title: "关于时光与信",
      // annotation: "除了这一生，我们又没有别的时间",
      // paragraph_1: "「时光与信」是一个可以统计你挂号信的小程序，日色慢 车马邮件也慢 我们在为一些“慢”的东西做保留，我们会记录那些你所寄过的挂号信",
      // paragraph_2: "可以在主页中输入您的挂号信的邮编，并获取您的手机号，我们会自动识别邮寄和收到的信件",
      // paragraph_3: "去获取你的第一封信件吧",
      // paragraph_4: "希望世界和平"
    },
    money:{
      msg:20,
      letter:800
    },
    isFree:true
  }
}