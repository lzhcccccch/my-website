import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const isAuthenticated = ref(false)

    function setUser(userData) {
        user.value = userData
        isAuthenticated.value = true
        localStorage.setItem('token', userData.token)
    }

    function logout() {
        user.value = null
        isAuthenticated.value = false
        localStorage.removeItem('token')
    }

    // 初始化时检查本地存储中是否有 token
    function init() {
        const token = localStorage.getItem('token')
        if (token) {
            isAuthenticated.value = true
            // 这里可以添加验证 token 的逻辑，例如向后端发送请求获取用户信息
        }
    }

    return {
        user,
        isAuthenticated,
        setUser,
        logout,
        init
    }
})
