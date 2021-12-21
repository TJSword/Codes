import request from "@/utils/request";
const house = {
    getTable(form){
        return request({
            url:'/dms/sc/building/newhouse/countPage',
            method:"get",
            params:form
        })
    },
    getDict(type){
        return request({
            url:'/rds/dict/select/' + type,
            method:"get",
            params:{}
        })
    },
    getcountList(obj){
        return request({
            url:'/dms/sc/building/newhouse/count/classify',
            method:'get',
            params:obj
        })
    },
    getRegionnos(){
        return request({
            url:'sys/region/searchRegions?cityCode=510100',
            method:'get',
            params:{}
        })
    },
    getChartData(obj){
        return request({
            url:'/dms/sc/market/countChart',
            method:'get',
            params:obj
        })
    },
    getCountInfo(obj){
        return request({
            url:`/dms/sc/building/newhouse/count/info`,
            method:'get',
            params:obj
        })
    },
    getXSList(obj){
        return request({
            url:`/dms/sc/building/newhouse/count/info/sell`,
            method:'get',
            params:obj
        })
    },
    getXZList(obj){
        return request({
            url:`/dms/sc/building/newhouse/count/info/increased`,
            method:'get',
            params:obj
        })
    },
    getBasicInfo(id){
        return request({
            url:'/dms/sc/building/' + id,
            method:'get',
            params:{}
        })
    },
    getLandInfo(buildingId){
        return request({
            url:'/dms/td/parcel/list',
            method:'get',
            params:{
                buildingId
            }
        })
    },
    getLandInfoDetail(id){
        return request({
            url:'/lms/work/account/info/'+id,
            method:'get',
            params:{}
        })
    },
    //项目动态列表
    getProDynamic(obj){
        return request({
            url:'/dms/sc/building/dynamic/list',
            method:'get',
            params:obj
        })
    },
    getPresellInfo(id,form){
        return request({
            url:'/dms/sc/building/presell/' + id,
            method:'get',
            params:form
        })
    },
    getPresellList(){
        return request({
            url:'/dms/sc/building/presell/list',
            method:'get',
            params:{}
        })
    },
    getFloorInfo(id,from){
        return request({
            url:'/dms/sc/building/floor/' + id,
            method:'get',
            params:from
        })
    },
    getDoorList(buildingId){
        return request({
            url:'/dms/sc/building/door/list',
            method:'get',
            params:{
                buildingId
            }
        })
    },
    getGYCJList(form){
        return request({
            url:'/dms/sc/building/newhouse/count/classify',
            method:'get',
            params:form
        })
    },
    getTrendList(form){
        return request({
            url:'/dms/sc/building/newhouse/trend',
            method:'get',
            params:form
        })
    },
    getLaitudeInfo(form){
        return request({
            url:'/dms/sc/building/dimen/list',
            method:'get',
            params:form
        })
    },
    getEchartsInfo(form){
        return request({
            url:'/dms/sc/market/countChart/info',
            method:'get',
            params:form
        })
    },
    getDynamicInfo(id){
        return request({
            url:'/dms/sc/building/dynamic/' + id,
            method:'get',
            params:{}
        })
    },
    getProList(form){
        return request({
            url:'dms/sc/building/newhouse/search',
            method:'get',
            params:form
        })
    },
    getNewPresellList(form){
        return request({
            url:'/dms/sc/building/dynamic/presell',
            method:'get',
            params:form
        })
    },
    getProDynamicTotal(form){
        return request({
            url:'/dms/sc/building/dynamic/list',
            method:'get',
            params:form
        })
    },
    getPartNos(){
        return request({
            url:'/dms/dl/part/search?landCityno=510100',
            method:'get',
            params:{}
        })
    },
    //房产排行
    getHouseRank(form){
        return request({
            url:'/dms/sc/building/newhouse/rank',
            method:'get',
            params:{
                rankType:'1',
                // orderField
                ...form
            }
        })
    },
    //开发商排行
    getHouseDevRank(form){
        return request({
            url:'/dms/sc/building/newhouse/rank',
            method:'get',
            params:{
                rankType:'2',
                ...form
            }
        })
    },
    getGroupList(type,name){
        return request({
            url:'/lms/work/rangedefine/page',
            method:'get',
            params:{
                type,name
            }
        })
    },
    //新增接口
    addGroup(params){
        return request({
            url:'/lms/work/rangedefine',
            method:'post',
            params
        })
    },
    //删除分组
    deleteRange(id){
        return request({
            url:'/lms/work/rangedefine?id=' +id,
            method:'DELETE'
        })
    },
    updateRange(params){
        return request({
            url:'/lms/work/rangedefine',
            method:'PUT',
            params
        })
    },
    //保存参数
    saveParams(name,params){
        return request({
            url:'/lms/work/pivotparams',
            method:'post',
            params:{name,params}
        })
    },
    getParamsList(){
        return request({
            url:'/lms/work/pivotparams/search',
            method:'get',
            params:{}
        })
    },
    getParamsInfo(id){
        return request({
            url:'/lms/work/pivotparams/info/' + id,
            method:'get'
        })
    },
    getPerspective(params){
        return request({
            url:'/dms/sc/building/newhouse/pivottable',
            method:'get',
            params
        })
    },
    getRegionDetail(params){
        return request({
            url:'/dms/sc/building/newhouse/countBuildPage',
            method:'get',
            params
        })
    },
    getWDList(params){
        return request({
            url:'/dms/sc/building/newhouse/countBySize',
            method:'get',
            params
        })
    },
    getRangeList(type){
        return request({
            url:'/lms/work/rangedefine/search',
            method:'get',
            params:{
                type
            }
        })
    },
    getWDRegionInfo(params){
        return request({
            url:'/dms/sc/building/newhouse/countBySizeRegion',
            method:'get',
            params
        })
    },
    getWDRegionMapData(params){
        return request({
            url:'/dms/sc/building/newhouse/countBySizeRegionTotal',
            method:'get',
            params
        })
    },
    getWdRegionInfoTotal(params){
        return request({
            url:'/dms/sc/building/newhouse/countBySizeTotal',
            method:'get',
            params
        })
    },
    //获取竞品组列表
    getJPList(){
        return request({
            url:'/lms/work/group/list',
            method:'get',
            params:{
                groupType:'2'
            }
        })
    },
    //模糊查询竞品
    getJP(name){
        return request({
            url:'/dms/sc/building/searchList',
            method:'get',
            params:{
                name
            }
        })
    },
    //新增竞品组
    saveJPList(params){
        return request({
            url:'/lms/work/group',
            method:'post',
            params
        })
    },
    //修改竞品组
    updateJPList(params){
        return request({
            url:'/lms/work/group',
            method:'put',
            params
        })
    },
    //删除竞品组
    deleteJPGroup(id){
        return request({
            url:'/lms/work/group',
            method:'delete',
            params:{
                id
            }
        })
    },
    //竞品统计列表
    JPCompetitors(params){
        return request({
            url:'/lms/work/group/count/competitors',
            method:'get',
            params
        })
    },
    //获取房企组列表
    getFQList(){
        return request({
            url:'/lms/work/group/list',
            method:'get',
            params:{
                groupType:'1'
            }
        })
    },
    //新增房企组
    saveJPList(params){
        return request({
            url:'/lms/work/group',
            method:'post',
            params
        })
    },
    //模糊查询房企
    searchEnterprise(name){
        return request({
            url:'/dms/sc/building_enterprise/list',
            method:'get',
            params:{
                name
            }
        })
    },
    //房企查询
    getFQInfo(params){
        return request({
            url:'/dms/sc/building/newhouse/countEnterprise',
            method:'get',
            params
        })
    },
    //房企详情
    getFQDetail(params){
        return request({
            url:'/dms/sc/building/newhouse/countBuildByEnterprise',
            method:'get',
            params
        })
    },
    //项目排行
    getBuildRank(params){
        return request({
            url:'/dms/sc/building/newhouse/rankByBuild',
            method:'get',
            params
        })
    },
    //企业排行
    getEnterpriseRank(params){
        return request({
            url:'/dms/sc/building/newhouse/rankByEnterprise',
            method:'get',
            params
        })
    },
    //项目列表下拉
    getbuildingSelect(name){
        return request({
            url:'/dms/sc/building/buildingSelect',
            method:'get',
            params:{
                name
            }
        })
    },
    //单个竞品的客情
    getCustomerInfo(id){
        return request({
            url:'/dms/sc/building/hot/classify/' + id,
            method:'get',
            params:{}
        })
    }
  

}
export default house;