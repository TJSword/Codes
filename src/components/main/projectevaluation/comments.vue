<template>
    <div class="comments_wrap">
       <div class="header">
           <div class="title">评论</div>
           <div class="line"></div>
       </div>
       <div class="custom">
           <img src="https://pic1.zhimg.com/v2-bf546dafca2e7867d4c4fe7ba556aa6c_r.jpg" alt="" class="avator">
           <el-input
                type="textarea"
                autosize
                placeholder="写下你此刻的想法"
                width="200px"
                v-model="comment"
                class="textarea"
                height='40px'
                ref="comment">
            </el-input>
            <el-button type="primary" size="medium" @click="submit">提交评论</el-button>
       </div>
       <div class="comments_detail">
          <div class="item_box"  v-for="(item,index) in showAll?commentsArr:commentsArr.slice(0,3)" :key="index">
            <div class="comments_item">
                <div class="left_box">
                    <img :src="item.headUrl" alt="" class="avator">
                    <div class="content_box">
                        <div class="name_box">
                            <div class="name">{{item.realName}}</div>
                            <div class="time">{{item.createDate}}</div>
                        </div>
                        <div class="content">{{item.content}}</div>
                    </div>
                </div>
                <div class="right_box">
                    <i class="iconfont icon-pinglun"></i>
                    <span @click="replayShow(index)">回复</span>
                    <i :class="['iconfont', item.likeFlag == 0?'icon-dianzan':'icon-dianzan1']" style="cursor:pointer" @click="dianzan(item.id)"></i>
                    <span>{{item. likeNum}}</span>
                </div>
            </div>
            
            <div class="reply" v-if="showIndex === index">
                <el-input
                        type="textarea"
                        autosize
                        placeholder="写下你此刻的想法"
                        width="400px"
                        v-model="replyComment"
                        class="replyextarea"
                        height='40px'>
                    </el-input>
                    <el-button type="primary" size="medium" @click="replayComment(item.id)">提交回复</el-button>
            </div>
            <div class="line"></div>
            <template v-if="item.replyLists.length">
                <div class="replay_box" v-for="(item1,index1) in item.replyLists" :key="index1">
                    <div class="top_box">
                        <div class="name">{{item1.realName}}</div>
                        <div class="content">{{item1.content}}</div>
                    </div>
                    <div class="bottom_box">
                        <div class="time">{{item1.createDate}}</div>
                    </div>
                </div>
                <div class="line"></div>
            </template>
            
          </div>
       </div>
       <div class="check" @click="showAll = !showAll">{{showAll?'收起更多评论':'查看更多评论'}}</div>
    </div>
</template>
<script>
import projectevaluation from "@/api/projectevaluation" //引入api
export default {
    name:'comments',
    props:{
        commentsData:Object
    },
    data(){
        return{
            comment:"",
            replyComment:"",
            commentsArr:[],
            showIndex:'',
            showAll:false,
            id:''
        }
    },
    created(){
       
    },
    watch:{
        commentsData:{
            handler(newVal){
                this.id = newVal.topicId
                projectevaluation.getComment(newVal.topicId).then(res=>{
                    console.log(res.data.data)
                    this.commentsArr = res.data.data
                })
            },
            deep:true,
            immediate:true
        }
    },
    methods:{
        submit(){
            projectevaluation.submitComment({
                topicId:this.commentsData.topicId,
                content:this.comment,
                isReply:0
            }).then(res=>{
                console.log(res.data.code)
                this.comment = ""
                this.$refs.comment.blur()
                if(res.data.code === 0){
                    this.$message({
                        type:'success',
                        message:'发布评论成功'
                    })
                console.log(this.commentsData)
                projectevaluation.getComment(this.id).then(res=>{
                    console.log(res.data.data)
                    this.commentsArr = res.data.data
                })


                }else{
                    this.$message({
                        type:'warning',
                        message:'发布失败'
                    })
                }
            })
        },
        replayComment(pid){
            projectevaluation.submitComment({
                topicId:this.commentsData.topicId,
                content:this.replyComment,
                isReply:1,
                pid:pid
            }).then(res=>{
                if(res.data.code === 0){
                    this.$message({
                        type:'success',
                        message:'回复成功'
                    })
                    this.showIndex = ''
                    projectevaluation.getComment(this.id).then(res=>{
                        console.log(res.data.data)
                        this.commentsArr = res.data.data
                   })

                }else{
                     this.$message({
                        type:'warning',
                        message:'发布失败'
                    })
                }
            })
        },
        getNewDate(){
            console.log(new Date())
            let today = new Date();
            let year = today.getFullYear();
            let month = today.getMonth() + 1 < 10?'0'+(today.getMonth() + 1):today.getMonth() + 1;
            let day = today.getDate()< 10? '0' + today.getDate():today.getDate();
            let hour = today.getHours() < 10 ? '0' + today.getHours() :today.getHours();
            let minute = today.getMinutes() <10 ? '0' + today.getMinutes():today.getMinutes();
            let second = today.getSeconds()<10 ? '0' + today.getSeconds():today.getSeconds();
            return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
        },
        replayShow(i){
            if(this.showIndex === i){
                this.showIndex = ""
            }else{
                this.showIndex = i
            }
            
            
        },
        dianzan(id){
            console.log(id)
            projectevaluation.dianZan({
                id:id,
                classifyCode:'comment'
            }).then(res=>{
                console.log(res)
                if(res.data.code === 0){
                    projectevaluation.getComment(this.id).then(res=>{
                        console.log(res.data.data)
                        this.commentsArr = res.data.data
                   })
                }
            })
        }
    }
}
</script>
<style lang="scss">
    .comments_wrap{
         margin-top:20px;
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
        .custom{
            // background: pink;
            display: flex;
            align-items: center;
            margin-top:20px;
            .avator{
                height:40px;
                width:40px;
                border-radius: 50%;
            }
            .textarea{
                height:40px;
                width:350px;
                margin-left:10px;
                margin-right:20px;
                display: flex;
                justify-content: center;
                align-items: center;
                 .el-textarea__inner{
                min-height:34px!important;
              }
            }
           .el-button--medium{
               height:34px!important
           }
        }
        
        .comments_detail{
            margin-top:30px;
            font-size:16px;
            .item_box{
                // margin-top:10px;
                .comments_item{
                    margin-top:20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: all 0.3s;
                    .left_box{
                        display: flex;
                        width:85%;
                        .avator{
                            height:40px;
                            width:40px;
                            border-radius: 50%;
                            margin-right:10px;
                        }
                        .content_box{
                            .name_box{
                                display: flex;
                                .name{
                                    width:130px;
                                }
                                .time{
                                    font-size:14px;
                                    color:rgba(0,0,0,0.6);
                                }
                            }
                            .content{
                                font-size:14px;
                            }
                        }
                    }
                    .right_box{
                        width:15%;
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;
                        user-select: none;
                        .icon-pinglun{
                            font-weight: 700;
                            font-size:17px;
                            
                        }
                        span{
                            font-size:14px;
                            margin-right:25px;
                            margin-left:4px;
                            margin-top:4px;
                            cursor: pointer;
                        }
                        .icon-dianzan{
                            color:#0084ff;
                            width:27px;
                            margin-left:3px;
                        }
                        .icon-dianzan1{
                            color:#0084ff;
                            font-size:25px;
                            width:22px;
                            margin-right:8px;
                        }
                    }
                
                }
                .reply{
                    display: flex;
                    align-items: center;
                    padding:0 10%;
                    justify-content: flex-start;
                    margin-top:10px;
                     .replyextarea{
                            height:40px;
                            width:400px!important;
                            margin-right:20px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            .el-textarea__inner{
                                min-height:34px!important;
                                width:400px!important;
                          }
                        }
                    .el-button--medium{
                        height:34px!important
                    }
                }
                .replay_box{
                    height:50px;
                    margin-top:20px;
                    padding:0 10%;
                    .top_box{
                        display: flex;
                        align-items: center;
                        // .name{

                        // }
                        .content{
                            font-size:14px;
                            margin-left:20px;
                        }
                    }
                    .bottom_box{
                        .time{
                            font-size: 14px;
                            color: rgba(0, 0, 0, 0.6); 
                        }
                    }
                }
                .line{
                    width:100%;
                    height:1px;
                    background: rgba(0,0,0,0.17);
                    margin-top:20px;
                }
                &:last-child .line{
                    background:transparent
                }
            }
            
        }
        .check{
                width:100%;
                text-align: center;
                margin-top:10px;
                cursor: pointer;
                user-select: none;
            }
    }
</style>