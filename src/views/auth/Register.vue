<template>
  <div class="register-container">
    <div class="register-form">
      <h2>注册</h2>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <form @submit.prevent="register">
        <div class="form-group">
          <label for="name">姓名</label>
          <input
              type="text"
              id="name"
              v-model="registerForm.name"
              required
          />
        </div>

        <div class="form-group">
          <label for="email">邮箱</label>
          <input
              type="email"
              id="email"
              v-model="registerForm.email"
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
import { useAuth } from '../../composables/useAuth'

const { registerForm, loading, error, register } = useAuth()
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.register-form {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
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
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

button:hover {
  background-color: #0b7dda;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.form-footer {
  margin-top: 1rem;
  text-align: center;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}
</style>
