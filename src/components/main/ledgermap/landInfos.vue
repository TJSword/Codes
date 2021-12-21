<template>
  <div class="landinfo_wrap">
    <div class="upload_info" ref="uploadBox" :style="{right:landinfoShow?'1%':'-100%'}">
      <div class="detailInfo">
        <div class="info_head">
          <div class="info_title">
            <div class="land_name">宗地编号：{{landInfos.landNumber}}</div> 
            <el-tag style="margin-left:10px;" effect="dark" type="success">{{convertLandTypeText(landInfos.state)}}</el-tag>
          </div>
          <div class="btns_box">
            <el-button size="small" type="primary" @click="shareLand()">分享</el-button>
            <el-button size="small" @click="closeLandInfo()">关闭</el-button>
          </div>
        </div>
        <div class="parInfoForm">
          <!-- 土地信息 -->
          <el-form ref="landInfos" :model="landInfos"  label-position="left">
            <div class="info_item" style="margin-top:20px;">
              <el-form-item label="土地标签：" prop="labels" style="width:96%;display:flex;align-items:center;">
                <div class="land_labels">
                  <el-tag class="label_tag" v-for="item in landInfos.labels" :key="item" type="" effect="plain">{{convertUserLabel(item)}}</el-tag>
                </div>
              </el-form-item>
            </div>
            <el-divider content-position="left">基础信息</el-divider>
            <div class="info_item">
              <el-form-item label="是否公开：" prop="isOpen">
                <el-tag :type="landInfos.isOpen==='0'?'danger':'success'">{{landInfos.isOpen==='0'?'不公开':'公开'}}</el-tag>
              </el-form-item>
              <el-form-item label="收费航拍链接：" prop="chargeFlylink">
                <el-link v-if="landInfos.chargeFlylink&&landInfos.chargeFlylink!=='/'" type="primary" :href="landInfos.chargeFlylink" target="_blank">
                  点击查看
                </el-link>
              </el-form-item>
              <el-form-item label="免费航拍链接：" prop="landAerial">
                <el-link v-if="landInfos.landAerial&&landInfos.landAerial!=='/'" type="primary" :href="landInfos.landAerial" target="_blank">
                  点击查看
                </el-link>
              </el-form-item>
              <el-form-item label="公告号：" prop="annoId">
                <el-tag type="" effect="plain">{{landInfos.annoId}}</el-tag>
              </el-form-item>
              <el-form-item label="宗地名称：" prop="parcelLocation" style="width:100%;">
                <el-tag type="" effect="plain">{{landInfos.parcelLocation}}</el-tag>
              </el-form-item>
              <el-form-item label="宗地位置：" prop="address" style="width:100%;">
                <div class="val_text">{{landInfos.address}}</div>
              </el-form-item>
              <!-- <el-form-item label="公告时间" prop="annoTime">
                <label class="val_text">{{landInfos.annoTime}}</label>
              </el-form-item> -->
              <el-form-item label="省份：" prop="landProvince">
                <label class="val_text">{{convertProvince(landInfos.landProvinceno)}}</label>
              </el-form-item>
              <el-form-item label="城市：" prop="landCityno">
                <label class="val_text">{{landInfos.landCity}}</label>
              </el-form-item>
              <el-form-item label="区(市)县：" prop="regionno">
                <el-tag type="" effect="plain">{{landInfos.region}}</el-tag>
              </el-form-item>
              <el-form-item label="环域：" prop="torus">
                <label class="val_text">{{landInfos.torus}}</label>
              </el-form-item>
              <el-form-item label="板块：" prop="partname">
                <label class="val_text">{{landInfos.partname}}</label>
              </el-form-item>
              <el-form-item label="出让面积：" prop="landArea1">
                <label class="val_text">{{landInfos.landArea1}}<span class="unit">㎡</span></label>
              </el-form-item>
              <el-form-item label="出让面积：" prop="landArea">
                <label class="val_text">{{landInfos.landArea}}<span class="unit">亩</span></label>
              </el-form-item>
              <el-form-item label="用地性质：" prop="purpose">
                <el-tag type="" effect="plain">{{convertPurpose(landInfos.purpose)}}</el-tag>
              </el-form-item>
              <el-form-item label="规划用途：" prop="landNature">
                <label class="val_text">{{landInfos.landNature}}</label>
              </el-form-item>
              <el-form-item label="使用年限：" prop="userYears">
                <label class="val_text">{{landInfos.userYears}}</label>
              </el-form-item>
              <el-form-item label="容积率：" prop="ratio">
                <label class="val_text">{{landInfos.ratio}}</label>
              </el-form-item>
              <el-form-item label="计算容积率：" prop="volumeRatio">
                <label class="val_text">{{landInfos.volumeRatio&&landInfos.volumeRatio!=='/'? JSON.parse(landInfos.volumeRatio).toFixed(2) : "-"}}</label>
              </el-form-item>
              <el-form-item label="计算建筑面积：" prop="buildArea">
                <label class="val_text">{{landInfos.buildArea}}<span class="unit">㎡</span></label>
              </el-form-item>
              <el-form-item label="商占比：" prop="rcScale">
                <label class="val_text">{{landInfos.rcScale}}</label>
              </el-form-item>
              <el-form-item label="商业建筑面积：" prop="businessArea">
                <label class="val_text">{{landInfos.businessArea}}<span class="unit">㎡</span></label>
              </el-form-item>
              <el-form-item label="建筑密度：" prop="buildingDensity">
                <label class="val_text">{{landInfos.buildingDensity}}</label>
              </el-form-item>
              <el-form-item label="绿地率：" prop="greenRate">
                <label class="val_text">{{landInfos.greenRate}}</label>
              </el-form-item>
              <el-form-item label="建筑高度：" prop="buildingHeight" style="width:100%">
                <label class="val_text">{{landInfos.buildingHeight}}</label>
              </el-form-item>
              <el-form-item label="备注：" prop="remarks" style="width:96%">
                <label class="val_text">{{landInfos.remarks}}</label>
              </el-form-item>
            </div>
            <el-divider content-position="left">土地出让信息</el-divider>
            <div class="info_item">
              <el-form-item label="出让方式：" prop="sellType">
                <el-tag type="" effect="plain">{{convertSellType(landInfos.sellType)}}</el-tag>
              </el-form-item>
              <el-form-item label="拍卖规则：" prop="auctionRules" style="width:96%;">
                <label class="val_text">{{landInfos.auctionRules}}</label>
              </el-form-item>
              <el-form-item label="产业条件：" prop="industryConditions" style="width:96%;">
                <label class="val_text">{{landInfos.industryConditions}}</label>
              </el-form-item>
              <el-form-item label="配建/自持/无偿移交：" prop="otherInfo" style="width:96%;">
                <label class="val_text">{{landInfos.otherInfo}}</label>
              </el-form-item>
              <el-form-item label="预售要求：" prop="presaleRe" style="width:96%;">
                <label class="val_text">{{landInfos.presaleRe}}</label>
              </el-form-item>
              <el-form-item label="装修要求：" prop="decorationRe" style="width:96%;">
                <label class="val_text">{{landInfos.decorationRe}}</label>
              </el-form-item>
              <el-form-item label="新房限价：" prop="fixedPrice" style="width:96%;">
                <label class="val_text">{{landInfos.fixedPrice}}</label>
              </el-form-item>
              <el-form-item label="公告时间：" prop="annoTime">
                <label class="val_text">{{landInfos.annoTime}}</label>
              </el-form-item>
              <el-form-item label="竞买保证金：" prop="bond">
                <label class="val_text">{{landInfos.bond}}<span class="unit">万元</span></label>
              </el-form-item>
              <el-form-item label="是否有底价：" prop="haveFloorprice">
                <label class="val_text">{{landInfos.haveFloorprice}}</label>
              </el-form-item>
              <el-form-item label="起始总价：" prop="startTotalPrice">
                <label class="val_text"><span class="num_val">{{landInfos.startTotalPrice}}</span><span class="unit">万元</span></label>
              </el-form-item>
              <el-form-item label="起始楼面地价：" prop="startFloorPrice">
                <label class="val_text"><span class="num_val">{{landInfos.startFloorPrice}}</span><span class="unit">元/㎡</span></label>
              </el-form-item>
              <el-form-item label="起始单价：" prop="startPrice">
                <label class="val_text"><span class="num_val">{{landInfos.startPrice}}</span><span class="unit">万元/亩</span></label>
              </el-form-item>
              <el-form-item label="备注：" prop="sellRemark" style="width:96%">
                <label class="val_text">{{landInfos.sellRemark}}</label>
              </el-form-item>
            </div>
            <el-divider content-position="left">土地交易信息</el-divider>
            <div class="info_item">
              <!-- <el-form-item label="交易状态" prop="tradingStatus">
                <el-tag type="" effect="plain">{{convertTradingStatus(landInfos.tradingStatus)}}</el-tag>
              </el-form-item> -->
              <el-form-item label="交易时间：" prop="date">
                <label class="val_text">{{landInfos.date}}</label>
              </el-form-item>
               <el-form-item label="成交总价：" prop="totalPrice">
                <label class="val_text"><span class="num_val">{{landInfos.totalPrice}}</span><span class="unit">万元</span></label>
              </el-form-item>
              <el-form-item label="成交楼面价：" prop="price">
                <label class="val_text"><span class="num_val">{{landInfos.price}}</span><span class="unit">元/㎡</span></label>
              </el-form-item>
              <el-form-item label="成交单价：" prop="tradePrice">
                <label class="val_text"><span class="num_val">{{landInfos.tradePrice}}</span><span class="unit">万元/亩</span></label>
              </el-form-item>
              <el-form-item label="溢价率：" prop="premiumRatio">
                <label class="val_text"><span class="num_val">{{landInfos.premiumRatio!=="/"?(landInfos.premiumRatio*100).toFixed(1):'/'}}</span><span class="unit">%</span></label>
              </el-form-item>
              <el-form-item label="竞配建：" prop="comConstruction">
                <label class="val_text">{{landInfos.comConstruction}}</label>
              </el-form-item>
              <el-form-item label="竞无偿移交：" prop="comFreetransfer">
                <label class="val_text">{{landInfos.comFreetransfer}}</label>
              </el-form-item>
              <el-form-item label="竞自持：" prop="comSelfsupport">
                <label class="val_text">{{landInfos.comSelfsupport}}</label>
              </el-form-item>
              <el-form-item label="实际楼面价：" prop="actualFloorPrice">
                <label class="val_text"><span class="num_val">{{landInfos.actualFloorPrice}}</span><span class="unit">元/㎡</span></label>
              </el-form-item>
              <el-form-item label="竞得者：" prop="competeCompany">
                <label class="val_text">{{landInfos.competeCompany}}</label>
              </el-form-item>
              <el-form-item label="竞得者简称：" prop="comAbbreviation">
                <label class="val_text">{{landInfos.comAbbreviation}}</label>
              </el-form-item>
              <el-form-item label="参拍信息：" prop="auction" style="width:96%">
                <label class="val_text">{{landInfos.auction}}</label>
              </el-form-item>
              <el-form-item label="参拍企业：" prop="participationList">
                <el-popover
                  placement="top"
                  width="450"
                  trigger="click">
                  <el-table :data="landInfos.participationList" height="350">
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column property="company" label="企业"></el-table-column>
                    <el-table-column property="ticketNo" label="号牌"></el-table-column>
                    <el-table-column property="highestPrice" label="最高出价(元/㎡)"></el-table-column>
                  </el-table>
                  <el-button slot="reference" type="primary" size="small" plain>点击查看</el-button>
                </el-popover>
              </el-form-item>
              <el-form-item label="出价记录" prop="bidHistory">
                <el-popover
                  placement="top"
                  width="450"
                  trigger="click">
                  <el-table :data="landInfos.bidHistory" height="350">
                    <el-table-column property="sort" label="现场竞价情况"></el-table-column>
                    <el-table-column property="company" label="参拍企业"></el-table-column>
                    <el-table-column property="price" label="叫价(元/㎡+自持%)"></el-table-column>
                    <el-table-column property="priceInfo" label="宣告次数"></el-table-column>
                  </el-table>
                  <el-button slot="reference" type="primary" size="small" plain>点击查看</el-button>
                </el-popover>
              </el-form-item>
              <el-form-item label="备注：" prop="tradeRemark" style="width:96%">
                <label class="val_text">{{landInfos.tradeRemark}}</label>
              </el-form-item>
            </div>
            <el-divider content-position="left">开发销售信息</el-divider>
            <div class="info_item">
              <el-form-item label="开发进度：" prop="devProgress" style="width:96%;">
                <label class="val_text">{{landInfos.devProgress}}</label>
              </el-form-item>
              <el-form-item label="销售进度：" prop="saleProgress" style="width:96%;">
                <label class="val_text">{{landInfos.saleProgress}}</label>
              </el-form-item>
              <el-form-item label="预售许可证首次批准日期：" prop="preSaledate">
                <label class="val_text">{{landInfos.preSaledate}}</label>
              </el-form-item>
              <el-form-item label="操盘企业系：" prop="dbo">
                <label class="val_text">{{landInfos.dbo}}</label>
              </el-form-item>
              <el-form-item label="推广名：" prop="promotionName">
                <label class="val_text">{{landInfos.promotionName}}</label>
              </el-form-item>
              <el-form-item label="备案名：" prop="recordName">
                <label class="val_text">{{landInfos.recordName}}</label>
              </el-form-item>
              <el-form-item label="楼盘地址：" prop="saleAddress">
                <label class="val_text">{{landInfos.saleAddress}}</label>
              </el-form-item>
              <el-form-item label="装修情况：" prop="decoration" style="width:96%;">
                <label class="val_text">{{landInfos.decoration}}</label>
              </el-form-item>
              <el-form-item label="装修标准：" prop="decorationSta">
                <label class="val_text"><span class="num_val">{{landInfos.decorationSta}}</span><span class="unit">元/㎡</span></label>
              </el-form-item>
              <el-form-item label="物业费：" prop="propertyCharges">
                <label class="val_text"><span class="num_val">{{landInfos.propertyCharges}}</span><span class="unit">元/㎡</span></label>
              </el-form-item>
              <el-form-item label="物业公司：" prop="propertyCompany">
                <label class="val_text">{{landInfos.propertyCompany}}</label>
              </el-form-item>
              <el-form-item label="交付时间：" prop="deliveryTime">
                <label class="val_text">{{landInfos.deliveryTime}}</label>
              </el-form-item>
              <el-form-item label="备注：" prop="saleRemark" style="width:96%">
                <label class="val_text">{{landInfos.saleRemark}}</label>
              </el-form-item>
            </div>
            <el-divider content-position="left" v-if="landInfos.isGov==='1'||landInfos.isself">土地文件</el-divider>
            <div class="info_item" v-if="landInfos.isGov==='1'||landInfos.isself">
              <el-form-item label="图片" prop="pictures" style="width:96%">
                <div class="pic_wrap" v-if="landInfos.pictures.length>0" style="display:flex;flex-wrap:wrap">
                  <div class="img_wraps" v-for="item in landInfos.pictures" :key="item.id">
                    <el-image 
                      class="file_img"
                      :src="item.url" 
                      fit="cover"
                      :preview-src-list="landInfos.picUrlArr">
                    </el-image>
                    <i class="img_del el-icon-error" @click="landFileDel(item.id)" v-if="landInfos.isself"></i>
                  </div>
                </div>
                <el-tag v-else type="warning" effect="plain">暂无图片</el-tag>
              </el-form-item>
              <el-form-item label="文档" prop="files" style="width:96%">
                <div class="file_wrap" v-if="landInfos.files.length>0">
                  <div class="file_item" v-for="file in landInfos.files" :key="file.id">
                    <el-tag type="" effect="plain">{{file.name}}
                      <i class="file_del el-icon-error" @click="landFileDel(file.id)" v-if="landInfos.isself"></i>
                      <i class="file_down el-icon-download" @click="landFileDown(file.url)" v-if="landInfos.isself"></i>
                    </el-tag>
                  </div>
                </div>
                <el-tag v-else type="warning" effect="plain">暂无文件</el-tag>
              </el-form-item>
              <el-form-item label="压缩包" prop="zips" style="width:96%">
                <div class="zip_wrap" v-if="landInfos.zips.length>0">
                  <div class="file_item" v-for="zip in landInfos.zips" :key="zip.id">
                    <el-tag type="success" effect="plain">{{zip.name}}
                      <i class="file_del el-icon-error" @click="landFileDel(zip.id)" v-if="landInfos.isself"></i>
                      <i class="file_down el-icon-download" @click="landFileDown(zip.url)" v-if="landInfos.isself"></i>
                    </el-tag>
                  </div>
                </div>
                <el-tag v-else type="warning" effect="plain">暂无压缩包</el-tag>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <!-- 分享链接 -->
    <div class="shareurl_box" v-if="shareUrl!==null">
      <div class="box">
        <i class="el-icon-circle-close close_sharebox" @click="closeShareBox"></i>
        <el-input v-model="shareUrl">
          <template slot="prepend">分享链接</template>
          <el-button slot="append" 
            icon="el-icon-document-copy" 
            type="primary"
            v-clipboard:copy="shareUrl"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError">复制</el-button>
        </el-input>
      </div>
    </div>
  </div>
</template>
<script> 
import { Encrypt } from '@/utils/public'
import ledgerApi from "@/api/ledgerApi";
import friendsApi from "@/api/friendsApi"
import commonApi from "@/api/commonApi";
import { mapGetters } from 'vuex'
export default {
  name:'landinfo',
  props:{
    
  },
  data(){
    return {
      landinfoShow:false,//显示土地信息框体
      landType:'',//土地状态
      landAddress:'',//土地位置
      landInfos:{
        id:'',//土地ID
        center:null,//宗地坐标---新增

        //土地基础信息
        isOpen:'1',//是否公开*
        isGov:null,//是否公开土地
        isself:null,//是否为自己的土地
        chargeFlylink:'',//收费航拍链接---新增
        landAerial:'',//免费航拍链接---新增
        noticeWebsite:'',//公告网址---新增
        state:'traded',//土地状态*
        annoId:'',//公告号
        landNumber:'', //宗地编号*
        parcelLocation:'', //宗地名称*
        address:null,//宗地位置*
        landCityno:'',//城市*---新增
        landCity:'',
        regionno:'',//区(市)县*
        region:'',
        torus:'',//环域
        partname:'',//板块
        landArea1:'',//出让面积（㎡）*（数字）
        landArea:'',//出让面积（亩）*（数字）
        purpose:'',//用地性质*
        landNature:'',//规划用途
        userYears:'',//使用年限*
        ratio:'',//容积率(字符串)*
        volumeRatio:'',//计算容积率（数字）*
        buildArea:'',//计算建筑面积（㎡）（数字）*
        rcScale:'',//商占比*
        businessArea:'',//商业建筑面积（㎡）*（数字）---新增
        buildingDensity:'',//建筑密度
        greenRate:'',//绿地率
        buildingHeight:'',//建筑高度
        labels:[],//土地标签
        remarks:'',//基础信息备注

        //土地出让信息
        sellType:'',//出让方式*
        auctionRules:'',//拍卖规则
        industryConditions:'',//产业条件
        otherInfo:'',//配建/自持/无偿移交要求
        presaleRe:'',//预售要求---新增
        decorationRe:'', //装修要求---新增
        fixedPrice:'', //限价情况---新增
        annoTime:'',//公告时间*
        //sellTime:'',//出让时间
        bond:'',//竞买保证金（万元）
        haveFloorprice:'',//是否有底价---新增
        startTotalPrice:'',//起始总价（万元）*（数字）
        startFloorPrice:'',//起始楼面地价(元/㎡)*（数字）
        startPrice:'',//起始单价（万元/亩）*（数字）
        sellRemark:'',//出让备注

        //土地成交信息
        date:'',//交易时间*
        totalPrice:'',//成交总价（万元）*（数字）
        price:'',//成交楼面价(元/㎡)*（数字）
        tradePrice:'',//成交单价（万元/亩）*（数字）
        premiumRatio:'',//溢价率*
        comConstruction:'',//竞配建---新增
        comFreetransfer:'',//竞无偿移交---新增
        comSelfsupport:'',//竞自持---新增
        actualFloorPrice:'',//实际楼面价
        competeCompany:'',//竞得者*
        comAbbreviation:'',//竞得者简称*---新增
        auction:'',//参拍信息
        participationList:null,//参拍企业名单
        bidHistory:null,//企业出价记录
        tradeRemark:'',//交易备注
        //tradingStatus:'traded',//交易状态

        //开发销售信息---新增
        devProgress:'',//开发进度
        saleProgress:'',//销售进度
        preSaledate:'',//预售许可证首次批准日期
        dbo:'',//操盘企业系
        promotionName:'',//推广名
        recordName:'',//备案名
        saleAddress:'',//楼盘地址
        decoration:'',//装修情况
        decorationSta:'',//装修标准（元/㎡）
        propertyCharges:'',//物业费（元/㎡/月）
        propertyCompany:'',//物业公司
        deliveryTime:'',//交付时间
        saleRemark:'',//销售备注

        //土地文件上传
        pictures:[], //图片
        files:[], //文档
        zips:[], //压缩包
      },
      landTypeArr:[ //土地类型数组
        // {label:'规划',value:'plan'},
        // {label:'集中供地',value:'supply_cls'},
        // {label:'计划',value:'supply'},
        // {label:'公告',value:'announcement'},
        // {label:'成交',value:'traded'},
        // {label:'流拍',value:'streaming'},
        // {label:'终止',value:'termination'},
        // {label:'其他',value:'other'},
      ],
      provinces:[], //省份列表
      cities:[], //城市列表
      regionArr:[], //区域数据
      landUseArr:[
        // {label:'纯住宅',remark:'#fefe89',value:'house'},
        // {label:'住兼商',remark:'#fefe89',value:'house_commerce'},
        // {label:'商兼住',remark:'#fefe89',value:'commerce_house'},
        // {label:'商业',remark:'#fd0004',value:'commerce'},
        // {label:'工业',remark:'#dca471',value:'industry'},
        // {label:'其他',remark:'#bababa',value:'other'}
      ],
      sellTypeArr:[
        // {label:'拍卖',value:'auction'},
        // {label:'挂牌',value:'listing'},
        // {label:'转让',value:'assignment'},
        // {label:'划拨',value:'transfer'},
        // {label:'协议',value:'agreement'},
        // {label:'其他',value:'other'},
      ],
      dealState:[
        // {label:'已成交',value:'traded'},
        // {label:'流拍',value:'streaming'},
        // {label:'因故终止',value:'termination'},
      ],
      landLabelArr:[ //用户土地标签
        // {label:'优先级高',id:'1'},
        // {label:'低总价',id:'2'},
        // {label:'配套不错',id:'3'},
        // {label:'交通便利',id:'4'},
        // {label:'不利因素',id:'5'},
      ],
      shareUrl:null,//分享链接
      friendList:[],//好友列表
      shareFriendId:null,//要分享的好友ID
      showShareBox:false,
    }
  },
  mounted(){
    
    //字典获取
    this.getDict()
    //获取省市区数据
    this.getProvinceData()
    //用标签
    this.userLandLabels()
    setTimeout(_=>{
      //城区板块数据
      //this.getRegionPlate()
    },2000)
  },
  watch:{
    curLandId:{
      handler(newVal){
        if(newVal!==null){
          this.landinfoShow = true
          this.getLandDetail(newVal)
          //好友列表
          this.getFirendsList()
        }else{
          this.landinfoShow = false
        }
      },
      deep:true
    }
  },
  computed:{
    ...mapGetters(['ledger_map','curLandId','cityCode'])
  },
  methods:{
    //分享土地
    shareLand(){
      let key = Encrypt(this.landInfos.id)
      this.shareUrl = 'http://www.tzymap.com/#/shareland?id='+key
    },
    //关闭分享链接界面
    closeShareBox(){
      this.shareUrl = null
    }, 
    //剪切板拷贝成功
    onCopy: function (e) {
      this.$message.success('拷贝成功')
    },
    //剪切板拷贝失败
    onError: function (e) {
      console.log('Failed to copy texts',e)
    },
    //获取好友列表
    getFirendsList(){
      friendsApi.getFirendsList().then(res=>{
        let data = res.data.data
        this.friendList = data
        console.log('好友列表',data)
      })
    },
    //获取字典
    getDict(){
      var that = this
      //土地类型
      ledgerApi.getTypeDict("land_type")
      .then(res=>{
        if(res.data.code===0){
          that.landTypeArr = res.data.data
        }
      })
      //用地性质
      ledgerApi.getTypeDict("land_use")
      .then(res=>{
        if(res.data.code===0){
          that.landUseArr = res.data.data
        }
      })
      //出让方式
      ledgerApi.getTypeDict("sell_type")
      .then(res=>{
        if(res.data.code===0){
          that.sellTypeArr = res.data.data
        }
      })
      //交易状态
      ledgerApi.getTypeDict("dealState")
      .then(res=>{
        if(res.data.code===0){
          that.dealState = res.data.data
        }
      })
    },
    //城区板块数据
    getRegionPlate(){
      var that = this
      let code_4 = this.cityCode.substring(0,4)
      let code = code_4?code_4:'5101'
      commonApi.getPlateGeoJSON(code)
      .then(res=>{
        if(res.data.code===0){
          console.log('城区数据',res)
          let data = res.data.data
          let arr = []
          data.forEach(item=>{
            if(item.type==='region'){
              arr.push(item)
            }
          })
          that.regionArr = arr
        }
      })
    },
    //用户标签
    userLandLabels(){
      ledgerApi.getUserLandLabels()
      .then(res=>{
        if(res.data.code===0){
          this.landLabelArr = res.data.data
        }
      })
    },
    //转换用户标签
    convertUserLabel(val){
      let str = ''
      this.landLabelArr.forEach(item=>{
        if(item.id===val){
          str = item.label
        }
      })
      return str
    },
    //转换土地类型文本
    convertLandTypeText(val){
      let str = ''
      this.landTypeArr.forEach(item=>{
        if(item.value==val){
          str = item.label
        }
      })
      if(val==='supply_cls'){ //集中供地转为公告
        str = '公告'
      }
      return str
    },
    //转换省份
    convertProvince(val){
      let str = ''
      this.provinces.forEach(item=>{
        item.options.forEach(op=>{
          if(op.value===val){
            str = op.label
          }
        })
        
      })
      return str
    },
    //转换城市
    convertCity(val){
      let str = ''
      this.cities.forEach(item=>{
        item.options.forEach(op=>{
          if(op.value===val){
            str = op.label
          }
        })
        
      })
      return str
    },
    //转换城区
    convertRegion(val){
      let str = ''
      this.regionArr.forEach(item=>{
        item.options.forEach(op=>{
          if(op.value===val){
            str = op.label
          }
        })
        
      })
      return str
    },
    //转换用地性质
    convertPurpose(val){
      let str = ''
      this.landUseArr.forEach(item=>{
        if(item.value===val){
          str = item.label
        }
      })
      return str
    },
    //转换交易状态
    convertSellType(val){
      let str = ''
      this.sellTypeArr.forEach(item=>{
        if(item.value===val){
          str = item.label
        }
      })
      return str
    },
    //转换交易状态
    convertTradingStatus(val){
      let str = ''
      this.dealState.forEach(item=>{
        if(item.value===val){
          str = item.label
        }
      })
      return str
    },
    //获取土地详情
    getLandDetail(landId){
      var that = this
      ledgerApi.getMyLedgerDetail(landId)
      .then(res=>{
        console.log('土地详情',res)
        if(res.data.code===0){
          let data = res.data.data
          let obj = {}
          for(let key in that.landInfos){
            if(key === 'pictures'){
              let arr = []
              data.pictures.forEach(pic=>{
                arr.push(pic.url)
              })
              obj.picUrlArr = arr
            }
            if(key==='regionno'){ //配置城市数据、城区数据，当前省份
              console.log(data.landCityno,data.regionno)
              if(data.regionno!==null&&data.regionno!==''){
                obj.landProvinceno = data.regionno.substring(0,2)+'0000'
                that.getCityData(obj.landProvinceno)
                let cityno = data.regionno.substring(0,4)+'00'
                if(data.landCityno==null||data.landCityno==''){ //未存储城市
                  obj.landCityno = cityno
                }
                that.getRegionData(cityno)
              }
            }
            obj[key] = data[key]==='null'||data[key]===null||data[key]===''?'/':data[key]
          }
          that.landInfos = obj
          console.log(that.landInfos)
        }
      })
      ledgerApi.statisLandInfo(landId)
      .then(res=>{
        if(res.data.code===0){
          console.log('土地详情查看+1')
        }
      })
    },
    //关闭土地详情
    closeLandInfo(){
      this.landinfoShow = false
      this.$store.dispatch('setCurLandId',null)
    },
    //删除土地文件
    landFileDel(id){
      var that = this
      that.$confirm('确定删除该文件？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }) .then(() => {
        ledgerApi.delLandFiles([id])
        .then(res=>{
          if(res.data.code===0){
            that.$message.success('文件已删除')
            that.getLandDetail(that.curLandId)
          }else{
            that.$message.warning(res.data.msg)
          }
        })
      }).catch(() => {})
      
    },
    //下载土地文件
    landFileDown(url){
      var that = this
      that.$confirm('确定下载该文件？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }) .then(() => {
        window.open(url)
       that.$message.success('文件已下载')
      }).catch(() => {})
    },
    //获取省市区数据
    getProvinceData(){
      var that = this
      commonApi.getPCR()
      .then(res=>{
        if(res.data.code===0){
          console.log('省份数据',res)
          that.provinces = res.data.data
        }
      })
    },
    //获取城市数据
    getCityData(val){
      var that = this
      that.filterCity = ''
      that.regionCheck = []
      commonApi.getPCR({value:val})
      .then(res=>{
        if(res.data.code===0){
          console.log('城市数据',res)
          that.cities = res.data.data
        }
      })
    },
    //获取区县数据
    getRegionData(val){
      var that = this
      that.regionCheck = []
      commonApi.getPCR({value:val})
      .then(res=>{
        if(res.data.code===0){
          console.log('城区数据',res)
          that.regionArr = res.data.data
        }
      })
    },
  }
}
</script>
<style lang="scss">
.landinfo_wrap{
  .shareurl_box{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
    .box{
      width: 30%;
      position: relative;
      .close_sharebox{
        font-size: 18px;
        position: absolute;
        right: -25px;
        top: -25px;
        cursor: pointer;
        color: #fef0f0;
      }
    }
  }
  .upload_info{
    position: fixed;
    width: 40%;
    right: 1%;
    top: 1%;
    bottom: 1%;
    z-index: 9999;
    background: rgba(4, 4, 4, 0.5);
    border-radius: 4px;
    padding: 10px;
    transition: all 0.5s ease-in-out;
    padding: 10px;
    .detailInfo{
      background: #fff;
      border-radius: 4px;
      padding: 1%;
      height: 97%;
      .info_head{
        height: 6%;
        border-bottom: #e4e7ed 1px solid;
        display:flex;
        justify-content: space-between;
        align-items: center;
        .info_title{
          font-size: 18px;
          color: #333;
          font-weight: bold;
          margin-left: 20px;
          width: calc(100% - 190px);
          display: flex;
          align-items: center;
          .land_name{
            max-width: calc(100% - 55px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .btns_box{
          width: 180px;
          display: flex;
          justify-content: flex-end;
        }
      }
      .parInfoForm{
        height: 94%;
        width: 100%;
        overflow: scroll;
        .land_labels{
          display: flex;
          flex-wrap: wrap;
          .label_tag{
            margin-right: 10px;
          }
        }
        .pic_wrap{
          .img_wraps{
            position: relative;
            margin-right:10px;
            margin-bottom:10px;
            &:hover .img_del{
              display: block;
            }
            .file_img{
              width: 200px; 
              height: 200px;
            }
            .img_del{
              position: absolute;
              top: 10px;
              right: 10px;
              z-index: 9;
              color: #F56C6C;
              cursor: pointer;
              display: none;
              font-size: 16px;
            }
          }
        }
        .file_wrap,.zip_wrap{
          display: flex;
          flex-wrap: wrap;
          .file_item{
            margin-right: 10px;
            margin-bottom: 10px;
          }
          .file_del{
            color: #F56C6C;
            margin-left: 10px;
            cursor: pointer;
            font-size: 16px;
          }
          .file_down{
            margin-left: 10px;
            cursor: pointer;
            font-weight: bold;
            font-size: 16px;
          }
        }
        .info_item{
          display: flex;
          flex-wrap: wrap;
          position: relative;
          .unit{
            margin-left: 10px;
          }
          .el-form-item{
            width: 49%;
          }
          .el-form-item__label{
            margin-left: 40px;
            color: #333;
            font-weight: bold;
          }
          .val_text{
            color: #484545;
            font-size: 14px;
            .num_val{
              color: #ff9900;
              font-weight: bold;
            }
          }
        }
      }
    }
    .el-form-item__error{
      top: 87%;
    }
    .el-form-item{
      margin: 0;
    }
    .resite{
      font-size: 18px;
      color: #99a9bf;
      cursor: pointer;
      margin-left: 10px;
    }
  }
}
@media screen and (max-width:1620px){
  .landinfo_wrap{
    .el-form-item{
      width: 100% !important;
    }
  }
}
</style>