import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface ItemCarrito {
  id: number
  productoId: number
  nombre: string
  precio: number
  cantidad: number
  talla: string
  color: string
  imagen: string
  stock: number
}

export const useCarritoStore = defineStore('carrito', () => {
  // State
  const items = ref<ItemCarrito[]>([])
  const isOpen = ref(false)

  // Cargar carrito desde localStorage al iniciar
  const cargarCarrito = () => {
    const carritoGuardado = localStorage.getItem('carrito')
    if (carritoGuardado) {
      items.value = JSON.parse(carritoGuardado)
    }
  }

  // Guardar carrito en localStorage
  const guardarCarrito = () => {
    localStorage.setItem('carrito', JSON.stringify(items.value))
  }

  // Getters (computed)
  const cantidadTotal = computed(() => {
    return items.value.reduce((total, item) => total + item.cantidad, 0)
  })

  const precioTotal = computed(() => {
    return items.value.reduce((total, item) => total + (item.precio * item.cantidad), 0)
  })

  const estaVacio = computed(() => items.value.length === 0)

  // Actions
  const agregarItem = (producto: {
    id: number
    nombre: string
    precio: number
    talla: string
    color: string
    imagenes: string
    stock: number
  }) => {
    // Verificar si ya existe el mismo producto con la misma talla y color
    const itemExistente = items.value.find(
      item => item.productoId === producto.id && 
              item.talla === producto.talla && 
              item.color === producto.color
    )

    if (itemExistente) {
      // Si existe, incrementar cantidad (si hay stock)
      if (itemExistente.cantidad < itemExistente.stock) {
        itemExistente.cantidad++
      } else {
        return { success: false, message: 'No hay más stock disponible' }
      }
    } else {
      // Si no existe, agregar nuevo item
      const nuevoId = items.value.length > 0 
        ? Math.max(...items.value.map(i => i.id)) + 1 
        : 1

      items.value.push({
        id: nuevoId,
        productoId: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
        talla: producto.talla,
        color: producto.color,
        imagen: producto.imagenes,
        stock: producto.stock
      })
    }

    guardarCarrito()
    return { success: true, message: 'Producto agregado al carrito' }
  }

  const removerItem = (itemId: number) => {
    items.value = items.value.filter(item => item.id !== itemId)
    guardarCarrito()
  }

  const actualizarCantidad = (itemId: number, cantidad: number) => {
    const item = items.value.find(i => i.id === itemId)
    if (item) {
      // No permitir cantidad mayor al stock
      if (cantidad <= item.stock && cantidad > 0) {
        item.cantidad = cantidad
        guardarCarrito()
        return { success: true }
      } else if (cantidad > item.stock) {
        return { success: false, message: 'Cantidad supera el stock disponible' }
      }
    }
    return { success: false, message: 'Item no encontrado' }
  }

  const incrementarCantidad = (itemId: number) => {
    const item = items.value.find(i => i.id === itemId)
    if (item && item.cantidad < item.stock) {
      item.cantidad++
      guardarCarrito()
      return { success: true }
    }
    return { success: false, message: 'No hay más stock disponible' }
  }

  const decrementarCantidad = (itemId: number) => {
    const item = items.value.find(i => i.id === itemId)
    if (item && item.cantidad > 1) {
      item.cantidad--
      guardarCarrito()
      return { success: true }
    }
    return { success: false, message: 'La cantidad mínima es 1' }
  }

  const vaciarCarrito = () => {
    items.value = []
    guardarCarrito()
  }

  const toggleCarrito = () => {
    isOpen.value = !isOpen.value
  }

  const abrirCarrito = () => {
    isOpen.value = true
  }

  const cerrarCarrito = () => {
    isOpen.value = false
  }

  // Inicializar carrito
  cargarCarrito()

  return {
    // State
    items,
    isOpen,
    // Getters
    cantidadTotal,
    precioTotal,
    estaVacio,
    // Actions
    agregarItem,
    removerItem,
    actualizarCantidad,
    incrementarCantidad,
    decrementarCantidad,
    vaciarCarrito,
    toggleCarrito,
    abrirCarrito,
    cerrarCarrito
  }
})
