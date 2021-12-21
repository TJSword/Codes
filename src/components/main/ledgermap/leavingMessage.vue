<template>
  <!-- 台账地图留言 -->
  <div class="leaving_message_wrap" v-show="showMessage">
    <div class="message_btns">
      <div class="centered">
        <el-tooltip class="item" effect="light" content="添加讯息" placement="top-start">
          <div :class="['plus',messageMenu?'plus--active':'']" @click="messageMenu = !messageMenu">
            <div class="plus__line plus__line--v">
              <div class="icon_wrap" @click="addMapInfo('message')">
                <i class="plus__link iconfont icon-xiaoxi"></i>
                <div class="menu_name">留言</div>
              </div>
              <div class="icon_wrap" @click="addMapInfo('article')">
                <i class="plus__link iconfont icon-wenzhang1"></i>
                <div class="menu_name">文章</div>
              </div>
              <!-- <div class="icon_wrap" @click="addMapInfo('expressNews')">
                <i class="plus__link iconfont icon-kuaibao"></i>
                <div class="menu_name">快报</div>
              </div>
              <div class="icon_wrap" @click="addMapInfo('share')">
                <i class="plus__link iconfont icon-zhishifenxiang"></i>
                <div class="menu_name">分享</div>
              </div> -->
            </div>
            <div class="plus__line plus__line--h"></div>
          </div>
        </el-tooltip>
      </div>
    </div>
    <div :class="[messageType=='message'?'message_cont':messageType=='article'?'article_cont':'message_cont']" v-show="messageCoord!==null">
      <!-- 消息编辑器 -->
      <div class="message_editor" v-if="messageType=='message'">
        <el-input v-model="message" type="textarea" placeholder="请输入留言消息" :rows="3" maxlength="50" show-word-limit></el-input>
      </div>
      <!-- 富文本编辑器组件 -->
      <div class="article_editor" v-if="messageType=='article'">
        <mavon-editor ref="editor" v-model="doc" :ishljs="true" @imgAdd="$imgAdd" @change="updataDoc" style="height:50vh" />
      </div>
      <!-- 开盘快报 -->
      <div class="express_editor" v-if="messageType=='expressNews'">
        <div class="title">开盘快报</div>
        <el-form ref="express_form" :model="expressForm" label-width="80px">
          <el-form-item label="项目名称">
            <el-input size="small" v-model="expressForm.name"></el-input>
          </el-form-item>
          <el-form-item label="项目地址">
            <el-input size="small" v-model="expressForm.adress"></el-input>
          </el-form-item>
          <el-form-item label="地块编号">
            <el-input size="small" v-model="expressForm.landID"></el-input>
          </el-form-item>
          <el-form-item label="开盘时间">
            <el-input size="small" v-model="expressForm.date"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="box_item">
        <el-button type="default" size="mini" @click="cancelMessage()">取消</el-button>
        <el-button type="primary" size="mini" @click="subMessage()">提交</el-button>
      </div>
    </div>
    <div class="article_box" v-if="showArticle">
      <el-button type="primary" size="mini" class="close" @click="showArticle = false">关闭</el-button>
      <div class="article_wrap">
        <div class="article" v-html="articleHTML"></div>
        <div class="comment_box">
          <div class="comment_cont">
            <div class="c_title">评论列表</div>
            <div class="user_commen">
              <div class="con_item" v-for="item in conmmentArr" :key="item.id">
                <div class="top">
                  <div class="user_name">{{item.creator}}</div>
                  <div class="date">{{item.createDate}}</div>
                </div>
                <div class="bot">{{item.content}}</div>
              </div>
            </div>
          </div>
          <div class="comment_top">
            <el-input type="textarea" v-model="conmment" maxlength="50" show-word-limit></el-input>
            <el-button type="primary" style="margin-left:10px;" @click="sunComment">发表评论</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 删除消息文章提示 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      :modal-append-to-body='false'
      width="20%">
      <span>是否删除该内容？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="danger" @click="deleteMessage()">删 除</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
//Api
import ledgerApi from "@/api/ledgerApi";
//store
import { mapGetters } from "vuex"
//组件
import jsonp from 'jsonp'
import { mavonEditor } from "mavon-editor"
import "mavon-editor/dist/css/index.css"
export default {
  name:'leavingmessage',
  props:{
    
  },
  components:{
    mavonEditor
  },
  data(){
    return{
      messageMenu:false,
      messageType:'',//留言类型
      doc:'', //文章内容
      message:'',
      messageAddState:false, //留言添加状态
      messageCoord:null,//留言坐标
      messageFileList:[],//文件列表
      deleteId:null,//要删除的留言ID
      clickPopup:null,
      messageList:[],
      article:'',//富文本内容
      expressForm:{ //开盘快报信息
        name:'',
        adress:'',
        landID:'',
        date:''
      },
      addMessageMaker:null,//添加消息文章提示maker
      showArticle:false,//显示文章内容
      articleHTML:'',//文章内容
      conmment:'',//文章评论
      curArticleId:null,//当前打开的文章ID
      conmmentArr:[],//文章评论数组
      dialogVisible:false,//删除提示dialog
    }
  },
  mounted(){
    
  },
  watch:{
    showMessage:{
      handler(newVal){
        var that = this
        let map  = that.ledger_map
        let message_source = map.getSource('message_source')
        if(newVal){
          if(message_source==undefined){
            setTimeout(()=>{
              that.mapEvents()
              that.addLayerIcons()
              setTimeout(()=>{
                that.loadMessageLinshiLayer()
                that.getMessageList()
              },500)
            },1500)
          }else{
            map.setLayoutProperty('message_clusters','visibility','visible')
            map.setLayoutProperty('message_clusterCount','visibility','visible')
            map.setLayoutProperty('message','visibility','visible')
          }
        }else{
          if(message_source!==undefined){
            map.setLayoutProperty('message_clusters','visibility','none')
            map.setLayoutProperty('message_clusterCount','visibility','none')
            map.setLayoutProperty('message','visibility','none')
          }
        }
      },
      deep:true
    },
    cityCode:{
      handler(newVal){
        if(this.showMessage){
          this.getMessageList()
        }
      },
      deep:true
    }
  },
  computed:{
    ...mapGetters(["showMessage","ledger_map","ledgerDraw","addLedgerInfo","plateData","cityCode"])
  },
  methods:{
    //文本编辑器更新
    updataDoc(markdown, html){
      // 此时会自动将 markdown 和 html 传递到这个方法中
      this.message = html
    },
    $imgAdd(pos, $file){
      var that = this
      // 第一步.将图片上传到服务器.
      var formdata = new FormData();
      formdata.append('file', $file);
      ledgerApi.fileUploads(formdata)
      .then(res=>{
        console.log('图片上传信息',res)
        if(res.data.code===0){
          that.$refs.editor.$img2Url(pos, res.data.data.src);
        }
      })
    },
    //地图事件
    mapEvents(){
      //地图点击事件
      let map = this.ledger_map
      map.on('click',e=>{
        if(this.messageAddState){
          this.messageCoord = e.lngLat.lng+','+e.lngLat.lat
          let geojson = {
            type:'FeatureCollection',
            features:[{
              type:'Feature',
              geometry:{
                type:'Point',
                coordinates:[e.lngLat.lng,e.lngLat.lat]
              }
            }]
          }
          map.getSource('messagelinshi_source').setData(geojson)
          this.addMessageMaker.remove()
          this.addMessageMaker = null
          this.messageAddState = false
          map.getCanvas().style.cursor = ''
        }
      })
      map.on('mousemove',e=>{
        if(this.messageAddState&&this.addMessageMaker != null){
          this.addMessageMaker.setLngLat([e.lngLat.lng,e.lngLat.lat])
          map.getCanvas().style.cursor = 'crosshair'
        }
      })
    },
    //地图图标
    addLayerIcons(){
      let map = this.ledger_map
      map.loadImage("http://47.104.165.136:8099/test/D2D/icons/icon_message.png", (error, icon_message) => {
        if (error) throw error;
        map.addImage("icon_message", icon_message);
      })
      map.loadImage("http://47.104.165.136:8099/test/D2D/icons/icon_article.png", (error, icon_article) => {
        if (error) throw error;
        map.addImage("icon_article", icon_article);
      })
    },
    //加载临时消息图标图层
    loadMessageLinshiLayer(){
      let map = this.ledger_map
      let source = map.getSource("messagelinshi_source")
      if(source==undefined){
        map.addSource("messagelinshi_source",{
          type:'geojson',
          data:{
            type:'FeatureCollection',
            features:[]
          }
        })
        map.addLayer({
          id: "messagelinshi",
          type: "symbol",
          source: "messagelinshi_source",
          layout: {
            "icon-image": "icon_message",
            "icon-allow-overlap":true,
            "icon-ignore-placement":true,
            "icon-size": 0.4,
            "visibility":"visible"
          },
          paint: {
            
          },
        });
      }
    },
    //获取消息列表数据
    getMessageList(){
      var that = this
      
      ledgerApi.getLandMessageList({"cityCode":that.cityCode})
      .then(res=>{
        if(res.data.code===0){
          console.log('消息列表',res)
          let data = res.data.data
          this.messageList = data
          let geojson = {
            'type':'FeatureCollection',
            'features':[]
          }
          data.forEach(item=>{
            if(item.url!==''&&item.url!==null){
              item.imgList = item.url.split(',')
            }
            let coordinates = item.coordinates.split(',')
            let createDate = item.createDate.split(' ')
            let obj = {
              'type':'Feature',
              'geometry':{
                'type':'Point',
                'coordinates':coordinates
              },
              'properties':{
                id:item.id,
                isself:item.isself,
                type:item.type,
                creator:item.creator,
                content:item.content,
                createDate:createDate[0]
              }
            }
            geojson.features.push(obj)
          })
          let map = this.ledger_map
          let message_source = map.getSource('message_source')
          if(message_source==undefined){
            map.addSource("message_source",{
              type:'geojson',
              data:{
                type:'FeatureCollection',
                features:[]
              },
              cluster:true,
              clusterMaxZoom: 14, // Max zoom to cluster points on
              clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
            })
             map.addLayer({ //聚合图层
              id: "message_clusters",
              type: "circle",
              source: "message_source",
              filter: ["has", "point_count"],
              paint: {
                "circle-color": [
                  "step",
                  ["get", "point_count"],
                  "#51bbd6",10,
                  "#f1f075",20,
                  "#f28cb1"
                ],
                "circle-radius": [
                  "step",
                  ["get", "point_count"],
                  10,10,
                  15,20,
                  20
                ],
                "circle-opacity":0.6
              },
              layout:{
                "visibility":"visible"
              }
            });
            map.addLayer({ //聚合图层数量
              id: "message_clusterCount",
              type: "symbol",
              source: "message_source",
              filter: ["has", "point_count"],
              layout: {
                "text-field": "{point_count_abbreviated}",
                "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                "text-size": 12,
                "visibility":"visible"
              },
              paint:{
                "text-color":"#fff"
              }
            });
            map.addLayer({ //消息图层
              id: "message",
              type: "symbol",
              source: "message_source",
              filter: ["!", ["has", "point_count"]],
              layout: {
                "icon-image": [
                  "match",
                  ["get","type"],
                  "article","icon_article",
                  "message","icon_message",
                  "message"
                ],
                "icon-allow-overlap":true,
                "icon-ignore-placement":true,
                "icon-size": 0.4,
                "visibility":"visible"
              },
              paint: {
                
              },
            })
            map.on('click', 'message_clusters', function (e) {
              var features = map.queryRenderedFeatures(e.point, { layers: ['message_clusters'] });
              var clusterId = features[0].properties.cluster_id;
              map.getSource('message_source').getClusterExpansionZoom(clusterId, function (err, zoom) {
                if (err)
                return;
                map.easeTo({
                  center: features[0].geometry.coordinates,
                  zoom: zoom
                });
              });
            });
            map.on('mouseenter', 'message_clusters', function () {
              map.getCanvas().style.cursor = 'pointer';
            });
            map.on('mouseleave', 'message_clusters', function () {
              map.getCanvas().style.cursor = '';
            });

            let messagePopup = new that.mbgl.Popup({offset:15,anchor:'left',closeButton: false})
            let messageInfoPopup = new that.mbgl.Popup({offset:15,anchor:'left',closeButton: true})
            that.clickPopup = messageInfoPopup
            map.on('mousemove','message',e=>{
              map.getCanvas().style.cursor = "pointer"

              let coordinates = [e.lngLat.lng,e.lngLat.lat];
              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              } 
              let type = e.features[0].properties.type
              let creator = e.features[0].properties.creator
              let content = e.features[0].properties.content
              let createDate = e.features[0].properties.createDate
              let htmlStr = ``
              if(type=="message"){
                htmlStr = `
                <div class="message_box">
                  <div class="message_cont"><span class="info_head">${creator}：</span>${content}</div>
                  <div class="message_info">
                    <div class="date"><span class="info_head">Time：</span>${createDate}</div>
                  </div>
                </div>`
              }else if(type=="article"){
                htmlStr = `
                <div class="message_box">
                  <div class="message_cont">点击图标查看文章详情</div>
                </div>`
              }
              
              messagePopup.setLngLat(coordinates).setHTML(htmlStr).addTo(map)
            })
            
            map.on('mouseleave', 'message' ,e=>{
              map.getCanvas().style.cursor = ""
              messagePopup.remove()
            })
            map.on('contextmenu','message',e=>{
              let isself = e.features[0].properties.isself
              if(isself){ //自己的消息可以删除
                let coordinates = [e.lngLat.lng,e.lngLat.lat];
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                  coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                } 
                let id = e.features[0].properties.id
                
                let type = e.features[0].properties.type
                that.deleteId = id
                let htmlStr = `
                <div class="message_box">
                  <div class="img_box">
                    <div class="info">
                      <div class="title">操作</div>
                      <div class="message_del">${type=="message"?"删除消息":"删除文章"}</div>
                    </div>
                  </div>
                </div>`
                messageInfoPopup.setLngLat(coordinates).setHTML(htmlStr).addTo(map)
                that.$('.message_del').on('click',()=>{
                  that.dialogVisible = true
                })
              }
            })
            map.on('click', 'message' ,e=>{
              let type = e.features[0].properties.type
              if(type=="article"){
                that.curArticleId = e.features[0].properties.id
                that.articleHTML = e.features[0].properties.content
                that.showArticle = true
                //获取文章评论
                that.articleComments()
              }else if(type=="message"){

              }
              
            })
          }
          map.getSource('message_source').setData(geojson)
        }
      })
      
    },
    //添加留言地图十字准线
    addMapInfo(val){
      if(val=='expressNews'||val=='share'){
        this.$message('暂未开放')
        return false
      }
      this.messageAddState = !this.messageAddState
      let map = this.ledger_map
      if(this.messageAddState){
        this.messageType = val
        map.getCanvas().style.cursor = "crosshair"
        if(this.addMessageMaker==null){
          let el = document.createElement('div');
          el.setAttribute('class', 'measure-result');
          el.innerHTML = '点击确认消息文章添加位置'
          var option = {
            element: el,
            anchor: 'top',
            offset: [0, -35]
          };
          this.addMessageMaker = new this.mbgl.Marker(option).setLngLat([0, 0]).addTo(map);
        }
      }else{
        map.getCanvas().style.cursor = ""
      }
    },
    //图片修改
    uploadFileChange(file,fileList){
      if(file.size/1024/1024 < 2){
        this.messageFileList.push(file)
      }else{
        this.$message.warning('图片'+file.name+'大小超过 2MB!')
      }
      console.log(this.messageFileList)
    },
    //删除留言
    deleteMessage(){
      this.dialogVisible = false
      let id = this.deleteId
      ledgerApi.deleteLandMessage([id])
      .then(res=>{
        if(res.data.code===0){
          this.$message('信息已删除')
          this.clickPopup.remove()
          this.deleteId = null
          this.getMessageList()
        }else{
          this.$message.error('信删除失败')
        }
      })
    },
    //取消留言
    cancelMessage(){
      let map = this.ledger_map
      this.messageCoord = null
      this.message = null
      this.messageFileList = []
      this.messageAddState = false
      this.getMessageList()
      map.getSource('messagelinshi_source').setData({
        type:'FeatureCollection',
        features:[]
      })
      map.getCanvas().style.cursor = ''
    },
    //提交留言
    subMessage(){
      var that = this
      let map = this.ledger_map
      if(this.message==null){
        this.$message.warning('请先输入内容')
      }else{
        // const formData = new FormData();
        // let mes = this.message.replace(/"/g,"'")
        // formData.append("type",that.messageType)
        // formData.append("content",mes)
        // formData.append("coordinates",this.messageCoord)
        
        // this.messageFileList.forEach(item=>{
        //   formData.append("file",item.raw,item.raw.name)
        // })
        let obj = {
          type:that.messageType,
          content:that.message,
          coordinates:that.messageCoord,
          cityCode:that.cityCode
        }
        ledgerApi.subLandMessage(obj)
        .then(res=>{
          if(res.data.code===0){
            this.$message.success('发表成功')
            this.messageCoord = null
            this.message = ''
            this.doc = ''
            this.messageFileList = []
            this.messageAddState = false
            this.getMessageList()
            map.getSource('messagelinshi_source').setData({
              type:'FeatureCollection',
              features:[]
            })
            map.getCanvas().style.cursor = ''
          }else{
            this.$message.error(res.data.msg)
          }
        })
      }
    },
    //文章评论
    articleComments(){
      var that = this
      ledgerApi.getArticleComments(that.curArticleId)
      .then(res=>{
        console.log('评论',res)
        if(res.data.code===0){
          that.conmmentArr = res.data.data.list
        }
      })
    },
    //提交评论
    sunComment(){
      var that = this
      if(that.conmment!==''){
        ledgerApi.subArticleComment({blogId:that.curArticleId,content:that.conmment})
        .then(res=>{
          if(res.data.code===0){
            that.$message.success('评论成功')
            that.conmment = ''
            that.articleComments()
          }
        })
      }else{
        that.$message('请先输入评论内容')
      }
    },
  }
 
}
</script>
<style lang="scss">
.leaving_message_wrap{
  position: relative;
  z-index: 99999;
  .v-note-wrapper.fullscreen{
    height: 100% !important;
  }
  .article_box{
      position: fixed;
      z-index: 999;
      width: 60%;
      left: 20%;
      top: 20px;
      bottom: 20px;
      background: rgb(255 255 255);
      border-radius: 4px;
      padding: 10px;
    .close{
      position: absolute;
      right: -60px;
      top: 10px;
    }
    .article_wrap{
      height: 99%;
      padding: 0.5%;
      display: flex;
      justify-content: space-between;
      .article{
        width: 65%;
        height: 100%;
        background: rgb(241,229,201);
        overflow-y: scroll;
        padding: 0 10px;
        border-radius: 4px;
      }
      .comment_box{
        width: 32%;
        height: 100%;
        border-radius: 4px;
        position: relative;
        .comment_top{
          position: absolute;
          width: calc(100% - 20px);
          padding: 10px;
          bottom: 0;
          display: flex;
          justify-content: space-between;
        }
        .comment_cont{
          width: 100%;
          height: calc(100% - 80px);
          .c_title{
            font-size: 14px;
            padding: 10px 0;
            width: 90%;
            margin: auto;
            border-bottom: #ccc 1px solid;
          }
          .user_commen{
            width: 90%;
            margin: auto;
            height: calc(100% - 50px);
            overflow-y: scroll;
            .con_item{
              padding: 10px 20px;
              background: #d8dcdf;
              margin-top: 10px;
              border-radius: 4px;
              .top{
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 5px;
                .user_name{
                  font-size: 14px;
                  font-weight: bold;
                  color: #000;
                }
                .date{
                  font-size: 12px;
                  color: #606266;
                }
              }
              .bot{
                font-size: 14px;
                color: #333;
              }
            }
          }
        }
      }
    }
    
  }
  .message_btns{
    position: fixed;
    right: 47px;
    bottom: 188px;
    z-index: 999;
    .plus {
      width: 50px;
      cursor:pointer;
      transition: all .3s ease 0s;
      height: 50px;
      background: #ffe581;
      border-radius: 50%;
      display: flex;
      position: relative;
      &__line {
        width: 3px;
        height: 25px;
        background: rgba(0,0,0,0.8);
        border-radius:10px;
        position: absolute;
        left: calc(50% - 1.5px);
        top: calc(50% - 12.5px);
        &--h {
          transform: rotate(90deg);
        } 
        &--v {
          display: flex;
          align-items: center;
          justify-content: space-around;
          overflow: hidden;
          transition: all .4s ease 0s;
        }
      }
      &__link {
        color: #fff;
        font-size: 30px;
        opacity: 0;
        visibility: hidden;
        transition : .3s ease 0s;
        transform:scale(.5);
      }
      &--active {
        height:32px;
        border-radius:30px;
        .plus__line--v {
          height: 68px;
          top: calc(-100% + 15px);
          padding:0 5px;
          box-sizing:border-box;
          width: 220px; 
          border-radius: 60px;
          left: calc(50% - 270px);
        }
        .icon_wrap{
          width: 25%;
          text-align: center;
          margin-top: -16px;
          .menu_name{
            font-size: 12px;
            color: #fff;
            transition-delay: .05s;
          }
          .plus__link{
            opacity:1;
            visibility:visible;
            transform:scale(1);
            transition-delay: .05s;
            margin-top: -15px;
          }
          &:hover .menu_name{
            color: #ffe581;
          }
          &:hover .plus__link{
            color: #ffe581;
          }
        }
        
      }
    }

    .centered {
      display: flex;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
    }
  }
  .message_cont{
    position: fixed;
    width: 300px;
    left: calc(50% - 150px);
    bottom: 10%;
    z-index: 999;
    background: rgba(4,4,4,0.5);
    border-radius: 4px;
    padding:10px;
  }
  .article_cont{
    position: fixed;
    width: 60%;
    left: 20%;
    top: 20%;
    z-index: 999;
    background: rgba(4,4,4,0.5);
    border-radius: 4px;
    padding:10px;
    
  }
  .express_editor{
    .title{
      text-align: center;
      font-size: 14px;
      color: #ccc;
      margin-bottom: 10px;
    }
    .el-form-item__label{
      color: #e6a23c;
    }
  }
  .upload_box{}
  .box_item{
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
    .title{
      padding-bottom: 5px;
    }
  }
}
.message_box{
  max-width: 500px;
  max-height: 400px;
  overflow-y: scroll;
  img{
    max-width: 100%;
  }
  .message_cont{
    font-size: 12px;
    margin-bottom: 10px;
    color: #67c23a;
  }
  .message_info{
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    color: #c5c5c5;
  }
  .info_head{
    color: #f60;
  }
  .info{
    font-size: 12px;
    .message_del{
      cursor: pointer;
      color: #f60;
    }
  }
  .img_list{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .img_item{
      width: 32%;
      margin-bottom: 10px;
      overflow: hidden;
      .img{
        width: 100%;
      }
    }
  }
}
</style>