import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import * as echarts from 'echarts';
import $ from 'jquery'
import "@/permission"
import '@/icons'
import './assets/scss/home.scss'
import './assets/scss/public.scss'
import './assets/iconfonts/iconfont.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import mapBoxGl from 'mapbox-gl'
//import ElementUI from 'element-ui'
import ElementUI from '@femessage/element-ui'
//复制到剪切板
import VueClipboard from 'vue-clipboard2'

import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/mapbox-gl.css'
import dataV from '@jiaminghi/data-view'
Vue.config.productionTip = false
Vue.prototype.$ = $
Vue.prototype.$echarts = echarts
Vue.prototype.mbgl = mapBoxGl
//geoserver图层服务地址
Vue.prototype.geoserverURL = 'http://47.104.165.136:8070'
//websocket 地址
//Vue.prototype.socketURL = 'ws://192.168.3.211:8282/dmc-web/websocket' //调试
//Vue.prototype.socketURL = 'ws://118.190.150.38:8282/dmc-web/websocket' //测试：118.190.150.38
Vue.prototype.socketURL = 'ws://47.108.208.24:8282/dmc-web/websocket' //正式：47.108.208.24
Vue.use(ElementUI)
Vue.use(VueClipboard)
Vue.use(dataV)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
console.log(process.env)
