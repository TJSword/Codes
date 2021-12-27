<template>
  <div class="chengjiao_wrap">
        <el-table
      :data="tableData"
      style="width: 100%"
      :height="tableHeight"          
      :cell-style="cellStyle"
      @cell-click="cellClick"
      border
      stripe>
      <el-table-column
        prop="address"
        label="土地位置"
        width="350">
      </el-table-column>
      <el-table-column
        prop="landUseLabel"
        label="土地用途">
      </el-table-column>
      <el-table-column
        prop="sellTypeLabel"
        label="出让方式">
      </el-table-column>
      <el-table-column
        prop="sellDate"
        label="出让时间">
      </el-table-column>
      <el-table-column
        prop="landAreaMu"
        label="净用地面积（亩）">
      </el-table-column>
      <el-table-column
        prop="totalPriceMu"
        label="成交单价（万元/亩）">
      </el-table-column>
        <el-table-column
        prop="totalFloorPrice"
        label="楼面地价（元/㎡）">
      </el-table-column>
       <el-table-column
        prop="yjl"
        label="溢价率（%）">
      </el-table-column>
      <el-table-column
        prop="deVolume"
        label="可开发体量（万㎡）">
      </el-table-column>
      <el-table-column
        prop="winner"
        label="竞得者 "
        width="250">
      </el-table-column>
    </el-table>
     <el-pagination
    layout="prev, pager, next"
    :total="totalPage"
    :page-size="12"
    @current-change = "pageChange">
  </el-pagination>
  </div>
</template>

<script>
import Land from "../../../api/Land"
export default {
    props:['form'],
    data(){
        return{
            tableData: [],
            totalPage:0,
            tableHeight:660
        }
    },
    methods:{
        pageChange(i){
            this.form.page = i;
            Land.getGongyingList(this.form).then(res=>{
                this.tableData = res.data.data.list
            })
        },
        cellStyle(row, column, rowIndex, columnIndex){
          if(row.column.label === '土地位置'){
            return 'color:#fcbf49;font-weight:700;cursor:pointer'
          }
        },
        cellClick(row, column, cell, event){
          if(column.label === '土地位置'){
              this.$emit('showDetail',row.id)
           }
        }
    },
    created(){
       this.tableHeight = window.innerHeight * 0.7
        delete this.form.dateType
        this.form.page = 1;
        this.form.limit = 12;
        this.form.dealState = 'deal'
        Land.getGongyingList(this.form).then(res=>{
            this.tableData = res.data.data.list
            this.totalPage = res.data.data.total
        })
    }
}
</script>

<style lang="scss" scoped>
.chengjiao_wrap{
    height: 100%;
    width:100%;
    position: relative;
    /deep/.el-table__body-wrapper{
        &::-webkit-scrollbar{
        background-color: #212e3e !important;
        opacity: 1!important;
        height:10px;
        width: 10px;
      }
      &::-webkit-scrollbar-thumb {
          /*滚动条里面小方块*/
          border-radius: 10px;
          background-color: #02adf7;
          background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);
      }
    }
    /deep/.el-table{
      background: transparent!important;
      border: none;
     
    }
    /deep/.el-table__row{
      background: transparent!important;
      color:white;
    }
    /deep/.el-table--striped .el-table__body tr.el-table__row--striped td{
        background: transparent!important;
        color:white;
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
    /deep/.el-table--border::after, .el-table--group::after, .el-table::before {
      height: 0px;
      display: none!important;
      width: 0px;
      opacity: 0;
    }
    /deep/.is-leaf{
      color:white;
      background-color: transparent!important;
      border: 0;
      border-bottom: 1px solid #EBEEF5;
    }
    /deep/.el-table--enable-row-hover .el-table__body tr:hover>td{
      background-color: #212e3e !important;
    }
    .el-pagination{
      text-align: right;
      margin-right:6%;
      margin-top:20px;
    }
    /deep/.btn-prev{
       background: transparent;
       color:white
    }
    /deep/.btn-next{
       background: transparent;
       color:white
    }
    /deep/.el-icon-more{
      background: transparent;
      color:white;
    }
    /deep/.el-icon-d-arrow-right{
       background: transparent;
      color:white;
    }
    /deep/.el-icon-d-arrow-left{
       background: transparent;
      color:white;
    }
    /deep/.number{
      background: transparent;
      color:white
    }
    /deep/ .active{
      color:#219ebc;
    }
    
}
</style>