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
            <h2>{{ category.name }}</h2>
            <div class="category-actions">
              <button @click="editCategory(category)" class="action-btn">
                <span class="icon">✏️</span>
              </button>
              <button @click="deleteCategory(category.id)" class="action-btn delete">
                <span class="icon">🗑️</span>
              </button>
            </div>
          </div>

          <draggable
            v-model="category.links"
            class="links-grid"
            :group="{ name: 'links', pull: true, put: true }"
            :animation="200"
            :ghost-class="'ghost-card'"
            :chosen-class="'chosen-card'"
            :drag-class="'drag-card'"
            @start="onDragStart"
            @end="onDragEnd"
            @change="onDragChange"
            item-key="id"
          >
            <template #item="{ element: link }">
              <div
                class="link-card"
                :class="{ 'dragging': isDragging }"
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
                <button @click="editLink(link)" class="action-btn">
                  <span class="icon">✏️</span>
                </button>
                <button @click="deleteLink(link.id)" class="action-btn delete">
                  <span class="icon">🗑️</span>
                </button>
              </div>
            </div>
            </template>
          </draggable>
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
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeModals" class="btn btn-secondary">取消</button>
          <button
            @click="editingLink ? updateLink() : addLink()"
            class="btn btn-primary"
            :disabled="!isLinkFormValid"
          >
            {{ editingLink ? '更新' : '添加' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import draggable from 'vue-draggable-next'

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

// 拖拽相关状态
const isDragging = ref(false) // 是否正在拖拽
const draggedItem = ref(null) // 被拖拽的项目
const isLoading = ref(false) // 保存排序时的加载状态

// 分类数据
const categories = ref([
  { id: 'all', name: '全部' },
  {
    id: 'dev',
    name: '开发工具',
    links: [
      {
        id: 1,
        title: 'GitHub',
        description: '全球最大的代码托管平台，开发者的必备工具',
        url: 'https://github.com',
        createdAt: new Date('2024-01-15')
      },
      {
        id: 2,
        title: 'Stack Overflow',
        description: '程序员问答社区，解决编程问题的好地方',
        url: 'https://stackoverflow.com',
        createdAt: new Date('2024-01-16')
      },
      {
        id: 3,
        title: 'VS Code',
        description: '微软开发的免费代码编辑器',
        url: 'https://code.visualstudio.com',
        createdAt: new Date('2024-01-17')
      }
    ]
  },
  {
    id: 'learn',
    name: '学习资源',
    links: [
      {
        id: 4,
        title: 'MDN Web Docs',
        description: 'Web 技术权威文档，前端开发必备参考',
        url: 'https://developer.mozilla.org',
        createdAt: new Date('2024-01-18')
      },
      {
        id: 5,
        title: 'Vue.js 官方文档',
        description: 'Vue.js 框架官方文档，学习Vue的最佳资源',
        url: 'https://vuejs.org',
        createdAt: new Date('2024-01-19')
      },
      {
        id: 6,
        title: 'JavaScript.info',
        description: '现代 JavaScript 教程，从基础到高级',
        url: 'https://javascript.info',
        createdAt: new Date('2024-01-20')
      }
    ]
  },
  {
    id: 'design',
    name: '设计工具',
    links: [
      {
        id: 7,
        title: 'Figma',
        description: '在线协作设计工具，UI/UX设计师的首选',
        url: 'https://figma.com',
        createdAt: new Date('2024-01-21')
      },
      {
        id: 8,
        title: 'Unsplash',
        description: '高质量免费图片素材网站',
        url: 'https://unsplash.com',
        createdAt: new Date('2024-01-22')
      }
    ]
  }
])

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

// 计算属性：过滤后的分类
const filteredCategories = computed(() => {
  let filtered = categories.value.filter(cat => cat.id !== 'all')

  // 按分类筛选
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(cat => cat.id === selectedCategory.value)
  }

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
    })).filter(category => category.links.length > 0)
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
function addCategory() {
  if (!newCategory.value.name.trim()) return

  const newCat = {
    id: Date.now().toString(),
    name: newCategory.value.name.trim(),
    links: []
  }

  categories.value.push(newCat)

  // 重置表单
  newCategory.value.name = ''
  showAddCategoryModal.value = false

  console.log('添加分类成功:', newCat.name)
}

/**
 * 编辑分类
 * @param {Object} category - 要编辑的分类
 */
function editCategory(category) {
  newCategory.value.name = category.name
  showAddCategoryModal.value = true
  // 这里可以添加编辑逻辑
}

/**
 * 删除分类
 * @param {string} categoryId - 分类ID
 */
function deleteCategory(categoryId) {
  if (confirm('确定要删除这个分类吗？分类下的所有链接也会被删除。')) {
    const index = categories.value.findIndex(cat => cat.id === categoryId)
    if (index > -1) {
      const deletedCategory = categories.value.splice(index, 1)[0]
      console.log('删除分类成功:', deletedCategory.name)

      // 如果当前选中的分类被删除，切换到全部
      if (selectedCategory.value === categoryId) {
        selectedCategory.value = 'all'
      }
    }
  }
}

/**
 * 添加新链接
 */
function addLink() {
  if (!isLinkFormValid.value) return

  const categoryIndex = categories.value.findIndex(cat => cat.id === newLink.value.categoryId)
  if (categoryIndex === -1) return

  const newLinkData = {
    id: Date.now(),
    title: newLink.value.title.trim(),
    url: newLink.value.url.trim(),
    description: newLink.value.description.trim(),
    createdAt: new Date()
  }

  categories.value[categoryIndex].links.push(newLinkData)

  // 重置表单
  resetLinkForm()
  showAddLinkModal.value = false

  console.log('添加链接成功:', newLinkData.title)
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
    categoryId: findLinkCategory(link.id)
  }
  showAddLinkModal.value = true
}

/**
 * 更新链接
 */
function updateLink() {
  if (!isLinkFormValid.value || !editingLink.value) return

  // 找到链接所在的分类
  const oldCategoryId = findLinkCategory(editingLink.value.id)
  const newCategoryId = newLink.value.categoryId

  // 更新链接数据
  editingLink.value.title = newLink.value.title.trim()
  editingLink.value.url = newLink.value.url.trim()
  editingLink.value.description = newLink.value.description.trim()

  // 如果分类发生变化，需要移动链接
  if (oldCategoryId !== newCategoryId) {
    // 从旧分类中删除
    const oldCategoryIndex = categories.value.findIndex(cat => cat.id === oldCategoryId)
    if (oldCategoryIndex > -1) {
      const linkIndex = categories.value[oldCategoryIndex].links.findIndex(l => l.id === editingLink.value.id)
      if (linkIndex > -1) {
        categories.value[oldCategoryIndex].links.splice(linkIndex, 1)
      }
    }

    // 添加到新分类
    const newCategoryIndex = categories.value.findIndex(cat => cat.id === newCategoryId)
    if (newCategoryIndex > -1) {
      categories.value[newCategoryIndex].links.push(editingLink.value)
    }
  }

  // 重置表单
  resetLinkForm()
  showAddLinkModal.value = false
  editingLink.value = null

  console.log('更新链接成功:', newLink.value.title)
}

/**
 * 删除链接
 * @param {number} linkId - 链接ID
 */
function deleteLink(linkId) {
  if (confirm('确定要删除这个链接吗？')) {
    for (const category of categories.value) {
      const linkIndex = category.links.findIndex(link => link.id === linkId)
      if (linkIndex > -1) {
        const deletedLink = category.links.splice(linkIndex, 1)[0]
        console.log('删除链接成功:', deletedLink.title)
        break
      }
    }
  }
}

/**
 * 查找链接所属的分类ID
 * @param {number} linkId - 链接ID
 * @returns {string|null} 分类ID
 */
function findLinkCategory(linkId) {
  for (const category of categories.value) {
    if (category.links.some(link => link.id === linkId)) {
      return category.id
    }
  }
  return null
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
 * 拖拽开始事件处理
 * @param {Object} evt - 拖拽事件对象
 */
function onDragStart(evt) {
  isDragging.value = true
  draggedItem.value = evt.item

  // 添加拖拽开始的视觉反馈
  console.log('开始拖拽链接:', evt.item.textContent)

  // 为拖拽元素添加特殊样式
  if (evt.item) {
    evt.item.style.opacity = '0.8'
  }
}

/**
 * 拖拽结束事件处理
 * @param {Object} evt - 拖拽事件对象
 */
function onDragEnd(evt) {
  isDragging.value = false
  draggedItem.value = null

  // 恢复元素样式
  if (evt.item) {
    evt.item.style.opacity = '1'
  }

  console.log('拖拽结束')
}

/**
 * 拖拽变化事件处理（跨分类移动或排序变化）
 * @param {Object} evt - 拖拽变化事件对象
 */
function onDragChange(evt) {
  console.log('拖拽变化事件:', evt)

  // 如果是跨分类移动
  if (evt.added) {
    const addedLink = evt.added.element
    const newCategoryId = findCategoryByLinkArray(evt.added.newIndex, addedLink)

    console.log(`链接 "${addedLink.title}" 被移动到新分类`)

    // 调用API保存跨分类移动
    saveLinkCategoryChange(addedLink.id, newCategoryId)
  }

  // 如果是同分类内排序变化
  if (evt.moved) {
    const movedLink = evt.moved.element
    const categoryId = findCategoryByLinkArray(evt.moved.newIndex, movedLink)

    console.log(`链接 "${movedLink.title}" 在分类内重新排序`)

    // 调用API保存排序变化
    saveLinkOrder(categoryId, evt.moved.newIndex, evt.moved.oldIndex)
  }
}

/**
 * 根据链接数组查找对应的分类ID
 * @param {number} linkIndex - 链接在数组中的索引
 * @param {Object} link - 链接对象
 * @returns {string|null} 分类ID
 */
function findCategoryByLinkArray(linkIndex, link) {
  for (const category of categories.value) {
    if (category.id !== 'all' && category.links.includes(link)) {
      return category.id
    }
  }
  return null
}

/**
 * 保存链接的分类变化到后端
 * @param {number} linkId - 链接ID
 * @param {string} newCategoryId - 新分类ID
 */
async function saveLinkCategoryChange(linkId, newCategoryId) {
  try {
    isLoading.value = true

    // 模拟API调用
    console.log(`保存链接 ${linkId} 的分类变化到 ${newCategoryId}`)

    // 这里应该调用实际的API
    // await api.put(`/links/${linkId}/category`, { categoryId: newCategoryId })

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    console.log('分类变化保存成功')

  } catch (error) {
    console.error('保存分类变化失败:', error)

    // 显示错误提示
    alert('保存失败，请稍后重试')

    // 可以在这里实现回滚逻辑

  } finally {
    isLoading.value = false
  }
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

    // 获取当前分类的所有链接ID顺序
    const category = categories.value.find(cat => cat.id === categoryId)
    if (!category) return

    const linkIds = category.links.map(link => link.id)

    console.log(`保存分类 ${categoryId} 的链接排序:`, linkIds)

    // 这里应该调用实际的API
    // await api.put(`/categories/${categoryId}/links/order`, { linkIds })

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300))

    console.log('排序保存成功')

  } catch (error) {
    console.error('保存排序失败:', error)

    // 显示错误提示
    alert('保存排序失败，请稍后重试')

  } finally {
    isLoading.value = false
  }
}

/**
 * 组件挂载时的初始化
 */
onMounted(() => {
  console.log('个人导航站页面已加载，支持拖拽排序功能')
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

.category-header h2 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
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

/* 加载状态指示器 */
.category-section.loading {
  position: relative;
  pointer-events: none;
}

.category-section.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  border-radius: var(--radius-xl);
  z-index: 100;
}

.category-section.loading::before {
  content: '保存中...';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--color-primary);
  color: white;
  padding: var(--spacing-sm) var(--spacing-base);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  z-index: 101;
  box-shadow: var(--shadow-lg);
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
</style>
