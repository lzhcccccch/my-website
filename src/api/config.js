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
 * 本地存储键名配置
 */
export const STORAGE_KEYS = {
  // 认证相关
  AUTH: {
    TOKEN: 'token',
    USER: 'user'
  },

  // 拾光集
  THOUGHTS: {
    DATA: 'thoughts',
    PREFERENCES: 'gleaning_light_preferences',
    DRAFT: 'gleaning_light_draft'
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
