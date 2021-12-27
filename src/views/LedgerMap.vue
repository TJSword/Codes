<template>
  <div class="ledger_map">
    <div class="left">
      <Ledger />
    </div>
    <div class="right">
      <MapComponent mapType="ledgerMap" />
    </div>
    
  </div>
</template>
<script>
//Api
import ledgerApi from "@/api/ledgerApi";
import { mapGetters } from "vuex";
//组件
import MapComponent from "@/components/common/MapComponent";
import Ledger from "@/components/main/ledgermap/ledger";
export default {
  name: "ledger_map",
  props: {},
  components: {
    MapComponent,
    Ledger,
  },
  data() {
    return {};
  },
  mounted() {
    setTimeout(()=>{
      this.ledgerMapEvents()
      //this.mapSetLedgerLayer()
    },500)
  },
  watch:{
      addLedgerInfo:{
        handler(newVal){
            if(newVal.isAdd){
                console.log(newVal)
                this.selectLedgerPoint()
            }
        },
        deep:true
    }
  },
  computed: {
    ...mapGetters(["ledger_map","addLedgerInfo"]),
  },
  methods: {
    //台账图层事件
    ledgerMapEvents(){
        let map = this.ledger_map;
        //台账地图点击事件
        map.on("click",e=>{
            if(this.addLedgerInfo.isAdd){ //添加台账点
                this.getGaodeAdress(e.lngLat.lng,e.lngLat.lat)
                var geojson = {
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [e.lngLat.lng, e.lngLat.lat]
                        },
                        "properties": {
                            "name": this.addLedgerInfo.name?this.addLedgerInfo.name:"未命名"
                        }
                    }]
                }
                map.getSource('ledgerAddLayer').setData(geojson)
            }
        })
    },
    //地图上新增台账点选择
    selectLedgerPoint() {
      var map = this.ledger_map;
      map.getCanvas().style.cursor = "crosshair";
    },
    getGaodeAdress(lng, lat) {
      //高德地图坐标反查API
      this.$.ajax({
        type: "get",
        url: "https://restapi.amap.com/v3/geocode/regeo",
        cache: false,
        dataType: "json",
        data: {
          key: "d222a0cc9d49fe7a60ab4b123a20c34a",
          location: lng + "," + lat,
          poitype: "",
          radius: 200,
          extensions: "all",
          batch: false,
          roadlevel: 0,
        },
        success: (data) => {
          console.log(data);
          if (data && data.status === "1") {
            let address = data.regeocode.addressComponent;
            //this.areaInfo.belongArea = address.city+address.district //行政区
            let pointAddress =
              address.city +
              address.district +
              address.township +
              address.streetNumber.street +
              address.streetNumber.number; //详细地址
            let obj = {
              isAdd: false,
              name: "",
              laglng: [lng, lat],
              address: pointAddress,
            };
            this.$store.dispatch("setLedgerInfo", obj);
          } else {
            this.$message("未获取到改位置地址");
            let obj = {
              isAdd: false,
              name: "",
              laglng: [lng, lat],
              address: "",
            };
            this.$store.dispatch("setLedgerInfo", obj);
          }
        },
      });
    },
  },
};
</script>
<style lang="scss">
.ledger_map {
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  bottom: 0px;
  display: flex;
  background: #0c1015;
  justify-content: space-between;
  .left {
    width: 43.9%;
    height: 100%;
  }
  .right {
    width: 56%;
    height: 100%;
    border-left: #383838 1px solid;
  }
}
</style>
