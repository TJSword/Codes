<template>
  <!-- 投资云地图主入口 -->
  <div class="ledger_map">
    <Ledger />
    <MapComponent mapType="ledgerMap" />
    <LandScore />
    <ControlPlanUpload :isShow="showControlLand" @closeUpload="closeUpload()" />
    <LeavingMessage />
    <LandInfos />
    <MachingLayers v-show="showMatchingLayer" :isShow="showMatchingLayer" />
    <FileImport v-show="showFileImport" :isShow="showFileImport" @closeFileImport="closeFileImport()" />
    <CustomPlates v-show="showCustomPlate" :isShow="showCustomPlate" @closeCustom="closeCustom()" />
    <ControlregLayer v-show="showControlLayer"  :isShow="showControlLayer" />
    <Friends />
    <AddLinePoint />
    <PopulationHome />
    <LandQuantity />
    <LandSaleHouse />
    <TestPage />
    <div class="map_tool" style="position: absolute; right: 205px; top: 10px; z-index: 99; display: flex;">
      <div class="item_wrap" v-for="(item,i) in subMenu" :key="item.id">
        <div class="tool_item" v-if="item.iscommon==='1'" @click="menuControl(item,i)">
          <el-tooltip class="item" effect="light" :content="item.name" placement="bottom-end">
            <i :class="['iconfont',item.icon]" :style="{'color':item.isActive?'#1782df':'#323739'}"></i>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
//Api
import ledgerApi from "@/api/ledgerApi";
import { mapGetters } from "vuex";
//组件
import MapComponent from "@/components/common/MapComponent";
import Ledger from "@/components/main/ledgermap/ledger";
import LandScore from '@/components/main/ledgermap/landScore'
import ControlPlanUpload from '@/components/main/ledgermap/controlPlanUpload'
import LeavingMessage from '@/components/main/ledgermap/leavingMessage'
import LandInfos from '@/components/main/ledgermap/landInfos'
import MachingLayers from '@/components/main/ledgermap/matchingLayers'
import FileImport from '@/components/main/ledgermap/fileImport'
import CustomPlates from '@/components/main/ledgermap/customPlates'
import Friends from '@/components/main/ledgermap/friends'
import AddLinePoint from '@/components/main/ledgermap/addLinePoint'
import ControlregLayer from '@/components/main/ledgermap/controlregLayer'
import PopulationHome from "@/components/main/population/populationHome.vue"
import LandQuantity from "@/components/main/ledgermap/landQuantity.vue"
import LandSaleHouse from "@/components/main/ledgermap/landSaleHouse.vue"
import TestPage from "@/components/main/ledgermap/testPage.vue"
export default {
  name: "ledger_map",
  props: {},
  components: {
    MapComponent,
    Ledger,
    LandScore,
    ControlPlanUpload,
    LeavingMessage,
    LandInfos,
    MachingLayers,
    FileImport,
    CustomPlates,
    Friends,
    AddLinePoint,
    ControlregLayer,
    PopulationHome,
    LandQuantity,
    LandSaleHouse,
    TestPage
  },
  data() {
    return {
      ledgerCoord:null,//点击的台账点的坐标
      curDistrictID:null,//选择的学校ID
      showCustomPlate:false,//自定义板块
      showFileImport:false,//文件导入
      showMatchingLayer:false,//配套图层
      showControlLand:false,//控规图
      showControlLayer:false,//控规图层
      subMenu:[],//用户菜单
    };
  },
  beforeMount(){
    // if(this.userMenu.length>0){
    //   this.setSubMenu()
    // }
  },
  mounted() {
    
  },
  watch:{
    userMenu:{
      handler(newVal){
        this.setSubMenu()
      },
      deep:true
    },
    curMenu:{
      handler(newVal){
        if(newVal==='TzyMap'){
          this.setSubMenu()
        }
      },
      deep:true
    },
  },
  computed: {
    ...mapGetters(["ledger_map","plateCenter","cityCode","userMenu","curMenu"]),
  },
  methods: {
    //用户菜单
    setSubMenu(){
      let name = sessionStorage.getItem('curMainMenu')
      let curMainMenu = name?name:'TzyMap'
      let menu = this.userMenu.filter(item=>item.value==curMainMenu)[0].children
      let arr = []
      menu.forEach(item=>{
        arr.push({
          id:item.id,
          name:item.name,
          value:item.unit,
          icon:item.icon,
          route:item.url,
          iscommon:item.iscommon,
          isActive:false,
        })
        if(item.unit=="showControlLayer"){ //判断拥有控规图分享权限
          this.$store.dispatch('setControlShare',item.children.length>0)
        }
      })
      this.subMenu = arr
    },
    //菜单控制
    menuControl(item,i){
      this.subMenu[i].isActive = !item.isActive
      let isShow = this.subMenu[i].isActive
      if(item.value==='showCustomPlate'){
        this.showCustomPlate = isShow
      }else if(item.value==='showFileImport'){
        this.showFileImport = isShow
      }else if(item.value==='showMatchingLayer'){
        this.showMatchingLayer = isShow
      }else if(item.value==='showControlLand'){
        this.showControlLand = isShow
      }else if(item.value==='showControlLayer'){
        this.showControlLayer = isShow
      }
    },
    //关闭控规图
    closeUpload(){
      this.showControlLand = false
      this.subMenu.forEach(item=>{
        if(item.value==='showControlLand'){
          item.isActive = false
        }
      })
    },
    //关闭自定义板块
    closeCustom(){
      this.showCustomPlate = false
      this.subMenu.forEach(item=>{
        if(item.value==='showCustomPlate'){
          item.isActive = false
        }
      })
    },
    //关闭数据导入
    closeFileImport(){
      this.showFileImport = false
      this.subMenu.forEach(item=>{
        if(item.value==='showFileImport'){
          item.isActive = false
        }
      })
    },
    //学区信息
    setSchoolDistrict(e){
      let map = this.ledger_map
      let schoolType = e.features[0].properties.school_type
      let schoolID = e.features[0].properties.id
      let relation = e.features[0].properties.relation //市区小学初中存在该字段
      if(this.curDistrictID==schoolID){
        this.curDistrictID=null
        map.setLayoutProperty('school_district_fill', 'visibility', 'none')
        map.setLayoutProperty('school_district_line', 'visibility', 'none')
        map.setLayoutProperty('school_district_symbol', 'visibility', 'none')
      }else{
        let filter = []
        if(relation!==undefined&&schoolType=="junior_middle_school"){ //市区初中
          let relation_id = e.features[0].properties.relation_id
          let counterpart = relation_id.split(',')
          filter = ['in','school_id'].concat(counterpart)
        }else{ //市区小学、郊区小学、初中
          filter = ['==','school_id',schoolID]
        }
        map.setLayoutProperty('school_district_fill', 'visibility', 'visible')
        //map.setLayoutProperty('school_district_line', 'visibility', 'visible')
        map.setLayoutProperty('school_district_symbol', 'visibility', 'visible')
        map.setFilter('school_district_fill', filter);
        map.setFilter('school_district_line', filter);
        map.setFilter('school_district_symbol', filter);
        this.curDistrictID=schoolID
      }
    },
    //宗地信息
    getdealLandInfo(info,lnglat){
      console.log(info)
      var that = this
      var map = this.ledger_map
      let html = 
      `<div class="data_wrap_land">
        <div class="info_item"><span class="name">土地位置：</span>${info.address}</div>
        <div class="info_item"><span class="name">出让时间：</span>${info.sell_date}</div>
        <div class="info_item"><span class="name">板块：</span>${info.partname}</div>
        <div class="info_item"><span class="name">土地用途：</span>${that.converseLandUse(info.land_use)}</div>
        <div class="info_item"><span class="name">商业占比：</span>${info.business_rate}</div>
        <div class="info_item"><span class="name">容积率：</span>${info.dev_volume}</div>
        <div class="info_item"><span class="name">净用地面积：</span>${info.land_area?parseInt(info.land_area):'暂无'} ㎡</div>
        <div class="info_item"><span class="name">楼面地价：</span>${info.total_floor_price?parseInt(info.total_floor_price):'暂无'} 元/㎡</div>
        `
      let popup = new that.mbgl.Popup({offset:15,anchor:'left',closeButton:true})
      popup.setLngLat([lnglat.lng,lnglat.lat]).setHTML(html).addTo(map)
    },
    //楼盘市场数据年份统计
    getBuildingYeas(id,lnglat){
      var that = this
      var map = this.ledger_map
      let date = new Date()
      let max_year = date.getFullYear()
      let min_year = max_year-9
      let obj = {
        buildingId:id,
        minyear:min_year,
        maxyear:max_year
      }
      ledgerApi.getMarketYearsInfo(obj)
      .then(res=>{
        if(res.data.code===0){
          let data = res.data.data
          console.log(data)
          let types = []
          let typesArr = []
          data.forEach(item=>{
            let i = types.indexOf(item.type)
            if(i==-1){
              typesArr.push({
                type:item.type,
                typeName:item.type=='house'?'住宅':item.type=='business'?'商业':item.type=='apartment'?'公寓':item.type=='praetorium'?'别墅':'办公',
                nodes:[item]
              })
              types.push(item.type)
            }else{
              typesArr[i].nodes.push(item)
            }
          })
          console.log(typesArr)

          let html = `<div class="data_wrap">
                        <div class="type_label">
                          <div class="label">建筑形态</div>
                          <div class="label">年份</div>
                          <div class="label">平均单价(元/㎡)</div>
                          <div class="label">供应套数(套)</div>
                          <div class="label">供应面积(㎡)</div>
                          <div class="label">成交套数(套)</div>
                          <div class="label">成交面积(㎡)</div>
                          <div class="label">成交总价(万元)</div>
                        </div>`
          typesArr.forEach(item=>{
            html += `<div class="type_wrap">
                      <div class="type_name">${item.typeName}</div>
                      <div class="info_wrap">`
            item.nodes.forEach(node=>{
              html += `<div class="info">
                <div class="info_item">${node.year}</div>
                <div class="info_item">${parseInt(node.avgprice*10000)}</div>
                <div class="info_item">${node.supply}</div>
                <div class="info_item">${parseInt(node.supplyarea)}</div>
                <div class="info_item">${node.volume}</div>
                <div class="info_item">${parseInt(node.volumearea)}</div>
                <div class="info_item">${parseInt(node.volumeprice)}</div>
              </div>`
            })
            html += `</div></div>`
          })
          html += `</div>`
          let popup = new that.mbgl.Popup({offset:15,anchor:'left',closeButton:true})
          popup.setLngLat([lnglat.lng,lnglat.lat]).setHTML(html).addTo(map)
        }
      })
    },
    
    //学区图层
    schoolDistrictLayer(flag){
      var map = this.ledger_map
      let code = this.cityCode
      //学区
      var workSpace_layer_xq = 'city_'+code+':'+code+'_school_district'
      let url_xq = this.geoserverURL+'/geoserver/gwc/service/tms/1.0.0/'+workSpace_layer_xq+'@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf'
      
      if(map.getSource('school_district_source')==undefined){
        map.addSource("school_district_source", {
            type: "vector",
            scheme: "tms",
            tiles: [url_xq]
        });
        map.addLayer({ //学区填充
            "id": "school_district_fill",
            "type": "fill",
            "source": "school_district_source",
            "source-layer": code+"_school_district",
            "paint":{
                'fill-color':'#e9f715',
                "fill-opacity":0.4
            },
            'layout': {
                'visibility':'none'
            }
        })
        map.addLayer({  //学区描边
            "id": "school_district_line",
            "type": "line",
            "source": "school_district_source",
            "source-layer": code+"_school_district",
            'layout': {
                'visibility':'none'
            },
            "paint": {
                "line-color":"#fff",
                "line-width":1,
                "line-opacity":0.5
            }
        });
        map.addLayer({  //学区名称
            "id": "school_district_symbol",
            "type": "symbol",
            "source": "school_district_source",
            "source-layer": code+"_school_district",
            'layout': {
                "text-field": ["get", "name"],
                "text-size": 10,
                'text-ignore-placement':false,
                "text-justify": "auto",
                'visibility':'none'
            },
            "paint": {
                "text-color":"#fff",
                "text-halo-color":'rgba(0,0,0,0.3)',
                "text-halo-width":2.5
            }
        });
        map.on('click','school_district_fill',e=>{
            console.log('学区',e)
        })
      }
     
    },
    //根据值获得土地用地类型
    converseLandUse(val) {
      var name = ''
      switch(val){
        case 'house':
          name = '纯住宅';
          break;
        case 'commerce_house':
          name = '商住';
          break;
        case 'house_commerce':
          name = '住兼商';
          break;
        case 'commerce':
          name = '商业';
          break;
        case 'industry':
          name = '工业';
          break;
        case 'other':
          name = '其他';
          break;
        default:
          name = null
      }
      return name
    },
    
  },
};
</script>
<style lang="scss">
.ledger_map {
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  bottom: 0px;
  background: #0c1015;
  
  .mapboxgl-popup-content{
    max-width: unset;
  }
  .mapboxgl-popup-close-button{
    color: #fff;
  }
  .data_wrap_land{
    width: 300px;
    height: 200px;
    overflow: scroll;
    .info_item{
      font-size: 12px;
      margin-top: 5px;
      .name{
        color: #67c23a;
      }
    }
  }
  .data_wrap{
    width: 400px;
    height: 250px;
    overflow: scroll;
    font-size: 12px;
    .type_label{
      display: flex;
      width: fit-content;
      .label{
        width: 100px;
        text-align: center;
        height: 30px;
        line-height: 30px;
        color:#ff9900;
      }
    }
    .type_wrap{
      display: flex;
      width: fit-content;
      border-top: rgba(230, 162, 60, 0.4) 1px solid;
      .type_name{
        color: #67c23a;
        width: 100px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .info_wrap{
        .info{
          display: flex;
        }
        .info_item{
          width: 100px;
          text-align: center;
          height: 30px;
          line-height: 30px;
        }
      }
    }
    
  }
  .tool_item{
    width: 29px;
    height: 29px;
    box-shadow: 0 0 0 2px rgba(0,0,0,.1);
    border-radius: 4px;
    background: #fff;
    color: #333;
    cursor: pointer;
    text-align: center;
    line-height: 29px;
    margin-left: 5px;
    .icon{
      font-size: 20px;
    }
  }
  .infos_wrap{
    width: 400px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .item_head{
      width: 100%;
    }
    .item_name{
      width: 46%;
      margin-top: 5px;
    }
    .land_opt{
      width: 100%;
      margin-top: 25px;
      display: flex;
    }
    .land_score_btn,.land_info_btn,.sale_house_btn,.land_share_btn{
      width: 100px;
      height: 35px;
      line-height: 35px;
      text-align: center;
      border-radius: 4px;
      cursor: pointer;
      background: rgb(216, 131, 75);
      color: #fff;
      font-size: 14px;
      user-select: none;
      &:hover{
        background:  rgb(161, 98, 53);
      }
    }
    .land_info_btn{
      background: rgb(58, 129, 223);
      margin-right: 10px;
      &:hover{
        background:rgb(40, 92, 160);
      }
    }
    .sale_house_btn{
      background: #448c21;
      margin-left: 10px;
      &:hover{
        background:#448c21;
      }
    }
    .land_share_btn{
      background: #a77622;
      margin-right: 10px;
      &:hover{
        background:#a77622;
      }
    }
    
}
}
</style>
