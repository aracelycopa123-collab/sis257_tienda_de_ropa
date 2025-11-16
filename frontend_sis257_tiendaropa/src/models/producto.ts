export interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  stock: number
  talla: string
  color: string
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
  talla: string
  color: string
  genero: string
  imagenes: string
  idCategoria: number
}
