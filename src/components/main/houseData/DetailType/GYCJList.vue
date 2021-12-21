<template>
  <div class="gycjList_wrap">
      <el-form :inline="true" :model="formInline" size="small" style="margin-left:4px;width:100%">
          <el-form-item label="">
                <el-select v-model="propertyTypes" placeholder="物业类型" clearable multiple :collapse-tags="true">
                    <el-option :label="item.label" :value="item.value" v-for="item in propertyArr" :key="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="formInline.dataType" placeholder="数据类型" clearable :collapse-tags="true">
                   <el-option :label="item.label" :value="item.value" v-for="item in dataArr" :key="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="">
                <el-select v-model="formInline.dateType" placeholder="统计时间类型" clearable :collapse-tags="true">
                    <el-option :label="item.label" :value="item.value" v-for="item in dateArr" :key="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="">
                <el-select v-model="formInline.status" placeholder="数据分类" clearable :collapse-tags="true">
                    <el-option :label="item.label" :value="item.value" v-for="item in statusArr" :key="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
               <el-date-picker type="month" placeholder="开始月份" v-model="formInline.startDate" value-format="yyyy-MM-dd"  style="width: 100%;"></el-date-picker>
            </el-form-item>
             <el-form-item>
            <el-date-picker type="month" placeholder="结束月份"   v-model="formInline.endDate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item style="width:70px;">
              <el-button  @click="onSubmit" type="primary">查询</el-button>
            </el-form-item>
             <el-form-item>
              <el-button  @click="exportList" type="success">导出当前数据</el-button>
            </el-form-item>
      </el-form>
      <dv-border-box-12 class="table_mask">
        <el-table
          :data="tableData"
          :height="tableHeight"
          style="width: 96%;margin-left:2%;margin-top:1%;background: transparent;color:white"
          row-key="id"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column
            prop="dd"
            label="时间">
          </el-table-column>
           <el-table-column
            prop="xznum"
            label="新增套数(套)">
          </el-table-column>
           <el-table-column
            prop="xzarea"
            label="新增面积(万㎡)">
          </el-table-column>
          <el-table-column
            prop="xsnum"
            label="销售套数(套)">
          </el-table-column>
          <el-table-column
            prop="xsarea"
            label="销售面积(万㎡)"
            >
          </el-table-column>
            <el-table-column
            prop="ave"
            label="销售均价(元/㎡)">
          </el-table-column>
          <el-table-column
            prop="xsamount"
            label="销售总价(万元)">
          </el-table-column>
        
         
           <el-table-column
            prop="clnum"
            label="存量套数(套)">
          </el-table-column>
           <el-table-column
            prop="clarea"
            label="存量面积(万㎡)">
          </el-table-column>
        </el-table>
      </dv-border-box-12>
  </div>
</template>

<script>
import House from '@/api/houseDataApi.js'
export default {
    props:['id'],
    data(){
        return{
          exportType:'',
          formInline:{
              propertyTypes:"",
              buildingId:'',
              dataType:'',
              dateType:'',
              startDate:'',
              endDate:'',
              status:''
          },
          propertyTypes:[],
          propertyArr:[],
          dataArr:[],
          dateArr:[],
          tableData:[],
          tableHeight:530,
          statusArr:[{
            label:'认购',
            value:'sub'
          },{
            label:'备案',
            value:'record'
          }]
      }
    },
    watch:{
        propertyTypes(newVal){
            this.formInline.propertyTypes = newVal.join(',')
        }
    },
    methods:{
        exportList(){
          let url = `${process.env.BASE_URL}/dms/sc/building/newhouse/export?modelType=single_count&expPage=${this.exportType.length === 0?'first':'second'}&token=${localStorage.getItem('token')}`
          window.open(url)
        },
        onSubmit(){
          this.exportType = this.formInline.dataType
          House.getGYCJList(this.formInline).then(res=>this.tableData = this.disposeData(res.data.data))
        },
        disposeData(arr){
        arr.forEach(item=>{
          if(item.children && item.children.length !== 0){
            item.children.forEach(item1=>{
              delete item1.dd
              item1.dd = item1.name
            })
          }
        })
        return arr
      },
    },
    created(){
        this.formInline.buildingId = this.id
        this.tableHeight = window.innerHeight * 0.57
        House.getDict('property_type_newhouse').then(res=>this.propertyArr = res.data.data)
        House.getDict('data_type').then(res=>this.dataArr = res.data.data)
        House.getDict('date_type').then(res=>this.dateArr = res.data.data)
        House.getGYCJList(this.formInline).then(res=>this.tableData = this.disposeData(res.data.data))
    }
}
</script>

<style lang="scss" scoped>
.gycjList_wrap{
   height:100%;
    width:100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .el-form-item{
      width:158px;
      margin-right: 14px;
       ::v-deep.el-form-item__label{
        color:#fcbf49;
        font-weight: 700;
      }
      ::v-deep.el-input__inner{
        padding-right:30px;
        background: transparent;
        color: #fcbf49;
        font-weight: 700;
      }
      ::v-deep.el-select{
        width: 100%;
      }
      ::v-deep.el-select__tags{
        max-width: 180px!important;
        white-space: nowrap!important;
        display: flex!important;
      }
      ::v-deep.el-tag{
        background:  #4B79A1;
        color:white;
      }
      .query_btn{
        margin-left: 0;
        margin-top: 0;
        color:white;
        font-size:13px;
        height:34px;
        width:92px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: -webkit-linear-gradient(to right, #2a5298, #1e3c72);  /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #2a5298, #1e3c72); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        border-radius: 4px;
        user-select: none;
        cursor: pointer;
        &:active{
            opacity: 0.7;
        }
      }
    }
    .table_mask{
        background: rgba(47,62,70,.8);
        border-radius: 8px;
        width: 100%;
        height:calc(100% - 80px);
        ::v-deep.border-box-content{
          position: relative;
          z-index: 666;
      }
    }
    ::v-deep.el-table__body-wrapper{
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
      ::v-deep.el-table__row{
      background: transparent;
      }
      ::v-deep.el-table tr{
      background-color: transparent!important;
      }
      ::v-deep.el-table th{
      background-color: transparent!important;
      }
      ::v-deep.el-table__row>td{
      border: none;
      }
      ::v-deep.el-table::before {
      height: 0px;
      }
      ::v-deep.is-leaf{
      color:white;
      }
      ::v-deep.el-table--enable-row-hover .el-table__body tr:hover>td{
        background-color: #212e3e !important;
      }
      ::v-deep .el-table__row{
        font-size: 14px;
        .cell{
          padding: 10px 0 10px 10px;
      }
      
   }
   ::v-deep .el-icon-arrow-right{
      color:white!important;
    }
}

</style>