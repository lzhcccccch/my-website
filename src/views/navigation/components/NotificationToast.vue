<template>
  <div v-if="show" :class="['notification', `notification-${type}`]">
    <div class="notification-content">
      <span class="notification-icon">
        {{ type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️' }}
      </span>
      <span class="notification-message">{{ message }}</span>
      <button @click="handleClose" class="notification-close">×</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error', 'warning'].includes(value)
  },
  message: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close'])

function handleClose() {
  emit('close')
}
</script>

<style scoped>
/* 通知组件样式 */
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
  .notification {
    top: var(--spacing-base);
    right: var(--spacing-base);
    left: var(--spacing-base);
    max-width: none;
  }
}
</style>
