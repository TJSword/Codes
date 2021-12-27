<template>
  <div :class="['regionDetail_wrap',ani?'regionDetail_wrap_active':'']">
    <LandDetail v-if="showDetail" :landId="landId"/>
    <dv-border-box-12 :class="['list_mask',ani?'list_mask_active':'']">
        <i class="iconfont icon-guanbi" @click="close"></i>
        <el-form :inline="true" :model="formInline" size="small" style="display:flex;justify-content: flex-start;margin:20px 0 0 1.5%;">
            <el-form-item label="">
                <el-select v-model="formInlineRegionno" placeholder="区域" clearable multiple :collapse-tags="true">
                <el-option :label="item.name" :value="item.regionno" v-for="item in regionnoArr" :key="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="">
                <el-select v-model="tableType" placeholder="图表类型" >
                    <el-option :label="item.label" :value="item.value" v-for="item in tableTypeArr" :key="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="" v-show="showDateType">
                <el-select v-model="formInline.dateType" placeholder="统计时间类型" clearable >
                <el-option :label="item.label" :value="item.value" v-for="item in dateArr" :key="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="">
                <el-select v-model="formInlineSellTypeArr" placeholder="出让方式" clearable multiple :collapse-tags="true">
                <el-option :label="item.label" :value="item.value" v-for="item in sellTypeArr" :key="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="">
                <el-select v-model="formInlineLandUses" placeholder="土地用途"  clearable multiple :collapse-tags="true">
                    <el-option :label="item.label" :value="item.value" v-for="item in landUseArr" :key="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-date-picker type="date" placeholder="开始日期" v-model="formInline.sellDateStart"  style="width: 100%;"></el-date-picker>
            </el-form-item>
                <el-form-item>
                <el-date-picker type="date" placeholder="结束日期" v-model="formInline.sellDateEnd" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <div class="submit_btn" @click="onSubmit">查询</div>
            </el-form-item>
        </el-form>
        <div class="result_box">
            <Quyu :form="formInline" v-if="showTable === 'quyu'"></Quyu>
            <Gongying :form="formInline" v-if="showTable === 'gongying'" @showDetail="showDetailhandler"></Gongying>
            <Chengjiao :form="formInline" v-if="showTable === 'chengjiao'"  @showDetail="showDetailhandler"></Chengjiao>
        </div>
    </dv-border-box-12>
  </div>
</template>

<script>
import Land from "../../api/Land"
import Quyu from './LandType/Quyu'
import Gongying from "./LandType/Gongying"
import Chengjiao from './LandType/Chengjiao'
import LandDetail from './LandDetail'
export default {
  props:['regionno','type'],
  components:{Quyu,Gongying,Chengjiao,LandDetail},
  data(){
    return{
      formInline: {
          regionnos: '',
          dateType: '',
          landUses:'',
          sellTypes:'',
          sellDateStart:'',
          sellDateEnd:''
      },
      ani:false,
      tableType:'quyu',
      showTable:'quyu',
      formInlineRegionno:[],
      formInlineSellTypeArr:[],
      formInlineLandUses:[],
      regionnoArr:[],
      sellTypeArr:[],
      buildArr:[],
      landUseArr:[],
      date:'',
      tableData:[],
      dateArr:[],
      form:[],
      showCountInfo:false,
      countDetail:"",
      showDateType:true,
      tableTypeArr:[{
          label:'区域土地',
          value:'quyu'
      },{
          label:'供应土地',
          value:'gongying'
      },{
          label:'成交土地',
          value:'chengjiao'
      }],
      showDetail:false,
      landId:''
    }
  },
  watch:{
      formInlineRegionno(newVal){
          this.formInline.regionnos = newVal.join(',')
      },
      formInlineSellTypeArr(newVal){
        this.formInline.sellTypes = newVal.join(',')
      },
      formInlineLandUses(newVal){
        this.formInline.landUses = newVal.join(',')
      },
      tableType(newVal){
          if(newVal === 'quyu'){
              this.showDateType = true
          }else{
              this.showDateType = false
          }
      }
  },
  methods:{
      showDetailhandler(data){
          this.landId = data
          this.showDetail = true
      },
      cellStyle(row, column, rowIndex, columnIndex){
          if(row.column.label === '时间'){
            return 'color:#35AFFB;cursor:pointer'
          }
        },
        cellClick(row, column, cell, event){
          if(column.label === '时间' && row.isChild){
            this.form = JSON.parse(JSON.stringify(this.formInline))
            this.form.name = row.name
          }
      }, 
      closeCountInfo(){
        this.showCountInfo = false
      },
      close(){
          this.ani = false
          setTimeout(_=>{
              this.$parent.closeRegionDetail()
          },300)
      },
      closeDetail(){
          this.showDetail =false
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
        this.showTable = ''
        setTimeout(_=>{
          this.showTable = this.tableType
        })
      }
  },
  created(){
      this.formInlineRegionno = [this.regionno]
      Land.getRegionnos().then(res=>this.regionnoArr = res.data.data)
      Land.getDict('sell_type').then(res=>this.sellTypeArr = res.data.data)
      Land.getDict('land_use').then(res=>this.landUseArr = res.data.data)
      Land.getDict('date_type').then(res=>this.dateArr = res.data.data)
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
                height:90%;
                width:98%;
                margin-left:1%;
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
