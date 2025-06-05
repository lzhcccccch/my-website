/**
 * 单词卡片 API 服务模块
 * 提供单词卡片和分类的 CRUD 操作接口，使用模拟数据
 * 可以轻松替换为真实的后端 API 调用
 */

import api from './baseRequest.js'
import { STORAGE_KEYS, MOCK_CONFIG } from './config.js'

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
 * 获取所有单词分类
 * @returns {Promise<Array>} 分类列表
 */
export async function getAllCategories() {
  await simulateNetworkDelay()

  if (shouldSimulateError()) {
    throw new Error('获取分类列表失败')
  }

  // 从 localStorage 获取数据，如果没有则返回默认数据
  const stored = localStorage.getItem(STORAGE_KEYS.WORD_CARDS.CATEGORIES)
  if (stored) {
    return JSON.parse(stored)
  }

  // 默认分类数据
  const defaultCategories = [
    {
      id: 'basic',
      name: '基础词汇',
      description: '日常生活中的基础单词',
      words: []
    },
    {
      id: 'ielts',
      name: '雅思词汇',
      description: '雅思考试高频词汇',
      words: []
    },
    {
      id: 'business',
      name: '商务英语',
      description: '商务场景常用词汇',
      words: []
    }
  ]

  // 保存默认数据到 localStorage
  saveCategoriesToStorage(defaultCategories)
  return defaultCategories
}

/**
 * 获取所有单词卡片
 * @returns {Promise<Array>} 单词列表
 */
export async function getAllWords() {
  await simulateNetworkDelay()

  if (shouldSimulateError()) {
    throw new Error('获取单词列表失败')
  }

  // 从 localStorage 获取数据，如果没有则返回默认数据
  const stored = localStorage.getItem(STORAGE_KEYS.WORD_CARDS.WORDS)
  if (stored) {
    return JSON.parse(stored).map(word => ({
      ...word,
      createdAt: new Date(word.createdAt),
      updatedAt: new Date(word.updatedAt),
      lastStudied: word.lastStudied ? new Date(word.lastStudied) : null
    }))
  }

  // 默认单词数据
  const defaultWords = [
    {
      id: 1,
      word: 'hello',
      pronunciation: '/həˈloʊ/',
      meaning: 'int. 你好；喂（用于问候或引起注意）',
      example: 'Hello, how are you today?',
      categoryId: 'basic',
      difficulty: 'easy',
      tags: ['问候', '日常'],
      studyCount: 0,
      correctCount: 0,
      masteryLevel: 'new',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      lastStudied: null
    },
    {
      id: 2,
      word: 'world',
      pronunciation: '/wɜːrld/',
      meaning: 'n. 世界；地球；领域',
      example: 'Welcome to the world of programming.',
      categoryId: 'basic',
      difficulty: 'easy',
      tags: ['名词', '基础'],
      studyCount: 3,
      correctCount: 2,
      masteryLevel: 'learning',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
      lastStudied: new Date('2024-01-15')
    }
  ]

  // 保存默认数据到 localStorage
  saveWordsToStorage(defaultWords)
  return defaultWords
}

/**
 * 创建新单词卡片
 * @param {Object} wordData - 单词数据
 * @returns {Promise<Object>} 创建的单词
 */
export async function createWord(wordData) {
  await simulateNetworkDelay()

  if (shouldSimulateError()) {
    throw new Error('创建单词失败')
  }

  // 验证数据
  if (!wordData.word || wordData.word.trim().length === 0) {
    throw new Error('单词不能为空')
  }

  if (!wordData.meaning || wordData.meaning.trim().length === 0) {
    throw new Error('释义不能为空')
  }

  const words = await getAllWords()

  // 检查单词是否重复
  if (words.some(w => w.word.toLowerCase() === wordData.word.toLowerCase().trim())) {
    throw new Error('该单词已存在')
  }

  // 创建新单词对象
  const newWord = {
    id: generateWordId(),
    word: wordData.word.trim().toLowerCase(),
    pronunciation: wordData.pronunciation || '',
    meaning: wordData.meaning.trim(),
    example: wordData.example || '',
    categoryId: wordData.categoryId || 'basic',
    difficulty: wordData.difficulty || 'medium',
    tags: wordData.tags || [],
    studyCount: 0,
    correctCount: 0,
    masteryLevel: 'new',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastStudied: null
  }

  words.push(newWord)
  saveWordsToStorage(words)

  return newWord
}

/**
 * 更新单词卡片
 * @param {number} id - 单词ID
 * @param {Object} updateData - 更新数据
 * @returns {Promise<Object>} 更新后的单词
 */
export async function updateWord(id, updateData) {
  await simulateNetworkDelay()

  if (shouldSimulateError()) {
    throw new Error('更新单词失败')
  }

  const words = await getAllWords()
  const wordIndex = words.findIndex(w => w.id === id)

  if (wordIndex === -1) {
    throw new Error('单词不存在')
  }

  // 更新单词数据
  const updatedWord = {
    ...words[wordIndex],
    ...updateData,
    updatedAt: new Date()
  }

  words[wordIndex] = updatedWord
  saveWordsToStorage(words)

  return updatedWord
}

/**
 * 删除单词卡片
 * @param {number} id - 单词ID
 * @returns {Promise<boolean>} 是否删除成功
 */
export async function deleteWord(id) {
  await simulateNetworkDelay()

  if (shouldSimulateError()) {
    throw new Error('删除单词失败')
  }

  const words = await getAllWords()
  const wordIndex = words.findIndex(w => w.id === id)

  if (wordIndex === -1) {
    throw new Error('单词不存在')
  }

  words.splice(wordIndex, 1)
  saveWordsToStorage(words)

  return true
}

/**
 * 根据ID获取单词
 * @param {number} id - 单词ID
 * @returns {Promise<Object|null>} 单词对象或null
 */
export async function getWordById(id) {
  await simulateNetworkDelay(100, 300)

  const words = await getAllWords()
  return words.find(w => w.id === id) || null
}

/**
 * 搜索单词
 * @param {string} query - 搜索关键词
 * @param {Object} filters - 筛选条件
 * @returns {Promise<Array>} 搜索结果
 */
export async function searchWords(query, filters = {}) {
  await simulateNetworkDelay(100, 400)

  const words = await getAllWords()
  let filtered = words

  // 按关键词搜索
  if (query && query.trim()) {
    const searchTerm = query.toLowerCase()
    filtered = filtered.filter(word =>
      word.word.toLowerCase().includes(searchTerm) ||
      word.meaning.toLowerCase().includes(searchTerm) ||
      (word.example && word.example.toLowerCase().includes(searchTerm)) ||
      (word.tags && word.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    )
  }

  // 按分类筛选
  if (filters.categoryId) {
    filtered = filtered.filter(word => word.categoryId === filters.categoryId)
  }

  // 按难度筛选
  if (filters.difficulty) {
    filtered = filtered.filter(word => word.difficulty === filters.difficulty)
  }

  // 按掌握程度筛选
  if (filters.masteryLevel) {
    filtered = filtered.filter(word => word.masteryLevel === filters.masteryLevel)
  }

  return filtered
}

/**
 * 记录学习进度
 * @param {number} wordId - 单词ID
 * @param {boolean} isCorrect - 是否答对
 * @returns {Promise<Object>} 更新后的单词
 */
export async function recordStudyProgress(wordId, isCorrect) {
  await simulateNetworkDelay(100, 300)

  const words = await getAllWords()
  const word = words.find(w => w.id === wordId)

  if (!word) {
    throw new Error('单词不存在')
  }

  // 更新学习统计
  word.studyCount += 1
  if (isCorrect) {
    word.correctCount += 1
  }
  word.lastStudied = new Date()

  // 更新掌握程度
  const accuracy = word.correctCount / word.studyCount
  if (word.studyCount >= 5 && accuracy >= 0.8) {
    word.masteryLevel = 'mastered'
  } else if (word.studyCount >= 2) {
    word.masteryLevel = 'learning'
  }

  word.updatedAt = new Date()
  saveWordsToStorage(words)

  return word
}

/**
 * 获取学习统计数据
 * @returns {Promise<Object>} 学习统计
 */
export async function getStudyStatistics() {
  await simulateNetworkDelay(100, 300)

  const words = await getAllWords()

  const stats = {
    total: words.length,
    new: words.filter(w => w.masteryLevel === 'new').length,
    learning: words.filter(w => w.masteryLevel === 'learning').length,
    mastered: words.filter(w => w.masteryLevel === 'mastered').length,
    studiedToday: words.filter(w => {
      if (!w.lastStudied) return false
      const today = new Date()
      const studiedDate = new Date(w.lastStudied)
      return studiedDate.toDateString() === today.toDateString()
    }).length
  }

  return stats
}

/**
 * 获取需要复习的单词
 * @param {number} limit - 限制数量
 * @returns {Promise<Array>} 需要复习的单词列表
 */
export async function getWordsForReview(limit = 10) {
  await simulateNetworkDelay(100, 300)

  const words = await getAllWords()

  // 优先级：新单词 > 学习中的单词 > 很久没复习的已掌握单词
  const newWords = words.filter(w => w.masteryLevel === 'new')
  const learningWords = words.filter(w => w.masteryLevel === 'learning')
  const masteredWords = words.filter(w => {
    if (w.masteryLevel !== 'mastered' || !w.lastStudied) return false
    const daysSinceStudy = (Date.now() - new Date(w.lastStudied).getTime()) / (1000 * 60 * 60 * 24)
    return daysSinceStudy > 7 // 7天没复习的已掌握单词
  })

  const reviewWords = [
    ...newWords.slice(0, Math.ceil(limit * 0.5)),
    ...learningWords.slice(0, Math.ceil(limit * 0.3)),
    ...masteredWords.slice(0, Math.ceil(limit * 0.2))
  ].slice(0, limit)

  return reviewWords
}

// 工具函数

/**
 * 生成单词ID
 * @returns {number} 单词ID
 */
function generateWordId() {
  return Date.now() + Math.floor(Math.random() * 1000)
}

/**
 * 保存分类数据到本地存储
 * @param {Array} categories - 分类数组
 */
function saveCategoriesToStorage(categories) {
  try {
    localStorage.setItem(STORAGE_KEYS.WORD_CARDS.CATEGORIES, JSON.stringify(categories))
  } catch (error) {
    console.error('保存分类数据失败:', error)
  }
}

/**
 * 保存单词数据到本地存储
 * @param {Array} words - 单词数组
 */
function saveWordsToStorage(words) {
  try {
    localStorage.setItem(STORAGE_KEYS.WORD_CARDS.WORDS, JSON.stringify(words))
  } catch (error) {
    console.error('保存单词数据失败:', error)
  }
}
