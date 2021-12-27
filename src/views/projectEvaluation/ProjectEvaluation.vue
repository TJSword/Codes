<template>
    <div class="eva_wrap" :style="{'height':height + 'px'}">
            <div class="projectEvaluation">
        <div class="searchHeader">
            <div class="button_box">
                <!-- <img src="~@/assets/img/login/logo_eva.png" alt="logo" class="logo"> -->
                <div :class="['search_btn',menu_1_index === index?'active':'']" v-for="(item,index) in menu_1" :key="index" @click="chooseMenu_1(index,item.value)">{{item.label}}</div>
            </div>
            <div class="input_box">
                <el-input
                    placeholder="请输入内容"
                    prefix-icon="el-icon-search"
                    class="search"
                    size="small"
                    v-model="inputValue"
                    clearable>
                </el-input>
                 <el-tooltip class="item" effect="dark" content="输入标签、用户以及案例名称 回车搜索" placement="bottom">
                <i class="el-icon-s-opportunity icon"></i>
                </el-tooltip>
            </div>
        </div>
        <div class="criteria_box">
            <div class="criteria_item">
                <div class="criteria_title">热搜标签</div>
                <div class="criteria_item_box">
                   <div class="option_1" v-if="hasChild">
                        <p :class="['item', menu_2_index === index?'active':'']" v-for="(item,index) in menu_2" :key="index" @click="chooseMenu_2(index)">{{item.classifyName}}</p>
                   </div>
                   <div class="optopn_2">
                       <p :class="['option_2_item',pitchonTags.includes(item)?'active':'']" v-for="(item,index) in menu_3" :key="index" @click="chooseMenu_3(item)">{{item}}</p>
                   </div>
                </div>
            </div>
             <div class="criteria_item">
                <div class="criteria_title">行政区域</div>
                <div class="criteria_item_box">
                   <div class="optopn">
                       <p :class="['option_item',pitchonReginno.includes(item.value)?'active':'']" v-for="(item,index) in regionArr" :key="index" @click="chooseRegino(item.value)">{{item.label}}</p>
                   </div>
                </div>
            </div>
            <div class="criteria_item">
                <div class="criteria_title">建筑形态</div>
                <div class="criteria_item_box">
                   <div class="optopn">
                       <p :class="['option_item',pitchonBuild.includes(item.value)?'active':'']" v-for="(item,index) in buildArr" :key="index" @click = "chooseBuild(item.value)">{{item.label}}</p>
                   </div>
                </div>
            </div>
        </div>
        <div class="result_box">
            <div class="box_header">
                <div class="order_box">
                    <p :class="['order_item',sortIndex === index?'active':'']" v-for="(item,index) in sortArr" :key="index" @click="sortIndex = index">{{item}}</p>
                </div>

            </div>
            <div class="result_main">
                <Card v-for="(item,index) in listArr" :key="index" :cardData="item"></Card>
                <div v-if="listArr.length === 0" class="tip">暂无案例</div>
            </div>
            <el-pagination
            background
            layout="prev, pager, next"
            :page-size="16"
            :total="caseTotal"
            @current-change="currentPage">
            </el-pagination>
        </div>
      <el-backtop target=".eva_wrap" ></el-backtop>
    </div>

    </div>

</template>
<script>
import Card from "@/components/main/projectevaluation/Card"
import projectevaluation from "@/api/projectevaluation" //引入api
export default {
    name:'projectevaluation',
    data(){
        return{
            inputValue:"",
            menu_1:[{
                label:"产品分析",value:'cpfx'
            },{
                 label:"项目规划",value:'xmgh'
            },{
                 label:"营销展示",value:'yxzs'
            }],
            menu_1_index:0,
            regionArr:[],
            height:window.innerHeight - 51,
            buildArr:[],
            hasChild:true,
            menu_2:[],
            menu_2_index:0,
            menu_3:[],
            menu_3_index:"",
            sortArr:['点赞排序','互动排序','我的收藏'],
            sortIndex:0,
            pitchonTags:[], //选中的标签   数组
            pitchonReginno:[""],
            pitchonBuild:[""],
            page:1,
            caseTotal:0,
            listArr:[]
        }
    },
    components:{
        Card
    },
    watch:{
        pitchonTags(){
            this.getCaseList()
        },
        pitchonReginno(){
            this.getCaseList()
        },
        pitchonBuild(){
            this.getCaseList()
        },
        page(){
            this.getCaseList()
        }
        
    },
    methods:{
        chooseMenu_1(index,value){
            this.menu_1_index = index;
            projectevaluation.getTag(value).then(res=>{
            if(res.data.hasChild){
                this.hasChild = true
                this.menu_2 = res.data.data
                this.menu_3 = res.data.data[this.menu_2_index].tags
                this.pitchonTags = []
            }else{
                this.hasChild = false
                console.log(res.data.data)
                let arr = []
                res.data.data.forEach(item=>{
                    arr.push(item.tag)
                })
                this.menu_3 = arr
                this.pitchonTags = []
            }
         })
        },
        chooseMenu_2(index){
            console.log(index)
            this.menu_3 = this.menu_2[index].tags
            this.menu_2_index = index,
            this.pitchonTags = []
        },
        chooseMenu_3(value){
            if(this.pitchonTags.includes(value)){
                let index = this.pitchonTags.indexOf(value)
                this.pitchonTags.splice(index,1)
            }else{
                this.pitchonTags.push(value)
            }

        },
        initial(){//初始化标签内容
             projectevaluation.getTag('cpfx').then(res=>{
                 console.log(res.data.data)
                 this.menu_2 = res.data.data;
                 this.menu_3 = res.data.data[0].tags
             })
        },
        chooseRegino(value){
            console.log(this.regionArr)
            if(value === ""){//选择了全部
                this.pitchonReginno = [""]
            }else{
                if(this.pitchonReginno[0] == ""){//如果已经选了全部
                    this.pitchonReginno = []
                    this.pitchonReginno.push(value)
                }else{
                    if(this.pitchonReginno.includes(value)){
                        let index = this.pitchonReginno.indexOf(value)
                        this.pitchonReginno.splice(index,1)
                        if(this.pitchonReginno.length === 0){
                            this.pitchonReginno = [""]
                        }
                    }else{
                        this.pitchonReginno.push(value)
                    }
                    
                }
                
            }
            console.log(this.pitchonReginno)
        },
        chooseBuild(value){
             
            if(value === ""){//选择了全部
                this.pitchonBuild = [""]
            }else{
                if(this.pitchonBuild[0] == ""){//如果已经选了全部
                    this.pitchonBuild = []
                    this.pitchonBuild.push(value)
                }else{
                    if(this.pitchonBuild.includes(value)){
                        let index = this.pitchonBuild.indexOf(value)
                        this.pitchonBuild.splice(index,1)
                        if(this.pitchonBuild.length === 0){
                            this.pitchonBuild = [""]
                        }
                    }else{
                        this.pitchonBuild.push(value)
                    }
                    
                }
                
            }
            console.log(this.pitchonBuild)
        },
        getCaseList(form){
           if(form){
                projectevaluation.getList(form).then(res=>{
                    console.log(res.data.data.list)
                    this.caseTotal = res.data.data.total
                    let listArr = res.data.data.list
                    console.log(listArr)
                    listArr.forEach(item=>{
                        item.imageUrl = item.imageUrl.split(',')[0]
                    })
                    this.listArr = listArr
                })
           }else{
                let form = {}
                form.tags = this.pitchonTags.join(',')
                let topLabel = this.menu_1[this.menu_1_index].value
                form.topLabel = topLabel;
                let code = this.menu_2[this.menu_2_index].code
                form.code = code;
                let buildForms = this.pitchonBuild
                form.buildForms = buildForms.join(',')
                let regionnos = this.pitchonReginno
                form.regionnos = regionnos.join(',');
                let name = this.inputValue;
                form.name = name
                form.limit = 16;
                form.page = this.page
                console.log(form)
                projectevaluation.getList(form).then(res=>{
                    console.log(res.data.data.total)
                    this.caseTotal = res.data.data.total
                    this.listArr = res.data.data.list
                })
           }
        },
        currentPage(val){
            console.log(val)
            this.page = val
        },
    },
    created(){
        projectevaluation.getTypeDict('case_build_form').then(res=>{
            console.log(res.data.data)
            res.data.data.unshift({
                label:'全部',
                value:''
            })
            this.buildArr = res.data.data;
        })
        projectevaluation.getRegion().then(res=>{
            console.log(res)
            let arr =[]
            res.data.data.forEach(item=>{
                arr.push({label:item.name,value:item.regionno})
            })
            arr.unshift({label:'全部',value:""})
            this.regionArr  = arr;
            console.log(this.regionArr)
        })
        this.initial();
        this.getCaseList({
            code:'hx',
            topLabel:'cpfx',
            tags:'',
            buildForms:'',
            regionnos:'',
            name:'',
            page:1,
            limit:16
        })
    }
}
</script>
<style lang="scss" scoped>
*{
    margin:0;
    padding:0;
    user-select: none;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
.eva_wrap{
    background: #F6F6F6;
    overflow-y:scroll;
    .btn{
        padding:10px 20px!important;
    }
}
 .projectEvaluation{
     height:100%;
     width:70%;
     margin-left:15%;
     background:white;;
     .searchHeader{
         height:60px;
         width:100%;
         display: flex;
         align-items: center;
         justify-content: space-between;
        .button_box{
            display: flex;
            height:60px;
            align-items: center;
            .logo{
                height:43px;
                margin-right:10px;
            }
            .search_btn{
                height: 43px;
                color: #8590a6;
                font-size:16px;
                margin-top:15px;
                margin-left:30px;
                transition: all 0.3s;
                &::after{
                     content:"";
                     opacity: 0.5;
                     transition: all 0.3s;
                     height: 0;
                     margin-top:0;
                     width:0;
                }
            }
            .active{
                color: black;
                font-weight: 600;
                transition: all 0.3s;
                &::after{
                    content:"";
                    display: block;
                    height: 3px;
                    background: #0084ff;
                    margin-top:12px;
                    transition: all 0.3s;
                    opacity: 1;
                    transition: all 0.3s;
                    width:100%;
                }
            }
        }
        .input_box{
            display: flex;
            align-items: center;
            justify-content: center;
            .search{
                margin-right:20px;
                border:0;
            }
            .icon{
                font-size:24px;
                margin-right:25px;
                color:#0084ff
            }
        }
     }
     .criteria_box{
         min-height:240px;
         padding: 15px 0 0 0;
         width:100%;
         margin-top:10px;
         box-shadow: 0px 20px 20px 0px rgba(0, 0, 0, 0.17);
         border:1px solid rgba(56, 56, 56, 0.3);
         .criteria_item{
             min-height: 20px;
             margin-bottom:10px;
             display: flex;
             justify-content: flex-start;
             align-items: center;
             padding: 20px 0;
             .criteria_title{
                 font-size:16px;
                 font-weight: 600;
                 margin-left:25px;
                 white-space: nowrap;
             }
             .criteria_item_box{
                 margin-left:30px;
                 .optopn{
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    .option_item{
                         font-size:14px;
                         margin-right:25px;
                         transition:all 0.3s;
                         cursor: pointer;
                    }
                    .active{
                        color:#0084ff;
                        transition:all 0.3s;
                    }
                 }
                .option_1{
                    display: flex;
                    margin-bottom: 10px;
                    .item{
                        font-size:14px;
                        margin-right:50px;
                        transition:all 0.3s;
                        cursor: pointer;
                    }
                    .active{
                        color:#0084ff;
                        transition:all 0.3s;
                    }
                }
                .optopn_2{
                    display: flex;
                    .option_2_item{
                        padding:0 10px;
                        height:35px;
                        margin-right:30px;
                        font-size:14px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border:1px solid #0084ff;
                        color:#0084ff;
                        cursor: pointer;
                    }
                    .active{
                        color:white;
                        background: #0084ff;
                        
                    }
                }
             }
         }
     }
     .result_box{
         margin-top:30px;
         border:1px solid rgba(0, 0, 0, 0.17);
         .box_header{
             height:60px;
             display: flex;
             align-items: center;
             justify-content: space-between;
             .order_box{
                 display: flex;
                 .order_item{
                     margin-left:25px;
                     font-size:14px;
                     margin-right:5px;
                     transition: all 0.3s;
                     cursor: pointer;
                 }
                 .active{
                     color:#0084FF;
                     transition: all 0.3s;
                 }
             }
             .create{
                 height:40px;
                 padding:0 15px;
                 margin-right:25px;
             }
         }
         .result_main{
             padding: 25px;
             padding-top:10px;
             padding-bottom:15px;
             display: flex;
             flex-wrap: wrap;
             .tip{
                 width:100%;
                 text-align: center;
                 color:rgba(0, 0, 0, 0.7);
                 margin:20px 0;
             }
         }
         .el-pagination{
             float: right;
             z-index:-1;
             margin-top:20px;
             margin-bottom: 40px;
         }
     }
 }
</style>
