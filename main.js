import App from './App'

// #ifndef VUE3
import Vue from 'vue'

import axios from './utils/axios.js';
Vue.prototype.$axios = axios;

//全局变量
//this.$global.setMemberObj({userId:res.data[0].user_id})  //set
//console.log(this.$global.memberObj.userId)  //get
import global from 'utils/global.js'
Vue.prototype.$global = global;

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
