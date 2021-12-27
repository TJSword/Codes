<template>
    <div class="infomation_city" :style="{
            'top':classBoxFlag?'203px':'37px',
            'height':classBoxFlag?heigth_true:heigth_false
        }">
        <div class="chart_item" v-for="item in classificationObj" :key="item.id" >
            <DQchart :categoryObj="item"/>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";

import DQchart from '../../common/DQchart'
export default {
    name:'ecahrtscomponent',
    components:{
        DQchart
    },
    data(){
        return{
            heigth_false:(window.innerHeight-33)+'px',
            heigth_true:(window.innerHeight-200)+'px',
        }
    },
    mounted(){
        console.log(this.classification,this.classificationObj)
    },
    watch: {
        
    },
    computed: {
        ...mapGetters(["classification","classificationObj","classBoxFlag"])
    },
}
</script>
<style lang="scss" scoped>
.infomation_city{
    width: 100.3%;
    height: 100%;
    position: absolute;
    top: 37px;
    overflow-y: scroll;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: start;
    transition: all 0.5s;
    .chart_item{
        width: 100%;
        height: 99%;
        background: #141414;
        border: 1px solid #2a2a2b;
        margin-top: 3px;
    }
    
}
@media screen and(max-width: 1000px) {
    .chart_item{
        width:100% !important;
    }
}
</style>