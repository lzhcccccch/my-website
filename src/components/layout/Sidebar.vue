<template>
  <aside class="sidebar">
    <div class="sidebar-content">
      <h3>导航菜单</h3>
      <ul>
        <li><router-link to="/">首页</router-link></li>
        <li><router-link to="/thoughts">心情随想</router-link></li>
        <li><router-link to="/word-cards">单词卡片</router-link></li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
// 使用组合式 API
</script>

<style scoped>
.sidebar {
  background-color: #f5f5f5;
  padding: 1rem;
  height: 100%;
}

.sidebar-content {
  position: sticky;
  top: 20px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  margin-bottom: 0.5rem;
}

.sidebar a {
  text-decoration: none;
  color: #333;
  display: block;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.sidebar a:hover, .sidebar a.router-link-active {
  color: #42b983;
  background-color: rgba(66, 185, 131, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    padding: 0.5rem;
  }

  .sidebar-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .sidebar ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }

  .sidebar li {
    margin-bottom: 0;
  }
}
</style>
