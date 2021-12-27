<template>
    <!-- 条件分析 -->
    <div class="condition">
        <div class="condition_option">
            <ConditionOption />
        </div>
        <div class="condition_map">
            <MapComponent  mapType="condition"/>
        </div>
    </div>
</template>
<script>
//组件
import MapComponent from '@/components/common/MapComponent'
import ConditionOption from '@/components/main/analysistools/ConditionOption'

export default {
    name:'condition',
    components:{
        MapComponent,
        ConditionOption
    },
    data(){
        return {
        }
    },
    mounted(){

    },
    watch:{},
    computed:{},
    methods:{

    }
}
</script>
<style lang="scss" scoped>
.condition{
    border-top: #383838 1px solid;;
    position: absolute;
    width:100%;
    top: 0;
    left: 0px;
    bottom: 0;
    background:#1a1f23;
    display: flex;
    justify-content: space-between;
    .condition_map{
        width: 50%;
        height: 100%;
    }
    .condition_option{
        width: 49.9%;
        height: 100%;
        background: #0c1015;
        border-left: #263950 1px solid;
    }
}
    
</style>