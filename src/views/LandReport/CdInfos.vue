<template>
  <!-- 竞品市场-竞品信息 -->
  <div class="cd_info_wrap">
    <div class="cd_info">
      <div class="cd_select">
        <el-button v-if="isEdit" type="primary" size="mini" @click="reselectCd()">重选竞品</el-button>
        <el-button v-if="isEdit" type="success" size="mini" @click="submitCdInfo()">信息保存</el-button>
      </div>
      
      <div class="map_boxs">
        <!-- <Map :mapType="'cdinfo'" @setMapObj="setMap" /> -->
        <CdSelect :showCdSelect="showCdSelect" :reportId="reportId" @cdInfoSub="freshCd" />
      </div>
      <div class="table_wrap">
        <el-table
          height="100%"
          :data="cdInfos"
          border stripe
          @row-dblclick="tableInfoModify"
          style="width: 100%;text-align:center;">
          <el-table-column
            prop="buildingName"
            label="项目名称">
          </el-table-column>
          <el-table-column
            prop="typeNames"
            label="物业类型">
          </el-table-column>
          <el-table-column
            prop="saleDate"
            label="首次开盘时间">
            <template slot-scope="scope">
              <el-form :model="scope.row">
                <el-form-item size="mini">
                  <el-input v-if="scope.row.edit" v-model="scope.row.saleDate" maxlength="15"></el-input>
                  <span v-else>{{scope.row.saleDate}}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            prop="volumeArea"
            label="总体量">
            <template slot-scope="scope">
              <el-form :model="scope.row">
                <el-form-item size="mini">
                  <el-input v-if="scope.row.edit" v-model="scope.row.volumeArea" maxlength="15"></el-input>
                  <span v-else>{{scope.row.volumeArea}}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            prop="volumeRatio"
            label="容积率">
            <template slot-scope="scope">
              <el-form :model="scope.row">
                <el-form-item size="mini">
                  <el-input v-if="scope.row.edit" v-model="scope.row.volumeRatio" maxlength="15"></el-input>
                  <span v-else>{{scope.row.volumeRatio}}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import LandReportApi from '@/api/LandReportApi_zlq'
import Map from "@/views/LandReport/ReportAddMap"
import CdSelect from '@/views/LandReport/CdSelect'
export default {
  name: "cdinfos",
  props:{
    reportId:{
      type:String,
      default:'1306841780423069697'
    },
    isEdit:{ //是否为编辑状态
      type:Boolean,
      default:true
    }
  },
  components: {
    Map,CdSelect
  },
  data() {
    return {
      cdInfos:[],//竞品信息
      showCdSelect:false,//显示竞品选择界面
    };
  },
  mounted() {
    this.getCdInfos()
    setTimeout(() => {
      this.addIconLayer()
    }, 2500);
  },
  computed: {
    ...mapGetters(['CD_map']),
  },
  watch: {},
  methods: {
    //双击修改表格数据
    tableInfoModify(row,event,column){
      if(this.isEdit){
        row.edit = !row.edit
      }
    },
    //竞品信息上传
    submitCdInfo(){
      var that = this
      let arr = []
      this.cdInfos.forEach(item=>{
        let obj = {
          id:item.id
        }
        if(item.saleDate){
          obj.saleDate = item.saleDate
        }
        if(item.volumeArea){
          obj.volumeArea = item.volumeArea
        }
        if(item.volumeRatio){
          obj.volumeRatio = item.volumeRatio
        }
        if(item.saleDate||item.volumeArea||item.volumeRatio){
          arr.push(obj)
        }
      })
      LandReportApi.saveCd(arr)
      .then(res=>{
        if(res.data.code===0){
          that.$message.success('信息已更新')
        }else{
          that.$message.error('信息更新失败')
        }
      })
    },
    //更新竞品信息
    freshCd(){
      this.showCdSelect = false
      let map = this.CD_map
      let cdSource = map.getSource('cdSource')
      if(cdSource!==undefined){
        map.setLayoutProperty('cd_layer','visibility','visible')
        this.getCdInfos()
      }
    },
    //重新选择竞品
    reselectCd(){
      this.showCdSelect = true
      let map = this.CD_map
      let cdSource = map.getSource('cdSource')
      if(cdSource!==undefined){
        map.setLayoutProperty('cd_layer','visibility','none')
      }
    },
    //竞品信息
    getCdInfos(){ 
      var that = this
      LandReportApi.getCDinfos({reportId:that.reportId})
      .then(res=>{
        if(res.data.code===0){
          let data = res.data.data
          data.forEach(item=>{
            item.edit = false
          })
          that.cdInfos = data
          console.log('竞品信息',data)
          if(data.length>1){ //已选择竞品
            this.showCdSelect = false 
            setTimeout(() => {
              this.setCdLayer(data)
            }, 2500);
          }else{ //未选择竞品
            this.showCdSelect = true
          }
        }
      })
    },
    //地图上添加本项目与竞品图层
    setCdLayer(data){
      if(data.length>0){
        let map = this.CD_map
        let geojson = {
          type:'FeatureCollection',
          features:[]
        }
        data.forEach(item=>{
          let coord = item.coordinates.split(',')
          geojson.features.push({
            type:'Feature',
            geometry:{
              type:'Point',
              coordinates:coord
            },
            properties:{
              name:item.buildingName,
              buildingId:item.buildingId,
              icon:item.buildingId=='0'?'icon_cur':'icon_cd'
            }
          })
          if(item.buildingId=='0'){
            map.flyTo({
              center: coord,
              zoom: 13,
              speed: 1.5,
              curve: 1
            })
          }
        })
        let cdSource = map.getSource('cdSource')
        if(cdSource===undefined){
          map.addSource('cdSource',{
            type:'geojson',
            data:{
              type:'FeatureCollection',
              features:[]
            }
          })
          map.addLayer({
            id:'cd_layer',
            source:'cdSource',
            type:'symbol',
            layout: {
              "icon-image": "{icon}",
              "text-field": "{name}",
              "icon-size":0.5,
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 1.2],
              "text-anchor": "top",
              "text-size":13,
              "text-allow-overlap": true,
              "icon-allow-overlap":true,
              "icon-ignore-placement":true
            },
            paint:{
              "text-color":"#ff7f4e"
            }
          })
        }
        map.getSource('cdSource').setData(geojson)
      }
    },
    //添加图标图层
    addIconLayer(){
      let map = this.CD_map
      map.loadImage("http://47.104.165.136:8099/test/D2D/icons/star.png", (error, icon_star) => {
        if (error) throw error;
        map.addImage("icon_cur", icon_star);
      })
      map.loadImage("http://47.104.165.136:8099/test/D2D/icons/isCircle.png", (error, icon_cd) => {
        if (error) throw error;
        map.addImage("icon_cd", icon_cd);
      })
      
    },
    //表格样式
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
  },
};
</script>
<style lang="scss" scope>
.cd_info_wrap {
  width: 98%;
  height: 96%;
  padding: 1%;
  z-index: 0;
  overflow: hidden;
  position: relative;
  .cd_info{
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    .cd_select{
      position: absolute;
      right: 20px;
      bottom: 10px;
      z-index: 9;
    }
    .map_boxs{
      width: 56%;
      height: 100%;
    }
    .table_wrap{
      width: 43%;
      height: 96%;
      overflow-y: scroll;
      .el-form-item{
        margin-bottom: 0;
      }
    }
  }
  .select_wrap{
    width: 100%;
    height: 100%;
    position: relative;
    transition: all 0.3s;
    left: -100%;
  }
}
</style>
