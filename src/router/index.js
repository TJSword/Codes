import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/common/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/common/Login.vue')
  },
  {
    path: '/land',
    name: 'Land',
    component: () => import('../views/land/Land.vue'),
    redirect:'/land/query',
    children:[{
      path:'/land/query',
      name:'LandQuery',
      component:() =>import('../views/land/LandQuery.vue')
    },{
      path:'/land/statistics',
      name:'LandStatistics',
      component:() =>import('../views/land/LandStatistics.vue')
    },{
      path:'/land/rank',
      name:'LandRank',
      component:()=>import('../views/land/LandRank.vue')
    }]
  },
  {
    path:'/house',
    name:'House',
    component:() => import('../views/house/House.vue'),
    redirect:'/house/query',
    children:[{
      path:'/house/query',
      name:'HouseQuery',
      component:() =>import('../views/house/HouseQuery.vue')
    },
    {
      path:'/house/statistics',
      name:'HouseStatistics',
      component:() =>import('../views/house/HouseStatistics.vue')
    },
    { path:'/house/news',
      name:'HouseNews',
      component:()=>import('../views/house/HouseNews.vue')
    },
    { path:'/house/rank',
    name:'HouseRank',
    component:()=>import('../views/house/HouseRank.vue')
  }]
  },
  {
    path:'/market',
    name:'Market',
    component:() => import('../views/market/Market.vue'),
    redirect:'/market/news',
    children:[{
      path:'/market/news',
      name:'MarketNews',
      component:()=>import('../views/market/MarketNews.vue')
    },{
      path:'/market/newsmap',
      name:'MarketNewsMap',
      component:()=>import('../views/market/MarketNewsMap.vue')
    }]
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
