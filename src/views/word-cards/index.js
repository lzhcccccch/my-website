/**
 * 单词卡片功能模块入口文件
 * 统一导出该功能模块的所有组件、服务和工具
 */

// 主要组件
export { default as WordCards } from './index.vue'

// 类型定义和常量
export {
  DifficultyLevels,
  WordTypes,
  LearningStatus,
  CardStatus,
  SortOptions,
  LearningModes,
  ValidationRules,
  ApiEndpoints,
  StorageKeys,
  DefaultConfig,
  LearningAlgorithm,
  EventNames,
  CssClasses,
  RouteNames,
  Permissions,
  StatisticsMetrics
} from './types/index'

// API 服务
export {
  getAllCategories,
  getAllWords,
  createWord,
  updateWord,
  deleteWord,
  getWordById,
  searchWords,
  recordStudyProgress,
  getStudyStatistics,
  getWordsForReview
} from '../../api/wordCards.js'

/**
 * 功能模块元信息
 */
export const FeatureInfo = {
  name: 'word-cards',
  version: '1.0.0',
  description: '单词卡片 - 创建和学习单词卡片，提升语言学习效率',
  author: 'Stack Breeze',
  dependencies: ['vue', 'vue-router'],
  routes: [
    {
      path: '/word-cards',
      name: 'WordCards',
      component: () => import('./index.vue')
    }
  ]
}

/**
 * 功能模块配置
 */
export const FeatureConfig = {
  // 是否启用该功能模块
  enabled: true,
  
  // 功能模块权限要求
  permissions: ['cards:read'],
  
  // 功能模块依赖的其他模块
  dependencies: [],
  
  // 功能模块提供的服务
  services: ['wordCardsApi', 'learningEngine'],
  
  // 功能模块的路由配置
  routing: {
    basePath: '/word-cards',
    requiresAuth: false // 根据需要调整
  },
  
  // 功能模块的存储配置
  storage: {
    namespace: 'word-cards',
    keys: ['cards', 'progress', 'settings', 'statistics']
  },
  
  // 功能模块的API配置
  api: {
    baseUrl: '/api/word-cards',
    endpoints: {
      cards: '/cards',
      categories: '/categories',
      progress: '/progress',
      statistics: '/statistics'
    }
  },
  
  // 学习引擎配置
  learningEngine: {
    algorithm: 'spaced-repetition',
    defaultDifficulty: DifficultyLevels.INTERMEDIATE,
    sessionSize: DefaultConfig.CARDS_PER_SESSION,
    enableAudio: true,
    enableImages: true
  }
}

/**
 * 功能模块初始化函数
 * @param {Object} app - Vue应用实例
 * @param {Object} options - 初始化选项
 */
export function initializeWordCards(app, options = {}) {
  const config = { ...FeatureConfig, ...options }
  
  // 注册全局组件（如果需要）
  if (config.registerGlobalComponents) {
    app.component('WordCards', WordCards)
  }
  
  // 初始化存储
  if (config.initializeStorage) {
    // 初始化本地存储
    console.log('初始化单词卡片存储...')
  }
  
  // 初始化学习引擎
  if (config.initializeLearningEngine) {
    // 初始化间隔重复算法
    console.log('初始化学习引擎...')
  }
  
  // 注册事件监听器
  if (config.registerEventListeners) {
    // 注册全局事件监听器
    console.log('注册单词卡片事件监听器...')
  }
  
  console.log('单词卡片功能模块初始化完成')
  return config
}

/**
 * 功能模块清理函数
 */
export function cleanupWordCards() {
  // 清理事件监听器
  // 清理定时器
  // 清理缓存
  // 保存学习进度
  console.log('单词卡片功能模块清理完成')
}

/**
 * 获取功能模块状态
 */
export function getWordCardsStatus() {
  return {
    enabled: FeatureConfig.enabled,
    initialized: true,
    version: FeatureInfo.version,
    lastUpdated: new Date().toISOString(),
    statistics: {
      totalCards: 0,
      masteredCards: 0,
      learningCards: 0,
      newCards: 0
    }
  }
}

/**
 * 学习会话管理器
 */
export class LearningSession {
  constructor(cards = [], options = {}) {
    this.cards = cards
    this.currentIndex = 0
    this.options = { ...DefaultConfig, ...options }
    this.startTime = new Date()
    this.results = []
  }
  
  getCurrentCard() {
    return this.cards[this.currentIndex]
  }
  
  nextCard() {
    if (this.currentIndex < this.cards.length - 1) {
      this.currentIndex++
      return this.getCurrentCard()
    }
    return null
  }
  
  previousCard() {
    if (this.currentIndex > 0) {
      this.currentIndex--
      return this.getCurrentCard()
    }
    return null
  }
  
  recordResult(cardId, result) {
    this.results.push({
      cardId,
      result,
      timestamp: new Date()
    })
  }
  
  getSessionSummary() {
    const endTime = new Date()
    const duration = endTime - this.startTime
    
    return {
      totalCards: this.cards.length,
      completedCards: this.results.length,
      duration,
      accuracy: this.calculateAccuracy(),
      results: this.results
    }
  }
  
  calculateAccuracy() {
    if (this.results.length === 0) return 0
    
    const correctAnswers = this.results.filter(r => r.result === 'correct').length
    return (correctAnswers / this.results.length) * 100
  }
}

/**
 * 进度跟踪器
 */
export class ProgressTracker {
  constructor() {
    this.statistics = {
      totalReviews: 0,
      correctAnswers: 0,
      streakDays: 0,
      lastReviewDate: null
    }
  }
  
  updateProgress(cardId, result) {
    this.statistics.totalReviews++
    
    if (result === 'correct') {
      this.statistics.correctAnswers++
    }
    
    this.updateStreak()
    this.statistics.lastReviewDate = new Date()
  }
  
  updateStreak() {
    const today = new Date().toDateString()
    const lastReview = this.statistics.lastReviewDate
    
    if (!lastReview) {
      this.statistics.streakDays = 1
      return
    }
    
    const lastReviewDate = new Date(lastReview).toDateString()
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
    
    if (lastReviewDate === yesterday) {
      this.statistics.streakDays++
    } else if (lastReviewDate !== today) {
      this.statistics.streakDays = 1
    }
  }
  
  getAccuracyRate() {
    if (this.statistics.totalReviews === 0) return 0
    return (this.statistics.correctAnswers / this.statistics.totalReviews) * 100
  }
  
  getStatistics() {
    return {
      ...this.statistics,
      accuracyRate: this.getAccuracyRate()
    }
  }
}

// 默认导出主组件
export default WordCards
