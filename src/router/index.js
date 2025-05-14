import { createRouter, createWebHistory } from 'vue-router'

// 懒加载路由
const Home = () => import('../views/Home.vue')
const Login = () => import('../views/auth/Login.vue')
const Register = () => import('../views/auth/Register.vue')
const Navigation = () => import('../views/navigation/Index.vue')
const Note = () => import('../views/note/Index.vue')
const Word = () => import('../views/word/Index.vue')

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/navigation',
        name: 'Navigation',
        component: Navigation,
        // meta: { requiresAuth: true }
    },
    {
        path: '/note',
        name: 'Note',
        component: Note,
        // meta: { requiresAuth: true }
    },
    {
        path: '/word',
        name: 'Word',
        component: Word,
        // meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 路由守卫，用于检查用户是否已登录
// router.beforeEach((to, from, next) => {
//     const isAuthenticated = localStorage.getItem('token') // 简单的身份验证检查
//
//     if (to.meta.requiresAuth && !isAuthenticated) {
//         next('/login')
//     } else {
//         next()
//     }
// })

export default router
