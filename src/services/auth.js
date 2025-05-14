import api from './api'

export function login(credentials) {
    return api.post('/auth/login', credentials)
}

export function register(userData) {
    return api.post('/auth/register', userData)
}

export function getCurrentUser() {
    return api.get('/auth/me')
}

export function logout() {
    return api.post('/auth/logout')
}
