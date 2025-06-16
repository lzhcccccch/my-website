<template>
  <div class="navigation-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1>🧭 个人导航站</h1>
        <p>收集和整理您喜欢的网站链接，打造专属的网络导航</p>

        <!-- 操作按钮 -->
        <div class="header-actions">
          <button @click="showAddCategoryModal = true" class="btn btn-primary">
            <span class="icon">📁</span>
            添加分类
          </button>
          <button @click="showAddLinkModal = true" class="btn btn-secondary">
            <span class="icon">🔗</span>
            添加链接
          </button>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="search-section">
      <div class="search-container">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="搜索网站名称或描述..."
            class="search-input"
          />
        </div>
        <div class="filter-tabs">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectedCategory = category.id"
            :class="['filter-tab', { active: selectedCategory === category.id }]"
          >
            {{ category.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- 导航链接展示区域 -->
    <div class="navigation-container">
      <!-- 临时调试信息 -->
      <div v-if="false" style="background: #f0f0f0; padding: 1rem; margin-bottom: 1rem; border-radius: 8px; font-family: monospace; font-size: 12px;">
        <strong>调试信息:</strong><br>
        总分类数: {{ categories.length }}<br>
        过滤后分类数: {{ filteredCategories.length }}<br>
        当前选中: {{ selectedCategory }}<br>
        搜索词: "{{ searchQuery }}"<br>
        <details>
          <summary>分类详情</summary>
          <div v-for="cat in filteredCategories" :key="cat.id" style="margin: 0.5rem 0; padding: 0.5rem; background: white;">
            <strong>{{ cat.categoryName }}</strong> (ID: {{ cat.id }}, 排序: {{ cat.categorySort }})<br>
            链接数: {{ cat.links ? cat.links.length : 0 }}<br>
            <div v-if="cat.links && cat.links.length > 0" style="margin-left: 1rem;">
              <div v-for="link in cat.links" :key="link.id" style="font-size: 10px;">
                • {{ link.title }} (排序: {{ link.sortOrder }})
              </div>
            </div>
          </div>
        </details>
      </div>

      <div v-if="filteredCategories.length === 0" class="empty-state">
        <div class="empty-icon">📂</div>
        <h3>暂无导航链接</h3>
        <p>开始添加您的第一个网站链接吧！</p>
        <button @click="showAddLinkModal = true" class="btn btn-primary">
          添加链接
        </button>
      </div>

      <div v-else class="categories-grid">
        <div
          v-for="category in filteredCategories"
          :key="category.id"
          class="category-section"
        >
          <div class="category-header">
            <div class="category-title">
              <span class="drag-handle" title="拖拽排序">⋮⋮</span>
              <h2>{{ category.name }}</h2>
              <span class="category-count">({{ category.links ? category.links.length : 0 }})</span>
            </div>
            <div class="category-actions">
              <button @click="editCategory(category)" class="action-btn">
                <span class="icon">✏️</span>
              </button>
              <button @click="deleteCategory(category.id)" class="action-btn delete">
                <span class="icon">🗑️</span>
              </button>
            </div>
          </div>

          <!-- 链接展示区域 -->
          <div class="links-grid">
            <div
              v-for="link in category.links"
              :key="link.id"
              class="link-card"
            >
              <div class="link-favicon">
                <img
                  :src="getFaviconUrl(link.url)"
                  :alt="link.title"
                  @error="handleFaviconError"
                />
              </div>
              <div class="link-content">
                <h3>{{ link.title }}</h3>
                <p>{{ link.description }}</p>
                <div class="link-meta">
                  <span class="link-domain">{{ getDomain(link.url) }}</span>
                  <span class="link-date">{{ formatDate(link.createdAt) }}</span>
                </div>
              </div>
              <div class="link-actions">
                <a :href="link.url" target="_blank" class="visit-btn">
                  <span class="icon">🔗</span>
                  访问
                </a>
                <!-- 手动排序控制按钮 -->
                <div class="sort-controls">
                  <button
                    @click="moveLinkUp(category.id, link.id)"
                    class="sort-btn"
                    :disabled="isFirstLink(category, link)"
                    title="上移"
                  >
                    <span class="icon">⬆️</span>
                  </button>
                  <button
                    @click="moveLinkDown(category.id, link.id)"
                    class="sort-btn"
                    :disabled="isLastLink(category, link)"
                    title="下移"
                  >
                    <span class="icon">⬇️</span>
                  </button>
                </div>
                <button @click="editLink(link)" class="action-btn">
                  <span class="icon">✏️</span>
                </button>
                <button @click="deleteLinkById(link.id)" class="action-btn delete">
                  <span class="icon">🗑️</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 空分类提示 -->
          <div v-if="category.links && category.links.length === 0" class="empty-category">
            <div class="empty-category-icon">📂</div>
            <p>此分类暂无链接，点击添加</p>
            <button @click="showAddLinkModal = true; newLink.categoryId = category.id" class="btn-add-link">
              <span class="icon">➕</span>
              添加链接
            </button>
          </div>

          <!-- 加载状态指示器 -->
          <div v-if="isLoading" class="loading-overlay">
            <div class="loading-spinner"></div>
            <span>保存中...</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加分类模态框 -->
    <div v-if="showAddCategoryModal" class="modal-overlay" @click="closeModals">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>添加新分类</h3>
          <button @click="closeModals" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="categoryName">分类名称</label>
            <input
              type="text"
              id="categoryName"
              v-model="newCategory.name"
              placeholder="请输入分类名称"
              maxlength="20"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeModals" class="btn btn-secondary">取消</button>
          <button @click="addCategory" class="btn btn-primary" :disabled="!newCategory.name.trim()">
            添加
          </button>
        </div>
      </div>
    </div>

    <!-- 添加链接模态框 -->
    <div v-if="showAddLinkModal" class="modal-overlay" @click="closeModals">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ editingLink ? '编辑链接' : '添加新链接' }}</h3>
          <button @click="closeModals" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="linkTitle">网站名称</label>
            <input
              type="text"
              id="linkTitle"
              v-model="newLink.title"
              placeholder="请输入网站名称"
              maxlength="50"
            />
          </div>
          <div class="form-group">
            <label for="linkUrl">网站地址</label>
            <input
              type="url"
              id="linkUrl"
              v-model="newLink.url"
              placeholder="https://example.com"
            />
          </div>
          <div class="form-group">
            <label for="linkDescription">网站描述</label>
            <textarea
              id="linkDescription"
              v-model="newLink.description"
              placeholder="请输入网站描述"
              rows="3"
              maxlength="200"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="linkCategory">所属分类</label>
            <select id="linkCategory" v-model="newLink.categoryId">
              <option value="">请选择分类</option>
              <option
                v-for="category in categories.filter(cat => cat.id !== 'all')"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeModals" class="btn btn-secondary">取消</button>
          <button
            @click="editingLink ? updateLinkData() : addLink()"
            class="btn btn-primary"
            :disabled="!isLinkFormValid"
          >
            {{ editingLink ? '更新' : '添加' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 通知组件 -->
    <div v-if="notification.show" :class="['notification', `notification-${notification.type}`]">
      <div class="notification-content">
        <span class="notification-icon">
          {{ notification.type === 'success' ? '✅' : notification.type === 'error' ? '❌' : '⚠️' }}
        </span>
        <span class="notification-message">{{ notification.message }}</span>
        <button @click="hideNotification" class="notification-close">×</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getAllCategories, getAllLinks, createCategory, createLink, updateLink, deleteLink, updateLinksOrder } from '../../api/navigation.js'

/**
 * 个人导航站组件
 * 提供网站链接的分类管理、搜索和CRUD操作功能
 * 支持拖拽排序和跨分类移动链接
 */

// 响应式数据
const searchQuery = ref('') // 搜索关键词
const selectedCategory = ref('all') // 选中的分类ID
const showAddCategoryModal = ref(false) // 显示添加分类模态框
const showAddLinkModal = ref(false) // 显示添加链接模态框
const editingLink = ref(null) // 正在编辑的链接

// 数据状态
const categories = ref([]) // 分类列表
const links = ref([]) // 链接列表
const isLoading = ref(false) // 加载状态

// 通知系统
const notification = ref({
  show: false,
  type: 'success', // 'success', 'error', 'warning'
  message: '',
  timeout: null
})

// 数据加载函数
/**
 * 加载分类数据
 */
async function loadCategories() {
  try {
    isLoading.value = true
    const data = await getAllCategories()
    console.log('加载分类数据:', data)

    // 添加"全部"选项
    categories.value = [...data]

    console.log('加载后的分类数据:', categories.value)
  } catch (error) {
    showNotification(error.message || '加载分类失败', 'error')
  } finally {
    isLoading.value = false
  }
}

/**
 * 加载链接数据
 */
async function loadLinks() {
  try {
    isLoading.value = true
    links.value = await getAllLinks()
    console.log('加载链接数据:', links.value)
  } catch (error) {
    showNotification(error.message || '加载链接失败', 'error')
  } finally {
    isLoading.value = false
  }
}

// 表单数据
const newCategory = ref({
  name: ''
})

const newLink = ref({
  title: '',
  url: '',
  description: '',
  categoryId: ''
})

// 计算属性：过滤后的分类（按排序属性排序）
const filteredCategories = computed(() => {
  // 获取所有非"全部"分类，并按sortOrder排序
  let filtered = categories.value
    .filter(cat => cat.id !== 'all')
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))

  // 按分类筛选
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(cat => cat.id === selectedCategory.value)
  }

  // 为每个分类添加对应的链接，并按sortOrder排序
  filtered = filtered.map(category => {
    const categoryLinks = links.value
      .filter(link => link.categoryId === category.id)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))

    return {
      ...category,
      links: categoryLinks
    }
  })

  // 按搜索关键词筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.map(category => ({
      ...category,
      links: category.links.filter(link =>
        link.title.toLowerCase().includes(query) ||
        link.description.toLowerCase().includes(query) ||
        getDomain(link.url).toLowerCase().includes(query)
      )
    })).filter(category => category.links && category.links.length > 0)
  }

  return filtered
})

// 计算属性：链接表单是否有效
const isLinkFormValid = computed(() => {
  return newLink.value.title.trim() &&
         newLink.value.url.trim() &&
         newLink.value.categoryId &&
         isValidUrl(newLink.value.url)
})

/**
 * 验证URL格式是否正确
 * @param {string} url - 要验证的URL
 * @returns {boolean} 是否为有效URL
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
 * 获取网站图标URL
 * @param {string} url - 网站URL
 * @returns {string} 图标URL
 */
function getFaviconUrl(url) {
  try {
    const domain = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
  } catch {
    return '/default-favicon.png'
  }
}

/**
 * 处理图标加载失败
 * @param {Event} event - 错误事件
 */
function handleFaviconError(event) {
  event.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23666"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>'
}

/**
 * 从URL中提取域名
 * @param {string} url - 完整URL
 * @returns {string} 域名
 */
function getDomain(url) {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

/**
 * 格式化日期显示
 * @param {Date} date - 日期对象
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

/**
 * 添加新分类
 */
async function addCategory() {
  if (!newCategory.value.name.trim()) return

  try {
    isLoading.value = true
    const newCat = await createCategory({
      name: newCategory.value.name.trim(),
      description: '',
      icon: '📁'
    })

    // 重新加载分类数据
    await loadCategories()

    // 重置表单
    newCategory.value.name = ''
    showAddCategoryModal.value = false

    // 显示成功通知
    showNotification(`分类 "${newCat.name || newCategory.value.name}" 添加成功！`, 'success')
  } catch (error) {
    showNotification(error.message || '添加分类失败', 'error')
  } finally {
    isLoading.value = false
  }
}

/**
 * 编辑分类
 * @param {Object} category - 要编辑的分类
 */
function editCategory(category) {
  newCategory.value.name = category.name
  showAddCategoryModal.value = true
  // TODO: 实现编辑分类功能
}

/**
 * 删除分类
 * @param {string} categoryId - 分类ID
 */
async function deleteCategory(categoryId) {
  if (confirm('确定要删除这个分类吗？分类下的所有链接也会被删除。')) {
    try {
      isLoading.value = true

      // 找到要删除的分类
      const categoryToDelete = categories.value.find(cat => cat.id === categoryId)

      // 这里应该调用删除分类的API
      // await api.delete(`/navigationCategory/${categoryId}`)

      // 重新加载数据
      await Promise.all([
        loadCategories(),
        loadLinks()
      ])

      // 如果当前选中的分类被删除，切换到全部
      if (selectedCategory.value === categoryId) {
        selectedCategory.value = 'all'
      }

      // 显示成功通知
      showNotification(`分类 "${categoryToDelete?.name || ''}" 删除成功！`, 'success')
    } catch (error) {
      showNotification(error.message || '删除分类失败', 'error')
    } finally {
      isLoading.value = false
    }
  } else {
    showNotification('取消删除操作', 'warning', 2000)
  }
}

/**
 * 添加新链接
 */
async function addLink() {
  if (!isLinkFormValid.value) return

  try {
    isLoading.value = true

    // 计算新链接在该分类中的排序序号
    const categoryLinks = links.value.filter(link => link.categoryId === newLink.value.categoryId)
    const maxSortOrder = categoryLinks.length > 0
      ? Math.max(...categoryLinks.map(link => link.sortOrder || 0))
      : 0

    const newLinkData = await createLink({
      title: newLink.value.title.trim(),
      url: newLink.value.url.trim(),
      description: newLink.value.description.trim(),
      categoryId: newLink.value.categoryId,
      sortOrder: maxSortOrder + 1
    })

    // 重新加载链接数据
    await loadLinks()

    // 重置表单
    resetLinkForm()
    showAddLinkModal.value = false

    // 显示成功通知
    showNotification(`链接 "${newLinkData.siteName || newLink.value.title}" 添加成功！`, 'success')
  } catch (error) {
    showNotification(error.message || '添加链接失败', 'error')
  } finally {
    isLoading.value = false
  }
}

/**
 * 编辑链接
 * @param {Object} link - 要编辑的链接
 */
function editLink(link) {
  editingLink.value = link
  newLink.value = {
    title: link.title,
    url: link.url,
    description: link.description,
    categoryId: link.categoryId
  }
  showAddLinkModal.value = true
}

/**
 * 更新链接
 */
async function updateLinkData() {
  if (!isLinkFormValid.value || !editingLink.value) return

  try {
    isLoading.value = true

    const updatedLink = await updateLink(editingLink.value.id, {
      title: newLink.value.title.trim(),
      url: newLink.value.url.trim(),
      description: newLink.value.description.trim(),
      categoryId: newLink.value.categoryId,
      sortOrder: editingLink.value.sortOrder
    })

    // 重新加载链接数据
    await loadLinks()

    // 重置表单
    resetLinkForm()
    showAddLinkModal.value = false
    editingLink.value = null

    // 显示成功通知
    showNotification(`链接 "${newLink.value.title}" 更新成功！`, 'success')
  } catch (error) {
    showNotification(error.message || '更新链接失败', 'error')
  } finally {
    isLoading.value = false
  }
}

/**
 * 删除链接
 * @param {number} linkId - 链接ID
 */
async function deleteLinkById(linkId) {
  if (confirm('确定要删除这个链接吗？')) {
    try {
      isLoading.value = true

      // 找到要删除的链接
      const linkToDelete = links.value.find(link => link.id === linkId)

      await deleteLink(linkId)

      // 重新加载链接数据
      await loadLinks()

      showNotification(`链接 "${linkToDelete?.title || ''}" 删除成功！`, 'success')
    } catch (error) {
      showNotification(error.message || '删除链接失败', 'error')
    } finally {
      isLoading.value = false
    }
  } else {
    showNotification('取消删除操作', 'warning', 2000)
  }
}

/**
 * 查找链接所属的分类ID
 * @param {number} linkId - 链接ID
 * @returns {string|null} 分类ID
 */
function findLinkCategory(linkId) {
  const link = links.value.find(link => link.id === linkId)
  return link ? link.categoryId : null
}

/**
 * 重置链接表单
 */
function resetLinkForm() {
  newLink.value = {
    title: '',
    url: '',
    description: '',
    categoryId: ''
  }
}

/**
 * 关闭所有模态框
 */
function closeModals() {
  showAddCategoryModal.value = false
  showAddLinkModal.value = false
  editingLink.value = null
  resetLinkForm()
  newCategory.value.name = ''
}

/**
 * 显示通知
 * @param {string} message - 通知消息
 * @param {string} type - 通知类型 ('success', 'error', 'warning')
 * @param {number} duration - 显示时长（毫秒）
 */
function showNotification(message, type = 'success', duration = 3000) {
  // 清除之前的定时器
  if (notification.value.timeout) {
    clearTimeout(notification.value.timeout)
  }

  notification.value = {
    show: true,
    type,
    message,
    timeout: setTimeout(() => {
      hideNotification()
    }, duration)
  }
}

/**
 * 隐藏通知
 */
function hideNotification() {
  if (notification.value.timeout) {
    clearTimeout(notification.value.timeout)
  }
  notification.value.show = false
}



/**
 * 保存链接排序变化到后端
 * @param {string} categoryId - 分类ID
 * @param {number} newIndex - 新位置索引
 * @param {number} oldIndex - 原位置索引
 */
async function saveLinkOrder(categoryId, newIndex, oldIndex) {
  try {
    isLoading.value = true

    // 获取当前分类的所有链接
    const categoryLinks = links.value
      .filter(link => link.categoryId === categoryId)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))

    if (categoryLinks.length === 0) return

    const linkIds = categoryLinks.map(link => link.id)

    console.log(`保存分类 ${categoryId} 的链接排序:`, linkIds)
    console.log('更新后的sortOrder:', categoryLinks.map(l => ({ id: l.id, title: l.title, sortOrder: l.sortOrder })))

    // 调用API保存排序
    await updateLinksOrder(categoryId, linkIds)

    showNotification('链接排序保存成功！', 'success')

  } catch (error) {
    console.error('保存排序失败:', error)

    // 显示错误提示
    showNotification(error.message || '保存排序失败，请稍后重试', 'error')

  } finally {
    isLoading.value = false
  }
}

/**
 * 手动上移链接
 * @param {string} categoryId - 分类ID
 * @param {number} linkId - 链接ID
 */
function moveLinkUp(categoryId, linkId) {
  const categoryLinks = links.value.filter(link => link.categoryId === categoryId)
  const linkIndex = categoryLinks.findIndex(link => link.id === linkId)

  if (linkIndex <= 0) return // 已经是第一个或未找到

  // 交换位置
  const temp = categoryLinks[linkIndex]
  categoryLinks[linkIndex] = categoryLinks[linkIndex - 1]
  categoryLinks[linkIndex - 1] = temp

  // 更新sortOrder
  categoryLinks.forEach((link, index) => {
    link.sortOrder = index + 1
  })

  // 保存排序变化
  saveLinkOrder(categoryId, linkIndex - 1, linkIndex)
}

/**
 * 手动下移链接
 * @param {string} categoryId - 分类ID
 * @param {number} linkId - 链接ID
 */
function moveLinkDown(categoryId, linkId) {
  const categoryLinks = links.value.filter(link => link.categoryId === categoryId)
  const linkIndex = categoryLinks.findIndex(link => link.id === linkId)

  if (linkIndex === -1 || linkIndex >= categoryLinks.length - 1) return // 已经是最后一个或未找到

  // 交换位置
  const temp = categoryLinks[linkIndex]
  categoryLinks[linkIndex] = categoryLinks[linkIndex + 1]
  categoryLinks[linkIndex + 1] = temp

  // 更新sortOrder
  categoryLinks.forEach((link, index) => {
    link.sortOrder = index + 1
  })

  // 保存排序变化
  saveLinkOrder(categoryId, linkIndex + 1, linkIndex)
}

/**
 * 检查是否为第一个链接
 * @param {Object} category - 分类对象
 * @param {Object} link - 链接对象
 * @returns {boolean}
 */
function isFirstLink(category, link) {
  const categoryLinks = links.value
    .filter(l => l.categoryId === category.id)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))

  if (categoryLinks.length === 0) return true
  return categoryLinks[0].id === link.id
}

/**
 * 检查是否为最后一个链接
 * @param {Object} category - 分类对象
 * @param {Object} link - 链接对象
 * @returns {boolean}
 */
function isLastLink(category, link) {
  const categoryLinks = links.value
    .filter(l => l.categoryId === category.id)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))

  if (categoryLinks.length === 0) return true
  return categoryLinks[categoryLinks.length - 1].id === link.id
}

/**
 * 组件挂载时的初始化
 */
onMounted(async () => {
  console.log('个人导航站页面已加载')

  // 加载数据
  await Promise.all([
    loadCategories(),
    loadLinks()
  ])

  console.log(`加载完成: ${categories.value.length - 1} 个分类, ${links.value.length} 个链接`)
})
</script>

<style scoped>
/* 导航页面容器 */
.navigation-page {
  width: 100%;
  min-height: calc(100vh - 80px);
  background: var(--color-bg-secondary);
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
  padding: var(--spacing-3xl) var(--spacing-base);
  text-align: center;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.page-header h1 {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-base);
  color: white;
}

.page-header p {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-xl);
  opacity: 0.9;
  color: white;
}

.header-actions {
  display: flex;
  gap: var(--spacing-base);
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  transition: var(--transition-base);
  cursor: pointer;
  font-size: var(--font-size-base);
}

.btn-primary {
  background: white;
  color: var(--color-primary);
}

.btn-primary:hover {
  background: var(--color-gray-50);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background: white;
  color: var(--color-primary);
  transform: translateY(-2px);
}

.icon {
  font-size: var(--font-size-lg);
}

/* 搜索区域 */
.search-section {
  background: var(--color-bg-primary);
  padding: var(--spacing-xl) var(--spacing-base);
  border-bottom: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
}

.search-container {
  max-width: 1200px;
  margin: 0 auto;
}

.search-box {
  position: relative;
  max-width: 500px;
  margin: 0 auto var(--spacing-lg);
}

.search-icon {
  position: absolute;
  left: var(--spacing-base);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
  font-size: var(--font-size-lg);
}

.search-input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-base) var(--spacing-sm) 3rem;
  border: 2px solid var(--color-border-medium);
  border-radius: var(--radius-xl);
  font-size: var(--font-size-base);
  background: var(--color-bg-primary);
  transition: var(--transition-base);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* 筛选标签 */
.filter-tabs {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
  flex-wrap: wrap;
}

.filter-tab {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: 2px solid var(--color-border-medium);
  border-radius: var(--radius-xl);
  background: var(--color-bg-primary);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-base);
}

.filter-tab:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.filter-tab.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

/* 导航容器 */
.navigation-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-base);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: var(--spacing-3xl);
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-base);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
  opacity: 0.6;
}

.empty-state h3 {
  font-size: var(--font-size-xl);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.empty-state p {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
}

/* 分类网格 */
.categories-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3xl);
}

.category-section {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-base);
  border: 1px solid var(--color-border-light);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-base);
  border-bottom: 2px solid var(--color-border-light);
}

.category-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.drag-handle {
  cursor: grab;
  color: var(--color-text-tertiary);
  font-size: var(--font-size-lg);
  padding: var(--spacing-xs);
  border-radius: var(--radius-base);
  transition: var(--transition-base);
  user-select: none;
}

.drag-handle:hover {
  color: var(--color-primary);
  background: var(--color-gray-100);
}

.drag-handle:active {
  cursor: grabbing;
}

.category-header h2 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.category-count {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  font-weight: var(--font-weight-normal);
}

.category-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.action-btn {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: none;
  border-radius: var(--radius-base);
  background: var(--color-gray-100);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: var(--transition-base);
  font-size: var(--font-size-sm);
}

.action-btn:hover {
  background: var(--color-gray-200);
  transform: translateY(-1px);
}

.action-btn.delete:hover {
  background: var(--color-error);
  color: white;
}

/* 链接网格 */
.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-lg);
}

.link-card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  transition: var(--transition-base);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-base);
}

.link-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary);
}

/* 拖拽相关样式 */
.link-card.dragging {
  opacity: 0.8;
  transform: rotate(5deg);
  box-shadow: var(--shadow-xl);
  z-index: 1000;
}

.ghost-card {
  opacity: 0.3;
  background: var(--color-primary);
  border: 2px dashed var(--color-primary-dark);
  transform: scale(0.95);
}

.chosen-card {
  opacity: 0.8;
  transform: scale(1.05);
  box-shadow: var(--shadow-xl);
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: white;
}

.drag-card {
  opacity: 0.9;
  transform: rotate(3deg);
  box-shadow: var(--shadow-xl);
  z-index: 1001;
}

/* 拖拽区域提示 */
.links-grid {
  min-height: 100px;
  position: relative;
  transition: var(--transition-base);
}

.links-grid:empty::before {
  content: '拖拽链接到此处';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--color-text-tertiary);
  font-style: italic;
  font-size: var(--font-size-sm);
  opacity: 0.6;
}

.links-grid.drag-over {
  background: rgba(102, 126, 234, 0.05);
  border: 2px dashed var(--color-primary);
  border-radius: var(--radius-lg);
}

/* 空分类提示 */
.empty-category {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-tertiary);
  border: 2px dashed var(--color-border-medium);
  border-radius: var(--radius-lg);
  margin-top: var(--spacing-base);
  transition: var(--transition-base);
}

.empty-category:hover {
  border-color: var(--color-primary);
  background: rgba(102, 126, 234, 0.02);
}

.empty-category-icon {
  font-size: 2rem;
  margin-bottom: var(--spacing-sm);
  opacity: 0.6;
}

.empty-category p {
  margin-bottom: var(--spacing-base);
  font-size: var(--font-size-sm);
}

.btn-add-link {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-base);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: var(--transition-base);
}

.btn-add-link:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

/* 加载状态指示器 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-xl);
  z-index: 100;
  gap: var(--spacing-sm);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-gray-200);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-overlay span {
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
}

.category-section {
  position: relative;
}

.link-favicon {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-base);
  overflow: hidden;
  background: var(--color-gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
}

.link-favicon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.link-content {
  flex: 1;
}

.link-content h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
  line-height: var(--line-height-tight);
}

.link-content p {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
  margin: 0 0 var(--spacing-sm) 0;
}

.link-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.link-domain {
  font-weight: var(--font-weight-medium);
}

.link-actions {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.visit-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-primary);
  color: white;
  text-decoration: none;
  border-radius: var(--radius-base);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: var(--transition-base);
}

.visit-btn:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* 排序控制按钮组 */
.sort-controls {
  display: flex;
  gap: 2px;
  background: var(--color-gray-100);
  border-radius: var(--radius-sm);
  padding: 2px;
}

.sort-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: var(--radius-xs);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: var(--transition-fast);
  font-size: 12px;
}

.sort-btn:hover:not(:disabled) {
  background: var(--color-primary);
  color: white;
  transform: scale(1.1);
}

.sort-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: none;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: var(--color-gray-100);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: var(--transition-base);
}

.action-btn:hover {
  background: var(--color-gray-200);
  color: var(--color-text-primary);
  transform: translateY(-1px);
}

.action-btn.delete:hover {
  background: var(--color-error);
  color: white;
  border-color: var(--color-error);
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-base);
}

.modal {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-light);
}

.modal-header h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: var(--font-size-2xl);
  color: var(--color-text-tertiary);
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--radius-base);
  transition: var(--transition-base);
}

.close-btn:hover {
  background: var(--color-gray-100);
  color: var(--color-text-primary);
}

.modal-body {
  padding: var(--spacing-lg);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-base);
  border: 2px solid var(--color-border-medium);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  transition: var(--transition-base);
  background: var(--color-bg-primary);
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.modal-footer {
  display: flex;
  gap: var(--spacing-base);
  justify-content: flex-end;
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-border-light);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    padding: var(--spacing-xl) var(--spacing-base);
  }

  .page-header h1 {
    font-size: var(--font-size-3xl);
  }

  .header-actions {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 200px;
    justify-content: center;
  }

  .search-section {
    padding: var(--spacing-base);
  }

  .filter-tabs {
    flex-direction: column;
    align-items: center;
  }

  .filter-tab {
    width: 200px;
    text-align: center;
  }

  .links-grid {
    grid-template-columns: 1fr;
  }

  .category-header {
    flex-direction: column;
    gap: var(--spacing-base);
    align-items: flex-start;
  }

  .link-actions {
    flex-wrap: wrap;
  }

  .modal {
    margin: var(--spacing-base);
  }

  .modal-footer {
    flex-direction: column;
  }

  /* 移动端拖拽优化 */
  .link-card {
    touch-action: manipulation;
  }

  .chosen-card {
    transform: scale(1.02);
  }

  .ghost-card {
    opacity: 0.5;
    transform: scale(0.98);
  }
}

@media (max-width: 480px) {
  .navigation-container {
    padding: var(--spacing-base);
  }

  .category-section {
    padding: var(--spacing-base);
  }

  .link-card {
    padding: var(--spacing-base);
  }

  /* 移动端拖拽手势优化 */
  .links-grid {
    gap: var(--spacing-base);
  }

  .link-card.dragging {
    transform: scale(1.05) rotate(2deg);
  }
}

/* 触摸设备拖拽优化 */
@media (hover: none) and (pointer: coarse) {
  .link-card:hover {
    transform: none;
    box-shadow: var(--shadow-base);
  }

  .chosen-card {
    background: var(--color-primary);
    color: white;
    transform: scale(1.03);
  }

  .ghost-card {
    opacity: 0.4;
    background: var(--color-gray-200);
    border: 2px dashed var(--color-gray-400);
  }
}

/* 通知组件样式 */
.notification {
  position: fixed;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  z-index: 9999;
  max-width: 400px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  animation: slideInRight 0.3s ease-out;
}

.notification-success {
  background: var(--color-success);
  border-left: 4px solid var(--color-success-dark);
}

.notification-error {
  background: var(--color-error);
  border-left: 4px solid var(--color-error-dark);
}

.notification-warning {
  background: var(--color-warning);
  border-left: 4px solid var(--color-warning-dark);
}

.notification-content {
  display: flex;
  align-items: center;
  padding: var(--spacing-base) var(--spacing-lg);
  color: white;
  gap: var(--spacing-sm);
}

.notification-icon {
  font-size: var(--font-size-lg);
  flex-shrink: 0;
}

.notification-message {
  flex: 1;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
}

.notification-close {
  background: none;
  border: none;
  color: white;
  font-size: var(--font-size-xl);
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-base);
  transition: var(--transition-base);
  flex-shrink: 0;
}

.notification-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
