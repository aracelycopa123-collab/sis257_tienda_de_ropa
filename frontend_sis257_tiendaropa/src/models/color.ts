export interface Color {
  id: number
  nombre: string
  codigoHex?: string
  fechaCreacion?: Date
  fechaModificacion?: Date
}

export interface ColorDTO {
  nombre: string
  codigoHex?: string
}
