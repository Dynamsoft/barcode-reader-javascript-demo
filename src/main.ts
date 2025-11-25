import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import Guide from './views/Guide.vue';
import Capture from './views/Capture.vue';
import { createPinia } from 'pinia';
import { createWebHistory, createRouter } from 'vue-router';
import { message } from 'ant-design-vue';

const pinia = createPinia();
const app = createApp(App);

message.config({
  top: '85%',
  duration: 0,
  maxCount: 2,
  prefixCls: "dbr-message-"
});

const routes = [
  { path: '/', component: Guide },
  { path: '/oned-retail', component: Capture },
  { path: '/oned-industrial', component: Capture },
  { path: '/qr', component: Capture },
  { path: '/data-matrix', component: Capture },
  { path: '/common-twod', component: Capture },
  { path: '/common-oned-twod', component: Capture },
  { path: '/vin', component: Capture },
  { path: '/driver-license', component: Capture },
  { path: '/distant', component: Capture },
]

const router = createRouter({
  history: createWebHistory("./"), // if build, replace with your deployment path
  routes,
})

app.use(pinia);
app.use(router);

app.mount('#app');