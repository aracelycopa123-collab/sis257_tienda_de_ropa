export interface Usuario {
  id: number
  nombreUsuario: string
  clave: string
  email: string
  rol: string
}

export interface UsuarioDTO {
  nombreUsuario: string
  clave: string
  email: string
  rol: string
}
