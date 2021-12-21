<template>
    <el-dialog
        title="设置分段"
        :visible.sync="dialogVisible"
        width="40%"
        :append-to-body="true">
        <div class="box">
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="设置单价段" name="avg_size"></el-tab-pane>
                <el-tab-pane label="设置面积段" name="total_size"></el-tab-pane>
                <el-tab-pane label="设置总价段" name="area_size"></el-tab-pane>
            </el-tabs>
             <el-input v-model="groupName" placeholder="关键字搜索" style="width:200px" size="small">
                        <el-button slot="append" icon="el-icon-search" @click="searchGroup"></el-button>
                    </el-input>
                    <el-button type="primary"  style="margin-left:15px" size="small" @click="addRange">新建分组</el-button>
                <el-table
                    :data="groupData"
                    style="width: 100%;margin:40px 0;"
                    :height="tableHeight * 0.5">
                    <el-table-column
                    prop="name"
                    label="分组名称"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="range"
                    label="分组详情">
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="180">
                        <template slot-scope="scope">
                        <el-button type="text" size="small" @click="chooseGroup(scope.row)">{{scope.row.isChoose==1?'已选择':'选择'}}</el-button>
                        <el-button @click="handleEdit(scope.row)" type="text" size="small" v-if="scope.row.isDefault !='1'">编辑</el-button>
                        <el-popconfirm
                                    icon="el-icon-info"
                                    icon-color="red"
                                    title="确认要删除此分组吗？"
                                    style="margin-left:10px"
                                    @onConfirm="handleDelete(scope.row,scope.$index)"
                                    v-if="scope.row.isDefault !='1'">
                            <el-button slot="reference" type="text" size="small" v-if="scope.row.isDefault !='1'">删除</el-button>
                        </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
       <el-dialog
         :title="isEdited?'编辑分组':'新建分组'"
        :visible.sync="showGrouping"
        width="30%"
         :append-to-body="true">
        <div class="filter_box" style="margin-top:10px;display:flex">
            <el-input v-model="rangeForm.name" placeholder="分组名称" style="width:200px" size="small"></el-input>
          </div>
          <div class="instructions" style="margin-top:20px;margin-bottom:20px;">
             <i class="iconfont icon-tixing-tianchong" style="color:rgba(255, 141, 26, 1)"></i>
             <span class="text" style="color:rgba(0, 0, 0, 0.51)"> 输入一串以逗号分隔的递增数字，如50,70,90,110,130,150,200</span>
          </div>
          <span  v-if="activeName === 'area_size'">面积段</span>
          <span  v-if="activeName === 'avg_size'">单价段</span>
          <span  v-if="activeName === 'total_size'">总价段</span>
          <el-input v-model="rangeForm.range" placeholder="50,70,90,110,130,150,200" style="width:400px;margin-left:6px" size="small"></el-input>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showGrouping = false">取 消</el-button>
            <el-button type="primary" @click="addGroup">确 定</el-button>
        </span>
        </el-dialog>
    </el-dialog>
</template>
<script>
import House from "../../../api/houseDataApi"
export default {
    data(){
        return{
            dialogVisible: false,
            tableHeight:400,
            activeName:'avg_size',
            showGrouping:false,
            groupData:[],
            groupName:'',
            isEdited:false,
            rangeForm:{
              name:'',
              range:'',
              type:''
            }
        }
    },
    watch:{
        activeName(newVal){
            this.getGroupList(newVal)
        }
    },
    methods:{
        handleDelete(row){
            if(row.isChoose == 1){
                this.$message({
                    type:'warning',
                    message:'已选择的分组无法删除'
                })
                return
                }
                House.deleteRange(row.id).then(res=>{
                if(res.data.code === 0){
                    this.$message({
                    type:'success',
                    message:'删除成功:)'
                    })
                    this.getGroupList(this.type)
                }
            })
        },
        handleEdit(row){
            this.isEdited =true
            this.showGrouping = true
            this.rangeForm.name = row.name
            this.rangeForm.range =row.range
            this.rangeForm.id = row.id
        },
        chooseGroup(row){
            let params= {id:row.id,isChoose:1}
            House.updateRange(params).then(res=>{
                if(res.data.code === 0){
                    this.getGroupList(this.activeName)
                }
            })
        },
        addGroup(){
        if(this.isEdited){
          if(this.rangeForm.name === ''){
            this.$message({
              type:'warning',
              message:'请填写分组名称'
            })
            return
          }
          if(this.rangeForm.range === ''){
            this.$message({
              type:'warning',
              message:'请填写分组详情'
            })
            return
          }
          let range = this.rangeForm.range
          if(range.indexOf('，') != -1) {
            this.rangeForm.range = range.replace(/，/g,',')
          }
          delete this.rangeForm.type
          House.updateRange(this.rangeForm).then(res=>{
            if(res.data.code === 0){
              this.$message({
                type:'success',
                message:'修改成功:)'
              })
              this.showGrouping =false
              this.getGroupList(this.activeName)
            }
            
          })
        }else{
          if(this.rangeForm.name === ''){
            this.$message({
              type:'warning',
              message:'请填写分组名称'
            })
            return
          }
          if(this.rangeForm.range === ''){
            this.$message({
              type:'warning',
              message:'请填写分组详情'
            })
            return
          }
          let range = this.rangeForm.range
          if(range.indexOf('，') != -1) {
            this.rangeForm.range = range.replace(/，/g,',')
          }
          this.rangeForm.type = this.activeName
          House.addGroup(this.rangeForm).then(res=>{
            if(res.data.code === 0){
              this.$message({
                type:'success',
                message:'新增成功:)'
              })
              this.showGrouping =false
              this.getGroupList(this.activeName)
            }
          })
        }
       
      },
        addRange(){
            this.showGrouping = true
        },
        searchGroup(){
            this.getGroupList(this.activeName)
        },
        getGroupList(type){
            /*avg_size  total_size  area_size*/
            House.getGroupList(type,this.groupName).then(res=>{
            console.log(res.data.data.list)
            let data = res.data.data.list
            // data.forEach(item=>{
            //     if(item.isChoose == '1'){
            //     this[type] = this.disposeRange(item.range)
            //     }
            // })
            this.groupData = data
            })
        },
    },
    created(){
        this.getGroupList('avg_size')
    }
}
</script>
<style lang="scss" scoped>
.box{
    
}
</style>