<!-- 应用程序根组件, 负责初始化应用状态和提供全局布局 -->

<template>
  <DefaultLayout>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component"/>
      </transition>
    </router-view>
  </DefaultLayout>
</template>

<script setup>
import {onMounted} from 'vue'
import DefaultLayout from './components/layout/DefaultLayout.vue'
import {useAuthStore} from './stores/auth'
import {getCurrentUser} from './api/auth.js'
import {STORAGE_KEYS} from "./api/config.js";

const authStore = useAuthStore()

/**
 * 初始化应用程序
 * 在组件挂载时执行认证状态恢复和用户信息获取
 */
onMounted(async () => {
  try {
    // 设置加载状态
    authStore.setLoading(true)

    // 首先尝试从本地存储恢复用户状态
    authStore.restoreUserFromStorage()

    // 如果用户未登录，无需执行后续操作
    if (!authStore.isAuthenticated) {
      return;
    }

    /*
      为什么需要这段验证:
      1. 应用启动/刷新时的初始验证：令牌可能已过期
      2. 获取最新用户信息：确保数据同步
      3. 提供无缝用户体验：避免用户操作时才发现令牌无效

      注意：401错误也会在响应拦截器中处理，这里是主动验证
    */

    try {
      // 向服务器验证令牌并获取最新用户信息
      const userData = await getCurrentUser()

      // 检查用户数据
      if (userData.data) {
        // 新格式：直接使用API返回的数据，但保持现有token
        authStore.setUser({
          accessToken: localStorage.getItem(STORAGE_KEYS.AUTH.TOKEN),
          tokenType: 'Bearer',
          userInfo: userData.data
        })
        console.log('用户认证状态已恢复:', userData.data.username)
      }
    } catch (err) {
      console.warn('令牌验证失败，清除认证状态:', err.message)
      // 如果令牌无效，清除所有认证信息
      authStore.logout()
    }
  } catch (err) {
    console.error('应用初始化失败:', err)
    // 发生错误时清除可能损坏的认证状态
    authStore.logout()
  } finally {
    // 清除加载状态
    authStore.setLoading(false)
  }
})
</script>

<style>
/* 全局样式 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f9f9f9;
}

</style>
