<template>
  <div :class="['regionDetail_wrap',ani?'regionDetail_wrap_active':'']">
    <CountInfo :form ="countForm" v-if="showCountInfo"></CountInfo>
    <dv-border-box-12 :class="['list_mask',ani?'list_mask_active':'']">
        <i class="iconfont icon-guanbi" @click="close"></i>
        <el-form :inline="true" :model="formInline" size="small" style="display:flex;justify-content: flex-start;margin:20px 0 0 2%;">
             <el-form-item label="" >
            <el-select v-model="formInlineRegionno" placeholder="区域" clearable multiple :collapse-tags="true">
            <el-option :label="item.name" :value="item.regionno" v-for="item in regionnoArr" :key="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="">
            <el-select v-model="formInline.dateType" placeholder="统计时间类型" clearable :collapse-tags="true">
                <el-option :label="item.label" :value="item.value" v-for="item in dateArr" :key="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="">
            <el-select v-model="formInlinePropertyType" placeholder="物业类型" clearable multiple :collapse-tags="true">
            <el-option :label="item.label" :value="item.value" v-for="item in propertyArr" :key="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="">
            <el-select v-model="formInline.dataType" placeholder="数据类型"  clearable>
                <el-option :label="item.label" :value="item.value" v-for="item in dataArr" :key="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-date-picker type="date" placeholder="开始日期" v-model="formInline.startDate"  style="width: 100%;"></el-date-picker>
        </el-form-item>
            <el-form-item>
            <el-date-picker type="date" placeholder="结束日期" v-model="formInline.endDate" style="width: 100%;"></el-date-picker>
        </el-form-item>
            <el-form-item>
                <div class="submit_btn" @click="onSubmit">查询</div>
            </el-form-item>
        </el-form>
        <div class="result_box">
          <el-table
          :data="tableData"
          style="width: 99%;margin-left:0.5%;margin-top:0.5%;background: transparent;color:white"
          :cell-style="cellStyle"
          @cell-click="cellClick"
          :height="tableHeight"
          row-key="id"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column
            prop="dd"
            label="时间">
          </el-table-column>
          <el-table-column
            prop="xsnum"
            label="销售套数">
          </el-table-column>
          <el-table-column
            prop="xsarea"
            label="销售面积"
            >
          </el-table-column>
          <el-table-column
            prop="xsamount"
            label="销售总价">
          </el-table-column>
          <el-table-column
            prop="ave"
            label="销售均价">
          </el-table-column>
          <el-table-column
            prop="xznum"
            label="新增套数">
          </el-table-column>
           <el-table-column
            prop="xzarea"
            label="新增面积">
          </el-table-column>
           <el-table-column
            prop="clnum"
            label="存量套数">
          </el-table-column>
           <el-table-column
            prop="clarea"
            label="存量面积">
          </el-table-column>
           <el-table-column
            prop="tfnum"
            label="退房套数">
          </el-table-column>
          <el-table-column
            prop="tfarea"
            label="退房面积">
          </el-table-column>
        </el-table>
        </div>
    </dv-border-box-12>
  </div>
</template>

<script>
import House from "../../api/House"
import CountInfo from "./CountInfo"
export default {
  components:{
    CountInfo
  },
  props:['regionno'],
  data(){
    return{
    formInline: {
        regionno: '',
        dateType: '',
        propertyType:'',
        dataType:'',
        startDate:'',
        endDate:''
      },
      ani:false,
      formInlineRegionno:[],
      formInlinePropertyType:[],
      regionnoArr:[],
      propertyArr:[],
      buildArr:[],
      dataArr:[],
      date:'',
      tableData:[],
      dateArr:[],
      form:[],
      showCountInfo:false,
      countDetail:"",
      tableHeight:700
    }
  },
  watch:{
    //   regionno:{
    //       handler(newVal){
    //           console.log(newVal)
    //           House.getcountList({'regionno':newVal}).then(res=>{
    //             this.tableData = this.disposeData(res.data.data)
    //             console.log(this.tableData)
    //          })
    //       }
    //   },
      formInlineRegionno(newVal){
        this.formInline.regionno = newVal.join(',')
      },
      formInlinePropertyType(newVal){
        this.formInline.propertyType = newVal.join(',')
      }
  },
  methods:{
       cellStyle(row, column, rowIndex, columnIndex){
        if(row.column.label === '时间'  && row.row.isChild){
          return 'color:#fcbf49;font-weight:700;cursor:pointer'
        }
        },
        cellClick(row, column, cell, event){
          if(column.label === '时间' && row.isChild){
            this.countForm =  JSON.parse(JSON.stringify(this.formInline))
            this.countForm.name = row.name
            this.showCountInfo = true
            // House.getCountInfo(this.form).then(res=>{
             
            //   this.countDetail = res.data.data
            //   console.log(res)
            // })

          }
      }, 
      close(){
          this.ani =false;
          setTimeout(_=>{
              this.$parent.hideBox()
          },300)
      },
      closeDetail(){
        this.showCountInfo = false
      },
      disposeData(arr){
        arr.forEach(item=>{
          if(item.children && item.children.length !== 0){
            item.children.forEach(item1=>{
              item1.isChild = true
              delete item1.dd
              item1.dd = item1.name
            })
          }
        })
        return arr
      },
      onSubmit(){
        House.getcountList(this.formInline).then(res=>{
          this.tableData = this.disposeData(res.data.data)
        })
      }
  },
  created(){
        this.tableHeight  = window.innerHeight * 0.74
        this.formInlineRegionno = [this.regionno];
        this.formInline.regionno = this.regionno
        House.getRegionnos().then(res=>this.regionnoArr = res.data.data)
        House.getDict('property_type').then(res=>this.propertyArr = res.data.data)
        House.getDict('data_type').then(res=>this.dataArr = res.data.data)
        House.getDict('date_type').then(res=>this.dateArr = res.data.data)
        House.getcountList(this.formInline).then(res=>{
            this.tableData = this.disposeData(res.data.data)
        })
  },
  mounted(){
      setTimeout(_=>{
          this.ani = true
      },30)
  }
}
</script>
<style lang="scss" scoped>
    .regionDetail_wrap{
        position: absolute;
        height: 100%;
        width:100%;
        top:0;
        left:0;
        z-index: 20;
        background: #41454a00;
        transition: all 0.3s ease;
        .el-form{
           
        }
         /deep/.el-icon-arrow-right{
      color:white;
    }
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
      /deep/.el-tag{
        background:  #4B79A1;
        color:white;
      }
      .submit_btn{
        color:white;
        font-size:13px;
        height:36px;
        width:100px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #1e3c72;  /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #2a5298, #1e3c72);  /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #2a5298, #1e3c72); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        border-radius: 8px;
        user-select: none;
        cursor: pointer;
        margin-top:-2px;
        &:active{
              opacity: 0.7;
          }
      }
        .list_mask{
            position: absolute;
            height:92%;
            width:92%;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            border-radius: 6px;
            background:#112831;
            transform: scaleY(0.5);
            opacity: 0;
            top:4%;
            left:4%;
            z-index: 20;
            transition: all 0.3s ease;
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
            .el-form{
                margin-top:12px;
                margin-left:16px;
                .el-form-item{
                width:160px;
                height: 32px;
                }
                /deep/ .el-input__inner {
                    height: 32px!important;
                }
                /deep/.el-select .el-select__tags>span{
                  display: flex;
                }  
            }
            .result_box{
                height:calc(100% - 100px);
                width:98%;
                margin-left:1%;
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
            }
        }
        .list_mask_active{
            transform: scaleY(1);
            opacity: 1;
            transition: all 0.3s ease;
        } 
    }
    .regionDetail_wrap_active{
        background: #41454a78;
        transition: all 0.3s ease;
    }
  
</style>
