import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/thoughts',
        name: 'Thoughts',
        component: () => import('../views/Thoughts.vue')
    },
    {
        path: '/word-cards',
        name: 'WordCards',
        component: () => import('../views/WordCards.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
