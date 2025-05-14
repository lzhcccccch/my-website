<template>
  <AppLayout>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </AppLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import AppLayout from './components/layout/DefaultLayout.vue'
import { useAuthStore } from './stores/auth'
import api from './services/api.js' // 假设你有一个 API 实例

const authStore = useAuthStore()

onMounted(async () => {
  // 初始化认证状态
  const token = localStorage.getItem('token')

  if (token) {
    try {
      // 尝试获取当前用户信息
      const response = await api.get('/auth/me')
      authStore.setUser(response.data)
    } catch (err) {
      console.error('获取用户信息失败:', err)
      // 如果获取用户信息失败，清除认证状态
      authStore.logout()
    }
  }
})
</script>

<style>
/* 全局样式 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f9f9f9;
}

/* 页面过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
