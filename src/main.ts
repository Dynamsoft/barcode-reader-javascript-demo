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

app.config.globalProperties.$message = message;
app.config.globalProperties.$message.config({
  top: '85%',
  duration: 2,
  maxCount: 2
});

const routes = [
  { path: '/', component: Guide },
  { path: '/common-oned', component: Capture },
  { path: '/common-twod', component: Capture },
  { path: '/common-oned-twod', component: Capture },
  { path: '/vin', component: Capture },
  { path: '/driver-license', component: Capture },
  { path: '/dpm', component: Capture }
]

const router = createRouter({
  history: createWebHistory(process.env.VUE_APP_PUBLIC_PATH),
  routes,
})

app.use(pinia);
app.use(router);

app.mount('#app');