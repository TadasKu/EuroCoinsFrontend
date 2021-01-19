import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      userId: null,
      userName: null,
      token: null,
      role: null,
      exp: null,
    },
    selectedCountry: null,
    selectedLanguage: 'en',
  },
  mutations: {
    set_user(state, newToken) {
      state.user.token = newToken;
      let jwtData = newToken.split('.')[1];
      let decodedJwtJsonData = window.atob(jwtData);
      let decodedJwtData = JSON.parse(decodedJwtJsonData);
      state.user.userName = decodedJwtData.unique_name;
      state.user.role = decodedJwtData.role;
      state.user.userId = decodedJwtData.nameid;
      state.user.exp = decodedJwtData.exp;
    },
    set_country(state, country) {
      state.selectedCountry = country;
    },
    delete_user(state) {
      state.user.userId = null;
      state.user.userName = null;
      state.user.token = null;
      state.user.role = null;
      state.user.exp = null;
    },
    delete_country(state) {
      state.selectedCountry = null;
    },
    change_language(state, language) {
      this.state.selectedLanguage = language;
    },
  },
  getters: {
    user: (state) => state.user,
  },
  actions: {
    set_UserAction(context, newToken) {
      context.commit('set_user', newToken);
    },
    set_CountryAction(context, country) {
      context.commit('set_country', country);
    },
    delete_UserAction(context) {
      context.commit('delete_user');
    },
    delete_CountryAction(context) {
      context.commit('delete_country');
    },
    change_LanguageAction(context, language) {
      context.commit('change_language', language);
    },
  },
  modules: {},
  plugins: [createPersistedState()],
});
