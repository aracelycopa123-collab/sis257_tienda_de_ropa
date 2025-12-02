import type { Color } from './color'

export interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  stock: number
  tallas: string[]
  talla?: string // compatibilidad
  colores: Color[]
  color?: string // compatibilidad
  genero: string
  imagenes: string
  idCategoria: number
  categoria?: {
    id: number
    nombre: string
  }
}

export interface ProductoDTO {
  nombre: string
  descripcion: string
  precio: number
  stock: number
  tallas: string[]
  colores: number[] // IDs de colores
  genero: string
  imagenes: string
  idCategoria: number
}
