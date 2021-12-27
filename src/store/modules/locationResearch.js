const locationResearch = {
    state:{
        progress:0,
        locationId:'',
        circleTime:'',
        map:null,
        point:[]
    },
    mutations:{
        SET_PROGRESS:(state, progress) => {
            state.progress = progress;
        },
        SET_LOCATIONID:(state,locationId) =>{
            state.locationId = locationId
        },
        SET_POINT:(state,point)=>{
            state.point = point
        },
        SET_CIRCLETIME:(state,circleTime)=>{
            state.circleTime = circleTime
        },
        SET_MAP:(state,map)=>{
            state.map = map
        }
    },
    actions:{
        setProgress({ commit }, progress) {
          commit("SET_PROGRESS", progress);
        },
        setLocationId({commit},locationId){
            commit("SET_LOCATIONID", locationId);
        },
        setPoint({commit},point){
            commit("SET_POINT", point);
        },
        setCircleTime({commit},circleTime){
            commit('SET_CIRCLETIME',circleTime)
        },
        setMap({commit},map){
            commit('SET_MAP',map)
        }
    }
}
export default locationResearch