<template>
  <div class="navigation-page">
    <h1>个人导航站</h1>
    <p>这里将展示你收集的网站导航链接</p>

    <!-- 这里是导航站的基本结构，后续可以扩展 -->
    <div class="navigation-container">
      <div class="category">
        <h2>开发工具</h2>
        <div class="links">
          <div class="link-card">
            <h3>GitHub</h3>
            <p>全球最大的代码托管平台</p>
            <a href="https://github.com" target="_blank">访问</a>
          </div>
          <div class="link-card">
            <h3>Stack Overflow</h3>
            <p>程序员问答社区</p>
            <a href="https://stackoverflow.com" target="_blank">访问</a>
          </div>
        </div>
      </div>

      <div class="category">
        <h2>学习资源</h2>
        <div class="links">
          <div class="link-card">
            <h3>MDN Web Docs</h3>
            <p>Web 技术权威文档</p>
            <a href="https://developer.mozilla.org" target="_blank">访问</a>
          </div>
          <div class="link-card">
            <h3>Vue.js 官方文档</h3>
            <p>Vue.js 框架官方文档</p>
            <a href="https://vuejs.org" target="_blank">访问</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 这里可以添加导航站的逻辑
</script>

<style scoped>
.navigation-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  margin-bottom: 1rem;
}

.navigation-container {
  margin-top: 2rem;
}

.category {
  margin-bottom: 2rem;
}

.category h2 {
  border-bottom: 2px solid #eee;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.links {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.link-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.link-card h3 {
  margin-bottom: 0.5rem;
}

.link-card p {
  color: #666;
  margin-bottom: 1rem;
}

.link-card a {
  display: inline-block;
  background-color: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
}

.link-card a:hover {
  background-color: #45a049;
}
</style>
