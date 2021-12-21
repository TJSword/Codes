<template>
  <!-- 自定义板块 -->
  <div class="customplates_wrap">
    <div class="custom_wrap" v-if="cpshow" :style="{left:positionX+'px',top:positionY+'px'}">
      <el-card class="custom_box">
        <div slot="header" class="card_head" @mousedown="move">
          <span>自定义板块</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="handleClose()">关闭</el-button>
        </div>
        <div class="content">
          <div class="tool">
            <div>
              <el-input v-model="search" placeholder="查找自定义板块" size="small" style="width:200px;"></el-input>
              <el-button size="small" type="default" style="margin-left:20px;" @click="deleteSelect()">删除所选</el-button>
              <el-button size="small" type="default" style="margin-left:20px;" @click="customLayerControl()">{{showPlateMap?'隐藏图层':'显示图层'}}</el-button>
            </div>
            <div>
              <el-button size="small" type="primary" style="margin-left:20px;" @click="creatCustomPlate()">新建板块</el-button>
            </div>
          </div>
          <el-table
            ref="customplateTable"
            :data="plateData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
            border
            tooltip-effect="dark"
            @selection-change="selctPlates"
            style="width: 100%;height:100%;">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="name"
              label="板块名称"
              width="100">
              <template slot-scope="scope">
                <el-input v-if="scope.row.edit" v-model="scope.row.name" maxlength="15"></el-input>
                <span v-else>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="regionno"
              label="城区"
              width="150">
              <template slot-scope="scope">
                <el-select v-if="scope.row.edit" size="small" v-model="scope.row.regionno" placeholder="城区" filterable>
                  <el-option-group v-for="group in regionArr" :key="group.label" :label="group.label">
                    <el-option
                      v-for="item in group.options" :key="item.value"
                      :label="item.label" :value="item.value">
                    </el-option>
                  </el-option-group>
                </el-select>
                <span v-else>{{convertRegion(scope.row.regionno)}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="remarks"
              label="备注"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input type="textarea" v-if="scope.row.edit" v-model="scope.row.remarks" maxlength="50" show-word-limit></el-input>
                <span v-else>{{scope.row.remarks}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  v-if="!scope.row.edit"
                  size="mini"
                  type="primary"
                  plain
                  @click="editInfo(scope.$index, scope.row)">修改信息</el-button>
                  <el-button
                  v-if="scope.row.edit"
                  size="mini"
                  type="default"
                  plain
                  @click="cancelEditInfo(scope.$index, scope.row)">取消</el-button>
                  <el-button
                  v-if="scope.row.edit"
                  size="mini"
                  type="success"
                  plain
                  @click="subEditInfo(scope.$index, scope.row)">确认</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  plain
                  @click="editOutline(scope.$index, scope.row)">修改轮廓</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
    <!-- 新建自定义板块内容 -->
    <div class="plate_info" v-if="showPi">
      <div class="info">
        <div class="lb">板块名称</div>
        <el-input size="small" v-model="plateName"></el-input>
      </div>
      <div class="info">
        <div class="lb">所属城区</div>
        <el-select size="small" v-model="belongRegion" placeholder="城区" clearable filterable>
          <el-option-group v-for="group in regionArr" :key="group.label" :label="group.label">
            <el-option
              v-for="item in group.options" :key="item.value"
              :label="item.label" :value="item.value">
            </el-option>
          </el-option-group>
        </el-select>
      </div>
      <div class="info">
        <div class="lb">备注</div>
        <el-input size="small" type="textarea" v-model="remarks" maxlength="50" show-word-limit></el-input>
      </div>
      <div class="btn">
        <el-button type="default" size="small" @click="creatCancel()">取消</el-button>
        <el-button type="primary" size="small" @click="creatOk()">创建</el-button>
      </div>
    </div>
    <!-- 修改自定义板块轮廓 -->
    <div class="modify_info" v-if="modifyState">
      <div class="info">
        点击选中板块轮廓，进行轮廓修改
      </div>
      <div class="btn">
        <el-button type="default" size="small" @click="modifyCancel()">取消</el-button>
        <el-button type="primary" size="small" @click="modifyOk()">修改</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import commonApi from '@/api/commonApi'
import ledgerApi from '@/api/ledgerApi'
import { mapGetters } from "vuex";
export default {
  name:'customplate',
  props:{
    isShow:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return {
      cpshow:true,
      regionArr:[ //城区列表
        // {name:'城区1',regionno:'region1'},
      ],
      showPlateMap:false,//图层控制
      search:'',//检索内容
      plateData:[ //自定义板块数据
        // { id:'', name: '', regionno: '', remarks:'' }
      ],
      isCreatCustom:false,//是否创建新轮廓
      creatTip:null,//绘制提示
      showPi:false,//板块信息填写
      plateName:'',//板块名称
      belongRegion:'',//所属城区
      remarks:'',//备注
      plateCoordinates:null,//自定义板块轮廓
      selectIds: [],//选择的自定义板块ID
      modifyState:false,//修改轮廓状态
      modifyRow:null,//当前修改土地信息
      layerIsLoad:false,//图层是否加载

      positionX:null,
      positionY:null,
    }
  },
  mounted(){
    
    
  },
  computed:{
    ...mapGetters(["ledger_map","ledgerDraw","cityCode"])
  },
  watch:{
    isShow:{
      handler(newVal){
        var that = this
        let map  = that.ledger_map
        let source = map.getSource('customPlate')
        if(newVal){
          that.cpshow = true
          if(source==undefined){
            this.getRegions()
            this.mapEvents()
            this.loadCustomLayer()
            this.customPlateList()
          }
        }
      },
      deep:true
    },
    cityCode:{
      handler(newVal){
        if(this.layerIsLoad){
          this.customPlateList()
        }
      },
      deep:true
    }
  },
  methods:{
    move(e){
      let e1 = e.currentTarget;
      let e2 = e.target;
      if(e1 === e2){ //阻止子元素冒泡
        //移动目标距离左上角的位置
        this.positionX = e.clientX - e.layerX;
        this.positionY = e.clientY - e.layerY;
        document.onmousemove = (e)=>{
          //更新移动量
          this.positionX += e.movementX;
          this.positionY += e.movementY;
        };
        document.onmouseup = (e) => {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      }
    },
    //关闭
    handleClose(){
      this.cpshow = false
      this.$emit('closeCustom')
    },
    //城区数据
    getRegions(){
      let code = this.cityCode.substring(0,4)+'00'
      commonApi.getPCR({value:code})
      .then(res=>{
        if(res.data.code===0){
          this.regionArr = res.data.data
        }
      })
    },
    //编辑信息
    editInfo(i,row){
      row.edit = true
    },
    cancelEditInfo(i,row){
      row.edit = false
    },
    subEditInfo(i,row){
      let data = {
        id:row.id,
        name:row.name,
        regionno:row.regionno,
        coordinates:row.coordinates,
        remarks:row.remarks
      }
      ledgerApi.modifyCustomPlate(data)
      .then(res=>{
        if(res.data.code===0){
          this.customPlateList()
          this.$message.success('板块信息已修改')
          row.edit = false
        }else{
          this.$message(res.data.msg)
        }
      })
    },
    //转换城区
    convertRegion(val){
      let str = ''
      this.regionArr.forEach(item=>{
        item.options.forEach(op=>{
          if(op.value===val){
            str = op.label
          }
        })
        
      })
      return str
    },
    //编辑轮廓
    editOutline(i,row){
      //this.isCreatCustom = true
      this.modifyRow = row
      this.modifyState = true
      this.cpshow = false
      let c1 = row.coordinates.split(';')
      c1.pop()
      let coor = []
      c1.forEach(c=>{
        let c2 = c.split(',')
        coor.push([JSON.parse(c2[0]),JSON.parse(c2[1])])
      })
      this.ledgerDraw.add({
        type: 'Feature',
        properties: {},
        id: JSON.parse(row.id),
        geometry: { type: 'Polygon', coordinates: [coor] }
      });
    },
    //新建开始
    creatCustomPlate(){
      this.isCreatCustom = true
      this.$store.dispatch('setCustomState',true)
      this.cpshow = false
      //添加maker
      let map = this.ledger_map
      if(this.creatTip==null){
        map.getCanvas().style.cursor = 'crosshair'
        this.makerEl = document.createElement('div');
        this.makerEl.setAttribute('class', 'measure-result');
        this.makerEl.innerHTML = '地图点击绘制-双击完成'
        var option = {
          element: this.makerEl,
          anchor: 'top',
          offset: [0, -35]
        };
        this.creatTip = new this.mbgl.Marker(option).setLngLat([0, 0]).addTo(map);
      }
      this.ledgerDraw.changeMode('draw_polygon')
    },
    //取消创建
    creatCancel(){
      this.cpshow = true
      this.showPi = false
      this.ledgerDraw.deleteAll()
    },
    //创建自定义板块
    creatOk(){
      var that = this
      if(that.plateName==''){
        that.$message('请先填写板块名称')
        return 
      }
      if(that.belongRegion==''){
        that.$message('请先选择板块所属城区')
        return 
      }
      let coordStr = ''
      let coords = that.plateCoordinates.geometry.coordinates[0]
      coords.forEach((item,i)=>{
        coordStr += (item[0]+','+item[1]+';')
      })
      let data = {
        name:that.plateName,
        regionno:that.belongRegion,
        coordinates:coordStr,
        remarks:that.remarks,
        cityCode:that.cityCode
      }
      ledgerApi.saveCustomPlate(data)
      .then(res=>{
        if(res.data.code===0){
          that.$message.success('自定义板块已创建')
          that.customPlateList()
          that.creatCancel()
        }
      })
    },
    //取消修改
    modifyCancel(){
      this.modifyState = false
      this.cpshow = true
      this.modifyRow = null
      this.plateCoordinates = null
      this.ledgerDraw.deleteAll()
    },
    //确认修改
    modifyOk(){
      let coordStr = ''
      let coords = this.plateCoordinates.geometry.coordinates[0]
      coords.forEach((item,i)=>{
        coordStr += (item[0]+','+item[1]+';')
      })
      let data = {
        id:this.modifyRow.id,
        name:this.modifyRow.name,
        regionno:this.modifyRow.regionno,
        coordinates:coordStr,
        remarks:this.modifyRow.remarks
      }
      ledgerApi.modifyCustomPlate(data)
      .then(res=>{
        if(res.data.code===0){
          this.$message.success('板块轮廓已修改')
          this.customPlateList()
          this.ledgerDraw.deleteAll()
          this.modifyState = false
          this.cpshow = true
          this.modifyRow = null
          this.plateCoordinates = null
        }else{
          this.$message(res.data.msg)
        }
      })
    },
    //用户的自定义板块
    customPlateList(){
      var that = this
      ledgerApi.getCustomPlate({cityCode:that.cityCode})
      .then(res=>{
        if(res.data.code===0){
          let data = res.data.data
          console.log('自定义版块列表',data)
          data.forEach(item=>{
            item.edit = false
          })
          that.plateData = data
          //自定义板块设置数据
          let geojson = {
            type:"FeatureCollection",
            features:[]
          }
          data.forEach(item=>{
            let c1 = item.coordinates.split(';')
            let coor = []
            c1.forEach(c=>{
              let c2 = c.split(',')
              coor.push(c2)
            })
            coor.pop()
            let obj = {
              geometry:{
                coordinates:[coor],
                type:'Polygon'
              },
              properties:{ 
                id: item.id,
                name: item.name,
                regionno: item.regionno,
                remarks: item.remarks
              },
              type:'Feature'
            }
            geojson.features.push(obj)
          })
          that.ledger_map.getSource('customPlate').setData(geojson)
        }
      })
    },
    //地图事件
    mapEvents(){
      var that = this
      var map = this.ledger_map
      map.on('click',e=>{
        if(that.isCreatCustom){

        }
      })
      map.on('mousemove',e=>{
        if(that.isCreatCustom&&that.creatTip!=null){
          that.creatTip.setLngLat([e.lngLat.lng,e.lngLat.lat])
        }
      })
      map.on('draw.create', (e) => {
        if(that.isCreatCustom){
          console.log(e.features)
          that.plateCoordinates = e.features[0]
          console.log(that.plateCoordinates)
          map.getCanvas().style.cursor = ''
          this.creatTip.remove()
          this.creatTip = null
          this.showPi = true
          this.$store.dispatch('setCustomState',false)
        }
      })
      map.on('draw.update', (e) => {
        if(that.isCreatCustom||that.modifyState){
          console.log(e.features);
          that.plateCoordinates = e.features[0]
        }
      });
      map.on('draw.delete', (e) => {
        if(that.isCreatCustom){
          console.log(e.features);
          that.plateCoordinates = null
        }
      });
    },
    //加载自定义图层
    loadCustomLayer(){
      var tha = this
      var map = this.ledger_map
      if(map.getSource('customPlate')==undefined){
        
        //自定义板块图层
        map.addSource("customPlate", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });
        map.addLayer({
          id: "customPlate_fill",
          type: "fill",
          source: "customPlate",
          layout: {
            visibility: "none",
          },
          paint: {
            "fill-color": '#67C23A',
            "fill-opacity": 0.6
          },
        });
        map.addLayer({
          id: "customPlate_line",
          type: "line",
          source: "customPlate",
          layout: {
            visibility: "none",
          },
          paint: {
            "line-color":'#ffe605',
            "line-opacity": 0.8,
            "line-width": 1,
          },
        });
        map.addLayer({
          id: "customPlate_labels",
          type: "symbol",
          source: "customPlate",
          layout: {
            "text-field":"{name}",
            "text-font": ["DIN Offc Pro Bold"],
            "text-allow-overlap": false,
            "text-size":[
              "interpolate",
              ["linear"],
              ["zoom"],
              0, 0,
              16, 14
            ],
            "text-letter-spacing": 0.1,
            "visibility": "none",
          },
          paint: {
            "text-color":'#fff'
          },
        });
        
      }
      this.layerIsLoad = true
    },
    //显示隐藏图层
    customLayerControl(){
      this.showPlateMap = !this.showPlateMap
      let map = this.ledger_map
      if(this.showPlateMap){
        map.setLayoutProperty('customPlate_fill','visibility','visible')
        map.setLayoutProperty('customPlate_line','visibility','visible')
        map.setLayoutProperty('customPlate_labels','visibility','visible')
      }else{
        map.setLayoutProperty('customPlate_fill','visibility','none')
        map.setLayoutProperty('customPlate_line','visibility','none')
        map.setLayoutProperty('customPlate_labels','visibility','none')
      }
    },
    //删除所选板块
    deleteSelect(){
      var that = this
      if(this.selectIds.length==0){
        this.$message('至少选择一个板块')
      }else{
        that.$confirm('是否删除勾选的板块？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }) .then(() => {
          ledgerApi.deleteCustomPlate(this.selectIds)
          .then(res=>{
            if(res.data.code===0){
              this.$message('所选板块已删除')
              this.customPlateList()
            }else{
              this.$message(res.data.msg)
            }
          })
        }) .catch(() => {})
      }
    },
    //勾选自定义板块
    selctPlates(val){
      let arr = []
      val.forEach(item=>{
        arr.push(item.id)
      })
      this.selectIds = arr
    },
  }
}
</script>
<style lang="scss">
.customplates_wrap{
  .custom_wrap{
    width: 50vw;
    height: 70vh;
    position: fixed;
    left: 25%;
    top: 7%;
    z-index: 999;
  }
  .custom_box{
    width: 100%;
    height: 100%;
    .card_head{
      cursor: move;
      user-select: none;
    }
    .el-card__body{
      height: calc(100% - 98px);
    }
    .content{
      height: 100%;
      .tool{
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
      }
    }
  }
  .plate_info,.modify_info{
    position: fixed;
    top: 30%;
    right: 20%;
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    width: 250px;
    .info{
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      .lb{
        width: 100px;
      }
    }
    .btn{
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>