<template>
    <div class="imageBabel_wrap">
       <div class="header">
           <div class="title">印象标签</div>
           <div class="line"></div>
       </div>
       <div class="label_box">
           <div class="label_item" v-for="(item,index) in showAll?tagArr:tagArr.slice(0,10)" :key="index" @click="dianzan(item.id)">{{item.likeNum == '0'?item.tag:item.tag + " + " + item.likeNum}}</div>
           <input type="text" placeholder="自定义标签" class="custom" v-model="tag" @keyup.enter="addTag" maxlength="8" ref = "tag">
       </div>
       <div class="tips" @click="showAll = !showAll">{{showAll?'收起更多标签':'查看更多标签'}}</div>
    </div>
</template>
<script>
import projectevaluation from "@/api/projectevaluation"
export default {
    name:'ImageBabel',
    props:{
        labelData: {
            type: Object,
            default: () => []
        }
    },
    data(){
        return{
            tag:'',
            tagArr:[],
            showAll:false,
            id:""
        }
    },
    watch:{
        labelData:{
            handler(newVal){
                console.log(newVal)
                this.id = newVal.objId
                projectevaluation.getTags(newVal.objId).then(res=>{
                    console.log(res.data.data)
                    this.tagArr = res.data.data
                })

            },
            deep:true,
            immediate:true
        }
    },
    methods:{
        addTag(){
            projectevaluation.addTag({
                code:this.labelData.code,
                pcode:this.labelData.pcode,
                tag:this.tag,
                objId:this.labelData.objId
            }).then(res=>{
               if(res.data.code === 0){
                   this.$refs.tag.blur();
                   this.$message({
                       type:'success',
                       message:'添加标签成功'
                   })
                   projectevaluation.getTags(this.id).then(res=>{
                    console.log(res.data.data)
                    this.tagArr = res.data.data;
                    this.tag = ""
                })
               }else{
                   this.$refs.tag.blur();
                   this.$message({
                       type:'warning',
                       message:res.data.msg
                   })
                   this.tag = ""
               }
            })
        },
        dianzan(id){ //
            console.log(id)
            projectevaluation.dianZan({
                id:id,
                likeFlag:1,
                classifyCode:'tag'
            }).then(res=>{
                console.log(res.data.code)
                if(res.data.code === 0){
                    projectevaluation.getTags(this.id).then(res1=>{
                        console.log(res1.data.data)
                        this.tagArr = res1.data.data;
                        this.tag = ""
                  })
                   this.$message({
                       type:'success',
                       message:'+1成功'
                   })
                }else{
                    this.$message({
                        type:'warning',
                        message:res.data.msg
                    })
                }
              
            })
        }
    },
    created(){
      
    }
    
}
</script>
<style lang="scss" scoped>
    .imageBabel_wrap{
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
        .label_box{
            margin-top:14px;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            padding-top:10px;
            .label_item{
                margin-right:20px;
                height:30px;
                padding:0 10px;;
                display: flex;
                justify-content: center;
                align-items: center;
                border:1px solid #0084ff;
                color:#0084ff;
                margin-bottom:10px;
                cursor: pointer;
                user-select: none;
            }
            .custom{
                border:0;
                border:1px solid rgba(0,0,0,0.7);
                height:28px;
                width:90px;
                text-indent:10px;
                margin-right:20px;
                margin-bottom:10px;
            }
        }
        .tips{
            width:100%;
            text-align: center;
            margin-top:10px;
            cursor: pointer;
            user-select: none;
        }
    }
</style>