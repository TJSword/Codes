<template>
    <div class="treeMenu">
        <div class="reportName">{{reportTitle}}</div>
        <div class="tree_box" @contextmenu.prevent.stop="boxContextmenu">
            <el-tree
                ref="model_tree"
                :data="treeData"
                node-key="id"
                :default-expand-all="true"
                @node-drop="handleDrop"
                draggable
                :allow-drop="allowDrop"
                class="treeList"
                @node-contextmenu="handlerContextmenu"
                @node-click ='cutPage'
                :accordion="false"
                :current-node-key="pageId"
                :highlight-current="true"
                >
            </el-tree>
        </div>
        <el-dialog :title="formTitle" :visible.sync="showDialog" :modal-append-to-body="false" width="400px" :modal="true" :close-on-click-modal="false">
            <el-input v-model="title" autocomplete="off" ></el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showDialog = false">取 消</el-button>
                <el-button type="primary" @click.stop="saveNode" >确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import LandReport from "@/api/LandReportApi" //引入api
export default {
    name:'treeMenu',
    components:{
        
    },
    data() {
      return {
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        showDialog:false,
        showWarning:false,
        title:'',
        formTitle:'新增子节点',
        reportTitle:'',
        pageId:this.$route.query.pageId,
        rootNodeArr:[],//菜单根节点集合
        firstPage:null,//首页菜单ID
        firstNodeType:null,//首页菜单页面标识nodeType
      };
    },
    props:{
        reportId:{
            type:String
        },
        page_id:{
            type:String
        }
    },
    methods: {
        stop(){

        },
        passParams(){
            this.$emit('sendRootNodeArr',this.rootNodeArr)
        },
        handleDrop(draggingNode, dropNode, dropType, ev) {
            console.log(draggingNode, dropNode, dropType, ev);
            let obj = {
                reportId:this.reportId,
                pid:draggingNode.data.pid,
                tid:draggingNode.data.tid,
                sort:dropNode.data.sort,
                sortFlag:1
            }
            LandReport.updateNode(obj).then(res=>{
                console.log(res)
                if(res.data.code === 0){
                    this.getOutLineDetail(this.reportId)
                    this.$message({
                        type: 'success',
                        message: '修改节点位置成功'
                    })
                }else{
                    this.$message.error('未知异常，请联系管理员')
                }
            })
        },
        allowDrop(draggingNode, dropNode, type) {
            if(type === 'inner'){
                if(draggingNode.data.pid === dropNode.data.id){
                    return true
                }else{
                    return false
                }
            }else{
                 if(draggingNode.data.pid === dropNode.data.pid){
                    return true
                }else{
                    return false
                }
            }
        },
        getOutLineDetail(id){
            LandReport.getOutlineDetail(id).then(res=>{
                console.log(res)
                this.reportTitle = res.data.data.name
                this.treeData = res.data.data.treeModel[0].children
                this.pid_0 = res.data.data.treeModel[0].id //记录根节点id
                let rootNodeArr = []
                function takeOutIds(arr){
                    arr.forEach(item=>{
                        if(item.children.length === 0){
                            rootNodeArr.push(item)
                        }else{
                            takeOutIds(item.children)
                        }
                    })
                    return rootNodeArr
                }
                this.rootNodeArr =  takeOutIds(this.treeData)
                this.passParams()
            })
        },
        saveNode(){
            this.showDialog =false
            if(this.formTitle === '新增子节点'){
                let obj = {
                    reportId:this.reportId,
                    label:this.title,
                    pid:this.addNode_pid
                }
                LandReport.addNode(obj).then(res=>{
                    if(res.data.code === 0){
                         this.$message({
                            type: 'success',
                            message: '新增子节点成功'
                        })
                        this.getOutLineDetail(this.reportId) 
                    }else{
                        this.$message.error('未知异常，请联系管理员')
                    }
                })
            }else if( this.formTitle === '修改当前标签'){
                let obj = {
                    reportId:this.reportId,
                    pid:this.updateNode.pid,
                    label:this.title,
                    tid:this.updateNode.tid
                }
                LandReport.updateNode(obj).then(res=>{
                    if(res.data.code === 0){
                        this.$message({
                            type: 'success',
                            message: '修改标签成功'
                        })
                        this.getOutLineDetail(this.reportId) 
                    }else{
                        this.$message.error('未知异常，请联系管理员')
                    }
                })
            }else if(this.formTitle === '另存为的大纲名称'){
                let obj = {
                    tree:this.treeData,
                    id:this.pid_0,
                    label:this.title
                }
                LandReport.saveOutLine(obj).then(res=>{
                    if(res.data.code === 0){
                        this.$message({
                            type: 'success',
                            message: '保存自定义模板成功'
                        })
                    }else{
                        this.$message.error('未知异常，请联系管理员')
                    }
                })
            }
        },
        handlerContextmenu(ev,node){
            this.$contextmenu({
            items: [
                {label: "  ‌‍新增",icon: "el-icon-plus",divided: true,onClick: () => {
                    this.formTitle = '新增子节点'
                    this.showDialog = true;
                    this.addNode_pid = node.id;
                    this.title = ''
                }
                },
                { label:"  ‌‍修改", divided: true ,icon: "el-icon-edit",onClick:()=>{
                    this.formTitle = '修改当前标签'
                    this.showDialog = true;
                    this.updateNode = node;
                    this.title = node.label
                }},
                // { label:"  ‌‍上移", divided: true, icon:"el-icon-top",onClick:()=>{
                    
                // }},
                // { label:"  ‌‍下移", divided: true, icon: "el-icon-bottom",onClick:()=>{
                // }},
                { label: "  ‌‍删除", icon: "el-icon-delete",onClick:()=>{
                    this.$confirm('我删除会导致当前节点/子节点的页面消失', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                             LandReport.deleteNode(node.tid).then(res=>{
                            if(res.data.code === 0){
                                this.$message({
                                    type: 'success',
                                    message: '删除节点成功'
                                })
                                this.getOutLineDetail(this.reportId) 
                            }else{
                                this.$message.error('未知异常，请联系管理员')
                            }
                        })
                     })
                }},
                { label:"  ‌‍大纲另存为", divided: true ,icon: "el-icon-edit",onClick:()=>{
                    this.formTitle = '另存为的大纲名称'
                    this.showDialog = true;
                    this.updateNode = node;
                    this.title = ''
                }},
                ],
                event,
                customClass: "class-a",
                zIndex: 3,
                minWidth: 50
            })
            return false;
        },
        boxContextmenu(){
            this.$contextmenu({
                items:[{label: "新增一级节点",icon: "el-icon-plus",divided: true,onClick: () => {
                    this.formTitle = '新增子节点'
                    this.showDialog = true;
                    this.addNode_pid = this.pid_0
                }
                },{label: "大纲另存为模板",icon: "el-icon-paperclip",onClick: () => {
                    this.formTitle = '大纲另存为模板'
                    this.showDialog = true;
                }
                }],
                 event,
                customClass: "class-a",
                zIndex: 3,
                minWidth: 50
            })
        },
        cutPage(data){
            if(data.children.length === 0){
                this.$emit('sendPageLabel',data.label)
                console.log(data.id)
                this.$router.push({
                    path:this.path,
                    query:{
                        reportId:this.reportId,
                        pageId:data.id,
                        nodeType:data.nodeType
                    }
                })
            }
        },
        pageInit(id){
            LandReport.getOutlineDetail(id).then(res=>{
                console.log(res)
                this.reportTitle = res.data.data.name
                this.treeData = res.data.data.treeModel[0].children
                this.pid_0 = res.data.data.treeModel[0].id //记录根节点id
                let rootNodeArr = []
                function takeOutIds(arr){
                    arr.forEach(item=>{
                        if(item.children.length === 0){
                            rootNodeArr.push(item)
                        }else{
                            takeOutIds(item.children)
                        }
                    })
                    return rootNodeArr
                }
                this.rootNodeArr =  takeOutIds(this.treeData)
                this.passParams()
                this.firstPage = rootNodeArr[0].id
                this.firstNodeType = rootNodeArr[0].nodeType
                if(this.pageId === undefined){
                    this.$router.push({
                    path:this.path,
                    query:{
                        reportId:this.reportId,
                        pageId:this.firstPage,
                        nodeType:this.firstNodeType,
                    }
                  })
                }
            })
        }
    },
    watch:{
        '$route':{
            handler(newVal){
                this.pageId = newVal.query.pageId
            }
        },
        page_id:{
            handler(newVal,oldVal){
                this.pageId = newVal
                this.$refs.model_tree.setCurrentKey(newVal)
            },
            deep:true
        },
    },
    created(){
        console.log(this.$route)
        this.pageInit(this.reportId)
        this.path = this.$route.path
    },
}
</script>
<style lang="scss">
.treeMenu{
    position: fixed;
    width: 260px;
    left: 0;
    top: 0;
    bottom: 0px;
    z-index: 50;
    background: rgba(66, 77, 87, 1);
    height:100%;
    padding-top:10px;
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    overflow: hidden;
    .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
        height: 36px;
        background: linear-gradient(to right, #2722229e, transparent) !important;
        color: #0be8ff;
    }
    
    .el-tree-node__content:hover{
        background: linear-gradient(to right, #2722229e, transparent);
    }
    .is-current{
        
    }
    .reportName{
        height:58px;
        width:100%;
        text-align: center;
        line-height: 58px;
        font-size:18px;
        color:#ffb64a;
        font-weight: bold;
    }
    .tree_box{
        overflow-y:scroll;
        overflow-x: hidden;
        width:100%;
        height:calc(100% - 150px);
        padding-bottom:20px;
        &::-webkit-scrollbar{
            display: none;
        }
    }
    .saveBtn{
        margin:10px 0; 
        margin-left:120px;
    }
    .treeList{
        height:100%;
        width:100%;
        background:none !important;
        margin-left:20px;
        font-size:40px;
        margin-bottom:20px;
        color: #f2f6fc;
    }
}
</style>