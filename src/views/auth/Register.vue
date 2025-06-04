<template>
  <div class="register-container">
    <div class="register-form">
      <h2>创建账号</h2>
      <p class="form-subtitle">加入我们，开始您的个人网站之旅</p>

      <!-- 全局错误信息 -->
      <div v-if="error" class="error-message">
        <div class="error-icon">!</div>
        <div class="error-content">
          <strong>注册失败：</strong>
          {{ error }}
        </div>
      </div>

      <form @submit.prevent="handleRegister">
        <!-- 用户名输入框 -->
        <div class="form-group">
          <label for="username">用户名</label>
          <input
              type="text"
              id="username"
              v-model="registerForm.username"
              :class="{ 'error': fieldErrors.username }"
              @input="clearFieldError('username')"
              @focus="clearFieldError('username')"
              placeholder="请输入用户名（3-20个字符）"
              autocomplete="username"
              required
          />
          <div v-if="fieldErrors.username" class="field-error">
            {{ fieldErrors.username }}
          </div>
        </div>

        <!-- 邮箱输入框（可选） -->
        <div class="form-group">
          <label for="email">邮箱地址 <span class="optional">(可选)</span></label>
          <input
              type="email"
              id="email"
              v-model="registerForm.email"
              :class="{ 'error': fieldErrors.email }"
              @input="clearFieldError('email')"
              @focus="clearFieldError('email')"
              placeholder="请输入邮箱地址"
              autocomplete="email"
          />
          <div v-if="fieldErrors.email" class="field-error">
            {{ fieldErrors.email }}
          </div>
        </div>

        <!-- 密码输入框 -->
        <div class="form-group">
          <label for="password">密码</label>
          <input
              type="password"
              id="password"
              v-model="registerForm.password"
              :class="{ 'error': fieldErrors.password }"
              @input="clearFieldError('password')"
              @focus="clearFieldError('password')"
              placeholder="请输入密码（至少6个字符）"
              autocomplete="new-password"
              required
          />
          <div v-if="fieldErrors.password" class="field-error">
            {{ fieldErrors.password }}
          </div>
        </div>

        <!-- 确认密码输入框 -->
        <div class="form-group">
          <label for="confirm-password">确认密码</label>
          <input
              type="password"
              id="confirm-password"
              v-model="registerForm.confirmPassword"
              :class="{ 'error': fieldErrors.confirmPassword }"
              @input="clearFieldError('confirmPassword')"
              @focus="clearFieldError('confirmPassword')"
              placeholder="请再次输入密码"
              autocomplete="new-password"
              required
          />
          <div v-if="fieldErrors.confirmPassword" class="field-error">
            {{ fieldErrors.confirmPassword }}
          </div>
        </div>

        <!-- 注册按钮 -->
        <button
          type="submit"
          :disabled="loading || !isFormValid"
          class="register-button"
        >
          <span v-if="loading" class="loading-spinner"></span>
          {{ loading ? '注册中...' : '立即注册' }}
        </button>

        <!-- 页面底部链接 -->
        <div class="form-footer">
          <p>已有账号？ <router-link to="/login">立即登录</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { register, validateRegisterData } from '../../api/auth.js'

/**
 * 用户注册组件
 * 提供用户注册功能，包括表单验证和错误处理
 */

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 表单数据
const registerForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 组件状态
const loading = ref(false)
const error = ref(null)
const fieldErrors = ref({})

// 计算属性：表单是否有效
const isFormValid = computed(() => {
  const validation = validateRegisterData(registerForm.value)
  return validation.isValid
})

// 计算属性：是否显示错误信息
const hasErrors = computed(() => {
  return error.value || Object.keys(fieldErrors.value).length > 0
})

/**
 * 处理用户注册
 */
async function handleRegister() {
  try {
    // 清除之前的错误
    error.value = null
    fieldErrors.value = {}

    // 前端验证
    const validation = validateRegisterData(registerForm.value)
    if (!validation.isValid) {
      fieldErrors.value = validation.errors
      return
    }

    // 设置加载状态
    loading.value = true
    authStore.setLoading(true)

    // 准备发送给后端的数据（排除确认密码字段）
    const userData = {
      username: registerForm.value.username.trim(),
      password: registerForm.value.password
    }

    // 如果提供了邮箱，添加到数据中
    if (registerForm.value.email && registerForm.value.email.trim()) {
      userData.email = registerForm.value.email.trim()
    }

    // 发送注册请求
    const responseData = await register(userData)

    // 注册成功，更新认证状态
    authStore.setUser(responseData)

    console.log('注册成功，用户:', responseData.username)

    // 跳转到首页
    router.push('/')

  } catch (err) {
    console.error('注册失败:', err)

    // 处理不同类型的错误
    if (err.code && err.code !== '0') {
      // 新格式：业务逻辑错误，直接使用message
      if (err.errors && typeof err.errors === 'object') {
        fieldErrors.value = err.errors
      } else {
        error.value = err.message || '注册失败，请稍后再试'
      }
    } else if (err.status === 422 && err.errors) {
      // 旧格式：服务器验证错误
      fieldErrors.value = err.errors
    } else if (err.status === 409) {
      // 旧格式：用户名已存在
      fieldErrors.value = { username: '用户名已被使用，请选择其他用户名' }
    } else if (err.status === 0) {
      // 网络错误
      error.value = '网络连接失败，请检查网络设置'
    } else {
      // 其他错误
      error.value = err.message || '注册失败，请稍后再试'
    }

    // 设置错误状态到 store
    authStore.setError(error.value)

  } finally {
    loading.value = false
    authStore.setLoading(false)
  }
}

/**
 * 清除字段错误
 * @param {string} fieldName - 字段名称
 */
function clearFieldError(fieldName) {
  if (fieldErrors.value[fieldName]) {
    delete fieldErrors.value[fieldName]
  }
}

/**
 * 清除所有错误
 */
function clearAllErrors() {
  error.value = null
  fieldErrors.value = {}
  authStore.clearError()
}

/**
 * 组件挂载时的初始化
 */
onMounted(() => {
  // 清除可能存在的错误状态
  clearAllErrors()
})
</script>

<style scoped>
/* 注册页面容器 */
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 1rem;
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
}

/* 注册表单卡片 */
.register-form {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  position: relative;
  overflow: hidden;
}

/* 表单标题 */
h2 {
  text-align: center;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
}

/* 表单副标题 */
.form-subtitle {
  text-align: center;
  margin-bottom: 2rem;
  color: #7f8c8d;
  font-size: 0.9rem;
  line-height: 1.4;
}

/* 表单组 */
.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

/* 标签样式 */
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #34495e;
  font-size: 0.9rem;
}

.optional {
  color: #95a5a6;
  font-weight: 400;
  font-size: 0.8rem;
}

/* 输入框样式 */
input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #2ecc71;
  background: white;
  box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.1);
}

input.error {
  border-color: #e74c3c;
  background: #fdf2f2;
}

input.error:focus {
  border-color: #e74c3c;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

/* 字段错误信息 */
.field-error {
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
}

.field-error::before {
  content: "⚠";
  margin-right: 0.25rem;
}

/* 注册按钮 */
.register-button {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.register-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(46, 204, 113, 0.3);
}

.register-button:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 加载动画 */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 表单底部 */
.form-footer {
  margin-top: 2rem;
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #ecf0f1;
}

.form-footer p {
  color: #7f8c8d;
  margin: 0;
}

.form-footer a {
  color: #2ecc71;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.form-footer a:hover {
  color: #27ae60;
  text-decoration: underline;
}

/* 全局错误信息 */
.error-message {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(238, 90, 82, 0.3);
}

.error-icon {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 0.75rem;
  font-size: 0.9rem;
}

.error-content {
  flex: 1;
}

.error-content strong {
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .register-container {
    padding: 0.5rem;
    min-height: 100vh;
  }

  .register-form {
    padding: 2rem 1.5rem;
    border-radius: 12px;
  }

  h2 {
    font-size: 1.5rem;
  }

  .form-subtitle {
    font-size: 0.8rem;
  }

  input {
    padding: 0.75rem;
  }

  .register-button {
    padding: 0.75rem;
  }
}
</style>
