/**
 * 个人导航站功能模块类型定义
 * 定义该功能模块使用的所有类型和接口
 */

/**
 * 链接分类枚举
 */
export const LinkCategories = {
  DEVELOPMENT: 'development',
  DESIGN: 'design',
  PRODUCTIVITY: 'productivity',
  LEARNING: 'learning',
  ENTERTAINMENT: 'entertainment',
  NEWS: 'news',
  SOCIAL: 'social',
  SHOPPING: 'shopping',
  TOOLS: 'tools',
  OTHER: 'other'
}

/**
 * 链接状态枚举
 */
export const LinkStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BROKEN: 'broken',
  PENDING: 'pending'
}

/**
 * 链接优先级枚举
 */
export const LinkPriority = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
}

/**
 * 排序选项枚举
 */
export const SortOptions = {
  DATE_DESC: 'date-desc',
  DATE_ASC: 'date-asc',
  ALPHABETICAL: 'alphabetical',
  CATEGORY: 'category',
  PRIORITY: 'priority',
  VISITS: 'visits'
}

/**
 * 视图模式枚举
 */
export const ViewModes = {
  GRID: 'grid',
  LIST: 'list',
  COMPACT: 'compact',
  CARD: 'card'
}

/**
 * 导入/导出格式枚举
 */
export const ExportFormats = {
  JSON: 'json',
  CSV: 'csv',
  HTML: 'html',
  BOOKMARKS: 'bookmarks'
}

/**
 * 验证规则常量
 */
export const ValidationRules = {
  TITLE_MIN_LENGTH: 1,
  TITLE_MAX_LENGTH: 100,
  URL_PATTERN: /^https?:\/\/.+/,
  DESCRIPTION_MAX_LENGTH: 300,
  TAG_MAX_LENGTH: 20,
  MAX_TAGS: 10
}

/**
 * API 端点常量
 */
export const ApiEndpoints = {
  LINKS: '/api/links',
  CATEGORIES: '/api/categories',
  TAGS: '/api/tags',
  STATISTICS: '/api/statistics',
  IMPORT: '/api/import',
  EXPORT: '/api/export'
}

/**
 * 本地存储键名
 */
export const StorageKeys = {
  NAVIGATION_LINKS: 'navigation_links',
  USER_PREFERENCES: 'navigation_preferences',
  CATEGORIES: 'navigation_categories',
  STATISTICS: 'navigation_statistics'
}

/**
 * 默认配置
 */
export const DefaultConfig = {
  LINKS_PER_PAGE: 20,
  AUTO_SAVE_INTERVAL: 5000, // 5秒
  LINK_CHECK_INTERVAL: 24 * 60 * 60 * 1000, // 24小时
  NOTIFICATION_DURATION: 3000, // 3秒
  SEARCH_DEBOUNCE_DELAY: 300, // 300毫秒
  DEFAULT_VIEW_MODE: ViewModes.GRID,
  ENABLE_LINK_PREVIEW: true,
  ENABLE_FAVICON: true
}

/**
 * 默认分类配置
 */
export const DefaultCategories = [
  {
    id: 'development',
    name: '开发工具',
    icon: '💻',
    color: '#3b82f6',
    description: '编程开发相关工具和资源'
  },
  {
    id: 'design',
    name: '设计资源',
    icon: '🎨',
    color: '#ec4899',
    description: '设计工具和创意资源'
  },
  {
    id: 'productivity',
    name: '效率工具',
    icon: '⚡',
    color: '#10b981',
    description: '提高工作效率的工具'
  },
  {
    id: 'learning',
    name: '学习资源',
    icon: '📚',
    color: '#f59e0b',
    description: '在线学习和教育资源'
  },
  {
    id: 'entertainment',
    name: '娱乐休闲',
    icon: '🎮',
    color: '#8b5cf6',
    description: '娱乐和休闲网站'
  }
]

/**
 * 事件名称常量
 */
export const EventNames = {
  LINK_CREATED: 'link:created',
  LINK_UPDATED: 'link:updated',
  LINK_DELETED: 'link:deleted',
  LINK_VISITED: 'link:visited',
  CATEGORY_CREATED: 'category:created',
  CATEGORY_UPDATED: 'category:updated',
  CATEGORY_DELETED: 'category:deleted',
  LINKS_IMPORTED: 'links:imported',
  LINKS_EXPORTED: 'links:exported'
}

/**
 * CSS 类名常量
 */
export const CssClasses = {
  LINK_CARD: 'link-card',
  CATEGORY_BADGE: 'category-badge',
  PRIORITY_INDICATOR: 'priority-indicator',
  STATUS_INDICATOR: 'status-indicator',
  FAVICON: 'favicon',
  LINK_PREVIEW: 'link-preview'
}

/**
 * 路由名称常量
 */
export const RouteNames = {
  NAVIGATION: 'Navigation',
  LINK_DETAIL: 'LinkDetail',
  LINK_EDIT: 'LinkEdit',
  CATEGORIES: 'Categories',
  STATISTICS: 'NavigationStatistics',
  IMPORT_EXPORT: 'ImportExport'
}

/**
 * 权限常量
 */
export const Permissions = {
  READ_LINKS: 'links:read',
  WRITE_LINKS: 'links:write',
  DELETE_LINKS: 'links:delete',
  MANAGE_CATEGORIES: 'categories:manage',
  IMPORT_EXPORT: 'links:import_export',
  VIEW_STATISTICS: 'statistics:view'
}

/**
 * 链接检查状态
 */
export const LinkCheckStatus = {
  PENDING: 'pending',
  CHECKING: 'checking',
  SUCCESS: 'success',
  FAILED: 'failed',
  TIMEOUT: 'timeout'
}

/**
 * 统计指标常量
 */
export const StatisticsMetrics = {
  TOTAL_LINKS: 'total_links',
  ACTIVE_LINKS: 'active_links',
  BROKEN_LINKS: 'broken_links',
  MOST_VISITED: 'most_visited',
  RECENT_ADDED: 'recent_added',
  CATEGORIES_COUNT: 'categories_count',
  DAILY_VISITS: 'daily_visits'
}
