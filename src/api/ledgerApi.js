import request from "@/utils/request";
//台账地图API
const ledger = {
  //获取台账列表
  getMyLedgers() {
    return request({
      url:"/lms/work/account/list",
      method:"get",
      params:{}
    })
  },
  //获取台账详情
  getMyLedgerDetail(id) {
    return request({
      url:"/lms/work/account/info/"+id,
      method:"get",
      params:{}
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
  //删除土地图片
  deleteLandImg(ids) {
    return request({
      url:"/sys/oss",
      method:"delete",
      params:ids
    })
  },
  //删除台账
  deleteLedger(id) {
    return request({
      url:"/lms/work/account/"+id,
      method:"delete",
      params:{}
    })
  },
  //导出台账
  exportLedger(ids) {
    return request({
      url:"/lms/work/account/export",
      method:"get",
      responseType:'blob',
      params:ids
    })
  },
  //下载模板
  downloadTemp() {
    return request({
      url:"/files/uploadFile/ledger.xlsx",
      method:"get",
      responseType:'blob',
      params:{}
    })
  },
  //台账信息新增
  ledgerSubUp(data) {
    return request({
      url:"/lms/work/account/save",
      method:"post",
      params:data
    })
  },
  //台账基础信息更新
  ledgerBaseUpdata(data) {
    return request({
      url:"/lms/work/account/update",
      method:"post",
      params:data
    })
  },
  //台账土地信息更新
  ledgerLandUpdata(data) {
    return request({
      url:"/lms/work/account/updateinfo",
      method:"post",
      params:data
    })
  },
  //台账土地信息新增
  ledgerLandCreat(data) {
    return request({
      url:"/lms/work/account/saveinfo",
      method:"post",
      params:data
    })
  },
  //
  //台账土地图片信息上传
  landImgUpload(data) {
    return request({
      url:"/lms/work/account/upload",
      method:"post",
      params:data,
    })
  },
  //获取月份段内的台账数据
  getMonthsLedData(range) {
    return request({
      url:"/lms/work/account/statistics",
      method:"post",
      params:range
    })
  },
};
export default ledger;