<template>
  <div class="fileimport_wrap">
    <div class="import_wrap" v-show="!isChoose" :style="{left:positionX+'px',top:positionY+'px'}">
      <el-card class="import_box">
        <div slot="header" class="card_head" @mousedown="move">
          <span>数据导入</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="handleClose()">关闭</el-button>
        </div>
        <div class="content">
          <div class="import_type">
            <label class="config_label" style="margin-right:20px;">数据导入模式</label>
            <el-radio-group v-model="curImtype" @change="imtypeChange">
              <el-radio v-for="item in imTypeArr" :key="item.value" :label="item.value">{{item.label}}</el-radio>
            </el-radio-group>
          </div>
          <div class="import_cont">
            <!-- 土地数据 -->
            <div class="cont">
              <div class="left"
                v-loading="deleteLoading"
                element-loading-text="文件删除中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)">
                <div class="log_box" v-if="logData.length>0">
                  <el-button class="close_log" size="small" plain @click="logData = []">关闭</el-button>
                  <el-table :data="logData">
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column property="error" label="日志内容"></el-table-column>
                  </el-table>
                </div>
                <div class="config_label" style="margin:20px 0;">上传记录</div>
                <div class="info_tip" v-if="uploadRecord.length==0">暂无上传记录</div>
                <div style="padding-right:15px;" v-else>
                  <el-timeline>
                    <el-timeline-item
                      v-for="(item, index) in uploadRecord"
                      :key="index"
                      :type="getStateLabel(item.state,'color')"
                      :size="item.size"
                      :timestamp="item.createDate"
                      placement="top">
                      <el-card class="info_b">
                        <div style="font-size:14px;font-weight:bold;">{{item.name}}</div>
                        <div style="display:flex;justify-content:space-between;align-item:center;">
                          <div style="margin-top:10px;color:#666">导入状态：{{getStateLabel(item.state,'label')}}</div>
                          <el-button size="small" plain v-if="item.state=='3'||item.state=='4'" @click="showLog(item.logUrl)">日志</el-button>
                        </div>
                        <el-button v-if="item.state=='2'||item.state=='4'" type="text" @click="deleteFileLands(item.id)">删除已导入数据</el-button>
                      </el-card>
                    </el-timeline-item>
                  </el-timeline>
                </div>
              </div>
              <div class="right">
                <div class="cont_a">
                  <div class="landtype_box" v-if="curImtype==='ov_land'">
                    <div class="item">
                      <label class="config_label" >类型</label>
                      <el-select style="width:90px;" size="small" v-model="ovLayerType" placeholder="">
                        <el-option label="土地" value="POLYGON"></el-option>
                        <el-option label="轨迹" value="LINE"></el-option>
                        <el-option label="标签" value="POINT"></el-option>
                      </el-select>
                    </div>
                    <div class="item">
                      <label class="config_label"  v-if="isAdmin">是否公开</label>
                      <el-select v-if="isAdmin" style="width:90px;" size="small" v-model="ovIsOpen" placeholder="">
                        <el-option label="公开" value="1"></el-option>
                        <el-option label="不公开" value="0"></el-option>
                      </el-select>
                    </div>
                    <div class="item">
                      <label class="config_label" style="margin-left:20px;margin-right:10px;" v-show="ovLayerType=='POLYGON'">土地类型</label>
                      <el-select style="width:90px;" size="small" v-model="curLandType" placeholder="请选择" v-show="ovLayerType=='POLYGON'">
                        <el-option
                          v-for="item in landTypeArr"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                    <!-- 省份 -->
                    <div class="item">
                      <label class="config_label" >省份</label>
                      <el-select style="width:90px" size="small" v-model="curProvince" placeholder="省份" 
                      @change="getCityData" clearable filterable>
                        <el-option-group v-for="group in provinces" :key="group.label" :label="group.label">
                          <el-option
                            v-for="item in group.options" :key="item.value"
                            :label="item.label" :value="item.value">
                          </el-option>
                        </el-option-group>
                      </el-select>
                    <!-- 城市 -->
                    </div>
                    <div class="item">
                      <label class="config_label" >城市</label>
                      <el-select style="width:90px" size="small" v-model="curCity" placeholder="城市" clearable filterable>
                        <el-option-group v-for="group in cities" :key="group.label" :label="group.label">
                          <el-option
                            v-for="item in group.options" :key="item.value"
                            :label="item.label" :value="item.value">
                          </el-option>
                        </el-option-group>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div class="cont_b">
                  <el-upload class="file_upload" ref="fileUpload"
                    drag action="" :on-change="fileSelect" :on-remove="fileRemove"
                    :auto-upload="false" :file-list="fileList" :limit="1"
                    :accept="fileType">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip" v-if="curImtype==='ov_land'">支持奥维地图导出的csv文件转为Excel导入<br />文件限制大小12M</div>
                    <div class="el-upload__tip" slot="tip" v-if="curImtype==='template_data'">请先下载导入模板，按照模板填写内容<br />文件限制大小12M</div>
                    <div class="el-upload__tip" slot="tip" v-if="curImtype==='cad_file'">选择格式为.dxf的CAD文件<br />文件限制大小50M<br />导入图形数量限制10000个</div>
                  </el-upload>
                </div>
                <div class="cont_c">
                  <el-button type="default" v-if="curImtype==='template_data'" @click="downImTemplate()">下载模板</el-button>
                  <el-button type="primary" v-if="curImtype==='cad_file'" size="" :disabled="fileList.length===0" @click="importCADData()" style="margin-top:30px;">导入CAD数据</el-button>
                  <el-button type="primary" v-else size="" :disabled="fileList.length===0" @click="importData()" style="margin-top:30px;">点击导入</el-button>
                </div>
                <!-- CAD导入参数 -->
                <div class="cont_d" v-if="curImtype==='cad_file'">
                  <div class="op_box">
                    <div class="item" style="margin-bottom:20px;">
                      <label class="config_label" >CAD坐标</label>
                      <el-select style="width:150px;" size="small" v-model="cadCoordType" :clearable="false" placeholder="">
                        <el-option label="关联点转换坐标" value="relate"></el-option>
                        <!-- <el-option label="经纬度" value="LAL"></el-option> -->
                      </el-select>
                    </div>
                    <div class="relate_config" v-if="cadCoordType==='relate'">
                      <div class="item">
                        <label class="config_label" >CAD点1坐标</label>
                        <el-input size="small" style="width:150px;" v-model="point1" placeholder="x,y"></el-input>
                        <label class="config_label" >经纬度点1坐标</label>
                        <el-input size="small" style="width:180px;" v-model="lnglat1" placeholder="lng,lat"></el-input>
                        <el-button type="primary" size="small" @click="getMapCoord('p1')" style="margin-left:10px;">地图取点</el-button>
                      </div>
                      <div class="item" style="margin-top:10px;">
                        <label class="config_label" >CAD点2坐标</label>
                        <el-input size="small" style="width:150px;" v-model="point2" placeholder="x,y"></el-input>
                        <label class="config_label">经纬度点2坐标</label>
                        <el-input size="small" style="width:180px;" v-model="lnglat2" placeholder="lng,lat"></el-input>
                        <el-button type="primary" size="small" @click="getMapCoord('p2')" style="margin-left:10px;">地图取点</el-button>
                      </div>
                    </div>
                    <div class="lal_config" v-if="cadCoordType=='LAL'">
                      <el-radio-group v-model="curLal">
                        <el-radio label="gcj-02">gcj-02坐标</el-radio>
                        <el-radio label="wgs84">wgs84坐标</el-radio>
                      </el-radio-group>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
//Api
import ledgerApi from "@/api/ledgerApi";
import commonApi from '@/api/commonApi';
import { Notification } from 'element-ui';
import { mapGetters } from 'vuex'

export default {
  name:'fileimport',
  props:{
    isShow:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return {
      imTypeArr:[
        { label:'奥维数据',value:'ov_land',url:'ovimport' }, //url 导入接口地址
        { label:'模板导入',value:'template_data',url:'import' },
        // { label:'CAD导入',value:'cad_file',url:'' },
      ],
      curImtype:'ov_land',
      landTypeArr:[ //土地类型数组
        // {label:'供应',value:'supply'},
        // {label:'公告',value:'announcement'},
        // {label:'成交',value:'traded'},
        // {label:'流拍',value:'streaming'},
        // {label:'终止',value:'termination'},
        // {label:'其他',value:'other'},
      ],
      ovLayerType:"POLYGON",//奥维导入的数据类型
      ovIsOpen:'0',//奥维导入数据是否公开 0不公开1公开
      curLandType:'traded',//当前土地类型
      fileType:'.xls,.xlsx',//文件接收格式
      fileList:[],//上传文件列表
      uploadRecord: [], //上传历史
      importFlag:false,//导入标记
      deleteLoading:false,//删除loading
      logData:[],//日志数据

      websock:null,//websocket

      provinces:[],//省份
      curProvince:'',//当前省代码
      cities:[],//城市
      curCity:'',//当前城市代码

      positionX:null,
      positionY:null,

      cadCoordType:'relate',//当前CAD坐标
      stripno:1,//utm区号
      nsHem:'n',//南北半球
      curLal:'gcj-02',//当前坐标系类型
      point1:'',//CAD点1 格式：175569.297,256065.918
      point2:'',//CAD点2 格式：175716.194,256586.093
      lnglat1:'',//地理经纬度1 格式：103.60605955348797,30.996570385627905
      lnglat2:'',//地理经纬度2 格式：103.60756877893726,31.000872634181064
      pName:'',//要拾取地理坐标的点

      tipHTML:null,
      tipMarker:null,
      isChoose:false,//是否地图选点状态
    }
   
  },
  computed:{
    ...mapGetters(['cityCode','isAdmin','ledger_map','mapIsload'])
  },
  watch:{
    isShow:{
      handler(newVal){
        var that = this
        if(newVal){
          this.getDataFileList()
        }
      },
      deep:true
    },
    mapIsload:{
      handler(newVal){
        if(newVal){
          this.mapEvents()
        }
      },
      deep:true
    },
  },
  created(){
    
  },
  mounted(){
    this.getDict()
    this.getProvinceData()
  },
  methods:{
    //websocket初始化
    initWebSocket(){
      const wsuri = `${this.socketURL}?token=${localStorage.getItem('token')}`;
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen(){ //连接建立之后执行send方法发送数据
      console.log('websocket已连接')
      //this.websocketsend(JSON.stringify(actions));
    },
    websocketonerror(){//连接建立失败重连
      console.log('连接失败')
      //this.initWebSocket();
    },
    websocketonmessage(e){ //数据接收
      console.log(e)
      const redata = JSON.parse(e.data);
      console.log(redata)
      this.messageTip(redata)
      if(redata.state===0||redata.state===1){ //导入失败刷新列表
        this.getDataFileList()
      }
      if(redata.state===2||redata.state===3){ //2：导入失败，不存在未导入，3：导入完成，不存在未导入,断开连接
        this.websock.close()
        this.websock===null
        this.getDataFileList()
      }
    },
    websocketclose(e){  //关闭
      console.log('后端断开连接',e); 
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
    messageTip(data){
      const h = this.$createElement;

      this.$notify({
        title: '文件导入通知',
        type: (data.state===0||data.state===1)?'warning':'success',
        duration: 0,
        message: data.state===0? h('p',{ style: 'color: teal'},data.msg):h('div', 
          [
            h('p',{ style: 'color: teal'},data.msg),
            h('button',
            { 
              style: 'color: teal;border: none;padding: 10px 15px;background: #409eff;color: #fff;border-radius: 4px;cursor: pointer;float: right',
              on:{
                click:this.updataLandList
              }
            },
            '更新土地')
          ]
        )
      });
    },
    //更新土地提示
    updataLandList(){
      console.log('要更新土地信息了')
      this.$store.dispatch('setFileIsimport',this.importFlag)
      this.importFlag = !this.importFlag
      Notification.closeAll()
      
    },
    //关闭
    handleClose(){
      this.$emit('closeFileImport')
    },
    //获取导入状态
    getStateLabel(val,type){
      let str = ''
      switch(val){
        case '0':
          str = type==='label'?'导入队列中':'info'
          break
        case '1':
          str = type==='label'?'导入中':'primary'
          break
        case '2':
          str = type==='label'?'导入成功':'success'
          break
        case '3':
          str = type==='label'?'导入失败':'danger'
          break
        case '4':
          str = type==='label'?'部分导入成功':'warning'
          break
        default:
          str = ''
      }
      return str
    },
    //获取字典
    getDict(){
      var that = this
      //土地类型
      ledgerApi.getTypeDict("land_type")
      .then(res=>{
        if(res.data.code===0){
          console.log('土地类型字典',res)
          that.landTypeArr = res.data.data
        }
      })
    },
    //获取导入文件列表
    getDataFileList(){
      ledgerApi.dataFIleList(this.curImtype)
      .then(res=>{
        if(res.data.code===0){
          let data = res.data.data
          console.log('文件导入列表',data)
          this.uploadRecord = data
        }
      })
    },
    //文件上传校验
    beforeFileUpload(file){
      var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
      const extension = testmsg === 'xls'
      const extension2 = testmsg === 'xlsx'
      if(!extension && !extension2) {
        this.$message.error('只能上传excel格式文件');
        return false;
      }
      return (extension || extension2)
    },
    //选择文件
    fileSelect(file,fileList){
      console.log(fileList)
      this.fileList = fileList
      var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
      if(this.curImtype==='cad_file'){
        const extension = testmsg === 'dxf'
        if(!extension) {
          this.$message.error('只能上传dxf格式CAD文件');
          this.fileList.splice(-1,1)
          return false;
        }
      }else{
        const extension = testmsg === 'xls'
        const extension2 = testmsg === 'xlsx'
        if(!extension && !extension2) {
          this.$message.error('只能上传excel格式文件');
          this.fileList.splice(-1,1)
          return false;
        }
      }
      const isLt1M = file.size / 1024 / 1024 < this.curImtype==='cad_file'?50:50
      if(!isLt1M) {
        this.$message.error('上传文件单个大小不能超过 '+this.curImtype==='cad_file'?'50MB!':'50MB!');
        this.fileList.splice(-1,1)
        return false;
      }
    },
    //移除文件
    fileRemove(file,fileList){
      this.fileList = fileList
    },
    //下载模板
    downImTemplate(){
      window.open('http://oss.tzymap.com/成都云地图土地导入模板.xlsx')
      this.$message.success('模板已下载')
    },
    //导入奥维、模板数据
    importData(){
      var that = this
      let url = that.imTypeArr.filter(item=>item.value===that.curImtype)[0].url
      const formData = new FormData()
      that.fileList.forEach(item=>{
        formData.append('file',item.raw)
      })
      formData.append('type',that.curImtype)
      if(that.curImtype==='ov_land'){ //奥维
        if(that.curCity==''){
          that.$message('请先选择城市')
          return
        }
        formData.append('kind',that.ovLayerType)
        if(that.ovLayerType=="POLYGON"){
          formData.append('state',that.curLandType)
        }
        formData.append('cityCode',that.curCity)
        formData.append('isOpen',that.ovIsOpen)
      }
      ledgerApi.dataFileImport(formData,url)
      .then(res=>{
        if(res.data.code===0){ //文件50k 后台进入导入队列
          that.$message('数据量大，后台导入中，请耐心等待~')
          if(that.websock===null){
            that.initWebSocket(); //开启websocket连接
          }
          that.getDataFileList()
        }else if(res.data.code===2){
          that.$message.success('数据导入成功')
          that.$store.dispatch('setFileIsimport',that.importFlag)
          that.importFlag = !that.importFlag
          //文件导入完成后更新文件导入状态
          that.getDataFileList()
        }else{
          that.$message.error(res.data.msg)
        }
      })
      setTimeout(_=>{
        //后台导入前更新该文件的导入状态
        that.getDataFileList()
        that.fileList = []
      },1000)
    },
    //导入CAD数据
    importCADData(){
      var that = this
      if(that.point1==''||that.point2==''||that.lnglat1==''||that.lnglat2==''){
        that.$message('请先完善关联点信息')
      }else{
        const formDataFile = new FormData()
        that.fileList.forEach(item=>{
          formDataFile.append('file',item.raw)
        })
        formDataFile.append('type','cad_file')
        //上传CAD文件
        ledgerApi.fileUploads(formDataFile)
        .then(res=>{
          if(res.data.code===0){
            console.log('CAD文件已上传')
            let id = res.data.data.id
            //导入CAD
            const formDataInfo = new FormData()
            let p1 = that.point1.split(',')
            let p2 = that.point2.split(',')
            let lnglat1 = that.lnglat1.split(',')
            let lnglat2 = that.lnglat2.split(',')
            formDataInfo.append('fid',id)
            formDataInfo.append('type','relate')
            formDataInfo.append('x1',p1[0])
            formDataInfo.append('y1',p1[1])
            formDataInfo.append('lng1',lnglat1[0])
            formDataInfo.append('lat1',lnglat1[1])
            formDataInfo.append('x2',p2[0])
            formDataInfo.append('y2',p2[1])
            formDataInfo.append('lng2',lnglat2[0])
            formDataInfo.append('lat2',lnglat2[1])
            ledgerApi.CADImport(formDataInfo)
            .then(res=>{
              if(res.data.code===0){
                that.$message.success('CAD文件已导入')
              }else{
                that.$message.error(res.data.msg)
              }
            })
            setTimeout(_=>{
              //后台导入前更新该文件的导入状态
              that.getDataFileList()
              that.fileList = []
            },1000)
          }else{
            console.log(res.data.msg)
          }
        })
      }
    },
    //删除文件中的数据
    deleteFileLands(id){
      var that = this
      that.$confirm('将删除该文件导入的数据，是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }) .then(() => {
        that.deleteLoading = true
        ledgerApi.delFileLands(id)
        .then(res=>{
          if(res.data.code===0){
            that.$message.success('文件中的数据已删除')
            that.getDataFileList()
            that.$store.dispatch('setFileIsimport',that.importFlag)
            that.importFlag = !that.importFlag
            that.deleteLoading = false
          }else{
            that.$message.error(res.data.msg)
            that.deleteLoading = false
          }
        })
      }) .catch(() => {})
      
    },
    //导入类型切换
    imtypeChange(){
      this.fileType = this.curImtype==='cad_file'?'.dxf':'.xls,.xlsx'
      this.getDataFileList()
      this.fileList = []
    },
    //处理显示日志数据
    showLog(str){
      let data = JSON.parse(str)
      let arr = []
      data.implog.forEach(item=>{
        arr.push({
          error:item
        })
      })
      this.logData = arr
    },
    //获取省市区数据
    getProvinceData(){
      var that = this
      commonApi.getPCR()
      .then(res=>{
        if(res.data.code===0){
          that.provinces = res.data.data
          //根据用户当前城市设置省份
          that.curProvince = that.cityCode.substring(0,2)+'0000'
          that.getCityData(that.curProvince)
        }
      })
    },
    //获取城市数据
    getCityData(val){
      var that = this
      that.curCity = ''
      if(val===''){
        that.cities = []
        return
      }
      commonApi.getPCR({value:val})
      .then(res=>{
        if(res.data.code===0){
          that.cities = res.data.data
          that.curCity = that.cityCode
        }
      })
    },
    //地图选点
    getMapCoord(pname){
      this.isChoose = true
      this.pName = pname
      var map = this.ledger_map
      map.getCanvas().style.cursor = 'crosshair'
      //地图提示marker
      if(this.tipHTML === null){
        this.tipHTML = document.createElement('div');
        this.tipHTML.setAttribute('class', 'measure-result');
      }
      this.tipHTML.innerHTML = '在地图上选择对应CAD的点'
      if(this.tipMarker===null){
        var option = {
          element: this.tipHTML,
          anchor: 'left',
          offset: [8, 0]
        };
        this.tipMarker = new this.mbgl.Marker(option).setLngLat([0, 0]).addTo(map);
      }
    },
    //地图事件
    mapEvents(){
      var that = this
      var map = this.ledger_map
      map.on('click',e=>{
        if(that.isChoose){
          if(that.pName=='p1'){
            that.lnglat1 = (e.lngLat.lng).toFixed(6)+','+(e.lngLat.lat).toFixed(6)
          }else{
            that.lnglat2 = (e.lngLat.lng).toFixed(6)+','+(e.lngLat.lat).toFixed(6)
          }
          that.isChoose = false
          map.getCanvas().style.cursor = ''
        }
      })
    },
  }
}
</script>
<style lang="scss">
.fileimport_wrap{
  .config_label{
    margin-right:10px;
    margin-left:20px;
    display: inline-block;
  }
  .import_wrap{
    width: 60vw;
    height: 80vh;
    position: fixed;
    left: 20%;
    top: 7%;
    z-index: 999;
  }
  .import_box{
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
      .import_type{
        padding-bottom: 20px;
        border-bottom: #dfecff 1px solid;
      }
      .import_cont{
        height: calc(100% - 42px);
        .info_tip{
          text-align: center;
          padding: 100px 0;
          font-size: 14px;
          color: #666;
        }
        .cont{
          height: 100%;
          display: flex;
          justify-content: space-between;
          .left{
            width: 30%;
            height: 100%;
            overflow-y: scroll;
            border-right: #dfecff 1px solid;
            position: relative;
            .log_box{
              position: absolute;
              top:0;
              left: 0;
              z-index: 99;
              width: 100%;
              height: 100%;
              background: #fff;
              .close_log{
                position: absolute;
                right: 10px;
                top: 10px;
                z-index: 99;
              }
            }
          }
          .right{
            width: 70%;
            height: 100%;
            overflow-y: scroll;
          }
        }
        
        .cont_a{
          margin: 40px 0;
          .landtype_box{
            padding: 0 10px;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            .item{
              margin-bottom: 20px;
              margin-right: 20px;
            }
          }
        }
        .cont_b{
          text-align: center;
        }
        .cont_c{
          text-align: center;
        }
        .cont_d{
          margin-top: 30px;
          .utm_config{
            display: flex;
            align-items: center;
          }
          .lal_config{
            padding: 0 20px;
          }
          .relate_config{
            .config_label{
              width: 100px;
            }
          }
        }
      }
    }
  }
  @media screen and(max-width:1366px) {
    
  }
}
</style>