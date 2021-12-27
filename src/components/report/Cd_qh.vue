<template>
  <!-- 竞品市场-去化、销量 -->
  <div class="cd_qh_wrap">
    <div class="table_qh">
      <div class="head_wrap">
        <div class="table_head" v-for="(item,index1) in qhTableHead" :key="index1">{{item}}</div>
      </div>
      <div class="cd_box">
        <div class="cd_item" v-for="(cd,index2) in cdqhData" :key="index2">
            <!-- 项目名称 -->
            <div class="name">{{cd.building_name}}</div>
            <div class="proType_wrap">
              <div class="proType_item" v-for="(proType,index3) in cd.market" :key="index3">
                <!-- 物业形态 -->
                <div class="name" v-if="proType.show">{{proType.type_name}}</div>
                <div class="buildType_wrap">
                  <div class="buildType_item" v-for="(buildType,index4) in proType.build_forms" :key="index4">
                    <!-- 建筑形态 -->
                    <div class="name" v-if="buildType.area_sizes&&buildType.area_sizes.length>0">{{buildType.build_form_name}}</div>
                    <div class="areaSize_wrap">
                      <div class="areaSize_item" v-for="(areaSize,index5) in buildType.area_sizes" :key="index5">
                        <!-- 面积段 -->
                        <div class="areaSize_name">{{areaSize.area_size}}</div>
                        <!-- 供应套数 -->
                        <div class="areaSize_name">{{areaSize.supply}}</div>
                        <!-- 成交套数 -->
                        <div class="areaSize_name">{{areaSize.volume}}</div>
                        <!-- 去化率 -->
                        <div class="areaSize_name">{{areaSize.ratio?areaSize.ratio.toFixed(2):''}}</div>
                        
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import LandReportApi from '@/api/LandReportApi_zlq'
import Map from '@/components/common/MapComponent'
export default {
  name: "cdqh",
  components: {
    Map
  },
  data() {
    return {
      reportId:'1306841780423069697',//报告ID
      cdqhData:[],//竞品去化信息
      qhTableHead:['项目名称','物业形态','建筑形态','面积段','供应套数','成交套数','去化率'],//去化表格表头
    };
  },
  mounted() {
    this.getCdqh()
    setTimeout(() => {
      
    }, 2500);
  },
  computed: {
    ...mapGetters(["CD_map"]),
  },
  watch: {},
  methods: {
    getCdqh(){ //获取项目竞品去化销量信息
      var that = this
      LandReportApi.projectCdqh({reportId:that.reportId,mold:'qh'})
      .then(res=>{
        if(res.data.code===0){
          let data = res.data.data
          console.log('项目竞品去化销量信息',data)
          data.forEach(item1=>{
            item1.market.forEach(item2=>{
              if(item2.build_forms){
                let x = 0
                item2.build_forms.forEach(item3=>{
                  x += item3.area_sizes.length
                  //添加合计
                  if(item3.area_sizes.length>0){
                    let obj = { area_size:'合计', supply:0, volume:0 }
                    item3.area_sizes.forEach(item4=>{
                      obj.supply += item4.supply
                      obj.volume += item4.volume
                    })
                    item3.area_sizes.push(obj)
                  }
                })
                item2.show = x>0?true:false
              }else{ //办公商业公寓添加建筑形态
                item2.build_forms = []
                //添加合计
                let obj = { area_size:'合计', supply:0, volume:0 }
                item2.area_sizes.forEach(item5=>{
                  item2.build_forms.push(item5)
                  obj.supply += item5.supply
                  obj.volume += item5.volume
                })
                item2.build_forms.push(obj)
                item2.show = item2.area_sizes.length>0?true:false
              }
            })
          })
          that.cdqhData = data
        }
      })
    },
    
  },
};
</script>
<style lang="scss">
.cd_qh_wrap {
  width: 100%;
  height: 100%;
  z-index: 999;
  overflow-y: scroll;
  .head_wrap{
    display: flex;
    width: fit-content;
    border-right: #EBEEF5 1px solid;
    .table_head{
      width: 150px;
      text-align: center;
      height: 40px;
      line-height: 40px;
      border-top: #EBEEF5 1px solid;
      border-left: #EBEEF5 1px solid;
      background: #4a4a4a;
      color: #fff;
    }
  }
  .cd_box{
    border-right: #EBEEF5 1px solid;
    border-bottom: #EBEEF5 1px solid;
    width: fit-content;
    font-size: 14px;
    color: #606266;
    .cd_item{
      display: flex;
      .name{
        border-top: #EBEEF5 1px solid;
        border-left: #EBEEF5 1px solid;
        width: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
      }
      .proType_wrap{
        .proType_item{
          display: flex;
          .buildType_wrap{
            .buildType_item{
              display: flex;
              .areaSize_wrap{
                .areaSize_item{
                  display: flex;
                  .areaSize_name{
                    border-top: #EBEEF5 1px solid;
                    border-left: #EBEEF5 1px solid;
                    width: 150px;
                    height: 35px;
                    line-height: 35px;
                    text-align: center;
                    background: #fff;
                  }
                }
              }
            }
          }
        }
      }
      
    }
  }
}
</style>
