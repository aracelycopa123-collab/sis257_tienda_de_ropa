import { defineStore } from 'pinia'
import { getTokenFromLocalStorage } from '@/helpers'
import http from '@/plugins/axios'
import router from '@/router'

interface ClienteData {
  id?: number
  nombre?: string
  apellido?: string
  telefono?: string
  direccion?: string
  cedula?: string
  genero?: string
  fechaNacimiento?: string
}

const useAuthStore = defineStore('auth', {
  state: () => ({
    user: localStorage.getItem('user') || '',
    token: getTokenFromLocalStorage(),
    role: localStorage.getItem('role') || null,
    returnUrl: '',
    cliente: JSON.parse(localStorage.getItem('cliente') || 'null') as ClienteData | null,
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
        this.role = (response.data.rol || null)
        if (this.role) {
          this.role = String(this.role).toLowerCase()
          localStorage.setItem('role', this.role)
        }
        
        // Cargar datos del cliente si es rol cliente
        if (this.role === 'cliente') {
          await this.cargarDatosCliente()
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
        this.role = (response.data.usuario?.rol || null)
        if (this.role) {
          this.role = String(this.role).toLowerCase()
          localStorage.setItem('role', this.role)
        }
        
        // Guardar datos del cliente
        if (response.data.cliente) {
          this.cliente = response.data.cliente
          localStorage.setItem('cliente', JSON.stringify(this.cliente))
        }
        
        return true
      } catch (error) {
        console.error(error)
        return false
      }
    },
    async cargarDatosCliente() {
      try {
        // Buscar cliente por usuario actual
        const response = await http.get('clientes/me')
        if (response.data) {
          this.cliente = response.data
          localStorage.setItem('cliente', JSON.stringify(this.cliente))
        }
      } catch (error) {
        console.error('No se pudieron cargar datos del cliente:', error)
        // Si no existe cliente, limpiar el store
        this.cliente = null
        localStorage.removeItem('cliente')
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

