<template>
    <div class="qhStatistics_wrap">
      <div class="from_box">
        <el-form :inline="true" :model="formInline" size="small" style="text-align: start;">
           <el-form-item label="">
              <el-radio v-model="radio" label="1">项目排行</el-radio>
              <el-radio v-model="radio" label="2">企业排行</el-radio>
           </el-form-item>
          <el-form-item label="">
            <el-select v-model="formInline.status" placeholder="数据口径" clearable :collapse-tags="true">
                <el-option :label="item.label" :value="item.value" v-for="item in statusArr" :key="item.value"></el-option>
            </el-select>
           </el-form-item>
          <el-form-item label="">
              <el-select v-model="formInline.kind" placeholder="区域类型" clearable @change="kindChange">
                <el-option :label="item.label" :value="item.value" v-for="item in regionArr" :key="item.value"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="">
              <el-select v-model="codes" placeholder="选择区域" clearable multiple :collapse-tags="true">
                <el-checkbox style="margin-left:20px;margin-top:6px;" :indeterminate="isAllRegionnos" v-model="regionnosAll" @change="regionsAllChange">全选</el-checkbox>
                <el-option :label="item.name" :value="item.id" v-for="item in areaData" :key="item.value"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select  v-model="propertyType"  placeholder="物业类型" clearable multiple :collapse-tags="true">
               <el-option :label="item.label" :value="item.value" v-for="item in propertyArr" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
              <el-select  v-model="buildForm" placeholder="建筑形态" clearable multiple :collapse-tags="true">
                 <el-option :label="item.label" :value="item.value" v-for="item in buildArr" :key="item.value"></el-option>
              </el-select>
          </el-form-item>
         <!-- <el-form-item label="">
              <el-select  v-model="avgSizes" placeholder="单价段" clearable multiple :collapse-tags="true" @focus="selectFocus('avg_size')">
                <el-checkbox style="margin-left:20px;margin-top:6px;" :indeterminate="isAllAvgSizes" v-model="avgSizesAll" @change="avgSizesAllChange">全选</el-checkbox>
                 <el-option :label="item.label" :value="item.value" v-for="item in avg_size" :key="item.value"></el-option>
              </el-select>
          </el-form-item> -->
          <el-form-item label="">
              <el-select  v-model="areaSizes" placeholder="面积段" clearable multiple :collapse-tags="true" @focus="selectFocus('area_size')">
                <el-checkbox style="margin-left:20px;margin-top:6px;" :indeterminate="isAllAreaSizes" v-model="areaSizesAll" @change="areaSizesAllChange">全选</el-checkbox>
                <el-option :label="item.label" :value="item.value" v-for="item in area_size" :key="item.value"></el-option>
              </el-select>
          </el-form-item>
          <!-- <el-form-item label="">
              <el-select  v-model="totalSizes" placeholder="总价段" clearable multiple :collapse-tags="true" @focus="selectFocus('total_size')">
                 <el-option :label="item.label" :value="item.value" v-for="item in total_size" :key="item.value"></el-option>
              </el-select>
          </el-form-item> -->
           <el-form-item label="">
              <el-date-picker
                  v-model="date"
                  type="monthrange"
                  range-separator="-"
                  start-placeholder="开始月份"
                  end-placeholder="结束月份"
                  value-format="yyyy-MM-dd"
                  >
              </el-date-picker>
            </el-form-item>
            <el-form-item style="width:100%">
                <el-button style="width:220px"  @click="getViewList" type="primary">点击查询</el-button>
            </el-form-item>
            <el-form-item style="width:220px;display:flex;justify-content:flex-start;margin-top:6px;">
                <span style="color:white;margin-right:20px;flex:1">显示地图</span>
                <el-switch
                      v-model="showMap"
                      active-color="#fcbf49"
                     >
                  </el-switch>
                  <span style="color:white;margin-left:20px;flex:1">显示图表</span>
              </el-form-item>
            </el-form>
        </div>
         <div :class="['list_mask',showMap?'list_mask_hide':'']">
            <div :class="['list_wrap',showRegionDetail?'list_wrap_hide':'']">
              <div class="instructions"> * 点击区域可查看区域详情</div>
              <el-table 
              :data="tableData"
              style="width: 94%;margin-left:3%;margin-top:2%;background: transparent;color:white"
              :height="tableHeight"
              :cell-style="cellStyle"
              @cell-click="cellClick"
              >
            <el-table-column
              prop="name"
              label="项目名称"
              align="center"
              v-if="chooseRadio==='1'">
              <template slot-scope="scope">
                  <el-popover
                      placement="right-end"
                      width="250"
                      trigger="click"
                      offset="40"
                      v-model="scope.row.showPopover"
                      popper-class="buildInfo_wrap">
                      <div style="padding:0 10px">
                        <p>城区：<span style="color:#fcbf49">{{buildInfo.region}}</span></p>
                        <p>板块：<span style="color:#fcbf49">{{buildInfo.partname}}</span></p>
                        <p>占地面积：<span style="color:#fcbf49">{{buildInfo.useArea}}</span></p>
                        <p>总建面积：<span style="color:#fcbf49">{{buildInfo.buildArea}}</span></p>
                        <p>容积率：<span style="color:#fcbf49">{{buildInfo.plotRatio}}</span></p>
                        <p>绿化率：<span style="color:#fcbf49">{{buildInfo.greenRatio}}</span></p>
                        <p>物业类型：<span style="color:#fcbf49">{{buildInfo.type}}</span></p>
                        <p>销售状态：<span style="color:#fcbf49">{{buildInfo.saleState}}</span></p>
                        <p>开发商名称：<span style="color:#fcbf49">{{buildInfo.developer}}</span></p>
                        <p>产权年限：<span style="color:#fcbf49">{{buildInfo.rightYear}}</span></p>
                        <p>总户数：<span style="color:#fcbf49">{{buildInfo.houseTotal}}</span></p>
                        <p>楼栋总数：<span style="color:#fcbf49">{{buildInfo.floorTotal}}</span></p>
                        <p>停车位：<span style="color:#fcbf49">{{buildInfo.park}}</span></p>
                        <p>物业公司：<span style="color:#fcbf49">{{buildInfo.propertyCompany}}</span></p>
                        <p>物业费：<span style="color:#fcbf49">{{buildInfo.fee}}</span></p>
                        <p>交房时间：<span style="color:#fcbf49">{{buildInfo.subDate}}</span></p>
                        <el-button type="text" @click="showProDetail(scope.row)"> 查看更多 </el-button>
                      </div>
                      <el-button slot="reference" type="text" style="color: #fcbf49;" @click="getProInfo(scope.row.id)" >{{scope.row.name}}</el-button>
                    </el-popover>
                </template>
            </el-table-column>
             <el-table-column
              prop="name"
              label="项目名称"
              align="center"
              v-if="chooseRadio==='2'">
            </el-table-column>
            <el-table-column
              prop="xznum"
              label="新增套数(套)"
              align="center"
              sortable>
            </el-table-column>
            <el-table-column
              prop="xzarea"
              label="新增面积(万㎡)"
              align="center"
              sortable>
            </el-table-column>
            <el-table-column
              prop="xsnum"
              label="销售套数(套)"
              align="center"
              sortable>
            </el-table-column>
            <el-table-column
              prop="xsarea"
              label="销售面积(万㎡)"
              align="center"
              sortable>
            </el-table-column>
            <el-table-column
              prop="ave"
              label="销售均价(元/㎡)"
              align="center"
              sortable>
            </el-table-column>
            <el-table-column
              prop="xsamount"
              label="销售总价(万元)"
              align="center"
              sortable>
            </el-table-column>
            
            
            <el-table-column
              prop="clnum"
              label="存量套数(套)"
              align="center"
              sortable>
            </el-table-column>
            <el-table-column
              prop="clarea"
              label="存量面积(万㎡)"
              align="center"
              sortable>
            </el-table-column>
              </el-table>
  
            </div>
            <div :class="['region_wrap',showRegionDetail?'region_wrap_show':'']">
                <div class="instructions">
                  <span class="back_box" @click="back">
                    <i class="iconfont icon-fanhui"></i>
                    <span style="margin-left:4px;">返回上一级</span>
                  </span>
                  <!-- <span style="margin-left:140px;">
                    * 点击表头可按照对应指标排序;点击区域可查看区域详情
                  </span> -->
                  </div>
                <el-table 
              :data="regionData"
                style="width: 94%;margin-left:3%;margin-top:2%;background: transparent;color:white"
              :height="tableHeight"
              :cell-style="cellStyle"
              >
               <el-table-column
                prop="name"
                label="项目名称"
                align="center">
                <template slot-scope="scope">
                  <el-popover
                      placement="right-end"
                      width="250"
                      trigger="click"
                      offset="40"
                       v-model="scope.row.showPopover"
                      popper-class="buildInfo_wrap">
                      <div style="padding:0 10px">
                        <p>城区：<span style="color:#fcbf49">{{buildInfo.region}}</span></p>
                        <p>板块：<span style="color:#fcbf49">{{buildInfo.partname}}</span></p>
                        <p>占地面积：<span style="color:#fcbf49">{{buildInfo.useArea}}</span></p>
                        <p>总建面积：<span style="color:#fcbf49">{{buildInfo.buildArea}}</span></p>
                        <p>容积率：<span style="color:#fcbf49">{{buildInfo.plotRatio}}</span></p>
                        <p>绿化率：<span style="color:#fcbf49">{{buildInfo.greenRatio}}</span></p>
                        <p>物业类型：<span style="color:#fcbf49">{{buildInfo.type}}</span></p>
                        <p>销售状态：<span style="color:#fcbf49">{{buildInfo.saleState}}</span></p>
                        <p>开发商名称：<span style="color:#fcbf49">{{buildInfo.developer}}</span></p>
                        <p>产权年限：<span style="color:#fcbf49">{{buildInfo.rightYear}}</span></p>
                        <p>总户数：<span style="color:#fcbf49">{{buildInfo.houseTotal}}</span></p>
                        <p>楼栋总数：<span style="color:#fcbf49">{{buildInfo.floorTotal}}</span></p>
                        <p>停车位：<span style="color:#fcbf49">{{buildInfo.park}}</span></p>
                        <p>物业公司：<span style="color:#fcbf49">{{buildInfo.propertyCompany}}</span></p>
                        <p>物业费：<span style="color:#fcbf49">{{buildInfo.fee}}</span></p>
                        <p>交房时间：<span style="color:#fcbf49">{{buildInfo.subDate}}</span></p>
                         <el-button type="text" @click="showProDetail(scope.row)"> 查看更多 </el-button>
                      </div>
                      <el-button slot="reference" type="text" style="color: #fcbf49;" @click="getProInfo(scope.row.id)" >{{scope.row.name}}</el-button>
                    </el-popover>
                </template>
              </el-table-column>
              <el-table-column
                prop="xsnum"
                label="销售套数"
                align="center"
                sortable>
              </el-table-column>
              <el-table-column
                prop="xsarea"
                label="销售面积(万㎡)"
                align="center"
                sortable>
                  
              </el-table-column>
              <el-table-column
                prop="xstotalprice"
                label="销售总价(万元)"
                align="center"
                sortable>
              </el-table-column>
              <el-table-column
                prop="avg"
                label="销售均价"
                align="center"
                sortable>
              </el-table-column>
              <el-table-column
                prop="xznum"
                label="新增套数"
                align="center"
                sortable>
               
              </el-table-column>
              <el-table-column
                prop="xzarea"
                label="新增面积(万㎡)"
                align="center"
                sortable>
                
              </el-table-column>
              <el-table-column
                prop="clnum"
                label="存量套数"
                align="center"
                sortable>
                
              </el-table-column>
              <el-table-column
                prop="clarea"
                label="存量面积(万㎡)"
                align="center"
                sortable >
              </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="select_box">
          <el-select v-if="chooseRadio === '2'" v-model="enterprise" size="small" style="width:180px;margin-right:20px;" :clearable="false" @change="enterpriseChange">
            <el-option :label="item.name" :value="item.id" v-for="item in tableData" :key="item.value"></el-option>
          </el-select>
          <el-select v-model="indicator" size="small" style="width:180px" :clearable="false" @change="indicatorChange">
            <el-option :label="item.label" :value="item.value" v-for="item in indicatorsArr" :key="item.value"></el-option>
          </el-select>
        </div> 
        <Loading v-if="showLoading" />
        <ProjectDetail :proPoi="proPoi" :proId="proId" :proTitle="proTitle" v-if="showProjectDetail" />
    </div>
</template>

<script>
import House from "@/api/houseDataApi.js"
import { mapGetters } from "vuex" 
import Loading from "@/components/tools/loading.vue"
import HouseRegionDetail from "./HouseRegionDetail"
import ProjectDetail from "./ProjectDetail.vue"
export default {
  components:{
    Loading,HouseRegionDetail,ProjectDetail
  },
    computed:{
        ...mapGetters(['houseDataMap'])
    },
    data(){
        return{
          date:[],
          codes:[],
          showLoading:false,
          dialogVisible:false,
          addorupdate:false,
          showProjectDetail:false,
          chooseKind:'region',
          showMap:false,
          areaData:[],
          regionSelect:[],
          partSelect:[],
          FQData: [],
          avgSizes:[],
          totalSizes:[],
          areaSizes:[],
          radio:'1',
          chooseRadio:'1',
          formInline:{
                kind:'region',
                startDate:'',
                endDate:'',
                propertyTypes:'house',
                buildForms:'',
                status:'sub',
                codes:'',
                // avgSizes:'',
                // totalSizes:'',
                areaSizes:'',
                page:1,
                limit:9999
            },
            statusArr:[{
              label:'认购',
              value:'sub'
            },{
              label:'备案',
              value:'record'
            }],
            regionArr:[],
            propertyArr:[],
            buildArr:[],
            propertyType:['house'],
            buildForm:[],
            tableData:[],
            tableHeight:550,
            totalPage:0,
            chartData:[],
            avg_size:[],
            area_size:[],
            total_size:[],
            showRegionDetail:false,
            isShowEcharts:false,
            search:'',
            rangeForm:{
              name:''
            },
            regionData:[],
            buildInfo:{},
            indicatorsArr:[],
            indicator:'xzarea',
            enterprise:'',
            isAllRegionnos:false,
            regionnosAll:false,
            isAllAreaSizes:false,
            areaSizesAll:false,
            isAllAvgSizes:false,
            avgSizessAll:false,
        }
    },
    watch:{
        propertyType(newVal){this.formInline.propertyTypes = newVal.join(',')},
        buildForm(newVal){this.formInline.buildForms = newVal.join(',')},
        codes(newVal){this.formInline.codes = newVal.join(',');this.isAllRegionnos = newVal.length > 0 && newVal.length < this.areaData.length},
        avgSizes(val){this.formInline.avgSizes = val.join(',');this.isAllAvgSizes = val.length >0 && val.length < this.avg_size.length},
        areaSizes(val){this.formInline.areaSizes = val.join(',');this.isAllAreaSizes = val.length >0 && val.length < this.area_size.length},
        totalSizes(newVal){this.formInline.totalSizes = newVal(',')},
        date(val){
            if(val === null){
              this.formInline.startDate = ''
              this.formInline.endDate = ''
              return
            }
            this.formInline.startDate = val[0];this.formInline.endDate = val[1]
        }
    },

    methods:{
      regionsAllChange(val){
          this.codes = val?this.areaData.map(item=>item.id):[]
      },
      areaSizesAllChange(val){
        this.areaSizes = val?this.area_size.map(item=>item.value):[]
      },
      avgSizesAllChange(val){
        this.avgSizes = val?this.unit_price.map(item=>item.value):[]
      },
      closeDetail(){
        this.showProjectDetail = false
      },
      showProDetail(row){
          this.proId = row.id
          this.proTitle = row.name
          this.proPoi = row.coordinate.split(',')
          this.showProjectDetail = true,
          row.showPopover = false
      },
      enterpriseChange(val){
          this.showLoading = true
          let params = JSON.parse(JSON.stringify(this.formInline))
          params.enterpriseId = val
          House.getFQDetail(params).then(res=>{
            this.hotData = res.data.data
            this.setHouseLayer(res.data.data)
            this.showLoading = false
            this.hotList(res.data.data)
          })
      },
      indicatorChange(){
        if(this.chooseRadio === '1'){
          this.hotList(this.tableData)
        }else if(this.chooseRadio === '2'){
          this.hotList(this.hotData)
        }
      },
      getProInfo(id){
        House.getBasicInfo(id).then(res=>{
            if(res.data.code===0){
            this.buildInfo = res.data.data.build_info
            }
        })
      },
      objectRegionMethod(){

      },
      objectSpanMethod(){

      },
      back(){
           this.showRegionDetail = false
      },
      handleChoose(row){
        console.log(row)
      },
      handleEdit(row){
        console.log(row)
      },
      handleDelete(row){
        console.log(row)
      },
      selectFocus(val){
        House.getRangeList(val).then(res=>{
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
      showEcharts(){
        this.isShowEcharts = !this.isShowEcharts;
        if(this.isShowEcharts)  this.tableHeight = window.innerHeight * 0.49
        else this.tableHeight = window.innerHeight * 0.71
      },
      kindChange(val){
        this.codes = []
        this.isAllRegionnos = false
        this.regionnosAll = false
        if(val === 'region'){
          this.areaData = this.regionSelect
        }else if(val === 'part'){
          this.areaData = this.partSelect
        }
      },
      hotList(data){
        let arr = ["match", ["get", "id"]]
        let colors =  ['#f07605', '#f27a11', '#f27e18', '#f58320', '#f58625', '#f7862a', '#f78b31', '#f78d36', '#fa913c', '#fa9441', '#fc9e4c', '#fc9e4c', '#fca253', '#ffa759', '#ffa95e', '#ffac63', '#ffb06b', '#ffb370', '#ffb875', '#ffbc7d', '#ffbe82', '#ffc48a', '#ffc78f', '#ffcb96', '#ffcf9c', '#ffd3a3', '#ffd7a8', '#ffdab0', '#ffdfb8', '#ffe2bd', '#ffe7c4', '#ffebcc']
        if(data.length === 0){
            // this.houseDataMap.setPaintProperty('houseAllPoint',"circle-color", 'rgba(0,0,0,0)')
            return
        }
        let max = Math.max(... data.map(item=>item[this.indicator]))
        let min = Math.min(... data.map(item=>item[this.indicator]))
        let diff = (max-min) / 32
        data.forEach(item=>{
            arr.push(item.id)
            let i = Math.floor((max-item[this.indicator]) / diff)
            if(i > 31) i = 31
            arr.push(colors[i])
        })
        arr.push('rgba(0,0,0,0)')
        console.log(arr)
        setTimeout(_=>{
            this.houseDataMap.setPaintProperty('houseAllPoint',"circle-color", arr)
        },600)
      },
      getViewList(){
          this.chooseRadio = this.radio
          this.showLoading = true
          this.back()
          if(this.chooseRadio === '1'){
            House.getBuildRank(this.formInline).then(res=>{
              let data =  res.data.data
              data.forEach(item=>{item.showPopover = false})
              this.tableData = data
              this.setHouseLayer(res.data.data)
              this.hotList(this.tableData)
              this.showLoading =false
              this.showRegionDetail = false

            })
          }else if(this.chooseRadio === '2'){
             House.getEnterpriseRank(this.formInline).then(res=>{
              this.tableData = res.data.data
              this.enterprise = res.data.data[0].id
              this.enterpriseChange(this.enterprise)
              this.showLoading =false
              this.showRegionDetail = false
            })
          }
            
      },
      cellStyle(row, column, rowIndex, columnIndex){
      if(row.column.label === '项目名称'){
            return 'color:#fcbf49;font-weight:700;cursor:pointer'
           }
      },
      cellClick(row, column, cell, event){
            if(column.label === '项目名称'){
              if(this.chooseRadio === '2'){
                  this.chooseRegionno = row.code
                  this.showRegionDetail = true
                  let params = JSON.parse(JSON.stringify(this.formInline))
                  params.enterpriseId = row.id
                  House.getFQDetail(params).then(res=>{
                    console.log(res)
                    this.showLoading = false
                    let data =  res.data.data
                    data.forEach(item=>{item.showPopover = false})
                    this.regionData = data
                  })
              }
            }
      },
      hideBox(){
           this.showRegionDetail = false
      },
      pageChange(i){
        this.formInline.page=i;
        this.getViewList()
      },
      setHouseLayer(data){
            let map = this.houseDataMap
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
                    pointArr:item.coordinate.split(',')
                }
                })
            }
            })
            let houseAllSource = map.getSource('houseAllSource')
            if(houseAllSource==undefined){
            map.addSource('houseAllSource',{
                type:'geojson',
                data:{
                type:'FeatureCollection',
                features:[]
                }
            })
            map.addLayer({
                id:'houseAllPoint',
                type:'circle',
                source:'houseAllSource',
                paint: {
                'circle-color': '#fcbf49',
                "circle-radius": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  9, 6,
                  16, 10
                ],
                'circle-stroke-width': 0.2,
                'circle-stroke-color': 'white'
                }
            })
            let popup = new this.mbgl.Popup({
                offset:15,
                anchor:'left',
                closeButton:false,
                closeOnClick:false
            })
            map.on('mousemove','houseAllPoint',e=>{
                map.getCanvas().style.cursor = 'pointer'
                let coordinates = [e.lngLat.lng, e.lngLat.lat];
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                     coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
                var name = e.features[0].properties.name;
                var htmlInfo = `<P class="item_head">${name}</p>`
                popup.setLngLat(coordinates).setHTML(htmlInfo).addTo(map);
            })
            map.on('mouseleave','houseAllPoint',e=>{
                popup.remove()
                map.getCanvas().style.cursor = 'default'
            })
            map.on('click','houseAllPoint',e=>{
                console.log(e.features[0].properties)
                let pointArr = e.features[0].properties.pointArr
                this.setPointLayer(eval(pointArr))
                let coordinates = [e.lngLat.lng, e.lngLat.lat];
                console.log(coordinates)
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
                let id = e.features[0].properties.id;
                House.getBasicInfo(id).then(res=>{
                    if(res.data.code===0){
                    let data = res.data.data.build_info
                    console.log(data)
                    var htmlInfo = `<div class="house_infoWrap">
                        <div class="info_content">
                        <div class="info_head">${data.name}</div>
                            <div class="info">城区：<span class="val">${data.region}</span></div>
                            <div class="info">板块：<span class="val">${data.partname}</span></div>
                            <div class="info">占地面积：<span class="val">${data.useArea}</span></div>
                            <div class="info">总建面积：<span class="val">${data.buildArea}</span></div>
                            <div class="info">容积率：<span class="val">${data.plotRatio}</span></div>
                            <div class="info">绿化率：<span class="val">${data.greenRatio}</span></div>
                            <div class="info">物业类型：<span class="val">${data.type}</span></div>
                            <div class="info">销售状态：<span class="val">${data.saleState}</span></div>
                            <div class="info">开发商名称：<span class="val">${data.developer}</span></div>
                            <div class="info">产权年限：<span class="val">${data.rightYear}</span></div>
                            <div class="info">总户数：<span class="val">${data.houseTotal}</span></div>
                            <div class="info">楼栋总数：<span class="val">${data.floorTotal}</span></div>
                            <div class="info">停车位：<span class="val">${data.park}</span></div>
                            <div class="info">物业公司：<span class="val">${data.propertyCompany}</span></div>
                            <div class="info">物业费：<span class="val">${data.fee}</span></div>
                            <div class="info">交房时间：<span class="val">${data.subDate}</span></div>
                        </div>
                        </div>`
                    this.popupClick.setLngLat(coordinates).setHTML(htmlInfo).addTo(map);
                    }
                })
            })
            }
            map.getSource('houseAllSource').setData(geojsonData)
      },
      setPointLayer(point){
            let map = this.houseDataMap;
            var size= 100;
            let source = map.getSource('pointSource')
            if(source === undefined){
            var pulsingDot = {
                width: size,
                height: size,
                data: new Uint8Array(size * size * 4),

                onAdd: function() {
                var canvas = document.createElement("canvas");
                canvas.width = this.width;
                canvas.height = this.height;
                this.context = canvas.getContext("2d");
                },
                render: function() {
                var duration = 1000;
                var t = (performance.now() % duration) / duration;

                var radius = (size / 2) * 0.3;
                var outerRadius = (size / 2) * 0.7 * t + radius;
                var context = this.context;

                // draw outer circle
                context.clearRect(0, 0, this.width, this.height);
                context.beginPath();
                context.arc(
                    this.width / 2,
                    this.height / 2,
                    outerRadius,
                    0,
                    Math.PI * 2
                );
                context.fillStyle = "rgba(255, 200, 200," + (1 - t) + ")";
                context.fill();
                // draw inner circle
                context.beginPath();
                context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
                context.fillStyle = "rgba(255, 100, 100, 1)";
                context.strokeStyle = "white";
                context.lineWidth = 2 + 4 * (1 - t);
                context.fill();
                context.stroke();

                // update this image's data with data from the canvas
                this.data = context.getImageData(0, 0, this.width, this.height).data;

                // keep the map repainting
                map.triggerRepaint();

                // return `true` to let the map know that the image was updated
                return true;
                }
            };
            map.addImage("land-dot", pulsingDot, { pixelRatio: 2 });
            let pointSource = map.getSource('pointSource')
            if(pointSource === undefined){
                map.addSource('pointSource',{
                    type:'geojson',
                    data:{
                    type:'FeatureCollection',
                    features:[{
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": point
                        },
                        
                    }]
                    }
                })
            }
            map.addLayer({
                    id: "house_point",
                    type: "symbol",
                    source: 'pointSource',
                    layout: {
                    "icon-image": "land-dot",
                    }
                });
            }
           map.getSource('pointSource').setData({
                type:'FeatureCollection',
                features:[{
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": point
                    },
                    
                }]
            })
      },
      getNowMonth(){
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() + 1 < 10?'0' +  (date.getMonth() + 1):date.getMonth() + 1
        console.log(year,month)
        this.date = ['2021-01-01',`${year}-${month}-01`]
      }
    },
    created(){
      this.getNowMonth()
      House.getDict('region_type').then(res=>this.regionArr = res.data.data)
      House.getDict('property_type_newhouse').then(res=>this.propertyArr = res.data.data)
      House.getDict('build_form_newhouse').then(res=>this.buildArr = res.data.data)
      House.getRegionnos().then(res=>{this.regionSelect = res.data.data.searchRst;this.areaData = this.regionSelect})
      House.getPartNos().then(res=>this.partSelect = res.data.data)
      House.getDict('statistical_indicators').then(res=>this.indicatorsArr = res.data.data)
      this.tableHeight = window.innerHeight * 0.9
      this.popupClick = new this.mbgl.Popup({
        offset:15,
        anchor:'left',
        closeButton:true,
        closeOnClick:true
      })
    },
    mounted(){
      this.getViewList()
      setTimeout(_=>{
        this.houseDataMap.flyTo({
            center:[103.7157969744969,30.76129397743849],
            zoom: 8.5,
        })
      },1500)
    },
    beforeDestroy(){
      this.houseDataMap.removeLayer('houseAllPoint')
      this.houseDataMap.removeSource('houseAllSource')
      this.houseDataMap.removeImage('land-dot')
      this.houseDataMap.removeLayer('house_point')
      this.houseDataMap.removeSource('pointSource')
    }
}




</script>

<style lang="scss" scoped>
.qhStatistics_wrap{
    height:800px;
    width:300px;
    position: relative;
    .diver{
        padding: 10px 20px;
        border-bottom: #464646 1px solid;
        font-size: 14px;
        color: #8bc34a;
    }
    .from_box{
      margin-top:20px;
      margin-left:5%;
      width: 90%;
      .el-form-item{
        margin-top:-1px;
        width:100%;
        margin-right: 14px;
        ::v-deep .el-form-item__label{
          color:#fcbf49;
          font-weight: 700;
        }
        ::v-deep .el-range__close-icon{
          display: none;
        }
        ::v-deep .el-range-input{
          color: #fcbf49;
          font-weight: 700;
          background: transparent;
        }
        ::v-deep .el-date-editor--monthrange{
           width: 220px!important;
        }
        ::v-deep .el-date-editor--daterange{
            width: 220px!important;
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
  .list_mask{
    position: fixed;
    top:0%;
    right:0%;
    width:calc(100% - 380px);
    height:100%;
    background: rgba(47,62,70,.95);
    // border-radius: 8px;
    z-index: 9;
    transition: all 0.3s ease;
    .region_wrap{
       z-index: -999;
       opacity: 0;
       transition: all 0.5s ease;
    }
    .list_wrap,.region_wrap_show{
      position: absolute;
      height: 100%;
      width: 100%;
      z-index: 999;
      opacity: 1;
      transition: all 0.5s ease;
    }
    .list_wrap_hide{
       z-index: -999;
       opacity: 0;
       transition: all 0.5s ease;
    }
    &::-webkit-scrollbar { width: 0 !important }
    ::v-deep .el-table__body-wrapper{
        &::-webkit-scrollbar{
        background-color: #212e3e !important;
        opacity: 1!important;
        height:10px;
        width: 0px;
      }
      &::-webkit-scrollbar-thumb {
          /*滚动条里面小方块*/
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
    .el-pagination{
      text-align: right;
      margin-right:6%;
      margin-top:8px;
    }
    ::v-deep .btn-prev{
       background: transparent;
       color:white
    }
    ::v-deep .btn-next{
       background: transparent;
       color:white
    }
    ::v-deep .el-icon-more{
      background: transparent;
      color:white;
    }
    ::v-deep .el-icon-d-arrow-right{
       background: transparent;
      color:white;
    }
    ::v-deep .el-icon-d-arrow-left{
       background: transparent;
      color:white;
    }
    ::v-deep .number{
      background: transparent;
      color:white
    }
    ::v-deep  .active{
      color:#219ebc;
    }
  }
  .list_mask_hide{
    opacity: 0;
    z-index: -99999;
    transition: all 0.3s ease;
    pointer-events: none;
  }  
  .instructions{
      text-align: left;
      margin-left:40px;
      margin-top: 20px;
      color:#0a9396;
      font-weight: 700;
      letter-spacing: 1px;
      display: flex;
      align-items: center;
      height: 24px;
      .back_box{
        display: flex;
        align-items: center;
        color:rgb(252, 191, 73);
        cursor: pointer;
      }
    }
    ::v-deep .el-radio__input.is-checked+.el-radio__label{
         color:rgba(255, 193, 7, 1)
    }
    ::v-deep .el-radio{
        color:white;
    }
    .select_box{
      position: fixed;
      top:20px;
      left: 410px;
      ::v-deep .el-input__inner{
        background: transparent;
        color:rgb(252, 191, 73);
        font-weight: 700;
      }
    }
}
</style>