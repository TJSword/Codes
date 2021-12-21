<template>
    <!-- 人口流分布图层 -->
    <div class="pop_dis">
        <VueDeckgl :layers="layers" :viewState="viewState"
        @click="handleClick" @view-state-change="updateViewState">
        </VueDeckgl>
        <div class="pop_table">
            <div class="title">成都市各城区人口</div>
            <div class="cont">
                <div class="name" style="color:#fff">区县市</div>
                <div class="name" style="color:#fff">人口数</div>
            </div>
            <div class="contents">
                <div class="cont" v-for="item in regionPop" :key="item.name">
                    <div class="name">{{item.name}}</div>
                    <div class="val">{{item.value}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import VueDeckgl from 'vue-deck.gl'
import { mapGetters } from 'vuex'
import { Deck } from '@deck.gl/core'
import { ScreenGridLayer,GPUGridLayer } from '@deck.gl/aggregation-layers'

export default {
    name:'pop_home',
    props:{
        
    },
    components:{
        VueDeckgl
    },
    data(){
        return {
            viewState: {
                longitude: localStorage.getItem('cityCenter')?JSON.parse(localStorage.getItem('cityCenter'))[0]:104.063115,
                latitude: localStorage.getItem('cityCenter')?JSON.parse(localStorage.getItem('cityCenter'))[1]:30.669457,
                zoom: 8,
                bearing: 0,
                pitch: 0,
            },
            dataUrlArr:[
                '成华区2020.json',
                '崇州市2020.json',
                '大邑县2020.json',
                '东部新城2020.json',
                '都江堰市2020.json',
                '高新区2020.json',
                '简阳市2020.json',
                '金牛区2020.json',
                '金堂县2020.json',
                '锦江区2020.json',
                '龙泉驿区2020.json',
                '彭州市2020.json',
                '郫都区2020.json',
                '蒲江县2020.json',
                '青白江区2020.json',
                '青羊区2020.json',
                '邛崃市2020.json',
                '双流区2020.json',
                '天府新区2020.json',
                '温江区2020.json',
                '武侯区2020.json',
                '新都区2020.json',
                '新津区2020.json',
                //'chengdu_grid300.json',
            ],
            colorRange: [
                [255, 255, 178, 20],
                [254, 217, 118, 100],
                [254, 178, 76, 150],
                [253, 141, 60, 255],
                [240, 59, 32, 255],
                [189, 0, 38, 255],
            ],
            gpuAggregation: true,
            aggregation: 'SUM',
            cellSize: 8,
            regionPop:[
                { name:'锦江区',value:794880},
                { name:'青羊区',value:904618},
                { name:'金牛区',value:1675642},
                { name:'武侯区',value:992236},
                { name:'成华区',value:1345974},
                { name:'高新区',value:967052},
                { name:'天府新区',value:529988},
                { name:'双流区',value:1105278},
                { name:'龙泉驿区',value:969545},
                { name:'温江区',value:559657},
                { name:'新都区',value:980666},
                { name:'郫都区',value:817150},
                { name:'新津区',value:386016},
                { name:'青白江区',value:436743},
                { name:'都江堰市',value:831011},
                { name:'彭州市',value:956429},
                { name:'邛崃市',value:767830},
                { name:'崇州市',value:858021},
                { name:'简阳市',value:533287},
                { name:'大邑县',value:646868},
                { name:'蒲江县',value:304700},
                { name:'金堂县',value:897285},
                { name:'东部新城',value:308853},


            ],
        }
    },
    computed:{
        layers () {
            let pathArr = []
            this.dataUrlArr.forEach(item=>{
                pathArr.push(
                    // 屏幕栅格
                    new ScreenGridLayer({
                        id: 'screenGrid_'+item,
                        data:'http://47.104.165.136:8099/test/cd_population_json/'+item,
                        opacity: 1,
                        getPosition: d => [d[0], d[1]],
                        getWeight: d => d[2],
                        cellSizePixels: 8,
                        colorRange:[
                            [255, 255, 178, 20],
                            [254, 217, 118, 100],
                            [254, 178, 76, 150],
                            [253, 141, 60, 255],
                            [240, 59, 32, 255],
                            [189, 0, 38, 255]
                        ],
                        gpuAggregation:true,
                        pickable: true,
                        aggregation: 'SUM',
                        //colorDomain:[100,40000],
                        onClick: info => console.log(info)
                        //onHover: info => setHoverInfo(info)
                    }),
                    // 热力图
                    // new HeatmapLayer({
                    //     id:'heat_'+item,
                    //     data:'http://47.104.165.136:8099/test/cd_population_json/'+item,
                    //     getPosition: d => [d[0], d[1]],
                    //     getWeight: d => d[2],
                    //     radiusPixels:10,
                    //     intensity:0.1,
                    //     threshold:0.03
                    // })
                ) 
            })
            return pathArr;
        },
        ...mapGetters(['ledger_map','mapIsload'])
    },
    watch:{
        mapIsload:{
            handler(newVal){
                if(newVal){
                   
                }
            },
        },
        
    },
    mounted(){
        var map = this.ledger_map
        var zoom = map.getZoom()
        var center = map.getCenter()
        this.viewState = {
            longitude: center.lng,
            latitude: center.lat,
            zoom: zoom,
            bearing: 0,
            pitch: 0,
        }
        this.mapEvents()
    },
    methods:{
        mapEvents(){
            var map = this.ledger_map
            map.on('zoomend',e=>{
                var zoom = map.getZoom()
                var center = map.getCenter()
                this.viewState = {
                    longitude: center.lng,
                    latitude: center.lat,
                    zoom: zoom,
                    bearing: 0,
                    pitch: 0,
                }
            })
        },
        updateViewState(viewState) {
            //console.log("updating view state...");
            this.viewState = {
                ...viewState
            }
            this.ledger_map.jumpTo({
                center: [viewState.longitude, viewState.latitude],
                zoom: viewState.zoom,
                bearing: viewState.bearing,
                pitch: viewState.pitch,
            });
        },
        handleClick({ event, info }) {
            console.log(event,info)
        },
        
    }
}
</script>
<style lang="scss">
.pop_dis{
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 0;
    .deckMap{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #e5e9ec;
        overflow: hidden;
        z-index: 0;
    } 

    .pop_table{
        position: fixed;
        height: 86%;
        left: 110px;
        top: 50px;
        width: 200px;
        background: rgba(0,0,0,0.6);
        font-size: 12px;
        color: #fff;
        z-index: 3;
        .title{
            width: 100%;
            height: 50px;
            line-height: 50px;
            text-align: center;
        }
        .contents{
            height: calc(100% - 90px);
            overflow-y: scroll;
        }
        .cont{
            display: flex;
            align-items: center;
            width: 100%;
            height: 30px;
            .name,.val{
                width: 50%;
                line-height: 30px;
                text-align: center;
                color: #ff9800;
            }
            .name{
                color: #58ecff;
            }
        }
    }
}

</style>