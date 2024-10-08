import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import store from './store'
createApp(App).use(store).use(Antd).use(router).mount('#app')
