<template>
  <div class="locationDecision_wrap">
      <div class="mask" v-if="showMask">
          <dv-decoration-9 >正在计算...</dv-decoration-9>
      </div>
      <div class="mask_1" v-if="showXghxBox || showCostBox || showProListBox" ></div>
      <div class="left_top_box">
          <el-select v-model="buildForm" placeholder="竞品建筑形态" size="small" class="select" @change="buildFormChange">
                <el-option
                v-for="(item,index) in buildFormDict" :key="index"
                :label="item.dictLabel"
                :value="item.dictValue">
                </el-option>
            </el-select>
             <el-tooltip class="item" effect="dark" content="通过竞品率筛选竞品" placement="bottom">
                <div class="block">
                    <el-slider
                    v-model="jpl"
                    show-input
                    @change="sliderChange">
                    </el-slider>
                </div>
            </el-tooltip>
      </div>
      <div :class="['bottom_box',isShow?'bottom_box_active':'']">
          <div class="top_box">
              <dv-border-box-2 class="hxpb_box">
                  <div class="title">建议户型配比</div>
                  <div id="jyhxpb_echarts"></div>
              </dv-border-box-2>
              <div class="operate_box">
                  <div style="cursor: pointer;" @click="showXghxBox = true">调整户型配比</div>
                  <div style="margin-top:6px;cursor: pointer;" @click="showCostBox = true">修改各项成本</div>
                  <div style="margin-top:6px;cursor: pointer;" @click="showProListBox = true">补全产品清单</div>
              </div>
              <dv-border-box-2 class="xsjj_box">
                   <!-- <dv-loading v-if="showPriceLoading">Loading...</dv-loading> -->
                   <template >
                        <div class="item_res">
                        <div class="title">建议销售均价</div>
                        <div class="value">
                            <input class="value_num" @blur="jyPriceChange"  :style="{'width':jyPrice.length *16.5 + 'px'}" v-model="jyPrice"/>
                            <span class="unit">元/㎡</span>
                        </div>
                    </div>
                     <div class="item_res">
                        <div class="title">产品评分</div>
                        <div class="value">
                            <span class="value_num">{{cpScoreBefore}}</span>
                            <template v-if="cpScoreAfter">
                                <span class="iconfont icon-iconfontgong" v-if="cpScoreBefore*1 < cpScoreAfter*1"></span>
                                <span class="iconfont icon-xiajiang-xiexia" v-else></span>
                            </template>
                             <el-tooltip class="item" effect="dark" :content="cpScoreBefore*1<=cpScoreAfter*1?'需要提高至此分数':'需要降低至此分数'" placement="top">
                                <span class="value_num">{{cpScoreAfter}}</span>
                            </el-tooltip>
                            
                        </div>
                    </div>
                     <div class="item_res">
                        <div class="title">预估去化周期</div>
                        <div class="value">
                            <input class="value_num" @blur="qhzqChange" :style="{'width':qhzq.length *16.5 + 'px'}" v-model="qhzq"/>
                            <span class="unit">年</span>
                        </div>
                    </div>
                     <div class="item_res">
                        <div class="title">预估货值利润</div>
                        <div class="value">
                            <input class="value_num" @blur="lrlChange" :style="{'width':lrl.length *16.5 + 'px'}" v-model="lrl"/>
                            <span class="unit">%</span>
                        </div>
                    </div>
                   </template>
              </dv-border-box-2>
              <dv-border-box-2 class="khgc_box">
                   <dv-loading v-if="showCustomerLoading" style="height:100%;color:white;">Loading...</dv-loading>
                   <template v-else>
                        <div class="title">项目客户构成</div>
                        <dv-active-ring-chart :config="ringCustomerConfig" style="width:100%;height:80%"/>
                   </template>
              </dv-border-box-2>
               <div :class="['container',isShow?'container_active':'']" @click="showAll">
                    <div class="chevron"></div>
                    <div class="chevron"></div>
                    <div class="chevron"></div>
                </div>
          </div>
          <div class="bottom_bottom_box">
              <dv-border-box-2 class="kfrl_box">
                  <div v-if="!showTable" style="height:100%;width:100%;display:flex;align-items: center;justify-content: center;">
                      <dv-decoration-1  style="width:200px;height:50px;" />
                  </div>
                  <template v-else>
                    <div class="title">市场可分容量</div>
                    <dv-scroll-board :config="config" style="width:96%;height:70%;margin-left:2%" />
                  </template>
              </dv-border-box-2>
                <dv-border-box-2 class="qxzq_box">
                   <div class="item_res">
                        <div class="title">市场去化周期</div>
                        <div class="value">
                            <span class="value_num">{{marketInfo.market_qhzq}}</span>
                            <span class="unit">年</span>
                        </div>
                    </div>
                     <div class="item_res">
                        <div class="title">市场均价</div>
                        <div class="value">
                            <span class="value_num">{{marketInfo.marketAvg}}</span>
                            <span class="unit">元/㎡</span>
                        </div>
                    </div>
                     <div class="item_res">
                        <div class="title">价格区间</div>
                        <div class="value">
                            <span class="value_num">{{marketInfo.sec}}</span>
                            <span class="unit">元/㎡</span>
                        </div>
                    </div>
                     <div class="item_res">
                        <div class="title">供应量(近一年)</div>
                        <div class="value">
                            <span class="value_num">{{marketInfo.market_supply}}</span>
                            <span class="unit">万㎡</span>
                        </div>
                    </div>
                    <div class="item_res">
                        <div class="title">成交量(近一年)</div>
                        <div class="value">
                            <span class="value_num">{{marketInfo.market_salse}}</span>
                            <span class="unit">万㎡</span>
                        </div>
                    </div>
                    <div class="item_res">
                        <div class="title">市场存量</div>
                        <div class="value">
                            <span class="value_num">{{marketInfo.market_cl}}</span>
                            <span class="unit">万㎡</span>
                        </div>
                    </div>
              </dv-border-box-2>
              <dv-border-box-2 class="khgc_box">
                  <dv-loading v-if="!showMarketCustom" style="color:white;">Loading...</dv-loading>
                  <template v-else>
                      <div class="title">市场客户构成</div>
                      <dv-active-ring-chart :config="ringMarketConfig" style="width:100%;height:80%"/>
                  </template>
              </dv-border-box-2>
          </div>
      </div>
      <dv-border-box-8 :class="['xghx_box', showXghxBox?'xghx_box_active':'']">
           <div class='close_box'> 
            <i class="iconfont icon-guanbi"  @click="showXghxBox = false"></i>
            </div>
        <div class="title">调整户型配比</div>
        <div id="xghxpb_echarts"></div>
        <div class="intialAdjustment_box">
                 <div class="info_title">
                     <div style="width:50%;text-align:center">户型面积段(㎡)</div>
                     <div style="width:30%;text-align:center">户型比重</div>
                     <div style="width:16%;text-align:center">操作</div>
                 </div>
                 <div class="item_box">
                      <div class="item" v-for="(item,index) in hxpbArr" :key="index">
                     <div style="width:50%;text-align:center">
                         <el-input style="width:35%" v-model="item.minArea" size="mini" ></el-input>
                         ~<el-input  style="width:35%" v-model="item.maxArea" size="mini" ></el-input>
                     </div>
                     <el-input v-model="item.ratioPersent"  size="mini" style="width:28%;margin: 0 2%"> <template slot="append">%</template></el-input>
                     <div style="color:#409eff;font-size:13px;text-align:center;width:16%;cursor: pointer;" @click="deleteRow(index)">删除</div>
                 </div>
                 </div>
             </div>
              <div class="btn_box">
                 <div class="saveAs_btn" style="margin-right:8%" @click="addRow" >新增面积段</div>
                 <div class="save_btn" @click="upDateDoorRatio" style="margin-right:7%">保存</div>
              </div>
      </dv-border-box-8>
      <dv-border-box-8 :class="['cost_box',showCostBox? 'cost_box_active':'']">
           <div class='close_box'> 
          <i class="iconfont icon-guanbi"  @click="showCostBox = false"></i>
        </div>
        <div class="title">修改各项成本</div>
        <div id="costEcharts" style="width:100%;height:40%;"></div>
             <div class="intialAdjustment_box">
                 <div class="info_title">
                     <div style="width:50%;text-align:center">成本类别</div>
                     <div style="width:50%;text-align:center">成本总价(万元)</div>
                 </div>
                 <div class="item" v-for="item in costInfo" :key="item">
                     <div style="width:50%;text-align:center">{{item.name}}</div>
                     <el-input class="input" v-model="item.value" placeholder="请输入成本" size="mini" style="width:40%;margin-left:5%;font-size:18px;"></el-input>
                 </div>
                 <div class="total">
                     <div style="width:50%;text-align:center">总计</div>
                     <div style="width:50%;text-align:center">{{costInfo[0].value*1 + costInfo[1].value*1+costInfo[2].value*1+costInfo[3].value*1+costInfo[4].value*1}}</div>
                 </div>
             </div>
            <div class="save_btn" @click="saveCost">保存</div>
      </dv-border-box-8>
      <dv-border-box-8 :class="['pro_list_box',showProListBox?'pro_list_box_active':'']">
        <div class='close_box'> 
           <i class="iconfont icon-guanbi"  @click="showProListBox = false"></i>
        </div>
        <div class="menu">
            <div :class="['item',activeIndex === index?'item_active':'']" v-for="(item,index) in menuList" :key="index"  @click="chooseMenu(index)">{{item}}</div>
        </div>
        <div class="menu_content">
            <div class="zjpt_box" v-if="activeIndex === 0">
                <div class="content_box">
                    <div class="content_item">
                        <div class="content_label">小学</div>
                        <el-select v-model="ptForm.primaryLevel" placeholder="小学等级" size="small" class="content_select">
                            <el-option v-for="(item,index) in ptArr"
                            :key="index"
                            :label="item.dictLabel"
                            :value="item.dictValue">
                            </el-option>
                        </el-select>
                    </div>
                     <div class="content_item">
                        <div class="content_label">初中</div>
                        <el-select v-model="ptForm.juniorLevel" placeholder="初中等级" size="small" class="content_select">
                            <el-option v-for="(item,index) in ptArr"
                            :key="index"
                            :label="item.dictLabel"
                            :value="item.dictValue">
                            </el-option>
                        </el-select>
                    </div>
                     <div class="content_item">
                        <div class="content_label">购物中心</div>
                        <el-input v-model="ptForm.shopArea" placeholder="建筑面积(㎡)" size="small" class="content_select">
                        </el-input>
                    </div>
                     <div class="content_item">
                        <div class="content_label">医院</div>
                        <el-select v-model="ptForm.hospitalLevel" placeholder="医院等级" size="small" class="content_select">
                           <el-option v-for="(item,index) in ptArr"
                            :key="index"
                            :label="item.dictLabel"
                            :value="item.dictValue">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                 <div class="next_btn" @click="savePt">保存</div>
            </div>
            <div class="xmjz_box" v-if="activeIndex === 1">
                <div class="content_box">
                    <div class="level_1" v-for="(item,index) in jzList" :key="index">
                        <div class="title">{{item.name}}</div>
                        <div class="level_2" v-for="(item1,index1) in item.children" :key="index1">
                            <div class="level_2_title">{{item1.name}}</div>
                                <template v-if="item1.type === 'all'">
                                    <!-- <el-select v-model="item1.bValue" placeholder="品牌" size="small" class="select">
                                    <el-option v-for="(item2,index2) in item1.brands"
                                    :key="index2"
                                    :label="item2.name"
                                    :value="item2.code">
                                    </el-option>
                                </el-select> -->
                                <el-cascader
                                v-model="item1.bValue"
                                :options="item1.brands"
                                :props="{ expandTrigger: 'hover','value':'code','label':'name'}"
                                size="small"
                               >
                                </el-cascader>
                                <el-select v-model="item1.mValue" placeholder="材质" size="small" class="select">
                                    <el-option v-for="(item3,index3) in item1.materials"
                                    :key="index3"
                                    :label="item3.name"
                                    :value="item3.code">
                                    </el-option>
                                </el-select>
                            </template>
                            <!-- <el-select v-if="item1.type==='brand'" style="width:70%;" v-model="item1.bValue" placeholder="品牌" size="small" class="select">
                                <el-option v-for="(item4,index4) in item1.brands"
                                    :key="index4"
                                    :label="item4.name"
                                    :value="item4.code">
                                    </el-option>
                            </el-select> -->
                              <el-cascader
                               v-if="item1.type==='brand'"
                                placeholder="品牌"
                               style="width:70%;"
                               class="select"
                                v-model="item1.bValue"
                                :options="item1.brands"
                                :props="{ expandTrigger: 'hover','value':'code','label':'name'}"
                                size="small"
                               >
                                </el-cascader>
                                <el-select v-if="item1.type==='material'" style="width:70%;" v-model="item1.mValue" placeholder="材质" size="small" class="select">
                                <el-option v-for="(item5,index5) in item1.materials"
                                    :key="index5"
                                    :label="item5.name"
                                    :value="item5.code">
                                    </el-option>
                            </el-select>
                            <el-select v-if="item1.type==='hon'" style="width:70%;" v-model="item1.mValue" placeholder="有/无" size="small" class="select">
                                <el-option 
                                    label="有"
                                    value="1">
                                </el-option>
                                    <el-option 
                                    label="无"
                                    value="0">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
                 <div class="next_btn" @click="saveJz">保存</div>
            </div>
             <div class="xmyl_box" v-if="activeIndex === 2">
                <div class="content_box">
                    <div class="level_1" v-for="(item,index) in ylList" :key="index">
                         <div class="title">{{item.name}}</div>
                         <div class="level_2" v-for="(item1,index1) in item.children" :key="index1">
                             <div class="level_2_title">{{item1.name}}</div>
                              <el-select multiple style="width:120px;" v-model="item1.value" placeholder="其它" size="small" class="select" v-if="item1.children">
                                <el-option 
                                    :label="item2.name"
                                    :value="item2.id"
                                    v-for="(item2,index2) in item1.children"
                                    :key="index2"
                                    >
                                </el-option>
                            </el-select>
                             <el-select  style="width:120px;" v-model="item1.value" placeholder="有/无" size="small" class="select" v-else>
                                <el-option 
                                    label="有"
                                    value="1">
                                </el-option>
                                    <el-option 
                                    label="无"
                                    value="0">
                                </el-option>
                            </el-select>
                         </div>
                    </div>
                </div>
                 <div class="next_btn" @click="saveYl">保存</div>
            </div>
             <div class="xmhx_box" v-if="activeIndex === 3">
                <div class="content_box">
                    <div class="content_title">
                        <div class="area_size" style="width:15%">面积段</div>
                        <div class="house_name" style="width:35%">户型名称</div>
                        <div class="house_area" style="width:15%">户型面积</div>
                        <div class="house_score" style="width:15%">户型评分</div>
                        <div class="operate" style="width:20%">操作</div>
                    </div>
                    <div class="hxpc_info">
                        <div class="item" v-for="(item,index) in hxpcArr" :key="index">
                        <div class="area_size" style="width:15%">{{item.area_size}}</div>
                        <div class="house_name" style="width:35%;">
                            <el-select @change="selectChange(item.house_list,index,$event)" v-model="item.value" placeholder="请选择户型" style="width:80%;" size="mini" class="select">
                                <el-option
                                v-for="(item1,index1) in item.house_list"
                                :key="index1"
                                :label="item1.house_name"
                                :value="item1.id"
                                >
                                </el-option>
                            </el-select>
                        </div>
                        <div class="house_area" style="width:15%">{{item.area?item.area + '㎡':''}}</div>
                        <div class="house_score" style="width:15%;">{{item.score?item.score + '分' :''}}</div>
                        <div class="operate" style="width:20%;color:#409eff">
                            <span style="margin-left:10px;cursor: pointer;" @click="addHouse(item,index)" v-if="item.isRepeat == 0">增加</span>
                            <span style="margin-left:10px;cursor: pointer;" @click="deleteHouse(index)" v-if="item.isRepeat == 1">删除</span>
                        </div>
                        </div>
                    </div>
                </div>
                <div class="btn_box">
                 <div class="saveAs_btn" style="margin-right:8%" @click="jumpToHXPC">新增户型</div>
                 <div class="save_btn" style="margin-right:7%" @click="saveHxpc">保存</div>
              </div>
            </div>
        </div>
      </dv-border-box-8>
  </div>
</template>

<script>
import locationResearch from "../../api/locationResearch"
import { mapGetters } from "vuex"
import { suDoorRatio } from '@/utils/report_qh'
export default {
    components:{
        Map
    },
    computed:{
        ...mapGetters(['locationId','map'])
    },
    data(){
        return{
            token:'pk.eyJ1IjoiMTU5MDk4Mzk1NjQiLCJhIjoiY2tpZmt0MThrMGtwcTJ5bngxN2xqNnYzeCJ9.erBGt3UuT5gNjeD-d_p_VA',
            ptArr:[],
            ptForm:{
                primaryLevel:"",
                hospitalLevel:"",
                juniorLevel:"",
                shopArea:"",
                locationId:''
            },
            buildForm:'',
            jyPrice:'',
            hxpbArr:[],
            menuList:['自建配套配置','项目精装配置','项目园林配置','项目户型评测'],
            ringCustomerConfig:{
                data:[],
                lineWidth:15,
                radius:'70%',
                activeRadius:'75%',
                activeTimeGap:2000,
                color:['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#f07167', '#e76f51','#cb997e','#4361ee','#073b4c','#577590','#197278','#84a98c']
            },
            ringMarketConfig:{
                data:[],
                lineWidth:15,
                radius:'70%',
                activeRadius:'75%',
                activeTimeGap:1800,
                color:['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#f07167', '#e76f51','#cb997e','#4361ee','#073b4c','#577590','#197278','#84a98c']
            },
            showTable:false,
            config:{
                header: ['项目名', '供应面积/套数', '成交面积/套数','去化周期','成交均价','性价比系数','可分容量','占市场容量'],
                data: [],
                headerBGC:'transparent',
                oddRowBGC:'transparent',
                evenRowBGC:'rgba(183,183,164,0.3)',
                align: ['center','center','center','center','center','center','center','center'],
                columnWidth:[200,180,180,100,100,120,100,120],
                rowNum:4
            },
            isShow:true,
            showXghxBox:false,
            showCostBox:false,
            showProListBox:false,
            activeIndex:0,
            qhzq:'',
            showCustomerLoading:true,
            showMarketCustom:false,
            lrl:'',
            cpScoreBefore:'',
            cpScoreAfter:'',
            marketInfo:{},
            costInfo:[{
                name:'土地成本',
                value:0
            },{
                name:'建安成本',
                value:0
            },{
                name:'设计成本',
                value:0
            },{
                name:'销售成本',
                value:0
            },{
                name:'其他成本',
                value:0
            }],
            jzList:[],
            ylList:[],
            hxpcArr:[],
            goodIds:[],
            showMask:false,
            mask_num:0,
            jpl:0,
            allGoodIds:[],
            allGoods:[],
            buildFormDict:[]
        }
    },
    watch:{
        hxpbArr:{
            handler(newVal){
                this.xghxpb_echarts_init()
            },
            deep:true
        },
        costInfo:{
            handler(newVal){
                this.xghxpb_echarts_init()
            },
            deep:true
        },
        locationId(newVal){
            this.onloadHandler()
        }
    },
    methods:{
        buildFormChange(){
           this.getPointInfo()
           let params = {
                locationId:this.locationId,
                ids:this.goodIds.join(',')
            }
            this.getFinalList(params)
            this.getCustomerInfo(params)
        },
        sliderChange(val){
            let goodIds = JSON.parse(JSON.stringify(this.goodIds))
            let goodsArr = JSON.parse(JSON.stringify(this.allGoods))
            console.log(goodsArr)
            for(var i = goodsArr.length -1;i>=0;i--){
               if(goodsArr[i].matching * 100 >= val){
                   goodsArr.splice(i,1)
               }
            }
            for(var k  = goodsArr.length-1;k>=0;k--){
                for(var j = goodIds.length-1;j>=0;j--){
                    if(goodsArr[k].cbuildingId == goodIds[j]){
                        goodIds.splice(j,1)
                    }
                }
            }
            this.goodIds = goodIds
             let params = {
                    locationId:this.locationId, 
                    ids:this.goodIds.join(',')
            }
            this.getFinalList(params)
            this.getCustomerInfo(params)
            let color = ["match", ["get", "id"],this.goodIds,'#fcbf49','#463f3a']
            this.map.setPaintProperty("goodsPoints_1", "circle-color",color)
        },
        lrlChange(){
            locationResearch.change({
                 belongId:this.locationId,
                 lrl:this.lrl/100
            }).then(res=>{
                this.qhzq =  res.data.data.qhzq + ''
                if(this.qhzq === 'undefined'){
                    this.qhzq = '-'
                }
                this.jyPrice = res.data.data.price + ''
            })
        },
        qhzqChange(){
             locationResearch.change({
                belongId:this.locationId,
                qhzq:this.qhzq
            }).then(res=>{
                console.log(res)
                this.cpScoreAfter = res.data.data.cpScore.toFixed(1)
                // this.getPointInfo(this.locationId)
            })
        },
        jyPriceChange(){
            locationResearch.change({
                belongId:this.locationId,
                avgPrice:this.jyPrice
            }).then(res=>{
                this.lrl = (res.data.data.lrl*100).toFixed(2)
                this.qhzq = (res.data.data.qhzq).toFixed(1)
                this.getPointInfo()
                let params = {
                    locationId:this.locationId,
                    ids:this.goodIds.join(',')
                }
                this.getFinalList(params)
                this.getCustomerInfo(params)
             })
        },
        jumpToHXPC(){
            window.open('http://qingdao.keyanshe.ltd/#/analysistools/houseEva')
        },
        saveHxpc(){
            locationResearch.saveHxpb({
                locationId:this.locationId,
                doorList:this.hxpcArr
            }).then(res=>{
               if(res.data.code === 0){
                   if(res.data.data.score_cp){
                        this.cpScoreBefore = res.data.data.score_cp.toFixed(1)
                        this.getInfo()
                        let params = {
                                locationId:this.locationId, 
                                ids:this.goodIds.join(',')
                        }
                        this.getFinalList(params)
                        this.getCustomerInfo(params)
                    }
                    this.$message({
                        type:'success',
                        message:'保存户型配置成功'
                    })
                }
            })
        },
        addHouse(item,index){
            console.log(item,index)
            let item_1 = JSON.parse(JSON.stringify(item)) 
            item_1.isRepeat = 1
            item_1.area = ''
            item_1.score = ''
            this.hxpcArr.splice(index+1,0,item_1)
            
        },
        deleteHouse(index){
            this.hxpcArr.splice(index,1)
        },
        selectChange(arr,index,id){
            console.log(arr,index,id)
            let chooseIndex = null
            arr.forEach((item,index)=>{
                if(item.id === id){
                    chooseIndex = index
                }
            })
            console.log(chooseIndex)
            this.hxpcArr[index].area = arr[chooseIndex].build_area
            this.hxpcArr[index].score = arr[chooseIndex].score
        },
        saveYl(){
            locationResearch.saveYl({
               locationId:this.locationId,
               jzList:this.ylList
           }).then(res=>{
                if(res.data.code === 0){
                    if(res.data.data.score_cp){
                        this.cpScoreBefore = res.data.data.score_cp.toFixed(1)
                        this.getInfo()
                        let params = {
                                locationId:this.locationId, 
                                ids:this.goodIds.join(',')
                        }
                        this.getFinalList(params)
                        this.getCustomerInfo(params)
                    }
                    this.$message({
                        type:'success',
                        message:'保存园林配置成功'
                    })
                }
           })
        },
        saveJz(){
           locationResearch.saveJz({
               locationId:this.locationId,
               jzList:this.jzList
           }).then(res=>{
                if(res.data.code === 0){
                    if(res.data.data.score_cp){
                        this.cpScoreBefore = res.data.data.score_cp.toFixed(1)
                        this.getInfo()
                        let params = {
                                locationId:this.locationId, 
                                ids:this.goodIds.join(',')
                        }
                        this.getFinalList(params)
                        this.getCustomerInfo(params)
                    }
                    this.$message({
                        type:'success',
                        message:'保存精装配置成功'
                    })
                }
           })
        },
        savePt(){
            locationResearch.savePt(this.ptForm).then(res=>{
                if(res.data.code === 0){
                    this.$message({
                        type:'success',
                        message:'保存自建配套成功'
                    })
                }
            })
        },
        saveCost(){
            locationResearch.saveCost({
                costLand:this.costInfo[0].value,
                costTake:this.costInfo[1].value,
                costDesign:this.costInfo[2].value,
                costSalse:this.costInfo[3].value,
                costOther:this.costInfo[4].value,
                locationId:this.locationId
            }).then(res=>{
                this.$message({
                    type:'success',
                    message:'修改成本成功'
                })
                this.showCostBox = false
                this.lrl = (res.data.data.lrl * 100).toFixed(1)
            })
        },
        addRow(){
            this.hxpbArr.push({
                minArea:'',
                maxArea:'',
                ratio:''
            })
        },
        deleteRow(i){
            console.log(i)
            this.hxpbArr.splice(i,1)
        },
        chooseMenu(i){
            this.activeIndex = i
        },
        showAll(){
            this.isShow = !this.isShow
        },
        upDateDoorRatio(){
            console.log(this.hxpbArr)
            let sum = 0
            this.hxpbArr.forEach(item=>{
                sum+=item.ratioPersent*1
            })
            console.log(sum)
            if(sum != 100){
                this.$message({
                    type:'warning',
                    message:'当前百分比总和为'+ sum +',请调至100'
                })
                return
            }
            this.hxpbArr.forEach(item=>{
                item.ratio = item.ratioPersent /100
            })
            console.log(this.hxpbArr)
            locationResearch.upDateDoorRatio({
                locationId:this.locationId,
                doorRatioDTOS:this.hxpbArr
            }).then(res=>{
                this.getPointInfo()
                let params = {
                    locationId:this.locationId,
                    ids:this.goodIds.join(',')
                }
                this.getFinalList(params)
                this.getCustomerInfo(params)
                console.log(res)
                this.showXghxBox = false
                this.jyhxpb_echarts_init()
                this.$message({
                    type:'success',
                    message:'修改户配成功'
                })
            })
        },
        costEcharts_init(){
            let myChart = this.$echarts.init(document.getElementById('costEcharts'))
            let option = {
                    title: {
                        text: '成本环形图',
                        left: 'center',
                        top:'center',
                        textStyle:{
                            color:'white',
                            fontSize:'14px'
                        }
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    label: {
                        alignTo: 'edge',
                        formatter: '{name|{b}}',
                        minMargin: 5,
                        edgeDistance: 10,
                        lineHeight: 15,
                        rich: {
                            time: {
                                fontSize: 10,
                                color: '#999'
                            }
                        }
                    },
                    series: [
                        {
                            name: '户型比重',
                            type: 'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            data: this.costInfo
                        }
                    ]
                };
            myChart.setOption(option,true);
        },
        xghxpb_echarts_init(){
            let myChart = this.$echarts.init(document.getElementById('xghxpb_echarts'))
            let arr = []
            this.hxpbArr.forEach(item=>{
                arr.push({
                    name:item.minArea + '-' + item.maxArea,
                    value:item.ratio
                })
            })
           
          let option = {
                 title: {
                    text: '户配环形图',
                    left: 'center',
                    top:'center',
                    textStyle:{
                        color:'white',
                        fontSize:'14px'
                    }
                },
                tooltip: {
                    trigger: 'item'
                },
                label: {
                    alignTo: 'edge',
                    formatter: '{name|{b}}',
                    minMargin: 5,
                    edgeDistance: 10,
                    lineHeight: 15,
                    rich: {
                        time: {
                            fontSize: 10,
                            color: '#999'
                        }
                    }
                },
                series: [
                    {
                        name: '户型比重',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        data: arr
                    }
                ]
            };
        myChart.setOption(option,true);
        },
        jyhxpb_echarts_init(){
            let myChart = this.$echarts.init(document.getElementById('jyhxpb_echarts'))
            let data = this.hxpbArr
            let xAxis = []
            let yAxis = []
            data.forEach(item=>{
                yAxis.push(item.minArea + '-' + item.maxArea)
                xAxis.push(item.areaVal)
            })
            // var colors = ['#5470C6', '#91CC75', '#EE6666'];
            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    top: '5%',
                    bottom: '5%',
                    left:'4%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01],
                     nameTextStyle:{
                        color:'#eee'
                    },
                },
                yAxis: {
                    type: 'category',
                    data:yAxis,
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#eee',  //更改坐标轴文字颜色
                            fontSize : 14      //更改坐标轴文字大小
                        },
                        axisLine:{
                            show:false
                        }
                    },
                },
                series: [
                    {
                        name: '2011年',
                        type: 'bar',
                        data: xAxis,
                        label: {
                            show: true,
                            position: 'right'
                        },
                    }
                ],
            };
        myChart.setOption(option,true);
        },
        setPointLayer(point){
          let map = this.map;
          map.flyTo({
            center:[point[0]-0.015,point[1]],
            zoom: 9.6,
            pitch: 45
          })
          var size= 100;
          let source = map.getSource('pointSource')
          if(source === undefined){
          var pulsingDot = {
            width: size,
            height: size,
            data: new Uint8Array(size * size * 4),

            onAdd: function() {
              var canvas = document.createElement("canvas");
              canvas.width = this.width;
              canvas.height = this.height;
              this.context = canvas.getContext("2d");
            },
            render: function() {
              var duration = 1000;
              var t = (performance.now() % duration) / duration;

              var radius = (size / 2) * 0.3;
              var outerRadius = (size / 2) * 0.7 * t + radius;
              var context = this.context;

              // draw outer circle
              context.clearRect(0, 0, this.width, this.height);
              context.beginPath();
              context.arc(
                  this.width / 2,
                  this.height / 2,
                  outerRadius,
                  0,
                  Math.PI * 2
              );
              context.fillStyle = "rgba(255, 200, 200," + (1 - t) + ")";
              context.fill();

              // draw inner circle
              context.beginPath();
              context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
              context.fillStyle = "rgba(255, 100, 100, 1)";
              context.strokeStyle = "white";
              context.lineWidth = 2 + 4 * (1 - t);
              context.fill();
              context.stroke();

              // update this image's data with data from the canvas
              this.data = context.getImageData(0, 0, this.width, this.height).data;

              // keep the map repainting
              map.triggerRepaint();

              // return `true` to let the map know that the image was updated
              return true;
            }
          };
          map.addImage("land-dot", pulsingDot, { pixelRatio: 2 });
          map.addSource('pointSource',{
            type:'geojson',
            data:{
              type:'FeatureCollection',
              features:[{
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",
                      "coordinates": point
                  },
                
              }]
            }
          })
          map.addLayer({
                id: "point",
                type: "symbol",
                source: 'pointSource',
                layout: {
                "icon-image": "land-dot",
                }
            });
          }
          map.getSource('pointSource').setData({
              type:'FeatureCollection',
              features:[{
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",
                      "coordinates": point
                  },
                
              }]
            })
        },
        setTimeCircle(point,time){
            this.$.ajax({
                type: "get",
                async: false, //同步请求
                url: "https://api.mapbox.com/isochrone/v1/mapbox/" + 'driving' + "/" + point + "?contours_minutes=" + time + "&polygons=true&access_token=" + this.token,
                dataType: "json",
                success: res => {
                    let data = res.features[0].geometry.coordinates
                    let map = this.map
                    let source = map.getSource('timeCircle_1')
                    if(source === undefined){
                        map.addSource("timeCircle_1", {
                                "type": "geojson",
                                "data": {
                                    "type": "FeatureCollection",
                                    "features": []
                                }
                            });
                        map.addLayer({
                            "id": "timeCircle_fill_1",
                            "type": "fill",
                            "source": "timeCircle_1",
                            "layout": {
                                // "visibility":"visible"
                            },
                            "paint": {
                                "fill-color": "#fcbf49",
                                "fill-opacity": 0.2,
                            }
                        });
                        map.addLayer({
                            "id": "timeCircle_line_1",
                            "type": "line",
                            "source": "timeCircle_1",
                            "layout": {},
                            "paint": {
                                "line-color": "#fcbf49",
                                "line-opacity": 1,
                                }
                        });
                    }
                    map.getSource('timeCircle_1').setData({
                        "type": "FeatureCollection",
                        "features": [res.features[0]]
                    })
                    let coordinatesStr = []
                    data[0].forEach(item=>{
                        coordinatesStr.push(item.join(','))
                    })
                    coordinatesStr = coordinatesStr.join(';')
                    let params = {
                        coordinates:coordinatesStr,
                        locationId:this.locationId,
                    }
                    // this.reloadGoods = true
                },
          });
           
        },
        setGoodsLayer(data){
            let goodIds = []
            let allGoodIds = []
            let map = this.map
            let geojsonData = {
                type:'FeatureCollection',
                features:[]
            }
            data.forEach(item=>{
            if(item.coordinates){
                let coordinates = item.coordinates.split(',')
                goodIds.push(item.cbuildingId)
                allGoodIds.push(item.cbuildingId)
                geojsonData.features.push({
                type:'Feature',
                geometry:{
                    type:'Point',
                    coordinates:coordinates
                },
                properties:{
                        id:item.cbuildingId,
                        title:item.buildingName,
                        point:item.coordinates.split(','),
                        matching:(item.matching *100).toFixed(0) + '%'
                    }
                })
            }
            })
            this.goodIds = goodIds
            this.allGoodIds = allGoodIds
            let goodsSource = map.getSource('goodsSource_1')
            if(goodsSource==undefined){
            map.addSource('goodsSource_1',{
                type:'geojson',
                data:{
                type:'FeatureCollection',
                features:[]
                }
            })
            map.addLayer({
                id:'goodsPoints_1',
                type:'circle',
                source:'goodsSource_1',
                paint: {
                    'circle-color': '#fcbf49',
                    "circle-radius": 8,
                    'circle-stroke-width': 0.5,
                    'circle-stroke-color': 'white'
                }
            },'point')
             map.addLayer({
              id: "goodsName_1",
              type: "symbol",   /* symbol类型layer，一般用来绘制点*/
              source: "goodsSource_1",
              paint: {
                 "text-color": "#11b4da",
              },
              layout: {
                  'symbol-placement':'point', //默认值
                  "text-field": "{title}  {matching}",
                  "text-offset": [0, -2],
                  "text-anchor": "top" ,
                  "icon-allow-overlap":true,
                  "icon-ignore-placement":true
              }
          },'point');
          map.on('click','goodsPoints_1',this.goodsPoiHandle)
        }
        map.getSource('goodsSource_1').setData(geojsonData)
        },
        goodsPoiHandle(e){
            let map = this.map
            e.originalEvent.cancelBubble = true;
            let data = e.features[0].properties
            console.log(this.goodIds)
            if(this.goodIds.includes(data.id)){
                this.goodIds.splice(this.goodIds.findIndex(item=>item === data.id),1)
            }else{
                this.goodIds.push(data.id)
            }
            //点亮点灭
            let color = ["match", ["get", "id"],this.goodIds,'#fcbf49','#463f3a']
            map.setPaintProperty("goodsPoints_1", "circle-color",color)

            //请求变化后数据
            let params = {
                locationId:this.locationId,
                ids:this.goodIds.join(',')
            }
            this.showLoading = true
            this.getFinalList(params)
            this.getCustomerInfo(params)
        },
        getFinalList(data){
            this.showTable = false
            locationResearch.getFinalList(data).then(res=>{
            let list = res.data.data.list
            let {marketAvg,market_cl,market_qhzq,market_salse,market_supply,sec} = res.data.data
            this.marketInfo = {marketAvg,market_cl,market_qhzq,market_salse,market_supply,sec}
            let tableList = []
            list.forEach(item=>{
                tableList.push([
                    item.name,item.area_increased + '万㎡/' +item.stock_increased+'套',item.area_sales+'万㎡/'+item.stock_sales+'套' ,item.qhzq+'年',item.avg_price,item.cp,item.cap,item.market_ratio
                ])
            })
            this.showTable = false
            this.config.data = tableList
            setTimeout(_=>{
                this.showTable = true
            },500)
          })
        },
        getCustomerInfo(data){
            this.showMarketCustom = false
            locationResearch.getCustomerInfo(data).then(res=>{
                console.log(res.data.data.rst)
                let rst = res.data.data.rst
                let arr = []
                rst.forEach(item=>{
                    if(item.ratio!=0){
                        arr.push({
                            name:item.moduleName,
                            value:item.ratio
                        })
                    }
                })
                this.ringMarketConfig.data = arr
                setTimeout(_=>{
                    this.showMarketCustom = true
                },500)
            })
        },
        getPointInfo(){
           this.showMask = true
           locationResearch.getPointInfo({
               buildForm:this.buildForm,
               locationId:this.locationId
           }).then(res=>{
               this.showMask = false
               this.setGoodsLayer(res.data.data.rst)
            })
        },
        getInfo(){
            locationResearch.getInfo(this.locationId).then(res=>{
                let data = res.data.data
                console.log(data)
                if(data.avgPrice) this.jyPrice = data.avgPrice +''
                if(data.lrl) this.lrl = (data.lrl * 100).toFixed(2)
                if(data.qhzq) this.qhzq = data.qhzq +''
                if(data.scoreCp) this.cpScoreBefore = data.scoreCp.toFixed(1)
                if(data.changeCp) this.cpScoreAfter = data.changeCp.toFixed(1)
            })
        },
        onloadHandler(){
            this.ptForm.locationId = this.locationId
            this.getInfo()
            locationResearch.getFinalCusom(this.locationId).then(res=>{
                console.log(res.data.data)
                let arr = res.data.data.form
                arr.forEach(item=>{
                    this.ringCustomerConfig.data.push({
                            name:item.moduleName,
                            value:item.ratio
                        })
                })
                this.showCustomerLoading = false
            })
            locationResearch.getHPInfo(this.locationId).then(res=>{
                let data = res.data.data.door_list
                data.forEach(item=>{
                    item.areaVal =  item.areaVal = ((item.ratio * res.data.data.house_area.build_area)/((item.areaSize.split('-')[0]*1 + item.areaSize.split('-')[1]*1)/2)).toFixed(0)
                })
                data.forEach(item=>{
                    item.ratioPersent = (item.ratio * 100).toFixed(0)
                })
                this.hxpbArr  = data
                console.log(this.hxpbArr)
                this.$nextTick(_=>{
                    this.jyhxpb_echarts_init()
            })
            })
            locationResearch.getBuildFormDict().then(res=>{
                console.log(res.data.data)
                this.buildFormDict = res.data.data
            })
            
            this.getCustomerInfo({
                locationId:this.locationId
            })
            this.showMask = true
            locationResearch.getPointInfo({
                locationId:this.locationId,
                buildForm:this.buildForm
            }).then(res=>{
                this.showMask = false
                let data = res.data.data
                this.allGoods = res.data.data.rst
                this.setPointLayer(data.thisCoordinate.split(','))
                this.setTimeCircle(data.thisCoordinate,data.duration)
                this.setGoodsLayer(res.data.data.rst)
            })
            //获取成本
            locationResearch.getCost(this.locationId).then(res=>{
                console.log(res.data.data[0])
                let data = res.data.data[0]
                this.costInfo=[{
                    name:'土地成本',
                    value:data.costLand
                },{
                    name:'建安成本',
                    value:data.costTake
                },{
                    name:'设计成本',
                    value:data.costDesign
                },{
                    name:'销售成本',
                    value:data.costSalse
                },{
                    name:'其他成本',
                    value:data.costOther
                }]
                this.$nextTick(_=>{
                    this.costEcharts_init()
                })
            })
            locationResearch.getCommonDict().then(res=>{
                this.ptArr = res.data.data
            })
            //获取自建配套列表
            locationResearch.getPt(this.locationId).then(res=>{
                let data = res.data.data
                this.ptForm.hospitalLevel = data.hospitalLevel +''
                this.ptForm.juniorLevel = data.juniorLevel + ''
                this.ptForm.primaryLevel = data.primaryLevel +''
                this.ptForm.shopArea = data.shopArea
                console.log(this.ptForm)
            })
            locationResearch.getJZlist(this.locationId).then(res=>{
                this.jzList = res.data.data
                console.log(this.jzList)
            })
            this.getFinalList({
                locationId:this.locationId
            })
            
            locationResearch.getYlList(this.locationId).then(res=>{
                this.ylList = res.data.data
            })
            locationResearch.getHxpc(this.locationId).then(res=>{
                console.log(res.data.data)
                this.hxpcArr = res.data.data
            })
        }
    },
    mounted(){
        this.xghxpb_echarts_init()
    },
    created(){
        this.onloadHandler()
    }
}
</script>

<style lang="scss" scoped>
.locationDecision_wrap{
    height: calc(100% - 60px);
    width: 100%;
    position: fixed;
    top:60px;
    pointer-events: none;
    .mask{
        position: fixed;
        top:60px;
        left: 0px;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.3);
        display: flex;
        justify-content: center;
        align-content: center;
        z-index: 99999999;
        pointer-events: auto;
        .dv-decoration-9{
            position: absolute;
            top:30%;
            width:200px;
            height:200px;
            color:white;
            font-size:16px;
            left: 46.5%;
        }
    }
    .mask_1{
        position: fixed;
        top:60px;
        left: 0px;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.1);
        display: flex;
        justify-content: center;
        align-content: center;
        z-index: 9999;
        pointer-events: auto;
    }
    .left_top_box{
        position: absolute;
        top:30px;
        left:50px;
        width: 30%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        pointer-events: auto;
        ::v-deep .el-input__inner{
            background: transparent;
            color:rgb(252, 191, 73);
        }
        .block{
            width:300px;
            ::v-deep .el-slider__runway{
                background-color:#409EFF;
                .el-slider__bar{
                    background-color:#E4E7ED;
                }
            }
            ::v-deep .el-input-number__decrease{
                background: #252e4b;
                color: white;
            }
            ::v-deep .el-input-number__increase{
                background: #252e4b;
                color: white;
            }

        }
    }
    .bottom_box{
        position: absolute;
        // background: cornsilk;
        height: 60%;
        width: 100%;
        bottom: 0%;
        pointer-events: none;
        transform: translateY(0);
        transition: all 0.3s ease;
        .top_box{
            width: 100%;
            height: 50%;
            // background: pink;
            border-bottom: 2px solid rgba(255,255,255,0.3);
            position: relative;
            pointer-events: none;
            .hxpb_box{
                height:80%;
                width: 30%;
                position: absolute;
                left: 2%;
                top:10%;
                background: rgba(47,62,70,.7);
                border-radius: 8px;
                pointer-events:auto;
                ::v-deep .border-box-content{
                    display: flex;
                    flex-direction: column;
                }
                .title{
                    text-align: center;
                    color: rgba(191, 191, 191, 1);
                    font-size: 14px;
                    margin-top:16px;
                    text-align: center;
                }
                #jyhxpb_echarts{
                    height: 100%;
                    width: 100%;
                }
            }
            .operate_box{
                position: absolute;
                left: 33%;
                color:#219ebc;
                bottom: 10%;
                text-decoration: underline;
                pointer-events: auto;
                font-weight: 700;
                
            }
            .xsjj_box{
                height:80%;
                top: 10%;
                width: 22%;
                position: absolute;
                right: 15%;
                background: rgba(47,62,70,.7);
                border-radius: 8px;
                pointer-events:auto;
                .dv-loading{
                    width: 100%;
                    height: 100%;
                    color:white;
                }
                ::v-deep .border-box-content{
                    display: flex;
                    flex-wrap: wrap;
                    align-content: flex-start;
                }
                .title{
                    text-align: center;
                    color: rgba(191, 191, 191, 1);
                    font-size: 14px;
                    margin-top:16px;
                    text-align: center;
                }
                .item_res{
                    padding: 6px 0;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    margin-left: 10%;
                    width: 40%;
                    .title{
                        color:rgba(191, 191, 191, 1);
                        font-size: 14px;
                    }
                    .value{
                        white-space: nowrap;
                        margin-top:4px;
                        .value_num{
                            color:rgba(255, 141, 26, 1);
                            font-size: 30px;
                            font-weight: 700;
                            background: transparent;
                            border: 0;
                            min-width: 30px;
                        }
                        .unit{
                            color:white;
                            margin-left: 4px;
                            font-size: 14px;
                        }
                        .icon-iconfontgong{
                            font-size: 18px;
                            color:#f94144;
                            margin:0 6px;
                            position: relative;
                            bottom:4px;
                        }
                        .icon-xiajiang-xiexia{
                            font-size: 18px;
                            color:#2a9d8f;
                            margin:0 6px;
                            position: relative;
                            bottom:4px;
                        }
                    }
                }
            }
            .khgc_box{
                height:80%;
                width: 11%;
                position: absolute;
                right: 2%;
                top: 10%;
                background: rgba(47,62,70,.7);
                border-radius: 8px;
                pointer-events:auto;
                ::v-deep .border-box-content{
                    display: flex;
                    flex-wrap: wrap;
                    align-content: flex-start;
                }
                .title{
                    width: 100%;
                    color: rgba(191, 191, 191, 1);
                    font-size: 14px;
                    margin-top:16px;
                    text-align: center;
                }
            }
            .container{
                position: absolute;
                bottom: 5%;
                left: 50%;
                cursor: pointer;
                width:80px;
                height:80px;
                transform: rotate(0deg);
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                pointer-events: auto;
            }
            .container_active{
                transform: rotate(180deg);
                transition: all 0.3s ease;
            }
            .chevron {
                position: absolute;
                top:12px;
                width: 28px;
                height: 8px;
                opacity: 0;
                transform: scale3d(0.5, 0.5, 0.5);
                animation: move 3s ease-out infinite;
                cursor: pointer;
            }
            .chevron:first-child {
                animation: move 3s ease-out 1s infinite;
            }
            .chevron:nth-child(2) {
                animation: move 3s ease-out 2s infinite;
            }
            .chevron:before,
            .chevron:after {
                content: ' ';
                position: absolute;
                top: 0;
                height: 100%;
                width: 51%;
                background: #fff;
            }
            .chevron:before {
                left: 0;
                transform: skew(0deg, 30deg);
            }
            .chevron:after {
                right: 0;
                width: 50%;
                transform: skew(0deg, -30deg);
            }
            @keyframes move {
                25% {
                    opacity: 1;
                }
                33% {
                    opacity: 1;
                    transform: translateY(30px);
                }
                67% {
                    opacity: 1;
                    transform: translateY(40px);
                }
                100% {
                    opacity: 0;
                    transform: translateY(55px) scale3d(0.5, 0.5, 0.5);
                }
            }
        }
        .bottom_bottom_box{
            width: 100%;
            height: 50%;
            position: relative;
            pointer-events: none;
            .kfrl_box{
                height:80%;
                width: 50%;
                position: absolute;
                left: 2%;
                top: 10%;
                background: rgba(47,62,70,.7);
                border-radius: 8px;
                pointer-events:auto;
                ::v-deep .border-box-content{
                    display: flex;
                    flex-direction: column;
                }
                .title{
                    text-align: center;
                    color: rgba(191, 191, 191, 1);
                    font-size: 14px;
                    margin-top:16px;
                    text-align: center;
                }
            }
            .qxzq_box{
                height:80%;
                top: 10%;
                width: 30%;
                position: absolute;
                right: 15%;
                background: rgba(47,62,70,.7);
                border-radius: 8px;
                pointer-events:auto;
                ::v-deep .border-box-content{
                    display: flex;
                    flex-wrap: wrap;
                    align-content: flex-start;
                }
                .title{
                    text-align: center;
                    color: rgba(191, 191, 191, 1);
                    font-size: 14px;
                    margin-top:16px;
                    text-align: center;
                }
                .item_res{
                    padding: 6px 0;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    margin-left: 5%;
                    width: 24%;
                    .title{
                        color:rgba(191, 191, 191, 1);
                        font-size: 14px;
                    }
                    .value{
                        white-space: nowrap;
                        margin-top:4px;
                        .value_num{
                            color:rgba(255, 141, 26, 1);
                            font-size: 30px;
                            font-weight: 700;
                        }
                        .unit{
                            color:white;
                            margin-left: 4px;
                            font-size: 14px;
                        }
                    }
                }
            }
            .khgc_box{
                height:80%;
                width: 11%;
                position: absolute;
                right: 2%;
                top: 10%;
                background: rgba(47,62,70,.7);
                border-radius: 8px;
                pointer-events:auto;
                ::v-deep .border-box-content{
                    display: flex;
                    flex-wrap: wrap;
                    align-content: flex-start;
                }
                .title{
                    width: 100%;
                    color: rgba(191, 191, 191, 1);
                    font-size: 14px;
                    margin-top:16px;
                    text-align: center;
                }
            }
        }
    }
    .bottom_box_active{
        transform: translateY(50%);
        transition: all 0.3s ease;
    }
    .xghx_box{
        position: absolute;
        height: 75%;
        width: 20%;
        left:40%;
        top:10%;
        background: rgba(47,62,70,.85);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        transform: scaleY(0.0);
        opacity: 0;
        transition: all 0.3s ease;
        pointer-events: auto;
        position: relative;
        z-index: 99999;
        ::v-deep .el-input__inner{
            background: transparent;
            border: 0;
            border-bottom: 1px solid rgba(255,255,255,.3);
            border-radius: 0px;
            text-align: center;
            color: rgb(252, 191, 73);
        
        }
      .close_box{
            position: absolute;
            right:14px;
            top:10px;
            height:30px;
            width:30px;
            display: flex;
            justify-content: center;
            align-items: center;
            color:white;
            pointer-events: auto;
            &:hover{
                transform: rotate(180deg);
                transition: all 0.3s ease;
            }
            .icon-guanbi{
                margin-top:-11px;
                cursor: pointer;
                font-size:20px;
            }
         }
        .title{
            text-align: center;
            color:rgba(191, 191, 191, 1);
            font-size:22px;
            margin-top:22px;
        }
        #xghxpb_echarts{
            width: 100%;
            height: 30%;
        }
        .intialAdjustment_box{
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            height: 48%;
            margin-top: 20px;
            pointer-events: auto;
            margin:0 2%;
            .info_title{
                display: flex;
                color:white;
                font-size: 16px;
                margin-bottom: 20px;
            }
            .item_box{
                overflow-y: scroll;
            }
            .item{
                display: flex;
                color:white;
                font-size: 16px;
                align-items: center;
                margin-bottom: 10px;
                height: 16%;
                flex-shrink: 0;
                ::v-deep .el-input__inner{
                    background: transparent;
                    color: rgb(252, 191, 73);
                    font-size: 20px;
                }
            }
            .total{
                display: flex;
                color:white;
                font-size: 18px;
            }
            ::v-deep .el-input-group__append{
                padding: 0;
                background: transparent;
                border:0;
            }
        }
        .btn_box{
          display: flex;
          width: 100%;
          justify-content: flex-end;
          margin-top:30px;
          .save_btn{
              border-radius: 8px;
              position: relative;
              color:white;
              font-size:12px;
              padding:8px 20px;
              letter-spacing: 1.5px;
              background: #457fca;  /* fallback for old browsers */
              background: -webkit-linear-gradient(to right, #5691c8, #457fca);  /* Chrome 10-25, Safari 5.1-6 */
              background: linear-gradient(to right, #5691c8, #457fca); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
              border-radius: 4px;
              user-select: none;
              cursor: pointer;
              &:active{
                  opacity: 0.7;
              }
          }
          .saveAs_btn{
            border-radius: 8px;
              position: relative;
              color:white;
              font-size:12px;
              padding:8px 16px;
              letter-spacing: 1.5px;
              background: linear-gradient(to right, #F4A261, #F4A261); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
              border-radius: 4px;
              user-select: none;
              cursor: pointer;
              &:active{
                  opacity: 0.7;
              }
          }
        }
    }
    .xghx_box_active{
      transform: scaleY(1);
      opacity: 1;
      transition: all 0.3s ease;
    }
    .cost_box{
        position: absolute;
        height: 75%;
        width: 20%;
        left:40%;
        top:10%;
        background: rgba(47,62,70,.7);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        transform: scaleY(0.0);
        opacity: 0;
        transition: all 0.3s ease;
        pointer-events: auto;
        z-index: 99999;
        ::v-deep .el-input__inner{
            background: transparent;
            border: 0;
            border-bottom: 1px solid rgba(255,255,255,.3);
            border-radius: 0px;
            text-align: center;
            color: rgb(252, 191, 73);
        
        }
      .close_box{
            position: absolute;
            right:14px;
            top:10px;
            height:30px;
            width:30px;
            display: flex;
            justify-content: center;
            align-items: center;
            color:white;
            &:hover{
                transform: rotate(180deg);
                transition: all 0.3s ease;
            }
            .icon-guanbi{
                margin-top:-11px;
                cursor: pointer;
                font-size:20px;
            }
         }
        .title{
            text-align: center;
            color:rgba(191, 191, 191, 1);
            font-size:22px;
            margin-top:22px;
        }
        .intialAdjustment_box{
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            margin-top:-5%;
            height: 46%;
            .info_title{
                display: flex;
                color:white;
                font-size: 18px;
                margin-bottom: 20px;
            }
            .item{
                display: flex;
                color:white;
                font-size: 16px;
                margin-bottom: 10px;
                ::v-deep .el-input__inner{
                    background: transparent;
                    color: rgb(252, 191, 73);
                }
            }
            .total{
                display: flex;
                color:white;
                font-size: 18px;
            }
        }
        .save_btn{
              border-radius: 8px;
              color:white;
              font-size:12px;
              padding:8px 16px;
              letter-spacing: 1.5px;
              background: #457fca;  /* fallback for old browsers */
              background: -webkit-linear-gradient(to right, #5691c8, #457fca);  /* Chrome 10-25, Safari 5.1-6 */
              background: linear-gradient(to right, #5691c8, #457fca); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
              user-select: none;
              cursor: pointer;
              width: 50px;
              text-align: center;
              margin-left: 65%;
              margin-top: 15px;
              &:active{
                  opacity: 0.7;
              }
          }
    }
    .cost_box_active{
      transform: scaleY(1);
      opacity: 1;
      transition: all 0.3s ease;
    }
    .pro_list_box{
        position: absolute;
        height: 75%;
        width: 40%;
        left:30%;
        top:10%;
        background: rgba(47,62,70,.7);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        transform: scaleY(0.0);
        opacity: 0;
        transition: all 0.3s ease;
        pointer-events: auto;
        z-index: 99999;
        ::v-deep .el-input__inner{
            background: transparent;
            // border: 0;
            // border-bottom: 1px solid rgba(255,255,255,.3);
            // border-radius: 0px;
            text-align: center;
            color: rgb(252, 191, 73);
        
        }
      .close_box{
            position: absolute;
            right:14px;
            top:10px;
            height:30px;
            width:30px;
            display: flex;
            justify-content: center;
            align-items: center;
            color:white;
            &:hover{
                transform: rotate(180deg);
                transition: all 0.3s ease;
            }
            .icon-guanbi{
                margin-top:-11px;
                cursor: pointer;
                font-size:20px;
            }
         }
         .menu{
             height: 8%;
             width: 96%;
             margin: 0 2%;
             border-bottom: 1px solid rgba(204, 204, 204, 1);
             display: flex;
             margin-top: 2px;
             .item{
                 height: 100%;
                 width: 25%;
                 display: flex;
                 justify-content: center;
                 align-items: center;
                 color: white;
                 cursor:pointer;
             }
             .item_active{
                 color:#12b5dc;
             }
         }
         .menu_content{
             width: 96%;
             height: 86%;
             padding: 2%;
             .zjpt_box{
                 height: 100%;
                 width: 100%;
                 display: flex;
                 flex-direction: column;
                 align-items: center;
                 .content_box{
                     width: 90%;
                     height: 88%;
                     display: flex;
                     flex-wrap: wrap;
                     align-content: flex-start;
                     .content_item{
                         width: 50%;
                         padding: 20px 0;
                         display: flex;
                         align-items: center;
                         justify-content: space-around;
                         margin-bottom: 10%;
                         .content_label{
                             width:30%;
                             color:white;
                             font-size: 18px;
                             text-align: center;
                             white-space: nowrap;
                         }
                         .content_select{
                             width: 50%;
                         }
                     }
                 }
                 .next_btn{
                    margin-left:76%;
                    border-radius: 8px;
                    position: relative;
                    color:white;
                    font-size:12px;
                    padding:8px 20px;
                    letter-spacing:3px;
                    background: #457fca;  /* fallback for old browsers */
                    background: -webkit-linear-gradient(to right, #5691c8, #457fca);  /* Chrome 10-25, Safari 5.1-6 */
                    background: linear-gradient(to right, #5691c8, #457fca); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
                    border-radius: 4px;
                    user-select: none;
                    cursor: pointer;
                    &:active{
                        opacity: 0.7;
                    }
                }
             }
             .xmjz_box{
                height: 100%;
                 width: 100%;
                 display: flex;
                 flex-direction: column;
                 align-items: center;
                 .content_box{
                    width: 92%;
                    height: 88%;
                    display: flex;
                    flex-direction: column;
                    overflow-y:scroll;
                    .level_1{
                        width: 100%;
                        .title{
                            color:white;
                            font-size:24px;
                            letter-spacing: 4px;
                        }
                        .level_2{
                            width:80%;
                            margin-left:10%;
                            display: flex;
                            align-items: center;
                            margin-top:20px;
                             &:last-child{
                                margin-bottom: 20px;
                            }
                            .level_2_title{
                                color:white;
                                font-size:16px;
                                width: 20%;
                                text-align: center;
                            }
                            .el-select,.el-cascader{
                                width: 30%;
                                margin-left:10%;
                            }
                        }
                    }
                 }
                 .next_btn{
                     margin-top:20px;
                    margin-left:76%;
                    border-radius: 8px;
                    position: relative;
                    color:white;
                    font-size:12px;
                    padding:8px 20px;
                    letter-spacing:3px;
                    background: #457fca;  /* fallback for old browsers */
                    background: -webkit-linear-gradient(to right, #5691c8, #457fca);  /* Chrome 10-25, Safari 5.1-6 */
                    background: linear-gradient(to right, #5691c8, #457fca); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
                    border-radius: 4px;
                    user-select: none;
                    cursor: pointer;
                    &:active{
                        opacity: 0.7;
                    }
                }
             }
             .xmyl_box{
                height: 100%;
                 width: 100%;
                 display: flex;
                 flex-direction: column;
                 align-items: center;
                .content_box{
                    width: 92%;
                    height: 88%;
                    display: flex;
                    flex-direction: column;
                    overflow-y:scroll;
                    .level_1{
                        width: 100%;
                        .title{
                            color:white;
                            font-size:24px;
                            letter-spacing: 4px;
                        }
                        .level_2{
                            width:80%;
                            margin-left:10%;
                            display: flex;
                            align-items: center;
                            margin-top:20px;
                            &:last-child{
                                margin-bottom: 20px;
                            }
                            .level_2_title{
                                color:white;
                                font-size:16px;
                                width: 60%;
                                text-align: center;
                            }
                            .el-select{
                                width: 20%;
                                margin-left:10%;
                            }
                        }
                    }
                 }
                 .next_btn{
                    margin-top: 20px;
                    margin-left:76%;
                    border-radius: 8px;
                    position: relative;
                    color:white;
                    font-size:12px;
                    padding:8px 20px;
                    letter-spacing:3px;
                    background: #457fca;  /* fallback for old browsers */
                    background: -webkit-linear-gradient(to right, #5691c8, #457fca);  /* Chrome 10-25, Safari 5.1-6 */
                    background: linear-gradient(to right, #5691c8, #457fca); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
                    border-radius: 4px;
                    user-select: none;
                    cursor: pointer;
                    &:active{
                        opacity: 0.7;
                    }
                }
             }
             .xmhx_box{
                height: 100%;
                 width: 100%;
                 display: flex;
                 flex-direction: column;
                 align-items: center;
                 .content_box{
                    width: 90%;
                    height: 88%;
                    .content_title{
                        height: 20px;
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                        color:white;
                        font-size:16px;
                        text-align: center;
                    }
                    .hxpc_info{
                        height: 90%;
                        margin-top:20px;
                        overflow-y:scroll;
                       
                        .item{
                            display: flex;
                            font-size: 15px;
                            color:white;
                            text-align: center;
                            margin-bottom: 21px;
                        }
                    }
                 }
                 .btn_box{
                        display: flex;
                        width: 100%;
                        justify-content: flex-end;
                        margin-top:30px;
                        .save_btn{
                            border-radius: 8px;
                            position: relative;
                            color:white;
                            font-size:12px;
                            padding:8px 20px;
                            letter-spacing: 1.5px;
                            background: #457fca;  /* fallback for old browsers */
                            background: -webkit-linear-gradient(to right, #5691c8, #457fca);  /* Chrome 10-25, Safari 5.1-6 */
                            background: linear-gradient(to right, #5691c8, #457fca); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
                            border-radius: 4px;
                            user-select: none;
                            cursor: pointer;
                            &:active{
                                opacity: 0.7;
                            }
                        }
                        .saveAs_btn{
                            border-radius: 8px;
                            position: relative;
                            color:white;
                            font-size:12px;
                            padding:8px 20px;
                            letter-spacing: 1.5px;
                            background: linear-gradient(to right, #F4A261, #F4A261); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
                            border-radius: 4px;
                            user-select: none;
                            cursor: pointer;
                            &:active{
                                opacity: 0.7;
                            }
                        }
                    }
                 .next_btn{
                    margin-top: 20px;
                    margin-left:76%;
                    border-radius: 8px;
                    position: relative;
                    color:white;
                    font-size:12px;
                    padding:8px 20px;
                    letter-spacing:3px;
                    background: #457fca;  /* fallback for old browsers */
                    background: -webkit-linear-gradient(to right, #5691c8, #457fca);  /* Chrome 10-25, Safari 5.1-6 */
                    background: linear-gradient(to right, #5691c8, #457fca); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
                    border-radius: 4px;
                    user-select: none;
                    cursor: pointer;
                    &:active{
                        opacity: 0.7;
                    }
                }
             }
         }
    }
    .pro_list_box_active{
      transform: scaleY(1);
      opacity: 1;
      transition: all 0.3s ease;
    }
}
</style>