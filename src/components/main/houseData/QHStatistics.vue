<template>
    <div class="qhStatistics_wrap">
      <Loading  v-if="showLoading" />
      <div class="from_box">
        <el-form :inline="true" :model="formInline" size="small" style="text-align: start;">
           <el-form-item label="">
            <el-select v-model="formInline.status" placeholder="数据口径" clearable :collapse-tags="true">
                <el-option :label="item.label" :value="item.value" v-for="item in statusArr" :key="item.value"></el-option>
            </el-select>
           </el-form-item>
          <el-form-item label="">
              <el-select v-model="formInline.kind" placeholder="区域类型" clearable >
                <el-option :label="item.label" :value="item.value" v-for="item in regionArr" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
              <el-form-item label="">
              <el-select  v-model="propertyType"  placeholder="物业类型" clearable multiple :collapse-tags="true">
               <el-option :label="item.label" :value="item.value" v-for="item in propertyArr" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="">
              <el-select  v-model="buildForm" placeholder="建筑形态" clearable multiple :collapse-tags="true">
                 <el-option :label="item.label" :value="item.value" v-for="item in buildArr" :key="item.value"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="">
              <el-date-picker
                  v-model="date"
                  type="monthrange"
                  range-separator="~"
                  start-placeholder="开始月份"
                  end-placeholder="结束月份"
                  value-format="yyyy-MM-dd"
                  >
              </el-date-picker>
            </el-form-item>
         
            <el-form-item style="width:100%">
           <!-- <div class="submit_btn"></div> -->
                <el-button style="width:220px"  @click="getViewList" type="primary">点击查询</el-button>
            </el-form-item>
            <el-form-item style="width:100%"  v-show="!showMap">
           <!-- <div class="submit_btn"></div> -->
                <el-button style="width:220px"  @click="exportExcel" type="success">点击导出Excel</el-button>
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
                <div class="instructions"> * 点击区域可查看区域详情</div>
                <el-table 
                :data="tableData"
                style="width: 94%;margin-left:3%;margin-top:0.2%;background: transparent;color:white"
                :height="tableHeight"
                :cell-style="cellStyle"
                @cell-click="cellClick"
                >
              <el-table-column
                prop="name"
                label="区域"
                align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.level == 0" style="font-size:18px;text-align:left">{{scope.row.name}}</div>
                  <div v-if="scope.row.level == 1" style="font-size:16px;text-align:left">{{scope.row.name}}</div>
                  <div v-if="scope.row.level == 2" style="font-size:16px;text-align:center;font-weight:500">{{scope.row.name}}</div>
                  <div v-if="scope.row.level == 3" style="font-size:16px;text-align:right;font-weight:100">{{scope.row.name}}</div>
                  <div v-if="scope.row.level == 4" style="font-size:14px;font-weight:500;text-align:right;">{{scope.row.name}}</div>
                  <div v-if="!scope.row.level" >{{scope.row.name}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="xznum"
                label="新增套数(套)"
                align="center"
                :sortable="chooseKind === 'part'">
                <template slot-scope="scope">
                  <div v-show="showProperty === 'xznum'" style="width:100%;height:100%;text-align:left">
                    <div :style="{'width':(scope.row.xznum / maxNum * 100) + '%','background':'#52b69a','white-space':'nowrap','text-indent':'10px'}">{{scope.row.xznum}}</div>
                  </div>
                  <div v-show="showProperty !== 'xznum'">{{scope.row.xznum}}</div>
                </template>
              </el-table-column>
               <el-table-column
                prop="xzarea"
                label="新增面积(万㎡)"
                align="center"
                :sortable="chooseKind === 'part'">
                <template slot-scope="scope">
                  <div v-show="showProperty === 'xzarea'" style="width:100%;height:100%;text-align:left">
                    <div :style="{'width':(scope.row.xzarea / maxNum * 100) + '%','background':'#52b69a','white-space':'nowrap','text-indent':'10px'}">{{scope.row.xzarea}}</div>
                  </div>
                  <div v-show="showProperty !== 'xzarea'">{{scope.row.xzarea}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="xsnum"
                label="销售套数(套)"
                align="center"
                :sortable="chooseKind === 'part'">
                <template slot-scope="scope">
                  <div v-show="showProperty === 'xsnum'" style="width:100%;height:100%;text-align:left">
                    <div :style="{'width':(scope.row.xsnum / maxNum * 100) + '%','background':'#52b69a','white-space':'nowrap','text-indent':'10px'}">{{scope.row.xsnum}}</div>
                  </div>
                  <div v-show="showProperty !== 'xsnum'">{{scope.row.xsnum}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="xsarea"
                label="销售面积(万㎡)"
                align="center"
                :sortable="chooseKind === 'part'">
                <template slot-scope="scope">
                  <div v-show="showProperty === 'xsarea'" style="width:100%;height:100%;text-align:left">
                    <div :style="{'width':(scope.row.xsarea / maxNum * 100) + '%','background':'#52b69a','white-space':'nowrap','text-indent':'10px'}">{{scope.row.xsarea}}</div>
                  </div>
                  <div v-show="showProperty !== 'xsarea'">{{scope.row.xsarea}}</div>
                </template>
              </el-table-column>
                <el-table-column
                prop="ave"
                label="销售均价(元/㎡)"
                align="center"
                :sortable="chooseKind === 'part'">
                <template slot-scope="scope">
                  <div v-show="showProperty === 'ave'" style="width:100%;height:100%;text-align:left">
                    <div :style="{'width':(scope.row.ave / maxNum * 100) + '%','background':'#52b69a','white-space':'nowrap','text-indent':'10px'}">{{scope.row.ave}}</div>
                  </div>
                  <div v-show="showProperty !== 'ave'">{{scope.row.ave}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="xsamount"
                label="销售总价(万元)"
                align="center"
                :sortable="chooseKind === 'part'">
                <template slot-scope="scope">
                  <div v-show="showProperty === 'xsamount'" style="width:100%;height:100%;text-align:left">
                    <div :style="{'width':(scope.row.xsamount / maxNum * 100) + '%','background':'#52b69a','white-space':'nowrap','text-indent':'10px'}">{{scope.row.xsamount}}</div>
                  </div>
                  <div v-show="showProperty !== 'xsamount'">{{scope.row.xsamount}}</div>
                </template>
              </el-table-column>
            
              <el-table-column
                prop="clnum"
                label="存量套数(套)"
                align="center"
                :sortable="chooseKind === 'part'">
                <template slot-scope="scope">
                  <div v-show="showProperty === 'clnum'" style="width:100%;height:100%;text-align:left">
                    <div :style="{'width':(scope.row.clnum / maxNum * 100) + '%','background':'#52b69a','white-space':'nowrap','text-indent':'10px'}">{{scope.row.clnum}}</div>
                  </div>
                  <div v-show="showProperty !== 'clnum'">{{scope.row.clnum}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="clarea"
                label="存量面积(万㎡)"
                align="center"
                :sortable="chooseKind === 'part'">
                <template slot-scope="scope">
                  <div v-show="showProperty === 'clarea'" style="width:100%;height:100%;text-align:left">
                    <div :style="{'width':(scope.row.clarea / maxNum * 100) + '%','background':'#52b69a','white-space':'nowrap','text-indent':'10px'}">{{scope.row.clarea}}</div>
                  </div>
                  <div v-show="showProperty !== 'clarea'">{{scope.row.clarea}}</div>
                </template>
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
                style="width: 94%;margin-left:3%;margin-top:0.2%;background: transparent;color:white"
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
                prop="xznum"
                label="新增套数(套)"
                align="center"
                sortable
                >
                <template slot-scope="scope">
                  <div v-show="showProperty === 'xznum'" style="width:100%;height:100%;text-align:left">
                    <div :style="{'width':(scope.row.xznum / maxNum * 100) + '%','background':'#52b69a','white-space':'nowrap','text-indent':'10px'}">{{scope.row.xznum}}</div>
                  </div>
                  <div v-show="showProperty !== 'xznum'">{{scope.row.xznum}}</div>
                </template>
              </el-table-column>
               <el-table-column
                prop="xzarea"
                label="新增面积(万㎡)"
                align="center"
                sortable
                >
                <template slot-scope="scope">
                  <div v-show="showProperty === 'xzarea'" style="width:100%;height:100%;text-align:left">
                    <div :style="{'width':(scope.row.xzarea / maxNum * 100) + '%','background':'#52b69a','white-space':'nowrap','text-indent':'10px'}">{{scope.row.xzarea}}</div>
                  </div>
                  <div v-show="showProperty !== 'xzarea'">{{scope.row.xzarea}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="xsnum"
                label="销售套数(套)"
                align="center"
                sortable
                >
                <template slot-scope="scope">
                  <div v-show="showProperty === 'xsnum'" style="width:100%;height:100%;text-align:left">
                    <div :style="{'width':(scope.row.xsnum / maxNum * 100) + '%','background':'#52b69a','white-space':'nowrap','text-indent':'10px'}">{{scope.row.xsnum}}</div>
                  </div>
                  <div v-show="showProperty !== 'xsnum'">{{scope.row.xsnum}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="xsarea"
                label="销售面积(万㎡)"
                align="center"
                >
                <template slot-scope="scope">
                  <div v-show="showProperty === 'xsarea'" style="width:100%;height:100%;text-align:left">
                    <div :style="{'width':(scope.row.xsarea / maxNum * 100) + '%','background':'#52b69a','white-space':'nowrap','text-indent':'10px'}">{{scope.row.xsarea}}</div>
                  </div>
                  <div v-show="showProperty !== 'xsarea'">{{scope.row.xsarea}}</div>
                </template>
              </el-table-column>
               <el-table-column
                prop="ave"
                label="销售均价(元/㎡)"
                align="center"
                sortable
                >
                <template slot-scope="scope">
                  <div v-show="showProperty === 'ave'" style="width:100%;height:100%;text-align:left">
                    <div :style="{'width':(scope.row.ave / maxNum * 100) + '%','background':'#52b69a','white-space':'nowrap','text-indent':'10px'}">{{scope.row.ave}}</div>
                  </div>
                  <div v-show="showProperty !== 'ave'">{{scope.row.ave}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="xsamount"
                label="销售总价(万元)"
                align="center"
                sortable
                >
                <template slot-scope="scope">
                  <div v-show="showProperty === 'xsamount'" style="width:100%;height:100%;text-align:left">
                    <div :style="{'width':(scope.row.xsamount / maxNum * 100) + '%','background':'#52b69a','white-space':'nowrap','text-indent':'10px'}">{{scope.row.xsamount}}</div>
                  </div>
                  <div v-show="showProperty !== 'xsamount'">{{scope.row.xsamount}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="clnum"
                label="存量套数(套)"
                align="center"
                sortable
                >
                <template slot-scope="scope">
                  <div v-show="showProperty === 'clnum'" style="width:100%;height:100%;text-align:left">
                    <div :style="{'width':(scope.row.clnum / maxNum * 100) + '%','background':'#52b69a','white-space':'nowrap','text-indent':'10px'}">{{scope.row.clnum}}</div>
                  </div>
                  <div v-show="showProperty !== 'clnum'">{{scope.row.clnum}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="clarea"
                label="存量面积(万㎡)"
                align="center"
                sortable
                >
                <template slot-scope="scope">
                  <div v-show="showProperty === 'clarea'" style="width:100%;height:100%;text-align:left">
                    <div :style="{'width':(scope.row.clarea / maxNum * 100) + '%','background':'#52b69a','white-space':'nowrap','text-indent':'10px'}">{{scope.row.clarea}}</div>
                  </div>
                  <div v-show="showProperty !== 'clarea'">{{scope.row.clarea}}</div>
                </template>
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
          buildInfo:{},
          date:[],
          propForm:null,
          showLoading:false,
          showLittleMap:false,
          showRegionInfo:false,
          showProjectDetail:false,
          maxNum:0,
          chooseKind:'region',
          showProperty:'',
          showMap:false,
          formInline:{
                kind:'region',
                startDate:'',
                endDate:'',
                propertyTypes:'house',
                buildForms:'',
                status:'sub',
                page:1,
                limit:99999
            },
            statusArr:[{
              label:'认购',
              value:'sub'
            },{
              label:'备案',
              value:'record'
            }],
            regionArr:[],
            indicators:[],
            indicator:'xzarea',
            propertyArr:[],
            buildArr:[],
            propertyType:['house'],
            buildForm:[],
            tableData:[],
            tableHeight:550,
            totalPage:0,
            chartData:[],
            regionData:[],
            indicatorsArr:[],
            showRegionDetail:false,
            isShowEcharts:false,
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
        indicators(newVal){
           this.formInline.indicators = newVal.join(',')
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
      exportExcel(){
        let url = `${process.env.BASE_URL}/dms/sc/building/newhouse/export?modelType=region_count&expPage=${this.showRegionDetail?'second':'first'}&token=${localStorage.getItem('token')}`
        window.open(url)
      },
      closeWindow(){
        this.showLittleMap = false
      },
      indicatorChange(val){
        this.hotList()
      },
      headerClick(column){
        this.showProperty = column.property
        let max = Math.max(...this.tableData.map(item=>item[column.property]))
        this.maxNum = max
      },
      getViewList(){
          this.showLoading = true
          House.getTable(this.formInline).then(res=>{
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
            this.tableData = res.data.data.list
            this.totalPage = res.data.data.total
            this.showRegionDetail = false
            this.hotList()
            this.showLoading = false
          })
        },
      hotList(){
        let map = this.tableData
        console.log(map.filter(item=>item.code))
        let data = map.filter(item=>item.code.indexOf(',') === -1)
        let arr = ["match", ["get", "id"]]
        let colors = ['#f07605', '#f27a11', '#f27e18', '#f58320', '#f58625', '#f7862a', '#f78b31', '#f78d36', '#fa913c', '#fa9441', '#fc9e4c', '#fc9e4c', '#fca253', '#ffa759', '#ffa95e', '#ffac63', '#ffb06b', '#ffb370', '#ffb875', '#ffbc7d', '#ffbe82', '#ffc48a', '#ffc78f', '#ffcb96', '#ffcf9c', '#ffd3a3', '#ffd7a8', '#ffdab0', '#ffdfb8', '#ffe2bd', '#ffe7c4', '#ffebcc']
        console.log(data)
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
        if(this.chooseKind === 'region'){
          if(data.length === 0){
            this.houseDataMap.setPaintProperty('plate_fill',"fill-color", 'rgba(0,0,0,0)')
            return
          }
          data.forEach(item=>{
            arr.push(item.code)
            let i = Math.floor((max-item[this.indicator]) / diff)
            if(i > 31) i = 31
            arr.push(colors[i])
          })
          arr.push('rgba(0,0,0,0)')
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
      cellStyle(row, column, rowIndex, columnIndex){
      if(row.column.label === '区域'){
            return 'color:#fcbf49;font-weight:700;cursor:pointer'
           }
        },
      cellClick(row, column, cell, event){
          if(column.label === '区域'){
              this.showRegionDetail = true;
              this.showLoading = true
              if(this.formInline.kind === 'region'){
                let form = {regionnos:row.code,...this.formInline}
                House.getRegionDetail(form).then(res=>{
                  this.showLoading = false
                  let data =  res.data.data.list
                  data.forEach(item=>{item.showPopover = false})
                  this.regionData = data
                })
              }else if(this.formInline.kind === 'part'){
                let form = {partnos:row.code,...this.formInline}
                  House.getRegionDetail(form).then(res=>{
                  this.showLoading = false
                  let data =  res.data.data.list
                  data.forEach(item=>{item.showPopover = false})
                  this.regionData = data
                })
              }
            }
        },
        back(){
           this.showRegionDetail = false
        },
        pageChange(i){
          this.formInline.page=i;
          this.getViewList()
        },
        getNowMonth(){
          let date = new Date()
          let year = date.getFullYear()
          let month = date.getMonth() + 1 < 10?'0' +  (date.getMonth() + 1):date.getMonth() + 1
          this.date = ['2021-01-01',`${year}-${month}-01`]
        }

    },
    created(){
        this.getNowMonth()
        House.getDict('region_type').then(res=>this.regionArr = res.data.data)
        House.getDict('property_type_newhouse').then(res=>this.propertyArr = res.data.data)
        House.getDict('build_form_newhouse').then(res=>this.buildArr = res.data.data)
        House.getDict('statistical_indicators').then(res=>this.indicatorsArr = res.data.data)
        this.tableHeight = window.innerHeight * 0.9
    },
    mounted(){
      setTimeout(_=>{
        this.houseDataMap.flyTo({
            center:[103.7157969744969,30.76129397743849],
            zoom: 8.5,
        })
        // this.houseDataMap.setLayoutProperty('plates_fill',"visibility", 'visible')
        // this.houseDataMap.setLayoutProperty('plate_line',"visibility", 'visible')
        // this.houseDataMap.setLayoutProperty('plate_labels',"visibility", 'visible')
        // this.houseDataMap.setLayoutProperty('plate_fill',"visibility", 'visible')
        // this.houseDataMap.setLayoutProperty('plates_line',"visibility", 'visible')
        // this.houseDataMap.setLayoutProperty('plates_labels',"visibility", 'visible')
        // this.houseDataMap.setPaintProperty('plates_fill',"fill-color", '#fcbf49')
        // this.houseDataMap.setPaintProperty('plate_fill',"fill-color", '#fcbf49')
        this.getViewList()
        console.log(this.$parent.dimension)
        this.houseDataMap.on('click','plates_fill',e=>{
            if(this.$parent.dimension === 'QH'){
              this.propForm = {
                    type:'QH',
                    kind:'part',
                    part:e.features[0].properties.id,
                    center:[e.lngLat.lng,e.lngLat.lat],
                    sort:this.indicator,
                    form:this.formInline
                  }
              this.showLittleMap = true;
            }
        })
        this.houseDataMap.on('click','plate_fill',e=>{
          if(this.$parent.dimension === 'QH'){
            this.propForm = {
              type:'QH',
              kind:'region',
              region:e.features[0].properties.id,
              center:[e.lngLat.lng,e.lngLat.lat],
              sort:this.indicator,
              form:this.formInline
            }
            this.showLittleMap = true;
          }
        })
      },2000)
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
<!--popover样式 -->
<style>
.buildInfo_wrap{
    background: rgba(0,0,0,0.8)!important;
    color:white;
    border-radius: 8px;
  }
</style>
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
        ::v-deep .el-range__close-icon{
          display: none;
        }
        ::v-deep .el-form-item__label{
          color:#fcbf49;
          font-weight: 700;
          
        }
        ::v-deep .el-range-input{
          color: #fcbf49;
          font-weight: 700;
        }
        ::v-deep .el-date-editor--monthrange{
           width: 222px!important;
        }
        ::v-deep .el-date-editor--daterange{
            width: 222px!important;
        }
        ::v-deep .el-range-input{
            background: transparent;
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