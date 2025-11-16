export interface Venta {
  id: number
  fecha: string
  precioTotal: number
  idCliente: number
  cliente?: {
    id: number
    nombre: string
    apellido?: string
  }
}

export interface VentaDTO {
  fecha: string
  precioTotal: number
  idCliente: number
}
