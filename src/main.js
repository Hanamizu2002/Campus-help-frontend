import Vue from 'vue'
import App from './App.vue'
import md5 from 'js-md5'
import router from './router'
import store from './store'

import'./plugin'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

//将request注册到全局
import request from '@/util/request'
Vue.prototype.$request = request;

Vue.prototype.$md5 = md5;
