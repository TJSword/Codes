<template>
    <div class="secondarymenu_wrap">
        <div class="section1">
            <!-- 一级菜单 -->
            <div class="left">
                <i :class="['home_icon iconfont icon-' + pageTitile[queryMenuIndex].icon]" @click="toMenuIndex"></i>
                <div class="page_label">{{pageTitile[queryMenuIndex].label}}</div>
                <div class="menus" style="display:none">
                    <div class="menus_item" 
                    :style="{'color':cur_menuIndex===index?'#9595f6':'#ccc'}"
                    v-for="(item,index) in menu_data" :key="item.id"
                    @click="show_menu(index)"
                    >
                        <svg
                        :style="{'color':cur_menuIndex===index?'#9595f6':'#ccc'}"
                        class="icon-svg aui-navbar__icon-menu" 
                        aria-hidden="true"><use :href="'#'+item.icon"></use></svg>
                        <div class="name">{{item.name}}</div>
                    </div>
                </div>
                <div class="class_search" v-if="cur_menuIndex==0">
                     <el-input v-model="classSearch" clearable @input="searchCalss()" size="mini" placeholder="输入指标检索"></el-input>
                </div>
                <div class="class_control" v-if="cur_menuIndex==0">
                    <el-link type="primary" @click="classControl()">{{showFlag==1?"全部指标":"常用指标"}}</el-link>
                </div>
                <div class="class_cancel" v-if="cur_menuIndex==0">
                    <el-link type="warning" @click="classCancel()">清空选中</el-link>
                </div>
                <div class="menu_toggle" style="margin-left:30px;">
                    <div :class="[classBoxFlag?'up-arrow':'down-arrow']" @click="menuToggle"></div>
                </div>
            </div>
            <!-- 板块类型选择 -->
            <div class="region_class">
                <el-select @change="changePlateType" class="region_select" v-model="current_class" placeholder="请选择">
                    <el-option
                    v-for="item in region_classData"
                    :key="item.type"
                    :disabled="item.disabled"
                    :label="item.name"
                    :value="item.type">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="section2" :style="{'top':classBoxFlag?'0px':'-202px'}">
            
            <div class="menu_box" :style="{'width':plateType=='city'?'100%':'50%'}">
                <el-scrollbar class="menu_scroll">
                    <div class="m_wrap" v-if="second_menuData.length>0">
                        <!-- 二级菜单 -->
                        <div class="menu2" v-for="(item,i) in second_menuData" :key="item.id">
                            <div class="menu2_name" @click="chooseTitleMenu(item,i)" v-if="item.children.length>0">{{item.name}}</div>
                            <!-- 三级菜单 -->
                            <div class="menu3_wrap" 
                            v-for="(item1,j) in item.children" :key="item1.id"
                            v-show="item1.iscommon>=showFlag">
                                <div  
                                    :class="[classification.indexOf(item1.id)==-1?'menu3':'menu3_on']"
                                    :style="{'background':item1.iscommon==1?'#283644':'#232427'}"
                                    
                                    @click="indexSelection(i,j)"
                                >{{item1.name}}</div>
                            </div>
                            
                        </div>
                    </div>
                    <div class="search_tip" v-else>未查询到相应指标</div>
                </el-scrollbar>
            </div>
            <div class="plate_box" v-show="plateType=='city'?false:true">
                <el-scrollbar class="menu_scroll">
                    <PlateComponent cityID="jinan"/>
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"

//组件
import PlateComponent from '../../common/PlateComponent'
export default {
    name:'secondarymenu',
    components:{
        PlateComponent
    },
    data(){
        return{
            cur_menuIndex:null, //当前菜单索引
            menu_data:[], //一级菜单数据
            second_menuData:[], //二级菜单数据
            menuData_backups:[], //二级菜单数据_备份
            region_classData:[ //区域类型
                {type:'city',name:'城市',disabled:false},
                {type:'region',name:'行政区',disabled:false}, //region
                {type:'part',name:'通用板块',disabled:false}, //part
                {type:'customize',name:'定制板块',disabled:true} //customize
            ],
            current_class:'city',//区域默认类型
            classification:[],//指标类别的id数组
            classificationObj:[],//指标类别的obj数组
            classSearch:'',//指标检索字段
            defaultList:[ //数据查询默认展示项
                ['生产总值'],
                ['地铁站点','小学','医院','商业中心'],[],[],[],[]
            ],
            showFlag:1,//0显示全部菜单，1显示常用菜单
            pageTitile:[
                {label:'宏观数据',icon:"hongguan"},
                {label:'配套数据',icon:"peitao"},
                {label:'市场数据',icon:"shichang"},
                {label:'土地数据',icon:"tudi"}
            ]
        }
    },
    props:{},
    beforeMount(){
        this.current_class = this.plateType
        //设置数据查询的菜单（路由跳转时调用）
        //this.loadMenu(this.userMenu)
    },
    mounted(){
        if(this.queryMenuIndex!=0){
            this.region_classData[0].disabled = true
        }
    },
    created(){
        
    },
    watch:{
        userMenu:{
            immediate:true,
            handler(newVal){
                console.log('监听',newVal)
                //设置数据查询的菜单（路由刷新时调用）
                this.loadMenu(newVal)
            },
            deep:true
        },
        queryMenuIndex:{
            handler(newVal){
                this.show_menu(newVal)
                if(newVal!=0){
                    this.region_classData[0].disabled = true
                }else{
                    this.region_classData[0].disabled = false
                }
            },
            deep:true
        }
    },
    computed:{
        ...mapGetters(["plateType","mapbox_map","userMenu","userMenuList","cardFlag","curMenu","classBoxFlag","queryMenuIndex"])
    },
    methods:{
        toMenuIndex(){ //跳转到首页
            this.$router.push({path:'/menuindex'})
        },
        menuToggle(){ //菜单收放
            if(this.classBoxFlag){
                this.$store.dispatch("setBoxFlag",false)
            }else{
                this.$store.dispatch("setBoxFlag",true)
            }
        },
        loadMenu(data){ //加载菜单
            let i = JSON.parse(sessionStorage.getItem('queryMenuIndex'))
            this.$store.dispatch("setQueryMenuIndex",i)
            if(data.children){
                let url = this.$route.query.type?this.$route.query.type:this.curMenu
                let menu = data.children.filter(item=>item.url == url)[0].children
                console.log('数据查询菜单',menu)
                this.menu_data = menu

                //数据查询默认加载宏观数据的指标
                this.$nextTick(()=>{
                    this.show_menu(i)
                })
                
            }   
        },
        setDefaultClass(i){ //设置数据查询各项默认指标
            if(i==null){
                i=0
            }
            let defaultList = this.defaultList
            let arr = []
            let arr_obj = []
            let classMenu = JSON.parse(JSON.stringify(this.menu_data[i].children))
            if(classMenu.length>0){
                classMenu.forEach(item=>{
                    if(item.children.length>0){
                        let deaultItem = item.children.filter(child => defaultList[i].indexOf(child.name)!==-1)
                        arr_obj = arr_obj.concat(deaultItem)
                    }
                    
                })
            }
            arr_obj.forEach(item=>{
                arr.push(item.id)
            })
            console.log(arr,arr_obj)
            this.$store.dispatch("setClass",arr)
            this.$store.dispatch("setClassObj",arr_obj)
            this.classification = arr
            this.classificationObj = arr_obj
        },
        searchCalss(){ //检索指标
            let data = JSON.parse(JSON.stringify(this.menuData_backups))
            if(this.classSearch==''){
                this.second_menuData = data
            }else{
                data.forEach(item=>{
                    item.children = item.children.filter(data => 
                        !this.classSearch || data.name.toLowerCase().includes(this.classSearch.toLowerCase())
                    )
                })
                let r_data = data.filter(item=>item.children.length>0)
                this.second_menuData = r_data
            }
        },
        show_menu(index){ //选择二级菜单
            var menu_data = this.menu_data
            // if(!this.classBoxFlag||this.queryMenuIndex!==index){
            //     //此处防止数据指向同一内存地址
            //     this.second_menuData = JSON.parse(JSON.stringify(menu_data[index].children))
            //     this.menuData_backups = JSON.parse(JSON.stringify(menu_data[index].children))
            //     if(index===2){ //市场默认隐藏建筑形态跟面积为空
            //         this.second_menuData[2].children = []
            //         this.second_menuData[3].children = []
            //     }
            //     this.$store.dispatch("setBoxFlag",true)
            // }else{
            //     this.$store.dispatch("setBoxFlag",false)
            // }
            //此处防止数据指向同一内存地址
            this.second_menuData = JSON.parse(JSON.stringify(menu_data[index].children))
            this.menuData_backups = JSON.parse(JSON.stringify(menu_data[index].children))
            if(index===2){ //市场默认隐藏建筑形态跟面积为空
                this.second_menuData[2].children = []
                this.second_menuData[3].children = []
            }
            this.cur_menuIndex = index
            //this.$store.dispatch("setQueryMenuIndex",index)

            this.classSearch = ''
            //设置默认项
            if(this.plateType==='city'){
                this.setDefaultClass(index)
            }else{
                this.$store.dispatch("setPlateArr",[])
            }
            //点击非宏观菜单时板块类型切换到通用板块
            if(index!==0&&this.plateType==="city"){
                this.current_class = "part"
                this.changePlateType('part')
            }
            //土地选择默认流通状态
            if(index===3){
                let isSelcted = this.second_menuData[0].children.filter(item=>{
                    return this.classification.indexOf(item.id) !== -1
                })
                if(isSelcted.length===0||isSelcted[0].name==='潜供土地'){
                    this.indexSelection(0,0)
                }
            }
        },
        indexSelection(i,j){ //选择三级菜单
            if(this.cardFlag&&this.plateType!="city"){
                this.$message('请先关闭板块名片再选择指标')
                return
            }
            var menu_2 = this.second_menuData
            
            //更新指标类别数组
            let arr = this.classification
            let arr_obj = this.classificationObj
            let id =  menu_2[i].children[j].id
            let obj = menu_2[i].children[j]
            let index = arr.indexOf(id)
            
            if(index===-1){ //指标未被选择，添加
                //板块市场多选，板块土地多选
                if((this.cur_menuIndex==2&&i!==1) || (this.cur_menuIndex==3&&i!==0)){ 
                    arr.push(id) 
                    arr_obj.push(obj)
                }else{ //区域为板块时类别单选
                    if(this.cur_menuIndex==2&&i===1){ //保持销售状态多选
                        let ztArr = [] //销售状态全部id数组
                        this.menuData_backups[0].children.forEach(item=>{
                            ztArr.push(item.id)
                        })
                        arr = arr.filter(item=>ztArr.indexOf(item)!==-1)
                        arr_obj = arr_obj.filter(item=>ztArr.indexOf(item.id)!==-1)
                    }else{
                        arr = []
                        arr_obj = []
                    }
                    arr.push(id)
                    arr_obj.push(obj)
                }
                
            }else{ //指标已选择，删除
                if((this.cur_menuIndex===3&&i===0)||this.cur_menuIndex==0){ //土地流通状态必选一个，城市宏观至少选择一个
                    
                }else{
                    arr.splice(index,1)
                    arr_obj.splice(index,1)
                }
            }
            //市场-物业类型所属建筑形态
            if(this.cur_menuIndex==2&&i===1){ 
                let propertyTypeLength = this.menuData_backups[1].children.filter(item=>{
                    return arr.indexOf(item.id)!==-1
                }).length
                if(propertyTypeLength===0){
                    this.second_menuData[2].children = []
                    this.second_menuData[3].children = []
                }else{
                    let data1 = JSON.parse(JSON.stringify(this.menuData_backups[2].children))
                    let data2 = JSON.parse(JSON.stringify(this.menuData_backups[3].children))
                    let curPropertyType = this.second_menuData[i].children[j].unit
                    let curPropertyArea = this.second_menuData[i].children[j].ismonth
                    this.second_menuData[2].children = data1.filter(item=>item.unit===curPropertyType&&item.iscommon==1)
                    this.second_menuData[3].children = data2.filter(item=>item.ismonth===curPropertyArea&&item.iscommon==1)
                }
            }
            //土地-流通状态切换更改底部菜单
            if(this.cur_menuIndex==3&&i===0){ 
                let back_data = JSON.parse(JSON.stringify(this.menuData_backups))
                let name = menu_2[i].children[j].name
                if(name==='已上市土地'){
                    this.second_menuData[1].children = back_data[1].children
                    this.second_menuData[2].children = back_data[2].children
                    this.second_menuData[3].children = back_data[3].children
                    //隐藏潜供土地图层
                    if(this.mapbox_map&&this.mapbox_map.getLayer('td_regulatory')!==undefined){
                        this.mapbox_map.setLayoutProperty('td_regulatory', 'visibility', 'none') 
                        this.mapbox_map.setLayoutProperty('td_regulatory_line', 'visibility', 'none') 
                        this.mapbox_map.setLayoutProperty('td_regulatory_symbol', 'visibility', 'none') 
                    }
                }else{
                    this.second_menuData[1].children = []
                    this.second_menuData[2].children = back_data[2].children
                    this.second_menuData[3].children = []
                    //隐藏已上市土地图层
                    if(this.mapbox_map&&this.mapbox_map.getLayer('td_parcel')!==undefined){
                        this.mapbox_map.setLayoutProperty('td_parcel', 'visibility', 'none') 
                        this.mapbox_map.setLayoutProperty('td_parcel_symbol', 'visibility', 'none') 
                    }
                }
            }
            this.classification = arr
            this.classificationObj = arr_obj
            //指标数组(ID,Obj)存入store
            this.$store.dispatch("setClass",arr)
            this.$store.dispatch("setClassObj",arr_obj)
            console.log(arr_obj)
        },
        chooseTitleMenu(item,i){ //选择二级全选全部选三级
            console.log(item)
            if(this.cur_menuIndex===2&&i!==1){ //数据查询市场下操作
                let cur_children = this.menuData_backups[i].children
                let curCheckedArr = cur_children.filter(item=>{
                    return this.classification.indexOf(item.id)!==-1
                })
                let curCheckedIdArr = []
                curCheckedArr.forEach(item=>{curCheckedIdArr.push(item.id)})

                if(curCheckedIdArr.length===cur_children.length){ //已全选，取消全选
                    this.classification = this.classification.filter(item=>{
                        return curCheckedIdArr.indexOf(item)===-1
                    })
                    this.classificationObj = this.classificationObj.filter(item=>{
                        return curCheckedIdArr.indexOf(item.id)===-1
                    })
                }else{
                    let addArr = cur_children.filter(item=>{
                        return this.classification.indexOf(item)===-1
                    })
                    addArr.forEach(item=>{
                        this.classification.push(item.id)
                        this.classificationObj.push(item)

                    })
                }  
                //指标数组(ID,Obj)存入store
                this.$store.dispatch("setClass",this.classification)
                this.$store.dispatch("setClassObj",this.classificationObj) 
            }
            
        },
        changePlateType(val){ //切换板块类型
            if(val==="city"){
                // if(this.cur_menuIndex!==0){ //非宏观数据不支持城市级别查询
                //     this.$message(this.menu_data[this.cur_menuIndex].name+'数据不支持城市级别查询')
                //     this.current_class = this.plateType
                //     return
                // }
                this.show_menu(0)
                this.setDefaultClass(0)
            }else{
                this.classification=[]
                this.$store.dispatch("setClass",[])
                this.classificationObj=[]
                this.$store.dispatch("setClassObj",[])
                this.$store.dispatch("setPlateArr",[])
            }
            this.$store.dispatch('setPlateType',val)
        },
        classControl(){ //常用查询与全部查询切换
            if(this.showFlag===0){
                this.showFlag=1
            }else{
                this.showFlag=0
            }
            
        },
        classCancel(){ //取消所有选中指标
            this.classification=[]
            this.$store.dispatch("setClass",[])
            this.classificationObj=[]
            this.$store.dispatch("setClassObj",[])
        },
        
    }
}
</script>
<style lang="scss">
.secondarymenu_wrap{
    width: 100%;
    position: relative;
    .section1{
        height: 40px;
        display: flex;
        align-items: center;
        justify-content:space-between;
        background: #191616;
        padding:0 20px;
        border-bottom:1px solid #383838;
        position: relative;
        z-index: 99;;
        .left{
            display: flex;
            align-items: center;
            .home_icon{
                color: #fff;
                font-size: 18px;
                margin-right: 10px;
                cursor: pointer;
            }
            .page_label{
                color: #fff;
                font-size: 14px;
                font-weight: bold;
                margin-right: 30px;
                cursor: pointer;
            }
            .menus{
                display:flex;
                align-items: center;
                .menus_item{
                    display: flex;
                    align-items: center;
                    font-size: 12px;
                    color: #ccc;
                    text-align: center;
                    padding: 5px 10px;
                    transition: all 0.2s;
                    position: relative;
                    top: 0;
                    cursor: pointer;
                    .name{
                        user-select: none;
                        margin-left: 6px;
                    }
                }
                .menus_item:hover{
                    top: -5px;
                }
            }
            .class_search{
                // margin-left: 30px;
                .el-input__inner{
                    background: none;
                    border-radius: 20px;
                    border: #383838 1px solid;
                    color: #e6a23c;
                }
            }
            .class_control,.class_cancel,.menu_toggle{
                margin-left: 20px;
                user-select: none;
            }
        }
        .region_class{
            .region_select input{
                background: none;
                color: #ffffff;
                font-size: 12px;
                border: none;
                user-select: none;
                width: 100px;
                padding-left: 0px;
            }
        }
    }
    .section2{
        background: #141414;
        transition: all 0.5s;
        height: 160px;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        border-bottom: #383838 1px solid;
        position: relative;
        top: 0px;
        .el-scrollbar {
            height: 100%;
        }
        .el-scrollbar__wrap {
            overflow-y: scroll;
            width: 106%;
            height: 111%;
        }
        .plate_box{
            height: 100%;
            width: 100%;
            transition: all 0.5s;
        }
        .menu_box{
            height: 100%;
            min-width: 50%;
            border-right: #383838 1px solid;
            .search_tip{
                color: #e6a23c;
                margin: 30px 60px;
            }
            .m_wrap{
                width: 93%;
                padding: 8px;
                .menu2{
                    display: flex;
                    flex-wrap: wrap;
                    
                    .menu2_name{
                        margin-bottom: 6px;
                        font-size: 12px;
                        user-select: none;
                        z-index: 1;
                        position: relative;
                        padding: 4px 8px;
                        margin-right: 6px;
                        outline: none;
                        border: none;
                        background: #1b9601;
                        background: linear-gradient(to right, #0d4a00 0, #1b9601 100%);
                        color: #fff;
                        cursor: pointer;
                        border-radius: 6px;
                    }
                    .menu3_wrap{
                        display: flex;
                        align-items: center;
                        flex-wrap: wrap;
                        .menu3{
                            margin-bottom: 6px;
                            font-size: 12px;
                            padding: 4px 8px;
                            margin-right: 6px;
                            background: #232427;
                            color: #ffffff;
                            transition: all 0.5s;
                            user-select: none;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            transition: all 0.5s;
                            border-radius: 6px;
                        }
                        .menu3_on{
                            margin-bottom: 6px;
                            font-size: 12px;
                            padding: 4px 8px;
                            margin-right: 6px;
                            background: #42426b !important;
                            color: #ffffff;
                            transition: all 0.5s;
                            user-select: none;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            border-radius: 6px;
                        }
                    }
                    
                }
            }
        }
        
    }
}

$strokeWidth: 2px;
$strokeColor: white;

$timing: 2s;
// $easing-down: ease-in-out;
$easing-down: cubic-bezier(0.77, 0, 0.175, 1);
$easing-up: cubic-bezier(0.77, 0, 0.175, 1);

.up-arrow,.down-arrow{
    cursor: pointer;
}
.down-arrow:before,
.down-arrow:after,
.up-arrow:before,
.up-arrow:after {
	content: '';
	display: block;
	width: 5px;
	height: 5px;
	transform: rotate(45deg);
	border-bottom: $strokeWidth solid $strokeColor;
	border-right: $strokeWidth solid $strokeColor;
}
.up-arrow:before,
.up-arrow:after{
    transform: rotate(-135deg);
}
.down-arrow:before {
	animation: down-arrow-before $timing $easing-down infinite;
}

.down-arrow:after {
	animation: down-arrow-after $timing $easing-down infinite;
}

@keyframes down-arrow-before {
	50% {
		transform: rotate(45deg) translate(70%, 70%);
	}
	100% {
		transform: rotate(45deg) translate(70%, 70%);
	}
}

@keyframes down-arrow-after {
	50% {
		transform: rotate(45deg) translate(110%, 110%);
		opacity: 0;
	}
	51% {
		transform: rotate(45deg) translate(-130%, -130%);
	}
	100% {
		transform: rotate(45deg) translate(-70%, -70%);
		opacity: 1;
	}
}
.up-arrow:before {
	animation: up-arrow-before $timing $easing-up infinite;
}

.up-arrow:after {
	animation: up-arrow-after $timing $easing-up infinite;
}

@keyframes up-arrow-before {
	50% {
		transform: rotate(-135deg) translate(110%, 110%);
		opacity: 0;
	}
	51% {
		transform: rotate(-135deg) translate(-130%, -130%);
	}
	100% {
		transform: rotate(-135deg) translate(-70%, -70%);
		opacity: 1;
	}
}

@keyframes up-arrow-after {
	
    50% {
		transform: rotate(-135deg) translate(70%, 70%);
	}
	100% {
		transform: rotate(-135deg) translate(70%, 70%);
	}
}
</style>