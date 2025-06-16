<template>
  <div class="category-section">
    <div class="category-header">
      <div class="category-title">
        <span class="drag-handle" title="拖拽排序">⋮⋮</span>
        <h2>{{ category.categoryName }}</h2>
        <span class="category-count">({{ category.links ? category.links.length : 0 }})</span>
      </div>
      <div class="category-actions">
        <button @click="handleEdit" class="action-btn">
          <span class="icon">✏️</span>
        </button>
        <button @click="handleDelete" class="action-btn delete">
          <span class="icon">🗑️</span>
        </button>
      </div>
    </div>

    <!-- 链接展示区域 -->
    <div class="links-grid">
      <LinkCard
        v-for="(link, index) in category.links"
        :key="link.id"
        :link="link"
        :is-first="index === 0"
        :is-last="index === category.links.length - 1"
        @edit="handleLinkEdit"
        @delete="handleLinkDelete"
        @move-up="handleLinkMoveUp"
        @move-down="handleLinkMoveDown"
      />
    </div>

    <!-- 空分类提示 -->
    <div v-if="category.links && category.links.length === 0" class="empty-category">
      <div class="empty-category-icon">📂</div>
      <p>此分类暂无链接，点击添加</p>
      <button @click="handleAddLink" class="btn-add-link">
        <span class="icon">➕</span>
        添加链接
      </button>
    </div>

    <!-- 加载状态指示器 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <span>保存中...</span>
    </div>
  </div>
</template>

<script setup>
import LinkCard from './LinkCard.vue'

const props = defineProps({
  category: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'edit-category',
  'delete-category',
  'edit-link',
  'delete-link',
  'add-link',
  'move-link-up',
  'move-link-down'
])

function handleEdit() {
  emit('edit-category', props.category)
}

function handleDelete() {
  emit('delete-category', props.category.id)
}

function handleLinkEdit(link) {
  emit('edit-link', link)
}

function handleLinkDelete(linkId) {
  emit('delete-link', linkId)
}

function handleAddLink() {
  emit('add-link', props.category.id)
}

function handleLinkMoveUp(linkId) {
  emit('move-link-up', props.category.id, linkId)
}

function handleLinkMoveDown(linkId) {
  emit('move-link-down', props.category.id, linkId)
}
</script>

<style scoped>
.category-section {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-base);
  border: 1px solid var(--color-border-light);
  position: relative;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-base);
  border-bottom: 2px solid var(--color-border-light);
}

.category-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.drag-handle {
  cursor: grab;
  color: var(--color-text-tertiary);
  font-size: var(--font-size-lg);
  padding: var(--spacing-xs);
  border-radius: var(--radius-base);
  transition: var(--transition-base);
  user-select: none;
}

.drag-handle:hover {
  color: var(--color-primary);
  background: var(--color-gray-100);
}

.drag-handle:active {
  cursor: grabbing;
}

.category-header h2 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.category-count {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  font-weight: var(--font-weight-normal);
}

.category-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.action-btn {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: none;
  border-radius: var(--radius-base);
  background: var(--color-gray-100);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: var(--transition-base);
  font-size: var(--font-size-sm);
}

.action-btn:hover {
  background: var(--color-gray-200);
  transform: translateY(-1px);
}

.action-btn.delete:hover {
  background: var(--color-error);
  color: white;
}

/* 链接网格 */
.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-lg);
}

/* 空分类提示 */
.empty-category {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-tertiary);
  border: 2px dashed var(--color-border-medium);
  border-radius: var(--radius-lg);
  margin-top: var(--spacing-base);
  transition: var(--transition-base);
}

.empty-category:hover {
  border-color: var(--color-primary);
  background: rgba(102, 126, 234, 0.02);
}

.empty-category-icon {
  font-size: 2rem;
  margin-bottom: var(--spacing-sm);
  opacity: 0.6;
}

.empty-category p {
  margin-bottom: var(--spacing-base);
  font-size: var(--font-size-sm);
}

.btn-add-link {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-base);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: var(--transition-base);
}

.btn-add-link:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

/* 加载状态指示器 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-xl);
  z-index: 100;
  gap: var(--spacing-sm);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-gray-200);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-overlay span {
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
}

.icon {
  font-size: var(--font-size-sm);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .category-header {
    flex-direction: column;
    gap: var(--spacing-base);
    align-items: flex-start;
  }

  .links-grid {
    grid-template-columns: 1fr;
  }

  .category-section {
    padding: var(--spacing-base);
  }
}
</style>
