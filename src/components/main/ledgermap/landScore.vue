<template>
  <div class="landscore_wrap">
    <!-- 等时圈配置 -->
    <div class="enclosureSetting" :style="{'bottom':enclosureInfoShow?'40px':'-100px'}">
      <label class="type_label" style="margin-right:20px;color:#409EFF;">等时圈配置</label>
        <label class="type_label">出行方式：</label>
        <el-select v-model="cxfs" size="mini">
          <el-option
            v-for="(item, index) in cxfsArr"
            :key="index"
            :disabled="item.disabled"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <label class="type_label">出行时间：</label>
        <el-input v-model="cxsj" placeholder="分钟<60"></el-input>
        <el-button size="small" @click="travelCondition" round type="primary" style="margin-left:10px;">确认</el-button>
    </div>
    <div class="ledgerinfo_box" :style="{'right':enclosureInfoShow?'0':'-300px'}">
      <i class="btn el-icon-close" @click="closeInfo()"></i>
      <i class="btn1 el-icon-loading" v-if="loading"></i>
      <!-- 土地评分 -->
      <div class="land_score">
        <div class="title">土地评分</div>
        <div class="score_box">
          <div class="score_head">
            <div class="head_item" v-for="(item,i) in scoreArr" :key="i">
                <div class="main_title">
                  <span class="main_label" @click="showLandScore(item.itemCode)">{{item.name}}</span>
                </div>
                <div class="sec_wrap" v-show="showScore == item.itemCode">
                  <div class="sec_title" v-for="(second,j) in item.children" :key="j">
                    <div class="left">
                      <!-- <el-checkbox :disabled="!layerReady" v-model="second.checked" @change="checked=>layerControl(checked,second.layerName)"></el-checkbox> -->
                      <label class="second_label">{{second.name}}</label>
                    </div>
                    <div class="right">
                      <el-input size="mini" v-if="second.weight" v-model="second.weight" type="number" :min="0" :max="1" :step="0.01" :disabled="item.children.length==1" @input="val=>weightChange(val,i,j)"></el-input>
                    </div>
                  </div>
                  <div class="tip" v-show="item.tip!=null">Tips:{{item.tip}}</div>
                </div>
            </div>  
          </div> 
          <div class="score_wrap">
            <div class="score_item" v-for="(item, i) in scoreArr" :key="i">
                <div class="main_score">{{ item.score }}</div>
                <div class="ex_score" :style="{ height: showScore == item.itemCode ? 'auto' : '0'}">
                  <div class="ex_score_item" v-for="(ex, j) in item.children" :key="j">{{ ex.score }}</div>
                </div>
            </div>
          </div>
        </div> 
      </div>
      <!-- 市场土地人口统计数据 -->
      <div class="land_market">
        <div class="title">数据统计</div>
        <div class="yearsRnage">
          <span>{{minYear}} 年</span> - <span>{{maxYear}} 年</span>
          <i class="btn2 el-icon-date" @click="setDateBox()"></i>
          <div class="date_box" v-if="showDateBox">
            <div class="date_item" v-for="(item,i) in dateArr" :key="i" @click="selectRange(item.label,i)" :style="{'background':item.select?'rgba(64, 158, 255, 0.5)':'none'}">{{item.label}}</div>
          </div>
        </div>
        
        <div class="data_item1">
          <div class="data1">
            <div class="name">土地</div>
            <div class="sum">
              <div class="sum1">{{isochronData.landNumSum}} 宗</div>
              <div class="sum2">{{isochronData.landAreaSum}} ㎡</div>
            </div>
          </div>
          <div class="data2">
            <div class="name1">
              <el-checkbox :disabled="!layerReady" v-model="landDeal" @change="checked=>layerControl(checked,'deal')"></el-checkbox>
              <label>已供应</label>
            </div>
            <div class="sum">
              <span class="sum1">{{isochronData.landNumParcel}} 宗</span>
              <span class="sum2">{{isochronData.landAreaParcel}} ㎡</span>
            </div>
          </div>
          <div class="data2">
            <div class="name1">
              <el-checkbox :disabled="!layerReady" v-model="landUndeal" @change="checked=>layerControl(checked,'undeal')"></el-checkbox>
              <label>未供应</label>
            </div>
            <div class="sum">
              <span class="sum1">{{isochronData.landNumRegulatory}} 宗</span>
              <span class="sum2">{{isochronData.landAreaRegulatory}} ㎡</span>
            </div>
          </div>
        </div>
        <div class="data_item1">
          <div class="data1">
            <div class="name">
              <el-checkbox :disabled="!layerReady" v-model="market" @change="checked=>layerControl(checked,'project')"></el-checkbox>
              <label>市场</label>
            </div>
            <div class="sum">
              <div class="sum1">{{isochronData.marketNumSum}} 套</div>
              <div class="sum2">{{isochronData.marketAreaSum}} ㎡</div>
            </div>
          </div>
          <div class="data2">
            <div class="name1">商业</div>
            <div class="sum">
              <span class="sum1">{{isochronData.marketNumBusiness}} 套</span>
              <span class="sum2">{{isochronData.marketAreaBusiness}} ㎡</span>
            </div>
          </div>
          <div class="data2">
            <div class="name1">住宅</div>
            <div class="sum">
              <span class="sum1">{{isochronData.marketNumHouse}} 套</span>
              <span class="sum2">{{isochronData.marketAreaHouse}} ㎡</span>
            </div>
          </div>
        </div>
        <div class="data1">
          <div class="name">人口</div>
          <div class="info">{{isochronData.population}}</div>
        </div>
        <div class="data1">
          <div class="name">GDP</div>
          <div class="info">{{isochronData.gdp}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
//Api
import ledgerApi from "@/api/ledgerApi";

//store
import { mapGetters } from "vuex"
//插件
export default {
  name:'landscore',
  components:{
    
  },
  data(){
    return{
      accessToken:
        "pk.eyJ1Ijoibm9jb25yaWFuZGVyIiwiYSI6ImNrMjQ1dGNrNDIwdWMzZXVnN3VwbnV4NW4ifQ.D7k8xizdEAG4ucy3vAhNFg",
      dateArr:[],//日期数组
      minYear:null,
      maxYear:null,
      showDateBox:false,//时间选择器显示
      cxfsArr:[ //出行方式数组
        { label: "驾车", value: "driving", disabled: false },
        { label: "步行", value: "walking", disabled: false },
        { label: "骑行", value: "cycling", disabled: false },
        { label: "公共交通", value: "publicing", disabled: true },
      ],
      cxfs:'driving',//出行方式
      cxsj:'15',//出行时间
      isochronStr:'',//等时圈坐标串
      isochronData:{ //等时圈内土地市场数据
        landNumSum:'',
        landAreaSum:'',
        landNumParcel:'',
        landAreaParcel:'',
        landNumRegulatory:'',
        landAreaRegulatory:'',
        marketNumSum:'',
        marketAreaSum:'',
        marketNumBusiness:'',
        marketAreaBusiness:'',
        marketNumHouse:'',
        marketAreaHouse:'',
        population:'暂无数据',
        gdp:'暂无数据'
      },
      enclosureInfoShow:false,//围栏数据显示
      loading:false,//请求等待
      poiLayers:[ //poi图层
        { name:"已供应",val:'deal', resource:'td_parcel' ,color: '#00f3ff',icon:'icon_td',
          filter:['all',['has','id']]
        },
        { name:"未供应",val:'undeal', resource:'td_regulatory' ,color: '#00f3ff',icon:'icon_td',
          filter:['all',['has','id']]
        },
        { name:"市场",val:'project', resource:'sc_buildings' ,color: '#00f3ff',icon:'icon_sc',
          filter:['all',['has','id']]
        },
        { name:"地铁",val:'subway', resource:'subway',color: '#cd8cff',icon:'icon_dt',
        filter:['all',['has','name'],['has','id']]
        },
        { name:"购物中心",val:'mall', resource:'mall',color: '#fbb03b',icon:'icon_gwzx',
          filter:['all',['has','id']]
        },
        { name:"超市",val:'supermarket', resource:'supermarket',color: '#fbb03b',icon:'icon_cs',
          filter:['all',['has','id']]
        },
        { name:"亲子",val:'parent_child', resource:'parent_child',color: '#fbb03b',icon:'icon_qz',
          filter:['all',['has','id']]
        },
        { name:"KTV",val:'ktv', resource:'ktv',color: '#fbb03b',icon:'icon_ktv',
          filter:['all',['has','id']]
        },
        { name:"电影",val:'film', resource:'film',color: '#fbb03b',icon:'icon_dy',
          filter:['all',['has','id']]
        },
        { name:"酒店",val:'wineshop', resource:'wineshop',color: '#fbb03b',icon:'icon_jiudian',
          filter:['all',['has','id']]
        },
        { name:"专业市场",val:'professional_market', resource:'professional_market',color: '#fbb03b',icon:'icon_zysc',
          filter:['all',['has','id']]
        },
        { name:"公立小学",val:'primary_school', resource:'school_poi',color: '#f56c6c',icon:'icon_glxx',
          filter:['all',['==','hosting_nature','state_run'],['==','school_type','primary_school']] 
        },
        { name:"公立初中",val:'junior_middle_school', resource:'school_poi',color: '#f60',icon:'icon_glcz',
          filter:['all',['==','hosting_nature','state_run'],['==','school_type','junior_middle_school']] 
        },
        { name:"三甲医院",val:'medical', resource:'resource' ,color: '#00f3ff',icon:'icon_sjyy',
          filter:['all',['has','name'],['==','attribute_code','KAB']]
        },
        { name:"图书馆",val:'library', resource:'resource' ,color: '#00f3ff',icon:'icon_tsg',
          filter:['all',['has','name'],['==','classify_code',"library"]]
        },
        { name:"运动场馆",val:'sports_venues', resource:'resource' ,color: '#00f3ff',icon:'icon_ydcg',
          filter:['all',['has','name'],['==','classify_code','sports_venues']]
        },
        { name:"公园",val:'park', resource:'resource' ,color: '#00f3ff',icon:'icon_gy',
          filter:['all',['has','id']]
        },
        { name:"旅游景点",val:'attractions', resource:'resource' ,color: '#00f3ff',icon:'icon_jd',
          filter:['all',['has','id']]
        },
        { name:"企业",val:'plan_enterprise', resource:'plan_enterprise' ,color: '#00f3ff',icon:'icon_qy',
          filter:['all',['has','id']]
        },
      ],
      scoreHead:[ //评分头部信息
        { name:'产业综合强度', tip:null, itemCode: "DDPT06",score:false,icon:"plate-chanye",children:[
          { name:'企业', weight:1, itemCode: "DDPT0601",score:false,checked:false,layerName:'plan_enterprise' }
        ]},
        { name:'市政资源强度',tip:null, itemCode: "DDPT05",score:false,icon:"plate-shizheng",children:[
          { name:'医院', weight:0.2, itemCode: "DDPT0505",score:false,checked:false,layerName:'medical' },
          { name:'图书馆', weight:0.2, itemCode: "DDPT0504",score:false,checked:false,layerName:'library' },
          { name:'大型运动场馆', weight:0.2, itemCode: "DDPT0503",score:false,checked:false,layerName:'sports_venues' },
          { name:'公园', weight:0.2, itemCode: "DDPT0502",score:false,checked:false,layerName:'park' },
          { name:'旅游景点', weight:0.2, itemCode: "DDPT0501",score:false,checked:false,layerName:'attractions' }
        ]},
        { name:'自然资源强度', tip:null,itemCode: "DDPT04",score:false,icon:"plate-ziran",children:[
          { name:'山体', weight:0.5, itemCode: "DDPT0402",score:false,checked:false,layerName:null },
          { name:'海岸线', weight:0.5, itemCode: "DDPT0401",score:false,checked:false,layerName:null }
        ]},
        { name:'教育综合强度', tip:null,itemCode: "DDPT03",score:false,icon:"plate-jiaoyu",children:[
          { name:'初中', weight:0.5, itemCode: "DDPT0302",score:false,checked:false,layerName:'junior_middle_school' },
          { name:'小学', weight:0.5, itemCode: "DDPT0301",score:false,checked:false,layerName:'primary_school' }
        ]},
        { name:'商业综合强度', tip:null,itemCode: "DDPT02",score:false,icon:"plate-shangye",children:[
          { name:'购物中心', weight:0.14, itemCode: "DDPT0207",score:false,checked:false,layerName:'mall'},
          { name:'超市', weight:0.14, itemCode: "DDPT0206",score:false,checked:false,layerName:'supermarket'},
          { name:'亲子', weight:0.14, itemCode: "DDPT0205",score:false,checked:false,layerName:'parent_child'},
          { name:'KTV', weight:0.14, weight:1, itemCode: "DDPT0204",score:false,checked:false,layerName:'ktv'},
          { name:'电影', weight:0.14, itemCode: "DDPT0203",score:false,checked:false,layerName:'film'},
          { name:'酒店', weight:0.14, itemCode: "DDPT0202",score:false,checked:false,layerName:'wineshop'},
          { name:'专业市场', weight:0.16, itemCode: "DDPT0201",score:false,checked:false,layerName:'professional_market'}
        ]},
        { name:'交通综合强度', tip:null,itemCode: "DDPT01",score:false,icon:"plate-jiaotong",children:[
          { name:'地铁', weight:0.5, itemCode: "DDPT0102",score:false,checked:false,layerName:'subway' },
          { name:'干道', weight:0.5, itemCode: "DDPT0101",score:false,checked:false,layerName:null }
        ]},
        { name:'总分', itemCode: "DDPT00",score:false,icon:"plate-zongfen"}
      ],
      scoreArr: [], //点地评分结果数组
      showScore: null, //展示的点地评分项code
      landDeal:false,
      landUndeal:false,
      market:false,
      layerReady:false,//等时圈内的poi是否查询完成
    }
  },
  mounted(){
    let date = new Date()
    let curYear = date.getFullYear()
    this.minYear = curYear
    this.maxYear = curYear
    for(let i=0;i<10;i++){
      this.dateArr.unshift({
        label:curYear-i,
        select:i==0?true:false
      })
    }
  },
  watch:{
    curLandCoords:{
      handler(val){
        console.log(val)
        if(val!==''&&val!==null){
          this.setIsochron(val)
          this.landScore()
        }
      },
      deep:true
    },
  },
  computed:{
    ...mapGetters(["ledger_map","ledgerDraw","plateData","curLandCoords"])
  },
  methods:{
    enclosureInfo(){ //围栏内的市场土地人口数据
      var that = this
      that.loading = true
      let obj = {
        coordinates:that.isochronStr,
        minyear:that.minYear,
        maxyear:that.maxYear,
      }
      ledgerApi.getEnclosureInfo(obj)
      .then(res=>{
        if(res.data.code===0){
          let data = res.data.data
          console.log('围栏内市场土地人口统计数据',data)
          this.isochronData = {
            landNumSum:JSON.parse(data.parcel[0].pcounts)+JSON.parse(data.regulatory[0].rcounts),
            landAreaSum:parseInt(data.parcel[0].parea+data.regulatory[0].rarea),
            landNumParcel:JSON.parse(data.parcel[0].pcounts),
            landAreaParcel:parseInt(data.parcel[0].parea),
            landNumRegulatory:JSON.parse(data.regulatory[0].rcounts),
            landAreaRegulatory:parseInt(data.regulatory[0].rarea),
            marketNumSum:data.project.length>0?JSON.parse(data.project[0].supply)+JSON.parse(data.project[1].supply):0,
            marketAreaSum:data.project.length>0?parseInt(data.project[0].supplyarea+data.project[1].supplyarea):0,
            marketNumBusiness:data.project.length>0?JSON.parse(data.project[0].supply):0,
            marketAreaBusiness:data.project.length>0?parseInt(data.project[0].supplyarea):0,
            marketNumHouse:data.project.length>0?JSON.parse(data.project[1].supply):0,
            marketAreaHouse:data.project.length>0?parseInt(data.project[1].supplyarea):0,
            population:'暂无数据',
            gdp:'暂无数据'
          }
          that.enclosureInfoShow = true
          that.loading = false
        }else{
          that.$message('数据获取失败')
          that.enclosureInfoShow = true
        }
      })
    },
    closeInfo(){ //关闭围栏显示数据
      this.enclosureInfoShow = false
      this.$store.dispatch('setCurLandCoords',null)
      //隐藏等时圈
      this.ledger_map.getSource('isochron_source').setData({
        type:'FeatureCollection',
        features:[]
      });
    },
    //等时圈图层
    isochronLayer(){
      var that = this
      var map = this.ledger_map
      if(map.getSource('isochron_source')==undefined){
        map.addSource("isochron_source", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });
        map.addLayer({
          id: "isochron_line",
          type: "line",
          source: "isochron_source",
          "layout": {
            "line-join": "round",
            "line-cap": "round"
          },
          "paint": {
            "line-color":'#7dfd3e',
            "line-width":10,
            "line-opacity": 0.4,
            "line-blur":3
          }
        });
        map.addLayer({
          id: "isochron_line1",
          type: "line",
          source: "isochron_source",
          "layout": {
            "line-join": "round",
            "line-cap": "round"
          },
          "paint": {
            "line-color":'#fff',
            "line-width":2,
            "line-opacity": 1
          }
        });
        // map.addLayer({
        //   "id": "isochron_fill",
        //   "type": "fill",
        //   "source": "isochron_source",
        //   "layout": {
            
        //   },
        //   "paint": {
        //     "fill-color": "#7dfd3e",
        //     "fill-opacity": 0.1
        //   }
        // });
      }
    },
    //等时圈条件修改
    travelCondition(){
      if(this.curLandCoords!==''){
        //设置等时圈数据
        this.setIsochron(this.curLandCoords)
      }
    },
    setIsochron(val){ //设置等时圈
      var that = this
      let map = this.ledger_map
      let url = "https://api.mapbox.com/isochrone/v1/mapbox/" + that.cxfs + "/" +
      val + "?contours_minutes=" + that.cxsj + "&polygons=true&denoise=1&access_token=" + that.accessToken;
      that.$.ajax({
        type: "get",
        async: false, //同步请求
        url: url,
        dataType: "json",
        success: (json) => {
          //加载等时圈图层
          that.isochronLayer()
          //设置等时圈数据
          map.getSource("isochron_source").setData(json);
          let coordArr = json.features[0].geometry.coordinates[0]
          //等时圈轨迹
          // var i = 0;
          // var jsonData = {
          //   type:"FeatureCollection",
          //   features:[{
          //     type:'Feature',
          //     geometry:{
          //       coordinates: [],
          //       type: "LineString"
          //     }
          //   }],
          //   properties:{}
          // }
          // var timer = window.setInterval( ()=> {
          //   if (i < coordArr.length) {
          //     jsonData.features[0].geometry.coordinates.push(coordArr[i]);
          //     map.getSource('isochron_source').setData(jsonData);
          //     i++;
          //   } else {
          //     window.clearInterval(timer);
          //   }
          // }, 0.1);

          let coordStr = ''
          coordArr.forEach(item=>{
            coordStr += (item[0]+','+item[1]+';')
          })
          that.isochronStr = coordStr
          //围栏内的市场土地人口数据
          that.enclosureInfo()
          //查询范围内的poi
          //that.getCirclePoi()
        },
        error: function() {
          console.log("fail");
        },
      });
    },
    setDateBox(){
      this.showDateBox = !this.showDateBox
    },
    selectRange(val){ //选择时间段
      if(this.minYear!=null&&this.maxYear!=null){
        this.minYear = val
        this.maxYear = null
        this.dateArr.forEach(item=>{
          if(item.label==val){
            item.select = true
          }else{
            item.select = false
          }
        })
      }else{
        if(val>this.minYear){
          this.maxYear = val
        }else if(val<this.minYear){
          this.maxYear = JSON.parse(JSON.stringify(this.minYear))
          this.minYear = val
        }else{
          this.maxYear = JSON.parse(JSON.stringify(this.minYear))
        }
        this.showDateBox = false
        //查询围栏内数据
        this.enclosureInfo()
        //渲染年份数轴
        this.dateArr.forEach(item=>{
          if((item.label>this.minYear||item.label==this.minYear)&&(item.label<this.maxYear||item.label==this.maxYear)){
            item.select = true
          }else{
            item.select = false
          }
        })
      }
      
    },
    
    //展示的点地评分项code
    showLandScore(code) {
      if(this.showScore == code){
        this.showScore = null
      }else{
        this.showScore = code
      }
    },
    //查询范围内的poi
    getCirclePoi(){
      var that = this
      var map = that.ledger_map
      
      let typeStr = ''
      this.poiLayers.forEach(item=>{
        typeStr += (item.val+',')
      })
      let obj = {
        points:that.curLandCoords,//项目中心点坐标串，查学区使用
        coordinates:that.isochronStr, //等时圈坐标串
        type:typeStr
      }
      ledgerApi.getEnclosurePoi(obj)
      .then(res=>{
        console.log(res)
        if(res.data.code===0){
          let data = res.data.data
          for(let key in data){
            let cur = that.poiLayers.filter(item => {
              return item.val === key
            })[0]
            if(cur){
              let pointID = ['in','id']
              data[key].forEach(info=>{
                pointID.push(info.id)
              })
              let filters = JSON.parse(JSON.stringify(cur.filter))
              filters.push(pointID)
              //map.setLayoutProperty(key, 'visibility', 'visible')
              map.setFilter(key,filters)
              console.log(filters)
            }
          }
          that.layerReady = true
        }
      })
    },
    //控制poi显示
    layerControl(checked,layerName){
      let map = this.ledger_map
      console.log(checked,layerName)
      if(checked&&layerName===null){
        this.$message('图层未添加')
      }
      //隐藏学区图层
      if((layerName=='primary_school'||layerName=='junior_middle_school')&&checked==false){
        map.setLayoutProperty('school_district_fill', 'visibility', 'none')
        map.setLayoutProperty('school_district_line', 'visibility', 'none')
        map.setLayoutProperty('school_district_symbol', 'visibility', 'none')
      }
      if(layerName!==null){
        if(checked){
          map.setLayoutProperty(layerName,'visibility','visible')
        }else{
          map.setLayoutProperty(layerName,'visibility','none')
        }
      }
    },
    //土地评分
    landScore() {
      var that = this
      let map = this.ledger_map
      let coordStr = that.curLandCoords
      ledgerApi.getLandScore(coordStr).then((res) => {
        console.log("点地评分得分", res);
        if (res.data.code === 0) {
          let list = res.data.data[0].children[0].children;
          list.forEach((item, i) => {
            item.tip = null
            //计算得分
            let sum = 0;
            item.children.forEach((child,k) => {
              child.layerName = that.layerNameSet(child.name)
              child.checked = false
              child.score = JSON.parse(
                child.score ? child.score : 0
              );
              sum += JSON.parse(child.score ? child.score : 0);

              //子项权重赋值默认平权
              let cl = item.children.length
              if(cl==1){
                child.weight = 1
              }else{
                let ave = JSON.parse((1/cl).toFixed(2))
                let surplus = 1-ave*cl
                if(surplus>0){
                  if(k<cl-2){
                    child.weight = ave
                  }else{
                    child.weight = ave+surplus
                  }
                }else{
                  child.weight = ave
                }
              }
            });
            //商业下添加虚拟项
            let businessArr = [
              { name:'超市', score:0, checked:false, layerName:'supermarket'},
              { name:'亲子', score:0, checked:false, layerName:'parent_child'},
              { name:'KTV', score:0, checked:false, layerName:'ktv'},
              { name:'电影', score:0, checked:false, layerName:'film'},
              { name:'酒店', score:0, checked:false, layerName:'wineshop'},
              { name:'专业市场', score:0, checked:false, layerName:'professional_market'}
            ]
            if(item.itemCode=="DDPT02"){
              item.children = item.children.concat(businessArr)
            }

            item.score = sum / item.children.length
          });
          let allSum = 0;
          list.forEach((item) => {
            allSum += item.score;
          });
          let sum = JSON.parse(allSum / list.length)
          list.push({
            name: "总得分",
            score: sum
          });
          
          let arr = that.handleScoreFormat(list);
          that.scoreArr = arr
          console.log('点地得分',that.scoreArr);
        }
      });
    },
    layerNameSet(name){ //图层名设置
      let layerName = ''
      switch(name){
        case '企业':
          layerName = 'plan_enterprise';
          break;
        case '医院':
          layerName = 'medical';
          break;
        case '图书馆':
          layerName = 'library';
          break;
        case '大型运动场馆':
          layerName = 'sports_venues';
          break;
        case '公园':
          layerName = 'park';
          break;
        case '旅游景点':
          layerName = 'attractions';
          break;
        case '山体':
          layerName = null;
          break;
        case '海岸线':
          layerName = null;
          break;
        case '初中':
          layerName = 'junior_middle_school';
          break;
        case '小学':
          layerName = 'primary_school';
          break;
        case '购物中心':
          layerName = 'mall';
          break;
        case '地铁':
          layerName = 'subway';
          break;
        case '干道':
          layerName = null;
          break;
      }
      return layerName
    },
    //处理得分格式
    handleScoreFormat(arr){
      arr.forEach(item=>{
        item.score = this.changeFourDecimal(item.score)
        if(item.children){
          item.children.forEach(child=>{
            child.score = this.changeFourDecimal(child.score)
          })
        }
      })
      return arr
    },
    //取小数点后四位小数不足0补全
    changeFourDecimal(x) { 
      if (isNaN(x)) {
        alert('function:changeTwoDecimal->parameter error');
        return false;
      }
      var num = x.toString();
      let arr = num.split('.')
      if(arr[1]){
        if(arr[1].length>2){
          num = JSON.parse(num).toFixed(2)
        }else{
          while (num.split('.')[1].length < 2) {
            num += '0';
          }
        }
      }else{
        num += '.00'
      }
      //num = parseFloat(num)
      return num;
    },
    //权重修改
    weightChange(val,i,j){
      let itemCode = this.scoreHead[i].itemCode
      let num = 0
      this.scoreArr[i].children.forEach(item=>{
        if(item.weight){
          num += JSON.parse(item.weight)
        }
      })
      if(num<1){
        this.scoreArr[i].tip = '权重和小于1,需增加'+(1-num).toFixed(2)+'%'
      }else if(num>1){
        this.scoreArr[i].tip = '权重和大于1,需减少'+(num-1).toFixed(2)+'%'
      }else{
        this.scoreArr[i].tip = null
      }
      //根据权重计算父项得分
      let p_sum = 0
      this.scoreArr[i].children.forEach(item=>{
        if(item.weight){
          p_sum += JSON.parse(item.score)*item.weight
        }
      })
      this.scoreArr[i].score = p_sum.toFixed(2)
    },
  }
 
}
</script>
<style lang="scss">
.landscore_wrap{
  .enclosureSetting{
    position: fixed;
    bottom: 40px;
    left: calc(50% - 283px);
    z-index: 99;
    background: rgba(0,0,0,0.75);
    border-radius: 30px;
    padding: 10px 20px;
    transition: all 0.5s;
    .type_label{
      font-size: 14px;
      color: #e6a23c;
      margin-left: 10px;
    }
    .el-input{
      width: auto;
    }
    .el-input__inner{
      width: 100px;
      border: none;
      border-bottom: #b7bbc3 1px solid;
      border-radius: 0;
      background: none;
      color: #b7bbc3;
    }
  }
  .ledgerinfo_box{
    position: fixed;
    top: 0;
    bottom: 0;
    height: 100%;
    right: 0px;
    z-index: 99999;
    background: rgba(8,8,13,0.88);
    -webkit-transition: all 0.5s ease-in-out;
    transition: all 0.5s ease-in-out;
    width: 270px;
    padding: 0 15px;
  }
  .btn{
    position: absolute;
    top: 10px;
    right: 10px;
    color: #fff;
    cursor: pointer;
    font-size: 16px;
    &:hover{
      color: #ffa824;
    }
  }
  .btn1{
    position: absolute;
    top: 10px;
    right: 40px;
    color: #fff;
    font-size: 16px;
  }
  .land_market{
    transition: all 0.5s ease-in-out;
    position: relative;
    .yearsRnage{
      position: absolute;
      right: 10px;
      top: 13px;
      color:#fff;
      user-select: none;
      .btn2{
        margin-left: 8px;
        cursor: pointer;
      }
    }
    .date_box{
      position: absolute;
      z-index: 99;
      right: 0;
      top: 30px;
      display: flex;
      flex-wrap: wrap;
      background: #fff;
      border-radius: 5px;
      padding: 0px 10px 10px 10px;
      width: 240px;
      .date_item{
        color: #333;
        cursor: pointer;
        width: 20%;
        margin-top: 10px;
        text-align: center;
        height: 30px;
        line-height: 30px;
        user-select: none;
      }
    }
    .data_item1{
      margin-top: 15px;
    }
    .data1{
      background: linear-gradient(45deg, rgba(255, 255, 255, 0.18), transparent);
      color: #fff;
      cursor: pointer;
      user-select: none;
      position: relative;
      display: flex;
      align-items: center;
      padding: 0 30px;
      height: 40px;
      line-height: 40px;
      border-radius: 5px;
      margin-bottom: 10px;
      .name{
        color: #ecf5ff;
        width: 40%;
      }
    }
    .sum{
      width: 60%;
      color: #ffa824;
      font-size: 12px;
      margin-left: 10px;
      font-weight: bold;
      display: flex;
      .sum2{
        margin-left: 5px;
      }
    }
    .data2{
      display: flex;
      align-items: center;
      margin-top: 8px;
      padding: 0 8px;
      height: 28px;
      line-height: 28px;
      font-size: 12px;
      user-select: none;
      color: #66b1ff;
      .name1{
        width: 50%;
        font-size: 12px;
        color: #ecf5ff;
      }
      
    }
    .data4{
      width: 40%;
      margin-top: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    
    
  }
  .title{
    color: #ffa824;
    padding: 10px 0;
    border-bottom: #4b5a69 1px solid;
    margin-top: 10px;
    padding-left: 15px;
  }
  .land_score{
    height: 45%;
    transition: all 0.5s ease-in-out;
    .score_box{
      display: flex;
      height: 90%;
      overflow-y: scroll;
    }
    .score_head{
      width: 70%;
      .head_item{
        margin-top: 10px;
        position: relative;
        .main_title{
          background: linear-gradient(45deg, rgba(255, 255, 255, 0.18), transparent);
          color: #fff;
          font-size: 14px;
          cursor: pointer;
          user-select: none;
          position: relative;
          display: flex;
          align-items: center;
          padding: 0 30px;
          height: 40px;
          line-height: 40px;
          border-radius: 5px 0 0 5px;
        }
        .tip{
          font-size: 12px;
          margin-top: 10px;
          color: #ff9900;
        }
        .sec_title{
          margin-top: 8px;
          padding: 0 8px;
          height: 28px;
          line-height: 28px;
          font-size: 12px;
          user-select: none;
          color: #66b1ff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .left{
            .el-checkbox{
              margin-right: 10px;
            }
          }
          .right{
            width: 30%;
            .el-input__inner{
              background: none;
              color: #fff;
              border: none;
              padding: 0;
              border-radius: 0;
              border-bottom: #4675a7 1px solid;
            }
          }
        }
      }
    }
    .score_wrap{
      width: 30%;
      .score_item {
        text-align: center;
        margin-top: 10px;
        position: relative;
        transition: all 0.8s;
        .main_score {
          background: linear-gradient(45deg, rgba(143, 160, 149, 0.26), transparent);
          color: #ff9900;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          user-select: none;
          position: relative;
          height: 40px;
          line-height: 40px;
          border-radius: 0 5px 5px 0;
          .label {
            letter-spacing: 4px;
          }
          .value {
            margin-left: 10px;
            font-size: 24px;
            color: #e6a23c;
          }
        }
        .ex_score {
          overflow: hidden;
          transition: all 0.5s;
          .ex_score_item {
            margin-top: 8px;
            padding: 0 8px;
            height: 28px;
            line-height: 28px;
            font-size: 12px;
            font-weight: bold;
            user-select: none;
            color: #66b1ff;
            .label {
              letter-spacing: 4px;
              color: #9595f6;
            }
            .value {
              margin-left: 10px;
              font-size: 16px;
              color: #e6a23c;
            }
          }
        }
      }
    }
  }
}
</style>