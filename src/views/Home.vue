<template>
  <div class="home">
    <h1>欢迎来到我的个人网站</h1>

    <div class="features">
      <div class="feature-card" @click="navigateTo('/navigation')">
        <h2>个人导航站</h2>
        <p>收集和整理你喜欢的网站链接</p>
      </div>

      <div class="feature-card" @click="navigateTo('/mood-journal')">
        <h2>心情随想录</h2>
        <p>记录每一天的心情和想法</p>
      </div>

      <div class="feature-card" @click="navigateTo('/word-cards')">
        <h2>单词卡片</h2>
        <p>创建和学习单词卡片（即将推出）</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const navigateTo = (path) => {
  if (authStore.isAuthenticated) {
    router.push(path)
  } else {
    router.push('/login')
  }
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.features {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;
}

.feature-card {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 2rem;
  width: 300px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}
</style>
