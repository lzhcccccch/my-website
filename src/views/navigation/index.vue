<template>
  <div class="navigation-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1>🧭 个人导航站</h1>
        <p>收集和整理您喜欢的网站链接，打造专属的网络导航</p>

        <!-- 操作按钮 -->
        <div class="header-actions">
          <button @click="showCategoryModal = true" class="btn btn-primary">
            <span class="icon">📁</span>
            添加分类
          </button>
          <button @click="showLinkModal = true" class="btn btn-secondary">
            <span class="icon">🔗</span>
            添加链接
          </button>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <SearchFilter
      v-model:search-query="searchQuery"
      v-model:selected-category="selectedCategory"
      :categories="categories"
    />

    <!-- 导航链接展示区域 -->
    <div class="navigation-container">

      <div v-if="filteredCategories.length === 0" class="empty-state">
        <div class="empty-icon">📂</div>
        <h3>暂无导航链接</h3>
        <p>开始添加您的第一个网站链接吧！</p>
        <button @click="showLinkModal = true" class="btn btn-primary">
          添加链接
        </button>
      </div>

      <div v-else class="categories-grid">
        <CategorySection
          v-for="category in filteredCategories"
          :key="category.id"
          :category="category"
          :loading="isLoading"
          @edit-category="handleEditCategory"
          @delete-category="handleDeleteCategory"
          @edit-link="handleEditLink"
          @delete-link="handleDeleteLink"
          @add-link="handleAddLink"
          @move-link-up="handleMoveLinkUp"
          @move-link-down="handleMoveLinkDown"
        />
      </div>
    </div>

    <!-- 分类模态框 -->
    <CategoryModal
      :show="showCategoryModal"
      :category="editingCategory"
      :loading="isLoading"
      @close="handleCloseCategoryModal"
      @submit="handleCategorySubmit"
    />

    <!-- 链接模态框 -->
    <LinkModal
      :show="showLinkModal"
      :link="editingLink"
      :categories="categories"
      :loading="isLoading"
      :default-category-id="defaultCategoryId"
      @close="handleCloseLinkModal"
      @submit="handleLinkSubmit"
    />

    <!-- 通知组件 -->
    <NotificationToast
      :show="notification.show"
      :type="notification.type"
      :message="notification.message"
      @close="hideNotification"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getAllCategories, getAllLinks, createCategory, createLink, updateLink, deleteLink, updateLinksOrder } from '../../api/navigation.js'

// 导入组件
import SearchFilter from './components/SearchFilter.vue'
import CategorySection from './components/CategorySection.vue'
import CategoryModal from './components/CategoryModal.vue'
import LinkModal from './components/LinkModal.vue'
import NotificationToast from './components/NotificationToast.vue'

/**
 * 个人导航站主页面
 * 负责数据管理和组件协调
 */

// 响应式数据
const searchQuery = ref('') // 搜索关键词
const selectedCategory = ref('all') // 选中的分类ID

// 模态框状态
const showCategoryModal = ref(false)
const showLinkModal = ref(false)
const editingCategory = ref(null)
const editingLink = ref(null)
const defaultCategoryId = ref(null)

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
    const data = await getAllCategories()
    // 添加"全部"选项
    categories.value = [
      { id: 'all', name: '全部', sortOrder: 0 },
      ...data
    ]
  } catch (error) {
    showNotification(error.message || '加载分类失败', 'error')
  }
}

/**
 * 加载链接数据
 */
async function loadLinks() {
  try {
    links.value = await getAllLinks()
  } catch (error) {
    showNotification(error.message || '加载链接失败', 'error')
  }
}



// 计算属性：过滤后的分类
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

// 工具函数
function getDomain(url) {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

// 组件事件处理函数
function handleEditCategory(category) {
  editingCategory.value = category
  showCategoryModal.value = true
}

function handleDeleteCategory(categoryId) {
  deleteCategory(categoryId)
}

function handleEditLink(link) {
  editingLink.value = link
  showLinkModal.value = true
}

function handleDeleteLink(linkId) {
  deleteLinkById(linkId)
}

function handleAddLink(categoryId) {
  defaultCategoryId.value = categoryId
  editingLink.value = null
  showLinkModal.value = true
}

function handleMoveLinkUp(categoryId, linkId) {
  moveLinkUp(categoryId, linkId)
}

function handleMoveLinkDown(categoryId, linkId) {
  moveLinkDown(categoryId, linkId)
}

// 模态框事件处理
function handleCloseCategoryModal() {
  showCategoryModal.value = false
  editingCategory.value = null
}

function handleCloseLinkModal() {
  showLinkModal.value = false
  editingLink.value = null
  defaultCategoryId.value = null
}

async function handleCategorySubmit(categoryData) {
  if (editingCategory.value) {
    // TODO: 实现编辑分类功能
    showNotification('编辑分类功能待实现', 'warning')
  } else {
    await addCategory(categoryData)
  }
  handleCloseCategoryModal()
}

async function handleLinkSubmit(linkData) {
  if (editingLink.value) {
    await updateLinkData(linkData)
  } else {
    await addLink(linkData)
  }
  handleCloseLinkModal()
}

// CRUD 操作函数
/**
 * 添加新分类
 */
async function addCategory(categoryData) {
  try {
    isLoading.value = true
    const newCat = await createCategory(categoryData)

    // 重新加载分类数据
    await loadCategories()

    // 显示成功通知
    showNotification(`分类 "${newCat.name || categoryData.name}" 添加成功！`, 'success')
  } catch (error) {
    showNotification(error.message || '添加分类失败', 'error')
  } finally {
    isLoading.value = false
  }
}

/**
 * 删除分类
 */
async function deleteCategory(categoryId) {
  if (confirm('确定要删除这个分类吗？分类下的所有链接也会被删除。')) {
    try {
      isLoading.value = true

      // 找到要删除的分类
      const categoryToDelete = categories.value.find(cat => cat.id === categoryId)

      // TODO: 调用删除分类的API
      // await api.delete(`/navigationCategory/${categoryId}`)

      // 重新加载数据
      await Promise.all([loadCategories(), loadLinks()])

      // 如果当前选中的分类被删除，切换到全部
      if (selectedCategory.value === categoryId) {
        selectedCategory.value = 'all'
      }

      showNotification(`分类 "${categoryToDelete?.name || ''}" 删除成功！`, 'success')
    } catch (error) {
      showNotification(error.message || '删除分类失败', 'error')
    } finally {
      isLoading.value = false
    }
  }
}

/**
 * 添加新链接
 */
async function addLink(linkData) {
  try {
    isLoading.value = true

    // 计算新链接在该分类中的排序序号
    const categoryLinks = links.value.filter(link => link.categoryId === linkData.categoryId)
    const maxSortOrder = categoryLinks.length > 0
      ? Math.max(...categoryLinks.map(link => link.sortOrder || 0))
      : 0

    const newLinkData = await createLink({
      ...linkData,
      sortOrder: maxSortOrder + 1
    })

    // 重新加载链接数据
    await loadLinks()

    // 显示成功通知
    showNotification(`链接 "${newLinkData.siteName || linkData.title}" 添加成功！`, 'success')
  } catch (error) {
    showNotification(error.message || '添加链接失败', 'error')
  } finally {
    isLoading.value = false
  }
}

/**
 * 更新链接
 */
async function updateLinkData(linkData) {
  if (!editingLink.value) return

  try {
    isLoading.value = true

    await updateLink(editingLink.value.id, {
      ...linkData,
      sortOrder: editingLink.value.sortOrder
    })

    // 重新加载链接数据
    await loadLinks()

    // 显示成功通知
    showNotification(`链接 "${linkData.title}" 更新成功！`, 'success')
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

}
</style>
