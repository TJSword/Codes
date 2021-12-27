<template>
    <!-- 等时圈 -->
    <div class="isochronous_wrap">
        <MapIsochronous />
    </div>
</template>
<script>
//组件
import MapIsochronous from '@/components/main/analysistools/MapIsochronous'
export default {
    name:'projectorienttation',
    components:{
        MapIsochronous
    }
}
</script>
<style lang="scss">
.isochronous_wrap{
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    background-color: #1a1f23;
    overflow: hidden;
}
</style>