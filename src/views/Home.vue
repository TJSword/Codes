<template>
  <div class="main_wrap">
    <!-- 用户操作 -->
    <UserInfo />
    <!-- 主菜单 -->
    <div class="big_menu">
      <!-- <div class="menu_top">
        <img class="logo" src="@/assets/img/login/logo1.png" alt="">
        <div class="name">投资云地图</div>
      </div> -->
      <div class="menu_box">
        <div class="item" v-for="item in mainMenu" :key="item.value">
          <div class="wrap" v-if="item.iscommon=='1'">
            <router-link :to="{ path: item.route }" @click.native="menuClick(item)" tag="div">
              <i :class="['menu_icon iconfont ' + item.icon]" :style="{color:curMenu==item.value?'#ffc107':'#fff'}"></i>
              <div class="menu_name" :style="{color:curMenu==item.value?'#ffc107':'#fff'}">{{ item.name }}</div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
//API
import commonApi from "@/api/commonApi";
import userApi from "@/api/userApi";

//组件
import UserInfo from '@/components/common/UserInfo'

//插件
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      mainMenu:[
        // { name:'云地图',value:'tzymap',icon:'tzymap',route:'/landmap' },
        // { name:'城市地图',value:'citymap',icon:'citymap',route:'/citymap' },
        // { name:'客情宝',value:'custommap',icon:'custommap',route:'/customerSituation' },
        // { name:'房产数据',value:'marketdata',icon:'marketdata',route:'/marketdata' }
      ],
      curMenu:'TzyMap',//当前大菜单
    };
  },
  components: {
    UserInfo
  },
  watch: {
    freshMenu:{
      handler(newVal){
        this.setUserMenu()
      },
      deep:true
    }
  },
  computed: {
    ...mapGetters(["userInfo","cityCode","freshMenu"])
  },
  beforeMount(){
    this.setUserInfo()
    this.setUserMenu()
  },
  mounted() {
    
    let menu = sessionStorage.getItem('curMainMenu')
    if(menu){
      this.curMenu = menu
    }
    let curMainMenu = sessionStorage.getItem('curMainMenu')
    if(curMainMenu){
      this.$store.dispatch('setCurMenu',curMainMenu)
    }
    //设置当前城市，若不存在设置为成都
    let cityCode = localStorage.getItem('cityCode')
    if(!cityCode){
      localStorage.setItem('cityCode','510100')
    }
    this.$store.dispatch('setCityCode',cityCode?cityCode:'510100')
  },
  methods: {
    //主菜单选择
    menuClick(item){
      console.log(item)
      if(item.value=='custommap'||item.value=='houseData'){
        this.$message('暂未开放')
        return
      }
      this.curMenu = item.value
      this.$store.dispatch('setCurMenu',item.value)
      sessionStorage.setItem('curMainMenu',item.value)
    },
    //设置用户信息
    setUserInfo(){
      userApi.getUserInfo()
      .then(res=>{
        console.log('用户信息',res)
        //设置用户是否为管理员
        let isAdmin = res.data.data.isGov
        this.$store.dispatch('setIsAdmin',isAdmin==='1'?true:false)
        //设置用户是否为超级用户
        let isSuper = res.data.data.isSuper
        this.$store.dispatch('setSuperUser',isSuper==='1'?true:false)
        //设置用户部门名称
        let userDeptName = res.data.data.deptName
        this.$store.dispatch('setUserDeptName',userDeptName)
      })
    },
    //用户菜单
    setUserMenu(){
      var that = this
      commonApi.getMenuTree()
      .then(res=>{
        if(res.data.code===0){
          let data = res.data.data
          data.forEach(item=>{
            if(item.name==='前端配置'){
              item.children.forEach(child=>{
                if(child.name==='菜单配置'){
                  let arr = []
                  child.children.forEach(cd=>{
                    arr.push({
                      id:cd.id,
                      name:cd.name,
                      value:cd.unit,
                      icon:cd.icon,
                      iscommon:cd.iscommon,
                      route:cd.url,
                      children:cd.children
                    })
                  })
                  that.mainMenu = arr
                  console.log('用户菜单',arr)
                  that.$store.dispatch('setUserMenu',arr)
                }
              })
            }
          })
        }
      })
    },
  }
};
</script>
<style lang="scss">
.main_wrap{
  .big_menu{
    position: fixed;
    width: 80px;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 999;
    background: rgba(64,96,101,0.9);
    text-align: center;
    .menu_top{
      .logo{
        width: 45px;
        margin-top: 15px;
      }
      .name{
        margin-left: 10px;
        letter-spacing: 6px;
        font-size: 12px;
        font-weight: bold;
        color: #fff;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        font-family: "微软雅黑";
        text-shadow: 0 0 0px #0ebeff, 0 0 10px #0ebeff, 0 0 10px #0ebeff, 0 0 50px #0ebeff, 0 0 100px #0ebeff;
        }
    }
    .menu_box{
      .item{
        margin-top: 20px;
        cursor: pointer;
        .wrap {
          width: 100%;
          height: 100%;
        }
        .menu_icon{
          font-size: 26px;
          color: #fff;
          transition: all 0.5s;
        }
        .menu_name{
          font-size: 12px;
          color: #fff;
          transition: all 0.5s;
        }
        &:hover .menu_icon{
          color: #ffc107;
        }
        &:hover .menu_name{
          color: #ffc107;
        }
      }
    }
  }
}
</style>
