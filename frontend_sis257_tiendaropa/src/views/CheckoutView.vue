<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-lg-8">
        <div class="card shadow mb-4">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">
              <i class="fas fa-credit-card"></i> Información de Envío y Pago
            </h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="procesarPago">
              <!-- Información de Envío -->
              <h6 class="mb-3">Dirección de Envío</h6>
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="nombre" class="form-label">Nombre</label>
                  <input v-model="form.nombre" type="text" class="form-control" id="nombre" required />
                </div>
                <div class="col-md-6">
                  <label for="email" class="form-label">Correo Electrónico</label>
                  <input v-model="form.email" type="email" class="form-control" id="email" required />
                </div>
              </div>

              <div class="mb-3">
                <label for="telefono" class="form-label">Teléfono</label>
                <input v-model="form.telefono" type="tel" class="form-control" id="telefono" required />
              </div>

              <div class="mb-3">
                <label for="direccion" class="form-label">Dirección</label>
                <input v-model="form.direccion" type="text" class="form-control" id="direccion" required />
              </div>

              <div class="row mb-4">
                <div class="col-md-6">
                  <label for="ciudad" class="form-label">Ciudad</label>
                  <input v-model="form.ciudad" type="text" class="form-control" id="ciudad" required />
                </div>
                <div class="col-md-6">
                  <label for="codPostal" class="form-label">Código Postal</label>
                  <input v-model="form.codPostal" type="text" class="form-control" id="codPostal" />
                </div>
              </div>

              <hr />

              <!-- Método de Pago -->
              <h6 class="mb-3">Método de Pago</h6>
              <div class="mb-3">
                <div class="form-check">
                  <input
                    v-model="form.metodoPago"
                    type="radio"
                    class="form-check-input"
                    id="transferencia"
                    value="transferencia"
                  />
                  <label class="form-check-label" for="transferencia">
                    Transferencia Bancaria
                  </label>
                </div>
                <div class="form-check">
                  <input
                    v-model="form.metodoPago"
                    type="radio"
                    class="form-check-input"
                    id="qr"
                    value="qr"
                  />
                  <label class="form-check-label" for="qr">
                    Pago por QR
                  </label>
                </div>
                <div class="form-check">
                  <input
                    v-model="form.metodoPago"
                    type="radio"
                    class="form-check-input"
                    id="contraentrega"
                    value="contraentrega"
                  />
                  <label class="form-check-label" for="contraentrega">
                    Contra Entrega
                  </label>
                </div>
              </div>

              <div class="mb-3">
                <div class="form-check">
                  <input
                    v-model="form.aceptaTerminos"
                    type="checkbox"
                    class="form-check-input"
                    id="terminos"
                  />
                  <label class="form-check-label" for="terminos">
                    Acepto los términos y condiciones
                  </label>
                </div>
              </div>

              <button
                type="submit"
                class="btn btn-success btn-lg w-100"
                :disabled="loading || !form.aceptaTerminos"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ loading ? 'Procesando...' : 'Confirmar Compra' }}
              </button>
            </form>

            <div v-if="error" class="alert alert-danger mt-3">
              <i class="fas fa-exclamation-circle"></i> {{ error }}
            </div>
          </div>
        </div>
      </div>

      <!-- Resumen del Pedido -->
      <div class="col-lg-4">
        <div class="card shadow sticky-top" style="top: 20px">
          <div class="card-header bg-info text-white">
            <h5 class="mb-0">
              <i class="fas fa-receipt"></i> Resumen del Pedido
            </h5>
          </div>
          <div class="card-body">
            <div v-for="item in cartStore.items" :key="item.id" class="mb-3 pb-3 border-bottom">
              <div class="d-flex justify-content-between mb-1">
                <span>{{ item.nombre }}</span>
                <span class="fw-bold">Bs. {{ (item.precio * item.cantidad).toFixed(2) }}</span>
              </div>
              <small class="text-muted">Cantidad: {{ item.cantidad }}</small>
            </div>

            <hr />

            <div class="mb-2 d-flex justify-content-between">
              <span>Subtotal:</span>
              <span>Bs. {{ cartStore.total.toFixed(2) }}</span>
            </div>
            <div class="mb-2 d-flex justify-content-between">
              <span>Envío:</span>
              <span>Bs. 20.00</span>
            </div>
            <div class="mb-3 d-flex justify-content-between">
              <span>IVA (13%):</span>
              <span>Bs. {{ ((cartStore.total + 20) * 0.13).toFixed(2) }}</span>
            </div>

            <div class="bg-light p-3 rounded">
              <div class="d-flex justify-content-between fw-bold" style="font-size: 1.2em">
                <span>Total:</span>
                <span class="text-danger">Bs. {{ totalFinal.toFixed(2) }}</span>
              </div>
            </div>

            <button @click="regresarAlCarrito" class="btn btn-outline-secondary w-100 mt-3">
              <i class="fas fa-arrow-left"></i> Volver al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import apiService from '../services/apiService'

const router = useRouter()
const cartStore = useCartStore()

const form = ref({
  nombre: '',
  email: '',
  telefono: '',
  direccion: '',
  ciudad: '',
  codPostal: '',
  metodoPago: 'transferencia',
  aceptaTerminos: false
})

const loading = ref(false)
const error = ref('')

const totalFinal = computed(() => {
  return cartStore.total + 20 + (cartStore.total + 20) * 0.13
})

const procesarPago = async () => {
  if (cartStore.items.length === 0) {
    error.value = 'Tu carrito está vacío'
    return
  }

  try {
    loading.value = true
    error.value = ''

    const ventaData = {
      cliente: {
        nombre: form.value.nombre,
        email: form.value.email,
        telefono: form.value.telefono
      },
      direccion: form.value.direccion,
      ciudad: form.value.ciudad,
      metodoPago: form.value.metodoPago,
      total: totalFinal.value,
      detalles: cartStore.items.map(item => ({
        productoId: item.id,
        cantidad: item.cantidad,
        precioUnitario: item.precio
      }))
    }

    await apiService.crearVenta(ventaData)

    // Limpiar carrito
    cartStore.clearCart()

    // Redirigir a página de éxito
    alert('¡Compra realizada exitosamente!')
    router.push('/')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error al procesar el pago'
  } finally {
    loading.value = false
  }
}

const regresarAlCarrito = () => {
  router.push('/carrito')
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
