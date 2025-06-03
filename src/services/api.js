import axios from 'axios'

/**
 * API 服务配置模块
 * 配置 axios 实例，包括请求/响应拦截器和错误处理
 */

// 创建 axios 实例
const api = axios.create({
    baseURL: 'http://localhost:3000/api', // 后端 API 基础地址
    timeout: 15000, // 请求超时时间（15秒）
    headers: {
        'Content-Type': 'application/json'
    }
})

/**
 * 请求拦截器
 * 在每个请求发送前自动添加认证令牌和其他必要的头部信息
 */
api.interceptors.request.use(
    config => {
        // 添加认证令牌到请求头
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        // 添加请求时间戳（用于调试）
        config.metadata = { startTime: new Date() }

        // 在开发环境下打印请求信息
        if (process.env.NODE_ENV === 'development') {
            console.log(`🚀 API请求: ${config.method?.toUpperCase()} ${config.url}`, {
                data: config.data,
                params: config.params
            })
        }

        return config
    },
    error => {
        console.error('请求拦截器错误:', error)
        return Promise.reject(error)
    }
)

/**
 * 响应拦截器
 * 统一处理响应数据和错误
 */
api.interceptors.response.use(
    response => {
        // 计算请求耗时（用于性能监控）
        const endTime = new Date()
        const duration = endTime - response.config.metadata.startTime

        // 在开发环境下打印响应信息
        if (process.env.NODE_ENV === 'development') {
            console.log(`✅ API响应: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`, {
                status: response.status,
                data: response.data
            })
        }

        // 返回响应数据（而不是整个响应对象）
        return response.data
    },
    error => {
        // 计算请求耗时
        const endTime = new Date()
        const duration = error.config?.metadata ? endTime - error.config.metadata.startTime : 0

        // 在开发环境下打印错误信息
        if (process.env.NODE_ENV === 'development') {
            console.error(`❌ API错误: ${error.config?.method?.toUpperCase()} ${error.config?.url} (${duration}ms)`, {
                status: error.response?.status,
                message: error.message,
                data: error.response?.data
            })
        }

        // 处理不同类型的错误
        if (error.response) {
            // 服务器返回了错误状态码
            const { status, data } = error.response

            switch (status) {
                case 401:
                    // 未授权 - 清除认证信息并重定向到登录页
                    console.warn('用户未授权，清除认证信息')
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')

                    // 避免在登录页面时重复重定向
                    if (!window.location.pathname.includes('/login')) {
                        window.location.href = '/login'
                    }
                    break

                case 403:
                    // 禁止访问
                    console.warn('访问被禁止')
                    break

                case 404:
                    // 资源未找到
                    console.warn('请求的资源未找到')
                    break

                case 422:
                    // 验证错误
                    console.warn('数据验证失败:', data)
                    break

                case 500:
                    // 服务器内部错误
                    console.error('服务器内部错误')
                    break

                default:
                    console.error(`HTTP错误 ${status}:`, data)
            }

            // 返回格式化的错误信息
            return Promise.reject({
                status,
                message: data?.message || `请求失败 (${status})`,
                errors: data?.errors || {},
                originalError: error
            })
        } else if (error.request) {
            // 请求已发出但没有收到响应（网络错误）
            console.error('网络错误或服务器无响应:', error.request)
            return Promise.reject({
                status: 0,
                message: '网络连接失败，请检查网络设置',
                originalError: error
            })
        } else {
            // 其他错误
            console.error('请求配置错误:', error.message)
            return Promise.reject({
                status: -1,
                message: error.message || '请求失败',
                originalError: error
            })
        }
    }
)

export default api
