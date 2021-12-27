<template>
  <!-- 户型配比 -->
  <div class="houseratio_wrap">
    <div class="info_wrap">
      <div class="ratio_table">
        <div class="top">
          <div class="left">
            <div class="td th"><i class="el-icon-question"></i></div>
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
            <div class="td" style="color:#ffa723">{{item.areaLabel}}</div>
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
      <div class="project_ratio">
        <div class="td2 th" style="background:#e49b2d">本项目户型配比</div>
        <div class="title flexitem">
          <div class="td">面积段</div>
          <div class="td">配比</div>
        </div>
        <div class="ratio">
          <div class="flexitem" v-for="(item,i) in projectRatio" :key="i">
            <div class="td cursor">{{item.areaLabel}}</div>
            <el-input class="td" v-model="item.proposalRatio"></el-input>
          </div>
        </div>
      </div>
      <!-- 按钮 -->
      <div class="btn_box">
        <el-button type="success" @click="ratioSub()">保存配比</el-button>
      </div>
    </div>
  </div>
</template>
<script>

import { mapGetters } from "vuex";
import LandReportApi from '@/api/LandReportApi_zlq'
import { suDoorRatio } from '@/utils/report_qh'
export default {
  name: "hosueratio",
  props:{
    propertyType:{
      type:String,
      default:'house'
    }
  },
  components: {
    
  },
  data() {
    return {
      reportId:'1306841780423069697',//报告ID
      ratioData:[],//竞品去存数据及面积段建议配比
      cdqdData:[],//竞品去存数据
      projectRatio:[],//项目户型配比
    };
  },
  mounted() {
    this.getAreaDict()
  },
  computed: {
    ...mapGetters(["CD_map"]),
  },
  watch: {},
  methods: {
    //竞品去存信息
    getAreaDict(){
      var that = this
      //获取面积段字典
      LandReportApi.getTypeDict('area_size')
      .then(res=>{
        if(res.data.code===0){
          let data = res.data.data
          let areaArr = []
          data.forEach(item=>{
            if(item.remark === that.propertyType){
              areaArr.push(item.value)
            }
          })
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
          //查询报告保存的户型配比
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
  },
};
</script>
<style lang="scss">
.houseratio_wrap {
  width: 100%;
  height: 100%;
  z-index: 999;
  .info_wrap{
    padding: 20px;
    display: flex;
  }
  .td{
    width: 90px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    border-left: #ced5e4 1px solid;
    border-top: #ced5e4 1px solid;
    font-weight: bold;
  }
  .td2{
    width: 180px;
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
    width: 70%;
    height: 100%;
    border-bottom: #ced5e4 1px solid;
    font-size: 14px;
    color: #606266;
    position: relative;
    overflow: scroll;
    
    .top{
      display: flex;
    }
    .content{
      .area_item{
        display: flex;
        width: fit-content;
      }
      
    }
    
  }
  .project_ratio{
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
  .btn_box{
    display: flex;
    align-items:flex-end;
    margin-left: 5px;
  }
}
</style>
