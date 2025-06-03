<template>
  <header class="app-header">
    <div class="logo">
      <router-link to="/">栈外听风</router-link>
    </div>

    <nav class="nav-menu">
      <ul>
        <li>
          <router-link to="/">首页</router-link>
        </li>
        <li>
          <router-link to="/navigation">导航站</router-link>
        </li>
        <li>
          <router-link to="/thoughts">心情随想录</router-link>
        </li>
        <li>
          <router-link to="/word">单词卡片</router-link>
        </li>
      </ul>
    </nav>

    <div class="user-actions">
      <template v-if="isLoggedIn">
        <div class="user-info">
          <span class="username">{{ userDisplayName }}</span>
          <div class="user-menu">
            <button class="logout-btn" @click="handleLogout" :disabled="isLoading">
              <span v-if="isLoading" class="loading-spinner"></span>
              {{ isLoading ? '退出中...' : '退出登录' }}
            </button>
          </div>
        </div>
      </template>
      <template v-else>
        <router-link to="/login" class="login-btn">登录</router-link>
        <router-link to="/register" class="register-btn">注册</router-link>
      </template>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { logout } from '../../services/auth'

/**
 * 应用程序头部组件
 * 包含导航菜单和用户操作区域
 */

const router = useRouter()
const authStore = useAuthStore()

// 计算属性：用户登录状态
const isLoggedIn = computed(() => authStore.isAuthenticated)

// 计算属性：当前用户信息
const currentUser = computed(() => authStore.user)

// 计算属性：用户显示名称
const userDisplayName = computed(() => authStore.userDisplayName)

// 计算属性：加载状态
const isLoading = computed(() => authStore.isLoading)

/**
 * 处理用户登出
 */
async function handleLogout() {
  try {
    // 设置加载状态
    authStore.setLoading(true)

    // 向服务器发送登出请求
    await logout()

    console.log('用户已成功登出')

  } catch (err) {
    console.error('登出请求失败:', err)
    // 即使服务器请求失败，也要清除本地状态
  } finally {
    // 清除本地认证状态
    authStore.logout()

    // 重定向到登录页面
    router.push('/login')
  }
}
</script>

<style scoped>
/* 应用程序头部 */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-base) var(--spacing-xl);
  background: var(--color-bg-primary);
  box-shadow: var(--shadow-base);
  border-bottom: 1px solid var(--color-border-light);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

/* Logo 样式 */
.logo a {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  text-decoration: none;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: var(--transition-base);
}

.logo a:hover {
  transform: scale(1.05);
}

/* 导航菜单 */
.nav-menu ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: var(--spacing-lg);
}

.nav-menu li {
  position: relative;
}

.nav-menu a {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-base);
  padding: var(--spacing-sm) var(--spacing-base);
  border-radius: var(--radius-base);
  transition: var(--transition-base);
  position: relative;
}

.nav-menu a:hover {
  color: var(--color-primary);
  background: var(--color-gray-50);
}

.nav-menu a.router-link-active {
  color: var(--color-primary);
  background: var(--color-gray-50);
}

.nav-menu a.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: var(--color-primary);
  border-radius: var(--radius-full);
}

.user-actions {
  display: flex;
  align-items: center;
}

/* 用户信息区域 */
.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.username {
  font-weight: 500;
  color: #2c3e50;
  padding: 0.5rem 0;
}

.user-menu {
  display: flex;
  align-items: center;
}

/* 登出按钮 */
.logout-btn {
  background: transparent;
  border: 2px solid #e74c3c;
  color: #e74c3c;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logout-btn:hover:not(:disabled) {
  background: #e74c3c;
  color: white;
  transform: translateY(-1px);
}

.logout-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 加载动画 */
.loading-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 登录和注册按钮 */
.login-btn,
.register-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-base);
  text-decoration: none;
  margin-left: var(--spacing-sm);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  transition: var(--transition-base);
  border: 2px solid;
  display: inline-flex;
  align-items: center;
}

.login-btn {
  background: transparent;
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.login-btn:hover {
  background: var(--color-primary);
  color: white;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.register-btn {
  background: linear-gradient(135deg, var(--color-success) 0%, var(--color-success-dark) 100%);
  color: white;
  border-color: var(--color-success);
}

.register-btn:hover {
  background: linear-gradient(135deg, var(--color-success-dark) 0%, var(--color-success) 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-header {
    padding: var(--spacing-sm) var(--spacing-base);
  }

  .nav-menu ul {
    gap: var(--spacing-base);
  }

  .nav-menu a {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-sm);
  }

  .user-info {
    gap: var(--spacing-sm);
  }

  .username {
    font-size: var(--font-size-sm);
  }

  .logout-btn,
  .login-btn,
  .register-btn {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-xs);
  }

  .login-btn,
  .register-btn {
    margin-left: var(--spacing-xs);
  }
}

@media (max-width: 640px) {
  .nav-menu {
    display: none; /* 在小屏幕上隐藏导航菜单，可以后续添加移动端菜单 */
  }

  .logo a {
    font-size: var(--font-size-lg);
  }
}
</style>
