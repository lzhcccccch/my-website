import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

/**
 * 路由配置模块
 * 定义应用程序的所有路由和导航守卫
 */

// 懒加载路由组件 - 提高应用启动性能
const Home = () => import('../views/Home.vue')
const Login = () => import('../views/auth/Login.vue')
const Register = () => import('../views/auth/Register.vue')

// 功能模块组件 - 迁移回views结构
const Navigation = () => import('../views/navigation/index.vue')
const MoodJournal = () => import('../views/mood-journal/index.vue')
const WordCards = () => import('../views/word-cards/index.vue')

// 路由配置
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            title: '首页',
            description: '个人网站首页'
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            title: '用户登录',
            description: '用户登录页面',
            requiresGuest: true // 已登录用户不能访问
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: {
            title: '用户注册',
            description: '用户注册页面',
            requiresGuest: true // 已登录用户不能访问
        }
    },
    {
        path: '/navigation',
        name: 'Navigation',
        component: Navigation,
        meta: {
            title: '个人导航站',
            description: '收集和整理网站链接',
            requiresAuth: true // 需要登录才能访问
        }
    },
    {
        path: '/mood-journal',
        name: 'MoodJournal',
        component: MoodJournal,
        meta: {
            title: '心情随想录',
            description: '记录每一天的心情和想法',
            requiresAuth: true // 需要登录才能访问
        }
    },
    {
        path: '/word-cards',
        name: 'WordCards',
        component: WordCards,
        meta: {
            title: '单词卡片',
            description: '创建和学习单词卡片',
            requiresAuth: true // 需要登录才能访问
        }
    },
    {
        path: '/word',
        redirect: '/word-cards' // 重定向旧路径到新路径
    },
    {
        // 404 页面 - 处理未匹配的路由
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../views/NotFound.vue'),
        meta: {
            title: '页面未找到',
            description: '请求的页面不存在'
        }
    }
]

// 创建路由实例
const router = createRouter({
    history: createWebHistory(),
    routes,
    // 路由切换时滚动到页面顶部
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    }
})

/**
 * 全局前置守卫
 * 在每次路由跳转前执行认证检查和权限验证
 */
router.beforeEach(async (to, from, next) => {
    // 获取认证状态
    const authStore = useAuthStore()

    // 设置页面标题
    if (to.meta.title) {
        document.title = `${to.meta.title} - 栈外听风`
    }

    // 检查是否需要认证
    if (to.meta.requiresAuth) {
        // 检查用户是否已登录
        if (!authStore.isAuthenticated) {
            console.log('用户未登录，重定向到登录页面')
            next({
                name: 'Login',
                query: { redirect: to.fullPath } // 保存原始目标路径
            })
            return
        }
    }

    // 检查是否为访客页面（已登录用户不应访问）
    if (to.meta.requiresGuest) {
        if (authStore.isAuthenticated) {
            console.log('用户已登录，重定向到首页')
            next({ name: 'Home' })
            return
        }
    }

    // 继续导航
    next()
})

/**
 * 全局后置钩子
 * 在每次路由跳转后执行清理工作
 */
router.afterEach((to, from) => {
    // 在开发环境下记录路由跳转
    if (process.env.NODE_ENV === 'development') {
        console.log(`🧭 路由跳转: ${from.name || from.path} → ${to.name || to.path}`)
    }
})

export default router
