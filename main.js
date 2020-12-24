import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

import $app from "./common/common.js";
Vue.prototype.app=$app;

import uView from 'uview-ui';
Vue.use(uView);

import unLogin from  "./components/un-login.vue";
Vue.component("unLogin",unLogin);

import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom)

// 在main.js注册全局组件
import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue"
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue"
Vue.component('mescroll-body', MescrollBody)
Vue.component('mescroll-uni', MescrollUni)	

const app = new Vue({
	...App
})
app.$mount()
