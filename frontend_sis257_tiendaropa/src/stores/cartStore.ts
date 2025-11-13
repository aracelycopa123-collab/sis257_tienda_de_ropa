import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CartItem {
  id: number
  nombre: string
  precio: number
  cantidad: number
  imagen?: string
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const total = computed(() => {
    return items.value.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
  })

  const addItem = (item: CartItem) => {
    const existingItem = items.value.find(i => i.id === item.id)
    if (existingItem) {
      existingItem.cantidad += item.cantidad
    } else {
      items.value.push(item)
    }
  }

  const removeItem = (id: number) => {
    items.value = items.value.filter(item => item.id !== id)
  }

  const updateQuantity = (id: number, cantidad: number) => {
    const item = items.value.find(i => i.id === id)
    if (item) {
      item.cantidad = cantidad
    }
  }

  const clearCart = () => {
    items.value = []
  }

  return {
    items,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  }
})
