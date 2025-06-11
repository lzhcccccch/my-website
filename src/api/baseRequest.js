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
 * 统一处理标准化API响应格式和错误
 *
 * 处理逻辑：
 * 1. code === '0': 成功，返回data字段内容
 * 2. code === '401': 未认证，清除本地认证信息并跳转登录页
 * 3. 其他错误: 抛出包含message的错误对象，由组件自行处理展示
 *
 * 标准化API响应格式:
 * {
 *   "code": "0",           // 业务状态码，"0"表示成功，"401"表示未认证，其他值表示业务错误
 *   "message": "请求成功",  // 响应消息
 *   "data": {...},         // 实际数据内容
 *   "timestamp": 1749651169259  // 服务器时间戳
 * }
 */
api.interceptors.response.use(
    response => {
        const responseData = response.data

        // 检查是否为标准化响应格式
        if (responseData && typeof responseData === 'object' && 'code' in responseData) {
            const {code, message, data} = responseData

            // 成功情况：返回data字段内容
            if (code === '0') {
                return data !== null && data !== undefined ? data : {}
            }

            // 未认证情况：清除认证信息并跳转登录页
            if (code === '401') {
                localStorage.removeItem(STORAGE_KEYS.AUTH.TOKEN)
                localStorage.removeItem(STORAGE_KEYS.AUTH.USER)

                // 避免在登录页面时重复重定向
                if (!window.location.pathname.includes('/login')) {
                    setTimeout(() => {
                        window.location.href = '/login'
                    }, 100)
                }
            }

            // 其他错误情况：抛出包含message的错误对象
            const error = new Error(message || '请求失败')
            // 将错误继续抛出，以便调用方可以捕获并处理这个错误。
            return Promise.reject(error)
        }

        // 非标准化响应格式：直接返回原始数据
        return responseData
    },
    error => {
        // 处理HTTP错误
        if (error.response) {
            const {status, data} = error.response

            // 检查错误响应是否也遵循标准化格式
            if (data && typeof data === 'object' && 'code' in data) {
                const {code, message} = data

                // 未认证情况
                if (code === '401') {
                    console.warn('[Auth] 用户未认证，清除本地认证信息')
                    localStorage.removeItem(STORAGE_KEYS.AUTH.TOKEN)
                    localStorage.removeItem(STORAGE_KEYS.AUTH.USER)

                    if (!window.location.pathname.includes('/login')) {
                        setTimeout(() => {
                            window.location.href = '/login'
                        }, 100)
                    }
                }

                // 抛出包含message的错误对象
                const apiError = new Error(message || '请求失败')
                return Promise.reject(apiError)
            }

            // 非标准化HTTP错误响应
            const httpError = new Error(data?.message || getHttpErrorMessage(status))
            return Promise.reject(httpError)

        } else if (error.request) {
            // 网络错误
            const networkError = new Error('网络连接失败，请检查网络设置')
            return Promise.reject(networkError)
        } else {
            // 其他未知错误
            const unknownError = new Error(error.message || '未知错误')
            return Promise.reject(unknownError)
        }
    }
)


/**
 * 获取HTTP状态码对应的错误消息
 * @param {number} status - HTTP状态码
 * @returns {string} 错误消息
 */
function getHttpErrorMessage(status) {
    const statusMessages = {
        400: '请求参数错误',
        401: '未授权访问',
        403: '禁止访问',
        404: '请求的资源不存在',
        405: '请求方法不允许',
        408: '请求超时',
        409: '请求冲突',
        422: '请求参数验证失败',
        429: '请求过于频繁',
        500: '服务器内部错误',
        502: '网关错误',
        503: '服务暂时不可用',
        504: '网关超时'
    }

    return statusMessages[status] || `请求失败 (${status})`
}

// 导出 API 实例
export default api

// 重新导出各个模块的 API 函数，方便统一导入
export * as auth from './auth.js'
export * as thoughts from './thoughts.js'
export * as navigation from './navigation.js'
export * as wordCards from './wordCards.js'
