<template>
    <div class="houseEva_wrap">
        <canvas id="houseCanvas" height='800'  width='800' @click="setPoint($event)"></canvas>
        <div class="add" v-show="!hasImage">
            <el-upload
                class="upload"
                ref="upload"
                list-type="picture"
                :action="imgUploadURL + '/pms/hxpc/house/save'"
                :show-file-list="false"
                :auto-upload="false"
                :on-change="handleChange"
                :headers='{"token":token}'
                :data="{'size':ruleForm.area,'ownRate':ruleForm.ownRate,'buildingName':ruleForm.buildingName,'houseName':ruleForm.houseName}"
                :on-success="handleSuccess"
                name="imgURL"
                >
                <el-button size="small" type="primary" class="upload_button"></el-button>
            </el-upload>
            <div class="line"></div>
            <div class="vertical"></div>
        </div>
        <div class="content">
            <div class="button_box">
                 <el-upload
                class="upload"
                ref="upload1"
                list-type="picture"
                :action="imgUploadURL + '/pms/hxpc/house/save'"
                :show-file-list="false"
                :auto-upload="false"
                :on-change="handleChange"
                :headers='{"token":token}'
                :data="{'size':ruleForm.area,'ownRate':ruleForm.ownRate,'buildingName':ruleForm.buildingName,'houseName':ruleForm.houseName}"
                :on-success="handleSuccess"
                name="imgURL"
                >
                <el-button  type="primary" class="upload_button" @click="clear" style="width:126px;">上传户型图</el-button>
                 </el-upload>
                <el-button type="warning" @click="revocation">撤回一步</el-button>
                <el-button type="info" @click="showViewList">已测户型列表</el-button>
                
            </div>
            <div class="border_line"></div>
             <!-- <div class="result_box" v-if="showResult">
                <span id="info">点击鼠标并且拖动绘制出结果,双击重绘</span>
               <canvas id='canvas' width='600' height="500"></canvas>
            </div> -->
            <div class="content_detail" @click="copyScore"> 
                <div v-if="!chooseRoom && !showResult" style="margin-top:150px">{{content}}</div>
                <img v-if="chooseRoom && !showResult" :src="chooseRoom[active].url" alt="">
                <div class="res_box" v-if="showResult">
                    <div style="width:100%;margin-bottom:30px;text-align:center">
                        总得分：<span style="font-size:30px">{{finalScore}}</span>分
                    </div>
                    <div style="width:40%">
                        <div class="res_item" style="margin-bottom:10px;font-size:20px;">户型得分:{{propertyScoreTotal}}分</div>
                        <div class="res_item" v-for="(item,index) in propertyScore" :key="index">
                            <div class="label">{{item.block}}</div>
                            <div class="value">{{item.score}}分</div>
                        </div>
                    </div>
                    <div style="width:50%" >
                        <div class="res_item"  style="margin-bottom:10px;font-size:20px;">设计因子得分:{{evaTotal}}分</div>
                        <div class="res_item" v-for="(item,index) in eva" :key="index">
                            <div class="label">{{`${item.n1}:${item.n2}`}}</div>
                            <div class="value">{{item.score}}分</div>
                        </div>
                    </div>
                    
                </div>
            </div>
            
        </div>
        <el-steps :active="active" align-center finish-status="success" class="steps">
            <template v-if="showStep">
                <el-step :title="item" v-for="(item,index) in ruleForm.value" :key="index"></el-step>
            </template>
        </el-steps>
        <el-dialog
            title="补充详细信息"
            :visible.sync="dialogVisible"
            width="60%"
            :before-close="handleClose"
            :modal-append-to-body='false'
            :close-on-click-modal="false"
            class="dialog"
            style="margin-left:700px;"
           >
            <div class="dialog_wrap">
                <el-form :model="ruleForm"  :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
                    <el-form-item  class="area_input" prop="area">
                       <el-input placeholder="建筑面积" v-model="ruleForm.area" >
                            <template slot="append">㎡</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item  class="floor_input"  prop="ownRate">
                       <el-input placeholder="公摊率" v-model="ruleForm.ownRate">
                            <template slot="append">%</template>
                        </el-input>
                    </el-form-item>
                     <el-form-item  class="area_input" prop="buildingName">
                            <el-autocomplete
                            class="inline-input"
                            v-model="ruleForm.buildingName"
                            :fetch-suggestions="querySearch"
                            placeholder="模糊搜索项目名称"
                            :trigger-on-focus="false"
                            @select="handleSelect"
                            value-key="name"
                            ></el-autocomplete>
                       
                    </el-form-item>
                    <el-form-item  class="floor_input" prop="houseName">
                       <el-input placeholder="户型名称" v-model="ruleForm.houseName">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="value" class="transfer">
                        <el-transfer v-model="ruleForm.value" :data="data" :titles="['房间配置','你的房间']"></el-transfer>
                    </el-form-item>
                </el-form>
            </div>
            
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </span>
            
            </el-dialog>
            <el-dialog title="补全详细信息" 
            :visible.sync="showQuestion" 
            :modal-append-to-body='false' 
            :close-on-click-modal="false" 
            width="60%"
            style="margin-left:700px;">
                <div v-for="(item,index) in questions" :key="index" >
                    <el-radio-group v-model="item.value">
                        <div style="font-size:20px">{{item.name}}</div>
                        <el-radio  :label="item1.id" style="margin:25px 20px;" v-for="(item1,index1) in item.selects" :key="index1">{{item1.name}}</el-radio>
                    </el-radio-group>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="showQuestion = false">取 消</el-button>
                    <el-button type="primary" @click="chooseAns">确 定</el-button>
                </div>
            </el-dialog>
            <div :class="['list_box' ,showList?'list_box_active':'']">
                <div class="iconfont_box" @click="showList = false">
                    <i class="iconfont icon-guanbi"></i>
                </div>
                <el-table
                    :data="tableData"
                    border
                    stripe
                    height=660
                    :cell-style="cellStyle"
                    @cell-click="cellClick"
                    >
                    <el-table-column
                        prop="realName"
                        label="上传人"
                       >
                    </el-table-column>
                    <el-table-column
                        prop="buildingName"
                        label="项目名称"
                        width="150">
                    </el-table-column>
                    <el-table-column
                        prop="houseName"
                        label="户型名称"
                        fixed="left"
                        width="100">
                    </el-table-column>
                     <el-table-column
                        prop="totalScore"
                        label="总得分"
                        fixed="right">
                    </el-table-column>
                    <el-table-column
                        label="设计因子"
                        width="200">
                        <template slot-scope="scope">
                            <p v-for="(item,index) in scope.row.question.split(';')" :key="index">{{item}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="客厅" align="center">
                    <el-table-column
                        prop="ktScore"
                        label="得分">
                    </el-table-column>
                    <el-table-column
                        prop="ktJs"
                        label="实际进深">
                    </el-table-column>
                    <el-table-column
                        prop="ktKj"
                        label="实际开间">
                    </el-table-column>
                    <el-table-column
                        prop="ktArea"
                        label="套内面积">
                    </el-table-column>
                    </el-table-column>
                    <el-table-column label="第二客厅" align="center">
                    <el-table-column
                        prop="dektScore"
                        label="得分">
                    </el-table-column>
                    <el-table-column
                        prop="dektJs"
                        label="实际进深">
                    </el-table-column>
                    <el-table-column
                        prop="dektKj"
                        label="实际开间">
                    </el-table-column>
                    <el-table-column
                        prop="dektArea"
                        label="套内面积">
                    </el-table-column>
                    </el-table-column>
                    <el-table-column label="主卧" align="center">
                    <el-table-column
                        prop="zwScore"
                        label="得分">
                    </el-table-column>
                    <el-table-column
                        prop="zwJs"
                        label="实际进深">
                    </el-table-column>
                    <el-table-column
                        prop="zwKj"
                        label="实际开间">
                    </el-table-column>
                    <el-table-column
                        prop="zwArea"
                        label="套内面积">
                    </el-table-column>
                    </el-table-column>
                    <el-table-column label="次卧1" align="center">
                    <el-table-column
                        prop="cw1Score"
                        label="得分">
                    </el-table-column>
                    <el-table-column
                        prop="cw1Js"
                        label="实际进深">
                    </el-table-column>
                    <el-table-column
                        prop="cw1Kj"
                        label="实际开间">
                    </el-table-column>
                    <el-table-column
                        prop="cw1Area"
                        label="套内面积">
                    </el-table-column>
                    </el-table-column>
                   <el-table-column label="次卧2" align="center">
                    <el-table-column
                        prop="cw2Score"
                        label="得分">
                    </el-table-column>
                    <el-table-column
                        prop="cw2Js"
                        label="实际进深">
                    </el-table-column>
                    <el-table-column
                        prop="cw2Kj"
                        label="实际开间">
                    </el-table-column>
                    <el-table-column
                        prop="cw2Area"
                        label="套内面积">
                    </el-table-column>
                    </el-table-column>
                   <el-table-column label="次卧3" align="center">
                    <el-table-column
                        prop="sfScore"
                        label="得分">
                    </el-table-column>
                    <el-table-column
                        prop="sfJs"
                        label="实际进深">
                    </el-table-column>
                    <el-table-column
                        prop="sfKj"
                        label="实际开间">
                    </el-table-column>
                    <el-table-column
                        prop="sfArea"
                        label="套内面积">
                    </el-table-column>
                    </el-table-column>
                   <el-table-column label="储藏间" align="center">
                    <el-table-column
                        prop="ccjScore"
                        label="得分">
                    </el-table-column>
                    <el-table-column
                        prop="ccjJs"
                        label="实际进深">
                    </el-table-column>
                    <el-table-column
                        prop="ccjKj"
                        label="实际开间">
                    </el-table-column>
                    <el-table-column
                        prop="ccjArea"
                        label="套内面积">
                    </el-table-column>
                    </el-table-column>
                   <el-table-column label="家政间" align="center">
                    <el-table-column
                        prop="jzjScore"
                        label="得分">
                    </el-table-column>
                    <el-table-column
                        prop="jzjJs"
                        label="实际进深">
                    </el-table-column>
                    <el-table-column
                        prop="jzjKj"
                        label="实际开间">
                    </el-table-column>
                    <el-table-column
                        prop="jzjArea"
                        label="套内面积">
                    </el-table-column>
                    </el-table-column>
                   <el-table-column label="独立衣帽间" align="center">
                    <el-table-column
                        prop="dlymjScore"
                        label="得分">
                    </el-table-column>
                    <el-table-column
                        prop="dlymjJs"
                        label="实际进深">
                    </el-table-column>
                    <el-table-column
                        prop="dlymjKj"
                        label="实际开间">
                    </el-table-column>
                    <el-table-column
                        prop="dlymjArea"
                        label="套内面积">
                    </el-table-column>
                    </el-table-column>
                   <el-table-column label="厨房" align="center">
                    <el-table-column
                        prop="cfScore"
                        label="得分">
                    </el-table-column>
                    <el-table-column
                        prop="cfJs"
                        label="实际进深">
                    </el-table-column>
                    <el-table-column
                        prop="cfKj"
                        label="实际开间">
                    </el-table-column>
                    <el-table-column
                        prop="cfArea"
                        label="套内面积">
                    </el-table-column>
                    </el-table-column>
                   <el-table-column label="第二厨房" align="center">
                    <el-table-column
                        prop="decfScore"
                        label="得分">
                    </el-table-column>
                    <el-table-column
                        prop="decfJs"
                        label="实际进深">
                    </el-table-column>
                    <el-table-column
                        prop="decfKj"
                        label="实际开间">
                    </el-table-column>
                    <el-table-column
                        prop="decfArea"
                        label="套内面积">
                    </el-table-column>
                    </el-table-column>
                    <el-table-column label="餐厅" align="center">
                    <el-table-column
                        prop="ctScore"
                        label="得分">
                    </el-table-column>
                    <el-table-column
                        prop="ctJs"
                        label="实际进深">
                    </el-table-column>
                    <el-table-column
                        prop="ctKj"
                        label="实际开间">
                    </el-table-column>
                    <el-table-column
                        prop="ctArea"
                        label="套内面积">
                    </el-table-column>
                    </el-table-column>
                    <el-table-column label="公卫" align="center">
                    <el-table-column
                        prop="gwScore"
                        label="得分">
                    </el-table-column>
                    <el-table-column
                        prop="gwJs"
                        label="实际进深">
                    </el-table-column>
                    <el-table-column
                        prop="gwKj"
                        label="实际开间">
                    </el-table-column>
                    <el-table-column
                        prop="gwArea"
                        label="套内面积">
                    </el-table-column>
                    </el-table-column>
                   <el-table-column label="主卧卫生间" align="center">
                    <el-table-column
                        prop="zwwsjScore"
                        label="得分">
                    </el-table-column>
                    <el-table-column
                        prop="zwwsjJs"
                        label="实际进深">
                    </el-table-column>
                    <el-table-column
                        prop="zwwsjKj"
                        label="实际开间">
                    </el-table-column>
                    <el-table-column
                        prop="zwwsjArea"
                        label="套内面积">
                    </el-table-column>
                    </el-table-column>
                   <el-table-column label="次卧卫生间" align="center">
                    <el-table-column
                        prop="cwwsjScore"
                        label="得分">
                    </el-table-column>
                    <el-table-column
                        prop="cwwsjJs"
                        label="实际进深">
                    </el-table-column>
                    <el-table-column
                        prop="cwwsjKj"
                        label="实际开间">
                    </el-table-column>
                    <el-table-column
                        prop="cwwsjArea"
                        label="套内面积">
                    </el-table-column>
                    </el-table-column>
                     <el-table-column label="其他公卫" align="center">
                    <el-table-column
                        prop="qtgwScore"
                        label="得分">
                    </el-table-column>
                    <el-table-column
                        prop="qtgwJs"
                        label="实际进深">
                    </el-table-column>
                    <el-table-column
                        prop="qtgwKj"
                        label="实际开间">
                    </el-table-column>
                    <el-table-column
                        prop="qtgwArea"
                        label="套内面积">
                    </el-table-column>
                    </el-table-column>
                   <el-table-column label="玄关" align="center">
                    <el-table-column
                        prop="xgScore"
                        label="得分">
                    </el-table-column>
                    <el-table-column
                        prop="xgJs"
                        label="实际进深">
                    </el-table-column>
                    <el-table-column
                        prop="xgKj"
                        label="实际开间">
                    </el-table-column>
                    <el-table-column
                        prop="xgArea"
                        label="套内面积">
                    </el-table-column>
                    </el-table-column>
                     <el-table-column label="阳台1" align="center">
                    <el-table-column
                        prop="yt1Score"
                        label="得分">
                    </el-table-column>
                    <el-table-column
                        prop="yt1Js"
                        label="实际进深">
                    </el-table-column>
                    <el-table-column
                        prop="yt1Kj"
                        label="实际开间">
                    </el-table-column>
                    <el-table-column
                        prop="yt1Area"
                        label="套内面积">
                    </el-table-column>
                    </el-table-column>
                  <el-table-column label="阳台2" align="center">
                    <el-table-column
                        prop="yt2Score"
                        label="得分">
                    </el-table-column>
                    <el-table-column
                        prop="yt2Js"
                        label="实际进深">
                    </el-table-column>
                    <el-table-column
                        prop="yt2Kj"
                        label="实际开间">
                    </el-table-column>
                    <el-table-column
                        prop="yt2Area"
                        label="套内面积">
                    </el-table-column>
                    </el-table-column>
                    <el-table-column label="其他小阳台" align="center">
                    <el-table-column
                        prop="qtxytScore"
                        label="得分">
                    </el-table-column>
                    <el-table-column
                        prop="qtxytJs"
                        label="实际进深">
                    </el-table-column>
                    <el-table-column
                        prop="qtxytKj"
                        label="实际开间">
                    </el-table-column>
                    <el-table-column
                        prop="qtxytArea"
                        label="套内面积">
                    </el-table-column>
                    </el-table-column>
                     <el-table-column
                        fixed="right"
                        label="操作"
                        width="120">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
                        <el-button @click="handleContrastClick(scope)" type="text" size="small" :style="{'color':scope.row.isComparison?'#E6A23C':''}">{{scope.row.isComparison?'取消对比':'加入对比'}}</el-button>
                    </template>
                    </el-table-column>
                </el-table>
                <div class="oprate_box">
                    <div class="btn_box">
                        <el-button type="warning" @click="handleContrast">户型对比</el-button>
                        <el-button type="primary" style="margin-left:40px;" @click="download">下载excel</el-button>
                        <div class="options_box">
                            <div class="options_item" v-for="(item,index) in contrastArr" :key ="index"> <span>{{item.houseName}}</span>  <i class="iconfont icon-guanbi" @click="deleteItem(index)"></i></div>
                        </div>
                    </div>
                    <el-pagination
                        layout="prev, pager, next"
                        :total="totalPage"
                        @current-change="pageChange">
                    </el-pagination>
                </div>
            </div>
            <div :class="['contrast',showContrast?'contrast_active':'']">
                <div class="iconfont_box" @click="showContrast = false">
                    <i class="iconfont icon-guanbi"></i>
                </div>
                <div style="font-size:24px;letter-spacing:3px;width:100%;text-align:center;margin-top:15px;font-weight:700">户型对比</div>
                  <el-table
                    :data="contrastData"
                    style="width: 90%;margin-left:5%"
                    height="750"
                    :cell-style="contrastStyle"
                    stripe
                    row-key="id">
                    <el-table-column
                        prop="col0"
                        label="对比项"
                        width="200">
                    </el-table-column>
                    <el-table-column
                      v-for="(item,index) in contrastArr" :key="item.id"
                      :label="'对比户型' + (index+1)"
                       >
                         <template slot-scope="scope">
                             <p v-html="scope.row['col' + (index + 1)]"></p>
                         </template>
                    </el-table-column>
                </el-table>
            </div>
            <div :class="['pic_box',showPic?'pic_box_active':'']"  @click="showPic = false">
                  <el-image
                    class="img"
                    :src="picUrl"
                    fit="contain"
                    ></el-image>
            </div>
    </div>
</template>
<script>
import axios from "axios";
import request from "@/utils/request";
import fileDownload from 'js-file-download'//文件流下载
export default {
    data(){
        return {
            tableData: [],
            pointArr:[],
            active: 0,
            hasImage:false,
            dialogVisible: false,
            data: [],
            value:[],
            finalScore:"",
            showResult:false,
            showList:false,
            token:localStorage.getItem("token"),
            ruleForm:{
                ownRate:"",
                area:"",
                buildingName:'',
                houseName:'',
                value:['外轮廓']
            },
            totalPage:0,
            picUrl:'',
            page:1,
            rules:{
                ownRate:[{ required: true, message: '请输入公摊率', trigger: 'blur' }],
                area:[ { required: true, message: '请输入建筑面积', trigger: 'blur' }],
                buildingName:[{ required: true, message: '请选择项目名称', trigger: 'blur' }],
                houseName:[ { required: true, message: '请输入户型名称', trigger: 'blur' }],
                value:[{ required: true, message: '请添加房间配置', trigger: 'change' }]
            },
            firstClick:true,
            showQuestion:false, 
            showStep:true,
            requestUrl:process.env.BASE_URL,
            showPic:false,
            questions:[],
            answer:[],
            showContrast:false,
            content:`户型评测是嵌入在客研社D2D系统的一个功能模块，用户通过上传户型图，绘制房间轮廓。我们将通过大数据去做户型对比，来评出你的户型分数。`,
            contrastData:[],
            contrastArr:[]
        }
    },
    methods:{
        deleteItem(i){
            this.contrastArr.splice(i,1)
        },
        download(){
            request({
                url:'/pms/hxpc/house/export',
                methods:'get',
                responseType: 'blob',
                params:{}
            }).then(res=>{
                fileDownload(res.data,'户型评测列表.xls')
            })
        },
        querySearch(qs,cb){
            console.log(qs,cb)   
            request({
                url:'pms/hxpc/house/buildings',
                methods:'get',
                params:{
                    name:qs
                }
            }).then(res=>{
                console.log(res.data.data)
                cb(res.data.data)
            })
        },
        showViewList(){
            this.showList = true
            this.getViewList(1,10)
        },
        contrastStyle(row, column, rowIndex, columnIndex){
        if(row.column.label === '对比项'){
            return 'color:#35AFFB;font-weight:700'
            }
        },
        handleContrast(){
            if(this.contrastArr.length === 0){
                this.$message({
                    message: '请添加对比项',
                    type: 'warning'
                })
           }else{
               console.log(this.contrastArr)
               let contrastArr = this.contrastArr
               let contrastData = [
                   {col0:'户型图'},{col0:'户型名称'},{col0:'项目名称'},{col0:'总得分'},{col0:'设计因子'},
               {col0:'客厅 | 得分',children:[
                   {col0:'实际进深'},{col0:'实际开间'},{col0:'套内面积'}
               ]},
               {col0:'第二客厅 | 得分',children:[
                   {col0:'实际进深'},{col0:'实际开间'},{col0:'套内面积'}
               ]},
               {col0:'主卧 | 得分',children:[
                   {col0:'实际进深'},{col0:'实际开间'},{col0:'套内面积'},
               ]},
               {col0:'次卧1 | 得分',children:[
                   {col0:'实际进深'},{col0:'实际开间'},{col0:'套内面积'},
               ]},
               {col0:'次卧2 | 得分',children:[
                   {col0:'实际进深'},{col0:'实际开间'},{col0:'套内面积'},
               ]},
               {col0:'次卧3 | 得分',children:[
                   {col0:'实际进深'},{col0:'实际开间'},{col0:'套内面积'},
               ]},
               {col0:'储藏间 | 得分',children:[
                   {col0:'实际进深'},{col0:'实际开间'},{col0:'套内面积'},
               ]},
               {col0:'家政间 | 得分',children:[
                   {col0:'实际进深'},{col0:'实际开间'},{col0:'套内面积'},
               ]},
               {col0:'独立衣帽间 | 得分',children:[
                   {col0:'实际进深'},{col0:'实际开间'},{col0:'套内面积'},
               ]},
               {col0:'厨房 | 得分',children:[
                   {col0:'实际进深'},{col0:'实际开间'},{col0:'套内面积'},
               ]},
               {col0:'第二厨房 | 得分',children:[
                   {col0:'实际进深'},{col0:'实际开间'},{col0:'套内面积'},
               ]},
               {col0:'餐厅 | 得分',children:[
                   {col0:'实际进深'},{col0:'实际开间'},{col0:'套内面积'},
               ]},
               {col0:'公卫 | 得分',children:[
                   {col0:'实际进深'},{col0:'实际开间'},{col0:'套内面积'},
               ]},
                {col0:'主卧卫生间 | 得分',children:[
                   {col0:'实际进深'},{col0:'实际开间'},{col0:'套内面积'},
               ]},
                {col0:'次卧卫生间 | 得分',children:[
                   {col0:'实际进深'},{col0:'实际开间'},{col0:'套内面积'},
               ]},
                {col0:'其他公卫 | 得分',children:[
                   {col0:'实际进深'},{col0:'实际开间'},{col0:'套内面积'},
               ]},
                {col0:'玄关 | 得分',children:[
                   {col0:'实际进深'},{col0:'实际开间'},{col0:'套内面积'},
               ]},
                {col0:'阳台1 | 得分',children:[
                   {col0:'实际进深'},{col0:'实际开间'},{col0:'套内面积'},
               ]},
                {col0:'阳台2 | 得分',children:[
                   {col0:'实际进深'},{col0:'实际开间'},{col0:'套内面积'},
               ]},
                {col0:'其他小阳台 | 得分',children:[
                   {col0:'实际进深'},{col0:'实际开间'},{col0:'套内面积'},
               ]},
            //    {col0:'次卧1 | 得分'},{col0:'次卧1 | 实际进深'},{col0:'次卧1 | 实际开间'},{col0:'次卧1 | 套内面积'},
            //    {col0:'次卧2 | 得分'},{col0:'次卧2 | 实际进深'},{col0:'次卧2 | 实际开间'},{col0:'次卧2 | 套内面积'},
            //    {col0:'次卧3 | 得分'},{col0:'次卧3 | 实际进深'},{col0:'次卧3 | 实际开间'},{col0:'次卧3 | 套内面积'},
            //    {col0:'储藏间 | 得分'},{col0:'储藏间 | 实际进深'},{col0:'储藏间 | 实际开间'},{col0:'储藏间 | 套内面积'},
            //    {col0:'家政间 | 得分'},{col0:'家政间 | 实际进深'},{col0:'家政间 | 实际开间'},{col0:'家政间 | 套内面积'},
            //    {col0:'独立衣帽间 | 得分'},{col0:'独立衣帽间 | 实际进深'},{col0:'独立衣帽间 | 实际开间'},{col0:'独立衣帽间 | 套内面积'},
            //    {col0:'厨房 | 得分'},{col0:'厨房 | 实际进深'},{col0:'厨房 | 实际开间'},{col0:'厨房 | 套内面积'},
            //    {col0:'第二厨房 | 得分'},{col0:'第二厨房 | 实际进深'},{col0:'第二厨房 | 实际开间'},{col0:'第二厨房 | 套内面积'},
            //    {col0:'餐厅 | 得分'},{col0:'餐厅 | 实际进深'},{col0:'餐厅 | 实际开间'},{col0:'餐厅 | 套内面积'},
            //    {col0:'公卫 | 得分'},{col0:'公卫 | 实际进深'},{col0:'公卫 | 实际开间'},{col0:'公卫 | 套内面积'},
            //    {col0:'主卧卫生间 | 得分'},{col0:'主卧卫生间 | 实际进深'},{col0:'主卧卫生间 | 实际开间'},{col0:'主卧卫生间 | 套内面积'},
            //    {col0:'次卧卫生间 | 得分'},{col0:'次卧卫生间 | 实际进深'},{col0:'次卧卫生间 | 实际开间'},{col0:'次卧卫生间 | 套内面积'},
            //    {col0:'其他公卫 | 得分'},{col0:'其他公卫 | 实际进深'},{col0:'其他公卫 | 实际开间'},{col0:'其他公卫 | 套内面积'},
            //    {col0:'玄关 | 得分'},{col0:'玄关 | 实际进深'},{col0:'玄关 | 实际开间'},{col0:'玄关 | 套内面积'},
            //    {col0:'阳台1 | 得分'},{col0:'阳台1 | 实际进深'},{col0:'阳台1 | 实际开间'},{col0:'阳台1 | 套内面积'},
            //    {col0:'阳台2 | 得分'},{col0:'阳台2 | 实际进深'},{col0:'阳台2 | 实际开间'},{col0:'阳台2 | 套内面积'},
            //    {col0:'其他小阳台 | 得分'},{col0:'其他小阳台 | 实际进深'},{col0:'其他小阳台 | 实际开间'},{col0:'其他小阳台 | 套内面积'},
               ]
            //    let keys = [{type:'houseName'},{type:'buildingName'},{type:'totalScore'},{type:'question'},{type:'ktScore',children:[{
            //        type:'ktJs',type:'ktKj',type:'ktArea'
            //    }]},'dektScore','dektJs',
            //         'dektKj','dektArea','zwScore','zwJs','zwKj','zwArea','cw1Score','cw1Js','cw1Kj','cw1Area','cw2Score','cw2Js','cw2Kj','cw2Area',
            //         'sfScore','sfJs','sfKj','sfArea','ccjScore','ccjJs','ccjKj','ccjArea','jzjScore','jzjJs','jzjKj','jzjArea','dlymjScore','dlymjJs','dlymjKj','dlymjArea',
            //         'cfScore','cfJs','cfKj','cfArea','decfScore','decfJs','decfKj','decfArea','ctScore','ctJs','ctKj','ctArea','gwScore','gwJs','gwKj','gwArea',
            //         'zwwsjScore','zwwsjJs','zwwsjKj','zwwsjArea','cwwsjScore','cwwsjJs','cwwsjKj','cwwsjArea','qtgwScore','qtgwJs','qtgwKj','qtgwArea',
            //         'xgScore','xgJs','xgKj','xgArea','yt1Score','yt1Js','yt1Kj','yt1Area',
            //         'yt2Score','yt2Js','yt2Kj','yt2Area','qtxytScore','qtxytJs','qtxytKj','qtxytArea',
            //     ]
            //    let i = 0;
            //    contrastArr.forEach((item,index)=>{
            //        keys.forEach((item1,index1)=>{
            //             contrastData[index1]['col'+ (index +1)] = item[item1]
            //             contrastData[index1]['id'] = index1
            //             if(item.children){
            //                 item.children.forEach((item2,index2)=>{
            //                     contrastData[index1].children[index2]['col'+ (index +1)] = item1[item2]
            //                     contrastData[index1].children[index2].id = Math.random()
            //                 })
            //             }
            //        })
                   
            //    })
                contrastArr.forEach((item,index)=>{
                    contrastData[0]['col' + (index +1)] = `<img style="width:70%" src="${item.houseUrl}"></img>`
                    contrastData[1]['col' + (index +1)] = item.houseName
                    contrastData[2]['col' + (index +1)] = item.buildingName
                    contrastData[3]['col' + (index +1)] = item.totalScore
                    contrastData[4]['col' + (index +1)] = item.question
                    contrastData[5]['col' + (index +1)] = item.ktScore
                    contrastData[5].children[0]['col' + (index +1)] = item.ktJs
                    contrastData[5].children[1]['col' + (index +1)] = item.ktKj
                    contrastData[5].children[2]['col' + (index +1)] = item.ktArea
                    contrastData[6]['col' + (index +1)] = item.dektScore
                    contrastData[6].children[0]['col' + (index +1)] = item.dektJs
                    contrastData[6].children[1]['col' + (index +1)] = item.dektKj
                    contrastData[6].children[2]['col' + (index +1)] = item.dektArea
                    contrastData[7]['col' + (index +1)] = item.zwScore
                    contrastData[7].children[0]['col' + (index +1)] = item.zwJs
                    contrastData[7].children[1]['col' + (index +1)] = item.zwKj
                    contrastData[7].children[2]['col' + (index +1)] = item.zwArea
                    contrastData[8]['col' + (index +1)] = item.cw1Score
                    contrastData[8].children[0]['col' + (index +1)] = item.cw1Js
                    contrastData[8].children[1]['col' + (index +1)] = item.cw1Kj
                    contrastData[8].children[2]['col' + (index +1)] = item.cw1Area
                    contrastData[9]['col' + (index +1)] = item.cw2Score
                    contrastData[9].children[0]['col' + (index +1)] = item.cw2Js
                    contrastData[9].children[1]['col' + (index +1)] = item.cw2Kj
                    contrastData[9].children[2]['col' + (index +1)] = item.cw2Area
                    contrastData[10]['col' + (index +1)] = item.sfScore
                    contrastData[10].children[0]['col' + (index +1)] = item.sfJs
                    contrastData[10].children[1]['col' + (index +1)] = item.sfKj
                    contrastData[10].children[2]['col' + (index +1)] = item.sfArea
                    contrastData[11]['col' + (index +1)] = item.ccjScore
                    contrastData[11].children[0]['col' + (index +1)] = item.ccjJs
                    contrastData[11].children[1]['col' + (index +1)] = item.ccjKj
                    contrastData[11].children[2]['col' + (index +1)] = item.ccjArea
                    contrastData[12]['col' + (index +1)] = item.jzjScore
                    contrastData[12].children[0]['col' + (index +1)] = item.jzjJs
                    contrastData[12].children[1]['col' + (index +1)] = item.jzjKj
                    contrastData[12].children[2]['col' + (index +1)] = item.jzjArea
                    contrastData[13]['col' + (index +1)] = item.dlymjScore
                    contrastData[13].children[0]['col' + (index +1)] = item.dlymjJs
                    contrastData[13].children[1]['col' + (index +1)] = item.dlymjKj
                    contrastData[13].children[2]['col' + (index +1)] = item.dlymjArea
                    contrastData[14]['col' + (index +1)] = item.cfScore
                    contrastData[14].children[0]['col' + (index +1)] = item.cfJs
                    contrastData[14].children[1]['col' + (index +1)] = item.cfKj
                    contrastData[14].children[2]['col' + (index +1)] = item.cfArea
                    contrastData[15]['col' + (index +1)] = item.decfScore
                    contrastData[15].children[0]['col' + (index +1)] = item.decfJs
                    contrastData[15].children[1]['col' + (index +1)] = item.decfKj
                    contrastData[15].children[2]['col' + (index +1)] = item.decfArea
                    contrastData[16]['col' + (index +1)] = item.ctScore
                    contrastData[16].children[0]['col' + (index +1)] = item.ctJs
                    contrastData[16].children[1]['col' + (index +1)] = item.ctKj
                    contrastData[16].children[2]['col' + (index +1)] = item.ctArea
                    contrastData[17]['col' + (index +1)] = item.gwScore
                    contrastData[17].children[0]['col' + (index +1)] = item.gwJs
                    contrastData[17].children[1]['col' + (index +1)] = item.gwKj
                    contrastData[17].children[2]['col' + (index +1)] = item.gwArea
                    contrastData[18]['col' + (index +1)] = item.zwwsjScore
                    contrastData[18].children[0]['col' + (index +1)] = item.zwwsjJs
                    contrastData[18].children[1]['col' + (index +1)] = item.zwwsjKj
                    contrastData[18].children[2]['col' + (index +1)] = item.zwwsjArea
                    contrastData[19]['col' + (index +1)] = item.cwwsjScore
                    contrastData[19].children[0]['col' + (index +1)] = item.cwwsjJs
                    contrastData[19].children[1]['col' + (index +1)] = item.cwwsjKj
                    contrastData[19].children[2]['col' + (index +1)] = item.cwwsjArea
                    contrastData[20]['col' + (index +1)] = item.qtgwScore
                    contrastData[20].children[0]['col' + (index +1)] = item.qtgwJs
                    contrastData[20].children[1]['col' + (index +1)] = item.qtgwKj
                    contrastData[20].children[2]['col' + (index +1)] = item.qtgwArea
                    contrastData[21]['col' + (index +1)] = item.xgScore
                    contrastData[21].children[0]['col' + (index +1)] = item.xgJs
                    contrastData[21].children[1]['col' + (index +1)] = item.xgKj
                    contrastData[21].children[2]['col' + (index +1)] = item.xgArea
                    contrastData[22]['col' + (index +1)] = item.yt1Score
                    contrastData[22].children[0]['col' + (index +1)] = item.yt1Js
                    contrastData[22].children[1]['col' + (index +1)] = item.yt1Kj
                    contrastData[22].children[2]['col' + (index +1)] = item.yt1Area
                    contrastData[23]['col' + (index +1)] = item.yt2Score
                    contrastData[23].children[0]['col' + (index +1)] = item.yt2Js
                    contrastData[23].children[1]['col' + (index +1)] = item.yt2Kj
                    contrastData[23].children[2]['col' + (index +1)] = item.yt2Area
                    contrastData[24]['col' + (index +1)] = item.qtxytScore
                    contrastData[24].children[0]['col' + (index +1)] = item.qtxytJs
                    contrastData[24].children[1]['col' + (index +1)] = item.qtxytKj
                    contrastData[24].children[2]['col' + (index +1)] = item.qtxytArea
                })
                contrastData.forEach(item=>{
                    item.id = Math.random()
                    if(item.children){
                        item.children.forEach(item1=>{
                            item1.id = Math.random()
                        })
                    }
                })
                contrastArr.forEach((item,index)=>{
                    let str = ''
                    item.question.split(';').forEach(item1=>{
                        str += `<p>${item1}</p>`
                    })
                    contrastData[4]['col'+ (index +1)] = str
                })
                this.contrastData = contrastData
                console.log(contrastData)
                this.showContrast = true
           }
        },
        handleSelect(item){
            console.log(item)
        },
        cellStyle(row, column, rowIndex, columnIndex){
        if(row.column.label === '户型名称'){
            return 'color:#35AFFB;cursor:pointer'
            }
        },
        cellClick(row, column, cell, event){
          if(column.label === '户型名称'){
              this.showPic = true
              this.picUrl = row.houseUrl
          }
         },
         handleSelectionChange(val){
            console.log(val)
         },
        handleClick(val){
            console.log(val.id)
            this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    request({
                        url:'pms/hxpc/house/remove',
                        methods:'get',
                        params:{
                            ids:val.id
                        }
                    }).then(res=>{
                        console.log(res)
                        if(res.data.code == 500){
                              this.$message({
                                type: 'info',
                                message: '你没有相关权限'
                            });          
                        }else if(res.data.code === 0){
                            this.getViewList(this.page,10)
                             this.$message({
                                message: `删除成功`,
                                type: 'success',
                                duration:1500
                            })
                        }
                    })
               
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        handleContrastClick(val){
                // if(!this.tableData[val.$index].isComparison){
                    if(this.contrastArr.length > 3){
                        this.$message({
                            message: '最多对比四条',
                            type: 'warning'
                        })
                    }else{
                        this.contrastArr.push(val.row)
                    }
                    // this.tableData[val.$index].isComparison = !this.tableData[val.$index].isComparison
                   
                // }else{
                //     this.tableData[val.$index].isComparison = !this.tableData[val.$index].isComparison
                //     this.contrastArr.forEach((item,index)=>{
                //         if(item.id === val.row.id){
                //             this.contrastArr.splice(index,1)
                //         }
                //     })
                // }
                console.log(this.contrastArr)
           
        },
        pageChange(i){
            this.page = i
            this.getViewList(this.page,10)
        },
        clear(){
            this.ruleForm={ownRate:"",area:"",value:['外轮廓'],buildingName:'',houseName:'',}
            this.content = '户型评测是嵌入在客研社D2D系统的一个功能模块，用户通过上传户型图，绘制房间轮廓。我们将通过大数据去做户型对比，来评出你的户型分数。'
            this.active = 0;
            this.showResult = false
            this.finalScore = ""
            this.chooseRoom=null
            this.questions.forEach(item=>{
               delete  item.value 
            })
        },
        copyScore(){
            if(this.showResult){
                this.$refs.input.value = this.finalScore
                this.$refs.input.select()
                document.execCommand('Copy')
                this.$message({
                    message: `分数复制成功`,
                    type: 'success',
                    duration:1500
                })
            }
        },
        revocation(){
            console.log("我撤回了一步")
            console.log(this.pointArr)
            const canvas = document.getElementById('houseCanvas')
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0,0,800,800)
            this.pointArr.pop();
            let img = new Image()
            img.src = this.imageUrl;
            img.onload = ()=>{
                if(img.complete){
                    //  根据图像重新设定了canvas的长宽
                    console.log(img.width/img.height)
                    let b = img.width/img.height //算出长宽比
                    if(b>=1){
                        canvas.setAttribute("width",800);
                        canvas.setAttribute("height",800 / b)
                        //  绘制图片
                    ctx.drawImage(img,0,0,800,800 / b)
                    this.draw()
                    }else{
                        canvas.setAttribute("width",800 * b)
                        canvas.setAttribute("height",800);
                        //  绘制图片
                    ctx.drawImage(img,0,0,800*b,800)
                    this.draw()
                    }
                }
            }
        },
        compute(){
            this.loading = this.$loading({
                        lock: true,
                        text: '云计算中,请稍等...',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
            axios.post(this.requestUrl + '/pms/hxpc/house/compute',{
                        houseId:this.houseId ,
                        designs:this.answer
                    },{
                        headers:{
                            token:this.token,
                            'Content-Type': 'application/json'
                        }
                    }).then(res=>{
                        this.loading.close()
                        this.showResult = true
                        this.finalScore = res.data.data.score
                        this.eva = res.data.data.eva
                        console.log(this.eva)
                        let evaTotal = 0;
                        this.eva.forEach(item=>{
                            evaTotal += item.score
                        })
                        this.evaTotal = evaTotal
                        this.propertyScore = res.data.data.propertyScore
                        console.log(this.propertyScore)
                        let propertyScoreTotal = 0;
                        this.propertyScore.forEach(item=>{
                            propertyScoreTotal += item.score
                        })
                        this.propertyScoreTotal = propertyScoreTotal
                    })
        },
        chooseAns(){
            let questions = this.questions;
            this.answer = []
            questions.forEach(item=>{
                if(item.value !== undefined){
                    this.answer.push(item.value)
                }
            })
            console.log(this.answer)
            this.showQuestion = false;
            if(this.active === this.ruleForm.value.length){
                this.compute()
            }
        },
        handleClose(done) {
            this.$confirm('填写完整后，确定关闭对话框')
            .then(_ => {
                done();
            })
            .catch(_ => {});
        },
        submitForm(formName) {
        console.log(this.$refs[formName])
        this.$refs[formName].validate((valid) => {//表单验证成功
        console.log(valid)
          if (valid) {
            console.log('submit!');
            this.$refs.upload.submit();
            this.$refs.upload1.submit()
            this.dialogVisible = false;
            console.log(this.ruleForm.value)
            console.log(this.data)
            let chooseRoom = []
            let data = this.data
            let value = this.ruleForm.value
            value.forEach(item=>{
                data.forEach(item1=>{
                    if(item1.label === item){
                        chooseRoom.push(item1)
                    }
                })
            })
            this.showStep = false;
            setTimeout(_=>{
                this.showStep = true;
            })
            console.log(chooseRoom)
            this.chooseRoom = chooseRoom
          } else {
            console.log('error submit!!');
            // this.dialogVisible = false
            return false;
          }
        });
      },
        handleChange(file,fileList){
            if(this.firstClick || !this.houseId){
                this.dialogVisible = true
                this.imageUrl = file.url
                this.hasImage = true;
                this.pointArr = [];
                const canvas = document.getElementById('houseCanvas')
                const ctx = canvas.getContext("2d");
                let img = new Image()
                img.src = this.imageUrl;
                img.onload = function(){
                    if(img.complete){
                    //  根据图像重新设定了canvas的长宽
                    console.log(img.width/img.height)
                        let b = img.width/img.height //算出长宽比
                        if(b>=1){
                            canvas.setAttribute("width",800);
                            canvas.setAttribute("height",800 / b)
                            //  绘制图片
                        ctx.drawImage(img,0,0,800,800 / b)
                        }else{
                            canvas.setAttribute("width",800 * b)
                            canvas.setAttribute("height",800);
                            //  绘制图片
                        ctx.drawImage(img,0,0,800*b,800)
                        }
                    }
                }
            }
        },
        handleSuccess(res){
            this.houseId = res.data.searchResult.id;
            this.firstClick = false;
            console.log(this.houseId) 
            setTimeout(()=>{
                this.firstClick=true
            },500)
        },
        next() {
           this.active++;
           console.log(this.active,this.ruleForm.value.length)
           if(this.active === this.ruleForm.value.length){
                this.$message({
                        message: `全部模块绘制完成`,
                        type: 'success',
                        duration:1500
                    })
               if(this.chooseRoom[this.active - 1].questions.length === 0){
                    this.compute();
                }
           }
        },
       //去除处在同一条直线的不同坐标点
       processingData(arr){
           for(let i = 0; i < arr.length; i++){
               if(i < arr.length - 2){
                    if((arr[i][0] == arr[i+1][0] && arr[i+1][0] == arr[i+2][0]) || (arr[i][1] == arr[i+1][1] &&  arr[i+1][1] == arr[i+2][1])){
                        arr.splice(i+1,1)
                        i--
                   }
                }
            }
           return arr
       },
        setPoint($event){
            let x = $event.layerX;
            let y = $event.layerY;
            if(this.pointArr.length ===0){
                this.pointArr.push({x:x,y:y})
            }else if(this.pointArr.length >=1){
                if(Math.abs(x-this.pointArr[0].x) <= 5 && Math.abs(y-this.pointArr[0].y) <= 5){ //判断用户绘制轮廓闭合
                     this.$confirm('是否闭合进行绘制下个功能间?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                        if(Math.abs(x-this.pointArr[this.pointArr.length - 1].x) <=Math.abs(y-this.pointArr[this.pointArr.length - 1].y)){//x坐标轴高于y轴偏移量
                            this.pointArr.push({x:this.pointArr[this.pointArr.length - 1].x,y:this.pointArr[0].y})
                            this.pointArr.push({ x:this.pointArr[0].x, y:this.pointArr[0].y})
                        }else{
                            this.pointArr.push({x:this.pointArr[0].x,y:this.pointArr[this.pointArr.length - 1].y})
                            this.pointArr.push({ x:this.pointArr[0].x, y:this.pointArr[0].y})
                        }
                        this.draw();
                        this.$message({
                            message: `${this.ruleForm.value[this.active]}模块绘制完成`,
                            type: 'success',
                            duration:1500
                        })
                        let pointArr = this.pointArr;
                        let pointArr2 = []
                        pointArr.forEach(item=>{
                            pointArr2.push([item.x,item.y])
                        })
                        pointArr2.pop()
                        pointArr2.shift()
                        console.log(pointArr2)
                        pointArr2 = this.processingData(pointArr2)
                        console.log(pointArr2)
                        this.pointArr = []//清空点的状态，然后重绘图片 
                        const canvas = document.getElementById('houseCanvas')
                        const ctx = canvas.getContext("2d");
                        let img = new Image()
                        img.src = this.imageUrl;
                        img.onload = ()=>{
                            setTimeout(()=>{
                                if(this.active < this.ruleForm.value.length){
                                    this.$message({
                                        message: `请绘制${this.ruleForm.value[this.active]}`,
                                        type: 'warning'
                                    })
                                }
                                if(img.complete){
                                //  根据图像重新设定了canvas的长宽
                                    console.log(img.width/img.height)
                                        let b = img.width/img.height //算出长宽比
                                        if(b>=1){
                                            canvas.setAttribute("width",800);
                                            canvas.setAttribute("height",800 / b)
                                            //  绘制图片
                                        ctx.drawImage(img,0,0,800,800 / b)
                                        }else{
                                            canvas.setAttribute("width",800 * b)
                                            canvas.setAttribute("height",800);
                                            //  绘制图片
                                        ctx.drawImage(img,0,0,800*b,800)
                                        }
                                    }

                            },1800)
                        }
                        //如果有问题 可以弹出
                        console.log(this.data)
                        console.log(this.active)
                        console.log(this.chooseRoom)
                        if(this.chooseRoom[this.active].questions.length !== 0){
                            console.log('该功能间有问题')
                            this.showQuestion  = true
                            this.questions = this.chooseRoom[this.active].questions
                            console.log(this.questions)
                        }
                        //发起请求
                        axios.post(this.requestUrl + '/pms/hxpc/house/collect',{
                            houseId:this.houseId,
                            blockId:this.chooseRoom[this.active].id,
                            roomInfo:pointArr2
                        },{
                            headers:{
                                token:this.token,
                                'Content-Type': 'application/json'
                            }
                        }).then(res=>{
                            console.log(res)
                            this.next();
                        })
                        }).catch(() => {        
                    });
                }else{
                    if(Math.abs(x-this.pointArr[this.pointArr.length - 1].x) <=Math.abs(y-this.pointArr[this.pointArr.length - 1].y)){//x坐标轴高于y轴偏移量
                        this.pointArr.push({x:this.pointArr[this.pointArr.length - 1].x,y:y})
                    }else{
                        this.pointArr.push({x:x,y:this.pointArr[this.pointArr.length - 1].y})
                }
            }
        }
        this.draw();
    },
        draw(){
            const canvas = document.getElementById('houseCanvas')
            const ctx = canvas.getContext("2d");
            let pointArr = this.pointArr;
            console.log(pointArr)
            ctx.fillStyle="#d01515";
            ctx.strokeStyle = "#d01515";
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            if(pointArr.length>1){
                for(var i = 0;i <pointArr.length; i++){           
                    if(i >=1){
                        ctx.beginPath();
                        ctx.arc(pointArr[i].x,pointArr[i].y,2,0,360);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.moveTo(pointArr[i-1].x,pointArr[i-1].y)
                        ctx.lineTo(pointArr[i].x,pointArr[i].y)
                        ctx.stroke();
                    }
                }
            }else if(pointArr.length === 1){
                ctx.beginPath();
                ctx.arc(pointArr[0].x,pointArr[0].y,2,0,360);
            }
            ctx.stroke();
        },
        drawResult(){
            var position = {x: 0, y:300};
            var counter = 0;
            var minFontSize = 3;
            var angleDistortion = 0;
            var letters = `你的户型最终评分为${this.finalScore}分`;
            // Drawing variables
            var canvas;
            var context;
            var mouse = {x: 0, y: 0, down: false}

            function init() {
            canvas = document.getElementById('canvas');
            context = canvas.getContext( '2d' );
            canvas.width = 600;
            canvas.height = 600;
            
            canvas.addEventListener('mousemove', mouseMove, false);
            canvas.addEventListener('mousedown', mouseDown, false);
            canvas.addEventListener('mouseup',   mouseUp,   false);
            canvas.addEventListener('mouseout',  mouseUp,  false);  
            canvas.addEventListener('dblclick', doubleClick, false);
            
            window.onresize = function(event) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
             }
            }

            function mouseMove ( event ){
            mouse.x = event.layerX;
            mouse.y = event.layerY;
            draw();
            }

            function draw() {
            if ( mouse.down ) {
                var d = distance( position, mouse );
                var fontSize = minFontSize + d/2;
                var letter = letters[counter];
                var stepSize = textWidth( letter, 30 );
                
                if (d > stepSize) {
                var angle = Math.atan2(mouse.y-position.y, mouse.x-position.x);
                
                context.font = 30 + "px Georgia";
                
                context.save();
                context.translate( position.x, position.y);
                context.rotate( angle )
                context.fillText(letter,0,0);
                context.restore();

                counter++;
                if (counter > letters.length-1) {
                    counter = 0;
                }
                
                //console.log (position.x + Math.cos( angle ) * stepSize)
                position.x = position.x + Math.cos(angle) * stepSize;
                position.y = position.y + Math.sin(angle) * stepSize;

                }
            }     
            }

            function distance( pt, pt2 ){
            
            var xs = 0;
            var ys = 0;
            
            xs = pt2.x - pt.x;
            xs = xs * xs;
            
            ys = pt2.y - pt.y;
            ys = ys * ys;
            
            return Math.sqrt( xs + ys );
            }

            function mouseDown( event ){
                mouse.down = true;
                position.x = event.layerX;
                position.y = event.layerY;
            }

            function mouseUp( event ){
                mouse.down = false;
            }

            function doubleClick( event ) {
            canvas.width = canvas.width; 
            }

            function textWidth( string, size ) {
            context.font = size + "px Georgia";
            
            if ( context.fillText ) {
                return context.measureText( string ).width;
                } else if ( context.mozDrawText) {
                    return context.mozMeasureText( string );
                }
                
            };

            init();
        },
        getViewList(page,limit){
            request({
                url:'pms/hxpc/house/viewList',
                methods:'get',
                params:{
                    page,limit
                }
            }).then(res=>{
                let tableData = res.data.data.list
                tableData.forEach(item=>{
                    item.isComparison = false
                })
                this.tableData = tableData
                this.totalPage = res.data.data.total
            })
        }
        // drawLine($event){
        //     let x = $event.layerX;
        //     let y = $event.layerY;
        //     let startX = this.pointArr[this.pointArr.length - 1].x
        //     let startY = this.pointArr[this.pointArr.length - 1].y
        //     const canvas = document.getElementById('houseCanvas')
        //     const ctx = canvas.getContext("2d")
        //     ctx.strokeStyle = "#d01515";
        //     ctx.lineWidth = 2;
        //     ctx.lineCap = 'round';
        //     // ctx.clearRect(0,0,500,500)
        //     ctx.beginPath()
        //     ctx.moveTo(startX,startY);
        //     ctx.lineTo(x,y);
        //     ctx.stroke();
        // }
        
    },
    created(){
        request({
            url:'pms/hxpc/houseblock/list',
            methods:'get',
            params:{}
        }).then(res=>{
            console.log(res.data.data.searchResult)
            let searchResult = res.data.data.searchResult;
            let blockArr = []
            searchResult.forEach(item=>{
                blockArr.push({
                    key:item.block,
                    label:item.block,
                    questions:item.questions,
                    id:item.id,
                    url:item.img_url
                })
            })
            console.log(blockArr)
            blockArr.forEach(item=>{
                if(item.id == 0){
                    item.disabled = true
                    // item.questions = []
                }
            })
            this.data = blockArr
            console.log(this.data[0].url)
        }).catch(err=>{
            console.log(err)
        })
        this.getViewList(1,10)
    },
    mounted(){
        this.ctx = document.getElementById('houseCanvas').getContext("2d")
    }
}


</script>
<style lang="scss" scoped>
    .houseEva_wrap{
        background: #1A1F23;
        padding-top:5%;
        height:95%;
        width: 100%;
        position: absolute;
        .contrast{
            height:90%;
            width:90%;
            background: white;
            position: fixed;
            top:5%;
            left:5%;
            z-index:-100;
            transform: scale(0.5);
            transition: all 0.3s ease;
            opacity: 1;
            border-radius: 8px;
            border:1px solid rgba(0,0,0,0.3);
            box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
            .iconfont_box{
                position: absolute;
                right:20px;
                top:12px;
                height:36px;
                width:36px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                &:hover{
                    transform: rotate(180deg);
                    transition: all 0.3s ease;
                }
                .icon-guanbi{
                    font-size:22px;
                    margin-top:-13px;
                }
            }
        }
        .contrast_active{
            z-index: 100001;
            transform: scale(1);
            opacity: 1;
            transition: all 0.3s ease;
        }
        .list_box{
            height:90%;
            width:90%;
            background: white;
            position: fixed;
            top:5%;
            left:5%;
            z-index:-100;
            transform: scale(0.5);
            transition: all 0.3s ease;
            opacity: 0;
            border-radius: 8px;
            border:1px solid rgba(0,0,0,0.3);
            box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
            .iconfont_box{
                position: absolute;
                right:20px;
                top:12px;
                height:36px;
                width:36px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                &:hover{
                    transform: rotate(180deg);
                    transition: all 0.3s ease;
                }
                .icon-guanbi{
                    font-size:22px;
                    margin-top:-13px;
                }
            }
            .el-table{
               width:90%;
               margin-top:40px;
               margin-left:5%;
            }
            .oprate_box{
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top:40px;
                margin-left: 5%;
                .btn_box{
                    display: flex;
                    align-items: center;
                }
                .options_box{
                    display: flex;
                    margin-left:40px;
                    .options_item{
                        display: flex;
                        align-items: center;
                        background: #219ebc;
                        border:1px solid #219ebc;
                        color:white;
                        padding:6px 10px;
                        border-radius: 8px;
                        margin-right:15px;
                        user-select: none;
                        .icon-guanbi{
                            margin-top:-8px;
                            font-size:14px;
                            margin-left: 6px;
                            cursor: pointer;
                        }
                    }
                }
            }
            .el-pagination{
                text-align: right;
                margin-right:6%;
            }
        }
        .pic_box{
            position: fixed;
            height:100%;
            width:100%;
            top: 0;
            left:0;
           z-index: -100;
            transform: scale(0.5);
            opacity: 0;
            background: rgba(0,0,0,0);
            transition: all 0.3s ease;
            .img{
                height:100%;
                width:100%
            }
            
        }
        .pic_box_active{
            z-index: 1000000;
            transform: scale(1);
            opacity: 1;
            transition: all 0.3s ease;
            background: rgba(0,0,0,0.4);
        }
        .list_box_active{
            z-index: 100000;
            transform: scale(1);
            opacity: 1;
            transition: all 0.3s ease;
        }
        #houseCanvas{
            position: absolute;
            top:3%;
            left:3%;
            border:2px dashed gray;
            cursor: crosshair;
        }
        .add{
            height:800px;
            width:800px;
            z-index:99;
            position: absolute;
            top:3%;
            left:3%;
            &:hover{
                .line{
                    border-bottom:2px dashed #409EFF;
                }
                .vertical{
                    border-right:2px dashed #409EFF;
                }
                    
            }
            .upload{
                height:100%;
                width:100%;
                opacity: 0!important;
                .upload_button{
                    height:800px!important;
                    width:800px!important;
                }
            }
            .line{
                width:80%;
                height:1%;
                border-bottom:2px dashed gray;
                position: absolute;
                top:49%;
                left:10%;
                z-index: 99999;
                
            }
            .vertical{
                height:80%;
                width:1%;
                position: absolute;
                top:10%;
                left:49%;
                border-right:2px dashed gray;
                z-index: 99999;
            }
        }
        .steps{
            position: fixed;
            height:8%;
            width:90%;
            left:5%;
            bottom:0;
            background: #1A1F23;
             ::v-deep.el-step__line{
                    height: 3px;
                }
            ::v-deep .is-wait{
                color:#EDF6F9;
                font-weight: 700;
                // border-color:#131E2B!important;
                .is-text{
                    border: 1px solid #14213D;
                    .el-step__icon-inner{
                        color:#14213D;
                    }
                    
                }
            }
            ::v-deep .is-process{
                color:rgb(241, 175, 27);
                user-select: none;
                .is-text{
                    color:#00B8F5;
                    border: 1px solid #00B8F5;
                    .el-icon-check{
                        color:rgb(241, 175, 27);
                    }
                }
            }
            ::v-deep .is-success{
                color: rgb(241, 175, 27);
                font-weight: 700;
                border: 0;
                .is-text{
                    color:rgb(241, 175, 27);
                    border: 1px solid rgb(241, 175, 27);;
                    .el-icon-check{
                        color:rgb(241, 175, 27);
                    }
                }
                .el-step__line{
                    height: 3px;
                    background: rgb(241, 175, 27);
                }
            }

        }
        .dialog{
            .dialog_wrap{
                .ruleForm{
                    height:100%;
                    width:100%;
                }
                .floor_input{
                    width:45%;
                    
                    display: inline-block;
                }
                .area_input{
                    width:45%;
                    
                    display: inline-block;
                }
                .transfer{
                    height:100%;
                    width:100%;
                    
                }
                 .el-transfer-panel{
                    width:35%;
                    margin-top:5%;
                 }
                 .el-checkbox{
                     display: block;
                 }
                .el-transfer__buttons{
                    width:50px;
                    .el-button{
                        width:56px;
                        height:40px;
                        display: block;
                        margin-left:0;
                        margin-top:20px;
                    }
                }
                .el-checkbox-group{
                    &::-webkit-scrollbar{
                        display: none;
                    }
                }
            }
        }
        .content{
            height: 70%;
            width:50%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            float: right;
            .border_line{
                height:80%;
                width:2px;
                background: gray;
                border-radius: 50px;;
                margin-top:5%;
                margin-left:130px;
            }
            .button_box{

                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    margin-left:4%;
                    .el-button{
                        margin-top:30px;
                        margin-left:0;
                    }
                }
                .content_detail{
                    font-size:25px;
                    height:100%;
                    width:50%;
                    margin-left:10%;
                    overflow-y: scroll;
                    user-select: none;
                    color: #d68080;
                    letter-spacing: .1em;
                    text-shadow: 
                    -1px -1px 1px #111, 
                    2px 2px 1px #363636;
                    position: relative;
                    img{
                        width: 100%;
                    }
                    .res_box{
                        height: 100%;
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                        flex-wrap: wrap;
                        .res_item{
                            display: flex;
                            text-shadow: none;
                            font-size:18px;
                            text-align: center;
                            .label{
                                 border:  1px solid rgba(255,255,255,0.4);
                                 width: 65%;
                                 border-right: 0;
                                 text-align: center;
                                 padding: 4px ;
                                 color:#f1faee;
                            }
                            .value{
                                width: 35%;
                                text-align: center;
                                border:  1px solid rgba(255,255,255,0.4);
                                padding: 4px ;
                                color:#eee2df;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                            }
                        }
                    }
                }
                .result_box{
                    display: flex;
                    flex-direction: column;
                    margin-left:10%;
                    margin-top:-5%;
                }
                #canvas{
                    background: white;
                    cursor: crosshair;
                    // margin-left:10%;
                    border-radius: 10px;
                }
                #info{
                    height:150px;
                    font-size:20px;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color:#62c1f1;
                    user-select: none;
                    margin-bottom: 15px;
                }
               
        }

    }
       
</style>