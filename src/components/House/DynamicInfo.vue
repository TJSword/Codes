<template>
  <div :class="['landDetail_wrap',ani?'landDetail_wrap_active':'']">
      <dv-border-box-12 :class="['detail_box',ani?'detail_box_acitve':'']">
          <i class="iconfont icon-guanbi" @click="close"></i>
           <div class="tab_box">
            <div :class="['tab',chooseIndex === index?'tab_active':'']" v-for="(item,index) in tabs" :key="index" @click="chooseTab(index)">{{item}}</div>
       </div>
       <div class="kp_box" v-if="this.chooseIndex === 0">
            <div class="table" v-for="(label,index) in tableData" :key="index">
                <div class="header">
                    <div class="title">{{label.type}}</div>
                    <div class="line"></div>
            </div>
            <div class="table_detail">
                <div class="table_item" v-for="(item,index) in label.arr" :key="index"> 
                    <div class="item_title">{{item.label}}</div>
                    <div class="item_value">{{item.value?item.value:'暂无'}}</div>
                </div>
                </div>
            </div>
       </div>
       <div class="kp_box" v-if="this.chooseIndex === 1">
            <div class="table" v-for="(label,index) in zjData" :key="index">
                <div class="header">
                    <div class="title">{{label.type}}</div>
                    <div class="line"></div>
            </div>
            <div class="table_detail">
                <div class="table_item" v-for="(item,index) in label.arr" :key="index"> 
                    <div class="item_title">{{item.label}}</div>
                    <div class="item_value">{{item.value?item.value:'暂无'}}</div>
                </div>
                </div>
            </div>
       </div>
       <div class="pic_box" v-if="this.chooseIndex === 2">
           <div class="pic_item" v-for="(item,index) in picArr" :key="index">
               <el-image :src="item" class="img" :preview-src-list="picArr"></el-image>
               <div class="title">{{'开盘现场' + (index+1)}}</div>
           </div>
       </div>
       <div class="file_box" v-if="this.chooseIndex === 3">
           <el-table
            :data="fileData"
            style="width: 96%;margin-left:2%;margin-top:1%;background: transparent;color:white"
            :cell-style="cellStyle"
            @cell-click="cellClick">
            <el-table-column
                prop="name"
                label="文件名">
            </el-table-column>
            <el-table-column
                prop="create_date"
                label="上传时间"
                width="180">
            </el-table-column>
            </el-table>
       </div>
      </dv-border-box-12>
  </div>
</template>

<script>
import House from "../../api/House"
import Map from "../common/map"
export default {
    components:{
        Map
    },
    props:['landId'],
    data(){
        return{
            ani:false,
            tabs:['开盘概况','住　宅','现场图片','附　件'],
            chooseIndex:0,
            tableData:[],
            zjData:[],
            fileData:[]
        }
    },
    methods:{
        close(){
           this.ani = false
           setTimeout(_=>{
               this.$parent.closeDetail()
           },300)
        }, 
        cellStyle(row, column, rowIndex, columnIndex){
            if(row.column.label === '文件名'){
              return  'color:#fcbf49;font-weight:700;cursor:pointer'
            }
        },
        cellClick(row, column, cell, event){
          if(column.label === '文件名' ){
              window.open(row.url)
          }
      },
        closeDynamicInfo(){
            this.$parent.closeDynamicInfo()
        },
        chooseTab(i){
            this.chooseIndex = i
        }
    },
    created(){
   House.getDynamicInfo(this.landId).then(res=>{
            console.log(res)
            let data = res.data.data.kpRst
            let zjData = res.data.data.houseRst[0]?res.data.data.houseRst[0]:{}
            let picData = res.data.data.picRst
            this.picArr = picData?picData.split(','):[]
            this.fileData = res.data.data.fileRst
            console.log(this.picArr)
             this.tableData = [{
                type:'基本信息',
                arr:[{
                    label:'动态标题',
                    value:data.title
                },{
                    label:'开盘地点',
                    value:data.address
                },{
                    label:'开盘时间',
                    value:data.presellDate
                },{
                    label:'物业类型',
                    value:data.propertyTypeLabel
                }]
            },{
                type:'现场信息',
                arr:[{
                    label:'蓄客起始时间',
                    value:data.storageDate
                },{
                    label:"蓄客量",
                    value:data.storageNum
                },{
                    label:'客户到访量',
                    value:data.cusVisitNum
                },{
                    label:'车辆到访量',
                    value:data.carVisitNum 
                },{
                    label:'开盘转化率',
                    value:data.rate
                },{
                    label:'开盘现场描述',
                    value:data.description
                }]
            },{
                type:'客群分析',
                arr:[{
                    label:'年龄段',
                    value:data.ageSize
                },{
                    label:'来源区域',
                    value:data.region
                },{
                    label:'购房用途',
                    value:data.purpose
                }]
            }]
            this.zjData = [{
                type:'基本信息',
                arr:[{
                    label:'期数/组团',
                    value:zjData.nper
                },{
                    label:'批次',
                    value:zjData.batch
                },{
                    label:'推售位置',
                    value:zjData.address
                },{
                    label:'楼层数',
                    value:zjData.floor
                },{
                    label:'梯户数',
                    value:zjData.eleDoor
                },{
                    label:'建筑形态',
                    value:zjData.buildFormLabel
                },{
                    label:'推售套数',
                    value:zjData.psaleNum
                },{
                    label:'主力面积区间',
                    value:zjData.areaSize
                },{
                    label:'优惠后均价',
                    value:zjData.avePrice
                },{
                    label:'装修状况',
                    value:zjData.decSituation
                },{
                    label:'精装标准',
                    value:zjData.standard
                },{
                    label:'销售套数',
                    value:zjData.saleNum
                },{
                    label:'销售备注',
                    value:zjData.remark
                },{
                    label:'交房时间',
                    value:zjData.deliDate
                }]
            },{
                type:'优惠措施',
                arr:[{
                    label:'其他优惠',
                    value:zjData.measures
                }]
            }]
        })
    },
    mounted(){
        setTimeout(_=>{
            this.ani = true
        },50)
    }
}
</script>
<style lang="scss" scoped>
.landDetail_wrap{
    position: absolute;
    top:0;
    left:0;
    height: 100%;
    width: 100%;
    background: #41454a00;
    z-index: 30;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
    .detail_box{
        height: 92%;
        width: 92%;
        background: rgba(47, 62, 70, 1);
        border-radius: 8px;
        position: relative;
        transform: scaleY(0.1);
        opacity: 0;
        transition:  all 0.3s  ease ;
        /deep/.dv-border-svg-container{
            z-index: 10;
        }
        .icon-guanbi{
            position: absolute;
            right: 22px;
            top:-18px;
            color:white;
            font-size:20px;
            z-index: 21;
            &:hover{
                transform: rotate(180deg);
                transition: all 0.3s ease;
            }
        }
    }
    .detail_box_acitve{
        transform: scaleY(1);
        opacity: 1;
        transition:  all 0.3s  ease ;
    }
}
.tab_box{
        height:36px;
        margin-top:40px;
        margin-left:40px;
        display: flex;
        align-items: center;
        border-radius: 4px;
        font-size:15px;
        color:white;
        .tab{
            padding: 0 15px;
            height:34px;
            line-height:34px;
            border:1px solid #f1faee;
            border-right: 0;
            cursor: pointer;
            width:61px;
            &:first-child{
                border-top-left-radius: 4px;
                border-bottom-left-radius: 4px;
            }
            &:last-child{
                border-right:1px solid #f1faee;
                border-top-right-radius: 4px;
                border-bottom-right-radius: 4px;
            }
        }
        .tab_active{
            color:white;
            background:rgba(33,158,188,.6);
        }
    }
    .kp_box{
        margin-top:30px;
        height:calc(100% - 120px);
        margin-left:3%;
        width:94%;
        color:white;
        .table{
        margin-top:20px;
        margin-bottom: 20px;
        width:100%;
        .header{
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            .title{
                font-size:20px;
                margin-left:10px;
                font-weight: 700;
            }
            .line{
                width:100%;
                height:1px;
                background: white;
                opacity: 0.6;
                margin-top:14px;
            }
        }
        .table_detail{
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            .table_item{
                display: flex;
                min-width:50%;
                font-size:16px;
                margin-top:20px;
                align-items: center;
                .item_title{
                    white-space: nowrap;
                    color:#fcbf49;
                    width:120px;
                    flex-shrink: 0;
                }
                &:first-child{
                    margin-top:20px;
                }
                .item_value{
                    min-width:60%;
                }
            }
        }
    }
    }
    .file_box{
        margin-top:30px;
        height:calc(100% - 120px);
        margin-left:3%;
        width:94%;
    }
    .pic_box{
        margin-top:30px;
        height:calc(100% - 120px);
        margin-left:3%;
        width:94%;
        display: flex;
        flex-wrap: wrap;;
        .pic_item{
            height:200px;
            width:200px;
            margin-right:40px;
            margin-bottom:40px;
            .img{
                height:150px;
                width:200px;
            }
            .title{
                width:200px;
                height: 50px;
                text-align: center;
            }
        }
    }
    /deep/.border-box-content{
        position: relative;
        z-index: 60;
    }
    /deep/.el-icon-circle-close{
        color:white;
    }
    /deep/.el-table__body-wrapper{
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
    /deep/.el-table__row{
      background: transparent;
    }
    /deep/.el-table tr{
      background-color: transparent!important;
    }
    /deep/.el-table th{
      background-color: transparent!important;
    }
    /deep/.el-table__row>td{
      border: none;
    }
    /deep/.el-table::before {
      height: 0px;
    }
    /deep/.is-leaf{
      color:white;
    }
    /deep/.el-table--enable-row-hover .el-table__body tr:hover>td{
    background-color: #212e3e !important;
    }
.landDetail_wrap_active{
    background: #41454a78;
    transition: all 0.3s ease;
}
</style>