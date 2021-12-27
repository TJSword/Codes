<template>
    <div class="exhibition_warp">
        <div class="content">
            <MapComponent mapType="exhibition" />
        </div>
    </div>
</template>
<script>
import MapComponent from '@/components/common/MapComponent'
export default {
    name:'exhibition',
    components:{
        MapComponent
    }
}
</script>
<style lang="scss" scoped>
.exhibition_warp{
    width: 100%;
    position: absolute;
    bottom: 0;
    top: 102px;
    .content{
        width: 100%;
        height: 100%;
        align-items: center;
        display: flex;
    }
}
</style>