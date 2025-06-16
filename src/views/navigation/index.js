/**
 * 个人导航站功能模块入口文件
 * 统一导出该功能模块的所有组件、服务和工具
 */

// 主要组件
export { default as Navigation } from './index.vue'

// 类型定义和常量
export {
  LinkCategories,
  LinkStatus,
  LinkPriority,
  SortOptions,
  ViewModes,
  ExportFormats,
  ValidationRules,
  ApiEndpoints,
  StorageKeys,
  DefaultConfig,
  DefaultCategories,
  EventNames,
  CssClasses,
  RouteNames,
  Permissions,
  LinkCheckStatus,
  StatisticsMetrics
} from './types/index'

/**
 * 功能模块配置
 */
export const FeatureConfig = {
  // 是否启用该功能模块
  enabled: true,

  // 功能模块权限要求
  permissions: ['links:read'],

  // 功能模块依赖的其他模块
  dependencies: [],

  // 功能模块提供的服务
  services: ['navigationApi', 'linkChecker', 'faviconService'],

  // 功能模块的路由配置
  routing: {
    basePath: '/navigation',
    requiresAuth: false // 根据需要调整
  },

  // 功能模块的存储配置
  storage: {
    namespace: 'navigation',
    keys: ['links', 'categories', 'preferences', 'statistics']
  },

  // 功能模块的API配置
  api: {
    baseUrl: '/api/navigation',
    endpoints: {
      links: '/links',
      categories: '/categories',
      tags: '/tags',
      statistics: '/statistics',
      import: '/import',
      export: '/export'
    }
  },

  // 链接检查配置
  linkChecker: {
    enabled: true,
    interval: DefaultConfig.LINK_CHECK_INTERVAL,
    timeout: 10000, // 10秒
    retries: 3
  },

  // 图标服务配置
  faviconService: {
    enabled: DefaultConfig.ENABLE_FAVICON,
    fallbackIcon: '🔗',
    cacheExpiry: 7 * 24 * 60 * 60 * 1000 // 7天
  }
}

// 默认导出主组件
export default Navigation
