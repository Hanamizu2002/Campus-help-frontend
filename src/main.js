import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import md5 from 'js-md5'

import'./plugin'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

//将request注册到全局
import request from '@/util/request'
Vue.prototype.$request = request;

Vue.prototype.$md5 = md5;
new Vue({
  router,
  store,
  render: h => h(App),
  methods: {
    getData(){
      var param = {
        params:{
          devid:'8479593759372',
          user:'hanamizu',
          key:'8aad46f68c77e83ee2bcc3d9f9ec818a'
        }
      }
      this.$http.get('/campus-help-fr',param).then(res=>{
        console.log(res)
      })
    }
  }
}).$mount('#app')
