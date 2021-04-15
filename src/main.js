import normalize from  '../src/assets/css/normalize.css'
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import fonts from  './assets/fonts/iconfont.css'
import store from './store/index.js'


/*使用VueResource插件*/

Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
// $emit 传递地址
// watch监听传地址
// data中赋值无效
// $store.commit()