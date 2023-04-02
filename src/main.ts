import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import '../src/input.css'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import axios from 'axios'
import VueAxios from 'vue-axios'

axios.defaults.baseURL = 'http://192.168.1.83:8080/api'

createApp(App).use(router).use(VueAxios, axios).use(Antd).use(createPinia()).mount('#app')
