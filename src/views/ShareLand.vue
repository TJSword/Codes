<template>
  <div class="shareland_wrap">
    <div class="map_box">
      <!-- 地图容器 -->
      <div class="mapBox"></div>
      <div id="base_map1" class="basemap_container"></div>
      <div id="map1" class="map_container"></div>
      <!-- 地图工具1 -->
      <div class="map_tool">
        <div class="tool_item" @click="satelliteLayer()">
          <el-tooltip class="item" effect="light" :content="satellite?'基础底层':'卫星底图'" placement="bottom-end">
            <i :class="['iconfont',satellite?'icon-weixing':'icon-morenditu']" style="line-height:27px;"></i>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="land_info" ref="uploadBox" :style="{left:infoLoad?'1%':'-100%'}">
      <div class="detailInfo">
        <div class="info_head">
          <div class="btns_box">
            <el-button size="small" type="primary" @click="toRegister()">去注册</el-button>
            <el-button size="small" @click="infoLoad = false">关闭</el-button>
          </div>
        </div>
        <div class="parInfoForm">
          <!-- 土地信息 -->
          <el-form ref="landInfos" :model="landInfos"  label-position="left">
            <div class="info_item" style="margin-top:20px;">
              <el-form-item label="宗地名称：" prop="parcelLocation">
                <el-tag type="" effect="plain">{{landInfos.parcelLocation}}</el-tag>
              </el-form-item>
              <!-- <el-form-item label="土地标签：" prop="labels" style="width:96%;display:flex;align-items:center;">
                <div class="land_labels">
                  <el-tag class="label_tag" v-for="item in landInfos.labels" :key="item" type="" effect="plain">{{convertUserLabel(item)}}</el-tag>
                </div>
              </el-form-item> -->
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
              <el-form-item label="宗地编号：" prop="landNumber" style="width:100%;">
                <el-tag type="" effect="plain">{{landInfos.landNumber}}</el-tag>
              </el-form-item>
              <el-form-item label="宗地位置：" prop="address">
                <div class="val_text">{{landInfos.address}}</div>
              </el-form-item>
              <!-- <el-form-item label="公告时间" prop="annoTime">
                <label class="val_text">{{landInfos.annoTime}}</label>
              </el-form-item> -->
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
                <el-tag type="" effect="plain">{{landInfos.purpose}}</el-tag>
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
                <el-tag type="" effect="plain">{{landInfos.sellType}}</el-tag>
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
              <el-form-item label="限价情况：" prop="fixedPrice" style="width:96%;">
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
              <el-form-item label="物业费：" prop="property_charges">
                <label class="val_text"><span class="num_val">{{landInfos.property_charges}}</span><span class="unit">元/㎡</span></label>
              </el-form-item>
              <el-form-item label="物业公司：" prop="property_company">
                <label class="val_text">{{landInfos.property_company}}</label>
              </el-form-item>
              <el-form-item label="交付时间：" prop="deliveryTime">
                <label class="val_text">{{landInfos.deliveryTime}}</label>
              </el-form-item>
              <el-form-item label="备注：" prop="tradeRemark" style="width:96%">
                <label class="val_text">{{landInfos.tradeRemark}}</label>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      
    </div>
  </div>
</template>
<script>
import { Decrypt } from "@/utils/public";
import { mapGetters } from "vuex";
import Compare from "mapbox-gl-compare";
import axios from "axios";
export default {
  name: "shareland",
  components: {},
  data() {
    return {
      satellite: true, //卫星图
      base_map: null,
      local_map: null,
      screenWidth: "", //屏幕宽度
      curBasicmap: "mapbox://styles/noconriander/ck3e3v9w74je21dod3xdvro6u", //当前底图
      landInfos:{}, //土地信息
      infoLoad:false,//信息加载
    };
  },
  mounted() {
    this.mapSet();

    var that = this;
    window.addEventListener("resize", function () {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        that.screenWidth = window.screenWidth;
      })();
    });
  },
  computed: {
    ...mapGetters(["ledger_map"]),
  },
  watch: {
    screenWidth: {
      handler(newValue) {
        console.log(newValue);
        if (this.base_map !== null) {
          this.base_map.resize();
          this.local_map.resize();
        }
      },
      immediate: true,
    },
  },
  methods: {
    //获取土地信息
    shareLnadInfo(id) {
      var that = this
      let url = process.env.BASE_URL + "/lms/work/share/info/" + id;
      axios.get(url).then((res) => {
        console.log(res);
        if(res.data.code===0){
          let data = res.data.data
          that.landInfos = data
          that.infoLoad = true
          that.loadLandLayer(data)
        }else{
          that.$message('该链接未发现土地信息')
        }
    });
    },
    //跳转到注册页
    toRegister(){
      this.$router.push({path:'/login',query:{share:true}})
    },
    //基础底图跟卫星地图切换
    satelliteLayer() {
      var map = this.base_map;
      this.satellite = !this.satellite;
      if (this.satellite) {
        //卫星图
        map.setStyle("mapbox://styles/noconriander/ck3e3v9w74je21dod3xdvro6u");
      } else {
        map.setStyle("mapbox://styles/noconriander/ckjxqgg190k8q17qib182syt7");
      }
    },
    //地图加载
    mapSet() {
      var that = this;
      that.mbgl.accessToken =
        "pk.eyJ1Ijoibm9jb25yaWFuZGVyIiwiYSI6ImNrMjQ1dGNrNDIwdWMzZXVnN3VwbnV4NW4ifQ.D7k8xizdEAG4ucy3vAhNFg";
      if (!that.mbgl.supported()) {
        alert("该浏览器不支持Mapbox GL,请更换浏览器");
      } else {
        that.mbgl.Compare = Compare;
        var baseMap = new that.mbgl.Map({
          container: "base_map1",
          style: this.curBasicmap,
          center: [104.06311530873398, 30.669457432881174],
          zoom: 11,
          localIdeographFontFamily: "MSYH",
        });
        var map = new that.mbgl.Map({
          container: "map1",
          style: "mapbox://styles/noconriander/ckh5y3gd405kv19pavciyo2fu", //空白图层
          center: [104.06311530873398, 30.669457432881174],
          zoom: 11,
          localIdeographFontFamily: "MSYH",
        });
        var compareMap = new that.mbgl.Compare(baseMap, map, ".mapBox", {
          // Set this to enable comparing two maps by mouse movement:
          // mousemove: true
        });
        that.local_map = map;
        that.base_map = baseMap;
        //添加天空跟地形
        that.loadMapLayers();
        //geoserver图层加载
        //that.geoserverLayerLoad();
        //添加地图图标
        map.loadImage("http://47.104.165.136:8099/test/chengdu/icons/land_point.png",function(error, landPoint) {
          if (error) throw error;
          map.addImage("landPoint", landPoint);
        });
        map.on('load',e=>{
          let key = that.$route.query.id;
          let id = Decrypt(key);
          console.log(id);
          that.shareLnadInfo(id);
        })
      }
    },
    loadMapLayers() {
      //添加天空跟地形
      let map = this.local_map;
      map.on("load", () => {
        map.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 14,
        });
        //map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

        map.addLayer({
          id: "sky",
          type: "sky",
          paint: {
            "sky-type": "gradient",
            "sky-gradient": [
              "interpolate",
              ["linear"],
              ["sky-radial-progress"],
              0.8,
              "rgba(135, 206, 235, 1.0)",
              1,
              "rgba(0,0,0,0.1)",
            ],
            "sky-gradient-center": [0, 0],
            "sky-gradient-radius": 90,
            "sky-opacity": [
              "interpolate",
              ["exponential", 0.1],
              ["zoom"],
              5,
              0,
              22,
              1,
            ],
          },
        });
      });
    },
    loadLandLayer(data) {
        var that = this
        let map = this.local_map;
        if (map.getSource("landSource") == undefined) {
          //土地轮廓
          map.addSource("landSource", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [],
            },
          });
          map.addLayer({
            id: "land_fill",
            type: "fill",
            source: "landSource",
            layout: {
              visibility: "visible",
            },
            paint: {
              "fill-color": [
                'match',
                ['get','purpose'],
                '纯住宅','#fefe89',
                '住兼商','#ff6a00',
                '商兼住','#ff6a00',
                '商业','#ff0000',
                '工业','#8b6f59',
                '其他','#ecf5ff',
                '#ecf5ff'
              ],
              "fill-opacity": 0.8,
            },
          });
          map.addLayer({
            id: "land_line",
            type: "line",
            source: "landSource",
            layout: {
              visibility: "visible",
            },
            paint: {
              "line-color": "#83ff46",
              "line-opacity": 0.8,
              "line-width": 1,
            },
          });
          //土地点
          map.addSource("landpoint_source", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [],
            },
          });
          map.addLayer({
            id: "landpoint_label",
            type: "symbol",
            source: "landpoint_source",
            layout: {
              "text-field": [
                "coalesce",['get','nickName'],['get','buildingName'],['get','landNumber'],['get','parcelLocation'] //返回第一个非空值
              ],
              "text-font": ["DIN Offc Pro Bold"],
              "text-allow-overlap": true,
              "text-offset": [0, -1],
              "text-anchor": "bottom",
              "text-size":[
                "interpolate",
                ["linear"],
                ["zoom"],
                0, 0,
                11,4,
                16, 16
              ],
              "text-letter-spacing": 0.1,
              "text-max-width":10,
              "text-padding":5,
              
              "icon-image": "landPoint",
              "icon-allow-overlap":true,
              "icon-ignore-placement":true,
              "icon-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                0, 0,
                11,0.5,
                16, 0.6
              ],
              "visibility":"visible"
            },
            paint: {
              "text-color": "#202",
              "text-halo-color": "rgba(255,255,255,1)",
              "text-halo-width": 2
            },
          });
          var ledgerPopup = new that.mbgl.Popup({
          closeButton: true,
          closeOnClick: false,
          anchor: "left",
          offset: 20,
          });
          map.on("click", "landpoint_label", (e) => {
            that.infoLoad = true
            let coordinates = [e.lngLat.lng, e.lngLat.lat];
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            var id = e.features[0].properties.id;

            var landNumber = e.features[0].properties.landNumber;
            var landArea = e.features[0].properties.landArea;
            var volumeRatio = e.features[0].properties.volumeRatio;
            var buildArea = e.features[0].properties.buildArea;
            var state = e.features[0].properties.state;
            var date = e.features[0].properties.date;
            if(date!=='null'){
              let date1 = date.split(' ')
              date = date1[0]
            }
            var startFloorPrice = e.features[0].properties.startFloorPrice;
            var price = e.features[0].properties.price;
            var premiumRatio = e.features[0].properties.premiumRatio;
            var comFreetransfer = e.features[0].properties.comFreetransfer;
            var competeCompany = e.features[0].properties.competeCompany;
            var region = e.features[0].properties.region;

            var info = `<div class="infos_wrap">
            <div class="item_name" style="width:100%;">宗地编号：<span class="item_val">${landNumber!=='null'&&landNumber!==''? landNumber : "-"}</span></div>
            <div class="item_name">所属区域：<span class="item_val">${region!=='null'&&region!==''? region : "-"}</span></div>
            <div class="item_name">占地面积：<span class="item_val">${landArea!=='null'&&landArea!==''? landArea.toFixed(2) : "-"} 亩</span></div>
            <div class="item_name">容积率：<span class="item_val">${volumeRatio!=='null'&&volumeRatio!==''? JSON.parse(volumeRatio).toFixed(2) : "-"}</span></div>
            <div class="item_name">建筑面积：<span class="item_val">${buildArea!=='null'&&buildArea!==''? parseInt(buildArea) : "-"} ㎡</span></div>
            <div class="item_name">交易状态：<span class="item_val">${state!=='null'&&state!==''? state : "-"}</span></div>
            <div class="item_name">交易日期：<span class="item_val">${date!=='null'&&date!==''? date : "-"}</span></div>
            <div class="item_name">起始楼面价：<span class="item_val">${startFloorPrice!=='null'&&startFloorPrice!==''? parseInt(startFloorPrice) : "-"} 元/㎡</span></div>
            <div class="item_name">成交楼面价：<span class="item_val">${price!=='null'&&price!==''? parseInt(price) : "-"} 元/㎡</span></div>
            <div class="item_name">溢价率：<span class="item_val">${premiumRatio!=='null'&&premiumRatio!==''? premiumRatio : "-"}</span></div>
            <div class="item_name">移交比例：<span class="item_val">${comFreetransfer!=='null'&&comFreetransfer!==''? comFreetransfer : "-"}</span></div>
            <div class="item_name" style="width:100%;">竞得者：<span class="item_val">${competeCompany!=='null'&&competeCompany!==''? competeCompany : "-"}</span></div>
            </div>`;

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            ledgerPopup.setLngLat(coordinates).setHTML(info).addTo(map);
            that.$(".land_info_btn").click(() => {
              that.infoLoad = true
            });
          });
          map.on("touchend", "landpoint_label", (e) => {
            that.infoLoad = true
            let coordinates = [e.lngLat.lng, e.lngLat.lat];
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            var id = e.features[0].properties.id;

            var landNumber = e.features[0].properties.landNumber;
            var landArea = e.features[0].properties.landArea;
            var volumeRatio = e.features[0].properties.volumeRatio;
            var buildArea = e.features[0].properties.buildArea;
            var state = e.features[0].properties.state;
            var date = e.features[0].properties.date;
            if(date!=='null'){
              let date1 = date.split(' ')
              date = date1[0]
            }
            var startFloorPrice = e.features[0].properties.startFloorPrice;
            var price = e.features[0].properties.price;
            var premiumRatio = e.features[0].properties.premiumRatio;
            var comFreetransfer = e.features[0].properties.comFreetransfer;
            var competeCompany = e.features[0].properties.competeCompany;
            var region = e.features[0].properties.region;

            var info = `<div class="infos_wrap">
            <div class="item_name" style="width:100%;">宗地编号：<span class="item_val">${landNumber!=='null'&&landNumber!==''? landNumber : "-"}</span></div>
            <div class="item_name">所属区域：<span class="item_val">${region!=='null'&&region!==''? region : "-"}</span></div>
            <div class="item_name">占地面积：<span class="item_val">${landArea!=='null'&&landArea!==''? landArea.toFixed(2) : "-"} 亩</span></div>
            <div class="item_name">容积率：<span class="item_val">${volumeRatio!=='null'&&volumeRatio!==''? JSON.parse(volumeRatio).toFixed(2) : "-"}</span></div>
            <div class="item_name">建筑面积：<span class="item_val">${buildArea!=='null'&&buildArea!==''? parseInt(buildArea) : "-"} ㎡</span></div>
            <div class="item_name">交易状态：<span class="item_val">${state!=='null'&&state!==''? state : "-"}</span></div>
            <div class="item_name">交易日期：<span class="item_val">${date!=='null'&&date!==''? date : "-"}</span></div>
            <div class="item_name">起始楼面价：<span class="item_val">${startFloorPrice!=='null'&&startFloorPrice!==''? parseInt(startFloorPrice) : "-"} 元/㎡</span></div>
            <div class="item_name">成交楼面价：<span class="item_val">${price!=='null'&&price!==''? parseInt(price) : "-"} 元/㎡</span></div>
            <div class="item_name">溢价率：<span class="item_val">${premiumRatio!=='null'&&premiumRatio!==''? premiumRatio : "-"}</span></div>
            <div class="item_name">移交比例：<span class="item_val">${comFreetransfer!=='null'&&comFreetransfer!==''? comFreetransfer : "-"}</span></div>
            <div class="item_name" style="width:100%;">竞得者：<span class="item_val">${competeCompany!=='null'&&competeCompany!==''? competeCompany : "-"}</span></div>
            </div>`;

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            ledgerPopup.setLngLat(coordinates).setHTML(info).addTo(map);
            that.$(".land_info_btn").click(() => {
              that.infoLoad = true
            });
          });
        }
        let outCenter
        if(data.center){
          outCenter = data.center.split(',')
          let geojson_landpoint = {
            type: "FeatureCollection",
            features: [{
              geometry:{
                coordinates:outCenter,
                type:'Point'
              },
              properties:{ 
                id: data.id, //土地ID
                isself: data.isself?'1':'0',//是否为自己创建的土地
                isGov: data.isGov,//是否为公共土地
                isOpen: data.isOpen, //是否公开
                purpose: data.purpose,//用地性质

                landNumber:data.landNumber,//宗地编号
                region:data.region,//所属区域
                landArea:data.landArea,//占地面积
                volumeRatio:data.volumeRatio,//容积率
                buildArea:data.buildArea,//建筑面积
                state: data.state, //交易状态
                date: data.date, //交易日期
                startFloorPrice: data.startFloorPrice, //起始楼面价
                price: data.price, //成交楼面价
                premiumRatio: data.premiumRatio, //溢价率
                comFreetransfer: data.comFreetransfer, //移交比例
                competeCompany: data.competeCompany, //竞得者
              },
              type:'Feature'
            }]
          }
          
          map.getSource("landpoint_source").setData(geojson_landpoint);
        }
        
        if(data.coordinates){
          let coord1 = data.coordinates.split(';')
          let coord2 = []
          coord1.forEach(str=>{
            let coord = str.split(',')
            coord2.push(coord)
          })
          coord2.pop()
          var geojson_land = {
            type: "FeatureCollection",
            features: [
              {
                geometry:{
                    coordinates:[coord2],
                    type:'Polygon'
                },
                properties:{ 
                  id: data.id, //土地ID
                  isself: data.isself?'1':'0',//是否为自己创建的土地
                  isGov: data.isGov,//是否为公共土地
                  isOpen: data.isOpen, //是否公开
                  purpose: data.purpose,//用地性质

                  landNumber:data.landNumber,//宗地编号
                  region:data.region,//所属区域
                  landArea:data.landArea,//占地面积
                  volumeRatio:data.volumeRatio,//容积率
                  buildArea:data.buildArea,//建筑面积
                  state: data.state, //交易状态
                  date: data.date, //交易日期
                  startFloorPrice: data.startFloorPrice, //起始楼面价
                  price: data.price, //成交楼面价
                  premiumRatio: data.premiumRatio, //溢价率
                  comFreetransfer: data.comFreetransfer, //移交比例
                  competeCompany: data.competeCompany, //竞得者
                },
                type:'Feature'
              }
            ],
          };
          map.getSource("landSource").setData(geojson_land);
        }
        map.flyTo({
          center:data.center?outCenter:[104.06311530873398, 30.669457432881174],
          zoom: 14,
          speed: 0.8,
          curve: 2
        })
    },
  },
};
</script>
<style lang="scss">
.shareland_wrap{
    .map_box {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    .basemap_container {
        width: 100%;
        height: 100%;
    }
    .map_container {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        clip: unset !important;
    }
    .map_tool {
        position: absolute;
        right: 10px;
        top: 10px;
        z-index: 99;
        display: flex;
    }
    .tool_item {
        width: 29px;
        height: 29px;
        box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        background: #fff;
        color: #333;
        cursor: pointer;
        text-align: center;
        line-height: 18px;
        margin-left: 5px;
        .icon {
        font-size: 20px;
        }
    }
    .infos_wrap{
        width: 280px;
        .item_head{
          width: 100%;
        }
        .item_name{
        width: 46%;
        margin-top: 5px;
        }
        .land_opt{
        width: 100%;
        margin-top: 5px;
        display: flex;
        justify-content: flex-end;
        }
        .land_score_btn,.land_info_btn{
        width: 100px;
        height: 35px;
        line-height: 35px;
        text-align: center;
        border-radius: 4px;
        cursor: pointer;
        background: rgb(216, 131, 75);
        color: #fff;
        font-size: 14px;
        user-select: none;
        &:hover{
            background:  rgb(161, 98, 53);
        }
        }
        .land_info_btn{
        background: rgb(58, 129, 223);
        margin-right: 10px;
        &:hover{
            background:rgb(40, 92, 160);
        }
        }
    }
    }
    .land_info{
        position: fixed;
        width: 42%;
        left: 1%;
        top: 1%;
        bottom: 1%;
        z-index: 999;
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
            justify-content: flex-end;
            align-items: center;
            .info_title{
            font-size: 18px;
            color: #333;
            font-weight: bold;
            margin-left: 20px;
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
        margin: 4px 0;
        }
        .resite{
        font-size: 18px;
        color: #99a9bf;
        cursor: pointer;
        margin-left: 10px;
        }
    }
  @media screen and (max-width:900px) {
    .land_info{
      width: 93%;
    }
    .el-form-item{
      width: 100% !important;
    }
  }
}
.mapboxgl-ctrl-attrib-button {
  display: none;
}
</style>