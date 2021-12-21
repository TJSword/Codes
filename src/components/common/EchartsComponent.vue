<template>
  <div class="echartsBox_wrap">
    <div class="w_head">
      <span class="headText">{{ chartData.title+categoryID }}</span>
      <div class="yearBox">
        <div class="yearBegin">
          <el-date-picker
            v-model="yearBegin"
            type="year"
            size="mini"
            format=""
            class="year"
            placeholder="开始年份"
            align="center"
          >
          </el-date-picker>
        </div>
        <span style="color:white;padding: 0 8px;float:left;font-size:12px;"
          >至</span
        >
        <div class="yearEnd">
          <el-date-picker
            v-model="yearEnd"
            type="year"
            placeholder="结束年份"
            size="mini"
            format=""
            class="year"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="month" v-if="true   ">
        <el-date-picker
          v-model="month"
          type="monthrange"
          range-separator="至"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
          size="mini"
          format=""
        >
        </el-date-picker>
      </div>

      <span class="headText" style="float:right;margin-right:10px;"
        >平均值 {{ chartData.sum }}</span
      >
      <span class="headText" style="float:right;margin-right:10px;"
        >总和 {{ chartData.average }}</span
      >
    </div>
    <div
      :id="echartsID"
      class="w_chart"
      ref="echarts"
      style="width: 100%;"
    ></div>
  </div>
</template>

<script>
// 引入echarts
import echarts from "echarts";
import { mapGetters } from "vuex";
export default {
  name: "EchartsComponent",
  props: {
    // 接收父组件传递过来的信息
    categoryID: {
      type: String, //要生柱状图的类别的ID
      default: () => []
    }
  },
  data() {
    return {
      yearBegin: "",
      yearEnd: "",
      month: "",
      chartData:{
        title:"分类",
        xData:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
        yData:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
        sum:722,
        average:240
      },
      myChart:null
    };
  },
  computed: {
    ...mapGetters(["classBoxFlag","cardFlag"]),
    echartsID() {
      return "echarts" + Math.random() * 100000;
    }
  },
  watch:{
    classBoxFlag:{
      handler(){
        setTimeout(()=>{
          this.myChart.resize()
        },300)
        
      },
      deep:true
    },
    cardFlag:{
      handler(newVal){
        if(newVal){
          this.myChart.resize()
        }
      },
      deep:true
    }
  },
  methods: {
    drawChart() {
      const that = this;
      let myChart = echarts.init(document.getElementById(this.echartsID));
      let option = {
        // title: {
        //   text: that.chartData.title,
        //   left: "left"
        // },
        //backgroundColor: "#05224d",
        tooltip: {},
        grid: {
          top: "10%",
          left: "1%",
          right: "1%",
          bottom: "6%",
          containLabel: true
        },
        toolbox: {
          show: true,
          //orient: 'vertical',
          left: 'right',
          top: 'top',
          feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar']},
              //restore: {show: true},
              saveAsImage: {show: true}
          }
        },
        // legend: {
        //   itemGap: 50,
        //   data: [that.chartData.title],
        //   textStyle: {
        //     color: "#f9f9f9",
        //     borderColor: "#fff"
        //   }
        // },
        xAxis: [
          {
            type: "category",
            color: "#59588D",
            boundaryGap: true,
            axisLabel: {
              margin: 20,
              color: "#999",
              textStyle: {
                fontSize: 12
              }
            },
            axisLine: {
              lineStyle: {
                color: "rgba(107,107,107,0.37)"
              }
            },
            axisTick: {
              show: false
            },
            data: that.chartData.xData
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              formatter: "{value}",
              color: "#999",
              textStyle: {
                fontSize: 12
              }
            },
            axisLine: {
              lineStyle: {
                color: "rgba(107,107,107,0.37)"
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: "rgba(131,101,101,0.2)",
                type: "dashed"
              }
            }
          }
        ],
        series: [
          {
            name: that.chartData.title,
            type: "bar",
            barWidth: "20px",
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "#FF9A22" // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#FFD56E" // 100% 处的颜色
                    }
                  ],
                  false
                ),
                barBorderRadius: [2, 2, 0, 0]
              }
            },
            label: {
              normal: {
                show: true,
                fontSize: 12,
                fontWeight: "bold",
                color: "#bbb",
                position: "top"
              }
            },
            data: that.chartData.yData
          }
        ]
      };
      // 清除画布
      myChart.clear();
      myChart.setOption(option);
      this.myChart = myChart
      window.addEventListener("resize", myChart.resize);
      // 在渲染点击事件之前先清除点击事件
      myChart.off("click");
      
    }
  },
  
  mounted() {
    const that = this;
    that.$nextTick(() => {
      //console.log(that.chartData);
      that.drawChart();
      this.myChart.resize()
    });
  },
  created: () => {}
};
</script>

<style lang="scss">
.echartsBox_wrap {
  height: 100%;
  width: 100%;
  overflow: hidden;
  .w_chart {
    z-index: 1;
    width: 100%;
    height: 85%;
  }
  .w_head{
    display: flex;
    justify-content: space-between;
    height: 15%;
    .headText {
      color: white;
      margin-top: 10px;
      font-size: 14px;
      height: 32px;
      line-height: 32px;
      margin-left: 10px;
    }
    .yearBox {
      display: flex;
      width: 280px;
      align-items: center;
      background: rgb(31, 31, 31) !important;
      margin-top: 10px;
      float: left;
      margin-left: 20px;
      border: 1px solid #64666b;
      border-radius: 4px;
      height: 28px;
    }
    .year {
      width: 110px !important;
      float: left;
      margin-left: 12px;
    }
    .month {
      margin-top: 10px;
      margin-left: 20px;
      /* background: rgba(129, 127, 127, 0.144)!important; */
    }
    
    .el-range-editor--mini.el-input__inner {
      background: rgb(31, 31, 31) !important;
    }
    .el-range-editor--mini .el-range-input,
    .el-input--mini .el-input__inner {
      background: rgb(31, 31, 31) !important;
    }
    .el-range-editor--mini .el-range-separator {
      color: white;
    }
    .el-range-editor--mini .el-range-input,
    .el-input--mini .el-input__inner {
      border: 0;
    }
    .el-range-editor--mini.el-input__inner {
      height: 30px !important;
      border: 1px solid #64666b;
    }
  }
  
}


</style>
