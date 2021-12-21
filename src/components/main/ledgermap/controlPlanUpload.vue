<template>
  <!-- 控规图上传 -->
  <div class="control_upload">
    <!-- 控规图上传 -->
    <div class="upload_wrap" v-show="isShow&&curLnglatMaker===null" :style="{left:positionX+'px',top:positionY+'px'}">
      <el-card class="subinfo_card">
        <div slot="header" class="card_head" @mousedown="move">
          <span>控规数据导入</span>
          <div class="file_type">
            <el-radio v-model="fileType" label="pic">图片导入</el-radio>
            <el-radio v-model="fileType" label="cad">CAD导入</el-radio>
          </div>
          <div class="btns">
            <el-button type="primary" @click="showControlList()" size="mini">控规数据列表</el-button>
            <el-button style="margin-left:10px;" @click="handleClose()" size="mini">关闭</el-button>
          </div>
        </div>
        <div class="card_body">
          <div class="file_box">
            <!-- 图片上传入口 -->
            <div class="file_pic" v-show="fileType=='pic'">
              <div class="upload_box" v-show="uploadModel">
                <el-upload
                  class="img_upload"
                  ref="controlImgUpload"
                  drag
                  action=""
                  accept="image/png, image/jpeg"
                  :auto-upload="false"
                  :show-file-list="false"
                  list-type="picture"
                  :on-change="uploadFileChange"
                >
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  <div class="el-upload__tip" slot="tip">只能上传<span style="font-size:16px;font-weight:bold;"> jpg/png </span>文件 图片大小不超过<span style="font-size:16px;font-weight:bold;"> 10MB </span></div>
                </el-upload>
              </div>
              <div class="img_show" v-show="!uploadModel">
                <div class="imgbox" @mousemove="showTip">
                  <div class="uploadimg_wrap">
                    <img v-if="imgFile" ref="uploadImg" class="uploadimg" @click="setMarker($event)" :src="imgFile.url" alt="">
                    <div v-show="subInfo.marker1X!==null&&subInfo.marker1Y!==null" class="img_marker1" :style="{'left':subInfo.marker1X?subInfo.marker1X-6+'px':0,'top':subInfo.marker1Y?subInfo.marker1Y-6+'px':0}"></div>
                    <div v-show="subInfo.marker2X!==null&&subInfo.marker2Y!==null" class="img_marker2" :style="{'left':subInfo.marker2X?subInfo.marker2X-6+'px':0,'top':subInfo.marker2Y?subInfo.marker2Y-6+'px':0}"></div>
                  </div>
                </div>
              </div>
            </div>
            <!-- CAD上传入口 -->
            <div class="file_cad" v-show="fileType=='cad'">
              <el-upload class="cad_upload" ref="controlCADUpload"
                drag action="" :on-change="fileSelect" :on-remove="fileRemove"
                :auto-upload="false" :file-list="cadFileList" :limit="1"
                :accept="'.dxf'">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将CAD文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">
                  选择格式为<span style="font-size:16px;font-weight:bold;"> .dxf </span>
                  的CAD文件，文件限制大小<span style="font-size:16px;font-weight:bold;"> 60M </span>
                  <br />导入图形数量限制<span style="font-size:16px;font-weight:bold;"> 10000 </span>个
                  <br />为了导入的准确度，CAD的文件的精确度尽量调整为<span style="font-size:16px;font-weight:bold;"> 毫米 </span>
                </div>
              </el-upload>
            </div>
          </div>
          <div class="info_box">
            <!-- 图片上传信息 -->
            <div class="info_pic" v-show="fileType=='pic'">
              <div class="info_item">
                <div class="main_title">控规图名称</div>
                <el-input v-model="subInfo.name"></el-input>
              </div>
              <div class="info_item">
                <div class="info1">
                  <div class="left">
                    <div class="point"></div>
                    <div class="name">标点1</div>
                  </div>
                  <div class="right">
                    <el-button size="mini" v-if="imgFile!=null" @click="startTag('marker1')">标点</el-button>
                    <el-button size="mini" v-if="subInfo.marker1X!=null&&subInfo.marker1Y!=null" @click="startMapLnglat('marker1')">地图选点</el-button>
                  </div>
                </div>
                <div class="info2">
                  <div class="info_xy">xy坐标系坐标：{{subInfo.marker1X}},{{subInfo.marker1Y}}</div>
                  <div class="info_lnglat">
                    <div class="info_title">经度(lng)</div>
                    <el-input v-model="subInfo.marker1Lng"></el-input>
                    <div class="info_title">纬度(lat)</div>
                    <el-input v-model="subInfo.marker1Lat"></el-input>
                  </div>
                </div>
              </div>
              <div class="info_item">
                <div class="info1">
                  <div class="left">
                    <div class="point" style="background:#3e861a"></div>
                    <div class="name">标点2</div>
                  </div>
                  <div class="right">
                    <el-button size="mini" v-if="imgFile!=null" @click="startTag('marker2')">标点</el-button>
                    <el-button size="mini" v-if="subInfo.marker2X!=null&&subInfo.marker2Y!=null" @click="startMapLnglat('marker2')">地图选点</el-button>
                  </div>
                </div>
                <div class="info2">
                  <div class="info_xy">xy坐标系坐标：{{subInfo.marker2X}},{{subInfo.marker2Y}}</div>
                  <div class="info_lnglat">
                    <div class="info_title">经度(lng)</div>
                    <el-input v-model="subInfo.marker2Lng"></el-input>
                    <div class="info_title">纬度(lat)</div>
                    <el-input v-model="subInfo.marker2Lat"></el-input>
                  </div>
                </div>
              </div>
            </div>
            <!-- CAD上传信息 -->
            <div class="info_cad" v-show="fileType=='cad'">
              <div class="info_item">
                <div class="main_title">CAD导入方式</div>
                <el-select v-model="cadCoordType" :clearable="false" placeholder="">
                  <el-option label="关联点转换坐标" value="relate"></el-option>
                  <!-- <el-option label="经纬度" value="LAL"></el-option> -->
                </el-select>
              </div>
              <div class="info_item" v-if="cadCoordType==='relate'">
                <div class="item">
                  <div class="main_title">关联点P1</div>
                  <div class="config_label" >CAD文件P1坐标</div>
                  <el-input v-model="point1" placeholder="x,y"></el-input>
                  <div class="config_label" >经纬度P1坐标</div>
                  <div style="display:flex">
                    <el-input v-model="p1LngLat" placeholder="lng,lat"></el-input>
                    <el-button type="primary" size="small" @click="startMapLnglat('p1')" style="margin-left:10px;">地图取点</el-button>
                  </div>
                </div>
                <div class="item" style="margin-top:10px;">
                  <div class="main_title">关联点p2</div>
                  <div class="config_label" >CAD文件P2坐标</div>
                  <el-input v-model="point2" placeholder="x,y"></el-input>
                  <div class="config_label">经纬度P2坐标</div>
                  <div style="display:flex">
                    <el-input v-model="p2LngLat" placeholder="lng,lat"></el-input>
                    <el-button type="primary" size="small" @click="startMapLnglat('p2')" style="margin-left:10px;">地图取点</el-button>
                  </div>
                </div>
                <div class="item" style="margin-top:10px;">
                  <div class="main_title">关联点p3</div>
                  <div class="config_label" >CAD文件P3坐标</div>
                  <el-input v-model="point3" placeholder="x,y"></el-input>
                  <div class="config_label">经纬度P3坐标</div>
                  <div style="display:flex">
                    <el-input v-model="p3LngLat" placeholder="lng,lat"></el-input>
                    <el-button type="primary" size="small" @click="startMapLnglat('p3')" style="margin-left:10px;">地图取点</el-button>
                  </div>
                </div>
              </div>
              <div class="info_item" v-if="cadCoordType=='LAL'">
                <el-radio-group v-model="curLal">
                  <el-radio label="gcj-02">gcj-02坐标</el-radio>
                  <el-radio label="wgs84">wgs84坐标</el-radio>
                </el-radio-group>
              </div>
            </div>
            <div class="sub_btns">
              <el-button type="default" @click="resetInfo()" size="small">重置数据</el-button>
              <el-button type="primary" :disabled="subLoading" :loading="subLoading" @click="subControlInfos()" size="small">上传数据</el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <!-- 控规图列表 -->
    <div class="control_list" v-if="showList" :style="{left:positionListX+'px',top:positionListY+'px'}">
      <div class="head"  @mousedown="moveList">
        <span>控规图列表</span>
        <el-button type="text" @click="showList=false,curLayerId=null">关闭</el-button>
      </div>
      <el-tabs v-model="activeName" type="card" @tab-click="listChange">
        <el-tab-pane label="控规图片" name="allCity"></el-tab-pane>
        <el-tab-pane label="当前城市" name="curCity"></el-tab-pane>
        <el-tab-pane label="CAD" name="cadData"></el-tab-pane>
      </el-tabs>
      <div class="cad_list" v-show="activeName=='cadData'">
        <CadData :isFresh="cadFreshFlag" />
      </div>
      <div class="pic_list" v-show="activeName!='cadData'">
        <div class="check_all">
          <el-checkbox :indeterminate="isIndeterminate" v-model="isCheckAll" @change="checkAllLayer">全选</el-checkbox>
        </div>
        <div class="list_wrap">
          <div class="list_item" v-for="item in controlList" :key="item.id" @click="showLayer(item)">
            <div class="item_top">
              <el-checkbox v-model="item.checked" @click.stop.native="" @change="val=>hideShowLayer(val,item)" style="margin-right:6px;"></el-checkbox>
              <div class="wrap">
                <el-image class="preview" :src="item.imgS" fit="cover" alt=""></el-image>
              </div>
              <div class="left_cont">
                <div class="name">
                  <div class="title">{{item.name}}</div>
                  <div class="site"></div>
                </div>
                <div class="op_btns">
                  <el-tooltip class="item" effect="dark" content="删除" placement="top">
                    <i class="btn el-icon-delete" @click.stop="deleteControl(item.id)"></i>
                  </el-tooltip>
                  <!-- <el-tooltip class="item" effect="dark" content="隐藏" placement="top">
                    <i class="btn el-icon-view" @click="hideShowLayer(item.id)" :style="{'color':item.checked?'#ccc':'#444'}"></i>
                  </el-tooltip> -->
                  <el-tooltip class="item" effect="dark" content="透明度" placement="top">
                    <i class="btn el-icon-set-up" :style="{'color':item.showOpacity?'#f56c6c':'#444'}" @click.stop="item.showOpacity=!item.showOpacity"></i>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="图层位置" placement="top">
                    <i class="btn el-icon-rank" :style="{'color':curLayerId==item.id?'#f56c6c':'#444'}" @click.stop="chooseLayerId(item.id)"></i>
                  </el-tooltip>
                </div>
              </div>
            </div>
            <div class="item_bottom" v-if="item.showOpacity">
              <el-slider class="slider" v-model="item.opacity" :min="0" :max="1" :step="0.1" @click.stop.native="" @change="val=>setLayerOpacity(val,item.id)"></el-slider>
              <div class="label">透明度:{{item.opacity}}</div>
            </div>
            <div class="item_bottom" v-if="curLayerId==item.id">
              <div class="label">图层移动单位(米) </div>
              <el-input v-model="moveUnit" size="mini"></el-input>
              <el-button type="default" size="mini" @click="updataLayerCoord(item)">更新</el-button>
            </div>
          </div>
          <div class="tip" v-if="controlList.length===0">
            暂无控规图
          </div>
        </div>
        <!-- 图层微调 -->
        <div class="movezoom_box" v-show="curLayerId">
          <div class="layer_move">
            <div class="move_item up" @click="moveControlLayer('top')"><i class="icon el-icon-caret-top"></i></div>
            <div class="move_item right" @click="moveControlLayer('right')"><i class="icon el-icon-caret-right"></i></div>
            <div class="move_item left" @click="moveControlLayer('left')"><i class="icon el-icon-caret-left"></i></div>
            <div class="move_item down" @click="moveControlLayer('down')"><i class="icon el-icon-caret-bottom"></i></div>
          </div>
          <div class="layer_zoom">
            <div class="zoom_item" @click="zoomControlLayer('big')">放大</div>
            <div class="zoom_item" @click="zoomControlLayer('samll')">缩小</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as turf from'@turf/turf'
//Api
import ledgerApi from "@/api/ledgerApi";
//store
import { mapGetters } from "vuex"
import CadData from '@/components/main/ledgermap/cadData'
export default {
  name:'controlupload',
  props:{
    isShow:{
      type:Boolean,
      default:false
    }
  },
  components:{
    CadData
  },
  data(){
    return{
      fileType:'pic',//控规数据导入方式
      layerIsLoad:false,//数据图层是否加载
      uploadModel:true,//上传模式
      imgFile:null,//图片信息
      subInfo:{//上传信息
        name:null,
        opacity:0.6,
        //checked:true,
        marker1X:null,
        marker1Y:null,
        marker1Lng:null,
        marker1Lat:null,
        marker2X:null,
        marker2Y:null,
        marker2Lng:null,
        marker2Lat:null,
        point1:null,
        point2:null,
        point3:null,
      },
      curTagMaker:null,//当前标注的marker
      curLnglatMaker:null,//当前地图选取经纬度的marker
      subLoading:false,//请求等待
      showList:false,//显示列表
      controlList:[], //存储的控规图列表
      curLayerId:null,//当前选择的图层ID
      moveUnit:50,//图层移动单位-米

      tipHTML:null,
      tipMarker:null,
      positionX:null,
      positionY:null,
      positionListX:null,
      positionListY:null,

      activeName:'allCity',
      isCheckAll:false,//全选
      isIndeterminate:false,//半选
      prevZoom:null,//上次地图的zoom

      //CAD文件数据
      cadFileList:[],//cad文件列表
      cadCoordType:'relate',//当前CAD坐标
      stripno:1,//utm区号
      nsHem:'n',//南北半球
      curLal:'gcj-02',//当前坐标系类型
      point1:'',//CAD点1 格式：175569.297,256065.918
      point2:'',//CAD点2 格式：175716.194,256586.093
      point3:'',//CAD点3 格式：175716.194,256586.093
      p1LngLat:'',//地理经纬度1 格式：103.60605955348797,30.996570385627905
      p2LngLat:'',//地理经纬度2 格式：103.60756877893726,31.000872634181064
      p3LngLat:'',//地理经纬度3 格式：103.60756877893726,31.000872634181064
      cadFreshFlag:false,//CAD列表刷新flag
    }
  },
  mounted(){
    
  },
  watch:{
    isShow:{
      handler(newVal){
        var that = this
        if(newVal){
          if(!that.layerIsLoad){
            this.mapEvent()
            this.loadControlList()
            this.loadControlLayers()
          }
        }
      },
      deep:true
    },
    cityCode:{
      handler(newVal){
        if(this.layerIsLoad){ //城市切换，切换控规图数据
          this.loadControlList()
          this.loadControlLayers()
          this.removeLayer()
        }
      },
      deep:true
    }
  },
  computed:{
    ...mapGetters(["ledger_map","ledgerDraw","addLedgerInfo","plateData","cityCode"])
  },
  methods:{
    //全选图层
    checkAllLayer(val){
      this.controlList.forEach(item=>{
        item.checked = val
        this.ledger_map.setLayoutProperty(item.id,'visibility',val?'visible':'none')
      })
      this.isIndeterminate = false;
    },
    //控规类型切换
    listChange(){
      if(this.activeName=='cadData'){
        this.cadFreshFlag = !this.cadFreshFlag
      }else{
        this.loadControlList()
        this.loadControlLayers()
      }
    },
    //关闭
    handleClose(){
      this.$emit('closeUpload')
      if(this.tipMarker !== null){
        this.tipMarker.remove()
        this.tipMarker = null
      }
    },
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
    moveList(e){
      let e1 = e.currentTarget;
      let e2 = e.target;
      if(e1 === e2){ //阻止子元素冒泡
        //移动目标距离左上角的位置
        this.positionListX = e.clientX - e.layerX;
        this.positionListY = e.clientY - e.layerY;
        document.onmousemove = (e)=>{
          //更新移动量
          this.positionListX += e.movementX;
          this.positionListY += e.movementY;
        };
        document.onmouseup = (e) => {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      }
    },
    //清除控规图层
    removeLayer(){
      let map = this.ledger_map
      this.controlList.forEach(item=>{
        map.removeLayer(item.id)
        map.removeSource("source_"+item.id)
      })
    },
    //查询已保存的控规列表
    loadControlList(){
      var that = this
      //全部控规和当前城市控规
      ledgerApi.getControlImg(that.activeName==='curCity'?{cityCode:that.cityCode}:{})
      .then(res=>{
        if(res.data.code===0){
          console.log('保存的控规信息',res)
          let data = res.data.data
          data.forEach(item=>{
            item.checked = false
            // item.opacity = 0.6
            item.showOpacity = false
            //分割图片大小尺寸
            let urls = item.url.split(',')
            if(urls.length == 1){
              item.imgS = urls[0] //小图
              item.imgM = urls[0] //中图
              item.imgB = urls[0] //原图
            }else{
              item.imgS = urls[1] //小图
              item.imgM = urls[2] //中图
              item.imgB = urls[0] //原图
            }

            let p1 = item.pointCoor1.split(', ')
            item.pointCoor1 = [JSON.parse(p1[0].substr(1)),JSON.parse(p1[1].substr(0,p1[1].length-1))]
            let p2 = item.pointCoor2.split(', ')
            item.pointCoor2 = [JSON.parse(p2[0].substr(1)),JSON.parse(p2[1].substr(0,p2[1].length-1))]
            let p3 = item.pointCoor3.split(', ')
            item.pointCoor3 = [JSON.parse(p3[0].substr(1)),JSON.parse(p3[1].substr(0,p3[1].length-1))]
            let p4 = item.pointCoor4.split(', ')
            item.pointCoor4 = [JSON.parse(p4[0].substr(1)),JSON.parse(p4[1].substr(0,p4[1].length-1))]


          })
          this.controlList = data
          let checkArr = this.controlList.filter(item=>item.checked)
          let checkedCount = checkArr.length
          this.isCheckAll = checkedCount==this.controlList.length
          this.isIndeterminate = checkedCount > 0 && checkedCount < this.controlList.length;
          console.log(this.controlList)
          that.layerIsLoad = true
        }
      })

    },
    //加载保存的控规图层
    loadControlLayers(){
      var that = this
      ledgerApi.getControlImg(that.activeName==='curCity'?{cityCode:that.cityCode}:{})
      .then(res=>{
        if(res.data.code===0){
          let data = res.data.data
          data.forEach(item=>{
            let p1 = item.pointCoor1.split(', ')
            let p1Coord = [JSON.parse(p1[0].substr(1)),JSON.parse(p1[1].substr(0,p1[1].length-1))]
            let p2 = item.pointCoor2.split(', ')
            let p2Coord = [JSON.parse(p2[0].substr(1)),JSON.parse(p2[1].substr(0,p2[1].length-1))]
            let p3 = item.pointCoor3.split(', ')
            let p3Coord = [JSON.parse(p3[0].substr(1)),JSON.parse(p3[1].substr(0,p3[1].length-1))]
            let p4 = item.pointCoor4.split(', ')
            let p4Coord = [JSON.parse(p4[0].substr(1)),JSON.parse(p4[1].substr(0,p4[1].length-1))]
            let coorArr = [p1Coord,p2Coord,p3Coord,p4Coord]
            //分割
            let urls = item.url.split(',')
            if(urls.length == 1){
              item.imgS = urls[0] //小图
              item.imgM = urls[0] //中图
              item.imgB = urls[0] //原图
            }else{
              item.imgS = urls[1] //小图
              item.imgM = urls[2] //中图
              item.imgB = urls[0] //原图
            }
            //图片路径添加时间戳防止浏览器跨域问题
            that.setControlLayer(item,coorArr)
          })
        }
      })

    },
    //删除控规
    deleteControl(id){
      var that= this
      that.$confirm('是否删除该控规图？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }) .then(() => {
        ledgerApi.deleteControlImg([id])
        .then(res=>{
          if(res.data.code===0){
            that.$message.success('已删除')
            that.loadControlList()
          }else{
            that.$message.error(res.data.msg)
          }
        })
        //删除添加的图层
        let map = this.ledger_map
        map.removeLayer(id)
      }) .catch(() => {})

      
    },
    //隐藏控规图
    hideShowLayer(val,item){
      var map = this.ledger_map
      let checkArr = this.controlList.filter(item=>item.checked)
      let checkedCount = checkArr.length
      this.isCheckAll = checkedCount==this.controlList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.controlList.length;
      map.setLayoutProperty(item.id,'visibility',val?'visible':'none')
    },
    //控制图层透明度
    setLayerOpacity(val,id){
      var map = this.ledger_map
      map.setPaintProperty(id,'raster-opacity',val)
      const formData = new FormData();
      formData.append('id',id)
      formData.append('opacity',val)
      ledgerApi.updateControlImg(formData)
      .then(res=>{
        if(res.data.code===0){}
      })
    },
    //飞往图层中心点
    showLayer(item){
      console.log(item)
      var polygon = turf.polygon([[item.pointCoor1,item.pointCoor2,item.pointCoor3,item.pointCoor4,item.pointCoor1]])
      var centerFeature = turf.centerOfMass(polygon);
      var center = centerFeature.geometry.coordinates
      this.ledger_map.flyTo({
        center:center,
        zoom: 12,
      })
    },
    //更新控规图层坐标数据
    updataLayerCoord(item){
      console.log(item)
      let obj = {
        id:item.id,
        pointCoor1:`(${item.pointCoor1[0]}, ${item.pointCoor1[1]})`,
        pointCoor2:`(${item.pointCoor2[0]}, ${item.pointCoor2[1]})`,
        pointCoor3:`(${item.pointCoor3[0]}, ${item.pointCoor3[1]})`,
        pointCoor4:`(${item.pointCoor4[0]}, ${item.pointCoor4[1]})`,
      }
      const formData = new FormData();
      for(let key in obj){
        formData.append(key,obj[key])
      }
      ledgerApi.updateControlImg(formData)
      .then(res=>{
        if(res.data.code===0){
          this.$message('控规图已更新')
        }else{
          this.$message.error('控规图更新失败')
        }
      })
    },
    showControlList(){
      this.showList=true
      this.$emit('closeUpload')
    },
    //上传信息改变
    uploadFileChange(file,fileList){
      console.log(file,fileList)
      //校验图片大小
      const isLt2M = file.size / 1024 / 1024 < 10;
      if(!isLt2M){
        this.$message.error('上传图片大小不能超过 10MB!');
        return
      }
      this.imgFile = file
      setTimeout(()=>{
        let imgDom = this.$refs['uploadImg']
        console.log(imgDom.width,imgDom.height)
        this.subInfo.point1 = imgDom.width+',0'
        this.subInfo.point2 = imgDom.width+','+imgDom.height
        this.subInfo.point3 = '0,'+imgDom.height
      },100)
      if(this.uploadModel){
        this.uploadModel = false
      }
    },
    //开始标注
    startTag(markerName){
      this.curTagMaker = markerName
      this.$refs['uploadImg'].style.cursor='crosshair'
      this.$message('请在控规图上添加 '+markerName+' 标注点')
      //地图提示marker
      // if(this.tipHTML === null){
      //   this.tipHTML = document.createElement('div');
      //   this.tipHTML.setAttribute('class', 'measure-result');
      // }
      // this.tipHTML.innerHTML = '在控规图上标注 '+markerName+' 的位置'
    },
    //在图片上移动显示标注
    showTip(event){
      // if(this.curTagMaker!==null){
      //   this.tipHTML.style.top = event.clientX+'px'
      //   this.tipHTML.style.left = event.clientY+'px'
      // }
    },
    //图片上添加marker
    setMarker(event){
      console.log(event)
      if(this.curTagMaker==null){
        return
      }
      this.$message({
        duration:5000,
        message:'请地图确认 '+this.curTagMaker+'地理坐标或手动录入'
      })
      let x = event.layerX
      let y = event.layerY
      this.subInfo[this.curTagMaker+'X'] = x
      this.subInfo[this.curTagMaker+'Y'] = y
      //经纬度重置
      this.subInfo[this.curTagMaker+'Lng'] = null
      this.subInfo[this.curTagMaker+'Lat'] = null
      this.curTagMaker = null
      this.$refs['uploadImg'].style.cursor=''

      
    },
    //选择marker点的地图经纬度
    startMapLnglat(markerName){
      var map = this.ledger_map
      map.getCanvas().style.cursor = 'crosshair'
      this.curLnglatMaker = markerName
      //地图提示marker
      if(this.tipHTML === null){
        this.tipHTML = document.createElement('div');
        this.tipHTML.setAttribute('class', 'measure-result');
      }
      this.tipHTML.innerHTML = '在地图上选择 '+markerName+' 的地理位置'
      if(this.tipMarker===null){
        var option = {
          element: this.tipHTML,
          anchor: 'left',
          offset: [8, 0]
        };
        this.tipMarker = new this.mbgl.Marker(option).setLngLat([0, 0]).addTo(map);
      }
      
    },
    //提交控规数据
    subControlInfos(){
      if(this.fileType=='pic'){
        this.subImgInfo()
      }else if(this.fileType=='cad'){
        this.subCADInfo()
        this.subLoading = true
      }
    },
    //上传CAD文件及数据
    subCADInfo(){
      var that = this
      if(that.point1==''||that.point2==''||that.point3==''||that.p1LngLat==''||that.p2LngLat==''||that.p3LngLat==''){
        that.$message('请先完善关联点信息')
      }else{
        const formDataFile = new FormData()
        that.cadFileList.forEach(item=>{
          formDataFile.append('file',item.raw)
        })
        formDataFile.append('type','cad_file')
        //上传CAD文件
        ledgerApi.cadFileUploads(formDataFile)
        .then(res=>{
          if(res.data.code===0){
            console.log('CAD文件已上传')
            let id = res.data.data.id
            //导入CAD
            const formDataInfo = new FormData()
            let p1 = that.point1.split(',')
            let p2 = that.point2.split(',')
            let p3 = that.point3.split(',')
            let p1LngLat = that.p1LngLat.split(',')
            let p2LngLat = that.p2LngLat.split(',')
            let p3LngLat = that.p3LngLat.split(',')
            formDataInfo.append('fid',id)
            formDataInfo.append('type','relate')
            formDataInfo.append('x1',p1[0])
            formDataInfo.append('y1',p1[1])
            formDataInfo.append('lng1',p1LngLat[0])
            formDataInfo.append('lat1',p1LngLat[1])
            formDataInfo.append('x2',p2[0])
            formDataInfo.append('y2',p2[1])
            formDataInfo.append('lng2',p2LngLat[0])
            formDataInfo.append('lat2',p2LngLat[1])
            formDataInfo.append('x3',p3[0])
            formDataInfo.append('y3',p3[1])
            formDataInfo.append('lng3',p3LngLat[0])
            formDataInfo.append('lat3',p3LngLat[1])
            ledgerApi.CADImport(formDataInfo)
            .then(res=>{
              if(res.data.code===0){
                that.$message.success('CAD文件已开始解析,30秒后点击控规数据列表查看')
                that.subLoading = false
              }else{
                that.$message(res.data.msg)
                that.subLoading = false
              }
            })
            that.cadFileList = []
          }else{
            console.log(res.data.msg)
            that.subLoading = false
          }
        })
      }
    },
    //上传图片文件及数据
    subImgInfo(){
      var that = this
      if(that.imgFile==null){
        that.$message.warning('请先在左侧选择图片')
      }
      let infoFlag = true
      for(let key in that.subInfo){
        if(that.subInfo[key]==null){
          infoFlag = false
        }
      }
      if(!infoFlag){
        that.$message.warning('请先在右侧完善信息')
      }
      if(that.imgFile!=null&&infoFlag){
        const formData = new FormData();
        formData.append("file",that.imgFile.raw,that.imgFile.raw.name)
        let obj = {
          cityCode:that.cityCode,
          name:that.subInfo.name,
          opacity:that.subInfo.opacity,
          //checked:that.subInfo.checked,
          file:formData,
          marker1:that.subInfo.marker1X+','+that.subInfo.marker1Y,
          marker2:that.subInfo.marker2X+','+that.subInfo.marker2Y,
          markerCoor1:that.subInfo.marker1Lng+','+that.subInfo.marker1Lat,
          markerCoor2:that.subInfo.marker2Lng+','+that.subInfo.marker2Lat,
          point1:that.subInfo.point1,
          point2:that.subInfo.point2,
          point3:that.subInfo.point3
        }
        for(let key in obj){
          formData.append(key,obj[key])
        }
        that.subLoading = true
        ledgerApi.controlImgUpload(formData)
        .then(res=>{
          if(res.data.code===0){
            if(that.tipMarker !== null){
              that.tipMarker.remove()
              that.tipMarker = null
            }
            that.subLoading = false
            that.$message.success('控规数据提交成功')
            console.log('控规数据提交成功',res)
            let data = res.data.data
            let pointsArr = []
            data.points.forEach(item=>{
              let p = item.split(', ')
              let pLng = p[0].substr(1)
              let pLat = p[1].substr(0,p[1].length-1)
              pointsArr.push([JSON.parse(pLng),JSON.parse(pLat)])
            })
            let urls = data.url.split(',')
            if(urls.length == 1){
              data.imgS = urls[0] //小图
              data.imgM = urls[0] //中图
              data.imgB = urls[0] //原图
            }else{
              data.imgS = urls[1] //小图
              data.imgM = urls[2] //中图
              data.imgB = urls[0] //原图
            }
            that.loadControlList()
            that.setControlLayer(data,pointsArr)
            that.showControlList()
            that.resetInfo()
          }else{
            that.subLoading = false
            that.$message.error('控规数据提交失败')
          }
        })
      }
    },
    //添加控规图层
    setControlLayer(item,points){
      var that = this
      var map = this.ledger_map
      var zoom = map.getZoom()
      var url
      if(zoom<=9){
        url = item.imgS
      }else if(zoom>9&&zoom<12){
        url = item.imgM
      }else{
        url = item.imgB
      }
      let source = map.getSource("source_"+item.id)
      if(source===undefined){
        map.addSource("source_"+item.id, {
          type: "image",
          url: url+'?t='+(+new Date().getTime()),
          coordinates: points
        });
        map.addLayer({
          'id': item.id,
          'type': 'raster',//显示类型为栅格
          'source': "source_"+item.id,
          'paint':{
            'raster-opacity':item.opacity!=null?item.opacity:0.6,
            'raster-fade-duration':0
          },
          'layout':{
            'visibility':'none'
          }
        },'landOutline_fill');
        map.on('click',item.id,e=>{
          console.log(e)
          if(that.curLayerId=='id'){

          }
        })
      }else{
        map.setLayoutProperty(item.id,'visibility','none')
        map.setPaintProperty(item.id,'raster-opacity',item.opacity)
      }
    },
    //选择控规图层ID
    chooseLayerId(id){
      if(id==this.curLayerId){
        this.curLayerId = null
      }else{
        this.curLayerId = id
      }
    },
    //重置数据
    resetInfo(){
      if(this.fileType=='pic'){
        this.uploadModel = true
        this.imgFile = null
        this.subInfo = {
          name:null,
          opacity:0.6,
          marker1X:null,
          marker1Y:null,
          marker1Lng:null,
          marker1Lat:null,
          marker2X:null,
          marker2Y:null,
          marker2Lng:null,
          marker2Lat:null,
          point1:null,
          point2:null,
          point3:null,
        }
      }else{
        this.cadFileList = []
        this.cadCoordType = 'relate'
        this.stripno = 1
        this.nsHem = 'n'
        this.curLal = 'gcj-02'
        this.point1 = ''
        this.point2 = ''
        this.point3 = ''
        this.p1LngLat = ''
        this.p2LngLat = ''
        this.p3LngLat = ''
      }
      this.curTagMaker = null
      this.curLnglatMaker = null
      if(this.tipMarker !== null){
        this.tipMarker.remove()
        this.tipMarker = null
      }
    },
    //地图事件
    mapEvent(){
      var that = this
      var map = that.ledger_map
      map.on('click',e=>{
        if(that.curLnglatMaker!==null){
          if(that.fileType=='pic'){
            that.subInfo[that.curLnglatMaker+'Lng'] = e.lngLat.lng
            that.subInfo[that.curLnglatMaker+'Lat'] = e.lngLat.lat
          }else if(that.fileType=='cad'){
            if(that.curLnglatMaker=='p1'){
              that.p1LngLat = (e.lngLat.lng).toFixed(6)+','+(e.lngLat.lat).toFixed(6)
            }else if(that.curLnglatMaker=='p2'){
              that.p2LngLat = (e.lngLat.lng).toFixed(6)+','+(e.lngLat.lat).toFixed(6)
            }else if(that.curLnglatMaker=='p3'){
              that.p3LngLat = (e.lngLat.lng).toFixed(6)+','+(e.lngLat.lat).toFixed(6)
            }
          }
          that.curLnglatMaker = null
          map.getCanvas().style.cursor = ''
        }
      })
      map.on('mousemove',e=>{
        if(that.curLnglatMaker!==null){
          that.tipMarker.setLngLat([e.lngLat.lng,e.lngLat.lat])
        }
      })
      map.on('zoomend',e=>{
        let zoom = map.getZoom().toFixed(2)
        let flag
        if(zoom<=9&&that.prevZoom<=9){
          flag = false
        }else if((zoom>9&&zoom<12)&&(that.prevZoom>9&&that.prevZoom<12)){
          flag = false
        }else if(zoom>12&&that.prevZoom>12){
          flag = false
        }else{
          flag = true
        }
        that.prevZoom = zoom
        let showArr = that.controlList.filter(item=>item.checked)
        if(showArr.length>0&&flag){
          showArr.forEach(item=>{
            let url
            if(zoom<=9){
              url = item.imgS
            }else if(zoom>9&&zoom<12){
              url = item.imgM
            }else{
              url = item.imgB
            }
            map.getSource("source_"+item.id).updateImage({
              url:url+'?t='+(+new Date().getTime())
            })
          })
          
        }
      })
    },
    //移动控规图层位置
    moveControlLayer(direction){
      let map = this.ledger_map
      if(this.curLayerId==null){
        this.$message('请先选择微调图层')
      }else{
        let LngMove = 0
        let LatMove = 0
        if(direction=='top'){
          LatMove = 0.00001*this.moveUnit
        }else if(direction=='down'){
          LatMove = -0.00001*this.moveUnit
        }else if(direction=='right'){
          LngMove = 0.00001*this.moveUnit
        }else if(direction=='left'){
          LngMove = -0.00001*this.moveUnit
        }
        let coorArr = []
        let curLayerId,url
        this.controlList.forEach(item=>{
          if(this.curLayerId==item.id){
            item.pointCoor1[0] += LngMove
            item.pointCoor1[1] += LatMove
            item.pointCoor2[0] += LngMove
            item.pointCoor2[1] += LatMove
            item.pointCoor3[0] += LngMove
            item.pointCoor3[1] += LatMove
            item.pointCoor4[0] += LngMove
            item.pointCoor4[1] += LatMove
            curLayerId = item.id
            url = item.url
            coorArr = [item.pointCoor1,item.pointCoor2,item.pointCoor3,item.pointCoor4]
          }
        })
        map.getSource("source_"+curLayerId).setCoordinates( coorArr )
      }
    },
    //缩放图层
    zoomControlLayer(state){
      let map = this.ledger_map
      if(this.curLayerId==null){
        this.$message('请先选择缩放图层')
      }else{
        let LngMove = 0
        let LatMove = 0
        
        let coorArr = []
        let curLayerId
        this.controlList.forEach(item=>{
          if(this.curLayerId==item.id){
            if(state=='big'){
              item.pointCoor1[0] += -0.0003
              item.pointCoor1[1] += 0.0003
              item.pointCoor2[0] += 0.0003
              item.pointCoor2[1] += 0.0003
              item.pointCoor3[0] += 0.0003
              item.pointCoor3[1] += -0.0003
              item.pointCoor4[0] += -0.0003
              item.pointCoor4[1] += -0.0003
            }else{
              item.pointCoor1[0] += 0.0003
              item.pointCoor1[1] += -0.0003
              item.pointCoor2[0] += -0.0003
              item.pointCoor2[1] += -0.0003
              item.pointCoor3[0] += -0.0003
              item.pointCoor3[1] += 0.0003
              item.pointCoor4[0] += 0.0003
              item.pointCoor4[1] += 0.0003
            }
            
            curLayerId = item.id
            coorArr = [item.pointCoor1,item.pointCoor2,item.pointCoor3,item.pointCoor4]
          }
        })
        map.getSource("source_"+curLayerId).setCoordinates( coorArr )
      }
    },
    //选择文件
    fileSelect(file,fileList){
      console.log(fileList)
      this.cadFileList = fileList
      var testmsg = file.name.substring(file.name.lastIndexOf('.')+1)

      const extension = testmsg === 'dxf'
      if(!extension) {
        this.$message('只能上传dxf格式CAD文件');
        this.cadFileList.splice(-1,1)
        return false;
      }
      
      const isLt1M = file.size / 1024 / 1024 < 60
      if(!isLt1M) {
        this.$message('上传CAD文件单个大小不能超过60MB!');
        this.cadFileList.splice(-1,1)
        return false;
      }
    },
    //移除文件
    fileRemove(file,fileList){
      this.cadFileList = fileList
    },
  }
 
}
</script>
<style lang="scss">
.control_upload{
  .map_tool{
    position: absolute;
    right: 146px;
    top: 10px;
    z-index: 99;
    display: flex;
    .tool_item{
      width: 29px;
      height: 29px;
      box-shadow: 0 0 0 2px rgba(0,0,0,.1);
      border-radius: 4px;
      background: #fff;
      color: #333;
      cursor: pointer;
      text-align: center;
      line-height: 18px;
      margin-left: 5px;
      .icon{
        font-size: 20px;
      }
    }
  }
  .el-card__body{
    height: calc(100% - 90px);
  }
  
  .control_list{
    width: 300px;
    height: 75%;
    position: fixed;
    top: 13%;
    left: calc(100% - 380px);
    border: 1px solid #EBEEF5;
    background-color: #FFF;
    color: #303133;
    border-radius: 4px;
    .movezoom_box{
      position: absolute;
      left: -100px;
      top: 0;
      .layer_zoom{
        width: 61px;
        .zoom_item{
          background: #fff;
          padding: 5px 10px;
          border-radius: 3px;
          user-select: none;
          font-size: 12px;
          cursor: pointer;
          transition: 0.3;
          margin: auto;
          margin-top: 5px;
          width: fit-content;
          &:hover{
            background: #ccc;
          }
        }
      }
      .layer_move{
        width: 61px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        transform: rotate(45deg);
        .move_item{
          width: 30px;
          height: 30px;
          background: #fff;
          cursor: pointer;
          transition: 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          &:hover{
            background: #ccc;
          }
          .icon{
            transform: rotate(-45deg);
          }
        }
        .up{
          border-radius: 100% 0 0 0;
          border-right: #ccc 1px solid;
          border-bottom: #ccc 1px solid;
        }
        .right{
          border-radius: 0 100% 0 0;
          border-bottom: #ccc 1px solid;
        }
        .left{
          border-radius: 0 0 0 100%;
        }
        .down{
          border-radius: 0 0 100% 0;
          border-left: #ccc 1px solid;
        }
      }
      }
    .el-tabs__header{
      margin: 10px 0 0 0;
      padding-left: 10px;
    }
    .head{
      padding: 10px 20px;
      border-bottom: 1px solid #EBEEF5;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: move;
      user-select: none;
    }
    .check_all{
      margin-left: 16px;
      margin-top: 10px;
    }
    .cad_list{
      height: calc(100% - 145px)
    }
    .pic_list{
      height: 100%;
    }
    .list_wrap{
      padding: 10px;
      height: calc(100% - 145px);
      overflow-y: scroll;
      .tip{
        text-align: center;
        margin: 40px 0;
        font-size: 12px;
        color: #666;
      }
      .list_item{
        margin-bottom: 10px;
        cursor: pointer;
        transition: 0.3s;
        border-radius: 3px;
        padding: 5px;
        position: relative;
        border: #ebeef5 1px solid;
        &:hover{
          box-shadow: rgba(69, 72, 87, 0.1) 0 0 5px 5px;
        }
        .item_top{
          display: flex;
          align-items: center;
        }
        .wrap{
          width: 60px;
          height: 60px;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 3px;
          .preview{
            height: 100%;
          }
        }
        .left_cont{
          margin-left: 10px;
        }
        .name{
          margin-bottom: 10px;
          .title{
            font-size: 14px;
            font-weight: bold;
            color: #333;
          }
          .site{
            font-size: 12px;
            color: #909399;
          }
        }
        .op_btns{
          .btn{
            margin-left: 4px;
            color: #444;
            font-size: 16px;
            user-select: none;
          }
        }
        .item_bottom{
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
          padding: 0 10px;
          .label{
            font-size: 12px;
          }
          .slider{
            width: 70%;
          }
          .el-input{
            width: 70px;
          }
        }
      }
    }
  }
  .upload_wrap{
    width: 70vw;
    height: 85vh;
    position: fixed;
    left: 15%;
    top: 7%;
    z-index: 999;
  }
  .subinfo_card{
    width: 100%;
    height: 100%;
    .el-card__header {
      padding: 10px 20px;
    }
    .card_head{
      cursor: move;
      display: flex;
      align-items: center;
      justify-content: space-between;
      user-select: none;
    }
    .card_body{
      height: 100%;
      display: flex;
      justify-content: space-between;
      .file_box{
        width: 74%;
        height: 100%;
        border: #ccc 1px solid;
        
        .file_pic{
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          .upload_box{

          }
          .img_show{
            width: 100%;
            height: 100%;
            position: relative;
            .imgbox{
              width: 100%;
              height: 100%;
              overflow: scroll;
              .uploadimg_wrap{
                position: relative;
              }
              .uploadimg{
                user-select: none;
              }
              .img_marker1,.img_marker2{
                position: absolute;
                z-index: 99;
                width: 10px;
                height: 10px;
                border: #fff 2px solid;
                border-radius: 50%;
                cursor: pointer;
                background: #f60;
              }
              .img_marker2{
                background: #3e861a;
              }
            }
          }
        }
        .file_cad{
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      .info_box{
        width: 25%;
        height: 100%;
        overflow-y: scroll;
        border: #ccc 1px solid;
        position: relative;
        .info_item{
          padding: 10px 10px 0 10px;
          .main_title{
            font-size:14px;
            font-weight:bold;
            margin-bottom:5px
          }
          .config_label{
            margin: 5px 0;
          }
          .info1{
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
            .left{
              display: flex;
              align-items: center;
            }
            .point{
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background: #f60;
              margin-right: 10px;
            }
            .name{
              font-size: 14px;
              font-weight: bold;
            }
          }
          .info2{
            .info_lnglat{
              margin-top: 10px;
              .info_title{
                margin: 6px 0;
              }
            }
          }
        }
        .sub_btns{
          position: absolute;
          bottom: 10px;
          display: flex;
          justify-content: center;
          width: 100%;
        }
      }
    }
  }
}
</style>