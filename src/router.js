import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
export const MY_ROUTES = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login.vue")
  },
  {
    path: "/shareland",
    name: "Shareland",
    component: () => import("@/views/ShareLand.vue")
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/NotFound.vue")
  }
]
export default new Router({
  mode:"hash",
  routes:MY_ROUTES
})
// export default new Router({
//   mode: 'hash',
//   routes: [
//     {
//       path: "/login",
//       name: "Login",
//       component: () => import("@/views/Login.vue")
//     },
//     {
//       path: "/",
//       name: "Home",
//       component: () => import("@/views/Home.vue"),
//       children:[
//         {
//           path: "/landmap",
//           name: "Landmap",
//           component: () => import("@/views/TzyMap.vue")
//         },
//         {
//           path: "/citymap",
//           name: "Citymap",
//           component: () => import("@/views/CityMap.vue")
//         },
//         {
//           path: "/customerSituation",
//           name: "CustomerSituation",
//           component: () => import("@/views/CustomerSituation.vue")
//         },
//         {
//           path: "/houseData",
//           name: "HouseData",
//           component: () => import("@/views/HouseData.vue")
//         },
//         {
//           path: "/macroData",
//           name: "MacroData",
//           component: () => import("@/views/MacroData.vue")
//         },
//         {
//           path: "/staticCalc",
//           name: "StaticCalc",
//           component: () => import("@/views/StaticCalc.vue")
//         },
//       ],
//       redirect:"/landmap"
//     } 
//   ]
// });

 