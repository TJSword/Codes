<template>
    <div class="product_wrap">
        <div class="first_box">
            <div class="item" v-for="(item,index) in 6" :key="index">户型</div>
        </div>
        <div class="second_box">

        </div>
        <ChildDetail></ChildDetail>
    </div>
    
</template>
<script>
import ChildDetail from "./ChildDetail"
export default {
    name:'product',
    data(){
        return{

        }
    },
    components:{
        ChildDetail
    }
}
</script>
<style lang="scss" scoped>
    .product_wrap{
        padding:20px 0;
        .first_box{
            display: flex;
            .item{
                margin-right:100px;
                font-size:18px;
            }
        }
    }
</style>