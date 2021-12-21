<template>
    <div class="caddata_wrap">
        <div class="cadfile_list">
            <div class="list_item" v-for="item in cadFileList" :key="item.id">
                <el-checkbox v-model="item.check" :checked="item.check" @change="val=>setCadLayer(val,item.id)"></el-checkbox>
                <div class="name">{{item.name}}</div>
                <el-button size="mini" type="text" @click="delCadLayer(item.id)">删除</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import ledgerApi from "@/api/ledgerApi";
import { mapGetters } from 'vuex'
export default {
    name:'cad_data',
    props:{
        isFresh:{
            type:Boolean,
            default:false
        }
    },
    data(){
        return {
            listHeight:window.innerHeight - 120,
            cadFileList:[],//cad文件列表
            caddataList:[],//cad图形数据
            checkedList:[],//选择的CAD
        }
    },
    mounted(){
        
    },
    computed:{
        ...mapGetters(['ledger_map','mapIsload'])
    },
    watch:{
        isFresh:{
            handler(newVal){
                this.getCADFileList()
            },
            deep:true
        }
    },
    methods:{
        //获取CAD列表数据
        getCADFileList(){
            ledgerApi.dataFIleList('cad_file')
            .then(res=>{
                if(res.data.code===0){
                    let data = res.data.data
                    console.log('cad导入列表',data)
                    data.forEach(item=>{
                        item.check = this.checkedList.includes(item.id)?true:false
                    })
                    this.cadFileList = data
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        //删除CAD文件及数据
        delCadLayer(id){
            var that = this
            var map = this.ledger_map
            that.$confirm('是否删除该CAD的文件及数据？', '提示', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'warning'
            }) .then(() => {
                let i = that.checkedList.indexOf(id)
                if(i!==-1){
                    that.checkedList.splice(i,1)
                }
                ledgerApi.delCadFile(id)
                .then(res=>{
                    if(res.data.code===0){
                        that.$message('cad数据已删除')
                        var source = map.getSource('source_cadPoint_'+id)
                        if(source!==undefined){
                            map.removeLayer("cad_point_"+id)
                            map.removeLayer("cad_line_"+id)
                            map.removeLayer("cad_polygon_"+id)
                            map.removeLayer("cad_polygon_border_"+id)
                            map.removeSource('source_cadPoint_'+id)
                        }
                        that.getCADFileList()
                    }else{
                        that.$message(res.data.msg)
                    }
                })
            }) .catch(() => {})
        },
        //获取CAD图形数据
        getCadLayerInfos(id){
            ledgerApi.getCADList(id)
            .then(res=>{
                if(res.data.code===0){
                    let data = res.data.data
                    console.log('cad图形列表',data)
                    this.caddataList = data
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        //加载CAD图层数据
        setCadLayer(val,id){
            var that = this
            if(val){
                that.checkedList.push(id)
            }else{
                let i = that.checkedList.indexOf(id)
                that.checkedList.splice(i,1)
            }
            var map = this.ledger_map
            var source = map.getSource('source_cadPoint_'+id)
            if(source===undefined){
                var popup = new that.mbgl.Popup({
                    closeButton: false,
                    closeOnClick: false,
                    anchor:'left',
                    offset:20
                });
                map.addSource('source_cadPoint_'+id,{
                    type:'vector',
                    tiles:[
                        process.env.BASE_URL+"/lms/work/toolimgmap/section/point/"+id+"/{z}/{x}/{y}"
                    ]
                })
                map.addLayer({ 
                    id: "cad_point_"+id,
                    type: "circle",
                    source: "source_cadPoint_"+id,
                    "source-layer": "point",
                    paint: {
                        "circle-radius": 3,
                        "circle-color": "#007cbf"
                    }
                });
                map.addSource('source_cadLinestring_'+id,{
                    type:'vector',
                    tiles:[
                        process.env.BASE_URL+"/lms/work/toolimgmap/section/linestring/"+id+"/{z}/{x}/{y}"
                    ]
                })
                map.addLayer({ 
                    id: "cad_line_"+id,
                    type: "line",
                    source: "source_cadLinestring_"+id,
                    "source-layer": "linestring",
                    paint: {
                        "line-width": 3,
                        "line-color": "#ff6600"
                    }
                });
                map.addSource('source_cadPolygon_'+id,{
                    type:'vector',
                    tiles:[
                        process.env.BASE_URL+"/lms/work/toolimgmap/section/polygon/"+id+"/{z}/{x}/{y}"
                    ]
                })
                map.addLayer({ 
                    id: "cad_polygon_"+id,
                    type: "fill",
                    source: "source_cadPolygon_"+id,
                    "source-layer": "polygon",
                    paint: {
                        "fill-color":'#8bc34a',
                        "fill-opacity": 0.5
                    }
                });
                map.addLayer({ 
                    id: "cad_polygon_border_"+id,
                    type: "line",
                    source: "source_cadPolygon_"+id,
                    "source-layer": "polygon",
                    paint: {
                        "line-width": 1,
                        "line-color": "#ffffff"
                    }
                });
                // map.on('click','cad_polygon',e=>{
                //     //阻止上层图层的点击事件穿透
                //     if (e.originalEvent.cancelBubble) {
                //         return;
                //     }
                //     console.log(e)
                //     //this.setClickInfo(e)
                // })
                // map.on("mousemove", "cad_polygon", e => {
                //     map.getCanvas().style.cursor = "pointer";
                //     let coordinates = [e.lngLat.lng, e.lngLat.lat];
                //     while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                //         coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                //     }
                //     var name = e.features[0].properties.parcel_location;
                //     var info = `<P class="item_head">${name}</p>`;
                //     popup.setLngLat(coordinates).setHTML(info).addTo(map);
                // });
                // map.on("mouseleave", "cad_polygon", e => {
                //     map.getCanvas().style.cursor = "";
                //     popup.remove();
                // });
            }
            map.setLayoutProperty("cad_point_"+id,'visibility',val?'visible':'none')
            map.setLayoutProperty("cad_line_"+id,'visibility',val?'visible':'none')
            map.setLayoutProperty("cad_polygon_"+id,'visibility',val?'visible':'none')
            map.setLayoutProperty("cad_polygon_border_"+id,'visibility',val?'visible':'none')
        },
    }
}
</script>
<style lang="scss">
.caddata_wrap{
    height: 100%;
    .cadfile_list{
        padding: 0 10px;
        height: 100%;
        overflow-y: scroll;
        .list_item{
            display: flex;
            align-items: center;
            margin-top: 8px;
            .name{
                margin-left: 10px;
                width: calc(100% - 50px);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 14px;
            }
        }
    }
}
</style>