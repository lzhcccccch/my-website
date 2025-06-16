<template>
  <!-- 🏠 个人导航站主容器 -->
  <div class="navigation-page">

    <!-- 🎨 页面头部区域 -->
    <div class="page-header">
      <div class="header-content">
        <!-- 页面标题和描述 -->
        <h1>🧭 个人导航站</h1>
        <p>收集和整理您喜欢的网站链接，打造专属的网络导航</p>

        <!-- 🎯 主要操作按钮 -->
        <div class="header-actions">
          <!-- 添加分类按钮：点击后显示分类添加弹窗 -->
          <button @click="showCategoryModal = true" class="btn btn-primary">
            <span class="icon">📁</span>
            添加分类
          </button>
          <!-- 添加链接按钮：点击后显示链接添加弹窗 -->
          <button @click="showLinkModal = true" class="btn btn-secondary">
            <span class="icon">🔗</span>
            添加链接
          </button>
        </div>
      </div>
    </div>

    <!-- 🔍 搜索和筛选组件 -->
    <!--
      v-model:search-query: 双向绑定搜索关键词
      v-model:selected-category: 双向绑定选中的分类
      :categories: 传递分类列表给子组件
    -->
    <SearchFilter
      v-model:search-query="searchQuery"
      v-model:selected-category="selectedCategory"
      :categories="categories"
    />

    <!-- 📋 导航链接展示区域 -->
    <div class="navigation-container">

      <!-- 🈳 空状态提示：当没有任何链接时显示 -->
      <div v-if="filteredCategories.length === 0" class="empty-state">
        <div class="empty-icon">📂</div>
        <h3>暂无导航链接</h3>
        <p>开始添加您的第一个网站链接吧！</p>
        <button @click="showLinkModal = true" class="btn btn-primary">
          添加链接
        </button>
      </div>

      <!-- 📚 分类网格：显示所有分类和其下的链接 -->
      <div v-else class="categories-grid">
        <!--
          遍历过滤后的分类列表，为每个分类渲染一个CategorySection组件

          Props传递：
          - :category: 分类数据对象
          - :loading: 全局加载状态

          Events监听：
          - @edit-category: 编辑分类事件
          - @delete-category: 删除分类事件
          - @edit-link: 编辑链接事件
          - @delete-link: 删除链接事件
          - @add-link: 添加链接事件
          - @move-link-up: 链接上移事件
          - @move-link-down: 链接下移事件
        -->
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

    <!-- 🪟 分类模态框（弹窗）-->
    <!--
      用于添加和编辑分类

      Props:
      - :show: 控制弹窗显示/隐藏
      - :category: 编辑的分类数据（null表示新增模式）
      - :loading: 加载状态

      Events:
      - @close: 关闭弹窗事件
      - @submit: 提交表单事件
    -->
    <CategoryModal
      :show="showCategoryModal"
      :category="editingCategory"
      :loading="isLoading"
      @close="handleCloseCategoryModal"
      @submit="handleCategorySubmit"
    />

    <!-- 🔗 链接模态框（弹窗）-->
    <!--
      用于添加和编辑链接

      Props:
      - :show: 控制弹窗显示/隐藏
      - :link: 编辑的链接数据（null表示新增模式）
      - :categories: 分类列表（用于选择分类）
      - :loading: 加载状态
      - :default-category-id: 默认选中的分类ID

      Events:
      - @close: 关闭弹窗事件
      - @submit: 提交表单事件
    -->
    <LinkModal
      :show="showLinkModal"
      :link="editingLink"
      :categories="categories"
      :loading="isLoading"
      :default-category-id="defaultCategoryId"
      @close="handleCloseLinkModal"
      @submit="handleLinkSubmit"
    />

    <!-- 🔔 通知组件 -->
    <!--
      用于显示操作结果通知（成功、错误、警告）

      Props:
      - :show: 控制通知显示/隐藏
      - :type: 通知类型（success/error/warning）
      - :message: 通知消息内容

      Events:
      - @close: 关闭通知事件
    -->
    <NotificationToast
      :show="notification.show"
      :type="notification.type"
      :message="notification.message"
      @close="hideNotification"
    />
  </div>
</template>

<script setup>
// ===== Vue 3 Composition API 导入 =====
import { ref, computed, onMounted } from 'vue'
// ref: 创建响应式数据
// computed: 创建计算属性（基于其他响应式数据自动计算）
// onMounted: 组件挂载后执行的生命周期钩子

// ===== API 函数导入 =====
import { getAllCategories, getAllLinks, createCategory, createLink, updateLink, deleteLink, updateLinksOrder } from '../../api/navigation.js'
// 这些函数负责与后端API通信，执行增删改查操作

// ===== 子组件导入 =====
import SearchFilter from './components/SearchFilter.vue'      // 搜索和分类筛选组件
import CategorySection from './components/CategorySection.vue' // 分类展示组件
import CategoryModal from './components/CategoryModal.vue'     // 分类添加/编辑弹窗
import LinkModal from './components/LinkModal.vue'           // 链接添加/编辑弹窗
import NotificationToast from './components/NotificationToast.vue' // 通知提示组件

/**
 * 🏠 个人导航站主页面组件
 *
 * 📋 主要职责：
 * 1. 数据管理：管理分类和链接的状态数据
 * 2. 组件协调：协调各个子组件之间的数据传递和事件处理
 * 3. API调用：处理与后端的数据交互
 * 4. 用户交互：处理用户的各种操作（添加、编辑、删除等）
 *
 * 🔄 数据流向：
 * 父组件(index.vue) ↔ API ↔ 后端数据库
 *        ↓ props/events ↑
 * 子组件(SearchFilter, CategorySection等)
 */

// ===== 🔍 搜索和筛选相关的响应式数据 =====
const searchQuery = ref('')        // 用户输入的搜索关键词
const selectedCategory = ref('all') // 当前选中的分类ID，'all'表示显示所有分类

// ===== 🪟 模态框（弹窗）状态管理 =====
const showCategoryModal = ref(false) // 控制分类弹窗的显示/隐藏
const showLinkModal = ref(false)     // 控制链接弹窗的显示/隐藏
const editingCategory = ref(null)    // 当前正在编辑的分类对象，null表示新增模式
const editingLink = ref(null)        // 当前正在编辑的链接对象，null表示新增模式
const defaultCategoryId = ref(null)  // 添加链接时的默认分类ID

// ===== 📊 核心数据状态 =====
const categories = ref([])  // 分类列表数组，存储所有分类信息
const links = ref([])       // 链接列表数组，存储所有链接信息
const isLoading = ref(false) // 全局加载状态，用于显示加载动画

// ===== 🔔 通知系统配置 =====
const notification = ref({
  show: false,              // 是否显示通知
  type: 'success',          // 通知类型：'success'(成功)、'error'(错误)、'warning'(警告)
  message: '',              // 通知消息内容
  timeout: null             // 定时器ID，用于自动隐藏通知
})

// ===== 📥 数据加载函数 =====
/**
 * 🏷️ 加载分类数据
 *
 * 📝 功能说明：
 * 1. 调用API获取所有分类数据
 * 2. 在分类列表前添加"全部"选项，方便用户查看所有链接
 * 3. 错误处理：如果加载失败，显示错误通知
 *
 * 🔄 调用时机：
 * - 页面初始化时
 * - 添加新分类后
 * - 删除分类后
 */
async function loadCategories() {
  try {
    // 调用API获取分类数据
    const data = await getAllCategories()

    // 构建分类列表：在真实分类前添加"全部"选项
    categories.value = [
      { id: 'all', categoryName: '全部', categorySort: 0 }, // 特殊的"全部"选项
      ...data  // 展开运算符，将API返回的分类数据添加到数组中
    ]
  } catch (error) {
    // 错误处理：显示用户友好的错误信息
    showNotification(error.message || '加载分类失败', 'error')
  }
}

/**
 * 🔗 加载链接数据
 *
 * 📝 功能说明：
 * 1. 调用API获取所有链接数据
 * 2. 更新本地链接状态
 * 3. 错误处理：如果加载失败，显示错误通知
 *
 * 🔄 调用时机：
 * - 页面初始化时
 * - 添加新链接后
 * - 更新链接后
 * - 删除链接后
 */
async function loadLinks() {
  try {
    // 调用API获取链接数据并更新本地状态
    links.value = await getAllLinks();
  } catch (error) {
    // 错误处理：显示用户友好的错误信息
    showNotification(error.message || '加载链接失败', 'error')
  }
}

// ===== 🧮 计算属性：智能过滤和排序 =====
/**
 * 🎯 过滤后的分类列表
 *
 * 📝 功能说明：
 * 这是一个计算属性，会根据以下条件自动重新计算：
 * 1. 分类筛选：根据用户选择的分类进行过滤
 * 2. 搜索过滤：根据搜索关键词过滤链接
 * 3. 数据关联：为每个分类关联对应的链接
 * 4. 排序处理：分类按 categorySort 排序，链接按 siteSort 排序
 *
 * 🔄 触发重新计算的条件：
 * - categories.value 变化（分类数据更新）
 * - links.value 变化（链接数据更新）
 * - selectedCategory.value 变化（用户切换分类）
 * - searchQuery.value 变化（用户输入搜索词）
 */
const filteredCategories = computed(() => {
  // 第一步：获取所有真实分类（排除"全部"选项）并按排序字段排序
  let filtered = categories.value
    .filter(cat => cat.id !== 'all')  // 过滤掉"全部"选项
    .sort((a, b) => (a.categorySort || 0) - (b.categorySort || 0))  // 按分类排序字段升序排列

  // 第二步：根据用户选择的分类进行筛选
  if (selectedCategory.value !== 'all') {
    // 如果用户选择了特定分类，只显示该分类
    filtered = filtered.filter(cat => cat.id === selectedCategory.value)
  }

  // 第三步：为每个分类关联对应的链接数据
  filtered = filtered.map(category => {
    // 找到属于当前分类的所有链接
    const categoryLinks = links.value
      .filter(link => link.categoryId === category.id)  // 筛选出属于当前分类的链接
      .sort((a, b) => (a.siteSort || 0) - (b.siteSort || 0))  // 按链接排序字段升序排列

    // 返回包含链接数据的分类对象
    return {
      ...category,        // 展开原分类数据
      links: categoryLinks // 添加关联的链接数组
    }
  })

  // 第四步：根据搜索关键词进行过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()  // 转换为小写以实现不区分大小写搜索

    filtered = filtered.map(category => ({
      ...category,
      // 过滤每个分类下的链接，保留匹配搜索条件的链接
      links: category.links.filter(link =>
        link.siteName.toLowerCase().includes(query) ||        // 搜索链接标题
        link.siteOverview.toLowerCase().includes(query) ||  // 搜索链接描述
        getDomain(link.siteUrl).toLowerCase().includes(query)  // 搜索链接域名
      )
    })).filter(category => category.links && category.links.length > 0)  // 只保留有链接的分类
  }

  return filtered
})

// ===== 🛠️ 工具函数 =====
/**
 * 🌐 从URL中提取域名
 *
 * @param {string} url - 完整的URL地址
 * @returns {string} 域名或原URL（如果解析失败）
 *
 * 📝 功能说明：
 * 用于搜索功能，让用户可以通过域名搜索链接
 * 例如：https://www.google.com/search → www.google.com
 */
function getDomain(url) {
  try {
    return new URL(url).hostname  // 使用浏览器内置URL API提取域名
  } catch {
    return url  // 如果URL格式不正确，返回原始字符串
  }
}

// ===== 🎭 组件事件处理函数 =====
// 这些函数处理来自子组件的事件，实现父子组件之间的通信

/**
 * 📝 处理编辑分类事件
 * 当用户点击分类的编辑按钮时触发
 */
function handleEditCategory(category) {
  editingCategory.value = category    // 设置要编辑的分类数据
  showCategoryModal.value = true      // 显示分类编辑弹窗
}

/**
 * 🗑️ 处理删除分类事件
 * 当用户点击分类的删除按钮时触发
 */
function handleDeleteCategory(categoryId) {
  deleteCategory(categoryId)  // 调用删除分类的函数
}

/**
 * ✏️ 处理编辑链接事件
 * 当用户点击链接的编辑按钮时触发
 */
function handleEditLink(link) {
  editingLink.value = link        // 设置要编辑的链接数据
  showLinkModal.value = true      // 显示链接编辑弹窗
}

/**
 * 🗑️ 处理删除链接事件
 * 当用户点击链接的删除按钮时触发
 */
function handleDeleteLink(linkId) {
  deleteLinkById(linkId)  // 调用删除链接的函数
}

/**
 * ➕ 处理添加链接事件
 * 当用户点击分类下的"添加链接"按钮时触发
 */
function handleAddLink(categoryId) {
  defaultCategoryId.value = categoryId  // 设置默认分类ID
  editingLink.value = null              // 清空编辑状态（表示新增模式）
  showLinkModal.value = true            // 显示链接添加弹窗
}

/**
 * ⬆️ 处理链接上移事件
 * 当用户点击链接的上移按钮时触发
 */
function handleMoveLinkUp(categoryId, linkId) {
  moveLinkUp(categoryId, linkId)  // 调用链接上移函数
}

/**
 * ⬇️ 处理链接下移事件
 * 当用户点击链接的下移按钮时触发
 */
function handleMoveLinkDown(categoryId, linkId) {
  moveLinkDown(categoryId, linkId)  // 调用链接下移函数
}

// ===== 🪟 模态框（弹窗）事件处理 =====

/**
 * ❌ 关闭分类弹窗
 * 重置相关状态，清理编辑数据
 */
function handleCloseCategoryModal() {
  showCategoryModal.value = false  // 隐藏分类弹窗
  editingCategory.value = null     // 清空编辑状态
}

/**
 * ❌ 关闭链接弹窗
 * 重置相关状态，清理编辑数据
 */
function handleCloseLinkModal() {
  showLinkModal.value = false      // 隐藏链接弹窗
  editingLink.value = null         // 清空编辑状态
  defaultCategoryId.value = null   // 清空默认分类ID
}

/**
 * 💾 处理分类表单提交
 * 根据是否有编辑数据判断是新增还是编辑操作
 */
async function handleCategorySubmit(categoryData) {
  if (editingCategory.value) {
    // 编辑模式：更新现有分类
    // TODO: 实现编辑分类功能（需要后端API支持）
    showNotification('编辑分类功能待实现', 'warning')
  } else {
    // 新增模式：创建新分类
    await addCategory(categoryData)
  }
  handleCloseCategoryModal()  // 操作完成后关闭弹窗
}

/**
 * 💾 处理链接表单提交
 * 根据是否有编辑数据判断是新增还是编辑操作
 */
async function handleLinkSubmit(linkData) {
  if (editingLink.value) {
    // 编辑模式：更新现有链接
    await updateLinkData(linkData)
  } else {
    // 新增模式：创建新链接
    await addLink(linkData)
  }
  handleCloseLinkModal()  // 操作完成后关闭弹窗
}

// ===== 📊 CRUD 操作函数（增删改查）=====
// 这些函数负责与后端API交互，执行数据的增删改查操作

/**
 * ➕ 添加新分类
 *
 * @param {Object} categoryData - 分类数据对象
 * @param {string} categoryData.name - 分类名称
 * @param {string} categoryData.description - 分类描述
 * @param {string} categoryData.icon - 分类图标
 *
 * 📝 执行流程：
 * 1. 设置加载状态
 * 2. 调用API创建分类
 * 3. 重新加载分类数据以获取最新状态
 * 4. 显示成功通知
 * 5. 错误处理和状态重置
 */
async function addCategory(categoryData) {
  try {
    isLoading.value = true  // 显示加载状态

    // 调用API创建新分类
    const newCat = await createCategory(categoryData)

    // 重新加载分类数据，确保UI显示最新数据
    await loadCategories()

    // 显示成功通知给用户
    showNotification(`分类 "${newCat.name || categoryData.name}" 添加成功！`, 'success')
  } catch (error) {
    // 错误处理：显示用户友好的错误信息
    showNotification(error.message || '添加分类失败', 'error')
  } finally {
    // 无论成功失败都要重置加载状态
    isLoading.value = false
  }
}

/**
 * 🗑️ 删除分类
 *
 * @param {string|number} categoryId - 要删除的分类ID
 *
 * 📝 执行流程：
 * 1. 用户确认删除操作
 * 2. 调用API删除分类（包括分类下的所有链接）
 * 3. 重新加载数据
 * 4. 处理UI状态（如果删除的是当前选中分类，切换到"全部"）
 * 5. 显示操作结果通知
 *
 * ⚠️ 注意：删除分类会同时删除该分类下的所有链接
 */
async function deleteCategory(categoryId) {
  // 用户确认操作，防止误删
  if (confirm('确定要删除这个分类吗？分类下的所有链接也会被删除。')) {
    try {
      isLoading.value = true  // 显示加载状态

      // 保存要删除的分类信息，用于显示通知
      const categoryToDelete = categories.value.find(cat => cat.id === categoryId)

      // TODO: 调用删除分类的API（需要后端实现）
      // await api.delete(`/navigationCategory/${categoryId}`)

      // 重新加载所有数据，确保UI同步
      await Promise.all([loadCategories(), loadLinks()])

      // UI状态处理：如果删除的是当前选中的分类，切换到"全部"视图
      if (selectedCategory.value === categoryId) {
        selectedCategory.value = 'all'
      }

      // 显示成功通知
      showNotification(`分类 "${categoryToDelete?.name || ''}" 删除成功！`, 'success')
    } catch (error) {
      // 错误处理
      showNotification(error.message || '删除分类失败', 'error')
    } finally {
      // 重置加载状态
      isLoading.value = false
    }
  }
}

/**
 * 🔗 添加新链接
 *
 * @param {Object} linkData - 链接数据对象
 * @param {string} linkData.title - 链接标题
 * @param {string} linkData.url - 链接地址
 * @param {string} linkData.description - 链接描述
 * @param {string|number} linkData.categoryId - 所属分类ID
 *
 * 📝 执行流程：
 * 1. 计算新链接在分类中的排序位置
 * 2. 调用API创建链接
 * 3. 重新加载链接数据
 * 4. 显示成功通知
 *
 * 🔢 排序逻辑：
 * 新链接会被放在该分类的最后位置（sortOrder = 最大值 + 1）
 */
async function addLink(linkData) {
  try {
    isLoading.value = true  // 显示加载状态

    // 计算新链接在该分类中的排序序号
    // 1. 找到同分类的所有链接
    const categoryLinks = links.value.filter(link => link.categoryId === linkData.categoryId)

    // 2. 计算最大排序号，新链接排在最后
    const maxSortOrder = categoryLinks.length > 0
      ? Math.max(...categoryLinks.map(link => link.sortOrder || 0))  // 找到最大排序号
      : 0  // 如果分类为空，从0开始

    // 3. 调用API创建链接，设置排序号为最大值+1
    const newLinkData = await createLink({
      ...linkData,                // 展开用户输入的链接数据
      sortOrder: maxSortOrder + 1 // 设置排序号
    })

    // 重新加载链接数据，确保UI显示最新状态
    await loadLinks()

    // 显示成功通知
    showNotification(`链接 "${newLinkData.siteName || linkData.title}" 添加成功！`, 'success')
  } catch (error) {
    // 错误处理
    showNotification(error.message || '添加链接失败', 'error')
  } finally {
    // 重置加载状态
    isLoading.value = false
  }
}

/**
 * ✏️ 更新链接
 *
 * @param {Object} linkData - 更新的链接数据
 *
 * 📝 执行流程：
 * 1. 检查是否有正在编辑的链接
 * 2. 调用API更新链接（保持原有排序位置）
 * 3. 重新加载数据
 * 4. 显示操作结果
 *
 * 🔢 排序处理：
 * 更新时保持原有的sortOrder，不改变链接在分类中的位置
 */
async function updateLinkData(linkData) {
  // 安全检查：确保有正在编辑的链接
  if (!editingLink.value) return

  try {
    isLoading.value = true  // 显示加载状态

    // 调用API更新链接
    await updateLink(editingLink.value.id, {
      ...linkData,                           // 展开新的链接数据
      sortOrder: editingLink.value.sortOrder // 保持原有的排序位置
    })

    // 重新加载链接数据，确保UI同步
    await loadLinks()

    // 显示成功通知
    showNotification(`链接 "${linkData.title}" 更新成功！`, 'success')
  } catch (error) {
    // 错误处理
    showNotification(error.message || '更新链接失败', 'error')
  } finally {
    // 重置加载状态
    isLoading.value = false
  }
}

/**
 * 🗑️ 删除链接
 *
 * @param {number} linkId - 要删除的链接ID
 *
 * 📝 执行流程：
 * 1. 用户确认删除操作
 * 2. 调用API删除链接
 * 3. 重新加载数据
 * 4. 显示操作结果通知
 *
 * 🛡️ 安全措施：
 * 需要用户确认才能执行删除操作，防止误删
 */
async function deleteLinkById(linkId) {
  // 用户确认删除操作
  if (confirm('确定要删除这个链接吗？')) {
    try {
      isLoading.value = true  // 显示加载状态

      // 保存要删除的链接信息，用于显示通知
      const linkToDelete = links.value.find(link => link.id === linkId)

      // 调用API删除链接
      await deleteLink(linkId)

      // 重新加载链接数据，确保UI同步
      await loadLinks()

      // 显示成功通知
      showNotification(`链接 "${linkToDelete?.title || ''}" 删除成功！`, 'success')
    } catch (error) {
      // 错误处理
      showNotification(error.message || '删除链接失败', 'error')
    } finally {
      // 重置加载状态
      isLoading.value = false
    }
  } else {
    // 用户取消删除操作
    showNotification('取消删除操作', 'warning', 2000)
  }
}



// ===== 🔔 通知系统函数 =====

/**
 * 📢 显示通知消息
 *
 * @param {string} message - 通知消息内容
 * @param {string} type - 通知类型：'success'(成功)、'error'(错误)、'warning'(警告)
 * @param {number} duration - 显示时长（毫秒），默认3秒
 *
 * 📝 功能说明：
 * 1. 清除之前的通知定时器（避免重复通知）
 * 2. 设置新的通知内容和样式
 * 3. 设置自动隐藏定时器
 *
 * 🎨 通知类型说明：
 * - success: 绿色，用于成功操作
 * - error: 红色，用于错误提示
 * - warning: 黄色，用于警告信息
 */
function showNotification(message, type = 'success', duration = 3000) {
  // 清除之前的定时器，防止多个通知同时显示
  if (notification.value.timeout) {
    clearTimeout(notification.value.timeout)
  }

  // 设置通知内容
  notification.value = {
    show: true,    // 显示通知
    type,          // 通知类型（决定颜色和图标）
    message,       // 通知消息
    timeout: setTimeout(() => {
      hideNotification()  // 定时自动隐藏
    }, duration)
  }
}

/**
 * 🙈 隐藏通知
 *
 * 📝 功能说明：
 * 1. 清除定时器
 * 2. 隐藏通知组件
 */
function hideNotification() {
  // 清除定时器
  if (notification.value.timeout) {
    clearTimeout(notification.value.timeout)
  }
  // 隐藏通知
  notification.value.show = false
}



// ===== 🔄 链接排序功能 =====

/**
 * 💾 保存链接排序变化到后端
 *
 * @param {string} categoryId - 分类ID
 * @param {number} newIndex - 新位置索引（暂未使用，预留参数）
 * @param {number} oldIndex - 原位置索引（暂未使用，预留参数）
 *
 * 📝 功能说明：
 * 当用户手动调整链接顺序后，将新的排序保存到后端
 *
 * 🔢 排序逻辑：
 * 1. 获取分类下的所有链接
 * 2. 按当前sortOrder排序
 * 3. 提取链接ID数组
 * 4. 调用API保存新的排序
 *
 * 🐛 调试信息：
 * 在控制台输出排序信息，便于开发调试
 */
async function saveLinkOrder(categoryId, newIndex, oldIndex) {
  try {
    isLoading.value = true  // 显示加载状态

    // 获取当前分类的所有链接并按sortOrder排序
    const categoryLinks = links.value
      .filter(link => link.categoryId === categoryId)  // 筛选出当前分类的链接
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))  // 按排序字段升序排列

    // 如果分类为空，直接返回
    if (categoryLinks.length === 0) return

    // 提取链接ID数组，这个顺序就是新的排序
    const linkIds = categoryLinks.map(link => link.id)

    // 调试信息：在控制台输出排序详情
    console.log(`保存分类 ${categoryId} 的链接排序:`, linkIds)
    console.log('更新后的sortOrder:', categoryLinks.map(l => ({
      id: l.id,
      title: l.title,
      sortOrder: l.sortOrder
    })))

    // 调用API保存新的排序到后端
    await updateLinksOrder(categoryId, linkIds)

    // 显示成功通知
    showNotification('链接排序保存成功！', 'success')

  } catch (error) {
    // 错误日志
    console.error('保存排序失败:', error)

    // 显示错误提示
    showNotification(error.message || '保存排序失败，请稍后重试', 'error')

  } finally {
    // 重置加载状态
    isLoading.value = false
  }
}

/**
 * ⬆️ 手动上移链接
 *
 * @param {string} categoryId - 分类ID
 * @param {number} linkId - 要上移的链接ID
 *
 * 📝 功能说明：
 * 将指定链接在分类中向上移动一个位置
 *
 * 🔢 排序逻辑：
 * 1. 找到当前链接在分类中的位置
 * 2. 与上一个链接交换位置
 * 3. 重新计算所有链接的sortOrder
 * 4. 保存新的排序到后端
 *
 * 🛡️ 边界处理：
 * 如果链接已经是第一个，则不执行操作
 */
function moveLinkUp(categoryId, linkId) {
  // 获取当前分类的所有链接
  const categoryLinks = links.value.filter(link => link.categoryId === categoryId)

  // 找到要移动的链接在数组中的索引
  const linkIndex = categoryLinks.findIndex(link => link.id === linkId)

  // 边界检查：如果已经是第一个或未找到，则不执行操作
  if (linkIndex <= 0) return

  // 交换位置：当前链接与上一个链接互换
  const temp = categoryLinks[linkIndex]
  categoryLinks[linkIndex] = categoryLinks[linkIndex - 1]
  categoryLinks[linkIndex - 1] = temp

  // 重新计算sortOrder：按新的位置重新分配排序号
  categoryLinks.forEach((link, index) => {
    link.sortOrder = index + 1  // sortOrder从1开始
  })

  // 保存排序变化到后端
  saveLinkOrder(categoryId, linkIndex - 1, linkIndex)
}

/**
 * ⬇️ 手动下移链接
 *
 * @param {string} categoryId - 分类ID
 * @param {number} linkId - 要下移的链接ID
 *
 * 📝 功能说明：
 * 将指定链接在分类中向下移动一个位置
 *
 * 🔢 排序逻辑：
 * 1. 找到当前链接在分类中的位置
 * 2. 与下一个链接交换位置
 * 3. 重新计算所有链接的sortOrder
 * 4. 保存新的排序到后端
 *
 * 🛡️ 边界处理：
 * 如果链接已经是最后一个，则不执行操作
 */
function moveLinkDown(categoryId, linkId) {
  // 获取当前分类的所有链接
  const categoryLinks = links.value.filter(link => link.categoryId === categoryId)

  // 找到要移动的链接在数组中的索引
  const linkIndex = categoryLinks.findIndex(link => link.id === linkId)

  // 边界检查：如果已经是最后一个或未找到，则不执行操作
  if (linkIndex === -1 || linkIndex >= categoryLinks.length - 1) return

  // 交换位置：当前链接与下一个链接互换
  const temp = categoryLinks[linkIndex]
  categoryLinks[linkIndex] = categoryLinks[linkIndex + 1]
  categoryLinks[linkIndex + 1] = temp

  // 重新计算sortOrder：按新的位置重新分配排序号
  categoryLinks.forEach((link, index) => {
    link.sortOrder = index + 1  // sortOrder从1开始
  })

  // 保存排序变化到后端
  saveLinkOrder(categoryId, linkIndex + 1, linkIndex)
}



// ===== 🚀 组件生命周期 =====

/**
 * 🎯 组件挂载时的初始化
 *
 * 📝 功能说明：
 * 当组件挂载到DOM后自动执行，负责初始化页面数据
 *
 * 🔄 执行流程：
 * 1. 并行加载分类和链接数据（提高加载效率）
 * 2. 输出加载结果到控制台（便于调试）
 *
 * ⚡ 性能优化：
 * 使用Promise.all并行加载数据，而不是串行加载
 */
onMounted(async () => {
  console.log('🧭 个人导航站页面已加载')

  // 并行加载分类和链接数据，提高加载效率
  await Promise.all([
    loadCategories(),  // 加载分类数据
    loadLinks()        // 加载链接数据
  ])

  // 输出加载结果（categories.value.length - 1 是因为要排除"全部"选项）
  console.log(`✅ 加载完成: ${categories.value.length - 1} 个分类, ${links.value.length} 个链接`)
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
