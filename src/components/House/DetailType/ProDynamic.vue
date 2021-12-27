<template>
  <div class="proDynamic_wrap">
      <el-form :inline="true" :model="formInline" size="small" style="margin-left:4px;">
            <el-form-item label="">
                <el-input v-model="formInline.name"  placeholder="关键字搜索" clearable></el-input>
            </el-form-item>
            <el-form-item>
               <el-date-picker type="date" placeholder="开始日期" v-model="formInline.startDate" value-format="yyyy-MM-dd"  style="width: 100%;"></el-date-picker>
            </el-form-item>
             <el-form-item>
            <el-date-picker type="date" placeholder="结束日期"   v-model="formInline.endDate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <div class="query_btn"  @click="onSubmit"> 查询</div>
            </el-form-item>
      </el-form>
      <div class="proDynamic_table_box">
           <dv-border-box-12 class="kaipan_box">
               <div class="box_title">开盘动态</div>
                <el-table
                :data="kpData"
                style="width: 96%;margin-left:2%;margin-top:1%;background: transparent;color:white"
                :cell-style="cellStyle"
               @cell-click="cellKPClick">
                <el-table-column
                prop="title"
                label="标题">
                </el-table-column>
                <el-table-column
                prop="create_date"
                label="时间"
                 width="120">
                </el-table-column>
            </el-table>
           </dv-border-box-12>
            <dv-border-box-12 class="kaipan_box">
               <div class="box_title">活动动态、常规动态</div>
                 <el-table
                :data="cgData"
                style="width: 96%;margin-left:2%;margin-top:1%;background: transparent;color:white"
                :cell-style="cellStyle"
                @cell-click="cellHDClick">
                <el-table-column
                prop="title"
                label="标题">
                </el-table-column>
                <el-table-column
                prop="create_date"
                label="时间"
                 width="120">
                </el-table-column>
            </el-table>
           </dv-border-box-12>
      </div>
  </div>
</template>

<script>
import House from '../../../api/House'
export default {
    props:['id'],
    data(){
        return{
            formInline: {
                buildingId:'',
                name:'',
                startDate:'',
                endDate:''
            },
            kpData:[],
            cgData:[]
        }
    },
    created(){
        this.formInline.buildingId = this.id
        House.getProDynamic(this.formInline).then(res=>{
            console.log(res.data.data)
            this.kpData = res.data.data.kpList
            this.cgData = res.data.data.cgList
        })
    },
    methods:{
        onSubmit(){
            House.getProDynamic(this.formInline).then(res=>{
                console.log(res.data.data)
                this.kpData = res.data.data.kpList
                this.cgData = res.data.data.cgList
            })
        },
        cellStyle(row, column, rowIndex, columnIndex){
            if(row.column.label === '标题'){
                 return 'color:#fcbf49;font-weight:700;cursor:pointer'
             }
        },
        cellKPClick(row, column, cell, event){
            if(column.label === '标题'){
                 this.$emit('showDynamicInfo', row.id)
            }
        },
        cellHDClick(row, column, cell, event){
            if(column.label === '标题'){
                 this.$emit('showHDDynamicInfo', row.id)
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.proDynamic_wrap{
    height:100%;
    width:100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .el-form-item{
      width:158px;
      margin-right: 14px;
       /deep/.el-form-item__label{
        color:#fcbf49;
        font-weight: 700;
      }
      /deep/.el-input__inner{
        padding-right:30px;
        background: transparent;
        color: #fcbf49;
        font-weight: 700;
      }
      /deep/.el-select{
        width: 100%;
      }
      /deep/.el-select__tags{
        max-width: 180px!important;
        white-space: nowrap!important;
        display: flex!important;
      }
      /deep/.el-tag{
        background:  #4B79A1;
        color:white;
      }
      .query_btn{
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
    .proDynamic_table_box{
        height:calc(100% - 80px);
        width:100%;
        display: flex;
        justify-content: space-between;
         /deep/.el-table__body-wrapper{
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
        /deep/.border-box-content{
            position: relative;
            z-index: 666;
        }
        .kaipan_box{
            width:49%;
            display: flex;
            flex-direction: column;
            align-items: center;
            background: rgba(47,62,70,.8);
            border-radius: 8px;
           
            .box_title{
                font-size:18px;
                font-weight: 700;
                margin-top:18px;
                color:white;
            }
        }
    }
}
</style>