<template>
  <div>
    <div class="a_header" style="display:none">
      <router-link
        @click.native="choose_menu(item)"
        v-for="(item, index) in AnaTools_menu"
        :key="index"
        class="menu_item"
        :to="{path:item.url}"
      >
        <svg class="icon-svg aui-navbar__icon-menu"
          :style="{'color':cur_menuUrl === item.url?'#9595f6':'#ccc'}"
          aria-hidden="true">
          <use :href="'#'+item.icon"></use>
        </svg>
        <span class="name" 
        :style="{'color':cur_menuUrl === item.url?'#9595f6':'#ccc'}">
        {{ item.name }}</span>
      </router-link>
    </div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>
<script>
import axios from "axios"

import { mapGetters } from "vuex";
export default {
  name:'analysistools',
  data() {
    return {
      AnaTools_menu: [],
      cur_menuUrl: '/analysistools/matrix'
    };
  },
  mounted() {
    this.loadMenu(this.userMenu);
    // if(this.$route.query.type=="/analysistools"){
    //   this.cur_menuUrl = "/analysistools/matrix"
    // }else{
    //   this.cur_menuUrl = this.$route.query.type;
    // }
    this.cur_menuUrl = this.$route.fullPath
  },
  watch: {},
  computed: {
    ...mapGetters(["userMenu"])
  },
  activated(){
    this.cur_menuUrl = this.$route.fullPath
  },
  methods: {
    loadMenu(data) { //加载菜单
      if(data.children){
        let url = this.$route.fullPath;
        let arr = url.split('/')
        url = arr.length>2?'/'+arr[1]:url
        let menu = data.children.filter(item => item.url == url)[0].children;
        this.AnaTools_menu = menu;
        console.log(this.AnaTools_menu)
      }else{
        return
      }
      
    },
    choose_menu(item) {
      // if(item.name=='通用评分'||item.name=="自定义评分"){
      //   this.$message('该板块暂未开放')
      //   return
      // }
      //选择菜单
      console.log(item.url);
      this.cur_menuUrl = item.url;
      this.$store.dispatch('setAnaUrl',item.url)
    }
  }
};
</script>
<style lang="scss" scoped>
.a_header {
  height: 40px;
  background: #191616;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  border-bottom: 1px solid #555;
  .menu_item {
    display: flex;
    align-items: center;
    align-items: center;
    justify-content: center;
    background: #191616;
    transition: all 0.5s;
    text-decoration: none;
    margin-left: 20px;
    cursor: pointer;
    i {
      font-size: 16px;
      color: #fff;
    }
    .name {
      font-size: 12px;
      color: #fff;
      text-align: center;
      margin-left: 5px;
    }
  }
}
</style>
