const map = {
  state:{
    map_style:null,//地图样式
    mapbox_map:null,//地图(数据查询)
    local_map:null,//地图(本地)
    ledger_map:null,//地图(投资云地图)
    city_map:null,//地图(城市地图)
    macro_map:null,//地图(宏观地图)
    plate_color:[ //板块渲染颜色
      {name:'无数值',value:'rgba(58,88,125,0.4)'},
      {name:'< 1',value:'#f1e774'}, //#00939c
      {name:'< 2',value:'#f2d972'}, //#2fa7ae
      {name:'< 3',value:'#f2c76f'}, //#5dbabf
      {name:'< 4',value:'#f2b46d'}, //#8cced1
      {name:'< 5',value:'#f3a06a'}, //#bae1e2
      {name:'< 6',value:'#f38c67'}, //#f8c0aa
      {name:'< 7',value:'#f47964'}, //#eb9c80
      {name:'< 8',value:'#f46862'}, //#dd7755
      {name:'< 9',value:'#f55960'}, //#d0532b
      {name:'< 10',value:'#f54e5e'} //#c22e00
    ],
    ledgendColor:['#f2b46d','#f3a06a','#f38c67','#f47964','#f46862','#f55960','#f54e5e'],//图例颜色
   
    curentPlate:'part',//地图工具板块类型
    enclosure:false,//围栏模式
    enclosureCoor:null,//围栏坐标数据
    ledgerDraw:null,//土地台账绘制
    mapIsload:false,//云地图已加载
    cityMapIsload:false,//城市地图已加载
    macroMapIsload:false,//宏观地图已加载
    situationMap:null,//客情地图
    houseDataMap:null,//房产数据地图
  },
  mutations:{
    SET_MAP_STYLE: (state, style) => {
      state.map_style = style;
    },
    SET_MAP: (state, map) => {
      state.mapbox_map = map;
    },
    SET_LEDGERMAP: (state, map) => {
      state.ledger_map = map;
    },
    SET_LOCALMAP: (state, map) => {
      state.local_map = map;
    },
    SET_CITY_MAP: (state, map) => {
      state.city_map = map;
    },
    SET_MACRO_MAP: (state, map) => {
      state.macro_map = map;
    },
    SET_PLATE_COLOR: (state, color) => {
      state.plate_color = color;
    },
    SET_CURENTPLATE: (state, type) => {
      state.curentPlate = type;
    },
    SET_ENCLOSURE: (state, flag) => {
      state.enclosure = flag;
    },
    SET_ENCLOSURECOOR: (state, str) => {
      state.enclosureCoor = str;
    },
    SET_LEDGERDRAW: (state, draw) => {
      state.ledgerDraw = draw;
    },
    SET_MAPISLOAD: (state, flag) => {
      state.mapIsload = flag;
    },
    SET_CITY_MAP_ISLOAD: (state, flag) => {
      state.cityMapIsload = flag;
    },
    SET_MACRO_MAP_ISLOAD: (state, flag) => {
      state.macroMapIsload = flag;
    },
    SET_SITUATIONMAP: (state,map)=>{
      state.situationMap = map
    },
    SET_HOUSEDATAMAP: (state,map)=>{
      state.houseDataMap = map
    }
  },
  actions:{
    setMapStyle({ commit }, style) {
      commit("SET_MAP_STYLE", style);
    },
    setMap({ commit }, map) {
      commit("SET_MAP", map);
    },
    setLedgerMap({ commit }, map) {
      commit("SET_LEDGERMAP", map);
    },
    setLocalMap({ commit }, map) {
      commit("SET_LOCALMAP", map);
    },
    setCityMap({ commit }, map) {
      commit("SET_CITY_MAP", map);
    },
    setMacroMap({ commit }, map) {
      commit("SET_MACRO_MAP", map);
    },
    setPlateColor({ commit }, color) {
      commit("SET_PLATE_COLOR", color);
    },
    setCurentType({ commit }, type) {
      commit("SET_CURENTPLATE", type);
    },
    setEnclosure({ commit }, flag) {
      commit("SET_ENCLOSURE", flag);
    },
    setEnclosureCoor({ commit }, str) {
      commit("SET_ENCLOSURECOOR", str);
    },
    setLedgerDraw({ commit }, draw) {
      commit("SET_LEDGERDRAW", draw);
    },
    setMapisload({ commit }, flag) {
      commit("SET_MAPISLOAD", flag);
    },
    setCityMapisload({ commit }, flag) {
      commit("SET_CITY_MAP_ISLOAD", flag);
    },
    setMacroMapisload({ commit }, flag) {
      commit("SET_MACRO_MAP_ISLOAD", flag);
    },
    setSituationMap({commit},map) {
      commit('SET_SITUATIONMAP',map)
    },
    setHouseDataMap({commit},map) {
      commit('SET_HOUSEDATAMAP',map)
    }
  }
};

export default map;