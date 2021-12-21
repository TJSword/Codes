<template>
    <div class="qhStatistics_wrap">
      <Loading v-if="showLoading" />
      <div class="from_box">
        <el-form :inline="true" :model="formInline" size="small" style="text-align: start;"  >
           <el-form-item label="">
            <el-select v-model="formInline.status" placeholder="数据口径" clearable :collapse-tags="true">
                <el-option :label="item.label" :value="item.value" v-for="item in statusArr" :key="item.value"></el-option>
            </el-select>
           </el-form-item>
          <el-form-item label="">
              <el-select v-model="formInline.kind" placeholder="区域类型" clearable>
                <el-option :label="item.label" :value="item.value" v-for="item in regionArr" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
              <el-form-item label="">
              <el-select  v-model="propertyType"  placeholder="物业类型" clearable multiple :collapse-tags="true">
               <el-option :label="item.label" :value="item.value" v-for="item in propertyArr" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-select  v-model="formInline.rangeType" placeholder="纬度选择" @change="rangeTypeChange" :clearable="false">
                 <el-option :label="item.label" :value="item.value" v-for="item in dimensionArr" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-select  v-model="ranges" placeholder="纬度分段"  clearable multiple :collapse-tags="true" @focus="rangeFocus">
                 <el-option :label="item.label" :value="item.value" v-for="item in rangesArr" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
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
            <el-form-item style="width:100%" v-show="!showMap">
                <el-button style="width:220px"   @click="exportExcel" type="success">点击导出Excel</el-button>
            </el-form-item>
            <el-form-item style="width:220px;display:flex;justify-content:flex-start;margin-top:6px;">
                <span style="color:white;margin-right:20px;flex:1">显示图表</span>
                <el-switch
                      v-model="showMap"
                      active-color="#fcbf49"
                     >
                  </el-switch>
                  <span style="color:white;margin-left:20px;flex:1">显示地图</span>
              </el-form-item>
            </el-form>
        </div>
         <div :class="['list_mask',showMap?'list_mask_hide':'']">
          <div :class="['list_wrap',showRegionDetail?'list_wrap_hide':'']">
              <div class="instructions"> * 点击区域可查看区域详情;点击分段可查询区域下分段详情</div>
                <el-table 
              :data="tableData"
              style="width: 94%;margin-left:3%;margin-top:2%;background: transparent;color:white"
              :height="tableHeight"
              :cell-style="cellStyle"
              @cell-click="cellClick"
              :span-method="objectSpanMethod"
              border
              >
            <el-table-column
              prop="zone"
              label="区域"
              align="center">
            </el-table-column>
            <el-table-column
              prop="range"
              :label="labelText"
              align="center">
            </el-table-column>
            <el-table-column
              prop="xznum"
              label="新增套数(套)"
              align="center">
            </el-table-column>
            <el-table-column
              prop="xzarea"
              label="新增面积(万㎡)"
              align="center">
            </el-table-column>
            <el-table-column
              prop="xsnum"
              label="销售套数(套)"
              align="center">
            </el-table-column>
            <el-table-column
              prop="xsarea"
              label="销售面积(万㎡)"
              align="center">
            </el-table-column>
             <el-table-column
              prop="avg"
              label="销售均价(元/㎡)"
              align="center">
            </el-table-column>
            <el-table-column
              prop="xstotalprice"
              label="销售总价(万元)"
              align="center"
              >
            </el-table-column>
            <el-table-column
              prop="clnum"
              label="存量套数(套)"
              align="center">
            </el-table-column>
            <el-table-column
              prop="clarea"
              label="存量面积(万㎡)"
              align="center">
            </el-table-column>
              </el-table>
          </div>
          <div :class="['region_wrap',showRegionDetail?'region_wrap_show':'']">
              <div class="instructions">
                <span class="back_box" @click="back">
                  <i class="iconfont icon-fanhui"></i>
                  <span style="margin-left:4px;">返回上一级</span>
                </span>
                <span style="margin-left:100px;">
                  * 点击项目名称可查看项目详情
                </span>
                </div>
              <el-table 
              :data="regionData"
                style="width: 94%;margin-left:3%;margin-top:2%;background: transparent;color:white"
              :height="tableHeight"
              :cell-style="cellStyle"
              border
              :span-method="objectRegionMethod"
              >
              <el-table-column
                prop="range"
                :label="labelText"
                align="center">
              </el-table-column>
               <el-table-column
                prop="building_name"
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
                prop="xznum"
                label="新增套数(套)"
                align="center"
                >
              </el-table-column>
              <el-table-column
                prop="xzarea"
                label="新增面积(万㎡)"
                align="center"
                >
                </el-table-column>
              <el-table-column
                prop="xsnum"
                label="销售套数(套)"
                align="center"
                >
               
              </el-table-column>
              <el-table-column
                prop="xsarea"
                label="销售面积(万㎡)"
                align="center"
                >
                  
              </el-table-column>
               <el-table-column
                prop="avg"
                label="销售均价(元/㎡)"
                align="center"
                >
              </el-table-column>
              <el-table-column
                prop="xstotalprice"
                label="销售总价(万元)"
                align="center"
                >
              </el-table-column>
             
              
              <el-table-column
                prop="clnum"
                label="存量套数(套)"
                align="center"
                >
                
              </el-table-column>
              <el-table-column
                prop="clarea"
                label="存量面积(万㎡)"
                align="center"
                >
              </el-table-column>
                </el-table>
            </div>
      </div>
      <div class="select_box">
        <el-select v-model="indicator" size="small" style="width:180px" :clearable="false" @change="indicatorChange">
           <el-option :label="item.label" :value="item.value" v-for="item in indicatorsArr" :key="item.value"></el-option>
        </el-select>
      </div>
      <div class="legend_box" v-if="legendData.length !== 0">
        <div class="unit">{{indicatorsArr.filter(item=>item.value === indicator)[0].remark}}</div>
        <div class="legend">
          <div class="legend_item" v-for="(item,index) in legendData" :key="index">
            <span class="text">{{item.text}}</span>
            <div class="item_color" :style="{background:item.color}"></div>
          </div>
           <div class="legend_item">
            <span class="text">{{minLegendData}}</span>
          </div>
        </div>
      </div>   
       <RegionDetail :form="propForm" @closeWindow="closeWindow" v-if="showLittleMap" />
       <ProjectDetail :proPoi="proPoi" :proId="proId" :proTitle="proTitle" v-if="showProjectDetail" />
    </div>
</template>

<script>
import House from "@/api/houseDataApi.js"
import { mapGetters } from "vuex" 
import Loading from "@/components/tools/loading.vue"
import RegionDetail from "./RegionDetail.vue"
import ProjectDetail from "./ProjectDetail.vue"
export default {
  components:{
    Loading,RegionDetail,ProjectDetail
  },
    computed:{
        ...mapGetters(['houseDataMap'])
    },
    data(){
        return{
          showLoading:false,
          chooseKind:'region',
          indicator:'xzarea',
          showMap:false,
          showLittleMap:false,
          showProjectDetail:false,
          date:[],
          indicatorsArr:[],
          formInline:{
                kind:'region',
                startDate:'',
                endDate:'',
                propertyTypes:'house',
                buildForms:'',
                status:'sub',
                page:1,
                limit:999,
                rangeType:'area_size',
                ranges:''
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
            showRegionDetail:false,
            isShowEcharts:false,
            dimensionArr:[],
            tableData: [],
            regionData:[],
            spanArr:[],
            spanRegionArr:[],
            rangesArr:[],
            ranges:[],
            mapData:[],
            labelText:'单价段',
            buildInfo:{},
            legendData:[],
            minLegendData:0
        }
    },
    watch:{
        propertyType(newVal){
           this.formInline.propertyTypes = newVal.join(',')
        },
        buildForm(newVal){
           this.formInline.buildForms = newVal.join(',')
        },
        ranges(newVal){
          this.formInline.ranges = newVal.join(',')
        },
        date(val){
            if(val === null){
              this.formInline.startDate = ''
              this.formInline.endDate = ''
              return
            }
            this.formInline.startDate = val[0];this.formInline.endDate = val[1]
        },
    },

    methods:{
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
      getProInfo(id){
        House.getBasicInfo(id).then(res=>{
            if(res.data.code===0){
            this.buildInfo = res.data.data.build_info
            }
        })
      },
      closeWindow(){
        this.showLittleMap = false
      },
      rangeTypeChange(val){
         House.getRangeList(val).then(res=>{
          this.rangesArr = this.disposeRange(res.data.data[0].range)
          this.ranges = this.rangesArr.map(item=>item.value)
        })
      },
      exportExcel(){
        let url = `${process.env.BASE_URL}/dms/sc/building/newhouse/export?modelType=range_count&expPage=${this.showRegionDetail?'second':'first'}&token=${localStorage.getItem('token')}`
        window.open(url)
      },
      indicatorChange(val){
        this.hotList()
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
      hotList(){
        let map = this.mapData
        console.log(map.filter(item=>item.code))
        let data = map.filter(item=>item.code.indexOf(',') === -1)
        let arr = ["match", ["get", "id"]]
        let colors =  ['#f07605', '#f27a11', '#f27e18', '#f58320', '#f58625', '#f7862a', '#f78b31', '#f78d36', '#fa913c', '#fa9441', '#fc9e4c', '#fc9e4c', '#fca253', '#ffa759', '#ffa95e', '#ffac63', '#ffb06b', '#ffb370', '#ffb875', '#ffbc7d', '#ffbe82', '#ffc48a', '#ffc78f', '#ffcb96', '#ffcf9c', '#ffd3a3', '#ffd7a8', '#ffdab0', '#ffdfb8', '#ffe2bd', '#ffe7c4', '#ffebcc']
        let max = Math.max(... data.map(item=>item[this.indicator]))
        let min = Math.min(... data.map(item=>item[this.indicator]))
        let diff = (max-min) / 32
        let legendData = []
        colors.forEach((item,index)=>{
          legendData.push({
            color:item,
            text: Math.floor(max - ( (index) * diff)) 
          })
        })
        this.legendData = legendData
        this.minLegendData = min
        console.log(max,min)
        if(this.chooseKind === 'region'){
          if(data.length === 0){
            this.houseDataMap.setPaintProperty('plate_fill',"fill-color", 'rgba(0,0,0,0)')
            return
          }
          data.forEach(item=>{
            arr.push(item.code)
            let i = Math.floor((max - item[this.indicator]) / diff)
            if(i > 31) i = 31
            arr.push(colors[i])
          })
          arr.push('rgba(0,0,0,0)')
          console.log(arr)
          setTimeout(_=>{
            this.houseDataMap.setPaintProperty('plate_fill',"fill-color", arr)
          },600)
        }else if(this.chooseKind === 'part'){
           if(data.length === 0){
            this.houseDataMap.setPaintProperty('plates_fill',"fill-color", 'rgba(0,0,0,0)')
            return
          }
          data.forEach(item=>{
            arr.push(item.code)
            let i = Math.floor((max-item[this.indicator]) / diff)
            if(i > 31) i = 31
            arr.push(colors[i])
          })
          arr.push('rgba(0,0,0,0)')
          console.log(arr)
          setTimeout(_=>{
            this.houseDataMap.setPaintProperty('plates_fill',"fill-color", arr)
          },600)
        }
      },
      rangeFocus(){
        House.getRangeList(this.formInline.rangeType).then(res=>{
          this.rangesArr = this.disposeRange(res.data.data[0].range)
        })
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        // console.log(row, column, rowIndex, columnIndex)
        // if (columnIndex === 0) {
        //   if (rowIndex  === 0) {
        //     return [7,1]
        //   }else{
        //     return [0,0]
        //   } 
        // }
        let arr = this.spanArr
        let arr1 = arr.map(item=>item[2])
        if(columnIndex === 0){
           if(arr1.includes(rowIndex)){
             let num = 0
             arr.forEach(item=>{
               if(item[2] == rowIndex){
                  num = item[1]
               }
             })
             return [num,1]
           }else {
             return [0,0]
           }
        }
      },
      objectRegionMethod({ row, column, rowIndex, columnIndex }){
        let arr = this.spanRegionArr
        let arr1 = arr.map(item=>item[2])
        if(columnIndex === 0){
           if(arr1.includes(rowIndex)){
             let num = 0
             arr.forEach(item=>{
               if(item[2] == rowIndex){
                  num = item[1]
               }
             })
             return [num,1]
           }else {
             return [0,0]
           }
        }
      },
      back(){
          this.showRegionDetail = false
      },
      showEcharts(){
        this.isShowEcharts = !this.isShowEcharts;
        if(this.isShowEcharts)  this.tableHeight = window.innerHeight * 0.49
        else this.tableHeight = window.innerHeight * 0.71
      },
     
        disposeData(data){
          let arr = []
          data.forEach(item=>{
            arr.push(item.zone)
          })
          let arr1 =  Array.from(new Set(arr))
          let arr2 = []
          arr1.forEach(item=>{
            arr2.push({
              name:item,num:0
            })
          })
          data.forEach(item=>{
            arr2.forEach(item1=>{
              if(item1.name === item.zone){
                item1.num++
              }
            })
          })
          let arr3 = []
          arr2.forEach((item,index)=>{
            arr3.push([index,item.num])
          })
          let sum = 0
          let arr4 = []
          arr3.forEach((item,index)=>{
            if(index == 0){
              item[2] = 0
              arr4.push(0)
            }else{
              sum +=  arr3[index - 1][1]
              item[2] = sum
              arr4.push(sum)
            }
          })
          console.log(arr3)
          this.spanArr= arr3
          this.tableData = data
        },
        disposeRegionData(data){
          let arr = []
          data.forEach(item=>{
            arr.push(item.range)
          })
          let arr1 =  Array.from(new Set(arr))
          let arr2 = []
          arr1.forEach(item=>{
            arr2.push({
              name:item,num:0
            })
          })
          data.forEach(item=>{
            arr2.forEach(item1=>{
              if(item1.name === item.range){
                item1.num++
              }
            })
          })
          let arr3 = []
          arr2.forEach((item,index)=>{
            arr3.push([index,item.num])
          })
          let sum = 0
          let arr4 = []
          arr3.forEach((item,index)=>{
            if(index == 0){
              item[2] = 0
              arr4.push(0)
            }else{
              sum +=  arr3[index - 1][1]
              item[2] = sum
              arr4.push(sum)
            }
          })
          console.log(arr3)
          this.spanRegionArr = arr3
          data.forEach(item=>{item.showPopover = false})
          this.regionData = data
        },
        getViewList(){
          this.showLoading = true
          this.chooseKind = this.formInline.kind
          if(this.chooseKind === 'region'){
            this.houseDataMap.setLayoutProperty('plate_fill','visibility','visible')
            this.houseDataMap.setLayoutProperty('plate_line','visibility','visible')
            this.houseDataMap.setLayoutProperty('plate_labels','visibility','visible')
            this.houseDataMap.setLayoutProperty('plates_fill','visibility','none')
            this.houseDataMap.setLayoutProperty('plates_line','visibility','none')
            this.houseDataMap.setLayoutProperty('plates_labels','visibility','none')
          }else if(this.chooseKind === 'part'){
            this.houseDataMap.setLayoutProperty('plate_fill','visibility','none')
            this.houseDataMap.setLayoutProperty('plate_line','visibility','none')
            this.houseDataMap.setLayoutProperty('plate_labels','visibility','none')
            this.houseDataMap.setLayoutProperty('plates_fill','visibility','visible')
            this.houseDataMap.setLayoutProperty('plates_line','visibility','visible')
            this.houseDataMap.setLayoutProperty('plates_labels','visibility','visible')
          }
          House.getWDList(this.formInline).then(res=>{
            this.labelText = this.dimensionArr.filter(item=>item.value == this.formInline.rangeType)[0].label
            this.disposeData(res.data.data)
            this.tableData = res.data.data
            this.showLoading = false
            
          })
          House.getWdRegionInfoTotal(this.formInline).then(res=>{
            console.log(res.data.data)
            this.mapData = res.data.data
            this.hotList()
            this.showLoading = false
            this.showRegionDetail = false
          })
        },
        cellStyle(row, column, rowIndex, columnIndex){
          if(row.column.label === '区域' || row.column.property === 'range'){
              return 'color:#fcbf49;font-weight:700;cursor:pointer'
            }
        },
        cellClick(row, column, cell, event){
            if(column.label === '区域'){
              this.showLoading = true
              this.showRegionDetail = true
              let params = JSON.parse(JSON.stringify(this.formInline))
              params.codes = row.code
              House.getWDRegionInfo(params).then(res=>{
                this.disposeRegionData(res.data.data)
                this.showLoading = false
              })
            }
           if(column.property === 'range'){
              this.showRegionDetail = true
              this.showLoading = true
              let params = JSON.parse(JSON.stringify(this.formInline))
              params.codes = row.code
              params.ranges = row.range
              House.getWDRegionInfo(params).then(res=>{
                this.disposeRegionData(res.data.data)
                this.showLoading = false
              })
            }
        },
        hideBox(){
           this.showRegionDetail = false
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
        House.getDict('dimension').then(res=>this.dimensionArr = res.data.data)
        House.getDict('statistical_indicators').then(res=>this.indicatorsArr = res.data.data)
        this.rangeTypeChange(this.formInline.rangeType)
        this.tableHeight = window.innerHeight * 0.9
    },
    mounted(){
      setTimeout(_=>{
        this.getViewList()
        this.houseDataMap.flyTo({
            center:[103.7157969744969,30.76129397743849],
            zoom: 8.5,
        })
        
        this.houseDataMap.on('click','plate_fill',e=>{
          if(this.$parent.dimension === 'WD'){
            let label = this.indicatorsArr.filter(item=>item.value === this.indicator)[0].label
            let title = `${e.features[0].properties.name} ${this.formInline.startDate} ~  ${this.formInline.endDate} ${label}对比分析`
            let echartsData = this.tableData.filter(item=>item.code == e.features[0].properties.id)
            this.propForm = {
              type:'WD',
              kind:'region',
              region:e.features[0].properties.id,
              center:[e.lngLat.lng,e.lngLat.lat],
              sort:this.indicator,
              form:this.formInline,
              echartsData,
              title
            }
            this.showLittleMap = true;
          }
        })
        this.houseDataMap.on('click','plates_fill',e=>{
            if(this.$parent.dimension === 'WD'){
              console.log(e)
              let label = this.indicatorsArr.filter(item=>item.value === this.indicator)[0].label
              let title = `${e.features[0].properties.name} ${this.formInline.startDate} ~  ${this.formInline.endDate} ${label} 对比分析`
              let echartsData = this.tableData.filter(item=>item.code == e.features[0].properties.id)
              this.propForm = {
                    type:'WD',
                    kind:'part',
                    part:e.features[0].properties.id,
                    center:[e.lngLat.lng,e.lngLat.lat],
                    sort:this.indicator,
                    form:this.formInline,
                    echartsData,
                    title
                  }
            this.showLittleMap = true;
            }
        })
      },1500)
    },
    beforeDestroy(){
        this.houseDataMap.setLayoutProperty('plates_fill',"visibility", 'none')
        this.houseDataMap.setLayoutProperty('plate_line',"visibility", 'none')
        this.houseDataMap.setLayoutProperty('plate_labels',"visibility", 'none')
        this.houseDataMap.setLayoutProperty('plate_fill',"visibility", 'none')
        this.houseDataMap.setLayoutProperty('plates_line',"visibility", 'none')
        this.houseDataMap.setLayoutProperty('plates_labels',"visibility", 'none')
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
    .legend_box{
      position: fixed;
      height: 90%;
      width: 150px;
      right: 10%;
      bottom: 5%;
      .unit{
        color: #ffc107;
        font-weight: 700;
        font-size: 16px;
        height: 30px;
        line-height: 30px;
        margin-left: 90px;
        width: 60px;
        text-align: center;
      }
      .legend{
        height: calc(100% - 30px);
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        .legend_item{
          height: 20px;
          position: relative;
          padding-left: 90px;
          flex:1;
          .text{
            color:#d3d3d3;
            position: absolute;
            left: 0px;
            top: -8px;
            width: 80px;
            text-align: right;
            font-size: 15px;
          }
          .item_color{
            width: 60px;
            height: 100%;
            opacity: 0.6;
            border-bottom: 0.1px solid white;
          }
        }
      }
    }
}
</style>