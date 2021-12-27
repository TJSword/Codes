import request from "@/utils/request";
//等时圈
const isochronous = {
  //获取城市轮廓geojson数据
  getCityJSON(cityCode){
    return request({
      url: "/dl/region/coordinates//"+cityCode,
      method: "get",
      params: {}
    });
  },
  //获取等时圈内的数据
  getIsochronousScore(obj){
    return request({
      url:"/lms/dsq/circle",
      method:"post",
      params:obj
    })
  },
  //检查该点是否查询过数据
  checkPointSave(obj){
    return request({
      url:"/lms/dsq/circle/check",
      method:"get",
      params:obj
    })
  },
  //查询围栏内的poi
  queryCirclePoi(obj){
    return request({
      url:"/dms/pt/query/click",
      method:"post",
      params:obj
    })
  }
};
export default isochronous;