import request from "@/utils/request";
//分析工具
const analysistools = {
  //根据字段获取字典
  getTypeDict(type){
    return request({
      url: "/rds/dict/select/"+type,
      method:"get",
      params:{}
    })
  },
  //多维矩阵
  getGradeList(obj) { //获取矩阵评分列表
    return request({
      url: "/lms/eval/item/list",
      method: "get",
      params:obj
    });
  },
  getUserTag() { //获取Gebo用户保存标签
    return request({
      url: "/lms/gebo/matrix",
      method: "get",
      params:{}
    });
  },
  getUserTagInfo(id) { //请求gebo历史数据
    return request({
      url: "/lms/gebo/matrix/info/"+id,
      method: "get",
      params:{}
    });
  },
  delUserTag(id) { //删除Gebo用户保存标签
    return request({
      url: "/lms/gebo/matrix/"+id,
      method: "delete",
      params:{}
    });
  },
  getSaveGeboData(obj) { //生成并保存gebo的数据
    return request({
      url: "/lms/gebo/matrix/search",
      method: "post",
      params:obj
    });
  },
  //通用评分
  getQuota(obj) { //指标数据
    return request({
      url: "/lms/eval/item/list",
      method: "get",
      params:obj
    });
  },
  getQuotaSCore(obj){ //获取板块评分
    return request({
      url:'/lms/eval/score/itemlist',
      method:'get',
      params:obj
    })
  },
  getCommonQuota(){ //获取常用指标列表
    return request({
      url:'/lms/eval/click/list',
      method:'get',
      params:{}
    })
  },

  //自定义评分
  saveSelectGrade(obj){ //保存选择的评分项
    return request({
      url:'/lms/eval/weighter',
      method:'post',
      params:obj
    })
  },
  coputedGrad(obj){ //计算板块得分
    return request({
      url:'/lms/eval/score/compute',
      method:'post',
      params:obj
    })
  },
  coputedGradById(id){ //根据id计算板块得分
    return request({
      url:'/lms/eval/score/computeinfo/'+id,
      method:'get',
      params:{}
    })
  },
  getUserGradeList(){ //获取用户保存的评分列表
    return request({
      url:'/lms/eval/weighter/list',
      method:'get',
      params:{}
    })
  },
  getGradeDetails(id){ //获取用户保存的评分项
    return request({
      url:'/lms/eval/weighter/weights/'+id,
      method:'get',
      params:{}
    })
  },
  getPlatesGrade(obj){ //获取板块评分
    return request({
      url:'/lms/eval/weighter',
      method:'get',
      params:obj
    })
  },
  deleteGrade(id){ //删除用户评分
    return request({
      url:'/lms/eval/weighter/'+id,
      method:'delete',
      obj:{}
    })

  },
  
  //条件分析
  getConditionMinMax(obj){ //获取条件最大值最小值
    return request({
      url:'/lms/analysis/maxmin',
      method:'post',
      params:obj
    })
  },
  getFilterPlates(arr) { //获取符合指标的版块列表
    return request({
      url:"/lms/analysis/search",
      method:"post",
      params:arr
    })
  },
  saveFilters(obj) { //保存分析
    return request({
      url:"/lms/analysis",
      method:"post",
      params:obj
    })
  },
  getUserFilters() { //请求用户保存分析列表
    return request({
      url:"/lms/analysis",
      method:"get",
      params:{}
    })
  },
  getFilterCondition(id) { //请求分析条件
    return request({
      url:"/lms/analysis/condition/"+id,
      method:"get",
      params:{}
    })
  },
  getFilterData(id) { //请求分析数据
    return request({
      url:"/lms/analysis/data/"+id,
      method:"get",
      params:{}
    })
  },
  deleteUserFilter(id) { //删除历史分析
    return request({
      url:"/lms/analysis/"+id,
      method:"delete",
      params:{}
    })
  },
  //点地评分
  getLandScore(coor){ //点地评分
    return request({
      url:"/lms/clickland?coordinates="+coor,
      method:"post",
      params:{}
    })
  },
  getLandScoreList(){ //点地评分项
    return request({
      url:"/lms/eval/item/list?type=clickland",
      method:"get",
      params:{}
    })
  }
};
export default analysistools;