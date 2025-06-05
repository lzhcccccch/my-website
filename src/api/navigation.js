/**
 * 个人导航站 API 服务模块
 * 提供链接和分类的 CRUD 操作接口，使用模拟数据
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
 * 获取所有链接分类
 * @returns {Promise<Array>} 分类列表
 */
export async function getAllCategories() {
  await simulateNetworkDelay()

  if (shouldSimulateError()) {
    throw new Error('获取分类列表失败')
  }

  // 从 localStorage 获取数据，如果没有则返回默认数据
  const stored = localStorage.getItem(STORAGE_KEYS.NAVIGATION.CATEGORIES)
  if (stored) {
    return JSON.parse(stored)
  }

  // 默认分类数据
  const defaultCategories = [
    {
      id: 'development',
      name: '开发工具',
      description: '编程开发相关的工具和资源',
      icon: '💻',
      sortOrder: 1,
      links: []
    },
    {
      id: 'design',
      name: '设计资源',
      description: '设计相关的工具和素材',
      icon: '🎨',
      sortOrder: 2,
      links: []
    },
    {
      id: 'productivity',
      name: '效率工具',
      description: '提升工作效率的工具',
      icon: '⚡',
      sortOrder: 3,
      links: []
    }
  ]

  // 保存默认数据到 localStorage
  saveCategoriesToStorage(defaultCategories)
  return defaultCategories
}

/**
 * 获取所有链接
 * @returns {Promise<Array>} 链接列表
 */
export async function getAllLinks() {
  await simulateNetworkDelay()

  if (shouldSimulateError()) {
    throw new Error('获取链接列表失败')
  }

  // 从 localStorage 获取数据，如果没有则返回默认数据
  const stored = localStorage.getItem(STORAGE_KEYS.NAVIGATION.LINKS)
  if (stored) {
    return JSON.parse(stored).map(link => ({
      ...link,
      createdAt: new Date(link.createdAt),
      updatedAt: new Date(link.updatedAt)
    }))
  }

  // 默认链接数据
  const defaultLinks = [
    {
      id: 1,
      title: 'GitHub',
      url: 'https://github.com',
      description: '全球最大的代码托管平台',
      categoryId: 'development',
      tags: ['代码', '开源', 'Git'],
      favicon: 'https://github.com/favicon.ico',
      sortOrder: 1,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 2,
      title: 'Figma',
      url: 'https://figma.com',
      description: '协作式界面设计工具',
      categoryId: 'design',
      tags: ['设计', 'UI', '协作'],
      favicon: 'https://figma.com/favicon.ico',
      sortOrder: 1,
      isActive: true,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02')
    }
  ]

  // 保存默认数据到 localStorage
  saveLinksToStorage(defaultLinks)
  return defaultLinks
}

/**
 * 创建新分类
 * @param {Object} categoryData - 分类数据
 * @returns {Promise<Object>} 创建的分类
 */
export async function createCategory(categoryData) {
  await simulateNetworkDelay()

  if (shouldSimulateError()) {
    throw new Error('创建分类失败')
  }

  // 验证数据
  if (!categoryData.name || categoryData.name.trim().length === 0) {
    throw new Error('分类名称不能为空')
  }

  const categories = await getAllCategories()

  // 检查名称是否重复
  if (categories.some(cat => cat.name === categoryData.name.trim())) {
    throw new Error('分类名称已存在')
  }

  // 创建新分类对象
  const newCategory = {
    id: generateCategoryId(),
    name: categoryData.name.trim(),
    description: categoryData.description || '',
    icon: categoryData.icon || '📁',
    sortOrder: categories.length + 1,
    links: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }

  categories.push(newCategory)
  saveCategoriesToStorage(categories)

  return newCategory
}

/**
 * 创建新链接
 * @param {Object} linkData - 链接数据
 * @returns {Promise<Object>} 创建的链接
 */
export async function createLink(linkData) {
  await simulateNetworkDelay()

  if (shouldSimulateError()) {
    throw new Error('创建链接失败')
  }

  // 验证数据
  if (!linkData.title || linkData.title.trim().length === 0) {
    throw new Error('链接标题不能为空')
  }

  if (!linkData.url || !isValidUrl(linkData.url)) {
    throw new Error('请输入有效的URL地址')
  }

  const links = await getAllLinks()

  // 检查URL是否重复
  if (links.some(link => link.url === linkData.url)) {
    throw new Error('该链接已存在')
  }

  // 创建新链接对象
  const newLink = {
    id: generateLinkId(),
    title: linkData.title.trim(),
    url: linkData.url,
    description: linkData.description || '',
    categoryId: linkData.categoryId || 'uncategorized',
    tags: linkData.tags || [],
    favicon: await getFavicon(linkData.url),
    sortOrder: links.filter(l => l.categoryId === linkData.categoryId).length + 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  links.push(newLink)
  saveLinksToStorage(links)

  return newLink
}

/**
 * 更新链接
 * @param {number} id - 链接ID
 * @param {Object} updateData - 更新数据
 * @returns {Promise<Object>} 更新后的链接
 */
export async function updateLink(id, updateData) {
  await simulateNetworkDelay()

  if (shouldSimulateError()) {
    throw new Error('更新链接失败')
  }

  const links = await getAllLinks()
  const linkIndex = links.findIndex(l => l.id === id)

  if (linkIndex === -1) {
    throw new Error('链接不存在')
  }

  // 更新链接数据
  const updatedLink = {
    ...links[linkIndex],
    ...updateData,
    updatedAt: new Date()
  }

  links[linkIndex] = updatedLink
  saveLinksToStorage(links)

  return updatedLink
}

/**
 * 删除链接
 * @param {number} id - 链接ID
 * @returns {Promise<boolean>} 是否删除成功
 */
export async function deleteLink(id) {
  await simulateNetworkDelay()

  if (shouldSimulateError()) {
    throw new Error('删除链接失败')
  }

  const links = await getAllLinks()
  const linkIndex = links.findIndex(l => l.id === id)

  if (linkIndex === -1) {
    throw new Error('链接不存在')
  }

  links.splice(linkIndex, 1)
  saveLinksToStorage(links)

  return true
}

/**
 * 搜索链接
 * @param {string} query - 搜索关键词
 * @param {Object} filters - 筛选条件
 * @returns {Promise<Array>} 搜索结果
 */
export async function searchLinks(query, filters = {}) {
  await simulateNetworkDelay(100, 400)

  const links = await getAllLinks()
  let filtered = links

  // 按关键词搜索
  if (query && query.trim()) {
    const searchTerm = query.toLowerCase()
    filtered = filtered.filter(link =>
      link.title.toLowerCase().includes(searchTerm) ||
      link.description.toLowerCase().includes(searchTerm) ||
      link.url.toLowerCase().includes(searchTerm) ||
      (link.tags && link.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    )
  }

  // 按分类筛选
  if (filters.categoryId) {
    filtered = filtered.filter(link => link.categoryId === filters.categoryId)
  }

  // 按标签筛选
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(link =>
      link.tags && filters.tags.some(tag => link.tags.includes(tag))
    )
  }

  return filtered
}

/**
 * 更新链接排序
 * @param {string} categoryId - 分类ID
 * @param {Array} linkIds - 排序后的链接ID数组
 * @returns {Promise<boolean>} 是否更新成功
 */
export async function updateLinksOrder(categoryId, linkIds) {
  await simulateNetworkDelay(200, 500)

  if (shouldSimulateError()) {
    throw new Error('更新排序失败')
  }

  const links = await getAllLinks()

  // 更新指定分类下链接的排序
  linkIds.forEach((linkId, index) => {
    const link = links.find(l => l.id === linkId && l.categoryId === categoryId)
    if (link) {
      link.sortOrder = index + 1
      link.updatedAt = new Date()
    }
  })

  saveLinksToStorage(links)
  return true
}

// 工具函数

/**
 * 生成分类ID
 * @returns {string} 分类ID
 */
function generateCategoryId() {
  return 'cat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

/**
 * 生成链接ID
 * @returns {number} 链接ID
 */
function generateLinkId() {
  return Date.now() + Math.floor(Math.random() * 1000)
}

/**
 * 验证URL格式
 * @param {string} url - URL地址
 * @returns {boolean} 是否有效
 */
function isValidUrl(url) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 获取网站图标
 * @param {string} url - 网站URL
 * @returns {Promise<string>} 图标URL
 */
async function getFavicon(url) {
  try {
    const domain = new URL(url).origin
    return `${domain}/favicon.ico`
  } catch {
    return '/default-favicon.ico'
  }
}

/**
 * 保存分类数据到本地存储
 * @param {Array} categories - 分类数组
 */
function saveCategoriesToStorage(categories) {
  try {
    localStorage.setItem(STORAGE_KEYS.NAVIGATION.CATEGORIES, JSON.stringify(categories))
  } catch (error) {
    console.error('保存分类数据失败:', error)
  }
}

/**
 * 保存链接数据到本地存储
 * @param {Array} links - 链接数组
 */
function saveLinksToStorage(links) {
  try {
    localStorage.setItem(STORAGE_KEYS.NAVIGATION.LINKS, JSON.stringify(links))
  } catch (error) {
    console.error('保存链接数据失败:', error)
  }
}
