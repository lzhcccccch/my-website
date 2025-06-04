/**
 * API 配置文件
 * 统一管理所有 API 相关的配置和常量
 */

/**
 * API 基础配置
 */
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8090/api',
  TIMEOUT: 15000, // 15秒
  HEADERS: {
    'Content-Type': 'application/json'
  }
}

/**
 * 统一的 API 端点配置
 */
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    CHECK_USERNAME: '/auth/check-username'
  },
  
  // 心情随想录
  THOUGHTS: {
    BASE: '/thoughts',
    MOODS: '/moods',
    TAGS: '/tags',
    STATISTICS: '/thoughts/statistics',
    EXPORT: '/thoughts/export',
    IMPORT: '/thoughts/import'
  },
  
  // 个人导航站
  NAVIGATION: {
    LINKS: '/links',
    CATEGORIES: '/categories',
    TAGS: '/tags',
    STATISTICS: '/statistics',
    IMPORT: '/import',
    EXPORT: '/export',
    LINK_CHECK: '/links/check'
  },
  
  // 单词卡片
  WORD_CARDS: {
    WORDS: '/words',
    CATEGORIES: '/categories',
    PROGRESS: '/progress',
    STATISTICS: '/statistics',
    REVIEW: '/words/review',
    STUDY: '/words/study'
  }
}

/**
 * 通用验证规则
 */
export const VALIDATION_RULES = {
  // 通用规则
  COMMON: {
    TITLE_MIN_LENGTH: 1,
    TITLE_MAX_LENGTH: 100,
    DESCRIPTION_MAX_LENGTH: 500,
    TAG_MAX_LENGTH: 20,
    MAX_TAGS: 10
  },
  
  // 认证相关
  AUTH: {
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 20,
    PASSWORD_MIN_LENGTH: 6,
    EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  
  // 心情随想录
  THOUGHTS: {
    TITLE_MIN_LENGTH: 2,
    TITLE_MAX_LENGTH: 50,
    CONTENT_MIN_LENGTH: 5,
    CONTENT_MAX_LENGTH: 1000,
    MAX_TAGS: 10,
    TAG_MAX_LENGTH: 20
  },
  
  // 导航链接
  NAVIGATION: {
    URL_PATTERN: /^https?:\/\/.+/,
    DESCRIPTION_MAX_LENGTH: 300
  },
  
  // 单词卡片
  WORD_CARDS: {
    WORD_MIN_LENGTH: 1,
    WORD_MAX_LENGTH: 50,
    DEFINITION_MIN_LENGTH: 5,
    DEFINITION_MAX_LENGTH: 500,
    EXAMPLE_MAX_LENGTH: 200,
    MAX_TAGS: 5,
    TAG_MAX_LENGTH: 15
  }
}

/**
 * 本地存储键名配置
 */
export const STORAGE_KEYS = {
  // 认证相关
  AUTH: {
    TOKEN: 'token',
    USER: 'user'
  },
  
  // 心情随想录
  THOUGHTS: {
    DATA: 'thoughts',
    PREFERENCES: 'mood_journal_preferences',
    DRAFT: 'mood_journal_draft'
  },
  
  // 个人导航站
  NAVIGATION: {
    CATEGORIES: 'navigation_categories',
    LINKS: 'navigation_links',
    PREFERENCES: 'navigation_preferences',
    STATISTICS: 'navigation_statistics'
  },
  
  // 单词卡片
  WORD_CARDS: {
    CATEGORIES: 'word_categories',
    WORDS: 'word_cards',
    PROGRESS: 'word_learning_progress',
    SETTINGS: 'word_cards_settings',
    STATISTICS: 'word_learning_statistics'
  }
}

/**
 * 默认配置
 */
export const DEFAULT_CONFIG = {
  // 分页配置
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100
  },
  
  // 时间配置
  TIMING: {
    AUTO_SAVE_INTERVAL: 30000, // 30秒
    NOTIFICATION_DURATION: 3000, // 3秒
    SEARCH_DEBOUNCE_DELAY: 300, // 300毫秒
    REQUEST_TIMEOUT: 15000 // 15秒
  },
  
  // 心情随想录
  THOUGHTS: {
    THOUGHTS_PER_PAGE: 10,
    AUTO_SAVE_INTERVAL: 30000,
    NOTIFICATION_DURATION: 3000,
    SEARCH_DEBOUNCE_DELAY: 300
  },
  
  // 个人导航站
  NAVIGATION: {
    LINKS_PER_PAGE: 20,
    LINK_CHECK_INTERVAL: 24 * 60 * 60 * 1000, // 24小时
    FAVICON_CACHE_DURATION: 7 * 24 * 60 * 60 * 1000 // 7天
  },
  
  // 单词卡片
  WORD_CARDS: {
    CARDS_PER_SESSION: 10,
    REVIEW_INTERVAL: 24 * 60 * 60 * 1000, // 24小时
    AUTO_SAVE_INTERVAL: 10000, // 10秒
    NOTIFICATION_DURATION: 2000, // 2秒
    SEARCH_DEBOUNCE_DELAY: 300
  }
}

/**
 * 错误代码配置
 */
export const ERROR_CODES = {
  // 通用错误
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  
  // 认证错误
  AUTH_FAILED: 'AUTH_FAILED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  
  // 验证错误
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DUPLICATE_ERROR: 'DUPLICATE_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  
  // 业务错误
  OPERATION_FAILED: 'OPERATION_FAILED',
  INSUFFICIENT_PERMISSION: 'INSUFFICIENT_PERMISSION'
}

/**
 * HTTP 状态码映射
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
}

/**
 * 模拟数据配置
 */
export const MOCK_CONFIG = {
  ENABLED: true, // 是否启用模拟数据
  NETWORK_DELAY: {
    MIN: 200,
    MAX: 800
  },
  ERROR_PROBABILITY: 0.05, // 5% 的错误概率
  
  // 各模块的模拟配置
  MODULES: {
    THOUGHTS: {
      DELAY_RANGE: [200, 800],
      ERROR_RATE: 0.05
    },
    NAVIGATION: {
      DELAY_RANGE: [100, 500],
      ERROR_RATE: 0.03
    },
    WORD_CARDS: {
      DELAY_RANGE: [150, 600],
      ERROR_RATE: 0.04
    }
  }
}

/**
 * 获取完整的 API URL
 * @param {string} endpoint - 端点路径
 * @returns {string} 完整的 URL
 */
export function getApiUrl(endpoint) {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

/**
 * 获取模块的 API 端点
 * @param {string} module - 模块名称
 * @param {string} endpoint - 端点名称
 * @returns {string} 端点路径
 */
export function getModuleEndpoint(module, endpoint) {
  const moduleEndpoints = API_ENDPOINTS[module.toUpperCase()]
  if (!moduleEndpoints) {
    throw new Error(`未找到模块 ${module} 的端点配置`)
  }
  
  const endpointPath = moduleEndpoints[endpoint.toUpperCase()]
  if (!endpointPath) {
    throw new Error(`未找到模块 ${module} 的端点 ${endpoint}`)
  }
  
  return endpointPath
}

/**
 * 获取存储键名
 * @param {string} module - 模块名称
 * @param {string} key - 键名
 * @returns {string} 完整的存储键名
 */
export function getStorageKey(module, key) {
  const moduleKeys = STORAGE_KEYS[module.toUpperCase()]
  if (!moduleKeys) {
    throw new Error(`未找到模块 ${module} 的存储键配置`)
  }
  
  const storageKey = moduleKeys[key.toUpperCase()]
  if (!storageKey) {
    throw new Error(`未找到模块 ${module} 的存储键 ${key}`)
  }
  
  return storageKey
}
