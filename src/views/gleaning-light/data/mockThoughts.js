/**
 * 拾光集模拟数据
 * 提供完整的想法数据结构，用于开发和测试
 */

/**
 * 心情选项配置
 */
export const moodOptions = [
  { value: 'happy', label: '开心', emoji: '😊' },
  { value: 'excited', label: '兴奋', emoji: '🤩' },
  { value: 'grateful', label: '感恩', emoji: '🙏' },
  { value: 'peaceful', label: '平静', emoji: '😌' },
  { value: 'neutral', label: '一般', emoji: '😐' },
  { value: 'thoughtful', label: '沉思', emoji: '🤔' },
  { value: 'tired', label: '疲惫', emoji: '😴' },
  { value: 'sad', label: '难过', emoji: '😢' },
  { value: 'anxious', label: '焦虑', emoji: '😰' },
  { value: 'angry', label: '愤怒', emoji: '😠' }
]

/**
 * 默认想法数据
 * 模拟真实的用户想法记录
 */
export const defaultThoughts = [
  {
    id: 1,
    title: '学习Vue 3的收获',
    content: '今天深入学习了Vue 3的组合式API，感觉这种写法比选项式API更加灵活和强大。特别是ref和reactive的使用，让状态管理变得更加直观。通过实际项目练习，我对响应式系统有了更深的理解。',
    mood: 'excited',
    tags: ['学习', 'Vue3', '前端', '技术'],
    createdAt: new Date('2024-01-15T14:30:00'),
    updatedAt: new Date('2024-01-15T14:30:00'),
    author: 'user',
    isPublic: false,
    viewCount: 0
  },
  {
    id: 2,
    title: '个人网站开发计划',
    content: '计划这周完成个人网站的基本框架搭建。主要包括导航站、心情随想录和单词卡片三个模块。希望能够打造一个实用且美观的个人工具集合。今天已经完成了基础架构设计，明天开始具体功能开发。',
    mood: 'thoughtful',
    tags: ['计划', '开发', '个人项目', '网站'],
    createdAt: new Date('2024-01-12T09:15:00'),
    updatedAt: new Date('2024-01-12T09:15:00'),
    author: 'user',
    isPublic: false,
    viewCount: 3
  },
  {
    id: 3,
    title: '今天的美好时光',
    content: '下午和朋友一起去公园散步，天气很好，阳光温暖。我们聊了很多关于未来的计划，感觉很充实。这样的时光总是让人感到幸福。看到公园里的花都开了，春天真的来了。',
    mood: 'happy',
    tags: ['生活', '友谊', '散步', '春天'],
    createdAt: new Date('2024-01-10T16:45:00'),
    updatedAt: new Date('2024-01-10T16:45:00'),
    author: 'user',
    isPublic: false,
    viewCount: 1
  },
  {
    id: 4,
    title: '读书心得分享',
    content: '最近在读《人类简史》这本书，作者尤瓦尔·赫拉利的观点很有启发性。特别是关于认知革命的部分，让我重新思考了人类文明的发展历程。书中提到的虚构故事如何塑造人类社会，这个观点很新颖。',
    mood: 'thoughtful',
    tags: ['读书', '历史', '思考', '人文'],
    createdAt: new Date('2024-01-08T20:30:00'),
    updatedAt: new Date('2024-01-08T20:30:00'),
    author: 'user',
    isPublic: true,
    viewCount: 12
  },
  {
    id: 5,
    title: '工作中的小成就',
    content: '今天终于解决了困扰我一周的bug！原来是异步处理的时序问题。通过仔细分析代码执行流程，最终找到了根本原因。这种解决问题后的成就感真的很棒，让我对编程更加热爱了。',
    mood: 'excited',
    tags: ['工作', '编程', 'bug修复', '成就感'],
    createdAt: new Date('2024-01-05T18:20:00'),
    updatedAt: new Date('2024-01-05T18:20:00'),
    author: 'user',
    isPublic: false,
    viewCount: 0
  },
  {
    id: 6,
    title: '周末的放松时光',
    content: '这个周末没有安排太多事情，就在家里听音乐、看电影。有时候什么都不做也是一种幸福。选择了几部经典电影重温，感受到了不同的人生故事。这样的慢节奏生活让心情很平静。',
    mood: 'peaceful',
    tags: ['周末', '放松', '电影', '音乐'],
    createdAt: new Date('2024-01-03T15:10:00'),
    updatedAt: new Date('2024-01-03T15:10:00'),
    author: 'user',
    isPublic: false,
    viewCount: 2
  },
  {
    id: 7,
    title: '新年新计划',
    content: '新的一年开始了，制定了一些小目标：每月读两本书、坚持运动、学习一门新技能。不求做得多么完美，但希望能够坚持下去。相信积少成多的力量，每天进步一点点就很好。',
    mood: 'grateful',
    tags: ['新年', '计划', '目标', '成长'],
    createdAt: new Date('2024-01-01T10:00:00'),
    updatedAt: new Date('2024-01-01T10:00:00'),
    author: 'user',
    isPublic: true,
    viewCount: 8
  }
]

/**
 * 获取心情选项
 * @returns {Array} 心情选项数组
 */
export function getMoodOptions() {
  return [...moodOptions]
}

/**
 * 根据心情值获取心情信息
 * @param {string} moodValue - 心情值
 * @returns {Object|null} 心情信息对象
 */
export function getMoodInfo(moodValue) {
  return moodOptions.find(mood => mood.value === moodValue) || null
}

/**
 * 获取心情表情符号
 * @param {string} moodValue - 心情值
 * @returns {string} 表情符号
 */
export function getMoodEmoji(moodValue) {
  const mood = getMoodInfo(moodValue)
  return mood ? mood.emoji : '😐'
}

/**
 * 获取心情标签
 * @param {string} moodValue - 心情值
 * @returns {string} 心情标签
 */
export function getMoodLabel(moodValue) {
  const mood = getMoodInfo(moodValue)
  return mood ? mood.label : '一般'
}

/**
 * 生成随机想法ID
 * @returns {number} 随机ID
 */
export function generateThoughtId() {
  return Date.now() + Math.floor(Math.random() * 1000)
}

/**
 * 创建新想法对象
 * @param {Object} thoughtData - 想法数据
 * @returns {Object} 完整的想法对象
 */
export function createThoughtObject(thoughtData) {
  return {
    id: generateThoughtId(),
    title: thoughtData.title || '',
    content: thoughtData.content || '',
    mood: thoughtData.mood || 'neutral',
    tags: thoughtData.tags || [],
    createdAt: new Date(),
    updatedAt: new Date(),
    author: 'user',
    isPublic: false,
    viewCount: 0,
    ...thoughtData
  }
}

/**
 * 验证想法数据
 * @param {Object} thoughtData - 想法数据
 * @returns {Object} 验证结果
 */
export function validateThoughtData(thoughtData) {
  const errors = {}
  
  if (!thoughtData.title || thoughtData.title.trim().length === 0) {
    errors.title = '请输入标题'
  } else if (thoughtData.title.trim().length < 2) {
    errors.title = '标题至少需要2个字符'
  } else if (thoughtData.title.trim().length > 50) {
    errors.title = '标题不能超过50个字符'
  }
  
  if (!thoughtData.content || thoughtData.content.trim().length === 0) {
    errors.content = '请输入内容'
  } else if (thoughtData.content.trim().length < 5) {
    errors.content = '内容至少需要5个字符'
  } else if (thoughtData.content.trim().length > 1000) {
    errors.content = '内容不能超过1000个字符'
  }
  
  if (thoughtData.tags && thoughtData.tags.length > 10) {
    errors.tags = '标签数量不能超过10个'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * 格式化想法数据用于显示
 * @param {Object} thought - 想法对象
 * @returns {Object} 格式化后的想法对象
 */
export function formatThoughtForDisplay(thought) {
  return {
    ...thought,
    moodInfo: getMoodInfo(thought.mood),
    formattedDate: formatThoughtDate(thought.createdAt),
    isEdited: thought.updatedAt && thought.updatedAt !== thought.createdAt
  }
}

/**
 * 格式化想法日期
 * @param {Date} date - 日期对象
 * @returns {string} 格式化后的日期字符串
 */
export function formatThoughtDate(date) {
  const now = new Date()
  const diffTime = Math.abs(now - new Date(date))
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) {
    return '今天 ' + new Intl.DateTimeFormat('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  } else if (diffDays === 2) {
    return '昨天 ' + new Intl.DateTimeFormat('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  } else if (diffDays <= 7) {
    return `${diffDays - 1}天前`
  } else {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }
}
