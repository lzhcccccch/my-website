import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 用户认证状态管理 Store
 * 负责管理用户登录状态、用户信息和认证相关的操作
 */
export const useAuthStore = defineStore('auth', () => {
    // 响应式状态
    const user = ref(null) // 当前登录用户信息
    const isLoading = ref(false) // 认证操作加载状态
    const error = ref(null) // 认证错误信息

    // 计算属性：用户是否已认证
    const isAuthenticated = computed(() => {
        return !!user.value && !!localStorage.getItem('token')
    })

    // 计算属性：获取用户显示名称
    const userDisplayName = computed(() => {
        return user.value?.username || user.value?.name || '用户'
    })

    /**
     * 设置用户信息和认证状态
     * @param {Object} userData - 用户数据对象
     * @param {string} userData.token - JWT认证令牌
     * @param {string} userData.username - 用户名
     * @param {string} [userData.email] - 用户邮箱
     * @param {Object} [userData.profile] - 用户资料信息
     */
    function setUser(userData) {
        try {
            user.value = userData
            // 存储认证令牌到本地存储
            if (userData.token) {
                localStorage.setItem('token', userData.token)
            }
            // 存储用户信息到本地存储（可选，用于页面刷新后恢复状态）
            localStorage.setItem('user', JSON.stringify({
                username: userData.username,
                email: userData.email,
                profile: userData.profile
            }))
            error.value = null
        } catch (err) {
            console.error('设置用户信息失败:', err)
            error.value = '设置用户信息失败'
        }
    }

    /**
     * 用户登出操作
     * 清除所有认证相关的本地存储和状态
     */
    function logout() {
        user.value = null
        error.value = null
        // 清除本地存储中的认证信息
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    /**
     * 从本地存储恢复用户状态
     * 用于页面刷新后恢复登录状态
     */
    function restoreUserFromStorage() {
        try {
            const token = localStorage.getItem('token')
            const storedUser = localStorage.getItem('user')

            if (token && storedUser) {
                const userData = JSON.parse(storedUser)
                user.value = { ...userData, token }
            }
        } catch (err) {
            console.error('从本地存储恢复用户状态失败:', err)
            // 如果恢复失败，清除可能损坏的数据
            logout()
        }
    }

    /**
     * 设置加载状态
     * @param {boolean} loading - 加载状态
     */
    function setLoading(loading) {
        isLoading.value = loading
    }

    /**
     * 设置错误信息
     * @param {string|null} errorMessage - 错误信息
     */
    function setError(errorMessage) {
        error.value = errorMessage
    }

    /**
     * 清除错误信息
     */
    function clearError() {
        error.value = null
    }

    return {
        // 状态
        user,
        isLoading,
        error,

        // 计算属性
        isAuthenticated,
        userDisplayName,

        // 方法
        setUser,
        logout,
        restoreUserFromStorage,
        setLoading,
        setError,
        clearError
    }
})