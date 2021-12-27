<template>
  <div class="landRank_wrap">
     <Map @map='getMap'/>
     <LandDetail v-if="showDetail" :landId="landId"/>
       <div class="title_box">
         <div class="title" @click="curList">{{listType==='project'?'成交排行':'企业排行'}}<span class="tab">点击切换{{listType==='company'?'成交排行':'企业排行'}}</span></div>
         <!-- <div class="tips">点击表头可排序</div> -->
       </div>
       <dv-border-box-12 class="ranking_list">
          <el-table 
          v-show="listType==='project'"
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
            prop="address"
            label="土地名称"
            width="250"
            align="center">
          </el-table-column>
          <el-table-column
            prop="region"
            label="区域"
            width="150"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="land_area"
            label="占地面积(万㎡)"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="dev_volume"
            label="建筑面积(万㎡)"
             align="center">
          </el-table-column>
          <el-table-column
            prop="total_floor_price"
            label="楼面地价(元/㎡)"
            align="center">
          </el-table-column>
          <el-table-column
            prop="total_sum"
            label="总价(万元)"
             align="center">
          </el-table-column>
          <el-table-column
            prop="yjl"
            label="溢价率"
            align="center">
          </el-table-column>
        </el-table>
         <el-table 
          :data="companyData"
          v-show="listType==='company'"
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
            prop="developer"
            label="开发商"
            width="250"
            align="center">
          </el-table-column>
         <el-table-column
            prop="land_area"
            label="占地面积(万㎡)"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="dev_volume"
            label="建筑面积(万㎡)"
             align="center">
          </el-table-column>
          <el-table-column
            prop="total_floor_price"
            label="楼面地价(元/㎡)"
            align="center">
          </el-table-column>
          <el-table-column
            prop="total_sum"
            label="总价(万元)"
             align="center">
          </el-table-column>
          <el-table-column
            prop="yjl"
            label="溢价率"
            align="center">
          </el-table-column>
        </el-table>
       </dv-border-box-12>
       <dv-loading v-if="showLoading">Loading...</dv-loading>
  </div>
</template>

<script>
import Land from '../../api/Land'
import Map  from '../../components/common/map'
import LandDetail from "../../components/Land/LandDetail"
export default {
  components:{
    Map,
    LandDetail
  },
  data(){
    return{
      map:null,
      tableData:[],
      companyData:[],
      tableHeight:720,
      chooseProperty:'land_area',
      listType:'project',
      chooseCompanyProperty:'land_area',
      showLoading:false,
      landId:'',
      showDetail:false
    }
  },
  methods:{
    curList(){
      this.showLoading = true
      let random = Math.random() * 400  + 600
      setTimeout(_=>{
        this.showLoading = false
        this.listType = this.listType=== 'project'?'company':'project'
      },random)
    },
    getMap(map){
      this.map = map
    },
    closeDetail(){
      this.showDetail = false
    },
    cellClick(row, column, cell, event){
      if(column.label === '土地名称'){
        this.landId = row.id
        this.showDetail = true
      }
    },
    cellStyle(row, column, rowIndex, columnIndex){
      if(row.column.label === '土地名称'){
        return 'color:#fcbf49;font-weight:700;cursor:pointer'
      }
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
      if(column.label !== '排名' && column.label !== '土地名称'  && column.label !== '区域'){
        this.chooseProperty = column.property
        this.getLandRank(column.property)
      }
    },
    companyHeaderClick(column){
      if(column.label !== '排名' && column.label !== '开发商' ){
        this.chooseCompanyProperty = column.property
        this.getLandCompanyRank(column.property)
      }
    },
    getLandRank(column){
      Land.getLandRank(column).then(res=>{
        this.tableData = res.data.data
      })
    },
    getLandCompanyRank(column){
      Land.getLandCompanyRank(column).then(res=>{
        this.companyData = res.data.data
      })
    }
  },
  created(){
    this.getLandRank('land_area')
    this.getLandCompanyRank('land_area')
    this.tableHeight = window.innerHeight *0.77
  }
}
</script>

<style lang="scss" scoped>
.landRank_wrap{
  height:calc(100% - 60px);
  width:100%;
  background: rgba(25,22,22,1);
  position: relative;
  /deep/.dv-loading{
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
      height: 88%;
      width: 92%;
      background: rgba(47,62,70,.8);
      border-radius: 8px;
      position: absolute;
      z-index: 10;
      top:8%;
      left:4%;
        /deep/.el-table__body-wrapper{
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
     /deep/.el-table__row{
      background: transparent;
    }
    /deep/.el-table tr{
      background-color: transparent!important;
    }
    /deep/.el-table th{
      background-color: transparent!important;
    }
    /deep/.el-table__row>td{
      border: none;
    }
    /deep/.el-table::before {
      height: 0px;
    }
    /deep/.is-leaf{
      color:white;
    }
    /deep/.el-table--enable-row-hover .el-table__body tr:hover>td{
      background-color: #212e3e !important;
    }
    }
}

</style>