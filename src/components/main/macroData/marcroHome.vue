<template>
    <div class="macrohome_wrap">
        <!-- 配置 -->
        <div class="diver">查询条件</div>
        <div class="setting">
            <!-- <div class="plates_type">
                <div class="title">类型：</div>
                <div class="cont">
                    <el-radio-group v-model="platesType" @change="changePlatesType">
                        <el-radio label="regions">区县市</el-radio>
                        <el-radio label="plates">板块</el-radio>
                    </el-radio-group>
                </div>
            </div>
             -->
            <div class="level_range">
                <div class="title">范围：</div>
                <div class="cont">
                    <el-radio-group v-model="levelRange" @change="levelChange">
                        <el-radio label="country">全国</el-radio>
                        <el-radio label="city">城市</el-radio>
                        <el-radio label="regions">区县市</el-radio>
                        <el-radio label="plates">板块</el-radio>
                    </el-radio-group>
                </div>
            </div>
            <div class="paltes" v-if="levelRange=='regions'||levelRange=='plates'">
                <div class="title">板块：</div>
                <div class="cont">
                    <PlatesSelection :pType="levelRange" @selectedPlates="setPlateIds" />
                </div>
            </div>
            <div class="year_range">
                <div class="title">时间：</div>
                <div class="cont" v-if="levelRange=='country'||levelRange=='city'">
                    <el-date-picker size="small" v-model="startYear" type="year" value-format="yyyy"
                    placeholder="开始" style="width:85px;" @change="setStartYear"></el-date-picker>
                    <div style="color:#fff;margin:0 5px;">至</div>
                    <el-date-picker size="small" v-model="endYear" type="year"  value-format="yyyy"
                    placeholder="结束" style="width:85px;" @change="setEndYear"></el-date-picker>
                </div>
                <div class="cont" v-else>
                    <el-date-picker size="small" v-model="singleYear" type="year" value-format="yyyy"
                    placeholder="选择年份"></el-date-picker>
                </div>
            </div>
        </div>
        <!-- 宏观数据条目 -->
        <div class="diver">查询类目</div>
        <div class="macro_treebox">
            <el-tree
                ref="macroTree"
                :height="cmListHeight"
                :props="defaultProps"
                :data="macroList"
                :check-strictly="true"
                show-checkbox
                node-key="code"
                highlight-current
                @check="checkMacroItem">
            </el-tree>
        </div>
        <div class="btns">
            <el-button size="small" type="default" :disabled="searchLoading" @click="resetData()">重置</el-button>
            <el-button size="small" type="primary" :icon="searchLoading?'el-icon-loading':'el-icon-search'" :disabled="searchLoading" @click="searchMarket()">{{searchLoading?'查询中':'查询'}}</el-button>
        </div>
        <!-- 列表 -->
        <div class="data_list" v-show="showInfo" :style="{left:positionX+'px',top:positionY+'px'}">
            <div class="top" @mousedown="move">
                <el-select v-model="curShowId" placeholder="请选择" size="small" @change="changeTableData">
                    <el-option
                        v-for="item in checkedNodeMacro"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                    </el-option>
                </el-select>
            </div>
            <el-table ref="macroTable" :data="macroTableData" stripe border :height="cmTableHeight"
            :highlight-current-row="true" :summary-method="getSummaries" show-summary>
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column prop="year" label="维度" sortable></el-table-column>
                <el-table-column prop="value" label="数值" sortable></el-table-column>
            </el-table>
        </div>
        <!-- 图表 -->
        <div class="data_chart" :style="{bottom:showInfo?'20px':'-110%'}">
            <div id="macro_chart"></div>
        </div>
        <!-- 图例 -->
        <div class="legend" v-show="showLegend">
            <div class="unit">{{checkedNodeMacro[0]?checkedNodeMacro[0].name:'/'}}</div>
            <div class="legend_item" v-for="(item, i) in legendBar" :key="i">
                <div class="val">{{ item.value }}</div>
                <div class="block" :style="{ background: item.color }"></div>
            </div>
        </div>
    </div>
</template>
<script>
import * as echarts from 'echarts';
import PlatesSelection from "@/components/common/plateSelection.vue"
import { mapGetters } from 'vuex';
import macroApi from "@/api/macroApi"
export default {
    name:"macrohome",
    components:{
        PlatesSelection
    },
    data(){
        return {
            positionX:null,
            positionY:null,
            cmListHeight:window.innerHeight-380,//列表高度
            cmTableHeight:window.innerHeight-280,//列表高度
            platesType:'regions',//板块类型
            levelRange:'country',//范围
            startYear:'2011',
            endYear:'2021',
            singleYear:'2019',//单年份
            curCheckPlateArr:[],//选择的板块ID
            curPlatesList:[],//当前的版块列表
            plateList:[],//版块列表
            regionList:[],//区县市列表

            macroList:[
                // { code:'HG',name:'GDP',children:[
                //     { code: "HG01",name:'生产总值(亿元)'}
                // ]}
            ],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            searchLoading:false,
            curMacroItem:null,//当前选择的数据项
            checkedIdMacro:[],//选择的数据项id
            checkedNodeMacro:[],//选择的数据项node
            myChart:null,

            searchData:{},//查询回来的数据对象
            showInfo:false,
            curShowId:null,//选择显示条目ID
            macroTableData:[],//当前显示的宏观数据
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
        }
    },
    mounted(){
        this.setMacroDataDict()
    },
    computed:{
        ...mapGetters(['macro_map','cityCode'])
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
        //设置宏观数据字典
        setMacroDataDict(){
            var that = this
            macroApi.getMacroDataDict()
            .then(res=>{
                if(res.data.code===0){
                    console.log('宏观数据字典',res)
                    let data = res.data.data 
                    let mainId = data.filter(item=>item.code==='H')[0].id
                    let list = []
                    data.forEach(item=>{
                        if(item.pid===mainId){
                            list.push(item)
                        }
                    })
                    list.forEach(item=>{
                        let children = data.filter(d=>d.pid===item.id)
                        children.forEach(c=>{
                            c.disabled = false
                        })
                        item.children = children
                    })
                    console.log(list)
                    that.macroList = list
                }else{
                    that.$message.error(res.data.msg)
                }
            })
        },
        //切换地理范围
        levelChange(val){
            var map = this.macro_map
            if(val=='regions'||val=='plates'){
                map.setLayoutProperty('plate_fill','visibility',val==='plates'?'none':'visible')
                map.setLayoutProperty('plate_line','visibility',val==='plates'?'none':'visible')
                map.setLayoutProperty('plate_labels','visibility',val==='plates'?'none':'visible')
                map.setLayoutProperty('plates_fill_macro','visibility',val==='plates'?'visible':'none')
                map.setLayoutProperty('plates_line_macro','visibility',val==='plates'?'visible':'none')
                map.setLayoutProperty('plates_labels_macro','visibility',val==='plates'?'visible':'none')
            }else{
                this.resetData()
            }
            this.macroList.forEach(item=>{
                item.children.forEach(c=>{
                    if(c.code=='HG01'){
                        c.disabled = false
                    }else{
                        c.disabled = val=='regions'||val=='plates'
                    }
                })
            })
            this.checkedNodeMacro = []
            this.$refs.macroTree.setCheckedNodes([])
        },
        setStartYear(val){
            console.log(val)
            if(this.endYear!==''){
                if(val>this.endYear){
                    this.startYear = JSON.parse(JSON.stringify(this.endYear))
                    this.endYear = val
                }
            }
        },
        setEndYear(val){
            console.log(val)
            if(this.startYear!==''){
                if(val<this.startYear){
                    this.endYear = JSON.parse(JSON.stringify(this.startYear))
                    this.startYear = val
                }
            }
        },
        //设置选择的板块列表及ID数据
        setPlateIds(val){
            console.log('板块组件值',val)
            this.curPlatesList = val.lists
            this.curCheckPlateArr = val.ids
            this.regionList = val.regions
            this.plateList = val.plates
        },
        //选择查询项目
        checkMacroItem(checkedNode,checked){
            console.log(checkedNode,checked)
            // if(checkedNode===this.curMacroItem){
            //     this.curMacroItem = null
            // }else{
            //     this.$refs.macroTree.setCheckedNodes([checkedNode]);
            //     this.curMacroItem = checkedNode
            // }
            let curId = checkedNode.code
            let checkedKeys = checked.checkedKeys
            let checkedNodes = checked.checkedNodes
            if(checkedKeys.length>4){
                this.$message('最多选择四个')
                this.checkedIdMacro = checkedKeys.filter(item=>item!==curId)
                this.checkedNodeMacro = checkedNodes.filter(item=>item.code!==curId)
                this.$refs.macroTree.setCheckedKeys(this.checkedIdMacro);
            }else{
                this.checkedIdMacro = checkedKeys
                this.checkedNodeMacro = checkedNodes
            }
        },
        //切换表格数据
        changeTableData(val){
            this.macroTableData = this.searchData[val]
        },
        //重置数据
        resetData(){
            //this.startYear = ''
            //this.endYear = ''
            this.singleYear = '2019'
            this.curMacroItem = null
            this.checkedIdMacro = []
            this.checkedNodeMacro = []
            this.searchData = {}
            this.showInfo = false
            this.curShowId = null
            this.macroTableData = []
            this.showLegend = false
            this.legendBar = []
            this.$refs.macroTree.setCheckedNodes([]);
            
            var map = this.macro_map
            map.setPaintProperty('plate_fill','fill-color','#3a587d')
            map.setPaintProperty('plate_fill','fill-opacity',0.2)
            map.setPaintProperty('plate_line','line-opacity',0.2)
            map.setPaintProperty('plates_fill_macro','fill-color','#3a587d')
            map.setPaintProperty('plates_fill_macro','fill-opacity',0.2)
            map.setPaintProperty('plates_line_macro','line-opacity',0.2)
        },
        //查询宏观数据
        searchMarket(){
            var that = this
            if(that.checkedNodeMacro.length==0){
                that.$message('至少选择一个类目')
                return
            }
            let flag = that.levelRange=='country'||that.levelRange=='city'
            let reqObj = {}
            if(flag){ //全国、城市
                if(that.startYear==''||that.endYear==''){
                    that.$message('请先选择时间范围')
                    return
                }
                let code = ''
                this.checkedIdMacro.forEach(item=>{
                    code += item+','
                })
                reqObj = {
                    udCode:code,
                    minyear:that.startYear,
                    maxyear:that.endYear,
                    cityno:that.levelRange=='country'?'100000':that.cityCode
                }
            }else{ //区县市、板块
                if(that.singleYear==''){
                    that.$message('请先选择时间')
                    return
                }
                let partIds = ''
                that.curCheckPlateArr.forEach(item=>{
                    partIds += item+','
                })
                if(partIds==''){
                    that.$message('请先选择板块')
                    return
                }
                reqObj = {
                    type:that.levelRange=='regions'?'region':'part',
                    codes:partIds,
                    year:that.singleYear
                }
            }
            let url = flag?'/dms/hg/search':'/dms/hg/gdp'
            macroApi.getMacroData(url,reqObj)
            .then(res=>{
                if(res.data.code===0){
                    let data = res.data.data
                    let obj = {
                        colors:['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
                        series:[],//数据
                        xAxisData:[],//x坐标
                        yAxisData:[],//y坐标
                        legendData:[] //图例数据
                    }
                    if(flag){
                        that.searchData = data
                        for(let i = JSON.parse(that.startYear);i<JSON.parse(that.endYear)+1;i++){
                            obj.xAxisData.push(i)
                        }
                        let offset = 0
                        that.checkedNodeMacro.forEach((item,i)=>{
                            if(i==0){
                                that.curShowId = item.code
                                that.macroTableData = data[item.code]
                            }
                            
                            obj.legendData.push(item.name)
                            offset += i==0||i==1?0:60
                            obj.yAxisData.push({
                                type: 'value',
                                name: '',
                                position: i==0?'left':'right',
                                offset: i==0?0:offset,
                                axisLine: {
                                    show: true,
                                    lineStyle: {
                                        color: obj.colors[i]
                                    }
                                },
                                splitLine:{
                                    show:false,
                                },
                                axisLabel: {
                                    formatter: '{value}'
                                }
                            })
                            let curData = data[item.code] //当前类型的数据
                            let seriesData = []
                            obj.xAxisData.forEach(p=>{
                                let curVal = curData.filter(d=>d.year==p)[0]
                                seriesData.push(curVal?curVal.value:null)
                            })
                            obj.series.push({
                                name: item.name,
                                type:  i==0||i==2?'line':'bar',
                                yAxisIndex:i,
                                data: seriesData
                            })
                        })
                    }else{
                        let isRegion = that.levelRange=='regions'
                        let tableData = []
                        let seriesData = []
                        let curName = that.checkedNodeMacro[0].name
                        that.curShowId = that.checkedNodeMacro[0].code
                        data.forEach(item=>{
                            obj.xAxisData.push(isRegion?item.regionname:item.partname)
                            seriesData.push(parseInt(item.value))

                            tableData.push({
                                id:isRegion?item.regionno:item.partno,
                                year:isRegion?item.regionname:item.partname,
                                value:parseInt(item.value)
                            })
                        }) 
                        that.macroTableData = tableData
                        obj.series = [{
                            name: curName,
                            type:  'bar',
                            yAxisIndex:0,
                            data: seriesData
                        }]
                        obj.legendData = [curName]
                        obj.yAxisData = [{
                            type: 'value',
                            name: '',
                            position: 'left',
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: obj.colors[0]
                                }
                            },
                            splitLine:{
                                show:false,
                            },
                            axisLabel: {
                                formatter: '{value}'
                            }
                        }]
                        //渲染板块
                        that.renderPlates()
                    }
                    that.setMacroChart(obj)
                }else{
                    that.$message.error(res.data.msg)
                }
            })
            
        },
        
        //设置图表
        setMacroChart(data){
            if(this.myChart === null){
                var chartDom = document.getElementById('macro_chart');
                var myChart = echarts.init(chartDom);
                this.myChart = myChart
            }
            
            var option;
            var option = {
                color: data.colors,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                grid: {
                    right: '20%'
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
                    }
                ],
                toolbox: {
                    feature: {
                        dataView: {show: true, readOnly: false},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                legend: {
                    textStyle:{
                        color:'#fff'
                    },
                    data: data.legendData
                },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLabel: { 
                            //interval: 0, 
                            rotate: 30 ,
                            color: "#fff",
                            fontSize:10
                        },
                        data: data.xAxisData
                    }
                ],
                yAxis: data.yAxisData,
                series: data.series
            };
            option && this.myChart.setOption(option,true);
            this.showInfo = true
        },

        //渲染板块
        renderPlates(){
            var that = this
            var map = this.macro_map
            let data = []
            this.macroTableData.forEach(item=>{
                data.push(item.value)
            })
            //获取数据平均值 等分
            let maxNum = Math.max(...data)
            let minNum = Math.min(...data)
            let allNum = maxNum - minNum
            let average = Math.ceil(allNum/35)
            //设置图例
            this.showLegend = true
            let legendArr = [{ value: minNum, color: "none" }];
            this.colorBar.forEach((item, i) => {
                legendArr.unshift({
                    value: (minNum+average * (i + 1)).toFixed(1),
                    color: item.color,
                    avColor: item.avColor
                });
            });
            this.legendBar = legendArr;
            //根据值渲染板块
            let expression_fill = ["match", ["get", "id"]];
            let expression_fillop = ["match", ["get", "id"]];
            let expression_lineop = ["match", ["get", "id"]];
            this.macroTableData.forEach(item=>{
                let color = ''
                let avColor = ''
                if(item.value==minNum){
                    color = '#3a587d'
                    avColor = '0X007D583A'
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
            })

            expression_fill.push('#3a587d')
            expression_fillop.push(0.2)
            expression_lineop.push(0.2)
            if(this.levelRange=='plates'){
                console.log(expression_fill)
                map.setPaintProperty("plates_fill_macro", "fill-color", expression_fill);
                map.setPaintProperty("plates_fill_macro", "fill-opacity", expression_fillop);
                map.setPaintProperty("plates_line_macro", "line-opacity", expression_lineop);
            }else{
                map.setPaintProperty("plate_fill", "fill-color", expression_fill);
                map.setPaintProperty("plate_fill", "fill-opacity", expression_fillop);
                map.setPaintProperty("plate_line", "line-opacity", expression_lineop);
            }
        },
        //板块合计
        getSummaries(param){
            const { columns, data } = param;
            const sums = [];
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
                    sums[index] = sum.toFixed(2)
                }
            });

            return sums;
        },
    },
}
</script>
<style lang="scss">
.macrohome_wrap{
    .el-tree-node:focus>.el-tree-node__content{
        background: none !important;
    }
    .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
        background: none;
    }
    .setting{
        padding: 10px 0;
        .el-radio{
            color:#cacaca;
            margin-top: 8px;
        }
        .paltes,.time,.plates_type,.level_range,.year_range,.buildfrom{
            display: flex;
            align-items: center;
            margin-top: 5px;
            padding: 0 10px;
            margin-bottom: 10px;
            .title{
                width: 55px;
                color: #fff;
            }
            .cont{
                display: flex;
                align-items: center;
                width: calc(100% - 56px);
            }
            .el-date-editor .el-range-input{
                width: 35%;
            }
        }
        .year_range .el-input--suffix .el-input__inner {
            padding-right: 20px;
        }
    }
    .diver{
        padding: 10px 20px;
        border-bottom: #464646 1px solid;
        font-size: 14px;
        color: #8bc34a;
    }
    .macro_treebox{
        margin-top: 20px;
        padding-left: 15px;
        .el-checkbox__label{
            color: #99faff;
        }
        .el-tree .el-tree-node .is-leaf + .el-checkbox .el-checkbox__inner{display: inline-block;}
        .el-tree .el-tree-node .el-checkbox .el-checkbox__inner{display: none;}
    }
    .btns{
        display: flex;
        justify-content: flex-end;
    }
    .data_list{
        position: fixed;
        background: rgb(29 32 39 / 90%);
        left: calc(100% - 270px);
        top: 60px;
        box-shadow: rgb(0 0 0 / 10%) 0 0 10px;
        z-index: 999;
        width: 260px;
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
    .data_chart{
        position: fixed;
        left: 500px;
        bottom:-100%;
        right: 300px;
        height: 260px;
        transition: all 0.5s;
        background: rgba(29, 32, 39, 0.9);
        padding: 20px 0;
        #macro_chart{
            width: 100%;
            height: 100%;
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
}
</style>