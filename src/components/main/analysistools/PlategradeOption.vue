<template>
  <div class="plategrade_optionWrap">
    <!-- 图例 -->
    <Legends class="legends" />
    <!-- 评分类型 -->
    <div class="common_plates">
      <div class="rating_type">
        <div class="tag_title" style="margin-bottom:0;">类型</div>
        <div class="type_switch">
          <el-switch
            style="display: block"
            v-model="ratingType"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="通用"
            inactive-text="自定义"
            @change="ratingTypeChange">
          </el-switch>
        </div>
      </div>
      <div class="plates_box">
        <div class="tag_title">板块</div>
        <!-- 板块类型选择 -->
        <div class="region_class">
            <el-select @change="changePlateType" class="region_select" v-model="current_type" placeholder="请选择">
                <el-option
                v-for="item in region_classData"
                :key="item.type"
                :disabled="item.disabled"
                :label="item.name"
                :value="item.type">
                </el-option>
            </el-select>
        </div>
        <el-link type="primary" @click="plateAll()" style="margin:0 10px;">{{allPlate?"取消":"全选"}}</el-link>
        <el-link type="success" @click="reverse()">反选</el-link>
      </div>
    </div>
    <!-- 通用评分 -->
    <div class="common_box" v-if="ratingType">
      <div class="common_tags">
        <div class="tag_title">常用</div>
        <div class="ctags_box">
          <div :class="[curCommonTag===item.itemCode?'tag_item_cur':'tag_item']" v-for="(item,index) in ctagsData" 
          :key="index" @click="chooseAtag(item.itemCode)">{{item.itemName}}</div>
        </div>
      </div>
      <div class="menu_tags">
        <div class="tag_title">全部</div>
        <div class="atag_box">
          <div class="tag_left">
            <div :class="[curCommonTag===item1.itemCode?'atag1_cur':'tag_1']" v-for="(item1,i1) in quotaData" :key="i1"
            @mouseenter="showTags2(i1,item1.itemCode)" @click="chooseAtag(item1.itemCode)">{{item1.name}}</div>
          </div>
          <div class="tag_right">
            <div class="tag_2" v-for="(item2,i2) in tag2Data" :key="i2">
              <div class="tag2_name" @click="chooseAtag(item2.itemCode)"
              :class="[curCommonTag===item2.itemCode?'atag2_cur':'tag2_name']">{{item2.name}}</div>
              <div class="tag_3" v-for="(item3,i3) in item2.children" :key="i3">
                <div class="tag3_box">
                  <div :class="[curCommonTag===item3.itemCode?'atag3_cur':'tag3_name']" @click="chooseAtag(item3.itemCode)">{{item3.name}}</div>
                  <i :class="[curTag4==i3&&curTag2==i2?'el-icon-arrow-up':'el-icon-arrow-down']" v-if="item3.children.length>0" @click="showTag4(i2,i3)"></i>
                </div>
                <div class="tag4_box" v-if="curTag4==i3&&curTag2==i2">
                  <div @click="chooseAtag(item4.itemCode)" 
                  v-for="(item4,i4) in item3.children" :key="i4"
                  :class="[curCommonTag===item4.itemCode?'atag4_cur':'tag4_name']">{{item4.name}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 自定义评分 -->
    <div class="custom_box" v-else>
      <!-- 用户的自定义评分 -->
      <div class="custom_tags">
        <Loading class="loading" v-if="loading1" :loadingText="'LOADING'" />
        <div class="tag_title">我的自定义评分</div>
        <div class="ctags_box">
          <div class="item_box" v-for="(item,index) in savetagsData" :key="index">
            <div class="top">
              <div :class="[curCustomTag===item.id?'tag_item_cur':'tag_item']" 
              @click="showGradeDetail(item)">{{item.name}}</div>
              <div class="btn_box">
                <el-popconfirm v-if="item.state==='0'" title="是否开始计算板块评分？" @confirm="comutedGrade(item)" style="margin-left:5px;">
                  <el-button slot="reference" size="mini" type="primary" icon="el-icon-s-platform" circle></el-button>
                </el-popconfirm>
                <el-popconfirm title="是否删除该评分？" @confirm="deleteGrade(item.id)" style="margin-left:5px;">
                  <el-button slot="reference" size="mini" type="danger" icon="el-icon-delete" circle></el-button>
                </el-popconfirm>
              </div>
            </div>
            <div class="cont">
              <div class="c_item">
                <span>{{item.state=='0'?'未计算':item.state=='1'?'计算中':'已计算'}}</span>
                <span>{{item.type=='ahp'?'层次分析':'自定义'}}</span>
              </div>
              <div class="c_item">
                {{item.createDate}}
              </div>
            </div>
          </div>
          
        </div>
      </div>
      <!-- 新建评分 -->
      <div class="new_grade" v-if="curCustomTag===null" :style="{'height':isCreat?'70%':'auto'}">
        <Loading class="loading" v-if="loading" :loadingText="'LOADING'" />
        <div class="top">
          <div class="tag_title" style="margin-bottom:0;">新建评分</div>
          <el-button size="mini" :type="isCreat?'danger':'primary'" @click="newGrade()">{{isCreat?'取消':'新建'}}</el-button>
        </div>
        <div class="tips" v-if="isCreat">
          <div class="step">{{optionIndex+1}}</div>
          <div class="tip_text">{{optionTip}}</div>
        </div>
        <div class="tree_box">
          <div class="box1">
            <el-tree
              v-show="optionIndex===0"
              :data="customData"
              :default-expanded-keys="defaultExpanded"
              :highlight-current="false"
              show-checkbox
              node-key="itemCode"
              ref="customTree"
              :props="defaultProps"
              @check="selectGrade">
            </el-tree>
          </div>
          <div class="box2" v-if="optionIndex===1">
            <div class="setting1">
              <div>1 选择权重配置方式</div>
              <el-radio-group v-model="checkedType">
                <el-radio v-for="(item,index) in settingType" :disabled="item.disabled" :key="index" :label="item.value">{{item.name}}</el-radio>
              </el-radio-group>
            </div>
            <div class="setting2">
              <div style="margin:20px 0 10px 0">2 该评分的名称</div>
              <el-input v-model="gradeName" size="mini" placeholder="请输入内容"></el-input>
            </div>
          </div>
          <div class="box3">
            <el-tree
              class="box3"
              v-if="optionIndex===2"
              :data="userCheckedTree"
              :highlight-current="false"
              :expand-on-click-node="false"
              :default-expanded-keys='[]'
              node-key="itemCode"
              ref="userCustomTree"
              :props="defaultProps">
              <div class="box3TreeNode" slot-scope="{ node, data }">
                <span class="node_name">{{ data.name }}</span>
                <!-- <span v-if="checkedType==='kys'" class="node_weight">{{ data.weight }}</span> -->
                <i v-if="checkedType==='ahp'" 
                  class="node_ahp el-icon-s-grid"
                  :style="{'color':data.isAhp?'reasonable':'#f78989'}"
                  @click="settingAhq(data)"
                ></i>
                <div class="right_cont" v-if="checkedType==='customize'">
                  <el-input-number 
                    class="weightInput" 
                    size="mini"
                    v-model="data.weight"
                    controls-position="right" 
                    @change="changeWeight()" 
                    :step="0.1"
                    :min="0" 
                    :max="1">
                  </el-input-number>
                  <el-tooltip class="item" effect="dark" :content="data.children.length>0?(checkSum(data)?'子项权重之和等于1':'子项权重之和不为1'):''" placement="top-end">
                    <div class="tip_point" :style="{'background':data.children.length>0?(checkSum(data)?'#67c23a':'#f56c6c'):'none'}"></div>
                  </el-tooltip>
                </div>
              </div>
            </el-tree>
          </div>
          <div class="box4">
            <el-tree
              class="box4"
              v-if="optionIndex===3"
              :data="userCheckedTree"
              :highlight-current="false"
              :expand-on-click-node="false"
              @node-click="getPlatesGradeInfo"
              node-key="itemCode"
              ref="userBackTree"
              :props="defaultProps">
            </el-tree>
          </div>
        </div>
        <div class="btn_control" v-if="isCreat" :style="{'justify-content':optionIndex!==1?'flex-end':'space-between'}">
          <el-button v-if="optionIndex===1" size="mini" @click="prev()">上一步</el-button>
          <el-button v-if="optionIndex<3" size="mini" @click="next()">{{optionIndex===2?checkedType==='ahp'?'层次分析':'计算评分':'下一步'}}</el-button>
        </div>
      </div>
      <!-- 评分详情 -->
      <div class="grade_detail" v-else>
        <div class="tag_title">自定义评分详情</div>
        <div class="detail_box">
          <div class="tips">tips:在地图上选择板块，点击下方的评分项</div>
          <el-tree
            :data="gardeDetail"
            :highlight-current="false"
            :expand-on-click-node="false"
            :default-expand-all="true"
            @node-click="getPlatesGradeInfo"
            node-key="itemCode"
            ref="gardeDetailTree"
            :props="defaultProps">
            <div class="box3TreeNode" slot-scope="{ node, data }">
              <span class="node_name">{{ data.name }}</span>
              <span class="node_weight">{{ data.weight }}</span>
            </div>
          </el-tree>
        </div> 
      </div>
    </div>
  </div>
</template>
<script>
//store
import { mapGetters } from "vuex";
import { treeToArray,setPlateColor } from "@/utils/public"
//api
import analysistoolsApi from "@/api/analysistoolsApi"
//插件
import axios from "axios";
//组件
import Loading from '@/components/tools/loading'
import Legends from '@/components/tools/legends'

export default {
  name: "commongradeoption",
  props: {},
  components: {
    Legends,
    Loading
  },
  data() {
    return {
      /* 评分类型、板块选择 */
      ratingType:true, //true通用评分,false自定义评分
      region_classData:[ //板块类型数组
        //{type:'region',name:'行政区',disabled:false}, //region
        {type:'part',name:'通用板块',disabled:false}, //part
        {type:'customize',name:'定制板块',disabled:true} //customize
      ],
      plateDataArr:[],//选择的板块编号数组
      current_type:'part', //当前板块类型
      allPlate:false, //全选

      /* 通用评分 */
      ctagsData:[ //常用tag
        {itemName:'道路数量',itemCode:'a'}
      ],
      curTag2:null,//当前的2级tag
      curTag4:null, //要展示的4级tag
      curCommonTag:null,//全部tag的当前选择
      tag2Data:[], //二级评分菜单
      quotaData:[],//指标菜单
      quotaScoreArr:[],//板块得分
      
      /* 自定义评分 */
      curCustomTag:null,//当前选择的用户评分
      savetagsData:[], //用户保存的评分

      //新建评分
      defaultExpanded:[],//默认展开的评分项
      defaultProps: { 
        children: 'children',
        label: 'name'
      },
      isCreat:false,//是否新建
      optionTip:'',//提示
      optionIndex:null,//新建进度
      settingType:[ //设置权重的方式
        {name:'自定义权重',value:'customize',tip:'全部评分项由您配置权重',disabled:false},
        // {name:'客研社权重',value:'kys',tip:'根据客研社的算法配置权重'},
        {name:'层次分析法',value:'ahp',tip:'根据同等级评分项的期望值配置权重',disabled:true}
      ],
      checkedType:'customize',//当前的权重设置方式
      checkedGradeArr:[],//选择的评分项的itemCode数组(包括半选)
      gradeName:'', //评分保存的名称
      userCheckedTree:[],//用户选择的评分树
      userExpanded:[],//子项之和不为1的itemCode数组
      curWeightId:null,//保存评分项返回的ID
      loading:false,
      loading1:false,
      gardeDetail:[],//自定义评分详情
      plateGradeData:[],//板块评分
      curGrade:null,//当前选择的评分项
      customData:[],//指标数据
      allIsFit:false,//所有指标满足权重加和条件
    };
  },
  mounted() {
    this.getQuotaData()
    this.getCommonQuotaList()
    this.getCustomData()
    this.getUserGradeList()
    setTimeout(()=>{
      this.commongradeMapEvent()
      //this.customgradeMapEvent()
    },1500)
  },
  watch: {
    plate_color:{
      handler(){
        this.setFillColor(this.quotaScoreArr)
      },
      deep:true
    },
    plateDataArr:{
      handler(){
        this.selectPlates()
        if(this.curCommonTag!==null&&this.ratingType){
          this.getQuotaScore(this.curCommonTag)
        }
        if(this.curGrade!==null&&!this.ratingType){
          this.getPlatesGradeInfo(this.curGrade)
        }
      },
      deep:true
    }
  },
  computed: {
    ...mapGetters(["curentPlate", "mapbox_map","plategrade_map","plate_color","plateData"]),
    checkSum(){
      return (data) => {
        let flag
        let sum = 0
        data.children.forEach(item=>{
          sum += item.weight*1
        })
        flag = sum==1?true:false
        return flag
      }
    },
  },
  methods: {
    /* 公用方法 */
    ratingTypeChange(val){ //评分类型切换
      console.log(val)
    },
    commongradeMapEvent(){ //通用评分地图事件
      var that = this
      var map = this.plategrade_map

      map.on('click','plate_fill',e=>{
        //console.log(e)
        let id = e.features[0].properties.regionno
        let i = this.plateDataArr.indexOf(id)
        if(i==-1){ //未选择
          this.plateDataArr.push(id)
        }else{ //已选择
          this.plateDataArr.splice(i,1)
        }
      })
      var popup_plate = new this.mbgl.Popup({
        closeButton: false,
        closeOnClick: false
      });
      map.on('mousemove','plate_fill',e=>{
        if(that.quotaScoreArr.length==0&&that.plateGradeData.length==0){
          return
        }
        map.getCanvas().style.cursor = 'pointer';
        let coordinates = [e.lngLat.lng,e.lngLat.lat];
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        } 
        let regionno = e.features[0].properties.regionno
        let scoreData = that.ratingType?that.quotaScoreArr:that.plateGradeData
        let curPlate = scoreData.filter(item=>regionno==item.regionno)[0]
        if(curPlate){
          let popupHtml = `<p class="item_head">${curPlate.regionName}</p>
          <div class="item_name">评分类型：<span class="item_val">${that.ratingType?'通用评分':'自定义评分'}</span></div>
          <div class="item_name">评分项：<span class="item_val">${curPlate.itemName}</span></div>
          <div class="item_name">评分项得分：<span class="item_val">${curPlate.data}</span></div>
          `
          popup_plate.setLngLat(coordinates)
          .setHTML(popupHtml)
          .addTo(map);
        }
        
      })
      map.on('mouseleave','plate_fill',e=>{
        map.getCanvas().style.cursor = '';
        popup_plate.remove();
      })
    },
    setFillColor(data){
      this.plategrade_map.setPaintProperty("plate_fill", "fill-opacity", 0.82);
      //this.plategrade_map.setPaintProperty("plate_line", "line-color", 'rgba(255, 255, 255, 0.6)');
      //this.plategrade_map.setPaintProperty("plate_labels", "text-color", 'rgba(255, 255, 255, 1)');
      setPlateColor(data,this.plategrade_map,this.plate_color)
    },  
    selectPlates(){ //设置地图板块选中效果
      console.log(this.plateDataArr)
      var that = this
      let map = this.plategrade_map
      if(map===null){
          return
      }
      var borderWidth = ["match", ["get", "regionno"]];
      var borderColor = ["match", ["get", "regionno"]];
      var borderOpocity = ["match", ["get", "regionno"]];
      var borderDasharray = ["match", ["get", "regionno"]];
      if(this.plateDataArr.length>0){
          this.plateDataArr.forEach(item=>{
            borderWidth.push(item, 1.5);
            borderColor.push(item, "rgba(255, 255, 255, 0.6)"); //rgba(85, 255, 0, 1) 绿色
            borderOpocity.push(item, 1);
            borderDasharray.push(item, [2,4]);
          })
          //let lastID = this.plateDataArr[this.plateDataArr.length-1]
          //var center = this.plateCenter.filter(item=>item.regionno==lastID)[0].center
      }else{
          borderWidth = borderWidth.concat([1,1])
          borderColor = borderColor.concat(["rgba(149, 149, 246,1)","rgba(149, 149, 246,1)"])
          borderOpocity= borderOpocity.concat([0,0])
          borderDasharray = borderDasharray.push([0,0]);
      }
      borderWidth.push(1)
      borderColor.push("rgba(149, 149, 246,1)")
      borderOpocity.push(0.4)
      borderDasharray.push([2,4]);

      map.setPaintProperty("plate_line", "line-color", borderColor);
      map.setPaintProperty("plate_line", "line-opacity", borderOpocity);
      //map.setPaintProperty("plate_line", "line-dasharray", borderDasharray);
    },
    changePlateType(val){ //切换板块类型
      console.log(val)
      var map = this.plategrade_map
      var filters = ['==', 'type', val]
      
      map.setFilter('plate_fill', filters);
      map.setFilter('plate_line', filters);
      map.setFilter('plate_labels', filters);
    },
    plateAll(){ //全选板块/取消全选
      let plateData = []
      if(this.current_type==='region'){
        this.plateData.region.forEach(item=>{
          plateData.push(item.regionno)
        })
      }else if(this.current_type==='part'){
        this.plateData.region_part.forEach(item=>{
          plateData.push(item.regionno)
        })
      }
      if(this.allPlate){
        this.plateDataArr = []
      }else{
        this.plateDataArr = plateData
      }
      this.allPlate = !this.allPlate
    },
    reverse(){ //反选
      let plateData = []
      if(this.current_type==='region'){
        this.plateData.region.forEach(item=>{
          plateData.push(item.regionno)
        })
      }else if(this.current_type==='part'){
        this.plateData.region_part.forEach(item=>{
          plateData.push(item.regionno)
        })
      }
      let reverseArr = plateData.filter(item=>{
        return this.plateDataArr.indexOf(item)===-1
      })
      this.plateDataArr = reverseArr
    },
    /* 通用评分 */
    getQuotaData(){ //获取指标数据
      let obj = {
        type:'common'
      }
      analysistoolsApi.getQuota(obj)
      .then(res=>{
        if(res.data.code===0){
          let list = res.data.data[0].children[0].children
          //list.forEach(item=>{item.name=item.name.substring(0,2)})
          this.quotaData = list
          console.log(this.quotaData)
          let firstCode = list[0].itemCode
          this.showTags2(0,firstCode)
        }
      })
    },
    getCommonQuotaList(){ //获取常用指标
      analysistoolsApi.getCommonQuota()
      .then(res=>{
        if(res.data.code===0){
          console.log('常用指标',res)
          let list = res.data.data
          
          this.ctagsData = list
        }
      })
    },
    showTags2(i,code){ //显示二级菜单
      this.curCommonTag = code
      this.tag2Data = this.quotaData[i].children
    },
    chooseAtag(code){
      this.curCommonTag = code
      this.getQuotaScore(code)
    },
    showTag4(i2,i3){ //显示四级菜单
      console.log(i2,i3)
      if(this.curTag4!=i3){
        this.curTag4 = i3
      }else{
        this.curTag4 = null
      }
      this.curTag2 = i2
    },
    getQuotaScore(code){ //获取板块指标得分
      let regionnoStr = ''
      this.plateDataArr.forEach(item=>{
        regionnoStr += (item+',')
      })
      let obj = {
        itemCode:code,
        type:this.current_type,
        regionno:regionnoStr
      }
      analysistoolsApi.getQuotaSCore(obj)
      .then(res=>{
        if(res.data.code===0){
          let list = res.data.data
          let arr = []
          let plateID = []
          list.forEach(item=>{
            arr.push({
              itemName:item.itemName,
              regionName:item.regionName,
              regionno:item.regionno,
              data:item.score
            })
            plateID.push(item.regionno)
          })
          if(this.plateDataArr.length===0){
            this.plateDataArr = plateID
          }
          this.quotaScoreArr = arr
          this.setFillColor(arr)
        }
        console.log('板块指标得分',res)
      })
    },
    /* 自定义评分 */
    getCustomData(){ //获取指标数据
      analysistoolsApi.getQuota({type:'customize'})
      .then(res=>{
        if(res.data.code===0){
          this.customData = res.data.data[0].children
          this.defaultExpanded.push(this.customData[0].itemCode)
        }
        console.log(this.customData)
      })
    },
    getUserGradeList(){ //获取用户保存的评分列表
      analysistoolsApi.getUserGradeList()
      .then(res=>{
        console.log(res)
        if(res.data.code===0){
          this.savetagsData = res.data.data.list
        }
      })
    },
    showGradeDetail(item){ //展示用户评分项详情
      if(this.curCustomTag===item.id){
        this.curCustomTag = null
        this.isCreat = false
        this.optionIndex = null
        this.gardeDetail = []
      }else{
        if(item.state==='0'){
          this.$message('板块得分未计算,请先点击按钮计算')
        }else if(item.state==='1'){
          this.$message('板块得分计算中,请等待')
        }else{
          this.curCustomTag = item.id
          analysistoolsApi.getGradeDetails(item.id)
          .then(res=>{
            console.log(res)
            if(res.data.code===0){
              this.gardeDetail = res.data.data[0].children
            }
          })
        }
      }
    },
    comutedGrade(item){ //通过ID计算板块评分
      if(item.type==="customize"){ //自定义与层次分析
        //1、先获取客户选择的评分项详情
        analysistoolsApi.getGradeDetails(item.id)
        .then(res=>{
          console.log(res)
          if(res.data.code===0){
            let tree = res.data.data
            this.curWeightId = item.id
            this.isCreat = true
            this.optionIndex = 2
            this.checkedType = item.type
            this.curCustomTag = null
            this.optionTip = '请先在下方列表中配置权重值(评分项不支持0权重值,同一级权重之和为1)'
            this.userCheckedTree = tree[0].children
            this.getGradeArr(tree)
          }
        })
      }else{
        //层次分析法
      }
      
    },
    getGradeArr(tree){ //从树结构中获取评分项的itemCode
      tree.forEach(item=>{
        this.checkedGradeArr.push(item.itemCode)
        if(item.children.length>0){
          this.getGradeArr(item.children)
        }
      })
    },
    deleteGrade(id){ //删除用户评分
      console.log(id)
      analysistoolsApi.deleteGrade(id)
      .then(res=>{
        if(res.data.code===0){
          this.$message('评分删除成功')
          this.getUserGradeList()
          if(this.curCustomTag===id){ //删除当前展示的 隐藏详情
            this.curCustomTag = null
            this.optionIndex = null
          }
        }
      })
    },
    getPlatesGradeInfo(node){ //获取板块评分
      this.curGrade = node
      console.log(node)
      let str = ''
      this.plateDataArr.forEach(item=>{
        str += (item+',')
      })
      let obj = {
        weighterId:this.curCustomTag!==null?node.weighterId:this.curWeightId, //列表中选择和计算完成选择
        itemCode:node.itemCode,
        regionnos:str
      }
      analysistoolsApi.getPlatesGrade(obj)
      .then(res=>{
        console.log(res)
        if(res.data.code===0){
          let list = res.data.data
          let arr = []
          let plateID = []
          list.forEach(item=>{
            arr.push({
              itemName:item.itemName,
              regionName:item.regionName,
              regionno:item.regionno,
              data:item.score
            })
            plateID.push(item.regionno)
          })
          if(this.plateDataArr.length===0){
            this.plateDataArr = plateID
          }
          
          this.plateGradeData = arr
          this.setFillColor(arr)
        }
      })
    },
    newGrade(){ //新建评分
      this.isCreat = !this.isCreat
      this.optionTip = '请从下面选择您需要的评分项'
      if(this.isCreat){
        this.optionIndex = 0
      }else{
        this.optionIndex = null
        this.checkedType = 'customize'
        this.gradeName = ''
        this.checkedGradeArr = []
        this.userExpanded = []
        this.curWeightId = null
      }
    },
    prev(){ //新建评分跳转到上一步
      this.optionTip = '请选择配置'
      this.optionIndex -= 1
    },
    next(){
      if(this.optionIndex===0&&this.checkedGradeArr.length===0){
        this.$message('至少选择一项评分')
        return
      }
      if(this.optionIndex===0){
        this.optionTip = '请选择配置'
      }else if(this.optionIndex===1){
        if(this.checkedType==='customize'){
          this.optionTip = '请先在下方列表中配置权重值(评分项不支持0权重值,同一级权重之和为1)'
        }else{
          this.optionTip = '请点击点层次分析进行配置'
        }
        //保存选择的评分
        if(this.gradeName==''){
        this.$message('未输入评分名称')
          return
        }
        let obj = {
          type:this.checkedType,
          name:this.gradeName,
          itemCodes:this.checkedGradeArr
        }
        this.loading = true
        analysistoolsApi.saveSelectGrade(obj)
        .then(res=>{
          console.log(res)
          if(res.data.code===0){
            this.loading = false
            this.curWeightId = res.data.data.weighterId
            this.userCheckedTree = res.data.data.weights[0].children
            this.changeWeight()
          }else{
            this.loading = false
            this.$message('评分项初始化失败，点击取消新建评分')
            return
          }
        })
      }else if(this.optionIndex===2){ //计算评分
        if(this.checkedType==='customize'){
          this.userExpanded = []
          this.weightCheck(this.userCheckedTree)
          if(this.userExpanded.length==0){
            this.customGradeComputed()
          }else{
            this.$message({
              type: 'warning',
              message: '请确保各子项之和均为1(评分项无红点)!'
            })
            return
          }
        }
      }
      if(this.optionIndex<2){
        this.optionIndex += 1
      }
      
    },
    customGradeComputed(){ //板块评分计算
      this.loading = true
      if(this.checkedType==='customize'){
        let tree = JSON.parse(JSON.stringify(this.userCheckedTree))
        let arr = treeToArray(tree)
        //计算板块评分
        let obj = {
          weighterId:this.curWeightId,
          itemCodes:this.checkedGradeArr,
          weights:arr
        }
        analysistoolsApi.coputedGrad(obj)
        .then(res=>{
          console.log(res)
          if(res.data.code===0){
            this.loading = false
            this.optionIndex=3
            this.optionTip = '板块评分已完成,点击查看'
            this.getUserGradeList()
          }else{
            this.$message.error('评分出错,刷新页面重新计算')
            this.loading = false
          }
        })
      }
    },
    selectGrade(cur,tree){ //勾选评分项
      console.log(cur,tree)
      let arr = tree.checkedKeys.concat(tree.halfCheckedKeys)
      arr = arr.concat(['BK'])
      this.checkedGradeArr = arr
      console.log(arr)
    },
    saveCheckedGrade(){ //保存用户选择的评分项
      if(this.gradeName==''){
        this.$message('未输入评分名称')
        return
      }
      let obj = {
        type:this.checkedType,
        name:this.gradeName,
        itemCodes:this.checkedGradeArr
      }
      analysistoolsApi.saveSelectGrade(obj)
      .then(res=>{
        console.log(res)
        if(res.data.code===0){
          return true
        }
      })
    },
    changeWeight(){ //修改权重值
      this.userExpanded = []
      this.weightCheck(this.userCheckedTree)
      //let tree = JSON.parse(JSON.stringify(this.userCheckedTree))
      //this.userCheckedTree = this.weightCheck(tree)
    },
    weightCheck(data){ //权重值检查
      data.forEach(item=>{
        let num = 0
        if(item.children&&item.children.length>0){
          item.children.forEach(child=>{
            num += child.weight
            if(child.children&&child.children.length>0){
              this.weightCheck(item.children)
            } 
          })
          num = JSON.parse(num.toFixed(2))
          if(num !== 1){
            this.userExpanded.push(item.itemCode)
          }
        }
      })
    },
    settingAhq(data){ //层次分析设置
      console.log(data)
    }, 
  }
};
</script>
<style lang="scss">
.plategrade_optionWrap {
  .tag_title{
    text-align: left;
    font-size: 14px;
    color: #e6a23c;
    margin-bottom: 10px;
  }
  .common_plates{
    padding: 10px 20px;
    overflow: hidden;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.28);
    color: #fff;
    margin-bottom: 10px;
    .rating_type{
      color: #fff;
      padding: 10px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: #1b2e35 1px solid;
      .el-switch__label{
        color: #bbbbbb;
        font-size: 13px;
        user-select: none;
      }
      .el-switch__label.is-active {
        color: #409EFF !important;
      }
    }
    .plates_box{
      display: flex;
      align-items: center;
    }
    .tag_title{
      margin-bottom: 0;
      margin-right: 20px;
    }
    .region_class{
      .region_select input{
        background: none;
        color: #ffffff;
        font-size: 12px;
        border: none;
        user-select: none;
        width: 80px;
        padding-left: 0px;
      }
    }
  }
  .common_box{
    .common_tags{
      padding: 10px 20px;
      overflow: hidden;
      border-radius: 10px;
      background: rgba(0, 0, 0, 0.28);
      color: #fff;
      margin-bottom: 10px;
      .ctags_box{
        display: flex;
        flex-wrap: wrap;
        .tag_item{
          padding: 4px 12px;
          background: rgba(144,147,153,0.14);
          border-radius: 15px;
          cursor: pointer;
          margin-bottom: 8px;
          margin-right: 8px;
          font-size: 12px;
          color: #dcdfe6;
          transition: all 0.3s;
          user-select: none;
        }
        .tag_item_cur{
          padding: 4px 12px;
          border-radius: 15px;
          cursor: pointer;
          margin-bottom: 8px;
          margin-right: 8px;
          font-size: 12px;
          background: rgba(149,149,246,0.5);
          color: #fff;
          transition: all 0.3s;
          user-select: none;
        }
        .tag_item:hover{
          background: rgba(149,149,246,0.5);
          color: #fff;
        }
      }
    }
    .menu_tags{
      padding: 10px 20px;
      overflow: hidden;
      border-radius: 10px;
      background: rgba(0, 0, 0, 0.28);
      color: #fff;
      margin-bottom: 10px;
      max-height: 40%;
      .atag_box{
        display: flex;
        
        .tag_left{
          padding-right: 15px;
          border-right: #1b2e35 1px solid;
          .tag_1{
            width: 18px;
            text-align: center;
            padding: 8px 5px;
            border-radius: 18px;
            margin-top: 5px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            color: #dcdfe6;
            user-select: none;
            transition: all 0.3s;
            background: rgba(144,147,153,0.14);
            margin-bottom: 10px;
          }
          .atag1_cur{
            width: 18px;
            text-align: center;
            padding: 8px 5px;
            border-radius: 18px;
            margin-top: 5px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            color: #fff;
            user-select: none;
            transition: all 0.3s;
            background: rgba(149,149,246,0.5);
            margin-bottom: 10px;
          }
          .tag_1:hover{
            background: rgba(149,149,246,0.5);
            color: #fff;
          }
        }
        .tag_right{
          margin-left: 15px;
          max-height: 90%;
          overflow-y: scroll;
          .tag2_name{
            padding: 4px 12px;
            font-size: 15px;
            font-weight: bold;
            margin: 5px 5px;
            cursor: pointer;
            color: #9595f6;
            width: auto;
          }
          .atag2_cur{
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 15px;
            font-weight: bold;
            margin: 5px 5px;
            transition: all 0.3s;
            user-select: none;
            color: #fff;
            background: rgba(149,149,246,0.5);
          }
          .tag3_box{
            display: flex;
            border-radius: 3px;
            margin: 4px 5px;
            align-items: center;
            cursor: pointer;
            width: auto;
            .tag3_name{
              font-size: 14px;
              font-weight: bold;
              color: #e6a23c;
              margin-left: 15px;
              margin-right: 10px;
              padding: 4px 12px;
            }
            .atag3_cur{
              padding: 4px 12px;
              border-radius: 15px;
              cursor: pointer;
              margin-left: 15px;
              margin-right: 10px;
              font-size: 14px;
              transition: all 0.3s;
              user-select: none;
              color: #fff;
              background: rgba(149,149,246,0.5);
            }
          }
          .tag4_box{
            transition: all 0.5s;
            margin-left: 20px;
            .tag4_name{
              padding: 4px 12px;
              cursor: pointer;
              margin-bottom: 8px;
              margin-right: 8px;
              font-size: 12px;
              transition: all 0.3s;
              user-select: none;
              color: #f56c6c;
            }
            .atag4_cur{
              padding: 4px 12px;
              border-radius: 15px;
              cursor: pointer;
              margin-bottom: 8px;
              margin-right: 8px;
              font-size: 12px;
              transition: all 0.3s;
              user-select: none;
              color: #fff;
              background: rgba(149,149,246,0.5);
            }
            .tag4_name:hover{
              border-radius: 15px;
              background: rgba(149,149,246,0.5);
              color: #fff;
            }
          }
        }
      }
      .el-select .el-input .el-select__caret{
        color: #fff;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .custom_box{
    height: 90%;
    .custom_tags{
      padding: 10px 10px 10px 20px;
      border-radius: 10px;
      background: rgba(0, 0, 0, 0.28);
      color: #fff;
      margin-bottom: 10px;
      height: 30%;
      position: relative;
      overflow: hidden;
      .loading{
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: 99;
      }
      .new_grade{
        height: 70%;
      }
      .ctags_box{
        height: 83%;
        overflow-y: scroll;
        .btn_box{
          
          .el-button--mini.is-circle {
            padding: 5px;
          }
        }
        .top{
          width: 100%;
          display: flex;
          justify-content: space-between;
        }
        .cont{
          display:flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 12px;
          .c_item{
            font-size: 12px;
            color: #b3b3b3;
            span{
              margin-right: 5px;
              display: inline-block;
              padding: 2px 10px;
              background: rgba(0, 0, 0, 0.39);
              border-radius: 20px;
            }
          }
          .name{
            margin-right: 10px;
          }
        }
        .tag_item{
          padding: 4px 12px;
          background: rgba(144,147,153,0.14);
          border-radius: 15px;
          cursor: pointer;
          margin-bottom: 8px;
          margin-right: 8px;
          font-size: 12px;
          color: #dcdfe6;
          transition: all 0.3s;
          user-select: none;
          max-width: 60%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .tag_item_cur{
          padding: 4px 12px;
          border-radius: 15px;
          cursor: pointer;
          margin-bottom: 8px;
          margin-right: 8px;
          font-size: 12px;
          background: rgba(149,149,246,0.5);
          color: #fff;
          transition: all 0.3s;
          user-select: none;
          max-width: 60%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .tag_item:hover{
          background: rgba(149,149,246,0.5);
          color: #fff;
        }
      }
    }
    .grade_detail{
      padding: 10px 20px;
      overflow: hidden;
      border-radius: 10px;
      background: rgba(0, 0, 0, 0.28);
      color: #fff;
      margin-bottom: 10px;
      position: relative;
      height: 55%;
      .detail_box{
        margin-top: 10px;
        border-top: #233035 1px solid;
        height: 80%;
        overflow-y: scroll;
        padding: 10px 0;
        .tips{
          font-size: 12px;
          margin-bottom: 10px;
        }
        .el-tree-node__expand-icon{
          color: #9595f6;
        }
        .el-tree-node__expand-icon.is-leaf {
          color: transparent;
          cursor: default;
        }
        .el-tree-node__content:hover {
          background-color: rgba(0, 0, 0, 0.2);
        }
        .el-tree-node:focus>.el-tree-node__content {
          background-color: rgba(0, 0, 0, 0.2);
        }
        .el-tree{
          background: none;
        }
        .box3TreeNode{
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          padding-right: 8px;
          .node_name {
            color: #e6a23c;
          }
          .node_weight{
            color: #f56c6c;
          }
          .node_ahp{
            font-size: 14px;
          }
        }
      }
    }
    .new_grade{
      padding: 10px 20px;
      overflow: hidden;
      border-radius: 10px;
      background: rgba(0, 0, 0, 0.28);
      color: #fff;
      margin-bottom: 10px;
      position: relative;
      overflow: hidden;
      .loading{
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: 99;
      }
      .tree_box{
        height: 73%;
        overflow-y: scroll;
        .el-tree-node__expand-icon{
          color: #9595f6;
        }
        .el-tree-node__expand-icon.is-leaf {
          color: transparent;
          cursor: default;
        }
        .box2{
          padding: 50px 60px;
          .el-radio{
            margin: 10px 0;
            color: #ccc;
          }
          .el-input__inner{
            background: none;
            border: none;
            border-bottom: #42565f 1px solid;
            border-radius: 0;
            color: #e6a23c;
          }
        }
        .box3{
          .box3TreeNode{
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            padding-right: 8px;
          
            
            .node_name {
              color: #e6a23c;
            }
            .node_weight{
              color: #f56c6c;
            }
            .right_cont{
              display: flex;
              align-items: center;
              .weightInput{
                width: 80px;
                .el-input__inner {
                  padding-left: 2px;
                  padding-right: 30px;
                  font-weight: bold;
                }
              }
              .tip_point{
                width: 8px;
                height: 8px;
                border-radius: 50%;
                // background: #f56c6c;
                margin-left: 10px;
              }
            }
          }
        }
        .el-tree-node__content{
          height: 35px;
        }
      }
      .top{
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .tips{
        padding: 10px 0;
        margin-top: 10px;
        font-size: 12px;
        color: #ccc;
        border-top: #233035 1px solid;
        display: flex;
        align-items: center;
        .step{
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #f56c6c;
          color: #fff;
          line-height: 16px;
          font-size: 12px;
          text-align: center;
          user-select: none;
          margin-right: 10px;
        }
        .tip_text{
          width: 90%;
        }
      }
      .btn_control{
        display: flex;
        margin-top: 5px;
      }
      .el-tree{
        background: none;
      }
      .el-tree-node__label{
        color: #e6a23c;
      }
      .el-tree-node__content:hover {
        background: none;
      }
      .el-tree-node:focus>.el-tree-node__content {
        background: none;
      }
    }
  }
}
</style>
