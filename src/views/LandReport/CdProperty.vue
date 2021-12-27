<template>
  <!-- 竞品物业类型 -->
  <div class="cd_wrap">
    <div class="cd_wrap_box">
      <div class="page_top">
        <h3>竞品权重及物业类型建筑形态选择</h3>
        <!-- 操作按钮 -->
        <div class="option_box">
          <el-button size="mini" type="info" @click="CdReSelect()">重选竞品</el-button>
          <el-button size="mini" type="success" @click="subProperties()">确认</el-button>
        </div>
      </div>
      <!-- 报告内容 -->
      <div class="page_content">
        <!-- 竞品配置 -->
        <div class="cd_set" v-show="true">
          <!-- 权重调整 -->
          <div class="cd_box">
            <div class="cd_item">
              <div class="name">
                <div class="name_label" 
                @click="showPropertyBox(-1,landPoint.name)"
                :style="{'background':curProIndex==-1?'rgba(34, 133, 236, 0.8)':'rgba(245, 108, 108, 0.8)'}">{{landPoint.name}}</div>
              </div>
              <div class="weight" style="font-size:13px">请调整竞品参考权重</div>
            </div>
            <div class="cd_item" v-for="(item,i) in cd_list" :key="item.id">
              <div class="name">
                <div class="name_label" 
                @click="showPropertyBox(i,item.name)"
                :style="{'background':curProIndex==i?'rgba(34, 133, 236, 0.8)':'rgba(37, 80, 86, 0.8)'}">{{item.name}}</div>
              </div>
              <div class="weight">
                <el-input class="label" v-model="item.weight" :disabled="item.isLock" @focus="selectWeightInput(i)" @input="weightChange">
                  <template slot="append">%</template>
                </el-input>
                <i :class="['menu_icon ', item.isLock?'el-icon-lock':'el-icon-unlock']" 
                  :style="{'color':item.isLock?'#f56c6c':'#333'}"
                @click="item.isLock=!item.isLock"></i>
              </div>

            </div>
          </div>
        </div>
        <!-- 物业类型 -->
        <div class="property_box" v-show="curProIndex!==null">
          <div class="title">物业类型-{{curCdName}}</div>
          <el-tree
            ref="properties"
            :data="propertyTree"
            :props="props"
            @check="selectProperty"
            node-key="value"
            :highlight-current="false"
            :default-expanded-keys="propertyDefault"
            :default-checked-keys="projectProperty"
            show-checkbox
            accordion>
          </el-tree>
        </div>
        
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import LandReportApi from '@/api/LandReportApi_zlq'
export default {
  name:'cd',
  props:{
    reportId:{ //报告ID
      type:String,
      default:''
    }
  },
  components:{
    
  },
  data(){
    return{
      ledgerId:'1309320807310635009', //台账ID-获取预选竞品
      haveCdFlag:null, //报告是否有存在竞品
      landPoint:{ //台账点数据
        coordinates:[120.23042361537125,36.24800122837756],
        buildingId:'oxxxsN0U8NIkBpY9',
        name:'本项目',
        address:'重庆路38号',
        plateId:'3702140006',
        projectCdId:null,//本项目的保存的id
      },
      projectList:[ //竞品数据
        // { name:'竞品1',id:'1',coord:[120.22864487230652,36.246409190130365],iscircle:'1' }
      ],
      cd_list:[], //选择的竞品
      curCdIndex:null,//当前修改的竞品索引
      curCdName:'点击项目名称切换',//
      weigthWarning:false,//权重是否溢出
      propertyTree:[],//物业类型及产品
      props: { //树结构配置
        children: 'children',
        label: 'label'
      },
      propertyDefault:['house'],//默认展开的节点
      curProIndex:-1,//当前物业类型索引
      projectProperty:[],//本项目选择的物业类型-value
      projectPropertyArr:[],//本项目选择的物业类型-node
      saveCdArr:[],//已保存的竞品
      addCdArr:[],//添加的竞品项目id列表 buildingId
      delCdId:[],//删除的竞品id数组
      
    }
  },
  mounted(){
    this.getLedgerInfo()
    this.getCdProperty()
  },
  computed:{
    ...mapGetters([])
  },
  watch:{
    
  },
  methods:{
    getLedgerInfo(){ //根据报告ID获取台账信息
      this.ledgerId = '1309320807310635009'
    },
    getCdProperty(){ //获取物业类型
      var that = this
      LandReportApi.getCdPropertyList()
      .then(res=>{
        if(res.data.code===0){
          let data = res.data.data
          console.log(data)
          let data1 = []
          that.propertyTree = []
          data.forEach(item=>{
            if(item.dict_type==="property_type"){
              that.propertyTree.push({
                type:item.dict_type,
                label:item.label,
                value:item.value,
                remark:item.remark
              })
            }else{
              data1.push({
                type:item.dict_type,
                label:item.label,
                value:item.value,
                remark:item.remark
              })
            }
          })
          that.propertyTree.forEach(item=>{
            if(item.remark=="praetorium"||item.remark=="house")
            item.children = data1.filter(info=>info.remark===item.remark)
          })
          
          //本项目物业类型默认全选
          let keyArr = []
          let nodeArr = []
          that.propertyTree.forEach(item=>{
            if(item.value=='house'){
              keyArr.push(item.value)
              nodeArr.push(item)
              if(item.children){
                item.children.forEach(c=>{
                  keyArr.push(c.value)
                  nodeArr.push(c)
                })
              }
            }
          })
          this.$nextTick(()=>{
            that.projectProperty = keyArr
            that.projectPropertyArr = nodeArr
          })
          console.log(that.propertyTree)
          //获取报告保存的竞品
          that.getReportCd(that.reportId)
        }
      })
    },
    getReportCd(reportId){ //获取报告保存的竞品
      var that = this
      LandReportApi.getCDinfos({reportId:reportId})
      .then(res=>{
        if(res.data.code===0){
          let data = res.data.data
          data.forEach(item=>{ 
            if(item.isCompetitor==='0'){ //设置本项目的id
              that.landPoint.projectCdId  = item.id
            }
          })
          let cdData = data.filter(item=>item.isCompetitor==='1') //排除结果中的本项目数据
          that.saveCdArr = JSON.parse(JSON.stringify(cdData))
          console.log('保存的竞品',data)
          
          if(cdData.length>0){ //已选择竞品
            that.setInitWeight(cdData)
          }else{ //未选择竞品
            that.$message('该报告还未选择竞品,点击重选选择项目竞品')
          }
        }else{
          that.$message('项目竞品获取失败')
        }
      })
    },
    setInitWeight(saveCd){ //设置竞品初始信息
      var that = this
      if(saveCd){ //已保存竞品设置权重
        let arr = []
        saveCd.forEach(item=>{
          let coord = item.coordinates.split(',')
          arr.push({
            cdId:item.id,
            id:item.buildingId,
            name:item.buildingName,
            isLock:false,
            weight:item.weight,
            coord:coord
          })
        })
        
        //设置竞品物业类型
        LandReportApi.getCDProperty(this.reportId)
        .then(res=>{
          if(res.data.code===0){
            let data = res.data.data
            console.log('已保存的竞品物业类型',data)
            let allProperties = JSON.parse(JSON.stringify(that.projectPropertyArr))
            data.forEach(item=>{
              let pro = item.types.split(',')
              pro.pop()
              if(item.is_competitor==='0'){ //本项目物业类型
                that.projectProperty = pro
                that.projectPropertyArr = allProperties.filter(a=>{
                  return pro.includes(a.value)
                })
              }else{ //竞品物业类型
                arr.forEach(b=>{
                  if(b.id===item.building_id){
                    b.properties = pro
                    b.propertiesArr = allProperties.filter(a=>{
                      return pro.includes(a.value)
                    })
                  }
                })
              }
            })
          }
        })
        this.cd_list = arr
      }else{ //新建报告配置板块内竞品权重（平权）
        let list = JSON.parse(JSON.stringify(this.projectList))
        let cdList = list.filter(item=>{
          return item.iscircle == '1'
        })
        if(cdList.length>0){
          let average = JSON.parse((100/cdList.length).toFixed(1))
          cdList.forEach((item,i)=>{
            item.isLock = false
            if(i==cdList.length-1){
              item.weight = JSON.parse((100-(cdList.length-1)*average).toFixed(1))
            }else{
              item.weight = average
            }
          })
          this.cd_list = cdList
        }
        //竞品物业类型默认全选
        this.cd_list.forEach(item=>{
          item.properties = JSON.parse(JSON.stringify(this.projectProperty))
          item.propertiesArr = JSON.parse(JSON.stringify(this.projectPropertyArr))
        })
      }
      
    },
    
    selectWeightInput(i){ //选中权重输入框
      this.curCdIndex = i
    },
    showPropertyBox(i,name){ //显示物业形态内容
      this.curCdName = name
      if(this.curProIndex===i){
        this.curProIndex = null
      }else{
        this.curProIndex = i
        if(i==-1){
          let propertyKey = JSON.parse(JSON.stringify(this.projectProperty))
          this.$refs.properties.setCheckedKeys(propertyKey)
        }else{
          if(this.cd_list[i].properties){
            let propertyKey = JSON.parse(JSON.stringify(this.cd_list[i].properties))
            this.$refs.properties.setCheckedKeys(propertyKey)
          }else{
            this.$refs.properties.setCheckedKeys([])
          }
        }
      }
    },
    selectProperty(checkedNodes,checked){ //选择竞品的物业形态
      console.log(checkedNodes,checked)
      if(this.curProIndex==-1){ //本项目选择物业类型，竞品相应选择
        this.projectProperty = checked.checkedKeys
        this.projectPropertyArr = checked.checkedNodes
        this.cd_list.forEach(item=>{
          item.properties = checked.checkedKeys
          item.propertiesArr = checked.checkedNodes
        })
      }else{
        //竞品的物业类型不能是本项目未选择的物业类型
        if(!this.projectProperty.includes(checkedNodes.value)){
          this.$message('本项目未选择此项,请先在本项目中选择该项')
          this.$refs.properties.setCheckedKeys(this.projectProperty);
        }else{
          this.cd_list[this.curProIndex].properties = checked.checkedKeys
          this.cd_list[this.curProIndex].propertiesArr = checked.checkedNodes
        }
        
      }
    },
    weightChange(val){ //重新分配权重
      //未锁定的
      let unlockArr = this.cd_list.filter((item,i) => {
        return (i!==this.curCdIndex&&!item.isLock)
      })
      if(unlockArr.length<1){
        return false
      }
      //剩余权重
      let surplus = 100
      this.cd_list.forEach((item,i)=>{
        if(i===this.curCdIndex||item.isLock){
          surplus -= item.weight
        }
      })
      //判断权重是否溢出
      if(surplus<0){
        this.$message({
          message: '请合理配置权重',
          type: 'warning',
          duration:600
        })
        this.weigthWarning = true
        return false
      }
      //未锁定均值
      let average = JSON.parse((surplus/unlockArr.length).toFixed(1))
      //最后一个权重补全
      let sup_id = unlockArr[unlockArr.length-1].id
      let sup_weight = JSON.parse((surplus-average*(unlockArr.length-1)).toFixed(1))
      //未锁定赋值
      this.cd_list.forEach((item,i)=>{
        if(i!==this.curCdIndex&&!item.isLock){
          if(item.id===sup_id){
            item.weight = sup_weight
          }else{
            item.weight = average
          }
        }
      })
      
      this.weigthWarning = false
    },
    subProperties(){ //提交竞品跟权重
      var that = this
      //保存竞品信息
      let selfObj = {
        "reportId": that.reportId,
        "buildingId":'0',
        "buildingName":'本项目',
        "isCompetitor":'0',//本项目
        "coordinates":that.landPoint.coordinates[0]+','+that.landPoint.coordinates[1]
      }
      if(that.landPoint.projectCdId!==null){ 
        selfObj.id = that.landPoint.projectCdId
      }
      let cd_arr = [selfObj]
      that.cd_list.forEach(item=>{
        let obj = {
          "reportId": that.reportId,
          "buildingId": item.id,
          "buildingName": item.name,
          "weight": item.weight,
          "isCompetitor":'1',//竞品
          "coordinates":item.coord[0]+','+item.coord[1]
        }
        if(item.cdId){ //已保存的竞品
          obj.id = item.cdId
        }
        cd_arr.push(obj)
      })
      LandReportApi.saveCd(cd_arr)
      .then(res=>{
        if(res.data.code===0){
          console.log('竞品信息已保存')
          //保存竞品物业类型
          let cd_properties = []
          //本项目的物业类型
          let projectObj = {
            "reportId":that.reportId,
            "buildingId":'0',
            "buildingName":'本项目',
            "isCompetitor":'0',//本项目
            "types":that.setPropertyFormat(that.projectPropertyArr)
          }
          cd_properties.push(projectObj)
          //竞品项目物业类型
          this.cd_list.forEach(item=>{
            cd_properties.push({
              "reportId":that.reportId,
              "isCompetitor":'1',//竞品
              "buildingId":item.id,
              "buildingName":item.name,
              "types":that.setPropertyFormat(item.propertiesArr)
            })
          })
          console.log('上传的物业类型及业态',cd_properties)
          LandReportApi.saveCdProperties(cd_properties)
          .then(res=>{
            if(res.data.code===0){
              console.log('竞品物业类型信息已保存')
              that.$message({
                type:'success',
                message:'竞品数据已提交'
              })
              //修改户型配比的物业类型
              that.$emit('propertyChange')
            }
          })
        }
      })
    },
    setPropertyFormat(arr){ //设置物业类型的上传格式
      let types = []
      arr.forEach(item=>{
        if(item.type==="property_type"){
          if(item.value=="praetorium"||item.value=="house"){
            types.push({
              "name":item.label,
              "type":item.value,
              "buildformat":""
            })
          }else{
            types.push({
              "name":item.label,
              "type":item.value
            })
          }
        }
      })
      types.forEach(item=>{
        arr.forEach( p =>{
          if(p.type==="build_form"&&p.remark===item.type){
            item.buildformat += (p.value+',')
          }
        })
      })
      return types
    },
    CdReSelect(){ //重新选择竞品
      
    },
  }
}
</script>
<style lang="scss">
  .cd_wrap{
    width: 100%;
    height: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 0;
    left: 0;
    .cd_wrap_box{
      width: 100%;
      height: 100%;
      padding: 0 3%;
      background: #fff;
      position: relative;
      .page_top{
        height: 13%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .option_box{
          
        }
      }
      .page_content{
        width: 100%;
        height: 86%;
        display: flex;
        justify-content: space-between;
        position: relative;
        .property_box{
          width: fit-content;
          width: 17%;
          padding: 10px;
          .title{
            font-weight: bold;
            color: #409eff;
            margin-bottom: 6px;
          }
          .el-tree{
            
            // .el-tree-node__children{
            //   display: flex;
            //   position: absolute;
            //   left: -18px;
            // }
          }
          .el-tree-node__content:hover {
            background-color: unset !important;
          }
        }
        .cd_set{
          width: 80%;
          height: 90%;
          border-right: #ccc 1px solid;
          .el-input-group__append{
            background: none;
          }
          .cd_box{
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;
            height: 100%;
            .cd_item{
              width: 16%;
              margin-bottom: 10px;
              margin-right: 10px;
              box-shadow: rgba(0,0,0,0.1) 0 0 12px 4px;
              .name{
                height: 40px;
                text-align: center;
                line-height: 40px;
                font-size: 12px;
                background:rgba(37, 80, 86, 0.8);
                color: #fff;
                border-radius: 5px 5px 0 0;
                user-select: none;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
                overflow: hidden;
                .name_label{
                  width: 100%;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  overflow: hidden;
                }
              }
              .weight{
                display: flex;
                align-items: center;
                height: 40px;
                background:#fff;
                border-radius: 0 0 5px 5px;
                color: #333;
                justify-content: center;
                .label{
                  font-size: 20px;
                  font-weight: bold;
                  width: 63%;
                  .el-input__inner{
                    border: none;
                    padding: none;
                    background: none;
                    color: #007dff;
                  }
                  .el-input-group__append{
                    padding: 0;
                    border: none;
                    background-color: none;
                    color: #333;
                  }
                  .el-tree-node__label {
                    font-size: 12px;
                    font-weight: bold;
                  }
                }
                .menu_icon{
                  margin-left: 10px;
                  font-size: 18px;
                  font-weight: bold;
                  cursor: pointer;
                  &:hover{
                    color: #f56c6c;
                  }
                }
              }
            }
            
          }
          
        }
        
      }
    }
  }
  .el-notification{
    width: auto;
    max-width: 329px;
    padding: 14px 39px 14px 13px;
  }
</style>