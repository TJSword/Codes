import request from "@/utils/request";

const LandReport = {
    //获取竞品物业类型
    getCdPropertyList(){
        return request({
            url:"/rds/dict/build",
            method:"get",
            params:{}
        })
    },
    //获取预选竞品数据
    getCDList(id){
        return request({
            url:"/lms/tdky/competitor/select/"+id,
            method:"get",
            params:{}
        })
    },
     //获取项目保存竞品信息
     getCDinfos(obj){
        return request({
            url:"/lms/tdky/competitor/list",
            method:"get",
            params:obj
        })
    },
    //获取项目保存竞品信息(分业态)
    getCDinfosByproperty(obj){
        return request({
            url:"/lms/tdky/competitor/format/pricelist",
            method:"get",
            params:obj
        })
    },
    //获取竞品物业类型
    getCDProperty(id){
        return request({
            url:"/lms/tdky/competitor/format/list?reportId="+id,
            method:"get",
            params:{}
        })
    },
    //保存选择的竞品
    saveCd(arr){
        return request({
            url:"/lms/tdky/competitor",
            method:"post",
            params:arr
        })
    },
    //删除选择的竞品
    delCd(arr){
        return request({
            url:"/lms/tdky/competitor",
            method:"delete",
            params:arr
        })
    },
    //保存竞品物业类型
    saveCdProperties(arr){
        return request({
            url:"/lms/tdky/competitor/format",
            method:"post",
            params:arr
        })
    },
    //项目精品去化、销量
    projectCdqh(obj){
        return request({
            url:"/lms/tdky/competitor/decon",
            method:"get",
            params:obj
        })
    },
    //所有竞品去存信息
    getCdqcinfo(obj){
        return request({
            url:"/lms/tdky/competitor/decon",
            method:"get",
            params:obj
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
    //查询报告保存的户型配比
    getReportHouseRatio(obj){
        return request({
            url: "/lms/tdky/competitor/ratio/"+obj.reportId+"/"+obj.type,
            method:"get",
            params:{}
        })
    },
    //保存户型配比
    saveReportRatio(id,arr){
        return request({
            url: "/lms/tdky/competitor/ratio?reportId="+id,
            method:"post",
            params:arr
        })
    },
    //价格测算指标权重信息
    getPriceFittingList(obj){
        return request({
            url: "/lms/tdky/competitor/model/"+obj.reportId+"/"+obj.type,
            method:"get",
            params:{}
        })
    },
    //价格测算指标权重信息上传
    uploadPriceFitting(obj,data){
        return request({
            url: "/lms/tdky/competitor/model?reportId="+obj.reportId+'&type='+obj.type,
            method:"post",
            params:data
        })
    },
    //价格测算指标+竞品点地评分数据
    getPriceFittingCdInfos(reportId,type){
        return request({
            url: "/lms/tdky/competitor/model/lands/"+reportId+'/'+type,
            method:"get",
            params:{}
        })
    },
    //价格拟合分值保存
    uploadFittingInfo(obj){
        return request({
            url: "/lms/tdky/competitor/score",
            method:"post",
            params:obj
        })
    },

    //新增统计图表

    //根据字段获取字典
    getTypeDict(type){
        return request({
        url: "/rds/dict/select/"+type,
        method:"get",
        params:{}
        })
    },
    //根据报告ID获取台账数据
    getLedgerInfoByReportId(reportId){
        return request({
            url: "/lms/work/account/view/"+reportId,
            method:"get",
            params:{}
        })
    },
    //柱状图+折线图（横坐标年份，纵坐标值和增速的）
    columnarLineChart(obj,apiUrl){
        return request({
            url: apiUrl?apiUrl:"/dms/jj/fdc/chart/common",
            method:"get",
            params:obj
        })
    },
    //通用图表接口
    commonChart(obj,apiUrl){
        return request({
            url: apiUrl,
            method:"get",
            params:obj
        })
    },

    //新增地图

    //土地市场-地图数据
    getMapLandData(obj){
        return request({
            url: '/dms/td/parcel/mapByRegion',
            method:"get",
            params:obj
        })
    },
    //商品房市场-地图数据
    getMapMarketData(obj){
        return request({
            url: '/dms/sc/market/mapByRegion',
            method:"get",
            params:obj
        })
    },
    //商品房市场-排行榜
    getMapMarketRank(obj){
        return request({
            url: '/dms/sc/market/rank',
            method:"get",
            params:obj
        })
    },
}
export default LandReport;