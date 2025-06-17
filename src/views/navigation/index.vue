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
import { onMounted } from 'vue'
import SearchFilter from './components/SearchFilter.vue'
import CategorySection from './components/CategorySection.vue'
import CategoryModal from './components/CategoryModal.vue'
import LinkModal from './components/LinkModal.vue'
import NotificationToast from './components/NotificationToast.vue'

// 导入 Composables
import { useNavigationData } from './composables/useNavigationData.js'
import { useNotification } from './composables/useNotification.js'
import { useNavigationCRUD } from './composables/useNavigationCRUD.js'
import { useNavigationModals } from './composables/useNavigationModals.js'

// 使用 Composables
const navigationData = useNavigationData()
const notificationSystem = useNotification()
const crudOperations = useNavigationCRUD(navigationData, notificationSystem)
const modalHandlers = useNavigationModals(crudOperations)

// 解构需要的状态和方法
const {
  categories,
  websiteList,
  isLoading,
  searchQuery,
  selectedCategory,
  filteredCategories,
  loadCategoriesWithWebsites
} = navigationData

const { notification, hideNotification } = notificationSystem

const {
  showCategoryModal,
  showLinkModal,
  editingCategory,
  editingLink,
  defaultCategoryId,
  handleEditCategory,
  handleDeleteCategory,
  handleCloseCategoryModal,
  handleCategorySubmit,
  handleEditLink,
  handleDeleteLink,
  handleAddLink,
  handleCloseLinkModal,
  handleLinkSubmit
} = modalHandlers

// 组件生命周期
onMounted(async () => {
  try {
    await loadCategoriesWithWebsites()
  } catch (error) {
    // 错误已在 composable 中处理
  }
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
