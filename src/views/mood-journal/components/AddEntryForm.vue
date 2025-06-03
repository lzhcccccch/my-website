<template>
  <div class="add-entry-form">
    <div class="form-card">
      <div class="form-header">
        <h3>{{ editingThought ? '编辑想法' : '记录新想法' }}</h3>
        <div class="mood-selector">
          <label>心情：</label>
          <div class="mood-options">
            <button
              v-for="mood in moodOptions"
              :key="mood.value"
              @click="formData.mood = mood.value"
              :class="['mood-btn', { active: formData.mood === mood.value }]"
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
            v-model="formData.title"
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
            v-model="formData.content"
            placeholder="写下你的想法、感受或今天发生的事情..."
            rows="4"
            maxlength="1000"
            :class="{ 'error': errors.content }"
          ></textarea>
          <div class="textarea-footer">
            <span v-if="errors.content" class="error-message">{{ errors.content }}</span>
            <span class="char-count">{{ formData.content.length }}/1000</span>
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
          <div v-if="formData.tags.length > 0" class="tags-display">
            <span
              v-for="(tag, index) in formData.tags"
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
          @click="submitForm"
          class="btn btn-primary"
          :disabled="!isFormValid || isLoading"
        >
          <span v-if="isLoading" class="loading-spinner"></span>
          {{ editingThought ? '更新' : '发布' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { moodOptions, validateThoughtData } from '../data/mockThoughts'

/**
 * 添加想法表单组件
 * 提供想法的创建和编辑功能
 */

// Props
const props = defineProps({
  editingThought: {
    type: Object,
    default: null
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['submit', 'cancel'])

// 响应式数据
const tagInput = ref('')

// 表单数据
const formData = ref({
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

// 计算属性：表单是否有效
const isFormValid = computed(() => {
  const validation = validateThoughtData(formData.value)
  return validation.isValid
})

// 监听编辑状态变化
watch(() => props.editingThought, (newThought) => {
  if (newThought) {
    formData.value = {
      title: newThought.title,
      content: newThought.content,
      mood: newThought.mood,
      tags: [...newThought.tags]
    }
  } else {
    resetForm()
  }
}, { immediate: true })

/**
 * 验证表单
 */
function validateForm() {
  const validation = validateThoughtData(formData.value)
  errors.value = validation.errors
  return validation.isValid
}

/**
 * 提交表单
 */
function submitForm() {
  if (!validateForm()) return

  const thoughtData = {
    title: formData.value.title.trim(),
    content: formData.value.content.trim(),
    mood: formData.value.mood,
    tags: [...formData.value.tags]
  }

  emit('submit', thoughtData)
}

/**
 * 取消编辑
 */
function cancelEdit() {
  emit('cancel')
  resetForm()
}

/**
 * 重置表单
 */
function resetForm() {
  formData.value = {
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
  if (tag && !formData.value.tags.includes(tag) && formData.value.tags.length < 10) {
    formData.value.tags.push(tag)
    tagInput.value = ''
  }
}

/**
 * 移除标签
 * @param {number} index - 标签索引
 */
function removeTag(index) {
  formData.value.tags.splice(index, 1)
}

// 暴露方法给父组件
defineExpose({
  resetForm
})
</script>

<style scoped>
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

/* 响应式设计 */
@media (max-width: 768px) {
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

  .form-footer {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .form-header,
  .form-body,
  .form-footer {
    padding: var(--spacing-base);
  }
}
</style>
