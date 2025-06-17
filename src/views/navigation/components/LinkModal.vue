<template>
  <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h3>{{ isEditing ? '编辑链接' : '添加新链接' }}</h3>
        <button @click="handleClose" class="close-btn">×</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="siteName">网站名称</label>
          <input
              type="text"
              id="siteName"
              v-model="formData.siteName"
              placeholder="请输入网站名称"
              maxlength="50"
          />
        </div>
        <div class="form-group">
          <label for="siteUrl">网站地址</label>
          <input
              type="url"
              id="siteUrl"
              v-model="formData.siteUrl"
              placeholder="https://example.com"
          />
        </div>
        <div class="form-group">
          <label for="siteIcon">网站图标</label>
          <div class="icon-input-group">
            <input
                type="text"
                id="siteIcon"
                v-model="formData.siteIcon"
                placeholder="请输入图标URL或emoji"
                maxlength="100"
            />
            <button
                type="button"
                class="btn-generate-icon"
                @click="generateFavicon"
                :disabled="!formData.siteUrl || !isValidUrl(formData.siteUrl)"
                title="自动生成网站图标"
            >
              🎯 自动生成
            </button>
          </div>
          <div class="form-help">
            输入网站地址后，点击"自动生成"按钮可自动获取网站图标
          </div>
        </div>
        <div class="form-group">
          <label for="siteOverview">网站概览</label>
          <textarea
              id="siteOverview"
              v-model="formData.siteOverview"
              placeholder="请输入网站概览描述"
              rows="3"
              maxlength="200"
          ></textarea>
        </div>
        <div class="form-group">
          <label for="siteSort">网站排序</label>
          <input
              type="number"
              id="siteSort"
              v-model.number="formData.siteSort"
              placeholder="请输入排序号"
              min="1"
          />
          <div class="form-help">
            {{ isEditing ? '修改排序号可调整网站显示顺序' : `默认排序号：${defaultSortValue}` }}
          </div>
        </div>
        <div class="form-group">
          <label for="linkCategory">所属分类</label>
          <select id="linkCategory" v-model="formData.categoryId">
            <option value="">请选择分类</option>
            <option
                v-for="category in availableCategories"
                :key="category.id"
                :value="category.id"
            >
              {{ category.categoryName }}
            </option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button @click="handleClose" class="btn btn-secondary">取消</button>
        <button
            @click="handleSubmit"
            class="btn btn-primary"
            :disabled="!isFormValid || loading"
        >
          {{ loading ? '保存中...' : (isEditing ? '更新' : '添加') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, watch, onMounted} from 'vue';
import {getAllCategories} from "../../../api/navigation.js";
import {message} from "ant-design-vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  link: {
    type: Object,
    default: null
  },
  categories: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  defaultCategoryId: {
    type: [String, Number],
    default: null
  }
})

const emit = defineEmits(['close', 'submit'])

// 表单数据
const formData = ref({
  id: null,
  siteName: '',
  siteUrl: '',
  siteIcon: '',
  siteOverview: '',
  siteSort: 1,
  categoryId: ''
})

// 计算属性
const isEditing = computed(() => !!props.link)

const availableCategories = ref([]);

// 计算默认排序值 - 当前分类下网站个数+1
const defaultSortValue = computed(() => {
  if (!formData.value.categoryId) return 1

  // 从父组件传入的categories中找到对应分类的网站数量
  const currentCategory = props.categories.find(cat => String(cat.id) === String(formData.value.categoryId))
  console.log('currentCategory', currentCategory);
  if (currentCategory && currentCategory?.websiteList && Array.isArray(currentCategory.websiteList)) {
    return currentCategory.websiteList.length + 1
  }
  return 1
})

const isFormValid = computed(() => {
  return (formData.value.siteName || '').trim() &&
      (formData.value.siteUrl || '').trim() &&
      (formData.value.categoryId || '') &&
      isValidUrl(formData.value.siteUrl)
})

// ===== 🎯 网站图标自动生成功能 =====

/**
 * 📸 根据网站URL生成favicon地址
 *
 * @param {string} url - 网站URL地址
 * @returns {string} favicon的URL地址
 *
 * 📝 功能说明：
 * 1. 从URL中提取域名
 * 2. 使用Google的favicon服务生成图标URL
 * 3. 如果URL无效，返回默认图标
 */
const generateFaviconUrl = (url) => {
  try {
    const domain = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
  } catch {
    return '/default-favicon.png'
  }
}

// 计算属性：当前表单URL对应的favicon地址
const faviconUrl = computed(() => {
  if (!formData.value.siteUrl) return ''
  return generateFaviconUrl(formData.value.siteUrl)
})

// 监听链接数据变化
watch(() => props.link, (newLink) => {
  if (newLink) {
    formData.value = {
      id: props.link?.id,
      siteName: newLink.siteName || '',
      siteUrl: newLink.siteUrl || '',
      siteIcon: newLink.siteIcon || '',
      siteOverview: newLink.siteOverview || '',
      siteSort: newLink.siteSort || defaultSortValue.value,
      categoryId: newLink.categoryId || ''
    }
  } else {
    resetForm()
  }
}, {immediate: true})

// 监听显示状态
watch(() => props.show, (show) => {
  if (show) {
    loadCategories() // 每次显示模态框时加载分类
    if (!props.link && props.defaultCategoryId) {
      formData.value.categoryId = props.defaultCategoryId
      formData.value.siteSort = defaultSortValue.value
    }
  } else if (!show) {
    resetForm()
  }
})

// 监听分类变化，更新默认排序值
watch(() => formData.value.categoryId, () => {
  if (!isEditing.value) {
    formData.value.siteSort = defaultSortValue.value
  }
})

// ===== 🎯 监听网站URL变化，自动设置图标 =====
/**
 * 📝 功能说明：
 * 当用户输入网站URL后，如果图标字段为空，自动设置为favicon地址
 * 这样用户就不需要手动输入图标地址了
 */
watch(() => formData.value.siteUrl, (newUrl, oldUrl) => {
  // 只在新增模式下自动设置图标
  if (!isEditing.value && newUrl && newUrl !== oldUrl) {
    // 检查URL是否有效
    if (isValidUrl(newUrl)) {
      // 如果当前图标为空，或者图标是之前URL生成的favicon，则自动更新
      const oldFaviconUrl = oldUrl ? generateFaviconUrl(oldUrl) : ''
      if (!formData.value.siteIcon || formData.value.siteIcon === oldFaviconUrl) {
        formData.value.siteIcon = generateFaviconUrl(newUrl)
      }
    }
  }
})

// 组件挂载时加载分类
onMounted(() => {
  loadCategories()
})

// 方法
function loadCategories() {
  getAllCategories().then(res => {
    availableCategories.value = res;
  }).catch(err => {
    console.error('获取分类失败:', err);
    message.error('获取分类失败');
  })
}

function resetForm() {
  formData.value = {
    siteName: '',
    siteUrl: '',
    siteIcon: '',
    siteOverview: '',
    siteSort: defaultSortValue.value,
    categoryId: props.defaultCategoryId || ''
  }
}

function isValidUrl(url) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function handleClose() {
  emit('close')
}

function handleOverlayClick() {
  emit('close')
}

/**
 * 🎯 手动生成网站图标
 *
 * 📝 功能说明：
 * 用户点击"自动生成"按钮时，根据当前输入的URL生成favicon地址
 * 并设置到图标字段中
 */
function generateFavicon() {
  if (!formData.value.siteUrl || !isValidUrl(formData.value.siteUrl)) {
    return
  }

  // 生成favicon URL并设置到表单中
  formData.value.siteIcon = generateFaviconUrl(formData.value.siteUrl)
}

function handleSubmit() {
  if (!isFormValid.value || props.loading) return

  emit('submit', {
    ...formData.value,
    siteName: (formData.value.siteName || '').trim(),
    siteUrl: (formData.value.siteUrl || '').trim(),
    siteIcon: (formData.value.siteIcon || '').trim(),
    siteOverview: (formData.value.siteOverview || '').trim()
  })
}
</script>

<style scoped>
/* 复用 CategoryModal 的样式 */
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

/* 图标输入组合样式 */
.icon-input-group {
  display: flex;
  gap: var(--spacing-sm);
  align-items: stretch;
}

.icon-input-group input {
  flex: 1;
}

.btn-generate-icon {
  padding: var(--spacing-sm) var(--spacing-base);
  background: var(--color-secondary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-base);
  white-space: nowrap;
  min-width: 100px;
}

.btn-generate-icon:hover:not(:disabled) {
  background: var(--color-secondary-dark);
  transform: translateY(-1px);
}

.btn-generate-icon:disabled {
  background: var(--color-gray-300);
  color: var(--color-text-tertiary);
  cursor: not-allowed;
  transform: none;
}

.form-help {
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}

.modal-footer {
  display: flex;
  gap: var(--spacing-base);
  justify-content: flex-end;
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-border-light);
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
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: var(--color-gray-100);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border-medium);
}

.btn-secondary:hover {
  background: var(--color-gray-200);
  color: var(--color-text-primary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modal {
    margin: var(--spacing-base);
  }

  .modal-footer {
    flex-direction: column;
  }

  /* 移动端图标输入组合样式 */
  .icon-input-group {
    flex-direction: column;
  }

  .btn-generate-icon {
    min-width: auto;
    width: 100%;
  }
}
</style>
