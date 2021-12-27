import request from "@/utils/request";
const market = {
    getDict(type){
        return request({
            url:'/sys/rds/dict/select/' + type,
            method:'get',
            params:{}
        })
    },
    getNewsList(form){
        return request({
            url:'/dms/sc/news/page',
            method:'get',
            params:form
        })
    },
}
export default market