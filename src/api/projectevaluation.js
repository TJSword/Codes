import request from "@/utils/request";
//项目测评API
const projectevaluation = {
     getTypeDict(type){
        return request({
          url: "/rds/dict/select/"+type,
          method:"get",
          params:{}
        })
      },
    getRegion(){
        return request({
            url:"/dl/region/regionnos",
            method:'get'
        })
    },
    getTag(value){
        return request({
            url:"/fms/alk/tag/list",
            method:'get',
            params:{
                topLabel:value
            }
        })
    },
    getList(obj){
        return request({
            url:"/dms/sc/building/list",
            method:"get",
            params:{
                tags:obj.tags,
                code:obj.code,
                topLabel:obj.topLabel,
                buildForms:obj.buildForms,
                regionnos:obj.regionnos,
                name:obj.name,
                page:obj.page,
                limit:obj.limit
            }
        })
    },
    getjcgk(id){
        return request({
            url:'/dms/sc/building/info',
            method:'get',
            params:{
                id
            }
        })
    },
    getTags(id){
        return request({
            url:'/fms/alk/tag/lists',
            method:'get',
            params:{
                id:id
            }
        })
    },
    getComment(id){
        return request({
            url:'/fms/alk/comment/list',
            method:'get',
            params:{
                id
            }
        })
    },
    addTag(obj){
        return request({
            url:'/fms/alk/tag',
            method:'post',
            params:{
                code:obj.code,
                pcode:obj.pcode,
                tag:obj.tag,
                objId:obj.objId
            }
        })
    },
    submitComment(obj){
        return request({
            url:'/fms/alk/comment',
            method:'post',
            params:{
                topicId:obj.topicId,
                content:obj.content,
                isReply:obj.isReply,
                pid:obj.pid
            }
        })
    },
    getLand(id){
        return request({
            url:'/dms/td/parcel/info/' + id,
            method:'get',
            params:{}
        })
    },
    dianZan(obj){
        return request({
            url:'/fms/alk/operation/like',
            method:'post',
            params:{
                objId:obj.id,
                likeFlag:obj.likeFlag,
                classifyCode:obj.classifyCode
            }
        })
    },
    getPlanningData(id){
        return request({
            url:'/fms/alk/buildinggh/info',
            method:'get',
            params:{
                id
            }
        })
    },
    getCorrelation(id){
        return request({
            url:'/fms/alk/note/list',
            method:'get',
            params:{
                id:id
            }
        })
    }
}
export default projectevaluation