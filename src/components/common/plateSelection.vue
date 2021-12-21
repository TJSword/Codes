<template>
    <!-- 板块选择 -->
    <div class="palte_selection">
        <el-select size="small" v-model="curCheckPlateArr" placeholder="板块选择" 
        @change="plateChange" multiple collapse-tags clearable filterable>
            <el-checkbox style="margin-left:20px;margin-top:6px;" :indeterminate="platesIsAll" v-model="plateAll" @change="plateAllChange">全选</el-checkbox>
            <el-option
                v-for="item in curPlatesList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
        </el-select>
    </div>
</template>
<script>
import ledgerApi from "@/api/ledgerApi"
import citymapApi from "@/api/citymapApi"
export default {
    name:'plateselection',
    props:{
        pType:{
            type:String,
            default:'regions'
        }
    },
    data(){
        return {
            plateList:[],//版块列表
            regionList:[],//区县市列表
            checkPlateArr:[],//选择的板块ID
            checkRegionArr:[],//选择的区县市ID
            curPlatesList:[],//当前的版块列表
            curCheckPlateArr:[],//当前类型选择的板块ID
            platesIsAll:false,
            plateAll:true,
        }
    },
    mounted(){
        //获取区县市、板块数据
        this.getPlates()
    },
    watch:{
        pType:{
            handler(newVal){
                this.curPlatesList = newVal=='plates'?JSON.parse(JSON.stringify(this.plateList)):JSON.parse(JSON.stringify(this.regionList))
                this.curCheckPlateArr = newVal=='plates'?JSON.parse(JSON.stringify(this.checkPlateArr)):JSON.parse(JSON.stringify(this.checkRegionArr))
                if(newVal=='plates'||newVal=='regions'){
                    this.sendPlates()
                }
            },
            deep:true
        }
    },
    methods:{
        //板块选择
        plateChange(val){
            let arr = []
            this.curPlatesList.forEach(item=>{
                arr.push(item.id)
            })
            let checkedCount = val.length;
            this.plateAll = checkedCount === arr.length;
            this.platesIsAll = checkedCount > 0 && checkedCount < arr.length;
            this.sendPlates()
        },
        //板块全选全部选
        plateAllChange(val){
            let arr = []
            this.curPlatesList.forEach(item=>{
                arr.push(item.id)
            })
            this.curCheckPlateArr = val?arr:[]
            this.platesIsAll = false
            this.sendPlates()
        },
        sendPlates(){
            this.$emit('selectedPlates',{
                lists:this.curPlatesList,
                ids:this.curCheckPlateArr,
                regions:this.regionList,
                plates:this.plateList,
            })
        },
        //获取区县市、板块数据
        getPlates(){
            var that = this
            let code = localStorage.getItem('cityCode')
            ledgerApi.getRegions({cityCode:code?code:'510100'})
            .then(res=>{
                console.log(res)
                if(res.data.code===0){
                    let data = res.data.data.searchRst
                    let arr = []
                    let idArr = []
                    data.forEach(item=>{
                        arr.push({
                            id:item.id,
                            name:item.name,
                            center:item.center,
                            coordinates:item.coordinates
                        })
                        idArr.push(item.id)
                    })
                    that.regionList = arr
                    that.checkRegionArr = idArr
                    if(that.pType=='regions'){
                        that.curPlatesList = JSON.parse(JSON.stringify(that.regionList))
                        that.curCheckPlateArr = JSON.parse(JSON.stringify(that.checkRegionArr))
                        that.sendPlates()
                    }
                }
            })
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
                        coordinates:item.coordinate
                    })
                    idArr.push(item.id)
                })
                that.plateList = arr
                that.checkPlateArr = idArr
                if(that.pType=='plates'){
                    that.curPlatesList = JSON.parse(JSON.stringify(that.plateList))
                    that.curCheckPlateArr = JSON.parse(JSON.stringify(that.checkPlateArr))
                    that.sendPlates()
                }
            })
        },
    }
}
</script>