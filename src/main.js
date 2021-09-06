import Vue from 'vue'
import App from './App.vue'
import store from './store'
import { Button, Icon, Popover, Checkbox, message, Modal } from 'ant-design-vue';
import AsyncComputed from 'vue-async-computed'

Vue.use(Button)
Vue.use(Icon)
Vue.use(Popover)
Vue.use(Checkbox)
Vue.use(message)
Vue.prototype.$message = message;
Vue.config.productionTip = false
Vue.use(Modal)
Vue.use(AsyncComputed)

new Vue({
  render: h => h(App),
  store
}).$mount('#app')