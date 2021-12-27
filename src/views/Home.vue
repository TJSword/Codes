<template>
  <div class="home">
    <Map @map='getMap' />
  </div>
</template>

<script>
import Map from "../components/MapComponent.vue"
import axios from "axios"
export default {
  name: 'Home',
  components:{
    Map
  },
  data(){
    return{
      swords:[
        {coordinate: "116.41113307958986,39.949102930147106",name:'大卫王'},
        {coordinate: "104.03656458130820,30.588482557822758",name:'彪彪',label:['人间油物']},
        {coordinate: "113.90530127116395,22.529352820096197",name:'狗子哥'},
        {coordinate: "113.94967602269357,22.530769175884647",name:'雫'},
        {coordinate: "120.40546755258976,36.185750200997090",name:'老何',label:['人间油物']},
        {coordinate: "117.17668904434204,31.839912482865845",name:'顶顶'},
        {coordinate: "120.62068171163940,31.263083367533490",name:'坤坤'},
        {coordinate: "108.99605882453918,34.269488637808784",name:'碎落星沉'},
        {coordinate: "116.41905774090574,40.027328559551165",name:'紫苜'},
        {coordinate: "114.32466419067386,29.831808386255010",name:'白给'},
        {coordinate: "104.04125233882905,30.630496394258740",name:'我不是新人'},
        {coordinate: "113.34650148365782,23.143999892753552",name:'倘若'},
        {coordinate: "120.08295836499023,30.313287696779017",name:'希希'},
        {coordinate: "112.47094068031984,34.612638347246860",name:'干粮'},
        {coordinate: "120.09094545696252,30.312138348746604",name:'葵葵'},
        {coordinate: "108.88602191401674,34.215078327677396",name:'小七爸爸'},
        {coordinate: "113.94948587051393,22.569020257346570",name:'阿信'},
        {coordinate: "116.42128933880613,39.779908103179594",name:'有为'},
        {coordinate: "118.79231142195131,31.932585957283543",name:'万里'},
        {coordinate: "120.10940413685810,30.282109764142450",name:'小恐龙'},
        {coordinate: "116.23516549084471,40.08110227591025",name:'小秦'},
        {coordinate: "104.03928271834769,30.676244094831578",name:'图图'},
        {coordinate: "120.98492405334474,30.921111536667944",name:'小金猊'},
        {coordinate: "121.24361497043957,31.360764319719586",name:'牛妹'},
        {coordinate: "116.37278158877180,39.877978201497710",name:'太白'},
        {coordinate: "118.06722153637693,24.571764620098385",name:'5t5'},
        {coordinate: "116.47432197544859,40.019597359598360",name:'空空'},
        {coordinate: "112.62797779629516,34.626885568896480",name:'晴朗'},
        {coordinate: "114.41467377111860,30.484916549819292",name:'胡歌的腿毛'},
        {coordinate: "117.13231076214598,31.803158856273180",name:'盖亚'},
        {coordinate: "116.33532990429686,40.076702112310564",name:'对方正在输入中'},
        {coordinate: "121.31916800000000,31.046414705840217",name:'麻吉'},
        {coordinate: "111.50080086444856,27.218263012785233",name:'M'},
        {coordinate: "113.34174289713708,23.099218797391572",name:'小瑞瑞'},
        {coordinate: "104.04829027881112,30.705287025921535",name:'半点'},
        {coordinate: "116.67978012796519,39.843986682326175",name:'码奴'},
        {coordinate: "113.38694956897733,23.128649265879282",name:'小方'},
        {coordinate: "113.88326212297079,22.554126873227190",name:'Maggie'},
        {coordinate: "116.45926941845701,39.827721860134490",name:'清崽'},
        {coordinate: "103.98451658843388,30.619920343069353",name:'恦'},
        {coordinate: "111.50457910644879,27.211422559444696",name:'及时行乐'},
        {coordinate: "120.12057674955024,30.356680218797860",name:'zwb'},
        {coordinate: "112.61689801814424,26.867951961745792",name:'こびと'},
        {coordinate: "116.91595162502288,36.693282717706570",name:'不易'},
        {coordinate: "116.49503935787962,39.894420866819274",name:'404'},
        {coordinate: "116.41812516713725,39.957461296631635",name:'鸭妹'},
        {coordinate: "108.35625034970377,35.489072386705630",name:'点点'}
      ],
    }
  },
  methods:{
    getMap(map){
      this.map = map
      map.on('load',_=>{
        this.setPoint(this.swords)
        this.centroid()
        map.on('click','goodsName',e=>{
          let label = e.features[0].properties.label
          let coordinate = JSON.parse(e.features[0].properties.point)
          console.log(coordinate)
          if(label){
             console.log(JSON.parse(label))
             var htmlInfo = `
                    <div class="info_content">
                    <div class="info_head"></div>
                    <div class="info">城区：<span class="val"></span></div>
                    <div class="info">板块：<span class="val"></span></div>
                    <div class="info">项目地图：<span class="val"></span></div>
                    <div class="info">片区：<span class="val"></span></div>
                    <div class="info">占地面积：<span class="val">万㎡</span></div>
                    </div>
                </div>`
              this.popupClick.setLngLat(coordinate).setHTML(htmlInfo).addTo(map);
          }
        })
      })
      setTimeout(_=>{
        console.log(map)
      },3000)
    },
    setPoint(data){
       let map = this.map
          let geojsonData = {
              type:'FeatureCollection',
              features:[]
          }
          data.forEach(item=>{
              if(item.coordinate){
                  let coordinate = item.coordinate.split(',')
                  geojsonData.features.push({
                  type:'Feature',
                  geometry:{
                      type:'Point',
                      coordinates:coordinate
                  },
                  properties:{
                          title:item.name,
                          point:item.coordinate.split(','),
                          label:item.label
                      }
                  })
              }
          })
          let goodsSource = map.getSource('goodsSource')
          if(goodsSource==undefined){
          map.addSource('goodsSource',{
              type:'geojson',
              data:{
              type:'FeatureCollection',
              features:[]
              }
          })
          map.addLayer({
              id:'goodsPoints',
              type:'circle',
              source:'goodsSource',
              paint: {
                  'circle-color':"#fcbf49",
                  "circle-radius":6,
                  'circle-stroke-width': 0.5,
                  'circle-stroke-color': 'white',
                  'circle-pitch-scale':'viewport',
                  'circle-stroke-opacity':0.5
              }
          })
            map.addLayer({
            id: "goodsName",
            type: "symbol",   /* symbol类型layer，一般用来绘制点*/
            source: "goodsSource",
            paint: {
                "text-color": "#11b4da",
            },
            layout: {
                'symbol-placement':'point', //默认值
                "text-field": "{title}",
                "text-offset": [0, -2],
                "text-anchor": "top" ,
                "icon-allow-overlap":true,
                "icon-ignore-placement":true
            }
        });
      }
      map.getSource('goodsSource').setData(geojsonData)
    },
    centroid(){
      let arr = []
      this.swords.forEach(item=>{
        arr.push([item.coordinate.split(',')[0] * 1,item.coordinate.split(',')[1] * 1])
      })
      let longitude = 0
      let latitude = 0
      for(let i = 0; i < arr.length;i++){
        longitude += arr[i][0]
        latitude += arr[i][1]
      }
      console.log(longitude,latitude)
      let centroidCoordinate = [longitude/arr.length,latitude/arr.length]
      console.log(centroidCoordinate)
      this.setCentroidLayer(centroidCoordinate)
    },
    setCentroidLayer(point){
          let map = this.map;
          map.flyTo({
            pitch: 45
          })
          var size= 100;
          let source = map.getSource('pointSource')
          if(source === undefined){
          var pulsingDot = {
            width: size,
            height: size,
            data: new Uint8Array(size * size * 4),

            onAdd: function() {
              var canvas = document.createElement("canvas");
              canvas.width = this.width;
              canvas.height = this.height;
              this.context = canvas.getContext("2d");
            },
            render: function() {
              var duration = 1000;
              var t = (performance.now() % duration) / duration;

              var radius = (size / 2) * 0.3;
              var outerRadius = (size / 2) * 0.7 * t + radius;
              var context = this.context;

              // draw outer circle
              context.clearRect(0, 0, this.width, this.height);
              context.beginPath();
              context.arc(
                  this.width / 2,
                  this.height / 2,
                  outerRadius,
                  0,
                  Math.PI * 2
              );
              context.fillStyle = "rgba(255, 200, 200," + (1 - t) + ")";
              context.fill();

              // draw inner circle
              context.beginPath();
              context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
              context.fillStyle = "rgba(255, 100, 100, 1)";
              context.strokeStyle = "white";
              context.lineWidth = 2 + 4 * (1 - t);
              context.fill();
              context.stroke();

              // update this image's data with data from the canvas
              this.data = context.getImageData(0, 0, this.width, this.height).data;

              // keep the map repainting
              map.triggerRepaint();

              // return `true` to let the map know that the image was updated
              return true;
            }
          };
          map.addImage("land-dot", pulsingDot, { pixelRatio: 2 });
          map.addSource('pointSource',{
            type:'geojson',
            data:{
              type:'FeatureCollection',
              features:[{
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",
                      "coordinates": point
                  },
                
              }]
            }
          })
          map.addLayer({
                id: "house_point",
                type: "symbol",
                source: 'pointSource',
                layout: {
                "icon-image": "land-dot",
                }
            });
          }
          map.getSource('pointSource').setData({
              type:'FeatureCollection',
              features:[{
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",
                      "coordinates": point
                  },
                
              }]
            })
    },
    getCircleData(point){
      axios.get("https://api.mapbox.com/isochrone/v1/mapbox/" + 'driving' + "/" + point.join(',') + "?contours_minutes=" + 60 + "&polygons=true&access_token=pk.eyJ1IjoiMTU5MDk4Mzk1NjQiLCJhIjoiY2tpZmt0MThrMGtwcTJ5bngxN2xqNnYzeCJ9.erBGt3UuT5gNjeD-d_p_VA",).then(res=>{
        this.setTimeCircle(res.data.features[0])
      })
    },
    setTimeCircle(data){
      let map = this.map
            let source = map.getSource('timeCircle')
            if(source === undefined){
                map.addSource("timeCircle", {
                        "type": "geojson",
                        "data": {
                            "type": "FeatureCollection",
                            "features": []
                        }
                    });
                map.addLayer({
                    "id": "timeCircle_fill",
                    "type": "fill",
                    "source": "timeCircle",
                    "layout": {
                        // "visibility":"visible"
                    },
                    "paint": {
                        "fill-color": "#fcbf49",
                        "fill-opacity": 0.2,
                    }
                });
                map.addLayer({
                    "id": "timeCircle_line",
                    "type": "line",
                    "source": "timeCircle",
                    "layout": {},
                    "paint": {
                        "line-color": "#fcbf49",
                        "line-opacity": 1,
                    }
        });
            }
            map.getSource('timeCircle').setData({
                "type": "FeatureCollection",
                "features": [data]
            })
    }
  },
  created(){
   this.popupClick = new this.mbgl.Popup({
      offset:15,
      anchor:'left',
      closeButton:true,
      closeOnClick:false
    })
  }
}
</script>
<style lang="scss" scoped>
.home{
  height: 100%;
  width: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
  .diagram_box{
    position: fixed;
    top:1.6%;
    left:1.6%;
    height: 40px;
    width: 300px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .join_circle{
      height: 24px;
      width: 24px;
      background: #ff8500;
      border-radius: 50%;
    }
    .not_join_circle{
      height: 18px;
      width: 18px;
      background: #fcbf49;
      border-radius: 50%;
    }
    .join{
      font-size: 14px;
      color:white;
    }
  }
}
</style>
