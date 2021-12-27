<template>
  <div class="population_wrap">
    <Map mapType="population" />
  </div>
</template>
<script>
import Map from "@/components/common/MapComponent";
import { mapGetters } from "vuex";
export default {
  name: "",
  components: {
    Map,
  },
  data() {
    return {};
  },
  mounted() {
    setTimeout(() => {
      this.loadPopulationLayer();
    }, 1500);
  },
  computed: {
    ...mapGetters(["cityCode", "population_map"]),
  },
  methods: {
    loadPopulationLayer() {
      var that = this;
      var map = that.population_map;
      var code = that.cityCode;
      var workSpace_layer = "city_" + code + ":" + code + "_";
      var url_head =
        "http://47.104.165.136:8070/geoserver/gwc/service/tms/1.0.0/";
      var url_end = "@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf";
      //人口数据
      var population_layer =
        url_head + workSpace_layer + "population_2020" + url_end;

      var ddsColor = {
        property: "grid_code",
        type: "exponential",
        stops: [
          [0, "#eae49a"],
          [300, "#e3ce4f"],
          [600, "#f60"],
          [900, "#ec8353"],
          [1200, "#c88e9c"],
          [1500, "#b0517d"],
          [1800, "#375b97"],
        ],
      };
      map.addSource("population_resource", {
        type: "vector",
        scheme: "tms",
        tiles: [population_layer],
      });
      map.addLayer({
        id: "population_heat",
        type: "heatmap",
        source: "population_resource",
        "source-layer": code + "_population_2020",
        //maxzoom: 13,
        paint: {
          "heatmap-weight": [
            "interpolate",
            ["linear"],
            ["get", "grid_code"],
            0,0,
            8000,1
          ],
          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0,1,
            16,20
          ],
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,"rgba(33,102,172,0)",
            0.5,
            "#0089ff",
            0.65,
            "rgb(117,211,248)",
            0.7,
            "rgb(0, 255, 0)",
            0.9,
            "#ffea00",
            1,
            "red",
          ],
          "heatmap-radius": [
            "interpolate", ["linear"], ["zoom"], 
            0, 2, 
            11, 10,
            18, 30
            ],
          "heatmap-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            7,0.5,
            16,0.8
          ]
        },
      });
      // map.addLayer({
      //   id: "gaode_point",
      //   type: "circle",
      //   "source": "population_resource",
      //   "source-layer": code+"_370283_2020_rk",
      //   paint: {
      //     "circle-radius": 3,
      //     "circle-color": ddsColor,
      //   },
      //   layout: {
      //     visibility: "visible",
      //   },
      // });
      // map.addLayer({
      //   'id': 'wms-test-layer',
      //   'type': 'raster',
      //   'source': {
      //       'type': 'raster',
      //       'tiles': [
      //           "http://47.104.165.136:8070/geoserver/city_370200/wms?service=WMS&version=1.1.0&request=GetMap&layers=city_370200%3A370200_370283_2020_rk&bbox=1.33055548516722E7%2C4365717.58680667%2C1.33939610802569E7%2C4445497.29726884&width=768&height=693&srs=EPSG%3A3857&format=image/png&TRANSPARENT=TRUE"
      //       ],
      //       'tileSize': 256
      //   },
      //   'paint': {}
      // })
    },
  },
};
</script>
<style lang="scss">
.population_wrap {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
}
</style>
