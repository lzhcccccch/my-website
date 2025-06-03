import { ref, reactive } from 'vue'

/**
 * 通知管理 Composable
 * 提供全局通知功能，支持多种类型和配置
 */

// 全局通知状态
const notifications = ref([])
let notificationId = 0

// 默认配置
const defaultConfig = {
  duration: 3000,
  position: 'top-right',
  closable: true,
  showIcon: true,
  showProgress: false
}

/**
 * 通知管理 Hook
 * @returns {Object} 通知相关方法和状态
 */
export function useNotification() {
  /**
   * 显示通知
   * @param {Object} options - 通知配置
   * @returns {Function} 关闭通知的函数
   */
  function show(options) {
    const notification = {
      id: ++notificationId,
      visible: true,
      ...defaultConfig,
      ...options,
      createdAt: Date.now()
    }

    notifications.value.push(notification)

    // 自动关闭
    if (notification.duration > 0) {
      setTimeout(() => {
        close(notification.id)
      }, notification.duration)
    }

    // 返回关闭函数
    return () => close(notification.id)
  }

  /**
   * 显示成功通知
   * @param {string|Object} message - 消息内容或配置对象
   * @param {Object} options - 额外配置
   * @returns {Function} 关闭通知的函数
   */
  function success(message, options = {}) {
    const config = typeof message === 'string' 
      ? { message, ...options }
      : { ...message, ...options }
    
    return show({
      type: 'success',
      ...config
    })
  }

  /**
   * 显示错误通知
   * @param {string|Object} message - 消息内容或配置对象
   * @param {Object} options - 额外配置
   * @returns {Function} 关闭通知的函数
   */
  function error(message, options = {}) {
    const config = typeof message === 'string' 
      ? { message, ...options }
      : { ...message, ...options }
    
    return show({
      type: 'error',
      duration: 5000, // 错误通知显示更长时间
      ...config
    })
  }

  /**
   * 显示警告通知
   * @param {string|Object} message - 消息内容或配置对象
   * @param {Object} options - 额外配置
   * @returns {Function} 关闭通知的函数
   */
  function warning(message, options = {}) {
    const config = typeof message === 'string' 
      ? { message, ...options }
      : { ...message, ...options }
    
    return show({
      type: 'warning',
      duration: 4000,
      ...config
    })
  }

  /**
   * 显示信息通知
   * @param {string|Object} message - 消息内容或配置对象
   * @param {Object} options - 额外配置
   * @returns {Function} 关闭通知的函数
   */
  function info(message, options = {}) {
    const config = typeof message === 'string' 
      ? { message, ...options }
      : { ...message, ...options }
    
    return show({
      type: 'info',
      ...config
    })
  }

  /**
   * 关闭指定通知
   * @param {number} id - 通知ID
   */
  function close(id) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value[index].visible = false
      // 延迟移除，等待动画完成
      setTimeout(() => {
        const currentIndex = notifications.value.findIndex(n => n.id === id)
        if (currentIndex > -1) {
          notifications.value.splice(currentIndex, 1)
        }
      }, 300)
    }
  }

  /**
   * 关闭所有通知
   */
  function closeAll() {
    notifications.value.forEach(notification => {
      notification.visible = false
    })
    // 延迟清空数组
    setTimeout(() => {
      notifications.value.length = 0
    }, 300)
  }

  /**
   * 清除已关闭的通知
   */
  function clear() {
    notifications.value = notifications.value.filter(n => n.visible)
  }

  /**
   * 更新默认配置
   * @param {Object} config - 新的默认配置
   */
  function updateDefaultConfig(config) {
    Object.assign(defaultConfig, config)
  }

  /**
   * 获取指定位置的通知
   * @param {string} position - 位置
   * @returns {Array} 通知列表
   */
  function getNotificationsByPosition(position) {
    return notifications.value.filter(n => n.position === position && n.visible)
  }

  /**
   * 显示加载通知
   * @param {string} message - 加载消息
   * @param {Object} options - 配置选项
   * @returns {Object} 包含更新和关闭方法的对象
   */
  function loading(message, options = {}) {
    const notification = show({
      type: 'info',
      message,
      duration: 0, // 不自动关闭
      closable: false,
      showProgress: true,
      ...options
    })

    return {
      // 更新加载消息
      update: (newMessage) => {
        const notif = notifications.value.find(n => n.id === notification.id)
        if (notif) {
          notif.message = newMessage
        }
      },
      // 关闭加载通知
      close: notification,
      // 转换为成功通知
      success: (successMessage) => {
        notification()
        return success(successMessage)
      },
      // 转换为错误通知
      error: (errorMessage) => {
        notification()
        return error(errorMessage)
      }
    }
  }

  /**
   * 显示确认通知
   * @param {Object} options - 配置选项
   * @returns {Promise} 用户选择的 Promise
   */
  function confirm(options = {}) {
    return new Promise((resolve) => {
      const notification = show({
        type: 'warning',
        duration: 0,
        closable: false,
        ...options,
        // 自定义操作按钮
        actions: [
          {
            text: '取消',
            type: 'secondary',
            onClick: () => {
              close(notification.id)
              resolve(false)
            }
          },
          {
            text: '确认',
            type: 'primary',
            onClick: () => {
              close(notification.id)
              resolve(true)
            }
          }
        ]
      })
    })
  }

  return {
    // 状态
    notifications,
    
    // 方法
    show,
    success,
    error,
    warning,
    info,
    loading,
    confirm,
    close,
    closeAll,
    clear,
    updateDefaultConfig,
    getNotificationsByPosition
  }
}

// 全局实例（单例模式）
let globalNotification = null

/**
 * 获取全局通知实例
 * @returns {Object} 全局通知实例
 */
export function useGlobalNotification() {
  if (!globalNotification) {
    globalNotification = useNotification()
  }
  return globalNotification
}

// 便捷的全局方法
export const notification = {
  success: (message, options) => useGlobalNotification().success(message, options),
  error: (message, options) => useGlobalNotification().error(message, options),
  warning: (message, options) => useGlobalNotification().warning(message, options),
  info: (message, options) => useGlobalNotification().info(message, options),
  loading: (message, options) => useGlobalNotification().loading(message, options),
  confirm: (options) => useGlobalNotification().confirm(options),
  close: (id) => useGlobalNotification().close(id),
  closeAll: () => useGlobalNotification().closeAll()
}

// Vue 插件安装函数
export function install(app) {
  app.config.globalProperties.$notification = notification
  app.provide('notification', notification)
}

export default {
  install
}
