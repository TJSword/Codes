const common = {
  state:{
    cityList:[],//用户城市列表
    cityCode:null,//当前用户选择的城市
    curMenu:"TzyMap",//当前主菜单
    plateData:null,//板块数据 {generalPlate:[],district:[],customPlate:[],curCityInfo:{}}
    plateGEOJSON:null,//板块GEOJSON数据
    plateCenter:null,//板块中心点数据 {id,name,center:[117.054291358074, 36.6806652520411]}
   
    userMenu:[],//用户菜单数据(树形)
    userMenuList:[],//用户菜单数据(列表)
    analysistoolsUrl:'/analysistools', //分析工具路由
  },
  mutations:{
    SET_CITYLIST: (state, list) => {
      state.cityList = list;
    },
    SET_CITYCODE: (state, city) => {
      state.cityCode = city;
    },
    SET_PLATEDATA: (state, obj) => {
      state.plateData = obj;
    },
    SET_CURMENU: (state, menu) => {
      state.curMenu = menu;
    },
    SET_PLATEGEOJSON: (state, data) => {
      state.plateGEOJSON = data;
    },
    SET_PLATECENTER: (state, arr) => {
      state.plateCenter = arr;
    },
    SET_USERMENU: (state, arr) => {
      state.userMenu = arr;
    },
    SET_USERMENULIST: (state, arr) => {
      state.userMenuList = arr;
    },
    SET_ANAURL: (state, url) => {
      state.analysistoolsUrl = url;
    }
  },
  actions:{
    setCityList({ commit }, list) {
      commit("SET_CITYLIST", list);
    },
    setCityCode({ commit }, city) {
      commit("SET_CITYCODE", city);
    },
    setPlateData({ commit }, obj) {
      commit("SET_PLATEDATA", obj);
    },
    setCurMenu({ commit }, menu) {
      commit("SET_CURMENU", menu);
    },
    setPlateGEOJSON({ commit }, data) {
      commit("SET_PLATEGEOJSON", data);
    },
    setPlateCenter({ commit }, arr) {
      commit("SET_PLATECENTER", arr);
    },
    setUserMenu({ commit }, arr) {
      commit("SET_USERMENU", arr);
    },
    setUserMenuList({ commit }, arr) {
      commit("SET_USERMENULIST", arr);
    },
    setAnaUrl({ commit }, url) {
      commit("SET_ANAURL", url);
    }
  }
};

export default common;