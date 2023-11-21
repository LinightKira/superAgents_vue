import { createApp } from 'vue'
import './styles/style.css'
import App from './App.vue'
import router from './router/router'
import store from './store/auth';

createApp(App).use(router).use(store).mount('#app')
