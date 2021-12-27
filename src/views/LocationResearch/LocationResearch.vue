<template>
 <div class="locationResearch_wrap">
     <Map @map="getMap"/>
    <div class="header">
         <div class="title">
            <div class="cn">一小时定位</div>
            <div class="en">One Hour Research</div>
         </div>
         <div class="menu">
             <div :class="['menu_item',$route.path === item.path?'menu_item_active':'']" v-for="(item,index) in menu" :key="index" @click="currentMenu(item.path,index)">{{item.title}}</div>
         </div>
         <el-select v-model="value" placeholder="已有定位清单" size="small" class="select" @change="selectChange">
            <el-option
            v-for="(item,index) in listArr"
            :key="item.id"
            :label="item.name"
            :value="index">
            </el-option>
        </el-select>
        <el-popconfirm
            confirm-button-text='确定'
            cancel-button-text='取消'
            title="你确定重做吗？"
            @confirm="reform"
        >
            <el-button slot="reference" class="reform"  size="small">我要重做</el-button>
        </el-popconfirm>
        <el-button slot="reference" v-if="progress == 4" @click="saveList" class="save" size="small">保存清单</el-button>
    </div>
    <keep-alive>
        <router-view></router-view>
    </keep-alive>
    
 </div>
</template>

<script>
import Map from "../../components/main/locationResearch/map"
import locationResearch from "../../api/locationResearch"
import { mapGetters } from "vuex"
export default {
    components:{
        Map
    },
    computed:{
        ...mapGetters(['locationId'])
    },
    data(){
        return{
            listArr:[],
            menu:[{
                title:'土地台账',
                path:'/locationResearch/landParameter'
            },{
                title:'客户模型',
                path:'/locationResearch/customerModel'
            },{
                title:'竞品市场',
                path:'/locationResearch/goodsMarket'
            },{
                title:'初步可研',
                path:'/locationResearch/initialAdjustment'
            },{
                title:'定位决策',
                path:'/locationResearch/locationDecision'
            }],
            value: '',
            innerHeight:667,
            progress:0,
            locationName:''
        }
    },
    methods:{
        selectChange(index){
            console.log(this.listArr[index])
            this.locationName = this.listArr[index].name
            this.$store.dispatch('setLocationId',this.listArr[index].id)
            this.menu = [{
                title:'定位决策',
                path:'/locationResearch/locationDecision'
            }]
        },
        getMap(map){
            map.on('load',_=>{
                this.$store.dispatch('setMap',map)
            })
        },
        currentMenu(path,index){
            if(index>this.progress){
                this.$message({
                    message: '请按照顺序完成模块',
                    type: 'warning'
                })
                return
            }
            if(this.$route.path !== path){ //判断当前路由是否是要跳转的路由
                this.$router.push(path)
            }
        },
        reform(){
            this.$router.push('/locationResearch/landParameter')
            console.log(this.$route.path)
            // location.reload()
            let timer = setInterval(_=>{
                if(this.$route.path === '/locationResearch/landParameter'){
                    clearInterval(timer)
                    location.reload()
                }
            },100)
        },
        saveList(){
             this.$prompt('请输入定位清单名称', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue:this.locationName
                }).then(({ value }) => {
                    locationResearch.saveList({
                        name:value,
                        id:this.locationId
                    }).then(res=>{
                        if(res.data.code === 0){
                            this.$message({
                                type:'success',
                                message:'保存成功'
                            })
                        }
                        locationResearch.getLocationList().then(res=>{
                            this.listArr = res.data.data
                        })
                    })

                }).catch(() => {
            });
        }
    },
    watch:{
        '$route.path'(newVal){
            let menu = this.menu
            menu.forEach((item,index)=>{
                if(item.path == newVal){
                    if(index >this.progress){
                        this.progress = index
                    }
                }
            })
            this.$store.dispatch("setProgress",this.progress)
        }
    },
    created(){
        locationResearch.getLocationList().then(res=>{
            this.listArr = res.data.data
        })
    }
}
</script>

<style lang="scss" scoped>
.locationResearch_wrap{
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    overflow: hidden;
    height: 100%;
    .header{
        height:59px;
        background:#0b090a;
        display: flex;
        align-items: center;
        border-bottom: 1px solid hsla(0,0%,100%,.2);
        justify-content: space-between;
        position: relative;
        z-index: 9999;
        .title{
            width: 130px;
            height:100%;
            display: flex;
            color:white;
            flex-direction: column;
            margin-left:43px;
            justify-content: center;
            user-select: none;
            .cn{
                font-size:18px;
                font-weight: 700;
                letter-spacing: 8px;
                white-space: nowrap;
            }
            .en{
                font-size:14px;
                white-space: nowrap;
            }
        }
         ::v-deep .el-input__inner{
            background: transparent;
            color:white;
        }
    }
    .menu{
        height: 100%;
        margin-left:100px;
        display: flex;
        align-items: center;
        font-size:15px;
        color:white;
        width:62%;
        .menu_item{
            margin-right: 150px;
            cursor: pointer;
            user-select: none;
        }
        .menu_item_active{
        color:#219ebc;
        font-weight: 700;
    }

    }
    .select{
        width:180px;
    }
    .reform{
        margin:0 60px;
        background: #1b2e3f;
        color:white;
    }
    .save{
        margin-right: 60px;
        background: #219ebc;
        color:white;
    }
   
}
</style>