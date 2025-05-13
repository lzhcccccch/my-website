<template>
  <div class="app-container">
    <Header />
    <div class="content">
      <Sidebar class="sidebar-component" />
      <main class="main-content">
        <router-view />
      </main>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Header from './components/layout/Header.vue'
import Footer from './components/layout/Footer.vue'
import Sidebar from './components/layout/Sidebar.vue'
</script>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.content {
  display: flex;
  flex: 1;
  width: 100%;
}

.sidebar-component {
  width: 250px;
  transition: all 0.3s ease;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-x: hidden;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .content {
    flex-direction: column;
  }

  .sidebar-component {
    width: 100%;
    order: 2; /* 在移动设备上将侧边栏放在内容下方 */
  }

  .main-content {
    order: 1; /* 在移动设备上将主内容放在侧边栏上方 */
  }
}
</style>
