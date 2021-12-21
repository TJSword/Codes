<template>
  <div class="addlinepoint_wrap">
    <!-- 添加按钮 -->
    <div :class="['add',curAddMode!==null?'add_active':'']" :style="{right:showCreat&&landTypeTab=='self'?'30px':'-100px'}">
      <div class="item" v-for="item in drawType" :key="item.value" 
      @click="addModeChange(item.value)" :style="{background:curAddMode==item.value?'#fff':'#068d54'}">
        <el-tooltip effect="dark" :content="item.name" placement="top">
          <i :class="['add_icon iconfont',item.icon]" :style="{color:curAddMode==item.value?'#ff9900':'#fff'}"></i>
        </el-tooltip>
      </div>
    </div>
    <!-- 提交信息 -->
    <div class="sub_box" v-show="infoBoxShow" :style="{left:positionX+'px',top:positionY+'px'}">
      <div class="sub_wrap">
        <div class="sub_head" @mousedown="move">
          <div class="title">{{modifyPL?'修改':'新建'}}{{curAddMode=='POINT'?'标签':'轨迹'}}</div>
          <div class="btns">
            <el-button size="small" type="default" @click="cancelCreatUpdate()">取消</el-button>
            <el-button size="small" type="primary" @click="createUpdatePL()">{{modifyPL?'更新':'添加'}}</el-button>
          </div>
        </div>
        <div class="info_form">
          <el-form ref="plInfoForm" :rules="plSubrules" :model="plInfo" label-width="80px">
            <div class="item">
              <el-form-item label="权限设置" prop="isOpen">
                <el-select v-model="plInfo.isOpen" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in layerJur"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="名称" prop="parcelLocation">
                <el-input size="small" placeholder="" v-model="plInfo.parcelLocation"></el-input>
              </el-form-item>
              <el-form-item label="区(市)县" prop="regionno" v-if="curAddMode!=='LINE'">
                <el-select size="small" v-model="plInfo.regionno" :placeholder="regionArr.length==0?'请先选择城市':'请选择城区'" clearable filterable>
                  <el-option-group
                    v-for="group in regionArr"
                    :key="group.label"
                    :label="group.label">
                    <el-option
                      v-for="item in group.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
              <el-form-item label="线条颜色" prop="lineColor" v-if="curAddMode=='LINE'">
                <el-color-picker size="mini" v-model="plInfo.lineColor"></el-color-picker>
              </el-form-item>
              <el-form-item label="线条宽度" prop="lineWidth" v-if="curAddMode=='LINE'">
                <el-input size="mini" style="width:100px;" placeholder="0~5" v-model="plInfo.lineWidth" type="number" :step="0.1" :min="0" :max="5"></el-input>
              </el-form-item>
              <el-form-item label="不透明度" prop="lineHy" v-if="curAddMode=='LINE'">
                <el-input size="mini" style="width:100px;" placeholder="0~1" v-model="plInfo.lineHy" type="number" :step="0.01" :min="0" :max="1"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item label="备注" prop="remarks" style="width:100%">
                <el-input size="small" :rows="4" placeholder="" type="textarea" v-model="plInfo.remarks"></el-input>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as turf from '@turf/turf';
import { mapGetters } from "vuex";
import ledgerApi from "@/api/ledgerApi";
import commonApi from "@/api/commonApi"
export default {
  name: "addlinepoint",
  props: {},
  components: {},
  data() {
    return {
      positionX:null,
      positionY:null,
      showCreat:false,//显示创建按钮
      drawType:[ //绘制模式数组
        { name:'添加土地',value:'POLYGON',icon:'icon-mian' },
        { name:'添加轨迹',value:'LINE',icon:'icon-xian' },
        { name:'添加标签',value:'POINT',icon:'icon-dian' },
        { name:'',value:'OTHER',icon:'' },
      ],
      infoBoxShow:false,//信息提交窗口
      modifyPL:false,//修改模式
      drawMarker: null, //绘制marker
      makerEl: null, //marker Dom
      curAddMode: null, //当前添加模式

      featureId:null,//绘制图形ID
      plSubrules:{ //提交校验规则
        isOpen: [ { required: true, message: '请选择', trigger: 'change' } ],
        parcelLocation: [ { required: true, message: '请输入', trigger: 'blur' } ],
      },
      plInfo:{ //提交数据
        id:null,
        kind:'',//数据类型，Point、Line、Polygon
        isOpen:'0',
        coordinates:null,//图形坐标
        parcelLocation:'',
        regionno:'',
        landCityno:'',
        lineColor:null,
        lineWidth:null,
        lineHy:null,
        remarks:null
      },
      layerJur:[ //图层权限
        {label:'公开',value:'1'},
        {label:'不公开',value:'0'},
      ],
      regionArr:[],//城区数据
      freshFlag:false,//提交点线数据更新个人地图
    };
  },
  mounted() {},
  computed: {
    ...mapGetters(["cityCode","ledger_map", 
    "mapIsload", "ledgerDraw",
    "createLandFlag","plModifyId","landTypeTab"]),
  },
  watch: {
    mapIsload: {
      handler(newVal) {
        if (newVal) {
          this.showCreat = true
          this.mapEvents();
        }
      },
      deep: true,
    },
    cityCode:{
      handler(newVal){
        this.getRegionData(newVal)
      }
    },
    createLandFlag:{ //关闭新建土地
      handler(newVal){
        if(!newVal){
          if(this.curAddMode=="POLYGON"){
            this.cancelCreatUpdate()
          }
        }
      },
      deep:true
    },
    plModifyId: { //修改点线数据
      handler(newVal) {
        if (newVal) {
          this.setPLModify(newVal)
        }
      },
      deep: true,
    },
  },
  methods: {
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
    //更新、新建取消
    cancelCreatUpdate(){
      this.infoBoxShow = false
      this.featureId = null
      this.plInfo.coordinates = null
      this.curAddMode = null
      this.modifyPL = false
      this.ledgerDraw.deleteAll()
      this.ledger_map.getCanvas().style.cursor = 'default'
      this.$refs.plInfoForm.resetFields();
      if(this.drawMarker){
        this.drawMarker.remove()
      }
      //初始化要修改的点线ID
      this.$store.dispatch('setPLModifyId',null)
    },
    //添加模式
    addModeChange(type) {
      if(this.curAddMode==type&&type=='POLYGON'){
        this.$store.dispatch('setCreateLandFlag',false)
      }
      //初始化绘制
      this.infoBoxShow = false
      this.featureId = null
      this.plInfo.coordinates = null
      //this.ledgerDraw.deleteAll()
      this.curAddMode = this.curAddMode==type?null:type
      
      if(this.curAddMode){
        this.plInfo.kind = type
        if (this.drawMarker == null) {
          let map = this.ledger_map;
          this.makerEl = document.createElement("div");
          this.makerEl.setAttribute("class", "measure-result");
          this.makerEl.innerHTML = "";
          var option = {
            element: this.makerEl,
            anchor: "top",
            offset: [0, -35],
          };
          this.drawMarker = new this.mbgl.Marker(option)
          .setLngLat([0, 0])
          .addTo(map);
        }
        if (type == "POINT") {
          this.ledgerDraw.changeMode("draw_point");
          this.ledger_map.getCanvas().style.cursor = 'crosshair'
          this.$store.dispatch('setCreateLandFlag',false)
        } else if (type == "LINE") {
          this.ledgerDraw.changeMode("draw_line_string");
          this.ledger_map.getCanvas().style.cursor = 'crosshair'
          this.$store.dispatch('setCreateLandFlag',false)
        } else if (type == "POLYGON") {
          this.$store.dispatch('setCreateLandFlag',true)
        } else if (type == "OTHER") {
          
        }
      }else{
        this.cancelCreatUpdate()
      }
    },
    //地图事件
    mapEvents() {
      var that = this;
      var map = that.ledger_map;
      map.on("mousemove", (e) => {
        if ((that.drawMarker&&that.curAddMode!="POLYGON")||that.modifyPL) {
          that.drawMarker.setLngLat([e.lngLat.lng, e.lngLat.lat]);
        }
        if(!that.modifyPL){
          if (that.curAddMode == "POINT") {
            that.makerEl.innerHTML = "地图点击添加标签";
          } else if (that.curAddMode == "LINE") {
            that.makerEl.innerHTML = "地图点击绘制轨迹";
          }
        }
      });
      map.on('draw.create', e => {
        if(that.curAddMode&&that.curAddMode!="POLYGON"){
          console.log(e.features)
          that.featureID = e.features[0].id
          map.getCanvas().style.cursor = 'default'
          that.drawMarker.remove()
          that.drawMarker = null
          that.infoBoxShow = true
          if(that.curAddMode=='LINE'){
            that.plInfo.coordinates = e.features[0].geometry.coordinates
            //获取质心点后获取所在城区
            let center = turf.center(e.features[0])
            let co = center.geometry.coordinates
            that.setSiteRegion(co) 
          }else if(that.curAddMode=='POINT'){
            that.plInfo.coordinates = [e.features[0].geometry.coordinates]
            let co = e.features[0].geometry.coordinates
            that.setSiteRegion(co) 
          }
        }
      })
      map.on('draw.update', e =>{
        if((that.curAddMode&&that.curAddMode!="POLYGON") || that.modifyPL){
          if(that.curAddMode=='LINE'){
            that.plInfo.coordinates = e.features[0].geometry.coordinates
            let center = turf.center(e.features[0])
            let co = center.geometry.coordinates
            that.setSiteRegion(co)  
          }else if(that.curAddMode=='POINT'){
            that.plInfo.coordinates = [e.features[0].geometry.coordinates]
            let co = e.features[0].geometry.coordinates
            that.setSiteRegion(co) 
          }
        }
      })
    },
    //获取点击位置所在区县code
    setSiteRegion(coordinates){
      var that = this
      ledgerApi.getSiteRegionno({cityCode:this.cityCode,coordinates:coordinates[0]+','+coordinates[1]})
      .then(res=>{
        if(res.data.code===0){
          that.plInfo.regionno = res.data.data.id
        }
      })
    },
    //获取区县数据
    getRegionData(val){
      var that = this
      that.plInfo.landCityno = val
      that.plInfo.regionno = ''
      if(val===''){
        that.regionArr = []
        return 
      }
      //获取按因为字母排序的行政区
      commonApi.getPCR({value:val})
      .then(res=>{
        if(res.data.code===0){
          that.regionArr = res.data.data
        }
      })
    },
    //上传、更新点线
    createUpdatePL(){
      var that = this
      that.$refs.plInfoForm.validate((valid) => {
        if (valid) {
          const formData = new FormData();
          let info = that.plInfo
          for(let key in info){
            if(info[key]!=null){
              if(key=='coordinates'){
                let coordStr = ''
                if(typeof info.coordinates === 'string'){
                  coordStr = info.coordinates
                }else{
                  info.coordinates.forEach(co=>{
                    coordStr += (co[0]+','+co[1]+';')
                  })
                }
                formData.append('coordinates',coordStr)
              }else{
                formData.append(key,info[key])
              }
            }
          }
          ledgerApi.ledgerLandCreat(formData,that.modifyPL)
          .then(res=>{
            if(res.data.code===0){
              that.$message.success(that.modifyPL?'图形已更新':'图形已创建')
              //新增修改删除通知LandPoly
              that.$store.dispatch('setCmNotice',{
                kind:info.kind,
                id:that.modifyPL?info.id:res.data.data,
                type:that.modifyPL?'modify':'create'
              })
              that.cancelCreatUpdate()
              that.$store.dispatch('setFreshSelf',!that.freshFlag)
              that.freshFlag = !that.freshFlag
            }else{
              that.$message.error(res.data.msg)
            }
          })
        }else{
          console.log('error submit!!');
          return false;
        }
      })
    },
    //设置点线修改信息
    setPLModify(id){
      var that = this
      ledgerApi.getMyLedgerDetail(id)
        .then(res=>{
          if(res.data.code===0){
            let data = res.data.data
            console.log('点线数据',data)
            for(let key in that.plInfo){
              that.plInfo[key] = data[key]
            }
            that.modifyPL = true
            that.infoBoxShow = true
            that.curAddMode = data.kind
            //添加绘制
            let coord1 = data.coordinates.split(';')
            coord1.pop()
            let coord2 = []
            coord1.forEach(c=>{
              let coord3 = c.split(',')
              coord2.push([JSON.parse(coord3[0]),JSON.parse(coord3[1])])
            })
            that.ledgerDraw.add({
              type: 'Feature',
              properties: {},
              id: JSON.parse(data.id),
              geometry: { 
                type: data.kind=="LINE"?'LineString':'Point', 
                coordinates: data.kind=="LINE"?coord2:coord2[0]
              }
            });
            that.ledgerDraw.changeMode('simple_select',{featureId:JSON.parse(data.id)})
            //创建提示maker
            if (that.drawMarker == null) {
              let map = that.ledger_map;
              that.makerEl = document.createElement("div");
              that.makerEl.setAttribute("class", "measure-result");
              that.makerEl.innerHTML = "选中图形可修改";
              var option = {
                element: that.makerEl,
                anchor: "top",
                offset: [0, -35],
              };
              that.drawMarker = new that.mbgl.Marker(option)
              .setLngLat([0, 0])
              .addTo(map);
            }
          }
        })
    },
  },
};
</script>
<style lang="scss">
$button: #5628ee;
$icons: #fff;
$plus: #fff;
.addlinepoint_wrap {
  position: relative;
  .sub_box{
    position: fixed;
    width: 30vw;
    left: 55%;
    top: 28%;
    z-index: 999;
    background: rgba(4, 4, 4, 0.5);
    border-radius: 4px;
    padding: 10px;
    padding: 10px;
    .sub_wrap{
      background: #fff;
      border-radius: 4px;
      padding: 1%;
      .sub_head{
        border-bottom: #e4e7ed 1px solid;
        display:flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
        padding: 5px 8px 8px 8px;
      }
      .info_form{
        width: 100%;
        overflow: scroll;
        .item{
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          .el-form-item{
            width: 49%;
            margin-bottom: 4px;
            margin-top: 5px;
          }
        }
      }
    }
  }
  .add {
    position: fixed;
    right: 60px;
    bottom: 60px;
    width: 84px;
    height: 84px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    transform: scale(0.5);
    transform-origin: 50% 50%;
    transition: transform 0.4s ease;
    cursor: pointer;
    .item {
      display: block;
      position: relative;
      width: 50%;
      padding-bottom: 50%;
      background: $button;
      -webkit-backface-visibility: hidden;
      transition: border-radius 0.3s ease, transform 0.2s ease;
      .add_icon {
        display: block;
        color: #fff;
        width: 14px;
        height: 14px;
        position: absolute;
        left: 50%;
        top: 50%;
        margin: -11px 0 0 -11px;
        opacity: 0;
        fill: $icons;
        transform: scale(0.6) rotate(-45deg);
        transition: all 0.15s ease;
        -webkit-backface-visibility: hidden;
      }
      &:nth-child(1) {
        border-radius: 8px 0 0 0;
        font-weight: bold;
      }
      &:nth-child(2) {
        border-radius: 0 0 0 8px;
      }
      &:nth-child(3) {
        border-radius: 0 8px 0 0;
      }
      &:nth-child(4) {
        border-radius: 0 0 8px 0;
      }
    }
    &:before,
    &:after {
      content: "";
      width: 28px;
      height: 6px;
      border-radius: 3px;
      background: $plus;
      position: absolute;
      left: 50%;
      top: 50%;
      display: block;
      z-index: 1;
      transform-origin: 50% 50%;
      transition: transform 0.25s ease;
    }
    &:before {
      transform: translate(-50%, -50%) scaleY(0.76);
    }
    &:after {
      transform: translate(-50%, -50%) rotate(90deg) scaleY(0.76);
    }
    &:hover {
      transform: scale(1) rotate(45deg);
      transition: transform 0.4s ease 0.1s;
      .item {
        --scale: 1;
        // pointer-events: none;
        border-radius: 50%;
        animation: pointerEvent 0s linear forwards 0.4s;
        transition: border-radius 0.15s ease 0.1s, transform 0.25s ease 0.15s;
        cursor: pointer;
        &:nth-child(1) {
          transform: translate(-6px, -6px) scale(var(--scale));
        }
        &:nth-child(2) {
          transform: translate(-6px, 6px) scale(var(--scale));
        }
        &:nth-child(3) {
          transform: translate(6px, -6px) scale(var(--scale));
        }
        &:nth-child(4) {
          transform: translate(6px, 6px) scale(0);
        }
        .add_icon {
          opacity: 1;
          transition: all 0.3s ease 0.2s;
          transform: scale(1) rotate(-45deg);
        }
        &:hover {
          --scale: 0.92;
          transition: border-radius 0.2s ease 0.1s, transform 0.25s ease 0s;
        }
      }
    }
    
  }
  .add_active{
    transform: scale(1) rotate(45deg) !important;
    transition: transform 0.4s ease 0.1s !important;
    .item {
      --scale: 1 !important;
      // pointer-events: none !important;
      border-radius: 50% !important;
      animation: pointerEvent 0s linear forwards 0.4s !important;
      transition: border-radius 0.15s ease 0.1s, transform 0.25s ease 0.15s !important;
      cursor: pointer;
      &:nth-child(1) {
        transform: translate(-6px, -6px) scale(var(--scale)) !important;
      }
      &:nth-child(2) {
        transform: translate(-6px, 6px) scale(var(--scale)) !important;
      }
      &:nth-child(3) {
        transform: translate(6px, -6px) scale(var(--scale)) !important;
      }
      &:nth-child(4) {
        transform: translate(6px, 6px) scale(0) !important;
      }
      .add_icon {
        opacity: 1 !important;
        transition: all 0.3s ease 0.2s !important;
        transform: scale(1) rotate(-45deg) !important;
      }
      &:hover {
        --scale: 0.92 !important;
        transition: border-radius 0.2s ease 0.1s, transform 0.25s ease 0s !important;
      }
    }
  }
  @keyframes pointerEvent {
    100% {
      pointer-events: auto;
    }
  }
}
.mapbox-gl-draw_trash{
  display: none !important;
}

</style>