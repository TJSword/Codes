<template>
    <div class="ReportList_wrap">
        <img class="big_log" src="~@/assets/img/login/logoBig.png">
        <div class="tips" v-if="reportList.length == 0">
            <img class="report_tip" src="~@/assets/img/report/noReport.png" alt="">
            <p class="tip_text">暂无报告</p>
        </div>
        <div class="report_wrap" v-else>
            <div class="report_item" v-for="item in reportList" :key="item.id">
                <div class="cont">
                    <el-image class="preview_img" :src="item.coverUrl" alt="" fit="fill"></el-image>
                    <div class="option_box">
                        <el-tooltip class="item" effect="dark" content="播放" placement="top">
                            <i class="btn el-icon-video-play" @click="previewReport(item)"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                            <i class="btn el-icon-edit-outline" @click="editReport(item)"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="复制" placement="top">
                            <i class="btn el-icon-files" @click="showDialog=true"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                            <el-popconfirm title="确认删除？" @confirm="deleteReport(item)">
                                <i slot="reference" class="btn el-icon-document-delete"></i>
                            </el-popconfirm>
                        </el-tooltip>
                    </div>
                    <el-dialog title="请输入新报告名称" :visible.sync="showDialog" width="20%" center :append-to-body="true">
                        <el-input v-model="reportName" size="medium"></el-input>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="showDialog = false">取 消</el-button>
                            <el-button type="primary" @click="copyReport(item)">确 定</el-button>
                        </span>
                    </el-dialog>
                </div>
                <div class="title">
                    <div class="logo_img">
                        <el-image class="preview_img" :src="item.logoUrl" alt="" fit="fit"></el-image>
                    </div>
                    <div class="info">
                        <h2>{{item.name}}</h2>
                        <p>{{item.createDate}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import LandReport from "@/api/LandReportApi" //引入api
export default {
    name:'ReportList',
    components:{
        
    },
    data(){
        return{
            showDialog:false,//显示弹出层
            reportName:'',//报告名称
            reportList:[
                
            ]
        }
    },
    mounted(){
        this.reportsList()
    },
    methods:{
        reportsList(){
            var that = this
            LandReport.getReportsList()
            .then(res=>{
                console.log('报告列表',res)
                if(res.data.code===0){
                    let data = res.data.data
                    that.reportList = data
                }
            })
        },
        previewReport(item){ //播放报告
            let url = this.$router.resolve({
                path:'/landReport/reportDetail',
                query:{
                    reportId:item.id
                }
            })
            window.open(url.href, '_blank')
        },
        copyReport(item){ //复制报告
            var that = this
            if(that.reportName!==''){
                that.showDialog = false
                let obj = {
                    reportId:item.id,
                    name:that.reportName
                }
                LandReport.copyReport(obj)
                .then(res=>{
                    if(res.data.code===0){
                        that.$message.success('报告已拷贝')
                        that.reportsList()
                    }else{
                        that.$message.error('报告拷贝失败')
                    }
                })
            }
        },
        editReport(item){ //编辑报告
            let url = this.$router.resolve({
                path:'/landReport/redact',
                query:{
                    reportId:item.id
                }
            })
            window.open(url.href, '_blank')
        },
        deleteReport(item){ //删除报告
            var that = this
            LandReport.deleteReports([item.id])
            .then(res=>{
                if(res.data.code===0){
                    that.$message.success('报告已删除')
                    that.reportsList()
                }
            })
        },
    }
}
</script>
<style lang="scss">
.ReportList_wrap{
    position: absolute;
    padding: 1%;
    left: 0;
    top: 40px;
    bottom: 0px;
    right: 0;
    overflow-y: scroll;
    .big_log{
      position: fixed;
      width: 20%;
      z-index: 0;
      left: 40%;
      top: 30%;
      opacity: 0.1;
      user-select: none;
    }
    .tips{
        width: 15%;
        margin: 10% auto;
        text-align: center;
        .report_tip{
            width: 100%;
        }
        .tip_text{
            font-size: 18px;
            color: #333;
            font-weight: bold;
        }
    }
    .report_wrap{
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
    }
    .report_item{
        width: 17%;
        height: 240px;
        margin-left: 2%;
        margin-top: 30px;
        text-decoration: none;
        box-shadow: 0 0 3rem -1rem rgba(0,0,0,0.5);
        transition: transform 0.1s ease-in-out, box-shadow 0.1s;
        cursor: pointer;
        border-radius: 4px;
        overflow: hidden;
        .preview_img{
            width: 100%;
        }
        .title{
            display: flex;
            justify-content: space-between;
            align-items: center;
            background:#fff;
            padding: 0 8%;
            height: 30%;
            h2{
                margin: 5px 0;
            }
            p{
                margin: 0;
            }
            .logo_img{
                width: 40px;
                height: 40px;
                border-radius: 50%;
                overflow: hidden;
            }
            .info{
                width: 75%;
                color: #515151;
                h2{
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
        .cont{
            height: 70%;
            overflow: hidden;
            position: relative;
            background: #fff;
            .option_box{
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                opacity: 0;
                transition: all 0.3s;
                left: -100%;
                display: flex;
                align-items: flex-end;
                .btn{
                    color: #fff;
                    font-size: 20px;
                    background: rgba(0,0,0,0.6);
                    padding: 7px;
                    border-radius: 50%;
                    margin-left: 10px;
                    margin-bottom: 10px;
                }
                .btn:hover{
                    color: salmon;
                }
            }
            
        }
        .cont:hover .option_box{
            opacity: 1;
            left: 0;
        }
    }
    .report_item:hover {
        transform: translateY(-0.5rem) scale(1.0125);
        box-shadow: 0 0.5em 3rem -1rem rgba(0,0,0,0.5);
    }
}
</style>