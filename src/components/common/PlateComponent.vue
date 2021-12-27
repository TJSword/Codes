<template>
    <div class="plate_wrap">
        <div :class="[plateType=='region'?'plate_box_region':'']" style="padding:8px">
            <div class="plate_row" v-for="(item,i) in plate_data" :key="i">
                <div :class="[plateType=='region'?'second_plate':'first_plate']" 
                    :style="{'background':plateType=='region'?(cur_plate.indexOf(item.id)==-1?'#232427':'#42426b'):'linear-gradient(to right, #224e7d 0, #1b82f1 100%)'}"
                    @click="choosePlate(i)">
                    <i :class="['iconfont icon-'+item.regionno]"></i>
                    <div class="name">{{item.name}}</div>
                </div>
                <div class="second_plate" v-for="(item1,j) in item.children" :key="j" 
                    :style="{'background':cur_plate.indexOf(item1.id)==-1?'#303135':'#42426b'}" 
                    @click="choosePlate(i,j)">
                    <i :class="['iconfont icon-'+item1.regionno]"></i>
                    <div class="name">{{item1.name}}</div>
                </div>
            </div>
        </div>
        <div class="head">
            <div class="right">
                <div class="count">板块总数量：{{plate_count}}</div>
                <div class="plate_search">
                    <el-input v-model="plateSearch" clearable @input="searchPlate()" size="mini" placeholder="输入板块检索"></el-input>
                </div>
                <el-link v-if="!cardFlag" type="primary" @click="plateAll()">{{plate_all?"取消全选":"全选"}}</el-link>
            </div>
        </div>
        
    </div>
</template>
<script>
import { mapGetters } from "vuex"
//import Storage from "@/utils/storage"
export default {
    name:'platelist',
    props:{
        cityID:{ //父组件传入的城市
            type:String,
            default:'qingdao'
        }
    },
    data(){
        return{
            plate_all:false, //板块全选
            cur_plate:[], //选择的板块
            plate_count:null, //板块数量
            plate_data:[], //板块信息
            plateData_backups:[], //板块信息_备份
            plateSearch:'',//板块检索
        }
    },
    mounted(){
    },
    computed:{
        ...mapGetters(["plateType","cardFlag","plateData","plateArr"])
    },
    watch:{
        plateType:{
            handler(){
                 this.setPlateData()
            },
            deep:true,
            immediate:true
        },
        plateArr:{
            handler(newVal){
                this.cur_plate=newVal
                if(newVal.length==0){
                    this.plate_all = false
                }
            },
            deep:true
        }
    },
    methods:{
        searchPlate(){ //搜索板块
            let backups = JSON.parse(JSON.stringify(this.plateData_backups))
            if(this.plateSearch==''){
                this.plate_data = backups
            }else{
                backups.forEach(item=>{
                    item.children = item.children.filter(data => 
                        !this.plateSearch || data.name.toLowerCase().includes(this.plateSearch.toLowerCase())
                    )
                })
                let r_backups = backups.filter(item=>item.children.length>0)
                this.plate_data = r_backups
            }
        },
        setPlateData(){ //设置板块数据
            let data = JSON.parse(JSON.stringify(this.plateData))
            let l = 0
            if(this.plateType==="part"){
                data[this.plateType].forEach(item=>{
                    l += item.children.length
                })
                data[this.plateType] = data[this.plateType].filter(item=>item.children.length>0)
            }
            if(this.plateType!=="city"){
                this.plate_count = this.plateType==="part"?l:data[this.plateType].length
                this.plate_data = data[this.plateType]
                this.plateData_backups = data[this.plateType]
            }
            this.$store.dispatch("setPlateArr",[])
            this.cur_plate=[]
            this.plateSearch = ''
            this.plate_all = false
        },
        choosePlate(i,j){ //选择板块
            console.log(i,j)
            if(this.cardFlag){
                this.$message('请从地图上选择要展示的板块名片')
                return
            }

            let id = j!==undefined?this.plate_data[i].children[j].id:this.plate_data[i].id
            let index = this.cur_plate.indexOf(id)

            
            //通用板块点击行政区选择取消行政区下的所有版块
            if(j===undefined&&this.plateType!=='region'){
                let curChildren = this.plate_data[i].children
                let selectArr = curChildren.filter(item=>{
                    return this.cur_plate.indexOf(item.id)!==-1
                })
                let noSelectArr = curChildren.filter(item=>{
                    return this.cur_plate.indexOf(item.id)===-1
                })
                if(selectArr.length==curChildren.length){ // 已全选，取消该行政区的全选
                    selectArr.forEach(item=>{
                        let id_index = this.cur_plate.indexOf(item.id)
                        this.cur_plate.splice(id_index,1)
                    })
                }else{
                    noSelectArr.forEach(item=>{
                        this.cur_plate.push(item.id)
                    })
                }
            }else{
                if(index==-1){ //未选择
                    if(this.cardFlag){ //板块名片状态，板块单选
                        this.cur_plate = []
                        this.cur_plate.push(id)
                    }else{ //非板块名片，板块多选
                        this.cur_plate.push(id)
                    }
                }else{ //已选择
                    this.cur_plate.splice(index,1)
                }
            }

            this.$store.dispatch("setPlateArr",this.cur_plate)
        },
        plateAll(){ //板块、取消全选
            if(this.plate_all){
                this.cur_plate = []
            }else{
                this.cur_plate = []
                if(this.plateType==="region"){
                    this.plate_data.forEach(item=>{
                        this.cur_plate.push(item.id)
                    })
                }else{
                    this.plate_data.forEach(item=>{
                        item.children.forEach(child=>{
                            this.cur_plate.push(child.id)
                        })
                    })
                }   
                
            }
            this.plate_all = !this.plate_all
            this.$store.dispatch("setPlateArr",this.cur_plate)
        },
    }
}
</script>
<style lang="scss">
.plate_wrap{
    width: 94.5%;
    height: 100%;
    background: #141414;
    position: relative;
    .head{
        position: fixed;
        top: 4px;
        left: 49%;
        z-index: 99;;
        display: flex;
        
        height: 33px;
        color: #fff;
        align-items: center;
        justify-content: space-between;
        padding:  0 10px;
        .right{
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .count{
                margin-left: 20px;
                color: #e6a23c;
            }
            .plate_search{
                margin: 0 15px;
                .el-input__inner{
                    background: none !important;
                    border-radius: 20px;
                    border: #383838 1px solid;
                    color: #e6a23c;
                }
            }
        }
    }
    .plate_box_region{
        display: flex;
        flex-wrap: wrap;
    }
    .plate_row{
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        cursor: pointer;
        .iconfont{
            color: rgba(255, 255, 255, 0.8);
            font-size: 12px;
            margin-right: 5px;
            border: rgba(255, 255, 255, 0.4) 1px solid;
            border-radius: 4px;
            overflow: hidden;
            padding: 0px 3px;
            display: none;
        }
        .first_plate{
            margin-bottom: 6px;
            font-size: 12px;
            user-select: none;
            z-index: 1;
            position: relative;
            padding: 4px 8px;
            margin-right: 6px;
            display: flex;
            align-items: center;
            outline: none;
            border: none;
            background: linear-gradient(to right, #224e7d 0, #1b82f1 100%);
            color: #fff;
            border-radius: 6px;
        }
        .second_plate{
            margin-bottom: 6px;
            font-size: 12px;
            padding: 4px 8px;
            margin-right: 6px;
            background: #232427;
            color: #ffffff;
            -webkit-transition: all 0.5s;
            transition: all 0.5s;
            user-select: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            transition: all 0.5s;
            border-radius: 6px;
        }
        .second_plate:hover{
            background: #1a6f6f;
        }
        .plate_item{
            font-size: 12px;
            display: flex;
            align-items: center;
            margin-bottom: 4px;
            margin-left: 4px;
            padding: 2px 8px;
            border: 1px #141414 solid;
            transition: all 0.3s;
        }
        .plate_item_on{
            font-size: 12px;
            display: flex;
            align-items: center;
            margin-bottom: 4px;
            margin-left: 4px;
            padding: 2px 8px;
            border: 1px #367d84 solid;
            -webkit-transition: all 0.3s;
            transition: all 0.3s;
            background: #1a6f6f;
        }
        .icon{
            width: 15px;
            height: 15px;
            background-size: contain;
            background-repeat: no-repeat;
            position: relative;
            opacity: 0.8;
        }
        .plate_item:hover{
            border: 1px #e6a23c solid;
        }
    }
}
</style>