<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-lg-8">
        <h1 class="mb-4">
          <i class="fas fa-shopping-cart"></i> Mi Carrito
        </h1>

        <div v-if="cartStore.items.length === 0" class="alert alert-info text-center">
          <i class="fas fa-inbox"></i> Tu carrito está vacío
          <router-link to="/productos" class="alert-link ms-2">Continuar comprando</router-link>
        </div>

        <div v-else class="card shadow">
          <div class="table-responsive">
            <table class="table mb-0">
              <thead class="table-dark">
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in cartStore.items" :key="item.id">
                  <td class="align-middle">
                    <i class="fas fa-tshirt me-2"></i>
                    {{ item.nombre }}
                  </td>
                  <td class="align-middle">Bs. {{ item.precio }}</td>
                  <td class="align-middle">
                    <div class="input-group" style="width: 100px">
                      <button
                        @click="disminuirCantidad(item.id)"
                        class="btn btn-sm btn-outline-secondary"
                      >
                        -
                      </button>
                      <input
                        type="text"
                        class="form-control text-center"
                        :value="item.cantidad"
                        disabled
                      />
                      <button
                        @click="aumentarCantidad(item.id)"
                        class="btn btn-sm btn-outline-secondary"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td class="align-middle fw-bold">
                    Bs. {{ (item.precio * item.cantidad).toFixed(2) }}
                  </td>
                  <td class="align-middle">
                    <button
                      @click="eliminarDelCarrito(item.id)"
                      class="btn btn-sm btn-danger"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Resumen -->
      <div class="col-lg-4">
        <div class="card shadow sticky-top" style="top: 20px">
          <div class="card-body">
            <h5 class="card-title">
              <i class="fas fa-calculator"></i> Resumen del Pedido
            </h5>
            <hr />

            <div class="mb-3">
              <div class="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>Bs. {{ cartStore.total.toFixed(2) }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Envío:</span>
                <span>Bs. {{ shippingCost.toFixed(2) }}</span>
              </div>
              <div class="d-flex justify-content-between mb-3">
                <span>IVA (13%):</span>
                <span>Bs. {{ ((cartStore.total + shippingCost) * 0.13).toFixed(2) }}</span>
              </div>
              <hr />
              <div class="d-flex justify-content-between fw-bold" style="font-size: 1.2em">
                <span>Total:</span>
                <span class="text-danger">
                  Bs. {{ totalWithTax.toFixed(2) }}
                </span>
              </div>
            </div>

            <router-link
              to="/checkout"
              :class="['btn btn-danger w-100', { disabled: cartStore.items.length === 0 }]"
            >
              <i class="fas fa-credit-card"></i> Proceder al Pago
            </router-link>

            <router-link to="/productos" class="btn btn-outline-secondary w-100 mt-2">
              <i class="fas fa-arrow-left"></i> Continuar Comprando
            </router-link>

            <button
              @click="cartStore.clearCart()"
              class="btn btn-outline-danger w-100 mt-2"
            >
              <i class="fas fa-times"></i> Vaciar Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '../stores/cartStore'

const cartStore = useCartStore()
const shippingCost = 20

const totalWithTax = computed(() => {
  return cartStore.total + shippingCost + (cartStore.total + shippingCost) * 0.13
})

const aumentarCantidad = (id: number) => {
  const item = cartStore.items.find(i => i.id === id)
  if (item) {
    item.cantidad++
  }
}

const disminuirCantidad = (id: number) => {
  const item = cartStore.items.find(i => i.id === id)
  if (item && item.cantidad > 1) {
    item.cantidad--
  }
}

const eliminarDelCarrito = (id: number) => {
  if (confirm('¿Deseas eliminar este producto del carrito?')) {
    cartStore.removeItem(id)
  }
}
</script>

<style scoped>
@media (max-width: 768px) {
  .sticky-top {
    position: relative !important;
    top: 0 !important;
  }
}
</style>
