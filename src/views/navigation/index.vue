<template>
  <div class="navigation-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1>🧭 个人导航站</h1>
        <p>收集和整理您喜欢的网站链接，打造专属的网络导航</p>
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

    <!-- 搜索筛选 -->
    <SearchFilter
      v-model:search-query="searchQuery"
      v-model:selected-category="selectedCategory"
      :categories="categories"
    />

    <!-- 内容区域 -->
    <div class="navigation-container">
      <!-- 空状态 -->
      <div v-if="filteredCategories.length === 0" class="empty-state">
        <div class="empty-icon">📂</div>
        <h3>暂无导航链接</h3>
        <p>开始添加您的第一个网站链接吧！</p>
        <button @click="showLinkModal = true" class="btn btn-primary">
          添加链接
        </button>
      </div>

      <!-- 分类列表 -->
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
        />
      </div>
    </div>

    <!-- 弹窗 -->
    <CategoryModal
      :show="showCategoryModal"
      :category="editingCategory"
      :categories="categories"
      :loading="isLoading"
      @close="handleCloseCategoryModal"
      @submit="handleCategorySubmit"
    />

    <LinkModal
      :show="showLinkModal"
      :link="editingLink"
      :categories="categories"
      :loading="isLoading"
      :default-category-id="defaultCategoryId"
      @close="handleCloseLinkModal"
      @submit="handleLinkSubmit"
    />

    <!-- 通知 -->
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
import { getCategoriesWithWebsites, createCategory, createLink, updateLink, deleteLink } from '../../api/navigation.js'
import SearchFilter from './components/SearchFilter.vue'
import CategorySection from './components/CategorySection.vue'
import CategoryModal from './components/CategoryModal.vue'
import LinkModal from './components/LinkModal.vue'
import NotificationToast from './components/NotificationToast.vue'

// 搜索和筛选
const searchQuery = ref('')
const selectedCategory = ref('all')

// 弹窗状态
const showCategoryModal = ref(false)
const showLinkModal = ref(false)
const editingCategory = ref(null)
const editingLink = ref(null)
const defaultCategoryId = ref(null)

// 数据状态
const categories = ref([])
const websiteList = ref([])
const isLoading = ref(false)

// 通知系统
const notification = ref({
  show: false,
  type: 'success',
  message: '',
  timeout: null
})

/**
 * 加载分类和网站数据
 */
async function loadCategoriesWithWebsites() {
  try {
    const data = await getCategoriesWithWebsites()
    // 构建分类列表，添加"全部"选项
    categories.value = [
      { id: 'all', categoryName: '全部', categorySort: 0 },
      ...data
    ]

    // 扁平化所有网站数据
    const allLinks = []
    if (Array.isArray(data)) {
      data.forEach(category => {
        if (category?.websiteList && category.websiteList.length > 0) {
          allLinks.push(...category.websiteList)
        }
      })
    }
    websiteList.value = allLinks
  } catch (error) {
    showNotification(error.message || '加载数据失败', 'error')
  }
}

/**
 * 过滤后的分类列表
 * 根据选中分类和搜索关键词进行过滤
 */
const filteredCategories = computed(() => {
  // 获取所有真实分类并排序
  let filtered = categories.value
    .filter(cat => cat?.id !== 'all')
    .sort((a, b) => (a?.categorySort || 0) - (b?.categorySort || 0))

  // 根据选中分类筛选
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(cat => String(cat?.id) === String(selectedCategory.value))
  }

  // 为每个分类关联对应的链接
  filtered = filtered.map(category => {
    const categoryLinks = websiteList.value
      .filter(link => String(link?.categoryId) === String(category?.id))
      .sort((a, b) => (a?.siteSort || 0) - (b?.siteSort || 0))

    return {
      ...category,
      links: categoryLinks
    }
  })

  // 根据搜索关键词过滤
  if ((searchQuery.value || '').trim()) {
    const query = (searchQuery.value || '').toLowerCase()
    filtered = filtered.map(category => ({
      ...category,
      links: category.links.filter(link =>
        link?.siteName.toLowerCase().includes(query) ||
        link?.siteOverview.toLowerCase().includes(query) ||
        getDomain(link?.siteUrl).toLowerCase().includes(query)
      )
    })).filter(category => category.links && category.links.length > 0)
  }

  return filtered
})

/**
 * 从URL中提取域名
 */
function getDomain(url) {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

// 组件事件处理
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


// 弹窗事件处理
function handleCloseCategoryModal() {
  showCategoryModal.value = false
  editingCategory.value = null
}

function handleCloseLinkModal() {
  showLinkModal.value = false
  editingLink.value = null
  defaultCategoryId.value = null
}

/**
 * 处理分类表单提交
 */
async function handleCategorySubmit(categoryData) {
  if (editingCategory.value) {
    showNotification('编辑分类功能待实现', 'warning')
  } else {
    await addCategory(categoryData)
  }
  handleCloseCategoryModal()
}

/**
 * 处理链接表单提交
 */
async function handleLinkSubmit(linkData) {
  if (editingLink.value) {
    await updateLinkData(linkData)
  } else {
    await addLink(linkData)
  }
  handleCloseLinkModal()
}

// CRUD操作函数
/**
 * 添加新分类
 */
async function addCategory(categoryData) {
  try {
    isLoading.value = true

    // CategoryModal 已经包含了 categorySort，直接使用提交的数据
    const newCat = await createCategory(categoryData)
    await loadCategoriesWithWebsites()
    showNotification(`分类 "${newCat.categoryName || categoryData.categoryName}" 添加成功！`, 'success')
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
      const categoryToDelete = categories.value.find(cat => String(cat?.id) === String(categoryId))
      // TODO: 调用删除分类的API（需要后端实现）
      await loadCategoriesWithWebsites()
      if (String(selectedCategory.value) === String(categoryId)) {
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

    // 如果没有提供 siteSort，则计算默认排序位置
    let finalLinkData = { ...linkData }
    if (!finalLinkData.siteSort) {
      const categoryLinks = websiteList.value.filter(link => String(link?.categoryId) === String(linkData.categoryId))
      const maxSiteSort = categoryLinks.length > 0
        ? Math.max(...categoryLinks.map(link => link?.siteSort || 0))
        : 0
      finalLinkData.siteSort = maxSiteSort + 1
    }

    const newLinkData = await createLink(finalLinkData)

    await loadCategoriesWithWebsites()
    showNotification(`链接 "${newLinkData.siteName || linkData.siteName}" 添加成功！`, 'success')
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
      // 使用提交的 siteSort 值，如果没有则保持原有排序
      siteSort: linkData.siteSort || editingLink.value.siteSort
    })

    await loadCategoriesWithWebsites()
    showNotification(`链接 "${linkData.siteName}" 更新成功！`, 'success')
  } catch (error) {
    showNotification(error.message || '更新链接失败', 'error')
  } finally {
    isLoading.value = false
  }
}

/**
 * 删除链接
 */
async function deleteLinkById(linkId) {
  if (confirm('确定要删除这个链接吗？')) {
    try {
      isLoading.value = true
      const linkToDelete = websiteList.value.find(link => String(link?.id) === String(linkId))
      await deleteLink(linkId)
      await loadCategoriesWithWebsites()
      showNotification(`链接 "${linkToDelete?.siteName || ''}" 删除成功！`, 'success')
    } catch (error) {
      showNotification(error.message || '删除链接失败', 'error')
    } finally {
      isLoading.value = false
    }
  }
}

// 通知系统
/**
 * 显示通知消息
 */
function showNotification(message, type = 'success', duration = 3000) {
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

// 组件生命周期
/**
 * 组件挂载时初始化数据
 */
onMounted(async () => {
  await loadCategoriesWithWebsites()
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
