/**
 * 通知系统 Composable
 * 负责通知消息的显示和管理
 */
import { ref } from 'vue'

export function useNotification() {
  // 通知状态
  const notification = ref({
    show: false,
    type: 'success',
    message: '',
    timeout: null
  })

  /**
   * 显示通知消息
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
        hideNotification()
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

  return {
    notification,
    showNotification,
    hideNotification
  }
}
