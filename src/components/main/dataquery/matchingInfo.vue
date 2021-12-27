<template>
  <!-- 配套信息 -->
  <div class="matching_info">
    <div class="info_head">
      <div class="title">信息</div>
      <div class="head_select" v-if="school_select">
        <div class="select_item" v-for="(item,index) in attributeArr" :key="index">
          <label for="">{{item.label}}:</label>
          <el-select @change="setMatchingData(parentObj)" class="select_cont" size="mini" v-model="item.value" placeholder="请选择">
          <el-option
            v-for="option in item.options"
            :key="option.value"
            :label="option.label"
            :value="option.value">
          </el-option>
        </el-select>
        </div>
      </div>
    </div>
    <div class="info_content">
      <el-table
        v-if="classificationObj.length>0"
        class="matching_table"
        ref="matchingTable"
        height="100%"
        width="100%"
        :data="tableData"
        border
        @header-click="setColColor"
        :header-cell-style="{ background: '#222222', color: '#fff' }"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          label="板块名称"
          width="150"
          header-align="center"
          align="center"  
          prop="partname"
        >
        </el-table-column>
        <el-table-column 
          v-for="(item,index) in colDataArr" :key="index"
          sortable :label="item.label"
          align="center" :prop="item.value"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { setPlateColor } from "@/utils/public"
import dataqueryApi from '@/api/dataqueryApi'
import { mapGetters } from 'vuex'
export default {
  name:'matchinginfo',
  data(){
    return{
      attributeArr:[
        // {
        //   label:'类别',
        //   eName:'',
        //   value:null,
        //   options:[
        //     {label:'普通初中',value:'ptcz'},
        //     {label:'艺术初中',value:'yscz'}
        //   ]
        // }
      ],
      tableData:[
        // {plateName:'市南区',data1:12390,data2:239083,data3:239083,data4:239083,data5:239083}
      ],
      curCol:null,//当前列的type
      colDataArr:[],//表头数据
      parentObj:null,//标签父级对象
      school_select:false,//显示教育筛选条件
    }
  },
  mounted(){

  },
  watch:{
    classificationObj:{
      handler(newVal){
        if(this.queryMenuIndex==1&&newVal.length>0){
          console.log(newVal)
          this.setMatchingTable(newVal)
        }else{
          this.attributeArr = []
          this.tableData = []
        }
      },
      deep:true
    },
    plateArr:{
      handler(){
        if(this.classificationObj.length>0){
          this.setMatchingData(this.parentObj)
        }
      },
      deep:true
    }
  },
  computed:{
      ...mapGetters(["mapbox_map","userMenuList","plate_color","classificationObj","plateArr","plateType","queryMenuIndex","plateData"])
  },
  methods:{
    setMatchingTable(obj){ //设置配套表格数据
      let pid = obj[0].pid
      let pObj = this.userMenuList.filter(item=>pid===item.id)[0]
      let cur = this.classificationObj[0]
      this.parentObj = pObj
      console.log(pObj)
      switch(pObj.name){ 
        case '教育': //教育
          //设置表头数据
          this.colDataArr = [
            {label:'教育成果奖',value:'edureward'},
            {label:'科研优秀成果奖',value:'majorreward'},
            {label:'评定优质课数量',value:'qualitycourse'},
            {label:'名师数量',value:'famousmaster'},
            {label:'教育能手数量',value:'expertedu'},
            {label:'生源数量',value:'biogeny'}
          ];
          //设置表格筛选项
          this.setSelects(obj[0])
          this.school_select = true
          break;
        case '商业': //商业
          //设置表头数据
          dataqueryApi.getTypeDict(pObj.url)
          .then(res=>{
            if(res.data.code===0){
              console.log('字典数据',res)
              this.colDataArr = res.data.data
            }
          });
          this.school_select = false
          break;
        case '交通': //交通
          //设置表头数据
          this.colDataArr = [
            {label:cur.name+'—'+(cur.ismonth==='0'?'数量(个)':'长度(米)'),value:cur.ismonth==='0'?'idnum':'length'}
          ];
          this.school_select = false
          break;
        case '市政': //市政
          //设置表头数据
          this.colDataArr = [
            {label:cur.name+'—数量(个)',value:'idnum'}
          ];
          this.school_select = false
          break;
        case '不利因素': //不利因素
          //设置表头数据
          this.colDataArr = [
            {label:cur.name+'—数量(个)',value:'idnum'}
          ];
          this.school_select = false
          break;
        case '自然': //自然
          //设置表头数据
          this.colDataArr = [
            {label:cur.name+'—'+(cur.ismonth==='2'?'面积(平方米)':'长度(米)'),value:cur.ismonth==='2'?'area':'length'}
          ];
          this.school_select = false
          break;
        case '产业': //产业
          //设置表头数据
          dataqueryApi.getTypeDict(obj[0].url)
          .then(res=>{
            if(res.data.code===0){
              console.log('chanye字典数据',res)
              this.colDataArr = res.data.data
            }
          });
          this.school_select = false
          break;
        default:
          console.log('暂无配套数据可查询')
      }
      setTimeout(()=>{
        //请求table数据
        this.setMatchingData(pObj)
      },300)
    },
    setSelects(data){ //配套-教育 字典查询
      this.attributeArr = []
      data.children.forEach(item=>{
        let obj = {
          label:item.name,
          eName:item.url,
          value:null,
          options:[{label:'全部',value:null}]
        }
        dataqueryApi.getMatchingDict(item.url)
        .then(res=>{
          if(res.data.code===0){
            let list = res.data.data
            obj.options = list.concat(obj.options)
            this.attributeArr.push(obj)
          }
        })
      })
    },
    setMatchingData(pObj){ //所选板块配套数据请求
      setPlateColor([],this.mapbox_map,this.plate_color)

      let str = ''
      this.plateArr.forEach(item=>{
        str += (item+',')
      })
      if(pObj.name==="教育"){
        let obj = {
          regionno:str,
          schoolType:this.classificationObj[0].url,
          type:this.plateType
        }
        this.attributeArr.forEach(item=>{
          if(item.value!=null){
            obj[item.eName] = item.value
          }
        })
        dataqueryApi.getMatchingEducation(obj)
        .then(res=>{
          if(res.data.code===0){
            console.log('配套信息-教育',res)
            let list = res.data.data
            if(this.plateType==="region"){
              list.forEach(item=>{
                item.partname = this.plateData.region.filter(reg=>reg.regionno==item.regionno)[0].name
              })
            }
            list.forEach(item=>{
              item.biogeny = parseInt(item.biogeny)
              item.edureward = parseInt(item.edureward)
              item.expertedu = parseInt(item.expertedu)
              item.famousmaster = parseInt(item.famousmaster)
              item.majorreward = parseInt(item.majorreward)
              item.qualitycourse = parseInt(item.qualitycourse)
              item.schoolsum = parseInt(item.schoolsum)
            })
            if(this.classificationObj[0].name==='幼儿园'){
              this.tableData = []
            }else{
              this.tableData = list
            }
          }
        })
      }else if(pObj.name==="商业"){
        let obj = {
          regionno:str,
          type:this.plateType
        }
         dataqueryApi.getMatchingBusiness(obj)
         .then(res=>{
           console.log('配套商业-业态',res)
           let list = res.data.data
           if(this.plateType==="region"){
              list.forEach(item=>{
                item.partname = this.plateData.region.filter(reg=>reg.regionno==item.regionno)[0].name
              })
            }
            //处理返回的数据格式符合table数据格式
            let arr = []
            let arr_region = []
            list.forEach(item=>{
              let i = arr_region.indexOf(this.plateType==='region'?item.regionno:item.partno)
              if(i===-1){ 
                let item_obj = {}
                item_obj.partname=item.partname
                item_obj[item.type]=parseInt(item.idnum)
                item_obj.regionno = this.plateType==='region'?item.regionno:item.partno
                arr.push(item_obj)
                arr_region.push(this.plateType==='region'?item.regionno:item.partno)
              }else{
                arr[i][item.type] = parseInt(item.idnum)
              }
            })
            arr.forEach(item=>{
              this.colDataArr.forEach(col=>{
                if(item[col.value]===undefined){
                  item[col.value]=0
                }
              })
            })
            this.tableData = arr
         })
      }else if(pObj.name==="交通"){
        let obj = {
          regionno:str,
          type:this.plateType
        }
        dataqueryApi.getMatchingTraffic(this.classificationObj[0].url,obj)
        .then(res=>{
          
          if(res.data.code===0){
            let list = res.data.data
            list.forEach(item=>{
              if(item.length){
                item.length=parseInt(item.length)
              }
              if(item.idnum){
                item.idnum=parseInt(item.idnum)
              }
              if(item.region){
                item.partname=item.region
              }
            })
            this.tableData = list
            
            console.log('配套交通信息',res)
          }
         
        })
      }else if(pObj.name==="市政"||pObj.name==="不利因素"){
        let obj = {
          regionno:str,
          type:this.plateType,
          data:this.classificationObj[0].url
        }
         dataqueryApi.getMatchingResource(obj)
         .then(res=>{
           console.log('配套市政、不利因素信息',res)
           let list = res.data.data
           if(this.plateType==="region"){
              list.forEach(item=>{
                item.partname = this.plateData.region.filter(reg=>reg.regionno==item.regionno)[0].name
              })
            }
            list.forEach(item=>{
              item.idnum = parseInt(item.idnum)
            })
            this.tableData = list
         })
      }else if(pObj.name==="自然"){
        let obj = {
          regionno:str,
          type:this.plateType,
          natualType:this.classificationObj[0].url
        }
        let code = this.classificationObj[0].ismonth==='1'?'natural_l':'natural_p'
        dataqueryApi.getMatchingNatural(code,obj)
        .then(res=>{
          
          if(res.data.code===0){
            let list = res.data.data
            list.forEach(item=>{
              if(item.length){
                item.length = parseInt(item.length)
              }
              if(item.area){
                item.area = parseInt(item.area)
              }
              if(item.region){
                item.partname=item.region
              }
            })
            this.tableData = list
            
            console.log('配套自然信息',res)
          }
         
        })
      }else if(pObj.name==="产业"){
        let obj = {
          regionno:str,
          type:this.plateType
        }
        dataqueryApi.getMatchingPlan(this.classificationObj[0].url,obj)
        .then(res=>{
          
          if(res.data.code===0){
            let list = res.data.data
            if(this.plateType==="region"){
              list.forEach(item=>{
                item.partname = this.plateData.region.filter(reg=>reg.regionno==item.regionno)[0].name
              })
            }
            //处理返回的数据格式符合table数据格式
            let arr = []
            let arr_region = []
            list.forEach(item=>{
              let i = arr_region.indexOf(this.plateType==='region'?item.regionno:item.partno)
              if(i===-1){ 
                let item_obj = {}
                item_obj.partname=item.partname
                item_obj[item.data]=parseInt(item.idnum)
                item_obj.regionno = this.plateType==='region'?item.regionno:item.partno
                arr.push(item_obj)
                arr_region.push(this.plateType==='region'?item.regionno:item.partno)
              }else{
                arr[i][item.data] = parseInt(item.idnum)
              }
            })
            this.tableData = arr
            console.log('配套产业信息',res)
          }
         
        })
      }
      
    },
    setColColor(col){
      console.log(col)
      if(col.property!=this.curCol){
        this.curCol = col.property
      }else{
        this.curCol = null
      }
      let arr = []
      if(this.tableData.length>0&&this.curCol!=null){
        this.tableData.forEach(item=>{
          arr.push({
            regionno:item.partno?item.partno:item.regionno,
            data:item[this.curCol]
          })
        })
      }
      setPlateColor(arr,this.mapbox_map,this.plate_color)
      console.log(arr)
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "row2";
      } else if (rowIndex % 2 === 1) {
        return "row1";
      }
      return "";
    },
  }
}
</script>
<style lang="scss">
.matching_info{
  width: 100%;
  height: 100%;
  border-right: #383838 1px solid;
  .info_head{
    height: 6%;
    background: #222222;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    .title{
      color: #e6a23c;
      font-size: 14px;
    }
    .head_select{
      display: flex;
      .select_item{
        font-size: 12px;
        margin-left: 10px;
        color: #46c5ff;
        .el-input__inner{
          background: none;
          border: none;
          width: 120px;
          font-size: 12px;
          color: #dedede;
        }
      }
    }
  }
  .info_content{
    width: 100%;
    height: 94%;
    background-color: #040506;
    .el-table {
        background-color: #040506;
    }
    .el-table .cell{
      position:relative;
    }
    .el-table .caret-wrapper{
      position: absolute;
      top: -5px;
      right: -3px;
    }
    .el-table td,
    .el-table th.is-leaf,
    .el-table--border,
    .el-table--group {
      border-color: #444444;
    }
    .el-table--border::after,
    .el-table--group::after,
    .el-table::before {
      background-color: #444444;
    }
    .el-table .row1 {
      background: #000000;
    }

    .el-table .row2 {
      background: #101010;
    }
    .el-table td{
      padding: 4px 0;
    }
    .el-table th {
      padding: 6px 0;
      font-size: 12px;
      font-weight: normal;
    }
    .el-table__body-wrapper {
      background: #040506;
    }
  }
  
}
</style>