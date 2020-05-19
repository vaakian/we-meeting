import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import Clipboard from 'v-clipboard'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'vue-fabric/dist/vue-fabric.min.css';
// import { Fabric } from 'vue-fabric';
Vue.config.productionTip = false
Vue.use(ElementUI).use(Clipboard)
// .use(Fabric);
console.log({ store });
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
