import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { config } from '../config';
//Localization
import i18n from '@/plugins/i18n';
//Flags
import FlagIcon from './plugins/vue-country-flag';

import VueMaterial from 'vue-material';

import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';

import Pagination from 'vue-pagination-2';
Vue.use(Pagination);
Vue.use(VueMaterial);
Vue.use(FlagIcon);
Vue.config.productionTip = false;
Vue.prototype.$urlCore = config.urlCore;

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
