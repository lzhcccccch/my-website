# Vue 3 核心知识点详解

本文档详细介绍了 Vue 3 的核心概念和最佳实践，包括响应式系统、组件生命周期、状态管理等内容，结合实际项目代码进行讲解。

## 目录

- [响应式系统](#响应式系统)
- [组件生命周期](#组件生命周期)
- [状态管理 - Pinia](#状态管理---pinia)
- [Vue 应用架构](#vue-应用架构)
- [性能优化](#性能优化)
- [最佳实践](#最佳实践)

## 响应式系统

### 响应式基础

Vue 3 的响应式系统是基于 ES6 的 Proxy 实现的，它允许 Vue 追踪依赖关系并在数据变化时自动更新 DOM。

#### 响应式 API

Vue 3 提供了两套响应式 API：

1. **组合式 API (Composition API)**：使用 `ref`、`reactive` 等函数创建响应式状态
2. **选项式 API (Options API)**：在组件选项中定义 `data`、`computed` 等

在我们的项目中，主要使用组合式 API：

```javascript
// 使用 ref 创建响应式引用
const user = ref(null)

// 使用 computed 创建计算属性
const isAuthenticated = computed(() => {
    return !!user.value && !!localStorage.getItem(STORAGE_KEYS.AUTH.TOKEN)
})
```

### ref vs reactive

- **ref**：可以包装任何类型的值（包括原始类型如字符串、数字）
    - 访问和修改值需要使用 `.value` 属性
    - 在模板中会自动解包，不需要 `.value`

- **reactive**：只能用于对象类型
    - 直接访问和修改属性，不需要 `.value`
    - 不能替换整个对象，会丢失响应性

```javascript
// ref 示例
const count = ref(0)
count.value++ // 修改需要 .value

// reactive 示例
const state = reactive({ count: 0 })
state.count++ // 直接修改属性
```

### 响应式陷阱

1. **解构丢失响应性**：从 `reactive` 对象解构会丢失响应性
   ```javascript
   const state = reactive({ count: 0 })
   const { count } = state // count 不再是响应式的
   ```

2. **替换 reactive 对象**：直接替换整个对象会丢失响应性
   ```javascript
   state = { count: 1 } // 错误：丢失响应性
   Object.assign(state, { count: 1 }) // 正确：保持响应性
   ```

3. **ref 解包限制**：ref 只在模板和 reactive 对象内自动解包
   ```javascript
   const obj = reactive({ count: ref(0) })
   obj.count // 访问不需要 .value
   ```

### 在项目中的应用

在 `auth.js` 中，我们使用 `ref` 创建响应式状态：

```javascript
const user = ref(null)
const isLoading = ref(false)
```

这使得当 `user` 或 `isLoading` 的值变化时，依赖它们的组件会自动更新。

## 组件生命周期

### 生命周期钩子

Vue 组件有一系列生命周期钩子，允许在特定阶段执行代码：

1. **创建阶段**
    - `setup`：组合式 API 的入口点，在所有其他钩子之前调用
    - `onBeforeMount`：在挂载开始之前调用
    - `onMounted`：在组件挂载完成后调用

2. **更新阶段**
    - `onBeforeUpdate`：在组件更新之前调用
    - `onUpdated`：在组件更新之后调用

3. **销毁阶段**
    - `onBeforeUnmount`：在组件卸载之前调用
    - `onUnmounted`：在组件卸载之后调用

4. **其他钩子**
    - `onErrorCaptured`：当捕获后代组件错误时调用
    - `onActivated`/`onDeactivated`：与 `<KeepAlive>` 一起使用

### 在项目中的应用

在 `App.vue` 中，我们使用 `onMounted` 钩子初始化应用状态：

```javascript
onMounted(async () => {
  try {
    authStore.setLoading(true)
    
    // 从本地存储恢复用户状态
    authStore.restoreUserFromStorage()
    
    // 验证令牌并获取最新用户信息
    // ...
  } finally {
    authStore.setLoading(false)
  }
})
```

这确保了在组件渲染到 DOM 后执行初始化逻辑，如恢复用户状态和验证认证令牌。

### 生命周期最佳实践

1. **在正确的钩子中执行操作**
    - 数据获取：`setup` 或 `onMounted`
    - DOM 操作：`onMounted`
    - 清理事件监听器：`onBeforeUnmount`

2. **避免阻塞渲染**
    - 使用异步操作（如 `async/await`）
    - 考虑使用 `nextTick` 延迟执行

3. **组件卸载时清理资源**
    - 取消网络请求
    - 移除事件监听器
    - 清除定时器

## 状态管理 - Pinia

### Pinia 基础

Pinia 是 Vue 的官方状态管理库，它提供了一种简单、类型安全的方式来管理应用状态。

#### Store 定义

Pinia 使用 `defineStore` 函数定义 store：

```javascript
export const useAuthStore = defineStore('auth', () => {
  // 状态（响应式数据）
  const user = ref(null)
  
  // 计算属性
  const isAuthenticated = computed(() => !!user.value)
  
  // 动作（修改状态的方法）
  function setUser(userData) {
    user.value = userData
  }
  
  return { user, isAuthenticated, setUser }
})
```

### Pinia vs Vuex

Pinia 相比 Vuex 有以下优势：

1. **更简单的 API**：没有 mutations，只有 state、getters 和 actions
2. **更好的 TypeScript 支持**：自动类型推断
3. **更好的开发体验**：更少的样板代码
4. **模块化设计**：不需要嵌套模块

### 在项目中的应用

我们的项目使用 Pinia 管理认证状态：

```javascript
// 定义 store
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isLoading = ref(false)
  
  const isAuthenticated = computed(() => {
    return !!user.value && !!localStorage.getItem(STORAGE_KEYS.AUTH.TOKEN)
  })
  
  function setUser(userData) {
    // ...设置用户数据
  }
  
  function logout() {
    // ...清除用户数据
  }
  
  return {
    user, isLoading, isAuthenticated,
    setUser, logout
  }
})

// 在组件中使用
const authStore = useAuthStore()
console.log(authStore.isAuthenticated)
authStore.setUser(userData)
```

### Pinia 持久化

Pinia 本身不提供持久化功能，但我们可以手动实现：

1. **存储数据到 localStorage**
   ```javascript
   function setUser(userData) {
     user.value = userData
     localStorage.setItem('user', JSON.stringify(userData))
   }
   ```

2. **恢复数据**
   ```javascript
   const storedUser = localStorage.getItem('user')
   if (storedUser) {
     user.value = JSON.parse(storedUser)
   }
   ```

3. **使用插件**：可以使用 `pinia-plugin-persistedstate` 等插件自动持久化 store

### Pinia 最佳实践

1. **按功能划分 store**：每个主要功能有自己的 store
2. **保持 store 简洁**：只存储真正需要共享的状态
3. **使用组合**：store 可以使用其他 store
4. **考虑持久化**：重要状态应该持久化到 localStorage

## Vue 应用架构

### 单页应用 (SPA)

我们的项目是一个单页应用，特点是：

1. **客户端路由**：使用 Vue Router 在客户端处理路由
2. **无页面刷新**：页面切换不刷新整个页面
3. **懒加载**：按需加载组件和资源

```javascript
// 路由定义
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('./views/LoginView.vue'),
    meta: { requiresGuest: true }
  }
]

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' })
  } else {
    next()
  }
})
```

### 组件设计

Vue 应用通常遵循以下组件设计原则：

1. **单一职责**：每个组件只做一件事
2. **Props 向下，Events 向上**：父组件通过 props 传递数据，子组件通过事件通知父组件
3. **组件通信**：
    - 父子组件：Props 和 Events
    - 兄弟组件：共同的父组件或状态管理
    - 任意组件：状态管理 (Pinia)

### 项目结构

我们的项目结构遵循功能优先的组织方式：

```
src/
  api/          # API 调用和配置
  assets/       # 静态资源
  components/   # 可复用组件
  router/       # 路由配置
  stores/       # Pinia stores
  views/        # 页面组件
  App.vue       # 根组件
  main.js       # 应用入口
```

## 性能优化

### 组件优化

1. **避免不必要的渲染**
    - 使用 `v-memo` 缓存大型列表
    - 使用 `v-once` 渲染静态内容
    - 使用 `computed` 缓存计算结果

2. **懒加载组件**
   ```javascript
   const AsyncComponent = defineAsyncComponent(() => 
     import('./components/HeavyComponent.vue')
   )
   ```

3. **保持 Props 稳定**
   ```javascript
   // 不好的做法
   <ListItem v-for="item in list" :active-id="activeId" />
   
   // 好的做法
   <ListItem v-for="item in list" :active="item.id === activeId" />
   ```

### 状态管理优化

1. **减少响应式开销**
    - 使用 `shallowRef` 和 `shallowReactive` 处理大型数据
    - 不要将不需要响应式的大型对象放入响应式状态

2. **按需加载 store**
   ```javascript
   // 只在需要的组件中导入 store
   const userStore = useUserStore()
   ```

## 最佳实践

### 认证状态管理

1. **集中管理认证状态**
    - 使用专门的 store 管理用户认证
    - 在一个地方处理登录、注销和令牌刷新

2. **持久化认证状态**
    - 将令牌和用户信息存储在 localStorage
    - 应用启动时恢复认证状态

3. **保护路由**
    - 使用路由守卫检查认证状态
    - 重定向未认证用户到登录页面

### 错误处理

1. **集中处理 API 错误**
    - 使用 axios 拦截器处理常见错误
    - 统一错误格式和处理逻辑

2. **优雅降级**
    - 提供用户友好的错误消息
    - 在出错时保持应用可用

### 代码组织

1. **使用组合式函数 (Composables)**
    - 将可复用逻辑提取到组合式函数
    - 遵循 `use` 前缀命名约定

2. **模块化设计**
    - 按功能划分代码
    - 保持单一职责原则

3. **一致的代码风格**
    - 使用 ESLint 和 Prettier
    - 遵循项目约定的命名规范

---

本文档涵盖了 Vue 3 的核心概念和最佳实践，结合项目实际代码进行讲解。通过理解这些概念，可以更好地开发和维护 Vue 应用。
