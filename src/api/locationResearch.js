import request from "@/utils/request";
const locationResearch = {
    //台账列表
    getAccountList(){
        return request({
            url:'/lms/work/account/list',
            method:'get',
            params:{}
        })
    },
    //台账详情
    getAccountInfo(id){
        return request({
            url:'/lms/work/account/oh/' + id,
            method:'get',
            params:{}
        })
    },
    //创建定位清单
    createList(accountId){
        return request({
            url:'/lms/oh/inventorylocation',
            method:'post',
            params:{
                accountId  
            }
        })
    },
    //获取城市列表
    getCityList(){
        return request({
            url:'/sys/region/getList',
            method:'get',
            params:{}
        })
    },
    //添加模型
    addModel(data){
        return request({
            url:'/lms/oh/model',
            method:'post',
            params:data
        })
    },
    //获取模型列表
    getModelList(){
        return request({
            url:'/lms/oh/model/list',
            method:'get',
            params:{}
        })
    },
    //删除模型
    deleteModel(ids){
        return request({
            url:'/lms/oh/model',
            method:'delete',
            headers:{
                'content-type':'application/json'
            },
            params:ids
        })
    },
    //获取模型详情
    getModelInfo(id){
        return request({
            url:'/lms/oh/model/'+id,
            method:'get',
            params:{}
        })
    },
    //更新模型
    updateModel(data){
        return request({
            url:'/lms/oh/model',
            method:'put',
            data:data
        })
    },
    //更新定位清单
    updateList(data){
        return request({
            url:'/lms/oh/inventorylocation',
            method:'put',
            data:data
        })
    },
    getGoodsList(data){
        return request({
            url:'/lms/oh/common/cm',
            method:'get',
            params:data
        })
    },
    //竞品市场客户狗成
    getCustomerInfo(data){
        return request({
            url:'/lms/oh/common/custom/form',
            method:'get',
            params:data
        })
    },
    getGoodsDetail(data){
        return request({
            url:'/lms/oh/common/competitor/info',
            method:'get',
            params:data
        })
    },
    saveGoods(data){
        return request({
            url:'/lms/oh/common/save/competitors',
            method:'get',
            params:data
        })
    },
    getHxpb(locationId){
        return request({
            url:'/lms/oh/common/getCompetitors',
            method:'get',
            params:{
                locationId
            }
        })
    },
    computedPrice(data){
        return request({
            url:'/lms/oh/common/calPrice',
            method:'post',
            params:data
        })
    },
    getCycle(locationId){
        return request({
            url:'/lms/oh/common/cps',
            method:'get',
            params:{
                locationId
            }
        })
    },
    saveCost(data){
        return request({
            url:'/lms/oh/cost',
            method:'post',
            params:data
        })
    },
    getGoosListByLocation(locationId){
        return request({
            url:'/lms/oh/common/search',
            method:'get',
            params:{
                locationId
            }
        })
    },
    //市场可分容量
    getFinalList(data){
        return request({
            url:'/lms/oh/common/finalList',
            method:'get',
            params:data
        })
    },
    //修改户型配比
    upDateDoorRatio(data){
        return request({
            url:'/lms/oh/doorratio',
            method:'post',
            params:data
        })
    },
    //查坤定位清单下的成本
    getCost(locationId){
        return request({
            url:'/lms/oh/cost/search',
            method:'get',
            params:{
                locationId
            }
        })
    },
    //字典
    getCommonDict(){
        return request({
            url:'/lms/oh/common/getDict',
            method:'get',
            params:{
                type:'pt_level'
            }
        })
    },
    //自建配套配置保存
    savePt(data){
        return request({
            url:'/lms/oh/ptdefine',
            method:'post',
            params:data
        })
    },
    //获取自建配套
    getPt(locationId){
        return request({
            url:'/lms/oh/ptdefine/search/' + locationId,
            method:'get',
            params:{}
        })
    },
    //获取精装列表
    getJZlist(locationId){
        return request({
            url:'/lms/oh/evaluatejz/search',
            method:'get',
            params:{
                locationId
            }
        })
    },
    saveJz(data){
        return request({
            url:'/lms/oh/hardcoverlog',
            method:'post',
            params:data
        })
    },
    //获取园林列表
    getYlList(locationId){
        return request({
            url:'/lms/oh/evaluatepark/select',
            method:'get',
            params:{
                locationId
            }
        })
    },
    saveYl(data){
        return request({
            url:'/lms/oh/hardcoverlog/park/save',
            method:'post',
            params:data
        })
    },
    //获取户型评测列表
    getHxpc(locationId){
        return request({
            url:'/lms/oh/doorratio/doorList',
            method:'get',
            params:{
                locationId
            }
        })
    },
    //获取定位清单point点数据
    getPointInfo(data){
        return request({
            url:'/lms/oh/buildmatching/match',
            method:'get',
            params:data
        })
    },
    saveHxpb(data){
        return request({
            url:'/lms/oh/hardcoverlog/door/save',
            method:'post',
            params:data
        })
    },
    //逆向逻辑
    change(data){
        return request({
            url:'/lms/oh/competitors/change',
            method:'put',
            data:data
        })
    },
    //本项目基本信息
    getInfo(locationId){
        return request({
            url:'/lms/oh/competitors/info',
            method:'get',
            params:{
                locationId
            }
        })
    },
    getHPInfo(locationId){
        return request({
            url:'/lms/oh/doorratio/search',
            method:'get',
            params:{
                locationId
            }
        })
    },
    //建筑形态字典
    getBuildFormDict(){
        return request({
            url:'/lms/oh/common/getDict',
            method:'get',
            params:{
                type:'build_form'
            }
        })
    },
    //客户模型接口
    getFinalCusom(locationId){
        return request({
            url:'/lms/oh/common/final/custom',
            method:'get',
            params:{
                locationId
            }
        })
    },
    //搜索竞品 模糊搜索
    getSearching(name){
        return request({
            url:'/lms/oh/common/searching',
            method:'get',
            params:{
                name
            }
        })
    },
    //获取竞品信息
    getGoodsInfo(id){
        return request({
            url:'/lms/oh/common/searching/'+id,
            method:'get',
            params:{}
        })
    },
    //保存定位清单
    saveList(data){
        return request({
            url:'/lms/oh/inventorylocation',
            method:'put',
            data:data
        })
    },
    //获取清单列表
    getLocationList(){
        return request({
            url:'/lms/oh/inventorylocation/select',
            method:'get',
            params:{}
        })
    }
}
export default locationResearch;