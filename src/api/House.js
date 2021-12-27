import request from "@/utils/request";
const house = {
    getTable(form){
        return request({
            url:'/dms/sc/market/countList',
            method:"get",
            params:form
        })
    },
    getDict(type){
        return request({
            url:'/sys/rds/dict/select/' + type,
            method:"get",
            params:{}
        })
    },
    getcountList(obj){
        return request({
            url:'/dms/sc/market/countList/' + obj.regionno,
            method:'get',
            params:obj
        })
    },
    getRegionnos(){
        return request({
            url:'/dl/region/regionnos',
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
            url:`/dms/sc/market/countList/${obj.regionno}/info`,
            method:'get',
            params:obj
        })
    },
    getBasicInfo(id){
        return request({
            url:'/dms/sc/building/info/' + id,
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
            url:'/dms/td/parcel/'+id,
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
            url:'/dms/sc/building/gycj/list',
            method:'get',
            params:form
        })
    },
    getTrendList(form){
        return request({
            url:'/dms/sc/building/trend/list',
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
            url:'/dms/sc/building/list',
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
            url:'/dms/dl/part/partnos',
            method:'get',
            params:{}
        })
    },
    //房产排行
    getHouseRank(column){
        return request({
            url:'/dms/sc/market/rank',
            method:'get',
            params:{
                column
            }
        })
    },
    //开发商排行
    getHouseDevRank(column){
        return request({
            url:'/dms/sc/market/devRank',
            method:'get',
            params:{
                column
            }
        })
    }
}
export default house;