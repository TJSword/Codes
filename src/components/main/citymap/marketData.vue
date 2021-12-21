<template>
    <div class="market_data">
        <!-- 配置 -->
        <div class="diver">查询条件</div>
        <div class="setting">
            <div class="plates_type">
                <div class="title">类型：</div>
                <div class="cont">
                    <el-radio-group v-model="platesType" @change="changePlatesType">
                        <el-radio label="regions">区县市</el-radio>
                        <el-radio label="plates">板块</el-radio>
                    </el-radio-group>
                </div>
            </div>
            <div class="paltes">
                <div class="title">板块类型：</div>
                <div class="cont">
                    <PlatesSelection :pType="platesType" @selectedPlates="setPlateIds" />
                    <!-- <el-select size="small" v-model="curCheckPlateArr" placeholder="板块选择" 
                    @change="plateChange" multiple collapse-tags clearable filterable>
                        <el-checkbox style="margin-left:20px;margin-top:6px;" :indeterminate="platesIsAll" v-model="plateAll" @change="plateAllChange">全选</el-checkbox>
                        <el-option
                            v-for="item in curPlatesList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select> -->
                </div>
            </div>
            <div class="time">
                <div class="title">时间范围：</div>
                <div class="cont">
                    <el-date-picker
                        style="width:100%;"
                        v-model="monthRange"
                        size="small"
                        type="monthrange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始月"
                        end-placeholder="结束月"
                        value-format="yyyy-MM"
                        :picker-options="pickerOptions">
                    </el-date-picker>
                </div>
            </div>
            <div class="buildfrom" v-if="!top50">
                <div class="title">数据口径：</div>
                <div class="cont">
                    <el-radio-group v-model="dataCaliber">
                        <el-radio label="sub">认购</el-radio>
                        <el-radio label="record">备案</el-radio>
                    </el-radio-group>
                </div>
            </div>
            <div class="buildfrom" v-if="showCycle">
                <div class="title">成交周期：</div>
                <div class="cont">
                    <el-select v-model="dealCycle" placeholder="平均成交量周期" size="small">
                        <el-option label="3个月" :value="3"></el-option>
                        <el-option label="6个月" :value="6"></el-option>
                        <el-option label="12个月" :value="12"></el-option>
                        <el-option label="18个月" :value="18"></el-option>
                        <el-option label="24个月" :value="24"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="buildfrom" v-if="top50">
                <div class="title">排行类别：</div>
                <div class="cont">
                    <el-radio-group v-model="rankBy">
                        <el-radio label="totalPrice">成交总价</el-radio>
                        <el-radio label="buildArea">建筑面积</el-radio>
                    </el-radio-group>
                </div>
            </div>
            <div class="buildfrom" v-if="showBuildform&&!top50">
                <div class="title">建筑形态：</div>
                <div class="cont">
                    <el-select size="small" :disabled="!showBuildform" v-model="checkBuildfrom" placeholder="建筑形态" 
                    @change="buildfromChange" multiple collapse-tags clearable filterable>
                        <el-checkbox style="margin-left:20px;margin-top:6px;" :indeterminate="buildformIsAll" v-model="buildfromAll" @change="buildfromAllChange">全选</el-checkbox>
                        <el-option
                            v-for="item in buildfromArr"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="buildfrom" v-if="showLanduse&&!top50">
                <div class="title">土地性质：</div>
                <div class="cont">
                    <el-select size="small" :disabled="!showLanduse" v-model="checkLanduse" placeholder="用地性质" 
                    @change="landuseChange" multiple collapse-tags clearable filterable>
                        <el-checkbox style="margin-left:20px;margin-top:6px;" :indeterminate="landuseIsAll"  v-model="landuseAll" @change="landuseAllChange">全选</el-checkbox>
                        <el-option
                            v-for="item in landuseArr"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
        </div>
        <!-- 市场条目 -->
        <div class="diver">查询类目</div>
        <div class="market_treebox">
            <el-checkbox v-model="newHousing" @change="setHousing">楼盘分布</el-checkbox>
            <div style="margin-top:4px;"><el-checkbox v-model="top50" @change="rankChange">Top50房企</el-checkbox></div>
            <el-tree
                ref="marketTree"
                :height="cmListHeight"
                :props="defaultProps"
                :data="marketList"
                :check-strictly="true"
                show-checkbox
                node-key="id" 
                highlight-current
                @check="checkMarketItem">
                <div class="custom-tree-node" slot-scope="{ data }">
                    <span>{{ data.name }}</span>
                    <el-popover
                        v-if="data.marks"
                        placement="right"
                        width="200"
                        trigger="hover"
                        :content="data.marks">
                        <i v-if="data.marks" class="el-icon-info" slot="reference"></i>
                    </el-popover>
                </div>
            </el-tree>
        </div>
        <div class="btns">
            <el-button size="small" type="default" v-if="houseData.length>0" @click="exportHouseCsv()">楼盘CSV</el-button>
            <el-button size="small" type="default" v-if="exportData.length>0" @click="exportCsv()">板块CSV</el-button>
            <el-button size="small" type="default" @click="resetData()">重置</el-button>
            <el-button size="small" type="primary" :icon="searchLoading?'el-icon-loading':'el-icon-search'" :disabled="searchLoading" @click="searchMarket()">{{searchLoading?'查询中':'查询'}}</el-button>
        </div>
        <!-- 列表常规 -->
        <div class="data_list" v-show="showLegend" :style="{left:positionX+'px',top:positionY+'px'}">
            <div class="top" @mousedown="move">{{curMarketItem?curMarketItem.label:'/'}}</div>
            <el-table ref="marketTable" :data="marketData" stripe border :height="cmTableHeight" :summary-method="getSummaries" show-summary
            :highlight-current-row="true" :row-class-name="tableRowClassName" @row-click="selectTableRow">
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column prop="name" label="板块"></el-table-column>
                <el-table-column prop="value" label="数值" sortable></el-table-column>
                <el-table-column v-if="curMarketItem?(curMarketItem.id =='land_price'||curMarketItem.id=='hl_pricediff'):false" prop="landNum" label="土地" sortable></el-table-column>
                <el-table-column v-if="curMarketItem?curMarketItem.id=='hl_pricediff':false" prop="buildNum" label="楼盘" sortable></el-table-column>
            </el-table>
        </div>
        <!-- 列表top50 -->
        <div class="data_list_top" v-show="top50" :style="{left:positionX1+'px',top:positionY1+'px'}">
            <div class="top" @mousedown="move1">top50排行榜</div>
            <el-table ref="marketTableTop" :data="top50Data" stripe border :height="cmTableHeight" show-summary
            :highlight-current-row="true" :row-class-name="tableRowClassName" @row-click="showProject">
                <el-table-column prop="rank" label="排名" width="80" sortable></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="num" label="地块成交宗数" width="130" sortable></el-table-column>
                <el-table-column prop="area" :label="rankBy=='totalPrice'?'成交总价(亿)':'成交面积(万㎡)'" width="140" sortable></el-table-column>
            </el-table>
        </div>
        <!-- 图表 -->
        <div class="data_chart" :style="{bottom:showLegend?'20px':'-110%'}">
            <div id="market_chart"></div>
        </div>
        <!-- 图例 -->
        <div class="legend" v-show="showLegend">
            <div class="unit">{{curMarketItem?curMarketItem.unit:'/'}}</div>
            <div class="legend_item" v-for="(item, i) in legendBar" :key="i">
                <div class="val">{{ item.value }}</div>
                <div class="block" :style="{ background: item.color }"></div>
            </div>
        </div>
        <!-- 四至图例 -->
        <div class="legend_four" v-show="newHousing">
            <div class="item" v-for="item in purposeArr" :key="item.value">
                <div class="name">{{item.label}}</div>
                <div class="color" :style="{background:item.remark}"></div>
            </div>
        </div>
    </div>
</template>
<script>
import * as echarts from 'echarts';
import { mapGetters } from "vuex" 
import ledgerApi from "@/api/ledgerApi"
import citymapApi from "@/api/citymapApi"
import XLSX from 'xlsx'
import PlatesSelection from "@/components/common/plateSelection.vue"
export default {
    name:'market_data',
    components:{
        PlatesSelection
    },
    props:{
        curTab:{
            type:String,
            default:''
        }
    },
    data(){
        return {
            positionX:null,
            positionY:null,
            positionX1:null,
            positionY1:null,
            cmListHeight:window.innerHeight-520,//列表高度
            cmTableHeight:window.innerHeight-280,//表格高度
            marketList:[ //市场数据列表
                { id:'house_price',label: '住宅价格-元/㎡',unit:'元/㎡',name:'住宅价格',marks:'成交总价(万元)/成交面积/10000' },
                { id:'turnover',label: '成交量-套',unit:'套',name:'成交量-套',marks:null },
                { id:'turnover_area',label: '成交量-万㎡',unit:'万㎡',name:'成交量-万㎡',marks:'成交面积(㎡)/10000' },
                { id:'sale_stock',label: '在售存量-套',unit:'套',name:'在售存量-套',marks:null },
                { id:'sale_stock_area',label: '在售存量-万㎡',unit:'万㎡',name:'在售存量-万㎡',marks:'存量面积(㎡)/10000' },
                { id:'potential_stock',label: '潜在存量-万㎡',unit:'万㎡',name:'潜在存量-万㎡',marks:'(累计成交土地面积(㎡)-累计成交面积(㎡)' },
                // { id:'ss_depcycle',label: '在售存量去化周期-月',unit:'月',name:'在售存量去化周期-月' },
                { id:'ss_depcycle_area',label: '在售存量去化周期-月',unit:'月',name:'在售存量去化周期-月',marks:'存量面积(㎡)/近6个月平均成交面积(㎡)' },
                { id:'ps_depcucle',label: '潜在存量去化周期-月',unit:'月',name:'潜在存量去化周期-月',marks:'潜在存量(万㎡)/近两年平均成交面积(㎡)*10000' },
                { id:'land_price',label: '楼面地价-元/㎡',unit:'元/㎡',name:'楼面地价',marks:'土地成交总价(万元)/土地规划建筑面积(万㎡)' },
                { id:'hl_pricediff',label: '房地价差-元/㎡',unit:'元/㎡',name:'房地价差',marks:'住宅价格-楼面地价' }, //住宅价格-楼面地价
                { id:'sm_ratio',label: '供销比',unit:'',name:'供销比',marks:'供应面积/销售面积' },
                { id:'im_ratio',label: '存销比',unit:'',name:'存销比',marks:'存量面积/销售面积' },
                { id:'hl_ratio',label: '房地比',unit:'',name:'房地比',marks:'房价/地价' },
            ],
            newHousing:false,//楼盘分布
            top50:false,//top50房企(按成交面积)
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            plateList:[],//版块列表
            regionList:[],//区县市列表
            curPlatesList:[],//当前的版块列表
            checkPlateArr:[],//选择的板块ID
            checkRegionArr:[],//选择的区县市ID
            curCheckPlateArr:[],//当前类型选择的板块ID
            dataCaliber:'sub',//数据口径
            showCycle:false,
            dealCycle:12,//平均成交量周期
            rankBy:'totalPrice',//排行类别
            buildfromArr:[ //建筑形态
                { value:'villa-1-4',label:'别墅' },
                { value:'heightfloor-5-7',label:'多层' },
                { value:'heightfloor-8-11',label:'小高层' },
                { value:'heightfloor-12-18',label:'中高层' },
                { value:'heightfloor-19-33',label:'高层' },
                { value:'heightfloor-34-99',label:'超高层' },
            ],
            buildformIsAll:false,
            buildfromAll:true,
            checkBuildfrom:['villa-1-4','heightfloor-5-7','heightfloor-8-11','heightfloor-12-18','heightfloor-19-33','heightfloor-34-99'],//选择的建筑形态
            landuseArr:[],//土地性质列表
            checkLanduse:['house','house_commerce','commerce_house','commerce','industry','other'],//选择的土地性质
            landuseIsAll:false,
            landuseAll:true,
            showLanduse:false,//土地性质可选择
            showBuildform:true,//建筑形态可选择
            curMarketItem:null,//选择的市场项
            colorBar: [  //颜色(由浅到深)
                {avColor:"0X00FF0000",color:"rgb(0,0,255)"},
                {avColor:"0X00F00F00",color:"rgb(0,15,240)"},
                {avColor:"0X00FF1E00",color:"rgb(0,30,225)"},
                {avColor:"0X00D22D00",color:"rgb(0,45,210)"},
                {avColor:"0X00C33C00",color:"rgb(0,60,195)"},
                {avColor:"0X00B44B00",color:"rgb(0,75,180)"},
                {avColor:"0X00A55A00",color:"rgb(0,90,165)"},
                {avColor:"0X00966900",color:"rgb(0,105,150)"},
                {avColor:"0X00877800",color:"rgb(0,120,135)"},
                {avColor:"0X00788700",color:"rgb(0,135,120)"},
                {avColor:"0X00699600",color:"rgb(0,150,105)"},
                {avColor:"0X005AA500",color:"rgb(0,165,90)"},
                {avColor:"0X004BB400",color:"rgb(0,180,75)"},
                {avColor:"0X003CC300",color:"rgb(0,195,60)"},
                {avColor:"0X002DD200",color:"rgb(0,210,45)"},
                {avColor:"0X001EE100",color:"rgb(0,225,30)"},
                {avColor:"0X000FF000",color:"rgb(0,240,15)"},
                {avColor:"0X0000FF00",color:"rgb(0,255,0)"},
                {avColor:"0X0000F00F",color:"rgb(15,240,0)"},
                {avColor:"0X0000E11E",color:"rgb(30,225,0)"},
                {avColor:"0X0000D22D",color:"rgb(45,210,0)"},
                {avColor:"0X0000C33C",color:"rgb(60,195,0)"},
                {avColor:"0X0000B44B",color:"rgb(75,180,0)"},
                {avColor:"0X0000A55A",color:"rgb(90,165,0)"},
                {avColor:"0X00009669",color:"rgb(105,150,0)"},
                {avColor:"0X00008778",color:"rgb(120,135,0)"},
                {avColor:"0X00007887",color:"rgb(135,120,0)"},
                {avColor:"0X00006996",color:"rgb(150,105,0)"},
                {avColor:"0X00005AA5",color:"rgb(165,90,0)"},
                {avColor:"0X00004BB4",color:"rgb(180,75,0)"},
                {avColor:"0X00003CC3",color:"rgb(195,60,0)"},
                {avColor:"0X00002DD2",color:"rgb(210,45,0)"},
                {avColor:"0X00001EE1",color:"rgb(225,30,0)"},
                {avColor:"0X00000FF0",color:"rgb(240,15,0)"},
                {avColor:"0X000000FF",color:"rgb(255,0,0)"},
            ],
            showLegend:false,//显示图例
            legendBar:[],//图例
            marketData:[],//选择的市场指标板块数据
            myChart:null,//图表主体

            
            platesIsAll:false,
            plateAll:true,
            monthRange:'',//月份范围
            pickerOptions: { //快捷选择
                shortcuts: [{
                    text: '本月',
                    onClick(picker) {
                    picker.$emit('pick', [new Date(), new Date()]);
                    }
                }, {
                    text: '今年至今',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date(new Date().getFullYear(), 0);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setMonth(start.getMonth() - 3);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近六个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setMonth(start.getMonth() - 6);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一年',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setMonth(start.getMonth() - 12);
                    picker.$emit('pick', [start, end]);
                    }
                }]
            },
            platesType:'regions',//板块类型
            searchLoading:false,//查询等待
            housingPopup:null,//popup

            //导出
            csvHeader:['文件夹','名称','经纬度[经度 + 纬度]','线条宽度','线条颜色','线条不透明度','填充颜色','填充不透明度','显示属性','Comment'],//csv表头
            exportData:[],//导出数据
            csvHouseHeader:['文件夹','名称','经度','纬度','海拔','文本显示风格','图标样式','Comment'],
            houseData:[],//楼盘数据

            top50Data:[
                // { id:'1',rank:1,name:'卓越地产','num':32,area:1980 },
            ],
            purposeArr:[
                {label:'纯住宅',remark:'#fefe89',value:'house'},
                {label:'住兼商',remark:'#ff6a00',value:'house_commerce'},
                {label:'商兼住',remark:'#ff6a00',value:'commerce_house'},
                {label:'商业',remark:'#ff0000',value:'commerce'},
                {label:'工业',remark:'#8b6f59',value:'industry'},
                {label:'其他',remark:'#ecf5ff',value:'other'}
            ],
        }
    },
    created(){
        
    },
    mounted(){
        this.getDict()
    },
    computed:{
        ...mapGetters(['cityCode','city_map','cityMapIsload'])
    },
    watch:{
        cityMapIsload:{
            handler(newVal){
                if(newVal){
                    this.$nextTick(_=>{
                        this.loadMapEvents()
                    })
                    
                }
            },
            deep:true
        },
        curMarketItem:{
            handler(newVal){ //楼面地价、房地价差可选择土地性质
                if(newVal==null){
                    this.showLanduse = false
                    this.showBuildform = true
                    this.showCycle = false
                }else{
                    this.showLanduse = newVal.id=='land_price'||newVal.id=='hl_pricediff'||newVal.id=='hl_ratio'
                    this.showBuildform = newVal.id!=='land_price'
                    this.showCycle = newVal.id=='ss_depcycle_area'
                    // if( newVal.id=='land_price'){
                    //     this.checkBuildfrom = []
                    // }
                }
            },
            deep:true
        },
    },
    methods:{
        move(e){
            let e1 = e.currentTarget;
            let e2 = e.target;
            if(e1 === e2){ //阻止子元素冒泡
                //移动目标距离左上角的位置
                this.positionX = e.clientX - e.layerX;
                this.positionY = e.clientY - e.layerY;
                document.onmousemove = (e)=>{
                //更新移动量
                this.positionX += e.movementX;
                this.positionY += e.movementY;
                };
                document.onmouseup = (e) => {
                document.onmousemove = null;
                document.onmouseup = null;
                };
            }
        },
        move1(e){
            let e1 = e.currentTarget;
            let e2 = e.target;
            if(e1 === e2){ //阻止子元素冒泡
                //移动目标距离左上角的位置
                this.positionX1 = e.clientX - e.layerX;
                this.positionY1 = e.clientY - e.layerY;
                document.onmousemove = (e)=>{
                //更新移动量
                this.positionX1 += e.movementX;
                this.positionY1 += e.movementY;
                };
                document.onmouseup = (e) => {
                document.onmousemove = null;
                document.onmouseup = null;
                };
            }
        },
        //获取字典
        getDict(){
            var that = this
            //用地性质
            ledgerApi.getTypeDict("land_use")
            .then(res=>{
                if(res.data.code===0){
                    that.landuseArr = res.data.data
                }
            })
        },
        //设置选择的板块列表及ID数据
        setPlateIds(val){
            console.log('板块组件值',val)
            this.curPlatesList = val.lists
            this.curCheckPlateArr = val.ids
            this.regionList = val.regions
            this.plateList = val.plates
        },
        //切换板块类型
        changePlatesType(val){
            var map = this.city_map
            map.setLayoutProperty('plate_fill','visibility',val==='plates'?'none':'visible')
            map.setLayoutProperty('plate_line','visibility',val==='plates'?'none':'visible')
            map.setLayoutProperty('plate_labels','visibility',val==='plates'?'none':'visible')
            map.setLayoutProperty('plates_fill','visibility',val==='plates'?'visible':'none')
            map.setLayoutProperty('plates_line','visibility',val==='plates'?'visible':'none')
            map.setLayoutProperty('plates_labels','visibility',val==='plates'?'visible':'none')
        },
        //展示房企项目
        showProject(row,column){
            var that = this
            citymapApi.getRankBuilding({comAbbreviation:row.name})
            .then(res=>{
                if(res.data.code===0){
                    console.log('房企下的楼盘',res)
                    let data = res.data.data.searchRst
                    that.loadRankBuilding(data)
                }else{
                    that.$message.error(res.data.msg)
                }
            })
        },
        //加载rank楼盘
        loadRankBuilding(data){
            var that = this
            var map = this.city_map
            let source = map.getSource('source_housing')
            if(source===undefined){
                map.addSource('source_housing',{
                    type:'geojson',
                    data:{
                        type:'FeatureCollection',
                        features:[]
                    }
                })
                map.addLayer({
                    id:'housing',
                    type:'symbol',
                    source:'source_housing',
                    layout: {
                        "text-field": "{name}",
                        "text-font": ["DIN Offc Pro Bold"],
                        "text-allow-overlap": true,
                        "text-offset": [0, -1],
                        "text-anchor": "bottom",
                        "text-size":[
                            "interpolate",
                            ["linear"],
                            ["zoom"],
                            0, 0,
                            8,4,
                            16, 16
                        ],
                        "text-letter-spacing": 0.1,
                        "text-max-width":10,
                        "text-padding":5,
                        
                        "icon-image": "icon_housing",
                        "icon-allow-overlap":true,
                        "icon-ignore-placement":true,
                        "icon-size": [
                            "interpolate",
                            ["linear"],
                            ["zoom"],
                            8,0.3,
                            16, 0.7
                        ],
                        "visibility":"visible"
                    },
                    paint: {
                        "text-color": "#222",
                        "text-halo-color": "rgba(255,255,255,0.8)",
                        "text-halo-width": 2
                    },
                })
                this.housingPopup = new that.mbgl.Popup({
                    closeButton: true,
                    closeOnClick: false,
                    anchor:'left',
                    offset:20
                });
                map.on("click", "housing", (e) => {
                    //阻止点击事件穿透到底部图层
                    e.originalEvent.cancelBubble = true;
                    that.layerClick(e)
                });
            }
            let geojson = {
                "type":"FeatureCollection",
                "features":[]
            }
            data.forEach(item=>{
                if(item.coordinate){
                    let coord = item.coordinate.split(",")
                    geojson.features.push({
                        "type":"Feature",
                        "geometry":{
                            "type":"Point",
                            "coordinates":coord
                        },
                        "properties":{
                            "id":item.id,
                            "name":item.building_name
                        }

                    })
                }
            })
            map.getSource('source_housing').setData(geojson)
            map.setLayoutProperty('housing','visibility','visible')
        },
        //选择表格
        selectTableRow(row,column){
            this.toPlate(row.id)
        },
        //飞向并选择板块
        toPlate(id){
            var map = this.city_map
            let curPlate = this.curPlatesList.filter(item=>id==item.id)[0]
            let center = curPlate.center.split(',')
            map.flyTo({
                center:center,
                zoom:12
            })
            //选中板块
            let select_line = ["match", ["get", "id"],curPlate.id,"#ffc107","rgba(255, 255, 255,1)"]
            let select_lineW = ["match", ["get", "id"],curPlate.id,3,1]
            let select_lineO = ["match", ["get", "id"],curPlate.id,1,0.2]
            map.setPaintProperty("plates_line", "line-color", select_line);
            map.setPaintProperty("plates_line", "line-width", select_lineW);
            //map.setPaintProperty("plates_line", "line-opacity", select_lineO);
        },
        //板块选择
        plateChange(val){
            let arr = []
            this.curPlatesList.forEach(item=>{
                arr.push(item.id)
            })
            let checkedCount = val.length;
            this.plateAll = checkedCount === arr.length;
            this.platesIsAll = checkedCount > 0 && checkedCount < arr.length;
        },
        //板块全选全部选
        plateAllChange(val){
            let arr = []
            this.curPlatesList.forEach(item=>{
                arr.push(item.id)
            })
            this.curCheckPlateArr = val?arr:[]
            this.platesIsAll = false
        },
        //建筑形态选择
        buildfromChange(val){
            let arr = []
            this.buildfromArr.forEach(item=>{
                arr.push(item.value)
            })
            let checkedCount = val.length;
            this.buildfromAll = checkedCount === arr.length;
            this.buildformIsAll = checkedCount > 0 && checkedCount < arr.length;
        },
        //建筑形态全选
        buildfromAllChange(val){
            let arr = []
            this.buildfromArr.forEach(item=>{
                arr.push(item.value)
            })
            this.checkBuildfrom = val?arr:[]
            this.buildformIsAll = false
        },
        //用地性质选择
        landuseChange(val){
            let arr = []
            this.landuseArr.forEach(item=>{
                arr.push(item.value)
            })
            let checkedCount = val.length;
            this.landuseAll = checkedCount === arr.length;
            this.landuseIsAll = checkedCount > 0 && checkedCount < arr.length;
        },
        //用地性质全选
        landuseAllChange(val){
            let arr = []
            this.landuseArr.forEach(item=>{
                arr.push(item.value)
            })
            this.checkLanduse = val?arr:[]
            this.landuseIsAll = false
        },
        //选择市场项
        checkMarketItem( checkedNode,checkedKeys){
            console.log(checkedNode,checkedKeys)
            if(checkedNode===this.curMarketItem){
                this.curMarketItem = null
            }else{
                this.$refs.marketTree.setCheckedNodes([checkedNode]);
                this.curMarketItem = checkedNode
            }
            this.top50 = false
            this.marketData = []
        },
        //导出数据为csv
        exportCsv(){
            console.log(this.exportData)
            if(this.exportData.length>0){
                let header = {header:this.csvHeader}
                let ws = XLSX.utils.json_to_sheet(this.exportData, header)
                let wb = XLSX.utils.book_new()
                let folderName = `${this.monthRange[0]}-${this.monthRange[1]+this.curMarketItem.name}.csv`
                XLSX.utils.book_append_sheet(wb, ws, folderName)
                XLSX.writeFile(wb, folderName)
            }else{
                this.$message('未发现可导出数据')
            }
        },
        //导出楼盘数据csv
        exportHouseCsv(){
            if(this.houseData.length>0){
                let folderName = `${localStorage.getItem('cityName')}楼盘数据`
                let data = []
                this.houseData.forEach(item=>{
                    let coord = item.coordinate.split(',')
                    let remarks = `
                        所属区域：${item.region?item.region:"-"}
                        物业类别：${item.type?item.type:"-"}
                        产权年限：${item.rightYear?item.rightYear:"-"}
                        开发商：${item.developer?item.developer:"-"}
                        总户数：${item.houseTotal?item.houseTotal:"-"}
                        楼栋总数：${item.floorTotal?item.floorTotal:"-"}
                        占地面积：${item.useArea?item.useArea:"-"}
                        建筑面积：${item.buildArea?item.buildArea:"-"}
                        容积率：${item.plotRatio?item.plotRatio:"-"}
                        绿化率：${item.greenRatio?item.greenRatio:"-"}
                        停车位：${item.park?item.park:"-"}<
                        物业公司：${item.company?item.company:"-"}<
                        物业费：${item.fee?item.fee:"-"}<
                        交房时间：${item.subDate?item.subDate:"-"}`
                    let obj = {
                        '文件夹':folderName,
                        '名称':item.name,
                        '经度':coord[0],
                        '纬度':coord[1],
                        '海拔':0,
                        '文本显示风格':1,
                        '图标样式':123,
                        'Comment':remarks
                    }
                    data.push(obj)
                })
                let header = {header:this.csvHouseHeader}
                let ws = XLSX.utils.json_to_sheet(data, header)
                let wb = XLSX.utils.book_new()
                XLSX.utils.book_append_sheet(wb, ws, `${folderName}.csv`)
                XLSX.writeFile(wb, `${folderName}.csv`)
            }else{
                this.$message('未发现可导出数据')
            }
        },
        //重置数据
        resetData(){
            this.buildformIsAll = false
            this.buildfromAll = false
            this.checkBuildfrom = ['villa-1-4','heightfloor-5-7','heightfloor-8-11','heightfloor-12-18','heightfloor-19-33','heightfloor-34-99']
            this.landuseIsAll = false
            this.landuseAll = false
            this.checkLanduse = ['house','house_commerce','commerce_house','commerce','industry','other']
            //this.monthRange = ''
            this.exportData = []
            this.houseData = []
            this.curMarketItem = null
            this.showLegend = false
            this.$refs.marketTree.setCheckedNodes([]);
            this.setPlateScore()
        },
        //开始查询
        searchMarket(){
            var that = this
            if(that.curCheckPlateArr.length==0||that.monthRange==''||(that.curMarketItem==null&&!that.top50)){
                let message = that.curCheckPlateArr.length==0?'请选择板块':that.monthRange==''?'请选择时间':'请选择查询类目'
                that.$message(message)
            }else{
                if(that.top50){
                    that.searchRank()
                }else{
                    that.getMarketData()
                }
                
            }
        },
        //查询top50排行榜
        searchRank(){
            var that = this
            //板块
            let IdsStr = ''
            that.curCheckPlateArr.forEach(item=>{
                IdsStr += (item+',')
            })
            let obj = {
                startDate:that.monthRange[0],
                endDate:that.monthRange[1],
                dimension:that.rankBy
            }
            if(that.platesType==='regions'){
                obj.regionnos = IdsStr
            }else if(that.platesType==='plates'){
                obj.partnos = IdsStr
            }
            citymapApi.getTopRank(obj)
            .then(res=>{
                if(res.data.code===0){
                    console.log('top50',res)
                    let data = res.data.data.searchRst
                    let arr = []
                    data.forEach((item,i)=>{
                        arr.push({
                            rank:i+1,
                            name:item.com_abbreviation,
                            num:item.num,
                            area:JSON.parse((item.total/10000).toFixed(2)),
                        })
                    })
                    that.top50Data = arr
                }else{
                    that.$message.error(res.data.msg)
                }
            })
        },
        //获取楼盘市场数据
        getMarketData(){
            var that = this
            //板块
            let IdsStr = ''
            that.curCheckPlateArr.forEach(item=>{
                IdsStr += (item+',')
            })
            let obj = {
                landCityno:that.cityCode,
                startDate:that.monthRange[0],
                endDate:that.monthRange[1],
                calKey:that.curMarketItem.id,
                status:that.dataCaliber
            }
            //建筑形态
            if(that.showBuildform){
                let buildFormStr = ''
                that.checkBuildfrom.forEach(item=>{
                    buildFormStr += (item+',')
                })
                obj.buildForms = buildFormStr
            }
            //用地性质
            if(that.showLanduse){
                let purpose = ''
                that.checkLanduse.forEach(item=>{
                    purpose += (item+',')
                })
                obj.purpose = purpose
            }
            //成交周期
            if(that.showCycle){
                obj.cycle = that.dealCycle
            }
            if(that.platesType=="plates"){
                obj.partId = IdsStr
            }else{
                obj.regionnos = IdsStr
            }
            that.searchLoading = true
            citymapApi.getMarketData(obj)
            .then(res=>{
                console.log('楼盘的市场数据',res)
                if(res.data.code===0){
                    let data = res.data.data.codeList
                    let curValArr = data[that.curMarketItem.id]
                    let landNumArr = data.land_num
                    let buildNumArr = data.build_num
                    //成交量-万㎡、在售存量-万㎡、潜在存量-万㎡单位后端返回为㎡ 转化为万平
                    let flag = that.curMarketItem.id == 'turnover_area' || that.curMarketItem.id == 'sale_stock_area' || that.curMarketItem.id == 'potential_stock'
                    let arr = []
                    let plateArr = that.platesType=='regions'?that.regionList:that.plateList
                    for(let key in curValArr){
                        let plate = plateArr.filter(item=>item.id==key)[0] //查询板块名称
                        let obj = {
                            id:key,
                            name:plate.name,
                            value:flag?JSON.parse((curValArr[key]/10000).toFixed(2)):JSON.parse(curValArr[key])
                        }
                        if(that.curMarketItem.id == 'land_price' || that.curMarketItem.id == 'hl_pricediff'){ //楼面地价、房地差价添加土地数量
                            obj.landNum = JSON.parse(landNumArr[key])
                            if(that.curMarketItem.id == 'hl_pricediff'){
                                obj.buildNum = JSON.parse(buildNumArr[key])
                            }
                        }
                        arr.push(obj)
                    }
                    that.marketData = arr
                    that.searchLoading = false
                    //板块设置评分
                    that.setPlateScore()
                }else{
                    that.$message.error(res.data.msg)
                    that.searchLoading = false
                }
            })
        },
        //板块设置评分
        setPlateScore(){
            var that = this
            var map = this.city_map
            if(this.curMarketItem==null||this.curCheckPlateArr.length==0){
                this.showLegend = false
                this.marketData = []
                if(this.platesType=='plates'){
                    map.setPaintProperty("plates_fill", "fill-color","rgba(58, 88, 125, 1)");
                    map.setPaintProperty("plates_fill", "fill-opacity", 0.2);
                    map.setPaintProperty("plates_line", "line-opacity", 0.1);
                }else{
                    map.setPaintProperty("plate_fill", "fill-color","rgba(58, 88, 125, 1)");
                    map.setPaintProperty("plate_fill", "fill-opacity", 0.2);
                    map.setPaintProperty("plate_line", "line-opacity", 0.2);
                }
            }else{
                var val = this.curMarketItem.id
                let data = []
                this.marketData.forEach(item=>{
                    data.push(item.value)
                })
                
                //获取数据平均值 等分
                let maxNum = Math.max(...data)
                let minNum = Math.min(...data)
                let allNum = maxNum - minNum
                let average
                if(val=='ss_depcycle_area'||val=='ps_depcucle'||val=='sm_ratio'||val=='im_ratio'||val=='hl_ratio'){
                    let ave = (allNum/35).toFixed(3)
                    //向上取整保留一位小数
                    average = Math.ceil(ave*1000)/1000
                }else{
                    average = Math.ceil(allNum/35)
                }
                //设置图例
                this.showLegend = true
                let legendArr = [{ value: minNum, color: "#0000ff",avColor:'0X00FF0000' }];
                this.colorBar.forEach((item, i) => {
                    legendArr.unshift({
                        value: val=='ss_depcycle_area'||val=='ps_depcucle'||val=='sm_ratio'||val=='im_ratio'||val=='hl_ratio'?(minNum+average * (i + 1)).toFixed(1):parseInt(minNum+average * (i + 1)),
                        color: item.color,
                        avColor: item.avColor
                    });
                });
                this.legendBar = legendArr;
                //根据值渲染板块
                let expression_fill = ["match", ["get", "id"]];
                let expression_fillop = ["match", ["get", "id"]];
                let expression_lineop = ["match", ["get", "id"]];
                //配置导出csv数据
                let arrA = []
                this.marketData.forEach(item=>{
                    let color = ''
                    let avColor = ''
                    if(item.value==minNum){
                        color = '#0000ff'
                        avColor = '0X00FF0000'
                    }else{
                        for(let i=0;i<legendArr.length-1;i++){
                            if(item.value<=legendArr[i].value&&item.value>legendArr[i+1].value){
                                color = legendArr[i].color
                                avColor = legendArr[i].avColor
                                break
                            }
                        }
                    }
                    expression_fill.push(item.id,color)
                    expression_fillop.push(item.id,0.9)
                    expression_lineop.push(item.id,0.9)
                    
                    //配置导出csv数据
                    let folderName = `${that.monthRange[0]}_${that.monthRange[1]+that.curMarketItem.label}`
                    let curPlate = that.curPlatesList.filter(p=>p.id==item.id)[0]
                    let name = curPlate.name
                    let remarks = `时间段：${that.monthRange[0]}_${that.monthRange[1]}
                    类型：${that.curMarketItem.label}
                    数值：${item.value}`
                    let coordinates = curPlate.coordinates
                    let coords = coordinates.split('-') //普安段是否为多多边形
                    if(coords.length>1){
                        coords.forEach(str=>{
                            let obj = {
                                '文件夹':folderName,
                                '名称':name,
                                '经纬度[经度 + 纬度]':str,
                                '线条宽度':1,
                                '线条颜色':'0X00FFFFFF',
                                '线条不透明度':90,
                                '填充颜色':avColor,
                                '填充不透明度':80,
                                '显示属性':1,
                                'Comment':remarks
                            }
                            arrA.push(obj)
                        })
                    }else{
                        let obj = {
                            '文件夹':folderName,
                            '名称':name,
                            '经纬度[经度 + 纬度]':coordinates,
                            '线条宽度':1,
                            '线条颜色':'0X00FFFFFF',
                            '线条不透明度':90,
                            '填充颜色':avColor,
                            '填充不透明度':80,
                            '显示属性':1,
                            'Comment':remarks
                        }
                        arrA.push(obj)
                    }
                })
                this.exportData = arrA

                expression_fill.push('#3a587d')
                expression_fillop.push(0.2)
                expression_lineop.push(0.2)
                if(this.platesType=='plates'){
                    console.log(expression_fill)
                    map.setPaintProperty("plates_fill", "fill-color", expression_fill);
                    map.setPaintProperty("plates_fill", "fill-opacity", expression_fillop);
                    map.setPaintProperty("plates_line", "line-opacity", expression_lineop);
                }else{
                    map.setPaintProperty("plate_fill", "fill-color", expression_fill);
                    map.setPaintProperty("plate_fill", "fill-opacity", expression_fillop);
                    map.setPaintProperty("plate_line", "line-opacity", expression_lineop);
                }
                map.setZoom(this.platesType=='plates'?8.7:7.9);
                //设置图表
                this.setMarketChart()
            }
        },
        //市场数据图表
        setMarketChart(){
            var that = this
            var chartDom = document.getElementById('market_chart');
            if(that.myChart!==null){
                that.myChart.dispose()
            }
            that.myChart = echarts.init(chartDom);
            var option;
            var source = []
            var dataArr = []
            this.marketData.forEach(item=>{
                source.push([item.name,item.value])
                dataArr.push(item.value)
            })
            var min = Math.min(...dataArr)
            var max = Math.max(...dataArr)
            option = {
                dataset: [{
                    dimensions: ['plate', 'value'],
                    source: source
                }, {
                    transform: {
                        type: 'sort',
                        config: { dimension: 'value', order: 'desc' }
                    }
                }],
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
                        bottom: 5
                    }
                ],
                grid: { left: "8%", bottom: "28%"},
                tooltip: { trigger: "item", formatter: "板块：{b}<br/>数值：{c}"},
                visualMap: {
                    min: min,
                    max: max,
                    text: ["最大", "最小"],
                    right: "2%",
                    top: "8%",
                    realtime: true,//拖拽时，是否实时更新
                    calculable: true,//是否显示拖拽用的手柄（手柄能拖拽调整选中范围）
                    dimension: 1,//指定用数据的『哪个维度』，映射到视觉元素上。『数据』即 series.data。 可以把 series.data 理解成一个二维数组,其中每个列是一个维度,默认取 data 中最后一个维度
                    hoverLink:true,//鼠标悬浮到 visualMap 组件上时，鼠标位置对应的数值 在 图表中对应的图形元素，会高亮
                    inRange: {
                        color: [
                            "rgb(0,0,255)",
                            "rgb(0,15,240)",
                            "rgb(0,30,225)",
                            "rgb(0,45,210)",
                            "rgb(0,60,195)",
                            "rgb(0,75,180)",
                            "rgb(0,90,165)",
                            "rgb(0,105,150)",
                            "rgb(0,120,135)",
                            "rgb(0,135,120)",
                            "rgb(0,150,105)",
                            "rgb(0,165,90)",
                            "rgb(0,180,75)",
                            "rgb(0,195,60)",
                            "rgb(0,210,45)",
                            "rgb(0,225,30)",
                            "rgb(0,240,15)",
                            "rgb(0,255,0)",
                            "rgb(15,240,0)",
                            "rgb(30,225,0)",
                            "rgb(45,210,0)",
                            "rgb(60,195,0)",
                            "rgb(75,180,0)",
                            "rgb(90,165,0)",
                            "rgb(105,150,0)",
                            "rgb(120,135,0)",
                            "rgb(135,120,0)",
                            "rgb(150,105,0)",
                            "rgb(165,90,0)",
                            "rgb(180,75,0)",
                            "rgb(195,60,0)",
                            "rgb(210,45,0)",
                            "rgb(225,30,0)",
                            "rgb(240,15,0)",
                            "rgb(255,0,0)",
                        ]
                    },
                    textStyle: {
                        color: "#5387c1"
                    },
                    z: 99
                },
                xAxis: {
                    type: 'category',
                    axisLabel: { 
                        //interval: 0, 
                        rotate: 30 ,
                        color: "#fff",
                        fontSize:10
                    }
                },
                yAxis: {
                    axisLine: {
                        lineStyle: {
                            color: "#5387c1"
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: "rgba(131,101,101,0.2)",
                            type: "dashed"
                        }
                    }
                },
                series: {
                    type: 'bar',
                    encode: { x: 'plate', y: 'value' },
                    datasetIndex: 1
                }
            };

            option && that.myChart.setOption(option);
        },
        //加载地图事件
        loadMapEvents(){
            var that = this
            var map = this.city_map
            var popup = new that.mbgl.Popup({
                closeButton: false,
                closeOnClick: false,
                anchor:'left',
                offset:20
            });
            map.on("mousemove", "plates_fill", e => {
                if(that.curMarketItem!==null&&that.curTab=='market_data'){
                    map.getCanvas().style.cursor = "pointer";
                    let coordinates = [e.lngLat.lng, e.lngLat.lat];
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }

                    var id = e.features[0].properties.id;
                    let flag = that.curCheckPlateArr.includes(id)
                    let curData = that.marketData.filter(item=>item.id==id)[0]
                    if(!flag||!curData){
                        return
                    }
                    var info = `<P class="item_head">${curData.name}</p>
                    <div class="item_name">类别：<span class="item_val">${that.curMarketItem.label}</span></div>
                    <div class="item_name">数值：<span class="item_val">${curData.value}</span><span class="unit"> ${that.curMarketItem.unit}</span></div>`;
                    popup.setLngLat(coordinates).setHTML(info).addTo(map);
                }
            });
            map.on("mouseleave", "plates_fill", e => {
                if(that.curMarketItem!==null&&that.curTab=='market_data'){
                    map.getCanvas().style.cursor = "";
                    popup.remove();
                }
            });
            map.on("click", "plates_fill", e => {
                //阻止上层图层的点击事件穿透
                if (e.originalEvent.cancelBubble) {
                    return;
                }
                if(that.curMarketItem!==null&&that.curTab=='market_data'){
                    let  id = e.features[0].properties.id
                    let curRow = that.marketData.filter(item=>item.id==id)[0]
                    let topHeight = document.getElementsByClassName("market_"+id)[0].offsetTop 
                    that.$refs.marketTable.bodyWrapper.scrollTop = topHeight
                    that.$refs.marketTable.setCurrentRow(curRow)
                    that.toPlate(id)
                }
            });
            map.on("mousemove", "plate_fill", e => {
                if(that.curMarketItem!==null&&that.curTab=='market_data'){
                    map.getCanvas().style.cursor = "pointer";
                    let coordinates = [e.lngLat.lng, e.lngLat.lat];
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }

                    var id = e.features[0].properties.id;
                    let flag = that.curCheckPlateArr.includes(id)
                    let curData = that.marketData.filter(item=>item.id==id)[0]
                    if(!flag||!curData){
                        return
                    }
                    var info = `<P class="item_head">${curData.name}</p>
                    <div class="item_name">类别：<span class="item_val">${that.curMarketItem.label}</span></div>
                    <div class="item_name">数值：<span class="item_val">${curData.value}</span><span class="unit"> ${that.curMarketItem.unit}</span></div>`;
                    popup.setLngLat(coordinates).setHTML(info).addTo(map);
                }
            });
            map.on("mouseleave", "plate_fill", e => {
                if(that.curMarketItem!==null&&that.curTab=='market_data'){
                    map.getCanvas().style.cursor = "";
                    popup.remove();
                }
            });
            map.on("click", "plate_fill", e => {
                //阻止上层图层的点击事件穿透
                if (e.originalEvent.cancelBubble) {
                    return;
                }
                if(that.curMarketItem!==null&&that.curTab=='market_data'){
                    let  id = e.features[0].properties.id
                    let curRow = that.marketData.filter(item=>item.id==id)[0]
                    let topHeight = document.getElementsByClassName("market_"+id)[0].offsetTop 
                    that.$refs.marketTable.bodyWrapper.scrollTop = topHeight
                    that.$refs.marketTable.setCurrentRow(curRow)
                    that.toPlate(id)
                }
            });
            //添加地图图标
            map.loadImage("http://47.104.165.136:8099/test/chengdu/icons/land_point.png",function(error, icon_housing) {
                if (error) throw error;
                map.addImage("icon_housing", icon_housing);
            });
        },
        //选择房企排行
        rankChange(val){
            if(val){
                this.resetData()
            }
        },
        //加载楼盘分布数据
        setHousing(){
            var that = this
            var map = this.city_map
            let source = map.getSource('source_housing')
            if(source===undefined){
                //项目四至
                map.addSource("source_fourlayer", {
                    type: "geojson",
                    data: {
                        type: "FeatureCollection",
                        features: [],
                    }
                });
                map.addLayer({
                    id: "fourlayer_fill",
                    type: "fill",
                    source: "source_fourlayer",
                    layout: {
                        visibility: "visible",
                    },
                    paint: {
                        "fill-color":[
                            'match',['get','purpose'],
                            'house','#fefe89',
                            'house_commerce','#ff6a00',
                            'commerce_house','#ff6a00',
                            'commerce','#ff0000',
                            'industry','#8b6f59',
                            'other','#ecf5ff',
                            '#ecf5ff'
                        ],
                        "fill-opacity": 0.8
                    },
                });
                map.on('click','fourlayer_fill',e=>{
                    console.log(e.features[0].properties.name)
                })
                //项目
                map.addSource('source_housing',{
                    type:'geojson',
                    data:{
                        type:'FeatureCollection',
                        features:[]
                    }
                })
                map.addLayer({
                    id:'housing',
                    type:'symbol',
                    source:'source_housing',
                    layout: {
                        "text-field": "{name}",
                        "text-font": ["DIN Offc Pro Bold"],
                        "text-allow-overlap": true,
                        "text-offset": [0, -1],
                        "text-anchor": "bottom",
                        "text-size":[
                            "interpolate",
                            ["linear"],
                            ["zoom"],
                            0, 0,
                            10,0,
                            16, 16
                        ],
                        "text-letter-spacing": 0.1,
                        "text-max-width":10,
                        "text-padding":5,
                        
                        "icon-image": "icon_housing",
                        "icon-allow-overlap":true,
                        "icon-ignore-placement":true,
                        "icon-size": [
                            "interpolate",
                            ["linear"],
                            ["zoom"],
                            7,0.1,
                            16, 0.7
                        ],
                        "visibility":"visible"
                    },
                    paint: {
                        "text-color": "#222",
                        "text-halo-color": "rgba(255,255,255,0.8)",
                        "text-halo-width": 2
                    },
                })
                this.housingPopup = new that.mbgl.Popup({
                    closeButton: true,
                    closeOnClick: false,
                    anchor:'left',
                    offset:20
                });
                map.on("click", "housing", (e) => {
                    //阻止点击事件穿透到底部图层
                    e.originalEvent.cancelBubble = true;
                    that.layerClick(e)
                });
            }
            if(that.newHousing){
                map.setLayoutProperty('housing','visibility','visible')
                map.setLayoutProperty('fourlayer_fill','visibility','visible')
                if(that.curCheckPlateArr.length==0){
                    this.$message('请先选择套查询的板块')
                    return
                }
                let IdsStr = ''
                that.curCheckPlateArr.forEach(item=>{
                    IdsStr += (item+',')
                })
                let obj = that.platesType=='plates'?{partno:IdsStr}:{regionno:IdsStr}
                //土地四至
                citymapApi.getHousingFour(obj)
                .then(res=>{
                    console.log('四至信息',res)
                    if(res.data.code===0){
                        let data = res.data.data
                        let geojson = {
                            "type":"FeatureCollection",
                            "features":[]
                        }
                        data.forEach(item=>{
                            if(item.coordinates){
                                let co1 = item.coordinates.split(";")
                                co1.pop()
                                let coords = []
                                co1.forEach(c=>{
                                    let co2 = c.split(",")
                                    coords.push(co2)
                                })
                                geojson.features.push({
                                    "type":"Feature",
                                    "geometry":{
                                        "type":"Polygon",
                                        "coordinates":[coords]
                                    },
                                    "properties":{
                                        "id":item.id,
                                        "name":item.parcelLocation,
                                        "purpose":item.purpose,
                                        "buildings":item.buildingId
                                    }

                                })
                            }
                        })
                        console.log(geojson)
                        map.getSource('source_fourlayer').setData(geojson)
                    }else{
                        that.$message.error(res.data.msg)
                    }
                })
                //在售项目
                citymapApi.getHousing(obj)
                .then(res=>{
                    console.log('楼盘分布',res)
                    if(res.data.code===0){
                        let data = res.data.data
                        let geojson = {
                            "type":"FeatureCollection",
                            "features":[]
                        }
                        data.forEach(item=>{
                            if(item.coordinate){
                                let coord = item.coordinate.split(",")
                                geojson.features.push({
                                    "type":"Feature",
                                    "geometry":{
                                        "type":"Point",
                                        "coordinates":coord
                                    },
                                    "properties":{
                                        "id":item.id,
                                        "name":item.name
                                    }

                                })
                            }
                        })
                        map.getSource('source_housing').setData(geojson)
                        that.houseData = data
                    }else{
                        that.$message.error(res.data.msg)
                    }
                })
            }else{
                map.setLayoutProperty('housing','visibility','none')
                map.setLayoutProperty('fourlayer_fill','visibility','none')
                that.houseData = []
            }
        },
        async layerClick(e){
            var that = this
            var map = that.city_map
            let coordinates = [e.lngLat.lng, e.lngLat.lat];
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            var id = e.features[0].properties.id;
            let infos = await that.setHousingInfo(id)
            that.housingPopup.setLngLat(coordinates).setHTML(infos).addTo(map);
        },
        setHousingInfo(id){ 
            var that = this
            return citymapApi.getHousingDetail(id)
            .then(res=>{
                if(res.data.code===0){
                    console.log('楼盘详情',res)
                    let data = res.data.data.build_info

                    var name = data.name //名称
                    var region = data.region //所属区域
                    var type = data.type //物业类别
                    var rightYear = data.rightYear //产权年限
                    var developer = data.developer //开发商
                    var houseTotal = data.houseTotal //总户数
                    var floorTotal = data.floorTotal //楼栋总数
                    var useArea = data.useArea //占地面积
                    var buildArea = data.buildArea //建筑面积
                    var plotRatio = data.plotRatio //容积率
                    var greenRatio = data.greenRatio //绿化率
                    var park = data.park //停车位
                    var company = data.company //物业公司
                    var fee = data.fee //物业费
                    var subDate = data.subDate //交房时间

                    var saleState = data.saleState //销售状态
                    var refPrice = data.minPrice+' - '+data.maxPrice //参考价格
                    var decoration = data.decorationType//装修状况
                     
                    var decoratePrice = data.decoratePriceMin+' - '+data.decoratePriceMax //装修价格
                    
                    let btns = '<div class="land_score_btn">土地评分</div>'
                    var info = `<div class="infos_wrap">
                        <div class="item_name" style="width:100%;color:#ffc107">名称：<span class="item_val">${name?name:"-"}</span></div>
                        <div class="item_name">销售状态：<span class="item_val">${saleState?saleState:"-"}</span></div>
                        <div class="item_name">参考价格：<span class="item_val">${refPrice?refPrice:"-"} 元/㎡</span></div>
                        <div class="item_name">装修状况：<span class="item_val">${decoration?decoration:"-"}</span></div>
                        <div class="item_name">装修价格：<span class="item_val">${decoratePrice?decoratePrice:"-"} 元/㎡</span></div>
                        <div class="item_name">所属区域：<span class="item_val">${region?region:"-"}</span></div>
                        <div class="item_name">物业类别：<span class="item_val">${type?type:"-"}</span></div>
                        <div class="item_name">产权年限：<span class="item_val">${rightYear?rightYear:"-"}</span></div>
                        <div class="item_name">开发商：<span class="item_val">${developer?developer:"-"}</span></div>
                        <div class="item_name">总户数：<span class="item_val">${houseTotal?houseTotal:"-"}</span></div>
                        <div class="item_name">楼栋总数：<span class="item_val">${floorTotal?floorTotal:"-"}</span></div>
                        <div class="item_name">占地面积：<span class="item_val">${useArea?useArea:"-"}</span></div>
                        <div class="item_name">建筑面积：<span class="item_val">${buildArea?buildArea:"-"}</span></div>
                        <div class="item_name">容积率：<span class="item_val">${plotRatio?plotRatio:"-"}</span></div>
                        <div class="item_name">绿化率：<span class="item_val">${greenRatio?greenRatio:"-"}</span></div>
                        <div class="item_name">停车位：<span class="item_val">${park?park:"-"}</span></div> 
                        <div class="item_name">物业公司：<span class="item_val">${company?company:"-"}</span></div> 
                        <div class="item_name">物业费：<span class="item_val">${fee?fee:"-"}</span></div> 
                        <div class="item_name">交房时间：<span class="item_val">${subDate?subDate:"-"}</span></div> 
                    </div>`;
                    return info
                }
            })
        },
        tableRowClassName({row, rowIndex}) {
            return "market_"+row.id
        },
        //板块合计
        getSummaries(param){
            const { columns, data } = param;
            const sums = [];
            let flag = false
            if(this.curMarketItem!==null){
                let id = this.curMarketItem.id
                //可求和项
                flag = id=='turnover'||id=='turnover_area'||id=='sale_stock'||id=='sale_stock_area'||id=='potential_stock'
            }
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计';
                    return;
                }else if(index === 2){
                    const values = data.map(item => Number(item[column.property]));
                    let sum = values.reduce((prev, curr) => {
                        const value = Number(curr);
                        if (!isNaN(value)) {
                            return prev + curr;
                        } else {
                            return prev;
                        }
                    }, 0);
                    sums[index] = flag?sum.toFixed(2):'NAN'
                }
            });
            
            return sums;
        },
    }
}
</script>
<style lang="scss">
.market_data{
    .el-tree-node:focus>.el-tree-node__content{
        background: none !important;
    }
    .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
        background: none;
    }
    .diver{
        padding: 10px 20px;
        border-bottom: #464646 1px solid;
        font-size: 14px;
        color: #8bc34a;
    }
    .market_treebox{
        margin-top: 20px;
        padding-left: 15px;
        .el-checkbox__label{
            color: #99faff;
        }
        .custom-tree-node{
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        }
    }
    .btns{
        display: flex;
        justify-content: flex-end;
    }
    .setting{
        height: 235px;
        padding: 10px 0;
        .el-radio{
            color:#cacaca;
            margin-right: 12px;
        }
        .paltes,.time,.plates_type,.buildfrom{
            display: flex;
            align-items: center;
            margin-top: 5px;
            padding: 0 10px;
            margin-bottom: 10px;
            .title{
                width: 72px;
                color: #fff;
            }
            .cont{
                width: calc(100% - 72px);
            }
            .el-date-editor .el-range-input{
                width: 35%;
            }
            .el-input.is-disabled .el-input__inner{
                background-color: #585858;
            }
        }
    }
    .legend {
        position: fixed;
        left: 390px;
        bottom: 0px;
        z-index: 99;
        .unit{
            margin-bottom: 10px;
            color: #ffc107;
            text-align: right;
        }
        .legend_item {
            display: flex;
            align-items: flex-start;
            .val {
                color: #c3c1c1;
                font-size: 12px;
                width: 50px;
                text-align: right;
                margin-right: 10px;
                position: relative;
                margin-top: -4px;
            }
            .block {
                width: 30px;
                height: 23px;
            }
        }
    }
    .legend_four{
        position: fixed;
        z-index: 99;
        right: 20px;
        bottom: 40px;
        .item{
            display: flex;
            align-items: center;
            margin-top: 3px;
            .name{
                width: 80px;
                text-align: right;
                margin-right: 10px;
                color: #fff;
            }
            .color{
                width: 50px;
                height: 20px;
                opacity: 0.8;
            }
        }
    }
    .data_list,.data_list_top{
        position: fixed;
        background: rgb(29 32 39 / 90%);
        left: calc(100% - 310px);
        top: 60px;
        box-shadow: rgb(0 0 0 / 10%) 0 0 10px;
        z-index: 999;
        width: 300px;
        height: auto;
        border-radius: 6px;
        overflow: hidden;
        .el-table th{
            padding: 6px 0;
        }
        .top{
            width: 100%;
            height: 45px;
            text-align: center;
            line-height: 45px;
            position: relative;
            z-index: 99;
            cursor: move;
            user-select: none;
            color: #333;
            background: #fff;
            font-weight: bold;
        }
        // 黑色风格图表
        .el-table{
            color: #d1e6fd;
        }
        .el-table thead{
            color: #ffc107;
        }
        .el-table th.is-leaf{
            border-bottom: none;
        }
        .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
            border-right: none; 
        }
        .el-table th, .el-table tr{
            background-color: unset;
        }
        .el-table--striped .el-table__body tr.el-table__row--striped td {
            background: rgb(0 0 0 / 20%);
        }
        .el-table, .el-table__expanded-cell{
            background-color: unset;
        }
        .el-table--border, .el-table--group {
            border: none;
        }
        .el-table--border::after, .el-table--group::after, .el-table::before{
            background-color: unset;
        }
        .el-table td, .el-table th.is-leaf{
            border-bottom: none;
        }
        .el-table--enable-row-hover .el-table__body tr:hover>td {
            background-color: unset;
        }
    }
    .data_list_top{
        width: 450px;
        left: calc(100% - 460px);
    }
    .data_chart{
        position: fixed;
        left: 480px;
        bottom: -100%;
        right: 300px;
        height: 260px;
        transition: all 0.5s;
        #market_chart{
            width: 100%;
            height: 100%;
        }
    }
    .current-row td {
        background-color: #098c80 !important;
        color: #fff;
    }
    
}
.mapboxgl-popup{
    max-width: unset !important;
}
</style>