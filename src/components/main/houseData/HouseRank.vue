<template>
  <div class="houseRank_wrap">
    <Loading v-if="showLoading" />
    <ProjectDetail :proId="proId" :proPoi="proPoi" :proTitle="proTitle" v-if="showDetail" />
    <div class="diver">查询条件</div>
    <div class="from_box">
        <el-form :inline="true" :model="formInline" size="small" style="text-align: start;">
           <el-form-item label="">
              <el-radio v-model="radio" label="1">项目排行</el-radio>
              <el-radio v-model="radio" label="2">开发商排行</el-radio>
            </el-form-item>
          <el-form-item>
               <el-date-picker type="month" placeholder="开始月份" v-model="formInline.startDate" value-format="yyyy-MM-dd"  style="width: 100%;"></el-date-picker>
            </el-form-item>
             <el-form-item>
            <el-date-picker type="month" placeholder="结束月份"   v-model="formInline.endDate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
            </el-form-item>
             
          <el-form-item>
              <div class="sub_btn" @click="getList">点击查询</div>
          </el-form-item>
        </el-form>
        </div>
       <dv-border-box-12 class="ranking_list">
          <el-table 
          v-show="radio==='1'"
          :data="tableData"
          style="width: 96%;margin-left:2%;margin-top:1%;background: transparent;color:white"
          :height="tableHeight"
          :cell-style="cellStyle"
          :header-cell-style="headerStyle"
          @header-click="headerClick"
          @cell-click="cellClick"
          >
           <el-table-column
              type="index"
              width="100"
              label="排名"
              align="center">
            </el-table-column>
          <el-table-column
            prop="name"
            label="项目名称"
            width="250"
            align="center">
          </el-table-column>
          <el-table-column
            prop="region"
            label="区域"
            align="center">
          </el-table-column>
          <el-table-column
            prop="xznum"
            label="新增套数"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="xzarea"
            label="新增面积(万㎡)"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="clnum"
            label="存量套数"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="clarea"
            label="存量面积(万㎡)"
            align="center"
            >
          </el-table-column>
           <el-table-column
            prop="xsnum"
            label="销售套数"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="xsarea"
            label="销售面积(万㎡)"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="xsamount"
            label="销售总价(万元)"
             align="center">
          </el-table-column>
          <el-table-column
            prop="ave"
            label="销售均价(元/㎡)"
             align="center">
          </el-table-column>
        </el-table>
         <el-table 
          :data="companyData"
          v-show="radio==='2'"
          style="width: 96%;margin-left:2%;margin-top:1%;background: transparent;color:white"
          :height="tableHeight"
          :cell-style="companyCellStyle"
          :header-cell-style="companyHeaderStyle"
          @header-click="companyHeaderClick"
          >
           <el-table-column
              type="index"
              width="100"
              label="排名"
              align="center">
            </el-table-column>
          <el-table-column
            prop="name"
            label="开发商"
            width="250"
            align="center">
          </el-table-column>
          <el-table-column
            prop="xznum"
            label="新增套数"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="xzarea"
            label="新增面积(万㎡)"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="clnum"
            label="存量套数"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="clarea"
            label="存量面积(万㎡)"
            align="center"
            >
          </el-table-column>
           <el-table-column
            prop="xsnum"
            label="销售套数"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="xsarea"
            label="销售面积(万㎡)"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="xsamount"
            label="销售总价(万元)"
             align="center">
          </el-table-column>
          <el-table-column
            prop="ave"
            label="销售均价(元/㎡)"
             align="center">
          </el-table-column>
        </el-table>
        <div class="instructions"> * 此数据为备案数据</div>
       </dv-border-box-12>
  </div>
</template>

<script>
import House from "@/api/houseDataApi.js"
import Loading from "@/components/tools/loading.vue"
import ProjectDetail from "./ProjectDetail"
export default {
  components:{
    Loading,ProjectDetail
  },
  data(){
    return{
      radio:'1',
      tableData:[],
      companyData:[],
      tableHeight:720,
      chooseProperty:'xznum',
      listType:'project',
      chooseCompanyProperty:'xznum',
      showLoading:false,
      houseId:'',
      showDetail:false,
      formInline:{
        startDate:'',
        endDate:'',
        orderField:'xznum'
      }
    }
  },
  methods:{
    getList(){
      if(this.radio === '1'){
        this.getHouseRank()
      }else if(this.radio === '2'){
        this.getHouseDevRank()
      }
    },
    curList(){
      this.showLoading = true
      let random = Math.random() * 400  + 600
      setTimeout(_=>{
        this.showLoading = false
        this.listType = this.listType=== 'project'?'company':'project'
      },random)
    },
    closeDetail(){
      this.showDetail = false
    },
    cellClick(row, column, cell, event){
      // if(column.label === '项目名称'){
      //     this.proId = row.building_id
      //     this.proTitle = row.building_name
      //     if(row.coordinate){
      //       this.proPoi = row.coordinate.split(',')
      //     }
      //     this.showDetail = true
      // }
    },
    cellStyle(row, column, rowIndex, columnIndex){
      // if(row.column.label === '项目名称'){
      //   return 'color:#fcbf49;font-weight:700;cursor:pointer'
      // }
    },
    companyCellStyle(row, column, rowIndex, columnIndex){
      if(row.column.label === '开发商'){
        // return 'color:#fcbf49;font-weight:700;cursor:pointer'
        return "font-weight:700"
      }
    },
    headerStyle(row, rowIndex){
      if(row.column.property === this.chooseProperty){
        return 'color:#219ebc;font-weight:700;cursor:pointer'
      }
    },
    companyHeaderStyle(row,rowIndex){
       if(row.column.property === this.chooseCompanyProperty){
        return 'color:#219ebc;font-weight:700;cursor:pointer'
      }
    },
    headerClick(column){
      if(column.label !== '排名' && column.label !== '项目名称'  && column.label !== '区域'){
        this.showLoading = true
        this.chooseProperty = column.property
        this.formInline.orderField = column.property
        this.getHouseRank()
      }
    },
    companyHeaderClick(column){
        this.showLoading = true
      if(column.label !== '排名' && column.label !== '开发商' ){
        this.chooseCompanyProperty = column.property
        this.formInline.orderField = column.property
        this.getHouseDevRank()
      }
    },
    getHouseRank(){
        House.getHouseRank(this.formInline).then(res=>{
            this.tableData = res.data.data
            this.showLoading = false
        })
    },
    getHouseDevRank(){
      House.getHouseDevRank(this.formInline).then(res=>{
        this.companyData = res.data.data
        this.showLoading = false
      })
    }
  },
  created(){
    this.showLoading = true
    this.getHouseRank()
    this.getHouseDevRank()
    this.tableHeight = window.innerHeight *0.715
  }
}
</script>
<style lang="scss" scoped>
.houseRank_wrap{
  height:800px;
  width:300px;
  position: relative;
  .diver{
        padding: 10px 20px;
        border-bottom: #464646 1px solid;
        font-size: 14px;
        color: #8bc34a;
    }
   .from_box{
      margin-top:20px;
      margin-left:5%;
      width: 90%;
      .el-form-item{
        width:100%;
        margin-right: 14px;
        ::v-deep .el-radio__input.is-checked+.el-radio__label{
          color:rgba(255, 193, 7, 1)
        }
        ::v-deep .el-radio{
          color:white;
        }
        ::v-deep .el-form-item__label{
          color:#fcbf49;
          font-weight: 700;
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
        ::v-deep .el-tag{
          background:  #4B79A1;
          color:white;
        }
        ::v-deep .el-input__prefix{
          display: none;
        }
        .sub_btn{
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
          margin-left: 120px;
          &:active{
              opacity: 0.7;
          }
        }
      }
    }
    .radio_box{
      width: 252px;
      height: 30px;
      white-space: nowrap;
      display: flex;
      justify-content: space-around;
      margin-top:10px;
      &::-webkit-scrollbar{
        background-color: #212e3e !important;
        opacity:1!important;
        width: 0px;
        height: 4px;
      }
      ::v-deep .el-radio__input.is-checked+.el-radio__label{
         color:rgba(255, 193, 7, 1)
      }
      ::v-deep .el-radio{
         color:white;
      }
    }
  ::v-deep .dv-loading{
    color:#8ecae6;
    position: fixed;
    top:0;
    left:0;
    z-index: 999;
    font-weight: 700;
  }
    .title_box{
        position: absolute;
        top:2%;
        left:47%;
        .title{
        color:white;
        font-size:28px;
        margin-bottom:10px;
    
        font-weight: 700;
        letter-spacing: 2px;
        user-select: none;
        cursor: pointer;
        .tab{
          font-weight: 550!important;
          font-size:12px;
          margin-left:4px;
          letter-spacing: 0px;
          color:#e09f3e;
          text-decoration: underline;
        }
      }
    }
    .ranking_list{
      height: 80%;
      width: 70%;
      border-radius: 8px;
      position: fixed;
      z-index: 10;
      top:10%;
      right:5%;
      background: rgba(47,62,70,.8);
      ::v-deep .el-table__body-wrapper{
        &::-webkit-scrollbar{
        background-color: #212e3e !important;
        opacity: 1!important;
        height:10px;
        width: 0px;
      }
      &::-webkit-scrollbar-thumb {
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
      background-color: #212e3e !important;
    }
    .instructions{
      text-align: right;
      margin-right:80px;
      margin-top: 20px;
      color:gray;
    }
  }
}

</style>