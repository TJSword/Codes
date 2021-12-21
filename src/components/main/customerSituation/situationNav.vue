<template>
    <div class="citymap_home">
        <div class="side_bar">
            <el-tabs class="cm_tab" v-model="curCitymap" @tab-click="changeCmTab">
                <el-tab-pane label="区域客情" name="area">
                   <areaSituation v-if="curCitymap==='area'" />
                </el-tab-pane>
                <el-tab-pane label="竞品客情" name="goods">
                  <goodSituation v-if="curCitymap ==='goods'" />
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex" 
import areaSituation from "./areaSituation.vue"
import goodSituation from "./goodSituation.vue"
export default {
    name:'citymap_home',
    components:{
      areaSituation,goodSituation
    },
    data(){
        return {
            curCitymap:'area',
            radio:'1',
        }
    },
    mounted(){
      
    },
    watch:{
      // situationMap(map){
      //   this.map = map
      //   map.on('click','plate_fill',e=>{
      //     console.log(e.features[0].properties)
      //   })
      //   map.setPaintProperty('plate_fill',"fill-color", ["match", ["get", "id"],
      //   '510105','#91D3E7','510181','#91D3E7',
      //   '510182','#B7E195','510184','#E8F330',
      //   '510183','#FFB400','510112','#FFB400',
      //   '510185','#FF6B01','510156','#FF4C01',
      //   '510129','#B7E195','510131','#FF4C01',
      //   '510117','#B7E195','510114','#E8F330',
      //   '510121','#FFB400','510199','#FFB400',
      //   '510116','#B7E195','510115','#E8F330',
      //   '510113','#FFB400','510108','#FFB400',
      //   '510118','#B7E195','510107','#E8F330',
      //   '510106','#FFB400','510104','#FFB400',
      //   '510102','#FFB400',
      //   '#3a587d'])
      //   this.popupClick = new this.mbgl.Popup({
      //     offset:15,
      //     anchor:'left',
      //     closeButton:true,
      //     closeOnClick:false
      //   })
      // }
    },
    computed:{
        ...mapGetters(['situationMap'])
    },
    methods:{
      changeCmTab(val){
        let map = this.situationMap
        if(val.index == '0'){
         
          map.setLayoutProperty('plate_fill','visibility','visible')
          map.setLayoutProperty('plate_line','visibility','visible')
          map.setLayoutProperty('plate_labels','visibility','visible')
          map.setLayoutProperty('plates_fill','visibility','none')
          map.setLayoutProperty('plates_line','visibility','none')
          map.setLayoutProperty('plates_labels','visibility','none')
          if(map.getLayer('buildingsLayer')) map.setLayoutProperty('buildingsLayer','visibility','none')
          if(map.getLayer('raceBuildingsLayer')) map.setLayoutProperty('raceBuildingsLayer','visibility','none')
          if(map.getLayer('raceBuildingsSymbol'))map.setLayoutProperty('raceBuildingsSymbol','visibility','none')
        }else if(val.index == '1'){
          
          map.setLayoutProperty('plate_fill','visibility','none')
          map.setLayoutProperty('plate_line','visibility','none')
          map.setLayoutProperty('plate_labels','visibility','none')
          map.setLayoutProperty('plates_fill','visibility','none')
          map.setLayoutProperty('plates_line','visibility','none')
          map.setLayoutProperty('plates_labels','visibility','none')
          if(map.getLayer('buildingsLayer')) map.setLayoutProperty('buildingsLayer','visibility','visible')
          if(map.getLayer('raceBuildingsLayer')) map.setLayoutProperty('raceBuildingsLayer','visibility','none')
          if(map.getLayer('raceBuildingsSymbol'))map.setLayoutProperty('raceBuildingsSymbol','visibility','none')
        }
      },
      kequChange(val){
      console.log(val)
      let random4 = parseInt(Math.random() * 4 )
      let random2 = parseInt(Math.random() * 2 )
      this.kqnl = [this.ages[random4].value]
      this.kqxb = [this.genders[random2].value]
      this.cpmj = [this.areas[random4].value]
      this.cptx = [this.dwellings[random4].value]
      function randomColor(){
        let arr = ["match", ["get", "id"]]
        let colors = ['#91D3E7','#B7E195','#E8F330','#FFB400','#FF6B01','#FF4C01']
        let regions = [510105,510181,510182,510184,510183,510112,510185,510156,510129,
        510131,510117,510114,510121,510199,510116,510115,510113,510108,510118,510107,510106,510104,510102]
        regions.forEach(item=>{
          let random = parseInt(Math.random() * 6)
          arr.push(item)
          arr.push(colors[random])
        })
        arr.push('#3a587d')
        return arr
      }
      this.situationMap.setPaintProperty('plate_fill',"fill-color", randomColor())
      var htmlInfo = `<div class="house_infoWrap">
                  <div class="info_content">
                  <div class="info_head">${val} 潜在客群画像描摹</div>
                    <div class="info">潜在客群数量：<span class="val">333（8%）</span></div>
                    <div class="info_title">潜在客群画像描摹</div>
                    
                    <div class="table_box">
                       <div class="table_title">年龄</div>
                       <div class="content_box">
                          <div class="item">
                            <div class="item_label">20-25岁</div>
                            <div class="item_value">22%</div>
                          </div>
                          <div class="item">
                            <div class="item_label">26-30岁</div>
                            <div class="item_value">33%</div>
                          </div>
                          <div class="item">
                            <div class="item_label">30-35岁</div>
                            <div class="item_value">44%</div>
                          </div>
                          <div class="item">
                            <div class="item_label">...</div>
                            <div class="item_value">...</div>
                          </div>
                       </div>
                    </div>
                    <div class="info_title">潜在客群产品关注</div>
                    <div class="table_box">
                       <div class="table_title">面积段</div>
                       <div class="content_box">
                          <div class="item">
                            <div class="item_label">80-90㎡</div>
                            <div class="item_value">22%</div>
                          </div>
                          <div class="item">
                            <div class="item_label">91-100㎡</div>
                            <div class="item_value">33%</div>
                          </div>
                          <div class="item">
                            <div class="item_label">101-110㎡</div>
                            <div class="item_value">44%</div>
                          </div>
                          <div class="item">
                            <div class="item_label">...</div>
                            <div class="item_value">...</div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>`
      this.popupClick.setLngLat([103.6277821803493,30.974313861293155]).setHTML(htmlInfo).addTo(this.situationMap);
    },
    currentMenu(i){
      this.activeIndex = i;
      this.situationMap.setLayoutProperty('circle','visibility','none')
    },
    handleSelect(item) {
        console.log(item);
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      cb(results);
    },
    showDetail(){
      this.situationMap.flyTo({
        center:[103.6277821803493,30.974313861293155],
        zoom: 10,
        speed: 0.8,
      })
       var htmlInfo = `<div class="house_infoWrap">
                  <div class="info_content">
                  <div class="info_head">都江堰市 潜在客群画像描摹</div>
                    <div class="info">潜在客群数量：<span class="val">333（8%）</span></div>
                    <div class="info_title">潜在客群画像描摹</div>
                    
                    <div class="table_box">
                       <div class="table_title">年龄</div>
                       <div class="content_box">
                          <div class="item">
                            <div class="item_label">20-25岁</div>
                            <div class="item_value">22%</div>
                          </div>
                          <div class="item">
                            <div class="item_label">26-30岁</div>
                            <div class="item_value">33%</div>
                          </div>
                          <div class="item">
                            <div class="item_label">30-35岁</div>
                            <div class="item_value">44%</div>
                          </div>
                          <div class="item">
                            <div class="item_label">...</div>
                            <div class="item_value">...</div>
                          </div>
                       </div>
                    </div>
                    <div class="info_title">潜在客群产品关注</div>
                    <div class="table_box">
                       <div class="table_title">面积段</div>
                       <div class="content_box">
                          <div class="item">
                            <div class="item_label">80-90㎡</div>
                            <div class="item_value">22%</div>
                          </div>
                          <div class="item">
                            <div class="item_label">91-100㎡</div>
                            <div class="item_value">33%</div>
                          </div>
                          <div class="item">
                            <div class="item_label">101-110㎡</div>
                            <div class="item_value">44%</div>
                          </div>
                          <div class="item">
                            <div class="item_label">...</div>
                            <div class="item_value">...</div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>`
      this.popupClick.setLngLat([103.6277821803493,30.974313861293155]).setHTML(htmlInfo).addTo(this.situationMap);
    }
    }
}
</script>
<style lang="scss">
.citymap_home{
    .side_bar{
        position: fixed;
        top: 0;
        left: 80px;
        bottom: 0;
        width: 300px;
        z-index: 99999;
        background: rgba(0,0,0,0.5);
        .cm_tab{
            padding: 10px 10px;
            .el-tabs__nav-wrap::after{
                background: linear-gradient(90deg, rgba(0,188,212,0.71), rgba(33,150,243,0.76));
            }
            .el-tabs__active-bar{
                background-color: #ffc107;
            }
            .el-tabs__item{
                color: #c0c4cc;
            }
            .el-tabs__item.is-active {
                font-weight: bold;
                font-size: 18px;
                color: #ffc107;
            }
        }
        
    }
  .quyu_box{
    height: 100%;
    width: 100%;
    .radio_box{
      width: 100%;
      display: flex;
      justify-content: space-around;
      height: 30px;
      margin-top:20px;
      .el-radio__input.is-checked+.el-radio__label{
         color:rgba(255, 193, 7, 1)
      }
      .el-radio{
         color:white;
      }
    }
    .quyu_table{
      height: 100%;
      font-size: 14px;
      color:white;
      .t_item{
        margin-left:30px;
        margin-top: 30px;
        cursor: pointer;
        user-select: none;
      }
    }
  }
  .kequ_box{
    height: 100%;
    width: 100%;
    padding-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .tz_box{
      width: 100%;
      margin-top: 30px;
      position: relative;
      .title{
        margin-left: 20px;
        font-size: 14px;
        color: rgba(255,255,255,0.7);
      }
      .el-select{
        margin-top:20px;
        margin-left: calc(50% - 110px);
      }
    }
    .btn{
        width: 90px;
        height: 36px;
        background: rgba(42, 130, 228, 1);
        bottom:0 4px;
        line-height: 36px;
        text-align: center;
        border-radius: 8px;
        cursor: pointer;
        user-select: none;
        margin-top:400px;
        color:white;
        &:active{
          opacity: 0.7;
        }
    }
  }
  // .jingpin_box{
  //   height: 100%;
  //   width: 100%;
  //   display: flex;
  //   flex-direction: column;
  //   align-items: center;
  //   padding-top: 20px;
  //   .table{
  //     margin-top:28px;
  //     width: 85%;
  //     height: 700px;
  //     color:white;
  //     .table_item{
  //       display: flex;
  //       font-size: 14px;
  //       margin-bottom: 30px;
  //       .name{
  //         width:70%;
  //       }
  //       .editor{
  //         width: 15%;
  //         text-align: center;
  //         color:rgba(42, 130, 228, 1);
  //       }
  //       .delete{
  //         width: 15%;
  //         text-align: center;
  //         color:rgba(42, 130, 228, 1);
  //       }
  //     }
  //   }
  //   .btn{
  //       width: 120px;
  //       height: 36px;
  //       background: rgba(42, 130, 228, 1);
  //       line-height: 36px;
  //       text-align: center;
  //       border-radius: 8px;
  //       cursor: pointer;
  //       user-select: none;
  //       color:white;
  //       &:active{
  //         opacity: 0.7;
  //       }
  //   }
  // }
  .el-pagination{
    margin-top: 40px;
  }
  .el-pagination button:disabled,.el-pagination .btn-next, .el-pagination .btn-prev {
      background: transparent!important;
    }
    .el-pagination .btn-next, .el-pagination .btn-prev{
      background: transparent!important;
       color:white;
    }
    .el-pager li{
       background: transparent!important;
       color:white;
    }
    .el-pager .active{
      color:rgba(255, 193, 7, 1)
    }
}
</style>