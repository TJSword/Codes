import request from "@/utils/request";
//台账地图API
const ledger = {
  //获取用户操作日志
  getUserLogs(){
    return request({
      url:"/lms/work/account/infolog",
      method:"get",
      params:{}
    })
  },
  //获取台账列表
  getMyLedgers(data) {
    return request({
      url:"/lms/work/account/list",
      method:"post",
      params:data
    })
  },
  //获取分页土地
  getPageLands(data){
    return request({
      url:"/lms/work/account/page",
      method:"post",
      params:data
    })
  },
  //获取文件夹下土地数据
  searchLandChild(data){
    return request({
      url:"/lms/work/account/landchild",
      method:"get",
      params:data
    })
  },
  //查询土地接口
  searchLands(data){
    return request({
      url:"/lms/work/account/landsearch",
      method:"post",
      params:data
    })
  },
  //获取文件夹树结构
  getLandTree(obj){
    return request({
      url:"/lms/work/account/tree",
      method:"get",
      params:obj
    })
  },
  //获取公共土地数据
  getGovLandData(obj){
    return request({
      url:"/lms/work/account/openlist",
      method:"get",
      params:obj
    })
  },
  //获取土地详细数据
  getMyLedgerDetail(id) {
    return request({
      url:"/lms/work/account/info/"+id,
      method:"get",
      params:{}
    })
  },
  //土地详情查看次数统计
  statisLandInfo(id){
    return request({
      url:"/lms/work/account/scan/"+id,
      method:"get",
      params:{}
    })
  },
  //删除地块
  delLand(id) {
    return request({
      url:"/lms/work/account/info/"+id,
      method:"delete",
      params:{}
    })
  },
  //批量删除地块（纯土地）
  batchDelLand(idArr) {
    return request({
      url:"/lms/work/account/infos",
      method:"delete",
      params:idArr
    })
  },
  //批量删除地块及文件夹
  deleteFolderLand(data) {
    return request({
      url:"/lms/work/account/delete",
      method:"post",
      params:data
    })
  },
  //批量导出地块校验
  batchExpLandCheck(obj) {
    return request({
      url:"/lms/work/account/infoexport/check",
      method:"post",
      params:obj
    })
  },
  //批量导出地块
  batchExpLand(obj) {
    return request({
      url:"/lms/work/account/infoexport",
      method:"post",
      responseType:'arraybuffer',
      params:obj
    })
  },
  //导出官方csv
  exportGovCsv(obj) {
    return request({
      url:"/lms/work/account/ovexport",
      method:"post",
      params:obj
    })
  },
  //添加到个人土地
  addToselfLand(data) {
    return request({
      url:"/lms/work/account/operate",
      method:"post",
      params:data
    })
  },
  //导出土地全字段数据（管理员用）
  govExpLand(obj){
    return request({
      url:"/lms/work/account/govexport",
      method:"post",
      responseType:'arraybuffer',
      params:obj
    })
  },
  //地块移出分组
  remLand(id) {
    return request({
      url:"/lms/work/account/unlock/"+id,
      method:"get",
      params:{}
    })
  },
  //地块分组
  groupLands(obj) {
    return request({
      url:"/lms/work/account/group",
      method:"post",
      params:obj
    })
  },
  
  //获取字典
  getTypeDict(type){
    return request({
      url: "/rds/dict/select/"+type,
      method:"get",
      params:{}
    })
  },
  //获取字典(树形)
  getTypeDictTree(type){
    return request({
      url: "/rds/dict/tree/"+type,
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
  //解除分组
  unLandgroup(id) {
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
  //台账土地信息新增、更新
  ledgerLandCreat(obj,modifyMode) {
    return request({
      url:modifyMode?"/lms/work/account/updateinfo":"/lms/work/account/saveinfo",
      method:'post',
      params:obj
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
  //查询用户台账数据
  getUserLedgerData() {
    return request({
      url:"/lms/work/account/statistics",
      method:"get",
      params:{}
    })
  },
  //查询围栏内多图层poi
  getEnclosurePoi(obj) {
    return request({
      url:"/dms/pt/query/click",
      method:"post",
      params:obj
    })
  },
  //查询围栏内的市场土地人口数据
  getEnclosureInfo(obj) {
    return request({
      url:"/dms/pt/query/statistics",
      method:"post",
      params:obj
    })
  },
  //点地评分
  getLandScore(coor){ 
    return request({
      url:"/lms/clickland?coordinates="+coor,
      method:"post",
      params:{}
    })
  },
  //楼盘市场数据年份统计
  getMarketYearsInfo(obj){ 
    return request({
      url:"/dms/sc/market/statistics",
      method:"get",
      params:obj
    })
  },
  //查询已上传控规
  getControlImg(obj){
    return request({
      url:"/lms/work/toolimgmap",
      method:"get",
      params:obj
    })
  },
  //删除控规
  deleteControlImg(idArr){
    return request({
      url:"/lms/work/toolimgmap",
      method:"delete",
      params:idArr
    })
  },
  //控规图图片及数据提交
  controlImgUpload(obj){
    return request({
      url:"/lms/work/toolimgmap",
      method:"post",
      params:obj
    })
  },
  //更新规划图坐标
  updateControlImg(obj){
    return request({
      url:"/lms/work/toolimgmap/update",
      method:"post",
      params:obj
    })
  },
  //土地留言提交
  subLandMessage(info){
    return request({
      url:"/lms/work/blog/save",
      method:"post",
      params:info
    })
  },
  //土地留言列表
  getLandMessageList(obj){
    return request({
      url:"/lms/work/blog/page",
      method:"get",
      params:obj
    })
  },
  //删除土地留言
  deleteLandMessage(idArr){
    return request({
      url:"/lms/work/blog",
      method:"delete",
      params:idArr
    })
  },
  //图片上传
  fileUploads(data){
    return request({
      url:"/sys/oss/upload",
      method:"post",
      params:data
    })
  },
  //CAD文件上传
  cadFileUploads(data){
    return request({
      url:"/manager/document/regulate/uploadLocal",
      method:"post",
      params:data
    })
  },
  //参拍企业模板下载
  getModuleCompany(){
    return request({
      url:"/lms/tdtz/company/exportTemplate",
      method:"get",
      responseType:'blob',
      params:{}
    })
  },
  //企业出价记录模板下载
  getModuleBidHistory(){
    return request({
      url:"/lms/tdtz/companyoffer/exportTemplate",
      method:"get",
      responseType:'blob',
      params:{}
    })
  },
  //文件上传
  fileDownload(id){
    return request({
      url:"/sys/oss/download/"+id,
      method:"get",
      params:{}
    })
  },
  //文章评论列表，page为页码ID，默认一页10条数据
  getArticleComments(id,page){
    return request({
      url:"/lms/work/discuss/page/"+id,
      method:"get",
      params:{}
    })
  },
  //提交文章评论
  subArticleComment(data){
    return request({
      url:"lms/work/discuss/save",
      method:"post",
      params:data
    })
  },

  //文件上传导入
  dataFileImport(data,url){
    return request({
      url:'/lms/work/account/'+url,
      method:'post',
      params:data
    })
  },
  //文件导入历史
  dataFIleList(type){
    return request({
      url:'/sys/oss/list/'+type,
      method:'get',
      params:{}
    })
  },
  //删除导入文件中的土地数据
  delFileLands(id){
    return request({
      url:'/lms/work/account/infoByOss/'+id,
      method:'delete',
      params:{}
    })
  },
  //删除土地文件
  delLandFiles(ids){
    return request({
      url:'/sys/oss',
      method:'delete',
      params:ids
    })
  },
  //下载土地文件
  downLandFiles(id){
    return request({
      url:'/sys/oss/download/'+id,
      method:'get',
      responseType:'blob',
      params:{}
    })
  },

  // ** 自定义板块 ** //
  
  //自定义板块保存
  saveCustomPlate(data){
    return request({
      url:'/lms/dl/customize',
      method:'post',
      params:data
    })
  },
  //查询自定义板块
  getCustomPlate(obj){
    return request({
      url:'/lms/dl/customize/list',
      method:'get',
      params:obj
    })
  },
  //修改自定义板块
  modifyCustomPlate(data){
    return request({
      url:'/lms/dl/customize',
      method:'put',
      params:data
    })
  },
  //删除自定义板块
  deleteCustomPlate(ids){
    return request({
      url:'/lms/dl/customize',
      method:'delete',
      params:ids
    })
  },

  //用户土地标签
  getUserLandLabels(){
    return request({
      url:'/lms/work/label',
      method:'get',
      params:{}
    })
  },
  //提交土地标签
  saveUserLandLabel(data){
    return request({
      url:'/lms/work/label',
      method:'post',
      params:data
    })
  },
  //删除土地标签
  delUserLandLabels(ids){
    return request({
      url:'/lms/work/label',
      method:'delete',
      params:ids
    })
  },

  //获取点击地图位置所在的区
  getSiteRegionno(obj){
    return request({
      url:'/sys/region/getRegion',
      method:'get',
      params:obj
    })
  },

  //根据条件获取所有土地点跟ID
  getAllLands(data){
    return request({
      url:'/lms/work/account/landlist',
      method:'post',
      params:data
    })
  },
  //获取土地ID获取土地轮廓数据
  getIdlandsInfo(data){
    return request({
      url:'/lms/work/account/landinfos',
      method:'post',
      params:data
    })
  },
  //获取城区下面的年份数组
  getRegionYears(obj){
    return request({
      url:'/lms/work/account/year',
      method:'get',
      params:obj
    })
  },
  //根据城市获取特定顺序的行政区(含土地数量)
  getRegionByCity(obj){
    return request({
      url:'/sys/region/regions',
      method:'get',
      params:obj
    })
  },
  //获取区县市
  getRegions(obj){
    return request({
      url:'/sys/region/searchRegions',
      method:'get',
      params:obj
    })
  },
  //获取好友分享的土地
  getFriendLand(obj){
    return request({
      url:'/lms/work/account/share/query',
      method:'get',
      params:obj
    })
  },
  //获取公共土地一级目录土地数量统计
  getGovLandNum(obj){
    return request({
      url:'/lms/work/account/countByState',
      method:'get',
      params:obj
    })
  },
  //获取省城市土地数量
  getLandAccount(obj){
    return request({
      url:'/lms/work/account/countBy',
      method:'get',
      params:obj
    })
  },
  //获取mvt数据
  getMvt(){
    return request({
      url:'/dms/pt/traffic/road_l/section',
      method:'get',
      params:{}
    })
  },

  //CAD文件导入
  CADImport(data){
    return request({
      url:'/lms/work/toolimgmap/handlecad',
      method:'post',
      params:data
    })
  },
  //获取cad图形列表
  getCADList(id){
    return request({
      url:'/lms/work/toolimgmap/elemlist/'+id,
      method:'get',
      params:{}
    })
  },
  //删除cad文件及数据
  delCadFile(id){
    return request({
      url:'/lms/work/toolimgmap/cad?fid='+id,
      method:'delete',
      params:{}
    })
  },
  //获取分享口令
  getSecretKey(){
    return request({
      url:'/lms/work/toolimgmap/command',
      method:'get',
      params:{}
    })
  },
  //添加分享口令
  addShareSecret(obj){
    return request({
      url:'/lms/work/toolimgmap/command/use',
      method:'get',
      params:obj
    })
  },
  //获取官方土地标签
  getGovLandLabel(){
    return request({
      url:'/lms/work/label/gov/list',
      method:'get',
      params:{}
    })
  },
  //导出配套数据CSV
  exportMtCsv(obj){
    return request({
      url:'/lms/work/account/export/pt',
      method:'post',
      params:obj
    })
  },
};
export default ledger;