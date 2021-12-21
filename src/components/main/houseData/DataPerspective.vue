<template>
  <div class="dataPerspective_wrap">
    <Loading v-if="showLoadng" />
      <el-select class="select" v-model="parameter" @focus="getParamsList" placeholder="已保存历史表单" clearable size="small" style="margin:4px 0 4px 15px" @change="changeParams">
        <el-option :label="item.name" :value="item.id" v-for="item in paramsList" :key="item.id"></el-option>
      </el-select>
      <div class="diver">
        <span>查询条件</span>
        <i class="iconfont icon-set_icon" @click="showSetting = true"></i>
      </div>
      <div class="from_box">
        <el-form :inline="true" :model="formInline" size="small" style="text-align: start;">
          <!-- <el-form-item label="">
              <el-select v-model="formInline.kind" placeholder="参数选择" clearable > -->
                <!-- <el-option :label="item.label" :value="item.value" v-for="item in regionArr" :key="item.value"></el-option> -->
              <!-- </el-select>
            </el-form-item> -->
            <el-form-item label="">
              <el-select v-model="formInline.dataType" placeholder="数据口径" >
                  <el-option :label="item.label" :value="item.value" v-for="item in statusArr" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-date-picker
                  v-model="date"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerTime">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="">
            <el-select v-model="regionnos" placeholder="请选择行政区" multiple :collapse-tags="true" clearable>
                <el-checkbox style="margin-left:20px;margin-top:6px;" :indeterminate="isAllRegionnos" v-model="regionnosAll" @change="regionsAllChange">全选</el-checkbox>
                <el-option :label="item.name" :value="item.id" v-for="(item) in regionsArr" :key="item.id"></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="partnos" placeholder="请选择板块" multiple :collapse-tags="true" clearable>
                  <el-checkbox style="margin-left:20px;margin-top:6px;" :indeterminate="isAllPlates" v-model="platesAll" @change="platesAllChange">全选</el-checkbox>
                  <el-option :label="item.name" :value="item.id" v-for="(item,index) in partNosArr" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="propertyTypes" placeholder="物业类型" multiple :collapse-tags="true" clearable>
                <el-option :label="item.label" :value="item.value" v-for="(item,index) in propertyArr" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-select  v-model="areaSizes" placeholder="请选择面积段" clearable multiple :collapse-tags="true">
               <el-checkbox style="margin-left:20px;margin-top:6px;" :indeterminate="isAllAreaSizes" v-model="areaSizesAll" @change="areaSizesAllChange">全选</el-checkbox>
               <el-option :label="item.label" :value="item.value" v-for="item in area" :key="item.value"></el-option>
              </el-select> 
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="avgSizes"  placeholder="请选择单价段" clearable multiple :collapse-tags="true">
                <el-checkbox style="margin-left:20px;margin-top:6px;" :indeterminate="isAllAvgSizes" v-model="avgSizesAll" @change="avgSizesAllChange">全选</el-checkbox>
               <el-option :label="item.label" :value="item.value" v-for="item in unit_price" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="totalSizes"  placeholder="请选择总价段" clearable multiple :collapse-tags="true">
              <el-checkbox style="margin-left:20px;margin-top:6px;" :indeterminate="isAllTotalSizes" v-model="totalSizesAll" @change="totalSizesAllChange">全选</el-checkbox>
               <el-option :label="item.label" :value="item.value" v-for="item in total_price" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <div class="line" ></div>
            <el-form-item label="">
              <el-select v-model="formInline.indexs"  placeholder="请选择横轴" @change="mutex">
                 <el-option :label="item.label" :value="item.label" v-for="(item,index) in rowColumn" :disabled="item.disabled" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="formInline.columns"  placeholder="请选择纵轴"  @change="mutex" clearable>
                <el-option :label="item.label" :value="item.label" v-for="(item,index) in rowColumn" :disabled="item.disabled" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="formInline.laxis"  placeholder="请选择从纵轴"  @change="mutex">
               <el-option :label="item.label" :value="item.label" v-for="(item,index) in rowColumn" :disabled="item.disabled" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="values"  placeholder="请选择值标签"  multiple :collapse-tags="true">
               <el-option :label="item" :value="item" v-for="(item,index) in valueArr" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="display:flex">
                <div class="save_btn" @click="dialogVisible = true" >保存参数</div>
                <div class="sub_btn" @click="getPerspective">点击查询</div>
            </el-form-item>
            <el-form-item style="width:100%" v-if="downUrl.length !== 0">
                <el-button type="primary" style="width:100%" @click="downLoadExcel">点击导出数据<i class="el-icon-download el-icon--right"></i></el-button>
            </el-form-item>
            </el-form>
        </div>
        <div :class="['list_mask']" >
          <div class="instructions">* 当前2021年9月及以后的数据已开通透视表功能。历史数据处理中，敬请期待。</div>
          <div v-html="perspectiveStr" class="perspective" v-if="perspectiveStr.length !== 0"></div>
        </div>
        <!-- <dv-border-box-12 class="mark_mask" v-else>
          
        </dv-border-box-12> -->
        <el-dialog
          title="保存参数"
          :visible.sync="dialogVisible"
          width="30%"
          :modal-append-to-body="false">
          <el-input v-model="addRangeName" placeholder="请输入参数名称" style="margin-top:20px"></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveParams">确 定</el-button>
          </span>
        </el-dialog>

        <el-dialog
          title="设置分段"
          :visible.sync="showSetting"
          width="50%"
          :modal-append-to-body="false"
          custom-class="setting_box">
          <div class="4" style="margin-top:10px">
            <div class="tabs">
              <div class="tabs_item"></div>
            </div>
            <el-select v-model="type"  placeholder="请选择分组"  style="width:200px" :clearable="false" size="small" @change="changeGroup">
              <el-option label="单价段" value="unit_price"></el-option>
              <el-option label="面积段" value="area"></el-option>
              <el-option label="总价段" value="total_price"></el-option>
            </el-select>
            <el-input v-model="groupName" placeholder="关键字搜索" style="width:200px;margin-left:15px" size="small">
              <el-button slot="append" icon="el-icon-search" @click="searchGroup"></el-button>
            </el-input>
            <el-button type="primary"  style="margin-left:15px" size="small" @click="addRange">新建分组</el-button>
          </div>
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
          <span slot="footer" class="dialog-footer">
            <el-button @click="showSetting = false">取 消</el-button>
            <el-button type="primary" @click="showSetting = false">确 定</el-button>
          </span>
      </el-dialog>
      <el-dialog
          :title="isEdited?'编辑分组':'新建分组'"
          :visible.sync="showGrouping"
          width="40%"
          :modal-append-to-body="false">
         <div class="filter_box" style="margin-top:10px;display:flex">
            <el-input v-model="rangeForm.name" placeholder="分组名称" style="width:200px;margin-left:15px" size="small"></el-input>
          </div>
          <div class="instructions" style="margin-top:20px;margin-left:15px;margin-bottom:20px;">
             <i class="iconfont icon-tixing-tianchong" style="color:rgba(255, 141, 26, 1)"></i>
             <span class="text" style="color:rgba(0, 0, 0, 0.51)">输入一串以逗号分隔的递增数字，如50,70,90,110,130,150,200</span>
          </div>
          <span style="margin-left:15px" v-if="type === 'area'">面积段</span>
          <span style="margin-left:15px" v-if="type === 'unit_price'">单价段</span>
          <span style="margin-left:15px" v-if="type === 'total_price'">总价段</span>
          <el-input v-model="rangeForm.range" placeholder="50,70,90,110,130,150,200" style="width:400px;margin-left:6px" size="small"></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showGrouping = false">取 消</el-button>
            <el-button type="primary" @click="addGroup">确 定</el-button>
          </span>
        </el-dialog>
  </div>
</template>

<script>
import House from "@/api/houseDataApi.js"
import Loading from "@/components/tools/loading.vue"
export default {
  components:{
    Loading
  },
    data(){
        return{
            dialogVisible: false,
            showLoadng:false,
            showSetting:false,
            showGrouping:false,
            name:"",
            date:null,
            isEdited:false,
            parameter:'',
            statusArr:[{
              label:'认购',
              value:'sub'
            },{
              label:'备案',
              value:'record'
            }],
            formInline:{
              dataType:'sub',
              startDate:"",
              endDate:'',
              regionnos:'',
              partnos:'',
              areaSizes:'',
              indexs:'',
              columns:'',
              values:'',
              usages:'',
              laxis:''
            },
            value1:'',
            axis:'',
            perspectiveStr:'',
            addRangeName:'',
            tableData: [],
            regionsArr:[],
            regionnos:'',
            partNosArr:[],
            partnos:[],
            propertyArr:[],
            propertyTypes:[],
            areaSizes:[],
            avgSizes:[],
            totalSizes:[],
            values:[],
            paramsList:[],
            type:'unit_price',
            unit_price:[],
            groupData:[],
            area:[],
            total_price:[],
            rowColumn:[
              {label:'月度',disabled:false},
              {label:'季度',disabled:false},
              {label:'年度',disabled:false},
              {label:'行政区',disabled:false},
              {label:'板块',disabled:false},
              {label:'项目名',disabled:false},
              {label:'开发商',disabled:false},
              {label:'物业类型',disabled:false},
              {label:'面积区间',disabled:false},
              {label:'均价区间',disabled:false},
              {label:'总价区间',disabled:false},
            ],
            valueArr:['新增套数(套)','新增面积(㎡)','销售套数(套)','销售面积(㎡)','销售均价(元/㎡)','销售总价(万元)','存量套数(套)','存量面积(㎡)'],
            groupName:'',
            rangeForm:{
              name:'',
              range:'',
              type:''
            },
            downUrl:'',
            pickerTime: {
            disabledDate(time) {
                return time.getTime() <= new Date('2021-06-30').getTime() || time.getTime() >= new Date().getTime();
            },
          },
          isAllRegionnos:false,
          regionnosAll:false,
          isAllPlates:false,
          platesAll:false,
          isAllAreaSizes:false,
          areaSizesAll:false,
          isAllAvgSizes:false,
          avgSizessAll:false,
          isAllTotalSizes:false,
          totalSizesAll:false,
          avgSizesAll:false,
        }
    },
    methods:{
      regionsAllChange(val){
        this.regionnos = val?this.regionsArr.map(item=>item.id):[]
      },
      platesAllChange(val){
        this.partnos = val?this.partNosArr.map(item=>item.id):[]
      },
      areaSizesAllChange(val){
        this.areaSizes = val?this.area.map(item=>item.value):[]
      },
      avgSizesAllChange(val){
        this.avgSizes = val?this.unit_price.map(item=>item.value):[]
      },
      totalSizesAllChange(val){
        this.totalSizes = val?this.total_price.map(item=>item.value):[]
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      downLoadExcel(){
        window.open(this.downUrl)
      },
      getPerspective(){
        if(this.formInline.indexs === '面积区间'|| this.formInline.columns === '面积区间' || this.formInline.laxis === '面积区间'){
          if(this.areaSizes.length === 0){
            this.$message({
              type:'warning',
              message:'请选择面积段'
            })
            return ;
          }
        }
        if(this.formInline.indexs === '均价区间'|| this.formInline.columns === '均价区间' || this.formInline.laxis === '均价区间'){
          if(this.avgSizes.length === 0){
            this.$message({
              type:'warning',
              message:'请选择单价段'
            })
            return ;
          }
        }
        if(this.formInline.indexs === '总价区间'|| this.formInline.columns === '总价区间' || this.formInline.laxis === '总价区间'){
          if(this.totalSizes.length === 0){
            this.$message({
              type:'warning',
              message:'请选择总价段'
            })
            return ;
          }
        }
        if(this.formInline.indexs === '月度'|| this.formInline.columns === '月度' || this.formInline.laxis === '月度' || this.formInline.indexs === '季度'|| this.formInline.columns === '季度' || this.formInline.laxis === '季度' || this.formInline.indexs === '年度'|| this.formInline.columns === '年度' || this.formInline.laxis === '年度'){
          if(this.date === null){
            this.$message({
              type:'warning',
              message:'请选择开始及结束日期'
            })
            return ;
          }
        }
        this.showLoadng = true
        House.getPerspective(this.formInline).then(res=>{
          this.showLoadng = false
          if(res.data.code == 0){
            this.perspectiveStr = res.data.data.table;
            this.downUrl = res.data.data.url
            if(res.data.data.table === ''){
              this.$message({
                type:'info',
                message:'暂无数据:('
              })
            }
          }else{
            this.$message({
              type:'warning',
              message:res.data.msg
            })
          }
        })
      },
      mutex(val){
        let arr = ['月度','季度','年度']
        this.rowColumn.forEach(item=>{
          item.disabled = false
          if(item.label === this.formInline.indexs || item.label === this.formInline.columns || item.label === this.formInline.laxis ){
            item.disabled = true
          }
          if(arr.includes(this.formInline.indexs) || arr.includes(this.formInline.columns) ||arr.includes(this.formInline.laxis)){
            this.rowColumn[0].disabled = true
            this.rowColumn[1].disabled = true
            this.rowColumn[2].disabled = true
          }
        })
      },
      changeParams(val){
        console.log(val)
        House.getParamsInfo(val).then(res=>{
          let params = JSON.parse(res.data.data.params)
          this.formInline.dataType = params.dataType;
          this.regionnos = params.regionnos;
          this.date = params.date;
          this.partnos = params.partnos;
          this.propertyTypes = params.propertyTypes;
          this.areaSizes = params.areaSizes;
          this.avgSizes = params.avgSizes;
          this.totalSizes = params.totalSizes;
          this.formInline.indexs = params.indexs;
          this.formInline.columns = params.columns;
          this.formInline.laxis = params.laxis;
          this.values = params.values
        })
      },
      getParamsList(){
        House.getParamsList().then(res=>{
          this.paramsList = res.data.data
        })
      },
      saveParams(){
        let params = {
          dataType:this.formInline.dataType,
          regionnos:this.regionnos,
          date:this.date,
          partnos:this.partnos,
          propertyTypes:this.propertyTypes,
          areaSizes:this.areaSizes,
          avgSizes:this.avgSizes,
          totalSizes:this.totalSizes,
          indexs:this.formInline.indexs,
          columns:this.formInline.columns,
          laxis:this.formInline.laxis,
          values:this.values
        }
        let paramsStr = JSON.stringify(params)
        House.saveParams(this.addRangeName,paramsStr).then(res=>{
          if(res.data.code === 0){
            this.$message({
              type:'success',
              message:'保存参数成功:)'
            })
            this.dialogVisible = false
          }
        })
      },
      addRange(){
        this.isEdited = false
        this.rangeForm = {name:'',range:'',type:''}
        this.showGrouping = true
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
              this.getGroupList(this.type)
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
          this.rangeForm.type = this.type
          House.addGroup(this.rangeForm).then(res=>{
            if(res.data.code === 0){
              this.$message({
                type:'success',
                message:'新增成功:)'
              })
              this.showGrouping =false
              this.getGroupList(this.type)
            }
          })
        }
       
      },
      searchGroup(){
        this.getGroupList(this.type)
      },
      getGroupList(type){
        House.getGroupList(type,this.groupName).then(res=>{
          console.log(res.data.data.list)
          let data = res.data.data.list
          data.forEach(item=>{
            if(item.isChoose == '1'){
               this[type] = this.disposeRange(item.range)
            }
          })
          this.groupData = data
        })
      },
      disposeRange(range){
        let arr = range.split(',')
        if(arr[0] !== 0) arr.unshift('0')
        arr.push('999999')
        let disposedArr = []
        arr.forEach((item,index)=>{
          if(index === 0){
            disposedArr.push({
              label:`${arr[index+1]}以下`,
              value:`${item}-${arr[index+1]}`
            })
          }else if(index === arr.length -1){

          }else if(index === arr.length -2){
             disposedArr.push({
              label:`${arr[index]}以上`,
              value:`${item}-${arr[index+1]}`
            })
          }else{
            disposedArr.push({
              label:`${item}-${arr[index+1]}`,
              value:`${item}-${arr[index+1]}`
            })
          }
        })
        return disposedArr
      },
      changeGroup(val){
        this.getGroupList(val)
      },
      chooseGroup(row){
        // let data = this.groupData
        // data.forEach(item=>{
        //   item.isChoose = false
        // })
        // data[i].isChoose = true;
        // this[this.type] = this.disposeRange(row.range)
        let params= {id:row.id,isChoose:1}
        House.updateRange(params).then(res=>{
          if(res.data.code === 0){
            this.getGroupList(this.type)
          }
        })
      },
      handleDelete(row,index){
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
      }
    },
    watch:{
      regionnos(val){this.formInline.regionnos = val.join(',');this.isAllRegionnos = val.length >0 && val.length < this.regionsArr.length},
      partnos(val){this.formInline.partnos = val.join(',');this.isAllPlates = val.length >0 && val.length < this.partNosArr.length},
      propertyTypes(val){this.formInline.usages = val.join(',')},
      areaSizes(val){console.log(val);this.formInline.areaSizes = val.join(',');this.isAllAreaSizes = val.length >0 && val.length < this.area.length},
      avgSizes(val){this.formInline.avgSizes = val.join(',');this.isAllAvgSizes = val.length >0 && val.length < this.unit_price.length},
      totalSizes(val){this.formInline.totalSizes = val.join(',');this.isAllTotalSizes = val.length >0 && val.length < this.total_price.length},
      values(val){this.formInline.values = val.join(',')},
      date(val){
        if(val === null){
          this.formInline.startDate = ''
          this.formInline.endDate = ''
          return
        }
      this.formInline.startDate = val[0];this.formInline.endDate = val[1]},
    },
    created(){
      this.tableHeight = window.innerHeight * 0.8
      House.getRegionnos().then(res=>this.regionsArr = res.data.data.searchRst)
      House.getPartNos().then(res=>this.partNosArr = res.data.data)
      House.getDict('property_type_newhouse').then(res=>this.propertyArr = res.data.data)
      // this.getParamsList()
      this.getGroupList('total_price')
      this.getGroupList('area')
      setTimeout(_=>{
        this.getGroupList('unit_price')
      },600)
    },
}
</script>

<style lang="scss" scoped>
.dataPerspective_wrap{
    height:100%;
    width:300px;
    position: relative;
    .diver{
        padding: 6px 20px;
        border-bottom: #464646 1px solid;
        font-size: 14px;
        color: #8bc34a;
        display: flex;
        align-items: center;
        width: 215px;
        justify-content: space-between;
        .icon-set_icon{
            color:white;
            font-size: 18px;
            cursor: pointer;
        }
    }
    .line{
        background: #464646;
        height: 2px;
        margin-bottom: 16px;
        width: 222px;
    }
    ::v-deep .el-select{
      background: transparent;
      width: 221px;
      ::v-deep .el-input{
        background: transparent;
       
      }
     
    }
  .select{
      ::v-deep .el-input__inner {
        background: transparent!important;
        padding-right: 30px;
        background: transparent;
        color: #fcbf49!important;
        font-weight: 700;
        padding-left: 15px;
      }
    }
     
  .from_box{
      margin-top:10px;
      margin-left:5%;
      width: 90%;
      .el-form-item{
        width:100%;
        margin-right: 14px;
        margin-bottom:16px;
        ::v-deep .el-form-item__label{
          color:#fcbf49;
          font-weight: 700;
        }
        ::v-deep .el-form-item__content{
            width:82%;
        }
        ::v-deep .el-input__inner{
          padding-right:30px;
          background: transparent;
          color: #fcbf49;
          font-weight: 700;
          padding-left: 15px;
        }
        ::v-deep .el-select{
          width: 100%;
        }
        ::v-deep .el-select__tags{
          max-width: 180px!important;
          white-space: nowrap!important;
          display: flex!important;
        }
        ::v-deep .el-date-editor--daterange{
            width: 222px!important;
        }
        ::v-deep .el-date-editor{
        //   max-width: 212px!important;
        }
        ::v-deep .el-range-input{
            background: transparent;
        }
        ::v-deep .el-range-separator{
            color:white;
            margin: 0 5px;
        }
        ::v-deep .el-range-input{
            color: #fcbf49;
            width: 72px;
        }
        ::v-deep .el-tag{
          background:  #4B79A1;
          color:white;
        }
        ::v-deep .el-input__prefix{
          display: none;
        }
        .save_btn{
          display: inline-block;
          color:white;
          font-size:13px;
          height:34px;
          width:92px;
          text-align: center;
          line-height: 34px;
         background: #f4a261;  /* fallback for old browsers */
          

          border-radius: 4px;
          user-select: none;
          cursor: pointer;
          &:active{
              opacity: 0.7;
          }
        }
        .sub_btn{
         display: inline-block;
          color:white;
          font-size:13px;
          height:34px;
          width:92px;
          text-align: center;
          line-height: 34px;
          background: -webkit-linear-gradient(to right, #2a5298, #1e3c72);  /* Chrome 10-25, Safari 5.1-6 */
          background: linear-gradient(to right, #2a5298, #1e3c72); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
          border-radius: 4px;
          user-select: none;
          cursor: pointer;
          margin-left: 37px;
          &:active{
              opacity: 0.7;
          }
        }
      }
    }
  .list_mask{
    position: fixed;
    top:0%;
    right:0%;
    width:calc(100% - 380px);
    height:100%;
    background: rgba(47,62,70,.95);
    // border-radius: 8px;
    z-index: 9;
    transition: all 0.3s ease;
    &::-webkit-scrollbar { width: 0 !important }
    ::v-deep .el-table__body-wrapper{
        &::-webkit-scrollbar{
        background-color: #212e3e !important;
        opacity: 1!important;
        height:10px;
        width: 0px;
      }
      &::-webkit-scrollbar-thumb {
          /*滚动条里面小方块*/
          border-radius: 10px;
          background-color: #02adf7;
          background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);
      }
    }
     ::v-deep .el-table__row{
      background: transparent;
    }
    ::v-deep .el-table tr{
      background-color: transparent!important;
    }
    ::v-deep .el-table th{
      background-color: transparent!important;
    }
    ::v-deep .el-table__row>td{
      border: none;
    }
    ::v-deep .el-table::before {
      height: 0px;
    }
    ::v-deep .is-leaf{
      color:white;
    }
    ::v-deep .el-table--enable-row-hover .el-table__body tr:hover>td{
      // background-color: #212e3e !important;
    }
    .el-pagination{
      text-align: right;
      margin-right:6%;
      margin-top:8px;
    }
    ::v-deep .btn-prev{
       background: transparent;
       color:white
    }
    ::v-deep .btn-next{
       background: transparent;
       color:white
    }
    ::v-deep .el-icon-more{
      background: transparent;
      color:white;
    }
    ::v-deep .el-icon-d-arrow-right{
       background: transparent;
      color:white;
    }
    ::v-deep .el-icon-d-arrow-left{
       background: transparent;
      color:white;
    }
    ::v-deep .number{
      background: transparent;
      color:white
    }
    ::v-deep  .active{
      color:#219ebc;
    }
    .instructions{
      text-align: left;
      margin-left:40px;
      margin-top: 20px;
      color:#0a9396;
      font-weight: 700;
      letter-spacing: 1px;
      display: flex;
      align-items: center;
      height: 24px;
    }
    .perspective{
      color:white;
      height: calc(100% - 84px);
      width: calc(100% - 40px);
      margin-top: 20px;
      margin-left: 20px;
      overflow: scroll;
        &::-webkit-scrollbar {
        /*滚动条整体样式*/
        width : 10px;  /*高宽分别对应横竖滚动条的尺寸*/
        height: 10px;
        }
        &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
        background   : #219dbcde;
        }
        &::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        background   : #535353;
        }
      ::v-deep .dataframe{
        height: fit-content;
        width: 100%;
        border: 1px solid rgba(255, 255, 255, .3);
        thead{
          // tr:nth-child(3){
          //   display: none;
          // }
          th{
            white-space: nowrap;
            padding: 10px 6px;
            text-align: center;
            color:white;
            border: 1px solid rgba(255, 255, 255, .3);
          }
        }
        tbody{
          th{
            white-space: nowrap;
            padding: 4px 16px;
            text-align: center;
            vertical-align: middle;
            border: 1px solid rgba(255, 255, 255, .3);
          }
          td{
            text-align: center;
            height:20px!important;
            border: 1px solid rgba(255, 255, 255, .3);
          }
        }

      }
    }
  }
  .mark_mask{
    position: fixed;
    top:5%;
    right:5%;
    width:calc(90% - 342px);
    height:90%;
    background: rgba(47,62,70,.95);
    border-radius: 5px;
  }
  .setting_box{
    ::v-deep .is-leaf{
      color:#606266!important;
    }
  }
}

</style>