import { defineStore } from 'pinia'
import { getTokenFromLocalStorage } from '@/helpers'
import http from '@/plugins/axios'
import router from '@/router'

const useAuthStore = defineStore('auth', {
  state: () => ({
    user: localStorage.getItem('user') || '',
    token: getTokenFromLocalStorage(),
    role: (() => {
      const raw = localStorage.getItem('role')
      if (!raw) return null
      try {
        const parsed = JSON.parse(raw)
        if (typeof parsed === 'string') return parsed.toLowerCase()
      } catch {
        // not JSON, strip possible surrounding quotes and lowercase
        return raw.replace(/^"|"$/g, '').toLowerCase()
      }
      return String(raw).toLowerCase()
    })(),
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
        if (this.user) localStorage.setItem('user', this.user)
        // Normalize role to a predictable value (store as lowercase, map common variants to 'admin')
        const rawRole = response.data.rol ?? response.data.role ?? null
        if (rawRole) {
          const v = String(rawRole).replace(/^"|"$/g, '').toLowerCase()
          const isAdmin = /admin|administrador|super/i.test(v)
          this.role = isAdmin ? 'admin' : v
          localStorage.setItem('role', this.role)
          try {
            ;(window as any).__app_toasts?.push?.(`Rol normalizado: ${this.role}`, 'info')
          } catch {}
        } else {
          this.role = null
          localStorage.removeItem('role')
        }
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
        // Normalize role on register as well
        const rawRole = response.data.usuario?.rol ?? response.data.usuario?.role ?? null
        if (rawRole) {
          const v = String(rawRole).replace(/^"|"$/g, '').toLowerCase()
          const isAdmin = /admin|administrador|super/i.test(v)
          this.role = isAdmin ? 'admin' : v
          localStorage.setItem('role', this.role)
          try {
            ;(window as any).__app_toasts?.push?.(`Rol normalizado: ${this.role}`, 'info')
          } catch {}
        } else {
          this.role = null
          localStorage.removeItem('role')
        }
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

