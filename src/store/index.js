import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import map from "./modules/map";
import common from "./modules/common";
import landmap from "./modules/landmap";
import getters from "./getters";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user,
    map,
    common,
    landmap
  },
  getters
});

export default store;