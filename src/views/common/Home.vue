<template>
  <div class="home">
    <div class="card_box">
      <!-- <div class="city_wrap">
        <label for="">城市：</label>
        <el-select v-model="curCity" placeholder="请选择" @change="changeCity">
        <el-option
          v-for="item in cityList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      </div> -->
      <div class="user_box">
        <!-- <label for="" style="margin-right:10px;">用户：{{userName}}</label> -->
        <el-link type="primary" @click="logout()">注销登录</el-link>
      </div>
      <Card :data-image="item.cover" v-for="(item,index) in cardData" :key="index" :path="item.path">
        <h1 slot="header">{{item.name}}</h1>
        <p slot="content">{{item.content}}</p>
      </Card>
    </div>
  </div>
</template>

<script>
import Card from '../../components/Home/Card'
import request from '../../utils/request'
export default {
  name: 'Home',
  components: {
    Card
  },
  data(){
    return{
      cardData:[{
        name:'市场资讯',
        cover:require('@/assets/cardImgs/market.jpg'),
        content:'商品房市场备案数据的多维度查询与展示',
        path:'market'
      },{
        name:'土地数据',
        cover:require('@/assets/cardImgs/land.jpg'),
        content:'已上市土地和潜供用地在不同地理范围内的查询与展示',
        path:'land'
      },{
        name:'房产数据',
        cover:require('@/assets/cardImgs/house.jpg'),
        content:'城市宏观数据在不同地理范围内的查询与展示',
        path:'house'
      },
      // {
      //   name:'竞品监控',
      //   cover:require('@/assets/cardImgs/contend.jpg'),
      //   content:'利用数学建模实现城市板块宜居影响因子的数字化评价',
      //   path:'contend'
      // }
      ],
      cityList:[],
      // curCity:'',
      userName:'',
    }
  },
  created(){
    let token = localStorage.getItem('token')
    if(!token){
      this.$router.push({
        path:'/login'
      })
    }
  },
  beforeMount(){
    // this.cityList = JSON.parse(localStorage.getItem('city_list'))
    // this.curCity = localStorage.getItem('cur_citycode')
    this.userName = localStorage.getItem('user_name')
  },
  methods:{
    // changeCity(val){
    //   localStorage.setItem('cur_citycode',this.curCity)
    // },
    logout(){
      request({
          url:'/logout',
          method:'post',
          params:{}
      }).then(res=>{
        if(res.data.code === 0 ){
          localStorage.clear()
          this.$router.push({path:'/login'})
        }else{
          this.$message.error('登出失败，请联系管理员');
        }
       
      })
    },
  }
}
</script>
<style lang="scss">
  .home{
    height:100%;
    width:100%;
    background: url('../../assets/home_bg.jpg') 0 / cover fixed;
    position: absolute;
    left:0;
    top:0;
    overflow: hidden;
    z-index: 1;
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
   
    .card_box{
      padding: 5% ;
      height:80%;
      width:90%;
      background: rgba(0,0,0,0.2);
      overflow: hidden;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      position: absolute;
      left:0;
      top:0;
      z-index: 3;
      .user_box{
        position: absolute;
        height: 40px;
        right: 30px;
        top: 10px;
        color: #fff;
        font-size: 13px;
        display: flex;
        align-items: center;
      }
      .city_wrap{
        position: absolute;
        right:300px;
        top: 10px;
        color: #fff;
        font-size: 13px;
        .el-input__inner{
          background: none;
          border: none;
          border-radius: 0;
          border-bottom: #8e6b36 1px solid;
          width: 120px;
          font-size: 12px !important;
          color: #e6a23c;
        }
        .el-input__icon{
          margin-right: -9px!important;
        }
      }
    }
  }
</style>
