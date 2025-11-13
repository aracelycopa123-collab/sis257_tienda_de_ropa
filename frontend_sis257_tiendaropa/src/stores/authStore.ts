import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface User {
  id: number
  nombre: string
  email: string
  rol: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string>(localStorage.getItem('token') || '')
  const isAuthenticated = ref(!!token.value)

  const login = (userData: User, authToken: string) => {
    user.value = userData
    token.value = authToken
    isAuthenticated.value = true
    localStorage.setItem('token', authToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    user.value = null
    token.value = ''
    isAuthenticated.value = false
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const loadUserFromStorage = () => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    if (storedUser && storedToken) {
      user.value = JSON.parse(storedUser)
      token.value = storedToken
      isAuthenticated.value = true
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    loadUserFromStorage
  }
})
