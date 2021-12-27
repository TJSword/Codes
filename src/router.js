import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: "/login",
      name: "Login",
      component: () => import("./views/Login.vue")
    },
    {
      path: "/",
      name: "Home",
      component: () => import("./views/Home.vue"),
      children:[
        {
          path: "/menuindex",
          name: "Menuindex",
          component: () => import("./views/MenuIndex.vue")
        },
        {
          path: "/exhibition",
          name: "Exhibition",
          component: () => import("./views/Exhibition.vue")
        },
        {
          path: "/dataquery",
          name: "DataQuery",
          component: () => import("./views/DataQuery.vue")
        },
        {
          path: "/analysistools",
          name: "Analysistools",
          component: () => import("./views/analysisTools/AnalysisTools.vue"),
          children:[
            {
              path:'/analysistools/matrix',
              name:"Matrix",
              component: () => import("./views/analysisTools/Matrix.vue")
            },
            {
              path:'/analysistools/plategrade',
              name:"Commongrade",
              component: () => import("./views/analysisTools/Plategrade.vue")
            },
            {
              path:'/analysistools/condition',
              name:"Condition",
              component: () => import("./views/analysisTools/Condition.vue")
            },
            {
              path:'/analysistools/houseEva',
              name:"HouseEva",
              component: () => import("./views/analysisTools/HouseEva.vue")
            },
            {
              path:'/analysistools/isochronousCircle',
              name:"IsochronousCircle",
              component: () => import("./views/analysisTools/IsochronousCircle.vue")
            },
            {
              path:'/analysistools/pipe',
              name:"Pipe",
              component: () => import("./views/analysisTools/Pipe.vue")
            },
            {
              path:'/analysistools/population',
              name:"Population",
              component: () => import("./views/analysisTools/population.vue")
            }

          ],redirect:"/analysistools/matrix"
        },
        {
          path: "/ledgermap",
          name: "Ledgermap",
          component: () => import("./views/LedgerMap.vue")
        },
        {
          path: "/landReport",
          name: "LandReport",
          component: () => import("./views/LandReport/LandReportIndex.vue"),
          redirect:"/landReport/reportList",
          children:[{
            path:'/landReport/establish',
            name:"Establish",
            component: () => import("./views/LandReport/Establish.vue")
          },{
            path:'/landReport/reportList',
            name:"ReportList",
            component: () => import("./views/LandReport/ReportList.vue")
          },{
            path:'/landReport/redact',
            name:"Redact",
            component: () => import("./views/LandReport/Redact.vue")
          },{
            path:'/landReport/reportDetail',
            name:"RreportDetail",
            component: () => import("./views/LandReport/ReportDetail.vue")
          },{
            path:'/landReport/cdtest',
            name:"Cd",
            component: () => import("./views/LandReport/CdTest.vue"),
            children:[{
              path:'/landReport/cdtest/cd',
              name:"CdTest",
              component: () => import("@/components/report/CompetitorDistribution.vue"),
            },{
              path:'/landReport/cdtest/cdinfo',
              name:"Cdinfo",
              component: () => import("@/components/report/Cd_infos.vue"),
            },{
              path:'/landReport/cdtest/cdqh',
              name:"Cdqh",
              component: () => import("@/components/report/Cd_qh.vue"),
            },{
              path:'/landReport/cdtest/houseratio',
              name:"Houseratio",
              component: () => import("@/components/report/House_ratio.vue"),
            },{
              path:'/landReport/cdtest/pricefitting',
              name:"Pricefitting",
              component: () => import("@/components/report/PriceFittingNode.vue"),
            }],
            redirect:"/landReport/cdtest/cd"
          }]
        },
        {
          path: "/projectevaluation",
          name: "Projectevaluation",
          component: () => import("./views/projectEvaluation/ProjectEvaluation.vue")
        },
        {
          path: "/projectDetail",
          name: "ProjectDetail",
          component: () => import("./views/projectEvaluation/ProjectDetail.vue"),
          children:[{
            path:'/ProjectDetail/basics',
            name:"Basics",
            component: () => import("./views/projectEvaluation/Basics.vue")
          },
        {
          path:'/projectDetail/land',
          name:"Land",
          component: () => import("./views/projectEvaluation/Land.vue")
        },{
          path:'/projectDetail/planning',
          name:"Planning",
          component: () => import("./views/projectEvaluation/ChildDetail.vue")
        },{
          path:'/projectDetail/product',
          name:"Product",
          component: () => import("./views/projectEvaluation/ChildDetail.vue")
        },{
          path:'/projectDetail/marketing',
          name:"Marketing",
          component: () => import("./views/projectEvaluation/ChildDetail.vue")
        },{
          path:'/projectDetail/sale',
          name:"Sale",
          component: () => import("./views/projectEvaluation/Sale.vue")
        },{
          path:'/projectDetail/planning/note',
          name:"PlanningNote",
          component: () => import("./views/projectEvaluation/Note.vue")
        },{
          path:'/projectDetail/product/note',
          name:"ProductNote",
          component: () => import("./views/projectEvaluation/Note.vue")
        },{
          path:'/projectDetail/marketing/note',
          name:"MarketingNote",
          component: () => import("./views/projectEvaluation/Note.vue")
        },{
          path:'/projectDetail/planning/writeNote',
          name:"PlanningWriteNote",
          component: () => import("./views/projectEvaluation/WriteNote.vue")
        },{
          path:'/projectDetail/product/writeNote',
          name:"ProductWriteNote",
          component: () => import("./views/projectEvaluation/WriteNote.vue")
        },{
          path:'/projectDetail/marketing/writeNote',
          name:"MarketingWriteNote",
          component: () => import("./views/projectEvaluation/WriteNote.vue")
        }],redirect:'projectDetail/basics'
        },
        {
          path: "/projectorientation",
          name: "Projectorientation",
          component: () => import("./views/ProjectOrientation.vue")
        },
        {
          path:"/department",
          name:"Department",
          component:()=>import("./views/oa/Department.vue"),
        },
        {
          path:'/manangement',
          name:'Manangement',
          component:()=>import("./views/oa/Management.vue")
        },
        {
          path:'/locationResearch',
          name:'LocationResearch',
          component:()=>import('./views/LocationResearch/LocationResearch.vue'),
          redirect:'/locationResearch/landParameter',
          children:[{
            path:'/locationResearch/landParameter',
            name:'LandParameter',
            component:()=>import('./views/LocationResearch/LandParameter.vue'),
          },{
            path:'/locationResearch/customerModel',
            name:'CustomerModel',
            component:()=>import('./views/LocationResearch/CustomerModel.vue'),
          },{
            path:'/locationResearch/goodsMarket',
            name:'GoodsMarket',
            component:()=>import('./views/LocationResearch/GoodsMarket.vue'),
          },{
            path:'/locationResearch/initialAdjustment',
            name:'InitialAdjustment',
            component:()=>import('./views/LocationResearch/InitialAdjustment.vue'),
          },{
            path:'/locationResearch/locationDecision',
            name:'LocationDecision',
            component:()=>import('./views/LocationResearch/LocationDecision.vue'),
          }]
        }
      ],
      redirect:"/menuindex"
    } 
  ]
});
