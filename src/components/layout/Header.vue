<template>
  <header class="app-header">
    <div class="logo">
      <router-link to="/">个人网站</router-link>
    </div>

    <nav class="nav-menu">
      <ul>
        <li>
          <router-link to="/">首页</router-link>
        </li>
        <li>
          <router-link to="/navigation">导航站</router-link>
        </li>
        <li>
          <router-link to="/note">心情随想录</router-link>
        </li>
        <li>
          <router-link to="/word">单词卡片</router-link>
        </li>
      </ul>
    </nav>

    <div class="user-actions">
      <template v-if="isLoggedIn">
        <span class="username">{{ currentUser?.username || '用户' }}</span>
        <button class="logout-btn" @click="handleLogout">退出登录</button>
      </template>
      <template v-else>
        <router-link to="/login" class="login-btn">登录</router-link>
        <router-link to="/register" class="register-btn">注册</router-link>
      </template>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import api from '../../services/api.js' // 假设你有一个 API 实例

const router = useRouter()
const authStore = useAuthStore()

const isLoggedIn = computed(() => authStore.isAuthenticated)
const currentUser = computed(() => authStore.user)

async function handleLogout() {
  try {
    // 直接在组件中发起 API 请求
    await api.post('/auth/logout')
  } catch (err) {
    console.error('登出错误:', err)
  } finally {
    // 无论请求成功与否，都清除本地状态
    authStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo a {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
}

.nav-menu ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-menu li {
  margin-right: 1.5rem;
}

.nav-menu a {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-menu a:hover,
.nav-menu a.router-link-active {
  color: #4caf50;
}

.user-actions {
  display: flex;
  align-items: center;
}

.username {
  margin-right: 1rem;
  font-weight: 500;
}

.logout-btn {
  background-color: transparent;
  border: 1px solid #f44336;
  color: #f44336;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.logout-btn:hover {
  background-color: #f44336;
  color: white;
}

.login-btn,
.register-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  margin-left: 1rem;
}

.login-btn {
  background-color: transparent;
  border: 1px solid #2196f3;
  color: #2196f3;
}

.login-btn:hover {
  background-color: #2196f3;
  color: white;
}

.register-btn {
  background-color: #4caf50;
  color: white;
  border: 1px solid #4caf50;
}

.register-btn:hover {
  background-color: #45a049;
}
</style>
