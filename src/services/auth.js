import api from './api'

export const authService = {
    login(credentials) {
        return api.post('/auth/login', credentials)
    },

    register(userData) {
        return api.post('/auth/register', userData)
    },

    getCurrentUser() {
        return api.get('/auth/me')
    },

    logout() {
        return api.post('/auth/logout')
    }
}
