<template>
    <div class="friends_wrap">
        <div class="friends_box" v-if="showFriends" :style="{left:positionX+'px',top:positionY+'px'}">
            <div class="top" @mousedown="move">
                <el-image fit="contain" class="photo" :src="userPhoto"></el-image>
                <div class="info">
                    <div class="name">{{userName}}</div>
                    <!-- <div class="company">{{userCompany}}</div> -->
                </div>
                <i class="close el-icon-close" @click="closeFriend()"></i>
                <i class="iconfont icon-jia" @click="showAddFriends = true"></i>
            </div>
            <div class="cen">
                <div class="search">
                    <el-input class="search_input" @input="searchFriend" placeholder="搜索好友" v-model="searchVal" suffix-icon="el-icon-search" clearable></el-input>
                </div>
                <!-- 好友列表 -->
                <div class="list">
                    <div class="item" @click="openSystemMsg_box">
                        <el-image fit="contain" class="photo" src='http://47.104.165.136:8099/test/portrait.jpg'></el-image>
                        <div class="red_point" v-if="isRead"></div>
                        <div class="info">
                            <div class="name">系统消息</div>
                            <div class="company">成都投资云地图</div>
                        </div>
                    </div>
                    <div class="item" v-for="(item,index) in friendList" :key="index" @click="chooseFriend(item)">
                        <el-image fit="contain" :class="['photo',item.online==='1'?'':'photo_outline']"  :src='item.headUrl?item.headUrl:"http://47.104.165.136:8099/test/portrait.jpg"'></el-image>
                        <div class="red_point" v-show="item.hasMsg"></div>
                        <div class="info">
                            <div class="name">{{item.realName}}</div>
                            <div class="company">{{item.deptName}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bot"></div>
        </div>
        <!-- 聊天框 -->
        <div class="chat_box" :style="{left:chatBoxX+'px',top:chatBoxY+'px'}" v-if="showChatBox">
            <div class="header"  @mousedown="chatMove">
                <div class="title">{{chooseName}}</div>
                <i class="iconfont icon-guanbi" @click="showChatBox=false;chooseId = ''"></i>
            </div>
            <div class="main" ref="main">
                <div class="msg" v-for="(item,index) in chatRecord" :key="index">
                     <div class="opposite_people" v-if="item.type === 'opposite'">
                        <el-image class="headerUrl" :src="chooseHeadUrl"></el-image>
                        <div class="content">
                            <div class="shareLand" v-if="item.landInfo">
                                <div class="info">分享内容：{{item.msg}}</div>
                                <el-button class="add_btn" type="primary" size="mini" @click="addToFm(item.landInfo,index)" 
                                :disabled="item.landInfo.landisAdd">{{item.landInfo.landisAdd?'土地已添加到好友地图':'添加到好友地图'}}</el-button>
                            </div>
                            <div class="message" v-else>{{item.msg}}</div>
                        </div>
                    </div>
                    <div class="mine" v-if="item.type === 'mine'">
                        <div class="content">
                            <div class="message">{{item.msg}}</div>
                        </div>
                        <el-image class="headerUrl" :src="userPhoto"></el-image>
                    </div>
                </div>
            </div>
            <div class="bottom">
               <el-input
                    type="textarea"
                    placeholder="请输入内容"
                    v-model="chat_content"
                    class="chat_input"
                >
                </el-input>
                <el-button type="primary" class="send" size="mini" @click="sendMsg">发送</el-button>
            </div>
        </div>
        <!-- 添加好友 -->
        <div class="add_friends" v-if="showAddFriends">
            <div class="header"  @mousedown="chatMove">
                <div class="title">添加好友</div>
                <i class="iconfont icon-guanbi" @click="showAddFriends = false"></i>
            </div>
            <div class="main">
               <el-input
                placeholder="输入用户名检索"
                v-model="searchUsername"
                size="small"
                style="width:90%;margin-left:5%;margin-top:10px;"
                @keyup.enter.native="searchFriends"
                clearable>
                <el-button slot="append" icon="el-icon-search" @click="searchFriends"></el-button>
                </el-input>
                <div class="friends_card" v-for="(item,index) in searchFriendsList" :key="index">
                   <el-image class="headerUrl" :src="item.headUrl"></el-image>
                   <div class="friends_info">
                       <div class="name">{{item.realName}}</div>
                       <div class="company">{{item.deptName}}</div>
                   </div>
                   <i class="iconfont icon-jia" @click="addFriends(item.id)"></i>
                </div>
            </div>
        </div>
        <!-- 系统消息 -->
        <div class="systemMsg_box"  v-if="showSystemMsg_box">
            <div class="header"  @mousedown="chatMove">
                <div class="title">系统消息</div>
                <i class="iconfont icon-guanbi" @click="showSystemMsg_box = false"></i>
            </div>
            <div class="main">
                <div class="friends_card" v-for="(item,index) in notifyList" :key="index">
                   <el-image class="headerUrl" :src="item.head_url"></el-image>
                   <div class="friends_info">
                       <div class="name">{{item.real_name}}</div>
                       <div class="company">{{item.dept_name}}</div>
                   </div>
                  <el-button v-if="item.if_pass == -1" type="success" size="mini" @click="consent(item.id)">添加</el-button>
                  <span  v-if="item.if_pass == 1"  style="font-size:12px;color:#92979b">已添加</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import friends from "../../../api/friendsApi.js"
export default {
    name:'friendlist',
    components:{

    },
    data(){
        return {
            searchUsername:'',
            userPhoto:'',
            userName:'',
            userCompany:'客研社',
            searchVal:'',
            chat_content:'',
            showAddFriends:false,
            showSystemMsg_box:false,
            showChatBox:false,
            friendList:[
                // {id:'0',name:'杨先彪',headUrl:'http://47.104.165.136:8099/test/portrait.jpg',company:'阿里巴巴'}
            ],
            friendListBack:[],
            positionX:null,
            positionY:null,
            chatBoxX:null,
            chatBoxY:null,
            searchFriendsList:[],
            notifyList:[],
            chooseName:'',
            chooseHeadUrl:'',
            chooseId:"",
            isRead:false,
            chatRecord:[],
            wxOff:false,//wx链接失败
            curFriendOnline:false,//当前打开的好友聊天窗是否在线

            freshFmFlag:true,//刷新好友地图
        }
    },
    mounted(){
        this.userName = localStorage.getItem('userName')?localStorage.getItem('userName'):'佚名'
        this.userPhoto = localStorage.getItem('headUrl')?localStorage.getItem('headUrl'):'http://47.104.165.136:8099/test/portrait.jpg'
        this.initWS()
    },
    created(){
        this.getNotifyList()
        //回车发送
        var that = this;
        document.onkeydown = function (e) {
            let key = window.event.keyCode;
            if (key == 13&&that.showChatBox) {
                e.preventDefault();
                that.sendMsg()
            }
        };
    },
    watch:{
        showFriends:{
            handler(newVal){
                if(newVal){
                    if(this.wxOff){ //若连接失败重新连接
                        this.initWS()
                    }
                }
            },
            deep:true
        },
        shareInfo:{
            handler(newVal){
                let friendId = newVal.friendId
                if(friendId==this.chooseId){
                    this.chatRecord.push({
                        type:'mine',
                        landInfo:{},
                        msg:newVal.msg
                    })
                    localStorage.setItem(friendId,JSON.stringify(this.chatRecord))
                    this.$nextTick(_=>{
                        this.$refs.main.scrollTop = this.$refs.main.scrollHeight 
                    })
                }else{
                    if(localStorage.getItem(friendId)){
                        let record = JSON.parse(localStorage.getItem(friendId))
                        record.push({
                            type:'mine',
                            landInfo:{},
                            msg:newVal.msg
                        })
                        localStorage.setItem(friendId,JSON.stringify(record))
                    }else{
                        let record = []
                        record.push({
                            type:'mine',
                            landInfo:{},
                            msg:newVal.msg
                        })
                        localStorage.setItem(friendId,JSON.stringify(record))
                    }
                }
            },
            deep:true
        },
        userInfoUpdate:{
            handler(newVal){
                this.userName = localStorage.getItem('userName')
                this.userPhoto = localStorage.getItem('headUrl')?localStorage.getItem('headUrl'):'http://47.104.165.136:8099/test/portrait.jpg'
            },
            deep:true
        }
    },
    computed:{
        ...mapGetters(['showFriends','hasMessage',"shareInfo",'userInfoUpdate'])
    },
    methods:{
        //关闭好友列表
        closeFriend(){
            this.$store.dispatch('setShowFriends',false)
        },
        //发送消息
        sendMsg(){
            if(!this.curFriendOnline){
                this.$message('好友未在线')
                return 
            }
            if(this.chat_content===''){
                this.$message('请先输入内容')
            }else{
                let params = {
                    to:this.chooseId,
                    msg:this.chat_content
                }
                this.chatRecord.push({
                    type:'mine',
                    msg:this.chat_content
                })
                localStorage.setItem(this.chooseId,JSON.stringify(this.chatRecord))
                this.ws.send(JSON.stringify(params))
                this.chat_content = ''
                console.dir(this.$refs.main)
                this.$nextTick(_=>{
                    this.$refs.main.scrollTop = this.$refs.main.scrollHeight 
                })
            }
        },
        //打开系统消息 请求接口去掉小红点
        openSystemMsg_box(){
            this.showSystemMsg_box = true
            this.isRead = false
            friends.readMsg().then(res=>{
                console.log(res)
            })
        },
        //打开聊天窗口
        chooseFriend(curUser){
            this.chat_content = ''
            this.curFriendOnline = curUser.online === '1' //当前好友是否在线

            let friendList = this.friendList
            friendList.forEach(item=>{
                if(item.id == curUser.id){
                    item.hasMsg = false
                }
            })
            this.showChatBox = true
            this.chooseName = curUser.realName?curUser.realName:curUser.username
            this.chooseId = curUser.id
            this.chooseHeadUrl = curUser.headUrl?curUser.headUrl:"http://47.104.165.136:8099/test/portrait.jpg"
            console.log(curUser.id)
            localStorage.getItem(curUser.id)?this.chatRecord = JSON.parse(localStorage.getItem(curUser.id)):this.chatRecord = []
            console.log(this.chatRecord)

            this.$nextTick(_=>{
                this.$refs.main.scrollTop = this.$refs.main.scrollHeight 
            })
        },
        //添加好友
        consent(id){
            let params = {id,flag:1}
            friends.consent(params).then(res=>{
                if(res.data.code === 0){
                    this.$message({
                        type:'success',
                        message:'添加好友成功'
                    })
                    this.getFirendsList()
                    this.getNotifyList()
                }
            })
        },
        //获取系统消息列表
        getNotifyList(){
            friends.getNotifyList().then(res=>{
                console.log(res.data.data)
                this.notifyList = res.data.data
                if(this.notifyList[0]){
                    this.notifyList[0].is_read == 0?this.isRead = true:this.isRead = false
                }
                
            })
        },
        //获取好友列表
        getFirendsList(){
            friends.getFirendsList().then(res=>{
                let data = res.data.data
                data.forEach(item=>{
                    item.hasMsg = false
                })
                this.friendList = data
                this.friendListBack = JSON.parse(JSON.stringify(data))
            })
        },
        //添加好友
        addFriends(id){
            console.log(id)
            friends.addFriends(id).then(res=>{
                console.log(res)
                if(res.data.code === 0){
                    this.$message({
                        type:'success',
                        message:'添加成功'
                    })
                }else{
                     this.$message({
                        type:'warning',
                        message:res.data.msg
                    })
                }
            })
        },
        //搜索好友
        searchFriends(){
            friends.searchFriend(this.searchUsername).then(res=>{
                console.log(res)
                if(res.data.data.length === 0){
                    this.$message({
                        type:'warning',
                        message:'暂无符合条件的好友'
                    })
                    return
                }
                this.searchFriendsList = res.data.data
            })
        },   
        //ws初始化
        initWS(){
            if(window.WebSocket){
                let ws = new WebSocket(`${this.socketURL}?token=${localStorage.getItem('token')}`)
                ws.onopen = ()=>{
                    console.log('服务器链接成功')
                    this.ws = ws
                    this.getFirendsList()
                }
                ws.onerror = () =>{
                    console.log("服务器连接出错");
                    this.wxOff = true
                };
                ws.onmessage = (e)=>{
                    //type值为0时，好友上线/下线通知。 1时 正常发送消息，2时，好友请求通过/拒绝通知 3，系统消息添加好友申请 4，土地分享
                    let data = JSON.parse(e.data)
                    console.log(data)
                    if(data.type === 3){
                        console.log(data.msg)
                        this.$message({
                            type:'success',
                            message:data.msg
                        })
                        this.getNotifyList()
                    }else if(data.type === 2){
                        this.$message({
                            type:'success',
                            message:data.msg
                        })
                        this.getFirendsList()
                    }else if(data.type === 1||data.type === 4){ //普通消息，分享土地消息
                        if(data.from == this.chooseId){ //打开聊天窗存储消息
                            let landInfo = {}
                            if(data.type === 4){
                                landInfo = {
                                    info:data.data,
                                    landisAdd:false,
                                }
                            }
                            this.chatRecord.push({ //消息列表更新
                                type:'opposite',
                                landInfo:data.type === 4?landInfo:null, 
                                msg:data.msg
                            })
                            localStorage.setItem(data.from,JSON.stringify(this.chatRecord))
                             this.$nextTick(_=>{
                                this.$refs.main.scrollTop = this.$refs.main.scrollHeight 
                            })
                        }else{ //未打开聊天窗存储消息
                            let landInfo = {}
                            if(data.type === 4){
                                landInfo = {
                                    info:data.data,
                                    landisAdd:false,
                                }
                            }
                            if(localStorage.getItem(data.from)){
                                let record = JSON.parse(localStorage.getItem(data.from))
                                record.push({
                                    type:'opposite',
                                    landInfo:data.type === 4?landInfo:null, 
                                    msg:data.msg
                                })
                                localStorage.setItem(data.from,JSON.stringify(record))
                            }else{
                                let record = []
                                record.push({
                                    type:'opposite',
                                    landInfo:data.type === 4?landInfo:null, 
                                    msg:data.msg
                                })
                                localStorage.setItem(data.from,JSON.stringify(record))
                            }
                            console.log(this.friendList)
                            let list = this.friendList
                            list.forEach(item=>{
                                if(item.id == data.from){
                                    item.hasMsg = true
                                }
                            })
                            this.friendList = list
                            if(!this.showFriends){ //好友列表收起时，红点提示
                                this.$store.dispatch('setHasMessage',true)
                            }
                        }
                       
                    }else if(data.type == 0){
                        //  this.$message({
                        //     type:'success',
                        //     message:data.msg
                        // })
                        this.getFirendsList()
                    }
                }
            }
        },
        //聊天窗口拖拽
        chatMove(e){
            let e1 = e.currentTarget;
	        let e2 = e.target;
            if(e1 === e2){ //阻止子元素冒泡
                //移动目标距离左上角的位置
                this.chatBoxX = e.clientX - e.offsetX;
                this.chatBoxY = e.clientY - e.offsetY;
                document.onmousemove = (e)=>{
                    //更新移动量
                    this.chatBoxX += e.movementX;
                    this.chatBoxY += e.movementY;
                };
                document.onmouseup = (e) => {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            }
        },
        //拖动框体
        move(e){
            let e1 = e.currentTarget;
	        let e2 = e.target;
            if(e1 === e2){ //阻止子元素冒泡
                //移动目标距离左上角的位置
                this.positionX = e.clientX - e.offsetX;
                this.positionY = e.clientY - e.offsetY;
                document.onmousemove = (e)=>{
                    //更新移动量
                    this.positionX += e.movementX;
                    this.positionY += e.movementY;
                };
                document.onmouseup = (e) => {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            }
        },
        //搜索好友
        searchFriend(val){
            let data = JSON.parse(JSON.stringify(this.friendListBack))
            this.friendList = data.filter(item=>{
                return (item.realName.indexOf(val)!==-1||item.username.indexOf(val)!==-1)
            })
        },
        //将分享的土地添加到好友地图
        addToFm(landInfo,index){
            var that = this
            let obj = {
                friendId:that.chooseId,
                lists:landInfo.info
            }
            friends.addLandToFm(obj)
            .then(res=>{
                if(res.data.code===0){
                    that.$message.success('土地已添加到好友地图')
                    that.chatRecord[index].landInfo.landisAdd = true
                    localStorage.setItem(this.chooseId,JSON.stringify(this.chatRecord))
                    //通知更新好友地图
                    this.$store.dispatch('setFreshFmFlag',!that.freshFmFlag)
                    that.freshFmFlag = !that.freshFmFlag
                }else{
                    that.$message.error(res.data.error)
                }
            })
        },
    }
}
</script>
<style lang="scss">
.friends_wrap{
    .friends_box{
        position: fixed;
        left: 80%;
        top: 10%;
        width: 260px;
        z-index: 999; 
        border-radius: 6px;
        overflow: hidden;
        box-shadow: rgb(58 58 63 / 30%) 0 0 9px 6px;
        .top{
            width: 100%;
            height: 80px;
            background: #292c36;
            display: flex;
            position: relative;
            align-items: center;
            cursor: move;
            .photo{
                width: 50px;
                height: 50px;
                border-radius: 50%;
                margin: 0 20px;
                cursor: pointer;
            }
            .info{
                .name{
                    font-size: 14px;
                    color: #f2f6fc;
                    font-weight: bold;
                    user-select: none;
                    cursor: pointer;
                }
                .company{
                    font-size: 12px;
                    color: #e6a23c;
                    user-select: none;
                    margin-top: 6px;
                    cursor: pointer;
                }
            }
            .close{
                font-size: 16px;
                color: #ffffffb8;
                cursor: pointer;
                position: absolute;
                top: 9px;
                right: 11px;
            }
            .icon-jia{
                cursor: pointer;
                position: absolute;
                right: 12px;
                bottom:15px;
                color:#ff8d1a;
                font-weight: 700;
                font-size: 14px;
            }
        }
        .cen{
            width: 100%;
            background: #fff;
            height: 500px;
            .search{
                padding: 10px 10px;
                .el-input__inner{
                    border-radius: 50px;
                    height: 30px;
                    line-height: 30px;
                }
                .el-input__icon{
                    line-height: 30px;
                }
            }
            .list{
                width: 100%;
                height: calc(100% - 50px);
                overflow-y: scroll;
                .item{
                    display: flex;
                    align-items: center;
                    padding: 10px;
                    border-bottom: #e4e7ed 1px solid;
                    cursor: pointer;
                    padding: 10px;
                    transition: all 0.3s;
                    position: relative;
                    &:hover{
                        background: #ebeef5;
                    }
                    .photo{
                        width: 35px;
                        height: 35px;
                        border-radius: 50%;
                        margin-right: 10px;
                    }
                    .photo_outline{
                        filter: grayscale(100%);
                    }
                    .red_point{
                        background: #FF3B30;
                        height: 8px;
                        width: 8px;
                        border-radius: 50%;
                        position: absolute;
                        top:10px;
                        left: 36px;
                    }
                    .info{
                        .name{
                            font-size: 14px;
                            font-weight: bold;
                            color: #333;
                        }
                        .company{
                            font-size: 12px;
                            color: #92979b;
                        }
                    }
                }
            }
        }
        .bot{
            
        }
    }
    .chat_box{
        position: fixed;
        left: 36%;
        top: 20%;
        width: 560px;
        z-index: 999; 
        border-radius: 6px;
        overflow: hidden;
        box-shadow: rgb(58 58 63 / 30%) 0 0 9px 6px;
        height: 600px;
        background: #F8F8F6;
        .header{
            display: flex;
            height: 52px;
            background: #FFFFFF;
            align-items: center;
            padding: 0 20px;
            justify-content: space-between;
            border-bottom: 1px solid rgba(153,153,153,0.4);
            .title{
                font-size:18px;
            }
            .icon-guanbi{
                margin-top:-8px;
                font-size:20px;
                cursor: pointer;
            }
        }
        .main{
            height: 348px;
            background: #F8F8F6;
            border-bottom: 1px solid rgba(153,153,153,0.4);
            overflow-y:scroll;
            overflow-x:hidden ;
            .msg{
                position: relative;
                margin-top:20px;
            }
            .opposite_people{
                height: fit-content;
                width: 80%;
                display: flex;
                margin:20px 0 ;
                margin-left: 20px;
                .headerUrl{
                    height: 32px;
                    width: 32px;
                    border-radius: 6px;
                }
                .content{
                    max-width: calc(100% - 60px);
                    width: fit-content;
                    margin-left: 10px;
                    background: white;
                    padding:10px;
                    border-radius: 6px;
                    position: relative;
                    &::before{
                        content: "";
                        width: 0px;
                        height: 0px;
                        border-top: 6px solid transparent;
                        border-bottom: 6px solid transparent;
                        border-right: 6px solid white;
                        position: absolute;
                        top: 10px;
                        left: -6px;
                    }
                }
            }
            .mine{
                height: fit-content;
                width: 80%;
                margin-right: 30px;
                margin-top:20px;
                display: flex;
                float: right;
                display: flex;
                justify-content:flex-end;
                padding-bottom: 20px;
                .headerUrl{
                    height: 32px;
                    width: 32px;
                    border-radius: 6px;
                }
                .content{
                    max-width: calc(100% - 70px);
                    margin-right: 10px;
                    background: #9EEA6A;
                    padding:10px;
                    border-radius: 6px;
                    width: fit-content; 
                    position: relative;
                    &::before{
                        content: "";
                        width: 0px;
                        height: 0px;
                        border-top: 6px solid transparent;
                        border-bottom: 6px solid transparent;
                        border-left: 6px solid #9EEA6A;
                        position: absolute;
                        top: 10px;
                        right: -6px;
                    }
                }
            }
            .shareLand{
                .land_number{
                    color: #3a8ee6;
                    font-weight: bold;
                }
               .info{
                   margin: 10px 0;
                   color: #666;
               } 
            }
        }
        .bottom{
            height: 170px;
            .chat_input{
                height: 100%;
                width: 100%;
                position: relative;
            }
            .el-textarea__inner{
                height: 120%!important;
                width: 100%;
                padding: 16px;
                border: 0!important;
                letter-spacing: 0.2px;
            }
            .send{
                position: absolute;
                bottom: 10px;
                right: 40px;
                z-index: 999;
            }
        }
    }
    .add_friends{
        position: fixed;
        left: 45%;
        top: 30%;
        width: 280px;
        z-index: 999; 
        border-radius: 6px;
        overflow: hidden;
        box-shadow: rgb(58 58 63 / 30%) 0 0 9px 6px;
        height: 360px;
        background: #F8F8F6;
        .header{
            display: flex;
            height: 46px;
            background: #FFFFFF;
            align-items: center;
            padding: 0 20px;
            justify-content: space-between;
            border-bottom: 1px solid rgba(153,153,153,0.4);
            .title{
                font-size:16px;
            }
            .icon-guanbi{
                margin-top:-8px;
                font-size:18px;
                cursor: pointer;
            }
        }
        .main{
            height: calc(100% - 47px);
            .friends_card{
                width: 90%;
                height: 80px;
                margin-left: 5%;
                margin-top:20px;
                display: flex;
                align-items: center;
                justify-content: space-around;
                border: 1px solid rgba(153,153,153,0.4);
                background: white;
                border-radius: 6px;
                .headerUrl{
                    height: 50px;
                    width: 50px;
                    border-radius: 50%;
                }
                .friends_info{
                    .name{
                        font-size: 14px;
                        font-weight: bold;
                        color: #333;
                    }
                    .company{
                        font-size: 12px;
                        color: #92979b;
                        width: 100px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }
                }
                .icon-jia{
                    color:rgba(255, 141, 26, 1);
                    font-size: 18px;
                    font-weight: 700;
                    cursor: pointer;
                }
            }
        }
    }
    .systemMsg_box{
         position: fixed;
        left: 45%;
        top: 30%;
        width: 280px;
        z-index: 999; 
        border-radius: 6px;
        overflow: hidden;
        box-shadow: rgb(58 58 63 / 30%) 0 0 9px 6px;
        height: 360px;
        background: #F8F8F6;
        .header{
            display: flex;
            height: 46px;
            background: #FFFFFF;
            align-items: center;
            padding: 0 20px;
            justify-content: space-between;
            border-bottom: 1px solid rgba(153,153,153,0.4);
            .title{
                font-size:16px;
            }
            .icon-guanbi{
                margin-top:-8px;
                font-size:18px;
                cursor: pointer;
            }
        }
        .main{
            height: calc(100% - 54px);
            overflow-y: scroll;
            .friends_card{
                width: 90%;
                height: 80px;
                margin-left: 5%;
                margin-top:20px;
                display: flex;
                align-items: center;
                justify-content: space-around;
                border: 1px solid rgba(153,153,153,0.4);
                background: white;
                border-radius: 6px;
                .headerUrl{
                    height: 50px;
                    width: 50px;
                    border-radius: 50%;
                }
                .friends_info{
                    .name{
                        font-size: 14px;
                        font-weight: bold;
                        color: #333;
                    }
                    .company{
                        font-size: 12px;
                        color: #92979b;
                          width: 100px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }
                }
                .icon-jia{
                    color:rgba(255, 141, 26, 1);
                    font-size: 18px;
                    font-weight: 700;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>