<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    :type="type"
    :aria-label="ariaLabel"
    @click="handleClick"
  >
    <span v-if="loading" class="button-spinner"></span>
    <span v-if="icon && !loading" :class="['button-icon', iconPosition]">
      {{ icon }}
    </span>
    <span v-if="$slots.default" class="button-text">
      <slot></slot>
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

/**
 * 可复用的按钮组件
 * 支持多种样式、大小、状态和图标
 */

const props = defineProps({
  // 按钮变体
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'warning', 'error', 'ghost', 'link'].includes(value)
  },
  // 按钮大小
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 是否加载中
  loading: {
    type: Boolean,
    default: false
  },
  // 按钮类型
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  },
  // 图标
  icon: {
    type: String,
    default: ''
  },
  // 图标位置
  iconPosition: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'right'].includes(value)
  },
  // 是否为块级按钮
  block: {
    type: Boolean,
    default: false
  },
  // 是否为圆形按钮
  round: {
    type: Boolean,
    default: false
  },
  // ARIA 标签
  ariaLabel: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])

// 计算按钮样式类
const buttonClasses = computed(() => [
  'btn',
  `btn-${props.variant}`,
  `btn-${props.size}`,
  {
    'btn-block': props.block,
    'btn-round': props.round,
    'btn-loading': props.loading,
    'btn-icon-only': props.icon && !props.$slots?.default,
    'btn-icon-right': props.iconPosition === 'right'
  }
])

// 处理点击事件
function handleClick(event) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
/* 基础按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-base);
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  line-height: 1;
  cursor: pointer;
  transition: var(--transition-base);
  text-decoration: none;
  white-space: nowrap;
  user-select: none;
  position: relative;
  overflow: hidden;
}

.btn:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* 按钮变体 */
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

.btn-secondary:hover:not(:disabled) {
  background: var(--color-gray-100);
  color: var(--color-text-primary);
  border-color: var(--color-border-dark);
}

.btn-success {
  background: var(--color-success);
  color: white;
  border-color: var(--color-success);
}

.btn-success:hover:not(:disabled) {
  background: var(--color-success-dark);
  border-color: var(--color-success-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-warning {
  background: var(--color-warning);
  color: white;
  border-color: var(--color-warning);
}

.btn-warning:hover:not(:disabled) {
  background: var(--color-warning-dark);
  border-color: var(--color-warning-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-error {
  background: var(--color-error);
  color: white;
  border-color: var(--color-error);
}

.btn-error:hover:not(:disabled) {
  background: var(--color-error-dark);
  border-color: var(--color-error-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-ghost {
  background: transparent;
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn-ghost:hover:not(:disabled) {
  background: var(--color-primary);
  color: white;
}

.btn-link {
  background: transparent;
  color: var(--color-primary);
  border-color: transparent;
  text-decoration: underline;
}

.btn-link:hover:not(:disabled) {
  color: var(--color-primary-dark);
  text-decoration: none;
}

/* 按钮大小 */
.btn-small {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
  gap: var(--spacing-xs);
}

.btn-medium {
  padding: var(--spacing-sm) var(--spacing-base);
  font-size: var(--font-size-base);
  gap: var(--spacing-xs);
}

.btn-large {
  padding: var(--spacing-base) var(--spacing-lg);
  font-size: var(--font-size-lg);
  gap: var(--spacing-sm);
}

/* 块级按钮 */
.btn-block {
  width: 100%;
}

/* 圆形按钮 */
.btn-round {
  border-radius: var(--radius-full);
}

/* 仅图标按钮 */
.btn-icon-only {
  padding: var(--spacing-sm);
  aspect-ratio: 1;
}

.btn-icon-only.btn-small {
  padding: var(--spacing-xs);
}

.btn-icon-only.btn-large {
  padding: var(--spacing-base);
}

/* 图标位置 */
.btn-icon-right {
  flex-direction: row-reverse;
}

/* 加载状态 */
.btn-loading {
  pointer-events: none;
}

.button-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.btn-small .button-spinner {
  width: 14px;
  height: 14px;
}

.btn-large .button-spinner {
  width: 18px;
  height: 18px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 图标样式 */
.button-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.button-text {
  flex: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .btn {
    min-height: 44px; /* 触摸友好的最小高度 */
  }
  
  .btn-small {
    min-height: 36px;
  }
  
  .btn-large {
    min-height: 52px;
  }
}
</style>
