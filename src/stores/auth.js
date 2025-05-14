import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const isAuthenticated = ref(false)

    function setUser(userData) {
        user.value = userData
        isAuthenticated.value = true
        localStorage.setItem('token', userData.token)
    }

    function logout() {
        user.value = null
        isAuthenticated.value = false
        localStorage.removeItem('token')
    }

    return {
        user,
        isAuthenticated,
        setUser,
        logout
    }
})