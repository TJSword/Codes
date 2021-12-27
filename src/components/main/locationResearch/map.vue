<template>
    <div class="map_wrap">
        <div :id="id"></div>
    </div>            
</template>

<script>
import mapboxgl from 'mapbox-gl' //引入mapbox
export default {
    props:{
      id:{
          default:'map'
      }
    },
    data(){
        return{
            map:null
        }
    },
    methods:{
        initmap(){
            mapboxgl.accessToken = 'pk.eyJ1IjoiMTU5MDk4Mzk1NjQiLCJhIjoiY2tpZmt0MThrMGtwcTJ5bngxN2xqNnYzeCJ9.erBGt3UuT5gNjeD-d_p_VA'; 
            this.map = new mapboxgl.Map({
            container: this.id, // container id 绑定的组件的id
            style: 'mapbox://styles/15909839564/ckjxy4d640am718o41mbpwfaj', //地图样式，可以使用官网预定义的样式,也可以自定义
            center:["120.20681158771386", "36.06184962149909"],
            zoom: 10.5,     // starting zoom 地图初始的拉伸比例
            pitch: 0,  //地图的角度，不写默认是0，取值是0-60度，一般在3D中使用
            bearing:0, //地图的初始方向，值是北的逆时针度数，默认是0，即是正北
            antialias: true, //抗锯齿，通过false关闭提升性能
           }); 
            this.map.on('load',_=> {        /* on(type,callback)为type事件添加监听器，callback是响应函数*/
                // this.map.addSource("points", {
                //     "type": "geojson",          /* geojson类型资源 */
                //     "data": {                   /* geojson数据 */
                //         "type": "FeatureCollection",
                //         "features": [
                //         //     {
                //         //     "type": "Feature",
                //         //     "geometry": {
                //         //         "type": "Point",
                //         //         "coordinates": [-77.03238901390978, 38.913188059745586]
                //         //     },
                //         //     "properties": {
                //         //         "title": "Mapbox DC",
                //         //         "icon": "monument"
                //         //     }
                //         // }, {
                //         //     "type": "Feature",
                //         //     "geometry": {
                //         //         "type": "Point",
                //         //         "coordinates": [-122.414, 37.776]
                //         //     },
                //         //     "properties": {
                //         //         "title": "Mapbox SF",
                //         //         "icon": "harbor"
                //         //     }
                //         //   }
                //         ]
                //       }
                //     }
                // );
            
                // this.map.addLayer({
                //     "id": "points1",
                //     "type": "circle",   /* symbol类型layer，一般用来绘制点*/
                //     "source": "points",
                //     "paint": {
                //         "circle-color": "#11b4da",
                //         "circle-radius": 4,
                //         "circle-stroke-width": 0.5,
                //         "circle-stroke-color": "#fff"
                //     },
                //     // "layout": {
                //     //     "icon-image": "{icon}-15",   /* 图标图像 */
                //     //     "text-field": "{title}",     /* 使用text标签显示的值，Feature属性使用{域名}格式*/
                //     //     "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],  /* 文本字体 */
                //     //     "text-offset": [0, 0.6],     /* 该属性表示文本偏移锚点的距离，正值表示向右和向下，负值表示向左和向上 */
                //     //     "text-anchor": "top"         /* 该属性设置文本中最接近锚点的部分，top表示文本的顶端放置到最接近锚点的位置 */
                //     // }
                // });
                // this.map.addLayer({
                //     "id": "points",
                //     "type": "symbol",   /* symbol类型layer，一般用来绘制点*/
                //     "source": "points",
                //     "paint": {
                //     "text-color": "#11b4da",
                //     // "circle-radius": 4,
                //     // "circle-stroke-width": 1,
                //     // "circle-stroke-color": "#fff",
                //     },
                //     "layout": {
                //         // "icon-image": "{icon}-15",   /* 图标图像 */
                //         "text-field": "{title}",     /* 使用text标签显示的值，Feature属性使用{域名}格式*/
                //         "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],  /* 文本字体 */
                //         "text-offset": [0, 0.6],     /* 该属性表示文本偏移锚点的距离，正值表示向右和向下，负值表示向左和向上 */
                //         "text-anchor": "top"         /* 该属性设置文本中最接近锚点的部分，top表示文本的顶端放置到最接近锚点的位置 */
                //     }
                // });
            });
        },
    },
    mounted(){
        this.initmap()
        this.$emit('map', this.map)
    }
}
</script>

<style lang="scss" scoped>
.map_wrap{
    height: 100%;
    width:100%;
    v::deep .mapboxgl-ctrl-bottom-right{
        display: none!important;
    }
}
#map{ 
    position: absolute; 
    top: 0; 
    bottom: 0; 
    width: 100%; 
}
#detailMap{ 
    position: absolute; 
    top: 0; 
    bottom: 0; 
    width: 100%; 
}
#LandDetailMap{
    position: absolute; 
    top: 0; 
    bottom: 0; 
    width: 100%; 
}
</style>