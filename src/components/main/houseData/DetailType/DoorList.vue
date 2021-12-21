<template>
  <div class="doorList_wrap">
      <dv-border-box-12 class="table_mask">
           <el-table
            :data="tableData"
            :height="tableHeight"
            style="width: 96%;margin-left:2%;margin-top:1%;background: transparent;color:white">
             <el-table-column
            prop="area_size"
            label="面积段">
            </el-table-column>
            <el-table-column
            prop="name"
            label="户型名称">
            </el-table-column>
            <el-table-column
            prop="structure"
            label="户型结构">
            </el-table-column>
           
            <el-table-column
            prop="total_num"
            label="总套数">
            </el-table-column>
            <el-table-column
            prop="total_area"
            label="总面积(㎡)">
            </el-table-column>
            <el-table-column
            prop="xs_num"
            label="销售套数">
            </el-table-column>
            <el-table-column
            prop="xs_area"
            label="销售面积(㎡)">
            </el-table-column>
            <el-table-column
            prop="xs_total_price"
            label="销售总价(万元)">
            </el-table-column>
            <el-table-column
            prop="xs_ave_price"
            label="销售均价(元/㎡)">
            </el-table-column>
            <el-table-column
            prop="sy_num"
            label="剩余套数">
            </el-table-column>
            <el-table-column
            prop="sy_area"
            label="剩余面积">
            </el-table-column>
            <el-table-column
            prop="sell_ratio"
            label="去化率(%)">
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
        return {
            tableData:[],
            tableHeight:585
        }
    },
    created(){
        // this.tableHeight = window.innerHeight * 0.62
        // House.getDoorList(this.id).then(res=>{
        //     console.log(res.data.data)
        //     this.tableData = res.data.data
        // })
    }
}
</script>

<style lang="scss" scoped>
.doorList_wrap{
    height:100%;
    width:100%;
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
        background-color: #212e3e !important;
        }
    .table_mask{
        background: rgba(47,62,70,.8);
        border-radius: 8px;
        width: 100%;
        height:calc(100% - 80px);
        overflow: hidden;
        ::v-deep .border-box-content{
          position: relative;
          z-index: 666;
      }
    }
}
</style>