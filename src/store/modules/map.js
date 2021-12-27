const map = {
  state:{
    map_style:null,//地图样式
    baseLayerMap:null,//样式图层
    mapbox_map:null,//地图(数据查询)
    ledger_map:null,//地图(台账地图)
    plategrade_map:null,//地图(板块评分)
    pointgrade_map:null,//地图(点地评分)
    condition_map:null,//地图(条件分析地图)
    population_map:null,//地图(人口与数据地图)
    reportAdd_map:null,//报告添加地图
    reportBase_map:null,//报告底层地图
    CD_map:null,//地图(土地可研-竞品分布)
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
    addLedgerInfo:{ //新增台账点信息
      isAdd:false,
      name:"",
      laglng:[],
      address:''
    },
    curentPlate:'part',//地图工具板块类型
    enclosure:false,//围栏模式
    enclosureCoor:null,//围栏坐标数据
    ledgerDraw:null,//土地台账绘制
  },
  mutations:{
    SET_MAP_STYLE: (state, style) => {
      state.map_style = style;
    },
    SET_MAP: (state, map) => {
      state.mapbox_map = map;
    },
    SET_BASELAYERMAP: (state, map) => {
      state.baseLayerMap = map;
    },
    SET_LEDGERMAP: (state, map) => {
      state.ledger_map = map;
    },
    SET_PLATEGRADEMAP: (state, map) => {
      state.plategrade_map = map;
    },
    SET_POINTGRADEMAP: (state, map) => {
      state.pointgrade_map = map;
    },
    SET_CONDITIONMAP: (state, map) => {
      state.condition_map = map;
    },
    SET_POPULATIONMAP: (state, map) => {
      state.population_map = map;
    },
    SET_REPORTADDMAP: (state, map) => {
      state.reportAdd_map = map;
    },
    SET_REPORTBASEMAP: (state, map) => {
      state.reportBase_map = map;
    },
    SET_CDMAP: (state, map) => {
      state.CD_map = map;
    },
    SET_PLATE_COLOR: (state, color) => {
      state.plate_color = color;
    },
    SET_LEDGERINFO: (state, obj) => {
      state.addLedgerInfo = obj;
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
    }
  },
  actions:{
    setMapStyle({ commit }, style) {
      commit("SET_MAP_STYLE", style);
    },
    setMap({ commit }, map) {
      commit("SET_MAP", map);
    },
    setBaseLayerMap({ commit }, map) {
      commit("SET_BASELAYERMAP", map);
    },
    setLedgerMap({ commit }, map) {
      commit("SET_LEDGERMAP", map);
    },
    setPlategradeMap({ commit }, map) {
      commit("SET_PLATEGRADEMAP", map);
    },
    setPointgradeMap({ commit }, map) {
      commit("SET_POINTGRADEMAP", map);
    },
    setConditionMap({ commit }, map) {
      commit("SET_CONDITIONMAP", map);
    },
    setPopulationMap({ commit }, map) {
      commit("SET_POPULATIONMAP", map);
    },
    setReportAddMap({ commit }, map) {
      commit("SET_REPORTADDMAP", map);
    },
    setReportBaseMap({ commit }, map) {
      commit("SET_REPORTBASEMAP", map);
    },
    setCDMap({ commit }, map) {
      commit("SET_CDMAP", map);
    },
    setPlateColor({ commit }, color) {
      commit("SET_PLATE_COLOR", color);
    },
    setLedgerInfo({ commit }, obj) {
      commit("SET_LEDGERINFO", obj);
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
  }
};

export default map;