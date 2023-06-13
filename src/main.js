import Vue from 'vue'
import App from './App.vue'
import store from './store'
import { Button, Icon, Popover, Checkbox, message, Modal, Switch } from 'ant-design-vue'
import Guide from "./views/Guide.vue";
import BarcodeScannerComponent from "./views/BarcodeScanner.vue"
import VueRouter from 'vue-router'

Vue.use(Button)
Vue.use(Icon)
Vue.use(Popover)
Vue.use(Checkbox)
Vue.use(Switch)
Vue.use(message)
Vue.prototype.$message = message;
Vue.use(Modal)
Vue.prototype.$warning = Modal.warning;
Vue.config.productionTip = false;
Vue.use(VueRouter);

const routes = [
  { path: '/', component: Guide},
  { path: '/common-oned', component: BarcodeScannerComponent },
  { path: '/common-twod', component: BarcodeScannerComponent },
  { path: '/common-oned-twod', component: BarcodeScannerComponent },
  { path: '/vin', component: BarcodeScannerComponent },
  { path: '/driver-license', component: BarcodeScannerComponent },
  { path: '/dpm', component: BarcodeScannerComponent }
]

export const router = new VueRouter({
  routes,
  base: "/barcode-reader-js/",
  mode: "history",
})

new Vue({
  render: h => h(App),
  store,
  router,
  mounted() {
  },
}).$mount('#app')