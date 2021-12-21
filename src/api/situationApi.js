import request from "@/utils/request";
const situation = {
    //获取行政区列表
    getRegions(){
        return request({
            url:"/sys/region/searchRegions",
            method:"get",
            params:{
                cityCode:'510100'
            }
        })
    },
    //获取板块列表
    getParts(){
        return request({
            url:'/dms/dl/part/search',
            method:'get',
            params:{
                cityCode:'510100'
            }
        })
    },
    //获取面积段
    getAreaSize(){
        return request({
            url:'/rds/dict/select/area_size_newhouse' ,
            method:"get",
            params:{}
        })
    },
    //获取板块用户指数
    getPartHotList(cityCode,code,areaSizes){
        return request({
            url:'/dms/sc/building/part/hotlist',
            method:'get',
            params:{
                code,areaSizes,
                cityCode:'510100'
            }
        })
    },
    //板块详情
    getHotDetail(params){
        return request({
            url:'/dms/sc/building/hot/zone/info',
            method:'get',
            params
        })
    },
    //获取楼盘详情
    getbuildingInfo(id){
        return request({
            url:'/dms/sc/building/' + id,
            method:'get',
            params:{}
        })
    },
    //字典
    getDict(type){
        return request({
            url:'/rds/dict/select/' + type,
            method:"get",
            params:{}
        })
    },
    //开发商
    getDevloper(){
        return request({
            url:'/dms/sc/building/developers',
            method:'get',
            params:{}
        })
    },
    //楼板列表
    getBuilding(params){
        return request({
            url:'/dms/sc/building/gft/list',
            method:'get',
            params
        })
    },
    //竞对项目 in，用户通路  out
    getCompetitor(params){
        return request({
            url:'/dms/sc/building/competitor',
            method:'get',
            params
        })
    },
    //
    getRangeList(type){
        return request({
            url:'/lms/work/rangedefine/search',
            method:'get',
            params:{
                type
            }
        })
    },
    //竞品客情
    getGoodsRangeList(params){
        return request({
            url:'/dms/sc/building/hot/builds',
            method:'get',
            params
        })
    },
    //区域详情
    getAreaRangeList(params){
        return request({
            url:'/dms/sc/building/hot/zone',
            method:'get',
            params
        })
    },
    //区域下面的项目坐标
    getAreaBuilding(params){
        return request({
            url:'/dms/sc/building/search/buildingRateList',
            method:'get',
            params
        })
    },
    getBasicInfo(id){
        return request({
            url:'/dms/sc/building/' + id,
            method:'get',
            params:{}
        })
    },

}
export default situation