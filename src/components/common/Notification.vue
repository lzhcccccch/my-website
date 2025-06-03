<template>
  <Teleport to="body">
    <Transition
      name="notification"
      @enter="onEnter"
      @leave="onLeave"
    >
      <div
        v-if="visible"
        :class="notificationClasses"
        :style="notificationStyle"
        role="alert"
        :aria-live="type === 'error' ? 'assertive' : 'polite'"
      >
        <div class="notification-content">
          <div class="notification-icon" v-if="showIcon">
            <slot name="icon">
              {{ getIcon() }}
            </slot>
          </div>
          
          <div class="notification-body">
            <div v-if="title" class="notification-title">
              {{ title }}
            </div>
            <div class="notification-message">
              <slot>{{ message }}</slot>
            </div>
          </div>
          
          <button
            v-if="closable"
            @click="close"
            class="notification-close"
            :aria-label="closeAriaLabel"
          >
            <slot name="close-icon">×</slot>
          </button>
        </div>
        
        <div
          v-if="showProgress"
          class="notification-progress"
          :style="{ width: progressWidth + '%' }"
        ></div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

/**
 * 可复用的通知组件
 * 支持多种类型、位置、自动关闭等功能
 */

const props = defineProps({
  // 是否显示
  visible: {
    type: Boolean,
    default: false
  },
  // 通知类型
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  // 标题
  title: {
    type: String,
    default: ''
  },
  // 消息内容
  message: {
    type: String,
    default: ''
  },
  // 显示时长（毫秒），0 表示不自动关闭
  duration: {
    type: Number,
    default: 3000
  },
  // 是否可关闭
  closable: {
    type: Boolean,
    default: true
  },
  // 是否显示图标
  showIcon: {
    type: Boolean,
    default: true
  },
  // 是否显示进度条
  showProgress: {
    type: Boolean,
    default: false
  },
  // 通知位置
  position: {
    type: String,
    default: 'top-right',
    validator: (value) => [
      'top-left', 'top-center', 'top-right',
      'bottom-left', 'bottom-center', 'bottom-right'
    ].includes(value)
  },
  // 距离边缘的偏移量
  offset: {
    type: Number,
    default: 20
  },
  // 层级
  zIndex: {
    type: Number,
    default: 9999
  },
  // 关闭按钮的 ARIA 标签
  closeAriaLabel: {
    type: String,
    default: '关闭通知'
  }
})

const emit = defineEmits(['close', 'click'])

// 响应式数据
const progressWidth = ref(100)
let timer = null
let progressTimer = null

// 计算样式类
const notificationClasses = computed(() => [
  'notification',
  `notification-${props.type}`,
  `notification-${props.position}`
])

// 计算样式
const notificationStyle = computed(() => {
  const [vertical, horizontal] = props.position.split('-')
  const style = {
    zIndex: props.zIndex
  }

  // 设置位置
  if (vertical === 'top') {
    style.top = `${props.offset}px`
  } else {
    style.bottom = `${props.offset}px`
  }

  if (horizontal === 'left') {
    style.left = `${props.offset}px`
  } else if (horizontal === 'right') {
    style.right = `${props.offset}px`
  } else {
    style.left = '50%'
    style.transform = 'translateX(-50%)'
  }

  return style
})

// 获取图标
function getIcon() {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }
  return icons[props.type] || icons.info
}

// 关闭通知
function close() {
  emit('close')
}

// 开始自动关闭计时器
function startTimer() {
  if (props.duration > 0) {
    timer = setTimeout(() => {
      close()
    }, props.duration)

    // 进度条动画
    if (props.showProgress) {
      progressWidth.value = 100
      progressTimer = setInterval(() => {
        progressWidth.value -= 100 / (props.duration / 100)
        if (progressWidth.value <= 0) {
          clearInterval(progressTimer)
        }
      }, 100)
    }
  }
}

// 清除计时器
function clearTimer() {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  if (progressTimer) {
    clearInterval(progressTimer)
    progressTimer = null
  }
}

// 进入动画
function onEnter() {
  startTimer()
}

// 离开动画
function onLeave() {
  clearTimer()
}

// 监听 visible 变化
watch(() => props.visible, (newVal) => {
  if (newVal) {
    progressWidth.value = 100
  } else {
    clearTimer()
  }
})

// 组件卸载时清理
onUnmounted(() => {
  clearTimer()
})
</script>

<style scoped>
.notification {
  position: fixed;
  max-width: 400px;
  min-width: 300px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 通知类型样式 */
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

.notification-info {
  background: var(--color-info);
  border-left: 4px solid var(--color-info-dark);
}

/* 通知内容 */
.notification-content {
  display: flex;
  align-items: flex-start;
  padding: var(--spacing-base) var(--spacing-lg);
  color: white;
  gap: var(--spacing-sm);
  position: relative;
}

.notification-icon {
  font-size: var(--font-size-lg);
  flex-shrink: 0;
  margin-top: 2px;
}

.notification-body {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-xs);
  line-height: var(--line-height-tight);
}

.notification-message {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
  word-wrap: break-word;
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
  margin-top: -2px;
}

.notification-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.notification-close:focus {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}

/* 进度条 */
.notification-progress {
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  transition: width 0.1s linear;
  position: absolute;
  bottom: 0;
  left: 0;
}

/* 动画 */
.notification-enter-active {
  transition: all 0.3s ease-out;
}

.notification-leave-active {
  transition: all 0.3s ease-in;
}

/* 顶部位置动画 */
.notification-top-left.notification-enter-from,
.notification-top-center.notification-enter-from,
.notification-top-right.notification-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.notification-top-center.notification-enter-from {
  transform: translateX(-50%) translateY(-100%);
}

.notification-top-left.notification-leave-to,
.notification-top-center.notification-leave-to,
.notification-top-right.notification-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.notification-top-center.notification-leave-to {
  transform: translateX(-50%) translateY(-100%);
}

/* 底部位置动画 */
.notification-bottom-left.notification-enter-from,
.notification-bottom-center.notification-enter-from,
.notification-bottom-right.notification-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.notification-bottom-center.notification-enter-from {
  transform: translateX(-50%) translateY(100%);
}

.notification-bottom-left.notification-leave-to,
.notification-bottom-center.notification-leave-to,
.notification-bottom-right.notification-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.notification-bottom-center.notification-leave-to {
  transform: translateX(-50%) translateY(100%);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .notification {
    left: var(--spacing-base) !important;
    right: var(--spacing-base) !important;
    max-width: none;
    min-width: auto;
    transform: none !important;
  }
  
  .notification-content {
    padding: var(--spacing-sm) var(--spacing-base);
  }
  
  .notification-message {
    font-size: var(--font-size-xs);
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .notification {
    border-color: rgba(255, 255, 255, 0.2);
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .notification-enter-active,
  .notification-leave-active {
    transition: opacity 0.2s ease;
  }
  
  .notification-enter-from,
  .notification-leave-to {
    transform: none !important;
    opacity: 0;
  }
  
  .notification-progress {
    transition: none;
  }
}
</style>
