const dataquery = {
  state:{
    classification:[],//要查询数据的指标类别ID数组
    classificationObj:[],//要查询数据的指标类别Obj数组
    plateArr:[],//要查询数据的板块ID数组
    plateType:'city',//板块类型
    classBoxFlag:true,//是否展示指标盒子
    queryMenuIndex:null,//数据查询菜单索引
    isListedLand:true,//土地流通状态是否为已上市土地

    //板块名片
    cardFlag:false,//板块名片状态
    plateID:null,//选择的板块名片ID
  },
  mutations:{
    SET_CLASS: (state, arr) => {
      state.classification = arr;
    },
    SET_CLASS_OBJ: (state, arr) => {
      state.classificationObj = arr;
    },
    SET_PLATETYPE: (state, type) => {
      state.plateType = type;
    },
    SET_BOXFLAG: (state, flag) => {
      state.classBoxFlag = flag;
    },
    SET_PLATEARR: (state, arr) => {
      state.plateArr = arr;
    },
    SET_QUERYMENUINDEX: (state, i) => {
      state.queryMenuIndex = i;
    },
    SET_ISLISTEDLAND: (state, flag) => {
      state.isListedLand = flag;
    },
    SET_CARDFLAG: (state, flag) => {
      state.cardFlag = flag;
    },
    SET_PLATEID: (state, id) => {
      state.plateID = id;
    }
  },
  actions:{
    setClass({ commit }, arr) {
      commit("SET_CLASS", arr);
    },
    setClassObj({ commit }, arr) {
      commit("SET_CLASS_OBJ", arr);
    },
    setPlateType({ commit }, type) {
      commit("SET_PLATETYPE", type);
    },
    setBoxFlag({ commit }, flag) {
      commit("SET_BOXFLAG", flag);
    },
    setPlateArr({ commit }, arr) {
      commit("SET_PLATEARR", arr);
    },
    setQueryMenuIndex({ commit }, i) {
      commit("SET_QUERYMENUINDEX", i);
    },
    setIsListedLand({ commit }, flag) {
      commit("SET_ISLISTEDLAND", flag);
    },
    setCardFlag({ commit }, flag) {
      commit("SET_CARDFLAG", flag);
    },
    setPlateID({ commit }, id) {
      commit("SET_PLATEID", id);
    }
  }
};

export default dataquery;