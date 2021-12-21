<template>
  <div :class="['landDetail_wrap',ani?'landDetail_wrap_active':'']">
      <dv-border-box-12 :class="['detail_box',ani?'detail_box_acitve':'']">
            <i class="iconfont icon-guanbi" @click="close"></i>
            <div class="title">{{title}}</div>
            <div class="create_date">{{create_date}}</div>
            <div class="content">{{content}}</div>
      </dv-border-box-12>
  </div>
</template>

<script>
import House from "@/api/houseDataApi.js"
export default {
    props:['landId'],
    data(){
        return{
            title:'',
            create_date:'',
            content:"",
            ani:false
        }
    },
    methods:{
        close(){
           this.ani = false
           setTimeout(_=>{
               this.$parent.closeDetail()
           },300)
        }
    },
    created(){
        House.getDynamicInfo(this.landId).then(res=>{
             let data = res.data.data.kpRst
             this.title = data.title
             this.create_date = data.createDate
             this.content = data.content
         })
    },
    mounted(){
        setTimeout(_=>{
            this.ani = true
        },50)
    }
}
</script>
<style lang="scss" scoped>
.landDetail_wrap{
    position: fixed;
    top:0;
    left:0;
    height: 100%;
    width: 100%;
    background: #41454a00;
    z-index: 30;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
    color:white;
    .detail_box{
        height: 88%;
        width: 88%;
        background: rgba(47, 62, 70, 1);
        border-radius: 8px;
        position: relative;
        transform: scaleY(0.1);
        opacity: 0;
        transition:  all 0.3s  ease ;
        ::v-deep .dv-border-svg-container{
            z-index: 10;
        }
        .icon-guanbi{
            position: absolute;
            right: 22px;
            top:-18px;
            color:white;
            font-size:20px;
            z-index: 21;
            &:hover{
                transform: rotate(180deg);
                transition: all 0.3s ease;
            }
        }
    .title{
        font-size:22px;
        font-weight: 700;
        margin-top:40px;
        text-align: center;
    }
    .create_date{
        color:#ccc;
        font-size:14px;
        margin-top:5px;
         text-align: center;
    }
    .content{
        line-height:30px;
        margin-top:30px;
        text-indent: 32px;
         text-align: center;
    }
        
    }
    .detail_box_acitve{
        transform: scaleY(1);
        opacity: 1;
        transition:  all 0.3s  ease ;
    }
}
.landDetail_wrap_active{
    transition: all 0.3s ease;
}
</style>