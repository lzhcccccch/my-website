<template>
  <footer class="footer">
    <p>&copy; {{ currentYear }} 我的个人网站. 保留所有权利.</p>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const currentYear = ref(new Date().getFullYear())
</script>

<style scoped>
.footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 1rem;
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer {
    padding: 0.8rem;
    font-size: 0.9rem;
  }
}
</style>
