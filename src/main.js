import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import echarts from 'echarts'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/mapbox-gl.css'
import mapBoxGl from 'mapbox-gl'
import $ from 'jquery'
import dataV from '@jiaminghi/data-view'

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.prototype.mbgl = mapBoxGl
Vue.prototype.$ = $
Vue.prototype.geoserverURL = 'http://47.104.165.136:8070'
Vue.prototype.mapAccessToken = "pk.eyJ1Ijoibm9jb25yaWFuZGVyIiwiYSI6ImNrMjQ1dGNrNDIwdWMzZXVnN3VwbnV4NW4ifQ.D7k8xizdEAG4ucy3vAhNFg"


Vue.use(ElementUI)
Vue.use(dataV)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
