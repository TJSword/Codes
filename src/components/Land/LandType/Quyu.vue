<template>
    <div class="quyu_wrap">
        <el-table
      :data="tableData"
      style="width: 98%;margin-left:1%;"
      row-key="id"
      :height="tableHeight">
      <el-table-column
        prop="dd"
        label="时间"
        width="150">
      </el-table-column>
      <el-table-column
        prop="gy_num"
        label="供应宗数">
      </el-table-column>
      <el-table-column
        prop="gy_land_area_mu"
        label="供应面积（亩）">
      </el-table-column>
      <el-table-column
        prop="gy_build_area"
        label="供应面积（万㎡）">
      </el-table-column>
      <el-table-column
        prop="gy_floor_price"
        label="起拍楼面地价（元/㎡）">
      </el-table-column>
      <el-table-column
        prop="cj_num"
        label="成交宗数">
      </el-table-column>
      <el-table-column
        prop="cj_area_mu"
        label="成交面积（亩）">
      </el-table-column>
      <el-table-column
        prop="cj_area"
        label="成交面积（万㎡）">
      </el-table-column>
      <el-table-column
        prop="cj_ave_price"
        label="成交均价（万/亩）">
      </el-table-column>
      <el-table-column
        prop="cj_total_price"
        label="成交总金额（万元）">
      </el-table-column>
      <el-table-column
        prop="cj_floor_price"
        label="成交楼面地价（元/㎡）">
      </el-table-column>
      <el-table-column
        prop="yjl"
        label="溢价率（%）">
      </el-table-column>
    </el-table>
    </div>
    
</template>

<script>
import Land from "../../../api/Land"
export default {
    props:['form'],
    data(){
        return{
            tableData: [],
            tableHeight:720
        }
    },
    methods:{
        disposeData(arr){
            arr.forEach(item=>{
            if(item.children && item.children.length !== 0){
                item.children.forEach(item1=>{
                    item1.dd = item1.name
                })
            }
            })
            return arr
        },
    },
    created(){
        this.tableHeight = window.innerHeight * 0.77
            this.$nextTick(_=>{
                Land.getQuyuList(this.form).then(res=>{
                this.tableData = this.disposeData(res.data.data)
                console.log(this.tableData)
            })
        })
    }
}
</script>

<style lang="scss" scoped>
.quyu_wrap{
    height:100%;
    width:100%;
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
    /deep/.el-icon-arrow-right{
      color:white;
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