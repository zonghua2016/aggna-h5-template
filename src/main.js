/*
 * @Author       : tongzonghua
 * @Date         : 2020-11-12 10:23:37
 * @LastEditors  : tongzonghua
 * @LastEditTime : 2021-03-30 16:08:58
 * @Email        : tongzonghua@360.cn
 * @Description  : 入口文件
 * @FilePath     : /cli/aggna-h5-template/src/main.js
 */
import 'babel-polyfill';
import Es6Promise from 'es6-promise';
require('es6-promise').polyfill();
Es6Promise.polyfill();
// 添加左右滑动手势事件
import VueTouch from 'vue-touch';
Vue.use(VueTouch, { name: 'v-touch' })
VueTouch.config.swipe = {
  threshold: 200 //手指左右滑动距离
}
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/styles/main.less'
import MetaInfo from "vue-meta-info";
import VueLazyLoad from "vue-lazyload";
import Toast from "components/Toast";
import "components/Toast/index.css";
import clipboard from 'clipboard';

Vue.use(Toast);
Vue.use(MetaInfo)
Vue.use(VueLazyLoad, {
  loading: require("imgs/load.png"),
  error: require("imgs/load.png"),
  attempt: 3
});

Vue.config.productionTip = false
Vue.prototype.clipboard = clipboard;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')