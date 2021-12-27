<template>
    <!-- 板块评分 -->
    <div class="plategrade_wrap" :style="{ height: screenHeight + 'px' }">
        <PlategradeOption class="option" />
        <!-- 地图组件 -->
        <MapComponent mapType="plateGrade" class="plategrade_map" />
    </div>
</template>
<script>
//组件 
import PlategradeOption from '@/components/main/analysistools/PlategradeOption'
import MapComponent from '@/components/common/MapComponent'
export default {
    name:'commongrade',
    components:{
        PlategradeOption,
        MapComponent
    },
    data(){
        return {
            screenHeight: window.innerHeight, //屏幕高度减去顶层高度
        }
    },
    methods:{
        
    }
}
</script>
<style lang="scss">
.plategrade_wrap{
    width: 100%;
    height: 100%;
    background: #1a1f23;
    color: '#fff';
    position: relative;
    .plategrade_map{
        width: 100%;
        height: 100%;
    }
    .option{
        position: absolute;
        z-index: 99;
        right: 20px;
        top: 30px;
        width: 18%;
        height: 92%;
    }
}
</style>