<template>
    <div class="Establish_wrap">
     <el-form ref="form"  :model="form" label-width="80px" class="form" label-position="left" width="400">
        <el-form-item label="选择台账" prop="tzid">
            <el-select v-model="form.tzId" placeholder="没有你想要的？可新建→" >
            <el-option :label="item.name" :value="item.id" v-for="item in LedgerOptions" :key="item.id"></el-option>
        </el-select>
        <el-button type="primary" style="marginLeft:3px;" @click="jumpToLedgermap">新建台账</el-button>
        </el-form-item>
        <el-form-item label="报告名称" prop="name">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
            <el-upload
                ref="coverUpload"
                class="avatar-uploader"
                :action="imgUploadURL + '/lms/tdky/report/upload'"
                :show-file-list="false"
                list-type="picture"
                :auto-upload="false"
                :headers="{token:token}"
                :on-change="handleCoverChange"
                :data="{'type':'cover','reportId':reportId}">
                <el-image v-if="coverImageUrl" :src="coverImageUrl" class="cover" fit="cover"></el-image>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>
        <el-form-item label="LOGO" prop="cover">
           <el-upload
                class="uploader"
                ref="logoUpload"
                :action="imgUploadURL + '/lms/tdky/report/upload'"
                :auto-upload="false"
                list-type="picture"
                :show-file-list="false"
                 :headers="{token:token}"
                :on-change="handleLogoChange"
                :on-success="handleLogoSuccess"
                :data="{'type':'logo','reportId':reportId}">
                <img v-if="LogoImageUrl" :src="LogoImageUrl" class="avatar">
                <i v-else class="el-icon-plus uploader-icon"></i>
            </el-upload>
        </el-form-item>
        <el-form-item label="大纲模板" prop="outline">
            <el-select v-model="form.outLine" placeholder="请选择大纲模板">
            <el-option :label="item.name" :value="index" v-for="(item,index) in OutLineOptions" :key="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
        </el-form-item>
    </el-form> 
    <div class="cut-off-line"></div>
    <div id="tree_list">
              <div class="l1" v-for="(item,index) in treeData" :key="index"> 
                <span class="l_title title_1" >
                      <span class="itemTitle">
                            <span v-show="!item.isShowInput" style="text-align:justify;width:100%">{{item.label}}</span>
                            <input v-show="item.isShowInput" type="text"  class="itemTitile_input" :value="item.label" focus>
                        </span><i v-if="item.children.length" class="line"><i >——</i></i>
                  </span>
                  <div class="l2_box" ref="l2_box" >
                    <div class="l2" v-for="(item1,index1) in item.children" :key="index1">
                    <span class="l_title title_2">  
                        ——<span class="itemTitle" >
                            <span v-show="!item1.isShowInput" >{{item1.label}}</span>
                            <input v-show="item1.isShowInput" type="text"  class="itemTitile_input" :value="item1.label" focus>
                        </span> <i v-if="item1.children.length" class="line"><i>——</i></i></span>
                      <div class="l3_box" ref="l3_box">
                        <div class="l3" v-for="(item2,index2) in item1.children" :key="index2">
                            <span class="l_title title_3">—— <span class="itemTitle"  >
                            <span v-show="!item2.isShowInput" >{{item2.label}}</span>
                            <input v-show="item2.isShowInput" type="text"  class="itemTitile_input" :value="item2.label" focus>
                        </span><i v-if="item2.children.length" class="line"><i >——</i></i></span>
                            <div class="l4_box" >
                                <div class="l4"  v-for="(item3,index3) in item2.children" :key="index3">
                                     <span class="l_title title_4">——<span class="itemTitle" >
                            <span v-show="!item3.isShowInput" >{{item3.label}}</span>
                            <input v-show="item3.isShowInput" type="text"  class="itemTitile_input" :value="item3.label" focus></span><i v-if="item3.children.length" class="line"><i >——</i></i></span>
                                     <div class="l5_box">
                                         <div class="l5" v-for="(item4,index4) in item3.children" :key="index4">
                                             <span class="l_title title_5">——<span class="itemTitle" >
                                                <span v-show="!item4.isShowInput" >{{item4.label}}</span>
                                                <input v-show="item4.isShowInput" type="text"  class="itemTitile_input" :value="item4.label" focus></span></span>
                                         </div>
                                     </div>
                                </div>
                            </div>
                        </div>
                      </div>
                  </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import LandReport from "@/api/LandReportApi" //引入api
//组件
export default {
    name:'Establish',
    components:{
        
    },
    data(){
        return {
            form: {
                tzId: '',
                name: '',
                outLine:0
             },
         OutLineOptions:[],
         LedgerOptions:[],
         coverImageUrl: '',
         LogoImageUrl:'',
         reportId:'',
         token:window.localStorage.getItem("token"),
         treeData:[]
      }
    },
    methods:{
        onSubmit() {
            this.$confirm('我们会根据你所添的内容创建土地可研报告, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    if(this.form.tzId === ''){
                        this.$message.error('请先选择台账');
                    }else if(this.form.name === ''){
                        this.$message.error('请填写报告名称');
                    }else if(this.coverImageUrl === ''){
                        this.$message.error('请选择封面');
                    }else if(this.LogoImageUrl === ''){
                         this.$message.error('请选择LOGO');
                    }else{
                        let obj = {
                            name:this.form.name,
                            tzId:this.form.tzId,
                            defined:this.OutLineOptions[this.form.outLine].defined,
                            modelId:this.OutLineOptions[this.form.outLine].id,
                            type:this.OutLineOptions[this.form.outLine].defined
                        }
                        LandReport.createReport(obj).then(res=>{
                            console.log(res.data.data)
                            this.reportId = res.data.data;
                            console.log(this.reportId)
                            setTimeout(_=>{
                                this.$refs.coverUpload.submit();
                                this.$refs.logoUpload.submit();
                            },50)
                            
                        })
                    }
                })
        },
        handleCoverChange(file,fileList){
            console.log(file,fileList)
            this.coverImageUrl = file.url
        },
        handleLogoSuccess(res, file) {
            console.log(res)
            if(res.code===0){
                this.$message({
                    message: '创建成功 :)',
                    type: 'success'
                })
                setTimeout(_=>{
                    this.$router.push({
                        path:'/landReport/redact',
                        query:{
                            reportId:this.reportId
                        }
                    })
                },800)
                 
            }else{
                this.$message.error('未知异常，请联系管理员')
            }
           
        },
        handleLogoChange(file,fileList){
            this.LogoImageUrl = file.url
        },
        getOutlineList(){
            LandReport.getOutlineList().then(res=>{
                console.log(res.data.data)
                this.OutLineOptions = res.data.data
                let obj = {
                    defined:this.OutLineOptions[0].defined,
                    id:this.OutLineOptions[0].id
                }
                LandReport.getOutlineInfo(obj).then(res=>{
                    console.log(res.data.data.treeModel)
                    this.treeData = res.data.data.treeModel[0].children
                })
            })
        },
        getMyLedgers(){
            LandReport.getMyLedgers().then(res=>{
                console.log(res.data.data.searchResult)
                this.LedgerOptions = res.data.data.searchResult
            })
        },
        jumpToLedgermap(){
            this.$router.push({
                 path:'/ledgermap'
            })
        }
    },
    created(){
        this.getOutlineList();
        this.getMyLedgers()
    },
    watch:{
        'form.outLine':{
            handler(newVal){
                console.log(this.OutLineOptions[newVal])
                let obj = {
                    defined:this.OutLineOptions[newVal].defined,
                    id:this.OutLineOptions[newVal].id
                }
                LandReport.getOutlineInfo(obj).then(res=>{
                    console.log(res.data.data.treeModel)
                    this.treeData = res.data.data.treeModel[0].children
                })
            },
        }
    }
}
</script>
<style lang="scss">
.Establish_wrap{
   position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    bottom: 0px;
    height:calc(100%- 40px);
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    .form{
        margin-top:100px;
        margin-left:80px;
        margin-right:80px;
        width:500px;
        el-form-item{
            margin-top:20px;
        }
        .el-form-item__label{
            color: #c0c4cc;
        }
    }
    .cut-off-line{
        height:60%;
        width:2px;
        margin-top:10%;
        background: rgba(236,245,255,0.25);
        margin-right:60px;
    }
    #tree_list{
            margin-top:40px;
            padding:20px;
            height: calc(100% - 80px);
            width:90%;
            padding-left:10%;
            overflow: scroll;
            user-select: none;
            .l1{
                margin:4% 2%;
                width:60%;
                display: flex;
                user-select: none;
                align-items: center;
                flex-shrink: 0;
                .l_title{
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    white-space: nowrap;
                    font-size:12px;
                    .icon-jiahao{
                        margin-top:-10px;
                    }
                    .icon-jianhao{
                        margin-top:-10px;
                    }
                    .itemTitle{
                        background: #192e44;
                        border-radius: 5px;
                        height: 30px;
                        color: #e4e4e4;
                        line-height: 30px;
                        width: 150px;
                        font-weight: 700;
                        text-align: center;
                        .itemTitile_input{
                            border:0;
                            height: calc(100% - 2px);
                            width:100%;
                            background:#558ED5;
                            text-align: center;
                            border-radius: 5px;
                            font-size:12px;
                            color:#000;
                        &:focus{
                            border:0!important;
                            
                        }
                    }
                    }
                    
                    .line{
                        display: flex;
                        align-items: center;
                        .iconfont{
                            font-size:18px;
                        }
                        i{
                            color: #6b98cc;
                        }
                    }
                }
                .line_1{
                    width:1px;
                    background: #6b98cc;
                }
                .l2_box{
                    display: flex;
                    flex-direction: column;
                    width:280px;
                    align-items: center;
                    justify-content: space-around;
                     
                }
                .l2{
                    width:280px;
                    display: flex;
                    padding:4px 0;
                    position: relative;
                    .l_title{
                        width:52%;
                        color: #6b98cc;
                    }
                    .line_2{
                        width:1px;
                        background: #6b98cc;
                    }
                    .l3_box{
                        flex-direction: column;
                        width:200px;
                        align-items: center;
                        justify-content: space-around;
                    }
                    .l3{
                        display: flex;
                        padding:4px 0;
                        position: relative;
                         .l_title{
                            width:150px;
                        }
                        .l4_box{
                            flex-direction: column;
                            width:150px;
                            align-items: center;
                            justify-content: space-around;
                            .l4{
                                display: flex;
                                padding:4px 0;
                                position: relative;
                                .l5_box{
                                     flex-direction: column;
                                    width:150px;
                                    align-items: center;
                                    .l5{
                                        display: flex;
                                        padding:4px 0;
                                        position: relative;
                                        &::before{
                                        content: "";
                                        display: block;
                                        height:calc(100%);
                                        width:1px;
                                        background:#6b98cc;
                                        position: absolute;
                                    }
                                    &:first-child{
                                        &::before{
                                        content: "";
                                        display: block;
                                        position: absolute;
                                        height:calc(50% + 20px);
                                        width:1px;
                                        background:#6b98cc;
                                        top:50%;
                                        }
                                    }
                                    &:last-child{
                                        &::before{
                                            content: "";
                                            display: block;
                                            position: absolute;
                                            height:calc(50% + 2px);
                                            width:1px;
                                            background:#6b98cc;
                                            top:0px;
                                        }
                                    }
                                    }
                                }
                        &::before{
                            content: "";
                            display: block;
                            height:calc(100%);
                            width:1px;
                            background:#6b98cc;
                            position: absolute;
                        }
                        &:first-child{
                            &::before{
                            content: "";
                            display: block;
                            position: absolute;
                            height:calc(50% + 20px);
                            width:1px;
                            background:#6b98cc;
                            top:50%;
                            }
                        }
                        &:last-child{
                             &::before{
                                content: "";
                                display: block;
                                position: absolute;
                                height:calc(50% + 2px);
                                width:1px;
                                background:#6b98cc;
                                top:0px;
                            }
                        }
                                
                            }

                        }
                        &::before{
                            content: "";
                            display: block;
                            height:calc(100%);
                            width:1px;
                            background:#6b98cc;
                            position: absolute;
                        }
                        &:first-child{
                            &::before{
                            content: "";
                            display: block;
                            position: absolute;
                            height:calc(50% + 20px);
                            width:1px;
                            background:#6b98cc;
                            top:50%;
                            }
                        }
                        &:last-child{
                             &::before{
                                content: "";
                                display: block;
                                position: absolute;
                                height:calc(50% + 2px);
                                width:1px;
                                background:#6b98cc;
                                top:0px;
                            }
                        }
                    }
                    &::before{
                            content: "";
                            display: block;
                            position: absolute;
                            height:calc(100% + 30px);
                            width:1px;
                            background:#6b98cc;
                            top:0px;
                        }
                    &:first-child{
                        &::before{
                            content: "";
                            display: block;
                            position: absolute;
                            height:calc(50% + 2px);
                            width:1px;
                            background:#6b98cc;
                            top:50%;
                        }
                    }
                    &:last-child{
                         &::before{
                            content: "";
                            display: block;
                            position: absolute;
                            height:calc(50% + 2px);
                            width:1px;
                            background:#6b98cc;
                            top:0;
                        }
                    }
                }
            }
            
        }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 316px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .cover {
        height: 178px;
        display: block;
        width:316px;
        object-fit:fill;
    }
    .uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
}
</style>