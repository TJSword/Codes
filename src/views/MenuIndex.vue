<template>
  <div class="wrap_box">
    <div class="top">
      <div class="left">
        <img class="logo" src="~@/assets/img/login/logo.png" />
        <Reveal class="slogan" :text="slogan" />
      </div>
      <div class="photo_wrap">
        <img
          class="user_photo"
          :src="headUrl"
          alt=""
        />
        <div class="user_option">
          <div class="user_name">{{nickName}}</div>
          <i class="info_modify iconfont icon-userinfo" @click="dialogFormVisible=true"></i>
          <i class=" iconfont icon-xiugaimima" @click="changePasswordFormVisible=true"></i>
          <i class="log_out iconfont icon-logout" @click="userLogout"></i>
        </div>
      </div>
    </div>
    <div class="cont">
      <img class="big_log" src="~@/assets/img/login/logoBig.png">
      <div class="main_menu">
        <div class="item" v-for="item in mainMenu" :key="item.value">
          <div class="main_box">
            <div class="bg" :style="{backgroundImage:'url('+item.bgUrl+')'}"></div>
            <i :class="['menu_icon iconfont icon-' + item.icon]"></i>
            <div class="menu_name">{{ item.name }}</div>
            <div class="menu_info">{{ item.info }}</div>
          </div>
          <div class="child_box">
            <div class="menu_wrap" v-for="menu in item.menus" :key="menu.id">
              <div class="bg" :style="{backgroundImage:'url('+menu.image+')'}"></div>
              <router-link class="menu_item" v-if="menu.iscommon==='1'" :to="{ path: menu.url }"
                @click.native="setMenu(menu)" tag="div">
                <i :class="['menu_icon iconfont icon-' + menu.icon]"></i>
                <div class="menu_name">{{ menu.name }}</div>
                <div class="menu_info">{{ menu.info }}</div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <router-view></router-view>
    </div>
    <div class="bottom">青岛客研社数据信息技术服务有限公司</div>
    <el-dialog title="修改用户信息" :visible.sync="dialogFormVisible" :modal-append-to-body='false' width = "450px">
      <el-form :model="form">
        <el-form-item label="用户头像" :label-width="formLabelWidth">
          <el-upload
          class="avatar-uploader"
          list-type="picture"
          ref="upload"
          :action="url + '/sys/oss/upload'"
          :show-file-list="false"
          :auto-upload="false"
          :on-success="handleAvatarSuccess"
          :on-change="handleChange"
          :before-upload="beforeAvatarUpload"
          :headers="{'token':token}">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户昵称" :label-width="formLabelWidth">
        <el-input
        placeholder="请输入内容"
        v-model="realName"
        maxlength="8"
        class="name_input"
        clearable>
        </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="uploadUserInfo">确 定</el-button>
      </div>
   </el-dialog>
   <el-dialog title="修改密码" :visible.sync="changePasswordFormVisible" :modal-append-to-body='false' width = "450px">
      <el-form :model="changePasswordform" :rules="rules" ref="form">
        <el-form-item label="原密码" :label-width="formLabelWidth" prop="password">
          <el-input
          placeholder="请输入原密码"
          v-model="changePasswordform.password"
          type="password"
          class="name_input"
          clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPassword">
          <el-input
          placeholder="请输入内容"
          v-model="changePasswordform.newPassword"
          name="password"
          type="password"
          class="name_input"
          clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="再输一遍" :label-width="formLabelWidth" prop="confirmnewPassword">
          <el-input
          placeholder="请输入内容"
          v-model="changePasswordform.confirmnewPassword"
          type="password"
          class="name_input"
          clearable>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="changePassword">确 定</el-button>
      </div>
   </el-dialog>
  </div>
</template>
<script>
//API
import commonApi from "@/api/commonApi";
//组件
import Reveal from '@/components/tools/reveal'
import userApi from '@/api/userApi'
export default {
  name: "menuindex",
  components: {
    Reveal
  },
  data() {
    let checkPassword = (rule, value, callback) => {
      console.log(value)
        if (this.changePasswordform.confirmnewPassword != this.changePasswordform.newPassword) {
          callback(new Error('两次密码输入不同'));
        } else if(this.changePasswordform.confirmnewPassword === '') {
          callback(new Error('请再次输入新密码'));
        } else {
          callback();
        }
    }
    return {
      uerName:'客研社', //用户名称
      slogan:'房地产开发决策伙伴', //公司标语
      menus: [],
      dialogFormVisible: false,//是否显示修改用户信息表单
      changePasswordFormVisible:false,
      changePasswordform:{
        password:'',
        newPassword:'',
        confirmnewPassword:''
      },
      headUrl:'',
      nickName:"",
      realName:'',
      url:process.env.BASE_URL,
      token:window.localStorage.getItem("token"),
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
          password: [
            { required: true, message: '请输入原密码', trigger: 'blur' },
          ],
          newPassword: [
            { required: true, message: '请输入新密码', trigger: 'blur' }
          ],
          confirmnewPassword: [
            {  required: true, validator: checkPassword, trigger: 'blur' }
          ]
        },
      formLabelWidth: '140px',
      imageUrl:"",
      userinfo_name:"",
      drawer: false,
      mainMenu:[
        { name:'大数据库',value:'data_query',info:'宏观、配套、市场、土地、市政、人口数据',icon:'shujuchaxun',menus:[],children:["hongguan","peitao","shichang","tudi","guanwang","renkoushuju"],bgUrl:"http://47.104.165.136:8099/test/D2D/hongguan.jpg" },
        { name:'云工作台',value:'app_tools',info:'GEBO、板块筛选、土地台账、数据可视化等模块',icon:'yingyonggongju',menus:[],children:["duoweijuzhen","tiaojianfenxi","taizhang","tudikeyan","keshihua","house"],bgUrl:"http://47.104.165.136:8099/test/D2D/yingyonggongju.jpg" },
        { name:'决策支持',value:'decision_support',info:'板块评估、点地评分、一小时定位、价格趋势预判、板块发展趋势预判等模块',menus:[],icon:'juecezhichi',children:["zidingyipingfen","dengshiquan","position","jiagequshi1","jiagequshi3","qitamokuai"],bgUrl:"http://47.104.165.136:8099/test/D2D/juecezhichi.jpg"  },
      ],
    };
  },
  mounted(){
    this.uerName = localStorage.getItem('userName')
    this.nickName = localStorage.getItem('nickName')
    this.headUrl = localStorage.getItem('headUrl')
    this.imageUrl = localStorage.getItem('headUrl')
    this.realName = localStorage.getItem('nickName')
    this.setIndexMenu()
  },
  methods:{
    changePassword(){
         this.$refs.form.validate((valid) => {
          if (valid) {
            userApi.changePassword({
              password:this.changePasswordform.password,
              newPassword:this.changePasswordform.newPassword
            }).then(res=>{
             if(res.data.code == 0){
                this.changePasswordFormVisible = false
                this.$message({
                  type:'success',
                  message:'密码修改成功,请重新登录'
                })
                this.userLogout()
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    uploadUserInfo(){
      if(this.isUpdate){
        this.$refs.upload.submit()
      }else{
        let data = {
          realName:this.realName
        }
        userApi.updateUserInfo(data).then(res=>{
        if(res.data.code == 0){
          this.nickName = this.realName
          localStorage.setItem("nickName",this.realName)
          this.dialogFormVisible = false
          this.$message({
            type:'success',
            message:'修改成功'
          })
        }
      })
      }
      
    },
    //设置配置菜单
    setIndexMenu(){
      let arr = [
        { 
          name:'宏观数据',
          info: "城市宏观数据在不同地理范围内的查询与展示", //宏观数据
          image:"http://47.104.165.136:8099/test/D2D/hongguan.jpg"
        },
        { 
          name:'配套数据',
          info: "与购房相关的配套数据在不同地理范围内的查询与展示", //配套数据
          image:"http://47.104.165.136:8099/test/D2D/peitao.jpg"
        },
        { 
          name:'市场数据',
          info: "商品房市场备案数据的多维度查询与展示", //市场数据
          image:"http://47.104.165.136:8099/test/D2D/shichang.jpg"
        },
        { 
          name:'土地数据',
          info: "已上市土地和潜供用地在不同地理范围内的查询与展示", //土地数据
          image:"http://47.104.165.136:8099/test/D2D/tudi.jpg"
        },
        { 
          name:'市政数据',
          info: "城市政管网地图可视化展示", //市政数据
          image:"http://47.104.165.136:8099/test/D2D/tudi.jpg"
        },
        { 
          name:'人口数据',
          info: "人口数据热力图", 
          image:"http://47.104.165.136:8099/test/D2D/tudi.jpg"
        },
        { 
          name:'GEBO矩阵',
          info: "自由选择坐标轴内容，最多可支持城市板块在四个维度的交叉对比", //GEBO矩阵
          image:"http://47.104.165.136:8099/test/D2D/hongguan.jpg"
        },
        { 
          name:'板块价值分析',
          info: "评判因子与权重全部开放自选，建立企业专属的板块评价体系", //板块评分
          image:"http://47.104.165.136:8099/test/D2D/peitao.jpg"
        },
        { 
          name:'土地评分',
          info: "将目标地块与所有POI建立联系，以反距离插值法计算地块得分", //点地评分
          image:"http://47.104.165.136:8099/test/D2D/tudi.jpg"
        },
        { 
          name:'板块筛选',
          info: "支持多标签数值设定，可精准筛选符合条件的板块", //板块筛选
          image:"http://47.104.165.136:8099/test/D2D/hongguan.jpg"
        },
        { 
          name:'土地台账',
          info: "土地台账功能+自动可研功能，支持记录、统计、查阅和可研报告写作", //土地台账
          image:"http://47.104.165.136:8099/test/D2D/peitao.jpg"
        },
        { 
          name:'土地可研',
          info: "土地可研",  //土地可研
          image:"http://47.104.165.136:8099/test/D2D/shichang.jpg"
        },
        { 
          name:'数据可视化',
          info: "数据可视化展示", //数据可视化
          image:"http://47.104.165.136:8099/test/D2D/peitao.jpg"
        },
        { 
          name:'户型测评',
          info: "户型测评功能", //户型测评
          image:"http://47.104.165.136:8099/test/D2D/peitao.jpg"
        },
        { 
          name:'项目定位',
          info: "项目定位", //户型测评
          image:"http://47.104.165.136:8099/test/D2D/peitao.jpg"
        }
      ]
      // let menuData = JSON.parse(sessionStorage.getItem('userMenu'))
      // if(menuData){
      //   let data = menuData.children
      //   let setMenu = data.filter(item=>item.name==="菜单配置")[0].children
      //     setMenu.forEach((item,i)=>{
      //       let curInfo = arr.filter(info=>item.name==info.name)[0]
      //       item.info = curInfo?curInfo.info:'暂无介绍'
      //       item.image = curInfo?curInfo.image:"http://47.104.165.136:8099/test/D2D/hongguan.jpg"
      //       item.icon = item.unit
      //       item.isShow = false
      //     })
      //     this.menus = setMenu
      //     console.log('用户菜单',setMenu)
      // }else{}
        commonApi.getMenuTree()
        .then(res=>{
          if(res.data.code===0){
            let data = res.data.data[0].children
            let setMenu = data.filter(item=>item.name==="菜单配置")[0].children
            setMenu.forEach((item,i)=>{
              let curInfo = arr.filter(info=>item.name==info.name)[0]
              item.info = curInfo?curInfo.info:'暂无介绍'
              item.image = curInfo?curInfo.image:"http://47.104.165.136:8099/test/D2D/hongguan.jpg"
              item.icon = item.unit
              this.mainMenu.forEach(main=>{
                if(main.children.includes(item.icon)){
                  main.menus.push(item)
                }
              })
            })
            this.menus = setMenu
            console.log('用户菜单',this.mainMenu)
          }
        })
      
    },
    setMenu(item){
      let disableArr = ["jiagequshi1","jiagequshi3","qitamokuai"]
      if(disableArr.includes(item.icon)){
        this.$message('模块待建设')
        return
      }
      if(item.ismonth!=' '){
        if(item.name==='宏观数据'){
          this.$store.dispatch('setPlateType','city')
        }
        this.$store.dispatch("setQueryMenuIndex",JSON.parse(item.ismonth));
        sessionStorage.setItem('queryMenuIndex', JSON.parse(item.ismonth));
      }
      if(item.name==='数据可视化'){
        window.open('http://47.104.165.136:8072','_blank')
      }
    },
    //用户登出
    userLogout() {
      this.$store.dispatch("logOut").then(res => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    },
    handleAvatarSuccess(res, file) {
      console.log(res,file)
      let data = {
        headUrl:res.data.src,
        realName:this.realName
      }
      this.headUrl = res.data.src
      this.nickName = this.realName
      userApi.updateUserInfo(data).then(res1=>{
        console.log(res1)
        if(res1.data.code == 0){
          this.headUrl = res.data.src
          this.nickName = this.realName
          localStorage.setItem("nickName",this.realName)
          localStorage.setItem("headUrl",res.data.src)
          this.dialogFormVisible = false
          this.$message({
            type:'success',
            message:'修改成功'
          })
        }
      })
      
      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    handleChange(file,fileList){
        this.imageUrl = file.url
        this.isUpdate = true
    },
  }
};
</script>
<style lang="scss">
.wrap_box {
  width: 80vw;
  height: 96vh;
  background-image: linear-gradient(161deg, #0f0f13, #628ba9);
  position: absolute;
  z-index: 9999;
  top: 0%;
  left: 0;
  padding: 3vh 10vw;
  .top {
    width: 100%;
    height: 6vh;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left{
      width: 20vw;
      display: flex;
      align-items: center;
      .logo {
        width: 35%;
      }
      .slogan{
        width: 30%;
        margin-left: 10%;
      }
    }
    .photo_wrap{
      position: relative;
      color: #fff;
      .user_photo {
        width: 35px;
        height: 35px;
        border-radius: 100%;
        overflow: hidden;
        transition: all 0.5s;
        cursor: pointer;
      }
      .user_photo:hover{
        transform: scale(1.3);
      }
      .user_option{
        position: absolute;
        left: 0;
        top: -13px;
        transition: all 0.5s;
        opacity: 0;
        z-index :-1;
        padding: 10px;
        min-width: 100px;
        .info_modify,.log_out{
          font-size: 14px;
          margin-right: 12px;
          cursor: pointer;
        }
        .icon-xiugaimima{
          font-size: 14px;
          margin-right: 12px;
          cursor: pointer;
        }
      }
      
      
    }
    .photo_wrap:hover .user_option{
      opacity: 1;
      left: 40px;
      top: -13px;
      transition: all 0.3s ease;
    }
    
  }
  .cont {
    position: relative;
    height: 80vh;
    .back_main{
      position: absolute;
      right: 50px;
      top: 0px;
      z-index: 99;
    }
    .big_log{
      position: absolute;
      width: 20%;
      z-index: 0;
      left: 40%;
      top: 30%;
      opacity: 0.2;
      user-select: none;
    }
    .main_menu{
      overflow-y: scroll;
      width: 100%;
      height: 100%;
      .item{
        display: flex;
        margin-bottom: 20px;
        .main_box{
          width: 20%;
          padding: 1.3%;
          height: 160px;
          margin-top: 30px;
          background: #fff;
          margin-right: 3%;
          text-align: center;
          border-radius: 6px;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          .bg{
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            background-size: cover;
            top: 0;
            transition: all 0.3s;
            z-index: 1;
          }
          .menu_icon {
            font-size: 40px;
            color: #fff;
            position: relative;
            z-index: 2;
          }
          .menu_name {
            font-size: 18px;
            font-weight: bold;
            color: #fff;
            margin: 10px 0;
            position: relative;
            z-index: 2;
          }
          .menu_info {
            font-size: 12px;
            color: #e0e0e0;
            position: relative;
            z-index: 2;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
        .child_box{
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          width: 80%;
          .menu_wrap{
            width: 13%;
            padding: 1%;
            height: 174px;
            margin-top: 30px;
            background: rgba(9,9,10,0.6);
            text-align: center;
            border-radius: 6px;
            position: relative;
            overflow: hidden;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.5s;
            .bg{
              position: absolute;
              width: 100%;
              height: 100%;
              left: 0;
              background-size: cover;
              top: -100%;
              transition: all 0.3s;
              z-index: 1;
            }
            .menu_item {
              width: 100%;
              height: 100%;
              padding-top: 26px;
              .menu_icon {
                font-size: 30px;
                color: #fff;
                position: relative;
                z-index: 2;
              }
              .menu_name {
                font-size: 18px;
                font-weight: bold;
                color: #fff;
                position: relative;
                z-index: 2;
              }
              .menu_info {
                font-size: 12px;
                color: #9c886a;
                margin-top: 5px;
                position: relative;
                z-index: 2;
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
              }
            }
            }
            .menu_wrap:hover {
              box-shadow: rgba(0,0,0,0.1) 0 0 20px;
            }
            .menu_wrap:hover .menu_name{
              color: #fff;
            }
            .menu_wrap:hover .menu_icon{
              color: #fff;
            }
            .menu_wrap:hover .menu_info{
              color: rgb(182, 182, 182);
            }
            .menu_wrap:hover .bg{
              top: 0;
            }
          }
        
      }
    }
  }
  .bottom{
    height: 8vh;
    display: flex;
    align-items: center;
    color: #fff;
    font-family: Raleway, sans-serif;
    justify-content: center;
    font-size: 12px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  // .avatar:hover{
  //   transform: rotate(666turn);
  //   transition-delay: 1s;
  //   transition-property: all;
  //   transition-duration: 59s;
  //   transition-timing-function: cubic-bezier(.34,0,.84,1);
  // }
}
</style>
