<template>
  <div class="link-card">
    <div class="link-favicon">
      <img
          :src="link?.siteIcon"
          :alt="link?.siteName"
          @error="handleFaviconError"
      />
    </div>
    <div class="link-content">
      <h3>{{ link?.siteName }}</h3>
      <p>{{ link?.siteOverview }}</p>
      <div class="link-meta">
        <span class="link-domain">{{ domain }}</span>
        <span class="link-date">{{ formattedDate }}</span>
      </div>
    </div>
    <div class="link-actions">
      <a :href="link?.siteUrl" target="_blank" class="visit-btn">
        <span class="icon">🔗</span>
        访问
      </a>
      <button @click="handleEdit" class="action-btn">
        <span class="icon">✏️</span>
      </button>
      <button @click="handleDelete" class="action-btn delete">
        <span class="icon">🗑️</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue'

/**
 * @typedef {Object} link
 * @property {string|number} [id]
 * @property {string} siteName 网站名称
 * @property {string} siteUrl 网站地址
 * @property {string} siteIcon 网站图标
 * @property {string} siteOverview 网站概览
 * @property {number} [siteSort] 排序值
 * @property {string} [categoryId] 分类ID
 * @property {string|Date} [createdTime] 创建时间
 */
const props = defineProps({
  link: {
    type: Object,
    required: true,
    default: () => ({
      siteName: '',
      siteUrl: '',
      siteIcon: '',
      siteOverview: '',
      siteSort: 1,
      categoryId: ''
    })
  }
})

const emit = defineEmits(['edit', 'delete'])

// 计算属性
const domain = computed(() => {
  try {
    return new URL(props.link?.siteUrl).hostname
  } catch {
    return props.link?.siteUrl
  }
})

const formattedDate = computed(() => {
  if (!props.link?.createdTime) return ''
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(props.link.createdTime))
})

// 方法
function handleFaviconError(event) {
  event.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23666"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>'
}

function handleEdit() {
  emit('edit', props.link)
}

function handleDelete() {
  emit('delete', props.link?.id)
}
</script>

<style scoped>
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

.icon {
  font-size: var(--font-size-sm);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .link-actions {
    flex-wrap: wrap;
  }
}
</style>
