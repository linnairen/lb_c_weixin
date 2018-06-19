// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import store from './store/store'
// import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import { Picker } from 'mint-ui';

import axios from 'axios'

axios.interceptors.response.use(function (response) {
    if(response.data.code == 1406){
        // router.push('login')
        let url = location.href
        // alert('现在前往登录')
        // location.href = 'http://192.168.11.170:8001/skyauth/platform/redirect.shtml?oAuthType=2&ifDetail=2&redirect=' + encodeURIComponent(url)
    }
    return response;
}, function (error) {
    // Do something with response error
    return Promise.reject(error);
});

Vue.component(Picker.name, Picker);

Vue.use(Vuex)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
