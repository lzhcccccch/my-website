import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import pinia from './stores'

// 创建 Vue 应用实例
const app = createApp(App)

// const pinia = createPinia()

// 使用路由
app.use(router)

// 使用 Pinia 状态管理
app.use(pinia)

// 挂载应用
app.mount('#app')

