<template>
    <div class="data_query">
        <Menu />
        <InfomationCity v-if="plateType=='city'" />
        <InfomationPlate v-if="plateType!=='city'" />
    </div>
</template>
<script>
import { mapGetters } from "vuex";
//组件
import Menu from "@/components/main/dataquery/Menu"
import InfomationCity from "@/components/main/dataquery/InfomationCIty"
import InfomationPlate from "@/components/main/dataquery/InfomationPlate"

export default {
    name:'dataquery',
    components:{
        Menu,
        InfomationCity,
        InfomationPlate
    },
    data(){
        return{

        }
    },
    
    mounted(){

    },
    computed:{
        ...mapGetters(["plateType"])
    },
    watch: {
        plateType:{
            handler(newVal){
                console.log(newVal)
            },
            deep:true
        }
    },
    methods:{

    }
}
</script>
<style lang="scss" scoped>
.data_query{
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    background-color: #1a1f23;
    overflow: hidden;
}
</style>