import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import map from "./modules/map";
import common from "./modules/common";
import dataquery from "./modules/dataquery";
import locationResearch from "./modules/locationResearch"
import getters from "./getters";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user,
    map,
    common,
    dataquery,
    locationResearch
  },
  getters
});

export default store;