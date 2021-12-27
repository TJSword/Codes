import request from "@/utils/request";
const land = {
    getDict(type){
        return request({
            url:'/sys/rds/dict/select/' + type,
            method:'get',
            params:{}
        })
    },
    getRegionnos(){
        return request({
            url:'/dl/region/regionnos',
            method:'get',
            params:{}
        })
    },
    getParcelList(form){
        return request({
            url:'/dms/td/parcel/list',
            method:'get',
            params:form
        })
    },
    getParcelInfo(id){
        return request({
            url:'/dms/td/parcel/detail/' + id,
            method:'get',
            params:{}
        })
    },
    getViewList(form){
        return request({
            url:'/dms/td/parcel/view/list',
            method:'get',
            params:form
        })
    },
    getQuyuList(form){
        return request({
            url:'/dms/td/parcel/area/list',
            method:'get',
            params:form
        })
    },
    getGongyingList(form){
        return request({
            url:'/dms/td/parcel/list',
            method:'get',
            params:form
        })
    },
    getChartDetail(form){
        return request({
            url:'/dms/td/parcel/chart',
            method:'get',
            params:form
        })
    },
    getEchartsInfo(form){
        return request({
            url:'/dms/td/parcel/chart/info',
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
    //行政区板块字典
    getRegionList(){
        return request({
            url:'/dl/region/530100/list',
            method:'get',
            params:{}
        })
    },
    //土地成交排行
    getLandRank(column){
        return request({
            url:'/dms/td/parcel/rank',
            method:'get',
            params:{
                column
            }
        })
    },
    //土地企业排行
    getLandCompanyRank(column){
        return request({
            url:'/dms/td/parcel/rank/developer',
            method:'get',
            params:{
                column
            }
        })
    }
}
export default land