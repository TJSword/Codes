
<template>
    <div class="card" @click="jumpToDetail(cardData.id)">
        <img :src="cardData.imageUrl" alt="" class="card_img">
        <div class="label_box" v-show="cardData.tags[0] != ''">
            <div class="label_item" v-for="(item,index) in cardData.tags" :key="index">{{item}}</div>
        </div>
        <div class="noLabel" v-show="cardData.tags[0] == ''"></div>
        <div class="title_box">
            <div class="title">{{cardData.name}}</div>
            <div class="region">{{cardData.region}}</div>
        </div>
        <div class="user_box">
            <div class="user">
                <img :src="cardData.headUrl" alt="" class="avator">
                <span style="white-space:nowrap">{{cardData.username}}</span>
            </div>
            <div class="operation_box">
                <i class="iconfont icon-dianzan"></i><div class="num">{{cardData.likeCount}}</div>
                <i class="iconfont icon-shoucang"></i><div class="num">{{cardData.collectCount}}</div>
                <i class="iconfont icon-pinglun"></i><div class="num">{{cardData.commentCount}}</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'projectorienttation',
     props: {
    // 接收父组件传递过来的信息
    cardData: {
      type: Object, //指标对象
      default: () => []
    }
  },
    methods:{
        jumpToDetail(id){
            this.$router.push({
                path:'/projectDetail',
                query:{
                    id:id
                }
            })
        },

    },
    created(){
        console.info(this.cardData)
        this.cardData.tags = this.cardData.tag.split(',').slice(0,2)
        
    }
}
</script>
<style lang="scss" scoped>
                 .card{
                 width: 23%;
                 height: 380px;
                 margin-right:2.3%;
                 border:1px solid rgba(0, 0, 0, 0.17);
                 margin-bottom: 30px;
                 transition: all 0.3s;
                 box-shadow: 0px 10px 10px 0px rgba(0, 0, 0, 0.17);
                 &:nth-child(4n){
                 margin-right: 0;
                }
                &:hover{
                    transform: scale(1.02);
                    box-shadow: 0px 10px 10px 0px rgba(0, 0, 0, 0.30);
                     transition: all 0.3s;
                }
                .card_img{
                    width:100%;
                    height:68%;
                }
                .label_box{
                    display: flex;
                    margin-top:5px;
                    padding:0 5%;
                    height:27px;
                    .label_item{
                        border:1px solid #0084ff;
                        color:#0084ff;
                        font-size: 14px;
                        padding: 2px 5px;
                        max-width: 120px;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                        margin-right:12px;
                    }
                }
                .noLabel{
                     margin-top:5px;
                    padding:0 5%;
                    height:27px;
                }
                .title_box{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding:0 5%;
                    margin-top:10px;
                    font-size:16px;
                    .title{
                        max-width:200px;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                    .region{
                        color:#8590a6;
                        white-space: nowrap;
                    }
                }
                .user_box{
                    display: flex;
                    margin-top:10px;
                    padding:0 5%;
                    justify-content: space-between;
                    align-items: center;
                    .user{
                        display: flex;
                        align-items: center;
                        .avator{
                            height:25px;
                            width:25px;
                            border-radius: 50%;
                            margin-right:6px;
                        }
                    }
                    .operation_box{
                        display: flex;
                        align-items: center;
                        font-size:12px;
                        .iconfont{
                            margin:0 4px;
                            color:rgba(0, 0, 0, 0.6);
                            font-size:15px;
                        }
                        .icon-dianzan{
                         font-size:14px;
                        }
                        .icon-shoucang,.icon-pinglun{
                            color:rgba(0, 0, 0);
                        }
                        .num{
                            margin-top:3px;
                            margin-right:2px;
                        }
                    }
                }
             }
</style>