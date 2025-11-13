import axios, { AxiosInstance } from 'axios'

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_BASE_URL_ENDPOINT || 'http://localhost:3000/api/v1'
    })

    // Agregar token a cada solicitud
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })
  }

  // Productos
  getProductos() {
    return this.api.get('/productos')
  }

  getProductoById(id: number) {
    return this.api.get(`/productos/${id}`)
  }

  // Categorías
  getCategorias() {
    return this.api.get('/categorias')
  }

  // Ventas/Compras
  crearVenta(data: any) {
    return this.api.post('/ventas', data)
  }

  getVentas() {
    return this.api.get('/ventas')
  }

  // Auth
  login(email: string, password: string) {
    return this.api.post('/auth/login', { email, password })
  }

  registro(data: any) {
    return this.api.post('/auth/registro', data)
  }

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // Clientes
  getClientes() {
    return this.api.get('/clientes')
  }

  getClienteById(id: number) {
    return this.api.get(`/clientes/${id}`)
  }

  // Venta Detalles
  getVentaDetalles(ventaId: number) {
    return this.api.get(`/venta-detalles?ventaId=${ventaId}`)
  }
}

export default new ApiService()
