import { createApp } from 'vue';
import Vuex from 'vuex'; // 导入 Vuex

import App from './App.vue';
import store from './store'; // 导入 Vuex store
import router from './router'
const app = createApp(App);
app.use(Vuex); // 使用 Vuex
app.use(store); // 使用 Vuex store
app.use(router)

app.mount('#app');