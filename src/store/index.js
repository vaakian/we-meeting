import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import * as getters from './getters'
import * as mutations from './mutations'

import modules from './modules';

Vue.use(Vuex)
const actions = {
  // 画画和观看之前，先行条件都是没有人正在画画
  startWatchSketch({ commit, state }) {
    if (!state.isSketching) {
      commit('setShowTeacherBoard', false); // 开启被动模式
      commit('setIsSketching', true);
      commit('setShowControls', false);
    }
  },
  // 主动画板操作
  startSketch({ commit, state }) {
    if (!state.isSketching) {
      commit('setShowTeacherBoard', true); // 开启主动模式
      commit('setIsSketching', true);
      commit('setShowControls', false);
    }
  },
  // 退出画布 主动和被动通用
  exitSketch({ commit }) {
    commit('setShowTeacherBoard', false);
    commit('setIsSketching', false);
    commit('setShowControls', true);
  }
}
export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  modules
})