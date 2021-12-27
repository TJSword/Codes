
<template>
  <!-- 板块名片 -->
  <div class="palte_card">
    <div class="tops">
      <div class="plate_name">板块名片 >> {{plateName}}</div>
      <div class="close" @click="closeCard">关闭</div>
    </div>
    <div class="bottoms">
      <div class="charts">
        <EchartsComponent  :categoryID="plateID" />
      </div>
      <div class="infos">
        <CardTableComponent :cardData="table_data"/>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
//组件
import EchartsComponent from "../../common/EchartsComponent"
import CardTableComponent from "../../common/CardTableComponent"
export default {
  name:"platecard",
  props:{},
  components:{
    EchartsComponent,
    CardTableComponent
  },
  data(){
    return{
      plateName:'',
      table_data:[ //表格数据
        { color:'#fff',name:'生产总值',value:36982},
        { color:'#fff',name:'人均生产总值',value:69832},
        { color:'#fff',name:'经济活动人口',value:693587},
        { color:'#fff',name:'就业人员数量',value:321368},
        { color:'#fff',name:'城镇单位就业人员工资总额',value:183620},
        { color:'#fff',name:'城镇单位就业人员平均工资',value:6385},
        { color:'#fff',name:'失业人员数量',value:3621},
        { color:'#fff',name:'登记失业率',value:0.052},
        { color:'#fff',name:'退休离职人员',value:13650},
        { color:'#fff',name:'生产总值',value:36982},
        { color:'#fff',name:'人均生产总值',value:69832},
        { color:'#fff',name:'经济活动人口',value:693587},
        { color:'#fff',name:'就业人员数量',value:321368},
        { color:'#fff',name:'城镇单位就业人员工资总额',value:183620},
        { color:'#fff',name:'城镇单位就业人员平均工资',value:6385},
        { color:'#fff',name:'失业人员数量',value:3621},
        { color:'#fff',name:'登记失业率',value:0.052},
        { color:'#fff',name:'退休离职人员',value:13650}
      ]

    }
  },
  mounted(){
    
  },
  computed:{
    ...mapGetters(["mapbox_map","plateID","plateData","plateCenter"])
  },
  watch:{
    plateID:{
      handler(newVal){
        this.getPlateName(newVal)
      }
    }
  },
  methods:{
    getPlateName(id){ //根据板块ID获取板块名称
      let name = this.plateCenter.filter(item=>id==item.regionno)
      if(name.length>0){
        this.plateName = name[0].name
      }
    },
    closeCard(){ //关闭板块名片
      //关闭板块名片状态
      this.$store.dispatch("setCardFlag",false)
      //store板块名片ID重置
      this.$store.dispatch("setPlateID",null)
      //地图飞到中心
      let map = this.mapbox_map
      map.flyTo({
        center: this.plateData.curCityInfo.center,
        zoom: 9,
        speed: 1,
        curve: 1
      })
    },
  }

}
</script>
<style lang="scss" scoped>
  .palte_card{
    height: 100%;
    background: #040506;
    border-top: #444444 1px solid;
    border-left: #444444 1px solid;
    .tops{
      height: 4%;
      display: flex;
      background: #222;
      padding: 0 10px;
      color: #fff;
      align-items: center;
      justify-content: space-between;
      border-bottom: #444444 1px solid;
      border-right: #444444 1px solid;
      .plate_name{
        color: #e6a23c;
      }
      .close{
        cursor: pointer;
        user-select: none;
      }
    }
    .bottoms{
      width: 100%;
      height: 96%;
      .charts{
        height: 40%;
        border-right: #444444 1px solid;
      }
      .infos{
        height: 60%;
      }
    }
  }
</style>