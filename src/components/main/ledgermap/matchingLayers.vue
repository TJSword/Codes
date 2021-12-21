<template>
  <!-- 配套图层添加 -->
  <div class="matchinglayer_wrap">
    <div v-show="isShow" class="mtlayer_tree">
      <!-- <el-checkbox :indeterminate="mtlayerIsAll" v-model="mtlayerAll" @change="mtlayerAllChange">全选图层</el-checkbox>
      <div style="margin: 10px 0;"></div>
      <el-checkbox-group v-model="mtlayerCheck" @change="mtlayerChange">
        <el-checkbox v-for="item in mtlayerArr" :label="item.value" :key="item.value">{{item.name}}</el-checkbox>
      </el-checkbox-group> -->
      <el-tree
         v-if="cityCode=='510100'"
        :data="matcingLayers"
        :props="defaultProps"
        node-key="unit"
        show-checkbox
        @check="layerControl">
      </el-tree>
      <div class="pop" v-if="cityCode=='510100'">
        <el-checkbox v-model="showPop" @change="popGridControl" style="margin-left:24px;margin-top:5px;">人口分布</el-checkbox>
        <el-checkbox v-model="showOut" @change="moveOutControl" style="margin-left:24px;margin-top:5px;">人口流出</el-checkbox>
        <el-checkbox v-model="showIn" @change="moveInControl" style="margin-left:24px;margin-top:5px;">人口流入</el-checkbox>
      </div>
      <div class="exp_box" v-if="userDeptName=='电建集团'||isAdmin">
        <el-button class="export_btn" size="small" type="primary" @click="exportMatching()">导出勾选配套数据</el-button>
        <div class="tips">Tips:人口数据因数据过大无法导出</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import ledgerApi from "@/api/ledgerApi"

export default {
  name:'matchinglayer',
  props:{
    isShow:{
      type:Boolean,
      default:false
    }
  },
  components:{
    
  },
  data(){
    return {
      matcingLayers:[],//配套图层
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      mtlayerIsAll:false,
      mtlayerAll:false,
      mtlayerCheck:[],//勾选显示的图层value数组
      mtNodesCheck:[],//勾选的图层nodes
      mtlayerArr:[],//配套图层
      layerIsLoad:false,//图层是否加载
      showPop:false,//显示人口数据
      showOut:false,//迁出数据
      showIn:false,//迁入数据
    }
  },
  mounted(){
    
  },
  watch:{
    isShow:{
      handler(newVal){
        var that = this
        let map  = that.ledger_map
        if(newVal){
          if(!that.layerIsLoad){
            //this.getMatchingLayers()
            this.setMatchingList()
          }
        }
      },
      deep:true
    },
    cityCode:{
      handler(newVal){
        if(newVal&&this.layerIsLoad){
          //this.getMatchingLayers()
          this.setMatchingList()
        }
      },
      deep:true
    },
    mapIsload:{
      handler(newVal){
        if(newVal){
            
        }
      }
    },
  },
  computed:{
    ...mapGetters(['ledger_map','cityCode','mapIsload','userMenu','isSuperUser','userDeptName','isAdmin'])
  },
  methods:{
    //配套图层控制
    mtlayerAllChange(val){
      let arr = []
      this.mtlayerArr.forEach(item=>{
        arr.push(item.value)
      })
      this.mtlayerCheck = val?arr:[]
      this.mtlayerIsAll = false
      this.mtlayerSet()
    },
    mtlayerChange(val){
      let checkedCount = val.length;
      this.mtlayerAll = checkedCount === this.mtlayerArr.length;
      this.mtlayerIsAll = checkedCount > 0 && checkedCount < this.mtlayerArr.length;
      this.mtlayerSet()
    },
    layerControl(checkedNodes,checkedKeys){
      console.log(checkedNodes,checkedKeys)
      this.mtNodesCheck = checkedKeys.checkedNodes
      this.mtlayerCheck = checkedKeys.checkedKeys
      this.mtlayerSet()
    },
    //配套图层筛选
    mtlayerSet(){
      var that = this
      that.mtlayerArr.forEach(item=>{
        let layer = that.ledger_map.getSource(item.value+"_resource")
        if(layer!==undefined){
          let isShow = that.mtlayerCheck.indexOf(item.value) !== -1
          if(item.value==='metro_line'){
            that.ledger_map.setLayoutProperty(item.value+'_a',"visibility",isShow?"visible":"none")
            that.ledger_map.setLayoutProperty(item.value+'_b',"visibility",isShow?"visible":"none")
          }else{
            that.ledger_map.setLayoutProperty(item.value,"visibility",isShow?"visible":"none")
          }
        }
      })
    },
    //获取配套菜单
    setMatchingList(){
      let fitArr = this.userMenu[0].children.filter(item=>item.name == "配套数据"||item.unit == "showMatchingLayer")
      let list = fitArr[0].children
      list.forEach(item=>{
        item.children.forEach(c=>{
          c.value = c.unit
        })
      })
      this.matcingLayers = list
      this.matchingLayer(list)
      this.layerIsLoad = true
    },
    //获取配套字典
    getMatchingLayers(){
      var that = this
      ledgerApi.getTypeDictTree('matching')
      .then(res=>{
        console.log('配套图层字典',res)
        let data = res.data.data[0].children
        that.matcingLayers = res.data.data[0].children
        that.matchingLayer(data)
        that.layerIsLoad = true
      })
    },
    //匹配要加载的图层
    matchingLayer(data){
      data.forEach(item=>{
        if(item.children&&item.children.length>0){
          this.matchingLayer(item.children)
        }else{
          //icon x-x-x 例：1-0-#f60 第一位表示图层是否可加载(1可加载、0不可加载)，第二位表示图层类型（0、1、2 点线面），第三位为图层颜色
          let layerState = item.icon.split('-')
          let loadable = layerState[0]
          let layerStyle = layerState[1]
          let layerColor = layerState[2]
          if(loadable==="0"){ //图层不可加载
            item.disabled = true
          }
          this.mtlayerArr.push(item)
          console.log(item)
          if(loadable==="1"){ //图层可加载
            if(layerStyle==="0"){ //点图层
              let imghasload = this.ledger_map.hasImage("icon_"+item.value) //图像是否被添加
              if(imghasload){
                this.setMatchingLayers(item,layerStyle)
              }else{
                this.ledger_map.loadImage("http://47.104.165.136:8099/test/chengdu/icons/"+item.value+".png", (error, icon) => {
                  if (error) throw error;
                  this.ledger_map.addImage("icon_"+item.value, icon);
                  this.setMatchingLayers(item,layerStyle)
                })
              }
            }else if(layerStyle==="1"){ //线图层
              this.setMatchingLayers(item,layerStyle,layerColor)
            }else if(layerStyle==="2"){ //面图层
              this.setMatchingLayers(item,layerStyle,layerColor)
            }
          }
        }
      })
    },
    //设置配套图层
    setMatchingLayers(item,layerStyle,layerColor){
      var that = this
      var map = this.ledger_map
      let code = this.cityCode
      let workSpace_layer = 'touziyun:'+code+'_'+item.value
      let tileUrl = this.geoserverURL+'/geoserver/gwc/service/tms/1.0.0/'+workSpace_layer+'@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf'
      let source = map.getSource(item.value+"_resource")
      if(source===undefined){
        map.addSource(item.value+"_resource", {
          type: "vector",
          scheme: "tms",
          tiles: [tileUrl]
        });
        if(layerStyle==='0'){
          map.addLayer({ 
            "id": item.value,
            "type": "symbol",
            "source": item.value+"_resource",
            "source-layer": code+"_"+item.value,
            'layout': {
              "icon-image":"icon_"+item.value,
              "icon-size":[
                "interpolate",
                ["linear"],
                ["zoom"],
                0, 0,
                8,0.2,
                16, 0.4
              ],
              "icon-allow-overlap":true,
              "icon-ignore-placement":true,
              "icon-keep-upright":true,
              "symbol-avoid-edges":true,
              "text-field": "{name}",
              "text-offset": [1, 0],
              "text-anchor": "bottom-left",
              "text-padding": 1,
              "text-max-angle": 90,
              "text-allow-overlap": true,
              "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                0, 0,
                8,0,
                16, 16
              ],
              // "text-letter-spacing": 0.1,
              "visibility":'none'
            },
            "paint": {
              "text-opacity":1,
              "text-color": item.value==="metro"?'#ffc36a':[
                "match",["get","build_code"],
                "building","#ffc36a",//在建-黄色
                "plan","#5faeff",//规划-蓝色
                "#84dc59",//建成-绿色
              ],
              "text-halo-color": "rgba(0,0,0,0.6)",
              "text-halo-width": 3
            }
          });
        }else if(layerStyle==='1'){
          if(item.value==='metro_line'){
            map.addLayer({ 
              "id": item.value+'_a', //规划、在建
              "type": "line",
              "source": item.value+"_resource",
              "source-layer": code+"_"+item.value,
              "filter":["in","build_code","building","plan"],
              'layout': {
                "visibility":'none',
                "line-cap":"round"
              },
              "paint":{
                "line-color": [
                  "coalesce",
                  ['get','remark'],
                  '#333'
                ],
                "line-dasharray":[2,2],
                "line-width": 3,
              }
            });
            map.addLayer({ 
              "id": item.value+'_b', //通车
              "type": "line",
              "source": item.value+"_resource",
              "source-layer": code+"_"+item.value,
              "filter":["!in","build_code","building","plan"],
              'layout': {
                "visibility":'none',
                "line-cap":"round"
              },
              "paint":{
                "line-color": [
                  "coalesce",
                  ['get','remark'],
                  '#333'
                ],
                "line-width": 3,
              }
            });
          }else{
            map.addLayer({ 
              "id": item.value,
              "type": "line",
              "source": item.value+"_resource",
              "source-layer": code+"_"+item.value,
              'layout': {
                "visibility":'none',
                "line-cap":"round"
              },
              "paint":{
                "line-color": layerColor,
                "line-width": 1,
              }
            });
          }
        }else if(layerStyle==='2'){
          map.addLayer({
            "id":item.value,
            "type":"fill",
            "source": item.value+"_resource",
            "source-layer": code+"_"+item.value,
            "paint":{
              "fill-color":layerColor,
              "fill-opacity":0.8
            },
            "layout":{
              "visibility":"none"
            }
          })
        }
        let popup = new that.mbgl.Popup({offset:15,anchor:'left',closeButton:false})
        if(item.value==='metro_line'){
          map.on('mousemove','metro_line_a',(e) => {
            map.getCanvas().style.cursor = "pointer"
            let coordinates = [e.lngLat.lng,e.lngLat.lat];
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            } 
            let name = e.features[0].properties.name
            let htmlStr = `<div style="color:#fff">${name?name:'暂无'}</div>`
            popup.setLngLat(coordinates).setHTML(htmlStr).addTo(map)
          })
          map.on('mouseleave','metro_line_a',(e) => {
            map.getCanvas().style.cursor = ""
            popup.remove()
          })
          map.on('mousemove','metro_line_b',(e) => {
            map.getCanvas().style.cursor = "pointer"
            let coordinates = [e.lngLat.lng,e.lngLat.lat];
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            } 
            let name = e.features[0].properties.name
            let htmlStr = `<div style="color:#fff">${name?name:'暂无'}</div>`
            popup.setLngLat(coordinates).setHTML(htmlStr).addTo(map)
          })
          map.on('mouseleave','metro_line_b',(e) => {
            map.getCanvas().style.cursor = ""
            popup.remove()
          })
        }else{
          map.on('mousemove',item.value,(e) => {
            map.getCanvas().style.cursor = "pointer"
            let coordinates = [e.lngLat.lng,e.lngLat.lat];
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            } 
            let name = e.features[0].properties.name
            let htmlStr = `<div style="color:#fff">${name?name:'暂无'}</div>`
            popup.setLngLat(coordinates).setHTML(htmlStr).addTo(map)
          })
          map.on('mouseleave',item.value,(e) => {
            map.getCanvas().style.cursor = ""
            popup.remove()
          })
          map.on('click',item.value,(e) => {
            let value = `站点名：${e.features[0].properties.name}，ID:${e.features[0].properties.id}`
            console.log(value)
          })
        }
        
      }
    },
    popGridControl(val){
      if(val){
        this.showOut = false
        this.showIn = false
        this.$('#popDis').show()
      }else{
        this.$('#popDis').hide()
      }
      
      this.popLayerControl()
    },
    moveOutControl(val){
      var map = this.ledger_map
      map.setZoom(4.6)
      if(val){
        this.showPop = false
        this.showIn = false
        this.moveInControl(false)
      }
      this.popLayerControl()
    },
    moveInControl(val){
      var map = this.ledger_map
      map.setZoom(4.6)
      if(val){
        this.showPop = false
        this.showOut = false
        this.moveOutControl(false)
      }
      this.popLayerControl()
    },
    popLayerControl(){
      var map = this.ledger_map
      // map.setLayoutProperty("landOutline_fill", "visibility", !this.showOut&&!this.showIn&&!this.showPop?'visible':'none');
      // map.setLayoutProperty("landOutline_line", "visibility", !this.showOut&&!this.showIn&&!this.showPop?'visible':'none');
      // map.setLayoutProperty("landOutline_line_ps", "visibility", !this.showOut&&!this.showIn&&!this.showPop?'visible':'none');
      // map.setLayoutProperty("landpoint_label", "visibility", !this.showOut&&!this.showIn&&!this.showPop?'visible':'none');
      // map.setLayoutProperty("layer_point", "visibility", !this.showOut&&!this.showIn&&!this.showPop?'visible':'none');
      // map.setLayoutProperty("layer_line", "visibility", !this.showOut&&!this.showIn&&!this.showPop?'visible':'none');
      // map.setLayoutProperty("layer_line_symbol", "visibility", !this.showOut&&!this.showIn&&!this.showPop?'visible':'none');
      map.setLayoutProperty("cityNum", "visibility", !this.showOut&&!this.showIn&&!this.showPop?'visible':'none');
      this.$store.dispatch('setLandListFlag',!this.showOut&&!this.showIn&&!this.showPop?true:false)
      if(this.showOut){
        this.$store.dispatch('setPopType','popOut')
      }
      if(this.showIn){
        this.$store.dispatch('setPopType','popIn')
      }
      if(this.showPop){
        this.$store.dispatch('setPopType','popDis')
      }
      if(!this.showOut&&!this.showIn&&!this.showPop){
        this.$store.dispatch('setPopType',null)
      }
    },
    //导出配套数据CSV
    exportMatching(){
      var that = this
      let cityName = localStorage.getItem('cityName')
      if(that.mtNodesCheck.length>0){
        that.mtNodesCheck.forEach(item=>{
          if(item.url!==""){
            let obj = {
              cityno:that.cityCode,
              type:item.url
            }
            ledgerApi.exportMtCsv(obj)
            .then(res=>{
              if(res.data){
                let a = document.createElement('a');
                let blob = new Blob(["\ufeff"+res.data], {type: 'text/csv;charset=UTF-8'}); 
                let objectUrl = URL.createObjectURL(blob);
                a.setAttribute("href",objectUrl);
                a.setAttribute("download", cityName+'配套-'+item.name+'-'+new Date().toLocaleString()+'.csv');
                a.click();
                //that.$message.success('所选土地已导为csv文件')
                window.URL.revokeObjectURL(a.href);
                //document.body.removeChild(a);
                //that.expLoading = false
              }else{
                that.$message.error('未发现导出数据')
                //that.expLoading = false
              }
            })
          }
        })
      }
    },
  }
}
</script>
<style lang="scss">
.matchinglayer_wrap{
  position: relative;
  .mtlayer_tree{
    position: fixed;
    width: 150px;
    top: 50px;
    right: 174px;
    background: #fff;
    padding: 18px;
    border-radius: 4px;
    z-index: 1;
    .export_btn{
      margin-top: 20px;
    }
    .tips{
      font-size: 12px;
      margin-top: 5px;
      color: #888;
    }
  }
}
#popIn,#popDis{
  display: none;
  left: 0;
  top: auto;
  right: 0;
  bottom: 0;
}
</style>