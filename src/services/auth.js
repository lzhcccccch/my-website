import api from './api'

/**
 * 认证服务模块
 * 提供用户认证相关的API调用方法
 */

/**
 * 验证用户输入的登录信息
 * @param {Object} credentials - 登录凭据
 * @param {string} credentials.username - 用户名
 * @param {string} credentials.password - 密码
 * @returns {Object} 验证结果
 */
export function validateLoginCredentials(credentials) {
    const errors = {}

    // 验证用户名
    if (!credentials.username || credentials.username.trim().length === 0) {
        errors.username = '请输入用户名'
    } else if (credentials.username.length < 3) {
        errors.username = '用户名至少需要3个字符'
    } else if (credentials.username.length > 20) {
        errors.username = '用户名不能超过20个字符'
    }

    // 验证密码
    if (!credentials.password || credentials.password.length === 0) {
        errors.password = '请输入密码'
    } else if (credentials.password.length < 6) {
        errors.password = '密码至少需要6个字符'
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}

/**
 * 验证用户注册信息
 * @param {Object} userData - 注册用户数据
 * @param {string} userData.username - 用户名
 * @param {string} userData.password - 密码
 * @param {string} userData.confirmPassword - 确认密码
 * @param {string} [userData.email] - 邮箱地址
 * @returns {Object} 验证结果
 */
export function validateRegisterData(userData) {
    const errors = {}

    // 验证用户名
    if (!userData.username || userData.username.trim().length === 0) {
        errors.username = '请输入用户名'
    } else if (userData.username.length < 3) {
        errors.username = '用户名至少需要3个字符'
    } else if (userData.username.length > 20) {
        errors.username = '用户名不能超过20个字符'
    } else if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(userData.username)) {
        errors.username = '用户名只能包含字母、数字、下划线和中文字符'
    }

    // 验证密码
    if (!userData.password || userData.password.length === 0) {
        errors.password = '请输入密码'
    } else if (userData.password.length < 6) {
        errors.password = '密码至少需要6个字符'
    } else if (userData.password.length > 50) {
        errors.password = '密码不能超过50个字符'
    }

    // 验证确认密码
    if (!userData.confirmPassword) {
        errors.confirmPassword = '请确认密码'
    } else if (userData.password !== userData.confirmPassword) {
        errors.confirmPassword = '两次输入的密码不一致'
    }

    // 验证邮箱（如果提供）
    if (userData.email && userData.email.trim().length > 0) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(userData.email)) {
            errors.email = '请输入有效的邮箱地址'
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}

/**
 * 用户登录
 * @param {Object} credentials - 登录凭据
 * @returns {Promise} API响应
 */
export function login(credentials) {
    return api.post('/auth/login', credentials)
}

/**
 * 用户注册
 * @param {Object} userData - 注册用户数据
 * @returns {Promise} API响应
 */
export function register(userData) {
    return api.post('/auth/register', userData)
}

/**
 * 获取当前用户信息
 * @returns {Promise} API响应
 */
export function getCurrentUser() {
    return api.get('/auth/me')
}

/**
 * 用户登出
 * @returns {Promise} API响应
 */
export function logout() {
    return api.post('/auth/logout')
}

/**
 * 刷新认证令牌
 * @returns {Promise} API响应
 */
export function refreshToken() {
    return api.post('/auth/refresh')
}

/**
 * 检查用户名是否可用
 * @param {string} username - 用户名
 * @returns {Promise} API响应
 */
export function checkUsernameAvailability(username) {
    return api.get(`/auth/check-username/${encodeURIComponent(username)}`)
}
