import axios from 'axios'
import {API_CONFIG, STORAGE_KEYS} from './config.js'

/**
 * API 服务配置模块
 * 配置 axios 实例，包括请求/响应拦截器和错误处理
 */

// 创建 axios 实例
const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.HEADERS
})

/**
 * 请求拦截器
 * 在每个请求发送前自动添加认证令牌和其他必要的头部信息
 *
 * api.interceptors.request.use() 用于注册请求拦截器。
 *  第一个参数是一个回调函数，它会在每次发起请求前被调用，用于统一修改请求配置（如添加 token、设置 headers、记录时间等）。
 *      此时请求还没有真正发出，处理请求头等操作正是在这里完成的，确保每个请求都带上必要的信息。
 *      只有当这个回调没有抛出错误，axios 才会继续发送请求。
 *  第二个参数是请求出错时的回调。
 *
 *  `config` 是 Axios 请求配置对象，常见属性有：
 * - `url`：请求地址
 * - `method`：HTTP 方法（如 `get`、`post` 等）
 * - `baseURL`：基础 URL
 * - `headers`：请求头对象
 * - `params`：URL 查询参数
 * - `data`：请求体数据（POST/PUT 等）
 * - `timeout`：超时时间
 * - `withCredentials`：是否携带跨域凭证
 * - `responseType`：响应类型
 * - `onUploadProgress`/`onDownloadProgress`：上传/下载进度回调
 *
 * 此外还可以自定义属性（如本代码中的 `metadata`），Axios 会将其原样传递。
 * 完整属性可参考 [Axios 请求配置文档](https://axios-http.com/zh/docs/req_config)。
 */
api.interceptors.request.use(
    config => {
        // 添加认证令牌到请求头
        const token = localStorage.getItem(STORAGE_KEYS.AUTH.TOKEN)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
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
        // 处理标准化API响应格式
        const responseData = response.data

        // 检查是否为标准化响应格式
        if (responseData && typeof responseData === 'object' && 'code' in responseData) {
            // 检查业务逻辑是否成功
            if (responseData.code === '0') {
                // 成功：返回data字段的内容
                return responseData.data || {}
            } else {
                // 失败：抛出包含错误信息的异常
                throw new Error(responseData.message || '请求失败')
            }
        }

        // 直接返回响应数据
        return responseData
    },
    error => {
        // 处理不同类型的错误
        if (error.response) {
            // 服务器返回了错误状态码
            const {status, data} = error.response

            // 检查是否为新的标准化错误响应格式
            if (data && typeof data === 'object' && 'code' in data && data.code !== '0') {
                // 新格式的业务逻辑错误
                const errorInfo = {
                    status,
                    message: data.message || '请求失败',
                    errors: data.errors || {},
                    code: data.code,
                    originalError: error
                }

                // 处理401未授权情况（无论是HTTP状态码还是业务代码）
                if (status === 401 || data.message?.includes('未授权') || data.message?.includes('登录')) {
                    // 未授权 - 清除认证信息并重定向到登录页
                    console.warn('用户未授权，清除认证信息')
                    localStorage.removeItem(STORAGE_KEYS.AUTH.TOKEN)
                    localStorage.removeItem(STORAGE_KEYS.AUTH.USER)

                    // 避免在登录页面时重复重定向
                    if (!window.location.pathname.includes('/login')) {
                        window.location.href = '/login'
                    }
                }

                return Promise.reject(errorInfo)
            }

            // 处理传统HTTP状态码错误
            switch (status) {
                case 401:
                    // 未授权 - 清除认证信息并重定向到登录页
                    console.warn('用户未授权，清除认证信息')
                    localStorage.removeItem(STORAGE_KEYS.AUTH.TOKEN)
                    localStorage.removeItem(STORAGE_KEYS.AUTH.USER)

                    // 避免在登录页面时重复重定向
                    if (!window.location.pathname.includes('/login')) {
                        window.location.href = '/login'
                    }
                    break
                default:
                    console.error(`服务器内部错误 ${status}:`, data)
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

// 导出 API 实例
export default api

// 重新导出各个模块的 API 函数，方便统一导入
export * as auth from './auth.js'
export * as thoughts from './thoughts.js'
export * as navigation from './navigation.js'
export * as wordCards from './wordCards.js'
