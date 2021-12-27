<template>
  <div class="marketNewsMap_wrap">
    <Map @map='getMap'/>
     <div class="from_box">
        <el-form :inline="true" :model="formInline" size="small" style="text-align:start;">
            <el-form-item>
               <el-select v-model="formInlineType" placeholder="新闻类别"  multiple :collapse-tags="true" clearable>
                  <el-option :label="item.label" :value="item.value" v-for="item in typeArr" :key="item.regionno"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                   <el-input v-model="formInline.name" placeholder="关键字" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-date-picker type="date" placeholder="开始日期" v-model="formInline.startDate" style="width: 100%;" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
             <el-form-item>
                <el-date-picker type="date" placeholder="结束日期" v-model="formInline.endDate" style="width: 100%;" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <div class="query_btn" @click="getNewsList">查询</div>
            </el-form-item>
          </el-form>
      </div>
  </div>
</template>

<script>
import Map from "../../components/common/map"
import Market from "../../api/Market"
export default {
  components:{
    Map
  },
  data(){
    return{
      typeArr:[],
      formInlineType:[],
      formInline:{
          newsType:'news-map',
          type:'',
          name:'',
          startDate:'',
          endDate:'',
          page:1,
          limit:9999999
        },
    }
  },
  watch:{
    formInlineType(newVal){this.formInline.type = newVal.join(',')}
  },
  methods:{
    getMap(map){
      this.map = map
    },
    setPointLayer(data){
      let map = this.map
      let geojsonData = {
        type:'FeatureCollection',
        features:[]
      }
      data.forEach(item=>{
        let coordinate = item.coordinate.split(',')
        geojsonData.features.push({
          type:'Feature',
          geometry:{
            type:'Point',
            coordinates:coordinate
          },
          properties:{
            id:item.id,
            name:item.title,
            pointArr:item.coordinate.split(','),
            title:item.title,
            label:item.label,
            content:item.content,
            newDate:item.newDate
          }
        })
      })
      let newsSource = map.getSource('newsSource')
      if(newsSource==undefined){
        map.addSource('newsSource',{
          type:'geojson',
          data:{
            type:'FeatureCollection',
            features:[]
          }
        })
        map.addLayer({
          id:'newsLayer',
          type:'circle',
          source:'newsSource',
          paint: {
            'circle-color': '#fcbf49',
             "circle-radius": 5,
            'circle-stroke-width': 0.2,
            'circle-stroke-color': 'white'
          }
        })
        let popup = new this.mbgl.Popup({
          offset:15,
          anchor:'left',
          closeButton:false,
          closeOnClick:false
        })
        this.popupClick = new this.mbgl.Popup({
          offset:15,
          anchor:'left',
          closeButton:true,
          closeOnClick:true
        })
        map.on('mousemove','newsLayer',e=>{
          map.getCanvas().style.cursor = 'pointer'
          let coordinates = [e.lngLat.lng, e.lngLat.lat];
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          var name = e.features[0].properties.name;
          var htmlInfo = `<P class="item_head">${name}</p>`
          popup.setLngLat(coordinates).setHTML(htmlInfo).addTo(map);
        })
        map.on('mouseleave','newsLayer',e=>{
          popup.remove()
          map.getCanvas().style.cursor = 'default'
        })
        map.on('click','newsLayer',e=>{
          let pointArr = e.features[0].properties.pointArr
          // this.setPointLayer(eval(pointArr))
          let coordinates = [e.lngLat.lng, e.lngLat.lat];
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
          let data = e.features[0].properties
          console.log(data)
            var htmlInfo = `<div class="land_infoWrap">
         <svg width="500" height="535" class="dv-border-svg-container"><defs><filter id="borderr-box-12-filterId-be465f2d87894d4bb829f791ed3667bc" height="150%" width="150%" x="-25%" y="-25%"><feMorphology operator="dilate" radius="1" in="SourceAlpha" result="thicken"></feMorphology><feGaussianBlur in="thicken" stdDeviation="2" result="blurred"></feGaussianBlur><feFlood flood-color="rgba(124,231,253,0.7)" result="glowColor"><animate attributeName="flood-color" values="
              rgba(124,231,253,0.7);
              rgba(124,231,253,0.3);
              rgba(124,231,253,0.7);
            " dur="3s" begin="0s" repeatCount="indefinite"></animate></feFlood><feComposite in="glowColor" in2="blurred" operator="in" result="softGlowColored"></feComposite><feMerge><feMergeNode in="softGlowColored"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter></defs><path fill="transparent" stroke-width="2" stroke="#2e6099" d="
        M15 5 L 485 5 Q 495 5, 495 15
        L 495 520 Q 495 530, 485 530
        L 15, 530 Q 5 530 5 520 L 5 15
        Q 5 5 15 5
      "></path><path stroke-width="2" fill="transparent" stroke-linecap="round" filter="url(#borderr-box-12-filterId-be465f2d87894d4bb829f791ed3667bc)" d="M 20 5 L 15 5 Q 5 5 5 15 L 5 20" stroke="#7ce7fd"></path><path stroke-width="2" fill="transparent" stroke-linecap="round" filter="url(#borderr-box-12-filterId-be465f2d87894d4bb829f791ed3667bc)" d="M 480 5 L 485 5 Q 495 5 495 15 L 495 20" stroke="#7ce7fd"></path><path stroke-width="2" fill="transparent" stroke-linecap="round" filter="url(#borderr-box-12-filterId-be465f2d87894d4bb829f791ed3667bc)" d="
        M 480 530 L 485 530
        Q 495 530 495 520
        L 495 515
      " stroke="#7ce7fd"></path><path stroke-width="2" fill="transparent" stroke-linecap="round" filter="url(#borderr-box-12-filterId-be465f2d87894d4bb829f791ed3667bc)" d="
        M 20 530 L 15 530
        Q 5 530 5 520
        L 5 515
      " stroke="#7ce7fd"></path></svg>
              <div class="info_content">
                <div class="info_head">${data.title}</div>
                <div class="info">新闻类别：<span class="val">${data.label}</span><span style="margin-left:20px">新闻日期：${data.newDate}</span></div>
                ${data.content}
              </div>
            </div>`
            this.popupClick.setLngLat(coordinates).setHTML(htmlInfo).addTo(map);
        })
      }
      map.getSource('newsSource').setData(geojsonData)
    },
    setLineLayer(data){
      let map = this.map
      console.log(data)
      let geojsonData = {
        type:'FeatureCollection',
        features:[]
      }
      data.forEach(item=>{
        let coordinate = []
        let arr = item.coordinate.split(';')
        arr.forEach(item=>{
         coordinate.push(item.split(','))
        })
        geojsonData.features.push({
          type:'Feature',
          geometry:{
            type:'LineString',
            coordinates:coordinate
          },
          properties:{
            id:item.id,
            name:item.title,
            pointArr:item.coordinate.split(','),
            label:item.label,
            content:item.content,
            newDate:item.newDate
          }
        })
        let lineSource = map.getSource('lineSource')
        if(lineSource === undefined){
            map.addSource('lineSource',{
            type:'geojson',
            data:{
              type:'FeatureCollection',
              features:[]
            }
          })
          map.addLayer({
            id:'lineLayer',
            type:'line',
            source:'lineSource',
            paint: {
              'line-color': '#fcbf49',
              'line-width':4,
              'line-opacity':0.6,
              // 'circle-stroke-width': 0.2,
              // 'circle-stroke-color': 'white'
            },
            layout:{
              'line-cap':'round'
            }
         })
          map.addLayer({
              "id": "regionName",
              "type": "symbol",   /* symbol类型layer，一般用来绘制点*/
              "source": "lineSource",
              "paint": {
              "text-color": "#11b4da",
              },
              "layout": {
                  'symbol-placement':'point', //默认值
                  "text-field": "{name}",
              }
          });
          map.on('click','regionName',e=>{
            console.log(e)
          let pointArr = e.features[0].properties.pointArr
          // this.setPointLayer(eval(pointArr))
          console.log(pointArr)
          let coordinates = [e.lngLat.lng, e.lngLat.lat];
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
          let data = e.features[0].properties
          console.log(data)
            var htmlInfo = `<div class="land_infoWrap">
         <svg width="500" height="535" class="dv-border-svg-container"><defs><filter id="borderr-box-12-filterId-be465f2d87894d4bb829f791ed3667bc" height="150%" width="150%" x="-25%" y="-25%"><feMorphology operator="dilate" radius="1" in="SourceAlpha" result="thicken"></feMorphology><feGaussianBlur in="thicken" stdDeviation="2" result="blurred"></feGaussianBlur><feFlood flood-color="rgba(124,231,253,0.7)" result="glowColor"><animate attributeName="flood-color" values="
              rgba(124,231,253,0.7);
              rgba(124,231,253,0.3);
              rgba(124,231,253,0.7);
            " dur="3s" begin="0s" repeatCount="indefinite"></animate></feFlood><feComposite in="glowColor" in2="blurred" operator="in" result="softGlowColored"></feComposite><feMerge><feMergeNode in="softGlowColored"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter></defs><path fill="transparent" stroke-width="2" stroke="#2e6099" d="
        M15 5 L 485 5 Q 495 5, 495 15
        L 495 520 Q 495 530, 485 530
        L 15, 530 Q 5 530 5 520 L 5 15
        Q 5 5 15 5
      "></path><path stroke-width="2" fill="transparent" stroke-linecap="round" filter="url(#borderr-box-12-filterId-be465f2d87894d4bb829f791ed3667bc)" d="M 20 5 L 15 5 Q 5 5 5 15 L 5 20" stroke="#7ce7fd"></path><path stroke-width="2" fill="transparent" stroke-linecap="round" filter="url(#borderr-box-12-filterId-be465f2d87894d4bb829f791ed3667bc)" d="M 480 5 L 485 5 Q 495 5 495 15 L 495 20" stroke="#7ce7fd"></path><path stroke-width="2" fill="transparent" stroke-linecap="round" filter="url(#borderr-box-12-filterId-be465f2d87894d4bb829f791ed3667bc)" d="
        M 480 530 L 485 530
        Q 495 530 495 520
        L 495 515
      " stroke="#7ce7fd"></path><path stroke-width="2" fill="transparent" stroke-linecap="round" filter="url(#borderr-box-12-filterId-be465f2d87894d4bb829f791ed3667bc)" d="
        M 20 530 L 15 530
        Q 5 530 5 520
        L 5 515
      " stroke="#7ce7fd"></path></svg>
              <div class="info_content">
                <div class="info_head">${data.name}</div>
                <div class="info">新闻类别：<span class="val">${data.label}</span><span style="margin-left:20px">新闻日期：${data.newDate}</span></div>
                ${data.content}
              </div>
            </div>`
            this.popupClick.setLngLat(coordinates).setHTML(htmlInfo).addTo(map);
        })
        }
        map.getSource('lineSource').setData(geojsonData)
      })
    },
    setPolygonLayer(data){
      let map = this.map
      let geojsonData = {
        type:'FeatureCollection',
        features:[]
      }
      data.forEach(item=>{
        let regionArr=[]
        let arr = item.coordinate.split(';')
        arr.forEach(item1=>{
          regionArr.push(item1.split(','))
        })
        console.log(regionArr)
        geojsonData.features.push(
          {
              "type": "Feature",
              "geometry": {
                  "type": "Polygon",
                  "coordinates":[regionArr]
              },
              "properties": {
                id:item.id,
                name:item.title,
                pointArr:item.coordinate.split(','),
                label:item.label,
                content:item.content,
                newDate:item.newDate
            }
          }
        )
      })
      let polygonSource = map.getSource('polygonSource')
      if(polygonSource === undefined){
            map.addSource('polygonSource',{
            type:'geojson',
            data:{
              type:'FeatureCollection',
              features:[]
            }
          })
          map.addLayer({
            "id": "polygonLine",
            "type": "line",
            "source": "polygonSource",
            "layout": {},
            "paint": {
                "line-color": "#fcbf49",
                "line-opacity": 1,
            }
         })
          map.addLayer({
            'id':'polygonLayer',
            'type':'fill',
            "source": "polygonSource",
            "layout": {},
            "paint": {
                "fill-color": "#fcbf49",
                "fill-opacity": 0.2,
            }
         })
          map.addLayer({
              "id": "'polygonRegionName",
              "type": "symbol",   /* symbol类型layer，一般用来绘制点*/
              "source": "polygonSource",
              "paint": {
              "text-color": "#11b4da",
              },
              "layout": {
                  'symbol-placement':'point', //默认值
                  "text-field": "{name}",
              }
          });
          map.on('click','polygonLayer',e=>{
            console.log(e)
          let pointArr = e.features[0].properties.pointArr
          // this.setPointLayer(eval(pointArr))
          console.log(pointArr)
          let coordinates = [e.lngLat.lng, e.lngLat.lat];
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
          let data = e.features[0].properties
            var htmlInfo = `<div class="land_infoWrap">
         <svg width="500" height="535" class="dv-border-svg-container"><defs><filter id="borderr-box-12-filterId-be465f2d87894d4bb829f791ed3667bc" height="150%" width="150%" x="-25%" y="-25%"><feMorphology operator="dilate" radius="1" in="SourceAlpha" result="thicken"></feMorphology><feGaussianBlur in="thicken" stdDeviation="2" result="blurred"></feGaussianBlur><feFlood flood-color="rgba(124,231,253,0.7)" result="glowColor"><animate attributeName="flood-color" values="
              rgba(124,231,253,0.7);
              rgba(124,231,253,0.3);
              rgba(124,231,253,0.7);
            " dur="3s" begin="0s" repeatCount="indefinite"></animate></feFlood><feComposite in="glowColor" in2="blurred" operator="in" result="softGlowColored"></feComposite><feMerge><feMergeNode in="softGlowColored"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter></defs><path fill="transparent" stroke-width="2" stroke="#2e6099" d="
        M15 5 L 485 5 Q 495 5, 495 15
        L 495 520 Q 495 530, 485 530
        L 15, 530 Q 5 530 5 520 L 5 15
        Q 5 5 15 5
      "></path><path stroke-width="2" fill="transparent" stroke-linecap="round" filter="url(#borderr-box-12-filterId-be465f2d87894d4bb829f791ed3667bc)" d="M 20 5 L 15 5 Q 5 5 5 15 L 5 20" stroke="#7ce7fd"></path><path stroke-width="2" fill="transparent" stroke-linecap="round" filter="url(#borderr-box-12-filterId-be465f2d87894d4bb829f791ed3667bc)" d="M 480 5 L 485 5 Q 495 5 495 15 L 495 20" stroke="#7ce7fd"></path><path stroke-width="2" fill="transparent" stroke-linecap="round" filter="url(#borderr-box-12-filterId-be465f2d87894d4bb829f791ed3667bc)" d="
        M 480 530 L 485 530
        Q 495 530 495 520
        L 495 515
      " stroke="#7ce7fd"></path><path stroke-width="2" fill="transparent" stroke-linecap="round" filter="url(#borderr-box-12-filterId-be465f2d87894d4bb829f791ed3667bc)" d="
        M 20 530 L 15 530
        Q 5 530 5 520
        L 5 515
      " stroke="#7ce7fd"></path></svg>
              <div class="info_content">
                <div class="info_head">${data.name}</div>
                <div class="info">新闻类别：<span class="val">${data.label}</span><span style="margin-left:20px">新闻日期：${data.newDate}</span></div>
                ${data.content}
              </div>
            </div>`
            this.popupClick.setLngLat(coordinates).setHTML(htmlInfo).addTo(map);
        })
        }
        map.getSource('polygonSource').setData(geojsonData)
    },
    getNewsList(){
      Market.getNewsList(this.formInline).then(res=>{
        let data = res.data.data.list
        let pointArr = []
        let lineArr = []
        let polygonArr = []
        data.forEach(item=>{
          if(item.kind === 'point'){
             pointArr.push(item)
          }else if(item.kind === 'line'){
            lineArr.push(item)
          }else if(item.kind === 'polygon'){
            polygonArr.push(item)
          }
        })
        this.$nextTick(_=>{
          setTimeout(_=>{
            this.setPointLayer(pointArr)
            console.log(pointArr)
            this.setLineLayer(lineArr)
            this.setPolygonLayer(polygonArr)
          },300)
        })
     })
    }
  },
  created(){
    Market.getDict('map_news_type').then(res=>{this.typeArr = res.data.data})
    this.getNewsList()
  }
}
</script>

<style lang="scss" scoped>
.marketNewsMap_wrap{
  height:calc(100% - 60px);
  width:100%;
  background: rgba(25,22,22,1);
  position: relative;
  /deep/.mapboxgl-popup-content{
    background: transparent;
    color:white;
    width: 500px;
    .land_infoWrap{
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(47,62,70,0.9);
      border-radius: 8px;
      width: 500px;
      .info_content{
        position: absolute;
        top:30px;
        width:80%;
        height: 500px;
        overflow-y: scroll;
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
        .info_head{
          font-weight: 700;
          color:#fcbf49;
          font-size:16px;
        }
        .info{
          margin-top:10px;
          font-size:14px;
          margin-bottom:10px;
        }
        /deep/img{
          width: 90%;
        }
      }
    }
    .mapboxgl-popup-close-button{
      color:white;
      font-size:24px;
      &:focus{
        outline: 0!important;
      }
    }
  }
  /deep/.mapboxgl-popup-content{
    background: transparent;
    color:white;
    .item_head{
      background: rgba(47,62,70,.5);
      border-radius: 6px;
      padding: 10px 20px;
    }
  }
  .from_box{
    position: absolute;
    top:3%;
    left:1.5%;
    .el-form-item{
      width:138px;
      margin-right: 14px;
      /deep/.el-form-item__label{
        color:#fcbf49;
        font-weight: 700;
      }
      /deep/.el-input__inner{
        padding-right:30px;
        background: transparent;
        color: #fcbf49;
        font-weight: 700;
      }
      /deep/.el-form-item__content{
        width:100%;
      }
      /deep/.el-select{
        width: 100%;
      }
      /deep/.el-tag{
        background:  #4B79A1;
        color:white;
      }
      .query_btn{
        color:white;
        font-size:13px;
        height:34px;
        width:92px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: -webkit-linear-gradient(to right, #2a5298, #1e3c72);  /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #2a5298, #1e3c72); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        border-radius: 4px;
        user-select: none;
        cursor: pointer;
        &:active{
            opacity: 0.7;
        }
      }
    }
  }
}
</style>