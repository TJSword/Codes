export const getRecords = async (kind) =>{
  return await wx.cloud.callFunction({
    name:'getRecords',
    data:{kind}
  })
}
export const transformDate = timeStamp =>{
  let date = new Date(timeStamp)
  let year = date.getFullYear()
  let month = date.getMonth() + 1;
  if(month < 10) month = '0' + month
  let day = date.getDate() 
  if(day < 10) day = '0' + day
  return [year,month,day]
}
export const delteRecords = async (id) =>{
  return await wx.cloud.callFunction({
    name:'delteRecords',
    data:{id}
  })
}
export const getDaysBetween = (type,date) =>{
  let startDate = new Date(date)
  let year = new Date().getFullYear()
  let month = new Date().getMonth() + 1;
  if(month < 10) month = '0' + month
  let day = new Date().getDate() 
  if(day < 10) day = '0' + day
  let today = `${year}-${month}-${day}`
  let now = new Date(today)
  if(type === 0){
    let days = parseInt((now - startDate) / 86400000)
    return days
  }else if(type === 1){
    let days = parseInt((startDate - now) / 86400000) 
    return days
  }
}