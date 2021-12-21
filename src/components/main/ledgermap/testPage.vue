<template>
    <!-- 测试页面 -->
    <div class="testpage"></div>
</template>
<script>
import commonApi from '@/api/commonApi.js'
import { mapGetters } from 'vuex'
export default {
    name:'testpage',
    mounted(){
        
    },
    computed:{
        ...mapGetters(['ledger_map','mapIsload'])
    },
    watch:{
        mapIsload:{
            handler(newVal){
                if(newVal){
                    //this.loadTestLayer()
                }
            },
            deep:true
        },
    },
    methods:{
        loadTestLayer(){
            var that = this
            var map = that.ledger_map
            commonApi.getTestData()
            .then(res=>{
                console.log('测试数据',res.data.data)
                let source = map.getSource('testSource')
                if(source===undefined){
                    map.addSource('testSource',{
                        type:'geojson',
                        data:{
                            "type":"FeatureCollection",
                            "Features":[]
                        }
                    })
                    map.addLayer({
                        id:'testFill',
                        type:'fill',
                        source:'testSource',
                        paint:{
                            'fill-color':'#f60'
                        },
                    })
                    map.addLayer({
                        id:'testLine',
                        type:'line',
                        source:'testSource',
                        paint:{
                            'line-color':'#67c23a',
                            'line-width':1
                        },
                    })
                }
                let data = res.data.data
                let obj = {
                    "type":"FeatureCollection",
                    "features":[]
                }
                data.forEach(item => {
                    let coords = []
                    if(item.coordinates){
                        let co1 = item.coordinates.split(',')
                        co1.forEach(c=>{
                            let co2 = c.split(' ')
                            coords.push([JSON.parse(co2[0]),JSON.parse(co2[1])])
                        })
                    }
                    if(item.type==='Polygon'){
                        obj.features.push({
                            "type":"Feature",
                            "geometry":{
                                "type":"Polygon",
                                "coordinates":[coords]
                            },
                            "properties":{
                                "id":item.id
                            }
                        })
                    }else if(item.type==='LineString'){
                        obj.features.push({
                            "type":"Feature",
                            "geometry":{
                                "type":"LineString",
                                "coordinates":coords
                            },
                            "properties":{
                                "id":item.id
                            }
                        })
                    }
                })
                console.log(obj)
                map.getSource('testSource').setData(obj)
            })
        },
    }
}
</script>