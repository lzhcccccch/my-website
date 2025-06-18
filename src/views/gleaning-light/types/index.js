/**
 * 拾光集功能模块类型定义
 * 定义该功能模块使用的所有类型和接口
 */

/**
 * 心情类型枚举
 */
export const MoodTypes = {
  HAPPY: 'happy',
  EXCITED: 'excited',
  GRATEFUL: 'grateful',
  PEACEFUL: 'peaceful',
  NEUTRAL: 'neutral',
  THOUGHTFUL: 'thoughtful',
  TIRED: 'tired',
  SAD: 'sad',
  ANXIOUS: 'anxious',
  ANGRY: 'angry'
}

/**
 * 想法状态枚举
 */
export const ThoughtStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
}

/**
 * 排序选项枚举
 */
export const SortOptions = {
  DATE_DESC: 'date-desc',
  DATE_ASC: 'date-asc',
  TITLE: 'title',
  MOOD: 'mood'
}

/**
 * 通知类型枚举
 */
export const NotificationTypes = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

/**
 * 验证规则常量
 */
export const ValidationRules = {
  TITLE_MIN_LENGTH: 2,
  TITLE_MAX_LENGTH: 50,
  CONTENT_MIN_LENGTH: 5,
  CONTENT_MAX_LENGTH: 1000,
  MAX_TAGS: 10,
  TAG_MAX_LENGTH: 20
}

/**
 * API 端点常量
 */
export const ApiEndpoints = {
  THOUGHTS: '/api/thoughts',
  MOODS: '/api/moods',
  TAGS: '/api/tags'
}

/**
 * 本地存储键名
 */
export const StorageKeys = {
  THOUGHTS: 'gleaning_light_thoughts',
  USER_PREFERENCES: 'gleaning_light_preferences',
  DRAFT_THOUGHT: 'gleaning_light_draft'
}

/**
 * 默认配置
 */
export const DefaultConfig = {
  THOUGHTS_PER_PAGE: 10,
  AUTO_SAVE_INTERVAL: 30000, // 30秒
  NOTIFICATION_DURATION: 3000, // 3秒
  SEARCH_DEBOUNCE_DELAY: 300 // 300毫秒
}

/**
 * 事件名称常量
 */
export const EventNames = {
  THOUGHT_CREATED: 'thought:created',
  THOUGHT_UPDATED: 'thought:updated',
  THOUGHT_DELETED: 'thought:deleted',
  MOOD_CHANGED: 'mood:changed',
  SEARCH_PERFORMED: 'search:performed'
}

/**
 * CSS 类名常量
 */
export const CssClasses = {
  THOUGHT_CARD: 'thought-card',
  MOOD_INDICATOR: 'mood-indicator',
  TAG: 'tag',
  LOADING: 'loading',
  ERROR: 'error',
  SUCCESS: 'success'
}

/**
 * 路由名称常量
 */
export const RouteNames = {
  GLEANING_LIGHT: 'GleaningLight',
  THOUGHT_DETAIL: 'ThoughtDetail',
  THOUGHT_EDIT: 'ThoughtEdit'
}

/**
 * 权限常量
 */
export const Permissions = {
  READ_THOUGHTS: 'thoughts:read',
  WRITE_THOUGHTS: 'thoughts:write',
  DELETE_THOUGHTS: 'thoughts:delete',
  MANAGE_TAGS: 'tags:manage'
}
