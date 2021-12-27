<template>
    <div class="sale_wrap">
        <div class="header">
            <div class="options_box">
                <div class="option_item" v-for="(item,index) in 5" :key="index">全部</div>
            </div>
            <div class="line"></div>
        </div>
        <div class="mian">
            <div class="leftbox">
                <el-timeline>
                    <el-timeline-item timestamp="2018/4/12" placement="top">
                    <el-card>
                        <h4>更新 Github 模板</h4>
                        <p>王小虎 提交于 2018/4/12 20:46</p>
                    </el-card>
                    </el-timeline-item>
                    <el-timeline-item timestamp="2018/4/3" placement="top">
                    <el-card>
                        <h4>更新 Github 模板</h4>
                        <p>王小虎 提交于 2018/4/3 20:46</p>
                    </el-card>
                    </el-timeline-item>
                    <el-timeline-item timestamp="2018/4/2" placement="top">
                    <el-card>
                        <h4>更新 Github 模板</h4>
                        <p>王小虎 提交于 2018/4/2 20:46</p>
                    </el-card>
                    </el-timeline-item>
                    <el-timeline-item timestamp="2018/4/12" placement="top">
                    <el-card>
                        <h4>更新 Github 模板</h4>
                        <p>王小虎 提交于 2018/4/12 20:46</p>
                    </el-card>
                    </el-timeline-item>
                    <el-timeline-item timestamp="2018/4/12" placement="top">
                    <el-card>
                        <h4>更新 Github 模板</h4>
                        <p>王小虎 提交于 2018/4/12 20:46</p>
                    </el-card>
                    </el-timeline-item>
                    <el-timeline-item timestamp="2018/4/12" placement="top">
                    <el-card>
                        <h4>更新 Github 模板</h4>
                        <p>王小虎 提交于 2018/4/12 20:46</p>
                    </el-card>
                    </el-timeline-item>
                    <el-timeline-item timestamp="2018/4/12" placement="top">
                    <el-card>
                        <h4>更新 Github 模板</h4>
                        <p>王小虎 提交于 2018/4/12 20:46</p>
                    </el-card>
                    </el-timeline-item>
                    <el-timeline-item timestamp="2018/4/12" placement="top">
                    <el-card>
                        <h4>更新 Github 模板</h4>
                        <p>王小虎 提交于 2018/4/12 20:46</p>
                    </el-card>
                    </el-timeline-item>
                </el-timeline>
            </div>
            <div class="right_box">
                <div class="map">地图<br/>(周围竞品poi点 点击跳转竞品详情)</div>
                <div class="CompetinGoods_box">
                    <div class="title">相关竞品案例</div>
                    <div class="line"></div>
                    <el-table
                        :data="tableData"
                        stripe
                        style="width: 100%">
                        <el-table-column
                        prop="name"
                        label="案例名称"
                        min-width="120"
                       >
                        </el-table-column>
                        <el-table-column
                        prop="region"
                        label="区县"
                        mwidth="90"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="building_type"
                        label="建筑形态"
                        min-width="100"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="price"
                        label="价格"
                        >
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'sale',
    data(){
        return{
            tableData: [{
                name:'伟信·青岛小镇',
                region:'平度市',
                building_type:"小高层",
                price:"4300"
            },{
                name:'和达智慧生态城11111',
                region:'城阳',
                building_type:"小高层",
                price:"14000"
            },{
                name:'鑫江花漾里',
                region:'城阳',
                building_type:"高层、小高层",
                price:"14000"
            },{
                name:'伟信·青岛小镇',
                region:'平度市',
                building_type:"小高层",
                price:"4300"
            },{
                name:'和达智慧生态城11111',
                region:'城阳',
                building_type:"小高层",
                price:"14000"
            },{
                name:'鑫江花漾里',
                region:'城阳',
                building_type:"高层、小高层",
                price:"14000"
            },{
                name:'伟信·青岛小镇',
                region:'平度市',
                building_type:"小高层",
                price:"4300"
            },{
                name:'和达智慧生态城11111',
                region:'城阳',
                building_type:"小高层",
                price:"14000"
            },{
                name:'鑫江花漾里',
                region:'城阳',
                building_type:"高层、小高层",
                price:"14000"
            }]
        }
    }
}
</script>
<style lang="scss" scoped>
    .sale_wrap{
        padding:20px 0;
        .header{
            .options_box{
                display: flex;
                .option_item{
                    font-size:15px;
                    margin-right:100px;
                }
            }
            .line{
                width:100%;
                height:1px;
                background:rgba(0,0,0,0.17);
                margin-top:20px;
            }
        }
        .mian{
            padding:30px 0;
            display: flex;
            .leftbox{
               width:50%;
           }
           .right_box{
               margin-left:10%;
               width:40%;
               .map{
                   height:300px;
                   width:100%;
                   border:1px solid black;
                   display: flex;
                   justify-content: center;
                   align-items: center;
                   font-size:30px;
                   text-align: center;
               }
               .CompetinGoods_box{
                   margin-top:50px;
                   border:1px solid rgba(0,0,0,0.17);
                   padding:0 20px;
                   .title{
                       font-size:16px;
                       margin-top:20px;
                   }
                   .line{
                       height:1px;
                       background: rgba(0,0,0,0.17);
                       width:100%;
                       margin-top:14px;
                   }
               }
           }
        }
        
    }
</style>