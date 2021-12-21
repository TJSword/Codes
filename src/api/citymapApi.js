
import request from "@/utils/request"
//城市地图API
const citymap = {
  //获取城市的板块数据
  getCityPlates(obj) {
    return request({
      url: "/dms/dl/part/search",
      method: "get",
      params: obj
    });
  },
  //查询楼盘市场数据
  getMarketData(obj) {
    return request({
      url: "/dms/sc/building/cal",
      method: "get",
      params: obj
    });
  },
  //查询楼盘分布
  getHousing(obj) {
    return request({
      url: "/dms/sc/building/search",
      method: "get",
      params: obj
    });
  },
  //查询楼盘四至
  getHousingFour(obj) {
    return request({
      url: "/lms/work/account/building/lands",
      method: "get",
      params: obj
    });
  },
  //查询楼盘详细信息
  getHousingDetail(id) {
    return request({
      url: "/dms/sc/building/"+id,
      method: "get",
      params: {}
    });
  },
  //GEBO矩阵
  //保存矩阵
  saveGeboInfo(data) {
    return request({
      url: "/lms/gebo/condition",
      method: "post",
      params: data
    });
  },
  //删除矩阵
  delMatrix(data) {
    return request({
      url: "/lms/gebo/condition",
      method: "delete",
      params: data
    });
  },
  //获取保存矩阵列表
  getGeboList() {
    return request({
      url: "/lms/gebo/condition/list",
      method: "get",
      params: {}
    });
  },
  //查询top50房企排行榜
  getTopRank(obj) {
    return request({
      url: "/lms/work/account/rank",
      method: "get",
      params: obj
    });
  },
  //查询房企下的楼盘
  getRankBuilding(obj) {
    return request({
      url: "/lms/work/account/rank/building",
      method: "get",
      params: obj
    });
  },
};
export default citymap;