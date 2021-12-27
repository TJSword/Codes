import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import * as echarts from 'echarts'
import $ from 'jquery'
import "@/permission"
import '@/icons'
import './assets/scss/home.scss'
import './assets/scss/public.scss'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import mapBoxGl from 'mapbox-gl'
import ElementUI from 'element-ui'
import Contextmenu from "vue-contextmenujs"

import 'element-ui/lib/theme-chalk/index.css'
import 'element-tiptap/lib/index.css';
import '@/assets/css/mapbox-gl.css'
import dataV from '@jiaminghi/data-view'
Vue.config.productionTip = false
Vue.config.silent = true
Vue.prototype.$ = $
Vue.prototype.$echarts = echarts
Vue.prototype.mbgl = mapBoxGl
Vue.prototype.geoserverURL = 'http://47.104.165.136:8070'
Vue.prototype.imgUploadURL = process.env.BASE_URL

Vue.use(dataV)
Vue.use(ElementUI)
Vue.use(Contextmenu);


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
console.log(process.env)
