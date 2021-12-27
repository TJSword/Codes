<template>
  <div class="ledger">
    <div class="parameterContent">
      <el-tabs type="card" v-model="tanActiveName" @tab-click="tabClick">
        <!-- 我的台账 -->
        <el-tab-pane label="我的台账" name="myParameter">
          <el-table
            ref="ledgerTable"
            id="myParTable"
            :data="myParameterData.filter(data => !myParSearch || data.name.toLowerCase().includes(myParSearch.toLowerCase()))"
            tooltip-effect="dark"
            :header-cell-style="{ background: '#222222', color: '#fff' }"
            :cell-style="{color: '#b3b3b3'}"
            style="width: 100%"
            :height="tableHeight"
            :row-class-name="tableRowClassName"
            :expand-row-keys="expandsRow"
            :row-key="getRowKeys"
            highlight-current-row
            @row-click="selectLedger"
            @selection-change="myParChange"
            @expand-change="getLedgerDetail">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column type="expand">
              <template slot-scope="props">
                <div v-for="land in props.row.lands" :key="land.id" >
                  <el-form label-position="left" inline class="demo-table-expand">
                    <div class="land_head">{{ '地块 '+land.landName }}</div>
                    <el-form-item label="土地编号">
                      <el-tag>{{ land.landNumber?land.landNumber:'暂无' }}</el-tag>
                    </el-form-item>
                    <el-form-item label="地块名">
                      <el-tag>{{ land.landName?land.landName:'暂无' }}</el-tag>
                    </el-form-item>
                    <el-form-item label="土地用途">
                      <el-tag>{{ land.purpose?converseLandType(land.purpose):'暂无' }}</el-tag>
                    </el-form-item>
                    <el-form-item label="住宅：商业" v-if="land.purpose==='commerce_house'">
                      <el-tag>{{ land.chRatio?land.chRatio:'暂无' }}</el-tag>
                    </el-form-item>
                    <el-form-item label="占地面积(㎡)">
                      <el-tag>{{ land.landArea?land.landArea:'暂无' }}</el-tag>
                    </el-form-item>
                    <el-form-item label="容积率">
                      <el-tag>{{ land.volumeRatio?land.volumeRatio:'暂无' }}</el-tag>
                    </el-form-item>
                    <el-form-item label="建筑面积(㎡)">
                      <el-tag>{{ land.buildArea?land.buildArea:'暂无' }}</el-tag>
                    </el-form-item>
                    <el-form-item label="起拍总价(万元)">
                      <el-tag>{{ land.startTotalPrice?land.startTotalPrice:'暂无' }}</el-tag>
                    </el-form-item>
                    <el-form-item label="成交时间">
                      <el-tag>{{ land.date?land.date:'暂无' }}</el-tag>
                    </el-form-item>
                    <el-form-item label="成交总价(万元)">
                      <el-tag>{{ land.totalPrice?land.totalPrice:'暂无' }}</el-tag>
                    </el-form-item>
                    <el-form-item label="起拍楼面价(元/㎡)">
                      <el-tag>{{ land.startPrice?land.startPrice:'暂无' }}</el-tag>
                    </el-form-item>
                    <el-form-item label="成交楼面价(元/㎡)">
                      <el-tag>{{ land.price?land.price:'暂无' }}</el-tag>
                    </el-form-item>
                    <el-form-item label="溢价率">
                      <el-tag>{{ land.premiumRatio?land.premiumRatio:'暂无' }}</el-tag>
                    </el-form-item>
                    <el-form-item label="竞得单位">
                      <el-tag>{{ land.competeCompany?land.competeCompany:'暂无' }}</el-tag>
                    </el-form-item>
                  </el-form>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="台账名称"
              show-overflow-tooltip
              header-align="center"
              align="center">
            </el-table-column>
            <el-table-column
              label="录入日期"
              sortable
              header-align="center"
              align="center">
              <template slot-scope="scope">{{ scope.row.createDate }}</template>
            </el-table-column>
            <el-table-column
              prop="description"
              label="位置"
              show-overflow-tooltip
              header-align="center"
              align="center">
            </el-table-column>
            
            <el-table-column 
              header-align="center"
              align="center">
              <template slot="header" slot-scope="scope">
                <el-input
                  :class="scope.$index"
                  v-model="myParSearch"
                  size="mini"
                  placeholder="输入关键字搜索"/>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit" circle
                  @click.stop="myParEdit(scope.$index, scope.row)"></el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete" circle
                  @click.stop="myParDelete(scope.$index, scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="bottomBar">
            <div class="optionBtns">
              <el-button size="mini" type="primary" @click="exportParameter()">批量导出</el-button>
              <el-button size="mini" type="warning" @click="exportParameter(true)">导出全部</el-button>
              <el-button size="mini" v-if="false" @click="downloadParTemp">下载导入模板</el-button>
              <el-upload
                v-if="false"
                class="parTempUpload"
                :action="BASE_URL+'/app/poisign/upload'"
                :headers="{
                  token:getToken
                }"
                :show-file-list="false"
                :limit="1"
                :before-upload="tempBeforeUpload"
                :on-success="tempUploadSuccess"
                :on-error="tempUploadError">
                <el-button size="mini" style="margin-left:10px" type="danger">批量导入</el-button>
              </el-upload>
            </div>
            <div class="paginationBox">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="curPage"
                :page-sizes="[10, 30, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="myParCount">
              </el-pagination>
            </div>
          </div>
          
        </el-tab-pane>
        <!-- 新建台账 -->
        <el-tab-pane :label="isParModify?'台账修改':'新建台账'" name="newParameter">
          <el-form class="parInfoForm" ref="createrForm" :rules="createrFormRules" :model="createrForm" label-width="100px">
            <div class="parInfoBox">
              <!-- 基础信息 -->
              <div class="baseInfo">
                <el-form-item label="台账名称" prop="name">
                  <el-input size="mini" placeholder="请输入台账名称" v-model="createrForm.name"></el-input>
                </el-form-item>
                <el-form-item label="位置" prop="description">
                  <el-input size="mini" placeholder="可修改定位位置" v-model="createrForm.description"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button size="mini" type="success" @click="chooseParPosition()">{{addLedgerInfo.isAdd?"地图选择台账点":"选择位置"}}</el-button>
                </el-form-item>
              </div>
              
              <!-- 详细信息 -->
              <el-tabs v-model="createrForm.curTabName" type="card" editable @edit="landTabsEdit">
                <el-tab-pane
                  :key="i" v-for="(item,i) in createrForm.landList"
                  :label="item.landName" :name="item.tabName">
                  <div class="detailInfo">
                    <el-form-item label="土地编号" prop="landNumber">
                      <el-input size="mini" placeholder="请输入土地编号" v-model="item.landNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="地块名" :prop="'landList.'+i+'.landName'" :rules="createrFormRules.landName">
                      <el-input size="mini" placeholder="请输入地块名" v-model="item.landName"></el-input>
                    </el-form-item>
                    <el-form-item label="土地用途" :prop="'landList.'+i+'.purpose'" :rules="createrFormRules.purpose">
                      <el-select size="mini" v-model="item.purpose" placeholder="请选择土地用途" style="width:100%;">
                        <el-option 
                        v-for="(type,index) in landTypeArr" 
                        :key = "index"
                        :label="type.label"
                        :value="type.value"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item v-if="item.purpose==='commerce_house'" label="住宅：商业" :prop="'landList.'+i+'.chRatio'" :rules="createrFormRules.landArea">
                      <el-input size="mini" placeholder="请输入住宅商业比例" v-model="item.chRatio"></el-input>
                    </el-form-item>
                    <el-form-item label="占地面积" :prop="'landList.'+i+'.landArea'" :rules="createrFormRules.landArea">
                      <el-input size="mini" placeholder="请输入占地面积(㎡)" v-model="item.landArea"></el-input>
                    </el-form-item>
                    <el-form-item label="容积率" :prop="'landList.'+i+'.volumeRatio'" :rules="createrFormRules.volumeRatio">
                      <el-input size="mini" placeholder="请输入容积率" v-model="item.volumeRatio"></el-input>
                    </el-form-item>
                    <el-form-item label="建筑面积" :prop="'landList.'+i+'.buildArea'" :rules="createrFormRules.buildArea">
                      <el-input size="mini" placeholder="请输入建筑面积(㎡)" v-model="item.buildArea"></el-input>
                    </el-form-item>
                    <el-form-item label="起拍总价" prop="startTotalPrice">
                      <el-input size="mini" placeholder="请输入起拍总价(万元)" v-model="item.startTotalPrice"></el-input>
                    </el-form-item>
                    <el-form-item label="成交时间" prop="date">
                      <el-date-picker size="mini" type="date" placeholder="选择时间" v-model="item.date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="成交总价" prop="totalPrice">
                      <el-input size="mini" placeholder="请输入成交总价(万元)" v-model="item.totalPrice"></el-input>
                    </el-form-item>
                    <el-form-item label="起拍楼面价" prop="startPrice">
                      <el-input size="mini" placeholder="请输入起拍楼面价(元/㎡)" v-model="item.startPrice"></el-input>
                    </el-form-item>
                    <el-form-item label="成交楼面价" prop="price">
                      <el-input size="mini" placeholder="请输入成交楼面价(元/㎡)" v-model="item.price"></el-input>
                    </el-form-item>
                    <el-form-item label="溢价率" prop="premiumRatio">
                      <el-input size="mini" placeholder="请输入溢价率" v-model="item.premiumRatio"></el-input>
                    </el-form-item> 
                    <el-form-item label="竞得单位" prop="competeCompany">
                      <el-input size="mini" placeholder="请输入竞得单位" v-model="item.competeCompany"></el-input>
                    </el-form-item>
                    <el-form-item label="轮廓绘制" prop="">
                      <el-button v-if="item.coordinates==null" size="mini" @click="drawPolygon">点击绘制土地轮廓</el-button>
                      <el-button v-else size="mini" @click="delLandFeature(item.featureID)">重绘</el-button>
                    </el-form-item>
                  </div>
                </el-tab-pane>
              </el-tabs>
              
              <div style="width:100%;border-top:#414d56 1px solid;margin:20px 0;"></div>
              <div v-if="!isParModify" class="landimg_box">
                <el-upload
                  :action="imgUploadURL+'/lms/work/account/upload'"
                  ref="landsInfo"
                  :data="{'accountId':accountId}"
                  :headers="{
                    token:getToken
                  }"
                  :class="{hideAdd:landImgList.length>3}"
                  list-type="picture-card"
                  :file-list="landImgList"
                  :on-preview="landFilePreview"
                  :on-success="landFileUploadSuccess"
                  :on-change="landFileChange"
                  :on-remove="landFileRemove"
                  :auto-upload="false">
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
              </div>
              <div v-else class="modify_imgbox">
                <div class="img_item" v-for="item in midifyImgList" :key="item.id">
                  <i class="img_remove el-icon-error" @click="removeLandImg(item.id)"></i>
                  <el-image 
                    class="modify_img"
                    :src="item.url" 
                    :preview-src-list="midifyImgList">
                  </el-image>
                </div>
              </div>
              <div style="width:100%;border-top:#414d56 1px solid;margin:20px 0;"></div>
              <div class="formBtnBox">
                <el-button size="mini" type="primary" @click="parInfoSub('createrForm')">{{isParModify?'更新台账':'提交台账'}}</el-button>
                <el-button size="mini" @click="parInfoReset('createrForm')">{{isParModify?'退出修改':'重置'}}</el-button>
              </div>
            </div>
            
            
          </el-form>
        </el-tab-pane>
        <!-- 汇总统计 -->
        <el-tab-pane v-if="false" label="汇总统计" name="myParStatistical">
          <div class="query_info">
            <label>统计类型：</label>
            <el-select v-model="curPar" size="mini" @change="parTypeChange" placeholder="请选择统计类型">
              <el-option 
              v-for="(item,index) in statisticalType" 
              :key = "index"
              :label="item.label"
              :value="item"></el-option>
            </el-select>
            <label style="margin-left:30px;">选择时间：</label>
            <!-- 时间范围 -->
            <el-date-picker
              size="mini"
              ref="marketMonth_parameter"
              v-model="monthRange"
              format="yyyy 年 MM 月"
              value-format="yyyy-MM"
              type="monthrange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始月份"
              end-placeholder="结束月份"
              :picker-options="pickerOptions"
              @change="monthChange"
            ></el-date-picker>
          </div>
          <div id="parStatisticalChart"></div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
//Api
import ledgerApi from "@/api/ledgerApi";

//store
import { mapGetters } from "vuex"
//插件
import fileDownload from 'js-file-download'//文件流下载

export default {
  name:'ledgercomponent',
  props:{},
  components:{},
  data(){
    return{
      tableHeight:window.innerHeight-155,//表格高度
      tanActiveName:'myParameter',//当前的tab
      //我的台账
      getRowKeys(row) {
        return row.id;
      },
      expandsRow:[],//表格展开行id
      select_ledgerID:null,//选中的台账
      myParameterDataAll:[],//台账全部数据
      myParameterData: [ //台账当前页数据
        
      ],
      myParCount:null, //我的台账条数
      pageSize:30,//每页的条数
      curPage:1,//当前页码
      myParSelection:[],//选择的台账
      isParModify:false,//修改模式
      myParSearch:'',//搜索关键词
      landTypeArr:[ //土地类型数组
      ],
      //新建台账
      uploadURL:'ceshi',
      dialogVisible:false,
      dialogImageUrl:'',
      midifyImgList:[], //修改图片列表
      landImgList:[],//土地图片列表
      accountId:null,//上传土地信息返回的ID用于土地图片上传
      createrForm:{ //台账表单信息
        id:'', //台账ID
        createDate: '', //录入日期
        name: '', //台账名称
        //creator:'', //录入人
        description: '', //地址
        lat:'', //纬度
        lng:'', //经度
        //insertType:1,//录入方式1:新建 4:导入
        
        curTabName:'1',//当前选择tab的name
        tabIndex: 1, 
        landList:[{
          tabName:'1',
          coordinates:null,//轮廓
          featureID:null,//轮廓ID
          landNumber:'', //土地编号
          landName:'未命名土地',//地块名
          purpose:'',//土地用途
          chRatio:'',//住宅：商业
          landArea:'',//占地面积
          volumeRatio:'',//容积率
          buildArea:'',//建筑面积
          startTotalPrice:'',//起拍总价
          startPrice:'',//起拍楼面价
          date:'',//成交时间
          totalPrice:'',//成交总价
          price:'',//成交楼面价
          competeCompany:'',//竞得单位
          premiumRatio:'',//溢价率
        }]
      },
      createrFormRules:{ //表单验证
        name: [
          { required: true, message: '请输入台账名称', trigger: 'blur' },
        ], 
        landName: [
          { required: true, message: '请输入地块名', trigger: 'blur' },
        ], 
        purpose: [
          { required: true, message: '请选择土地用途', trigger: 'change' }
        ],
        landArea: [
          { required: true, message: '请输入占地面积', trigger: 'blur' },
        ], 
        volumeRatio: [
          { required: true, message: '请输入容积率', trigger: 'blur' },
        ], 
        buildArea: [
          { required: true, message: '请输入建筑面积', trigger: 'blur' },
        ], 
      },
      //汇总统计
      curPar:{ label:'占地面积',value:'landarea'}, //当前统计类型
      monthRange: [], //月份范围(未处理)
      reqMonthRange: [], //月份范围(用于请求)
      pickerOptions: {
        //月份快捷选择模块
        disabledDate(time) {
          //禁用日期
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "本月",
            onClick(picker) {
              picker.$emit("pick", [new Date(), new Date()]);
            }
          },
          {
            text: "今年至今",
            onClick(picker) {
              const end = new Date();
              const start = new Date(new Date().getFullYear(), 0);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近六个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 6);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      monthParData:[],//月份段内的台账数据
      statisticalType:[ //统计类型数组
        { label:'占地面积(㎡)',value:'landarea'},
        // { label:'容积率',value:'volumeratio'},
        { label:'建筑面积(㎡)',value:'landarea2'},
        { label:'起拍总价(万元)',value:'starttotalprice'},
        { label:'成交总价(万元)',value:'totalprice'},
        { label:'起拍楼面价(元/㎡)',value:'startprice'},
        { label:'成交楼面价(元/㎡)',value:'price'},
        // { label:'溢价率',value:'premiumratio'}
      ], 
    }
  },
  mounted(){
    //获取我的台账数据
    this.getMyParameter()
    //获取用地性质字典
    this.getLandType()
    setTimeout(()=>{
      //地图绘制事件
      this.ledgerMapEvent()
      //添加土地轮廓图层
      this.landLayerLoad()
      //添加土地点图层
      this.mapSetLedgerLayer()
    },1500)
    
  },
  watch:{
    addLedgerInfo:{
      handler(newVal){
        this.createrForm.description = newVal.address
        this.createrForm.lat = newVal.laglng[1]
        this.createrForm.lng = newVal.laglng[0]
      },
      deep:true
    }
  },
  computed:{
    ...mapGetters(["ledger_map","ledgerDraw","addLedgerInfo","plateData"]),
    getToken(){
       return window.localStorage.getItem("token")
    }
  },
  methods:{
    tableRowClassName({ rowIndex }) { //table间隔色
      if (rowIndex % 2 === 0) {
        return "row2";
      } else if (rowIndex % 2 === 1) {
        return "row1";
      }
      return "";
    },
    getLandType(){ //获取土地用途
      let res = ledgerApi.getTypeDict("land_use")
      res.then(res=>{
        if(res.data.code===0){
          let data = res.data.data;
          this.landTypeArr = data
          console.log('土地用途',data)
        }
      })
      
    },
    
    closeParameter() {
      //关闭
      this.parameterShow = false;
    },
    //tab切换
    tabClick(tab,event){
      console.log(tab, event);
      if(tab.label=='汇总统计'){
        this.getMonthsParData()
      }
      let map = this.ledger_map
      if(tab.label=='我的台账'){
        map.setLayoutProperty('ladgerLand_fill','visibility','none')
        map.setLayoutProperty('ladgerLand_labels','visibility','none')
      }
    },
    //根据值获得土地类型
    converseLandType(val){ 
      var name = ''
      switch(val){
        case 'house':
          name = '纯住宅';
          break;
        case 'commerce_house':
          name = '商住';
          break;
        case 'commerce':
          name = '商业';
          break;
        case 'industry':
          name = '工业';
          break;
        case 'other':
          name = '其他';
          break;
        default:
          name = null
      }
      return name
    },
    //我的台账
    myParChange(val) { //我的台账勾选
      this.myParSelection = val;
      console.log(val)
    },
    selectLedger(row){ //表格中选择台账
      console.log(row)
      if (this.select_ledgerID != row.id) {
        this.select_ledgerID = row.id;
        if(row.lng&&row.lat){
          this.flyLedger([row.lng,row.lat])
        }else{
          this.flyLedger()
        }

      } else {
        this.select_ledgerID = null;
        this.$refs.ledgerTable.setCurrentRow();
        this.flyLedger()
      }
    },
    flyLedger(site){ //飞到台账坐标
      var map = this.ledger_map
      map.flyTo({
        center: site?site:this.plateData.curCityInfo.center,
        zoom: site?16:9,
        speed: 1,
        curve: 1
      })
    },
    getMyParameter(){ //获取台账列表
      var that = this
      let res = ledgerApi.getMyLedgers()
      res.then(res=>{
        if(res.data.code===0){
          let getData = res.data.data.searchResult
          getData.forEach(item=>{
            if(item.createDate){
              let date = item.createDate.split(' ')
              item.createDate = date[0]
            }
          })
          console.log('台账数据')
          console.log(getData)
          if(getData.length>0){
            that.myParameterDataAll = JSON.parse(JSON.stringify(getData))
            
            that.myParCount = getData.length
            var s = (that.curPage-1)*that.pageSize
            var e = that.curPage*that.pageSize
            that.myParameterData = getData.slice(s,e)
           
          }
          //获取去年至今的所有月份
          that.getThisYearMonth();
        }
      })
    },
    getLedgerDetail(row){ //获取台账详情
      console.log(row,this.expandsRow)
      var that = this
      if(row.lands===undefined){
        ledgerApi.getMyLedgerDetail(row.id)
        .then(res=>{
          console.log(res)
          if(res.data.code===0){
            let data = res.data.data
            if(data.searchResult.length>0){
              that.myParameterData.forEach(item=>{
                if(item.id===row.id){
                  item.lands = data.searchResult
                  item.landImg = data.files
                }
              })
              if (that.expandsRow.includes(row.id)) {
                that.expandsRow = that.expandsRow.filter(val => val !== row.id);
              } else {
                that.expandsRow.push(row.id);
              }
              that.setLandLayer(data.searchResult)
            }else{
              that.$message('未查询到地块信息')
            }
          }
        })
      }else{
        that.setLandLayer(row.lands)
      }
    },
    handleSizeChange(val) { //每页条数
      console.log(`每页 ${val} 条`);
      var s = (this.curPage-1)*val
      var e = this.curPage*val
      this.myParameterData = this.myParameterDataAll.slice(s,e)
      this.pageSize = val
    },
    handleCurrentChange(val) { //当前页
      console.log(`当前页: ${val}`);
      var s = (val-1)*this.pageSize
      var e = val*this.pageSize
      this.myParameterData = this.myParameterDataAll.slice(s,e)
      this.curPage = val
    },
    myParEdit(index,row){ //修改台账
      console.log(index,row)
      var that = this
      let modifyLedger = {
        id:row.id,
        name:row.name,
        description:row.description,
        lat:row.lat,
        lng:row.lng,
        curTabName:'1',
        tabIndex: 1,
        landList:[]
      }
      if(row.lands===undefined){
        ledgerApi.getMyLedgerDetail(row.id)
        .then(res=>{
          console.log(res)
          if(res.data.code===0){
            let data = res.data.data
            if(data.searchResult.length>0){
              let lands = data.searchResult
              let landImg = data.files
              lands.forEach((item,i)=>{
                item.tabName = i+1+''
              })
              modifyLedger.landList = lands
              that.createrForm = JSON.parse(JSON.stringify(modifyLedger))
              that.midifyImgList = landImg
              //设置土地图层
              that.setLandLayer(lands)
              that.isParModify = true
            }else{
              that.$message('未查询到地块信息')
            }
          }
        })
      }else{
        let lands = row.lands
        let landImg = row.landImg
        lands.forEach((item,i)=>{
          item.tabName = i+1+''
        })
        modifyLedger.landList = lands
        that.createrForm = JSON.parse(JSON.stringify(modifyLedger))
        that.midifyImgList = landImg
        //设置土地图层
        that.setLandLayer(lands)
        that.isParModify = true
      }
      this.tanActiveName = 'newParameter'
    },
    setLandLayer(landArr){ //土地坐标字符串转为图层
      var that = this
      if(landArr.length>0){
        var geojson = {
          "type": "FeatureCollection",
          "features": []
        }
        landArr.forEach(item=>{
          if(item.coordinates){
            let coor = item.coordinates.split(';')
            let arr = []
            coor.forEach(c=>{
              if(c!==''){
                let coord = c.split(',')
                arr.push(coord)
              }
            })
            geojson.features.push({
              geometry:{
                coordinates:[arr],
                type:'Polygon'
              },
              properties:{ name:item.name },
              type:'Feature'
            })
          }
        })
        let map = that.ledger_map
        map.setLayoutProperty('ladgerLand_fill','visibility','visible')
        map.setLayoutProperty('ladgerLand_labels','visibility','visible')
        map.getSource('ladgerLand').setData(geojson)
      }

    },
    myParDelete(index,row){ //删除台账
      console.log(index,row)
      this.$confirm('确认删除台账——'+row.name+'?')
          .then(() => {
              let res = ledgerApi.deleteLedger(row.id)
              res.then(res=>{
                if(res.data.code === 0){
                  this.$message({
                    type: 'success',
                    message: '台账-'+row.name+'已删除!'
                  })
                  //更新台账
                  this.getMyParameter()
                  //地图台账更新
                  this.getLedgerLayer()
                }else{
                  this.$message.error('删除失败')
                }
              })
             
          })
          .catch(() => {});
    },
    exportParameter(all){ //导出选择的台账
      console.log(this.myParSelection)
      var idArr = ''
      var nameArr = ''
      if(all){ //导出全部
        if(this.myParameterDataAll.length>0){
          this.myParameterDataAll.forEach(item=>{
            idArr+=(item.id+',')
            nameArr = '全部台账'
          })
        }else{
          this.$message('台账数据为空无法导出,请先新增台账')
          return
        }
      }else{ //导出勾选的
        if(this.myParSelection.length>0){
          this.myParSelection.forEach(item=>{
            idArr+=(item.id+',')
            nameArr+=(item.name+',')
          })
        }else{
          this.$message('请先勾选要导出的台账')
          return
        }
      }
      var tip = '是否导出'+(all?'全部':'勾选的')+'台账?'
      this.$confirm(tip)
          .then(() => {
              let res = ledgerApi.exportLedger({ids:idArr})
              res.then(res=>{
                if(res.data){
                  fileDownload(res.data, nameArr+'.xlsx')
                  this.$message({
                    type: 'success',
                    message: '导出成功!'
                  })
                }else{
                  this.$message.error('导出失败')
                }
              })
          })
          .catch(() => {});
    },
    downloadParTemp(){ //下载模板
      let res = ledgerApi.downloadTemp()
      res.then(res=>{
        fileDownload(res.data, '台账导入模板.xlsx')
      })
    },
    tempBeforeUpload(file){ //上传文件的验证
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isExcel) {
        this.$message.error('请选择正确的上传格式');
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 2MB!');
      }
      return isExcel && isLt2M;
    },
    tempUploadSuccess(res,file){ //上传成功后的钩子
      console.log(res,file)
      if(res.code===0){
        this.$message({
          message:'数据导入成功',
          type:'success'
        })
        this.getMyParameter()
        //地图台账更新
        this.getLedgerLayer()
      }else{
        this.$message({
          message:'数据导入失败',
          type:'danger'
        })
      }
    },
    deletAddPoint(){ //删除添加点
      var map = this.ledger_map
      let geojson = {
        "type": "FeatureCollection",
        "features": []
      }
      map.getSource('ledgerAddLayer').setData(geojson)
    },
    tempUploadError(res,file){ //上传失败后的钩子
      console.log(res,file)
    },
    //新建台账
    
    landImageUpload(){ //台账土地图片上传
      if(this.landImgList.length>0){
        const formData = new FormData();
        formData.append("accountId",this.accountId)
        this.landImgList.forEach(list=>{
          formData.append("file",list.raw,list.raw.name)
        })
        ledgerApi.landImgUpload(formData)
        .then(res=>{
          console.log(res)
        })
        //this.$refs.landsInfo.submit();
      }
    },
    removeLandImg(id){ //删除台账图片
      ledgerApi.deleteLandImg([id])
      .then(res=>{
        if(res.data.code===0){
          this.$message('删除成功')
        }else{
          this.$message('删除失败')
        }
      })
    },
    parInfoSub(formName){ //信息提交/更新
      var that = this
      that.$refs[formName].validate((valid) => {
        if (valid) {
          //处理要提交的信息
          var obj = {
            account:{
              name:this.createrForm.name,
              lat:this.createrForm.lat,
              lng:this.createrForm.lng,
              description:this.createrForm.description,
              infos:[]
            }
          }
          this.createrForm.landList.forEach(item=>{
            let coordStr = ''
            if(item.coordinates!==null){
              if(typeof item.coordinates === 'string'){
                coordStr = item.coordinates
              }else{
                let coord = item.coordinates.geometry.coordinates[0]
                coord.forEach(co=>{
                  coordStr += (co[0]+','+co[1]+';')
                })
              }
            }
            obj.account.infos.push({
              id:item.id,
              coordinates:coordStr,
              landNumber:item.landNumber,
              landName:item.landName,
              purpose:item.purpose,
              chRatio:item.chRatio,
              landArea:item.landArea,
              volumeRatio:item.volumeRatio,
              buildArea:item.buildArea,
              startTotalPrice:item.startTotalPrice,
              startPrice:item.startPrice,
              date:item.date,
              totalPrice:item.totalPrice,
              price:item.price,
              competeCompany:item.competeCompany,
              premiumRatio:item.premiumRatio,
              description:item.description
            })
          })
          //更新台账录传入ID
          if(that.isParModify){ 
            obj.account.id = this.createrForm.id
          }
          if(!that.isParModify){ //新增
            let res = ledgerApi.ledgerSubUp(obj)
            res.then(res=>{
              if(res.data.code===0){
                console.log("台账添加成功");
                that.accountId = res.data.data.accountId
                //上传土地图片
                that.landImageUpload()
                //删除draw跟土地图层
                that.ledgerDraw.deleteAll()
                let map = that.ledger_map
                map.getSource('ladgerLand').setData({
                  "type": "FeatureCollection",
                  "features": []
                })
                that.$message({
                  type:'success',
                  message:'台账添加成功'
                })
              }else{
                that.$message({
                  type:'error',
                  message:'台账添加失败'
                })
              }
              //更新台账数据
              that.getMyParameter()
              //地图台账更新
              that.getLedgerLayer()
              //移除添加点
              that.deletAddPoint()
              
            })
          }else{
            //台账基础信息更新
            let ledgerBase = {
              id:that.createrForm.id,
              name:that.createrForm.name,
              lat:that.createrForm.lat,
              lng:that.createrForm.lng,
              description:that.createrForm.description
            }
            ledgerApi.ledgerBaseUpdata(ledgerBase)
            .then(res=>{
              if(res.data.code===0){
                console.log('台账基础信息更新成功')
              }
            })
            //台账土地信息更新
            obj.account.infos.forEach(land=>{
              if(land.id){ //更新
                ledgerApi.ledgerLandUpdata(land)
                .then(res=>{
                  if(res.data.code===0){
                    console.log('台账土地信息更新成功')
                  }
                })
              }else{ //新增
                land.accountId = that.createrForm.id
                ledgerApi.ledgerLandCreat(land)
                .then(res=>{
                  if(res.data.code===0){
                    console.log('台账土地信息上传成功')
                  }
                })
              }
              
            })
            //删除draw跟土地图层
            that.ledgerDraw.deleteAll()
            let map = that.ledger_map
            map.getSource('ladgerLand').setData({
              "type": "FeatureCollection",
              "features": []
            })

            //去除修改状态
            that.isParModify = false
          }
        } else {
          that.$message.warning('请先完善必要字段')
          return false;
        }
      });
    },
    parInfoReset(formName){ //信息重置
      this.createrForm.id = ''
      this.createrForm.createDate = ''
      this.createrForm.name = ''
      this.createrForm.description = ''
      this.createrForm.lat = ''
      this.createrForm.lng = ''
      this.createrForm.curTabName = '1'
      this.createrForm.tabIndex = 1
      this.createrForm.landList = [{
        tabName:'1',
        coordinates:null,
        featureID:null,
        landNumber:'', //土地编号
        name:'未命名土地',//地块名
        purpose:'',//土地用途
        chRatio:'',//住宅：商业
        landArea:'',//占地面积
        volumeRatio:'',//容积率
        buildArea:'',//建筑面积
        startTotalPrice:'',//起拍总价
        startPrice:'',//起拍楼面价
        date:'',//成交时间
        totalPrice:'',//成交总价
        price:'',//成交楼面价
        competeCompany:'',//竞得单位
        premiumRatio:''//溢价率
      }]
      this.landImgList = []
      //this.$refs[formName].resetFields();
      if(this.isParModify){
        this.isParModify = false
      }
      //移除添加点
      this.deletAddPoint()
      //移除土地图层
      var geojson = {
        "type": "FeatureCollection",
        "features": []
      }
      let map = this.ledger_map
      map.getSource('ladgerLand').setData(geojson)
    },
    chooseParPosition(){ //选择台账点位置
      let obj =  {
        isAdd:true,//是否添加点
        name:this.createrForm.name,
        laglng:[],//点坐标
        address:''//地址
      }
      this.$store.dispatch("setLedgerInfo",obj)
    },
    //设置统计柱状图
    setParChart(){ //根据选择的类型设置柱状图
      let curItem = this.curPar
      var data = [] //评分值
      var dataAxis = []; //评分月份

      this.monthParData.forEach(item=>{
        data.push(item[curItem.value])
        dataAxis.push(item.groupmonth)
      })

      var option = {
        title: {
          //text: curItem.label,
          subtext:  curItem.label,
          textStyle: {
              color: '#fff'
          },
          left:'center'
        },
        tooltip : {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter:curItem.label+'<br/>数值：{c}'
        },
        toolbox:{
          show: true,
          left: 'right',
          top: 'top',
          feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            //restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        grid: {
          left: '2%',
          right: '5%',
          containLabel: true
        },
        xAxis: {
          data: dataAxis,
          type: "category",
          color: "#59588D",
          boundaryGap: true,
          axisLabel: {
            margin: 20,
            color: "#999",
            textStyle: {
              fontSize: 12
            }
          },
          axisLine: {
            lineStyle: {
              color: "rgba(107,107,107,0.37)"
            }
          },
          axisTick: {
            show: false
          },
        },
        yAxis: [
          {
            type: "value",
            axisLabel: {
              formatter: "{value}",
              color: "#999",
              textStyle: {
                fontSize: 12
              }
            },
            axisLine: {
              lineStyle: {
                color: "rgba(107,107,107,0.37)"
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: "rgba(131,101,101,0.2)",
                type: "dashed"
              }
            }
          }
        ],
        dataZoom: [
            {
              type: 'inside'
            }
        ],
        series: [
          {
            type: "bar",
            barWidth: "20px",
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "#FF9A22" // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#FFD56E" // 100% 处的颜色
                    }
                  ],
                  false
                ),
                barBorderRadius: [2, 2, 0, 0]
              }
            },
            label: {
              normal: {
                show: true,
                fontSize: 12,
                fontWeight: "bold",
                color: "#bbb",
                position: "top"
              }
            },
            data: data
          }
        ]
      };
      this.$("#parStatisticalChart").css({"width":document.documentElement.clientWidth*0.5+'px',"height":'300px'});      
      var myChart = this.$echarts.init(document.getElementById("parStatisticalChart"));
      myChart.setOption(option)
    },
    //获取去年至今的所有月份
    getThisYearMonth() {
      let data = new Date();
      let year = data.getFullYear() - 1;
      let month = data.getMonth() + 1;
      if (month < 10) {
        month = "0" + month;
      } else {
        month = "" + month;
      }
      this.monthRange = [year + "-01", year + 1 + "-" + month];
      this.reqMonthRange = [year + "01", year + 1 + month];
      console.log(this.monthRange);
      console.log(this.reqMonthRange);
      this.$nextTick(()=>{
        //默认月份段台账数据
        //this.getMonthsParData()
      })
      
    },
    //台账统计月份选择
    monthChange() {
      let monthRange = this.monthRange;
      let reg = new RegExp("-");
      let arr = [];
      arr.push(monthRange[0].replace(reg, ""));
      arr.push(monthRange[1].replace(reg, ""));
      this.reqMonthRange = arr;
      console.log(monthRange);
      console.log(this.reqMonthRange);
      console.log("月份段台账统计数据");
      this.getMonthsParData() //获取市场数据
    },
    //获取月份段内的台账数据
    getMonthsParData(){
      let res = ledgerApi.getMonthsLedData({
        "minMonth":this.monthRange[0],
        "maxMonth":this.monthRange[1]
      })
      res.then(res=>{
        console.log('月份段内的台账数据')
        console.log(res.data.data.searchResult)
        if(res.data.code===0){
          this.monthParData = res.data.data.searchResult
          this.$nextTick(()=>{
            //设置柱状图
            this.setParChart()
          })
        }
      })
    },
    //台账类型切换
    parTypeChange(e){
      console.log(e)
      this.setParChart()
    },
    //文件切换修改
    landFileChange(file,fileList){
      this.landImgList = fileList
    },
    //文件删除
    landFileRemove(file, fileList){
      this.landImgList = fileList
    },
    //预览图片
    landFilePreview(file) { 
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
     //上传成功
    landFileUploadSuccess(res,file, fileList) {
      //console.log(res,file, fileList);
      if(res.code===0){
        console.log('>>户型配比文件上传成功')
      }else{
        console.log('>>户型配比文件上传失败')
      }
    },
    //添加删除地块
    landTabsEdit(targetName, action){
      console.log(targetName, action)
      let landLength = this.createrForm.landList.length
      if (action === 'add') {
        let newTabName = this.createrForm.landList.length + 1 + '';
        this.createrForm.landList.push({
          tabName: newTabName,
          coordinates:null,
          featureID:null,
          landNumber:'',
          landName:'未命名土地',
          purpose:'',
          landArea:'',
          volumeRatio:'',
          buildArea:'',
          startTotalPrice:'',
          startPrice:'',
          date:'',
          totalPrice:'',
          price:'',
          competeCompany:'',
          premiumRatio:''
        });
        this.createrForm.curTabName = newTabName;
      }
      if (action === 'remove') {
        if(landLength===1){
          this.$message('最少保留一个地块数据')
          return false
        }
        let tabs = this.createrForm.landList
        let activeName = this.createrForm.curTabName
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.tabName === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.tabName;
              }
            }
          });
        }
        this.createrForm.curTabName = activeName;
        this.createrForm.landList = tabs.filter(tab => tab.tabName !== targetName);

        // let activeName = this.createrForm.curTabName;
        // this.createrForm.landList.forEach((item,index)=>{
        //   if(targetName===item.name){
        //     this.createrForm.landList.splice(index,1)
        //   }
        // })
        // let lastIndex = this.createrForm.landList.length-1
        // if(targetName===activeName){
        //   this.createrForm.curTabName = this.createrForm.landList[lastIndex].name
        // }
      }
    },
     //绘制土地轮廓
    drawPolygon(){
      this.ledgerDraw.changeMode('draw_polygon')
      console.log(this.createrForm.curTabName)
    },
    //添加土地边界图层
    landLayerLoad(){
      var map = this.ledger_map
      map.addSource("ladgerLand", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });
      map.addLayer({
        id: "ladgerLand_fill",
        type: "fill",
        source: "ladgerLand",
        layout: {
          visibility: "visible",
        },
        paint: {
          "fill-color": [
            'match',
            ['get','name'],
            '地块1','#e6a23c',
            '地块2','#66c338',
            '地块3','#f56c6c',
            '地块4','#409eff',
            '地块5','#ff40cd',
            '地块6','#35c5b8',
            '#e6a23c'
          ],
          "fill-opacity": 0.8,
        },
      });
      map.addLayer({
        id: "ladgerLand_line",
        type: "line",
        source: "ladgerLand",
        layout: {
          visibility: "none",
        },
        paint: {
          "line-color":'#fff',
          "line-opacity": 0.25,
          "line-width": 1
        },
      });
      map.addLayer({
        id: "ladgerLand_labels",
        type: "symbol",
        source: "ladgerLand",
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["DIN Offc Pro Bold"],
          "text-allow-overlap": true,
          "text-size": 12,
          "text-letter-spacing": 0.1,
        },
        paint: {
          "text-color":'#fff'
        },
      });
    },
    //地图台账图层
    mapSetLedgerLayer() {
      var that = this;
      var map = this.ledger_map;
      
      //台账点
      map.loadImage("http://47.104.165.136:8099/test/site_icon2.png", function(
        error,
        tz_point
      ) {
        if (error) throw error;
        map.addImage("tz_point", tz_point);
        map.addSource("ledgerLayer", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });
        map.addLayer({
          id: "ledgerPoint",
          type: "symbol",
          source: "ledgerLayer",
          layout: {
            "icon-image": "tz_point",
            "icon-allow-overlap":true,
            "icon-ignore-placement":true,
            "text-field": "{name}",
            "text-offset": [0, -2.5],
            "text-anchor": "top",
            "text-font": ["Open Sans Semibold"],
            "text-size": 12,
            "icon-size": 0.5,
            "visibility":"visible"
          },
          paint: {
            "text-opacity": 1,
            "text-halo-color": "rgba(0,0,0,0.6)",
            "text-halo-width": 1,
            "text-color": "#42beff",
          },
        });
      });
      //临时点
      map.loadImage(
        "http://47.104.165.136:8099/test/center_point.png",
        function(error, tz_addpoint) {
          if (error) throw error;
          map.addImage("tz_addpoint", tz_addpoint);
          map.addSource("ledgerAddLayer", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [],
            },
          });
          map.addLayer({
            id: "ledgerAddPoint",
            type: "symbol",
            source: "ledgerAddLayer",
            layout: {
              "icon-image": "tz_addpoint",
              // "text-field": "{name}",
              "text-offset": [0, -2.5],
              "text-anchor": "top",
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-size": 13,
              "icon-size": 0.5,
              "visibility": "visible",
            },
            paint: {
              "text-opacity": 1,
              "text-halo-color": "rgba(255,255,255,1)",
              "text-halo-width": 1.5,
              "text-color": "#1b82f1",
            },
          });
        }
      );
      map.on("click", "ledgerPoint", (e) => {
        //console.log(e);
      });
      var ledgerPopup = new that.mbgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });
      map.on("mousemove", "ledgerPoint", function(e) {
        map.getCanvas().style.cursor = "pointer";
        let coordinates = [e.lngLat.lng, e.lngLat.lat];
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        var name = e.features[0].properties.name;
        var createDate = e.features[0].properties.createDate;
        var description = e.features[0].properties.description;
        var landNumber = e.features[0].properties.landNumber;
        var name = e.features[0].properties.name;
        var purpose = that.converseLandType(e.features[0].properties.purpose);
        var landArea = e.features[0].properties.landArea;
        var volumeRatio = e.features[0].properties.volumeRatio;
        var landArea2 = e.features[0].properties.landArea2;
        var startTotalPrice = e.features[0].properties.startTotalPrice;
        var date = e.features[0].properties.date;
        var totalPrice = e.features[0].properties.totalPrice;
        var startPrice = e.features[0].properties.startPrice;
        var price = e.features[0].properties.price;
        var premiumRatio = e.features[0].properties.premiumRatio;
        var competeCompany = e.features[0].properties.competeCompany;

        var info = `<P class="item_head">台账名称：${ name != "null" ? name : "-"}</p>
              <div class="item_name">录入日期：<span class="item_val">${createDate != "null" ? createDate : "-"}</span></div>
              <div class="item_name">地址：<span class="item_val">${description != "null" ? description : "-"}</span></div>`;
              // <div class="item_name">土地编号：<span class="item_val">${landNumber != "null" ? landNumber : "-"}</span></div>
              // <div class="item_name">地块名：<span class="item_val">${name != "null" ? name : "-"}</span></div>
              // <div class="item_name">土地用途：<span class="item_val">${purpose != null ? purpose : "-"}</span></div>
              // <div class="item_name">占地面积：<span class="item_val">${landArea != "null" ? landArea : "-"}㎡</span></div>
              // <div class="item_name">容积率：<span class="item_val">${volumeRatio != "null" ? volumeRatio : "-"}</span></div>
              // <div class="item_name">建筑面积：<span class="item_val">${landArea2 != "null" ? landArea2 : "-"}㎡</span></div>
              // <div class="item_name">起拍总价：<span class="item_val">${startTotalPrice != "null" ? startTotalPrice : "-"}万元</span></div>
              // <div class="item_name">成交时间：<span class="item_val">${date != "null" ? date : "-"}</span></div>
              // <div class="item_name">成交总价：<span class="item_val">${totalPrice != "null" ? totalPrice : "-"}万元</span></div>
              // <div class="item_name">起拍楼面价：<span class="item_val">${startPrice != "null" ? startPrice : "-"}元/㎡</span></div>
              // <div class="item_name">成交楼面价：<span class="item_val">${price != "null" ? price : "-"}元/㎡</span></div>
              // <div class="item_name">溢价率：<span class="item_val">${premiumRatio != "null" ? premiumRatio : "-"}</span></div>
              // <div class="item_name">竞得单位：<span class="item_val">${competeCompany != "null" ? competeCompany : "-"}</span></div>
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        ledgerPopup
          .setLngLat(coordinates)
          .setHTML(info)
          .addTo(map);
      });
      map.on("mouseleave", "ledgerPoint", function() {
        map.getCanvas().style.cursor = "";
        ledgerPopup.remove();
      });
      that.getLedgerLayer();
      
    },
    getLedgerLayer() {
      //更新台账图层数据
      var map = this.ledger_map;

      ledgerApi.getMyLedgers().then((res) => {
        if (res.data.code === 0) {
          let getData = res.data.data.searchResult;
          console.log("台账图层数据");
          console.log(getData);
          if (getData.length > 0) {
            let arr = [];
            getData.forEach((item) => {
              let obj = {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [item.lng, item.lat],
                },
                properties: {
                  id: item.id, //台账ID
                  createDate: item.createDate, //录入日期
                  name: item.name, //台账名称
                  creater: item.creater, //录入人
                  description: item.description, //地址
                  lat: item.lat, //纬度
                  lng: item.lng, //经度
                  insertType: item.insertType, //录入方式1:新建 4:导入

                  landNumber: item.landNumber, //土地编号
                  name: item.name, //地块名
                  purpose: item.purpose, //土地用途
                  landArea: item.landArea, //占地面积
                  volumeRatio: item.volumeRatio, //容积率
                  landArea2: item.landArea2, //建筑面积
                  startTotalPrice: item.startTotalPrice, //起拍总价
                  startPrice: item.startPrice, //起拍楼面价
                  date: item.date, //成交时间
                  totalPrice: item.totalPrice, //成交总价
                  price: item.price, //成交楼面价
                  competeCompany: item.competeCompany, //竞得单位
                  premiumRatio: item.premiumRatio, //溢价率
                  icon: "marker",
                  // "icon": "monument"
                },
              };
              arr.push(obj);
            });
            var geojson = {
              type: "FeatureCollection",
              features: arr, //获取poi列表
            };
            setTimeout(() => {
              map.getSource("ledgerLayer").setData(geojson);
            }, 500);
          }
        }
      });
    },
    //土地边界图层设置
    landLayerSet(){
      let arr = []
      this.createrForm.landList.forEach(item=>{
        if(item.coordinates!==null){
          let feature = JSON.parse(JSON.stringify(item.coordinates))
          feature.properties.name = '地块'+item.landName
          arr.push(feature)
        }
      })
      var geojson = {
        "type": "FeatureCollection",
        "features": arr
      }
      let map = this.ledger_map
      map.setLayoutProperty('ladgerLand_fill','visibility','visible')
      map.setLayoutProperty('ladgerLand_labels','visibility','visible')
      map.getSource('ladgerLand').setData(geojson)
    },
    //地图绘制事件
    ledgerMapEvent(){
      var that = this
      var map = this.ledger_map
      map.on("click", "ledgerPoint", (e) => {
        console.log(e);
      });
      map.on('mouseup',(e)=>{
        
      })
      map.on('draw.create', function (e) {
        console.log(e.features);
        that.createrForm.landList.forEach(item=>{
          if(item.tabName===that.createrForm.curTabName){
            item.coordinates = e.features[0]
            item.featureID = e.features[0].id
          }
        })
        that.landLayerSet()
        console.log(that.createrForm.landList)
      });
      map.on('draw.update', function (e) {
        console.log(e.features);
        let id = e.features[0].id
        that.createrForm.landList.forEach(item=>{
          if(id===item.featureID){
            item.coordinates = e.features[0]
          }
        })
        that.landLayerSet()
        console.log(that.createrForm.landList)
      });
      map.on('draw.delete', function (e) {
        console.log(e.features);
        let id = e.features[0].id
        that.createrForm.landList.forEach(item=>{
          if(id===item.featureID){
            item.coordinates = null
            item.featureID = null
          }
        })
        that.landLayerSet()
        console.log(that.createrForm.landList)
      });
    },
    //删除土地轮廓
    delLandFeature(id){
      this.ledgerDraw.delete(id)
      this.createrForm.landList.forEach(item=>{
        if(item.featureID===id){
          item.coordinates = null
          item.featureID = null
        }
      })
      this.landLayerSet()
      this.drawPolygon()
    },
  }
 
}
</script>
<style lang="scss">
.ledger{
  .modify_imgbox{
    display: flex;
    .img_item{
      width: 148px;
      height: 148px;
      margin-right: 20px;
      position: relative;
      .modify_img{
        width: 100%;
        height: 100%;
      }
      .img_remove{
        position: absolute;
        right: 3px;
        top: 3px;
        color: #f78989;
        font-size: 18px;
        z-index: 99;
        display: none;
        cursor: pointer;
      }
      
    }
    .img_item:hover .img_remove{
        display: block;
      }
  }
  .land_head{
    font-size: 14px;
    padding: 10px 0;
    color: #e6a23c;
  }
  .v-modal{
    display: none;
  }
  .hideAdd {
    .el-upload--picture-card {
      display: none;
    }
  }
  .el-upload--picture-card{
    background: none;
  }
  .el-range-input{
    color: #e6a23c;
  }
  .el-range-separator{
    color: #b3b3b3;
  }
  .el-form-item__label{
    color: #9aa5bb;
  }
  .el-table tr, .el-table__expanded-cell{
    background: none
  }
  .el-input__inner{
    background: none;
    border: 1px solid #4d586f;
    color: #e6a23c;
  }
  .el-tag{
    background: none !important;
    border-color: #545454;
  }
  .el-tabs__header{
    margin: 0;
  }
  .el-tabs__item {
    color: #c6cbd4;
  }
  .el-tabs__item.is-active {
    color: #8c8aff;
  }
  .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
    border-bottom-color: #8c8aff;
  }
  .el-tabs--card>.el-tabs__header .el-tabs__nav {
    border: none;
  }
  .el-tabs--card>.el-tabs__header .el-tabs__item {
    border-left: none;
  }
  .el-tabs--card>.el-tabs__header {
    border-bottom: 1px solid #383838;
  }
  .el-table--border::after, .el-table--group::after, .el-table::before {
    content: '';
    position: absolute;
    background-color: #383838;
    z-index: 1;
  }
  .el-table td,
  .el-table th.is-leaf,
  .el-table--border,
  .el-table--group {
    border-color: #444444;
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
  .el-table .current-row{
    .cell{
      color: #333;
    }
  }
  .query_info{
    padding: 30px;
    color: #9aa5bb;
    .el-date-editor .el-range-input{
      background: none;
    }
  }
  #parameter {
    position: fixed;
    background: rgba(0, 0, 0, 0.4);
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
  }
  .parameterWrap {
    width: 100%;
    height: 10%;
    position: relative;
  }
  .parameterHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .macroscopicName {
    font-weight: bold;
    font-size: 14px;
    display: inline-block;
    width: 12%;
  }
  .parameterWrap .el-card__body {
    height: 91%;
  }
  .parameterWrap .caseCardContent {
    height: 100%;
    position: relative;
  }
  .parameterTitle{
    margin-left: 20px;
  }
  .el-card__header{
    padding: 5px 20px !important;
  }
  .optionBtns{
    display: flex;
  }
  .demo-table-expand {
    font-size: 0;
    padding: 0 20px;
    background: #1d1f21;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 33%;
  }
  .parInfoForm{
    width: 90%;
    margin:auto;
    padding: 30px 0;
  }
  .detailInfo{
    .el-form-item{
      width: 45%;
      margin-bottom: 8px;
    }
  }
  .baseInfo{
    .el-form-item{
      width: 33%;
    }
  }
  .baseInfo,.detailInfo{
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
    justify-content: space-between;
  }
  .parInfoBox .el-input--medium .el-input__inner{
    width: 250px;
  }
  .bottomBar{
    padding: 13px;
  }
  .paginationBox{
    margin-top: 26px;
    text-align: center;
  }
  #myParTable .demo-table-expand label{
    width: 130px;
  }
  #parStatisticalChart{
    margin-top: 30px;
  }
}
</style>