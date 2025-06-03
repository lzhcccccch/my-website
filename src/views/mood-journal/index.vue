<template>
  <div class="thoughts-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1>💭 心情随想录</h1>
        <p>记录每一天的心情和想法，留住美好时光</p>

        <!-- 添加新想法按钮 -->
        <div class="header-actions">
          <button
            @click="toggleAddForm"
            class="btn btn-primary add-entry-btn"
            :class="{ active: showAddForm }"
          >
            <span class="icon">{{ showAddForm ? '📝' : '✏️' }}</span>
            {{ showAddForm ? '收起表单' : '记录新想法' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="thoughts-container">
      <!-- 添加/编辑想法表单 -->
      <div v-if="showAddForm || editingThought" class="thought-form-section">
        <AddEntryForm
          :editing-thought="editingThought"
          :is-loading="isLoading"
          @submit="handleFormSubmit"
          @cancel="handleFormCancel"
        />
      </div>

      <!-- 搜索和筛选 -->
      <div class="filter-section">
        <div class="search-bar">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="搜索想法..."
            class="search-input"
          />
          <span class="search-icon">🔍</span>
        </div>

        <div class="filter-controls">
          <select v-model="selectedMood" class="mood-filter">
            <option value="">所有心情</option>
            <option v-for="mood in moodOptions" :key="mood.value" :value="mood.value">
              {{ mood.emoji }} {{ mood.label }}
            </option>
          </select>

          <select v-model="sortBy" class="sort-select">
            <option value="date-desc">最新优先</option>
            <option value="date-asc">最早优先</option>
            <option value="title">按标题排序</option>
          </select>
        </div>
      </div>

      <!-- 想法列表 -->
      <div class="thoughts-list">
        <div v-if="filteredThoughts.length === 0" class="empty-state">
          <div class="empty-icon">📝</div>
          <h3>{{ searchQuery ? '没有找到匹配的想法' : '还没有记录任何想法' }}</h3>
          <p>{{ searchQuery ? '试试其他关键词' : '开始记录你的第一个想法吧！' }}</p>
        </div>

        <div
          v-for="thought in filteredThoughts"
          :key="thought.id"
          class="thought-card"
        >
          <div class="thought-header">
            <div class="thought-title-section">
              <h3>{{ thought.title }}</h3>
              <span class="mood-indicator">{{ getMoodEmoji(thought.mood) }}</span>
            </div>
            <div class="thought-actions">
              <button @click="editThought(thought)" class="action-btn edit">
                <span class="icon">✏️</span>
              </button>
              <button @click="deleteThought(thought.id)" class="action-btn delete">
                <span class="icon">🗑️</span>
              </button>
            </div>
          </div>

          <div class="thought-content">
            <p>{{ thought.content }}</p>
          </div>

          <div class="thought-footer">
            <div class="thought-tags" v-if="thought.tags && thought.tags.length > 0">
              <span v-for="tag in thought.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <div class="thought-meta">
              <span class="thought-date">{{ formatDate(thought.createdAt) }}</span>
              <span v-if="thought.updatedAt && thought.updatedAt !== thought.createdAt" class="updated-indicator">
                (已编辑)
              </span>
            </div>
          </div>
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
import AddEntryForm from './components/AddEntryForm.vue'
import {
  moodOptions,
  defaultThoughts,
  getMoodEmoji,
  formatThoughtDate,
  createThoughtObject
} from './data/mockThoughts'

/**
 * 心情随想录主页组件
 * 提供完整的CRUD操作、搜索筛选、心情追踪和标签管理功能
 */

// 响应式数据
const searchQuery = ref('') // 搜索关键词
const selectedMood = ref('') // 选中的心情筛选
const sortBy = ref('date-desc') // 排序方式
const isLoading = ref(false) // 加载状态
const editingThought = ref(null) // 正在编辑的想法
const showAddForm = ref(false) // 显示添加表单

// 通知系统
const notification = ref({
  show: false,
  type: 'success',
  message: '',
  timeout: null
})

// 想法数据 - 使用模拟数据
const thoughts = ref([...defaultThoughts])

// 计算属性：过滤和排序后的想法列表
const filteredThoughts = computed(() => {
  let filtered = thoughts.value.slice()

  // 按心情筛选
  if (selectedMood.value) {
    filtered = filtered.filter(thought => thought.mood === selectedMood.value)
  }

  // 按搜索关键词筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(thought =>
      thought.title.toLowerCase().includes(query) ||
      thought.content.toLowerCase().includes(query) ||
      (thought.tags && thought.tags.some(tag => tag.toLowerCase().includes(query)))
    )
  }

  // 排序
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'date-asc':
        return new Date(a.createdAt) - new Date(b.createdAt)
      case 'date-desc':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'title':
        return a.title.localeCompare(b.title)
      default:
        return new Date(b.createdAt) - new Date(a.createdAt)
    }
  })

  return filtered
})

/**
 * 切换添加表单显示状态
 */
function toggleAddForm() {
  showAddForm.value = !showAddForm.value
  if (!showAddForm.value) {
    editingThought.value = null
  }
}

/**
 * 处理表单提交
 * @param {Object} thoughtData - 想法数据
 */
async function handleFormSubmit(thoughtData) {
  try {
    isLoading.value = true

    if (editingThought.value) {
      // 更新现有想法
      await updateThought(thoughtData)
    } else {
      // 添加新想法
      await addThought(thoughtData)
    }

  } catch (error) {
    console.error('操作失败:', error)
    showNotification('操作失败，请稍后重试', 'error')
  } finally {
    isLoading.value = false
  }
}

/**
 * 处理表单取消
 */
function handleFormCancel() {
  editingThought.value = null
  showAddForm.value = false
}

/**
 * 添加新想法
 * @param {Object} thoughtData - 想法数据
 */
async function addThought(thoughtData) {
  const newThoughtData = createThoughtObject(thoughtData)

  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 500))

  thoughts.value.unshift(newThoughtData)
  showAddForm.value = false

  showNotification(`想法 "${newThoughtData.title}" 添加成功！`, 'success')
}

/**
 * 编辑想法
 * @param {Object} thought - 要编辑的想法
 */
function editThought(thought) {
  editingThought.value = thought
  showAddForm.value = true

  // 滚动到表单顶部
  setTimeout(() => {
    const formElement = document.querySelector('.thought-form-section')
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' })
    }
  }, 100)
}

/**
 * 更新想法
 * @param {Object} thoughtData - 想法数据
 */
async function updateThought(thoughtData) {
  if (!editingThought.value) return

  // 更新想法数据
  editingThought.value.title = thoughtData.title.trim()
  editingThought.value.content = thoughtData.content.trim()
  editingThought.value.mood = thoughtData.mood
  editingThought.value.tags = [...thoughtData.tags]
  editingThought.value.updatedAt = new Date()

  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 500))

  showNotification(`想法 "${editingThought.value.title}" 更新成功！`, 'success')

  // 重置状态
  editingThought.value = null
  showAddForm.value = false
}

/**
 * 删除想法
 * @param {number} thoughtId - 想法ID
 */
async function deleteThought(thoughtId) {
  const thought = thoughts.value.find(t => t.id === thoughtId)
  if (!thought) return

  if (!confirm(`确定要删除想法 "${thought.title}" 吗？此操作无法撤销。`)) {
    return
  }

  try {
    isLoading.value = true

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 300))

    const index = thoughts.value.findIndex(t => t.id === thoughtId)
    if (index > -1) {
      thoughts.value.splice(index, 1)
      showNotification(`想法 "${thought.title}" 删除成功！`, 'success')
    }

  } catch (error) {
    console.error('删除想法失败:', error)
    showNotification('删除想法失败，请稍后重试', 'error')
  } finally {
    isLoading.value = false
  }
}

/**
 * 格式化日期显示
 * @param {Date} date - 日期对象
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date) {
  return formatThoughtDate(date)
}

/**
 * 显示通知
 * @param {string} message - 通知消息
 * @param {string} type - 通知类型
 * @param {number} duration - 显示时长（毫秒）
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
      notification.value.show = false
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
 * 组件挂载时的初始化
 */
onMounted(() => {
  console.log('心情随想录页面已加载')
})
</script>

<style src="./styles/index.css" scoped></style>
