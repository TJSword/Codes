<template>
  <!-- 条件分析配置 -->
  <div class="condition_optionWrap">
    <Loading :loadingText="'LOADING'" v-if="loadingShow" style="top:93px" />
    <div class="option_wrap">
      <div class="opton_btn" v-if="plateFilter == 'filterCreat'">
        <el-link type="primary" @click="saveFilter()">保存分析</el-link>
        <el-link type="danger" @click="resetFilter()" style="margin-left:20px;">重置条件</el-link>
      </div>
      <el-tabs type="card" v-model="plateFilter" @tab-click="filterTabChange">
        <el-tab-pane label="新建分析" name="filterCreat">
          <el-scrollbar class="menu_scroll">
            <div class="filter_wrap">
              <!-- 筛选器 -->
              <div class="filter_item" v-for="(item, index) in filterArr" :key="index">
                <div class="tip_point" :style="{background: item.itemCode == null ? '#a9a9a9' : '#4abd10'}"></div>
                <div class="input_wrap">
                  <div class="text">{{ index + 1 }}</div>
                  <div class="el_box">
                    <el-popover :ref="'conditionPopover'+index" placement="bottom-start" width="220" trigger="click">
                      <div class="treeWrap">
                        <el-tree
                          class="filterItemTree"
                          :filter-node-method="filterNode"
                          :data="gradeTree"
                          :props="defaultProps"
                          ref="filterItemTree"
                          node-key="itemCode"
                          :expand-on-click-node="false"
                          accordion
                          @node-click="chooseTagItem"
                        ></el-tree>
                        <!-- 土地市场额外筛选条件 -->
                        <div class="showExtend" v-if="extendFlag!==null">
                          <div class="scExtend" v-if="extendFlag==='sc'">
                            <div class="condition">
                              <div>物业类型：</div>
                              <el-radio-group v-model="item.wylx" @change="handleCheck_wylx">
                                <el-radio :label="cur.value" v-for="(cur,i) in wylxArr" :key="i">{{cur.label}}</el-radio>
                              </el-radio-group>
                            </div>
                            <div class="condition" v-if="jzxtArr.length>0">
                              <el-checkbox :indeterminate="item.isInd_jzxt" v-model="item.checkAll_jzxt" @change="handleCheckAll_jzxt">建筑形态</el-checkbox>
                              <el-checkbox-group v-model="item.jzxt" @change="checkChange_jzxt">
                                <el-checkbox v-for="(cur,i) in jzxtArr" :label="cur.value" :key="i">{{cur.label}}</el-checkbox>
                              </el-checkbox-group>
                            </div>
                            <div class="condition" v-if="mjdArr.length>0">
                              <el-checkbox :indeterminate="item.isInd_mjd" v-model="item.checkAll_mjd" @change="handleCheckAll_mjd">面积段</el-checkbox>
                              <el-checkbox-group v-model="item.mjd" @change="checkChange_mjd">
                                <el-checkbox v-for="(cur,i) in mjdArr" :label="cur.value" :key="i">{{cur.label}}</el-checkbox>
                              </el-checkbox-group>
                            </div>
                            <div class="condition">
                              <label for="">年份：</label>
                              <el-date-picker
                              v-model="item.year"
                              type="year"
                              size="mini"
                              placeholder="选择年"
                              format="yyyy 年"
                              value-format="yyyy">
                            </el-date-picker>
                            </div>
                            <el-button type="primary" size="mini" @click="closeExtend()" style="margin-top:10px">确认</el-button>
                          </div>
                          <div class="tdExtend" v-if="extendFlag==='td'">
                            <div class="condition">
                              <el-checkbox :indeterminate="item.isInd_crfs" v-model="item.checkAll_crfs" @change="handleCheckAll_crfs">出让方式</el-checkbox>
                              <el-checkbox-group v-model="item.crfs" @change="checkChange_crfs">
                                <el-checkbox v-for="(cur,i) in crfsArr" :label="cur.value" :key="i">{{cur.label}}</el-checkbox>
                              </el-checkbox-group>
                            </div>
                            <div class="condition">
                              <el-checkbox :indeterminate="item.isInd_tdyt" v-model="item.checkAll_tdyt" @change="handleCheckAll_tdyt">土地用途</el-checkbox>
                              <el-checkbox-group v-model="item.tdyt" @change="checkChange_tdyt">
                                <el-checkbox v-for="(cur,i) in tdytArr" :label="cur.value" :key="i">{{cur.label}}</el-checkbox>
                              </el-checkbox-group>
                            </div>
                            <div class="condition">
                              <label for="">年份：</label>
                              <el-date-picker
                              v-model="item.year"
                              type="year"
                              size="mini"
                              placeholder="选择年"
                              format="yyyy 年"
                              value-format="yyyy">
                            </el-date-picker>
                            </div>
                            <el-button type="primary" size="mini" @click="closeExtend()" style="margin-top:10px">确认</el-button>
                          </div>
                        </div>
                      </div>
                      <el-input
                        size="mini"
                        placeholder="点击选择或搜索选择"
                        @focus="getCurIndex(index)"
                        @input="treeFilter(index)"
                        slot="reference"
                        v-model="item.name"
                        clearable
                      >
                      </el-input>
                    </el-popover>
                  </div>
                  <div class="range_value">范围：
                    <span style="color: #67c23a;font-weight: bold;">{{ item.range[0] }} - {{ item.range[1] }}</span>
                  </div>
                </div>
                <div class="slider_wrap">
                  <!-- <div class="text">范围</div> -->
                  <el-slider
                    class="slider_item"
                    v-model="item.range"
                    range
                    :max="item.maxVal"
                    :disabled="item.itemCode === null"
                    @change="filterRangeChange()"
                  >
                  </el-slider>
                </div>
              </div>
              <!-- <div class="add_filter">
                <i class="el-icon-plus"></i>
              </div> -->
            </div>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="我的分析" name="myFilters">
          <div class="myTags_wrap">
            <el-table
              :data="
                myFilterTags.filter(
                  data =>
                    !myTagSearchVal ||
                    data.name
                      .toLowerCase()
                      .includes(myTagSearchVal.toLowerCase())
                )
              "
              border
              style="width: 100%"
              height="100%"
              :header-cell-style="{ background: '#0c1015', color: '#c4d0de' }"
              :row-class-name="tableRowClassName"
              @expand-change="showFilterInfo"
            >
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <div class="down_info">
                    <!-- 标签选项 -->
                    <div class="info_item" v-for="(item, index) in scope.row.conditions" :key="index">
                      <el-tag size="medium" :disable-transitions="false">{{ item.itemname }}</el-tag>
                      <span style="margin-right:10px;">范围： {{ item.itemScore }}</span>
                      <span style="margin-right:10px;" v-if="item.year">年份： {{ item.year }}</span>
                      <span style="margin-right:10px;" v-if="item.propertyTypeName">物业类型： {{ item.propertyTypeName }}</span>
                      <span style="margin-right:10px;" v-if="item.buildFormsName">建筑形态： {{ item.buildFormsName }}</span>
                      <span style="margin-right:10px;" v-if="item.areaSizesName">面积段： {{ item.areaSizesName }}</span>
                      <span style="margin-right:10px;" v-if="item.sellTypesName">出让方式： {{ item.sellTypesName }}</span>
                      <span style="margin-right:10px;" v-if="item.landUsesName">土地用途： {{ item.landUsesName }}</span>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="名称" prop="name" align="left"></el-table-column>
              <el-table-column align="center" width="200">
                <template slot="header" slot-scope="">
                  <el-input
                    v-model="myTagSearchVal"
                    size="mini"
                    placeholder="搜索"
                    clearable
                  />
                </template>
                <template slot-scope="scope">
                   <el-link type="primary" @click="tagApply(scope.$index, scope.row)">分析</el-link>
                   <el-link type="danger" @click="tagDelete(scope.$index, scope.row)" style="margin-left:20px;">删除</el-link>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="table_wrap">
      <ConditionTable :filterPlateData="filterPlateData" :filterTableHead="filterTableHead" />
    </div>
  </div>
</template>
<script>
//store
import { mapGetters } from "vuex";

//api
import analysistoolsApi from "@/api/analysistoolsApi"
import axios from 'axios'
//组件
import Loading from '@/components/tools/loading'
import ConditionTable from "../../common/ConditionTable";

export default {
  name: "conditionoption",
  props: {},
  components: {
    ConditionTable,
    Loading
  },
  data() {
    return {
      loadingShow:false,
      plateFilter: "filterCreat", //当前tab值
      //新建筛选
      filterArr: [  //筛选项
        { name: null, range: [0, 10], itemCode: null, maxVal: null,regionno:null,
          wylx:null,year:null,
          jzxt:[],isInd_jzxt:false,checkAll_jzxt:false,
          mjd:[],isInd_mjd:false,checkAll_mjd:false,
          crfs:[],isInd_crfs:false,checkAll_crfs:false,
          tdyt:[],isInd_tdyt:false,checkAll_tdyt:false
        },
        { name: null, range: [0, 10], itemCode: null, maxVal: null,regionno:null,
          wylx:null,year:null,
          jzxt:[],isInd_jzxt:false,checkAll_jzxt:false,
          mjd:[],isInd_mjd:false,checkAll_mjd:false,
          crfs:[],isInd_crfs:false,checkAll_crfs:false,
          tdyt:[],isInd_tdyt:false,checkAll_tdyt:false
        },
        { name: null, range: [0, 10], itemCode: null, maxVal: null,regionno:null,
          wylx:null,year:null,
          jzxt:[],isInd_jzxt:false,checkAll_jzxt:false,
          mjd:[],isInd_mjd:false,checkAll_mjd:false,
          crfs:[],isInd_crfs:false,checkAll_crfs:false,
          tdyt:[],isInd_tdyt:false,checkAll_tdyt:false
        },
        { name: null, range: [0, 10], itemCode: null, maxVal: null,regionno:null,
          wylx:null,year:null,
          jzxt:[],isInd_jzxt:false,checkAll_jzxt:false,
          mjd:[],isInd_mjd:false,checkAll_mjd:false,
          crfs:[],isInd_crfs:false,checkAll_crfs:false,
          tdyt:[],isInd_tdyt:false,checkAll_tdyt:false
        },
        { name: null, range: [0, 10], itemCode: null, maxVal: null,regionno:null,
          wylx:null,year:null,
          jzxt:[],isInd_jzxt:false,checkAll_jzxt:false,
          mjd:[],isInd_mjd:false,checkAll_mjd:false,
          crfs:[],isInd_crfs:false,checkAll_crfs:false,
          tdyt:[],isInd_tdyt:false,checkAll_tdyt:false
        },
        { name: null, range: [0, 10], itemCode: null, maxVal: null,regionno:null,
          wylx:null,year:null,
          jzxt:[],isInd_jzxt:false,checkAll_jzxt:false,
          mjd:[],isInd_mjd:false,checkAll_mjd:false,
          crfs:[],isInd_crfs:false,checkAll_crfs:false,
          tdyt:[],isInd_tdyt:false,checkAll_tdyt:false
        }
      ],
      gradeTree: [], //筛选条件
      defaultProps: {
        children: "children",
        label: "name"
      },
      filterIndex: null, //筛选条件索引
      filterPlateData: [], //根据条件筛选的板块数据
      filterTableHead:[],//表头数据
      filterConditions:[],//选择的条件
      //我的标签
      myFilterTags: [], //我的筛选标签
      myTagSearchVal: "", //我的标签筛选
      //土地市场额外筛选条件
      extendFlag:null,//附加条件
      wylxArr:[],//物业类型
      jzxtArrBackups:[],//建筑形态
      jzxtArr:[],
      mjdArrBackups:[],//面积段
      mjdArr:[],
      crfsArr:[],//出让方式
      tdytArr:[],//土地用途
      
      landMarketYear:null,//市场土地查询年份
    };
  },
  mounted() {
    let date = new Date()
    this.filterArr.forEach(item=>{
      item.year = JSON.stringify(date.getFullYear())
    })
    this.getMyFilterTags();
    this.getGeboGradeList();
    this.getMarketLandData()
    setTimeout(()=>{
      this.mapEvent()
    },2000)
  },
  watch: {
    
  },
  computed: {
    ...mapGetters(["curentPlate", "condition_map","plateData"])
  },
  methods: {
    mapEvent(){
      let map = this.condition_map
      var popup = new this.mbgl.Popup({
        closeButton: false,
        closeOnClick: false
      });
      map.on('mousemove','plate_fill',e=>{
        map.getCanvas().style.cursor = 'pointer';
        if(this.filterPlateData.length>0){
          let coordinates = [e.lngLat.lng,e.lngLat.lat];
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          } 
          let regionno = e.features[0].properties.regionno
          let cur = this.filterPlateData.filter(item=>item.regionno===regionno)[0]
          if(cur!==undefined){
            let popupHtml = `<p class="item_head">${cur.platename}</p>`
            for(let i=0;i<this.filterTableHead.length;i++){
              popupHtml += `<div class="item_name">${this.filterTableHead[i]}：<span class="item_val">${cur['data'+i]}</span></div>`
            }
            popup.setLngLat(coordinates)
            .setHTML(popupHtml)
            .addTo(map);
          }
        }
      })
      map.on("mouseleave", "plate_fill", e => {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });
    },
    getGeboGradeList(){ //筛选条件列表
      analysistoolsApi.getGradeList({type:"matrix"})
      .then(res=>{
        console.log('筛选条件列表',res)
        if(res.data.code===0){
          let tree = res.data.data[0].children
          this.gradeTree = tree
        }
      })
    },
    getMarketLandData(){ //获取市场土地菜单数据
      //物业类型
      analysistoolsApi.getTypeDict('property_type')
      .then(res=>{
        console.log('物业类型',res)
        if(res.data.code===0){
          this.wylxArr = res.data.data
        }
      })
      //建筑形态
      analysistoolsApi.getTypeDict('build_form')
      .then(res=>{
        console.log('建筑形态',res)
        if(res.data.code===0){
          this.jzxtArrBackups = res.data.data
        }
      })
      //面积段
      analysistoolsApi.getTypeDict('area_size')
      .then(res=>{
        console.log('面积段',res)
        if(res.data.code===0){
          this.mjdArrBackups = res.data.data
        }
      })
      //出让方式
      analysistoolsApi.getTypeDict('sell_type')
      .then(res=>{
        console.log('出让方式',res)
        if(res.data.code===0){
          this.crfsArr = res.data.data
        }
      })
      //土地用途
      analysistoolsApi.getTypeDict('land_use')
      .then(res=>{
        console.log('土地用途',res)
        if(res.data.code===0){
          this.tdytArr = res.data.data
        }
      })
    },
    handleCheck_wylx(val){ //物业类型单选
      if(val==='house'){
        this.jzxtArr = this.jzxtArrBackups.filter(item=>item.remark===val)
      }else{
        this.jzxtArr = []
      }
      if(val==='house'||val==='praetorium'){
        this.mjdArr = this.mjdArrBackups.filter(item=>item.remark==='house')
      }else{
        this.mjdArr = this.mjdArrBackups.filter(item=>item.remark==='nohouse')
      }
    },
    handleCheckAll_jzxt(val){
      let arr = []
      this.jzxtArr.forEach(item=>{arr.push(item.value)})
      this.filterArr[this.filterIndex].jzxt = val ? arr : [];
      this.filterArr[this.filterIndex].isInd_jzxt = false;
    },
    checkChange_jzxt(val){
      let arr = []
      this.jzxtArr.forEach(item=>{arr.push(item.value)})
      this.filterArr[this.filterIndex].checkAll_jzxt = val.length === arr.length;
     this.filterArr[this.filterIndex].isInd_jzxt = val.length > 0 && val.length < arr.length;
    },
    handleCheckAll_mjd(val){
      let arr = []
      this.mjdArr.forEach(item=>{arr.push(item.value)})
      this.filterArr[this.filterIndex].mjd = val ? arr : [];
      this.filterArr[this.filterIndex].isInd_mjd = false;
    },
    checkChange_mjd(val){
      let arr = []
      this.mjdArr.forEach(item=>{arr.push(item.value)})
      this.filterArr[this.filterIndex].checkAll_mjd = val.length === arr.length;
      this.filterArr[this.filterIndex].isInd_mjd = val.length > 0 && val.length < arr.length;
    },
    handleCheckAll_crfs(val){
      let arr = []
      this.crfsArr.forEach(item=>{arr.push(item.value)})
      this.filterArr[this.filterIndex].crfs = val ? arr : [];
      this.filterArr[this.filterIndex].isInd_crfs = false;
    },
    checkChange_crfs(val){
      let arr = []
      this.crfsArr.forEach(item=>{arr.push(item.value)})
      this.filterArr[this.filterIndex].checkAll_crfs = val.length === arr.length;
      this.filterArr[this.filterIndex].isInd_crfs = val.length > 0 && val.length < arr.length;
    },
    handleCheckAll_tdyt(val){
      let arr = []
      this.tdytArr.forEach(item=>{arr.push(item.value)})
      this.filterArr[this.filterIndex].tdyt = val ? arr : [];
      this.filterArr[this.filterIndex].isInd_tdyt = false;
    },
    checkChange_tdyt(val){
      let arr = []
      this.tdytArr.forEach(item=>{arr.push(item.value)})
      this.filterArr[this.filterIndex].checkAll_tdyt = val.length === arr.length;
      this.filterArr[this.filterIndex].isInd_tdyt = val.length > 0 && val.length < arr.length;
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "row2";
      } else if (rowIndex % 2 === 1) {
        return "row1";
      }
      return "";
    },
    filterTabChange() {
      //tab切换
      if(this.plateFilter == "myFilters"){
        this.getMyFilterTags()
      }
    },
    resetFilter() {
      //重置筛选项
      this.filterArr.forEach(item => {
        item.name = null;
        item.range = [0, 10];
        item.itemCode = null;
        item.maxVal = null;
        regionno = null;
        item.wylx=null;item.year=null;
        item.jzxt=[];item.isInd_jzxt=false;item.checkAll_jzxt=false;
        item.mjd=[];item.isInd_mjd=false;item.checkAll_mjd=false;
        item.crfs=[];item.isInd_crfs=false;item.checkAll_crfs=false;
        item.tdyt=[];item.isInd_tdyt=false;item.checkAll_tdyt=false
      });
      console.log(this.filterArr);
    },
    saveFilter() {
      //保存筛选项
      this.$prompt("请输入分析名称",{
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          let obj = {
            name: value,
            conditions: this.filterConditions,
            results:this.filterPlateData
          };
          let turArr = this.filterArr.filter(item => {
            return item.itemCode != null;
          });

          if (turArr.length > 0) {
            analysistoolsApi.saveFilters(obj)
            .then(res=>{
              console.log(res)
              if(res.data.code===0){
                this.$message("保存成功");
              }else{
                this.$message("保存失败");
              }
            })
          } else {
            this.$message("至少选择一个指标筛选项");
          }
        })
    },
    getCurIndex(index) {
      //获取筛选条件的索引
      this.filterIndex = index;
      this.extendFlag = null
      console.log(this.filterIndex);
    },
    chooseTagItem(data) {
      //选择筛选指标
      console.log(data);
      let i = this.filterIndex;
      let curItem = this.filterArr.filter(item => {
        return item.itemCode === data.itemCode;
      });
      if (curItem.length > 0) {
        //已存在选择的筛选项
        this.$message("已选择该筛选项");
      } else {
        this.filterArr[i].name = data.name;
        this.filterArr[i].itemCode = data.itemCode;
        // this.filterArr[i].maxVal = data.max
        //   ? JSON.parse(Math.ceil(data.max))
        //   : null;
        // this.filterArr[i].range[1] = data.max
        //   ? JSON.parse(Math.ceil(data.max))
        //   : null;
        //选择的指标为土地市场时显示筛选条件
        let curType = data.itemCode.substring(0,4)
        if(curType==='BKSC'){
          this.extendFlag = 'sc'
          this.filterArr[i].wylx = this.wylxArr[0].value
          this.handleCheck_wylx(this.wylxArr[0].value)
          //清空土地条件
          this.filterArr[i].crfs = [];
          this.filterArr[i].isInd_crfs = false;
          this.filterArr[i].checkAll_crfs = false;
          this.filterArr[i].tdyt = [];
          this.filterArr[i].isInd_tdyt = false;
          this.filterArr[i].checkAll_tdyt = false
        }else if(curType==='BKTD'){
          this.extendFlag = 'td'
          //清空市场条件
          this.filterArr[i].wylx = null;
          this.filterArr[i].jzxt = [];
          this.filterArr[i].isInd_jzxt = false;
          this.filterArr[i].checkAll_jzxt = false;
          this.filterArr[i].mjd = [];
          this.filterArr[i].isInd_mjd = false;
          this.filterArr[i].checkAll_mjd = false;
        }else{
          this.extendFlag = null
          this.closeExtend()
          //清空土地市场条件
          this.filterArr[i].wylx = null;
          this.filterArr[i].year = null;
          this.filterArr[i].jzxt = [];
          this.filterArr[i].isInd_jzxt = false;
          this.filterArr[i].checkAll_jzxt = false;
          this.filterArr[i].mjd = [];
          this.filterArr[i].isInd_mjd = false;
          this.filterArr[i].checkAll_mjd = false;
          this.filterArr[i].crfs = [];
          this.filterArr[i].isInd_crfs = false;
          this.filterArr[i].checkAll_crfs = false;
          this.filterArr[i].tdyt = [];
          this.filterArr[i].isInd_tdyt = false;
          this.filterArr[i].checkAll_tdyt = false
          //获取最大值最小值
        }
        //获取符合条件的板块
        //this.getConformingPlates();
      }

      console.log(this.filterArr);
    },
    closeExtend(){ //关闭扩展选项及选择
      if(this.extendFlag!==null){
        this.extendFlag = null
      }
      if(this.filterIndex!==""){
        this.$refs['conditionPopover'+this.filterIndex][0].doClose()
        this.setConditionMinmax()
      }
    },
    treeFilter(i) {
      //树结构筛选
      let name = this.filterArr[i].name;
      this.$refs.filterItemTree[i].filter(name); //此处多个filterItemTree树结构，需指定索引去筛选节点
      console.log(this.filterArr);
      //内容清空时重置数据
      if (name == "") {
        let date = new Date()
        this.filterArr[i].name = null;
        this.filterArr[i].value = null;
        this.filterArr[i].range = [0, 10];
        this.filterArr[i].itemCode = null;
        this.filterArr[i].maxVal = null;
        this.filterArr[i].wylx = null;
        this.filterArr[i].year = JSON.stringify(date.getFullYear());
        this.filterArr[i].jzxt = [];
        this.filterArr[i].isInd_jzxt = false;
        this.filterArr[i].checkAll_jzxt = false;
        this.filterArr[i].mjd = [];
        this.filterArr[i].isInd_mjd = false;
        this.filterArr[i].checkAll_mjd = false;
        this.filterArr[i].crfs = [];
        this.filterArr[i].isInd_crfs = false;
        this.filterArr[i].checkAll_crfs = false;
        this.filterArr[i].tdyt = [];
        this.filterArr[i].isInd_tdyt = false;
        this.filterArr[i].checkAll_tdyt = false
        this.filterPlateData = [];
        this.filterTableHead = [];
        this.getConformingPlates()
      }
    },
    setConditionMinmax(){ //设置条件的最大值最小值
      let curFilter = this.filterArr[this.filterIndex]
      let itemCode = curFilter.itemCode
      let curType = itemCode.substring(0,4)
      let obj = {
        itemCode:itemCode
      }
      if(curType==='BKSC'){
        if(curFilter.wylx!==null){
          obj.propertyType = curFilter.wylx
        }
        if(curFilter.jzxt.length>0){
          let build_form = ''
          curFilter.jzxt.forEach(item=>{build_form+=(item+',')})
          obj.buildForms = build_form
        }
        if(curFilter.mjd.length>0){
          let area_size = ''
          curFilter.mjd.forEach(item=>{area_size+=(item+',')})
          obj.areaSizes = area_size
        }
        if(curFilter.year!==null){
          obj.years = curFilter.year
        }
      }else if(curType==='BKTD'){
        if(curFilter.crfs.length>0){
          let sell_type = ''
          curFilter.crfs.forEach(item=>{sell_type+=(item+',')})
          obj.sellTypes = sell_type
        }
        if(curFilter.tdyt.length>0){
          let land_use = ''
          curFilter.tdyt.forEach(item=>{land_use+=(item+',')})
          obj.landUses = land_use
        }
        if(curFilter.year!==null){
          obj.years = curFilter.year
        }
      }
      analysistoolsApi.getConditionMinMax(obj)
      .then(res => {
        console.log(res)
        if(res.data.code===0){
          let info = res.data.data
          this.filterArr[this.filterIndex].maxVal = Math.ceil(info.maxscore)
          this.filterArr[this.filterIndex].range = [0,Math.ceil(info.maxscore)]
          this.getConformingPlates()
        }
      })
    },
    filterRangeChange() { //滑块滑动
      //获取符合条件的板块
      this.getConformingPlates();
    },
    filterNode(value, data) {
      if (!value) return true;
      if (data.name.indexOf(value) !== -1) {
        return true;
      }
      return false;
    },
    getConformingPlates() { //获取符合的板块
      let arr = []
      let last = null //最后一个条件的索引
      this.filterArr.forEach((item,index)=>{
        if(item.itemCode!==null){
          last = index
          let obj = {
            itemCode:item.itemCode,
            itemScore:item.range[0]+'-'+item.range[1]
          }
           //板块ID
          // let regionno = ''
          // if(this.filterArr.filter(f=>f.itemCode!==null).length===1){ //当只有一个条件时默认全部板块查询
          //   this.plateData.region_part.forEach(r=>{regionno+=(r.regionno+',')})
          // }else{
          //   if(item.regionno!==null){
          //     item.regionno.forEach(c=>regionno+=(c+','))
          //   }
          // }
          // obj.regionno = regionno

          if(item.wylx!==null){ //物业类型
            obj.propertyType = item.wylx
            if(item.jzxt.length>0){ //建筑形态
              let buildForms = ''
              item.jzxt.forEach(c=>buildForms+=(c+','))
              obj.buildForms = buildForms
            }
            if(item.mjd.length>0){ //面积段
              let areaSizes = ''
              item.mjd.forEach(c=>areaSizes+=(c+','))
              obj.areaSizes = areaSizes
            }
            if(item.year!==null){ //年份
              obj.year = item.year
            }
          }else if(item.crfs.length>0){ //出让方式
            let sellTypes = ''
            item.crfs.forEach(c=>sellTypes+=(c+','))
            obj.sellTypes = sellTypes
            if(item.tdyt.length>0){ //土地用途
              let landUses = ''
              item.tdyt.forEach(c=>landUses+=(c+','))
              obj.landUses = landUses
            }
            if(item.year!==null){ //年份
              obj.year = item.year
            }
          }
          arr.push(obj)
        }
      })
      console.log(arr)
      //存储条件保存使用
      this.filterConditions = arr
      //数据请求loading
      this.loadingShow = true
      analysistoolsApi.getFilterPlates(arr)
      .then(res=>{
        console.log(res)
        if(res.data.code===0){
          let curPlates = res.data.data.regionno
          this.setPlateFilter(curPlates)

          let tableData = res.data.data.result
          let arr = []
          //表头
          let headArr = []
          let fArr = this.filterArr.filter(item=>item.itemCode!==null)
          fArr.forEach(item=>{headArr.push(item.name)})
          //处理返回的数据
          Object.keys(tableData).forEach(key=>{
            if(curPlates.indexOf(key)!==-1){
              let cur = this.plateData.region_part.filter(f=>f.regionno===key)[0]
              let obj = {
                regionno:key,
                platename:cur.name,
              }
              for(let i=0;i<fArr.length;i++){
                obj['data'+i] = JSON.parse((tableData[key][fArr[i].itemCode]).toFixed(1))
              }
              arr.push(obj)
            }
          })
          this.filterPlateData = arr
          this.filterTableHead = headArr
          console.log(arr)
          this.loadingShow = false
        }else{
          this.$message("板块分析失败");
          this.loadingShow = false
        }
      })
    },
    //设置瓦片填充颜色
    setPlateFilter(data) {
      let map = this.condition_map
      var expression = ["match", ["get", "regionno"]];
      if (data == undefined || data.length == 0) {
        expression.push("rgba(58, 88, 125, 1)");
        expression.push("rgba(58, 88, 125, 1)");
      } else {
        data.forEach(item => {
          expression.push(item, "rgba(149, 149, 246,1)");
        });
      }
      expression.push("rgba(58, 88, 125, 1)");
      map.setPaintProperty("plate_fill", "fill-color", expression);
    },
    //我的标签
    getMyFilterTags() {
      analysistoolsApi.getUserFilters()
      .then(res => {
        if (res.data.code === 0) {
          console.log(res)
          let list = res.data.data.list
          list.forEach(item=>{item.conditions=null})
          this.myFilterTags = list;
        }
      });
    },
    tagApply(index,row){ //应用我的分析
      let filterTableHead = []
      if(row.conditions!==null){
        row.conditions.forEach(item=>{
          filterTableHead.push(item.itemname)
        })
        this.filterTableHead = filterTableHead
        analysistoolsApi.getFilterData(row.id)
        .then(res=>{
          console.log(res)
          if(res.data.code===0){
            let list = res.data.data
            this.filterPlateData = list;
            let arr = []
            list.forEach(item=>{arr.push(item.regionno)})
            this.setPlateFilter(arr)
          }else{
            this.$message('分析出错')
          }
        })
      }else{
        analysistoolsApi.getFilterCondition(row.id)
        .then(res=>{
          console.log(res)
          if(res.data.code===0){
            let conditions = res.data.data
            conditions.forEach(item=>{
              filterTableHead.push(item.itemname)
            })
            this.filterTableHead = filterTableHead
            analysistoolsApi.getFilterData(row.id)
            .then(res=>{
              console.log(res)
              if(res.data.code===0){
                let list = res.data.data
                this.filterPlateData = list;
                let arr = []
                list.forEach(item=>{arr.push(item.regionno)})
                this.setPlateFilter(arr)
              }else{
                this.$message('分析出错')
              }
            })
          }
        })
      }
      

      
    },
    showFilterInfo(row){ //展示分析条件
      console.log(row)
      if(row.conditions===null){
        analysistoolsApi.getFilterCondition(row.id)
        .then(res=>{
          console.log(res)
          if(res.data.code===0){
            let conditions = res.data.data
            //处理市场土地的条件
            conditions.forEach(item=>{
              if(item.itemcode.substring(0,4)==='BKTD'){
                //土地用途
                if(item.landUses){
                  let landUses = item.landUses.split(',')
                  let landUsesName = ''
                  this.tdytArr.forEach(tdyt=>{
                    if(landUses.indexOf(tdyt.value)!==-1){
                      landUsesName += (tdyt.label+',')
                    }
                  })
                  item.landUsesName = landUsesName
                }
                //出让方式
                if(item.sellTypes){
                  let sellTypes = item.sellTypes.split(',')
                  let sellTypesName = ''
                  this.crfsArr.forEach(crfs=>{
                    if(sellTypes.indexOf(crfs.value)!==-1){
                      sellTypesName += (crfs.label+',')
                    }
                  })
                  item.sellTypesName = sellTypesName
                }
              }else if(item.itemcode.substring(0,4)==='BKSC'){
                //物业类型
                if(item.propertyType){
                  this.wylxArr.forEach(wylx=>{
                    if(wylx.value===item.propertyType){
                      item.propertyTypeName=wylx.label
                    }
                  })
                }
                //建筑形态
                if(item.buildForms){
                  let buildForms = item.buildForms.split(',')
                  let buildFormsName = ''
                  this.jzxtArrBackups.forEach(jzxt=>{
                    if(buildForms.indexOf(jzxt.value)!==-1){
                      buildFormsName += (jzxt.label+',')
                    }
                  })
                  item.buildFormsName = buildFormsName
                }
                //面积段
                if(item.areaSizes){
                  let areaSizes = item.areaSizes.split(',')
                  let areaSizesName = ''
                  this.mjdArrBackups.forEach(mjd=>{
                    if(areaSizes.indexOf(mjd.value)!==-1){
                      areaSizesName += (mjd.label+',')
                    }
                  })
                  item.areaSizesName = areaSizesName
                }
              }
            })
            //更新我得分析数据
            this.myFilterTags.forEach(item=>{
              if(item.id===row.id){
                item.conditions = conditions
              }
            })
          }
        })
      }
      
    },
    tagDelete(index,row){ //删除我的分析
      console.log(index,row)
      this.$confirm('是否删除该分析?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        analysistoolsApi.deleteUserFilter(row.id)
        .then(res=>{
          if(res.data.code===0){
            this.$message('删除成功')
            this.getMyFilterTags()
          }else{
            this.$message('删除失败')
          }
        })
      }).catch(() => {
                
      });
    },
  }
};
</script>
<style lang="scss">
.treeWrap{
  position: relative;
  .showExtend{
    padding: 10px 20px;
    background: #fff;
    border-radius: 6px;
    position: absolute;
    left: 250px;
    top: -13px;
    z-index: 999;
    .condition{
      min-width: 330px;
      padding: 10px 0;
      border-bottom: #ececec 1px solid;
    }
  }
}
.condition_optionWrap {
  width: 100%;
  height: 100%;
  
  .el-tabs{
    height: 100%;
  }
  .el-tab-pane{
    height: 100%;
  }
  .el-tabs__header{
    height: 9.5%;
  }
  .el-tabs__content{
    height: 90.5%;
  }
  .option_wrap {
    width: 100%;
    height: 50%;
    position: relative;
    border-bottom: #383838 1px solid;
    .el-scrollbar {
      height: 100%;
    }
    .el-scrollbar__wrap {
      overflow-y: scroll;
      width: 101%;
      height: 111%;
    }
    .opton_btn {
      position: absolute;
      right: 10px;
      top: 9px;
      z-index: 999;
      .el-button {
        background: none;
      }
    }
    .filter_wrap {
      padding: 0 12px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      height: 340px;
      .filter_item:hover {
        box-shadow: rgba(0, 0, 0, 0.8) 0 0 20px;
      }
      .filter_item {
        width: 46%;
        padding: 10px 15px;
        border-radius: 4px;
        color: #fff;
        background: -webkit-gradient(
          linear,
          left top,
          right top,
          color-stop(0, #14202d),
          to(#14202d)
        );
        background: linear-gradient(to right, #14202d 0, #14202d 100%);
        margin-top: 13px;
        color: #9aa5bb;
        cursor: pointer;
        transition: all 0.5s;
        position: relative;
        .tip_point {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          cursor: pointer;
          right: 6px;
          top: 6px;
        }
        .text {
          margin-right: 10px;
          width: 20px;
          height: 20px;
          background: #6767c1;
          text-align: center;
          line-height: 20px;
          border-radius: 50%;
          color:#fff;
          font-weight: bold;
        }
        .input_wrap {
          display: flex;
          align-items: center;
          padding-top: 4px;
          .range_value {
            margin-left: 10px;
          }
          .el_box{
            width: 45%;
            
          }
        }
        .slider_wrap {
          display: flex;
          align-items: center;
          margin-top: 6px;
          .slider_item {
            width: 100%;
            margin-left: 10px;
            .el-slider__button {
              border: 4px solid #2c5077;
              width: 12px;
              height: 12px;
            }
            .el-slider__bar {
              background-color: #2c5077;
            }
            .el-slider__runway {
              background-color: #424b5f;
            }
          }
        }
        .el-input__inner {
          background: none;
          border: none;
          border-radius: 0;
          border-bottom: 1px solid #4d5a84;
          color: #9595f6;
        }
      }
      .add_filter {
        background-color: #fbfdff;
        border: 1px dashed #c0ccda;
        border-radius: 100%;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 70px;
        height: 70px;
        line-height: 70px;
        vertical-align: top;
        cursor: pointer;
        text-align: center;
        font-size: 30px;
        color: #777;
      }
      .add_filter:hover {
        border-color: #9595f6;
      }
    }
    .myTags_wrap {
      width: 100%;
      height: 100%;
      .down_info{
        display: flex;
        padding: 10px 20px 0 20px;
        flex-wrap: wrap;
        color: #e6a23c;
        .info_item{
          margin-right: 20px;
          margin-bottom: 10px;
          span{
            margin-right: 10px;
            
          }
        }
      }
      .el-table--enable-row-hover .el-table__body tr:hover>td{
        background-color: none;
      }
      .el-table--border{
        border: none;
      }
      .el-form-item__label {
        color: #9aa5bb;
      }
      .el-table tr,
      .el-table__expanded-cell {
        background: none;
      }
      .el-input__inner {
        background: none;
        border: 1px solid #263950;
      }
      .el-tag {
        background: none !important;
        border-color: #545454;
      }
      .el-tabs__header {
        margin: 0;
      }
      
      .el-table .cell{
        color: #d2e8ff;
      }
      .el-tabs__item {
        color: #c6cbd4;
      }
      .el-tabs__item.is-active {
        color: #9595f6;
      }
      .el-tabs--card > .el-tabs__header .el-tabs__nav {
        border: none;
      }
      .el-tabs--card > .el-tabs__header .el-tabs__item {
        border-left: none;
      }
      .el-tabs--card > .el-tabs__header {
        border-bottom: 1px solid #383838;
      }
      .el-table--border::after,
      .el-table--group::after,
      .el-table::before {
        content: "";
        position: absolute;
        background-color: #383838;
        z-index: 1;
      }
      .el-table td,
      .el-table th.is-leaf,
      .el-table--border,
      .el-table--group {
        border-color: #263950;
      }
      .el-table__body-wrapper {
        background: #040506;
      }
      .el-table .row1 {
        background: #000000;
      }
      .el-table .row2 {
        background: #101010;
      }
      .el-table td,
      .el-table th {
        padding: 4px 0;
      }
      .query_info {
        padding: 30px;
        color: #9aa5bb;
        .el-date-editor .el-range-input {
          background: none;
        }
      }
    }
  }
  .table_wrap {
    height: 50%;
    width: 100%;
    .el-table__body-wrapper{
      height: 88% !important;
    }
    .el-table th, .el-table tr {
      background-color: none;
    }
  }
  .el-tabs__item {
    color: #c6cbd4;
  }
  .el-tabs__item.is-active {
    color: #9595f6;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border: none;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__item {
    border-left: none;
  }
  .el-tabs--card > .el-tabs__header {
    border-bottom: 1px solid #383838;
    margin: 0;
  }
  .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
    border-bottom-color: #9595f6;
  }
}
@media screen and (max-width:1600px) {
  .filter_item{
    width: 45% !important;
  }
}
@media screen and (max-width:1366px) {
  .filter_item{
    width: 100% !important;
  }
}
</style>
