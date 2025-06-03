/**
 * 单词卡片功能模块类型定义
 * 定义该功能模块使用的所有类型和接口
 */

/**
 * 单词难度等级枚举
 */
export const DifficultyLevels = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert'
}

/**
 * 单词类型枚举
 */
export const WordTypes = {
  NOUN: 'noun',
  VERB: 'verb',
  ADJECTIVE: 'adjective',
  ADVERB: 'adverb',
  PREPOSITION: 'preposition',
  CONJUNCTION: 'conjunction',
  INTERJECTION: 'interjection',
  PRONOUN: 'pronoun'
}

/**
 * 学习状态枚举
 */
export const LearningStatus = {
  NEW: 'new',
  LEARNING: 'learning',
  REVIEWING: 'reviewing',
  MASTERED: 'mastered'
}

/**
 * 卡片状态枚举
 */
export const CardStatus = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  DELETED: 'deleted'
}

/**
 * 排序选项枚举
 */
export const SortOptions = {
  DATE_DESC: 'date-desc',
  DATE_ASC: 'date-asc',
  ALPHABETICAL: 'alphabetical',
  DIFFICULTY: 'difficulty',
  PROGRESS: 'progress'
}

/**
 * 学习模式枚举
 */
export const LearningModes = {
  FLASHCARD: 'flashcard',
  QUIZ: 'quiz',
  SPELLING: 'spelling',
  LISTENING: 'listening'
}

/**
 * 验证规则常量
 */
export const ValidationRules = {
  WORD_MIN_LENGTH: 1,
  WORD_MAX_LENGTH: 50,
  DEFINITION_MIN_LENGTH: 5,
  DEFINITION_MAX_LENGTH: 500,
  EXAMPLE_MAX_LENGTH: 200,
  MAX_TAGS: 5,
  TAG_MAX_LENGTH: 15
}

/**
 * API 端点常量
 */
export const ApiEndpoints = {
  WORDS: '/api/words',
  CATEGORIES: '/api/categories',
  PROGRESS: '/api/progress',
  STATISTICS: '/api/statistics'
}

/**
 * 本地存储键名
 */
export const StorageKeys = {
  WORD_CARDS: 'word_cards',
  USER_PROGRESS: 'word_learning_progress',
  SETTINGS: 'word_cards_settings',
  STATISTICS: 'word_learning_statistics'
}

/**
 * 默认配置
 */
export const DefaultConfig = {
  CARDS_PER_SESSION: 10,
  REVIEW_INTERVAL: 24 * 60 * 60 * 1000, // 24小时
  AUTO_SAVE_INTERVAL: 10000, // 10秒
  NOTIFICATION_DURATION: 2000, // 2秒
  SEARCH_DEBOUNCE_DELAY: 300 // 300毫秒
}

/**
 * 学习算法配置
 */
export const LearningAlgorithm = {
  // 间隔重复算法参数
  INITIAL_INTERVAL: 1, // 天
  EASE_FACTOR: 2.5,
  MIN_EASE_FACTOR: 1.3,
  MAX_EASE_FACTOR: 4.0,
  EASE_BONUS: 0.15,
  EASE_PENALTY: 0.20,
  
  // 复习间隔
  REVIEW_INTERVALS: {
    AGAIN: 1, // 分钟
    HARD: 6, // 分钟
    GOOD: 10, // 分钟
    EASY: 4 // 天
  }
}

/**
 * 事件名称常量
 */
export const EventNames = {
  CARD_CREATED: 'card:created',
  CARD_UPDATED: 'card:updated',
  CARD_DELETED: 'card:deleted',
  CARD_REVIEWED: 'card:reviewed',
  PROGRESS_UPDATED: 'progress:updated',
  SESSION_STARTED: 'session:started',
  SESSION_COMPLETED: 'session:completed'
}

/**
 * CSS 类名常量
 */
export const CssClasses = {
  WORD_CARD: 'word-card',
  DIFFICULTY_INDICATOR: 'difficulty-indicator',
  PROGRESS_BAR: 'progress-bar',
  LEARNING_STATUS: 'learning-status',
  CARD_FRONT: 'card-front',
  CARD_BACK: 'card-back'
}

/**
 * 路由名称常量
 */
export const RouteNames = {
  WORD_CARDS: 'WordCards',
  CARD_DETAIL: 'CardDetail',
  CARD_EDIT: 'CardEdit',
  LEARNING_SESSION: 'LearningSession',
  STATISTICS: 'Statistics'
}

/**
 * 权限常量
 */
export const Permissions = {
  READ_CARDS: 'cards:read',
  WRITE_CARDS: 'cards:write',
  DELETE_CARDS: 'cards:delete',
  MANAGE_CATEGORIES: 'categories:manage',
  VIEW_STATISTICS: 'statistics:view'
}

/**
 * 统计指标常量
 */
export const StatisticsMetrics = {
  TOTAL_CARDS: 'total_cards',
  MASTERED_CARDS: 'mastered_cards',
  LEARNING_CARDS: 'learning_cards',
  NEW_CARDS: 'new_cards',
  DAILY_REVIEWS: 'daily_reviews',
  ACCURACY_RATE: 'accuracy_rate',
  STREAK_DAYS: 'streak_days'
}
