/**
 * 心情随想录功能模块入口文件
 * 统一导出该功能模块的所有组件、服务和工具
 */

// 主要组件
export { default as MoodJournal } from './index.vue'
export { default as AddEntryForm } from './components/AddEntryForm.vue'

// 数据和工具函数
export {
  moodOptions,
  defaultThoughts,
  getMoodOptions,
  getMoodInfo,
  getMoodEmoji,
  getMoodLabel,
  generateThoughtId,
  createThoughtObject,
  validateThoughtData,
  formatThoughtForDisplay,
  formatThoughtDate
} from './data/mockThoughts'

// API 服务
export {
  getAllThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  searchThoughts,
  getThoughtsByMood,
  getThoughtsByTag
} from './services/thoughtsApi'

// 类型定义和常量
export {
  MoodTypes,
  ThoughtStatus,
  SortOptions,
  NotificationTypes,
  ValidationRules,
  ApiEndpoints,
  StorageKeys,
  DefaultConfig,
  EventNames,
  CssClasses,
  RouteNames,
  Permissions
} from './types/index'

/**
 * 功能模块元信息
 */
export const FeatureInfo = {
  name: 'mood-journal',
  version: '1.0.0',
  description: '心情随想录 - 记录每一天的心情和想法',
  author: 'Stack Breeze',
  dependencies: ['vue', 'vue-router'],
  routes: [
    {
      path: '/mood-journal',
      name: 'MoodJournal',
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
  permissions: ['thoughts:read'],
  
  // 功能模块依赖的其他模块
  dependencies: [],
  
  // 功能模块提供的服务
  services: ['thoughtsApi'],
  
  // 功能模块的路由配置
  routing: {
    basePath: '/mood-journal',
    requiresAuth: false // 根据需要调整
  },
  
  // 功能模块的存储配置
  storage: {
    namespace: 'mood-journal',
    keys: ['thoughts', 'preferences', 'drafts']
  },
  
  // 功能模块的API配置
  api: {
    baseUrl: '/api/mood-journal',
    endpoints: {
      thoughts: '/thoughts',
      moods: '/moods',
      tags: '/tags'
    }
  }
}

/**
 * 功能模块初始化函数
 * @param {Object} app - Vue应用实例
 * @param {Object} options - 初始化选项
 */
export function initializeMoodJournal(app, options = {}) {
  const config = { ...FeatureConfig, ...options }
  
  // 注册全局组件（如果需要）
  if (config.registerGlobalComponents) {
    app.component('MoodJournal', MoodJournal)
    app.component('AddEntryForm', AddEntryForm)
  }
  
  // 初始化存储
  if (config.initializeStorage) {
    // 初始化本地存储
    console.log('初始化心情随想录存储...')
  }
  
  // 注册事件监听器
  if (config.registerEventListeners) {
    // 注册全局事件监听器
    console.log('注册心情随想录事件监听器...')
  }
  
  console.log('心情随想录功能模块初始化完成')
  return config
}

/**
 * 功能模块清理函数
 */
export function cleanupMoodJournal() {
  // 清理事件监听器
  // 清理定时器
  // 清理缓存
  console.log('心情随想录功能模块清理完成')
}

/**
 * 获取功能模块状态
 */
export function getMoodJournalStatus() {
  return {
    enabled: FeatureConfig.enabled,
    initialized: true,
    version: FeatureInfo.version,
    lastUpdated: new Date().toISOString()
  }
}

// 默认导出主组件
export default MoodJournal
