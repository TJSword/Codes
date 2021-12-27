import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import mapBoxGl from 'mapbox-gl'
import './assets/scss/home.scss'
import './assets/scss/public.scss'
import '@/assets/css/mapbox-gl.css'
import $ from 'jquery'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import 'element-ui/lib/theme-chalk/index.css'
Vue.prototype.$ = $
Vue.prototype.mbgl = mapBoxGl
Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
