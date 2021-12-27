import request from "@/utils/request";

const LandReport = {
    //请求大纲列表
    getOutlineList() {
        return request({
            url: "/lms/tdky/modelcommon/drop",
            method: "get",
            params: {}
        })
    },
    //获取台账列表
    getMyLedgers() {
        return request({
            url: "/lms/work/account/list",
            method: "get",
            params: {}
        })
    },
    //获取大纲详情
    getOutlineInfo(obj) {
        return request({
            url: '/lms/tdky/modelcommon/modelTree',
            method: 'get',
            params: obj
        })
    },
    //创建报告
    createReport(obj) {
        return request({
            url: '/lms/tdky/report',
            method: 'post',
            params: obj
        })
    },
    //获取图库
    getPicData() {
        return request({
            url: '/lms/tdky/usematerial/list',
            method: 'get',
            params: {}
        })
    },
    //获取编辑报告中的大纲
    getOutlineDetail(id) {
        return request({
            url: '/lms/tdky/reportinfo/tree',
            method: 'get',
            params: {
                reportId: id
            }
        })
    },
    //修改大纲
    upDateOutline(tree, deletedIds) {
        return request({
            url: '/lms/tdky/reportinfo/modify',
            method: 'post',
            params: {
                tree,
                deletedIds
            }
        })
    },
    //新增报告内容
    saveReportInfo(reportId, pid, reports) {
        return request({
            url: '/lms/tdky/reportinfo',
            method: 'post',
            params: {
                pid,
                reportId,
                reports

            }
        })
    },
    //获取报告内容
    getReportInfo(pid, reportId) {
        return request({
            url: '/lms/tdky/reportinfo/info',
            method: 'get',
            params: {
                pid,
                reportId
            }
        })
    },
    //新增大纲节点
    addNode(obj) {
        return request({
            url: '/lms/tdky/reportinfo/nodeSave',
            method: 'post',
            params: obj
        })
    },
    //删除大纲节点
    deleteNode(tid) {
        return request({
            url: '/lms/tdky/reportinfo/delete',
            method: 'post',
            params: {
                tid
            }
        })
    },
    //修改接口
    updateNode(obj) {
        return request({
            url: '/lms/tdky/reportinfo/update',
            method: 'post',
            params: obj
        })
    },
    //大纲另存为
    saveOutLine(obj) {
        return request({
            url: '/lms/tdky/model/saveAs',
            method: 'post',
            params: obj
        })
    },
    //请求编辑备注列表
    getRemarkList(reportId, pid) {
        return request({
            url: '/lms/tdky/reportinfo/remark/list',
            method: 'get',
            params: {
                reportId,
                pid,
            }
        })
    },
    //添加备注
    addRemark(reportId, pid, remark) {
        return request({
            url: '/lms/tdky/reportinfo/remark/save',
            method: 'post',
            params: {
                reportId,
                pid,
                remark
            }
        })
    },
    //修改备注
    updateRemark(tid, remark) {
        return request({
            url: '/lms/tdky/reportinfo/remark/update',
            method: 'post',
            params: {
                tid,
                remark
            }
        })
    },
    //删除备注
    deleteRemark(tid) {
        return request({
            url: '/lms/tdky/reportinfo/delete',
            method: 'post',
            params: {
                tid
            }
        })
    },
    //获取报告列表
    getReportsList() {
        return request({
            url: '/lms/tdky/report/list',
            method: 'get',
            params: {}
        })
    },
    //报告拷贝
    copyReport(obj){
        return request({
            url: '/lms/tdky/report/copy',
            method: 'get',
            params: obj
        })
    },
    //删除报告
    deleteReports(arr) {
        return request({
            url: '/lms/tdky/report/delete',
            method: 'delete',
            params: arr
        })
    },
    //删除图片
    deletePics(arr) {
        return request({
            url: '/lms/tdky/usematerial/delete',
            method: 'delete',
            params: arr
        })
    },
}
export default LandReport;