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
 * 功能模块元信息
 */
export const FeatureInfo = {
  name: 'navigation',
  version: '1.0.0',
  description: '个人导航站 - 收集和整理网站链接，打造个人专属导航页面',
  author: 'Stack Breeze',
  dependencies: ['vue', 'vue-router'],
  routes: [
    {
      path: '/navigation',
      name: 'Navigation',
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

/**
 * 功能模块初始化函数
 * @param {Object} app - Vue应用实例
 * @param {Object} options - 初始化选项
 */
export function initializeNavigation(app, options = {}) {
  const config = { ...FeatureConfig, ...options }
  
  // 注册全局组件（如果需要）
  if (config.registerGlobalComponents) {
    app.component('Navigation', Navigation)
  }
  
  // 初始化存储
  if (config.initializeStorage) {
    // 初始化本地存储
    // 创建默认分类
    console.log('初始化导航站存储...')
  }
  
  // 初始化链接检查器
  if (config.initializeLinkChecker && config.linkChecker.enabled) {
    // 启动定期链接检查
    console.log('初始化链接检查器...')
  }
  
  // 初始化图标服务
  if (config.initializeFaviconService && config.faviconService.enabled) {
    // 初始化图标缓存
    console.log('初始化图标服务...')
  }
  
  // 注册事件监听器
  if (config.registerEventListeners) {
    // 注册全局事件监听器
    console.log('注册导航站事件监听器...')
  }
  
  console.log('个人导航站功能模块初始化完成')
  return config
}

/**
 * 功能模块清理函数
 */
export function cleanupNavigation() {
  // 清理事件监听器
  // 清理定时器
  // 清理缓存
  // 停止链接检查
  console.log('个人导航站功能模块清理完成')
}

/**
 * 获取功能模块状态
 */
export function getNavigationStatus() {
  return {
    enabled: FeatureConfig.enabled,
    initialized: true,
    version: FeatureInfo.version,
    lastUpdated: new Date().toISOString(),
    statistics: {
      totalLinks: 0,
      activeLinks: 0,
      brokenLinks: 0,
      categoriesCount: 0
    }
  }
}

/**
 * 链接检查器类
 */
export class LinkChecker {
  constructor(options = {}) {
    this.options = { ...DefaultConfig, ...options }
    this.checkQueue = []
    this.isRunning = false
  }
  
  async checkLink(url) {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'no-cors',
        timeout: this.options.timeout
      })
      
      return {
        url,
        status: LinkCheckStatus.SUCCESS,
        statusCode: response.status,
        checkedAt: new Date()
      }
    } catch (error) {
      return {
        url,
        status: LinkCheckStatus.FAILED,
        error: error.message,
        checkedAt: new Date()
      }
    }
  }
  
  async checkLinks(links) {
    const results = []
    
    for (const link of links) {
      const result = await this.checkLink(link.url)
      results.push({ ...link, checkResult: result })
    }
    
    return results
  }
  
  startPeriodicCheck(links, callback) {
    if (this.isRunning) return
    
    this.isRunning = true
    
    const checkInterval = setInterval(async () => {
      if (!this.isRunning) {
        clearInterval(checkInterval)
        return
      }
      
      const results = await this.checkLinks(links)
      callback(results)
    }, this.options.interval)
    
    return checkInterval
  }
  
  stopPeriodicCheck() {
    this.isRunning = false
  }
}

/**
 * 图标服务类
 */
export class FaviconService {
  constructor(options = {}) {
    this.options = { ...DefaultConfig, ...options }
    this.cache = new Map()
  }
  
  getFaviconUrl(url) {
    try {
      const domain = new URL(url).hostname
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
    } catch (error) {
      return null
    }
  }
  
  async getFavicon(url) {
    // 检查缓存
    if (this.cache.has(url)) {
      const cached = this.cache.get(url)
      if (Date.now() - cached.timestamp < this.options.cacheExpiry) {
        return cached.favicon
      }
    }
    
    // 获取新图标
    const faviconUrl = this.getFaviconUrl(url)
    if (!faviconUrl) {
      return this.options.fallbackIcon
    }
    
    try {
      // 验证图标是否可用
      const response = await fetch(faviconUrl, { method: 'HEAD' })
      if (response.ok) {
        // 缓存结果
        this.cache.set(url, {
          favicon: faviconUrl,
          timestamp: Date.now()
        })
        return faviconUrl
      }
    } catch (error) {
      console.warn('获取图标失败:', error)
    }
    
    return this.options.fallbackIcon
  }
  
  clearCache() {
    this.cache.clear()
  }
  
  getCacheSize() {
    return this.cache.size
  }
}

/**
 * 导入/导出工具类
 */
export class ImportExportManager {
  constructor() {
    this.supportedFormats = Object.values(ExportFormats)
  }
  
  exportLinks(links, format = ExportFormats.JSON) {
    switch (format) {
      case ExportFormats.JSON:
        return this.exportToJSON(links)
      case ExportFormats.CSV:
        return this.exportToCSV(links)
      case ExportFormats.HTML:
        return this.exportToHTML(links)
      case ExportFormats.BOOKMARKS:
        return this.exportToBookmarks(links)
      default:
        throw new Error(`不支持的导出格式: ${format}`)
    }
  }
  
  exportToJSON(links) {
    return JSON.stringify(links, null, 2)
  }
  
  exportToCSV(links) {
    const headers = ['标题', '链接', '分类', '描述', '标签']
    const rows = links.map(link => [
      link.title,
      link.url,
      link.category,
      link.description || '',
      (link.tags || []).join(';')
    ])
    
    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')
  }
  
  exportToHTML(links) {
    const groupedLinks = this.groupLinksByCategory(links)
    
    let html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>个人导航站</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .category { margin-bottom: 30px; }
        .category h2 { color: #333; border-bottom: 2px solid #ddd; }
        .link { margin: 10px 0; }
        .link a { text-decoration: none; color: #0066cc; }
        .link a:hover { text-decoration: underline; }
        .description { color: #666; font-size: 0.9em; margin-left: 20px; }
    </style>
</head>
<body>
    <h1>个人导航站</h1>
`
    
    for (const [category, categoryLinks] of Object.entries(groupedLinks)) {
      html += `    <div class="category">
        <h2>${category}</h2>
`
      
      for (const link of categoryLinks) {
        html += `        <div class="link">
            <a href="${link.url}" target="_blank">${link.title}</a>
            ${link.description ? `<div class="description">${link.description}</div>` : ''}
        </div>
`
      }
      
      html += `    </div>
`
    }
    
    html += `</body>
</html>`
    
    return html
  }
  
  exportToBookmarks(links) {
    // 生成浏览器书签格式
    let bookmarks = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
`
    
    const groupedLinks = this.groupLinksByCategory(links)
    
    for (const [category, categoryLinks] of Object.entries(groupedLinks)) {
      bookmarks += `    <DT><H3>${category}</H3>
    <DL><p>
`
      
      for (const link of categoryLinks) {
        bookmarks += `        <DT><A HREF="${link.url}">${link.title}</A>
`
      }
      
      bookmarks += `    </DL><p>
`
    }
    
    bookmarks += `</DL><p>`
    
    return bookmarks
  }
  
  groupLinksByCategory(links) {
    return links.reduce((groups, link) => {
      const category = link.category || '未分类'
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(link)
      return groups
    }, {})
  }
  
  async importLinks(data, format = ExportFormats.JSON) {
    switch (format) {
      case ExportFormats.JSON:
        return this.importFromJSON(data)
      case ExportFormats.CSV:
        return this.importFromCSV(data)
      case ExportFormats.BOOKMARKS:
        return this.importFromBookmarks(data)
      default:
        throw new Error(`不支持的导入格式: ${format}`)
    }
  }
  
  importFromJSON(data) {
    try {
      const links = JSON.parse(data)
      return Array.isArray(links) ? links : []
    } catch (error) {
      throw new Error('JSON 格式错误')
    }
  }
  
  importFromCSV(data) {
    const lines = data.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',').map(h => h.replace(/"/g, ''))
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.replace(/"/g, ''))
      return {
        title: values[0] || '',
        url: values[1] || '',
        category: values[2] || '未分类',
        description: values[3] || '',
        tags: values[4] ? values[4].split(';') : []
      }
    })
  }
  
  importFromBookmarks(data) {
    // 简单的书签解析（实际实现可能需要更复杂的HTML解析）
    const links = []
    const linkRegex = /<A HREF="([^"]+)"[^>]*>([^<]+)<\/A>/gi
    let match
    
    while ((match = linkRegex.exec(data)) !== null) {
      links.push({
        title: match[2],
        url: match[1],
        category: '导入的书签',
        description: '',
        tags: []
      })
    }
    
    return links
  }
}

// 默认导出主组件
export default Navigation
