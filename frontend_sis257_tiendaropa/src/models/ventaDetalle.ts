export interface VentaDetalle {
  id: number
  cantidad: number
  precioUnitario: number
  subtotal: number
  idVenta: number
  idProducto: number
  producto?: {
    id: number
    nombre: string
    imagenes: string
  }
}

export interface VentaDetalleDTO {
  cantidad: number
  precioUnitario: number
  subtotal: number
  idVenta: number
  idProducto: number
}
