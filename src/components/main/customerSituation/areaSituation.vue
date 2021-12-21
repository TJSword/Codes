<template>
  <div class="areaSituation_wrap">
     <div class="diver">
        <span>查询条件</span>
        <i class="iconfont icon-set_icon" @click="showSettingHandle"></i>
      </div>
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
            <el-select v-model="codes" placeholder="请选择板块"  style="margin-top:6px" multiple :collapse-tags="true" clearable>
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
            <el-button style="width:100%"  @click="getViewList" type="primary">点击查询</el-button>
            </el-form-item>
        </el-form>
    </div>
     <dv-border-box-12 class="ranking_list">
          <el-table 
          :data="tableData"
          style="width: 96%;margin-left:2%;margin-top:1%;background: transparent;color:white"
          :height="tableHeight"
        
          >
          <el-table-column
            prop="region"
            label="行政区"
            align="center" 
            v-if="kind === 'region'">
          </el-table-column>
          <el-table-column
            prop="partname"
            label="板块"
            align="center"
            v-if="kind === 'part'">
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
          <div id="charts"></div>
        </dv-border-box-12>
        <PieceWise ref="setting" />
        <Loading v-if="showLoading" />
        <AreaInfo v-if="showAreaInfo" :form="form" :center="centerPoi" />
  </div>
</template>

<script>
import situationApi from "../../../api/situationApi.js"
import { mapGetters } from "vuex" 
import PieceWise from "../houseData/Piecewise.vue"
import AreaInfo from "./areaInfo.vue"
import Loading from "@/components/tools/loading.vue"
export default {
     computed:{
      ...mapGetters(['situationMap'])
    },
    components:{
      PieceWise,AreaInfo,Loading
    },
    data(){
        return{
          radio:'region',
          value:'',
          areaSize:[],
          part:[],
          region:[],
          isShowEcharts:false,
          formInline:{
              
          },
          kind:'region',
          regionHandler:null,
          partHandler:null,
          codes:[],
          tableData:[],
          tableHeight:600,
          showLoading:false,
          partList:[],
          regionList:[],
          avg_size:[],
          area_size:[],
          total_size:[],
          avgSizes:[],
          totalSizes:[],
          areaSizes:[],
          date:[],
          buildForms:[],
          propertyTypes:[],
          buildArr:[],
          propertyArr:[],
          pickerTime: {
            disabledDate(time) {
                return time.getTime() <= new Date('2021-11-24').getTime() || time.getTime() > new Date().getTime();
            },
          },
          showAreaInfo:false,
          form:{
            kind:'',code:''
          }
        }
    },
    watch:{
      situationMap(val){
     
      },
      
    },
    methods:{
      radioChange(val){
        this.codes = []
        console.log(val)
      },
      closeDetail(){
        this.showAreaInfo = false
      },
      getViewList(){
        console.log(this.date)
        let params = {
          kind:this.radio,
          codes:this.codes.join(','),
          buildForms:this.buildForms.join(','),
          propertyTypes:this.propertyTypes.join(','),
          areaSizes:this.areaSizes.join(','),
          totalSizes:this.totalSizes.join(','),
          avgSizes:this.avgSizes.join(','),
          startDate:(this.date && this.date[0])?this.date[0]:'',
          endDate:(this.date && this.date[0])?this.date[1]:''
        }
        this.showLoading = true
        if(this.radio === 'region'){
          this.situationMap.setLayoutProperty('plates_fill','visibility','none')
          this.situationMap.setLayoutProperty('plates_line','visibility','none')
          this.situationMap.setLayoutProperty('plates_labels','visibility','none')
          this.situationMap.setLayoutProperty('plate_fill','visibility','visible')
          this.situationMap.setLayoutProperty('plate_line','visibility','visible')
          this.situationMap.setLayoutProperty('plate_labels','visibility','visible')
        }else if(this.radio === 'part'){
          this.situationMap.setLayoutProperty('plates_fill','visibility','visible')
          this.situationMap.setLayoutProperty('plates_line','visibility','visible')
          this.situationMap.setLayoutProperty('plates_labels','visibility','visible')
          this.situationMap.setLayoutProperty('plate_fill','visibility','none')
          this.situationMap.setLayoutProperty('plate_line','visibility','none')
          this.situationMap.setLayoutProperty('plate_labels','visibility','none')
        }
        let kind = this.radio
        this.kind = kind
        situationApi.getAreaRangeList(params).then(res=>{
          this.showLoading = false
          let data = res.data.data
          if(data.length === 0){
            this.hotList([],kind)
            this.drawEcharts([],kind)
            this.$message({type:'info', message:'暂无数据'})
            return;
          }
          this.kind = kind
          this.tableData = res.data.data[0].dateLists
          this.hotList(res.data.data[0].dateLists,kind)
          this.drawEcharts(res.data.data,kind)
        })
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
      showSettingHandle(){
       this.$refs.setting.dialogVisible = true
      },
      //板块选择
      partChange(){
        // this.partHotList(this.part.join(','),this.areaSize.join(','))
      },
      hotList(data,kind){
        // let data = res.data.data
        if(data.length === 0){
           this.situationMap.setPaintProperty('plate_fill',"fill-color", 'rgba(0,0,0,0)')
           return
        }
        data.forEach(item=>item.hotScore = item.rate.toFixed(2))
        if(data.length === 0){
          this.situationMap.setPaintProperty('plates_fill',"fill-color", 'rgba(0,0,0,0)')
          return
        }
        let arr = ["match", ["get", "id"]]
        let colors =  ['#f07605', '#f27a11', '#f27e18', '#f58320', '#f58625', '#f7862a', '#f78b31', '#f78d36', '#fa913c', '#fa9441', '#fc9e4c', '#fc9e4c', '#fca253', '#ffa759', '#ffa95e', '#ffac63', '#ffb06b', '#ffb370', '#ffb875', '#ffbc7d', '#ffbe82', '#ffc48a', '#ffc78f', '#ffcb96', '#ffcf9c', '#ffd3a3', '#ffd7a8', '#ffdab0', '#ffdfb8', '#ffe2bd', '#ffe7c4', '#ffebcc']
        //let colors = ['#F50000','#F50400','#F50C00','#F51400','#F51D00','#F52500','#F52D00','#F53500','#F53D00','#F54500','#F54E00','#F55600','#F55E00','#F56600','#F56E00','#F57600','#F57A00','#F58300','#F58B00','#F59300','#F59B00','#F5A300','#F5AB00','#F5B400','#F5BC00','#F5C400','#F5CC00','#F5D400','#F5DC00','#F5E400','#F5ED00','#F5F500']
        let max = data[0].hotScore
        let min = data[data.length - 1].hotScore 
        let diff = (max - min) / 32
        if(kind === 'region'){
          data.forEach(item=>{
            arr.push(item.regionno)
            if(diff == 0){
              arr.push('#f07605')
            }else{
              let i = Math.floor( (max - item.hotScore) / diff)
              if(i > 31) i = 31
              arr.push(colors[i])
            }
          })
          arr.push('rgba(0,0,0,0)')
          console.log(arr)
          //it's ugly but useful
          setTimeout(_=>{
              this.situationMap.setPaintProperty('plate_fill',"fill-color", arr)
          },600)
        }else if(kind === 'part'){
           data.forEach(item=>{
            arr.push(item.partno)
            if(diff == 0){
              arr.push('#f07605')
            }else{
              let i = Math.floor( (max - item.hotScore) / diff)
              if(i > 31) i = 31
              arr.push(colors[i])
            }
          })
          arr.push('rgba(0,0,0,0)')
          console.log(arr)
          //it's ugly but useful
          setTimeout(_=>{
              this.situationMap.setPaintProperty('plates_fill',"fill-color", arr)
          },600)
        }
        
      },
      //添加板块 行政区图层
      setLayer(){
        let map = this.situationMap
          var code = '510100'
          var cityPolygonLayer = this.geoserverURL+'/geoserver/gwc/service/tms/1.0.0/city_100000:city_polygon@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf'
          let partDataSouce = map.getSource("part_data")
          if(partDataSouce === undefined){
              map.addSource("part_data", {
                type: "vector",
                  scheme: "tms",
                  tiles: [cityPolygonLayer]
              });
              map.addLayer({ //通用板块-填充
                id: "plate_fill",
                type: "fill",
                source: "part_data",
                "source-layer": "city_polygon",
                paint: {
                  "fill-color": "#fcbf49",
                  "fill-opacity": 0.45
                  // ["case",
                  //   ["boolean", ["feature-state", "hover"], false],
                  //   0.1,
                  //   0.2
                  // ]
                },
                layout: {
                  "visibility": "visible"
                }
              });
              map.addLayer({  //通用板块-描边
                id: "plate_line",
                type: "line",
                source: "part_data",
                "source-layer": "city_polygon",
                layout: {
                  "visibility": "visible"
                },
                paint: {
                  "line-color":"#fcbf49",
                  "line-width": 
                  ["case",
                    ["boolean", ["feature-state", "hover"], false],
                    2.5,
                    1
                  ],
                  "line-opacity": 0.2,
                  //"line-dasharray": [4,4]
                }
              });
              map.addLayer({ //文字symbol
                id: "plate_labels",
                type: "symbol",
                source: "part_data",
                "source-layer": "city_polygon",
                layout: {
                  "text-field": ["get", "name"],
                  "text-allow-overlap": false,
                  "text-size": 10,
                  "visibility":"visible"
                },
                paint:{
                  "text-opacity":1,
                  "text-color": "#11b4da",
                  "text-halo-color": "rgba(0,0,0,0.8)",
                  "text-halo-width": 1.5,
                  "text-halo-blur": 0.5
                }
              });
              let filter = [
                'all',
                ["==", "tree_level", 3],
                ["==","pid",JSON.parse(code)]
              ]
              map.setFilter("plate_fill",filter)
              map.setFilter("plate_line",filter)
              map.setFilter("plate_labels",filter)
          }
          let source = map.getSource('region_data')
          if(source===undefined){
                var code = this.cityCode?this.cityCode:'510100'
                var cityPlatesLayer = this.geoserverURL+'/geoserver/gwc/service/tms/1.0.0/touziyun:tzy_city_plates@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf'
                map.addSource('region_data',{
                    type: "vector",
                    scheme: "tms",
                    tiles: [cityPlatesLayer]
                })
                map.addLayer({ //通用板块-填充
                    id: "plates_fill",
                    type: "fill",
                    source: "region_data",
                    "source-layer":"tzy_city_plates",
                    filter:["==","land_cityno",code],
                    paint: {
                        "fill-color": "#fcbf49",
                        "fill-opacity": 0.45
                    },
                    layout: {
                        "visibility":"none"
                    }
                });
                map.addLayer({  //通用板块-描边
                    id: "plates_line",
                    type: "line",
                    source: "region_data",
                    "source-layer":"tzy_city_plates",
                    filter:["==","land_cityno",code],
                    paint: {
                        "line-color":'#fcbf49',
                        "line-width":1,
                        "line-opacity": 0.1
                    },
                    layout: {
                        "visibility":"none"
                    }
                });
                map.addLayer({ //文字symbol
                    id: "plates_labels",
                    type: "symbol",
                    source: "region_data",
                    "source-layer":"tzy_city_plates",
                    filter:["==","land_cityno",code],
                    layout: {
                        "text-field": ["get", "name"],
                        "text-allow-overlap": false,
                        "text-size": 10,
                        "visibility":"none"
                    },
                    paint:{
                        "text-opacity":1,
                        "text-color": '#11b4da',
                        "text-halo-color": "rgba(0,0,0,0.8)",
                        "text-halo-width": 1.5,
                        "text-halo-blur": 0.5
                    }
                });
                
          
          }
          this.popupClick = new this.mbgl.Popup({
              offset:15,
              anchor:'left',
              closeButton:true,
              closeOnClick:false
          })
          this.partHandler = (e)=>{
        //          if (e.originalEvent.cancelBubble) {
        //             return;
        //           }
                  let id = e.features[0].properties.id
                  let center = e.features[0].properties.center.split(',')
                  let name = e.features[0].properties.name
                  let params = {kind:'part',code:id}
                  this.showLoading = true
                  situationApi.getHotDetail(params).then(res=>{ 
                    this.showLoading = false
                    let data = res.data.data
                    // let build = data.build_list
                    let areaLists = data.areaLists.slice(0,3)
                    let areaInfo = '';
                    areaLists.forEach(item=>{
                      areaInfo += ` <div class="item">
                          <div class="item_label">${item.area_size}</div>
                          <div class="item_value">${item.rate.toFixed(2)}</div>
                        </div>`
                    })
                    let avgLists = data.avgLists.slice(0,3)
                    let avgInfo = ''
                    avgLists.forEach(item=>{
                      avgInfo += `<div class="item">
                                  <div class="item_label">${item.avg_size}</div>
                                  <div class="item_value">${item.rate.toFixed(2)}</div>
                                </div>`
                    })
                    let totalLists = data.totalLists.slice(0,3)
                    let totalInfo = ''
                    totalLists.forEach(item=>{
                      totalInfo += `<div class="item">
                                  <div class="item_label">${item.total_size}</div>
                                  <div class="item_value">${item.rate.toFixed(2)}</div>
                                </div>`
                    })
                    var htmlInfo = `<div class="house_infoWrap">
                        <div class="info_content">
                          <div class="info_head"><span style="font-weight:700">${name}</span> 潜在客群画像描摹</div>
                          <div class="info_title">关注用户指数</div>
                          <div class="info" style="font-size:24px;width:100%;text-align:center;font-weight:700">${data.dateLists[0].rate}</div>
                          <div class="info_title">面积段关注度TOP3</div>
                          <div class="table_box">
                            <div class="content_box">
                                ${areaInfo?areaInfo:'暂无'}
                            </div>
                          </div>
                          <div class="info_title">单价段关注度TOP3</div>
                          <div class="table_box">
                            <div class="content_box">
                                ${avgInfo?avgInfo:'暂无'}
                            </div>
                            </div>
                          <div class="info_title">总价段关注度TOP3</div>
                          <div class="table_box">
                            <div class="content_box">
                                ${totalInfo?totalInfo:'暂无'}
                            </div>
                          </div>
                          <div id="more_btn" style="color:#409EFF;cursor:pointer">查看更多</div >
                        </div>
                      </div>`
                    this.popupClick.setLngLat(center).setHTML(htmlInfo).addTo(this.situationMap);
                    let btn = document.getElementById('more_btn')
                    btn.onclick=()=>{
                      this.form = {kind:'part',code:id,name}
                      this.centerPoi = center
                      this.showAreaInfo = true
                    }
                  })
                }
            map.on('click','plates_fill',this.partHandler)
          this.regionHandler = (e)=>{
            let id = e.features[0].properties.id
            let center = e.lngLat
            let name = e.features[0].properties.name
            let params = {kind:'region',code:id}
            this.showLoading = true
            situationApi.getHotDetail(params).then(res=>{
               this.showLoading = false
              let data = res.data.data
              // let build = data.build_list
              let areaLists = data.areaLists.slice(0,3)
              let areaInfo = '';
              areaLists.forEach(item=>{
                areaInfo += ` <div class="item">
                    <div class="item_label">${item.area_size}</div>
                    <div class="item_value">${item.rate.toFixed(2)}</div>
                  </div>`
              })
              let avgLists = data.avgLists.slice(0,3)
              let avgInfo = ''
              avgLists.forEach(item=>{
                avgInfo += `<div class="item">
                            <div class="item_label">${item.avg_size}</div>
                            <div class="item_value">${item.rate.toFixed(2)}</div>
                          </div>`
              })
              let totalLists = data.totalLists.slice(0,3)
              let totalInfo = ''
              totalLists.forEach(item=>{
                totalInfo += `<div class="item">
                            <div class="item_label">${item.total_size}</div>
                            <div class="item_value">${item.rate.toFixed(2)}</div>
                          </div>`
              })
              var htmlInfo = `<div class="house_infoWrap">
                  <div class="info_content">
                    <div class="info_head"><span style="font-weight:700">${name}</span> 潜在客群画像描摹</div>
                    <div class="info_title">关注用户指数</div>
                    <div class="info" style="font-size:24px;width:100%;text-align:center;font-weight:700">${data.dateLists[0].rate}</div>
                    <div class="info_title">面积段关注度TOP3</div>
                    <div class="table_box">
                      <div class="content_box">
                          ${areaInfo?areaInfo:'暂无'}
                      </div>
                    </div>
                    <div class="info_title">单价段关注度TOP3</div>
                    <div class="table_box">
                      <div class="content_box">
                          ${avgInfo?avgInfo:'暂无'}
                      </div>
                      </div>
                    <div class="info_title">总价段关注度TOP3</div>
                    <div class="table_box">
                       <div class="content_box">
                          ${totalInfo?totalInfo:'暂无'}
                       </div>
                    </div>
                    <div id="more_btn" style="color:#409EFF;cursor:pointer">查看更多</div >
                  </div>
                </div>`
              this.popupClick.setLngLat(center).setHTML(htmlInfo).addTo(this.situationMap);
              let btn = document.getElementById('more_btn')
              btn.onclick=()=>{
                this.form = {kind:'region',code:id,name}
                this.centerPoi = center
                this.showAreaInfo = true
              }
            })
          }
          map.on('click','plate_fill',this.regionHandler) 
      },
      drawEcharts(echartsData,kind){
        echartsData.reverse()
        let years = [];
        let jdData = [];
        let data = [];
        echartsData.forEach(item=>{
          years.push(item.date)
          jdData.push(item.dateLists.slice(0,20).map(item=>kind === 'region'?item.region:item.partname))
          data.push(item.dateLists.slice(0,20).map(item=>item.rate.toFixed(2)))
        })
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
                    playInterval: 1500,
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
                            //rotate:45,
                            textStyle:{
                                fontSize:12,
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
                                color:'white',
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
            let myChart = this.$echarts.init(document.getElementById('charts'))
            myChart.setOption(option,true);
      },
        // rowClick(row){
        //   this.situationMap.flyTo({
        //     center:row.center.split(','),
        //     zoom: 12.5,
        //     speed: 0.6,
        //   })
        //   let id = row.partno
        //   let center = row.center.split(',')
        //   let name = row.partname
        //    situationApi.getHotDetail(id).then(res=>{
        //       let data = res.data.data
        //       let build = data.build_list
        //       let areaInfo = ''
        //       build.forEach(item=>{
        //         areaInfo += ` <div class="item">
        //             <div class="item_label">${item.building_name}</div>
        //             <div class="item_value">${item.hot_score}</div>
        //           </div>`
        //       })
              
        //       let areaSize = data.area_size
        //       let areaSizeInfo = ''
        //       if(areaSize[0] == '') areaSize = []
        //       areaSize.forEach(item=>{
        //         areaSizeInfo += `<div class="item">
        //                     <div class="item_label" style="width:100%">${item}㎡</div>
        //                   </div>`
        //       })
        //       var htmlInfo = `<div class="house_infoWrap">
        //           <div class="info_content">
        //           <div class="info_head">${name} 潜在客群画像描摹</div>
        //            <div class="info_title">关注用户指数</div>
        //             <div class="info" style="font-size:24px;width:100%;text-align:center;font-weight:700">${data.hot_score}</div>
        //             <div class="info_title">关注度TOP3的面积段</div>
        //             <div class="table_box">
        //                <div class="content_box">
        //                   ${areaSizeInfo?areaSizeInfo:'暂无'}
        //                </div>
        //             </div>
        //             <div class="info_title">关注度TOP3的楼盘</div>
        //             <div class="table_box">
        //                <div class="content_box">
        //                ${areaInfo?`<div class="item">
        //                     <div class="item_label">楼盘名称</div>
        //                     <div class="item_value">关注用户指数</div>
        //                   </div>`:''}
        //                  ${areaInfo?areaInfo:'暂无'}
        //                </div>
        //             </div>
        //           </div>
        //         </div>`
        //       this.popupClick.setLngLat(center).setHTML(htmlInfo).addTo(this.situationMap);
        //       let poiArr = []
        //       build.forEach((item,index)=>{
        //         poiArr.push({coordinate:item.coordinate.split(','),size:3-index,id:item.id,name:item.building_name})
        //       })
        //       console.log(poiArr)
        //       let geojsonData = {
        //         type:'FeatureCollection',
        //         features:[]
        //       }
        //       poiArr.forEach(item=>{
        //         if(item.coordinate){
        //           let coordinate = item.coordinate
        //           geojsonData.features.push({
        //             type:'Feature',
        //             geometry:{
        //               type:'Point',
        //               coordinates:coordinate
        //             },
        //             properties:{
        //               id:item.id,
        //               name:item.name,
        //               size:item.size,
        //               cemter:item.coordinate.join(',')
        //             }
        //           })
        //         }
        //       })
        //       this.situationMap.getSource('buildingPoint').setData(geojsonData)
        //       let arr = ["match", ["get", "size"],3,10,2,8,1,6,6]
        //       this.situationMap.setPaintProperty('buildingLayer',"circle-radius", arr)
        //     })
        // }
    },
    created(){
      this.tableHeight = window.innerHeight * 0.58
      situationApi.getDict('build_form_newhouse').then(res=>this.buildArr = res.data.data)
      situationApi.getDict('property_type_newhouse').then(res=>this.propertyArr = res.data.data)
      situationApi.getRegions().then(res=>{
        this.regionList = res.data.data.searchRst
      })
      
    },
    beforeDestroy(){
      this.situationMap.off('click','plate_fill',this.regionHandler)
      this.situationMap.off('click','plates_fill',this.partHandler)
      console.log(this.popupClick)
      this.popupClick.remove()
    },
    mounted(){
     setTimeout(_=>{
        this.setLayer()
        this.situationMap.flyTo({
            center:[103.7157969744969,30.46129397743849],
            zoom: 8.64,
            speed: 0.6,
          })
        situationApi.getParts().then(res=>{
          this.partList = res.data.data
        })
        this.getViewList()
        
      },1000)
    }
}
</script>

<style lang="scss" scoped>
.areaSituation_wrap{
    height: 100%;
    width: 100%;
    .diver{
        padding: 6px 20px;
        border-bottom: #464646 1px solid;
        font-size: 14px;
        color: #8bc34a;
        display: flex;
        align-items: center;
        width: 215px;
        justify-content: space-between;
        .icon-set_icon{
            color:white;
            font-size: 18px;
            cursor: pointer;
        }
    }
   .from_box{
      margin-top:20px;
      margin-left:5%;
      width: 90%;
      .el-form-item{
        width:100%;
        margin-top:4px;
        ::v-deep .el-radio__input.is-checked+.el-radio__label{
          color:rgba(255, 193, 7, 1)
        }
        ::v-deep .el-radio{
          color:white;
        }
        ::v-deep .el-form-item__label{
          color:#fcbf49;
          font-weight: 700;
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
        .sub_btn{
          color:white;
          font-size:13px;
          height:34px;
          width:92px;
          text-align: center;
          line-height: 34px;
          background: -webkit-linear-gradient(to right, #2a5298, #1e3c72);  /* Chrome 10-25, Safari 5.1-6 */
          background: linear-gradient(to right, #2a5298, #1e3c72); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
          border-radius: 4px;
          user-select: none;
          cursor: pointer;
          margin-left: 120px;
          &:active{
              opacity: 0.7;
          }
        }
      }
    }
   .ranking_list{
      height: 60%;
      width: 12%;
      border-radius: 8px;
      position: fixed;
      z-index: 10;
      top:6%;
      right:5%;
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
      #charts{
          position: absolute;
          height:100%;
          width:96%;
          left:2.5%;
      }
  }
  .echarts_mask_active{
      left:calc(100%);
      transition: all 1.5s ease;
  }
}
</style>