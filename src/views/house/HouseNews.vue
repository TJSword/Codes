<template>
  <div class="houseNews_wrap">
      <Map @map="getMap"></Map>
      <ProjectDetail :proId="proId" :proPoi="proPoi" :proTitle="proTitle" v-if="showDetail" />
      <DynamicInfo :landId="landId" v-if="showDynamicInfo" />
      <HDDynamicInfo :landId="landId" v-if="showHDDynamicInfo" />
      <div class="title_box">
         <div class="title" @click="curList">{{listType==='presell'?'新增预售':'楼盘动态'}}<span class="tab">点击切换{{listType==='dynamic'?'新增预售':'楼盘动态'}}</span></div>
       </div>
       <dv-border-box-12 class="presell_list" v-show="listType === 'presell'">
            <el-form :inline="true" :model="newsForm" size="small" style="text-align: start;">
          <el-form-item label="">
              <el-select v-model="newsForm.kind" placeholder="区域类型" clearable >
                <el-option :label="item.label" :value="item.value" v-for="item in regionArr" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
               <el-date-picker type="date" placeholder="开始日期" v-model="newsForm.startDate" value-format="yyyy-MM-dd"  style="width: 100%;"></el-date-picker>
            </el-form-item>
             <el-form-item>
            <el-date-picker type="date" placeholder="结束日期"   v-model="newsForm.endDate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <div class="query_btn" @click="getNewPresellList">查询</div>
            </el-form-item>
            </el-form>
             <el-table 
            :data="tableData"
            style="width: 96%;margin-left:2%;background: transparent;color:white"
            :height="tableHeight"
            :cell-style="cellStyle"
            @cell-click="cellClick"
            >
             <el-table-column
            prop="buildingName"
            label="项目名称"
            width="200px">
          </el-table-column>
           <el-table-column
            prop="region"
            label="城区">
          </el-table-column>
          <el-table-column
            prop="presellNo"
            label="预售证"
            width="140px"
            >
          </el-table-column>
          <el-table-column
            prop="dealDate"
            label="预售时间"
             width="100px">
          </el-table-column>
          <el-table-column
            prop="buildFormLabel"
            label="建筑形态">
          </el-table-column>
          <el-table-column
            prop="buildArea"
            label="建筑面积">
          </el-table-column>
           <el-table-column
            prop="unitNum"
            label="楼栋单元数"
            width="90">
          </el-table-column>
           <el-table-column
            prop="houseArea"
            label="住宅面积">
          </el-table-column>
           <el-table-column
            prop="houseNum"
            label="住宅套数">
          </el-table-column>
           <el-table-column
            prop="businessArea"
            label="商业面积">
          </el-table-column>
          <el-table-column
            prop="businessNum"
            label="商业套数">
          </el-table-column>
          <el-table-column
            prop="officeArea"
            label="办公面积">
          </el-table-column>
          <el-table-column
            prop="officeNum"
            label="办公套数">
          </el-table-column>
          <el-table-column
            prop="carportArea"
            label="车库面积">
          </el-table-column>
          <el-table-column
            prop="carportNum"
            label="车库套数">
          </el-table-column>
          <el-table-column
            prop="otherArea"
            label="其他面积">
          </el-table-column>
          <el-table-column
            prop="otherNum"
            label="其他套数">
          </el-table-column>
          </el-table>
          <el-pagination
          layout="prev, pager, next"
          :page-size="newsForm.limit"
          :total="totalPage"
          @current-change="pageChange">
        </el-pagination>
       </dv-border-box-12>
       <dv-border-box-12 class="dynamic_list" v-show="listType === 'dynamic'">
           <el-form :inline="true" :model="dynamicForm" size="small" style="text-align: start;">
            <el-form-item>
               <el-input v-model="dynamicForm.name" clearable placeholder="关键字"></el-input>
          </el-form-item>
          <el-form-item label="">
              <el-select v-model="dynamicForm.kind" placeholder="区域类型" clearable >
                <el-option :label="item.label" :value="item.value" v-for="item in regionArr" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
               <el-date-picker type="date" placeholder="开始日期" v-model="dynamicForm.startDate" value-format="yyyy-MM-dd"  style="width: 100%;"></el-date-picker>
            </el-form-item>
             <el-form-item>
            <el-date-picker type="date" placeholder="结束日期"   v-model="dynamicForm.endDate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item>
                  <div class="query_btn" @click="getProDynamicTotal">查询</div>
            </el-form-item>
            </el-form>
            <div class="table_box">
              <div class="kaipan_box">
                <div class="title">开盘动态</div>
                 <el-table
                  :data="kpData"
                  :cell-style="cellStyle"
                  @cell-click="kpClick"
                  style="width: 96%;margin-left:2%;background: transparent;color:white"
                  >
                  <el-table-column
                  prop="title"
                  label="标题">
                  </el-table-column>
                  <el-table-column
                  prop="create_date"
                  label="时间"
                  width="130">
                  </el-table-column>
              </el-table>
              </div>
              <div class="changgui_box">
                <div class="title">活动动态</div>
                  <el-table
                  :data="cgData"
                  style="width: 94%;margin-left:2%;background: transparent;color:white"
                  :cell-style="cellStyle"
                  @cell-click="cgClick"
                  >
                  <el-table-column
                  prop="title"
                  label="标题">
                  </el-table-column>
                  <el-table-column
                  prop="create_date"
                  label="时间"
                  width="140">
                  </el-table-column>
              </el-table>
              </div>
            </div>
       </dv-border-box-12>
  </div>
</template>

<script>
import House from "../../api/House"
import Map from "../../components/common/map"
import ProjectDetail from "../../components/House/ProjectDetail"
import DynamicInfo from "../../components/House/DynamicInfo"
import HDDynamicInfo from "../../components/House/HDDynamicInfo"
export default {
    components:{
        Map,ProjectDetail,DynamicInfo,HDDynamicInfo
    },
    data(){
        return{
            map:null,
            listType:'dynamic',
            newsForm:{
               regionnos: '',
                startDate:"",
                endDate:'',
                page:1,
                limit:12
            },
            dynamicForm:{
              name:'',
              regionnos: '',
              startDate:"",
              endDate:'',
              page:1,
              limit:999
            },
            tableHeight:630,
            regionArr:[],
            tableData:[],
            totalPage:0,
            kpData:[],
            cgData:[],
            showDetail:false,
            showDynamicInfo:false,
            showHDDynamicInfo:false
        }
    },
    methods:{
        getMap(map){
          this.map = map
        },
        curList(){
          this.listType = this.listType=== 'presell'?'dynamic':'presell'
        },
        getNewPresellList(){
          House.getNewPresellList(this.newsForm).then(res=>{
            this.totalPage = res.data.data.total
            this.tableData = res.data.data.list
          })
        },
        closeDetail(){
          this.showDetail = false
          this.showDynamicInfo = false
          this.showHDDynamicInfo = false
        },
        cellStyle(row, column, rowIndex, columnIndex){
          if(row.column.label === '项目名称' ||row.column.label === '标题' ){
            return 'color:#fcbf49;font-weight:700;cursor:pointer'
          }
        },
        cellClick(row, column, cell, event){
          if(column.label === '项目名称'){
            this.proId = row.buildingId
            this.proTitle = row.buildingName
            this.proPoi = row.coordinate.split(',')
            this.showDetail = true
          }
        },
        kpClick(row, column, cell, event){
            if(column.label === '标题'){
                this.landId = row.id
                this.showDynamicInfo = true
            }
        },
        cgClick(row, column, cell, event){
            if(column.label === '标题'){
                this.landId = row.id
                this.showHDDynamicInfo = true
            }
        },
        pageChange(i){
            this.newsForm.page = i
            this.getNewPresellList()
        },
        getProDynamicTotal(){
           House.getProDynamicTotal(this.dynamicForm).then(res=>{
              this.kpData = res.data.data.kpList
              this.cgData = res.data.data.cgList
            })
        }
    },
    created(){
      this.tableHeight = window.innerHeight *0.67
      House.getRegionnos().then(res=>this.regionArr = res.data.data)
      this.getNewPresellList()
      this.getProDynamicTotal()
    }
}
</script>

<style lang="scss" scoped>
.houseNews_wrap{
  height:calc(100% - 60px);
  width:100%;
  background: rgba(25,22,22,1);
  position: relative;
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
    .presell_list{
        height: 88%;
        width: 92%;
        background: rgba(47,62,70,.8);
        border-radius: 8px;
        position: absolute;
        z-index: 10;
        top:8%;
        left:4%;
        .el-form{
            margin-top:30px;
            margin-left:30px;
        }
        .el-form-item{
        width:180px;
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
      margin-top:10px;
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
    .dynamic_list{
      height: 88%;
      width: 92%;
      background: rgba(47,62,70,.8);
      border-radius: 8px;
      position: absolute;
      z-index: 10;
      top:8%;
      left:4%;
      .el-form{
            margin-top:30px;
            margin-left:30px;
        }
        .el-form-item{
        width:180px;
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
      .table_box{
        width: 100%;
        height: calc(100% - 82px);
        display: flex;
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
          margin-top:10px;
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
        .kaipan_box{
          width: 50%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          .title{
            color:white;
            font-weight: 700;
          }
        }
        .changgui_box{
          width: 50%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
           .title{
            color:white;
            font-weight: 700;
          }
        }
      }
    }
}
</style>