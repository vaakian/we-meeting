import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import ElementUI, { Popover } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(Popover);
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
