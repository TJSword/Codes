import request from "@/utils/request";
//通用API
const common = {
  //用户全部城市信息
  getUserCity() {
    return request({
      url: "/sys/region/search",
      method: "get",
      params: {}
    });
  },
  //请求板块数据(GeoJSON数据)
  getPlateGeoJSON(cityCode,type) {
    return request({
      url: "/dl/region/"+cityCode+"00/list",
      method: "get",
      params: type
    });
  },
  //获取城市轮廓geojson数据
  getCityJSON(cityCode){
    return request({
      url: "/dl/region/coordinates//"+cityCode,
      method: "get",
      params: {}
    });
  },
  //获取指标
  getEvaList(obj){
    return request({
      url:"/app/bi/item",
      method:"post",
      params:obj
    })
  },
  //菜单获取(树形)
  getMenuTree(){
    return request({
      url:"/sys/menu/nav",
      method:"get",
      params:{}
    })
  },
  //菜单获取(列表)
  getMenuList(){
    return request({
      url:"/sys/menu/navlist",
      method:"get",
      params:{}
    })
  },
  //获取省、市、城区
  getPCR(obj){
    return request({
      url:"/sys/region/query",
      method:"get",
      params:obj
    })
  },
  //统计地图调用次数
  statisticsMapLoad(){
    return request({
      url:"/sys/log/operation",
      method:"post",
      params:{}
    })
  },
  //测试接口
  getTestData(){
    return request({
      url:"/lms/work/toolimgmap/handlecad",
      method:"get",
      params:{}
    })
  },
};
export default common;