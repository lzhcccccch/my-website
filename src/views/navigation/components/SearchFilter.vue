<template>
  <div class="search-section">
    <div class="search-container">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input
          type="text"
          :value="searchQuery"
          @input="handleSearchInput"
          placeholder="搜索网站名称或描述..."
          class="search-input"
        />
      </div>
      <div class="filter-tabs">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="handleCategorySelect(category.id)"
          :class="['filter-tab', { active: selectedCategory === category.id }]"
        >
          {{ category.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  },
  selectedCategory: {
    type: [String, Number],
    default: 'all'
  },
  categories: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:searchQuery', 'update:selectedCategory'])

function handleSearchInput(event) {
  emit('update:searchQuery', event.target.value)
}

function handleCategorySelect(categoryId) {
  emit('update:selectedCategory', categoryId)
}
</script>

<style scoped>
/* 搜索区域 */
.search-section {
  background: var(--color-bg-primary);
  padding: var(--spacing-xl) var(--spacing-base);
  border-bottom: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
}

.search-container {
  max-width: 1200px;
  margin: 0 auto;
}

.search-box {
  position: relative;
  max-width: 500px;
  margin: 0 auto var(--spacing-lg);
}

.search-icon {
  position: absolute;
  left: var(--spacing-base);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
  font-size: var(--font-size-lg);
}

.search-input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-base) var(--spacing-sm) 3rem;
  border: 2px solid var(--color-border-medium);
  border-radius: var(--radius-xl);
  font-size: var(--font-size-base);
  background: var(--color-bg-primary);
  transition: var(--transition-base);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* 筛选标签 */
.filter-tabs {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
  flex-wrap: wrap;
}

.filter-tab {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: 2px solid var(--color-border-medium);
  border-radius: var(--radius-xl);
  background: var(--color-bg-primary);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-base);
}

.filter-tab:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.filter-tab.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-section {
    padding: var(--spacing-base);
  }

  .filter-tabs {
    flex-direction: column;
    align-items: center;
  }

  .filter-tab {
    width: 200px;
    text-align: center;
  }
}
</style>
