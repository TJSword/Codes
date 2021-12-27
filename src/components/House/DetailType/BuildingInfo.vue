<template>
  <div class="buildingInfo_wrap">
    <el-form :inline="true" :model="formInline" size="small">
      <el-form-item label="">
        <el-select v-model="propertyType" placeholder="物业类型" clearable multiple :collapse-tags="true">
            <el-option :label="item.label" :value="item.value" v-for="item in propertyArr" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="">
        <el-select v-model="buildForm" placeholder="建筑形态" clearable multiple :collapse-tags="true">
            <el-option :label="item.label" :value="item.value" v-for="item in buildArr" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="">
        <el-select v-model="presellNo" placeholder="预售证" clearable multiple :collapse-tags="true">
            <el-option :label="item" :value="item" v-for="item in presellList" :key="item"></el-option>
        </el-select>
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
      <dv-border-box-12 class="table_mask">
           <el-table
            :data="tableData"
            :height="tableHeight"
            style="width: 96%;margin-left:2%;margin-top:1%;background: transparent;color:white">
            <el-table-column
            prop="presellNo"
            label="预售证号">
            </el-table-column>
            <el-table-column
            prop="dealDate"
            label="允许预售时间">
            </el-table-column>
            <el-table-column
            prop="buildingNo"
            label="楼栋名称">
            </el-table-column>
            <el-table-column
            prop="floor"
            label="楼层">
            </el-table-column>
            <el-table-column
            prop="doorRatio"
            label="梯户比">
            </el-table-column>
            <el-table-column
            prop="doorStructure"
            label="户型结构">
            </el-table-column>
            <el-table-column
            prop="buildForm"
            label="建筑形态">
            </el-table-column>
            <el-table-column
            prop="dealRoom"
            label="已售户数">
            </el-table-column>
            <el-table-column
            prop="dealArea"
            label="已售面积(㎡)">
            </el-table-column>
            <el-table-column
            prop="aveAmount"
            label="成交均价(万/㎡)">
            </el-table-column>
            <el-table-column
            prop="totalRoom"
            label="总户数">
            </el-table-column>
            <el-table-column
            prop="totalArea"
            label="总建筑面积">
            </el-table-column>
        </el-table>
         <el-pagination
          layout="prev, pager, next"
          :page-size="10"
          :total="totalPage"
          @current-change="pageChange">
        </el-pagination>
      </dv-border-box-12>
      
  </div>
</template>

<script>
import House from "../../../api/House"
export default {
  props:['id'],
    data(){
        return{
          propertyArr:[],
          buildArr:[],
          presellList:[],
          propertyType:[],
          buildForm:[],
          presellNo:[],
          formInline: {
              propertyType:'',
              buildForm:'',
              startDate:'',
              endDate:'',
              presellNo:'',
              page:1,
              limit:10
          },
          tableData:[],
          totalPage:0,
          tableHeight:520
        }
    },
    watch:{
      propertyType(newVal){
        this.formInline.propertyType = newVal.join(',')
      },
      buildForm(newVal){
        this.formInline.buildForm = newVal.join(',')
      },
      presellNo(newVal){
        this.formInline.presellNo = newVal.join(',')
      }
    },
    methods:{
      onSubmit(){
        House.getFloorInfo(this.id,this.formInline).then(res=>{
          this.totalPage = res.data.data.total
          this.tableData = res.data.data.list
        })
      },
      pageChange(i){
        this.formInline.page = i
         House.getFloorInfo(this.id,this.formInline).then(res=>{
          this.totalPage = res.data.data.total
          this.tableData = res.data.data.list
        })
      }
    },
    created(){
      this.tableHeight = window.innerHeight * 0.54
      House.getDict('property_type').then(res=>this.propertyArr = res.data.data)
      House.getDict('build_form').then(res=>this.buildArr = res.data.data)
      House.getPresellList().then(res=>{this.presellList = res.data.data })
      House.getFloorInfo(this.id,this.formInline).then(res=>{
        this.totalPage = res.data.data.total
        this.tableData = res.data.data.list
      })
    }
}
</script>

<style lang="scss" scoped>
.buildingInfo_wrap{
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
    .table_mask{
        background: rgba(47,62,70,.8);
        border-radius: 8px;
        width: 100%;
        height:calc(100% - 80px)
    }
     /deep/.border-box-content{
          position: relative;
          z-index: 666;
      }
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
        .el-pagination{
      text-align: right;
      margin-right:6%;
      margin-top:16px;
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