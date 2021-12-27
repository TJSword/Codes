<template>
    <div class="mainmenu_wrap">
        <div class="logo_bar">
            <div class="logo_part">
                <img class="logo" src="~@/assets/img/home/logo.png" alt="">
                <!-- <Reveal :text="slogan" /> -->
                <el-select class="city" size="mini" v-model="curentCityID" @change="selectCity()" placeholder="请选择">
                    <el-option-group
                    v-for="group in cityList"
                    :key="group.id"
                    :label="group.name">
                        <el-option
                            v-for="item in group.children"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-option-group>
                </el-select>
            </div>
            <div class="menu_info">
                <div class="menu_item hover_type3" v-for="item in menu_arr" :key="item.id">
                    <div class="item_wrap" @click="menuChange(item)">
                        <router-link class="name" 
                        :style="{'color':item.url===curent_menu?'#9595F6':'#ffffff'}" 
                        :to="{path:item.url}">
                            <svg :style="{'color':item.url===curent_menu?'#9595F6':'#ffffff'}" class="icon-svg aui-navbar__icon-menu" aria-hidden="true"><use :href="'#'+item.icon"></use></svg>
                            {{item.name}}
                        </router-link>
                    </div>
                </div>
                <div class="userinfo" @click="drawer = true">
                    <el-avatar size="small" :src="user_info.portrait" ></el-avatar>
                    <div class="nick_name" >{{user_info.nickName}}</div>
                </div>
            </div>
        </div>
        <el-dialog title="修改用户信息" :visible.sync="dialogFormVisible" :modal-append-to-body='false' width = "450px">
            <el-form :model="form">
                <el-form-item label="用户头像" :label-width="formLabelWidth">
                   <el-upload
                    class="avatar-uploader"
                    list-type="picture"
                    action="#"
                    :show-file-list="false"
                    :auto-upload="false"
                    :on-success="handleAvatarSuccess"
                    :on-change="handleChange"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="用户昵称" :label-width="formLabelWidth">
                <el-input
                placeholder="请输入内容"
                v-model="userinfo_name"
                maxlength="8"
                class="name_input"
                clearable>
                </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>
        <el-drawer
        :visible.sync="drawer"
        :with-header="false"
        :modal-append-to-body='false'
         size = "250px">
        <div class="drawer">
            <div class="header">
                <el-avatar class="avatar"  :src="user_info.portrait" @click.native="dialogFormVisible=true"></el-avatar>
                <div class="nick_name_box">
                    <div class="nick_name">{{user_info.nickName}}</div>
                    <div class="icon_box">
                        <i class="el-icon-edit"  @click="dialogFormVisible=true" style = "color:white;font-size:20px;cursor: pointer;"></i>
                        <!-- <i class="el-icon-setting" @click ="toManangement" style = "color:white;font-size:20px;cursor: pointer;marginLeft:10px;"></i> -->
                        <i class="el-icon-switch-button"  @click="userLogout"  style = "color:white;font-size:20px;cursor: pointer;"></i>
                    </div>
                </div>
            </div>
            <div class="list_item" @click="toOA">
                <svg t="1583908595289" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3379" width="30" height="30"><path d="M873.672738 66.877153 150.324192 66.877153c-46.078455 0-83.463923 37.438681-83.463923 83.463923l0 500.779448c0 46.025243 37.384445 83.463923 83.463923 83.463923l296.033273 0 0 166.900218L205.85902 901.484665c-15.325034 0-27.821649 12.444427-27.821649 27.821649s12.497639 27.819602 27.821649 27.819602L817.921993 957.125917c15.431457 0 27.822672-12.44238 27.822672-27.819602s-12.391215-27.821649-27.822672-27.821649L557.642015 901.484665 557.642015 734.583424l316.030723 0c45.969984 0 83.463923-37.438681 83.463923-83.463923L957.136661 150.340053C957.137685 104.315834 919.642722 66.877153 873.672738 66.877153zM901.494387 651.119501c0 15.350616-12.497639 27.821649-27.821649 27.821649L150.324192 678.94115c-15.377222 0-27.821649-12.471033-27.821649-27.821649L122.502543 150.340053c0-15.350616 12.443403-27.821649 27.821649-27.821649l723.348546 0c15.32401 0 27.821649 12.471033 27.821649 27.821649L901.494387 651.119501z" p-id="3380" fill="#FFFFFF"></path></svg>
                <span>部门工作台</span>
            </div>
            <div class="mine" @click ='toManangement'>
                <svg t="1583908273437" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1917" width="30" height="30"><path d="M909.429 1.053H114.834A113.84 113.84 0 0 0 1.317 114.571v794.595a113.84 113.84 0 0 0 113.517 113.517H370.25c17.028 0 28.38-11.351 28.38-28.379s-11.352-28.38-28.38-28.38H114.834a56.934 56.934 0 0 1-56.759-56.758V114.542c0-31.188 25.542-56.76 56.76-56.76h794.623c31.188 0 56.76 25.572 56.76 56.76v141.897c0 17.057 11.322 28.38 28.35 28.38s28.379-11.323 28.379-28.38V114.542A113.84 113.84 0 0 0 909.429 1.053" p-id="1918" fill="#FFFFFF"></path><path d="M171.593 284.848h397.312c17.028 0 28.38-11.352 28.38-28.38s-11.352-28.38-28.38-28.38H171.593c-17.028 0-28.38 11.352-28.38 28.38s11.352 28.38 28.38 28.38zM398.63 483.504H171.593c-17.028 0-28.38 11.322-28.38 28.379 0 16.998 11.352 28.38 28.38 28.38H398.63c17.027 0 28.379-11.382 28.379-28.38 0-17.057-11.352-28.38-28.38-28.38z m621.48 479.583c-11.352-116.356-93.623-210.008-201.494-241.226 70.948-31.217 119.193-99.328 119.193-181.628a197.427 197.427 0 0 0-198.656-198.656 197.427 197.427 0 0 0-198.656 198.656c0 82.3 48.275 150.411 119.223 181.628-107.842 31.218-187.304 124.87-201.494 238.388v5.676c0 17.027 14.19 28.379 28.38 28.379 17.027 0 28.38-14.19 28.38-28.38v-2.837c14.189-110.68 110.679-198.656 224.167-198.656 116.356 0 210.008 87.976 224.198 198.656 0 17.027 14.19 28.38 28.38 28.38 17.027 2.837 28.379-8.515 28.379-28.38 0 2.838 0 2.838 0 0 0 2.838 0 2.838 0 0zM597.285 540.233c0-79.462 62.434-141.897 141.897-141.897 79.433 0 141.897 62.435 141.897 141.897 0 79.463-62.464 141.897-141.897 141.897-79.463 0-141.897-62.434-141.897-141.897z" p-id="1919" fill="#FFFFFF"></path></svg>
                <span>人员管理站</span>
            </div>
        </div>
        </el-drawer>
    </div>
</template>
<script>
//API
import commonApi from "@/api/commonApi";
//store
import { mapGetters } from "vuex"
//组件
import Reveal from '../../tools/reveal'
export default {
    name:'mainmenu',
    props:{},
    components:{
        Reveal
    },
    data(){
        return{
            slogan:'房地产开发决策伙伴',
            user_info:{ // 用户信息
                enterprise_name:'哔哩地产', //企业名称
                enterprise_logo:'http://47.104.165.136:8099/test/enterprise_logo.png', //企业logo
                portrait:'http://47.104.165.136:8099/test/portrait.jpg',//用户头像
                nickName:'客研社', //用户昵称
                
            },
            curentCityID:null,//当前城市ID
            cityList:[], //城市列表
               
            
            menu_arr:[], //菜单数组
            //   {
            //       name:"大屏",url:"/exhibition",icon: "icon-project",id:"1236896263509737473",
            //       permissions: "",pid:"1232230168873967617",children:[],type: 0,sort: 0,
            //       createDate: "2020-03-09 14:07:04",parentName: null
            //   }
            
            jurisdiction:'管理员',//权限
            curent_menu:"/dataquery",//当前菜单
            dialogFormVisible: false,//是否显示修改用户信息表单
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
            formLabelWidth: '120px',
             imageUrl:"",
             userinfo_name:"",
             drawer: false,
     }
    },
    created(){
        let userMenu = sessionStorage.getItem('userMenu')
        let userMenuList = sessionStorage.getItem('userMenuList')
        if(userMenu){
            this.$store.dispatch("setUserMenu",JSON.parse(userMenu))
            this.menu_arr = JSON.parse(userMenu).children
            this.$store.dispatch("setUserMenuList",JSON.parse(userMenuList))
        }else{
            this.getUserMenu()
        }
        console.log(this.$route.fullPath)
        let str = this.$route.fullPath
        let arr = str.split("/")
        console.log(arr)
        if(arr.length > 2){
            this.curent_menu = "/" + arr[1]
        }else{
            this.curent_menu = this.$route.fullPath
        }
        if(this.curent_menu === "/projectDetail"){// 案例卡详情页 路由样式停留在项目测评
            this.curent_menu = "/projectevaluation"
        }
        console.log(this.curent_menu)
    },
    mounted(){
        this.setCurentMenu()
        this.setUserCity()
    },
    computed:{
        ...mapGetters(["curMenu","analysistoolsUrl"])
    },
    methods:{
        setUserCity(){ //设置客户城市
            let user_city = sessionStorage.getItem('city_list')
            if(user_city){
                this.cityList = JSON.parse(sessionStorage.getItem('city_list'))
                //this.curentCityID = this.cityList[0].children[1].id //默认城市设置
                this.curentCityID="370200"
                this.$store.dispatch("setCityCode",this.curentCityID)
            }else{
                commonApi.getUserCity()
                .then(res=>{
                    console.log(res)
                    if(res.data.code===0){
                        let data = res.data.data
                        if(data[0].children.length>0){
                            //存储城市列表到storage
                            sessionStorage.setItem('city_list', JSON.stringify(data));
                            this.cityList = data
                            this.curentCityID="370200"
                            this.$store.dispatch("setCityCode",this.curentCityID)
                        }else{
                        this.$message('未查询到您的城市数据，请联系客服')
                        }
                    }else{
                        this.$message('登陆城市数据获取失败')
                    }
                
                })
            }
        },
        selectCity(){ //选择当前城市
            this.$store.dispatch("setCityCode",this.curentCityID)
        },
        setCurentMenu(){ //设置当前选中菜单
            // let url = this.$route.query.type
            // if(url){
            //     let arr = url.split('/')
            //     let name = '/'+arr[1]

            //     if(arr.length>2){
            //         this.curent_menu = name
            //     }else{
            //         this.curent_menu = this.$route.query.type;
            //     }
            // }
        },
        //获取用户菜单数据
        getUserMenu(){
            commonApi.getMenuTree()
            .then(res=>{
                if(res.data.code===0){
                    let data = res.data.data[0]
                    console.log('用户菜单',data)
                    this.$store.dispatch("setUserMenu",data)
                    this.menu_arr = data.children
                    sessionStorage.setItem('userMenu', JSON.stringify(data));
                }
            })
            commonApi.getMenuList()
            .then(res=>{
                if(res.data.code===0){
                    let data = res.data.data
                    this.$store.dispatch("setUserMenuList",data)
                    sessionStorage.setItem('userMenuList', JSON.stringify(data));
                }
            })
        },
        //主菜单切换
        menuChange(item){
            if(item.name=="监控"){
                this.$message('该板块暂未开放')
                return
            }
            this.curent_menu = item.url
            console.log(this.curent_menu)
            // this.$store.dispatch("setCurMenu",item.url)
            // if(item.url=='/analysistools'){
            //     this.$router.push({path:this.analysistoolsUrl,query:{type:this.analysistoolsUrl}})
            // }
        },
        //用户登出
        userLogout() {
            console.log(1)
        this.$store.dispatch("logOut").then(res => {
            console.log(res)
            location.reload(); // 为了重新实例化vue-router对象 避免bug
        });
        },
         handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
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
          console.log(file,fileList)
      },
      toOA(){
          this.drawer = false;
          this.$router.push('/department')
      },
      toManangement(){
            this.drawer = false;
          this.$router.push('/manangement')
      }
    }
}
</script>
<style lang="scss" scope>
    
.mainmenu_wrap{
    .logo_bar{
        height: 50px;
        display: flex;
        align-items: center;
        justify-content:space-between;
        background: linear-gradient(to right, #191616 0, #333 100%);
        padding:0 20px;
        border-bottom:1px solid #464646;
        .userinfo{
            height:100%;
            width:150px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            .nick_name{
                margin-left:12px;
                font-size:14px;
                font-family: "PingFang SC";
                color:#46c5ff;
                user-select: none;
            }
        }
        .logo_part,.menu_info{
            height: 100%;
            display:flex;
            align-items: center;
            .menu_item{
                display: flex;
                align-items: center;
                margin-right: 20px;
                height: 35%;
                user-select: none;
                margin-left: 20px;
                outline: none;
                border: none;
                color: #fff;
                cursor: pointer;
                .item_wrap{
                    display: flex;
                    align-items: center;
                    
                    .name{
                        font-size: 12px;
                        text-decoration: none;
                        display: flex;
                        align-items: center;
                        .icon-svg{
                            margin-right: 5px;
                        }
                    }
                }
            } 
            .city{
                margin-left: 30px;
                span{
                    user-select: none;
                }
            }
            .el-select .el-input .el-select__caret{
                color: #9696F7;
            }
            input{
                background: none;
                color: #ffffff;
                border: none;
                user-select: none;
                width: 76px;
                padding-left: 0px;
            }
            .logo{
                width: auto;
                height: 60%;
                margin-right: 30px;
                user-select: none;
            }
            .my_workbench,.member,.logout{
                font-size: 12px;
                user-select: none;
                z-index: 1;
                position: relative;
                padding: 4px 6px;
                margin-right: 10px;
                outline: none;
                border: none;
                background-color: #4a4b58;
                color: #fff;
            }
        }
    }
    .menu_bar{
        height: 60px;
        display: flex;
        align-items: center;
        justify-content:space-between;
        background: rgba(0,0,0,0.85);
        padding:0 20px;
        border-bottom:1px solid #555;
        .left{
            height: 100%;
            display: flex;
            align-items: center;
            .logo{
                width: auto;
                height:65%;
                margin-right: 30px;
                position:relative;
                overflow:hidden;
                .logo_img{
                    height: 100%;
                    cursor:pointer;
                }
                .light{
                    cursor:pointer;
                    position: absolute;
                    left: -180px;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-image: -moz-linear-gradient(0deg,rgba(255,255,255,0),rgba(255,255,255,0.5),rgba(255,255,255,0));
                    background-image: -webkit-linear-gradient(0deg,rgba(255,255,255,0),rgba(255,255,255,0.5),rgba(255,255,255,0));
                    transform: skewx(-25deg);
                    -o-transform: skewx(-25deg);
                    -moz-transform: skewx(-25deg);
                    -webkit-transform: skewx(-25deg);
                }
            }
            .logo:hover .light{
                left:180px;
                -moz-transition:0.5s;
                -o-transition:0.5s;
                -webkit-transition:0.5s;
                transition:0.5s;
            }
            .region{
                height: 100%;
                margin-right: 30px;
                display: flex;
                align-items: center;
                .area_contour{
                    min-width: 43px;
                    height: 80%;
                    background-size: contain;
                    background-repeat: no-repeat;
                }
                
            }
            
        }
        .right{
            display: flex;
            height: 100%;
            align-items: center;
              
        }
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
  .avatar:hover{
    transform: rotate(666turn);
    transition-delay: 1s;
    transition-property: all;
    transition-duration: 59s;
    transition-timing-function: cubic-bezier(.34,0,.84,1);
  }
}
.name_input{
    width:200px;
}
.drawer{
    height:100%;
    width:100%;
    background: #0d1012;
    
    .header{
        height:80px;
        background: #232121;
        display: flex;
        align-items: center;
        border-bottom:1px solid #555;
        .avatar{
            margin-left:20px;
            height:60px;
            width:60px;
        }
        .nick_name_box{
            margin-left:20px;
            height:80px;
            width:150px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .nick_name{
                font-size:20px;
                color:#c1b1b1;
            }
            .icon_box{
                margin-top:4px;
                display: flex;
                align-items: center;
                width:70px;
                justify-content: flex-start;
                .el-icon-switch-button{
                    margin-left:10px;
                }
            }
        }
    }
    .list_item{
        height:80px;
        width:100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color:white;
        border-bottom:1px solid #555;
        cursor: pointer;
        span{
            font-size:25px;
            margin-left:10px;
        }
    }
    .mine{
        height:80px;
        width:100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size:30px;
        color:white;
        border-bottom:1px solid #555;
        cursor: pointer;
        span{
            font-size:25px;
            margin-left:10px;
        }
    }
}

</style>