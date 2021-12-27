import request from "@/utils/request";
//数据查询
const dataqury = {
  //获取时间段内客观指标值数据
  getCategory(url,obj) {
    return request({
      url:url,
      method:"get",
      params:obj
    })
  },
  //获取配套信息字典列表
  getMatchingDict(id){
    return request({
      url: "/rds/dict/select/"+id,
      method:"get",
      params:{}
    })
  },
  //获取配套-教育信息
  getMatchingEducation(obj){
    return request({
      url: "/dms/pt/school/list",
      method:"get",
      params:obj
    })
  },
  //获取配套-商业信息
  getMatchingBusiness(obj){
    return request({
      url: "/dms/pt/shop/list",
      method:"get",
      params:obj
    })
  },
  //获取配套-交通信息
  getMatchingTraffic(code,obj){
    return request({
      url: "/dms/pt/traffic/"+code+"/list",
      method:"get",
      params:obj
    })
  },
  //获取配套-市政信息
  getMatchingResource(obj){
    return request({
      url: "dms/pt/resource/list",
      method:"get",
      params:obj
    })
  },
  //获取配套-自然信息
  getMatchingNatural(code,obj){
    return request({
      url: "/dms/pt/resource/"+code+"/list",
      method:"get",
      params:obj
    })
  },
  //获取配套-规划信息
  getMatchingPlan(code,obj){
    return request({
      url: "/dms/gh/"+code+"/list",
      method:"get",
      params:obj
    })
  },
  //根据字段获取字典
  getTypeDict(type){
    return request({
      url: "/rds/dict/select/"+type,
      method:"get",
      params:{}
    })
  },
  //获取市场-项目查询数据
  getMarketInfo(obj){
    return request({
      url: "/dms/sc/market/list",
      method:"get",
      params:obj
    })
  },
  //获取土地-宗地查询数据
  getLandInfo(obj){
    return request({
      url: "/dms/td/parcel/list",
      method:"get",
      params:obj
    })
  },
  //获取土地-控规土地
  getKGLandInfo(obj){
    return request({
      url: "/dms/td/regulatory/list",
      method:"get",
      params:obj
    })
  },
  //获取围栏内的配套poi
  getFencePoiList(obj){
    return request({
      url:"/dms/pt/query",
      method:"post",
      params:obj
    })
  },
};
export default dataqury;