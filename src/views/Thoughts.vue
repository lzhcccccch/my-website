<template>
  <div class="thoughts-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1>💭 心情随想录</h1>
        <p>记录每一天的心情和想法，留住美好时光</p>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="thoughts-container">
      <!-- 添加/编辑想法表单 -->
      <div class="thought-form-section">
        <div class="form-card">
          <div class="form-header">
            <h3>{{ editingThought ? '编辑想法' : '记录新想法' }}</h3>
            <div class="mood-selector">
              <label>心情：</label>
              <div class="mood-options">
                <button
                  v-for="mood in moodOptions"
                  :key="mood.value"
                  @click="newThought.mood = mood.value"
                  :class="['mood-btn', { active: newThought.mood === mood.value }]"
                  type="button"
                >
                  <span class="mood-emoji">{{ mood.emoji }}</span>
                  <span class="mood-label">{{ mood.label }}</span>
                </button>
              </div>
            </div>
          </div>

          <div class="form-body">
            <div class="form-group">
              <label for="thoughtTitle">标题</label>
              <input
                type="text"
                id="thoughtTitle"
                v-model="newThought.title"
                placeholder="给这个想法起个标题..."
                maxlength="50"
                :class="{ 'error': errors.title }"
              />
              <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
            </div>

            <div class="form-group">
              <label for="thoughtContent">内容</label>
              <textarea
                id="thoughtContent"
                v-model="newThought.content"
                placeholder="写下你的想法、感受或今天发生的事情..."
                rows="4"
                maxlength="1000"
                :class="{ 'error': errors.content }"
              ></textarea>
              <div class="textarea-footer">
                <span v-if="errors.content" class="error-message">{{ errors.content }}</span>
                <span class="char-count">{{ newThought.content.length }}/1000</span>
              </div>
            </div>

            <div class="form-group">
              <label for="thoughtTags">标签</label>
              <input
                type="text"
                id="thoughtTags"
                v-model="tagInput"
                placeholder="输入标签，按回车添加"
                @keydown.enter.prevent="addTag"
              />
              <div v-if="newThought.tags.length > 0" class="tags-display">
                <span
                  v-for="(tag, index) in newThought.tags"
                  :key="index"
                  class="tag"
                >
                  {{ tag }}
                  <button @click="removeTag(index)" class="tag-remove">×</button>
                </span>
              </div>
            </div>
          </div>

          <div class="form-footer">
            <button v-if="editingThought" @click="cancelEdit" class="btn btn-secondary">
              取消
            </button>
            <button
              @click="editingThought ? updateThought() : addThought()"
              class="btn btn-primary"
              :disabled="!isFormValid || isLoading"
            >
              <span v-if="isLoading" class="loading-spinner"></span>
              {{ editingThought ? '更新' : '发布' }}
            </button>
          </div>
        </div>
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

/**
 * 心情随想录组件
 * 提供完整的CRUD操作、搜索筛选、心情追踪和标签管理功能
 */

// 响应式数据
const searchQuery = ref('') // 搜索关键词
const selectedMood = ref('') // 选中的心情筛选
const sortBy = ref('date-desc') // 排序方式
const isLoading = ref(false) // 加载状态
const editingThought = ref(null) // 正在编辑的想法
const tagInput = ref('') // 标签输入

// 表单数据
const newThought = ref({
  title: '',
  content: '',
  mood: 'neutral',
  tags: []
})

// 表单验证错误
const errors = ref({
  title: '',
  content: ''
})

// 通知系统
const notification = ref({
  show: false,
  type: 'success',
  message: '',
  timeout: null
})

// 心情选项
const moodOptions = ref([
  { value: 'happy', label: '开心', emoji: '😊' },
  { value: 'excited', label: '兴奋', emoji: '🤩' },
  { value: 'grateful', label: '感恩', emoji: '🙏' },
  { value: 'peaceful', label: '平静', emoji: '😌' },
  { value: 'neutral', label: '一般', emoji: '😐' },
  { value: 'thoughtful', label: '沉思', emoji: '🤔' },
  { value: 'tired', label: '疲惫', emoji: '😴' },
  { value: 'sad', label: '难过', emoji: '😢' },
  { value: 'anxious', label: '焦虑', emoji: '😰' },
  { value: 'angry', label: '愤怒', emoji: '😠' }
])

// 想法数据 - 使用更丰富的数据结构
const thoughts = ref([
  {
    id: 1,
    title: '学习Vue 3的收获',
    content: '今天深入学习了Vue 3的组合式API，感觉这种写法比选项式API更加灵活和强大。特别是ref和reactive的使用，让状态管理变得更加直观。',
    mood: 'excited',
    tags: ['学习', 'Vue3', '前端'],
    createdAt: new Date('2024-01-15T14:30:00'),
    updatedAt: new Date('2024-01-15T14:30:00')
  },
  {
    id: 2,
    title: '个人网站开发计划',
    content: '计划这周完成个人网站的基本框架搭建。主要包括导航站、心情随想录和单词卡片三个模块。希望能够打造一个实用且美观的个人工具集合。',
    mood: 'thoughtful',
    tags: ['计划', '开发', '个人项目'],
    createdAt: new Date('2024-01-12T09:15:00'),
    updatedAt: new Date('2024-01-12T09:15:00')
  },
  {
    id: 3,
    title: '今天的美好时光',
    content: '下午和朋友一起去公园散步，天气很好，阳光温暖。我们聊了很多关于未来的计划，感觉很充实。这样的时光总是让人感到幸福。',
    mood: 'happy',
    tags: ['生活', '友谊', '散步'],
    createdAt: new Date('2024-01-10T16:45:00'),
    updatedAt: new Date('2024-01-10T16:45:00')
  }
])

// 计算属性：表单是否有效
const isFormValid = computed(() => {
  return newThought.value.title.trim().length > 0 &&
         newThought.value.content.trim().length > 0 &&
         !errors.value.title &&
         !errors.value.content
})

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
 * 验证表单
 */
function validateForm() {
  errors.value = { title: '', content: '' }

  if (!newThought.value.title.trim()) {
    errors.value.title = '请输入标题'
  } else if (newThought.value.title.trim().length < 2) {
    errors.value.title = '标题至少需要2个字符'
  }

  if (!newThought.value.content.trim()) {
    errors.value.content = '请输入内容'
  } else if (newThought.value.content.trim().length < 5) {
    errors.value.content = '内容至少需要5个字符'
  }

  return !errors.value.title && !errors.value.content
}

/**
 * 添加新想法
 */
async function addThought() {
  if (!validateForm()) return

  try {
    isLoading.value = true

    const newThoughtData = {
      id: Date.now(),
      title: newThought.value.title.trim(),
      content: newThought.value.content.trim(),
      mood: newThought.value.mood,
      tags: [...newThought.value.tags],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    thoughts.value.unshift(newThoughtData)

    // 重置表单
    resetForm()

    showNotification(`想法 "${newThoughtData.title}" 添加成功！`, 'success')

  } catch (error) {
    console.error('添加想法失败:', error)
    showNotification('添加想法失败，请稍后重试', 'error')
  } finally {
    isLoading.value = false
  }
}

/**
 * 编辑想法
 * @param {Object} thought - 要编辑的想法
 */
function editThought(thought) {
  editingThought.value = thought
  newThought.value = {
    title: thought.title,
    content: thought.content,
    mood: thought.mood,
    tags: [...thought.tags]
  }

  // 滚动到表单顶部
  document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth' })
}

/**
 * 更新想法
 */
async function updateThought() {
  if (!validateForm() || !editingThought.value) return

  try {
    isLoading.value = true

    // 更新想法数据
    editingThought.value.title = newThought.value.title.trim()
    editingThought.value.content = newThought.value.content.trim()
    editingThought.value.mood = newThought.value.mood
    editingThought.value.tags = [...newThought.value.tags]
    editingThought.value.updatedAt = new Date()

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    showNotification(`想法 "${editingThought.value.title}" 更新成功！`, 'success')

    // 重置表单
    resetForm()
    editingThought.value = null

  } catch (error) {
    console.error('更新想法失败:', error)
    showNotification('更新想法失败，请稍后重试', 'error')
  } finally {
    isLoading.value = false
  }
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
 * 取消编辑
 */
function cancelEdit() {
  editingThought.value = null
  resetForm()
}

/**
 * 重置表单
 */
function resetForm() {
  newThought.value = {
    title: '',
    content: '',
    mood: 'neutral',
    tags: []
  }
  tagInput.value = ''
  errors.value = { title: '', content: '' }
}

/**
 * 添加标签
 */
function addTag() {
  const tag = tagInput.value.trim()
  if (tag && !newThought.value.tags.includes(tag) && newThought.value.tags.length < 10) {
    newThought.value.tags.push(tag)
    tagInput.value = ''
  }
}

/**
 * 移除标签
 * @param {number} index - 标签索引
 */
function removeTag(index) {
  newThought.value.tags.splice(index, 1)
}

/**
 * 获取心情表情符号
 * @param {string} mood - 心情值
 * @returns {string} 表情符号
 */
function getMoodEmoji(mood) {
  const moodOption = moodOptions.value.find(option => option.value === mood)
  return moodOption ? moodOption.emoji : '😐'
}

/**
 * 格式化日期显示
 * @param {Date} date - 日期对象
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date) {
  const now = new Date()
  const diffTime = Math.abs(now - new Date(date))
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) {
    return '今天 ' + new Intl.DateTimeFormat('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  } else if (diffDays === 2) {
    return '昨天 ' + new Intl.DateTimeFormat('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  } else if (diffDays <= 7) {
    return `${diffDays - 1}天前`
  } else {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }
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

<style scoped>
/* 心情随想录页面容器 */
.thoughts-page {
  width: 100%;
  min-height: calc(100vh - 80px);
  background: var(--color-bg-secondary);
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: var(--spacing-3xl) var(--spacing-base);
  text-align: center;
}

.header-content h1 {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--spacing-sm) 0;
}

.header-content p {
  font-size: var(--font-size-lg);
  opacity: 0.9;
  margin: 0;
}

/* 主要内容容器 */
.thoughts-container {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-base);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

/* 表单卡片 */
.form-card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  border: 1px solid var(--color-border-light);
}

.form-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-light);
  background: var(--color-bg-tertiary);
}

.form-header h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-base) 0;
}

/* 心情选择器 */
.mood-selector {
  margin-top: var(--spacing-base);
}

.mood-selector label {
  display: block;
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
}

.mood-options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.mood-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-bg-primary);
  border: 2px solid var(--color-border-medium);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: var(--transition-base);
  font-size: var(--font-size-sm);
}

.mood-btn:hover {
  border-color: var(--color-primary);
  background: rgba(102, 126, 234, 0.05);
}

.mood-btn.active {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: white;
}

.mood-emoji {
  font-size: var(--font-size-base);
}

.mood-label {
  font-weight: var(--font-weight-medium);
}

/* 表单主体 */
.form-body {
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
.form-group textarea {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-base);
  border: 2px solid var(--color-border-medium);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-family: inherit;
  transition: var(--transition-base);
  background: var(--color-bg-primary);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input.error,
.form-group textarea.error {
  border-color: var(--color-error);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
  line-height: var(--line-height-relaxed);
}

.textarea-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-xs);
}

.char-count {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.error-message {
  color: var(--color-error);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

/* 标签显示 */
.tags-display {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-sm);
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.tag-remove {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: var(--transition-fast);
}

.tag-remove:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 表单底部 */
.form-footer {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-border-light);
  background: var(--color-bg-tertiary);
  display: flex;
  gap: var(--spacing-base);
  justify-content: flex-end;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-base);
  text-decoration: none;
  white-space: nowrap;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--color-bg-primary);
  color: var(--color-text-secondary);
  border-color: var(--color-border-medium);
}

.btn-secondary:hover {
  background: var(--color-gray-100);
  color: var(--color-text-primary);
  border-color: var(--color-border-dark);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 筛选区域 */
.filter-section {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-base);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border-light);
}

.search-bar {
  position: relative;
  margin-bottom: var(--spacing-base);
}

.search-input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-base);
  padding-right: 40px;
  border: 2px solid var(--color-border-medium);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  transition: var(--transition-base);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-icon {
  position: absolute;
  right: var(--spacing-base);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
  pointer-events: none;
}

.filter-controls {
  display: flex;
  gap: var(--spacing-base);
  flex-wrap: wrap;
}

.mood-filter,
.sort-select {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 2px solid var(--color-border-medium);
  border-radius: var(--radius-md);
  background: var(--color-bg-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: var(--transition-base);
}

.mood-filter:focus,
.sort-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* 想法列表 */
.thoughts-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-text-tertiary);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-base);
  opacity: 0.6;
}

.empty-state h3 {
  font-size: var(--font-size-xl);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
}

.empty-state p {
  font-size: var(--font-size-base);
  margin: 0;
}

/* 想法卡片 */
.thought-card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-base);
  border: 1px solid var(--color-border-light);
  overflow: hidden;
  transition: var(--transition-base);
}

.thought-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary);
}

.thought-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--spacing-lg) var(--spacing-lg) 0;
}

.thought-title-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex: 1;
}

.thought-title-section h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
  line-height: var(--line-height-tight);
}

.mood-indicator {
  font-size: var(--font-size-xl);
  flex-shrink: 0;
}

.thought-actions {
  display: flex;
  gap: var(--spacing-xs);
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

.action-btn.edit:hover {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.action-btn.delete:hover {
  background: var(--color-error);
  color: white;
  border-color: var(--color-error);
}

.thought-content {
  padding: var(--spacing-base) var(--spacing-lg);
}

.thought-content p {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin: 0;
  font-size: var(--font-size-base);
}

.thought-footer {
  padding: 0 var(--spacing-lg) var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.thought-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.thought-tags .tag {
  background: var(--color-gray-200);
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
}

.thought-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.updated-indicator {
  font-style: italic;
}

/* 通知组件 */
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

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    padding: var(--spacing-xl) var(--spacing-base);
  }

  .header-content h1 {
    font-size: var(--font-size-3xl);
  }

  .thoughts-container {
    padding: var(--spacing-base);
  }

  .mood-options {
    gap: var(--spacing-xs);
  }

  .mood-btn {
    padding: var(--spacing-xs);
    font-size: var(--font-size-xs);
  }

  .mood-label {
    display: none;
  }

  .filter-controls {
    flex-direction: column;
  }

  .mood-filter,
  .sort-select {
    width: 100%;
  }

  .form-footer {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .thought-header {
    flex-direction: column;
    gap: var(--spacing-sm);
    align-items: flex-start;
  }

  .thought-actions {
    align-self: flex-end;
  }

  .thought-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .form-card,
  .filter-section,
  .thought-card {
    border-radius: var(--radius-lg);
  }

  .form-header,
  .form-body,
  .form-footer {
    padding: var(--spacing-base);
  }

  .notification {
    left: var(--spacing-base);
    right: var(--spacing-base);
    top: var(--spacing-base);
    max-width: none;
  }
}
</style>
