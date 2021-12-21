const landmap = {
  state:{
    fileIsimport:null,//地图样式
    curLandCoords:null,//当前选中土地坐标
    curLandId:null,//当前选中土地Id
    curLandSaleInfo:null,//当前选中要查询在售项目的土地信息{id:name:center}
    showMessage:false,//显示留言图层
    showFriends:false,//显示好友列表
    customState:false,//自定义板块绘制模式
    measureState:false,//测量模式
    hasMessage:false,//是否有消息
    shareInfo:[],//分享的土地文件夹信息
    freshFmFlag:false,//刷新好友地图
    createLandFlag:null,//添加土地
    freshSelf:false,//刷新个人地图
    plModifyId:null,//修改点线的ID
    cmNotice:null,//新建修改提醒
    landTypeTab:"gov",//当前主菜单tab类型
    landlistFlag:null,//土地列表显示
    popType:null,//显示的人口类型
  },
  mutations:{
    SET_POPTYPE: (state, type) => {
      state.popType = type;
    },
    SET_LANDLISTFLAG: (state, flag) => {
      state.landlistFlag = flag;
    },
    SET_FILEIMPORT: (state, flag) => {
      state.fileIsimport = flag;
    },
    SET_LANDCOORDS: (state,coord) => {
      state.curLandCoords = coord;
    },
    SET_LANDID: (state,id) => {
      state.curLandId = id;
    },
    SET_LAND_SALE_INFO: (state,info) => {
      state.curLandSaleInfo = info;
    },
    SET_SHOWMESSAGE: (state,flag) => {
      state.showMessage = flag;
    },
    SET_SHOWFRIENDS: (state,flag) => {
      state.showFriends = flag;
    },
    SET_CUSTOMSTATE: (state,flag) => {
      state.customState = flag;
    },
    SET_RMESURESTATE: (state,flag) => {
      state.measureState = flag;
    },
    SET_HASMESSAGE: (state,flag) => {
      state.hasMessage = flag;
    },
    SET_SHAREINFO: (state,data) => {
      state.shareInfo = data;
    },
    SET_FRESHFMFLAG: (state,flag) => {
      state.freshFmFlag = flag;
    },
    SET_CREATELANDFLAG: (state,flag) => {
      state.createLandFlag = flag;
    },
    SET_FRESHSELF: (state,flag) => {
      state.freshSelf = flag;
    },
    SET_PLMODIFYID: (state,id) => {
      state.plModifyId = id;
    },
    SET_CMNOTICE: (state,obj) => {
      state.cmNotice = obj;
    },
    SET_LANDTYPE: (state,val) => {
      state.landTypeTab = val;
    },
  },
  actions:{
    setPopType({ commit }, type) {
      commit("SET_POPTYPE", type);
    },
    setLandListFlag({ commit }, flag) {
      commit("SET_LANDLISTFLAG", flag);
    },
    setFileIsimport({ commit }, flag) {
      commit("SET_FILEIMPORT", flag);
    },
    setCurLandCoords({ commit }, coord) {
      commit("SET_LANDCOORDS", coord);
    },
    setCurLandId({ commit }, id) {
      commit("SET_LANDID", id);
    },
    setCurLandSaleInfo({ commit }, info) {
      commit("SET_LAND_SALE_INFO", info);
    },
    setShowMessage({ commit }, flag) {
      commit("SET_SHOWMESSAGE", flag);
    },
    setShowFriends({ commit }, flag) {
      commit("SET_SHOWFRIENDS", flag);
    },
    setCustomState({ commit }, flag) {
      commit("SET_CUSTOMSTATE", flag);
    },
    setMesureState({ commit }, flag) {
      commit("SET_RMESURESTATE", flag);
    },
    setHasMessage({ commit }, flag) {
      commit("SET_HASMESSAGE", flag);
    },
    setShareInfo({ commit }, data) {
      commit("SET_SHAREINFO", data);
    },
    setFreshFmFlag({ commit }, flag) {
      commit("SET_FRESHFMFLAG", flag);
    },
    setCreateLandFlag({ commit }, flag) {
      commit("SET_CREATELANDFLAG", flag);
    },
    setFreshSelf({ commit }, flag) {
      commit("SET_FRESHSELF", flag);
    },
    setPLModifyId({ commit }, id) {
      commit("SET_PLMODIFYID", id);
    },
    setCmNotice({ commit }, obj) {
      commit("SET_CMNOTICE", obj);
    },
    setLandType({ commit }, val) {
      commit("SET_LANDTYPE", val);
    },
  }
};

export default landmap;