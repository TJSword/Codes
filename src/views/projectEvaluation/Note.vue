<template>
    <div class="note_wrap">
        <div class="header">
            <div class="block">
                <el-carousel trigger="click" height="350px">
                    <el-carousel-item v-for="item in 4" :key="item">
                        <h3 class="small">{{ item }}</h3>
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div class="information_box">
                <div class="title">笔记信息</div>
                <div class="line"></div>
                <div class="info_detail">
                   <div class="item" v-for="(item,index) in 4" :key="index">
                       <div class="item_title">笔记标题</div>
                       <!-- 笔记标题，笔记分类，创建人，创建时间。 -->
                       <div class="item_value">卓越誉珑</div>
                   </div>
                </div>
            </div>
        </div>
        <div class="label">
             <div class="title">标注</div>
             <div class="line"></div>
             <pre class="detail">
                1.为了借助社交产品的流量，让用户主动分享APP中的内容到社交平台来达到拉新和促活的目的，
                2.市场上绝大多数APP都有第三方分享的功能，它是内容分发的最有效途径，并且大大降低了企业的营销成本。
                3.我们从分享时机、分享形式、分享动机、分享场景4个维度来聊聊「社交分享」的那些事儿。
                4.现在很多APP在用户截图时会自动提示用户是否要进行分享。这个时机确实抓的很棒，一般来说，用户截图大多数时候都是为了分享给他人
                5.用户分享内容到社交媒体或好友，不应该是一种粗暴的强制行为，我们应该在保证产品本身内容有吸引力的核心前提...
             </pre>
        </div>
        <ImageBabel></ImageBabel>
        <Comments></Comments>
        <Correlation></Correlation>
    </div>
</template>
<script>
import ImageBabel from '@/components/main/projectevaluation/ImageBabel';
import Comments from "@/components/main/projectevaluation/comments";
import Correlation from "@/components/main/projectevaluation/Correlation"
import Table from '@/components/main/projectevaluation/Table';
export default {
    name:'Note',
    data(){
        return{

        }
    },
    components:{
        ImageBabel,
        Comments,
        Correlation,
        Table
    }
}
</script>
<style lang="scss" scoped>
    .note_wrap{
        padding:20px 0;
        .header{
            display: flex;
            .block{
                width:55%;
                background: hotpink;
            }
            .information_box{
                width:35%;
                margin-left:10%;
                .title{
                    font-size:20px;
                }
                .line{
                    width:100%;
                    height:1px;
                    background: rgba(0,0,0,0.17);
                    margin-top:14px;
                }
                .info_detail{
                    .item{
                        display: flex;
                        width:100%;
                        font-size:16px;
                        margin-top:25px;
                        .item_title{
                            white-space: nowrap;
                            color:rgba(166,166,166);
                            width:120px;
                        }
                    }
                }
            }
        }
        .label{
            margin-top:20px;
            .title{
                    font-size:20px;
                }
                .line{
                    width:100%;
                    height:1px;
                    background: rgba(0,0,0,0.17);
                    margin-top:14px;
                }
                .detail{
                    white-space: pre-line;
                    margin-top:20px;
                    line-height:2.5;
                }
        }
    }
</style>