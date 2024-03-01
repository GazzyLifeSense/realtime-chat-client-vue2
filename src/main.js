import Vue from 'vue'
import App from './App.vue'
import router from './route'
import ElementUI from 'element-ui';
import axios from 'axios'
import '../style.css'
import 'animate.css'
import 'nprogress'
import 'nprogress/nprogress.css'
import 'element-ui/lib/theme-chalk/index.css';
import store from './store'

Vue.prototype.$axios = axios
Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate(){
    Vue.prototype.$bus = this
  }
}).$mount('#app')