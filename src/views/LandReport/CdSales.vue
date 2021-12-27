<template>
  <!-- 竞品市场-去化、销量 -->
  <div class="cdsales_wrap">
    <!-- 去化销量结论 -->
    <div class="cssales_top">
      <div class="salseinfo" v-for="(item,index) in salseInfo" :key="index">{{item}}</div>
    </div>
    <div class="salse_bottom">
      <!-- 去化信息表格 -->
      <div class="table_qh">
        <div class="head_wrap">
          <div class="table_head" v-for="(item,index1) in qhTableHead" :key="index1">{{item}}</div>
        </div>
        <div class="cd_box">
          <div class="cd_item" v-for="(cd,index2) in cdqhData" :key="index2">
              <!-- 项目名称 -->
              <div class="name">{{cd.building_name}}</div>
              <div class="proType_wrap">
                <div class="proType_item" v-for="(proType,index3) in cd.market" :key="index3">
                  <!-- 物业形态 -->
                  <div class="name" v-if="proType.show">{{proType.type_name}}</div>
                  <div class="buildType_wrap">
                    <div class="buildType_item" v-for="(buildType,index4) in proType.build_forms" :key="index4">
                      <!-- 建筑形态 -->
                      <div class="name" v-if="buildType.area_sizes&&buildType.area_sizes.length>0">{{buildType.build_form_name}}</div>
                      <div class="areaSize_wrap">
                        <div class="areaSize_item" v-for="(areaSize,index5) in buildType.area_sizes" :key="index5">
                          <!-- 面积段 -->
                          <div class="areaSize_name">{{areaSize.area_size}}</div>
                          <!-- 供应套数 -->
                          <div class="areaSize_name">{{areaSize.supply}}</div>
                          <!-- 成交套数 -->
                          <div class="areaSize_name">{{areaSize.volume}}</div>
                          <!-- 去化率 -->
                          <div class="areaSize_name">{{areaSize.ratio?areaSize.ratio.toFixed(2):''}}</div>
                          
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
      <!-- 竞品地图 -->
      <div class="qh_map">
        <ReportMap mapType="CompetitorDistribution" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import LandReportApi from '@/api/LandReportApi_zlq'
import ReportMap from '@/components/common/ReportMap'
export default {
  name: "cdqh",
  props:{
    reportId:{
      type:String,
      default:''
    }
  },
  components: {
    ReportMap
  },
  data() {
    return {
      cdqhData:[],//竞品去化信息
      qhTableHead:['项目名称','物业形态','建筑形态','面积段','供应套数','成交套数','去化率'],//去化表格表头
      salseInfo:[ //去化数据
        '【叠拼】均价1.6-1.7万（毛坯），月均去化10-20套0.2-0.3万㎡，主力产品140-180㎡、200-250万',
        '【洋房】均价1.3-1.5万（含精装），月均去化10-36套0.1-0.4万㎡，面积和总价差异大'
      ]
    };
  },
  mounted() {
    this.getCdqh()
    setTimeout(() => {
      this.getCdList()
    }, 1500);
  },
  computed: {
    ...mapGetters(["CD_map"]),
  },
  watch: {},
  methods: {
    //获取竞品数据
    getCdList(){
      var that = this
      var map = this.CD_map
      LandReportApi.getCDinfos({reportId:that.reportId})
      .then(res=>{
        if(res.data.code===0){
          console.log('竞品信息',res)
          let data = res.data.data
          let geojsonData = {
            type:'FeatureCollection',
            features:[]
          }
          data.forEach((item,i)=>{
            let center = item.coordinates.split(',')
            geojsonData.features.push({
              type:'Feature',
              properties:{
                name:item.buildingName,
                id:item.buildingId,
                avePrice:item.avePrice,
                typeNames:item.typeNames
              },
              geometry:{
                type:'Point',
                coordinates:center
              }
            })
            if(item.buildingId=='0'){
              map.flyTo({
                center: center,
                zoom: 12,
                speed: 0.8,
                curve: 2
              })
            }
          })
          
          let saleCdSource = map.getSource('saleCdSource')
          if(saleCdSource===undefined){
            map.addSource('saleCdSource',{
              type:'geojson',
              data:{
                type:'FeatureCollection',
                features:[]
              }
            })
            map.addLayer({
              "id": "saleCdSourceC",
              "type": "circle",
              "source": "saleCdSource",
              "layout": {
                
              },
              "paint":{
                'circle-radius': [
                  'match',
                  ['get','id'],
                  '0',15,
                  8
                ],
                'circle-color': [
                  'match',
                  ['get','id'],
                  '0','#a50026',
                  '#fee090'
                ]
              }
            });
            map.addLayer({
              "id": "saleCdSourceS",
              "type": "symbol",
              "source": "saleCdSource",
              "layout": {
                "text-field": "{name}",
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                "text-offset": [0, 1.2],
                "text-anchor": "top",
                "text-size":10,
                "text-allow-overlap": true,
              },
              "paint":{
                "text-color":"#fff"
              }
            });
            var popup = new this.mbgl.Popup({closeButton:true})
            map.on('click','saleCdSourceC',e=>{
              let properties = e.features[0].properties
              let coordinates = [e.lngLat.lng,e.lngLat.lat];
              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              } 
              let html = `
              <div class="">项目名称：${properties.name}</div>
              <div class="">成交均价：${properties.avePrice} 元/㎡</div>
              <div class="">物业类型：${properties.typeNames}</div>
              `
              popup.setLngLat(coordinates).setHTML(html).addTo(map)
            })
          }
          map.getSource('saleCdSource').setData(geojsonData)
        }
      })
    },
    getCdqh(){ //获取项目竞品去化销量信息
      var that = this
      LandReportApi.projectCdqh({reportId:that.reportId,mold:'qh'})
      .then(res=>{
        if(res.data.code===0){
          let data = res.data.data
          console.log('项目竞品去化销量信息',data)
          data.forEach(item1=>{
            item1.market.forEach(item2=>{
              if(item2.build_forms){
                let x = 0
                item2.build_forms.forEach(item3=>{
                  x += item3.area_sizes.length
                  //添加合计
                  if(item3.area_sizes.length>0){
                    let obj = { area_size:'合计', supply:0, volume:0 }
                    item3.area_sizes.forEach(item4=>{
                      obj.supply += item4.supply
                      obj.volume += item4.volume
                    })
                    item3.area_sizes.push(obj)
                  }
                })
                item2.show = x>0?true:false
              }else{ //办公商业公寓添加建筑形态
                item2.build_forms = []
                //添加合计
                let obj = { area_size:'合计', supply:0, volume:0 }
                item2.area_sizes.forEach(item5=>{
                  item2.build_forms.push(item5)
                  obj.supply += item5.supply
                  obj.volume += item5.volume
                })
                item2.build_forms.push(obj)
                item2.show = item2.area_sizes.length>0?true:false
              }
            })
          })
          that.cdqhData = data
        }else if(res.data.code==500){
          that.$message(res.data.msg)
        }
      })
    },
    
  },
};
</script>
<style lang="scss">
.cdsales_wrap {
  width: 100%;
  height: 100%;
  z-index: 999;
  .cssales_top{
    padding: 10px 20px;
    height: 7%;
    font-size: 18px;
    font-weight: bold;
    overflow-y: scroll;
  }
  .salse_bottom{
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    height: 88.5%;
    
    .table_qh{
      width: 60%;
      height: 101%;
      overflow: scroll;
    }
    .qh_map{
      width: 39%;
      height: 100%;
    }
  }
  .head_wrap{
    display: flex;
    width: fit-content;
    border-right: #EBEEF5 1px solid;
    .table_head{
      width: 120px;
      text-align: center;
      height: 40px;
      line-height: 40px;
      border-top: #EBEEF5 1px solid;
      border-left: #EBEEF5 1px solid;
      background: #4a4a4a;
      color: #fff;
    }
  }
  .cd_box{
    border-right: #EBEEF5 1px solid;
    border-bottom: #EBEEF5 1px solid;
    width: fit-content;
    font-size: 14px;
    color: #606266;
    .cd_item{
      display: flex;
      .name{
        border-top: #EBEEF5 1px solid;
        border-left: #EBEEF5 1px solid;
        width: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
      }
      .proType_wrap{
        .proType_item{
          display: flex;
          .buildType_wrap{
            .buildType_item{
              display: flex;
              .areaSize_wrap{
                .areaSize_item{
                  display: flex;
                  .areaSize_name{
                    border-top: #EBEEF5 1px solid;
                    border-left: #EBEEF5 1px solid;
                    width: 120px;
                    height: 35px;
                    line-height: 35px;
                    text-align: center;
                    background: #fff;
                  }
                }
              }
            }
          }
        }
      }
      
    }
  }
}
</style>
