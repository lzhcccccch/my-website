<template>
  <div class="word-cards">
    <h2>单词卡片</h2>
    <p class="coming-soon">功能开发中，敬请期待...</p>
    <div class="placeholder">
      <div class="card-example">
        <div class="card-front">Hello</div>
        <div class="card-back">你好</div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 未来实现单词卡片功能
</script>

<style scoped>
.word-cards {
  width: 100%;
  padding: 1rem;
  text-align: center;
}

.coming-soon {
  color: #888;
  margin: 2rem 0;
}

.placeholder {
  display: flex;
  justify-content: center;
  margin: 2rem auto;
}

.card-example {
  width: 250px;
  height: 150px;
  position: relative;
  perspective: 1000px;
  cursor: pointer;
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  backface-visibility: hidden;
  transition: transform 0.6s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-front {
  background-color: #42b983;
  color: white;
  font-size: 2rem;
}

.card-back {
  background-color: #35495e;
  color: white;
  transform: rotateY(180deg);
  font-size: 2rem;
}

.card-example:hover .card-front {
  transform: rotateY(180deg);
}

.card-example:hover .card-back {
  transform: rotateY(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card-example {
    width: 200px;
    height: 120px;
  }

  .card-front, .card-back {
    font-size: 1.5rem;
  }
}
</style>
