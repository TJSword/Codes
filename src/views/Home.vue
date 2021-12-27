<template>
  <div class="main_wrap">
    <Connect />
    <MainMenu style="display:none" />
    <keep-alive style="display:none" include="dataquery,analysistools,ledger_map,projectorienttation">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
//API
import commonApi from "@/api/commonApi";
import { treeDataTranslateCode } from "@/utils/public"

//插件
import { mapGetters } from "vuex";
import axios from "axios"

//组件
import MainMenu from "@/components/main/home/MainMenu"
import Connect from "@/components/common/connect"

export default {
  data() {
    return {
      addPointFlag: false,
      circleRadius: 1.5,
      
    };
  },
  components: {
    MainMenu,
    Connect
  },
  watch: {
    cityCode:{
      handler(newVal,oldValue){
        if(oldValue===null){ 
          //let geojson = sessionStorage.getItem('geojson')
          let plate_center = sessionStorage.getItem('plate_center')
          let plate_data = sessionStorage.getItem('plate_data')
          if(plate_data){ //刷新页面
            //this.$store.dispatch("setPlateGEOJSON",JSON.parse(geojson))
            this.$store.dispatch("setPlateCenter",JSON.parse(plate_center))
            this.$store.dispatch("setPlateData",JSON.parse(plate_data))
          }else{ //浏览器第一次加载网站
            this.setPlateDatas(newVal)
          }
        }else{ //切换城市,更新geojson
          this.setPlateDatas(newVal)
        }
        
      },
      deep:true
    }
  },
  computed: {
    ...mapGetters(["userInfo", "mapbox_map","cityCode"])
  },
  mounted() {
    
  },
  methods: {
    //用户登出
    userLogout() {
      this.$store.dispatch("logOut").then(() => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    },
    //板块数据加载
    setPlateDatas(code){
      var that = this
      let code_4 = code.substring(0,4)
      commonApi.getPlateGeoJSON(code_4)
      .then(res=>{
        console.log(res.data)
        if(res.data.code===0){
          let list = JSON.parse(JSON.stringify(res.data.data))
          let obj = {
            region:[], //行政区
            part:[], //行政区+板块
            customize:[], //自定义板块
            region_part:[],//通用板块
            curCityInfo:{}
          }
          console.log(list)
          //that.plateGEOJSON(list)
          let centerArr = []
          list.forEach(item=>{
            let centerCoor = item.center.split(' ')
            let item_info = {
              id:item.id,
              name:item.name,
              regionno:item.regionno,
              type:item.type,
              color:"#46c5ff",
              center:centerCoor
            }
            //板块中心列表存储
            centerArr.push(item_info)
            
            //板块分类列表存储
            if(item.type==="part"){ //通用板块
              obj.region_part.push(item_info)

            }else if(item.type==="region"){ //行政区
              obj.region.push(item_info)
              obj.part.push(item_info)
            }else if(item.type==="customize"){ //自定义板块
              obj.customize.push(item_info)
              
            }else if(item.type==="city"){ //存取当前城市信息
              
              let centerCoor = item.center.split(' ')
              obj.curCityInfo = {
                id:item.id,
                name:item.name,
                regionno:item.regionno,
                type:item.type,
                center:[JSON.parse(centerCoor[0])+0.1,JSON.parse(centerCoor[1])-0.3]
              }
            }
          })
          //将通用板块与行政区关联
          let partList = JSON.parse(JSON.stringify(obj.part))
          partList.forEach(item=>{
            let arr = obj.region_part.filter(part=>{
              return item.regionno == part.regionno.substring(0,6)
            })
            item.children = arr
          })
          obj.part = partList
          //板块数据数据存储到store
          this.$store.dispatch("setPlateData",obj)
          this.$store.dispatch("setPlateCenter",centerArr)
          //板块数据数据存储到sessionStorage
          sessionStorage.setItem('plate_data', JSON.stringify(obj));
          sessionStorage.setItem('plate_center', JSON.stringify(centerArr));
        }
      }).catch(error=>{
        console.log(error)
      })
    },
    plateGEOJSON(list){ //存储板块的GeoJSON数据、中心点数据到store
      let arr = JSON.parse(JSON.stringify(list))
      let centerArr = [] //板块中心点
      let layer_data = {
        type: "FeatureCollection",
        features: []
      }
      
      arr.forEach(item=>{
        //板块坐标数据
        if(item.coordinates){
          let coorArr = []
          let i = item.coordinates.indexOf('],[')
          if(i!==-1){ //该板块存在多个闭合区域,MultiPolygon
            let end = item.coordinates.length
            let listStr = item.coordinates.substring(1,end-1)
            let arrList = listStr.split('],[')
            
            arrList.forEach(item=>{
              let area = []
              let siteArr = item.split(',')
              siteArr.forEach(site=>{
                area.push(site.split(' '))
              })
              area = [area]
              coorArr.push(area)
            })
          }else{ //Polygon
            let index = item.coordinates.indexOf(']')
            let str = item.coordinates.substring(1,index)
            let strArr = str.split(',')
            strArr = strArr.filter(item=>item!="")
            
            strArr.forEach(str=>{
              coorArr.push(str.split(' '))
            })
          }
          
          let feature_item = {
            "type":"Feature",
            "geometry":{
              "type": i!==-1?"MultiPolygon":"Polygon",
              "coordinates":i!==-1?coorArr:[coorArr]
            },
            "properties":{
              "id":item.id,
              "name":item.name,
              "type":item.type
            },
            "id":JSON.parse(item.id)
            
          }
          layer_data.features.push(feature_item)
        }
        //板块中心点数据
        if(item.center){
          let centerCoor = item.center.split(' ')
          centerArr.push({
            name:item.name,
            type:item.type,
            regionno:item.regionno,
            center:centerCoor
          })
        }
      })
      console.log('板块GeoJSON数据',layer_data)
      console.log('板块中心点数据',centerArr)
      this.$store.dispatch("setPlateGEOJSON",layer_data)
      this.$store.dispatch("setPlateCenter",centerArr)
      
      //geojson、中心点数据数据存储到sessionStorage
      sessionStorage.setItem('geojson', JSON.stringify(layer_data));
      sessionStorage.setItem('plate_center', JSON.stringify(centerArr));
      
    },
  }
};
</script>
<style lang="scss">

</style>
