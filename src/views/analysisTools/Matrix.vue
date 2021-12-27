<template>
  <div class="matrix_wrap">
    <Loading :loadingText="'LOADING'" v-if="loadingShow" />
    <div class="header">
      <div class="axisItem" v-for="(item, index) in axisArr" :key="index">
        <span class="tip">{{ item.title }}</span>
        <el-popover :ref="'conditionPopover'+index" placement="bottom-start" width="220" trigger="click">
          <div class="treeWrap">
            <el-tree
              :data="gradeTree"
              :props="defaultProps"
              :filter-node-method="filterNode"
              :expand-on-click-node="false"
              accordion
              ref="matrixFilterTree"
              node-key="itemCode"
              @node-click="chooseTagItem"
            ></el-tree>
            <div class="showExtend" v-if="extendFlag!==null">
              <div class="scExtend" v-if="extendFlag==='sc'">
                <div class="condition">
                  <div for="">物业类型：</div>
                  <el-radio-group v-model="wylx" @change="handleCheck_wylx">
                    <el-radio :label="item.value" v-for="(item,i) in wylxArr" :key="i">{{item.label}}</el-radio>
                  </el-radio-group>
                </div>
                <div class="condition" v-if="jzxtArr.length>0">
                  <el-checkbox :indeterminate="isInd_jzxt" v-model="checkAll_jzxt" @change="handleCheckAll_jzxt">建筑形态</el-checkbox>
                  <el-checkbox-group v-model="jzxt" @change="checkChange_jzxt">
                    <el-checkbox v-for="(item,i) in jzxtArr" :label="item.value" :key="i">{{item.label}}</el-checkbox>
                  </el-checkbox-group>
                </div>
                <div class="condition" v-if="mjdArr.length>0">
                  <el-checkbox :indeterminate="isInd_mjd" v-model="checkAll_mjd" @change="handleCheckAll_mjd">面积段</el-checkbox>
                  <el-checkbox-group v-model="mjd" @change="checkChange_mjd">
                    <el-checkbox v-for="(item,i) in mjdArr" :label="item.value" :key="i">{{item.label}}</el-checkbox>
                  </el-checkbox-group>
                </div>
                <el-button type="primary" size="mini" @click="closeExtend()" style="margin-top:10px">确认</el-button>
              </div>
              <div class="tdExtend" v-if="extendFlag==='td'">
                <div class="condition">
                  <el-checkbox :indeterminate="isInd_crfs" v-model="checkAll_crfs" @change="handleCheckAll_crfs">出让方式</el-checkbox>
                  <el-checkbox-group v-model="crfs" @change="checkChange_crfs">
                    <el-checkbox v-for="(item,i) in crfsArr" :label="item.value" :key="i">{{item.label}}</el-checkbox>
                  </el-checkbox-group>
                </div>
                <div class="condition">
                  <el-checkbox :indeterminate="isInd_tdyt" v-model="checkAll_tdyt" @change="handleCheckAll_tdyt">土地用途</el-checkbox>
                  <el-checkbox-group v-model="tdyt" @change="checkChange_tdyt">
                    <el-checkbox v-for="(item,i) in tdytArr" :label="item.value" :key="i">{{item.label}}</el-checkbox>
                  </el-checkbox-group>
                </div>
                <el-button type="primary" size="mini" @click="closeExtend()" style="margin-top:10px">确认</el-button>
              </div>
            </div>
          </div>
          <el-input
            class="axisInput"
            placeholder="选择或搜索指标"
            slot="reference"
            @focus="axisIndex(index)"
            @input="treeFilter(index)"
            v-model="item.name"
            size="mini"
            style="max-width:150px"
            clearable
          >
          </el-input>
        </el-popover>
      </div>
      <div class="year_box">
        <el-date-picker
          :disabled="!yearShow"
          v-model="landMarketYear"
          type="year"
          placeholder="选择年"
          format="yyyy 年"
          value-format="yyyy">
        </el-date-picker>
      </div>
      <div class="colorBox">
        <div class="color_bar" 
        :style="{background:'linear-gradient(to right,'+circleColor[0]+','+circleColor[1]+','+circleColor[2]+')'}"></div>
        <div class="color_box">
          <span :style="{ marginLeft: '15px', color: circleColor[0] }">Min</span>
          <el-color-picker
            v-model="circleColor[0]"
            class="maxColor"
          ></el-color-picker>
          <span :style="{ marginLeft: '15px', color: circleColor[1] }">Mid</span>
          <el-color-picker
            v-model="circleColor[1]"
            class="midColor"
          ></el-color-picker>
          <span :style="{ marginLeft: '15px', color: circleColor[2] }">Max</span>
          <el-color-picker
            v-model="circleColor[2]"
            class="minColor"
          ></el-color-picker>
        </div>
      </div>
      <div class="plateBox">
        <div>板块：</div>
        <div :class="[curPlateType==='part'?'plate_item_cur':'plate_item']" @click="plateTypeChange('part')">通用板块</div> 
        <!-- <div :class="[curPlateType==='region'?'plate_item_cur':'plate_item']" @click="plateTypeChange('region')">行政区</div> -->
        
        <div class="plate_list" v-if="showPlateBox">
          <div class="plate_region" v-if="curPlateType==='region'">
            <el-checkbox :indeterminate="isRegionAll" v-model="regionAll" @change="handleRegionAll">全选</el-checkbox>
            <el-checkbox-group v-model="checkedRegions" @change="regionChange">
              <el-checkbox v-for="(item,index) in plateData.region" :label="item.regionno" :key="index">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="plate_part" v-if="curPlateType==='part'">
            <div class="part_item" v-for="(item,i) in partData" :key="i">
              <el-checkbox :indeterminate="item.isPartAll" v-model="item.partAll" @change="handlePartAll(i)">{{item.name}}</el-checkbox>
              <el-checkbox-group v-model="item.checkedParts" @change="partChange(i)">
                <el-checkbox v-for="(child,j) in item.children" :label="child.regionno" :key="j">{{child.name}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </div>
      <div class="check">
        <div class="demonstration"
          >象限：{{ check_num + "x" + check_num }}</div
        >
        <el-slider
          v-model="check_num"
          :show-tooltip="false"
          style="width:150px;margin-left:25px"
          show-stops
          :max="6"
          :min="2"
        >
        </el-slider>
      </div>

      <div class="btnBox">
        <el-tooltip placement="top">
          <div slot="content">Tips:当选择市场数据或土地数据时<br />选择板块数量会影响矩阵生成速度<br />请耐心等待</div>
          <el-button
            type="primary"
            size="mini"
            @click="getGeboQueryData()"
            >生成</el-button
          >
        </el-tooltip>
      </div>
    </div>
    <div id="geboChart" :style="{ width: '100%', height: '78%' }"></div>
    <div class="tagBox">
      <el-popover
        v-for="(item,index) in tagsList"
        :key="index"
        placement="top"
        trigger="hover">
        <div class="item_box">
          <div class="axis">x轴：{{item.itemX}}</div>
          <div class="axis">y轴：{{item.itemY}}</div>
          <div class="axis">圆大小：{{item.itemS?item.itemS:'暂无'}}</div>
          <div class="axis">圆颜色：{{item.itemC?item.itemC:'暂无'}}</div>
        </div>
        <el-tag 
        class="tag_item"
        slot="reference"
        size="middle"
        :effect="curTag==item.id?'dark':'plain'"
        closable 
        @click="tagSet(item.id)"
        @close="tagDelete(item.id)">{{item.name}}</el-tag>
      </el-popover>
    </div>
  </div>
</template>
<script>
//store
import { mapGetters } from "vuex";
//api
import analysistoolsApi from "@/api/analysistoolsApi"
//组件
import Loading from '@/components/tools/loading'

export default {
  name: "matrix",
  components:{
    Loading
  },
  data() {
    return {
      loadingShow:false,
      gradeTree:[],//评分树
      defaultProps: {
        children: "children",
        label: "name"
      },
      circleColor: [ //配置圆的颜色
        "#dd4444", "#ffffff", "#3e8ef7"
      ],
      axisCurIndex: "", //input focus时选择坐标系的索引
      axisArr: [
        //坐标系数据
        { title: "x坐标系：", value: null, name: null },
        { title: "y坐标系：", value: null, name: null },
        { title: "圆的大小：", value: null, name: null },
        { title: "圆的颜色：", value: null, name: null }
      ],
      axisData: [], //坐标系数据
      check_num: 2, //象限值
      screenHeight: window.innerHeight - 92, //屏幕高度减去顶层高度
      tagsList:[], //gebo 用户标签
      curTag:null, //当前tag ID
      curPlateType:'part',//当前板块类型
      showPlateBox:false,//显示板块列表

      checkedRegions:[],//选择的行政区ID
      regionAll: false,
      isRegionAll: true,

      partData:[],//通用板块数据

      extendFlag:null,//附加条件
      wylxArr:[],//物业类型
      wylx:null,
      jzxtArrBackups:[],//建筑形态
      jzxtArr:[],
      jzxt:[],
      isInd_jzxt:false,
      checkAll_jzxt:false,
      mjdArrBackups:[],//面积段
      mjdArr:[],
      mjd:[],
      isInd_mjd:false,
      checkAll_mjd:false,
      crfsArr:[],//出让方式
      crfs:[],
      isInd_crfs:false,
      checkAll_crfs:false,
      tdytArr:[],//土地用途
      tdyt:[],
      isInd_tdyt:false,
      checkAll_tdyt:false,
      
      landMarketYear:null,//市场土地查询年份
    };
  },
  created() {},
  mounted() {
    let date = new Date()
    this.landMarketYear = JSON.stringify(date.getFullYear())
    this.getPartData()
    this.getGeboTags('firstLoad')
    this.getGeboGradeList()
    this.getMarketLandData()
  },
  watch: {
    check_num: function() {
      this.GEBOInit();
    },
    circleColor: function() {
      this.GEBOInit();
    }
  },
  computed: {
    ...mapGetters(["plateData"]),
    yearShow(){
      return this.wylx!=null||this.jzxt.length>0||this.mjd.length>0||this.crfs.length>0||this.tdyt.length>0
    }
  },
  methods: {
    getMarketLandData(){ //获取市场土地菜单数据
      //物业类型
      analysistoolsApi.getTypeDict('property_type')
      .then(res=>{
        console.log('物业类型',res)
        if(res.data.code===0){
          this.wylxArr = res.data.data
          console.log(this.wylxArr)
        }
      })
      //建筑形态
      analysistoolsApi.getTypeDict('build_form')
      .then(res=>{
        console.log('建筑形态',res)
        if(res.data.code===0){
          this.jzxtArrBackups = res.data.data
          console.log(this.jzxtArr)
        }
      })
      //面积段
      analysistoolsApi.getTypeDict('area_size')
      .then(res=>{
        console.log('面积段',res)
        if(res.data.code===0){
          this.mjdArrBackups = res.data.data
          console.log(this.mjdArr)
        }
      })
      //出让方式
      analysistoolsApi.getTypeDict('sell_type')
      .then(res=>{
        console.log('出让方式',res)
        if(res.data.code===0){
          this.crfsArr = res.data.data
          console.log(this.crfsArr)
        }
      })
      //土地用途
      analysistoolsApi.getTypeDict('land_use')
      .then(res=>{
        console.log('土地用途',res)
        if(res.data.code===0){
          this.tdytArr = res.data.data
          console.log(this.tdytArr)
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
      this.jzxt = val ? arr : [];
      this.isInd_jzxt = false;
    },
    checkChange_jzxt(val){
      let arr = []
      this.jzxtArr.forEach(item=>{arr.push(item.value)})
      this.checkAll_jzxt = val.length === arr.length;
      this.isInd_jzxt = val.length > 0 && val.length < arr.length;
    },
    handleCheckAll_mjd(val){
      let arr = []
      this.mjdArr.forEach(item=>{arr.push(item.value)})
      this.mjd = val ? arr : [];
      this.isInd_mjd = false;
    },
    checkChange_mjd(val){
      let arr = []
      this.mjdArr.forEach(item=>{arr.push(item.value)})
      this.checkAll_mjd = val.length === arr.length;
      this.isInd_mjd = val.length > 0 && val.length < arr.length;
    },
    handleCheckAll_crfs(val){
      let arr = []
      this.crfsArr.forEach(item=>{arr.push(item.value)})
      this.crfs = val ? arr : [];
      this.isInd_crfs = false;
    },
    checkChange_crfs(val){
      let arr = []
      this.crfsArr.forEach(item=>{arr.push(item.value)})
      this.checkAll_crfs = val.length === arr.length;
      this.isInd_crfs = val.length > 0 && val.length < arr.length;
    },
    handleCheckAll_tdyt(val){
      let arr = []
      this.tdytArr.forEach(item=>{arr.push(item.value)})
      this.tdyt = val ? arr : [];
      this.isInd_tdyt = false;
    },
    checkChange_tdyt(val){
      let arr = []
      this.tdytArr.forEach(item=>{arr.push(item.value)})
      this.checkAll_tdyt = val.length === arr.length;
      this.isInd_tdyt = val.length > 0 && val.length < arr.length;
    },
    getGeboGradeList(){ //gebo筛选条件
      analysistoolsApi.getGradeList({type:"matrix"})
      .then(res=>{
        console.log('gebo筛选条件',res)
        if(res.data.code===0){
          let tree = res.data.data[0].children
          this.gradeTree = tree
        }
      })
    },
    getPartData(){
      let partList = JSON.parse(sessionStorage.getItem('plate_data')).part
      partList = partList.filter(item=>item.children.length>0)
      partList.forEach(item=>{
        item.checkedParts = []
        item.partAll = false
        item.isPartAll = false
      })
      this.partData = partList
    },
    plateTypeChange(type){ //板块类型切换
      if(this.curPlateType===type){
        this.showPlateBox = !this.showPlateBox
      }else{
        this.showPlateBox = true
      }
      this.curPlateType = type
    },
    handleRegionAll(val) {
      let regionArr = []
      this.plateData.region.forEach(item=>{
        regionArr.push(item.regionno)
      })
      this.checkedRegions = val ? regionArr : [];
      this.isRegionAll = false;
    },
    regionChange(value) {
      this.regionAll = value.length === this.plateData.region.length;
      this.isRegionAll = value.length > 0 && value.length < this.plateData.region.length;
    },
    handlePartAll(i) {
      let partArr = []
      this.partData[i].children.forEach(item=>{
        partArr.push(item.regionno)
      })
      this.partData[i].checkedParts = this.partData[i].partAll ? partArr : [];
      this.partData[i].isPartAll = false;
    },
    partChange(i) {
      let partArr = []
      this.partData[i].children.forEach(item=>{
        partArr.push(item.regionno)
      })
      let value = this.partData[i].checkedParts
      this.partData[i].partAll = value.length === partArr.length;
      this.partData[i].isPartAll = value.length > 0 && value.length < partArr.length;
    },
    filterNode(value, data) {
      if (!value) return true;
      if (data.name.indexOf(value) !== -1) {
        return true;
      }
      return false;
    },
    axisIndex(index) {
      //当前更改的坐标系索引
      console.log(index);
      this.axisCurIndex = index;
      this.extendFlag = null
    },
    treeFilter(i) {
      //树结构筛选
      let name = this.axisArr[i].name;
      this.$refs.matrixFilterTree[i].filter(name); //此处多个filterItemTree树结构，需指定索引去筛选节点
      console.log(this.axisArr);
      //内容清空时重置数据
      if (name == "") {
        this.axisArr[i].name = null;
        this.axisArr[i].value = null;
        //清空附加条件
        this.wylx=null
        this.jzxt=[]
        this.isInd_jzxt=true
        this.checkAll_jzxt=false
        this.mjd=[]
        this.isInd_mjd=true
        this.checkAll_mjd=false
        this.crfs=[]
        this.isInd_crfs=true
        this.checkAll_crfs=false
        this.tdyt=[]
        this.isInd_tdyt=true
        this.checkAll_tdyt=false
      }
    },
    chooseTagItem(data) {
      //选择指标项
      console.log(data);
      let i = this.axisCurIndex;
      let curItem = this.axisArr.filter(item => {
        return item.value === data.itemCode;
      });
      if (curItem.length > 0) {
        //已存在选择的筛选项
        this.$message("已选择该项");
      } else {
        this.axisArr[i].name = data.name;
        this.axisArr[i].value = data.itemCode;
        //选择的指标为土地市场时显示筛选条件
        let curType = data.itemCode.substring(0,4)
        if(curType==='BKSC'){
          this.extendFlag = 'sc'
          this.wylx = this.wylxArr[0].value
          this.handleCheck_wylx(this.wylx)
        }else if(curType==='BKTD'){
          this.extendFlag = 'td'
        }else{
          this.extendFlag = null
          this.closeExtend()
        }
        //若无市场土地数据重置土地市场的额外条件
        let tdsc = this.axisArr.filter(item=>{
          let code = data.itemCode.substring(0,4)
          return code==='BKSC'||code==='BKTD'
        })
        if(tdsc.length===0){
          this.wylx=null
          this.jzxt=[]
          this.isInd_jzxt=false
          this.checkAll_jzxt=false
          this.mjd=[]
          this.isInd_mjd=false
          this.checkAll_mjd=false
          this.crfs=[]
          this.isInd_crfs=false
          this.checkAll_crfs=false
          this.tdyt=[]
          this.isInd_tdyt=false
          this.checkAll_tdyt=false
        }
      }
      
      console.log(this.axisArr);
      
    },
    closeExtend(){ //关闭扩展选项及选择
      if(this.extendFlag!==null){
        this.extendFlag = null
      }
      if(this.axisCurIndex!==""){
        this.$refs['conditionPopover'+this.axisCurIndex][0].doClose()
      }
    },
    getGeboQueryData() { //获取gebo数据
    //矩阵生成条件判断(x,y已选择，大小颜色至少选择一个)
      let flag =
        this.axisArr[0].value != null &&
        this.axisArr[1].value != null &&
        (this.axisArr[2].value != null || this.axisArr[3].value != null);
      if(!flag){
        this.$message('至少选择包含xy坐标系的三条坐标系')
        return
      }
      this.$prompt("请输入坐标系名称",{
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
      .then(({value}) => {
        if(value==""||value==" "||value==null){
          this.$message('请先输入正确的坐标系名称')
        }else{
          //数据请求loading
          this.loadingShow = true
          //行政区
          let partnos = ''
          if(this.curPlateType==='region'){
            this.checkedRegions.forEach(item=>{partnos+=(item+',')})
          }else if(this.curPlateType==='part'){
            let allPlate = ''
            this.partData.forEach(item=>{
              item.checkedParts.forEach(c=>{partnos+=(c+',')})
              item.children.forEach(s=>{allPlate+=(s.regionno+',')})
            })
            if(partnos===''){ //未选择板块默认全选
              partnos = allPlate
            }
            
          }
          let itemCodes = ''
          let itemCodesArr = []
          this.axisArr.forEach(item=>{
            itemCodes += ((item.value?item.value+',':''))
            if(item.value!==null){
              itemCodesArr.push(item.value.substring(0,4))
            }
          })
          let obj = {
            matrixName:value,
            partnos:partnos,
            itemCodes:itemCodes
          }
          if(itemCodesArr.indexOf('BKSC')!==-1){ //选择的存在市场数据
            if(this.wylx!==null){
              obj.propertyType = this.wylx
            }
            if(this.jzxt.length>0){
              let build_form = ''
              this.jzxt.forEach(item=>{build_form+=(item+',')})
              obj.buildForms = build_form
            }
            if(this.mjd.length>0){
              let area_size = ''
              this.mjd.forEach(item=>{area_size+=(item+',')})
              obj.areaSizes = area_size
            }
          }
          if(itemCodesArr.indexOf('BKTD')!==-1){ //选择的存在土地数据
            if(this.crfs.length>0){
              let sell_type = ''
              this.crfs.forEach(item=>{sell_type+=(item+',')})
              obj.sellTypes = sell_type
            }
            if(this.tdyt.length>0){
              let land_use = ''
              this.tdyt.forEach(item=>{land_use+=(item+',')})
              obj.landUses = land_use
            }
          }
          if(this.yearShow){
            obj.years = this.landMarketYear
          }
          analysistoolsApi.getSaveGeboData(obj)
          .then(res => {
            if (res.data.code === 0) {
              // let list = res.data.list.filter(
              //   item => item.type === "part" && item.ranks != undefined
              // );
              console.log("gebo数据", res);
              let list = res.data.data
              let arrBig = []; //一维数组
              list.forEach(item => {
                let arrSmall = [
                  item.scoreX,item.scoreY,item.scoreS,item.scoreC,item.partname,
                ]; 
                arrBig.push(arrSmall);
              });
              console.log(arrBig);
              this.axisData = arrBig;
              this.GEBOInit();
              this.getGeboTags()
              this.loadingShow = false
            } else {
              this.$message("矩阵生成失败");
              this.loadingShow = false
            }
          });
          // setTimeout(()=>{
          //   this.loadingShow = false
          // },4000)
        }
      })
    },
    GEBOInit() {
      //矩阵生成
      let axisData = JSON.parse(JSON.stringify(this.axisData));
      //求出个坐标系的最大值和最小值
      let col_1 = [];
      let col_2 = [];
      let col_3 = [];
      let col_4 = [];
      axisData.forEach(item => {
        for(let i=0;i<3;i++){
          if(item[i]!==null){
            item[i] = item[i].toFixed(1)
          }
        }
        col_1.push(item[0]);
        col_2.push(item[1]);
        col_3.push(item[2]);
        col_4.push(item[3]);
      });
      let max_1 = Math.max.apply(null, col_1);
      let min_1 = Math.min.apply(null, col_1);
      let max_2 = Math.max.apply(null, col_2);
      let min_2 = Math.min.apply(null, col_2);
      let max_3 = Math.max.apply(null, col_3);
      let min_3 = Math.min.apply(null, col_3);
      let max_4 = Math.max.apply(null, col_4);
      let min_4 = Math.min.apply(null, col_4);

      //划分象限
      let num = this.check_num;
      let xAverage = JSON.parse((max_1 / num).toFixed(2));
      let yAverage = JSON.parse((max_2 / num).toFixed(2));
      let xlineData = [];
      let ylineData = [];
      for (let i = 0; i < num - 1; i++) {
        let objx = {
          xAxis: (i + 1) * xAverage
        };
        let objy = {
          yAxis: (i + 1) * yAverage
        };
        xlineData.push(objx);
        ylineData.push(objy);
      }
      let lineData = xlineData.concat(ylineData);

      var itemStyle = {
        
          opacity: 0.8,
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowColor: "rgba(0, 0, 0, 0.2)"
        
      };
      var schema = this.axisArr;
      var option = {
        backgroundColor: "#1a1f23",
        toolbox: {
          show: true,
          //orient: 'vertical',
          left: "right",
          top: "top",
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            saveAsImage: { show: true },
            dataView : {
              show: true,                
              readOnly: true,
              optionToContent : opt => {
                console.log(opt);
                var series = opt.series[0].data;
                var tdHeaders = ''; //表头
                this.axisArr.forEach( item => {
                  tdHeaders += '<th>' + (item.value!==null?item.name:'暂无') + '</th>'; //组装表头
                });
                tdHeaders += '<th>板块</th>'
                var table = '<div class="table-responsive"><table class="table table-bordered table-striped table-hover" style="text-align:center"><tbody><thead><tr>' + tdHeaders + '</tr></thead>';
                var tdBodys = '<tbody>'; //数据
                for (var i = 0, l = series.length; i < l; i++) {
                  let trBody = '<tr>'
                  for (var j = 0; j < series[i].length; j++) {
                    trBody += '<td style="padding: 5px 20px">' + series[i][j] + '</td>'; //组装表数据
                  }
                  tdBodys += (trBody + '</tr>');
                }
                table += tdBodys+'</tbody></table></div>';
                return table;
              }
            },
          }
        },
        tooltip: {
          padding: 10,
          backgroundColor: "rgba(0,0,0,0.3)",
          formatter: function(obj) {
            var value = obj.value;
            return (
              `<div 
              style="font-size: 14px;
              padding-bottom: 7px;
              margin-bottom: 7px;color:#fff">片区：${value[4]}</div>
              <p style="color:#e6a23c;font-size:12px;">${schema[0].name}：${value[0]!==null?value[0]:'暂无'}</p>
              <p style="color:#67C23A;font-size:12px;">${schema[1].name}：${value[1]!==null?value[1]:'暂无'}</p>
              <p style="color:#46c5ff;font-size:12px;">${schema[2].name}：${value[2]!==null?value[2]:'暂无'}</p>
              <p style="color:#f56c6c;font-size:12px;">${schema[3].name}：${value[3]!==null?value[3]:'暂无'}</p>
              `
            );
          }
        },
        xAxis: {
          type: "value",
          min: 0,
          max: max_1,
          name: schema[0].name,
          nameGap: 16,
          nameTextStyle: {
            color: "#9ca7ab",
            fontSize: 14
          },
          axisLine: {
            lineStyle: {
              color: "#9ca7ab"
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
              color: "#252c31"
            }
          }
        },
        yAxis: {
          type: "value",
          min: 0,
          max: max_2,
          name: schema[1].name,
          nameLocation: "end",
          nameGap: 20,
          nameTextStyle: {
            color: "#9ca7ab",
            fontSize: 14
          },
          axisLine: {
            lineStyle: {
              color: "#9ca7ab"
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
              color: "#252c31"
            }
          }
        },
        dataZoom: [
          {
            type: "slider",
            backgroundColor: "rgba(0,0,0,0.2)",
            fillerColor: "rgba(255,255,255,0.1)",
            textStyle: {
              color: "#9ca7ab"
            },
            dataBackground: {
              //数据阴影的样式。
              lineStyle: {
                color: "#409eff"
              }, //阴影的线条样式
              areaStyle: {
                color: "#409eff"
              } //阴影的填充样式
            },
            borderColor: "none",
            show: true,
            xAxisIndex: [0],
            bottom: 0
          },
          {
            type: "slider",
            backgroundColor: "rgba(0,0,0,0.2)",
            fillerColor: "rgba(255,255,255,0.1)",
            textStyle: {
              color: "#9ca7ab"
            },
            dataBackground: {
              //数据阴影的样式。
              lineStyle: {
                color: "#409eff"
              }, //阴影的线条样式
              areaStyle: {
                color: "#409eff"
              } //阴影的填充样式
            },
            borderColor: "none",
            show: true,
            yAxisIndex: [0],
            left: "5%"
          },
          {
            type: "inside",
            xAxisIndex: [0]
          },
          {
            type: "inside",
            yAxisIndex: [0]
          }
        ],
        visualMap: [
          {
            //圆的大小
            show: schema[2].value === null ? false : true,
            right: '2%',
            top: '10%',
            dimension: 2,
            min: min_3,
            max: max_3,
            itemWidth: 30,
            itemHeight: 120,
            calculable: true,
            precision: 0.1,
            text: ["大小：" + schema[2].name],
            textGap: 30,
            textStyle: {
              color: "#9ca7ab"
            },
            inRange: {
                symbolSize: [10, 70]
            },
            outOfRange: {
                symbolSize: [10, 70],
                color: ['rgba(255,255,255,0.4)']
            },
            controller: {
                inRange: {
                    color: ['#c23531']
                },
                outOfRange: {
                    color: ['#999']
                }
            }
          },
          {
            //圆的颜色
            show: schema[3].value === null ? false : true,
            right: '2%',
            bottom: 'bottom',
            dimension: 3,
            min: min_4,
            max: max_4,
            itemWidth: 30,
            itemHeight: 120,
            calculable: true,
            precision: 'auto',
            text: ["颜色：" + schema[3].name],
            textGap: 30,
            textStyle: {
              color: "#9ca7ab"
            },
            inRange: {
              color: this.circleColor
            },
            outOfRange: {
              color: ["rgba(255,255,255,0)"]
            },
            controller: {
              inRange: {
                color: this.circleColor
              },
              outOfRange: {
                color: ["#666"]
              }
            }
          }
        ],
        series: [
          {
            type: "scatter",
            itemStyle: itemStyle,
            data: axisData,
            symbolSize: 25,
            markLine: {
              lineStyle: {
                type: "dashed",
                color: "#46c5ff"
              },
              symbol: "none",
              data: lineData
            },
            label: {
              formatter: "{@[4]}",
              position: "bottom",
              show: true,
              color: "#7cb5ff",
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              color: "#7cb5ff",
              position: "right",
              show: true
            },
            large: true
          }
        ]
      };
      let myChart = this.$echarts.init(document.getElementById("geboChart"));
      myChart.setOption(option);
      window.addEventListener("resize", myChart.resize);
    },
    getGeboTags(state){ //获取Gebo 用户标签
      analysistoolsApi.getUserTag()
      .then(res=>{
        if(res.data.code===0){
          let list = res.data.data.list
          this.tagsList = list
          console.log('用户gebo标签',list)
          let lastTag = list[list.length-1]
          if(lastTag!==undefined){
            this.curTag = lastTag.id
            if(state==='firstLoad'||state==='del'){
              this.tagSet(lastTag.id)
            }
          }else{

          }
        }
      })
    },
    tagSet(id){ //应用用户标签
      this.loadingShow = true
      analysistoolsApi.getUserTagInfo(id)
      .then(res=>{
        if(res.data.code===0){
          console.log('gebo历史数据',res)
          this.curTag = id
          //条件数据
          let info = res.data.data.gebo
          this.axisArr[0].value = info.itemCodeX
          this.axisArr[0].name = info.itemX
          this.axisArr[1].value = info.itemCodeY
          this.axisArr[1].name = info.itemY
          this.axisArr[2].value = info.itemCodeS
          this.axisArr[2].name = info.itemS
          this.axisArr[3].value = info.itemCodeC
          this.axisArr[3].name = info.itemC
          console.log(this.axisArr)
          //市场土地条件
          let conditions = res.data.data.conditions
          conditions.forEach(item=>{
            if(item.code==='partnos'){ //板块赋值
              if(item.value!==null){
                let partsArr = item.value.split(',').filter(item=>item!="")
                this.partData.forEach(item=>{
                  let checked = item.children.filter(child=>partsArr.indexOf(child.regionno)!==-1)
                  checked.forEach(c=>{
                    item.checkedParts.push(c.regionno)
                  })
                  if(checked.length===item.children.length){
                    item.partAll = true
                  }
                })
              }
            }else if(item.code==='propertyType'){ //物业类型
              if(item.value!==null){
                this.wylx = item.value
              }
            }else if(item.code==='buildForms'){ //建筑形态
              if(item.value!==null){
                this.jzxt = item.value.split(',').filter(item=>item!="")
                if(this.jzxt.length===this.jzxtArr.length){
                  this.checkAll_jzxt = true
                }
              }
            }else if(item.code==='areaSizes'){ //面积段
              if(item.value!==null){
                this.mjd = item.value.split(',').filter(item=>item!="")
                if(this.mjd.length===this.mjdArr.length){
                  this.checkAll_mjd = true
                }
              }
            }else if(item.code==='sellTypes'){ //出让方式
              if(item.value!==null){
                this.crfs = item.value.split(',').filter(item=>item!="")
                if(this.crfs.length===this.crfsArr.length){
                  this.checkAll_crfs = true
                }
              }
            }else if(item.code==='landUses'){ //土地用途
              if(item.value!==null){
                this.tdyt = item.value.split(',').filter(item=>item!="")
                if(this.tdyt.length===this.tdytArr.length){
                  this.checkAll_tdyt = true
                }
              }
            }
            
          })
          //矩阵数据
          let list = res.data.data.datas
          let arrBig = []
          list.forEach(item => {
            let arrSmall = [
              item.scoreX?item.scoreX:0,
              item.scoreY?item.scoreY:0,
              item.scoreS?item.scoreS:0,
              item.scoreC?item.scoreC:0,
              item.partname,
            ]; 
            arrBig.push(arrSmall);
          });
          this.axisData = arrBig;
          this.loadingShow = false
          this.GEBOInit();
        }
      })
    },
    tagDelete(id) { //删除gebo标签
      this.$confirm('是否删除该条历史?',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        analysistoolsApi.delUserTag(id)
        .then(res=>{
          if(res.data.code == 0){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getGeboTags('del')
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
.chart_tip{
    border-bottom: 1px solid rgba(255,255,255,0.2); 
    font-size: 16px;
    padding-bottom: 7px;
    margin-bottom: 7px;
  }
.matrix_wrap {
  height: 100vh;
  width: 100%;
  background: #1a1f23;
  overflow: hidden;
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
  #geboChart {
  }
  .header {
    height: 7%;
    width: 100%;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    border-bottom: 1px solid #383838;
    .header_text {
      margin-left: 10px;
      height: 100%;
      display: flex;
      align-items: center;
      width: 100px;
    }
    .axisItem {
      display: flex;
      margin-left: 15px;
      font-size: 12px;
      align-items: center;
      .el-input__inner {
        border: 1px solid #383c48;
        cursor: pointer;
        color: #e6a23c;
      }
    }
    
    .check {
      display: flex;
      align-items: center;
      font-size: 14px;
      margin-left: 15px;
      .demonstration {
      }
    }
  }
  .el-range-editor--mini.el-input__inner {
    background: rgb(31, 31, 31) !important;
  }
  .el-range-editor--mini .el-range-input,
  .el-input--mini .el-input__inner {
    background: rgb(31, 31, 31) !important;
  }
  .el-range-editor--mini .el-range-separator {
    color: white;
  }
  .el-range-editor--mini .el-range-input,
  .el-input--mini .el-input__inner {
    border-radius: 4px !important;
  }
  .el-range-editor--mini.el-input__inner {
    height: 30px !important;
    border: 1px solid #64666b;
  }
  .btnBox {
    height: 100%;
    width: 100px;
    margin-left: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .year_box{
    display: flex;
    align-items: center;
    margin-left: 15px;
    .el-input__inner{
      background: none;
      border: none;
      color: #fff;
    }
    .el-date-editor.el-input{
      width: 110px;
    }
  }
  .colorBox {
    position: relative;
    width: 125px;
    font-size: 12px;
    margin: 0 15px;
    .color_bar{
      height: 15px;
      width: 80%;
      margin: auto;
      border-radius: 14px;
      opacity: 0.8;
    }
    .color_box{
      display: flex;
      align-items: center;
      margin-top: 5px;
    }
    .maxColor {
      position: absolute;
      left: 10px;
      top: 0;
      opacity: 0;
    }
    .midColor {
      position: absolute;
      left: 48px;
      opacity: 0;
    }
    .minColor {
      position: absolute;
      left: 86px;
      opacity: 0;
    }
  }
  .plateBox{
    height: 100%;
    display: flex;
    align-items: center;
    position: relative;
    .plate_item{
      padding: 4px 12px;
      background: rgba(144, 147, 153, 0.25);
      border-radius: 15px;
      cursor: pointer;
      margin-left: 8px;
      font-size: 12px;
      color: #dcdfe6;
      transition: all 0.3s;
      user-select: none;
    }
    .plate_item:hover{
      background: rgba(149, 149, 246, 0.5);
    }
    .plate_item_cur{
      padding: 4px 12px;
      background: rgba(149, 149, 246, 0.5);
      border-radius: 15px;
      cursor: pointer;
      margin-left: 8px;
      font-size: 12px;
      color: #dcdfe6;
      transition: all 0.3s;
      user-select: none;
    }
    .plate_list{
      position: absolute;
      padding: 10px;
      background: #fff;
      border-radius: 6px;
      top: 52px;
      left: 50px;
      z-index: 999;
      color: #000;
      .plate_region{
        min-width: 384px;
      }
      .plate_part{
        min-width: 500px;
        .part_item{
          margin-bottom: 10px;
        }
      }
    }
  }
  .tagBox {
    border-top: #383838 1px solid;
    width: 100%;
    height: 14%;
    margin: auto;
    margin-top: 1%;
    white-space: nowrap;
    display: flex;
    flex-wrap: wrap;
    overflow-y: scroll;
    align-content: flex-start;
    &::-webkit-scrollbar {
      background: #252a2d;
    }
    .el-tag {
      margin-left: 10px;
      margin-top: 10px;
      cursor: pointer;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .el-tag--plain{
    background: rgba(105, 133, 183, 0.2);
    border: none;
  }
  .tagBox .el-tag{
    border-radius: 16px;
    cursor: pointer;
  }
  .el-message-box {
    background-color: #252a2d;
    border: 1px solid #64666b;
    .el-message-box__header {
      .el-message-box__title {
        color: white;
      }
    }
    .el-message-box__content {
      .el-message-box__container {
        color: white;
      }
      .el-message-box__input {
        .el-input__inner {
          background: #252a2d !important;
          color: white;
          border: 1px solid #64666b;
        }
      }
    }
    .el-message-box__btns {
      .el-button .el-button--default .el-button--small {
        color: white !important;
      }
    }
  }
}


@media screen and (max-width: 1840px) {
  .header {
    white-space: nowrap;
    .header_text {
      display: none !important;
    }
    .axisItem {
      display: flex;
      font-size: 14px;
      margin-left: 0;
      align-items: center;
      width: 13.5%;
      .el-input--mini .el-input__inner {
        width: 95px !important;
        color: #e6a23c;
      }
    }
  }
}
</style>
