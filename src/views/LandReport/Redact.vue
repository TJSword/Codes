<template>
    <div class="landReport">
        <div class="toggle_wrap" @click="showMenu">
           <i :class="['btn',isShowMenu?'el-icon-s-fold':'el-icon-s-unfold']"></i>
        </div>
      <TreeMenu :class="['tree_list',isShowMenu?'tree_list_active':'']" :reportId='reportId' :page_id="pageId" @sendRootNodeArr="setRootNodeArr" @sendPageLabel="setPageLabel" v-if="isShowTree"></TreeMenu>
      
      <el-drawer
        :visible.sync="showNote"
        :with-header="false"
        :modal-append-to-body="false"
        size="300px">
        <div class="note_box">
            <div class="note_title">备注</div>
            <div class="notes">
                <div class="notes_item" v-for="(item,index) in notes" :key="item.tid">
                    <span class="item_info">{{index+1 + '.'}}{{item.remark}}</span>
                    <i class="el-icon-edit" @click="updateRemark(index)"></i>
                    <i class="el-icon-delete" @click="deleteRemark(index)"></i>
                </div>
            </div>
            <div class="editing_box">
                <el-input
                    type="text"
                    placeholder="请输入内容"
                    v-model="note"
                    maxlength="100"
                    show-word-limit
                    size="medium"
                    rows="4"
                    ref="textarea"
                >
                </el-input>
                <el-button class="upload_btn"  type="primary" size="medium" @click="addRemark">备注</el-button>
            </div>
        </div>
      </el-drawer>
       <el-drawer
        :visible.sync="showEcharts"
        :with-header="false"
        :modal-append-to-body="false"
        size="300px">
        <div class="echarts_box" :style="{height:echartsBoxHeight / 0.9 + 'px'}">
            <div class="echarts_title">添加图表</div>
            <div class="echarts_list" :style="{height:echartsBoxHeight + 'px'}">
                <div class="echarts_item" v-for="(item,index) in chartsList" :key="index" @click="chooseChart(item)">
                    <!-- <img :src="item.cover" class="echarts_pic"/> -->
                    <div class="ehcarts_name">{{item.name}}</div>
                </div>
            </div>
        </div>
      </el-drawer> 
      <el-drawer
        :visible.sync="showMaps"
        :with-header="false"
        :modal-append-to-body="false"
        size="300px">
        <div class="echarts_box" :style="{height:echartsBoxHeight / 0.9 + 'px'}">
            <div class="echarts_title">添加地图</div>
            <div class="echarts_list" :style="{height:echartsBoxHeight + 'px'}">
                <div class="echarts_item" v-for="(item,index) in mapsList" :key="index" @click="chooseMap(item)">
                    <!-- <img :src="item.cover" class="echarts_pic"/> -->
                    <div class="ehcarts_name">{{item.name}}</div>
                </div>
            </div>
        </div>
      </el-drawer>
      <el-drawer
        :visible.sync="showTables"
        :with-header="false"
        :modal-append-to-body="false"
        size="300px">
        <div class="echarts_box" :style="{height:echartsBoxHeight / 0.9 + 'px'}">
            <div class="echarts_title">添加表格</div>
            <div class="echarts_list" :style="{height:echartsBoxHeight + 'px'}">
                <div>
                    <label>行数:</label>
                    <el-input v-model="tableColRow.row"></el-input>
                </div> 
                <div>
                    <label>列数:</label>
                    <el-input v-model="tableColRow.col"></el-input>
                </div> 
                <el-button size="small" @click="chooseTable()">确定</el-button>
            </div>
        </div>
      </el-drawer> 
       <div id="edit_box">
           <div id="edit_page" :style="{width:edit_width + 'px',height:edit_height + 'px',left:isShowMenu?'300px':edit_left+'px'}" @contextmenu.prevent.self="showRightClickMenu" @click.stop.self="hideAllMenu">
               <div class="page_name_edit">
                   <Reveal :text="pageName" />
               </div>
               <div class="icon_box">
                    <el-tooltip class="item" effect="dark" content="编辑备注" placement="right">
                        <div class="icon_wrap">
                            <i class="iconfont icon-beizhu" @click="showNote = true"></i>
                        </div>
                    </el-tooltip>
                     <el-tooltip class="item" effect="dark" content="当前页保存" placement="right">
                        <div class="icon_wrap">
                            <i class="iconfont icon-shangchuan" @click="saveReportInfo"></i>
                        </div>
                    </el-tooltip>
                     <el-tooltip class="item" effect="dark" content="上一页" placement="right">
                        <div class="icon_wrap">
                            <i class="iconfont icon-shangyiye" @click="pageUp"></i>
                       </div>
                    </el-tooltip>
                     <el-tooltip class="item" effect="dark" content="下一页" placement="right">
                        <div class="icon_wrap">
                            <i class="iconfont icon-xiayiye"  @click="pageDown"></i>
                        </div>
                    </el-tooltip>
               </div>
               <!-- 富文本编辑器 -->
               <div id="editor_box" v-show="showEditor" :style="{left:posX + 'px',top:posY-100 + 'px'}" ref="editorBox">
                   <ElementTiptap height="350px" width="100%" lang="zh" v-model="htmlContent" @onUpdate="onEditorUpdate" :extensions="extensions" />
               </div>
               <div id="transverseLine" :style="{top:transverseTop + 'px'}" @click="transverseTop = -1000"></div>
               <div id="verticalLine" :style="{left:verticalLeft + 'px'}" @click="verticalLeft = -1000"></div>
               <VueDragResize 
                v-for="(item,index) in domArr"  
                :key="item.tid" 
                :w="item.w"
                :h="item.h"
                :x="item.x"
                :y="item.y" 
                :dragHandle='domType(item.type)?".drag_handle_icon":""'
                @dragging="resize($event,index)" 
                :isActive="chooseDeletIndex===index" 
                @resizing="resize($event,index)"
                @clicked.self='showEdiBar(index,item.type)'
                :aspectRatio="shiftDown">  
                    <!-- Dom移动抓手 -->
                    <div v-if="domType(item.type)" class="drag_handle">
                        <i class="drag_handle_icon el-icon-rank"></i>
                    </div>
                    <!-- 文本 -->
                    <div class="dom_text" v-if="item.type ==='text'" v-html="item.content" style="white-space:wrap;" @dblclick.self="showEdiBar(index)"></div>
                    <!-- 图表 -->
                    <div v-if="item.type === 'chart'" class="item_wrap" style="height:100%;width:100%">
                        <ReportAddChart :dataInfo="item" :reportId="reportId" @putChartOption="val=>setChartOption(val,index)" />
                    </div>
                    <!-- 表格 -->
                    <div v-if="item.type === 'table'" class="item_wrap" style="height:100%;width:100%">
                        <ReportAddTable :colrow="item.content" @tableData="val=>setTableData(val,index)"  />
                    </div>
                    <!-- 地图 -->
                    <div v-if="item.type === 'map'" class="item_wrap" style="height:100%;width:100%">
                        <ReportAddMap :reportId="reportId" :mapInfo="item"  @setMapObj="setMap" @savePlanPoints="setPlanPoints" style="width:100%;height:100%" />
                    </div>
                    <!-- 竞品分布 -->
                    <div v-if="item.type === 'jpfb'" class="item_wrap" style="height:100%;width:100%;background:#fff;">
                        <CdInfos :reportId="reportId" :propertyType="item.content" />
                    </div>
                    <!-- 去化、销量 -->
                    <div v-if="item.type === 'qhxl'" class="item_wrap" style="height:100%;width:100%;background:#fff;">
                        <CdSalse :reportId="reportId" :propertyType="item.content" />
                    </div>
                    <!-- 户配逻辑 -->
                    <div v-if="item.type === 'hplj'" class="item_wrap" style="height:100%;width:100%;background:#fff;">
                        <HouseRatio :reportId="reportId" :propertyType="item.content" />
                    </div>
                    <!-- 价格拟合 -->
                    <div v-if="item.type === 'jgnh'" class="item_wrap" style="height:100%;width:100%;background:#fff;">
                        <PriceFitting :reportId="reportId" :propertyType="item.content" />
                    </div>
                    <div v-if="item.type === 'img'" style="height:100%;width:100%;overflow:hidden">
                        <img :src="item.content" alt="" style="height:100%;width:100%">
                    </div>
               </VueDragResize>
           </div>
       </div>
       <div id="picture_plaza" :class="[showPicPlaza?'showPicPlaza':'']">
           <div :class="['picture_box',showPicPlaza?'picture_box_active':'']">
               <div class='close_box'> 
                   <i class="iconfont icon-guanbi" @click="showPicPlaza = false"></i>
                </div>
               <div class="title_box">
                   <div class="title_cn">图片广场</div>
                   <div class="title_en">PICTURE PLAZA</div>
               </div>
               <div class="pic_box">
                  <vue-waterfall-easy :imgsArr="imgsArr"  @click="clickFn">
                      <div class="img-op" slot-scope="props">
                          <i class="el-icon-close" @click.stop="deleteImg(props)"></i> 
                      </div>
                  </vue-waterfall-easy>
               </div>
               <div class="btn_box">
                   <el-upload
                        :action="imgUploadURL + '/lms/tdky/usematerial/upload'"
                        :before-upload="beforePicUpload"
                        accept="image/png, image/jpeg"
                        :on-success ='uploadSuccess'
                        :show-file-list="false"
                        :headers="{token:token}"
                        >
                        <el-button type="primary"><i class="el-icon-upload el-icon--left"></i>本地上传</el-button>
                    </el-upload>
               </div>
           </div>
       </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
    ElementTiptap,
    // 需要的 extensions
    Doc,
    Text,
    FontSize,
    FontType,
    TextColor,
    TextHighlight,
    Paragraph,
    Heading,
    Bold,
    Underline,
    Italic,
    Strike,
    Link,
    // ListItem,
    // BulletList,
    // OrderedList,
    // TodoList,
    // TodoItem,
    Table,
    TableRow,
    TableHeader,
    TableCell,
    TextAlign,
    LineHeight,
    Indent,
    HorizontalRule,
    History
} from 'element-tiptap';
import LandReport from "@/api/LandReportApi" //引入api
import Reveal from '@/components/tools/reveal' //文字展示鲜果
import VueDragResize from "vue-drag-resize";
import vueWaterfallEasy from 'vue-waterfall-easy' //瀑布流
import TreeMenu from '@/components/main/landReport/TreeMenu'
import ReportAddMap from "@/views/LandReport/ReportAddMap" //报告地图
import ReportAddChart from '@/views/LandReport/ReportAddChart' //图表组件
import ReportAddTable from '@/views/LandReport/ReportAddTable' //表格组件
//户配逻辑
import HouseRatio from '@/views/LandReport/HouseRatio'
//价格拟合
import PriceFitting from '@/views/LandReport/PriceFitting'
//竞品信息
import CdInfos from '@/views/LandReport/CdInfos'
//竞品去化销量
import CdSalse from '@/views/LandReport/CdSales'
//组件
export default {
    name:'Redact',
    components:{
        ElementTiptap,
        
        Reveal,
        VueDragResize,
        vueWaterfallEasy,
        TreeMenu,
        ReportAddMap,
        ReportAddChart,
        ReportAddTable,
        HouseRatio,
        PriceFitting,
        CdInfos,
        CdSalse,
    },
    data(){
        return{
            extensions: [
                new Doc(),
                new Text(),
                new FontSize(),
                new FontType(),
                new TextColor(),
                new TextHighlight(),
                new Paragraph(),
                new Heading({ level: 5 }),
                new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
                new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
                new Italic(),
                new Strike(),
                new Link(),
                // new ListItem(),
                // new BulletList(),
                // new OrderedList(),
                // new TodoList(),
                // new TodoItem(),
                new Table({ resizable: true }),
                new TableHeader(),
                new TableRow(),
                new TableCell(),
                new TextAlign({ alignments: ['left', 'center', 'right', 'justify']}),
                new LineHeight(),
                new Indent({ minIndent: 0, maxIndent: 7}),
                new HorizontalRule(),
                new History()
            ],
            pageName:null,//页面名称
            echartsBoxHeight:'',
            showPicPlaza:false,
            token:window.localStorage.getItem("token"),
            imgsArr: [],         //存放所有已加载图片的数组（即当前页面会加载的所有图片）
            fetchImgsArr: [],     //存放每次滚动时下一批要加载的图片的数组
            clickCount : 0,
            chooseDeletIndex:null,
            editor_layerX:'',
            editor_layerY:'',
            htmlContent:``,//富文本编辑器
            isShowMenu:false,
            showList:true,
            edit_left:0,
            edit_width:200,
            edit_height:200,
            showEditor:false,
            domArr:[{
                type:"line",
                h:1,
                w:(window.innerHeight - 100) * 1.778,
                x:0,
                y:50
            }],
            posX:0,
            posY:0,
            treeData:[],
            reportId:'',
            showNote:false,
            showEcharts:false,
            note:'',
            notes:'',
            isUpdateRemark:false,//判断是会否是更新状态不小
            rootNodeArr:[], //菜单根节点数组
            isShowTree:true,
            transverseTop:-1000,
            verticalLeft:-1000,
            shiftDown:false,
            setImgSize:true,
            showMaps:false,
            mapsList:[
                { name:'板块名片', type:'PlateCard', queryArea:'plate' },
                { name:'台账地块', type:'LandInfo', queryArea:'plate' },
                { name:'土地四至', type:'LandImg', queryArea:'plate' },
                { name:'土地评分', type:'LandEva' },
                { name:'未来规划', type:'FuturePlan', queryArea:'plate' },
                { name:'城市土地市场', type:'CityLand', queryArea:'nultiRegion' },
                { name:'区域土地市场',type:'AreaLand', queryArea:'multiPlate' },
                { name:'板块土地市场',type:'PlateLand', queryArea:'plate' },
                { name:'城市商品房市场',type:'CityMarket', queryArea:'nultiRegion' },
                { name:'区域商品房市场',type:'AreaMarket', queryArea:'multiPlate' },
                { name:'板块商品房市场',type:'PlateMarket', queryArea:'plate' },
                { name:'区域商品房市场排行榜',type:'AreaMarketRank', queryArea:'region' },
                { name:'板块商品房市场排行榜',type:'PlateMarketRank', queryArea:'plate' },
            ],
            chartsList:[
                {   
                    name:'GDP及增速年度走势',
                    chartType:'ColumnarLine', //横坐标年份，纵坐标值跟增速
                    reqinfo:{tableName:'jj_gdp',code:'total_output'},//tableName:表名，code：类型
                    legend:['GDP', '增速'],//图例
                    yAxisName:['金额(元)','增速(%)'],
                    searchRange:'city',//数据查询的范围 city:单城市 region:行政区 nultiRegion:多行政区 plate:板块 multiPlate:多板块
                    timeType:'yearRange' //年范围
                },{   
                    name:'人均GDP及增速年度走势',
                    chartType:'ColumnarLine',
                    reqinfo:{tableName:'jj_gdp',code:'avg_output'},
                    legend:['GDP', '增速'],
                    yAxisName:['金额(元)','增速(%)'],
                    searchRange:'city',
                    timeType:'yearRange'
                },{   
                    name:'城市产业结构变化趋势',
                    chartType:'StackedColumn', //堆叠图
                    apiUrl:'/dms/jj/gdpcy/chart',
                    reqinfo:{tableName:null,code:null},
                    legend:['第一产业', '第二产业','第三产业'],
                    yAxisName:['比例(%)','增速(%)'],
                    searchRange:'city',
                    timeType:'yearRange'
                },{   
                    name:'房地产投资及增速',
                    chartType:'ColumnarLine',
                    reqinfo:{tableName:'jj_fdc',code:'invest'},
                    legend:['房地产投资', '增速'],
                    yAxisName:['金额(万元)','增速(%)'],
                    searchRange:'city',
                    timeType:'yearRange'
                },{   
                    name:'人口走势图',
                    chartType:'ColumnarLine',
                    reqinfo:{tableName:'rk_rkzb_hj',code:'prp'},
                    legend:['户籍人口', '增速'],
                    yAxisName:['人口数量(万人)','增速(%)'],
                    searchRange:'city',
                    timeType:'yearRange'
                },{   
                    name:'城市城镇居民可支配收入及增速年度走势',
                    chartType:'ColumnarLine',
                    apiUrl:'/dms/jj/jmsrhj/chart',
                    reqinfo:{tableName:null,code:null},
                    legend:['可支配收入', '增速'],
                    yAxisName:['收入(元)','增速(%)'],
                    searchRange:'city',
                    timeType:'yearRange'
                },{   
                    name:'城市城镇居民消费支出及增速年度走势',
                    chartType:'ColumnarLine',
                    apiUrl:'/dms/jj/jmxfhj/chart',//接口地址
                    reqinfo:{tableName:null,code:null},
                    legend:['消费支出', '增速'],
                    yAxisName:['支出(元)','增速(%)'],
                    searchRange:'city',
                    timeType:'yearRange'
                },{   
                    name:'行政区GDP对比图',
                    chartType:'Columnar', //柱状图
                    apiUrl:'/dms/jj/gdp/chartByRegion',
                    reqinfo:{tableName:null,code:null},
                    legend:[],
                    yAxisName:['金额(元)'],
                    searchRange:'nultiRegion',
                    timeType:'singleYear' //单年
                },{   
                    name:'行政区GDP及增速年度走势',
                    chartType:'ColumnarLine',
                    reqinfo:{tableName:'jj_gdp',code:'total_output'},
                    legend:['GDP', '增速'],
                    yAxisName:['金额(元)','增速(%)'],
                    searchRange:'region',
                    timeType:'yearRange' 
                },{   
                    name:'行政区人均GDP及增速年度走势',
                    chartType:'ColumnarLine',
                    reqinfo:{tableName:'jj_gdp',code:'avg_output'},
                    legend:['GDP', '增速'],
                    yAxisName:['金额(元)','增速(%)'],
                    searchRange:'region',
                    timeType:'yearRange' 
                },{   
                    name:'行政区业结构变化趋势',
                    chartType:'StackedColumn',
                    apiUrl:'/dms/jj/gdpcy/chart',
                    reqinfo:{tableName:null,code:null},
                    legend:['第一产业', '第二产业','第三产业'],
                    yAxisName:['比例(%)','增速(%)'],
                    searchRange:'region',
                    timeType:'yearRange'
                },{   
                    name:'行政区人口走势',
                    chartType:'ColumnarLine',
                    reqinfo:{tableName:'rk_rkzb_hj',code:'prp'},
                    legend:['户籍人口', '增速'],
                    yAxisName:['人口数量(万人)','增速(%)'],
                    searchRange:'region',
                    timeType:'yearRange'
                },{   
                    name:'行政区城镇居民可支配收入及增速年度走势',
                    chartType:'ColumnarLine',
                    apiUrl:'/dms/jj/jmsrhj/chart',
                    reqinfo:{tableName:null,code:null},
                    legend:['可支配收入', '增速'],
                    yAxisName:['收入(元)','增速(%)'],
                    searchRange:'region',
                    timeType:'yearRange'
                },{   
                    name:'行政区住户存款余额及增速年度走势',
                    chartType:'ColumnarLine',
                    apiUrl:'/dms/jj/jmsrhj/balance',//接口地址
                    reqinfo:{tableName:null,code:null},
                    legend:['余额', '增速'],
                    yAxisName:['余额(元)','增速(%)'],
                    searchRange:'region',
                    timeType:'yearRange'
                },{   
                    name:'板块GDP对比图',
                    chartType:'Columnar',
                    apiUrl:'/dms/jj/gdp/chartByRegion',
                    reqinfo:{tableName:null},
                    legend:[],
                    yAxisName:['金额(元)'],
                    searchRange:'multiPlate',
                    timeType:'singleYear'
                },{   
                    name:'城市土地市场',
                    chartType:'MixedChart1',
                    apiUrl:'',
                    reqinfo:{dataType:'city'},
                    legend:[],
                    yAxisName:[],
                    searchRange:'city',
                    timeType:'yearRange',
                    showUseLand:true,
                },{   
                    name:'区域土地市场',
                    chartType:'MixedChart1',
                    apiUrl:'',
                    reqinfo:{dataType:'region'},
                    legend:[],
                    yAxisName:[],
                    searchRange:'region',
                    timeType:'yearRange',
                    showUseLand:true,
                },{   
                    name:'板块土地市场',
                    chartType:'MixedChart1',
                    apiUrl:'',
                    reqinfo:{dataType:'part'},
                    legend:[],
                    yAxisName:[],
                    searchRange:'plate',
                    timeType:'yearRange',
                    showUseLand:true,
                },{   
                    name:'城市市场供求价存年度走势',
                    chartType:'DbColumnarLine',
                    apiUrl:'/dms/sc/market/chart/supply',
                    reqinfo:{dataType:'city'},
                    legend:['供应面积','成交面积','成交均价'],
                    yAxisName:['面积(㎡)','价格(元/㎡)'],
                    searchRange:'city',
                    timeType:'yearRange',
                    showProperty:true
                },{   
                    name:'城市市场存量年度走势',
                    chartType:'ColumnarLine',
                    apiUrl:'/dms/sc/market/chart/cycle',
                    reqinfo:{dataType:'city'},
                    legend:['存量面积','去化周期'],
                    yAxisName:['面积(㎡)','年'],
                    searchRange:'city',
                    timeType:'yearRange',
                    showProperty:true
                },{   
                    name:'行政区市场供求价存年度走势',
                    chartType:'DbColumnarLine',
                    apiUrl:'/dms/sc/market/chart/supply',
                    reqinfo:{dataType:'region'},
                    legend:['供应面积','成交面积','成交均价'],
                    yAxisName:['面积(㎡)','价格(元/㎡)'],
                    searchRange:'region',
                    timeType:'yearRange',
                    showProperty:true
                },{   
                    name:'行政区市场量年度走势',
                    chartType:'ColumnarLine',
                    apiUrl:'/dms/sc/market/chart/cycle',
                    reqinfo:{dataType:'region'},
                    legend:['存量面积','去化周期'],
                    yAxisName:['面积(㎡)','年'],
                    searchRange:'region',
                    timeType:'yearRange',
                    showProperty:true
                },{   
                    name:'行政区市场分建筑形态供求价对比',
                    chartType:'DbColumnarLine',
                    apiUrl:'/dms/sc/market/chart/build',
                    reqinfo:{dataType:'region'},
                    legend:['供应面积','成交面积','成交均价'],
                    yAxisName:['面积(㎡)','价格(元/㎡)'],
                    searchRange:'region',
                    timeType:'yearRange',
                    showProSwicth:true
                },{   
                    name:'行政区市场分建筑形态存销对比',
                    chartType:'ColumnarLine',
                    apiUrl:'/dms/sc/market/chart/buildCycle',
                    reqinfo:{dataType:'region'},
                    legend:['存量面积','去化周期'],
                    yAxisName:['面积(㎡)','年'],
                    searchRange:'region',
                    timeType:'yearRange',
                    showProSwicth:true
                },{   
                    name:'行政区市场面积段成交走势',
                    chartType:'StackedColumnA',
                    apiUrl:'/dms/sc/market/chartByAreaSize',
                    reqinfo:{dataType:'region'},
                    legend:[],
                    xAxisName:['套数'],
                    searchRange:'region',
                    timeType:'yearRange',
                    showProperty:true
                },{   
                    name:'板块市场供求价存年度走势',
                    chartType:'DbColumnarLine',
                    apiUrl:'/dms/sc/market/chart/supply',
                    reqinfo:{dataType:'part'},
                    legend:['供应面积','成交面积','成交均价'],
                    yAxisName:['面积(㎡)','价格(元/㎡)'],
                    searchRange:'plate',
                    timeType:'yearRange',
                    showProperty:true
                },{   
                    name:'板块市场量年度走势',
                    chartType:'ColumnarLine',
                    apiUrl:'/dms/sc/market/chart/cycle',
                    reqinfo:{dataType:'part'},
                    legend:['存量面积','去化周期'],
                    yAxisName:['面积(㎡)','年'],
                    searchRange:'plate',
                    timeType:'yearRange',
                    showProperty:true
                },{   
                    name:'板块市场分建筑形态供求价对比',
                    chartType:'DbColumnarLine',
                    apiUrl:'/dms/sc/market/chart/build',
                    reqinfo:{dataType:'part'},
                    legend:['供应面积','成交面积','成交均价'],
                    yAxisName:['面积(㎡)','价格(元/㎡)'],
                    searchRange:'plate',
                    timeType:'yearRange',
                    showProSwicth:true
                },{   
                    name:'板块市场分建筑形态存销对比',
                    chartType:'ColumnarLine',
                    apiUrl:'/dms/sc/market/chart/buildCycle',
                    reqinfo:{dataType:'part'},
                    legend:['存量面积','去化周期'],
                    yAxisName:['面积(㎡)','年'],
                    searchRange:'plate',
                    timeType:'yearRange',
                    showProSwicth:true
                },{   
                    name:'板块市场面积段成交走势',
                    chartType:'StackedColumnA',
                    apiUrl:'/dms/sc/market/chartByAreaSize',
                    reqinfo:{dataType:'part'},
                    legend:[],
                    xAxisName:['套数'],
                    searchRange:'plate',
                    timeType:'yearRange',
                    showProperty:true
                },
            ],
            yearBox:false,
            showTables:false,
            tableColRow:{col:10,row:10},//表格行列数
        }
       
    },
    computed: {
        ...mapGetters(["reportAdd_map"]),
        domType(){
            return (type)=>{
                return type=="map"||type=="table"||type=="hplj"||type=="jgnh"||type=='jpfb'||type=='qhxl'
            }
        }
    },
    methods:{
        //设置页面名称
        setPageLabel(val){
            this.pageName = val
        },
        yearsRange(val){
            console.log(val)
        },
        randomId(){
            let random = Number(Math.random().toString().substr(3,length) + Date.now()).toString(36) + ''
            return random
        },
        //设置表格数据
        setTableData(val,index){
            this.domArr[index].content.data = val
        },
        setChartOption(val,index){
            console.log(val,index)
            if(val.chartOption!=null){
                this.domArr[index].chartOption = val.chartOption
            }
            if(val.chartId!=null){
                 this.domArr[index].chartId = val.chartId
            }
            this.domArr[index].chart = val.chart
        },
        chooseTable(){
            if(this.tableColRow.col!=null&&this.tableColRow.row!=null){
                this.showTables = false
                this.tableColRaw = {
                    col:JSON.parse(this.tableColRow.col),
                    row:JSON.parse(this.tableColRow.row)
                }
                this.domArr.push({
                    tid:this.randomId(),
                    type:'table',
                    h:300,
                    w:500,
                    x:this.posX,
                    y:this.posY,
                    content:{
                        col:this.tableColRow.col,
                        row:this.tableColRow.row,
                        data:null
                    }
                })
            }else{
                this.$message.warning('请先输入行列')
            }
        },
        chooseMap(item){
            this.domArr.push({
                tid:this.randomId(),
                type:'map',
                mapType:item.type,
                h:500,
                w:800,
                x:this.posX,
                y:this.posY,
                chartInfo:item
            })
            this.showMaps = false
        },
        chooseChart(item){ //添加图表
            let chartId = this.randomId()
            this.domArr.push({
                tid:this.randomId(),
                type:'chart',
                h:500,
                w:800,
                x:this.posX,
                y:this.posY,
                chartInfo:item
            })
            this.showEcharts = false
        },
        pageUp(){
            this.chooseDeletIndex = null
            if(this.pageIndex === 0){
                this.$message({
                    type: 'warning',
                    message: '当前页为第一页'
                })
            }else{
                this.pageIndex = this.pageIndex - 1
                this.nodeType = this.rootNodeArr[this.pageIndex].nodeType
                this.pageId = this.rootNodeArr[this.pageIndex].id
                this.pageName = this.rootNodeArr[this.pageIndex].label
                this.$router.push({
                    path:'/landReport/redact',
                    query:{
                        reportId:this.reportId,
                        pageId:this.pageId,
                        nodeType:this.nodeType
                    }
                })
            }
        },
        pageDown(){
            this.chooseDeletIndex = null
            if(this.pageIndex == this.rootNodeArr.length - 1){
                 this.$message({
                    type: 'warning',
                    message: '当前页为最后一页'
                })
            }else{
                this.pageIndex ++
                this.pageId = this.rootNodeArr[this.pageIndex].id
                this.nodeType = this.rootNodeArr[this.pageIndex].nodeType
                this.pageName = this.rootNodeArr[this.pageIndex].label
                this.$router.push({
                    path:'/landReport/redact',
                    query:{
                        reportId:this.reportId,
                        pageId:this.pageId,
                        nodeType:this.nodeType
                    }
                })
            }
        },
        //设置根节点菜单数据
        setRootNodeArr(arr){
            this.rootNodeArr = arr
            if(this.pageName==null){
                let id = this.$route.query.pageId
                let curPageNode = arr.filter(item=>item.id==id)[0]
                if(curPageNode){
                    this.pageName = curPageNode.label
                }else{
                    this.pageName = arr[0].label
                }
            }
            setTimeout(_=>{
                 this.pageId = this.$route.query.pageId
                 arr.forEach((item,index)=>{
                    if(item.id === this.pageId){
                        this.pageIndex = index
                    }
                })
            },800)
            
        },
        updateRemark(index){
           console.log(this.notes[index].remark)
           this.note = this.notes[index].remark
           this.isUpdateRemark = true
           this.updateRemarkTid = this.notes[index].tid
           this.$refs.textarea.focus()
        },
        deleteRemark(index){
            LandReport.deleteRemark(this.notes[index].tid).then(res=>{
                this.getRemarkList()
                if(res.data.code === 0){
                    this.$message({
                        type: 'success',
                        message: '删除备注成功'
                    })
                    this.note = ''
                }else{
                    this.$message.error('未知异常，请联系管理员')
                }
            })
        },
        addRemark(){
            if(this.isUpdateRemark){
                LandReport.updateRemark(this.updateRemarkTid,this.note).then(res=>{
                    console.log(res)
                this.getRemarkList()
                this.isUpdateRemark = false
                
                if(res.data.code === 0){
                    this.$message({
                        type: 'success',
                        message: '修改备注成功'
                    })
                    this.note = ''
                }else{
                    this.$message.error('未知异常，请联系管理员')
                }
                })
            }else{
                LandReport.addRemark(this.reportId,this.pageId,this.note).then(res=>{
                console.log(res)
                this.getRemarkList()
                if(res.data.code === 0){
                    this.$message({
                        type: 'success',
                        message: '提交备注成功'
                    })
                    this.note = ''
                }else{
                    this.$message.error('未知异常，请联系管理员')
                }
            })
            }
            
        },
        shiftKey(e){
            if(e.keyCode === 16){
                this.shiftDown = false
            }
        },
        deleteDom(e){
            //删除dom
            if(e.keyCode === 46){
                this.domArr.splice(this.chooseDeletIndex,1)
                this.chooseDeletIndex = null
            }
            //向下
            if(e.keyCode === 40){
                if(this.chooseDeletIndex!==null){
                    this.domArr[this.chooseDeletIndex].y ++
                }else{
                    this.pageDown()
                }
            }
            //向上
            if(e.keyCode === 38){
                if(this.chooseDeletIndex!==null){
                    this.domArr[this.chooseDeletIndex].y --
                }else{
                    this.pageUp()
                }
            }
            //向左
            if(e.keyCode === 37 && this.chooseDeletIndex!==null){
                 this.domArr[this.chooseDeletIndex].x --
            }
            //向右
            if(e.keyCode === 39 && this.chooseDeletIndex!==null){
                 this.domArr[this.chooseDeletIndex].x ++
            }
            //shift
            if(e.keyCode === 16 && this.chooseDeletIndex!==null){
                this.shiftDown = true
            }
        },
        clickFn(event, { index, value }){
            this.showPicPlaza = false;
            console.log(this.imgsArr[index].link)
            let img = new Image();
            img.src= this.imgsArr[index].link
            img.onload = _=>{
                let scaleH
                let scaleW
                console.log(img.width,img.height)
                if(img.width > img.height){
                    let b = img.width / 400;
                    scaleH = img.height/ b;
                    scaleW = 400;
                }else{
                    let b = img.height / 400;
                    scaleW = img.width/ b;
                    scaleH = 400;
                }
                this.domArr.push({
                    tid:this.randomId(),
                    type:'img',
                    content:this.imgsArr[index].link,
                    w:scaleW,
                    h:scaleH,
                    x:this.posX,
                    y:this.posY,
                })
            }
        },
        imgResize(e){
            // console.log(e)
        },
        beforePicUpload(file){
            const isLt1M = file.size / 1024 / 1024 < 1;
            if (!isLt1M) {
            this.$message.error('上传的图片大小不能超过 1MB!');
            }
            return isLt1M;
        },
        uploadSuccess(res){
            console.log(res.data.src)
            this.imgsArr.unshift({
                src:res.data.src,
                link:res.data.src,
                content:''
            })
        },
        showEdiBar(i,type){
            if(type === "text"){
                this.clickCount ++
                this.dblClicked = true
                
                setTimeout(_=>{
                    this.clickCount = 0
                    this.dblClicked = false
                },300)
                if(this.clickCount > 1){
                    this.showEditor = true;
                    this.htmlContent = this.domArr[i].content
                    this.posX = this.domArr[i].x;
                    this.posY = this.domArr[i].y
                    this.clickCount = 0;
                    this.chooseIndex = i;
                    this.isUpdate = true
                    console.log(i)
                }
            }else if(type === 'img'){
                this.clickCount ++
                this.dblClicked = true
                
                setTimeout(_=>{
                    this.clickCount = 0
                    this.dblClicked = false
                },300)
                if(this.clickCount > 1){
                    this.setImgSize = true
                }
            }
        },
        //计算所有元素的高度 顶线 中线 底线 放进一个数组内
        computeTop(top,height,index){
            let domArr = [...this.domArr];
            domArr.splice(index,1)
            // let topArr = [0,this.edit_height/2,this.edit_height]
            let topArr = [0]
            let centerArr = [this.edit_height/2]
            let bottomArr = [this.edit_height]
            domArr.forEach(item=>{
                // topArr.push(item.y,(item.y + (item.h/2)),item.y + item.h)
                topArr.push(item.y)
                centerArr.push(item.y + (item.h/2))
                bottomArr.push(item.y + item.h)
            })
            topArr.forEach(item=>{
                if(item === top){
                    this.transverseTop = item
                }
            })
            centerArr.forEach(item =>{
                if(item === (top + height/2)){
                    this.transverseTop = item
                }
            })
            bottomArr.forEach(item=>{
                if(item === (top + height)){
                    this.transverseTop = item
                }
            })

        },
         //计算所有元素的宽度 左线 中线 右线 放进一个数组内
        computeLeft(left,width,index){
             let domArr = [...this.domArr];
             domArr.splice(index,1)
             let leftArr = [0]
             let centerArr = [this.edit_width/2]
             let rightArr = [this.edit_width]
             domArr.forEach(item=>{
                 leftArr.push(item.x)
                 centerArr.push(item.x + (item.w/2))
                 rightArr.push(item.x + item.w)
             })
            leftArr.forEach(item=>{
                if(item === left){
                    this.verticalLeft = item
                }
            })
            centerArr.forEach(item=>{
                if(item === (left + width/2)){
                    this.verticalLeft = item
                }
            })
            rightArr.forEach(item=>{
                if(item === (left + width)){
                    this.verticalLeft = item
                }
            })
        },
        resize(e,index) {
            
            // this.computeTop(e.top,e.height,index)
            // this.computeLeft(e.left,e.width,index)
            if(this.domArr[index].w!=e.width||this.domArr[index].h!=e.height){
                if(this.domArr[index].type=="chart"){
                    this.domArr[index].chart.resize()
                }
                if(this.domArr[index].map){
                    this.domArr[index].map.resize()
                    this.domArr[index].baseMap.resize()
                }
                if(this.domArr[index].type=="table"){
                    this.tableColRow.w = e.width
                    this.tableColRow.h = e.height
                }
            }
            
            this.domArr[index].w = e.width;
            this.domArr[index].h = e.height;
            this.domArr[index].x = e.left;
            this.domArr[index].y = e.top;
            this.chooseDeletIndex = index;
        },
        setMap(mapObj){
            console.log(mapObj)
            this.domArr[this.domArr.length-1].map = mapObj.map
            this.domArr[this.domArr.length-1].baseMap = mapObj.baseMap
        },
        setPlanPoints(obj){ //保存地图规划点 {points,tid}
            this.domArr.forEach(item=>{
                if(item.tid == obj.tid){
                    item.mapPlanPoints = obj.points
                }
            })
        },
        hideAllMenu(){
            if(this.htmlContent===''||this.htmlContent===' '){
                this.showEditor = false
            }else{
                if(this.showEditor && !this.dblClicked && this.htmlContent!==''){
                    if(this.isUpdate){
                        this.domArr[this.chooseIndex].content = this.htmlContent;
                        this.isUpdate = false
                    }else{
                        this.domArr.push({
                            tid:this.randomId(),
                            type:'text',
                            content:this.htmlContent,
                            x:this.posX,
                            y:this.posY,
                            h:250,
                            w:600
                        })
                    }
                    this.showEditor = false;
                    this.htmlContent = ''
                    console.log(this.domArr)
                }
            }
            this.chooseDeletIndex = null
        },
        turnToPercent(x,y){
            return{
                x:x/this.edit_width * 100,
                y:y/this.edit_height * 100 
            }
        },
        turnToPx(x,y){
            return{
                x:x * this.edit_width / 100,
                y:y * this.edit_height / 100 
            }
        },
        showRightClickMenu(event){
            this.posX = event.layerX
            this.posY = event.layerY
            this.$contextmenu({
                items:[
                    {label:'添加文字',divided: true,icon:"el-icon-edit",onClick:()=>{
                        this.showEditor = true;
                        
                    }},
                    {label:'添加图片',divided: true,icon:"el-icon-picture-outline",onClick:()=>{
                        this.showPicPlaza = true
                    }},
                    // {label:'添加表格',divided: true,icon:"el-icon-date",onClick:()=>{
                    //     this.showTables = true
                    // }},
                    {label:'添加图表',divided: true,icon:"el-icon-pie-chart",onClick:()=>{
                        this.showEcharts = true
                    }},
                    {label:'添加地图',divided: true,icon:"el-icon-map-location",onClick:()=>{
                        this.showMaps = true
                    }},
                    ],
                event,
                customClass: "class-a",
                zIndex: 3,
                minWidth: 50
            })
        },
        change(val) {
            console.log(val)
        },
        saveReportInfo(){
            let domArr = []
            this.domArr.forEach(item=>{
                let obj = {
                    type:item.type,
                    x:item.x,
                    y:item.y,
                    w:item.w,
                    h:item.h,
                }
                if(item.type==='chart'){
                    obj.chartId = item.chartId
                    obj.chartInfo = JSON.stringify(item.chartInfo)
                    obj.chartOption=JSON.stringify(item.chartOption)
                }else if(item.type==='img'||item.type==='text'){
                    obj.content=item.content
                }else if(item.type==='map'){
                    obj.chartInfo = JSON.stringify(item.chartInfo)
                    obj.mapType=item.mapType
                    obj.mapPlanPoints = item.mapPlanPoints
                }else if(item.type==='table'){
                    obj.content = JSON.stringify(item.content)
                }
                domArr.push(obj)
            })
            
            domArr.forEach(item=>{
                let percentXY = this.turnToPercent(item.x,item.y);
                item.x = percentXY.x
                item.y = percentXY.y
                let percentWH = this.turnToPercent(item.w,item.h);
                item.w = percentWH.x;
                item.h = percentWH.y 
            })
            LandReport.saveReportInfo(this.reportId,this.pageId,domArr).then(res=>{
                 if(res.data.code === 0){
                    this.$message({
                        type: 'success',
                        message: '内容保存成功'
                    })
                    this.note = ''
                }else{
                    this.$message.error('未知异常，请联系管理员')
                }
             })
            
        },
        inputBlur(){
            let inputs = this.$refs.input;
            for(let i = 0; i < inputs.length;i++){
                inputs[i].blur()
            }
        },
        showMenu(){
            this.isShowMenu = !this.isShowMenu;
        },
        getPicData(){
            LandReport.getPicData().then(res=>{
                let imgsArr = res.data.data
                let arr = []
                imgsArr.forEach(item=>{
                    arr.push({
                        id:item.id,
                        src:item.content,
                        link:item.content,
                        info:''
                    })
                })
                this.imgsArr = arr
                console.log(this.imgsArr)
            })
        },
        //删除图片
        deleteImg(props){
            console.log(props)
            var that = this
            LandReport.deletePics([props.value.id])
            .then(res=>{
                if(res.data.code===0){
                    that.$message.success('图片已删除')
                    that.getPicData()
                }
            })
        },
        onEditorUpdate(val){
            console.log(val)
        },
        getRemarkList(){
            LandReport.getRemarkList(this.reportId,this.pageId).then(res=>{
                if(res.data.code===0){
                    this.notes = res.data.data.searchRst
                }
                
            })
        },
        getReportInfo(reportId,pageId,nodeType){
            if(nodeType){ //固定页面
                this.$nextTick(()=>{
                    this.getPageInfo(reportId,nodeType)
                })
            }else{ //自定义页面
                LandReport.getReportInfo(reportId,pageId).then(res=>{
                    console.log('当前报告页面数据',res.data.data.reportInfo)
                    let domArr = res.data.data.reportInfo
                    domArr.forEach(item=>{
                        let pxXY = this.turnToPx(item.x,item.y)
                        item.x = pxXY.x;
                        item.y = pxXY.y;
                        let pxWH = this.turnToPx(item.w,item.h)
                        item.w = pxWH.x;
                        item.h = pxWH.y
                        if(item.type=='chart'){
                            item.chartOption = JSON.parse(item.chartOption)
                            item.chartInfo = JSON.parse(item.chartInfo)

                        }else if(item.type=='table'){
                            item.content = JSON.parse(item.content)
                        }else if(item.type=='map'){
                            item.chartInfo = JSON.parse(item.chartInfo)
                        }
                    })
                    this.domArr = domArr
                })
            }
        },
        getPageInfo(reportId,nodeType){
            this.domArr = [] //置空dom盒子
            if(nodeType=='hplj'){ //户配逻辑
                this.domArr=[{
                    tid:this.randomId(),
                    type:'hplj',
                    h:this.edit_height,
                    w:this.edit_width,
                    x:0,
                    y:0,
                    content:nodeType
                }]
            }else if(nodeType=='jgnh'){ //价格拟合
                this.domArr=[{
                    tid:this.randomId(),
                    type:'jgnh',
                    h:this.edit_height,
                    w:this.edit_width,
                    x:0,
                    y:0,
                    content:nodeType
                }]
            }else if(nodeType=='jpfb'){ //竞品分布
                this.domArr=[{
                    tid:this.randomId(),
                    type:'jpfb',
                    h:this.edit_height,
                    w:this.edit_width,
                    x:0,
                    y:0,
                    content:nodeType
                }]
            }else if(nodeType=='qhxl'){ //去化、销量
                this.domArr=[{
                    tid:this.randomId(),
                    type:'qhxl',
                    h:this.edit_height,
                    w:this.edit_width,
                    x:0,
                    y:0,
                    content:nodeType
                }]
            }
        },
        
    },
    
    created(){
        this.getPicData()
        this.reportId = this.$route.query.reportId //取出报告id
    }, 
    watch:{
        '$route':{
            handler(newVal){
                this.reportId = newVal.query.reportId //取出报告id
                this.pageId = newVal.query.pageId //取出页面id
                this.nodeType = newVal.query.nodeType //页面标记nodeType
                this.chooseDeletIndex = null //选中的dom索引
                this.rootNodeArr.forEach((item,i)=>{ //page页码
                    if(this.pageId==item.id){
                        this.pageIndex = i
                    }
                })
                this.getRemarkList()
                this.getReportInfo(this.pageId,this.reportId,this.nodeType)
            },
            immediate:true
        },
    },
    mounted(){
        console.log(window.innerWidth,window.innerHeight)
        this.echartsBoxHeight = window.innerHeight * 0.9
        this.edit_height = window.innerHeight - 80;
        this.edit_width = this.edit_height * 1.7778;
        this.edit_left = (window.innerWidth-this.edit_width)/2
        window.onkeydown = this.deleteDom
        window.onkeyup = this.shiftKey
    }
}
</script>
<style src="../../../node_modules/handsontable/dist/handsontable.full.css"></style>
<style lang="scss">
.landReport{
    position: absolute;
    width: 100%;
    left: 0;
    top: 40px;
    bottom: 0px;
    display: flex;
    z-index: 10;
    // background: hsl(0, 29%, 95%);
    .drag_handle{
        position: absolute;
        right: 46%;
        top: -16px;
        z-index: 9999;
        cursor: pointer;
        transition: 0.3;
        display: none;
        .drag_handle_icon{
            font-size: 22px;
            color: #f60;
            // &:hover{
            //     color: #f60;
            // }
        }
        
    }
    .vdr:hover .drag_handle{
        display: block;
    }
    .item_wrap{
        position: relative;
    }
    .note_box{
        background: #3c414c;
        height:100%;
        width:100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        .note_title{
            color:#f79f1b;
            font-size:14px;
            margin-top:20px;
            text-align: left;
            width: 80%;
        }
        .notes{
            height:83%;
            width:100%;
            margin-top:20px;
            overflow-y: scroll;
            .notes_item{
                width:80%;
                padding:0 10%;
                font-size:15px;
                &:hover{
                    .el-icon-edit,.el-icon-delete{
                        opacity: 1;
                        transition: all 0.3s ease;
                        cursor: pointer;
                    }
                }
                .item_info{
                    text-indent: 30px;
                    line-height: 30px;
                    color: #ecf5ff;
                    font-size: 13px;
                }
                .el-icon-edit{
                    margin-left:10px;
                    font-size:16px;
                    color:#3399CC;
                    opacity: 0;
                    transition: all 0.3s ease;
                    
                }
                .el-icon-delete{
                    margin-left:10px;
                    font-size:16px;
                    color:#d8af09;
                    opacity: 0;
                    transition: all 0.3s ease;
                }

            }
        }
        .editing_box{
            padding: 20px 0;
            border-top: #3f4b58 1px solid;
            position: absolute;
            bottom: 0;
            display: flex;
            align-items: center;
            .upload_btn{
                margin-left:10px; 
            }
        }
    }
    .echarts_box{
        background: #fff;
        max-height:100%;
        width:100%;
        overflow: hidden;
        .echarts_title{
            color:#606266;
            font-size:18px;
            margin:4% 0;
            text-align: center;
        }
        .echarts_list{
            padding:0 30px;
            overflow-y:scroll;
            .echarts_item{
                width: 100%;
                background: #e4effb;
                border-radius: 22px;
                margin-bottom: 20px;
                overflow: hidden;
                cursor: pointer;
                padding: 10px 5px;
                .echarts_pic{
                    height:120px;
                    width: 100%;
                    border-radius: 5px;
                }
                .ehcarts_name{
                    text-align: center;
                    width: 240px;
                    color:#333;
                    font-size:14px;
                    font-weight: bold;
                }
            }
        }
    }
    .tree_list{
        left:-300px;
        top:0;
        opacity: 0;
        transition: all 0.3s linear;
    }
    .tree_list_active{
        left:0px;
        opacity: 1;
        transition: all 0.3s linear;
    }
    .tree_mask{
        height:100%;
        width:100%;
        z-index:7;
        position: fixed;
        left:0;
        top:0;
    }
    #edit_box{
        height:100%;
        width:100%;
        display: flex;
        justify-content: center;
        align-items: center;
        // background: #f9ffec;
        .dom_text{
            height: 100%;
            table{
                width: 100%;
                height: 100%;
                border:0px;
                border-collapse: collapse;
            }
            th,td{
                border: #ccc 1px solid;
                text-align: center;
                padding: 0;
            }
            th{
                background: rgb(240, 240, 240);
            }
            p{
                padding: 0;
                margin: 0;
            }
        }
        #edit_page{
            background:  white;
            height:200px;
            width:200px;
            box-shadow: 0 0 20px 0 rgba(0,0,0,.1);
            position: absolute;
            transition: all 0.5s;
            .page_name_edit{
                position: absolute;
                font-size: 20px;
                font-weight: bold;
                top: -45px;
                left: 0px;
                color: #e6a23c;
                z-index: 99;
                padding: 5px 15px;
            }
            #editor_box{
                width:600px;
                background: white;
                position: absolute;
                z-index:7;
                .el-tiptap-editor>.el-tiptap-editor__content{
                    padding: 12px;
                }
                .el-tiptap-editor__command-button{
                    width: 30px;
                    height: 30px;
                }
                .el-tiptap-editor .ProseMirror{
                    height: 100%;
                }
            }
            #transverseLine{
                position: absolute;
                top:20px;
                width:100%;
                height:2px;
                border-bottom: 2px dashed #6699CC;
            }
            #verticalLine{
                position: absolute;
                left:20px;
                width:2px;
                height: 100%;
                border-right:  2px dashed #6699CC;
            }
            .resize_box{
                height:100%;
                width:100%;
                box-shadow: 0px 0px 30px 15px rgba(0,0,0,0.4);
                overflow: hidden;
            }
            .line{
                height:1px;
                width:100%;
                background: rgba(0,0,0,.7);
            }
            .icon_box{
                height:120px;
                width:30px;
                position: absolute;
                right:-40px;
                bottom:0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-around;
                .icon_wrap{
                    width: 20px;
                    height: 20px;
                    line-height: 10px;
                    text-align: center;
                    background: #ff9900;
                    border-radius: 3px;
                    cursor: pointer;
                    transition: all 0.3s;
                    &:hover{
                        background: #f60;
                    }
                    &:hover .iconfont{
                        color: #fff;
                    }
                }
                .iconfont{
                    color: #333;
                    transition: 0.3s;
                }
            }
        }
    }
    #picture_plaza{
        height:calc(100% - 40px);
        width:100%;
        background: rgba(0,0,0,0.6);
        z-index:666;
        position: absolute;
        left:0;
        top:40px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index:-10;
        opacity: 0;
        
        .picture_box{
            height:95%;
            width:95%;
            position: absolute;
            background: #f5f7fa;
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            transform: scale(0.6);
            .close_box{
                position: absolute;
                right:18px;
                top:12px;
                height:30px;
                width:30px;
                display: flex;
                justify-content: center;
                align-items: center;
                &:hover{
                    transform: rotate(180deg);
                    transition: all 0.3s ease;
                }
                .icon-guanbi{
                    margin-top:-10px;
                    cursor: pointer;
                }
            }
            .title_box{
                margin-top:50px;
                .title_cn{
                    line-height: 40px;
                    font-size: 40px;
                    font-weight: 400;
                    color: #4d4d4d;
                }
                .title_en{
                    line-height: 20px;
                    font-size: 20px;
                    font-weight: 400;
                    text-align: center;
                    color: #4d4d4d;
                    opacity: .2;
                    margin-top:6px;
                }
            }
            .pic_box{
                height:75%;
                width:100%;
                margin-top:20px;
                .img-box:hover .img-op{
                    display: block;
                }
                .img-op{
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    z-index: 99;
                    cursor: pointer;
                    transition: 0.5s;
                    display: none;
                    &:hover{
                        transform: rotate(360deg);
                    }
                }
            }
            .btn_box{
                width: 100%;
                display: flex;
                justify-content: flex-end;
                padding-right:200px;
            }
        }
        .picture_box_active{
            transform: scale(1);
            transition: all 0.3s ease;
        }
    }
    .showPicPlaza{
        z-index: 99!important;
        opacity: 1!important;
        
    }

    .toggle_wrap {
        display: block;
        width: 30px;
        height: 30px;
        position: fixed;
        left:20px;
        top:25px;
        z-index: 1000;
        line-height: 33px;
        text-align: center;
        background: #ffa319;
        border-radius: 50%;
        cursor: pointer;
        transition: 0.3s;
        &:hover{
            background: #f60;
        }
        &:hover .btn{
            color: #fff;
        }
        .btn{
            font-size: 18px;
            color: #303133;
            transition: 0.3s;
        }
    }

        
}
</style>