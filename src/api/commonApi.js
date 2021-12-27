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
  
};
export default common;