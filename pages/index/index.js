import * as THREE from '../../utils/three.weapp.js'
import getControl from '../../utils/TrackballControls.js'
let { TrackballControls } = getControl(THREE);
let window = THREE.global;
import ResourceTracker from '../../utils/ResourceTracker';
const app = getApp()
const resMgr = new ResourceTracker();
const track = resMgr.track.bind(resMgr);

Page({
  data: {
    canvas: null,
    statusBarHeight:app.globalData.statusBarHeight,
    showFirstBox:false,
    showRememberBox:false,
    showEditBox:false,
    showEditBoxAni:false,
    starType:'world',
    loading:true,
    showNum:false,
    position:{
      x:0,
      y:0
    },
    memoryIdArr:[],
    memoryInfo:{},
    showLovePrattle:false,
    loadingText:'加载星空中...'
  },
  preView(e){
    wx.previewImage({
      urls: [e.currentTarget.dataset.src],
    })
  },
  // showLoveFirst(){
  //   this.setData({
  //     showLoveFirstStep:true
  //   })
  //   setTimeout(_=>{
  //     this.setData({
  //       showLoveFirstStep:false
  //     })
  //   },1000)
  // },
  showLove(e){
    this.setData({
      showLovePrattle:true
    })
  },
  cutStar(){
    if(this.data.starType === 'world'){
      this.scene.children.forEach(item=>{
        if(item.name === 'world'){
          item.visible = false
        }else{
          item.visible = true
        }
      })
    }else if(this.data.starType === 'person'){
      this.scene.children.forEach(item=>{
        item.visible = true
      })
    }
    this.render.render(this.scene, this.camera);
    console.log(this.scene.children)
    this.setData({
      starType:this.data.starType === 'world'?'person':'world',
      // memoryIdArr:[]
    })
  },
  showInfo(){
    this.setData({
      showFirstBox:true
    })
  },
  closeFirstBox(){
    this.setData({
      showFirstBox:false,
      showLovePrattle:false
    })
  },
  closeRememberBox(){
    this.setData({
      showRememberBox:false
    })
  },
  show_edit(){
    this.setData({
      showEditBox:true
    })
    setTimeout(_=>{
      this.setData({
        showEditBoxAni:true
      })
    },10)
  },
  hide_edit(){
    this.setData({
      showEditBoxAni:false
    })
    setTimeout(_=>{
      this.setData({
        showEditBox:false
      })
    },310)
  },
  no_touch(){
    return;
  },
  chooseImage(){
    wx.chooseImage({
      count: 1,
      sourceType:['album'],
      success:res=>{
        console.log(res)
        this.setData({
          imagePath:res.tempFilePaths[0]
        })
        this.checkForm()
      }
    })
  },
  name_input(e){
    this.setData({
      name:e.detail.value
    })
    this.checkForm()
  },
  memory_input(e){
    this.setData({
      memory:e.detail.value
    })
    this.checkForm()
  },
  submit(){
    if(this.data.canSubmit){
      wx.showToast({
        title: '正在打包你的记忆~\n(๑•̀ㅂ•́)و✧',
        icon:'none',
        mask:true,
        duration:9000
      })
      wx.cloud.callFunction({
        name: "msgCheck",
        data: {
          content: this.data.memory
        }
      }).then(res=>{
        if(res.result.errCode === 0){
          let secret = Math.floor(Math.random() * 2821109907455).toString(36).toUpperCase()
          wx.cloud.uploadFile({
            cloudPath: `photos/${secret}.png`,
            filePath: this.data.imagePath,
            success:res=>{
              console.log(res.fileID)
              wx.cloud.callFunction({
                name:'addMemory',
                data:{
                  image:res.fileID,
                  author:this.data.name,
                  memory:this.data.memory
                }
              }).then(res=>{
                wx.showToast({
                  title: '上传成功~⊙▽⊙',
                  icon:'none'
                })
                this.hide_edit()
                this.setData({
                  name:'',
                  memory:'',
                  imagePath:'',
                  memoryCount:this.data.memoryCount + 1,
                  personCount:this.data.personCount + 1,
                  canSubmit:false
                })
                var vertexShader	= [
                  'varying vec3	vVertexWorldPosition;',
                  'varying vec3	vVertexNormal;',
                  'varying vec4	vFragColor;',
                  'void main(){',
                  '	vVertexNormal	= normalize(normalMatrix * normal);',//将法线转换到视图坐标系中
                  '	vVertexWorldPosition	= (modelMatrix * vec4(position, 1.0)).xyz;',//将顶点转换到世界坐标系中
                  '	// set gl_Position',
                  '	gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
                  '}'
              ].join('\n');
              var fragmentShader	= [
                'uniform vec3	glowColor;',
                'uniform float	coeficient;',
                'uniform float	power;',
                'varying vec3	vVertexNormal;',
                'varying vec3	vVertexWorldPosition;',
                'varying vec4	vFragColor;',
                'void main(){',
                '	vec3 worldVertexToCamera= cameraPosition - vVertexWorldPosition;',	//世界坐标系中顶点位置到相机位置到的距离
                '	vec3 viewCameraToVertex	= (viewMatrix * vec4(worldVertexToCamera, 0.0)).xyz;',//视图坐标系中从相机位置到顶点位置的距离
                '	viewCameraToVertex	= normalize(viewCameraToVertex);',//规一化
                '	float intensity		= coeficient + dot(vVertexNormal, viewCameraToVertex);',
                '	if(intensity > 0.95){ intensity = 0.0;}',
                '	gl_FragColor		= vec4(glowColor, intensity);',
                '}'//vVertexNormal视图坐标系中点的法向量
                //viewCameraToVertex视图坐标系中点到摄像机的距离向量
                //dot点乘得到它们的夹角的cos值
                //从中心向外面角度越来越大（从锐角到钝角）从cos函数也可以知道这个值由负变正，不透明度最终从高到低
              ].join('\n');
                let randomColor = [0xE77051,0xDED0C1,0xAB8158,0xB9A26A,0xCBC8C2,0xBD9680,0xD8CCF4,0x9A6436,0xFEE58B,0xE0C5DF]
                console.log(this.latitude)
                let random = parseInt(Math.random() * 10)
                let randomSize = Math.random() * 3  + 5
                let  ball_geometry = new THREE.SphereBufferGeometry( randomSize + 16, 32, 32 );
                let  ball_geometry_1 = new THREE.SphereBufferGeometry( randomSize , 32, 32 );
                let  ball_material 	= new THREE.ShaderMaterial({
                  uniforms: {
                      coeficient	: {
                          type	: "f",
                          value	: -0.75
                      },
                      power		: {
                          type	: "f",
                          value	: 6
                      },
                      glowColor	: {
                          type	: "c",
                          value	: new THREE.Color(randomColor[random])
                      }
                  },
                  vertexShader	: vertexShader,
                  fragmentShader	: fragmentShader,
                  blending	: THREE.NormalBlending,
                  transparent	: true,
                });
                let  ball_material_1 = new THREE.MeshPhongMaterial( {color:randomColor[random]});
                let  ball_sphere = new THREE.Mesh( ball_geometry, ball_material );
                let  ball_sphere_1 = new THREE.Mesh( ball_geometry_1, ball_material_1 );
                let positions = [ (Math.random() - 0.5) * this.latitude,(Math.random() - 0.65) * this.latitude, (Math.random() - 0.5) * this.latitude]
                ball_sphere.position.x = positions[0];
                ball_sphere.position.y = positions[1];
                ball_sphere.position.z = positions[2];
                ball_sphere.updateMatrix();
                ball_sphere.matrixAutoUpdate = false;
                ball_sphere.name = 'person'
                this.scene.add(ball_sphere);
                ball_sphere_1.position.x = positions[0];
                ball_sphere_1.position.y = positions[1];
                ball_sphere_1.position.z = positions[2];
                ball_sphere_1.updateMatrix();
                ball_sphere_1.matrixAutoUpdate = false;
                ball_sphere_1.name = 'person'
                this.scene.add(ball_sphere_1);
              }).catch(err=>{
                wx.showToast({
                  title: '服务器崩惹 (^～^;)ゞ',
                  icon:'none'
                })
              })
            },
            fail:res=>{
              wx.showToast({
                title: '服务器崩惹 (^～^;)ゞ',
                icon:'none'
              })
            }
          })
        }else{
          wx.showToast({
            title: 'ohh!内容违规惹~╥﹏╥...',
            icon:'none'
          })
        }
      })
    }
  },
  checkForm(){
    if(this.data.name !== '' && this.data.name !==undefined && this.data.memory !== '' && this.data.memory !==undefined && this.data.imagePath !== undefined){
      this.setData({
        canSubmit:true
      })
    }else{
      this.setData({
        canSubmit:false
      })
    }
  },
  onLoad: async function (options) {
    const Platform = wx.getSystemInfoSync().platform
    if(Platform === 'mac' || Platform === 'windows'){
      this.setData({
        loading:true,
        loadingText:'暂不支持PC端...'
      })
      return ;
    }
    let res = await wx.cloud.callFunction({
      name:'memoryCount',
    })
    this.setData({
      memoryCount:res.result.world.total,
      showNum:true,
      personCount:res.result.person.total
    })
    let memoryCount = this.data.memoryCount>2000?2000:this.data.memoryCount
    let worldCount = memoryCount - res.result.person.total
    let personCount = res.result.person.total
    let latitude
    if(memoryCount < 666) latitude =  1000
    if(memoryCount >= 666 &&  memoryCount <= 1333) latitude =  2000
    if(memoryCount > 1333) latitude =  3000
    this.latitude = latitude
    wx.cloud.callFunction({
      name:'addUser',
      success:res=>{
        if(res.result.code === 0){
          this.showInfo()
        }
      }
    })
    let that = this;
    wx.createSelectorQuery()
      .select('#c')
      .node()
      .exec((res) => {
        const canvas = THREE.global.registerCanvas(res[0].node);
        that.setData({
          canvas: canvas
        })
        const params = {
          orthographicCamera: false
        };
        const frustumSize = 400;
        const aspect = window.innerWidth / window.innerHeight;
        const perspectiveCamera = new THREE.PerspectiveCamera(90, aspect, 100, 2000);
        perspectiveCamera.position.z = 500;
        perspectiveCamera.position.y = 350;
        const orthographicCamera = new THREE.OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000);
        orthographicCamera.position.z = 500;
        this.camera = perspectiveCamera;
        
        // world
        const scene = new THREE.Scene();
        // scene.background = new THREE.Color(0x11151B);
        scene.fog = new THREE.FogExp2(0xcccccc, 0.002);
        let directionalLight = new THREE.DirectionalLight( 0xffeedd );
        directionalLight.position.set( 0, 1, 0 );
        scene.add( directionalLight );
        this.scene = scene
        track(scene);
        // const geometry = new THREE.CylinderBufferGeometry(0, 10, 30, 4, 1);
        // const material = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true });
        var vertexShader	= [
              'varying vec3	vVertexWorldPosition;',
              'varying vec3	vVertexNormal;',
              'varying vec4	vFragColor;',
              'void main(){',
              '	vVertexNormal	= normalize(normalMatrix * normal);',//将法线转换到视图坐标系中
              '	vVertexWorldPosition	= (modelMatrix * vec4(position, 1.0)).xyz;',//将顶点转换到世界坐标系中
              '	// set gl_Position',
              '	gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
              '}'
          ].join('\n');
          var fragmentShader	= [
            'uniform vec3	glowColor;',
            'uniform float	coeficient;',
            'uniform float	power;',
            'varying vec3	vVertexNormal;',
            'varying vec3	vVertexWorldPosition;',
            'varying vec4	vFragColor;',
            'void main(){',
            '	vec3 worldVertexToCamera= cameraPosition - vVertexWorldPosition;',	//世界坐标系中顶点位置到相机位置到的距离
            '	vec3 viewCameraToVertex	= (viewMatrix * vec4(worldVertexToCamera, 0.0)).xyz;',//视图坐标系中从相机位置到顶点位置的距离
            '	viewCameraToVertex	= normalize(viewCameraToVertex);',//规一化
            '	float intensity		= coeficient + dot(vVertexNormal, viewCameraToVertex);',
            '	if(intensity > 0.95){ intensity = 0.0;}',
            '	gl_FragColor		= vec4(glowColor, intensity);',
            '}'//vVertexNormal视图坐标系中点的法向量
            //viewCameraToVertex视图坐标系中点到摄像机的距离向量
            //dot点乘得到它们的夹角的cos值
            //从中心向外面角度越来越大（从锐角到钝角）从cos函数也可以知道这个值由负变正，不透明度最终从高到低
          ].join('\n');
        let randomColor = [0xE77051,0xDED0C1,0xAB8158,0xB9A26A,0xCBC8C2,0xBD9680,0xD8CCF4,0x9A6436,0xFEE58B,0xE0C5DF,0x8171B7,0x95BCF7,0xCFC6BA,0xE8FFFF]
        let addStar = (count,type,latitude)=>{
          for (let i = 0; i <count; i++) {
            let random = parseInt(Math.random() * 14)
            let randomSize = Math.random() * 3  + 5
            let  ball_geometry = new THREE.SphereBufferGeometry( randomSize + 16, 32, 32 );
            let  ball_geometry_1 = new THREE.SphereBufferGeometry( randomSize , 32, 32 );
            let  ball_material 	= new THREE.ShaderMaterial({
              uniforms: {
                  coeficient	: {
                      type	: "f",
                      value	: -0.75
                  },
                  power		: {
                      type	: "f",
                      value	: 6
                  },
                  glowColor	: {
                      type	: "c",
                      value	: new THREE.Color(randomColor[random])
                  }
              },
              vertexShader	: vertexShader,
              fragmentShader	: fragmentShader,
              blending	: THREE.NormalBlending,
              transparent	: true,
            });
            let  ball_material_1 = new THREE.MeshPhongMaterial( {color:randomColor[random]});
            let  ball_sphere = new THREE.Mesh( ball_geometry, ball_material );
            let  ball_sphere_1 = new THREE.Mesh( ball_geometry_1, ball_material_1 );
            let positions = [ (Math.random() - 0.5) * latitude,(Math.random() - 0.65) * latitude, (Math.random() - 0.5) * latitude]
            ball_sphere.position.x = positions[0];
            ball_sphere.position.y = positions[1];
            ball_sphere.position.z = positions[2];
            ball_sphere.updateMatrix();
            ball_sphere.matrixAutoUpdate = false;
            ball_sphere.name = type
            this.scene.add(ball_sphere);
            ball_sphere_1.position.x = positions[0];
            ball_sphere_1.position.y = positions[1];
            ball_sphere_1.position.z = positions[2];
            ball_sphere_1.updateMatrix();
            ball_sphere_1.matrixAutoUpdate = false;
            ball_sphere_1.name = type
            this.scene.add(ball_sphere_1);
          }
        }
        addStar(worldCount,'world',latitude)
        addStar(personCount,'person',latitude)
        // lights

        {
          let dlight = new THREE.DirectionalLight(0xffffff);
          dlight.position.set(1, 1, 1);
          scene.add(dlight);

          let Dlight = new THREE.DirectionalLight(0x002288);
          Dlight.position.set(- 1, - 1, - 1);
          scene.add(Dlight);

          let Alight = new THREE.AmbientLight(0x222222);
          scene.add(Alight);
        }
        // renderer

        const renderer = new THREE.WebGLRenderer({ antialias: true,alpha: true  });
        renderer.setClearAlpha(0.1);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        this.render = renderer
        const controls = new TrackballControls(perspectiveCamera, renderer.domElement);
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.5;
        controls.panSpeed = 0.8;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;
        controls.keys = [65, 83, 68];
        controls.addEventListener('change', render);
        window.addEventListener('resize', onWindowResize, false);

        function onWindowResize() {
          var aspect = window.innerWidth / window.innerHeight;
          perspectiveCamera.aspect = aspect;
          perspectiveCamera.updateProjectionMatrix();
          orthographicCamera.left = - frustumSize * aspect / 2;
          orthographicCamera.right = frustumSize * aspect / 2;
          orthographicCamera.top = frustumSize / 2;
          orthographicCamera.bottom = - frustumSize / 2;
          orthographicCamera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
          // controls.handleResize();
          render();
        }

        function animate() {
          that.animateId = canvas.requestAnimationFrame(animate);
          controls.update();
        }
        function render() {
          let camera = (params.orthographicCamera) ? orthographicCamera : perspectiveCamera;
          renderer.render(scene, camera);
        }
        render();
        animate();
        this.setData({
          loading:false
        })
        if(options.id){
          console.log(options.id)
          wx.cloud.callFunction({name:'searchById',data:{id:options.id}}).then(res=>{
            this.setData({
              showRememberBox:true,
              memoryInfo:res.result.data[0]
            })
          })
        }
      })
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();
      wx.showShareMenu({
        withShareTicket:true,
        menus:['shareAppMessage','shareTimeline']
      })
  },
  onUnload: function () {
    let that = this;
    that.data.canvas.cancelAnimationFrame(that.animateId);
    that.animateId = null;
    that.setData({
      canvas: null
    });
    THREE.global.clearCanvas();
    resMgr.dispose();
  },
  touchStart(e) {
    THREE.global.touchEventHandlerFactory('canvas', 'touchstart')(e)
  },
  touchMove(e) {
    THREE.global.touchEventHandlerFactory('canvas', 'touchmove')(e)
  },
  touchEnd(e) {
    THREE.global.touchEventHandlerFactory('canvas', 'touchend')(e)
  },
  touchCancel(e) {
    // console.log('canvas', e)
  },
  longTap(e) {
    // console.log('canvas', e)
  },
  tap(e) {
    let touch = e.touches[0];
    this.setData({
      position:{x:touch.pageX,y:touch.pageY}
    })
    this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = - (touch.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    var intersects = this.raycaster.intersectObjects(this.scene.children);
    if(intersects.length){
      // setTimeout(_=>{
      //   this.setData({
      //     showRememberBox:true
      //   })
      // },300)
      this.setData({
        loading:true,
        loadingText:'探索星球中...'
      })
      let min = Math.min.apply(Math,intersects.map(item=>item.distance))
      intersects.forEach(item=>{
        if(item.distance === min){
          this.searchInfo(item)
        }
      })
    }
    // this.render.render(this.scene, this.camera);
  },
  searchInfo: async function(memory){
    if(memory.object.name === 'world'){
      console.log(memory.object.userData)
      if(Object.keys(memory.object.userData).length === 0){
          let result = await  wx.cloud.callFunction({name:'worldInfo',data:{idArr:this.data.memoryIdArr}})
          let data = result.result.data[0]
          let arr = this.data.memoryIdArr
          arr.push(data._id)
          this.setData({
            memoryIdArr:arr,
            memoryInfo:data,
            showRememberBox:true,
            loading:false
          })
          memory.object.userData= data
      }else{
        this.setData({
          memoryInfo:memory.object.userData,
          showRememberBox:true,
          loading:false
        })
      }
    }else if(memory.object.name === 'person'){
      if(Object.keys(memory.object.userData).length === 0){
        let result = await  wx.cloud.callFunction({name:'personInfo',data:{idArr:this.data.memoryIdArr}})
          let data = result.result.data[0]
          memory.object.userData = data
          let arr = this.data.memoryIdArr
          arr.push(data._id)
          this.setData({
            memoryIdArr:arr,
            memoryInfo:data,
            showRememberBox:true,
            loading:false
          })
      }else{
        this.setData({
          memoryInfo:memory.object.userData,
          showRememberBox:true,
          loading:false
        })
      }
    }
    
  },
  documentTouchStart(e) {
    // console.log('document',e)
  },
  documentTouchMove(e) {
    // console.log('document',e)
  },
  documentTouchEnd(e) {
    // console.log('document',e)
  },
  onShareAppMessage(e){
    console.log(this.data.memoryInfo)
    console.log(e)
    if(e.from === 'button'){
      return{
        title:'来自' + this.data.memoryInfo.author + '的记忆~',
        path:`/pages/index/index?id=${this.data.memoryInfo._id}`,
        imageUrl:this.data.memoryInfo.image
      }
    }else if(e.from === 'menu'){
      return{
        title:'每一片记忆都是一颗星球。',
        path:`/pages/index/index`,
        imageUrl:"../../image/shareImg.png"
      }
    }
  }
})
