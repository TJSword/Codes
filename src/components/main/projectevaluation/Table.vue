<template>
    <div class="table_wrap">
        <div class="header">
            <div class="title">{{tableData.type}}</div>
            <div class="line"></div>
       </div>
       <div class="table_detail">
           <div class="table_item" v-for="(item,index) in tableData.arr" :key="index"> 
               <div class="item_title">{{item.label}}</div>
               <div class="item_value">{{item.value?item.value:'暂无'}}</div>
           </div>
       </div>
    </div>
</template>
<script>
export default {
    name:'projectorienttation',
    props:{
        tableData:{
            type:Object
        }
    },
    created(){
        console.log(this.tableData)
    }
}
</script>
<style lang="scss" scoped>
    .table_wrap{
        margin-top:30px;
        margin-bottom: 30px;
        .header{
            .title{
                font-size:20px;
            }
            .line{
                width:100%;
                height:1px;
                background: rgba(0,0,0,0.17);
                margin-top:14px;
            }
        }
        .table_detail{
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            .table_item{
                display: flex;
                width:50%;
                font-size:16px;
                margin-top:15px;
                .item_title{
                    white-space: nowrap;
                    color:rgba(166,166,166);
                    width:120px;
                }
                &:first-child{
                    margin-top:20px;
                }
                .item_value{
                    width:60%;
                }
            }
        }
    }
</style>