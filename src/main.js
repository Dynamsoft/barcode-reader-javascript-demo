import Vue from 'vue'
import App from './App.vue'
import Guide from "./components/Guide.vue";
import store from './store'
import { Button, Icon, Popover, Checkbox, message, Modal } from 'ant-design-vue'
import BarcodeScannerComponent from "./components/BarcodeScanner.vue"
import VueRouter from 'vue-router'

Vue.use(Button)
Vue.use(Icon)
Vue.use(Popover)
Vue.use(Checkbox)
Vue.use(message)
Vue.prototype.$message = message;
Vue.use(Modal)
Vue.prototype.$warning = Modal.warning;
Vue.config.productionTip = false;

const routes = [
  { path: '/', component: Guide},
  { path: '/common-oned.html', component: BarcodeScannerComponent },
  { path: '/common-twod.html', component: BarcodeScannerComponent },
  { path: '/common-oned-twod.html', component: BarcodeScannerComponent },
  { path: '/vin.html', component: BarcodeScannerComponent },
  { path: '/driver-license.html', component: BarcodeScannerComponent },
  { path: '/dpm.html', component: BarcodeScannerComponent }
]

const router = new VueRouter({
  routes,
  base: process.env.BASE_URL,
  mode: "history",
})

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')