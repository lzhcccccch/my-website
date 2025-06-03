<template>
  <div class="home">
    <!-- 英雄区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          欢迎来到
          <span class="gradient-text">栈外听风</span>
        </h1>
        <p class="hero-subtitle">
          一个集导航、笔记、学习于一体的个人数字空间，在技术栈外聆听生活的声音
        </p>

        <!-- 用户状态显示 -->
        <div v-if="isAuthenticated" class="welcome-message">
          <div class="welcome-icon">👋</div>
          <span>欢迎回来，{{ userDisplayName }}！</span>
        </div>
        <div v-else class="auth-prompt">
          <p>登录后解锁更多功能</p>
          <div class="auth-buttons">
            <router-link to="/login" class="btn btn-primary">立即登录</router-link>
            <router-link to="/register" class="btn btn-secondary">免费注册</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- 功能特性区域 -->
    <section class="features-section">
      <div class="section-header">
        <h2>探索功能</h2>
        <p>发现这个网站为您提供的强大功能</p>
      </div>

      <div class="features-grid">
        <div
          class="feature-card"
          @click="navigateTo('/navigation')"
          :class="{ 'locked': !isAuthenticated }"
        >
          <div class="feature-icon">🧭</div>
          <div class="feature-content">
            <h3>个人导航站</h3>
            <p>收集和整理您喜欢的网站链接，打造专属的网络导航</p>
            <div class="feature-tags">
              <span class="tag">书签管理</span>
              <span class="tag">分类整理</span>
            </div>
          </div>
          <div v-if="!isAuthenticated" class="lock-overlay">
            <div class="lock-icon">🔒</div>
          </div>
        </div>

        <div
          class="feature-card"
          @click="navigateTo('/mood-journal')"
          :class="{ 'locked': !isAuthenticated }"
        >
          <div class="feature-icon">📝</div>
          <div class="feature-content">
            <h3>心情随想录</h3>
            <p>记录每一天的心情和想法，留下生活的美好瞬间</p>
            <div class="feature-tags">
              <span class="tag">日记记录</span>
              <span class="tag">心情追踪</span>
            </div>
          </div>
          <div v-if="!isAuthenticated" class="lock-overlay">
            <div class="lock-icon">🔒</div>
          </div>
        </div>

        <div
          class="feature-card"
          @click="navigateTo('/word-cards')"
          :class="{ 'locked': !isAuthenticated }"
        >
          <div class="feature-icon">📚</div>
          <div class="feature-content">
            <h3>单词卡片</h3>
            <p>创建和学习单词卡片，提升您的语言学习效率</p>
            <div class="feature-tags">
              <span class="tag">语言学习</span>
              <span class="tag coming-soon">即将推出</span>
            </div>
          </div>
          <div v-if="!isAuthenticated" class="lock-overlay">
            <div class="lock-icon">🔒</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 统计信息区域（仅登录用户可见） -->
    <section v-if="isAuthenticated" class="stats-section">
      <div class="section-header">
        <h2>使用统计</h2>
        <p>查看您的使用情况</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🔗</div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.bookmarks }}</div>
            <div class="stat-label">收藏链接</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📖</div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.notes }}</div>
            <div class="stat-label">笔记条数</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.days }}</div>
            <div class="stat-label">使用天数</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

/**
 * 首页组件
 * 展示网站功能概览、用户统计信息和快速导航
 */

const router = useRouter()
const authStore = useAuthStore()

// 响应式数据
const stats = ref({
  bookmarks: 0,
  notes: 0,
  days: 0
})

// 计算属性：用户认证状态
const isAuthenticated = computed(() => authStore.isAuthenticated)

// 计算属性：用户显示名称
const userDisplayName = computed(() => authStore.userDisplayName)

/**
 * 导航到指定路径
 * 如果用户未登录，则重定向到登录页面
 * @param {string} path - 目标路径
 */
const navigateTo = (path) => {
  if (isAuthenticated.value) {
    router.push(path)
  } else {
    // 保存目标路径，登录后自动跳转
    router.push({
      name: 'Login',
      query: { redirect: path }
    })
  }
}

/**
 * 加载用户统计数据
 * 获取用户的使用统计信息
 */
const loadUserStats = async () => {
  if (!isAuthenticated.value) return

  try {
    // 这里可以调用API获取真实的统计数据
    // 目前使用模拟数据
    stats.value = {
      bookmarks: Math.floor(Math.random() * 50) + 10, // 10-60个书签
      notes: Math.floor(Math.random() * 30) + 5,      // 5-35条笔记
      days: Math.floor(Math.random() * 100) + 1       // 1-100天
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
    // 使用默认值
    stats.value = {
      bookmarks: 0,
      notes: 0,
      days: 0
    }
  }
}

/**
 * 组件挂载时的初始化
 */
onMounted(() => {
  // 如果用户已登录，加载统计数据
  if (isAuthenticated.value) {
    loadUserStats()
  }
})
</script>

<style scoped>
/* 首页容器 */
.home {
  width: 100%;
  min-height: calc(100vh - 80px);
}

/* 英雄区域 */
.hero-section {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
  padding: var(--spacing-3xl) var(--spacing-base);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  pointer-events: none;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-base);
  line-height: var(--line-height-tight);
}

.gradient-text {
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-xl);
  opacity: 0.9;
  line-height: var(--line-height-relaxed);
}

/* 欢迎消息 */
.welcome-message {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: rgba(255, 255, 255, 0.2);
  padding: var(--spacing-base) var(--spacing-lg);
  border-radius: var(--radius-xl);
  backdrop-filter: blur(10px);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
}

.welcome-icon {
  font-size: var(--font-size-xl);
  animation: wave 2s ease-in-out infinite;
}

@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(20deg); }
  75% { transform: rotate(-10deg); }
}

/* 认证提示 */
.auth-prompt {
  margin-top: var(--spacing-lg);
}

.auth-prompt p {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-base);
  opacity: 0.9;
}

.auth-buttons {
  display: flex;
  gap: var(--spacing-base);
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-xl);
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  transition: var(--transition-base);
  border: 2px solid transparent;
}

.btn-primary {
  background: white;
  color: var(--color-primary);
  border-color: white;
}

.btn-primary:hover {
  background: transparent;
  color: white;
  border-color: white;
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: white;
  border-color: white;
}

.btn-secondary:hover {
  background: white;
  color: var(--color-primary);
  transform: translateY(-2px);
}

/* 区域样式 */
.features-section,
.stats-section {
  padding: var(--spacing-3xl) var(--spacing-base);
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
}

.section-header h2 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-base);
  color: var(--color-text-primary);
}

.section-header p {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

/* 功能卡片网格 */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-xl);
  margin-top: var(--spacing-2xl);
}

.feature-card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-base);
  cursor: pointer;
  transition: var(--transition-base);
  position: relative;
  overflow: hidden;
  border: 1px solid var(--color-border-light);
}

.feature-card:hover:not(.locked) {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
  border-color: var(--color-primary);
}

.feature-card.locked {
  opacity: 0.7;
  cursor: not-allowed;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-base);
  display: block;
}

.feature-content h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
}

.feature-content p {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-base);
}

.feature-tags {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.tag {
  background: var(--color-gray-100);
  color: var(--color-text-secondary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-base);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.tag.coming-soon {
  background: var(--color-warning);
  color: white;
}

/* 锁定覆盖层 */
.lock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}

.lock-icon {
  font-size: 2rem;
  opacity: 0.6;
}

/* 统计卡片网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
}

.stat-card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-base);
  text-align: center;
  border: 1px solid var(--color-border-light);
  transition: var(--transition-base);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-base);
  display: block;
}

.stat-number {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: var(--font-size-3xl);
  }

  .hero-subtitle {
    font-size: var(--font-size-base);
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .auth-buttons {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 200px;
    justify-content: center;
  }

  .features-section,
  .stats-section {
    padding: var(--spacing-xl) var(--spacing-base);
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: var(--spacing-xl) var(--spacing-base);
  }

  .feature-card {
    padding: var(--spacing-lg);
  }

  .section-header h2 {
    font-size: var(--font-size-2xl);
  }
}
</style>
