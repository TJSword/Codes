<template>
    <div class="plate_assess">
        <!-- 配置 -->
        <div class="diver">查询条件</div>
        <div class="setting">
            <div class="paltes">
                <div class="title">板块：</div>
                <div class="gebo_cont">
                    <el-select size="small" v-model="checkPlateArr" placeholder="板块选择" 
                    @change="plateChange" multiple collapse-tags clearable filterable>
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
        <!-- 板块评估条目 -->
        <div class="diver">评估指标</div>
        <div class="assess_treebox">
            <el-tree
                ref="assessTree"
                :height="cmListHeight"
                :props="defaultProps"
                :data="assessList"
                :check-strictly="true"
                show-checkbox
                node-key="id" 
                highlight-current
                @check="checkAssessItem">
            </el-tree>
        </div>
        <!-- 列表 -->
        <div class="data_list" v-show="curAssessItem||checkPlateArr.length>0" :style="{left:positionX+'px',top:positionY+'px'}">
            <div class="top">{{curAssessItem?curAssessItem.label+'(十分制)':'/'}}</div>
            <el-table ref="assessTable" :data="assessData" stripe border :height="cmTableHeight"
            :highlight-current-row="true" :row-class-name="tableRowClassName" @row-click="selectTableRow">
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column prop="name" label="板块" sortable></el-table-column>
                <el-table-column prop="value" label="数值" sortable></el-table-column>
            </el-table>
        </div>
        <!-- 图表 -->
        <div class="data_chart" :style="{bottom:showLegend?'20px':'-110%'}">
            <div id="assess_chart"></div>
        </div>
        <!-- 图例 -->
        <div class="legend" v-show="showLegend">
            <div class="unit">十分制</div>
            <div class="legend_item" v-for="(item, i) in legendBar" :key="i">
                <div class="val">{{ item.value }}</div>
                <div class="block" :style="{ background: item.color }"></div>
            </div>
        </div>
    </div>
</template>
<script>
import * as echarts from 'echarts';
import { mapGetters } from "vuex" 
import citymapApi from "@/api/citymapApi"
export default {
    name:'plate_assess',
    components:{},
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
            cmListHeight:window.innerHeight-320,//列表高度
            cmTableHeight:window.innerHeight-200,//列表高度
            assessList:[ //板块评估列表
                { id: 'matching',label:'配套综合强度' ,children:[
                    { id:'traffic',label: '交通' },
                    { id:'business',label: '商业' },
                    { id:'education',label: '教育' },
                    { id:'resources',label: '资源' }
                ]},
                { id: 'plan',label:'规划综合强度' ,children:[
                    { id:'enterprise',label: '企业布局' },
                    { id:'industry',label: '产业规划' },
                    { id:'space',label: '空间规划' }
                ]}
            ],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            plateList:[],//版块列表
            curAssessItem:null,//选择的评估项
            colorBar: [
                "rgb(0,0,255)",
                "rgb(0,60,195)",
                "rgb(0,120,135)",
                "rgb(0,180,75)",
                "rgb(0,240,15)",
                "rgb(45,210,0)",
                "rgb(105,150,0)",
                "rgb(165,90,0)",
                "rgb(210,45,0)",
                "rgb(255,0,0)",
            ], //颜色(由浅到深)
            showLegend:false,//显示图例
            legendBar:[],//图例
            assessData:[],//选择的市场指标板块数据

            checkPlateArr:[],//选择的板块ID
            platesIsAll:false,
            plateAll:true,
        }
    },
    created(){
       
    },
    mounted(){
        //模拟板块评估数据
        this.setPlateAssessData()
    },
    computed:{
        ...mapGetters(['cityCode','city_map','cityMapIsload'])
    },
    watch:{
        cityMapIsload:{
            handler(newVal){
                if(newVal){
                    this.loadMapEvents()
                }
            },
            deep:true
        },
        curTab:{
            handler(newVal){
                if(newVal=='plate_assess'){
                    this.curAssessItem = null
                    this.$refs.assessTree.setCheckedNodes([]);
                    this.setPlateScore()
                }
            }
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
        //选择表格
        selectTableRow(row,column){
            this.toPlate(row.id)
        },
        //飞向并选择板块
        toPlate(id){
            var map = this.city_map
            let curPlate = this.plateList.filter(item=>id==item.id)[0]
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
            this.plateList.forEach(item=>{
                arr.push(item.id)
            })
            let checkedCount = val.length;
            this.plateAll = checkedCount === arr.length;
            this.platesIsAll = checkedCount > 0 && checkedCount < arr.length;

            this.setPlateScore()
        },
        //板块全选全部选
        plateAllChange(val){
            let arr = []
            this.plateList.forEach(item=>{
                arr.push(item.id)
            })
            this.checkPlateArr = val?arr:[]
            this.platesIsAll = false

            this.setPlateScore()
        },
        //模拟板块评估数据
        setPlateAssessData(){
            var that = this
            let code = localStorage.getItem('cityCode')
            citymapApi.getCityPlates({landCityno:code?code:'510100'})
            .then(res=>{
                let data = res.data.data
                let arr = []
                let idArr = []
                data.forEach(item=>{
                    arr.push({
                        id:item.id,
                        name:item.name,
                        center:item.center,
                        matching:Math.floor(Math.random()*10+1),
                        traffic:Math.floor(Math.random()*10+1),
                        business:Math.floor(Math.random()*10+1),
                        education:Math.floor(Math.random()*10+1),
                        resources:Math.floor(Math.random()*10+1),
                        plan:Math.floor(Math.random()*10+1),
                        enterprise:Math.floor(Math.random()*10+1),
                        industry:Math.floor(Math.random()*10+1),
                        space:Math.floor(Math.random()*10+1),
                    })
                    idArr.push(item.id)
                })
                this.plateList = arr
                this.checkPlateArr = idArr
            })
        },
        //选择板块评估项
        checkAssessItem( checkedNode,checkedKeys){
            console.log(checkedNode,checkedKeys)
            if(checkedNode===this.curAssessItem){
                this.curAssessItem = null
                this.setPlateScore()
            }else{
                this.$refs.assessTree.setCheckedNodes([checkedNode]);
                this.curAssessItem = checkedNode
                this.setPlateScore()
            }
        },
        //板块设置板块评分
        setPlateScore(){
            var map = this.city_map
            if(this.curAssessItem==null||this.checkPlateArr.length==0){
                this.showLegend = false
                this.assessData = []
                map.setPaintProperty("plates_fill", "fill-color","rgba(58, 88, 125, 1)");
                map.setPaintProperty("plates_fill", "fill-opacity", 0.2);
                map.setPaintProperty("plates_line", "line-opacity", 0.1);
            }else{
                var val = this.curAssessItem.id
                let data = []
                let assessData = []
                this.plateList.forEach(item=>{
                    if(this.checkPlateArr.includes(item.id)){
                        data.push(item[val])
                        assessData.push({
                            id:item.id,
                            name:item.name,
                            value:item[val]
                        })
                    }
                })
                this.assessData = assessData
                
                //设置图例
                this.showLegend = true
                let legendArr = [{ value: 0, color: "none" }];
                this.colorBar.forEach((item, i) => {
                    legendArr.unshift({
                        value: i + 1,
                        color: item,
                    });
                });
                this.legendBar = legendArr;
                //根据值渲染板块
                let expression_fill = ["match", ["get", "id"]];
                let expression_fillop = ["match", ["get", "id"]];
                let expression_lineop = ["match", ["get", "id"]];
                this.plateList.forEach(item=>{
                    if(this.checkPlateArr.includes(item.id)){
                        let color = ''
                        if(item[val]>=0&&item[val]<=1){
                            color = 'rgb(0,0,255)'
                        }else if(item[val]>1&&item[val]<=2){
                            color = 'rgb(0,60,195)'
                        }else if(item[val]>2&&item[val]<=3){
                            color = 'rgb(0,120,135)'
                        }else if(item[val]>3&&item[val]<=4){
                            color = 'rgb(0,180,75)'
                        }else if(item[val]>4&&item[val]<=5){
                            color = 'rgb(0,240,15)'
                        }else if(item[val]>5&&item[val]<=6){
                            color = 'rgb(45,210,0)'
                        }else if(item[val]>6&&item[val]<=7){
                            color = 'rgb(105,150,0)'
                        }else if(item[val]>7&&item[val]<=8){
                            color = 'rgb(165,90,0)'
                        }else if(item[val]>8&&item[val]<=9){
                            color = 'rgb(210,45,0)'
                        }else{
                            color = 'rgb(255,0,0)'
                        }
                        expression_fill.push(item.id,color)
                        expression_fillop.push(item.id,0.9)
                        expression_lineop.push(item.id,0.9)
                    }
                })
                expression_fill.push('#3a587d')
                expression_fillop.push(0.2)
                expression_lineop.push(0.2)
                map.setPaintProperty("plates_fill", "fill-color", expression_fill);
                map.setPaintProperty("plates_fill", "fill-opacity", expression_fillop);
                map.setPaintProperty("plates_line", "line-opacity", expression_lineop);
                map.setZoom(8.7);
                //设置图表
                this.setAssessChart()
               
            }
        },
        //板块评估数据图表
        setAssessChart(){
            var that = this
            var chartDom = document.getElementById('assess_chart');
            var myChart = echarts.init(chartDom);
            var option;
            var source = []
            var dataArr = []
            this.assessData.forEach(item=>{
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
                            "rgb(0,60,195)",
                            "rgb(0,120,135)",
                            "rgb(0,180,75)",
                            "rgb(0,240,15)",
                            "rgb(45,210,0)",
                            "rgb(105,150,0)",
                            "rgb(165,90,0)",
                            "rgb(210,45,0)",
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

            option && myChart.setOption(option);
        },
        //加载地图事件
        loadMapEvents(){
            var that = this
            var map = this.city_map
            var popup = new that.mbgl.Popup({
                closeButton: false,
                closeOnClick: false,
            });
            map.on("mousemove", "plates_fill", e => {
                if(that.curAssessItem!==null&&that.curTab=='plate_assess'){
                    map.getCanvas().style.cursor = "pointer";
                    let coordinates = [e.lngLat.lng, e.lngLat.lat];
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }

                    var id = e.features[0].properties.id;
                    let flag = that.checkPlateArr.includes(id)
                    if(!flag){
                        return
                    }
                    let curData = that.plateList.filter(item=>item.id==id)[0]

                    var info = `<P class="item_head">${curData.name}</p>
                    <div class="item_name">类别：<span class="item_val">${that.curAssessItem.label}</span></div>
                    <div class="item_name">数值：<span class="item_val">${curData[that.curAssessItem.id]}</span></div>`;
                    popup.setLngLat(coordinates).setHTML(info).addTo(map);
                }
            });
            map.on("mouseleave", "plates_fill", e => {
                if(that.curAssessItem!==null&&that.curTab=='plate_assess'){
                    map.getCanvas().style.cursor = "";
                    popup.remove();
                }
            });
            map.on("click", "plates_fill", e => {
                if(that.curAssessItem!==null&&that.curTab=='plate_assess'){
                    let  id = e.features[0].properties.id
                    let curRow = that.assessData.filter(item=>item.id==id)[0]
                    let topHeight = document.getElementsByClassName("assess_"+id)[0].offsetTop 
                    that.$refs.assessTable.bodyWrapper.scrollTop = topHeight
                    that.$refs.assessTable.setCurrentRow(curRow)
                    that.toPlate(id)
                }
            });
        },
        tableRowClassName({row, rowIndex}) {
            return "assess_"+row.id
        },
    }
}
</script>
<style lang="scss">
.plate_assess{
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
    .setting{
        padding: 10px 0;
        .el-radio{
            color:#cacaca;
        }
        .paltes{
            display: flex;
            align-items: center;
            margin-top: 5px;
            padding: 0 10px;
            margin-bottom: 10px;
            .title{
                width: 55px;
                color: #fff;
            }
        }
    }
    .assess_treebox{
        margin-top: 20px;
        padding-left: 15px;
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
                color: #fff;
                font-size: 12px;
                width: 50px;
                text-align: right;
                margin-right: 10px;
                position: relative;
                margin-top: -4px;
            }
            .block {
                width: 30px;
                height: 30px;
            }
        }
    }
    .data_list{
        position: fixed;
        background: #fff;
        left: calc(100% - 270px);
        top: 65px;
        box-shadow: rgb(0 0 0 / 10%) 0 0 10px;
        z-index: 999;
        width: 260px;
        height: auto;
        border-radius: 6px;
        overflow: hidden;
        .top{
            width: 100%;
            height: 45px;
            text-align: center;
            line-height: 45px;
            position: relative;
            z-index: 99;
        }
        .paltes{
            display: flex;
            align-items: center;
            height: 45px;
            padding: 0 10px;
            border-top: #EBEEF5 1px solid;
            .title{
                width: 55px;
            }
        }
    }
    .data_chart{
        position: fixed;
        left: 480px;
        bottom: -100%;
        right: 300px;
        height: 260px;
        transition: all 0.5s;
        #assess_chart{
            width: 100%;
            height: 100%;
        }
    }
    .current-row td {
        background-color: #098c80 !important;
        color: #fff;
    }
}
</style>