<template>
    <!-- 静态测算 -->
    <div class="static_calc">
        <StaticTable />
    </div>
</template>
<script>
import StaticTable from "@/components/main/staticCalc/calcTable.vue"
export default {
    name:'staticcalc',
    components:{
        StaticTable
    },
}
</script>