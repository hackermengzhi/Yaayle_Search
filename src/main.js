import { createApp } from 'vue';
import Vuex from 'vuex'; // 导入 Vuex

import App from './App.vue';
import store from './store'; // 导入 Vuex store
import router from './router'
const app = createApp(App);
app.use(Vuex); // 使用 Vuex
app.use(store); // 使用 Vuex store
app.use(router)
// 创建事件总线
const eventBus = app.config.globalProperties.$eventBus = {
    listeners: {},
    on(event, callback) {
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }
      this.listeners[event].push(callback);
    },
    emit(event, ...args) {
      if (this.listeners[event]) {
        this.listeners[event].forEach(callback => {
          callback(...args);
        });
      }
    }
  };
  

app.mount('#app');