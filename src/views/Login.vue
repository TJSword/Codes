<template>
 <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper" >
      <div class="header">
          <img src="~@/assets/img/login/logo.png" alt="" class="header_logo">
          <div class="btn_box">
            <img src="~@/assets/img/login/menu.png" @click="showLogin" alt="">
          </div>
      </div>
      <div class="middle" @click.self="hidebox">
        <div class="left">
          <div class="middle_middle" style="user-select:none">
          <!-- <span style="color:#FFA4A4">1,730,217,345</span>组数据 -->
            <span>
              1,730,217,345组数据
            </span>
          </div>
          <div class="hearder_text" style="user-select:none">DATA TO DECISION</div>
          <div class="hearder_text1" style="user-select:none">房地产开发决策伙伴</div>
          <div class="middle_footer" style="user-select:none">点击了解客研社更多产品 ></div>
        </div>
        <div class="right">
          <img src="~@/assets/img/login/logoBig.png" alt="" style="user-select:none">
        </div>
        
      </div>
      <div class="container" @click="handleScroll">
        <div class="chevron"></div>
        <div class="chevron"></div>
        <div class="chevron"></div>
        <span class="text" style="user-select:none">Scroll down</span>
      </div>
      <div id="screen" :class="[isScroll?'screenAfter':'screenBefore']" >
          <div class="containerUp" @click="handleScroll">
            <div class="chevronUp" @click="handleScroll"></div>
            <div class="chevronUp" @click="handleScroll"></div>
            <div class="chevronUp" @click="handleScroll"></div>
        </div>
      </div>
      <div :class="['site-content',showLoginBox?'showContent':'']">
        <form class="login-form" action="javascript:void(0);">
          <div class="form-field">
              <svg t="1582682667568" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3099" width="20" height="20"><path d="M905.188 923.75c0 20.306-15.919 36.788-35.55 36.788-19.709-0.345-35.556-16.404-35.556-36.163 0-0.219 0.002-0.439 0.007-0.656l-0.282-3.342c0-1.519 0.225-2.925 0.394-4.331-22.219-161.325-155.925-279.844-318.712-281.7-1.294 0-2.531 0.169-3.881 0.169-1.294 0-2.531-0.169-3.825-0.169-160.875 1.856-293.344 117.731-317.756 276.244 0.886 3.084 1.401 6.627 1.413 10.289l0.331 2.93c0.003 0.169 0.005 0.368 0.005 0.568 0 20.070-16.097 36.381-36.084 36.726-20.052-0.345-36.149-16.656-36.149-36.726 0-0.2 0.002-0.399 0.005-0.598v-0.364h-0.731c0.056-1.069 0.281-2.081 0.394-3.15 0-3.094 0.45-6.019 1.125-8.888 18.563-148.725 114.862-268.988 245.981-320.738-76.331-50.625-126.112-140.063-126.112-242.156 0-158.006 118.688-286.088 271.406-286.088 152.719 0 271.35 128.081 271.35 286.088 0 102.094-49.725 191.475-126 242.1 130.219 51.356 226.125 170.213 245.644 317.419 1.35 3.938 2.25 7.987 2.25 12.375l0.225 3.375zM720.688 348.537c0-119.419-93.656-216.281-209.138-216.281-115.425 0-209.025 96.862-209.025 216.281 0 119.475 93.6 216.281 209.025 216.281 115.481 0 209.081-96.806 209.081-216.281z" p-id="3100" fill="#e6e6e6"></path></svg>
              <input v-model="user.username" type="text" name="username" id="username" class="form-field" pattern="^[a-zA-Z0-9_-]{1,16}$" placeholder=" " required>
              <label for="username">Username</label>
          </div>
          <div class="form-field">
              <svg t="1582682934681" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3956" width="20" height="20"><path d="M810.414507 490.86668 256.559237 490.86668 256.559237 341.749478c0-129.207757 126.419248-234.32484 255.624958-234.32484S746.505965 233.841839 746.505965 363.051643c0 11.773138 9.528004 21.300119 21.304212 21.300119 11.773138 0 21.302165-9.525957 21.302165-21.300119 0-152.703891-124.233466-298.231335-276.927123-298.231335S213.95593 189.047634 213.95593 341.749478l0 149.117203c-46.994314 0-85.208661 38.211277-85.208661 85.206614l0 298.229289c0 46.992267 38.214347 85.206614 85.208661 85.206614l596.458577 0c46.994314 0 85.210707-38.214347 85.210707-85.206614L895.625214 576.073294C895.625214 529.077957 857.408821 490.86668 810.414507 490.86668zM853.018837 874.302583c0 23.483854-19.11843 42.60433-42.60433 42.60433L213.95593 916.906913c-23.485901 0-42.60433-19.120476-42.60433-42.60433L171.3516 576.073294c0-23.487947 19.11843-42.606377 42.60433-42.606377l596.458577 0c23.485901 0 42.60433 19.11843 42.60433 42.606377L853.018837 874.302583zM512.185218 618.676601c-23.531949 0-42.60433 19.076474-42.60433 42.600237 0 15.770172 8.570189 29.528524 21.302165 36.897352l0 69.613474c0 11.771091 9.537214 63.910589 21.302165 63.910589 11.762905 0 21.300119-52.139497 21.300119-63.910589L533.485337 698.17419c12.731976-7.367805 21.304212-21.126156 21.304212-36.897352C554.789549 637.753075 535.713075 618.676601 512.185218 618.676601z" p-id="3957" fill="#e6e6e6"></path></svg>              
              <input v-model="user.password" @focus="passwordChange" :type="passwordType" name="password" id="password" class="form-field" placeholder=" " required>
              <label for="password">Password</label>
          </div>
          <div class="form-field">
              <svg t="1582869730716" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3546" width="20" height="20"><path d="M973.85984 237.64992c-40.42752-2.7904-81.06496-10.38336-115.92192-21.54496-11.28448-3.39456-22.5792-7.15264-33.94048-11.22304-23.95648-7.05536-56.54528-21.04832-93.53216-40.9856-0.39936-0.1792-0.78848-0.40448-1.1776-0.6144-8.69888-4.69504-17.59744-9.70752-26.6496-15.0272-12.20608-6.99392-24.2944-14.44864-36.36224-22.22592-0.46592-0.31744-0.92672-0.59392-1.38752-0.90112-8.66816-5.59616-17.30048-11.38176-25.86624-17.3824-5.57056-3.82464-11.15648-7.90016-16.7424-11.94496-4.19328-3.07712-8.3968-5.96992-12.5952-9.14432C578.9696 63.7184 548.64896 37.97504 520.25856 10.24c-28.3904 27.73504-58.72128 53.4784-89.43616 76.42624-4.19328 3.1744-8.40192 6.0672-12.5952 9.14432-5.59104 4.0448-11.16672 8.1152-16.7424 11.94496-8.57088 6.00064-17.19808 11.78112-25.86624 17.3824-0.45568 0.3072-0.92672 0.58368-1.3824 0.90112-12.07296 7.77728-24.15104 15.232-36.36224 22.22592-9.0624 5.31968-17.95584 10.33216-26.65472 15.0272-0.38912 0.20992-0.78848 0.4352-1.17248 0.6144-36.98688 19.9424-69.58592 33.93024-93.53728 40.9856-11.35616 4.07552-22.64064 7.82848-33.94048 11.22304-34.85696 11.1616-75.47904 18.75456-115.9168 21.54496L66.56 237.66016c1.1776 18.1248 2.39616 42.1632 3.8144 68.18816 0.22016 0 0.4864 0 0.74752-0.03584 6.82496 97.13664 26.2912 235.30496 55.65952 316.4928 1.31584 3.54304 2.432 7.2448 3.74784 10.75712 0.61952 1.65376 1.34144 3.17952 1.96096 4.81792 70.2976 181.48864 192.39424 313.53856 339.12832 361.94304l0 0.50688c19.39456 6.4 35.73248 10.35776 48.64 12.84096 12.89728-2.48832 29.25056-6.44096 48.64-12.84096l0-0.50688c146.73408-48.40448 268.8256-180.4544 339.12832-361.94304 0.61952-1.64864 1.34144-3.16416 1.96608-4.81792 1.3056-3.51232 2.432-7.20896 3.74272-10.75712 29.36832-81.18272 48.83968-219.35616 55.66464-316.4928 0.26624 0.03584 0.53248 0.03584 0.74752 0.03584 1.41312-26.02496 2.62656-50.05824 3.80416-68.18816L973.85984 237.66016 973.85984 237.64992zM920.81664 284.57472l-0.56832 10.63936c-0.57856 2.42688-0.96256 4.90496-1.14176 7.41888-6.35392 90.4192-24.20736 224.44544-52.95104 303.90272-0.79872 2.1504-1.54624 4.35712-2.2784 6.54848-0.4608 1.36704-0.91648 2.7392-1.61792 4.5312-0.5888 1.38752-1.16224 2.7648-1.55136 3.80416-65.36192 168.7296-177.76128 290.21184-308.3776 333.30176-2.11456 0.6912-4.15744 1.52064-6.11328 2.4576-8.8576 2.76992-17.54624 5.13536-25.9584 7.06048-8.35584-1.91488-16.9984-4.27008-25.84576-7.02464-1.99168-0.96256-4.06016-1.79712-6.21056-2.49344-130.62656-43.08992-243.0208-164.57216-308.25984-332.98944-0.512-1.35168-1.05472-2.66752-1.8944-4.64384-0.49664-1.32096-0.94208-2.67776-1.39776-4.0448-0.74752-2.19648-1.49504-4.4032-2.16576-6.22592-28.8512-79.744-46.69952-213.77536-53.04832-304.1792-0.17408-2.51904-0.5632-5.00736-1.152-7.43936l-0.55808-10.41408c-0.09216-1.67424-0.1792-3.33312-0.26624-4.98688 27.57632-4.25984 54.17984-10.41408 78.35648-18.16064 11.34592-3.40992 22.86592-7.20896 35.18464-11.5968 28.23168-8.48896 63.21152-23.77216 101.33504-44.27776 0.66048-0.33792 1.29536-0.67584 1.85344-0.98304 9.216-4.97152 18.64704-10.28608 27.78624-15.65184 11.99616-6.87104 24.6272-14.58688 38.61504-23.59808 0.39424-0.25088 1.07008-0.68608 1.45408-0.9472 9.1904-5.93408 18.34496-12.06784 27.01312-18.14528 5.0944-3.49184 10.1888-7.168 15.29344-10.86976l2.7392-1.97632 4.52096-3.26656c2.8928-2.06336 5.78048-4.14208 8.44288-6.15424 20.03968-14.97088 39.51104-30.7456 58.21952-47.17568 18.69312 16.4096 38.10816 32.1536 58.01984 47.02208 2.87232 2.16576 5.73952 4.22912 8.61184 6.28736l4.79232 3.456 1.7408 1.25952c5.3504 3.88096 10.71104 7.7568 15.62624 11.12064 9.09312 6.3744 18.25792 12.51328 26.57792 17.87904l2.304 1.50528c13.87008 8.93952 26.50112 16.66048 38.15936 23.33696 9.60512 5.63712 19.03616 10.95168 28.02176 15.7952 0.44544 0.24064 1.06496 0.56832 1.72032 0.90624 38.26688 20.61312 73.39008 35.96288 101.71392 44.48256 12.33408 4.39296 23.81824 8.18176 34.2528 11.30496 24.77568 7.93088 51.59936 14.1568 79.27296 18.44736C920.99072 281.3696 920.90368 282.96704 920.81664 284.57472L920.81664 284.57472zM742.20544 398.90432l-262.45632 269.0048-134.35904-137.72288c-9.30816-9.52832-24.38656-9.52832-33.69472 0-9.30816 9.5488-9.30816 25.00096 0 34.54464l151.20896 154.98752c4.65408 4.77184 10.74688 7.15776 16.8448 7.15776s12.19072-2.39104 16.84992-7.15776l279.30624-286.26944c9.30304-9.53856 9.30304-24.99584 0-34.53952C766.592 389.36576 751.5136 389.36576 742.20544 398.90432L742.20544 398.90432z" p-id="3547" fill="#e6e6e6"></path></svg>
              <input v-model="user.captcha" type="text" name="captcha" id="captcha" class="form-field"  placeholder=" " required>
              <label for="captcha">Captcha</label>
              <img :src="captchaPath" @click="getCaptcha()" class="captcha" width="120px">
          </div>
          <button type="submit" value="Login" class="btn" @click="userLogin" style="user-select:none">sign in</button>
          <div class="login-tip" v-if="loginTips!=null">{{loginTips}}</div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import userApi from "@/api/userApi";
// import request from "@/utils/request";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      user: {
        username: "",
        password: "",
        captcha:"",
        uuid:""
      },
      isScroll:false,
      scrollTop:100,
      passwordType:"text",
      loginTips:null,
      showLoginBox:false,
      captchaPath:"",//验证码图片路径
      dataRule: {
        username: [
          { required: true, message: '帐号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      },
    };
  },
  computed: {
    ...mapGetters(["token"])
  },
  methods: {
    async userLogin() {
      if(this.user.username==""||this.user.password==""){
        this.loginTips = "请输入用户名或密码"
          setTimeout(()=>{
            this.loginTips = null
          },2000)
      }else{
        let res = await userApi.login(this.user);
        if (res) {
          console.log(res)
          this.loginTips = res.data.msg
          setTimeout(()=>{
            this.loginTips = null
          },2000)
          if(res.data.code === 0){
            window.sessionStorage.clear();
            this.$store.dispatch("setToken", res.data.data.token);
            localStorage.setItem("userName", this.user.username);
            localStorage.setItem("nickName",res.data.data.data.realName)
            localStorage.setItem("headUrl",res.data.data.data.headUrl)
            this.passwordType = "text"
            this.$router.push({ path: this.redirect || "/" });
            
          }else{
            this.getCaptcha()
            this.loginTips = res.data.msg
            setTimeout(()=>{
              this.loginTips = null
            },2000)
          }
        }
      }
      
    },
    passwordChange(){
      this.passwordType = "password"
    },
    showLogin(){//弹出登录框
      this.showLoginBox = true
    },
    hidebox(){
      this.showLoginBox = false
      console.log(1)
    },
    handleScroll(){
      if(!this.isScroll && !this.isScrolled){//设置初始值 防止方法重复触发
        this.isScroll = true
        setTimeout(()=>{
          this.isScrolled = true
        },1000)
      }else if(this.isScroll && this.isScrolled){
        this.isScroll=false
        setTimeout(()=>{
          this.isScrolled = false
        },1000)
      }
    },
    getCaptcha () { //获取随机ID生成验证码
      let uuid =  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
      })
      this.user.uuid = uuid
      this.captchaPath = process.env.BASE_URL + "/captcha?uuid=" + uuid
    }
  },
  created(){
     this.getCaptcha()
  },
  mounted(){
     window.addEventListener('mousewheel',this.handleScroll,true) // 监听滚动事件
  }
};
</script>

<style lang="scss" scoped>
  .log_box{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .site-wrapper.site-page--login {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(38, 50, 56, .3);
    overflow: hidden;
    &:before {
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      content: "";
      background-image: url(~@/assets/img/login/login_bg.jpg);
      background-size: cover;
      
    }
    .site-content__wrapper {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 0;
      margin: 0;
      // overflow-x: hidden;
      // overflow-y: auto;
      overflow: hidden;
    }
    .site-content {
      min-height: 100%;
      position: fixed;
      z-index:999999;
      top:100%;
      left:60%;
      opacity: 0;
      transition: all 0.4s ease;
    }
    .showContent{
      top:0!important;
      opacity: 1;
      transition: all 0.4s ease
    }
    .brand-info {
      color: #fff;
      position: absolute;
      left: 19%;
      top: 17%;
    }
    .brand-info__text {
      margin:  0 0 12px 0;
      font-size: 48px;
      font-weight: 600;
      text-transform : uppercase;
      color: #9dafd2;
    }
  }
  body {
    margin:0;
    padding: 0;
    display: flex;
    height: 100vh;
    justify-content: center;
    align-items: center;
    font-family: Lato, sans-serif;
    background: #ECEFFC;
}

.login-form {
  position: absolute;
  top: 30%;
  right: 41%;
  width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2em;
  color: white;
  background: rgba(150, 150, 255, 0.58);
  border-radius: 10px;
  box-shadow: 0 0 20px 20px rgba(0,0,0,0.1);

  .sys-name {
    margin-bottom: 2em;
    font-size: 22px;
    font-weight: bold;
  }

  .form-field {
    position: relative;
    display: flex;
    align-items: center;
    padding: 4px 0 0 0;
    margin-bottom: 2em;
    font-size: 20px;
    border-bottom: 1px solid white;
    transition: 0.4s;

    & > * {
      padding-bottom: 0.5em;
    }

    &::after {
      position: absolute;
      content: "";
      bottom: -1px;
      left: 0;
      width: 100%;
      height: 2px;
      background: #3498db;
      transform-origin: left;
      transform: scaleX(0);
      transition: 0.4s ease;
    }

    &:focus-within::after {
      transform: scaleX(1);
      margin-top:30px;
    }

    input {
      top: 1px;
      padding-top: 0;
      padding-left: 0.5em;
      margin: 0;
      color: white;
      background: transparent;
      border: none;
      outline: none;

      // label will float in 2 situations based on its sibling input:
      // 1. input get focus
      // 2. input has text filled
      &:focus ~ label,
      &:not(:placeholder-shown) ~ label {
        transform: translateY(-24px) scale(0.75);
      }

      &:valid ~ label {
        color: #ecf5ff;
      }

      &:invalid ~ label {
        color: #ecf5ff;
      }
    }

    label {
      position: absolute;
      left: 30px;
      transform-origin: left;
      transition: 0.4s;
    }
  }

  .btn {
    position: relative;
    width: 100%;
    padding: 10px 0;
    margin: 0.5em 0 0 0;
    font-size: 1.2em;
    color: white;
    background: #9696FF;
    outline: none;
    cursor: pointer;
    overflow: hidden;
    transition: 0.5s;
    border-radius: 50px;
    border: none;
    &::before {
      position: absolute;
      content: "";
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        120deg,
        transparent,
        hsla(204, 70%, 53%, 0.5),
        transparent
      );
      transform: translateX(-100%);
      transition: 0.5s;
    }

    &:hover {
      box-shadow: 0 0 20px 2px #9696FF;
    }

    &:hover::before {
      transform: translateX(100%);
    }
  }
  .login-tip{
    position: absolute;
    width: 100%;
    height: 20px;
    left: 0;
    bottom: 12px;
    text-align: center;
    line-height: 20px;
    font-size: 13px;
    color: #ecf5ff;
  }
}
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px white inset;
  border: 1px solid #CCC!important;
}
.header{
  height:15%;
  width:90%;
  position: fixed;
  padding: 0 5%;
  left:0;
  top:0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 50;
  .header_logo{
    height:auto;
    width:120px;
  }
  .btn_box{
    width: 30px;
    img{
      width: 100%;
      cursor: pointer;
    }
    }
}
.middle{
  margin-top:5%;
  padding: 0 5%;
  height:93%;
  display: flex;
  justify-content: space-between;
  .right{
    margin-right: 5%;
    margin-top: 12%;
    width: 25%;
    img{
      width: 100%;
    }
  }
  .left{
    margin-top: 10%;
    .hearder_text{
      font-size:60px;
      color: #fff;
      letter-spacing: 4px;
      font-weight: bold;
      margin-top: 40px;
    }
    .hearder_text1{
      font-size:30px;
      color: #fff;
      letter-spacing: 4px;
    }
  }
  .middle_header{
    display: flex;
    height:50%;
    align-items: center;
    img{
      height:337px;
      width:280px;
   }
   
  }
  .middle_middle{
    width: 365px;
    margin-top:20px;
    line-height:80px;
    color:white;
    border-bottom:3px solid #9494F5;
    text-transform: uppercase;
    span {
      font: 700 4em/1 "Oswald", sans-serif;
      letter-spacing: 0;
      padding: 12px 0 ;
      display: block;
      background: url(http://f.cl.ly/items/010q3E1u3p2Q0j1L1S1o/animated_text_fill.png) repeat-y;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      -webkit-animation: aitf 80s linear infinite;
      -webkit-transform: translate3d(0,0,0);
      -webkit-backface-visibility: hidden;
      font-size:30px;
      letter-spacing:4px;
  }
  @-webkit-keyframes aitf {
	0% { background-position: 0% 50%; }
	100% { background-position: 100% 50%; }
}
    }
  .middle_footer{
    color:#fff;
    font-size:16px;
    margin-top:60px;
  }
}
.container {
    position: relative;
    width: 24px;
    height: 24px;
    margin-top:120px;
    cursor: pointer;
}
.chevron {
    position: absolute;
    width: 28px;
    height: 8px;
    opacity: 0;
    transform: scale3d(0.5, 0.5, 0.5);
    animation: move 3s ease-out infinite;
    cursor: pointer;
}
.chevron:first-child {
    animation: move 3s ease-out 1s infinite;
}
.chevron:nth-child(2) {
    animation: move 3s ease-out 2s infinite;
}
.chevron:before,
.chevron:after {
    content: ' ';
    position: absolute;
    top: 0;
    height: 100%;
    width: 51%;
    background: #fff;
}
.chevron:before {
    left: 0;
    transform: skew(0deg, 30deg);
}
.chevron:after {
    right: 0;
    width: 50%;
    transform: skew(0deg, -30deg);
}
@keyframes move {
    25% {
        opacity: 1;
    }
    33% {
        opacity: 1;
        transform: translateY(30px);
    }
    67% {
        opacity: 1;
        transform: translateY(40px);
    }
    100% {
        opacity: 0;
        transform: translateY(55px) scale3d(0.5, 0.5, 0.5);
    }
}
.text {
    display: block;
    margin-top: 75px;
    margin-left: -30px;
    font-family: "Helvetica Neue", "Helvetica", Arial, sans-serif;
    font-size: 12px;
    color: #fff;
    text-transform: uppercase;
    white-space: nowrap;
    opacity: .25;
    animation: pulse 2s linear alternate infinite;
}
@keyframes pulse {
    to {
        opacity: 1;
    }
}
#screen{
  height:93%;
  width:100%;
  background: pink;
  position: absolute;
  top:100%;
  left:0;
  transition: all 0.8s ease-out;
  opacity: 0;
  .containerUp {
    position: absolute;
    width: 24px;
    height: 24px;
    left:49%;
    top:-2%;
    transform:rotate(180deg);
    z-index: 999999;
    cursor: pointer;
    .chevronUp {
    position: absolute;
    width: 28px;
    height: 8px;
    opacity: 0;
    transform: scale3d(0.5, 0.5, 0.5);
    animation: move 3s ease-out infinite;
    cursor: pointer;
    
}
.chevronUp:first-child {
    animation: move 3s ease-out 1s infinite;
    
}
.chevronUp:nth-child(2) {
    animation: move 3s ease-out 2s infinite;
    
}
.chevronUp:before,
.chevronUp:after {
    content: ' ';
    position: absolute;
    top: 0;
    height: 100%;
    width: 51%;
    background: #fff;
    
}
.chevronUp:before {
    left: 0;
    transform: skew(0deg, 30deg);
    
}
.chevronUp:after {
    right: 0;
    width: 50%;
    transform: skew(0deg, -30deg);
}
@keyframes move {
    25% {
        opacity: 1;
    }
    33% {
        opacity: 1;
        transform: translateY(30px);
    }
    67% {
        opacity: 1;
        transform: translateY(40px);
    }
    100% {
        opacity: 0;
        transform: translateY(55px) scale3d(0.5, 0.5, 0.5);
    }
}
}
}
.screenAfter{
  top:7%!important;
  opacity: 1!important;
}
.screenBefore{
  top:10%0!important;
  opacity: 0;
}
.icon{
  color:red!important
}
.captcha{
  position: absolute;
  right:0;
  height:30!important;
  width:100;
}
</style>
