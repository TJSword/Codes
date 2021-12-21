import request from "@/utils/request";
//台账地图API
const macro = {
  //获取宏观数据
  getMacroData(url,data){
    return request({
      url:url,
      method:"get",
      params:data
    })
  },
  //获取宏观数据字典
  getMacroDataDict(){
    return request({
      url:"/udm/item/tree",
      method:"get",
      params:{}
    })
  },
}
export default macro