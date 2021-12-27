<template>
  <!-- 竞品市场-去化、销量 -->
  <div class="pricefitting_wrap">
    <div class="fitting_tree" :style="{'left':showFittingTree?'0%':'-100%'}">
      <div class="ft_box">
        <i class="btn el-icon-close" @click="closeTree()"></i>
        <div class="tree_wrap">
          <h2>价格测算模型</h2>
          <div class="tree_item_box">
            <div class="tree_item" v-for="(item1,i1) in fittingTree" :key="i1">
              <div class="item">
                <div class="label" v-if="item1.name!=='点地评价指标'">
                  <!-- 一级目录 -->
                  <div class="name">{{item1.name}}</div>
                  <el-input class="weight" v-model="item1.weight" @input="val=>checkWeight(val,null,item1)"></el-input>
                  <div class="rowLine" v-if="item1.children.length>0"></div>
                  <div class="tip" v-show="item1.childSum&&item1.weight!=item1.childSum">子项之和不等于该项</div>
                </div>
                <div :class="[item1.children.length==1?'':'child']">
                  <div class="child_item" v-for="(item2,i2) in item1.children" :key="i2">
                    <div class="label">
                      <!-- 二级目录 -->
                      <div class="rowLine" v-if="item2.name!=='配套综合强度'"></div>
                      <div class="name">{{item2.name=='配套综合强度'?'土地价值':item2.name}}</div>
                      <el-input class="weight" v-model="item2.weight" @input="val=>checkWeight(val,item1,item2)"></el-input>
                      <div class="rowLine" v-if="item2.children.length>0"></div>
                      <div class="tip" v-show="item2.childSum&&item2.weight!=item2.childSum">子项之和不等于该项</div>
                    </div>
                    <div class="child1">
                      <div class="child_item" v-for="(item3,i3) in item2.children" :key="i3">
                        <div class="label">
                          <!-- 三级目录 -->
                          <div class="rowLine"></div>
                          <div class="name">{{item3.name}}</div>
                          <el-input class="weight" v-model="item3.weight" @input="val=>checkWeight(val,item2,item3)"></el-input>
                          <div class="rowLine" v-if="item3.children.length>0"></div>
                          <div class="tip" v-show="item3.childSum&&item3.weight!=item3.childSum">子项之和不等于该项</div>
                        </div>
                        <div class="child">
                        <div class="child_item" v-for="(item4,i4) in item3.children" :key="i4">
                          <div class="label">
                            <!-- 四级目录 -->
                            <div class="rowLine"></div>
                            <div class="name">{{item4.name}}</div>
                            <el-input class="weight" v-model="item4.weight" @input="val=>checkWeight(val,item3,item4)"></el-input>
                          </div>
                        </div>
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
        <div class="btn_box">
          <el-button v-if="isEdit" type="default" size="small" @click="treeReset()">重置</el-button>
          <el-button v-if="isEdit" type="primary" size="small" @click="fittingTreeSub()">保存模型</el-button>
        </div>
      </div>
    </div>
    <div class="price_fitting">
      <!-- 物业类型列表 -->
      <div class="property">
        <div class="item_warp" v-for="(item,index) in propertyList" :key="index">
          <div class="property_item" 
          v-if="projectProperty.indexOf(item.value)!==-1"
          @click="selectProperty(item.value)"
          :style="{'color':propertyType==item.value?'#f60':'#606266','border':propertyType==item.value?'#f60 1px solid':'#606266 1px solid'}">{{item.label}}</div>
        </div>
      </div>
      <el-button v-if="isEdit" class="sub_btn" size="small" type="primary" @click="saveFittingInfo()">保存数据</el-button>
      <div class="title">通过本项目与竞品的土地、产品、品牌的价值对比，拟合出本项目别墅均价为{{projectPrice}} 元/㎡</div>
      <div class="fitting_table">
        <div class="t_head">
          <div class="td3" style="height:61px;">
            <el-popover placement="top-start" width="200" trigger="hover" content="点击按钮配置指标权重">
              <i slot="reference" class="btn el-icon-setting" @click="showFittingTree=true"></i>
            </el-popover>
            <div class="bubble" v-if="settingPopover">点击按钮配置指标权重</div>
            <el-popover placement="bottom-end" width="300" trigger="click">
              <div class="tip">
                <h3>用户输入得分权重后计算：</h3>
                <p>① 自动计算项目综合得分：</p>
                <p>第i级指标得分 = ∑ 第(i+1)级指标得分*权重</p>
                <p>② 计算本项目均价：</p>
                <p>本项目均价 = 本项目得分 * ∑ (各竞品均价/各竞品得分)*权重</p>
              </div>
              <i class="btn1 el-icon-question" slot="reference"></i>
            </el-popover>
            <label for="">指标</label>
          </div>
          <div class="td1 h2">本项目</div>
          <div class="cd_box">
            <div class="cd_title h1">参考项目名称</div>
            <div class="cd_wraps">
              <div class="td_wrap" v-for="(item,i) in projectList" :key="i">
                <div class="td1" v-if="item.buildingId!='0'">{{item.buildingName}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="t_content">
          <div class="t_mask" v-if="!isEdit"></div>
          <div class="t_price">
            <div class="td1">一级指标</div>
            <div class="td1">二级指标</div>
            <div class="td1">三级指标</div>
            <div class="cd_wraps">
              <el-input class="td1" type="number" v-model="item.price" @input="val=>countProjectPrice(val)" :disabled="item.buildingId=='0'" v-for="(item,i) in projectList" :key="i" :placeholder="item.price?'':'价格'"></el-input>
            </div>
          </div>
          <div class="t_cont">
            <div class="item1" v-for="(item1,i1) in priceFitting" :key="i1">
              <div class="item_name">{{item1.name}} {{item1.weight}}%</div>
              <div class="item2_wrap">
                <div class="item2" v-for="(item2,i2) in item1.children" :key="i2">
                  <div :class="[item2.children&&item2.children.length==0?'item_name_w2':'item_name']">{{item2.name}} {{item2.weight!=null?item2.weight+'%':''}}</div>
                  <div class="item3_wrap" v-if="item2.scores==null">
                    <div class="item3" v-for="(item3,i3) in item2.children" :key="i3">
                      <div class="td1">{{item3.name}} {{item3.weight}}%</div>
                      <div class="item4" v-for="(item4,i4) in item3.scores" :key="i4">
                        <el-input type="number input_bac" step="0.1" class="td1" v-if="item4.showInput" v-model="item4.score" placeholder="分值"></el-input>
                        <div class="td1" v-else>{{item4.score.toFixed(2)}}</div>
                        
                      </div>
                    </div>
                  </div>
                  <div class="item3" v-else>
                    <div class="" v-for="(item3,i3) in item2.scores" :key="i3">
                      <el-input :class="['td1',item2.name=='土地价值分值'?'':'input_bac']" type="number" step="0.1" :disabled="item2.name=='土地价值分值'" v-if="item3.showInput" v-model="item3.score" :placeholder="item2.name=='土地价值分值'?'待计算':'待输入'" @input="val=>setScore(val,item2.name,item2.weight,item1,i3)"></el-input>
                      <div class="td1" v-else>{{item3.score}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="t_footer">
          <div class="footer1">
            <div class="td3">综合得分</div>
            <div class="td1" v-for="(item,i) in projectList" :key="i">{{item.totalScore?item.totalScore:'待计算'}}</div>
          </div>
          <div class="footer2">
            <div class="td3">权重</div>
            <div class="td1" v-for="(item,i) in projectList" :key="i">{{item.weight?item.weight+' %':''}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import LandReportApi from '@/api/LandReportApi_zlq'
export default {
  name: "pricefitting",
  props:{
    reportId:{ //报告ID
      type:String,
      default:'1306841780423069697'
    },
    isEdit:{ //是否为编辑状态
      type:Boolean,
      default:true
    }
  },
  components: {
   
  },
  data() {
    return {
      weight:50,
      showFittingTree:false,//权重树显示
      fittingTree:[],//测算指标权重树
      checkFaild:false,//校验失败
      priceFitting:[],//价格拟合
      projectList:[],//竞品列表
      projectIdList:[],//竞品ID数组
      projectPrice:null,//本项目均价
      tiggerData:{},//触发数据
      propertyList:[ //物业类型数组
        {label:'普通住宅',value:'house'},
        {label:'别墅',value:'praetorium'},
        {label:'公寓',value:'apartment'},
        {label:'办公',value:'office'},
        {label:'商业',value:'business'}
      ],
      projectProperty:[],//该项目选择的物业类型及建筑形态
      propertyType:'house',//当前选择的物业类型
      settingPopover:true,//显示操作提示
    };
  },
  mounted() {
    this.getProjectProperty()
    this.getCdinfo()
    this.getFittingTree()
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

      this.priceFitting = []
      this.projectList = []
      this.projectIdList = []
      this.getCdinfo()
    },
    getFittingTree(){ //价格测算指标权重信息
      var that = this
      let obj = {
        reportId:that.reportId,
        type:that.propertyType
      }
      LandReportApi.getPriceFittingList(obj)
      .then(res=>{
        if(res.data.code===0){
          let data = res.data.data
          console.log('价格测算指标权重',data)
          data.forEach(item=>{
            if(item.name=='产品力'||item.name=='品牌'){
              item.children = []
            }
          })
          that.fittingTree = JSON.parse(JSON.stringify(data))
          that.fittingTreeBackups = JSON.parse(JSON.stringify(data))
        }
      })
    },
    getCdinfo(){ //获取竞品列表信息+价格测算权重+竞品点地评分
      var that = this
      //竞品列表信息
      LandReportApi.getCDinfosByproperty({"reportId":that.reportId,"type":that.propertyType})
      .then(res=>{
        if(res.data.code===0){
          let data = res.data.data
          console.log('竞品',data)
          let dataArr = []
          //把本项目放在数组头部+id数组
          data.forEach(cd=>{
            if(cd.buildingId=='0'){
              that.projectPrice = cd.price
              dataArr.unshift(cd)
              that.projectIdList.unshift({
                buildingId:cd.buildingId,
                score:null,
                showInput:false //显示输入框
              })
            }else{
              if(cd.price==null){
                cd.price = cd.avgPrice
              }
              dataArr.push(cd)
              that.projectIdList.push({
                buildingId:cd.buildingId,
                score:null,
                showInput:false
              })
            }
          })
          that.projectList = dataArr
          //价格测算权重+竞品点地评分
          LandReportApi.getPriceFittingCdInfos(that.reportId,that.propertyType)
          .then(res=>{
            if(res.data.code===0){
              let data1 = JSON.parse(JSON.stringify(res.data.data))
              console.log('竞品点地评分',res.data.data)
              if(data1.length==0){ //未配置价格测算模型
                this.showFittingTree = true
                this.$message('价格测算模型未配置,请先配置')
                return
              }
              
              data1.forEach(item=>{
                if(item.name=='产品力'){
                  item.children = [{
                    itemCode:"CP",
                    name:'产品力',
                    weight:null,
                    scores:item.scores,
                    children:[]
                  }]
                }
                if(item.name=='品牌'){
                  item.children = [{
                    itemCode:"PP",
                    name:'品牌价值',
                    weight:null,
                    scores:item.scores,
                    children:[]
                  }]
                }
                if(item.name=="点地评价指标"||item.itemCode=="DD"){
                  item.children[0].name = '土地价值'
                  that.priceFitting.unshift(item.children[0])
                }else{
                  that.priceFitting.push(item)
                }
              })
              //竞品点地评分排序
              that.setCdscoreSort(that.priceFitting)
              //设置修改测算模型后得触发数据
              let curItem = {}
              that.priceFitting[0].children.forEach(c=>{
                if(c.name=='规划'){
                  curItem = c
                }
              })
              that.tiggerData = {
                value:curItem.scores[0].score,
                name:curItem.name,
                weight:curItem.weight,
                parentNode:that.priceFitting[0],
                index:0
              }
              console.log('保存的拟合数据',that.priceFitting)
            }
          })
        }
      })
      
    },
    //竞品点地评分排序
    setCdscoreSort(arr){
      //补充的竞品得分
      let exArr = JSON.parse(JSON.stringify(this.projectIdList))
      arr.forEach(item=>{
        //添加额外评分项
        if(item.itemCode=="DDPT"&&item.children.length>0){
          item.children.push({
            itemCode:"DDPT",
            name:'土地价值分值',
            weight:null,
            scores:item.scores,
            children:[]
          })
        }else if(item.itemCode=='CP'){
          // item.children.push({
          //   itemCode:"CP",
          //   name:'产品力',
          //   weight:null,
          //   scores:item.scores,
          //   children:[]
          // })
        }else if(item.itemCode=='PP'){
          // item.children.push({
          //   itemCode:"PP",
          //   name:'品牌价值',
          //   weight:null,
          //   scores:item.scores,
          //   children:[]
          // })
        }
        //竞品得分排序
        if(item.scores&&item.scores.length>0){
          exArr.forEach(ex=>{
            let cur = item.scores.filter(score=>{
              return score.buildingId == ex.buildingId
            })[0]
            ex.score = cur?cur.score:null
            if(item.name=='规划'||item.name=='土地价值分值'||item.name=='园林'||item.name=='其他'||
            item.name=='精装'||item.name=='户型'||item.name=='产品力'||item.name=='物业品牌'||
            item.name=='开发商品牌'||item.name=='品牌价值'){
              ex.showInput = true
            }
          })
          item.scores = exArr
        }else if((item.scores==null||item.scores.length==0)&&item.children.length==0){
          item.scores = exArr
          item.scores.forEach(a=>{
            a.showInput = true
          })
        }
        //递归
        if(item.children&&item.children.length>0){
          this.setCdscoreSort(item.children)
        }else{
          exArr = JSON.parse(JSON.stringify(this.projectIdList))
        }
      })
    },
    treeReset(){ //重置测算模型
      this.fittingTree = JSON.parse(JSON.stringify(this.fittingTreeBackups))
    },
    fittingTreeSub(){ //提交测算模型
      var that = this
      that.computedWeight(that.fittingTree)
      if(that.checkFaild){
        that.$message.error('请先确认价格测算模型数据是否准确')
      }else{
        let obj = {
          reportId:that.reportId,
          type:that.propertyType
        }
        LandReportApi.uploadPriceFitting(obj,that.fittingTree)
        .then(res=>{
          if(res.data.code===0){
            that.$message.success('价格测算模型信息上传成功')
            //重置价格拟合数据
            that.priceFitting = []
            that.projectList = []
            that.projectIdList = []
            that.projectPrice = null
            //价格拟合重新加载
            that.getCdinfo()
            that.showFittingTree = false
            that.setScore(
              that.tiggerData.value,
              that.tiggerData.name,
              that.tiggerData.weight,
              that.tiggerData.parentNode,
              that.tiggerData.index
            )
          }else{
            that.$message.error('价格测算模型信息上传失败')
          }
        })
      }
    },
    computedWeight(tree){ //空权重校验
      tree.forEach(item=>{
        if(item.name!=='点地评价指标'){
          if(item.weight===''||item.weight===null||(item.childSum!=undefined&&item.weight!=item.childSum)){
            this.checkFaild = true
          }
          if(item.children.length>0){
            this.computedWeight(item.children)
          }
        }
      })
    },
    checkWeight(val,parent,cur){ //权重修改校验
      console.log(val,parent,cur)
      //当前节点的子权和
      if(cur.children.length>0){ //非末节点
        let sumCur = 0
        cur.children.forEach(child=>{
          sumCur += child.weight?JSON.parse(child.weight):0
        })
        cur.childSum = JSON.stringify(sumCur)
      }
      //父节点的子权和
      if(parent){
        let sumPar = 0
        parent.children.forEach(item=>{
          sumPar += item.weight?JSON.parse(item.weight):0
        })
        parent.childSum = JSON.stringify(sumPar)
      }
    },
    closeTree(){ //关闭测算指标树
      this.showFittingTree = false
    },
    setScore(val,name,weight,node,index){ //计算测算数据
      console.log(val,name,weight,node,index)
      if(val==''){
        val = 0
      }else if(val<0){
        this.$message.error('数值不可小于0')
        return
      }else if(val>10){
        this.$message.error('数值不可大于10')
        return
      }
      if(node.itemCode=="DDPT"||node.name=='土地价值'){ //土地价值
        let value = 0
        node.children.forEach(item=>{
          if(item.name!='土地价值分值'){
            if(item.name=='规划'){
              let curScore = item.scores[index].score?JSON.parse(item.scores[index].score):0
              value += curScore*item.weight/100
            }else{
              item.children.forEach(child=>{
                let curScore = child.scores[index].score?JSON.parse(child.scores[index].score):0
                value += curScore*child.weight/100
              })
            }
          }else{
            item.scores[index].score = JSON.parse(value.toFixed(2))
          }
        })
      }else if(node.itemCode=="CP"||node.name=="产品力"){
        let value = 0
        node.children.forEach(child=>{
          if(child.name!='产品力'){
            let curScore = child.scores[index].score?JSON.parse(child.scores[index].score):0
            value += curScore*child.weight/100
          }else{
            if(name!='产品力'){
              child.scores[index].score = JSON.parse(value.toFixed(2))
            }
          }
        })
      }else if(node.itemCode=="PP"||node.name=="品牌"){
        let value = 0
        node.children.forEach(child=>{
          if(child.name!='品牌价值'){
            let curScore = child.scores[index].score?JSON.parse(child.scores[index].score):0
            value += curScore*child.weight/100
          }else{
            if(name!='品牌价值'){
              child.scores[index].score = JSON.parse(value.toFixed(2))
            }
          }
        })
      }
      //综合得分
      let valueSum = 0
      this.priceFitting.forEach(item=>{
        item.children.forEach(child=>{
          if(child.name=='土地价值分值'||child.name=='产品力'||child.name=='品牌价值'){
            let curScore = child.scores[index].score?JSON.parse(child.scores[index].score):0
            valueSum += curScore*item.weight/100
          }
        })
      })
      this.projectList[index].totalScore = JSON.parse(valueSum.toFixed(2))
      //计算项目均价
      this.countProjectPrice()
    },
    countProjectPrice(val){ //计算项目均价
      if(val==''){
        return
      }else if(val<0){
        this.$message.error('数值不可小于0')
        return
      }
      let sumPrice = 0
      this.projectList.forEach(item=>{
        if(item.buildingId!='0'){
          sumPrice += (item.price?JSON.parse(item.price):0)*item.weight/100/(item.totalScore?item.totalScore:1)
        }
      })
      this.projectList.forEach(item=>{
        if(item.buildingId=='0'){
          item.price = parseInt((item.totalScore?item.totalScore:0)*sumPrice)
          this.projectPrice = item.price
        }
      })
    },
    saveFittingInfo(){ //保存拟合数据
      var that = this
      let obj = {
        "reportId":that.reportId,
        "type":that.propertyType,
        "buildings":[]
      }
      that.projectList.forEach((item,i)=>{
        let buildObj = {
          "buildingId":item.buildingId,
          "price":item.price?JSON.parse(item.price):0,
          "totalScore":item.totalScore?JSON.parse(item.totalScore):0,
          "score":{}
        }
        that.priceFitting.forEach(fit=>{
          if(fit.itemCode=='DDPT'){
            fit.children.forEach(child=>{
              if(child.name=='规划'||child.name=="土地价值分值"){
                buildObj.score[child.itemCode] = child.scores[i].score?JSON.parse(child.scores[i].score):0
              }
            })
          }else{
            fit.children.forEach(child=>{
              buildObj.score[child.itemCode] = child.scores[i].score?JSON.parse(child.scores[i].score):0
            })
          }
        })
        obj.buildings.push(buildObj)
      })
      console.log(obj)
      LandReportApi.uploadFittingInfo(obj)
      .then(res=>{
        if(res.data.code===0){
          console.log(res)
        }
      })
    },
  },
};
</script>
<style lang="scss">
.pricefitting_wrap {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  .bubble{ /*气泡图*/
    font-size: 14px;
    text-align: center;
    padding: 14px 15px;
    border: 2px solid #f60;
    border-radius: 30px;
    background-color: #ffffff;
    position: absolute;
    top: 75px;
    left: -110px;
    color: #333;
    z-index: 99;
    font-weight: bold;
    width: max-content;
  }
  .bubble::before{ /*背景三角形*/
    content: "";
    position: absolute;
    top: -20px;
    left: 100px;
    width: 0;
    height: 0;
    border-top: 20px solid #f60;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    transform: skew(-60deg, -63deg);
  }
  .bubble::after{ /*前景三角形*/
    content: "";
    position: absolute;
    top: -19px;
    left: 100px;
    width: 0;
    height: 0;
    border-top: 21px solid #ffffff;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    transform: skew(-55deg, -62deg);
  }
  .fitting_tree{
    height: 100%;
    width:100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 99;
    background: rgba(0,0,0,0.4);
    transition: all 0.3s;
    .ft_box{
      width: 55%;
      background: #fff;
      position: relative;
      height: 100%;
    }
    .btn{
      position: absolute;
      right: 20px;
      top: 20px;
      z-index: 99;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      color: #333;
      transition: all 0.5s;
      &:hover{
        transform: rotate(180deg);
      }
    }
    .btn_box{
      position: absolute;
      right: 20px;
      bottom: 20px;
      z-index: 99;
    }
    .tree_wrap{
      padding: 1% 2%;
      height: 95%;
      overflow-y: scroll;
      h2{
        margin: 0;
      }
      .child_item:last-child{
        margin: 0;
      }
      .tree_item_box{
        
      }
      .tree_item{
        display: flex;
        align-items: center;
      }
      .item{
        display: flex;
        align-items: center;
        margin-top: 15px;
      }
      .child,.child1{
        position: relative;
      }
      .child::before{
        content: ''; // 必须
        position: absolute;
        display: block;
        width: 1px;
        top: 18px;
        bottom: 18px;
        background-color: #ccc;
      }
      .child1::before{
        content: ''; // 必须
        position: absolute;
        display: block;
        width: 1px;
        top: 42px;
        bottom: 18px;
        background-color: #ccc;
      }
      .label{
        display: flex;
        align-items: center;
        position: relative;
      }
      .name{
        width: 100px;
        height: 35px;
        line-height: 35px;
        border-radius: 4px;
        border: #ccc 1px solid;
        text-align: center;
        
      }
      
      .weight{
        width: fit-content;
        .el-input__inner{
          width: 60px;
          height: 35px;
          border: none;
          text-align: center;
          background: #c34848;
          color: #fff;
          border-radius: 4px;
          margin-left: 8px;
        }
        
      }
      .child_item{
        margin-bottom: 8px;
        display: flex;
        align-items: center;
      }
      
      .rowLine{
        width: 30px;
        height: 1px;
        background: #ccc;
      }
      .tip{
        position: absolute;
        top: -19px;
        left: 31px;
        color: #f56c6c;
        font-size: 12px;
      }
    }
  }
  .price_fitting{
    height: 95%;
    padding: 20px;
    position: relative;
    .input_bac{
      .el-input__inner{
        background: rgba(128,58,37,1);
        color: #fff !important;
        font-weight: normal !important;
      }
    }
    .property{
      display: flex;
      padding-bottom: 10px;
      align-items: center;
      border-bottom: #ccc 1px solid;
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
    .sub_btn{
      position: absolute;
      top: 75px;
      right: 30px;
    }
    .title{
      font-size: 18px;
      font-weight: bold;
      margin: 10px 0;
    }
    .fitting_table{
      height: 87%;
      overflow-y: scroll;
      font-size: 12px;
      .t_content{
        position: relative;
        width: fit-content;
        margin: auto;
      }
      .t_mask{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
      }
      .t_head,.t_price{
        display: flex;
        width: fit-content;
        border-right: #ccc 1px solid;
      }
      .t_head{
        background: #606266;
        color: #fff;
        margin: auto;
      }
      .td1{
        width: 110px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        border-top: #ccc 1px solid;
        border-left: #ccc 1px solid;
      }
      .td3{
        width: 332px;
        height: 30px;
        display: flex;
        align-items: center;
        border-top: #ccc 1px solid;
        border-left: #ccc 1px solid;
        position: relative;
        .btn{
          font-size: 20px;
          cursor: pointer;
          transition: all 0.5s;
          margin-left: 30px;
          margin-right: 10px;
          position: relative;
          &:hover{
            transform: rotate(180deg);
            color: #66b1ff;
          }
        }
        .btn1{
          font-size: 20px;
          cursor: pointer;
          margin-right: 80px;
        }
      }
      .h1{
        height: 30px;
        line-height: 30px;
        text-align: center;
      }
      .h2{
        height: 61px;
        line-height: 61px;
      }
      .el-input__inner{
        border-radius: 0;
        border: none;
        height: unset;
        line-height: unset;
        text-align: center;
        color: #f56c6c;
        font-weight: bold;
        padding: 0;
      }
      .cd_wraps{
        display: flex;
        
      }
      .cd_title{
        border-top: #ccc 1px solid;
        border-left: #ccc 1px solid;
      }
      .t_cont{
        width: fit-content;
        border-right: #ccc 1px solid;
        .item1,.item2,.item3,.item4{
          display: flex;
        }
        .item_name{
          width: 110px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-top: #ccc 1px solid;
          border-left: #ccc 1px solid;
        }
        .item_name_w2{
          width: 221px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          border-top: #ccc 1px solid;
          border-left: #ccc 1px solid;
        }
      }
      .t_footer{
        width: fit-content;
        border-right: #ccc 1px solid;
        border-bottom: #ccc 1px solid;
        margin: auto;
        .td3{
          justify-content: center;
        }
        .footer1,.footer2{
          display: flex;
        }
      }
    }
  }
}
</style>
