<template>
  <div :class="['landDetail_wrap',ani?'landDetail_wrap_active':'']">
    <ProjectDetail :proId="proId" :proTitle="proTitle" v-if="showDetail" />
      <dv-border-box-12 :class="['detail_box',ani?'detail_box_acitve':'']">
          <i class="iconfont icon-guanbi" @click="close"></i>
          <div class="table_box">
            <div class="xs_mask">
                <div style='font-size:22px;font-weight:700;margin:20px 0;'>销售项目详细表</div>
                <el-table
                :data="xsList"
                height="300"
                style="width: 96%;margin-left:2%;margin-top:0.5%;background: transparent;color:white"
                :cell-style="cellStyle"
                @cell-click="cellClick">
                    <el-table-column
                    prop="name"
                    label="项目名称">
                    </el-table-column>
                    <el-table-column
                    prop="region"
                    label="城区">
                    </el-table-column>
                    <el-table-column
                    prop="xsnum"
                    label="销售套数">
                    </el-table-column>
                    <el-table-column
                    prop="xsarea"
                    label="销售面积">
                    </el-table-column>
                    <el-table-column
                    prop="ave"
                    label="销售均价">
                    </el-table-column>
                </el-table>
                 <el-pagination
                    layout="prev, pager, next"
                    :page-size="12"
                    :total="xsTotalPage"
                    @current-change="xsPageChange">
                </el-pagination>
            </div>
           <div class="xz_mask">
            <div style='font-size:22px;font-weight:700;margin:20px 0;'>新增项目详细表</div>
            <el-table
                :data="xzList"
                height="300"
                 style="width: 96%;margin-left:2%;margin-top:0.5%;background: transparent;color:white"
                :cell-style="cellStyle"
                @cell-click="cellClick">
                    <el-table-column
                    prop="name"
                    label="项目名称">
                    </el-table-column>
                    <el-table-column
                    prop="region"
                    label="城区">
                    </el-table-column>
                    <el-table-column
                    prop="xznum"
                    label="新增套数">
                    </el-table-column>
                    <el-table-column
                    prop="xzarea"
                    label="新增面积">
                    </el-table-column>
            </el-table>
            <el-pagination
                    layout="prev, pager, next"
                    :page-size="12"
                    :total="xzTotalPage"
                    @current-change="xzPageChange">
                </el-pagination>
           </div>
        </div>
      </dv-border-box-12>
  </div>
</template>

<script>
import House from "@/api/houseDataApi.js"
import ProjectDetail from "./ProjectDetail"
export default {
    components:{
       ProjectDetail
    },
    props:['form'],
    data(){
        return{
            xsTotalPage:0,
            xzTotalPage:0,
            title:'',
            xsList:[],
            xzList:[],
            ani:false,
            showDetail:false,
            countDetail:{}
        }
    },
    methods:{
        close(){
           this.ani = false
           setTimeout(_=>{
               this.$parent.closeDetail()
           },300)
        },
        cellStyle(row, column, rowIndex, columnIndex){
            // if(row.column.label === '项目名称'){
            //    return 'color:#fcbf49;font-weight:700;cursor:pointer'
            // }
        },
        cellClick(row, column, cell, event){
        //   if(column.label === '项目名称' ){
        //      this.proId = row.building_id
        //      this.proTitle = row.name
        //      this.showDetail = true
        //   }
        },
        closeDetail(){
            this.showDetail = false
        },
        xsPageChange(i){
            this.form.page = i
            House.getXSList(this.form).then(res=>{
                this.xsList = res.data.data.list
            })
        },
        xzPageChange(i){
            this.form.page = i
            House.getXZList(this.form).then(res=>{
                this.xzList = res.data.data.list
            })
        }
    },
    created(){
        this.form.page = 1;
        this.form.limit = 12;
        House.getXSList(this.form).then(res=>{
            this.xsList = res.data.data.list
            this.xsTotalPage = res.data.data.total
        })
         House.getXZList(this.form).then(res=>{
            this.xzList = res.data.data.list
            this.xzTotalPage =res.data.data.total
        })

    },
    mounted(){
        setTimeout(_=>{
            this.ani = true
        },50)
    }
}
</script>
<style lang="scss" scoped>
.landDetail_wrap{
    position: absolute;
    top:0;
    left:0;
    height: 100%;
    width: 100%;
    background: #41454a00;
    z-index: 30;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
    ::v-deep .border-box-content{
        position: relative;
        z-index: 60;
    }
    .detail_box{
        height: 92%;
        width: 92%;
        background: rgba(47, 62, 70, 1);
        border-radius: 8px;
        position: relative;
        transform: scaleY(0.1);
        opacity: 0;
        transition:  all 0.3s  ease ;
        ::v-deep .dv-border-svg-container{
            z-index: 10;
        }
        .icon-guanbi{
            position: absolute;
            right: 22px;
            top:16px;
            color:white;
            font-size:20px;
            z-index: 21;
            &:hover{
                transform: rotate(180deg);
                transition: all 0.3s ease;
            }
        }
        .table_box{
            height:100%;
            width:100%;
            color:white;
            display: flex;
            align-items: center;
            justify-content: space-around;
            .xs_mask{
                display: flex;
                flex-direction: column;
                align-items: center;
                height: 90%;
                width: 45%;
            }
            .xz_mask{
                height: 90%;
                width: 45%;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            ::v-deep .el-table{
                background: transparent!important;
                border: none;
                
                }
                ::v-deep .el-table__row{
                background: transparent!important;
                color:white;
                }
                ::v-deep .el-table--striped .el-table__body tr.el-table__row--striped td{
                    background: transparent!important;
                    color:white;
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
                ::v-deep .el-table--border::after, .el-table--group::after, .el-table::before {
                height: 0px;
                display: none!important;
                width: 0px;
                opacity: 0;
                }
                ::v-deep .is-leaf{
                color:white;
                background-color: transparent!important;
                border: 0;
                border-bottom: 1px solid #EBEEF5;
                }
                ::v-deep .el-table--enable-row-hover .el-table__body tr:hover>td{
                background-color: #212e3e !important;
                }
        }
    }
    .detail_box_acitve{
        transform: scaleY(1);
        opacity: 1;
        transition:  all 0.3s  ease ;
    }
}
.landDetail_wrap_active{
    // background: #41454a78;
    transition: all 0.3s ease;
}
</style>