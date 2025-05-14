<template>
  <div class="register-container">
    <div class="register-form">
      <h2>注册</h2>

      <div v-if="error" class="error-message">
        <div class="error-icon">!</div>
        <div class="error-content">
          <strong>错误：</strong>
          {{ error }}
        </div>
      </div>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
              type="text"
              id="username"
              v-model="registerForm.username"
              required
          />
        </div>

        <div class="form-group">
          <label for="password">密码</label>
          <input
              type="password"
              id="password"
              v-model="registerForm.password"
              required
          />
        </div>

        <div class="form-group">
          <label for="confirm-password">确认密码</label>
          <input
              type="password"
              id="confirm-password"
              v-model="registerForm.confirmPassword"
              required
          />
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? '注册中...' : '注册' }}
        </button>

        <div class="form-footer">
          <p>已有账号？ <router-link to="/login">登录</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import api from '../../services/api.js' // 假设你有一个 API 实例

const router = useRouter()
const authStore = useAuthStore()

const registerForm = ref({
  username: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref(null)

async function handleRegister() {
  try {
    loading.value = true
    error.value = null

    // 验证两次密码是否一致
    if (registerForm.value.password !== registerForm.value.confirmPassword) {
      error.value = '两次输入的密码不一致'
      return
    }

    // 创建不包含 confirmPassword 的对象发送给后端
    const userData = {
      username: registerForm.value.username,
      password: registerForm.value.password
    }

    // 直接在组件中发起 API 请求
    const response = await api.post('/auth/register', userData)

    // 注册成功后更新状态
    authStore.setUser(response.data)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || '注册失败，请稍后再试'
    console.error('注册错误:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 1rem;
}

.register-form {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.25rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}

.form-footer {
  margin-top: 1.5rem;
  text-align: center;
}

.form-footer a {
  color: #2196f3;
  text-decoration: none;
}

.form-footer a:hover {
  text-decoration: underline;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.error-icon {
  background-color: #c62828;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 0.75rem;
}

.error-content {
  flex: 1;
}
</style>
