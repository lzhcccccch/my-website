/**
 * 表单验证工具函数
 * 提供常用的验证规则和验证器
 */

/**
 * 验证规则类型定义
 * @typedef {Object} ValidationRule
 * @property {string} type - 验证类型
 * @property {*} value - 验证值
 * @property {string} message - 错误消息
 * @property {Function} validator - 自定义验证函数
 */

/**
 * 内置验证规则
 */
export const validationRules = {
  // 必填验证
  required: (message = '此字段为必填项') => ({
    type: 'required',
    message,
    validator: (value) => {
      if (Array.isArray(value)) return value.length > 0
      if (typeof value === 'string') return value.trim().length > 0
      return value !== null && value !== undefined && value !== ''
    }
  }),

  // 最小长度验证
  minLength: (min, message) => ({
    type: 'minLength',
    value: min,
    message: message || `最少需要 ${min} 个字符`,
    validator: (value) => {
      if (!value) return true // 空值由 required 规则处理
      return String(value).length >= min
    }
  }),

  // 最大长度验证
  maxLength: (max, message) => ({
    type: 'maxLength',
    value: max,
    message: message || `最多允许 ${max} 个字符`,
    validator: (value) => {
      if (!value) return true
      return String(value).length <= max
    }
  }),

  // 邮箱验证
  email: (message = '请输入有效的邮箱地址') => ({
    type: 'email',
    message,
    validator: (value) => {
      if (!value) return true
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value)
    }
  }),

  // URL验证
  url: (message = '请输入有效的URL地址') => ({
    type: 'url',
    message,
    validator: (value) => {
      if (!value) return true
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    }
  }),

  // 数字验证
  number: (message = '请输入有效的数字') => ({
    type: 'number',
    message,
    validator: (value) => {
      if (!value) return true
      return !isNaN(Number(value))
    }
  }),

  // 最小值验证
  min: (minValue, message) => ({
    type: 'min',
    value: minValue,
    message: message || `值不能小于 ${minValue}`,
    validator: (value) => {
      if (!value) return true
      return Number(value) >= minValue
    }
  }),

  // 最大值验证
  max: (maxValue, message) => ({
    type: 'max',
    value: maxValue,
    message: message || `值不能大于 ${maxValue}`,
    validator: (value) => {
      if (!value) return true
      return Number(value) <= maxValue
    }
  }),

  // 正则表达式验证
  pattern: (regex, message = '格式不正确') => ({
    type: 'pattern',
    value: regex,
    message,
    validator: (value) => {
      if (!value) return true
      return regex.test(value)
    }
  }),

  // 自定义验证
  custom: (validator, message = '验证失败') => ({
    type: 'custom',
    message,
    validator
  }),

  // 确认密码验证
  confirm: (targetField, message = '两次输入不一致') => ({
    type: 'confirm',
    value: targetField,
    message,
    validator: (value, formData) => {
      if (!value) return true
      return value === formData[targetField]
    }
  })
}

/**
 * 验证单个字段
 * @param {*} value - 字段值
 * @param {Array} rules - 验证规则数组
 * @param {Object} formData - 完整表单数据（用于确认密码等验证）
 * @returns {Object} 验证结果 { valid: boolean, message: string }
 */
export function validateField(value, rules = [], formData = {}) {
  for (const rule of rules) {
    if (!rule.validator(value, formData)) {
      return {
        valid: false,
        message: rule.message
      }
    }
  }
  
  return {
    valid: true,
    message: ''
  }
}

/**
 * 验证整个表单
 * @param {Object} formData - 表单数据
 * @param {Object} schema - 验证模式
 * @returns {Object} 验证结果 { valid: boolean, errors: Object }
 */
export function validateForm(formData, schema) {
  const errors = {}
  let valid = true

  for (const [field, rules] of Object.entries(schema)) {
    const result = validateField(formData[field], rules, formData)
    if (!result.valid) {
      errors[field] = result.message
      valid = false
    }
  }

  return {
    valid,
    errors
  }
}

/**
 * 异步验证字段（用于服务器端验证）
 * @param {*} value - 字段值
 * @param {Function} asyncValidator - 异步验证函数
 * @param {number} debounceTime - 防抖时间（毫秒）
 * @returns {Promise} 验证结果
 */
export function validateFieldAsync(value, asyncValidator, debounceTime = 300) {
  return new Promise((resolve) => {
    const timer = setTimeout(async () => {
      try {
        const result = await asyncValidator(value)
        resolve(result)
      } catch (error) {
        resolve({
          valid: false,
          message: error.message || '验证失败'
        })
      }
    }, debounceTime)

    // 返回取消函数
    return () => clearTimeout(timer)
  })
}

/**
 * 常用验证模式
 */
export const commonSchemas = {
  // 用户注册
  userRegister: {
    username: [
      validationRules.required('用户名不能为空'),
      validationRules.minLength(3, '用户名至少3个字符'),
      validationRules.maxLength(20, '用户名最多20个字符'),
      validationRules.pattern(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线')
    ],
    email: [
      validationRules.required('邮箱不能为空'),
      validationRules.email()
    ],
    password: [
      validationRules.required('密码不能为空'),
      validationRules.minLength(6, '密码至少6个字符'),
      validationRules.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密码必须包含大小写字母和数字')
    ],
    confirmPassword: [
      validationRules.required('请确认密码'),
      validationRules.confirm('password', '两次密码输入不一致')
    ]
  },

  // 用户登录
  userLogin: {
    username: [
      validationRules.required('用户名不能为空')
    ],
    password: [
      validationRules.required('密码不能为空')
    ]
  },

  // 导航链接
  navigationLink: {
    title: [
      validationRules.required('网站名称不能为空'),
      validationRules.minLength(2, '网站名称至少2个字符'),
      validationRules.maxLength(50, '网站名称最多50个字符')
    ],
    url: [
      validationRules.required('网站地址不能为空'),
      validationRules.url('请输入有效的网站地址')
    ],
    description: [
      validationRules.maxLength(200, '描述最多200个字符')
    ],
    categoryId: [
      validationRules.required('请选择分类')
    ]
  },

  // 心情想法
  thought: {
    title: [
      validationRules.required('标题不能为空'),
      validationRules.minLength(2, '标题至少2个字符'),
      validationRules.maxLength(50, '标题最多50个字符')
    ],
    content: [
      validationRules.required('内容不能为空'),
      validationRules.minLength(5, '内容至少5个字符'),
      validationRules.maxLength(1000, '内容最多1000个字符')
    ]
  },

  // 单词卡片
  wordCard: {
    word: [
      validationRules.required('单词不能为空'),
      validationRules.minLength(1, '单词至少1个字符'),
      validationRules.maxLength(50, '单词最多50个字符')
    ],
    meaning: [
      validationRules.required('释义不能为空'),
      validationRules.maxLength(200, '释义最多200个字符')
    ],
    pronunciation: [
      validationRules.maxLength(100, '音标最多100个字符')
    ],
    example: [
      validationRules.maxLength(300, '例句最多300个字符')
    ]
  }
}

/**
 * 输入清理和安全化
 */
export const sanitize = {
  // 清理HTML标签
  html: (input) => {
    if (typeof input !== 'string') return input
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim()
  },

  // 清理SQL注入
  sql: (input) => {
    if (typeof input !== 'string') return input
    return input
      .replace(/['";\\]/g, '')
      .replace(/\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b/gi, '')
      .trim()
  },

  // 清理XSS
  xss: (input) => {
    if (typeof input !== 'string') return input
    return input
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .trim()
  },

  // 通用清理
  general: (input) => {
    if (typeof input !== 'string') return input
    return sanitize.xss(sanitize.html(input))
  }
}

/**
 * 验证工具类
 */
export class Validator {
  constructor(schema = {}) {
    this.schema = schema
    this.errors = {}
  }

  // 设置验证模式
  setSchema(schema) {
    this.schema = schema
    return this
  }

  // 验证表单
  validate(formData) {
    const result = validateForm(formData, this.schema)
    this.errors = result.errors
    return result.valid
  }

  // 验证单个字段
  validateField(field, value, formData = {}) {
    const rules = this.schema[field] || []
    const result = validateField(value, rules, formData)
    
    if (result.valid) {
      delete this.errors[field]
    } else {
      this.errors[field] = result.message
    }
    
    return result.valid
  }

  // 获取错误信息
  getErrors() {
    return { ...this.errors }
  }

  // 获取字段错误
  getFieldError(field) {
    return this.errors[field] || ''
  }

  // 清除错误
  clearErrors() {
    this.errors = {}
    return this
  }

  // 清除字段错误
  clearFieldError(field) {
    delete this.errors[field]
    return this
  }

  // 是否有错误
  hasErrors() {
    return Object.keys(this.errors).length > 0
  }
}
