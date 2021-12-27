<template>
    <div class="landReport_wrap" @contextmenu.prevent.stop="showRightClickMenu" @click.self="pageDown" @mousewheel="mouseWheelPageFn">
        <div class="toggle_wrap" @click="showMenu">
            <i :class="['btn',isShowMenu?'el-icon-s-fold':'el-icon-s-unfold']"></i>
        </div>
        <TreeMenu :class="['tree_list',isShowMenu?'tree_list_active':'']" :reportId='reportId' :page_id="pageId" @sendRootNodeArr="setRootNodeArr" @sendPageLabel="setPageLabel" v-if="isShowTree"></TreeMenu>
        <div class="icon_box">
            <el-tooltip class="item" effect="dark" content="备注"  placement="right">
                <div class="icon_wrap"  @click="showNote = true">
                    <i class="iconfont icon-beizhu"></i>
                </div>
            </el-tooltip>
                <el-tooltip class="item" effect="dark" content="上一页" placement="right">
                <div class="icon_wrap" @click="pageUp()">
                    <i class="iconfont icon-shangyiye"></i>
                </div>
            </el-tooltip>
                <el-tooltip class="item" effect="dark" content="下一页" placement="right">
                <div class="icon_wrap" @click="pageDown()">
                    <i class="iconfont icon-xiayiye"></i>
                </div>
            </el-tooltip>
        </div>
        <!-- 备注列表 -->
        <el-drawer :visible.sync="showNote" :with-header="false" :modal-append-to-body="false" size="300px">
            <div class="note_box">
                <div class="note_title">备注</div>
                <div class="tip" v-if="notes.length==0">暂无备注</div>
                <div class="notes" v-else>
                    <div class="notes_item" v-for="(item,index) in notes" :key="item.tid">
                        <span class="item_info">{{index+1 + '.'}}{{item.remark}}</span>
                    </div>
                </div>
            </div>
        </el-drawer>
        <div class="dom_box" >
            <div class="page_name">
                <Reveal :text="pageName" />
            </div>
            <div class="dom_item" v-for="(item,index) in domArr" :key="item.tid" :style="{position:isFixedPage(item.type)?'absolute':'unset',left:item.x + '%',top:item.y + '%',width:item.w + '%',height:item.h + '%'}">
                <div class="dom_text" v-if="item.type ==='text'" v-html="item.content" style="white-space:wrap;" @dblclick.self="showEdiBar(index)"></div>
                <div v-if="item.type === 'img'" style="height:100%;width:100%">
                    <img :src="item.content" alt="" style="height:100%;width:100%">
                </div>
                <!-- 图表 -->
                <div v-if="item.type === 'chart'" class="item_wrap" style="height:100%;width:100%">
                    <ReportAddChart :dataInfo="item" :reportId="reportId" @putChartOption="val=>setChartOption(val,index)" />
                </div>
                <!-- 表格 -->
                <div v-if="item.type === 'table'" class="item_wrap" style="height:100%;width:100%">
                    <ReportAddTable :colrow="item.content" @tableData="val=>setTableData(val,index)"  />
                </div>
                <!-- 地图 -->
                <div v-if="item.type === 'map'" class="item_wrap" style="height:100%;width:100%">
                    <ReportAddMap :reportId="reportId" :mapInfo="item" :isEdit="false" @setMapObj="setMap" style="width:100%;height:100%" />
                </div>
                <!-- 竞品分布 -->
                <div v-if="item.type === 'jpfb'" class="item_wrap" style="height:100%;width:100%;background:#fff;">
                    <CdInfos :reportId="reportId" :propertyType="item.content" :isEdit="false" />
                </div>
                <!-- 去化、销量 -->
                <div v-if="item.type === 'qhxl'" class="item_wrap" style="height:100%;width:100%;background:#fff;">
                    <CdSalse :reportId="reportId" :propertyType="item.content" :isEdit="false" />
                </div>
                <!-- 户配逻辑 -->
                <div v-if="item.type === 'hplj'" class="item_wrap" style="height:100%;width:100%;background:#fff;">
                    <HouseRatio :reportId="reportId" :propertyType="item.content" :isEdit="false" />
                </div>
                <!-- 价格拟合 -->
                <div v-if="item.type === 'jgnh'" class="item_wrap" style="height:100%;width:100%;background:#fff;">
                    <PriceFitting :reportId="reportId" :propertyType="item.content" :isEdit="false" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import LandReport from "@/api/LandReportApi" //引入api
import Reveal from '@/components/tools/reveal' //文字展示鲜果
import TreeMenu from '@/components/main/landReport/TreeMenu'
import ReportAddMap from "@/views/LandReport/ReportAddMap" //报告地图
import ReportAddChart from '@/views/LandReport/ReportAddChart' //图表组件
import ReportAddTable from '@/views/LandReport/ReportAddTable' //表格组件
//户配逻辑
import HouseRatio from '@/views/LandReport/HouseRatio'
//价格拟合
import PriceFitting from '@/views/LandReport/PriceFitting'
//竞品信息
import CdInfos from '@/views/LandReport/CdInfos'
//竞品去化销量
import CdSalse from '@/views/LandReport/CdSales'
//组件
export default {
    name:'Redact',
    components:{
        Reveal,TreeMenu,ReportAddMap,ReportAddChart,ReportAddTable,HouseRatio,PriceFitting,CdInfos,CdSalse
    },
    data(){
        return{
            isShowMenu:false,
            domArr:[],
            posX:0,
            posY:0,
            treeData:[],
            reportId:'',
            showNote:false,
            note:'',
            notes:'',
            isUpdateRemark:false,//判断是会否是更新状态不小
            rootNodeArr:[],
            isShowTree:true,
            pageName:null,//页面名称
            edit_width:100,
            edit_height:100,
            showNote:false,
        }
       
    },
    
    methods:{
        randomId(){
            let random = Number(Math.random().toString().substr(3,length) + Date.now()).toString(36) + ''
            return random
        },
        //设置页面名称
        setPageLabel(val){
            this.pageName = val
        },
        //设置表格数据
        setTableData(val,index){
            this.domArr[index].content.data = val
        },
        setMap(mapObj){
            console.log(mapObj)
            this.domArr[this.domArr.length-1].map = mapObj.map
            this.domArr[this.domArr.length-1].baseMap = mapObj.baseMap
        },
        setChartOption(val,index){
            console.log(val,index)
            if(val.chartOption!=null){
                this.domArr[index].chartOption = val.chartOption
            }
            if(val.chartId!=null){
                 this.domArr[index].chartId = val.chartId
            }
            this.domArr[index].chart = val.chart
        },
        setRootNodeArr(arr){
            this.rootNodeArr = arr
            if(this.pageName==null){
                let id = this.$route.query.pageId
                let curPageNode = arr.filter(item=>item.id==id)[0]
                if(curPageNode){
                    this.pageName = curPageNode.label
                }else{
                    this.pageName = arr[0].label
                }
            }
            this.pageId = this.$route.query.pageId
            arr.forEach((item,index)=>{
                if(item.id === this.pageId){
                    this.pageIndex = index
                }
            })
            console.log(this.pageIndex)
        },
        getRemarkList(){
            LandReport.getRemarkList(this.reportId,this.pageId).then(res=>{
                if(res.data.code===0){
                    this.notes = res.data.data.searchRst
                }
                
            })
        },
        mouseWheelPageFn(e){
            // console.log(e.wheelDelta)
            // if(e.wheelDelta > 0){
            //      this.pageUp()
            // }else{
            //     this.pageDown()
            // }
        },
        pageFn(e){
            console.log(e)
            if(e.keyCode === 38){
                this.pageUp()
            }else if(e.keyCode === 40){
                this.pageDown()
            }
        },
        showRightClickMenu(event){
            this.$contextmenu({
                items:[
                    {label:'  ‌‍上一页',divided: true,icon:"el-icon-arrow-up",onClick:()=>{
                        this.pageUp()
                    }},
                    {label:'  ‌‍下一页',divided: true,icon:"el-icon-arrow-down",onClick:()=>{
                       this.pageDown()

                    }},
                    //  {label:'  ‌‍激光笔',divided: true,icon:"el-icon-location-outline",onClick:()=>{
                       
                    // }},
                    {label:'  ‌‍结束放映',divided: true,icon:"el-icon-refresh-left",onClick:()=>{
                        this.$router.push({
                            path:'/landReport/reportList'
                        })
                    }}
                    ],
                event,
                customClass: "class-a",
                zIndex: 3,
                minWidth: 50
            })
        },
        pageUp(){
            if(this.pageIndex === 0){
                this.$message({
                    type: 'warning',
                    message: '当前页为第一页'
                })
            }else{
                this.pageIndex = this.pageIndex - 1
                this.nodeType = this.rootNodeArr[this.pageIndex].nodeType
                this.pageId = this.rootNodeArr[this.pageIndex].id
                this.pageName = this.rootNodeArr[this.pageIndex].label
                this.$router.push({
                    path:'/landReport/reportDetail',
                    query:{
                        reportId:this.reportId,
                        pageId:this.pageId,
                        nodeType:this.nodeType
                    }
                })
            }
        },
        pageDown(){
            if(this.pageIndex == this.rootNodeArr.length - 1){
                 this.$message({
                    type: 'warning',
                    message: '当前页为最后一页'
                })
            }else{
                this.pageIndex ++
                this.pageId = this.rootNodeArr[this.pageIndex].id
                this.nodeType = this.rootNodeArr[this.pageIndex].nodeType
                this.pageName = this.rootNodeArr[this.pageIndex].label
                this.$router.push({
                    path:'/landReport/reportDetail',
                    query:{
                        reportId:this.reportId,
                        pageId:this.pageId,
                        nodeType:this.nodeType
                    }
                })
            }
        },
        showMenu(){
            this.isShowMenu = !this.isShowMenu;
        },
        
        getReportInfo(reportId,pageId,nodeType){
            if(nodeType){ //固定页面
                this.$nextTick(()=>{
                    this.getPageInfo(reportId,nodeType)
                })
            }else{ //自定义页面
                LandReport.getReportInfo(reportId,pageId).then(res=>{
                    console.log(res.data.data)
                    let domArr = res.data.data.reportInfo
                    domArr.forEach(item=>{
                        if(item.type=='chart'){
                            item.chartOption = JSON.parse(item.chartOption)
                            item.chartInfo = JSON.parse(item.chartInfo)
                        }else if(item.type=='table'){
                            item.content = JSON.parse(item.content)
                        }else if(item.type=='map'){
                            item.chartInfo = JSON.parse(item.chartInfo)
                        }
                    })
                    this.domArr = domArr
                })
            }
        },
        getPageInfo(reportId,nodeType){
            this.domArr = [] //置空dom盒子
            if(nodeType=='hplj'){ //户配逻辑
                this.domArr=[{
                    tid:this.randomId(),
                    type:'hplj',
                    h:this.edit_height,
                    w:this.edit_width,
                    x:0,
                    y:0,
                    content:nodeType
                }]
            }else if(nodeType=='jgnh'){ //价格拟合
                this.domArr=[{
                    tid:this.randomId(),
                    type:'jgnh',
                    h:this.edit_height,
                    w:this.edit_width,
                    x:0,
                    y:0,
                    content:nodeType
                }]
            }else if(nodeType=='jpfb'){ //竞品分布
                this.domArr=[{
                    tid:this.randomId(),
                    type:'jpfb',
                    h:this.edit_height,
                    w:this.edit_width,
                    x:0,
                    y:0,
                    content:nodeType
                }]
            }else if(nodeType=='qhxl'){ //去化、销量
                this.domArr=[{
                    tid:this.randomId(),
                    type:'qhxl',
                    h:this.edit_height,
                    w:this.edit_width,
                    x:0,
                    y:0,
                    content:nodeType
                }]
            }
        },
    },
    
    created(){
        this.reportId = this.$route.query.reportId //取出报告id
        this.pageId = this.$route.query.pageId
        this.nodeType = this.$route.query.nodeType //页面标记nodeType
        
        this.getReportInfo(this.pageId,this.reportId)
    }, 
    watch:{
        '$route':{
            handler(newVal){
                this.reportId = newVal.query.reportId //取出报告id
                this.pageId = newVal.query.pageId //取出页面id
                this.nodeType = newVal.query.nodeType //页面标记nodeType
                this.rootNodeArr.forEach((item,i)=>{ //page页码
                    if(this.pageId==item.id){
                        this.pageIndex = i
                    }
                })
                this.getRemarkList()
                this.getReportInfo(this.pageId,this.reportId,this.nodeType)
            },
            immediate:true
        },
    },
    computed:{
        //是否为固定页面
        isFixedPage(){
            return (val) =>{
                return val === 'text' || val === 'img' || val === 'chart' || val === 'table' || val === 'map'
            }
        }
    },
    mounted(){
        window.onkeydown = this.pageFn
    }
}
</script>
<style lang="scss">
.landReport_wrap{
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    bottom: 0px;
    display: flex;
    background: #fff;
    z-index:9999;
    //cursor: url('../../icons/jiguangbi.png'),auto;
    .note_box{
        background: #3c414c;
        height:100%;
        width:100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        .note_title{
            color:#f79f1b;
            font-size:14px;
            margin-top:20px;
            text-align: left;
            width: 80%;
        }
        .tip{
            font-size: 12px;
            width: 100%;
            text-align: center;
            margin: 30px 0;
            color: #ccc;
        }
        .notes{
            height:83%;
            width:100%;
            margin-top:20px;
            overflow-y: scroll;
            .notes_item{
                width:80%;
                padding:0 10%;
                font-size:15px;
                &:hover{
                    .el-icon-edit,.el-icon-delete{
                        opacity: 1;
                        transition: all 0.3s ease;
                        cursor: pointer;
                    }
                }
                .item_info{
                    text-indent: 30px;
                    line-height: 30px;
                    color: #ecf5ff;
                    font-size: 13px;
                }
            }
        }
    }
    .icon_box{
        position: absolute;
        right:20px;
        bottom:20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        z-index: 999;
        .icon_wrap{
            margin-top: 10px;
            width: 30px;
            height: 30px;
            line-height: 20px;
            text-align: center;
            background: #ffa319;
            border-radius: 3px;
            cursor: pointer;
            transition: all 0.3s;
            &:hover{
                background: #f60;
            }
            &:hover .iconfont{
                color: #fff;
            }
        }
        .iconfont{
            color: #333;
            transition: 0.3s;
        }
    }
    .tree_list{
        left:-300px;
        top:0;
        opacity: 0;
        transition: all 0.3s linear;
    }
    .tree_list_active{
        left:0px;
        opacity: 1;
        transition: all 0.3s linear;
    }
    .tree_mask{
        height:100%;
        width:100%;
        z-index:7;
        position: fixed;
        left:0;
        top:0;
    }
    .dom_box{
        position: absolute;
        left:0;
        top:0;
        bottom: 0;
        right: 0;
        padding: 50px;
        z-index:5;
        .page_name{
            position: absolute;
            font-size: 20px;
            font-weight: bold;
            top: 10px;
            right: 10px;
            color: #606266;
            z-index: 9999999;
            padding: 5px 15px;
            background: #fff;
            border-radius: 5px;
            box-shadow: rgba(50, 58, 72, 0.12) 0 0 10px 10px;
        }
        .dom_item{
            position: absolute;
            .dom_text{
                height: 100%;
                table{
                    width: 100%;
                    height: 100%;
                    border:0px;
                    border-collapse: collapse;
                }
                th,td{
                    border: #ccc 1px solid;
                    text-align: center;
                    padding: 0;
                }
                th{
                    background: rgb(240, 240, 240);
                }
                p{
                    padding: 0;
                    margin: 0;
                }
            }
        }
    }
    .toggle_wrap {
        display: block;
        width: 30px;
        height: 30px;
        position: absolute;
        left:20px;
        top:25px;
        z-index: 1000;
        line-height: 33px;
        text-align: center;
        background: #ffa319;
        border-radius: 3px;
        cursor: pointer;
        transition: 0.3s;
        &:hover{
            background:#ff9900;
        }
        .btn{
            font-size: 18px;
            color: #303133;
        }
    }

 
}
</style>