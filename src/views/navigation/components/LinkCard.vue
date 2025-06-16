<template>
  <div class="link-card">
    <div class="link-favicon">
      <img
        :src="faviconUrl"
        :alt="link.siteName"
        @error="handleFaviconError"
      />
    </div>
    <div class="link-content">
      <h3>{{ link.siteName }}</h3>
      <p>{{ link.siteOverview }}</p>
      <div class="link-meta">
        <span class="link-domain">{{ domain }}</span>
        <span class="link-date">{{ formattedDate }}</span>
      </div>
    </div>
    <div class="link-actions">
      <a :href="link.siteUrl" target="_blank" class="visit-btn">
        <span class="icon">🔗</span>
        访问
      </a>
      <!-- 手动排序控制按钮 -->
      <div class="sort-controls">
        <button
          @click="handleMoveUp"
          class="sort-btn"
          :disabled="isFirst"
          title="上移"
        >
          <span class="icon">⬆️</span>
        </button>
        <button
          @click="handleMoveDown"
          class="sort-btn"
          :disabled="isLast"
          title="下移"
        >
          <span class="icon">⬇️</span>
        </button>
      </div>
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
import { computed } from 'vue'

const props = defineProps({
  link: {
    type: Object,
    required: true
  },
  isFirst: {
    type: Boolean,
    default: false
  },
  isLast: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['edit', 'delete', 'move-up', 'move-down'])

// 计算属性
const faviconUrl = computed(() => {
  try {
    const domain = new URL(props.link.siteUrl).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
  } catch {
    return '/default-favicon.png'
  }
})

const domain = computed(() => {
  try {
    return new URL(props.link.url).hostname
  } catch {
    return props.link.url
  }
})

const formattedDate = computed(() => {
  if (!props.link.createdAt) return ''
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(props.link.createdAt))
})

// 方法
function handleFaviconError(event) {
  event.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23666"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>'
}

function handleEdit() {
  emit('edit', props.link)
}

function handleDelete() {
  emit('delete', props.link.id)
}

function handleMoveUp() {
  emit('move-up', props.link.id)
}

function handleMoveDown() {
  emit('move-down', props.link.id)
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

/* 排序控制按钮组 */
.sort-controls {
  display: flex;
  gap: 2px;
  background: var(--color-gray-100);
  border-radius: var(--radius-sm);
  padding: 2px;
}

.sort-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: var(--radius-xs);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: var(--transition-fast);
  font-size: 12px;
}

.sort-btn:hover:not(:disabled) {
  background: var(--color-primary);
  color: white;
  transform: scale(1.1);
}

.sort-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: none;
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
