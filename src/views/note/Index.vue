<template>
  <div class="mood-journal-page">
    <h1>心情随想录</h1>
    <p>记录每一天的心情和想法</p>

    <!-- 这里是心情随想录的基本结构，后续可以扩展 -->
    <div class="journal-container">
      <div class="journal-entry">
        <div class="entry-header">
          <h2>美好的一天</h2>
          <span class="date">2025-05-14</span>
        </div>
        <div class="entry-content">
          <p>今天天气晴朗，心情很好。早上去公园散步，遇到了许多可爱的小动物。下午完成了一个重要的项目，感到非常满足。</p>
        </div>
        <div class="entry-footer">
          <span class="mood happy">心情愉快</span>
        </div>
      </div>

      <div class="journal-entry">
        <div class="entry-header">
          <h2>思考人生</h2>
          <span class="date">2025-05-13</span>
        </div>
        <div class="entry-content">
          <p>今天读了一本关于哲学的书，让我思考了很多关于人生意义的问题。虽然没有找到确切的答案，但享受思考的过程。</p>
        </div>
        <div class="entry-footer">
          <span class="mood thoughtful">若有所思</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 这里可以添加心情随想录的逻辑
</script>

<style scoped>
.mood-journal-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  margin-bottom: 1rem;
}

.journal-container {
  margin-top: 2rem;
}

.journal-entry {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.date {
  color: #666;
}

.entry-content {
  margin-bottom: 1rem;
}

.entry-footer {
  display: flex;
  justify-content: flex-end;
}

.mood {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
}

.happy {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.thoughtful {
  background-color: #e3f2fd;
  color: #1565c0;
}
</style>
