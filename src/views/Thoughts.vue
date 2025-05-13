<template>
  <div class="thoughts">
    <h2>心情随想录</h2>
    <div class="thought-input">
      <textarea
          v-model="newThought"
          placeholder="写下你的想法..."
          rows="3"
      ></textarea>
      <button @click="addThought">发布</button>
    </div>
    <div class="thought-list">
      <div v-for="(thought, index) in thoughts" :key="index" class="thought-card">
        <p>{{ thought.content }}</p>
        <div class="thought-meta">
          <span>{{ thought.date }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const newThought = ref('')
const thoughts = ref([
  {
    content: '今天学习了Vue 3的组合式API，感觉很强大！',
    date: '2025-05-13 14:30'
  },
  {
    content: '计划这周完成个人网站的基本框架搭建。',
    date: '2025-05-12 09:15'
  }
])

const addThought = () => {
  if (newThought.value.trim()) {
    const now = new Date()
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    thoughts.value.unshift({
      content: newThought.value,
      date: formattedDate
    })
    newThought.value = ''
  }
}
</script>

<style scoped>
.thoughts {
  width: 100%;
  padding: 1rem;
}

.thought-input {
  margin-bottom: 2rem;
  width: 100%;
}

.thought-input textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
  font-size: 1rem;
}

.thought-input button {
  margin-top: 0.8rem;
  padding: 0.7rem 1.5rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.thought-input button:hover {
  background-color: #3aa876;
}

.thought-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.thought-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1.2rem;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.thought-meta {
  margin-top: 0.8rem;
  font-size: 0.85rem;
  color: #888;
  text-align: right;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .thought-input textarea {
    padding: 0.6rem;
  }

  .thought-input button {
    width: 100%;
  }

  .thought-card {
    padding: 1rem;
  }
}
</style>
