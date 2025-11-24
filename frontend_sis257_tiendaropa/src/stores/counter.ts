import { defineStore } from 'pinia'
import { getTokenFromLocalStorage } from '@/helpers'
import http from '@/plugins/axios'
import router from '@/router'

const useAuthStore = defineStore('auth', {
  state: () => ({
    user: localStorage.getItem('user') || '',
    token: getTokenFromLocalStorage(),
    role: localStorage.getItem('role') || null,
    returnUrl: '',
  }),
  getters: {},
  actions: {
    async login(usuario: string, clave: string) {
      try {
        const response = await http.post('auth/login', { nombreUsuario: usuario, clave })
        this.token = response.data.access_token
        if (this.token) {
          localStorage.setItem('token', this.token)
        }
        this.user = response.data.nombreUsuario
        localStorage.setItem('user', this.user)
        this.role = response.data.rol || null
        if (this.role) localStorage.setItem('role', this.role)
        return true
      } catch (error) {
        console.error(error)
        return false
      }
    },
    async register(payload: any) {
      try {
        const response = await http.post('auth/register', payload)
        // response contains usuario, cliente and access_token
        this.token = response.data.access_token
        if (this.token) localStorage.setItem('token', this.token)
        this.user = response.data.usuario?.nombreUsuario || ''
        if (this.user) localStorage.setItem('user', this.user)
        this.role = response.data.usuario?.rol || null
        if (this.role) localStorage.setItem('role', this.role)
        return true
      } catch (error) {
        console.error(error)
        return false
      }
    },
    logout() {
      localStorage.clear()
      this.$reset()
      router.push('/login')
    },
  },
})

export { useAuthStore }

