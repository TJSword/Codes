<template>
  <div class="login_wrap">
    <h1 :class="['title',ani?'title_active':'']">Welcome</h1>
    <dv-loading v-if="showLoading">Loading...</dv-loading>
       <div :class="['login-box',(showLoading || ani)?'login-box_active':'']">
            <h2>Login</h2>
            <form>
                <div class="user-box">
                    <input type="text" name="" required="" v-model="username">
                    <label>Username</label>
                </div>
                <div class="user-box">
                    <input type="password" name="" required="" v-model="password">
                    <label>Password</label>
                </div>
                <div class="user-box">
                    <input name="" required="" v-model="authcode">
                    <img :src="captchaPath" alt="验证码" class="img" @click="getCaptcha">
                    <label>Captcha</label>
                </div>
                <a href="#"  @keydown.enter="login"  @click="login">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                      Login
                </a>
            </form>
        </div>
    </div>
</template>

<script>
import request from "../../utils/request"
export default {
    data(){
        return{
            username:'',
            password:'',
            authcode:'',
            ani:false,
            captchaPath:'',
            uuid:'',
            showLoading:false
        }
    },
    methods:{
        login(){
            if(this.username === ''){
                this.$message({
                    message: '请填写用户名 :(',
                    type: 'warning'
                });
            }else if(this.password === ''){
                 this.$message({
                    message: '请填写密码 :(',
                    type: 'warning'
                });
            }else if(this.authcode === ''){
                 this.$message({
                    message: '请填写验证码 :(',
                    type: 'warning'
                });
            }else{
                request({
                    url:'/login',
                    method:'post',
                    params:{
                        username:this.username,
                        password:this.password,
                        captcha:this.authcode,
                        uuid:this.uuid
                    }
                }).then(res=>{
                    console.log(res)
                    if(res.data.code === 10007){
                        this.$message({
                            message: '验证码错误 :(',
                            type: 'warning'
                        });
                        this.getCaptcha()
                        this.authcode = ''
                    }else if(res.data.code === 10004){
                         this.$message({
                            message: '账号或密码错误 :(',
                            type: 'warning'
                        });
                        this.username = ''
                        this.password = ''
                        this.getCaptcha()
                        this.authcode = ''
                    }else if(res.data.code === 0){
                        this.showLoading = true
                        setTimeout(_=>{
                            this.showLoading = false
                            this.ani = true;
                        },600)
                        document.onkeydown = e=>{}
                        localStorage.setItem('token',res.data.data.token)
                        localStorage.setItem('user_name',this.username)
                        setTimeout(_=>{
                            this.$router.push({path:'/'})
                        },2200)
                        //设置城市
                        // request({
                        //     url:'/sys/region/search',
                        //     method:'get',
                        //     params:{}
                        // }).then(res=>{
                        //     console.log('城市列表',res)
                        //     if(res.data.code===0){
                        //         let data = res.data.data
                        //         if(data.length>0){
                        //             localStorage.setItem('city_list',JSON.stringify(data)) //城市列表
                        //             localStorage.setItem('cur_citycode',data[0].id) //城市列表第一个城市代码
                        //             //设置城市数据
                        //             request({
                        //                 url:"/dl/region/"+data[0].id+"/list",
                        //                 method:'get',
                        //                 params:{}
                        //             }).then(res=>{
                        //                 console.log('板块信息',res)
                        //                 if(res.data.code===0){
                        //                     let data = res.data.data
                        //                     data.forEach(item=>{
                        //                         if(item.type=='city'){
                        //                             let center = item.center.split(' ')
                        //                             localStorage.setItem('city_center',JSON.stringify(center))
                        //                         }
                        //                     })
                        //                 }
                        //             })
                        //         }else{
                        //             this.$message.danger('该账号未配置城市')
                        //         }
                        //     }else{
                        //         this.$message.danger('获取城市失败')
                        //     }
                        // })
                    }
                   
                })
                
            }
        },
        getCaptcha () { //获取随机ID生成验证码
            let uuid =  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
            })
            this.uuid = uuid
            this.captchaPath = process.env.BASE_URL + "/captcha?uuid=" + uuid
        }
    },
    created(){
        this.getCaptcha()
    },
    mounted(){
       document.onkeydown = e=>{
            let key = window.event.keyCode;
            if(key == 13){
               this.login()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.login_wrap{
    height:100%;
    width:100%;
    background: url('../../assets/home_bg.jpg') 0 / cover fixed;
    position: absolute;
    left:0;
    top:0;
    overflow: hidden;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    &:after{
      content: "";
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      /* 从父元素继承 background 属性的设置 */
      background: inherit;
      // filter: blur(1.5px);
      z-index: 2;
    }
    .dv-loading{
        position: relative;
        z-index: 1000;
        font-size:16px;
        color:white;
    }
    .title{
        position: relative;
        z-index: 3;
        color:white;
        font-size:36px;
        letter-spacing: 1px;
        user-select: none;
        opacity: 0;
    }
    .title_active{
        opacity: 1;
        transition: all 0.5s ease;
        font-size:56px;
    }
    .form_box{
        height:400px;
        width:400px;
        background: rgba(0,0,0,0.6);
        position: relative;
        z-index: 3;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .username,.password{
            border: 0;
            outline: 0;
            border: 1px solid fade(white, 40%);
            background-color: #E8F0FE;
            width: 220px;
            border-radius: 3px;
            padding: 10px 15px;
            margin: 0 auto 10px auto;
            display: block;
            text-align: center!important;
            font-size: 18px;
            color: black;
            transition-duration: 0.25s;
            font-weight: 300;
            margin-bottom: 32px;
            &:focus{
                background-color: white;
                width: 260px;
                transition: all 0.3s ease;
            }
        }
        .authCode{
            width: 290px;
            display: flex;
            position: relative;
            margin-bottom: 32px;
            .codeInput{
                border: 0;
                outline: 0;
                border: 1px solid fade(white, 40%);
                background-color: #E8F0FE;
                width: 220px;
                border-radius: 3px;
                padding: 10px 15px;
                margin: 0 auto 10px auto;
                display: block;
                font-size: 18px;
                color: black;
                transition-duration: 0.25s;
                font-weight: 300;
                position: relative;
                left: 0;
                &:focus{
                    background-color: white;
                    left: -20px;
                    transition: all 0.3s ease;
                }
            }
            .img{
                height: 41px;
                width:150px;
                position: absolute;
                right: 20px;
                border-radius: 3px;
                user-select: none;
            }
        }
        .login_btn{
            height: 40px;
            width:250px;
            background:#247cb3;
            border-radius: 6px;
            font-size:20px;
            letter-spacing: 2px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #E8F0FE;
            user-select: none;
            box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
            &:active{
                opacity: 0.7;
            }
        }
    }
    .form_box_active{
        opacity: 0;
        z-index:-3;
        transition: all 0.5s ease;
    }
    .login-box {
        z-index: 3;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 400px;
        padding: 40px;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,.5);
        box-sizing: border-box;
        box-shadow: 0 15px 25px rgba(0,0,0,.6);
        border-radius: 10px;
        }
    .login-box_active{
        opacity: 0;
        transition: all 0.3s ease;
    }
        .login-box h2 {
            margin: 0 0 30px;
            padding: 0;
            color: #fff;
            text-align: center;
        }

        .login-box .user-box {
        position: relative;
        .img{
            position: absolute;
            height: 35px;
            width:130px;
            right:0;
           }
        }

        .login-box .user-box input {
            width: 100%;
            padding: 10px 0;
            font-size: 20px;
            color: #fff;
            margin-bottom: 30px;
            border: none;
            border-bottom: 1px solid #fff;
            outline: none;
            background: transparent!important;
        }
        .login-box .user-box label {
        position: absolute;
        top:0;
        left: 0;
        padding: 10px 0;
        font-size: 16px;
        color: #fff;
        pointer-events: none;
        transition: .5s;
        }

        .login-box .user-box input:focus ~ label,
        .login-box .user-box input:valid ~ label {
        top: -20px;
        left: 0;
        color: #03e9f4;
        font-size: 12px;
        }

        .login-box form a {
        position: relative;
        display: inline-block;
        padding: 10px 20px;
        color: #03e9f4;
        font-size: 16px;
        text-decoration: none;
        text-transform: uppercase;
        overflow: hidden;
        transition: .5s;
        margin-top: 40px;
        letter-spacing: 4px
        }

        .login-box a:hover {
            background:#0ea7af;
            color: #fff;
            border-radius: 5px;
            box-shadow: 0 0 5px #0ea7af,
                        0 0 25px#0ea7af,
                        0 0 50px#0ea7af,
                        0 0 100px#0ea7af;
        }

        .login-box a span {
        position: absolute;
        display: block;
        }

        .login-box a span:nth-child(1) {
        top: 0;
        left: -100%;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, transparent, #03e9f4);
        animation: btn-anim1 1s linear infinite;
        }

        @keyframes btn-anim1 {
        0% {
            left: -100%;
        }
        50%,100% {
            left: 100%;
        }
        }

        .login-box a span:nth-child(2) {
        top: -100%;
        right: 0;
        width: 2px;
        height: 100%;
        background: linear-gradient(180deg, transparent, #03e9f4);
        animation: btn-anim2 1s linear infinite;
        animation-delay: .25s
        }

        @keyframes btn-anim2 {
        0% {
            top: -100%;
        }
        50%,100% {
            top: 100%;
        }
        }

        .login-box a span:nth-child(3) {
        bottom: 0;
        right: -100%;
        width: 100%;
        height: 2px;
        background: linear-gradient(270deg, transparent, #03e9f4);
        animation: btn-anim3 1s linear infinite;
        animation-delay: .5s
        }

        @keyframes btn-anim3 {
        0% {
            right: -100%;
        }
        50%,100% {
            right: 100%;
        }
        }

        .login-box a span:nth-child(4) {
        bottom: -100%;
        left: 0;
        width: 2px;
        height: 100%;
        background: linear-gradient(360deg, transparent, #03e9f4);
        animation: btn-anim4 1s linear infinite;
        animation-delay: .75s
        }

        @keyframes btn-anim4 {
        0% {
            bottom: -100%;
        }
        50%,100% {
            bottom: 100%;
        }
        }
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
        -webkit-transition: "color 9999s ease-out, background-color 9999s ease-out";
        -webkit-transition-delay: 9999s;

    }
}
</style>