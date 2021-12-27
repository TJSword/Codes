/*
调整系数=去化周期
调整权重=调整系数/调整系数之和
调整后分布=供应量-供应量*调整权重
竞品户型配比=调整后分布/调整后分布之和
建议户型配比= ∑〖各竞品户型配比∗权重〗
*/
// 调整权重
function tzqz (dataList, data) {
  var tzxs = sumTzxs(dataList)
  if(tzxs === 0){
    return 0
  }else{
    return data.ratio / tzxs
  }
}

// 调整系数之和
function sumTzxs (dataList) {
  // 户型配比
  // 调整系数之和
  var tzxs = 0
  for (var i = 0; i < dataList.length; i++) {
    tzxs += dataList[i].ratio
  }
  return tzxs
}

// 调整后分布
function tzhfb (dataList, data) {
  return Math.ceil(data.supply - data.stock * tzqz(dataList, data))
}

// 调整后分布之和
function sumTzhfb (dataList, data) {
  var sumT = 0
  for (var i = 0; i < dataList.length; i++) {
    sumT += tzhfb(dataList, data)
  }
  return sumT
}

// 竞品户型配比
function doorRatio (dataList, data) {
  var a = tzhfb(dataList, data)
  var b = sumTzhfb(dataList,data)
  if(b === 0){
    return 0
  }else{
    return a / b
  }
}

// 建议户型配比
// eslint-disable-next-line no-unused-vars
export function suDoorRatio (data, area) {
  var rst = {}
  // 最终户型配比
  var sumRatio = 0
  for (var i = 0; i < area.length; i++) {
    for (var n = 0; n < data.length; n++) {
      for (var k = 0; k < data[n].area_sizes.length; k++) {
        if (area[i] === data[n].area_sizes[k].area_size) {
          sumRatio += data[n].weight * data[n].area_sizes[k].hp
        }
      }
    }
    // var str = Number(sumRatio * 100).toFixed(1)
    // str += '%'
    rst[area[i]] = sumRatio.toFixed(4) * 1
    sumRatio = 0
  }
  return rst
}
