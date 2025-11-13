// Funciones auxiliares para el frontend

export const formatearPrecio = (precio: number): string => {
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB'
  }).format(precio)
}

export const formatearFecha = (fecha: Date): string => {
  return new Intl.DateTimeFormat('es-BO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(fecha))
}

export const validarEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validarTelefono = (telefono: string): boolean => {
  return /^\d{7,}$/.test(telefono.replace(/\D/g, ''))
}
