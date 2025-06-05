/**
 * 心情随想录 API 服务模块
 * 提供想法的 CRUD 操作接口，使用模拟数据
 * 可以轻松替换为真实的后端 API 调用
 */

import { defaultThoughts, createThoughtObject, validateThoughtData } from '../views/mood-journal/data/mockThoughts'
import { STORAGE_KEYS } from './config.js'

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
  const stored = localStorage.getItem(STORAGE_KEYS.THOUGHTS.DATA)
  if (stored) {
    return JSON.parse(stored).map(thought => ({
      ...thought,
      createdAt: new Date(thought.createdAt),
      updatedAt: new Date(thought.updatedAt)
    }))
  }

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

  // 验证数据
  const validation = validateThoughtData(thoughtData)
  if (!validation.isValid) {
    const errorMessages = Object.values(validation.errors).filter(Boolean)
    throw new Error(errorMessages.join(', '))
  }

  // 创建新想法对象
  const newThought = createThoughtObject(thoughtData)

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
 * 获取按心情分组的想法
 * @param {string} mood - 心情类型
 * @returns {Promise<Array>} 指定心情的想法列表
 */
export async function getThoughtsByMood(mood) {
  const thoughts = await getAllThoughts()
  return thoughts.filter(thought => thought.mood === mood)
}

/**
 * 获取按标签分组的想法
 * @param {string} tag - 标签名称
 * @returns {Promise<Array>} 包含指定标签的想法列表
 */
export async function getThoughtsByTag(tag) {
  const thoughts = await getAllThoughts()
  return thoughts.filter(thought => thought.tags && thought.tags.includes(tag))
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
    localStorage.setItem(STORAGE_KEYS.THOUGHTS.DATA, JSON.stringify(thoughts))
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
