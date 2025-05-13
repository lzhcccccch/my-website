<template>
  <header class="header">
    <div class="logo">
      <h1>我的个人网站</h1>
    </div>
    <nav class="nav" :class="{ 'nav-open': menuOpen }">
      <router-link to="/" @click="closeMenu">首页</router-link>
      <router-link to="/thoughts" @click="closeMenu">心情随想</router-link>
      <router-link to="/word-cards" @click="closeMenu">单词卡片</router-link>
    </nav>
    <div class="menu-toggle" @click="toggleMenu">
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const menuOpen = ref(false)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const closeMenu = () => {
  menuOpen.value = false
}
</script>

<style scoped>
.header {
  background-color: #333;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 8%;
  margin: 0;
  box-sizing: border-box;
}

.nav {
  display: flex;
  gap: 1rem;
}

.nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem;
}

.nav a:hover {
  text-decoration: underline;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  cursor: pointer;
}

.bar {
  width: 25px;
  height: 3px;
  background-color: white;
  margin: 3px 0;
  transition: 0.4s;
}

/* 响应式导航 */
@media (max-width: 768px) {
  .nav {
    position: absolute;
    top: 60px;
    left: 0;
    flex-direction: column;
    background-color: #333;
    width: 100%;
    align-items: center;
    padding: 1rem 0;
    transform: translateY(-150%);
    transition: transform 0.3s ease-in-out;
    z-index: 100;
    margin: 0;
  }

  .nav-open {
    transform: translateY(0);
  }

  .menu-toggle {
    display: flex;
  }
}
</style>
