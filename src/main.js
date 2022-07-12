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
Vue.use(Modal)
Vue.prototype.$warning = Modal.warning;
Vue.use(AsyncComputed)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store,
  mounted() {
    // You'll need this for renderAfterDocumentEvent.
    document.dispatchEvent(new Event('render-event'))
},
}).$mount('#app')