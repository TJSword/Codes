<template>
  <div class="box">
    <figure>
      <v-chart :option="bar" :loadingOptions="barLoadingOptions" :theme="theme" :autoresize="autoResize" />
    </figure>
    <figure>
      <v-chart :option="pie" :theme="theme" :autoresize="autoResize" />
    </figure>
    <figure>
      <v-chart :option="polar" :theme="theme" :autoresize="autoResize" />
    </figure>
  </div>
</template>

<script lang="ts">
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, LineChart, PieChart, MapChart, RadarChart, ScatterChart, EffectScatterChart, LinesChart } from "echarts/charts";
import { GridComponent, PolarComponent, GeoComponent, TooltipComponent, LegendComponent, TitleComponent, VisualMapComponent, DatasetComponent, ToolboxComponent, DataZoomComponent } from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, defineComponent } from "vue";

use([BarChart, LineChart, PieChart, MapChart, RadarChart, ScatterChart, EffectScatterChart, LinesChart, GridComponent, PolarComponent, GeoComponent, TooltipComponent, LegendComponent, TitleComponent, VisualMapComponent, DatasetComponent, CanvasRenderer, ToolboxComponent, DataZoomComponent]);
export default defineComponent({
  name: "Charts",
  components: {
    VChart
  },
  provide: {
    [THEME_KEY]: "westeros"
  },
  setup() {
    const random = () => {
      return Math.round(300 + Math.random() * 700) / 10;
    };
    const getPolarData = () => {
      const data = [];
      for (let i = 0; i <= 360; i++) {
        const t = (i / 180) * Math.PI;
        const r = Math.sin(2 * t) * Math.cos(2 * t);
        data.push([r, i]);
      }
      return data;
    };

    const pie = ref({
      title: {
        text: "Traffic Sources",
        left: "center"
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: "vertical",
        left: "left",
        data: ["Direct", "Email", "Ad Networks", "Video Ads", "Search Engines"]
      },
      series: [
        {
          name: "Traffic Sources",
          type: "pie",
          radius: "55%",
          center: ["50%", "60%"],
          data: [
            { value: 335, name: "Direct" },
            { value: 310, name: "Email" },
            { value: 234, name: "Ad Networks" },
            { value: 135, name: "Video Ads" },
            { value: 1548, name: "Search Engines" }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ]
    });
    const bar = ref({
      textStyle: {
        fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif'
      },
      dataset: {
        dimensions: ["Product", "2015", "2016", "2017"],
        source: [
          {
            Product: "Matcha Latte",
            2015: random(),
            2016: random(),
            2017: random()
          },
          {
            Product: "Milk Tea",
            2015: random(),
            2016: random(),
            2017: random()
          },
          {
            Product: "Cheese Cocoa",
            2015: random(),
            2016: random(),
            2017: random()
          },
          {
            Product: "Walnut Brownie",
            2015: random(),
            2016: random(),
            2017: random()
          }
        ]
      },
      xAxis: { type: "category" },
      yAxis: {},
      // Declare several bar series, each will be mapped
      // to a column of dataset.source by default.
      series: [{ type: "bar" }, { type: "bar" }, { type: "bar" }]
    });
    const polar = ref({
      textStyle: {
        fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif'
      },
      title: {
        text: "Dual Numeric Axis"
      },
      legend: {
        data: ["line"]
      },
      polar: {
        center: ["50%", "54%"]
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross"
        }
      },
      angleAxis: {
        type: "value",
        startAngle: 0
      },
      radiusAxis: {
        min: 0
      },
      series: [
        {
          coordinateSystem: "polar",
          name: "line",
          type: "line",
          showSymbol: false,
          data: getPolarData()
        }
      ],
      animationDuration: 2000
    });
    return {
      pie,
      bar,
      polar,
      barLoadingOptions: {
        text: "Loading…",
        color: "#4ea397",
        maskColor: "rgba(255, 255, 255, 0.4)"
      },
      theme: "",
      autoResize: true
    };
  }
});
</script>

<style lang="less" scoped>
.box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  figure {
    display: inline-block;
    position: relative;
    margin: 2em auto;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    box-shadow: 0 0 45px rgba(0, 0, 0, 0.2);
    padding: 30px;

    .echarts {
      width: 40vw;
      min-width: 400px;
      height: 300px;
    }
  }
}
</style>
