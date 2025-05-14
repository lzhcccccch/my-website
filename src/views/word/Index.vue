<template>
  <div class="word-cards-page">
    <h1>单词卡片</h1>
    <p>创建和学习单词卡片（即将推出）</p>

    <!-- 这里是单词卡片的基本结构，后续可以扩展 -->
    <div class="coming-soon">
      <img src="/src/assets/comingSoon.svg" alt="Coming Soon" />
      <h2>功能开发中</h2>
      <p>这个功能正在开发中，敬请期待！</p>
    </div>
  </div>
</template>

<script setup>
// 这里可以添加单词卡片的逻辑
</script>

<style scoped>
.word-cards-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

h1 {
  margin-bottom: 1rem;
}

.coming-soon {
  margin-top: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.coming-soon img {
  width: 200px;
  margin-bottom: 2rem;
}

.coming-soon h2 {
  margin-bottom: 1rem;
  color: #333;
}

.coming-soon p {
  color: #666;
}
</style>
