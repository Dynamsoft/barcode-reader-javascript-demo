import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
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
    { path: '/', component: () => import("./views/Guide.vue") },
    { path: '/common-oned', component: () => import("./views/Capture.vue") },
    { path: '/common-twod', component: () => import("./views/Capture.vue") },
    { path: '/common-oned-twod', component: () => import("./views/Capture.vue") },
    { path: '/vin', component: () => import("./views/Capture.vue") },
    { path: '/driver-license', component: () => import("./views/Capture.vue") },
    { path: '/dpm', component: () => import("./views/Capture.vue") }
]

const router = createRouter({
    history: createWebHistory(process.env.VUE_APP_PUBLIC_PATH),
    routes,
})

app.use(pinia);
app.use(router);

app.mount('#app');