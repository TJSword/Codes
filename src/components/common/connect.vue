<template>
  <!-- 快捷菜单 -->
  <div class="connect" :style="{'top':toggleFlag?'0px':'-70px'}">
    <div class="menu" ref="menu">
      <div class="item" v-for="(item,i) in menus" :key="i" @click="toConnect(item)">
        <i :class="['menu_icon plateicon plate-' + item.icon]"></i>
        <div class="item_name">{{item.label}}</div>
      </div>
    </div>
    <div class="line" :style="{'left':toolLeft+'px'}"></div>
    <div class="photo" :style="{'left':toolLeft+'px'}" @mousedown="dropStart" @click="toggleFlag=!toggleFlag" />
  </div>
</template>
<script>
//API
import commonApi from "@/api/commonApi";
export default {
  data(){
    return{
      menus:[ //菜单
        
      ],
      toggleFlag:false, //菜单收放
      curUrl:null, //当前路由
      isMoveDown:false, //按下标记
      toolLeft:null, //挂件x位置
    }
  },
  mounted(){
    this.setConnectMenu()
  },
  methods:{
    //加载菜单
    setConnectMenu(){
      commonApi.getMenuTree()
      .then(res=>{
        if(res.data.code===0){
          let data = res.data.data[0].children
          let setMenu = data.filter(item=>item.name==="菜单配置")[0].children
          setMenu.forEach((item,i)=>{
            this.menus.push({
              label:item.name,
              icon:item.unit,
              routerUrl:item.url,
              index:item.ismonth
            })
          })
        }
      })
    },
    //菜单跳转
    toConnect(item){
      if(this.$route.path!==item.routerUrl){
        this.$router.push({path:item.routerUrl})
      }
      this.toggleFlag = false
    },
    //挂件移动
    dropStart(e){
      this.isMoveDown = true
      let curLeft = e.clientX || e.touches[0].clientX
      document.onmousemove = (e) => {
        if(!this.isMoveDown) return false
        let menuW = this.$refs.menu.clientWidth
        let minLeft = innerWidth/2 - menuW/2
        let maxLeft = innerWidth/2 + menuW/2
        let eventX = e.clientX || e.touches[0].clientX
        let left = eventX-15
        if(left>minLeft&&left<maxLeft){
          this.toolLeft = left
        }
      }
      document.onmouseup = (e) => {
        this.isMoveDown = false
        document.onmousemove = null;
        document.onmouseup = null;
      }
    },
  }

}
</script>
<style lang="scss">
.connect{
  position: fixed;
  z-index: 9998;
  width: 100%;
  transition: all 0.3s ease-in-out;
  .menu{
    width: 40%;
    padding: 0 20px;
    height: 70px;
    margin: auto;
    display: flex;
    justify-content: space-between;
    background: rgba(47, 47, 51, 0.83);
    .item{
      text-align: center;
      cursor: pointer;
      .menu_icon {
        font-size: 20px;
        color: #cacaca;
        position: relative;
        z-index: 2;
      }
      .item_name{
        font-size: 12px;
        color: #e2e2e2;
        margin-top: 8px;
      }
    }
    .item:hover .menu_icon{
      color: #e6a23c;
    }
    .item:hover .item_name{
      color: #e6a23c;
    }
  }
  .line{
    width: 2px;
    height: 30px;
    background: #e6a23c;
    position: absolute;
    top: 70px;
    left: 47%;
    margin-left: 15px;
  }
  .photo{
    width: 30px;
    height: 30px;
    border-radius: 50%;
    overflow: hidden;
    position: absolute;
    top: 95px;
    left: 47%;
    background: url('http://47.104.165.136:8099/test/portrait.jpg') no-repeat;
    background-size: contain;
    user-select: none;
    cursor: pointer;
  }
}
</style>