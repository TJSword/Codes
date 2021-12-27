<template>
    <div class="LandParameter_wrap">
      <div class="mask" v-if="progress >0" @click="showToast"></div>
      <!-- <Map @map="getMap" /> -->
      <div class="LandParameter_box">
          <div class="chooseLand_box">
               <el-select v-model="land" placeholder="选择土地台账" size="small" class="select" @focus="getAccountList">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
              <div class="new_btn" @click="current">新建土地台账</div>
          </div>
          <dv-border-box-2 class="info_box">
              <div class="item" v-for="(item,index) in infoArr" :key="index">
                  <div class="label">{{item.label}}</div>
                  <div class="value">{{item.value}}</div>
              </div>
          </dv-border-box-2>
          <div class="next_btn" @click="jumpNext">下一步</div>
      </div>
  </div>
</template>
<script>
import Map from "../../components/main/locationResearch/map"
import locationResearch from "../../api/locationResearch"
import { mapGetters } from "vuex"
export default {
    components:{
        Map
    },
    computed:{
        ...mapGetters(['progress','map'])
    },
    data(){
        return{
           
            landInfo:{},
            options: [{
                value: '选项1',
                label: '黄金糕'
            }, {
                value: '选项2',
                label: '双皮奶'
            }, {
                value: '选项3',
                label: '蚵仔煎'
            }, {
                value: '选项4',
                label: '龙须面'
            }, {
                value: '选项5',
                label: '北京烤鸭'
            }],
            land: '',
            infoArr:[]
        }
    },
    watch:{
        land(newVal){
            locationResearch.getAccountInfo(newVal).then(res=>{
                this.landInfo = res.data.data.searchResult[0]
                this.infoArr = [{
                    label:'台账名称',
                    value:this.landInfo.accountName
                },{
                    label:'土地位置',
                    value:this.landInfo.description
                },{
                    label:'土地编号',
                    value:this.landInfo.landNumber
                },{
                    label:'地块名',
                    value:this.landInfo.name
                },{
                    label:'土地用途',
                    value:this.landInfo.purpose
                },{
                    label:'占地面积(㎡)',
                    value:this.landInfo.landArea
                },{
                    label:'容积率',
                    value:this.landInfo.volumeRatio
                },{
                    label:'建筑面积(㎡)',
                    value:this.landInfo.buildArea
                },{
                    label:'起拍总价(万元)',
                    value:this.landInfo.startTotalPrice
                },{
                    label:'成交时间',
                    value:this.landInfo.date
                },{
                    label:'成交总价(万元)',
                    value:this.landInfo.totalPrice
                },{
                    label:'起拍楼面价(元/㎡)',
                    value:this.landInfo.startPrice
                },{
                    label:'成交楼面价(元/㎡)',
                    value:this.landInfo.price
                },{
                    label:'溢价率(%)',
                    value:this.landInfo.premiumRatio
                },{
                    label:'竞得单位',
                    value:this.landInfo.competeCompany
                }]
                this.setPointLayer(this.landInfo.coordinates.split(','))
                this.$store.dispatch('setPoint',this.landInfo.coordinates.split(','))
            })
        },
        map(newVal){
            console.log(newVal)
        }
    },
    methods:{
        showToast(){
            this.$message({
                type:'warning',
                message:'当前模块已锁定，如需更改，请点击“我要重做”'
            })
        },
        jumpNext(){
            if(this.land === ''){
                this.$message({
                    message: '请选择土地台账',
                    type: 'warning'
                })
                return
            }
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            locationResearch.createList(this.land).then(res=>{
                this.$store.dispatch("setLocationId",res.data.data)
                setTimeout(() => {
                     loading.close();
                    this.$router.push({
                      name:'CustomerModel'
                    })
                }, 1000);
            })
           
            
        },
        setPointLayer(point){
          let map = this.map;
          map.flyTo({
            center:[point[0]-0.015,point[1]],
            zoom: 12.5,
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
        current(){
            window.open('http://qingdao.keyanshe.ltd/#/ledgermap')
        },
        
        getAccountList(){
            locationResearch.getAccountList().then(res=>{
                console.log(res.data.data.searchResult)
                this.options = res.data.data.searchResult
               
            })
        }
    },
    created(){
        this.getAccountList()
        console.log(this.progress)
    }
}
</script>
<style lang="scss" scoped>
.LandParameter_wrap{
    height: calc(100% - 60px);
    width: 100%;
    position: fixed;
    top:60px;
    pointer-events: none;
    .mask{
        height: 100%;
        width: 100%;
        position: fixed;
        top:60px;
        left: 0;
        z-index: 999999;
        pointer-events: auto;
    }
    .LandParameter_box{
        position: absolute;
        padding: 30px 0 ;
        height: calc(100% - 60px);
        width: 30%;
        left:0;
        top:0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
         pointer-events: auto;
        .chooseLand_box{
            height: 40px;
            width: 80%;
            display: flex;
            align-items: center;
            justify-content: space-around;
            ::v-deep .el-input__inner{
                background: transparent;
                color: rgb(252, 191, 73);
                border-color: white;
            }
            .new_btn{
                position: relative;
                color:white;
                font-size:12px;
                padding:8px 16px;
                letter-spacing: 1.5px;
                background: #457fca;  /* fallback for old browsers */
                background: -webkit-linear-gradient(to right, #5691c8, #457fca);  /* Chrome 10-25, Safari 5.1-6 */
                background: linear-gradient(to right, #5691c8, #457fca); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
                border-radius: 4px;
                user-select: none;
                cursor: pointer;
                &:active{
                    opacity: 0.7;
                }
            }
        }
        .info_box{
            height: 85%;
            width: 60%;
            background: rgba(47,62,70,.7);
            flex-shrink:1;
            border-radius: 8px;
            padding: 0 10%;
            display: flex;
            flex-direction: column;
            .item{
                display: flex;
                width: 100%;
                height: 40px;
                margin-top:5px;
                align-items: center;
                .label{
                    color: #f0efeb;
                    width:50%;
                    text-align: center;
                }
                .value{
                    color:#fcbf49;
                    width:50%;
                    text-align: center;
                }
            }
        }
        .next_btn{
            margin-left:60%;
            border-radius: 8px;
            position: relative;
            color:white;
            font-size:12px;
            padding:8px 16px;
            letter-spacing: 1.5px;
            background: #457fca;  /* fallback for old browsers */
            background: -webkit-linear-gradient(to right, #5691c8, #457fca);  /* Chrome 10-25, Safari 5.1-6 */
            background: linear-gradient(to right, #5691c8, #457fca); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
            border-radius: 4px;
            user-select: none;
            cursor: pointer;
            &:active{
                opacity: 0.7;
            }
        }
    }
}
</style>