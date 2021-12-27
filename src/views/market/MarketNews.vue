<template>
  <div class="marketNews_wrap">
      <Map @map='getMap'/>
      <div class="from_box">
        <el-form :inline="true" :model="formInline" size="small" style="text-align:start;">
            <el-form-item>
               <el-select v-model="formInline.type" placeholder="咨询类别" clearable >
                  <el-option :label="item.label" :value="item.value" v-for="item in typeArr" :key="item.regionno"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                   <el-input v-model="formInline.name" placeholder="关键字" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-date-picker type="date" placeholder="开始日期" v-model="formInline.startDate" style="width: 100%;" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
             <el-form-item>
                <el-date-picker type="date" placeholder="结束日期" v-model="formInline.endDate" style="width: 100%;" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <div class="query_btn" @click="getNewsList">查询</div>
            </el-form-item>
          </el-form>
      </div>
    <dv-border-box-12 class="list_mask">
      <el-table 
          :data="tableData"
          style="width: 96%;margin-left:2%;margin-top:1%;background: transparent;color:white"
          :height="tableHeight"
          :cell-style="cellStyle"
          @cell-click="cellClick"
          >
          <el-table-column
            prop="label"
            label="咨询类别"
            width="100">
          </el-table-column>
          <el-table-column
            prop="title"
            label="标题"
            >
          </el-table-column>
          <el-table-column
            prop="newDate"
            label="发布时间"
            width="100"
            >
          </el-table-column>
        </el-table>
        <el-pagination
          layout="prev, pager, next"
          :page-size="12"
          :total="totalPage"
          @current-change="pageChange">
        </el-pagination>
    </dv-border-box-12>
    <dv-border-box-12 :class="['detail_mask',showDetail?'detail_mask_active':'']">
       <i class="iconfont icon-guanbi" @click="close"></i>
        <div class="title">
           {{newsInfo.title}}
         </div>
         <div class="info_box">
           <div class="source">信息来源:{{newsInfo.source}}</div>
           <div class="newDate">发布时间:{{newsInfo.newDate}}</div>
           <div class="infoType">信息类型:{{newsInfo.label}}</div>
         </div>
         <div class="content" v-html="newsInfo.content">
          
         </div>
    </dv-border-box-12>
  </div>
</template>

<script>
import Map  from '../../components/common/map'
import Market from "../../api/Market"
export default {
    components:{
        Map
    },
    data(){
      return{
        typeArr:[],
        tableData:[],
        formInline:{
          newsType:'news',
          type:'',
          name:'',
          startDate:'',
          endDate:'',
          page:1,
          limit:12
        },
        tableHeight:600,
        totalPage:0,
        newsInfo:{},
        showDetail:false
      }
    },
    methods:{
      getMap(map){
        this.map = map
      },
      pageChange(page){
        this.formInline.page = page
        this.getNewsList()
      },
      getNewsList(){
          Market.getNewsList(this.formInline).then(res=>{
            this.tableData = res.data.data.list
            this.totalPage = res.data.data.total
            this.newsInfo = this.tableData[0]
          })
      },
       cellStyle(row, column, rowIndex, columnIndex){
          if(row.column.label === '标题'){
            return 'color:#fcbf49;font-weight:700;cursor:pointer'
          }
        },
      cellClick(row, column, cell, event){
        if(column.label === '标题'){
          this.showDetail = true
          this.newsInfo = row
        }
      },
      close(){
        this.showDetail = false
      }
    },
    created(){
      Market.getDict('news_type').then(res=>{this.typeArr = res.data.data})
      this.getNewsList()
    }
}
</script>

<style lang="scss" scoped>
.marketNews_wrap{
  height:calc(100% - 60px);
  width:100%;
  background: rgba(25,22,22,1);
  position: relative;
  .from_box{
    position: absolute;
    top:3%;
    left:1.5%;
    .el-form-item{
      width:128px;
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
  }
  .list_mask{
    position: absolute;
    top:calc(6% + 50px);
    left:1.5%;
    width:34.3%;
    height:80%;
    background: rgba(47,62,70,.8);
    border-radius: 8px;
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
  .detail_mask{
    position: absolute;
    top:calc(6% + 50px);
    right:10%;
    width:31.5%;
    height:80%;
    background: rgba(47,62,70,.8);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    color:white;
    transform: scaleY(0.01);
    transition: all 0.3s ease;
    opacity: 0;
     .icon-guanbi{
          position: absolute;
          right: 22px;
          top:18px;
          color:white;
          font-size:20px;
          z-index: 21;
          &:hover{
              transform: rotate(180deg);
              transition: all 0.3s ease;
          }
      }
    .title{
        font-size:22px;
        font-weight: 700;
        margin-top:26px;
      }
      .info_box{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top:15px;
        font-size: 14px;
        .source,.newDate,.infoType{
          padding:0 20px;
          margin-left:20px;
        }
      }
      .content{
          margin-top:20px;
          line-height: 22px;
          height:80%;
          padding: 0 26px;
          overflow-y: scroll;
          &::-webkit-scrollbar{
            display: none;
          }
      }
      /deep/img{
        width: 96%;
      }
  }
  .detail_mask_active{
    transform: scaleY(1);
    transition: all 0.3s ease;
    opacity: 1;
  }
}
</style>