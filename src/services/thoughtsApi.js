/**
 * 心情随想录 API 服务模块
 * 提供想法的 CRUD 操作接口，使用模拟数据
 * 可以轻松替换为真实的后端 API 调用
 */

// 模拟网络延迟
const simulateNetworkDelay = (min = 200, max = 800) => {
  const delay = Math.random() * (max - min) + min
  return new Promise(resolve => setTimeout(resolve, delay))
}

// 模拟错误概率（用于测试错误处理）
const shouldSimulateError = (probability = 0.05) => {
  return Math.random() < probability
}

/**
 * 获取所有想法
 * @returns {Promise<Array>} 想法列表
 */
export async function getAllThoughts() {
  await simulateNetworkDelay()
  
  if (shouldSimulateError()) {
    throw new Error('获取想法列表失败')
  }

  // 从 localStorage 获取数据，如果没有则返回默认数据
  const stored = localStorage.getItem('thoughts')
  if (stored) {
    return JSON.parse(stored).map(thought => ({
      ...thought,
      createdAt: new Date(thought.createdAt),
      updatedAt: new Date(thought.updatedAt)
    }))
  }

  // 默认数据
  const defaultThoughts = [
    {
      id: 1,
      title: '学习Vue 3的收获',
      content: '今天深入学习了Vue 3的组合式API，感觉这种写法比选项式API更加灵活和强大。特别是ref和reactive的使用，让状态管理变得更加直观。',
      mood: 'excited',
      tags: ['学习', 'Vue3', '前端'],
      createdAt: new Date('2024-01-15T14:30:00'),
      updatedAt: new Date('2024-01-15T14:30:00')
    },
    {
      id: 2,
      title: '个人网站开发计划',
      content: '计划这周完成个人网站的基本框架搭建。主要包括导航站、心情随想录和单词卡片三个模块。希望能够打造一个实用且美观的个人工具集合。',
      mood: 'thoughtful',
      tags: ['计划', '开发', '个人项目'],
      createdAt: new Date('2024-01-12T09:15:00'),
      updatedAt: new Date('2024-01-12T09:15:00')
    },
    {
      id: 3,
      title: '今天的美好时光',
      content: '下午和朋友一起去公园散步，天气很好，阳光温暖。我们聊了很多关于未来的计划，感觉很充实。这样的时光总是让人感到幸福。',
      mood: 'happy',
      tags: ['生活', '友谊', '散步'],
      createdAt: new Date('2024-01-10T16:45:00'),
      updatedAt: new Date('2024-01-10T16:45:00')
    }
  ]

  // 保存默认数据到 localStorage
  saveThoughtsToStorage(defaultThoughts)
  return defaultThoughts
}

/**
 * 创建新想法
 * @param {Object} thoughtData - 想法数据
 * @returns {Promise<Object>} 创建的想法
 */
export async function createThought(thoughtData) {
  await simulateNetworkDelay()
  
  if (shouldSimulateError()) {
    throw new Error('创建想法失败')
  }

  // 验证必填字段
  if (!thoughtData.title || !thoughtData.content) {
    throw new Error('标题和内容不能为空')
  }

  const newThought = {
    id: Date.now(),
    title: thoughtData.title.trim(),
    content: thoughtData.content.trim(),
    mood: thoughtData.mood || 'neutral',
    tags: thoughtData.tags || [],
    createdAt: new Date(),
    updatedAt: new Date()
  }

  // 获取现有数据并添加新想法
  const thoughts = await getAllThoughts()
  thoughts.unshift(newThought)
  saveThoughtsToStorage(thoughts)

  return newThought
}

/**
 * 更新想法
 * @param {number} id - 想法ID
 * @param {Object} updateData - 更新数据
 * @returns {Promise<Object>} 更新后的想法
 */
export async function updateThought(id, updateData) {
  await simulateNetworkDelay()
  
  if (shouldSimulateError()) {
    throw new Error('更新想法失败')
  }

  const thoughts = await getAllThoughts()
  const thoughtIndex = thoughts.findIndex(t => t.id === id)
  
  if (thoughtIndex === -1) {
    throw new Error('想法不存在')
  }

  // 更新想法数据
  const updatedThought = {
    ...thoughts[thoughtIndex],
    ...updateData,
    updatedAt: new Date()
  }

  thoughts[thoughtIndex] = updatedThought
  saveThoughtsToStorage(thoughts)

  return updatedThought
}

/**
 * 删除想法
 * @param {number} id - 想法ID
 * @returns {Promise<boolean>} 是否删除成功
 */
export async function deleteThought(id) {
  await simulateNetworkDelay()
  
  if (shouldSimulateError()) {
    throw new Error('删除想法失败')
  }

  const thoughts = await getAllThoughts()
  const thoughtIndex = thoughts.findIndex(t => t.id === id)
  
  if (thoughtIndex === -1) {
    throw new Error('想法不存在')
  }

  thoughts.splice(thoughtIndex, 1)
  saveThoughtsToStorage(thoughts)

  return true
}

/**
 * 根据ID获取想法
 * @param {number} id - 想法ID
 * @returns {Promise<Object|null>} 想法对象或null
 */
export async function getThoughtById(id) {
  await simulateNetworkDelay(100, 300)
  
  const thoughts = await getAllThoughts()
  return thoughts.find(t => t.id === id) || null
}

/**
 * 搜索想法
 * @param {string} query - 搜索关键词
 * @param {Object} filters - 筛选条件
 * @returns {Promise<Array>} 搜索结果
 */
export async function searchThoughts(query, filters = {}) {
  await simulateNetworkDelay(100, 400)
  
  const thoughts = await getAllThoughts()
  let filtered = thoughts

  // 按关键词搜索
  if (query && query.trim()) {
    const searchTerm = query.toLowerCase()
    filtered = filtered.filter(thought =>
      thought.title.toLowerCase().includes(searchTerm) ||
      thought.content.toLowerCase().includes(searchTerm) ||
      (thought.tags && thought.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    )
  }

  // 按心情筛选
  if (filters.mood) {
    filtered = filtered.filter(thought => thought.mood === filters.mood)
  }

  // 按标签筛选
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(thought =>
      thought.tags && filters.tags.some(tag => thought.tags.includes(tag))
    )
  }

  // 按日期范围筛选
  if (filters.dateFrom) {
    filtered = filtered.filter(thought => 
      new Date(thought.createdAt) >= new Date(filters.dateFrom)
    )
  }

  if (filters.dateTo) {
    filtered = filtered.filter(thought => 
      new Date(thought.createdAt) <= new Date(filters.dateTo)
    )
  }

  return filtered
}

/**
 * 获取心情统计数据
 * @returns {Promise<Object>} 心情统计
 */
export async function getMoodStatistics() {
  await simulateNetworkDelay(100, 300)
  
  const thoughts = await getAllThoughts()
  const moodCounts = {}
  
  thoughts.forEach(thought => {
    moodCounts[thought.mood] = (moodCounts[thought.mood] || 0) + 1
  })

  return {
    total: thoughts.length,
    moodCounts,
    mostCommonMood: Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b, 'neutral'
    )
  }
}

/**
 * 获取标签统计数据
 * @returns {Promise<Array>} 标签使用统计
 */
export async function getTagStatistics() {
  await simulateNetworkDelay(100, 300)
  
  const thoughts = await getAllThoughts()
  const tagCounts = {}
  
  thoughts.forEach(thought => {
    if (thought.tags) {
      thought.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    }
  })

  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

/**
 * 保存想法数据到本地存储
 * @param {Array} thoughts - 想法数组
 */
function saveThoughtsToStorage(thoughts) {
  try {
    localStorage.setItem('thoughts', JSON.stringify(thoughts))
  } catch (error) {
    console.error('保存想法数据失败:', error)
  }
}

/**
 * 批量导入想法
 * @param {Array} thoughtsData - 想法数据数组
 * @returns {Promise<Array>} 导入结果
 */
export async function importThoughts(thoughtsData) {
  await simulateNetworkDelay(500, 1000)
  
  if (!Array.isArray(thoughtsData)) {
    throw new Error('导入数据格式错误')
  }

  const existingThoughts = await getAllThoughts()
  const importedThoughts = []
  
  for (const data of thoughtsData) {
    try {
      const thought = await createThought(data)
      importedThoughts.push(thought)
    } catch (error) {
      console.warn('导入想法失败:', data, error)
    }
  }

  return {
    total: thoughtsData.length,
    imported: importedThoughts.length,
    failed: thoughtsData.length - importedThoughts.length,
    thoughts: importedThoughts
  }
}

/**
 * 导出所有想法数据
 * @returns {Promise<Object>} 导出数据
 */
export async function exportThoughts() {
  await simulateNetworkDelay(200, 500)
  
  const thoughts = await getAllThoughts()
  const statistics = await getMoodStatistics()
  const tagStats = await getTagStatistics()
  
  return {
    exportDate: new Date().toISOString(),
    version: '1.0',
    thoughts,
    statistics,
    tagStatistics: tagStats
  }
}
