import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import * as getters from './getters'
import * as mutations from './mutations'

import modules from './modules';

Vue.use(Vuex)

console.log({ modules })
export default new Vuex.Store({
  state,
  mutations,
  getters,
  modules
})