<template>
  <!-- 竞品市场-竞品分布/竞品信息CompetitorDistribution -->
  <div class="cd_wrap">
    <div class="cd_wrap_box" :style="{'width':pageW+'px','height':pageH+'px'}">
      <!-- 报告内容 -->
      <div class="page_content">
        <!-- 地图容器 -->
        <div class='map_box_b'>
          <Map mapType="CompetitorDistribution" />
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
        <!-- 操作按钮 -->
        <div class="option_box">
          <el-button type="info" @click="clearCd()">清空竞品</el-button>
          <el-button type="success" @click="subProperties()">确认竞品</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Map from '@/components/common/ReportMap'
import { mapGetters } from 'vuex'
import LandReportApi from '@/api/LandReportApi_zlq'
export default {
  name:'cd',
  components:{
    Map
  },
  data(){
    return{
      reportId:'1306841780423069697',//报告ID
      ledgerId:'1309320807310635009', //台账ID-获取预选竞品
      logo:require('@/assets/img/login/logo.png'),
      pageW:window.innerWidth*0.7,
      pageH:window.innerWidth*0.7*9/16,
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
    setTimeout(()=>{
      //this.optionTip()
      this.selectPlate()
      this.getCdProperty()
    },2500)
  },
  computed:{
    ...mapGetters(['CD_map'])
  },
  watch:{
    
  },
  methods:{
    getCdProperty(){ //获取物业类型姐
      var that = this
      LandReportApi.getCdPropertyList()
      .then(res=>{
        if(res.data.code===0){
          let data = res.data.data
          console.log(data)
          let data1 = []
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
            keyArr.push(item.value)
            nodeArr.push(item)
            if(item.children){
              item.children.forEach(c=>{
                keyArr.push(c.value)
                nodeArr.push(c)
              })
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
    selectPlate(){ //选中项目所在板块
      var map = this.CD_map
      var borderColor = [
        "match", ["get", "regionno"],
        this.landPoint.plateId,"rgba(85, 255, 0, 1)",
        "rgba(149, 149, 246,1)"
      ]
      var borderWidth = [
        "match", ["get", "regionno"],
        this.landPoint.plateId,2.5,
        1
      ]
      map.setPaintProperty("plate_line", "line-color", borderColor);
      map.setPaintProperty("plate_line", "line-width", borderWidth);
      //跳转到该项目
      map.flyTo({
        center: this.landPoint.coordinates,
        zoom: 12,
        speed: 0.8,
        curve: 2
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
          that.getLandCd(that.ledgerId,cdData)
        }else{
          that.$message('项目竞品获取失败')
        }
      })
    },
    getLandCd(projectId,data){ //获取两年内有成交的项目-预选竞品
      var that = this
      LandReportApi.getCDList(projectId)
      .then(res=>{
        
        if(res.data.code===0){
          let saveCdBuildID = []
          data.forEach(item=>{
            saveCdBuildID.push(item.buildingId)
          })
          let cdList = res.data.data
          console.log('两年内有成交的项目',cdList)
          if(saveCdBuildID.length>0){ //该报告存在竞品，设置保存的竞品为选中状态
            this.haveCdFlag = true //报告存在竞品
            cdList.forEach(item=>{
              item.coord = item.coord.split(',')
              let i = saveCdBuildID.indexOf(item.id)
              if(i!==-1){
                item.iscircle = '1'
                item.cdId = data[i].id //存储生成的竞品ID
              }else{
                item.iscircle = '0'
              }
            })
            that.projectList = cdList
            //对已保存的竞品权重赋值
            that.setInitWeight(data)
          }else{
            cdList.forEach(item=>{ //该报告未保存竞品，板块内的项目选中
              item.coord = item.coord.split(',')
            })
            that.projectList = cdList
            that.setInitWeight()
          }
          that.setCDlayer()
          
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
    setCDlayer(){ //设置竞品图层
      var that = this
      let geojson = {
        type:'FeatureCollection',
        features:[{
          type:"Feature",
          geometry:{
            type:'Point',
            coordinates:this.landPoint.coordinates
          },
          properties:{
            name:this.landPoint.name,
            isSelf:true
          }
        }]
      }
      this.projectList.forEach(item=>{
        geojson.features.unshift({
          type:"Feature",
          geometry:{
            type:'Point',
            coordinates:item.coord
          },
          properties:{
            id:item.id, //buildingId 项目
            cdId:item.cdId, //已存竞品ID
            name:item.name,
            isSelf:false,
            iscircle:item.iscircle,
            coord:item.coord
          }
        })
      })
      console.log(geojson)
      var map = this.CD_map
      map.addSource('CD_source',{
        type:'geojson',
        data:geojson
      })
      map.addLayer({
        'type': "symbol",
        'id':'project_point',
        'source':'CD_source',
        'filter':['==','isSelf',true],
        'layout':{
          'icon-image':'project_self',
          "icon-allow-overlap":true,
          "icon-ignore-placement":true,
          "icon-size":0.5,
          'text-field':'{name}',
          "text-offset": [0, -3],
          "text-anchor": "top",
          "text-padding": 1,
          "text-max-angle": 90,
          "text-allow-overlap": true,
          "text-size": 14,
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-justify":'center',
          "text-padding":10,
        },
        "paint": {
          //"text-halo-color": "#fff",
          "text-color": "#ff9900",
          //"text-halo-width": 10,
        }
      })
      map.addLayer({
        'type': "symbol",
        'id':'cd_point',
        'source':'CD_source',
        'filter':['==','isSelf',false],
        'layout':{
          'icon-image':[
            'match',['get','iscircle'],
            '1','isCircle',
            '0','unCircle',
            'unCircle'
          ],
          "icon-allow-overlap":true,
          "icon-ignore-placement":true,
          "icon-size":0.5,
          'text-field':'{name}',
          "text-offset": [0, -3],
          "text-anchor": "top",
          "text-padding": 1,
          "text-max-angle": 90,
          "text-allow-overlap": true,
          "text-size": 10,
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-justify":'center',
        },
        "paint": {
          "text-color": "#fff",
        }
      })
      map.on('mousemove','cd_point', e => {
        map.getCanvas().style.cursor = 'pointer';
      })
      map.on('mouseleave','cd_point', e => {
        map.getCanvas().style.cursor = '';
      })
      map.on('click','cd_point', e => {
        let id = e.features[0].properties.id
        let cdId = e.features[0].properties.cdId
        let name = e.features[0].properties.name
        let iscircle = e.features[0].properties.iscircle
        let coord = e.features[0].properties.coord
        if(iscircle=='1'){ //取消选中
          let lock = that.cd_list.filter(item=>item.id==id)[0].isLock
          if(lock){ //竞品已锁定
            that.$message('该竞品已锁定，请先解除锁定')
          }else{ 
            that.setProjectSelect(id)
            //删除竞品
            that.freshCdList(id)
            //要删除的竞品的id
            if(cdId!==undefined){
              if(!that.delCdId.includes(cdId)){ //已存在不添加
                that.delCdId.push(cdId)
              }
            }
          }
        }else{ //添加选中
          that.setProjectSelect(id)
          //添加竞品
          that.freshCdList(id,{id:id,name:name,isLock:false,weight:0,coord:JSON.parse(coord)})
          //添加要追加提交的竞品buildingId
          if(cdId===undefined){
            if(!that.addCdArr.includes(cdId)){ //已存在不添加
              that.addCdArr.push(cdId)
            }
          }
        }
        
      })
    },
    setProjectSelect(id){ //设置项目选中、取消选中

      let geojson = {
        type:'FeatureCollection',
        features:[{
          type:"Feature",
          geometry:{
            type:'Point',
            coordinates:this.landPoint.coordinates
          },
          properties:{
            name:this.landPoint.name,
            isSelf:true
          }
        }]
      }
      this.projectList.forEach(item=>{
        if(id===item.id){
          if(item.iscircle=='0'){
            item.iscircle = '1'
          }else{
            item.iscircle = '0'
          }
        }
        geojson.features.push({
          type:"Feature",
          geometry:{
            type:'Point',
            coordinates:item.coord
          },
          properties:{
            id:item.id,
            cdId:item.cdId,
            name:item.name,
            isSelf:false,
            iscircle:id?item.iscircle:'0',
            coord:item.coord
          }
        })
      })
      var map = this.CD_map
      map.getSource('CD_source').setData(geojson)
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
    freshCdList(id,obj){ //更新已选竞品数据
      if(obj===undefined){ //删除竞品
        this.cd_list = this.cd_list.filter(item=>item.id!==id)
        this.weightChange()
      }else{
        obj.properties = this.projectProperty
        obj.propertiesArr = this.projectPropertyArr
        this.cd_list.push(obj)
        this.weightChange()
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
      if(that.cd_list.length>0){
        //删除竞品
        if(that.delCdId.length>0){
          LandReportApi.delCd(that.delCdId)
          .then(res=>{
            if(res.data.code===0){
              console.log('已删除竞品',that.delCdId)
            }
          })
        }
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
              }
            })
          }
        })
        
      }else{
        that.$message('至少选择一个竞品')
      }
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
    clearCd(){ //清空选中的竞品
      if(this.saveCdArr.length>0){ //存在保存的竞品
        this.saveCdArr.forEach(item=>{
          this.delCdId.push(item.id)
        })
      }
      //点数据设置
      this.projectList.forEach(item=>{
        item.iscircle = '0'
      })
      //清除地图上竞品选择
      this.setProjectSelect()
      //置空竞品列表
      this.cd_list = []
    },
    getCdInfosData(reportId){ //获取竞品信息
      LandReportApi.getCDinfos({reportId:reportId})
      .then(res=>{
        if(res.data.code===0){
          console.log('竞品信息',res)
        }
      })
    },
    optionTip(){ //操作提示
      this.$notify.info({
        title: '提示',
        message: '在地图上点击选择竞品',
        duration: 0,
        position: 'top-left'
      });
    },
  }
}
</script>
<style lang="scss">
  .cd_wrap{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow-y: scroll;
    .cd_wrap_box{
      background: #fff;
      position: relative;
      
      .logo{
        padding: 0 1%;
        height: 5%;
        display: flex;
        align-items: center;
        display: none;
        img{
          max-height: 70%;
        }
      }
      .page_title{
        padding: 0 1%;
        height: 5%;
        display: flex;
        align-items: center;
        background: #606266;
        border-bottom:#9c9c9c 1px solid;
        display: none;
        .icon{
          font-size: 22px;
          margin-right: 10px;
          color: #eaeaea;
        }
        .main_t{
          font-size: 18px;
          font-weight: bold;
          color: #eaeaea;
        }
        .sub_t{
          font-size: 18px;
          font-weight: bold;
          color: #e6a23c;
        }
      }
      .page_content{
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        .map_box_b{
          width: 100%;
          height: 100%;
        }
        .map_box_s{
          width: 50%;
          height: 90%;
        }
        .property_box{
          position: absolute;
          bottom: 12%;
          right: 2%;
          width: fit-content;
          min-width: 150px;
          background: rgba(18, 21, 27, 0.72);
          border-radius: 4px;
          padding: 10px;
          .title{
            font-weight: bold;
            color: #409eff;
            margin-bottom: 6px;
          }
          .el-tree{
            color: #e4e4e4;
            background: none;
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
          position: absolute;
          left: 3.5%;
          right: 0;
          top: 5%;
          max-width: 23%;
          height: 90%;
          .cd_box{
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;
            height: 100%;
            overflow-y: scroll;
            .cd_item{
              width: 50%;
              margin-bottom: 10px;
              .name{
                height: 40px;
                text-align: center;
                line-height: 40px;
                font-size: 12px;
                background:rgba(37, 80, 86, 0.8);
                color: #fff;
                border-radius: 5px 5px 0 0;
                margin-right: 10px;
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
                background: rgba(236, 245, 255, 1);
                border-radius: 0 0 5px 5px;
                margin-right: 10px;
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
        .option_box{
          position: absolute;
          bottom: 4%;
          right: 2%;
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