<template>
  <div class="landInfo_wrap">
      <dv-border-box-12 class="table_mask">
          <el-table
        :data="tableData"
        :cell-style="cellStyle"
        @cell-click="cellClick"
        style="width: 96%;margin-left:2%;margin-top:1%;background: transparent;color:white"
        >
        <el-table-column
        prop="address"
        label="土地位置"
        width="220">
        </el-table-column>
        <el-table-column
        prop="landNumber"
        label="宗地编号"
        width="160">
        </el-table-column>
      
        <el-table-column
        prop="purpose"
        label="土地用途">
        </el-table-column>
         <el-table-column
        prop="landArea"
        label="净用地面积(亩)">
         </el-table-column>
         <el-table-column
        prop="buildArea"
        label="建筑面积(㎡)">
        </el-table-column>
        <el-table-column
        prop="startFloorPrice"
        label="楼面地价(元/㎡)">
        </el-table-column>
         <el-table-column
        prop="totalPrice"
        label="成交总价(万元)">
        </el-table-column>
    </el-table>
      </dv-border-box-12>
  </div>
</template>

<script>
import House from "@/api/houseDataApi.js"
// import PlotInfo from "./PlotInfo"
export default {
    components:{
        
    },
    props:['id'],
    data(){
        return{
            tableData: [],
            showPlotInfo:false,
            plotId:'',
            tableHeight:550
        }
    },
    created(){
        this.tableHeight = window.innerHeight * 0.58
        House.getBasicInfo(this.id).then(res=>{
          let data = res.data.data.land_info
          if(data.length <= 1){
            this.tableData = data
            return;
          }
         
          let landArea = data.reduce((total,item)=>total + item.landArea * 1,0).toFixed(2)
          let buildArea = data.reduce((total,item)=>total + item.buildArea * 1,0).toFixed(2)
          let totalPrice = data.reduce((total,item)=>total + item.totalPrice * 1,0).toFixed(2)
          let startFloorPrice = ((totalPrice / buildArea )* 10000).toFixed(2)
          data.push({
            landArea,buildArea,totalPrice,startFloorPrice,address:'合计'
          })
          this.tableData = data
        })
    },
    methods:{
        cellStyle(row, column, rowIndex, columnIndex){
        if(row.column.label === '土地位置'){
           return 'color:#fcbf49;font-weight:700;cursor:pointer'
        }
        },
        cellClick(row, column, cell, event){
          console.log(row)
          if(column.label === '土地位置' ){
              this.$emit('showLandDetail', row.id)
          }
      }
    }
}
</script>

<style lang="scss" scoped>
.landInfo_wrap{
    height:100%;
    width:100%;
    position: relative;
    .table_mask{
        margin-top:10px;
        height: 90%;
        background: rgba(47,62,70,.8);
        overflow: hidden;
        border-radius: 8px;
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
      background-color: transparent!important;
    }
    ::v-deep .el-table--enable-row-hover .el-table__body tr:hover>td{
    background-color: #212e3e !important;
    }
    v-deep .el-table__footer-wrapper tbody td, .el-table__header-wrapper tbody td{
        background-color: transparent!important;
    }
    ::v-deep .border-box-content{
      position: relative;
      z-index: 60;
    }
    ::v-deep .el-table__row{
      font-size: 14px;
      .cell{
        padding: 10px 0 10px 10px;
      }
    }
}
</style>