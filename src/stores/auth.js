import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { STORAGE_KEYS } from '../api/config.js'

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
        return !!user.value && !!localStorage.getItem(STORAGE_KEYS.AUTH.TOKEN)
    })

    // 计算属性：获取用户显示名称
    const userDisplayName = computed(() => {
        return user.value?.username || user.value?.name || '用户'
    })

    /**
     * 设置用户信息和认证状态
     * @param {Object} userData - 用户数据对象，支持新旧两种格式
     * 新格式: { accessToken, tokenType, expiresIn, userInfo: { id, username, email, ... } }
     * 旧格式: { token, username, email, profile }
     */
    function setUser(userData) {
        try {
            // 检查是否为新的API响应格式
            if (userData.accessToken && userData.userInfo) {
                // 新格式：处理标准化的API响应
                const token = `${userData.tokenType || 'Bearer'} ${userData.accessToken}`
                const userInfo = userData.userInfo

                // 构建用户对象
                user.value = {
                    id: userInfo.id,
                    username: userInfo.username,
                    email: userInfo.email,
                    createTime: userInfo.createTime,
                    updateTime: userInfo.updateTime,
                    token: token,
                    expiresIn: userData.expiresIn
                }

                // 存储认证令牌到本地存储
                localStorage.setItem(STORAGE_KEYS.AUTH.TOKEN, token)

                // 存储用户信息到本地存储
                localStorage.setItem(STORAGE_KEYS.AUTH.USER, JSON.stringify({
                    id: userInfo.id,
                    username: userInfo.username,
                    email: userInfo.email,
                    createTime: userInfo.createTime,
                    updateTime: userInfo.updateTime,
                    expiresIn: userData.expiresIn
                }))
            } else {
                // 旧格式：保持向后兼容
                user.value = userData

                // 存储认证令牌到本地存储
                if (userData.token) {
                    localStorage.setItem(STORAGE_KEYS.AUTH.TOKEN, userData.token)
                }

                // 存储用户信息到本地存储
                localStorage.setItem(STORAGE_KEYS.AUTH.USER, JSON.stringify({
                    username: userData.username,
                    email: userData.email,
                    profile: userData.profile
                }))
            }

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
        localStorage.removeItem(STORAGE_KEYS.AUTH.TOKEN)
        localStorage.removeItem(STORAGE_KEYS.AUTH.USER)
    }

    /**
     * 从本地存储恢复用户状态
     * 用于页面刷新后恢复登录状态
     */
    function restoreUserFromStorage() {
        try {
            const token = localStorage.getItem(STORAGE_KEYS.AUTH.TOKEN)
            const storedUser = localStorage.getItem(STORAGE_KEYS.AUTH.USER)

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