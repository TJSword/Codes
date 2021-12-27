<template>
  <!-- 户型配比 -->
  <div class="houseratio_wrap">
    
    <!-- 竞品选择 -->
    <div class="cdselect_wrap" v-if="showCdSelect">
      <!-- 关闭 -->
      <i class="btn el-icon-close" @click="showCdSelect=false"></i>
      <CdProperty :reportId="reportId" @propertyChange="regetInfo" />
    </div>
    <!-- 户型配比配置 -->
    <div class="info_wrap">
      <!-- 物业类型列表 -->
      <div class="property">
        <div class="item_warp" v-for="(item,index) in propertyList" :key="index">
          <div class="property_item" 
          v-if="projectProperty.indexOf(item.value)!==-1"
          @click="selectProperty(item.value)"
          :style="{'color':propertyType==item.value?'#f60':'#606266','border':propertyType==item.value?'#f60 1px solid':'#606266 1px solid'}">{{item.label}}</div>
        </div>
      </div>
      <div class="info_bottom">
        <!-- 竞品户型配比数据 -->
        <div class="ratio_table">
          <div class="top">
            <div class="left">
              <div class="td th" style="position:relative;">
                <el-popover placement="top-start" width="200" trigger="hover" content="点击按钮设置调整竞品权重">
                  <i slot="reference" class="btn el-icon-setting" style="font-size:20px;cursor:pointer;" @click="showCdSelect=true"></i>
                </el-popover>
                <div class="bubble" v-if="settingPopover">点击按钮设置调整竞品权重</div>
                <el-popover
                  placement="bottom"
                  width="300"
                  trigger="click">
                  <div class="tip">
                    <h3>计算：</h3>
                    <p>① 去化周期=存量/成交量</p>
                    <p>② 调整系数=去化周期</p>
                    <p>③ 调整权重=调整系数/调整系数之和</p>
                    <p>④ 调整后分布=供应量-供应量*调整权重</p>
                    <p>⑤ 竞品户型配比=调整后分布/调整后分布之和</p>
                    <p>⑥ 建议户型配比= ∑〖各竞品户型配比∗权重〗</p>
                  </div>
                  <i class="btn el-icon-question" slot="reference" style="margin-left:10px;font-size:20px;cursor:pointer;"></i>
                </el-popover>
              </div>
              <div class="td">参考权重</div>
              <div class="td">面积段</div>
            </div>
            <div class="td2_item" v-for="(item,i) in cdqdData" :key="i">
              <div class="td2 th">{{item.building_name}}</div>
              <div class="td2">{{item.weight}} %</div>
              <div class="flexitem">
                <div class="td">供应量</div>
                <div class="td">去存周期</div>
              </div>
            </div>
          </div>
          <div class="content">
            <div class="area_item" v-for="(item,i) in ratioData" :key="i">
              <div class="td" style="color:#409eff">{{item.areaLabel}}</div>
              <div class="cd_item flexitem" v-for="(cd,j) in item.cdArr" :key="j">
                <div class="td" style="background:#fff">{{cd.cdInfo.supply?cd.cdInfo.supply:''}}</div>
                <div class="td" style="background:#ff">{{cd.cdInfo.ratio?(cd.cdInfo.ratio).toFixed(2):''}}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 建议户型配比 -->
        <div class="project_ratio" style="margin:0">
          <div class="td th" style="background:#44712d">建议配比</div>
          <div class="td"></div>
          <div class="td"></div>
          <div class="ratio">
            <div class="td" v-for="(item,i) in ratioData" :key="i">{{item.proposalRatio}} %</div>
          </div>
        </div>
        <!-- 最终户型配比 -->
        <div class="user_ratio">
          <div class="ratio_tip">tip:{{testText}}</div>
          <div class="userratio_wrap">
            <div class="td2 th" style="background:#2c73bd">
              <label for="">最终配比</label>
              <el-popconfirm
                confirm-button-text='好的'
                cancel-button-text='不用了'
                icon="el-icon-info"
                icon-color="#f60"
                title="是否同步建议配比？"
                @confirm="syncRatio()"
              >
                <i slot="reference" class="sync_btn el-icon-refresh-left"></i>
              </el-popconfirm>
            </div>
            <div class="title flexitem">
              <div class="td">面积段</div>
              <div class="td">配比 %</div>
            </div>
            <div class="ratio">
              <div class="flexitem" v-for="(item,i) in projectRatio" :key="i">
                <div class="td cursor">{{item.areaLabel}}</div>
                <el-input class="td" type="number" step="0.1" :disabled="!isEdit" v-model="item.proposalRatio" @input="userRatioTest"></el-input>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 按钮 -->
      <div class="btn_box">
        <el-button v-if="isEdit" type="success" size="mini" @click="ratioSub()">保存配比</el-button>
      </div>
    </div>
  </div>
</template>
<script>

import { mapGetters } from "vuex";
import LandReportApi from '@/api/LandReportApi_zlq'
import { suDoorRatio } from '@/utils/report_qh'
import CdProperty from '@/views/LandReport/CdProperty'
export default {
  name: "hosueratio",
  props:{
    reportId:{ //报告Id
      type:String,
      default:'1306841780423069697'
    },
    isEdit:{ //是否为编辑状态
      type:Boolean,
      default:true
    }
  },
  components: {
    CdProperty
  },
  data() {
    return {
      showCdSelect:false,
      ratioData:[],//竞品去存数据及面积段建议配比
      cdqdData:[],//竞品去存数据
      projectRatio:[],//项目户型配比
      propertyList:[ //物业类型数组
        {label:'普通住宅',value:'house'},
        {label:'别墅',value:'praetorium'},
        {label:'公寓',value:'apartment'},
        {label:'办公',value:'office'},
        {label:'商业',value:'business'}
      ],
      projectProperty:[],//该项目选择的物业类型及建筑形态
      propertyType:'house',//当前选择的物业类型
      settingPopover:true,//显示配置提示
      testText:'请配置户型配比',//用户配比提示
    };
  },
  mounted() {
    this.getProjectProperty()
    setTimeout(()=>{
      this.settingPopover = false
    },5000)
  },
  computed: {
    ...mapGetters(["CD_map"]),
  },
  watch: {},
  methods: {
    //本项目的物业类型
    getProjectProperty(){
      //设置竞品物业类型
      LandReportApi.getCDProperty(this.reportId)
      .then(res=>{
        if(res.data.code===0){
          let data = res.data.data
          data.forEach(item=>{
            if(item.is_competitor==='0'){ //本项目物业类型
              console.log('本项目物业类型',item.types)
              let types = item.types.split(',')
              this.projectProperty = types
              for (let index = 0; index < this.propertyList.length; index++) {
                if(types.indexOf(this.propertyList[index].value)!==-1){
                  this.propertyType = this.propertyList[index].value;
                  //获取竞品去存信息
                  this.getAreaDict()
                  break;
                }
              }
            }
          })
        }
      })
    },
    //选择物业类型
    selectProperty(value){
      this.propertyType = value
      //获取竞品去存信息
      this.getAreaDict()
    },
    //物业类型重新配置，重新加载数据
    regetInfo(){
      this.getProjectProperty()
      this.showCdSelect=false
      
    },
    //竞品去存信息
    getAreaDict(){
      var that = this
      //获取面积段字典
      LandReportApi.getTypeDict('area_size')
      .then(res=>{
        if(res.data.code===0){
          let data = res.data.data
          let areaArr = []
          if(that.propertyType=='apartment'){ //公寓面积段
            data.forEach(item=>{
              if(item.remark=='nohouse'){
                areaArr.push(item.value)
              }
            })
          }else{ //住宅别墅面积段
            data.forEach(item=>{ 
              if(item.remark=='house'){
                areaArr.push(item.value)
              }
            })
          }
          console.log('面积段',areaArr)
          if(areaArr.length>0){
            that.getCdqc(areaArr)
          }
        }
      })
      
    },
    getCdqc(areaArr){ //获取竞品的去存信息
      var that = this
      //获取竞品去存信息
      let obj = {
        reportId:that.reportId,
        mold:'qc',
        type:that.propertyType
      }
      
      LandReportApi.getCdqcinfo(obj)
      .then(res=>{
        if(res.data.code===0){
          let cddata = res.data.data
          let cdqcData = JSON.parse(JSON.stringify(cddata))
          console.log('竞品去化',cddata)

          let rst = suDoorRatio(cdqcData,areaArr)
          let arr = []
          let projectRatios = []
          areaArr.forEach(area=>{
            let obj = {
              areaLabel:area, //面积段
              cdArr:[], //竞品数据
              proposalRatio:rst[area] //建议配比
            }
            let projectObj = {
              areaLabel:area,
              proposalRatio:rst[area]
            }
            cddata.forEach(cd=>{
              let curArea = cd.area_sizes.filter(item=>item.area_size===area)
              if(curArea.length==0){ //没有此面积段添加
                obj.cdArr.push({
                  cdName:cd.building_name,
                  cdInfo:{
                    supply: null,//供应量
                    ratio:null //去存周期
                  }
                })
              }else{
                obj.cdArr.push({
                  cdName:cd.building_name,
                  cdInfo:{
                    supply: curArea[0].supply,//供应量
                    ratio: curArea[0].ratio
                  }
                })
              }
            })
            arr.push(obj)
            projectRatios.push(projectObj)
          })
          //查询报告保存的户型配比 🍊
          LandReportApi.getReportHouseRatio({
            reportId:that.reportId,
            type:that.propertyType
          })
          .then(res=>{
            if(res.data.code===0){
              let reportRetio = res.data.data
              if(reportRetio.length>0){ //存在保存的户型配比加载
                let ratioArr = []
                reportRetio.forEach(item=>{
                  ratioArr.push({
                    areaLabel:item.areaSize,
                    proposalRatio:item.ratio
                  })
                })
                that.projectRatio = ratioArr
              }else{ //加载系统推荐户型配比
                that.projectRatio = projectRatios
              }
            }
          })
          that.projectRatio = projectRatios
          that.ratioData = arr
          that.cdqdData = cdqcData
          console.log(arr)
          console.log(rst)
        }
      })
    },
    userRatioTest(){
      var that = this
      let sum = 0
      that.projectRatio.forEach(item=>{
        if(item.proposalRatio){
          sum += JSON.parse(item.proposalRatio)
        }
      })
      sum = sum.toFixed(1)
      if(sum>100){
        this.testText = '需减少'+(sum-100).toFixed(1)+'% 户型配比'
      }else if(sum<100){
        this.testText = '需增加'+(100-sum).toFixed(1)+'% 户型配比'
      }else{
        this.testText = '户型配比已达100%'
      }
    },
    ratioSub(){ //提交户型配比
      var that = this
      let sum = 0
      let subArr = []
      that.projectRatio.forEach(item=>{
        if(item.proposalRatio){
          sum += JSON.parse(item.proposalRatio)
        }
        subArr.push({
          "type":that.propertyType,
          "ratio":JSON.parse(item.proposalRatio),
          "areaSize":item.areaLabel
        })
      })
      if(sum>100){
        that.$message('户型配比超出'+(sum-100).toFixed(1)+'%，请调整')
      }else if(sum<100){
        that.$message('户型配比缺少'+(100-sum).toFixed(1)+'%，请调整')
      }else{
        
      }
      LandReportApi.saveReportRatio(that.reportId,subArr)
      .then(res=>{
        if(res.data.code===0){
          that.$message('户型配比上传成功!')
        }
      })
    },
    //建议配比加载到最终配比
    syncRatio(){
      this.projectRatio = JSON.parse(JSON.stringify(this.ratioData))
    },
  },
};
</script>
<style lang="scss">
.houseratio_wrap {
  width: 100%;
  height: 100%;
  z-index: 999;
  .bubble{ /*气泡图*/
    font-size: 14px;
    text-align: center;
    padding: 14px 15px;
    border: 2px solid #f60;
    border-radius: 30px;
    background-color: #ffffff;
    position: absolute;
    top: 65px;
    left: 15px;
    color: #333;
    z-index: 99;
    font-weight: bold;
    width: max-content;
  }
  .bubble::before{ /*背景三角形*/
    content: "";
    position: absolute;
    top: -20px;
    left: 39px;
    width: 0;
    height: 0;
    border-top: 20px solid #f60;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    transform: skew(67deg, -118deg);
  }
  .bubble::after{ /*前景三角形*/
    content: "";
    position: absolute;
    top: -19px;
    left: 39px;
    width: 0;
    height: 0;
    border-top: 21px solid #ffffff;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    transform: skew(64deg, -118deg);
  }
  .property{
    display: flex;
    padding-bottom: 10px;
    align-items: center;
    border-bottom: #ccc 1px solid;
    height: 7%;
    .property_item{
      padding: 6px 10px;
      font-size: 14px;
      border: #606266 1px solid;
      margin-right: 10px;
      cursor: pointer;
      user-select: none;
      color: #606266;
      font-weight: bold;
      &:hover{
        color: #f60;
        border: #f60 1px solid;
      }
    }
  }
  .cdselect_wrap{
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 99;
    position: absolute;
    background: rgba(0,0,0,0.6);
    .btn{
      position: absolute;
      right: 20px;
      top: 20px;
      z-index: 999;
      font-size: 28px;
      transition: 0.3s;
      cursor: pointer;
      color: #fff;
      &:hover{
        transform: rotate(180deg);
      }
    }
  }
  .info_wrap{
    width: 98%;
    height: 97%;
    padding: 1%;
    position: relative;
  }
  .info_bottom{
    display: flex;
    justify-content: center;
    margin-top: 10px;
    height: 90%;
    overflow-y: scroll;
  }
  .td{
    width: 90px;
    height: 35px;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    border-left: #ced5e4 1px solid;
    border-top: #ced5e4 1px solid;
    font-weight: bold;
  }
  .td2{
    width: 181px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    border-left: #ced5e4 1px solid;
    border-top: #ced5e4 1px solid;
  }
  .th{
    background: #4a4a4a;
    color: #fff;
  }
  .cursor{
    cursor: pointer;
    user-select: none;
  }
  .flexitem{
    display: flex;
  }
  .ratio_table{
    height: fit-content;
    font-size: 14px;
    color: #606266;
    position: relative;
    overflow-x: scroll;
    .top{
      display: flex;
    }
    .content{
      border-bottom: #ced5e4 1px solid;
      .area_item{
        display: flex;
        width: fit-content;
      }
      
    }
    
  }
  .project_ratio{
    height: fit-content;
    margin-left: 20px;
    margin-top: 39px;
    border-right: #ced5e4 1px solid;
    border-bottom: #ced5e4 1px solid;
    .el-input__inner{
      border: none;
      height: 35px;
      line-height: 35px;
      font-weight: bold;
      color: #ff6a00;
      text-align: center;
    }
  }
  .user_ratio{
    height: fit-content;
    margin-left: 20px;
    margin-top: 15px;
    .ratio_tip{
      color: #ff0000;
      font-size: 14px;
      font-weight: bold;
    }
    .userratio_wrap{
      border-bottom: #ced5e4 1px solid;
      border-right: #ced5e4 1px solid;
    }
    .sync_btn{
      cursor: pointer;
      margin-left: 20px;
      transition: 0.5s;
      &:hover{
        color: rgb(255, 230, 0);
        transform: rotate(-180deg);
      }
    }
    .el-input__inner{
      border: none;
      height: 35px;
      line-height: 35px;
      font-size: 16px;
      font-weight: bold;
      color: #ff0000;
      text-align: center;
      padding: 0;
    }
  }
  .btn_box{
    position: absolute;
    right: 20px;
    top: 40px;
    display: flex;
    align-items:flex-end;
    margin-left: 5px;
  }
}
</style>
