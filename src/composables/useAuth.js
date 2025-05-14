import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { authService } from '../services/auth'

export function useAuth() {
    const authStore = useAuthStore()
    const router = useRouter()

    const loginForm = ref({
        email: '',
        password: ''
    })

    const registerForm = ref({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const loading = ref(false)
    const error = ref(null)

    const isLoggedIn = computed(() => authStore.isAuthenticated)
    const currentUser = computed(() => authStore.user)

    async function login() {
        try {
            loading.value = true
            error.value = null
            const response = await authService.login(loginForm.value)
            authStore.setUser(response)
            router.push('/')
        } catch (err) {
            error.value = err.response?.data?.message || '登录失败'
        } finally {
            loading.value = false
        }
    }

    async function register() {
        try {
            loading.value = true
            error.value = null

            if (registerForm.value.password !== registerForm.value.confirmPassword) {
                error.value = '两次输入的密码不一致'
                return
            }

            const response = await authService.register(registerForm.value)
            authStore.setUser(response)
            router.push('/')
        } catch (err) {
            error.value = err.response?.data?.message || '注册失败'
        } finally {
            loading.value = false
        }
    }

    async function logout() {
        try {
            await authService.logout()
        } finally {
            authStore.logout()
            await router.push('/login')
        }
    }

    return {
        loginForm,
        registerForm,
        loading,
        error,
        isLoggedIn,
        currentUser,
        login,
        register,
        logout
    }
}
