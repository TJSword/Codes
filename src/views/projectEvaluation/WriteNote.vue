<template>
    <div class="writeNote_wrap">
        <div class="header">
          <div class="block">
                <el-carousel trigger="click" height="350px" v-if="imgArr.length !== 0" class="swiper" @change="swiperChange">
                    <el-carousel-item v-for="(item,index) in imgArr" :key="index">
                      <el-image :src="item"  class="img" fit="cover"></el-image>
                    </el-carousel-item>
                    <div class="options_box">
                        <el-upload
                            class="upload_button_box"
                            list-type="picture"
                            action="#"
                            :show-file-list="false"
                            :auto-upload="false"
                            :on-change="handleChange"
                            >
                            <el-button size="medium" type="info" class="upload_button" icon="el-icon-plus" circle></el-button>
                        </el-upload>
                        <el-button class="button" type="primary" icon="el-icon-edit" circle @click="overLays"></el-button>
                        <el-button class="button" type="danger" icon="el-icon-delete" circle @click="remove"></el-button>
                    </div>
                </el-carousel>
                 <el-upload
                    class="upload"
                    list-type="picture"
                    action="#"
                    :show-file-list="false"
                    :auto-upload="false"
                    :on-change="handleChange"
                    v-show="imgArr.length === 0">
                  <el-button size="medium" type="primary" class="upload_button"><i class="el-icon-plus"></i>&ensp;添加图片</el-button>
                </el-upload>
            </div>
               
            <div class="information_box">
                <div class="title">笔记信息</div>
                <div class="line"></div>
                <div class="info_detail">
                   <div class="item" v-for="(item,index) in 4" :key="index">
                       <div class="item_title">笔记标题</div>
                       <!-- 笔记标题，笔记分类，创建人，创建时间。 -->
                       <el-input class="item_value" size="small"   placeholder="请输入标题" v-model="title" clearable></el-input>
                   </div>
                </div>
            </div>
        </div>
        <div class="label">
             <div class="title">标注</div>
             <div class="line"></div>
             <el-input
                type="textarea"
                class="detail"
                :autosize="{ minRows: 8}"
                placeholder="请输入内容"
                v-model="detail"
               >
            </el-input>
        </div>
        <ImageBabel></ImageBabel>
        <el-dialog
            :visible.sync="dialogVisible"
            :modal-append-to-body="false"
            :show-close="false"
            :close-on-click-modal='false'
            :close-on-press-escape='false'>
            <div class="pop_box" @dblclick="pos($event)" @contextmenu.prevent="recall">
                <canvas  id="canvas"  @dblclick="drawText($event)" @click="setPoint($event)" ref="canvas" ></canvas>
                <el-input class="text" 
                :style="{'top':BoxPosInfo.y - 14 + 'px','left':BoxPosInfo.x + picToBoxWidth + 20 + 'px'}"  
                size="mini" 
                v-model="text" 
                v-show="BoxPosInfo.x !==0"
                clearable
                @blur="textBlur" @keyup.enter.native="textBlur"
                autofocus></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confrim">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
import ImageBabel from '@/components/main/projectevaluation/ImageBabel';
export default {
    name:'writeNote',
    data(){
        return{
            title:"",
            detail:"",
            dialogVisible: false,
            BoxPosInfo:{
                x:0,
                y:0
            },
            text:"",
            imgArr:[],
            tabIndex:0,
            clickFlag:null,
            picToBoxWidth:0,
            pointArr:[],
            operateArr:[],//操作历史存栈
            justBlur:false
        }
    },
    components:{
        ImageBabel
    },
    mounted(){
        this.$nextTick(_=>{
            // this.overLays()
        })
    },
    methods:{
        overLays(){
            this.dialogVisible=true
            setTimeout(() => {
                const ctx =  this.$refs.canvas.getContext("2d");
                 
                let timer = setInterval(()=>{
                        if(ctx){
                            let img = new Image()
                            img.src = this.imgArr[this.tabIndex];  
                            this.chooseIndex = JSON.stringify(JSON.parse(this.tabIndex)) //记录当前选中的index
                            console.log(this.imgArr,this.tabIndex)
                            img.onload = ()=>{
                                if(img.complete){
                                //  根据图像重新设定了canvas的长宽
                                    let b = img.width/img.height //算出长宽比
                                    if(b>=1){
                                        canvas.setAttribute("width",800);
                                        canvas.setAttribute("height",800 / b)
                                        //  绘制图片
                                    ctx.drawImage(img,0,0,800,800 / b)
                                    }else{
                                        canvas.setAttribute("width",800 * b)
                                        canvas.setAttribute("height",800);
                                        //  绘制图片
                                    ctx.drawImage(img,0,0,800*b,800)
                                    }
                                }
                                this.picToBoxWidth = this.$refs.canvas.offsetLeft
                            }
                            clearInterval(timer)
                        }
                },100) 
            }, 10);

        },
        drawText($event){
           
            if(this.clickFlag){
                clearTimeout(this.clickFlag)
            }

            console.log($event)
            let x = $event.layerX;
            let y = $event.layerY;
            this.canvasPosInfo = {
                'x':x,
                'y':y
            }
              console.log("双击")
        },
        pos($event){
            console.log($event)
            let x = $event.offsetX;
            let y = $event.offsetY;
            this.BoxPosInfo = {//改变输入框位置
                'x':x,
                'y':y
            }
            console.log(this.BoxPosInfo)
        },
        textBlur(){
            this.justBlur = true 
            console.log(this.text)
            if(this.text.length === 0){
                this.BoxPosInfo.x = 0
            }else{
                this.BoxPosInfo.x = 0
                let x  = this.canvasPosInfo.x 
                let y  = this.canvasPosInfo.y
                this.operateArr.push({
                    pos:{
                        'x':x,
                        'y':y
                    },
                    text:this.text,
                    type:'text'
                })
                console.log(this.canvasPosInfo)
                const canvas =  document.getElementById('canvas')

                //绘制圆点
                const ctx = canvas.getContext("2d");
                ctx.beginPath();
                ctx.arc(x,y,8,0,2*Math.PI);
                ctx.fillStyle="rgba(0,0,0,0.5)";
                ctx.stroke();
                ctx.fill();
                ctx.beginPath();
                ctx.arc(x,y,4,0,2*Math.PI);
                ctx.fillStyle="#fff";
                ctx.stroke();
                ctx.fill();

                //绘制矩形
                let textWidth = this.getTextWidth(this.text)
                var Point = function(x, y) {
                    return {x:x, y:y};
                };
                
                function Rect(x, y, w, h) {
                    return {x:x, y:y, width:w, height:h};
                }

                var rect = Rect(x + 20, y - 15, textWidth + 20, 30); //设置矩形 x,y,w,h
                
                drawRoundedRect(rect, 15, ctx);
                
                function drawRoundedRect(rect, r, ctx) {
                    var ptA = Point(rect.x + r, rect.y);
                    var ptB = Point(rect.x + rect.width, rect.y);
                    var ptC = Point(rect.x + rect.width, rect.y + rect.height);
                    var ptD = Point(rect.x, rect.y + rect.height);
                    var ptE = Point(rect.x, rect.y);
                    
                    ctx.beginPath();
                    ctx.moveTo(ptA.x, ptA.y);
                    ctx.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, r);
                    ctx.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, r);
                    ctx.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, r);
                    ctx.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, r);
                    ctx.stroke();
                    ctx.fillStyle="rgba(0,0,0,0.7)"
                    ctx.fill();
                }

                //绘制文本
                ctx.fillStyle="white"
                ctx.font="14px Arial";
                ctx.fillText(this.text,x+30,y+5);
                this.text = ""
            }
           setTimeout(()=>{ // 点击画布不触发setPoint
               this.justBlur = false
           },500)
        },
        getTextWidth(str) { //获取文字的长度
            var width
            var html = document.createElement('span');
            html.innerText = str;
            html.className = 'getTextWidth';
            document.querySelector('body').appendChild(html);
            width = document.querySelector('.getTextWidth').offsetWidth;
            document.querySelector('.getTextWidth').remove();
            return width;
        },
        handleChange(file,fileList){ //拿到图片的地址
            console.log(file.url)
            this.imgUrl = file.url;
            this.imgArr.push(file.url)
            console.log(this.imgArr)
        },
        swiperChange(i){//轮播图拿到当前索引
            console.log(i)
            this.tabIndex = i
        },
        remove(){
            let arr = this.imgArr;
            let index = this.tabIndex;
            arr.splice(index,1)
            this.imgArr = arr
        },
        setPoint($event){
            if(this.clickFlag){
                clearTimeout(this.clickFlag)
            }
            this.clickFlag = setTimeout(()=>{//处理单机双击事件冲突

            if(this.justBlur === false){
                    let x = $event.layerX;
                    let y = $event.layerY;
                    console.log(x,y)
                    this.pointArr.push({
                        'x':x,'y':y
                    })
                    const ctx =  this.$refs.canvas.getContext("2d");

                    if(this.pointArr.length === 1){
                        ctx.beginPath();
                        ctx.moveTo(x,y);
                        ctx.arc(x,y,1,0,2*Math.PI);
                        ctx.fillStyle="rgba(0,0,0,0.5)";
                        ctx.stroke();
                        ctx.fill();
                    }else{
                        ctx.lineTo(x,y);
                        ctx.stroke();
                    if(Math.abs(this.pointArr[0].x - this.pointArr[this.pointArr.length - 1].x) < 5 &&
                        Math.abs(this.pointArr[0].y - this.pointArr[this.pointArr.length - 1].y) < 5){
                            ctx.closePath();
                            ctx.fillStyle = "rgba(0,0,0,0.2)";
                            ctx.fill();
                            this.operateArr.push({
                                'type':"polygon",
                                'pointArr':this.pointArr
                            })
                            this.pointArr = [] //清空点数组
                        }    
                    }
                }
            },300)
           
        },
        confrim(){// 有bug
            this.dialogVisible = false;
            console.log(this.operateArr)
            let canvas = this.$refs.canvas
            let src = canvas.toDataURL("image/png");
            console.log(this.imgArr,this.tabIndex)
            this.imgArr.splice(this.chooseIndex,1,src)
        },
     async recall(){
           console.info('点数据坐标',this.pointArr)
           console.info('操作栈',this.operateArr)
           this.overLays()
           const ctx =  this.$refs.canvas.getContext("2d");
           function drawPolygon(arr,ctx){
                ctx.beginPath();
                ctx.moveTo(arr[0].x,arr[0].y)
                ctx.arc(arr[0].x,arr[0].y,1,0,2*Math.PI);
                ctx.fillStyle="rgba(0,0,0,0.5)";
                ctx.fill();
                ctx.stroke();
                for(var i = 1; i < arr.length ; i++){
                    ctx.lineTo(arr[i].x,arr[i].y);
                    ctx.stroke();
                }
                ctx.closePath();
                ctx.stroke();
                ctx.fillStyle = "rgba(0,0,0,0.2)";
                ctx.fill();
           }
           function drawText(obj,text,ctx){
               //绘制原点
                ctx.beginPath();
                ctx.arc(obj.x,obj.y,8,0,2*Math.PI);
                ctx.fillStyle="rgba(0,0,0,0.5)";
                ctx.stroke();
                ctx.fill();
                ctx.beginPath();
                ctx.arc(obj.x,obj.y,4,0,2*Math.PI);
                ctx.fillStyle="#fff";
                ctx.stroke();
                ctx.fill();
                //绘制矩形
                function getTextWidth(str){
                    var width
                    var html = document.createElement('span');
                    html.innerText = str;
                    html.className = 'getTextWidth';
                    document.querySelector('body').appendChild(html);
                    width = document.querySelector('.getTextWidth').offsetWidth;
                    document.querySelector('.getTextWidth').remove();
                    return width;
                }
                let textWidth = getTextWidth(text)
                var Point = function(x, y) {
                    return {x:x, y:y};
                };
                
                function Rect(x, y, w, h) {
                    return {x:x, y:y, width:w, height:h};
                }

                var rect = Rect(obj.x + 20, obj.y - 15, textWidth + 20, 30); //设置矩形 x,y,w,h
                
                drawRoundedRect(rect, 15, ctx);
                
                function drawRoundedRect(rect, r, ctx) {
                    var ptA = Point(rect.x + r, rect.y);
                    var ptB = Point(rect.x + rect.width, rect.y);
                    var ptC = Point(rect.x + rect.width, rect.y + rect.height);
                    var ptD = Point(rect.x, rect.y + rect.height);
                    var ptE = Point(rect.x, rect.y);
                    
                    ctx.beginPath();
                    ctx.moveTo(ptA.x, ptA.y);
                    ctx.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, r);
                    ctx.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, r);
                    ctx.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, r);
                    ctx.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, r);
                    ctx.stroke();
                    ctx.fillStyle="rgba(0,0,0,0.7)"
                    ctx.fill();
                }
                //绘制文本
                ctx.fillStyle="white"
                ctx.font="14px Arial";
                ctx.fillText(text,obj.x+30,obj.y+5);

           }
           if(this.pointArr.length === 0){
               this.operateArr.pop();
               console.log(this.operateArr)
            //    setTimeout(()=>{
            //        drawText(this.operateArr[0].pos,this.operateArr[0].text,ctx)
            //    },200) 
                let operateArr = this.operateArr;
                let polygonInn = [];
                let pointInn = []
                operateArr.forEach(item=>{
                    if(item.type === "text"){
                        pointInn.push(item)
                    }else if(item.type ==='polygon'){
                        polygonInn.push(item)
                    }
                })
                console.log(polygonInn)
                console.log(pointInn)
                setTimeout(()=>{
                    for(var i = 0; i < polygonInn.length;i++){
                     drawPolygon(polygonInn[i].pointArr,ctx)
                    }
                     for(var j = 0; j < pointInn.length;j++){
                     drawText(pointInn[j].pos,pointInn[j].text,ctx)
                    }
                },200)

           }else{
               this.pointArr=[];
                let operateArr = this.operateArr;
                let polygonInn = [];
                let pointInn = []
                operateArr.forEach(item=>{
                    if(item.type === "text"){
                        pointInn.push(item)
                    }else if(item.type ==='polygon'){
                        polygonInn.push(item)
                    }
                })
                console.log(polygonInn)
                console.log(pointInn)
                setTimeout(()=>{
                    for(var i = 0; i < polygonInn.length;i++){
                     drawPolygon(polygonInn[i].pointArr,ctx)
                    }
                     for(var j = 0; j < pointInn.length;j++){
                     drawText(pointInn[j].pos,pointInn[j].text,ctx)
                    }
                },200)

               
           }
        }
    }
}
</script>
<style lang="scss" scoped>
    .writeNote_wrap{
        padding:20px 0 40px 0;
        .header{
            display: flex;
            .block{
                width:55%;
                height:350px;
                // display: flex;
                // justify-content: center;
                // align-items: center;
                border:1px solid rgba(0,0,0,0.17);
                .swiper{
                    &:hover .options_box{
                        opacity: 1;
                        transition: all 0.3s;
                         .upload_button_box{
                            transform: translateX(0px);
                             transition: all 0.3s;
                         }
                         .button{
                             &:last-child{
                                transform: translateX(0px);
                                transition: all 0.3s;
                             }
                         }
                    }
                }
                .options_box{
                    z-index:2;
                    position: relative;
                    height:100%;
                    width:100%;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    opacity: 0;
                    transition: all 0.3s;
                    .upload_button_box{
                        width:50px;
                        background: transparent;
                        margin-right:50px;
                        display: flex;
                        justify-content: flex-start;
                        align-items: flex-start;
                        transform: translateX(-40px);
                        transition: all 0.3s;
                        .upload_button{
                            height:50px;
                            width:50px;
                            border-radius: 50%;
                            font-size:20px;
                        }
                    }
                    .button{
                        margin-right:40px;
                        height:50px;
                        width:50px;
                        font-size:20px;
                        &:last-child{
                            margin-right: 0;
                            transform: translateX(40px);
                            transition: all 0.3s;
                        }
                    }
                }
                .img{
                    height:100%;
                    width:100%;
                }
                .upload{
                    height:100%;
                    width:100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
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
                        align-items: center;
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
                    height:175px;
                }
        }
        .pop_box{
            height:100%;
            width:100%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            .text{
                position: absolute;
                top:0;
                left:0;
                width:200px;
            }
        }
    }
</style>