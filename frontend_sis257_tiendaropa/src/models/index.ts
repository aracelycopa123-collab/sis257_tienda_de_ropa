// Modelos/Interfaces de TypeScript

export interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  stock: number
  imagen?: string
  categoria?: Categoria
}

export interface Categoria {
  id: number
  nombre: string
  descripcion?: string
}

export interface Venta {
  id: number
  fecha: Date
  total: number
  estado: string
  cliente?: Cliente
  detalles?: VentaDetalle[]
}

export interface VentaDetalle {
  id: number
  ventaId: number
  productoId: number
  cantidad: number
  precioUnitario: number
  subtotal: number
}

export interface Cliente {
  id: number
  nombre: string
  email: string
  telefono: string
  direccion?: string
}

export interface Usuario {
  id: number
  nombre: string
  email: string
  rol: string
}
