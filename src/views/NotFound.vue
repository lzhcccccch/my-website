<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <!-- 404 图标 -->
      <div class="error-icon">
        <span class="error-number">404</span>
      </div>
      
      <!-- 错误信息 -->
      <div class="error-message">
        <h1>页面未找到</h1>
        <p>抱歉，您访问的页面不存在或已被移除。</p>
      </div>
      
      <!-- 操作按钮 -->
      <div class="error-actions">
        <button @click="goHome" class="btn-primary">
          返回首页
        </button>
        <button @click="goBack" class="btn-secondary">
          返回上页
        </button>
      </div>
      
      <!-- 建议链接 -->
      <div class="suggested-links">
        <h3>您可能想要访问：</h3>
        <ul>
          <li>
            <router-link to="/">🏠 首页</router-link>
          </li>
          <li>
            <router-link to="/navigation">🧭 个人导航站</router-link>
          </li>
          <li>
            <router-link to="/note">📝 心情随想录</router-link>
          </li>
          <li>
            <router-link to="/word">📚 单词卡片</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

/**
 * 404 页面未找到组件
 * 当用户访问不存在的路由时显示此页面
 */

const router = useRouter()

/**
 * 返回首页
 */
const goHome = () => {
  router.push('/')
}

/**
 * 返回上一页
 */
const goBack = () => {
  // 如果有历史记录则返回上一页，否则跳转到首页
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.not-found-content {
  text-align: center;
  max-width: 600px;
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.error-icon {
  margin-bottom: 2rem;
}

.error-number {
  font-size: 8rem;
  font-weight: bold;
  color: #e74c3c;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  display: block;
  line-height: 1;
}

.error-message h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  font-weight: 600;
}

.error-message p {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-secondary:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.suggested-links {
  border-top: 1px solid #ecf0f1;
  padding-top: 2rem;
}

.suggested-links h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.suggested-links ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.suggested-links li {
  margin: 0.5rem;
}

.suggested-links a {
  color: #3498db;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  display: block;
}

.suggested-links a:hover {
  background: #3498db;
  color: white;
  transform: translateY(-1px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .not-found-content {
    padding: 2rem;
    margin: 1rem;
  }
  
  .error-number {
    font-size: 6rem;
  }
  
  .error-message h1 {
    font-size: 2rem;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    max-width: 200px;
  }
  
  .suggested-links ul {
    flex-direction: column;
    align-items: center;
  }
}
</style>
