<template>
  <div class="home">
    <h2>个人导航站</h2>
    <div class="navigation-links">
      <div v-for="(link, index) in links" :key="index" class="nav-card">
        <h3>{{ link.title }}</h3>
        <p>{{ link.description }}</p>
        <a :href="link.url" target="_blank">访问</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 示例导航链接数据
const links = ref([
  {
    title: '我的博客',
    description: '分享技术文章和个人见解',
    url: '#'
  },
  {
    title: 'GitHub',
    description: '我的开源项目',
    url: 'https://github.com/'
  },
  {
    title: '学习资源',
    description: '收集的编程学习资源',
    url: '#'
  },
  {
    title: '常用工具',
    description: '日常使用的实用工具',
    url: '#'
  }
])
</script>

<style scoped>
.home {
  width: 100%;
  padding: 1rem;
}

.navigation-links {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
  width: 100%;
}

.nav-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  transition: transform 0.3s ease;
  background-color: white;
  height: 100%;
}

.nav-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.nav-card a {
  display: inline-block;
  margin-top: 0.5rem;
  color: #42b983;
  text-decoration: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navigation-links {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .navigation-links {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
