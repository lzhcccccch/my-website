<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="copyright">
        &copy; {{ currentYear }} 个人网站. 保留所有权利.
      </div>
      <div class="links">
        <a href="#">关于我们</a>
        <a href="#">隐私政策</a>
        <a href="#">联系我们</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const currentYear = ref(new Date().getFullYear())
</script>

<style scoped>
.app-footer {
  background-color: #f5f5f5;
  padding: 1.5rem 2rem;
  margin-top: auto;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.copyright {
  color: #666;
}

.links a {
  color: #666;
  margin-left: 1.5rem;
  text-decoration: none;
}

.links a:hover {
  color: #333;
  text-decoration: underline;
}
</style>
