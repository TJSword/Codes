<template>
    <div class="citymap_home">
        <div class="side_bar">
            <el-tabs class="cm_tab" v-model="curCitymap" @tab-click="changeCmTab">
               <el-tab-pane label="统计中心" name="houseStatisitcs">
                   <HouseStatistics v-if="curCitymap === 'houseStatisitcs'" />
                </el-tab-pane>
                <el-tab-pane label="项目查询" name="houseQuery">
                   <HouseQuery v-if="curCitymap === 'houseQuery'" />
                </el-tab-pane>
                <el-tab-pane label="分析透视" name="dataPerspective">
                   <DataPerspective  v-if="curCitymap === 'dataPerspective'" />
                </el-tab-pane>
                <!-- <el-tab-pane label="房产排行" name="houseRank">
                   <HouseRank v-if="curCitymap === 'houseRank'" />
                </el-tab-pane> -->
            </el-tabs>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import HouseStatistics from "./houseStatistics.vue"
import DataPerspective from "./DataPerspective.vue"
// import HouseRank from "./HouseRank.vue"
import HouseQuery from "./houseQuery.vue"
export default {
    name:'citymap_home',
    components:{
      HouseStatistics,DataPerspective,HouseQuery
    },
    data(){
        return {
          curCitymap:'houseStatisitcs',
        }
    },
    computed:{
        ...mapGetters(['houseDataMap'])
    },
    watch:{
      
    },
    methods:{
      changeCmTab(val){
        let map = this.houseDataMap
        // if(val.index == '1'){
        //   map.setLayoutProperty('houseAllPoint','visibility','visible')
        //   // map.setLayoutProperty('plates_fill','visibility','visible')
        //   // map.setLayoutProperty('plates_line','visibility','visible')
        //   // map.setLayoutProperty('plates_labels','visibility','visible')
        //   map.setLayoutProperty('house_point','visibility','visible')
        // }else{
        //   map.setLayoutProperty('houseAllPoint','visibility','none')
        //   // map.setLayoutProperty('plates_fill','visibility','none')
        //   // map.setLayoutProperty('plates_line','visibility','none')
        //   // map.setLayoutProperty('plates_labels','visibility','none')
        //   map.setLayoutProperty('house_point','visibility','none')
        // }
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
        background: rgba(0,0,0,0.8);
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
  .jingpin_box{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;
    .table{
      margin-top:28px;
      width: 85%;
      height: 700px;
      color:white;
      .table_item{
        display: flex;
        font-size: 14px;
        margin-bottom: 30px;
        .name{
          width:70%;
        }
        .editor{
          width: 15%;
          text-align: center;
          color:rgba(42, 130, 228, 1);
        }
        .delete{
          width: 15%;
          text-align: center;
          color:rgba(42, 130, 228, 1);
        }
      }
    }
    .btn{
        width: 120px;
        height: 36px;
        background: rgba(42, 130, 228, 1);
        line-height: 36px;
        text-align: center;
        border-radius: 8px;
        cursor: pointer;
        user-select: none;
        color:white;
        &:active{
          opacity: 0.7;
        }
    }
  }
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
   .el-table__body-wrapper{
        &::-webkit-scrollbar{
        background-color: #212e3e !important;
        opacity: 1!important;
        height:10px;
        width: 0px;
      }
      &::-webkit-scrollbar-thumb {
          /*滚动条里面小方块*/
          border-radius: 10px;
          background-color: #02adf7;
          background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);
      }
    }
   .el-table__row{
      background: transparent;
    }
   .el-table tr{
      background-color: transparent!important;
    }
   .el-table th{
      background-color: transparent!important;
    }
   .el-table__row>td{
      
    }
   .el-table::before {
      height: 0px;
    }
  //  .is-leaf{
  //     color:white;
  //   }
   .el-table--enable-row-hover .el-table__body tr:hover>td{
    // background-color: #212e3e !important;
    }
    .query_btn{
      color:white;
      font-size:13px;
      height:36px;
      width:100px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #1e3c72;  /* fallback for old browsers */
      background: -webkit-linear-gradient(to right, #2a5298, #1e3c72);  /* Chrome 10-25, Safari 5.1-6 */
      background: linear-gradient(to right, #2a5298, #1e3c72); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
      border-radius: 4px;
      user-select: none;
      cursor: pointer;
      margin-top: 10px;
      margin-left: 150px;
      &:active{
            opacity: 0.7;
        }
    }
    .form_mask{
          transition: all .3s ease;
          opacity: 0;
          position: fixed;
          bottom:-60%;
          right:1.5%;
          width:55%;
          height:350px;
          background: rgba(47,62,70,.8);
          border-radius: 8px;
          overflow-y: scroll;
          
    }
    .form_mask_active{
        bottom:11%;
        transition: all .3s ease;
        opacity: 1;
    }
    .radius_box{
      position: fixed;  
      z-index: 6000;
      display: flex;
      align-items: center;
      transition: opacity 0.3s ease;
      .radius_input{
        width: 100px;
      }
  }
}
</style>