<template>
  <div class="goodSituation_wrap">
    <div class="diver">查询条件</div>
     <div class="from_box">
        <el-form :inline="true" :model="formInline" size="small" style="text-align: start;">
           <el-form-item label="">
              <el-radio v-model="radio" label="region" @change="radioChange">行政区</el-radio>
              <el-radio v-model="radio" label="part" @change="radioChange">板块</el-radio>
            </el-form-item>
          <el-form-item v-if="radio === 'region'">
            <el-select v-model="codes" placeholder="请选择行政区" style="margin-top:6px" multiple :collapse-tags="true" clearable>
                <el-option
                v-for="item in regionList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
            </el-select>
          </el-form-item>
           <el-form-item  v-if="radio === 'part'">
            <el-select v-model="codes" placeholder="请选择板块" style="margin-top:6px" multiple :collapse-tags="true" clearable>
                <el-option
                v-for="item in partList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
            </el-select>
          </el-form-item>
           <el-form-item >
              <el-select v-model="buildForms" placeholder="建筑形态" multiple :collapse-tags="true" clearable>
               <el-option :label="item.label" :value="item.value" v-for="(item,index) in buildArr" :key="index"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item >
              <el-select v-model="propertyTypes" placeholder="物业类型" multiple :collapse-tags="true" clearable>
               <el-option :label="item.label" :value="item.value" v-for="(item,index) in propertyArr" :key="index"></el-option>
              </el-select>
          </el-form-item>
           <el-form-item label="">
              <el-select  v-model="avgSizes" placeholder="单价段" clearable multiple :collapse-tags="true" @focus="selectFocus('avg_size')">
                 <el-option :label="item.label" :value="item.value" v-for="item in avg_size" :key="item.value"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="">
              <el-select  v-model="areaSizes" placeholder="面积段" clearable multiple :collapse-tags="true" @focus="selectFocus('area_size')">
                 <el-option :label="item.label" :value="item.value" v-for="item in area_size" :key="item.value"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="">
              <el-select  v-model="totalSizes" placeholder="总价段" clearable multiple :collapse-tags="true" @focus="selectFocus('total_size')">
                 <el-option :label="item.label" :value="item.value" v-for="item in total_size" :key="item.value"></el-option>
              </el-select>
          </el-form-item>
           <el-form-item label="">
              <el-date-picker
                  v-model="date"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerTime">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
            <!-- <div class="submit_btn"></div> -->
            <el-button style="width:100%"  @click="getBuilding" type="primary">点击查询</el-button>
            </el-form-item>
        </el-form>
    </div>
     <dv-border-box-12 class="ranking_list">
          <el-table 
          :data="tableData"
          style="width: 96%;margin-left:2%;margin-top:1%;background: transparent;color:white"
          :height="tableHeight"
          @row-click="rowClick"
          row-key="id"
          lazy
          :load="load"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          v-if="showTable"
          >
          <el-table-column
            prop="name"
            label="楼盘"
            align="center">
          </el-table-column>
          <el-table-column
            prop="hotScore"
            label="用户指数"
            align="center"
            >
          </el-table-column>
        </el-table>
       </dv-border-box-12>
        <dv-border-box-12 :class="['echarts_mask',isShowEcharts?'echarts_mask_active':'']">
          <div :class="['container',isShowEcharts?'container_active':'']" @click="isShowEcharts = !isShowEcharts">
              <div class="chevron"></div>
              <div class="chevron"></div>
              <div class="chevron"></div>
          </div>
          <div id="goodsEcharts"></div>
        </dv-border-box-12>
       <VueDeckgl :layers="setlayers()" :viewState="viewState"
        @click="handleClick" @view-state-change="updateViewState"
        style="position:fixed;top:0;left:0;width:100%;height:100%;overflow:hidden;z-index:-1"
        v-show="showFlyline">
        </VueDeckgl>
        <Loading v-if="showLoading" />
        <ProjectDetail :proPoi="proPoi" :proId="proId" :proTitle="proTitle" v-if="showProjectDetail" />
  </div>
</template>

<script>
import VueDeckgl from 'vue-deck.gl'
import situationApi from "../../../api/situationApi.js"
import { mapGetters } from "vuex" 
import { TripsLayer,GreatCircleLayer } from '@deck.gl/geo-layers'
import ProjectDetail from "../houseData/ProjectDetail.vue"
import Loading from "@/components/tools/loading.vue"
export default {
    components:{VueDeckgl,ProjectDetail,Loading},
    computed:{
      layers(){
          return this.setlayers()
        },
      ...mapGetters(['situationMap'])
    },
    data(){
        return {
          date:[],
          codes:[],
          showSinglePro:false,
          showProjectDetail:false,
          isShowEcharts:false,
          showLoading:false,
          showTable:true,
          radio:'region',
          showFlyline:false,
          buildIn:false,
          buildOut:false,
          formInline:{},
          region:[],
          part:[],
          value:"",
          options:[],
          partList:[],
          regionList:[],
          buildArr:[],
          propertyArr:[],
          property:[],
          build:[],
          devloperList:[],
          devloper:[],
          building:[],
          buildingList:[],
          propertyTypes:[],
          tableData:[],
          buildForms:[],
          avg_size:[],
          area_size:[],
          total_size:[],
          avgSizes:[],
          totalSizes:[],
          areaSizes:[],
          viewState: {
              longitude: localStorage.getItem('cityCenter')?JSON.parse(localStorage.getItem('cityCenter'))[0]:104.063115,
              latitude: localStorage.getItem('cityCenter')?JSON.parse(localStorage.getItem('cityCenter'))[1]:30.669457,
              zoom: 9,
              bearing: 0,
              pitch: 0,
          },
          time:0,
          moveOut:[],
          timer:null,
          pickerTime: {
            disabledDate(time) {
                return time.getTime() <= new Date('2021-11-24').getTime() || time.getTime() > new Date().getTime();
            },
          },
        }
    },
    watch:{
      situationMap:{
        handler(map){
            //添加空白点图层
            let buildingsPointSource = map.getSource('buildingsPoint')
            if(buildingsPointSource === undefined){
              map.addSource('buildingsPoint',{
                type:'geojson',
                data:{
                  type:'FeatureCollection',
                  features:[]
                }
              })
              map.addLayer({
                id:'buildingsLayer',
                type:'circle',
                source:'buildingsPoint',
                paint: {
                  'circle-color':'#fcbf49',
                  "circle-radius": [
                      "interpolate",
                      ["linear"],
                      ["zoom"],
                      9, 3,
                      16, 10
                    ],
                  'circle-stroke-width': 0.2,
                  'circle-stroke-color': 'white',
                  'circle-opacity':0.9
                }
              })
              map.addSource('raceBuildings',{
                type:'geojson',
                data:{
                  type:'FeatureCollection',
                  features:[]
                }
              })
              map.addLayer({
                id:'raceBuildingsLayer',
                type:'circle',
                source:'raceBuildings',
                paint: {
                  'circle-color':'#219ebc',
                  "circle-radius": [
                      "interpolate",
                      ["linear"],
                      ["zoom"],
                      9, 2,
                      16, 8
                    ],
                  'circle-stroke-width': 0.2,
                  'circle-stroke-color': 'white',
                  'circle-opacity':0.9
                }
              })
              map.addLayer({
                id:'raceBuildingsSymbol',
                type: "symbol",
                source:'raceBuildings',
                layout: {
                  "text-field": ["get", "name"],
                  "text-allow-overlap": false,
                  "text-size": 14,
                },
                paint:{
                  "text-opacity":1,
                  "text-color": "#11b4da",
                  "text-halo-color": "rgba(0,0,0,0.8)",
                  "text-halo-width": 1.5,
                  "text-halo-blur": 0.5
                }
              })
            }
            
            this.popupClick = new this.mbgl.Popup({
                offset:15,
                anchor:'left',
                closeButton:true,
                closeOnClick:false
            })
            let popup = new this.mbgl.Popup({
                offset:15,
                anchor:'left',
                closeButton:false,
                closeOnClick:false
            })
            map.on('mousemove','buildingsLayer',e=>{
                map.getCanvas().style.cursor = 'pointer'
                let coordinates = [e.lngLat.lng, e.lngLat.lat];
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                     coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
                var name = e.features[0].properties.name;
                var htmlInfo = `<P class="item_head" >${name}</p>`
                popup.setLngLat(coordinates).setHTML(htmlInfo).addTo(map);
            })
            map.on('mouseleave','buildingsLayer',e=>{
                popup.remove()
                map.getCanvas().style.cursor = 'default'
            })
            map.on('click','buildingsLayer',e=>{
              //阻止点击事件穿透到底部图层
            //  e.originalEvent.cancelBubble = true;
            console.log(e.features[0].properties)
            let data = e.features[0].properties
            situationApi.getbuildingInfo(data.id).then(res=>{
              console.log(data)
              let info = res.data.data.build_info
                var htmlInfo = `<div class="house_infoWrap">
                  <div class="info_content">
                  <div class="info_head" style="font-size:18px;font-weight:700">${data.name} </div>
                    <div class="info_title">关注用户指数:<span style="color:white;margin-left:10px">${info.hotScore}</span> </div>
                    <div class="info_title">占地面积:<span style="color:white;margin-left:10px">${info.useArea}</span> </div>
                    <div class="info_title">建筑面积:<span style="color:white;margin-left:10px">${info.buildArea}</span> </div>
                    <div class="info_title">物业类型:<span style="color:white;margin-left:10px">${info.type}</span> </div>
                    <div class="info_title">装修情况:<span style="color:white;margin-left:10px">${info.decorationType}</span> </div>
                    <div class="info_title">开发商:<span style="color:white;margin-left:10px">${info.developer}</span> </div>
                    <div class="info_title">产权年限:<span style="color:white;margin-left:10px">${info.rightYear}</span> </div>
                    <div class="info_title">绿化率:<span style="color:white;margin-left:10px">${info.greenRatio}</span> </div>
                    <div class="info_title">容积率:<span style="color:white;margin-left:10px">${info.plotRatio}</span> </div>
                    <div class="info_title">销售状态:<span style="color:white;margin-left:10px">${info.saleState}</span> </div>
                    <div style="color:#409EFF;cursor:pointer" id="moreBtn"> 查看更多 </div>
                    <div class="btn_box" style="display:flex;width:100%;align-item:center;justify-content: space-between;margin-top:10px">
                      <div id="jbtn" style="padding:6px 10px;cursor:pointer;background: linear-gradient(to right, #2a5298, #1e3c72);border-radius: 8px;">查看竞对项目</div>
                      <div id="kbtn" style="padding:6px 10px;cursor:pointer;background: #f4a261;border-radius: 8px;margin-left:10px">查看客户通路</div>
                    </div>
                  </div>
                </div>`
              this.popupClick.setLngLat(data.center.split(',')).setHTML(htmlInfo).addTo(this.situationMap);
              let jdom = document.getElementById('jbtn')
              let kbtn = document.getElementById('kbtn')
              let moreBtn = document.getElementById('moreBtn')
              jdom.onclick = ()=>{
                let params = {
                    ids:data.id,
                    identify:'out'
                  }
                situationApi.getCompetitor(params).then(res=>{
                  let data =res.data.data
                  if(data[0].vcoordinate){
                    let flyLineData = []
                    let raceData = []
                    this.showFlyline = true
                    this.showSinglePro = true
                    data.forEach(item=>{
                      if(item.vcoordinate){
                        flyLineData.push({
                          path:[[item.coordinate.split(',')[0]*1,item.coordinate.split(',')[1]*1,],[item.vcoordinate.split(',')[0]*1,item.vcoordinate.split(',')[1]*1,]],
                          timestamps:[0,1000]
                        })
                        raceData.push({coordinate:item.vcoordinate,name:item.vname})
                      }
                    })
                    this.moveOut = flyLineData
                    let center = this.situationMap.getCenter()
                    let zoom = this.situationMap.getZoom()
                    this.viewState = {
                        longitude: center.lng,
                        latitude: center.lat,
                        zoom: zoom,
                        bearing: 0,
                        pitch: 0,
                    }
                    this.animate()  
                    this.mapEvents()
                    this.popupClick.remove()
                    let geojsonData = {
                      type:'FeatureCollection',
                      features:[]
                    }
                    raceData.forEach(item=>{
                      if(item.coordinate){
                        let coordinate = item.coordinate.split(',')
                        geojsonData.features.push({
                          type:'Feature',
                          geometry:{
                            type:'Point',
                            coordinates:coordinate,
                          },
                          properties:{
                            name:item.name
                          }
                        })
                      }
                    })
                    this.situationMap.getSource('raceBuildings').setData(geojsonData)
                  }else{
                    this.$message({
                      type:'info',
                      message:'该项目无竞对项目'
                    })
                  }
                })
              }
              kbtn.onclick = () =>{
                let params = {
                    ids:data.id,
                    identify:'in'
                  }
                situationApi.getCompetitor(params).then(res=>{
                  let data =res.data.data
                  if(data[0].vcoordinate){
                    let flyLineData = []
                    let raceData = []
                    this.showFlyline = true
                    this.showSinglePro = true
                    data.forEach(item=>{
                      if(item.vcoordinate){
                        flyLineData.push({
                          path:[[item.vcoordinate.split(',')[0]*1,item.vcoordinate.split(',')[1]*1,],[item.coordinate.split(',')[0]*1,item.coordinate.split(',')[1]*1,]],
                          timestamps:[0,1000]
                        })
                        raceData.push({coordinate:item.vcoordinate,name:item.vname})
                      }
                    })
                    this.moveOut = flyLineData
                    let center = this.situationMap.getCenter()
                    let zoom = this.situationMap.getZoom()
                    this.viewState = {
                        longitude: center.lng,
                        latitude: center.lat,
                        zoom: zoom,
                        bearing: 0,
                        pitch: 0,
                    }
                    this.animate()  
                    this.mapEvents()
                    this.popupClick.remove()
                    let geojsonData = {
                      type:'FeatureCollection',
                      features:[]
                    }
                    raceData.forEach(item=>{
                      if(item.coordinate){
                        let coordinate = item.coordinate.split(',')
                        geojsonData.features.push({
                          type:'Feature',
                          geometry:{
                            type:'Point',
                            coordinates:coordinate
                          },
                          properties:{
                            name:item.name
                          }
                        })
                      }
                    })
                    this.situationMap.getSource('raceBuildings').setData(geojsonData)
                  }else{
                    this.$message({
                      type:'info',
                      message:'该项目无竞对项目'
                    })
                  }
                })
              }
              moreBtn.onclick = () => {
                this.proPoi = data.center.split(',')
                this.proId = data.id
                this.proTitle = data.name
                this.showProjectDetail = true
              }
            })
          })
          this.getBuilding(true)
        },
        immediate:true
      }
    },
    methods:{
      radioChange(){
        this.codes = []
      },
      closeDetail(){
        this.showProjectDetail = false
      },
      selectFocus(val){
        situationApi.getRangeList(val).then(res=>{
          this[val] = this.disposeRange(res.data.data[0].range)
        })
      },
      disposeRange(range){
        let arr = range.split(',')
        if(arr[0] !== 0) arr.unshift('0')
        arr.push('999999')
        let disposedArr = []
        arr.forEach((item,index)=>{
          if(index === 0){
            disposedArr.push({
              label:`${arr[index+1]}以下`,
              value:`${item}-${arr[index+1]}`
            })
          }else if(index === arr.length -1){

          }else if(index === arr.length -2){
             disposedArr.push({
              label:`${arr[index]}以上`,
              value:`${item}-${arr[index+1]}`
            })
          }else{
            disposedArr.push({
              label:`${item}-${arr[index+1]}`,
              value:`${item}-${arr[index+1]}`
            })
          }
        })
        return disposedArr
      },
      load(tree, treeNode, resolve) {
        console.log(tree.id)
        let params = {
            ids:tree.id,
            identify:this.buildIn?'out':'in'
          }
        situationApi.getCompetitor(params).then(res=>{
          console.log(res.data.data)
          let data= res.data.data
          let arr = []
          data.forEach(item=>{
            arr.push({
              id:item.vid + '12138',
              name:item.vname,
              coordinate:item.vcoordinate,
              hotScore:item.vscore,
            })
          })
          resolve(arr)
        })
      },
      animate() {
        this.timer =  setInterval(_=>{
            this.time += 3
            if(this.time>1200){
                this.time = 0
            }
            this.setlayers()
         },1)
          // requestAnimationFrame(this.animate)
        },
      mapEvents(){
          let map = this.situationMap
          map.on('zoom',e=>{
              let zoom = map.getZoom()
              let center = map.getCenter()
              this.viewState = {
                  longitude: center.lng,
                  latitude: center.lat,
                  zoom: zoom,
                  bearing: 0,
                  pitch: 0,
              }
          })
      },
      getColor(d){
          let color
          if(d.val<=50){
              color = [0,185,255,255]
          }else if(d.val>50&&d.val<=400){
              color = [101,241,255,255]
          }else if(d.val>400&&d.val<=900){
              color = [255,179,63,255]
          }else if(d.val>900){
              color = [191,0,32,255] //红色
          }
          return color
      },
      setlayers(){
            let arr = [
                new GreatCircleLayer({
                    id: 'tripLine',
                    data:this.moveOut,
                    pickable: true,
                    getWidth: 4,
                    getSourcePosition: d => d.path[0],
                    getTargetPosition: d => d.path[1],
                    getSourceColor: [255, 255, 255,50],
                    getTargetColor: [255, 255, 255,50]
                }),
                new TripsLayer({
                    id: 'moveOutLine',
                    data:this.moveOut,
                    getPath: d => d.path,
                    getTimestamps: d => d.timestamps,
                    getColor: [255,193,7,255],
                    opacity: 1,
                    widthMinPixels: 4,
                    rounded: true,
                    trailLength: 100,
                    currentTime: this.time,
                })
            ]
            return arr
      },
      updateViewState(viewState) {
          //console.log("updating view state...");
          this.viewState = {
              ...viewState
          }
          this.situationMap.jumpTo({
              center: [viewState.longitude, viewState.latitude],
              zoom: viewState.zoom,
              bearing: viewState.bearing,
              pitch: viewState.pitch,
          });
      },
      handleClick({ event, info }) {
          if(this.showSinglePro){
            this.showSinglePro = false,
            this.showFlyline = false
          }
      },
      rowClick(row){
        console.log(row)
      },
      buildOutChange(val){
        this.showFlyline = val
        if(val){
          this.buildIn = false
          this.showTable = false
          let idsArr = []
          let data = this.tableData
          data.forEach(item=>item.hasChildren = true)
          this.tableData = data
          console.log(data)
          data.forEach(item=>{
            idsArr.push(item.id)
          })
          setTimeout(_=>{
            this.showTable = true
          },1)
          let ids = idsArr.join(',')
          let params = {
            ids,
            identify:'out'
          }
          situationApi.getCompetitor(params).then(res=>{
            let data = res.data.data
            let flyLineData = []
            let raceData = []
            data.forEach(item=>{
              if(item.vcoordinate){
                flyLineData.push({
                  path:[[item.coordinate.split(',')[0]*1,item.coordinate.split(',')[1]*1,],[item.vcoordinate.split(',')[0]*1,item.vcoordinate.split(',')[1]*1,]],
                  timestamps:[0,1000]
                })
                raceData.push({coordinate:item.vcoordinate,name:item.vname})
              }
            })
            console.log(flyLineData)
            this.moveOut = flyLineData
            let center = this.situationMap.getCenter()
            let zoom = this.situationMap.getZoom()
            this.viewState = {
                longitude: center.lng,
                latitude: center.lat,
                zoom: zoom,
                bearing: 0,
                pitch: 0,
            }
            this.animate()  
            this.mapEvents()
            let geojsonData = {
              type:'FeatureCollection',
              features:[]
            }
            raceData.forEach(item=>{
              if(item.coordinate){
                let coordinate = item.coordinate.split(',')
                geojsonData.features.push({
                  type:'Feature',
                  geometry:{
                    type:'Point',
                    coordinates:coordinate
                  },
                  properties:{
                    name:item.name
                  }
                })
              }
            })
            this.situationMap.getSource('raceBuildings').setData(geojsonData)
          })
        }else{
          clearInterval(this.timer)
           let geojsonData = {
              type:'FeatureCollection',
              features:[]
            }
            this.situationMap.getSource('raceBuildings').setData(geojsonData)
            this.showTable = false
            let data = this.tableData
            data.forEach(item=>item.hasChildren = false)
            this.tableData = data
            setTimeout(_=>{
              this.showTable = true
            },1)
        }
      },
      buildInChange(val){
        this.showFlyline = val
        if(val){
          this.buildOut = false;
          this.showTable = false
          let idsArr = []
          let data = this.tableData
          data.forEach(item=>item.hasChildren = true)
          this.tableData = data
          data.forEach(item=>{
            idsArr.push(item.id)
          })
          setTimeout(_=>{
            this.showTable = true
          },1)
          let ids = idsArr.join(',')
          let params = {
            ids,
            identify:'in'
          }
          situationApi.getCompetitor(params).then(res=>{
              let data = res.data.data
              let flyLineData = []
              let raceData = []
              data.forEach(item=>{
                if(item.vcoordinate){
                  flyLineData.push({
                    path:[[item.vcoordinate.split(',')[0]*1,item.vcoordinate.split(',')[1]*1,],[item.coordinate.split(',')[0]*1,item.coordinate.split(',')[1]*1,]],
                    timestamps:[0,1000]
                  })
                  raceData.push({coordinate:item.vcoordinate,name:item.vname})
                }
              })
              this.moveOut = flyLineData
              let center = this.situationMap.getCenter()
              let zoom = this.situationMap.getZoom()
              this.viewState = {
                  longitude: center.lng,
                  latitude: center.lat,
                  zoom: zoom,
                  bearing: 0,
                  pitch: 0,
              }
              this.animate()  
              this.mapEvents()
              console.log(raceData)
              let geojsonData = {
                type:'FeatureCollection',
                features:[]
              }
              raceData.forEach(item=>{
                if(item.coordinate){
                  let coordinate = item.coordinate.split(',')
                  geojsonData.features.push({
                    type:'Feature',
                    geometry:{
                      type:'Point',
                      coordinates:coordinate
                    },
                    properties:{
                      name:item.name
                    }
                  })
                }
              })
              this.situationMap.getSource('raceBuildings').setData(geojsonData)
            })
          }else{
            clearInterval(this.timer)
            let geojsonData = {
                type:'FeatureCollection',
                features:[]
              }
             this.situationMap.getSource('raceBuildings').setData(geojsonData)
            this.showTable = false
            let data = this.tableData
            data.forEach(item=>item.hasChildren = false)
            this.tableData = data
            setTimeout(_=>{
              this.showTable = true
            },1)
          }
      },
      getBuilding(firstFlag=false){
        let params = {
          kind:this.radio,
          codes:this.codes.join(','),
          buildForms:this.buildForms.join(','),
          propertyTypes:this.propertyTypes.join(','),
          areaSizes:this.areaSizes.join(','),
          totalSizes:this.totalSizes.join(','),
          avgSizes:this.avgSizes.join(','),
          startDate:this.date[0]?this.date[0]:'',
          endDate:this.date[1]?this.date[1]:''
        }
        this.showLoading = true
         situationApi.getGoodsRangeList(params).then(res=>{
          this.showLoading = false
          let data = res.data.data[0].dateLists
          this.drawEcharts(res.data.data)
          data.forEach(item=>{
            item.hotScore = item.rate.toFixed(1)
          })
          this.tableData= data
          let geojsonData = {
            type:'FeatureCollection',
            features:[]
          }
          data.forEach(item=>{
              if(item.coordinate){
                let coordinate = item.coordinate.split(',')
                geojsonData.features.push({
                  type:'Feature',
                  geometry:{
                    type:'Point',
                    coordinates:coordinate
                  },
                  properties:{
                    id:item.id,
                    name:item.name,
                    hotScore:item.hotScore,
                    center:item.coordinate
                  }
                })
              }
            })
          this.situationMap.getSource('buildingsPoint').setData(geojsonData)
          let arr = ["match", ["get", "id"]]
          let colors =  ['#f07605', '#f27a11', '#f27e18', '#f58320', '#f58625', '#f7862a', '#f78b31', '#f78d36', '#fa913c', '#fa9441', '#fc9e4c', '#fc9e4c', '#fca253', '#ffa759', '#ffa95e', '#ffac63', '#ffb06b', '#ffb370', '#ffb875', '#ffbc7d', '#ffbe82', '#ffc48a', '#ffc78f', '#ffcb96', '#ffcf9c', '#ffd3a3', '#ffd7a8', '#ffdab0', '#ffdfb8', '#ffe2bd', '#ffe7c4', '#ffebcc']
          let max = data[0].hotScore
          let min = data[data.length - 1].hotScore 
          let diff = (max - min) / 32
          data.forEach((item,index)=>{
          arr.push(item.id)
          if(diff == 0){
              arr.push('#f07605')
            }else{
              let i = Math.floor( (max - item.hotScore) / diff)
              if(i > 31) i = 31
              arr.push(colors[i])
            }
          })
          arr.push('rgba(0,0,0,0)')
          this.situationMap.setPaintProperty('buildingsLayer',"circle-color", arr)
        })
      },
      clearBuilding(){
        this.building = []
      },
      drawEcharts(echartsData){
        console.log(echartsData)
        echartsData.reverse()
        let years = [];
        let jdData = [];
        let data = [];
        echartsData.forEach(item=>{
          years.push(item.date)
          jdData.push(item.dateLists.slice(0,20).map(item=>item.name))
          data.push(item.dateLists.slice(0,20).map(item=>item.rate.toFixed(2)))
        })
        console.log(jdData)
        console.log(data)
        // var years = ['2016','2017','2018'];
        // var jdData =[
        //     [ '香港同胞','澳门同胞','台湾同胞','日  本','韩  国','蒙  古','印度尼西亚','马来西亚','菲律宾','新加坡','泰  国','印  度','越  南','缅  甸','朝  鲜','巴基斯坦','其  它'],
        //     [ '香港同胞','澳门同胞','台湾同胞','日  本','韩  国','蒙  古','印度尼西亚','马来西亚','菲律宾','新加坡','泰  国','印  度','越  南','缅  甸','朝  鲜','巴基斯坦','其  它'],
        //     [ '香港同胞','澳门同胞','台湾同胞','日  本','韩  国','蒙  古','印度尼西亚','马来西亚','菲律宾','新加坡','泰  国','印  度','越  南','缅  甸','朝  鲜','巴基斯坦','其  它']]
        // var data =[
        //     [13.2,1.11,13.6,9284,64138,2237,4779,48877,2371,36224,12956,2499,4778,594,717,534,16487],
        //     [15.26,1.31,16.68,10331,91580,1909,40469,67490,1765,36982,15371,3643,2871,762,962,757,34414],
        //     [14.23,1.31,21.13,10873,94964,2966,129748,59827,8519,38344,18495,3531,1369,544,2005,975,33855,],
        // ];
       
        var option = {
                baseOption: {
                    timeline: {
                    data: years,
                    axisType: 'category',
                    autoPlay: true,
                    playInterval: 2000,
                    left: '3%',
                    right: '0%',
                    bottom: '2%',
                    width: '94%',
                    //  height: null,
                    label: {
                        normal: {
                            textStyle: {
                                color: '#ff8800',
                            }
                        },
                        emphasis: {
                            textStyle: {
                                color: '#fff'
                            }
                        }
                    },
                    symbolSize: 10,
                    lineStyle: {
                        color: '#555'
                    },
                    checkpointStyle: {
                        borderColor: '#777',
                        borderWidth: 2
                    },
                    controlStyle: {
                        showNextBtn: true,
                        showPrevBtn: true,
                        normal: {
                            color: '#ff8800',
                            borderColor: '#ff8800'
                        },
                        emphasis: {
                            color: '#aaa',
                            borderColor: '#aaa'
                        }
                    },

                },
                title: {
                    text: '',
                    right: '5%',
                    top: '10%',
                    textStyle: {
                        fontSize: 40,
                        color: 'white'
                    }
                  },
                  tooltip: {
                        'trigger': 'axis'
                    },
                  calculable: true,
                    grid: {
                        left: '4%',
                        right: '4%',
                        bottom: '26%',
                        top:'16%',
                        containLabel: true
                    },
                    label:{
                        normal:{
                            textStyle:{
                                color:'#fff'
                            }
                        }
                    },
                    xAxis: [{
                        offset: '37',
                        'type': 'category',
                        data: '',
                        nameTextStyle:{
                            color:'#fff'
                        },
                        axisLabel:{
                            rotate:20,
                            textStyle:{
                                fontSize:10,
                                color:'white',
                            },
                            interval: 0
                        },
                        axisLine:{
                           
                            lineStyle:{
                                color:'white'
                            },
                        },
                        splitLine:{
                            show:false,
                            lineStyle:{
                                color:'gray'
                            }
                        },

                    }],
                    yAxis: [{
                        'type': 'value',
                        'name': '',
                        splitNumber:8,
                        nameTextStyle:{
                            color:'white'
                        },
                        axisLine:{
                            lineStyle:{
                                color:'white'
                            }
                        },
                        axisLabel: {
                            formatter: '{value} '
                        },
                        splitLine:{
                            show:true,
                            lineStyle:{
                                color:'gray'
                            }
                        },
                    }],
                    series: [{
                        'name': '',
                        'type': 'bar',
                        markLine : {
                            label:{
                                normal:{
                                    show:false
                                }
                            },
                            lineStyle:{
                                normal:{
                                    color:'red',
                                    width:3
                                }
                            },
                        },
                        barWidth:'50%',
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                formatter: '{c}'
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: function(params) {
                                    // build a color map as your need.
                                    var colorList = [
                                        '#bcd3bb', '#e88f70', '#9dc5c8', '#e1e8c8',
                                        '#7b7c68', '#e5b5b5', '#f0b489', '#928ea8',
                                        '#bda29a', '#376956', '#c3bed4', '#495a80',
                                        '#9966cc', '#bdb76a', '#eee8ab', '#a35015',
                                        '#04dd98', '#d9b3e6', '#b6c3fc','#315dbc',
                                    ];
                                    return colorList[params.dataIndex]
                                },

                            }
                        },
                    }],
                    animationDurationUpdate: 1200,
                    animationEasingUpdate: 'quinticInOut'
                },
                options: []
            };
            for (var n = 0; n < years.length; n++) {
                var res = [];
                  for(let j=0;j<data[n].length;j++){
                        res.push({
                        name: jdData[n][j],
                        value: data[n][j]
                    });
                
                }
            res.sort(function(a, b) {
                    return a.value - b.value;
                }).slice(0, 6);

            res.sort(function(a, b) {
                return b.value - a.value;
            });
            var res1=[];
            var res2=[];
              for(let t=0;t<res.length;t++){
                  res1[t]=res[t].name;
                    res2[t]=res[t].value;
              }
              option.options.push({
                  title: {
                      text: years[n]
                  },
                  xAxis:{
                      data:res1,
                  },
                  series: [{
                      data: res2
                  }]
              });
            }  
            let myChart = this.$echarts.init(document.getElementById('goodsEcharts'))
            myChart.setOption(option,true);
        },
    },
    created(){
          this.tableHeight = window.innerHeight * 0.56
          situationApi.getDict('build_form_newhouse').then(res=>this.buildArr = res.data.data)
          situationApi.getDict('property_type_newhouse').then(res=>this.propertyArr = res.data.data)
          situationApi.getRegions().then(res=>{
            this.regionList = res.data.data.searchRst
          })
          situationApi.getParts().then(res=>{
            this.partList = res.data.data
          })
          situationApi.getDevloper().then(res=>{
            this.devloperList = res.data.data
          })
    },
    mounted(){
          // setTimeout(_=>{
        //   this.setLayer()
        //   this.partHotList()
        // },1000)
        // this.drawEcharts()
      },
    beforeDestroy(){
      this.popupClick.remove()
    }
  }
    
</script>

<style lang="scss" scoped>
.goodSituation_wrap{ 
    height: 100%;
    width: 100%;
    .diver{
        padding: 10px 20px;
        border-bottom: #464646 1px solid;
        font-size: 14px;
        color: #8bc34a;
        margin-bottom: 14px;
    }
    
    ::v-deep .is-active{
      color:#C0C4CC!important;
    }
    ::v-deep .el-switch__label{
      
      color:#fcbf49;
    }
    ::v-deep .el-radio{
        color:white;
        white-space: nowrap;
    }
    ::v-deep .el-form-item__label{
        color:#fcbf49;
        font-weight: 700;
    }
    ::v-deep .el-radio__input.is-checked+.el-radio__label{
        color:rgba(255, 193, 7, 1)
    }
   .from_box{
      margin-top:20px;
      margin-left:5%;
      width: 90%;
      .el-form-item{
        width:100%;
        margin-right: 14px;
        ::v-deep .el-radio__input.is-checked+.el-radio__label{
          color:rgba(255, 193, 7, 1)
        }
        ::v-deep .el-radio{
          color:white;
        }
        ::v-deep .el-date-editor--daterange{
            width: 226px!important;
        }
        // ::v-deep .el-date-editor{
        // //   max-width: 212px!important;
        // }
        ::v-deep .el-form-item__content{
            width:90%;
        }
        ::v-deep .el-range-input{
          background: transparent;
          color: #fcbf49;
          width: 75px;
        }
        ::v-deep .el-form-item__label{
          color:#fcbf49;
          font-weight: 700;
        }
        ::v-deep .el-input__inner{
          padding-right:30px;
          background: transparent;
          color: #fcbf49;
          font-weight: 700;
          padding-left: 15px;
        }
        ::v-deep .el-select{
          width: 100%;
        }
        ::v-deep .el-select__tags{
          max-width: 180px!important;
          white-space: nowrap!important;
          display: flex!important;
        }
        ::v-deep .el-tag{
          background:  #4B79A1;
          color:white;
        }
        ::v-deep .el-input__prefix{
          display: none;
        }
        .submit_btn{
              color:white;
              font-size:13px;
              height:36px;
              width:214px;
              display: flex;
              justify-content: center;
              align-items: center;
              background: #1e3c72;  /* fallback for old browsers */
              background: -webkit-linear-gradient(to right, #2a5298, #1e3c72);  /* Chrome 10-25, Safari 5.1-6 */
              background: linear-gradient(to right, #2a5298, #1e3c72); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
              border-radius: 8px;
              user-select: none;
              cursor: pointer;
              // margin-left:110px;
              margin-top:10px;
              &:active{
                  opacity: 0.7;
              }
        }
      }
    }
  .ranking_list{
      height: 58%;
      width: 14%;
      border-radius: 8px;
      position: fixed;
      z-index: 10;
      top:6%;
      right:calc(5% - 19px);
      background: rgba(47,62,70,.8);
      ::v-deep .el-table__body-wrapper{
        &::-webkit-scrollbar{
        background-color: #212e3e !important;
        opacity: 1!important;
        height:10px;
        width: 0px;
      }
      &::-webkit-scrollbar-thumb {
          border-radius: 10px;
          background-color: #02adf7;
          background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);
      }
    }
    ::v-deep .el-table__expand-icon{
      color:white;
    }
     ::v-deep .el-table__row{
      background: transparent;
    }
    ::v-deep .el-table tr{
      background-color: transparent!important;
    }
    ::v-deep .el-table th{
      background-color: transparent!important;
    }
    ::v-deep .el-table__row>td{
      border: none;
    }
    ::v-deep .el-table::before {
      height: 0px;
    }
    ::v-deep .is-leaf{
      color:white;
    }
    ::v-deep .el-table--enable-row-hover .el-table__body tr:hover>td{
      background-color: #212e3e !important;
    }
  }
  .echarts_mask{
        position: fixed;
        bottom:5%;
        left:calc(5%  + 361px);
        width:calc(90% - 342px);
        height:26%;
        background: rgba(47,62,70,.8);
        border-radius: 8px;
        transition: all 1.5s ease;
      #goodsEcharts{
          position: absolute;
          height:100%;
          width:96%;
          left:2.5%;
      }
      .container{
            position: absolute;
            bottom: 30%;
            left: -6%;
            cursor: pointer;
            width:80px;
            height:80px;
            transform: rotate(270deg);
            transition: all 1.5s ease;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            pointer-events: auto;
        }
        .container_active{
            transform: rotate(90deg);
            transition: all 1.5s ease;
        }
        .chevron {
            position: absolute;
            top:12px;
            width: 28px;
            height: 8px;
            opacity: 0;
            transform: scale3d(0.5, 0.5, 0.5);
            animation: move 3s ease-out infinite;
            cursor: pointer;
        }
        .chevron:first-child {
            animation: move 3s ease-out 1s infinite;
        }
        .chevron:nth-child(2) {
            animation: move 3s ease-out 2s infinite;
        }
        .chevron:before,
        .chevron:after {
            content: ' ';
            position: absolute;
            top: 0;
            height: 100%;
            width: 51%;
            background: #fff;
        }
        .chevron:before {
            left: 0;
            transform: skew(0deg, 30deg);
        }
        .chevron:after {
            right: 0;
            width: 50%;
            transform: skew(0deg, -30deg);
        }
        @keyframes move {
            25% {
                opacity: 1;
            }
            33% {
                opacity: 1;
                transform: translateY(30px);
            }
            67% {
                opacity: 1;
                transform: translateY(40px);
            }
            100% {
                opacity: 0;
                transform: translateY(55px) scale3d(0.5, 0.5, 0.5);
            }
        }
  }
  .echarts_mask_active{
      left:calc(100%);
      transition: all 1.5s ease;
  }
}
</style>