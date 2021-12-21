<template>
    <div class="gebo_martrix">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="新建" name="create">
                <div class="gebo_option" :style="{height:tableHieght+'px'}">
                    <div class="section">
                        <div class="head_tip">GEBO坐标选择</div>
                        <div class="axisItem" v-for="(item, index) in axisArr" :key="index">
                            <div class="gebo_title">{{ item.title }}</div>
                            <el-popover ref='conditionPopover' placement="bottom-start" width="220" trigger="click">
                                <div class="treeWrap">
                                    <el-tree
                                    :data="filterTree"
                                    :props="defaultProps"
                                    :filter-node-method="filterNode"
                                    :expand-on-click-node="false"
                                    accordion
                                    ref="matrixFilterTree"
                                    node-key="id"
                                    @node-click="chooseTagItem"
                                    ></el-tree>
                                </div>
                                <el-input
                                    class="axisInput"
                                    placeholder="选择或搜索指标"
                                    slot="reference"
                                    @focus="axisIndex(index)"
                                    @input="treeFilter(index)"
                                    v-model="item.name"
                                    size="small"
                                    clearable
                                >
                                </el-input>
                            </el-popover>
                        </div>
                    </div>
                    <div class="section">
                        <div class="head_tip">GEBO配置项</div>
                        <div class="option_item">
                            <div class="gebo_title">时间选择：</div>
                            <div class="gebo_cont">
                                <el-date-picker
                                    v-model="dateRange"
                                    type="monthrange"
                                    size="small"
                                    range-separator="至"
                                    start-placeholder="开始月"
                                    end-placeholder="结束月"
                                    value-format="yyyy-MM"
                                    :picker-options="pickerOptions">
                                </el-date-picker>
                            </div>
                        </div>
                        <div class="option_item">
                            <div class="gebo_title">数据口径：</div>
                            <div class="gebo_cont">
                                <el-radio-group v-model="dataCaliber">
                                    <el-radio label="sub">认购</el-radio>
                                    <el-radio label="record">备案</el-radio>
                                </el-radio-group>
                            </div>
                        </div>
                        <div class="option_item" v-if="showCycle">
                            <div class="gebo_title">成交周期：</div>
                            <div class="gebo_cont">
                                <el-select v-model="dealCycle" placeholder="平均成交量周期" size="small">
                                    <el-option label="3个月" :value="3"></el-option>
                                    <el-option label="6个月" :value="6"></el-option>
                                    <el-option label="12个月" :value="12"></el-option>
                                    <el-option label="18个月" :value="18"></el-option>
                                    <el-option label="24个月" :value="24"></el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="option_item">
                            <div class="gebo_title">建筑形态：</div>
                            <div class="gebo_cont">
                                <el-select size="small" v-model="checkBuildfrom" placeholder="建筑形态" 
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
                        <div class="option_item" v-if="showLanduse">
                            <div class="gebo_title">用地性质：</div>
                            <div class="gebo_cont">
                                <el-select size="small" v-model="checkLanduse" placeholder="用地性质" 
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
                        <div class="option_item">
                            <div class="gebo_title">矩阵色系：</div>
                            <div class="gebo_cont">
                                <div class="color_wrap">
                                    <div class="color_bar"  :style="{background:'linear-gradient(to right,'+circleColor[0]+','+circleColor[1]+','+circleColor[2]+')'}"></div>
                                    <div class="color_box">
                                        <span :style="{ marginLeft: '15px', color: circleColor[0] }">Min</span>
                                        <el-color-picker v-model="circleColor[0]" class="maxColor"></el-color-picker>
                                        <span :style="{ marginLeft: '35px', color: circleColor[1] }">Mid</span>
                                        <el-color-picker v-model="circleColor[1]" class="midColor"></el-color-picker>
                                        <span :style="{ marginLeft: '35px', color: circleColor[2] }">Max</span>
                                        <el-color-picker v-model="circleColor[2]" class="minColor"></el-color-picker>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="option_item">
                            <div class="gebo_title">象限配置：</div>
                            <div class="gebo_cont">
                                <div class="demonstration">
                                    <div class="">{{ check_num + "x" + check_num }}</div>
                                    <el-slider v-model="check_num" :show-tooltip="false" style="width:150px;margin-left:25px"
                                    show-stops :max="6" :min="2">
                                    </el-slider>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="section">
                        <div class="head_tip">板块选择</div>
                        <div class="option_item">
                            <div class="gebo_title">板块：</div>
                            <div class="gebo_cont">
                                <el-select size="small" v-model="checkPlateArr" placeholder="板块选择" 
                                @change="plateChange" multiple collapse-tags filterable>
                                    <el-checkbox style="margin-left:20px;margin-top:6px;" :indeterminate="platesIsAll" v-model="plateAll" @change="plateAllChange">全选</el-checkbox>
                                    <el-option
                                        v-for="item in plateList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>
                    <div class="section">
                        <div class="head_tip">操作</div>
                        <div class="gebo_btns">
                            <el-button size="small" @click="resetGeboData()" :disabled="genLoading">重置</el-button>
                            <el-popover placement="top" width="160" v-model="nameVisible">
                                <p>请输入矩阵名称:</p>
                                <el-input v-model="matrixName" size="small" placeholder="请输入"></el-input>
                                <div style="text-align: right; margin-top:10px;">
                                    <el-button size="mini" type="text" @click="nameVisible = false">取消</el-button>
                                    <el-button type="primary" size="mini" @click="saveGebo()">确定</el-button>
                                </div>
                                <el-button v-if="showGebo" slot="reference" type="success" size="small" @click="nameVisible = true" style="margin-left:10px;">保存</el-button>
                            </el-popover>
                            <el-button type="primary" size="small" @click="setGeboData()" :disabled="genLoading" style="margin-left:10px;">{{genLoading?'生成中':'生成矩阵'}}</el-button>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="已保存" name="saved">
                <div class="gebo_history">
                    <el-table
                        :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
                        class="history_table" style="width: 100%" :height="tableHieght">
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-form label-position="left" class="demo-table-expand">
                                    <el-form-item :label="item.title" v-for="(item,i) in props.row.axis" :key="i">
                                        <el-tag size="small" type="primary">{{ item.name }}</el-tag>
                                    </el-form-item>
                                </el-form>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column label="日期" prop="date" sortable></el-table-column> -->
                        <el-table-column label="名称" prop="name"></el-table-column>
                        <el-table-column align="right" width="150">
                            <template slot="header">
                                <el-input v-model="search" size="mini" placeholder="输入关键字搜索"/>
                            </template>
                            <template slot-scope="scope">
                                <el-button size="mini"
                                @click="deleteMatrix(scope.$index, scope.row)">删除</el-button>
                                <el-button size="mini" type="primary"
                                @click="createMatrix(scope.$index, scope.row)">生成</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-tab-pane>
        </el-tabs>
        <div class="gebo_content" :style="{bottom:showGebo?0:'-100%','left':sidebarW+80+'px'}">
            <Loading v-if="genLoading" class="gen_loading" :loadingText="'矩阵生成中,请等待'" />
            <div id="gebo_box"></div>
            <el-button type="text" class="show_grid_btn" @click="showGrid = true">数据表格</el-button>
        </div>
        <div class="option_box" v-show="showGebo">
            <div class="x_option">
                <span>X轴区间：</span>
                <el-input size="small" v-model="xStart" placeholder="最小值" @blur="rangeChange" style="width:60px;margin-right:10px;"></el-input>
                <el-input size="small" v-model="xEnd" placeholder="最大值" @blur="rangeChange" style="width:60px"></el-input>
            </div>
            <div class="y_option">
                <span>X轴区间：</span>
                <el-input size="small" v-model="yStart" placeholder="最小值" @blur="rangeChange" style="width:60px;margin-right:10px;"></el-input>
                <el-input size="small" v-model="yEnd" placeholder="最大值" @blur="rangeChange" style="width:60px"></el-input>
            </div>
        </div>
        <div class="markline_box" v-show="showGebo">
            <div class="x_markline">
                <span class="markline_title">x轴辅助线</span>
                <el-tag :key="item" v-for="item in xLines" closable :disable-transitions="false" @close="xTagClose(item)">{{item}}</el-tag>
                    <el-input class="input-new-tag" v-if="xInputVisible" v-model="xInputValue" ref="xMarklineInput" size="small"
                    @keyup.enter.native="xInputConfirm" @blur="xInputConfirm"></el-input>
                    <el-button v-else class="button-new-tag" size="mini" @click="xShowInput">+ New</el-button>
            </div>
            <div class="y_markline">
                <span class="markline_title">y轴辅助线</span>
                <el-tag :key="item" v-for="item in yLines" closable :disable-transitions="false" @close="yTagClose(item)">{{item}}</el-tag>
                    <el-input class="input-new-tag" v-if="yInputVisible" v-model="yInputValue" ref="yMarklineInput" size="small"
                    @keyup.enter.native="yInputConfirm" @blur="yInputConfirm"></el-input>
                    <el-button v-else class="button-new-tag" size="mini" @click="yShowInput">+ New</el-button>
            </div>
        </div>
        <div class="grid_box" :style="{right:showGrid?'0':'-100%'}">
            <div class="grid_option">
                <div class="grid_info">x轴：<span class="info">类目轴</span> y轴：<span class="info">数据轴</span></div>
                <div class="grid_btn">
                    <el-upload class="upload_excel" ref="uploadExcel" action
                    accept="csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    :on-change="handleUploadChange" :auto-upload="false" :show-file-list="false">
                        <div class="import_excel" slot="trigger">导入Excel</div>
                    </el-upload>
                    <div class="close_grad" @click="showGrid = false">关闭</div>
                </div>
                </div>
            <hot-table class="chat_table" :settings="hotSettings" :rowHeaders="true" :colHeaders="true"></hot-table>
        </div>
    </div>
</template>
<script>
import * as echarts from 'echarts';
import Loading from "@/components/tools/loading.vue"
//表格组件
import { HotTable } from '@handsontable/vue'
//excel解析
import XLSX from 'xlsx'
import { mapGetters } from 'vuex';
import citymapApi from "@/api/citymapApi"
import ledgerApi from "@/api/ledgerApi"
export default {
    name:'gebo_martrix',
    components:{
        Loading,
        HotTable
    },
    props:{
        curTab:{
            type:String,
            default:''
        },
        sidebarW:{
            type:Number,
            default:300
        },
    },
    data(){
        return {
            maxHeight:window.innerHeight-160,
            activeName:'create',
            plateList:[],//版块列表
            checkPlateArr:[],//选择的板块ID
            filterTree:[ //矩阵选择项
                { id:'market',label:'市场数据',children:[
                    { id:'house_price',label: '住宅价格-元/㎡',unit:'元/㎡' },
                    { id:'turnover',label: '成交量-套',unit:'套' },
                    { id:'turnover_area',label: '成交量-万㎡',unit:'万㎡' },
                    { id:'sale_stock',label: '在售存量-套',unit:'套' },
                    { id:'sale_stock_area',label: '在售存量-万㎡',unit:'万㎡' },
                    { id:'potential_stock',label: '潜在存量-万㎡',unit:'万㎡' },
                    // { id:'ss_depcycle',label: '在售存量去化周期',unit:'月' },
                    { id:'ss_depcycle_area',label: '在售存量去化周期-月',unit:'月' },
                    { id:'ps_depcucle',label: '潜在存量去化周期-月',unit:'月' },
                    { id:'land_price',label: '楼面地价-元/㎡',unit:'元/㎡' },
                    { id:'hl_pricediff',label: '房地价差-元/㎡',unit:'元/㎡' }, //住宅价格-楼面地价
                    { id:'sm_ratio',label: '供销比',unit:'' },
                    { id:'im_ratio',label: '存销比',unit:'' },
                    { id:'hl_ratio',label: '房地比',unit:'',name:'房地比' },
                ] },
                // { id:'matching',label:'配套数据',children:[
                //     { id:'traffic',label: '交通' },
                //     { id:'business',label: '商业' },
                //     { id:'education',label: '教育' },
                //     { id:'resources',label: '资源' }
                // ] },
                // { id:'plan',label:'规划数据',children:[
                //     { id:'enterprise',label: '企业布局' },
                //     { id:'industry',label: '产业规划' },
                //     { id:'space',label: '空间规划' }
                // ] },
            ],
            defaultProps:{
                children: 'children',
                label: 'label'
            },
            myGeboChart:null,
            axisArr: [ //坐标系数据
                { title: "X坐标系：", value: null, name: null, nuit:null },
                { title: "Y坐标系：", value: null, name: null, nuit:null },
                { title: "圆的大小：", value: null, name: null, nuit:null },
                { title: "圆的颜色：", value: null, name: null, nuit:null }
            ],
            axisCurIndex: "", //input focus时选择坐标系的索引
            dateRange:'',//时间范围
            dataCaliber:'sub',//数据口径
            showCycle:false,
            dealCycle:12,//平均成交量周期
            checkBuildfrom:['villa-1-4','heightfloor-5-7','heightfloor-8-11','heightfloor-12-18','heightfloor-19-33','heightfloor-34-99'],//选择的建筑形态
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

            landuseArr:[],//土地性质列表
            checkLanduse:['house','house_commerce','commerce_house','commerce','industry','other'],//选择的土地性质
            landuseIsAll:false,
            landuseAll:true,
            showLanduse:false,//显示土地性质

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
                }]
            },
            circleColor: [ //配置圆的颜色
                "#dd4444", "#ffffff", "#3e8ef7"
            ],
            check_num: 2, //象限值
            
            platesIsAll:false,
            plateAll:true,
            showGebo:false,//显示矩阵图表
            geboData:[],//获取的GEBO二维矩阵数据
            genLoading:false,//生成等待

            //矩阵历史
            nameVisible:false,
            matrixName:'',
            tableHieght:window.innerHeight-140,
            tableData: [
                // {
                //     createDate: '2016-05-02',
                //     name: 'GEBO1',
                //     axis:[{ title: "X坐标系：", value: null, name: null, nuit:null },],
                //     build_form:[],
                //     plate_id:[],
                //     check_num:3,
                //     color:[],
                //     date:[],
                // }
            ],
            search: '',
    
            xStart:'',
            xEnd:'',
            yStart:'',
            yEnd:'',

            //辅助线
            xLines:[],
            xInputVisible:false,
            xInputValue:'',
            yLines:[],
            yInputVisible:false,
            yInputValue:'',
            
            //数据表格
            showGrid:false,
            hotSettings:{
                data: [
                    [null, '邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎',null,null],
                    ["周一", 120, 220, 150, 320, 820],
                    ["周二", 132, 182, 232, 332, 932],
                    ["周三", 101, 191, 201, 301, 901],
                    ["周四", 134, 234, 154, 334, 934],
                    ["周五", 90, 290, 190, 390, 1290],
                    ["周六", 230, 330, 330, 330, 1330],
                    ["周七", 210, 310, 410, 320, 1320]
                ],
                minCols:13,
                minRows:50,
                fixedRowsTop:0,
                fixedRowsLeft:0,
                manualColumnResize: true, // 当值为true时，允许拖动，当为false时禁止拖动
                manualRowResize: true, // 当值为true时，允许拖动，当为false时禁止拖动
                manualColumnMove: true, // 当值为true时，列可拖拽移动到指定列
                manualRowMove: true, // 当值为true时，行可拖拽至指定行
                contextMenu: true,//右键显示更多功能,
                licenseKey:'ab3e4-1bee8-ed01c-4d94b-08cfe', //key
                afterChange:(changes, source) => { //数据改变时触发此方法
                    //console.log(changes,source)
                    //console.log(this.hotSettings.data)
                    if(changes){
                        this.gridSetChart()
                    }
                },
            },
            excelCsvData:'',// 要导入的csv数据
        }
    },
    created(){
        
    },
    mounted(){
        //获取区县市、板块数据
        this.getPlates()
        this.getDict()
    },
    computed:{
        ...mapGetters(['city_map','cityCode'])
    },
    watch:{
        curTab:{
            handler(newVal){
                if(newVal=='gebo'){
                    var map = this.city_map
                    map.setPaintProperty("plates_fill", "fill-color","rgba(58, 88, 125, 1)");
                    map.setPaintProperty("plates_fill", "fill-opacity", 0.2);
                    map.setPaintProperty("plates_line", "line-color", 'rgba(255, 255, 255,1)');
                    map.setPaintProperty("plates_line", "line-opacity", 0.2);
                    this.resetGeboData()
                }
            },
            deep:true
        },
        // check_num:{
        //     handler(newVal){
        //         if(newVal){
        //             this.GeboInit();
        //         }
        //     },
        //     deep:true
        // },
        axisArr:{
            handler(newVal){
                let arr = newVal.filter(item=>item.value=='land_price'||item.value=='hl_pricediff')
                this.showLanduse = arr.length>0
                let arr1 = newVal.filter(item=>item.value=='ss_depcycle_area')
                this.showCycle = arr1.length>0
            },
            deep:true
        },
    },
    methods:{
        //表格变动更改矩阵图表
        gridSetChart(){
            var that = this
            let data = that.hotSettings.data
            let arr = []
            data.forEach((item,i)=>{
                if(i>0){
                    arr.push([item[1]?JSON.parse(item[1]):0,item[2]?JSON.parse(item[2]):0,item[3]?JSON.parse(item[3]):0,item[4]?JSON.parse(item[4]):0,item[0]])
                }
            })
            that.geboData = arr
            that.GeboInit()
        },
        //读取导入的excel数据并存储
        handleUploadChange(e){
            console.log(e)
            let that = this;
            let file = e.raw; // 文件信息
            if (!file) {
                // 没有文件
                return false;
            } else if (!/\.(xls|xlsx)$/.test(file.name.toLowerCase())) {
                // 格式根据自己需求定义
                that.$message.error("上传格式不正确，请上传xls或者xlsx格式");
                return false;
            }

            const fileReader = new FileReader();
            
            fileReader.onload = ev => {
                try {
                    const data = ev.target.result;
                    const workbook = XLSX.read(data, {
                        type: "binary" // 以字符编码的方式解析
                    });
                    const exlname = workbook.SheetNames[0]; // 取第一张表
                    let csv = XLSX.utils.sheet_to_csv(workbook.Sheets[exlname]); // 生成csv
                    console.log(csv)
                    that.excelCsvData = csv

                    //提示是否导入
                    that.$confirm('是否导入excel数据', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }) .then(() => {
                        that.loadExcelData()
                    }) .catch(() => {})
                } catch (e) {
                    console.log("出错了：：");
                    return false;
                }
            };
            fileReader.readAsBinaryString(file);
        },
        //加载csv数据到表格
        loadExcelData(){
            let data = this.excelCsvData
            let rows = data.split('\n')
            rows.pop(); // 最后一行没用的
            let arr = []
            rows.forEach(row=>{
                let rowArr = row.split(',')
                for(let i=0;i<rowArr.length;i++){
                if(rowArr[i]==''){
                    rowArr[i] = null
                }
                }
                arr.push(rowArr)
            })
            console.log(arr)
            this.hotSettings.data = JSON.parse(JSON.stringify(arr))
            this.gridSetChart()
        },
        handleClick(){
            if(this.activeName==='saved'){
                this.setGeboList()
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
        //获取区县市、板块数据
        getPlates(){
            var that = this
            let code = localStorage.getItem('cityCode')
            citymapApi.getCityPlates({landCityno:code?code:'510100'})
            .then(res=>{
                console.log(res)
                if(res.data.code===0){
                    let data = res.data.data
                    let arr = []
                    let idArr = []
                    data.forEach(item=>{
                        arr.push({
                            id:item.id,
                            name:item.name,
                            center:item.center
                        })
                        idArr.push(item.id)
                    })
                    that.plateList = arr
                    that.checkPlateArr = idArr
                }
            })
        },
        //搜索筛选项
        filterNode(value, data) {
            if (!value) return true;
            if (data.label.indexOf(value) !== -1) {
                return true;
            }
            return false;
        },
        //选择GEBO条件项
        chooseTagItem(data) {
            //选择指标项
            console.log(data);
            if(data.id=='market'||data.id=='plan'){
                this.$message('请选择子项')
                return 
            }
            let i = this.axisCurIndex;
            let curItem = this.axisArr.filter(item => {
                return item.value === data.id;
            });
            if (curItem.length > 0) {
                //已存在选择的筛选项
                this.$message("已选择该项");
            } else {
                this.axisArr[i].name = data.label;
                this.axisArr[i].value = data.id;
                this.axisArr[i].unit = data.unit?data.unit:null;
                
                this.$refs.conditionPopover[this.axisCurIndex].showPopper = false;
            }
        },
        //当前更改的坐标系索引
        axisIndex(index) {
            console.log(index);
            this.axisCurIndex = index;
        },
        //树结构筛选
        treeFilter(i) {
            let name = this.axisArr[i].name;
            this.$refs.matrixFilterTree[i].filter(name); //此处多个filterItemTree树结构，需指定索引去筛选节点
            console.log(this.axisArr);
            //内容清空时重置数据
            if (name == "") {
                this.axisArr[i].name = null;
                this.axisArr[i].value = null;
            }
        },
        //板块选择
        plateChange(val){
            let arr = []
            this.plateList.forEach(item=>{
                arr.push(item.id)
            })
            let checkedCount = val.length;
            this.plateAll = checkedCount === arr.length;
            this.platesIsAll = checkedCount > 0 && checkedCount < arr.length;
        },
        //板块全选全部选
        plateAllChange(val){
            let arr = []
            this.plateList.forEach(item=>{
                arr.push(item.id)
            })
            this.checkPlateArr = val?arr:[]
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
        //重置配置
        resetGeboData(){
            this.axisArr = [
                { title: "X坐标系：", value: null, name: null, nuit:null },
                { title: "Y坐标系：", value: null, name: null, nuit:null },
                { title: "圆的大小：", value: null, name: null, nuit:null },
                { title: "圆的颜色：", value: null, name: null, nuit:null }
            ]
            this.axisCurIndex = ''
            this.dateRange = ''
            this.circleColor = ["#dd4444", "#ffffff", "#3e8ef7"]
            this.check_num = 2
            this.showGebo = false
            this.geboData = []
            let idArr = []
            this.checkBuildfrom = ['villa-1-4','heightfloor-5-7','heightfloor-8-11','heightfloor-12-18','heightfloor-19-33','heightfloor-34-99']
            this.checkLanduse = ['house','house_commerce','commerce_house','commerce','industry','other']
            this.plateList.forEach(item=>{
                idArr.push(item.id)
            })
            this.checkPlateArr = idArr
            this.platesIsAll = false
            this.plateAll = true
            this.showGebo = false
        },
        //设置GEBO数据
        setGeboData(){
            var that = this
            //矩阵生成条件判断(x,y已选择，大小颜色至少选择一个)
            let flag = this.axisArr[0].value != null && this.axisArr[1].value != null;
            if(!flag||this.checkPlateArr.length==0){
                this.$message(!flag?'至少选择xy坐标系':'请选择板块')
                return
            }
            //市场数据请求
            let marketArr = []
            this.filterTree[0].children.forEach(item=>{
                marketArr.push(item.id)
            })
            let marketValStr = ''
            this.axisArr.forEach(item=>{
                if(marketArr.includes(item.value)){
                    marketValStr += (item.value+',')
                }
            })
            if(marketValStr!==''){ //有市场指标
                if(this.dateRange===''){
                    this.$message('请选择时间')
                    return 
                }else{
                    let IdsStr = ''
                    this.checkPlateArr.forEach(item=>{
                        IdsStr += (item+',')
                    })
                    //建筑形态
                    let buildFormStr = ''
                    that.checkBuildfrom.forEach(item=>{
                        buildFormStr += (item+',')
                    })
                    let obj = {
                        landCityno:this.cityCode,
                        buildForms:buildFormStr,
                        startDate:this.dateRange[0],
                        endDate:this.dateRange[1],
                        calKey:marketValStr,
                        partId:IdsStr,
                        status:that.dataCaliber
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
                    that.genLoading = true
                    citymapApi.getMarketData(obj)
                    .then(res=>{
                        console.log('楼盘的市场数据',res)
                        if(res.data.code===0){
                            let data = res.data.data.codeList
                            console.log(data)
                            let dataArr = []
                            let dataGridArr = []
                            let converseArr = ['turnover_area','sale_stock_area','potential_stock'] //需转换单位
                            that.plateList.forEach(item=>{
                                if(that.checkPlateArr.includes(item.id)){
                                    let xObj = data[that.axisArr[0].value]
                                    let yObj = data[that.axisArr[1].value]
                                    let sObj = data[that.axisArr[2].value]
                                    let cObj = data[that.axisArr[3].value]
                                    let xFlag = converseArr.includes(that.axisArr[0].value)
                                    let yFlag = converseArr.includes(that.axisArr[1].value)
                                    let sFlag = converseArr.includes(that.axisArr[2].value)
                                    let cFlag = converseArr.includes(that.axisArr[3].value)
                                    dataArr.push([
                                        xObj!==undefined&&xObj[item.id]!==undefined?(xFlag?(JSON.parse(xObj[item.id]/10000).toFixed(2)):xObj[item.id]):0,
                                        yObj!==undefined&&yObj[item.id]!==undefined?(yFlag?(JSON.parse(yObj[item.id]/10000).toFixed(2)):yObj[item.id]):0,
                                        sObj!==undefined&&sObj[item.id]!==undefined?(sFlag?(JSON.parse(sObj[item.id]/10000).toFixed(2)):sObj[item.id]):0,
                                        cObj!==undefined&&cObj[item.id]!==undefined?(cFlag?(JSON.parse(cObj[item.id]/10000).toFixed(2)):cObj[item.id]):0,
                                        item.name
                                    ])
                                    dataGridArr.push([
                                        item.name,
                                        xObj!==undefined&&xObj[item.id]!==undefined?(xFlag?(JSON.parse(xObj[item.id]/10000).toFixed(2)):xObj[item.id]):0,
                                        yObj!==undefined&&yObj[item.id]!==undefined?(yFlag?(JSON.parse(yObj[item.id]/10000).toFixed(2)):yObj[item.id]):0,
                                        sObj!==undefined&&sObj[item.id]!==undefined?(sFlag?(JSON.parse(sObj[item.id]/10000).toFixed(2)):sObj[item.id]):0,
                                        cObj!==undefined&&cObj[item.id]!==undefined?(cFlag?(JSON.parse(cObj[item.id]/10000).toFixed(2)):cObj[item.id]):0,
                                        
                                    ])
                                }
                            })
                            let gridHead = ['板块',this.axisArr[0].name,this.axisArr[1].name,this.axisArr[2].name,this.axisArr[3].name]
                            dataGridArr.unshift(gridHead)
                            that.hotSettings.data = dataGridArr
                            console.log('gebo二维矩阵数据',dataArr)
                            that.xLines = []
                            that.yLines = []
                            that.geboData = dataArr
                            that.GeboInit()
                            that.genLoading = false
                        }else{
                            that.$message.error(res.data.msg)
                            that.genLoading = false
                        }
                    })
                }
            }
            
        },
        //渲染gebo矩阵
        GeboInit(){
            var that= this
            let data = this.geboData
            //求出个坐标系的最大值和最小值
            let col_1 = [];
            let col_2 = [];
            let col_3 = [];
            let col_4 = [];
            data.forEach(item => {
                col_1.push(item[0]);
                col_2.push(item[1]);
                col_3.push(item[2]);
                col_4.push(item[3]);
            });
            let max_1 = Math.max.apply(null, col_1);
            let min_1 = Math.min.apply(null, col_1);
            let max_2 = Math.max.apply(null, col_2);
            let min_2 = Math.min.apply(null, col_2);
            let max_3 = Math.max.apply(null, col_3);
            let min_3 = Math.min.apply(null, col_3);
            let max_4 = Math.max.apply(null, col_4);
            let min_4 = Math.min.apply(null, col_4);

            this.xStart = min_1
            this.xEnd = max_1
            this.yStart = min_2
            this.yEnd = max_2
            //划分象限
            let num = this.check_num;
            let xAverage = JSON.parse((max_1 / num).toFixed(2));
            let yAverage = JSON.parse((max_2 / num).toFixed(2));
            let xlineData = [];
            let ylineData = [];
            for (let i = 0; i < num - 1; i++) {
                let objx = {
                    xAxis: (i + 1) * xAverage
                };
                let objy = {
                    yAxis: (i + 1) * yAverage
                };
                xlineData.push(objx);
                ylineData.push(objy);
            }
            let lineData = xlineData.concat(ylineData);

            var itemStyle = {
                opacity: 0.8,
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowColor: "rgba(0, 0, 0, 0.2)"
            };
            var schema = this.axisArr;
            var option = {
                backgroundColor: "#171616",
                toolbox: {
                show: true,
                //orient: 'vertical',
                left: "right",
                top: "top",
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    saveAsImage: { show: true },
                    dataView : {
                    show: true,                
                    readOnly: true,
                    optionToContent : opt => {
                        console.log(opt);
                        var series = opt.series[0].data;
                        var tdHeaders = ''; //表头
                        this.axisArr.forEach( item => {
                        tdHeaders += '<th>' + (item.value!==null?item.name:'暂无') + '</th>'; //组装表头
                        });
                        tdHeaders += '<th>板块</th>'
                        var table = '<div class="table-responsive"><table class="table table-bordered table-striped table-hover" style="text-align:center"><tbody><thead><tr>' + tdHeaders + '</tr></thead>';
                        var tdBodys = '<tbody>'; //数据
                        for (var i = 0, l = series.length; i < l; i++) {
                        let trBody = '<tr>'
                        for (var j = 0; j < series[i].length; j++) {
                            trBody += '<td style="padding: 5px 20px">' + series[i][j] + '</td>'; //组装表数据
                        }
                        tdBodys += (trBody + '</tr>');
                        }
                        table += tdBodys+'</tbody></table></div>';
                        return table;
                    }
                    },
                }
                },
                tooltip: {
                    padding: 10,
                    backgroundColor: "rgba(33,33,33,0.8)",
                    formatter: function(obj) {
                        var value = obj.value;
                        return (
                        `<div class="info_box">
                            <div style="font-size: 14px;padding-bottom: 7px;margin-bottom: 7px;color:#fff">片区：${value[4]}</div>
                            <p style="color:#e6a23c;font-size:12px;">${schema[0].name?schema[0].name:'暂无'}：${value[0]} ${that.axisArr[0].unit?that.axisArr[0].unit:''}</p>
                            <p style="color:#67C23A;font-size:12px;">${schema[1].name?schema[1].name:'暂无'}：${value[1]} ${that.axisArr[1].unit?that.axisArr[1].unit:''}</p>
                            <p style="color:#46c5ff;font-size:12px;">${schema[2].name?schema[2].name:'暂无'}：${value[2]} ${that.axisArr[2].unit?that.axisArr[2].unit:''}</p>
                            <p style="color:#f56c6c;font-size:12px;">${schema[3].name?schema[3].name:'暂无'}：${value[3]} ${that.axisArr[3].unit?that.axisArr[3].unit:''}</p>
                        </div>`
                        );
                    }
                },
                xAxis: {
                    type: "value",
                    min: 0,
                    max: max_1,
                    name: schema[0].name,
                    nameGap: 16,
                    nameTextStyle: {
                        color: "#9ca7ab",
                        fontSize: 14
                    },
                    axisLine: {
                        lineStyle: {
                        color: "#9ca7ab"
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                        type: "dashed",
                        color: "#252c31"
                        }
                }
                },
                yAxis: {
                    type: "value",
                    min: 0,
                    max: max_2,
                    name: schema[1].name,
                    nameLocation: "end",
                    nameGap: 20,
                    nameTextStyle: {
                        color: "#9ca7ab",
                        fontSize: 14
                    },
                    axisLine: {
                        lineStyle: {
                        color: "#9ca7ab"
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                        type: "dashed",
                        color: "#252c31"
                        }
                    }
                },
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
                },
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
                    yAxisIndex: [0],
                    left: "5%"
                },
                {
                    type: "inside",
                    xAxisIndex: [0]
                },
                {
                    type: "inside",
                    yAxisIndex: [0]
                }
                ],
                visualMap: [
                {
                    //圆的大小
                    show: schema[2].value === null ? false : true,
                    right: '0%',
                    top: '10%',
                    dimension: 2,
                    min: min_3,
                    max: max_3,
                    itemWidth: 30,
                    itemHeight: 120,
                    calculable: true,
                    precision: 0.1,
                    text: ["大小：" + schema[2].name],
                    textGap: 30,
                    textStyle: {
                    color: "#9ca7ab"
                    },
                    inRange: {
                        symbolSize: [10, 70]
                    },
                    outOfRange: {
                        symbolSize: [10, 70],
                        color: ['rgba(255,255,255,0.4)']
                    },
                    controller: {
                        inRange: {
                            color: ['#c23531']
                        },
                        outOfRange: {
                            color: ['#999']
                        }
                    }
                },
                {
                    //圆的颜色
                    show: schema[3].value === null ? false : true,
                    right: '0%',
                    bottom: '20%',
                    dimension: 3,
                    min: min_4,
                    max: max_4,
                    itemWidth: 30,
                    itemHeight: 120,
                    calculable: true,
                    precision: 'auto',
                    text: ["颜色：" + schema[3].name],
                    textGap: 30,
                    textStyle: {
                    color: "#9ca7ab"
                    },
                    inRange: {
                        color: this.circleColor
                    },
                    outOfRange: {
                        color: ["rgba(255,255,255,0)"]
                    },
                    controller: {
                    inRange: {
                        color: this.circleColor
                    },
                    outOfRange: {
                        color: ["#666"]
                    }
                    }
                }
                ],
                series: [
                    {
                        type: "scatter",
                        itemStyle: itemStyle,
                        data: data,
                        symbolSize: 25,
                        markLine: {
                            lineStyle: {
                                type: "dashed",
                                color: "#46c5ff"
                            },
                            symbol: "none",
                            data: lineData
                        },
                        label: {
                            formatter: "{@[4]}",
                            position: "bottom",
                            show: true,
                            color: "#7cb5ff",
                            emphasis: {
                                show: true
                            }
                        },
                        itemStyle: {
                            color: "#7cb5ff",
                            position: "right",
                            show: true
                        },
                        large: true
                    }
                ]
            };
            if(this.myGeboChart==null){
                var chartDom = document.getElementById('gebo_box');
                this.myGeboChart = echarts.init(chartDom);
            }
            option && this.myGeboChart.setOption(option);
            window.addEventListener("resize", this.myGeboChart.resize);
            this.showGebo = true
        },
        //保存gebo矩阵参数
        saveGebo(){
            var that = this
            if(that.matrixName===''){
                that.$message('请先输入矩阵名称')
            }else{
                let build_form = ''
                that.checkBuildfrom.forEach(item=>{
                    build_form += item+','
                })
                let plate_id = ''
                that.checkPlateArr.forEach(item=>{
                    plate_id += item+','
                })
                let obj = {
                    name:that.matrixName,
                    axis:JSON.stringify(that.axisArr), //象限
                    date:JSON.stringify(that.dateRange), //时间范围
                    build_form:build_form, //建筑形态
                    plate_id:plate_id, //板块ID
                    color:JSON.stringify(that.circleColor), //色系
                    check_num:that.check_num //象限
                }
                citymapApi.saveGeboInfo(obj)
                .then(res=>{
                    if(res.data.code===0){
                        that.$message.success('矩阵已保存')
                    }else{
                        that.$message.error(res.data.msg)
                    }
                })
            }
        },
        //设置矩阵列表
        setGeboList(){
            var that = this
            citymapApi.getGeboList()
            .then(res=>{
                if(res.data.code===0){
                    console.log('矩阵列表',res.data)
                    let data = res.data.data
                    let arr = []
                    data.forEach(item=>{
                        let createDate = item.createDate.split(' ')
                        let build_form = item.buildForm.split(',')
                        build_form.pop()
                        let plate_id = item.plateId.split(',')
                        plate_id.pop()
                        let obj = {
                            id:item.id,
                            name:item.name,
                            createDate:createDate[0],
                            axis:JSON.parse(item.axis),
                            build_form:build_form,
                            plate_id:plate_id,
                            check_num:item.checkNum,
                            color:JSON.parse(item.color),
                            date:JSON.parse(item.date)
                        }
                        arr.push(obj)
                    })
                    that.tableData = arr
                }else{
                    that.$message.error(res.data.msg)
                }
            })
        },
        //删除历史矩阵
        deleteMatrix(index,item){
            var that = this
            that.$confirm('是否删除该矩阵？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }) .then(() => {
                citymapApi.delMatrix([item.id])
                .then(res=>{
                if(res.data.code===0){
                    that.$message.success('矩阵已删除')
                    that.setGeboList()
                }else{
                    that.$message.error(res.data.msg)
                }
                })
            }) .catch(() => {})
        },
        //生成历史矩阵
        createMatrix(index,item){
            console.log(index,item)
            this.axisArr = item.axis
            this.dateRange = item.date
            this.checkBuildfrom = item.build_form
            this.circleColor = item.color
            this.check_num = JSON.parse(item.check_num)
            this.setGeboData()
        },
        //xy轴区间手动改变
        rangeChange(){
            this.myGeboChart.setOption({
                dataZoom:[
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
                        bottom: 5,
                        startValue:this.xStart,
                        endValue:this.xEnd,
                    },
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
                        yAxisIndex: [0],
                        left: "5%",
                        startValue:this.yStart,
                        endValue:this.yEnd,
                    },
                    {
                        type: "inside",
                        xAxisIndex: [0],
                        startValue:this.xStart,
                        endValue:this.xEnd,
                    },
                    {
                        type: "inside",
                        yAxisIndex: [0],
                        startValue:this.yStart,
                        endValue:this.yEnd,
                    }
                ]
            })
        },
        //x轴标注线操作
        xTagClose(tag) {
            this.xLines.splice(this.xLines.indexOf(tag), 1);
            this.setChartMarkline();
        },

        xShowInput() {
            this.xInputVisible = true;
            this.$nextTick(_ => {
            this.$refs.xMarklineInput.$refs.input.focus();
            });
        },

        xInputConfirm() {
            let inputValue = this.xInputValue;
            if (inputValue) {
                this.xLines.push(inputValue);
                this.setChartMarkline();
            }
            this.xInputVisible = false;
            this.xInputValue = '';
        },
        //y轴标注线操作
        yTagClose(tag) {
            this.yLines.splice(this.yLines.indexOf(tag), 1);
            this.setChartMarkline();
        },

        yShowInput() {
            this.yInputVisible = true;
            this.$nextTick(_ => {
            this.$refs.yMarklineInput.$refs.input.focus();
            });
        },

        yInputConfirm() {
            let inputValue = this.yInputValue;
            if (inputValue) {
                this.yLines.push(inputValue);
                this.setChartMarkline();
            }
            this.yInputVisible = false;
            this.yInputValue = '';
        },
        //设置辅助线
        setChartMarkline(){
            let lineData = []
            this.xLines.forEach(item=>{
                lineData.push({
                    xAxis:item
                })
            })
            this.yLines.forEach(item=>{
                lineData.push({
                    yAxis:item
                })
            })
            this.myGeboChart.setOption({
                series:{markLine:{
                    lineStyle: {
                        type: "dashed",
                        color: "#46c5ff"
                    },
                    symbol: "none",
                    data: lineData
                }}
            })
        },
    }
}
</script>
<style src="@/assets/css/handsontable.full.css"></style>
<style lang="scss">
.gebo_martrix{
    overflow-y: scroll;
    .gebo_content{
        position: fixed;
        left: 380px;
        right: 0px;
        bottom: -100%;
        height: 100%;
        background: #171616;
        display: flex;
        justify-content: center;
        align-items: center;
        // transition: all 0.5s;
        border-left: rgb(74 74 74 / 63%) 1px solid;
        .gen_loading{
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
        }
        #gebo_box{
            width: 90%;
            height: 90%;
        }
        .show_grid_btn{
            position: absolute;
            right: 145px;
            top: 40px;
        }
    }
    .head_tip{
        padding: 10px 20px;
        color: #fff;
        border-bottom: #383c48 1px solid;
        margin-bottom: 10px;
    }
    .gebo_title{
        width: 35%;
        color: #e6a23c;
        text-align: right;
    }
    .gebo_option{
        overflow-y: scroll;
        .section{
            .axisItem {
                display: flex;
                margin-left: 15px;
                font-size: 12px;
                align-items: center;
                margin-bottom: 10px;
                .axisInput{
                    width: 90%;
                }
                .el-input__inner {
                    border: 1px solid #383c48;
                    cursor: pointer;
                    color: #484548;
                }
            }
            .gebo_btns{
                display: flex;
                justify-content: flex-end;
                margin-top: 20px;
            }
        }
        .option_item{
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            .el-input.is-disabled .el-input__inner{
                background-color: #585858;
            }
        }
        .demonstration{
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #fff;
        }
        .gebo_cont{
            width: 68%;
            .el-range-editor--small.el-input__inner{
                width: 100%;
            }
        }
        .color_wrap{
            position: relative;
            font-size: 12px;
            margin: 0 15px;
            .color_bar{
                height: 15px;
                width: 80%;
                margin: auto;
                border-radius: 14px;
                opacity: 0.8;
                margin-top: 18px;
            }
            .color_box{
                display: flex;
                align-items: center;
                margin-top: 5px;
            }
            .maxColor {
                position: absolute;
                left: 10px;
                top: 0;
                top: -5px;
                opacity: 0;
            }
            .midColor {
                position: absolute;
                left: 48px;
                top: -5px;
                opacity: 0;
            }
            .minColor {
                position: absolute;
                left: 86px;
                top: -5px;
                opacity: 0;
            }
            .el-color-picker__trigger{
                width: 53px;
            }
        }
    }
    .gebo_history{
        .el-form-item{
            margin-bottom: 0;
        }
        .el-table{
            color: #e8edf6;
        }
        .el-table thead{
            color: #fff;
        }
        .el-table, .el-table__expanded-cell {
            background-color: unset;
        }
        .el-table td, .el-table th.is-leaf {
            border-bottom: 1px solid #454f5e;
        }
        .el-table--enable-row-hover .el-table__body tr:hover>td {
            background-color: unset;
        }
        .el-form-item__label{
            color: #ffbd59;
        }
        .el-table th, .el-table tr {
            background-color: unset;
        }
        .el-table::before{
            background-color: unset;
        }
    }
    .option_box{
        color: #fff;
        .y_option{
            position: fixed;
            top: 10px;
            left: 400px;
        }
        .x_option{
            position: fixed;
            right: 10px;
            bottom: 10px;
        }
        .el-input__inner{
            background: none;
            border: none;
            border-radius: unset;
            border-bottom: #ff9800  1px solid;
            padding: 0 10px;
            color: #72d3ff;
        }
    }
    .markline_box{
        .markline_title{
            color: #fff;
            margin-right: 20px;
        }
        .x_markline{
            position: fixed;
            bottom: 10px;
            left: 400px;
            display: flex;
            align-items: center;
        }
        .y_markline{
            position: fixed;
            top: 10px;
            left: 650px;
            display: flex;
            align-items: center;
        }
        .el-tag + .el-tag {
            margin-left: 10px;
        }
        .button-new-tag {
            margin-left: 10px;
            height: 32px;
            line-height: 30px;
            padding-top: 0;
            padding-bottom: 0;
        }
        .input-new-tag {
            width: 90px;
            margin-left: 10px;
            vertical-align: bottom;
        }
    }
    .grid_box{
        position: fixed;
        width: 30%;
        right: -100%;
        top: 0;
        bottom: 0;
        z-index: 99;
        background: #373941;
        transition: all 0.5s;
        .grid_option{
            background: #4c4e59;
            height: 5%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 10px;
            border-radius: 5px 5px 0 0;
            .grid_info{
                color: #fff;
                font-size: 14px;
            .info{
                color: rgb(250, 198, 57);
            }
            }
            .grid_btn{
                display: flex;
            }
            .import_excel,.close_grad{
                padding: 5px 10px;
                cursor: pointer;
                background: rgb(25, 124, 182);
                font-size: 12px;
                margin-left: 10px;
                user-select: none;
                color: #fff;
                border-radius: 3px;
            }
        }
        .chat_table{
            width: 100%;
            height: 95%;
            overflow: hidden;;
        }
    }
}
</style>