<template>
    <div class="pop_home">
        <PopInLayer v-if="popType=='popIn'" />
        <PopOutLayer v-if="popType=='popOut'" />
        <PopDistribution v-if="popType=='popDis'" />
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import PopInLayer from '@/components/main/population/popInLayer.vue'
import PopOutLayer from '@/components/main/population/popOutLayer.vue'
import PopDistribution from '@/components/main/population/popDistribution.vue'

export default {
    name:'pop_home',
    props:{
        
    },
    components:{
        PopInLayer,
        PopOutLayer,
        PopDistribution
    },
    data(){
        return {
            
        }
    },
    computed:{
        ...mapGetters(['ledger_map','mapIsload',"popType"])
    },
    watch:{
        isShow:{
            handler(newVal){
                
            },
        },
        
    },
    mounted(){
        
        
    },
    methods:{
        
    }
}
</script>
<style lang="scss">


</style>