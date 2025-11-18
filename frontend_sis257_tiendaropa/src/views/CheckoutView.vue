<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCarritoStore } from '@/stores'
import http from '@/plugins/axios'

const router = useRouter()
const carritoStore = useCarritoStore()

// Protección: redirigir si el carrito está vacío
onMounted(() => {
  if (carritoStore.estaVacio) {
    router.push('/')
  }
})

// Paso del checkout (1: datos, 2: pago, 3: confirmación)
const pasoActual = ref(1)

// Datos del cliente
const formCliente = ref({
  nombre: '',
  apellido: '',
  telefono: '',
  email: '',
  direccion: '',
  ciudad: '',
  codigoPostal: ''
})

// Datos de pago
const formPago = ref({
  metodoPago: 'tarjeta' as 'efectivo' | 'tarjeta' | 'transferencia' | 'QR',
  numeroTarjeta: '',
  nombreTarjeta: '',
  fechaExpiracion: '',
  cvv: '',
  montoPagado: 0
})

// Estados
const cargando = ref(false)
const errores = ref<Record<string, string>>({})
const ventaId = ref<number | null>(null)

// Computed
const totalCarrito = computed(() => carritoStore.precioTotal)
const cambio = computed(() => {
  if (formPago.value.metodoPago === 'efectivo') {
    return Math.max(0, formPago.value.montoPagado - totalCarrito.value)
  }
  return 0
})

// Validaciones
const validarPaso1 = (): boolean => {
  errores.value = {}

  if (!formCliente.value.nombre.trim()) {
    errores.value.nombre = 'El nombre es requerido'
  }
  if (!formCliente.value.apellido.trim()) {
    errores.value.apellido = 'El apellido es requerido'
  }
  if (!formCliente.value.telefono.trim()) {
    errores.value.telefono = 'El teléfono es requerido'
  }
  if (!formCliente.value.email.trim()) {
    errores.value.email = 'El email es requerido'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formCliente.value.email)) {
    errores.value.email = 'Email inválido'
  }
  if (!formCliente.value.direccion.trim()) {
    errores.value.direccion = 'La dirección es requerida'
  }
  if (!formCliente.value.ciudad.trim()) {
    errores.value.ciudad = 'La ciudad es requerida'
  }

  return Object.keys(errores.value).length === 0
}

const validarPaso2 = (): boolean => {
  errores.value = {}

  if (formPago.value.metodoPago === 'tarjeta') {
    if (!formPago.value.numeroTarjeta.trim()) {
      errores.value.numeroTarjeta = 'Número de tarjeta requerido'
    } else if (formPago.value.numeroTarjeta.replace(/\s/g, '').length !== 16) {
      errores.value.numeroTarjeta = 'Número de tarjeta inválido'
    }

    if (!formPago.value.nombreTarjeta.trim()) {
      errores.value.nombreTarjeta = 'Nombre requerido'
    }

    if (!formPago.value.fechaExpiracion.trim()) {
      errores.value.fechaExpiracion = 'Fecha requerida'
    } else if (!/^\d{2}\/\d{2}$/.test(formPago.value.fechaExpiracion)) {
      errores.value.fechaExpiracion = 'Formato MM/YY'
    }

    if (!formPago.value.cvv.trim()) {
      errores.value.cvv = 'CVV requerido'
    } else if (!/^\d{3,4}$/.test(formPago.value.cvv)) {
      errores.value.cvv = 'CVV inválido'
    }
  } else if (formPago.value.metodoPago === 'efectivo') {
    if (formPago.value.montoPagado < totalCarrito.value) {
      errores.value.montoPagado = 'Monto insuficiente'
    }
  }

  return Object.keys(errores.value).length === 0
}

// Navegación
const siguientePaso = () => {
  if (pasoActual.value === 1 && validarPaso1()) {
    pasoActual.value = 2
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else if (pasoActual.value === 2 && validarPaso2()) {
    procesarPago()
  }
}

const pasoAnterior = () => {
  if (pasoActual.value > 1) {
    pasoActual.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Formateo de tarjeta
const formatearNumeroTarjeta = () => {
  let valor = formPago.value.numeroTarjeta.replace(/\s/g, '')
  valor = valor.replace(/(\d{4})/g, '$1 ').trim()
  formPago.value.numeroTarjeta = valor
}

const formatearFechaExpiracion = () => {
  let valor = formPago.value.fechaExpiracion.replace(/\D/g, '')
  if (valor.length >= 2) {
    valor = valor.substring(0, 2) + '/' + valor.substring(2, 4)
  }
  formPago.value.fechaExpiracion = valor
}

// Procesar pago
const procesarPago = async () => {
  try {
    cargando.value = true

    // 1. Crear o buscar cliente
    const clienteResponse = await http.post('clientes', {
      nombre: formCliente.value.nombre,
      apellido: formCliente.value.apellido,
      telefono: formCliente.value.telefono,
      direccion: `${formCliente.value.direccion}, ${formCliente.value.ciudad}, ${formCliente.value.codigoPostal}`
    })

    const clienteId = clienteResponse.data.id

    // 2. Crear venta con detalles
    const detalles = carritoStore.items.map(item => ({
      idProducto: item.productoId,
      cantidad: item.cantidad
    }))

    const ventaData = {
      idCliente: clienteId,
      metodoPago: formPago.value.metodoPago,
      detalles: detalles,
      montoPagado: formPago.value.metodoPago === 'efectivo'
        ? formPago.value.montoPagado
        : totalCarrito.value,
      cambio: cambio.value
    }

    const ventaResponse = await http.post('ventas', ventaData)
    ventaId.value = ventaResponse.data.id

    // 3. Simular procesamiento (2 segundos)
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 4. Ir a confirmación
    pasoActual.value = 3
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // 5. Vaciar carrito después de mostrar confirmación
    setTimeout(() => {
      carritoStore.vaciarCarrito()
    }, 1000)

  } catch (error: any) {
    console.error('Error al procesar pago:', error)
    errores.value.general = error.response?.data?.message || 'Error al procesar el pago. Intenta nuevamente.'
  } finally {
    cargando.value = false
  }
}

const volverInicio = () => {
  router.push('/')
}
</script>

<template>
  <div class="checkout-page">
    <!-- Minimal Header -->
    <header class="checkout-minimal-header">
      <router-link to="/" class="checkout-logo">MAJESTIC</router-link>
    </header>

    <div class="checkout-container">
      <!-- Header -->
      <div class="checkout-header">
        <h1 class="checkout-title">Finalizar Compra</h1>
        <div class="steps-indicator">
          <div :class="['step', { active: pasoActual === 1, completed: pasoActual > 1 }]">
            <span class="step-number">1</span>
            <span class="step-label">Datos</span>
          </div>
          <div class="step-line"></div>
          <div :class="['step', { active: pasoActual === 2, completed: pasoActual > 2 }]">
            <span class="step-number">2</span>
            <span class="step-label">Pago</span>
          </div>
          <div class="step-line"></div>
          <div :class="['step', { active: pasoActual === 3 }]">
            <span class="step-number">3</span>
            <span class="step-label">Confirmación</span>
          </div>
        </div>
      </div>

      <!-- Contenido -->
      <div class="checkout-content">
        <!-- Paso 1: Datos de Envío -->
        <div v-if="pasoActual === 1" class="checkout-step">
          <h2 class="step-title">Información de Envío</h2>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Nombre</label>
              <input
                v-model="formCliente.nombre"
                type="text"
                class="form-input"
                :class="{ error: errores.nombre }"
                placeholder="Juan"
              />
              <span v-if="errores.nombre" class="error-message">{{ errores.nombre }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">Apellido</label>
              <input
                v-model="formCliente.apellido"
                type="text"
                class="form-input"
                :class="{ error: errores.apellido }"
                placeholder="Pérez"
              />
              <span v-if="errores.apellido" class="error-message">{{ errores.apellido }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">Teléfono</label>
              <input
                v-model="formCliente.telefono"
                type="tel"
                class="form-input"
                :class="{ error: errores.telefono }"
                placeholder="+591 70000000"
              />
              <span v-if="errores.telefono" class="error-message">{{ errores.telefono }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">Email</label>
              <input
                v-model="formCliente.email"
                type="email"
                class="form-input"
                :class="{ error: errores.email }"
                placeholder="correo@ejemplo.com"
              />
              <span v-if="errores.email" class="error-message">{{ errores.email }}</span>
            </div>

            <div class="form-group full-width">
              <label class="form-label">Dirección</label>
              <input
                v-model="formCliente.direccion"
                type="text"
                class="form-input"
                :class="{ error: errores.direccion }"
                placeholder="Calle Principal #123"
              />
              <span v-if="errores.direccion" class="error-message">{{ errores.direccion }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">Ciudad</label>
              <input
                v-model="formCliente.ciudad"
                type="text"
                class="form-input"
                :class="{ error: errores.ciudad }"
                placeholder="Santa Cruz"
              />
              <span v-if="errores.ciudad" class="error-message">{{ errores.ciudad }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">Código Postal</label>
              <input
                v-model="formCliente.codigoPostal"
                type="text"
                class="form-input"
                placeholder="0000"
              />
            </div>
          </div>
        </div>

        <!-- Paso 2: Método de Pago -->
        <div v-if="pasoActual === 2" class="checkout-step">
          <h2 class="step-title">Método de Pago</h2>

          <!-- Selector de Método -->
          <div class="payment-methods">
            <label
              v-for="metodo in ['tarjeta', 'efectivo', 'transferencia', 'qr']"
              :key="metodo"
              class="payment-method"
            >
              <input
                type="radio"
                v-model="formPago.metodoPago"
                :value="metodo"
                name="metodoPago"
              />
              <span class="method-label">{{ metodo === 'tarjeta' ? 'Tarjeta de Crédito/Débito' : metodo === 'efectivo' ? 'Efectivo' : metodo === 'transferencia' ? 'Transferencia Bancaria' : 'QR' }}</span>
            </label>
          </div>

          <!-- Formulario de Tarjeta -->
          <div v-if="formPago.metodoPago === 'tarjeta'" class="payment-form">
            <div class="form-group full-width">
              <label class="form-label">Número de Tarjeta</label>
              <input
                v-model="formPago.numeroTarjeta"
                @input="formatearNumeroTarjeta"
                type="text"
                class="form-input"
                :class="{ error: errores.numeroTarjeta }"
                placeholder="1234 5678 9012 3456"
                maxlength="19"
              />
              <span v-if="errores.numeroTarjeta" class="error-message">{{ errores.numeroTarjeta }}</span>
            </div>

            <div class="form-group full-width">
              <label class="form-label">Nombre en la Tarjeta</label>
              <input
                v-model="formPago.nombreTarjeta"
                type="text"
                class="form-input"
                :class="{ error: errores.nombreTarjeta }"
                placeholder="JUAN PEREZ"
                style="text-transform: uppercase"
              />
              <span v-if="errores.nombreTarjeta" class="error-message">{{ errores.nombreTarjeta }}</span>
            </div>

            <div class="form-grid-half">
              <div class="form-group">
                <label class="form-label">Fecha de Expiración</label>
                <input
                  v-model="formPago.fechaExpiracion"
                  @input="formatearFechaExpiracion"
                  type="text"
                  class="form-input"
                  :class="{ error: errores.fechaExpiracion }"
                  placeholder="MM/YY"
                  maxlength="5"
                />
                <span v-if="errores.fechaExpiracion" class="error-message">{{ errores.fechaExpiracion }}</span>
              </div>

              <div class="form-group">
                <label class="form-label">CVV</label>
                <input
                  v-model="formPago.cvv"
                  type="text"
                  class="form-input"
                  :class="{ error: errores.cvv }"
                  placeholder="123"
                  maxlength="4"
                />
                <span v-if="errores.cvv" class="error-message">{{ errores.cvv }}</span>
              </div>
            </div>
          </div>

          <!-- Formulario de Efectivo -->
          <div v-if="formPago.metodoPago === 'efectivo'" class="payment-form">
            <div class="form-group">
              <label class="form-label">Monto a Pagar (Bs)</label>
              <input
                v-model.number="formPago.montoPagado"
                type="number"
                class="form-input"
                :class="{ error: errores.montoPagado }"
                :placeholder="`Mínimo: ${totalCarrito.toFixed(2)} Bs`"
                step="0.01"
              />
              <span v-if="errores.montoPagado" class="error-message">{{ errores.montoPagado }}</span>
            </div>

            <div v-if="cambio > 0" class="cambio-info">
              <span class="cambio-label">Cambio:</span>
              <span class="cambio-value">{{ cambio.toFixed(2) }} Bs</span>
            </div>
          </div>

          <!-- Mensaje para otros métodos -->
          <div v-if="formPago.metodoPago === 'transferencia' || formPago.metodoPago === 'QR'" class="info-message">
            <p>Los datos para realizar la {{ formPago.metodoPago }} se enviarán por correo electrónico.</p>
          </div>

          <div v-if="errores.general" class="error-message general">{{ errores.general }}</div>
        </div>

        <!-- Paso 3: Confirmación -->
        <div v-if="pasoActual === 3" class="checkout-step confirmation">
          <div class="success-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>

          <h2 class="success-title">¡Pedido Confirmado!</h2>
          <p class="success-message">
            Tu pedido #{{ ventaId }} ha sido procesado exitosamente.
          </p>
          <p class="success-submessage">
            Recibirás un email de confirmación con los detalles del envío.
          </p>

          <button @click="volverInicio" class="btn-primary">
            Volver al Inicio
          </button>
        </div>

        <!-- Resumen del Pedido (Sidebar) -->
        <aside v-if="pasoActual < 3" class="order-summary">
          <h3 class="summary-title">Resumen del Pedido</h3>

          <div class="summary-items">
            <div v-for="item in carritoStore.items" :key="item.id" class="summary-item">
              <img :src="item.imagen" :alt="item.nombre" class="summary-item-img" />
              <div class="summary-item-info">
                <p class="summary-item-name">{{ item.nombre }}</p>
                <p class="summary-item-details">{{ item.talla }} · {{ item.color }}</p>
                <p class="summary-item-qty">Cantidad: {{ item.cantidad }}</p>
              </div>
              <span class="summary-item-price">{{ (item.precio * item.cantidad).toFixed(2) }} Bs</span>
            </div>
          </div>

          <div class="summary-total">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>{{ totalCarrito.toFixed(2) }} Bs</span>
            </div>
            <div class="summary-row">
              <span>Envío</span>
              <span>Gratis</span>
            </div>
            <div class="summary-row total">
              <span>Total</span>
              <span>{{ totalCarrito.toFixed(2) }} Bs</span>
            </div>
          </div>
        </aside>
      </div>

      <!-- Botones de Navegación -->
      <div v-if="pasoActual < 3" class="checkout-actions">
        <button v-if="pasoActual > 1" @click="pasoAnterior" class="btn-secondary">
          Volver
        </button>
        <button @click="siguientePaso" class="btn-primary" :disabled="cargando">
          <span v-if="!cargando">{{ pasoActual === 2 ? 'Confirmar Pago' : 'Continuar' }}</span>
          <span v-else>Procesando...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Premium Checkout Design */

.checkout-minimal-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  border-bottom: 1px solid #e5e5e5;
  padding: 20px 40px;
  z-index: 1000;
  display: flex;
  justify-content: center;
}

.checkout-logo {
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 2px;
  color: #000000;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.checkout-logo:hover {
  opacity: 0.6;
}

.checkout-page {
  min-height: 100vh;
  background: #fafafa;
  padding: 100px 20px 60px 20px;
}

.checkout-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.checkout-header {
  text-align: center;
  margin-bottom: 50px;
}

.checkout-title {
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #000000;
  margin-bottom: 40px;
}

/* Steps Indicator */
.steps-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.step-number {
  width: 40px;
  height: 40px;
  border: 1px solid #e5e5e5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  color: #999999;
  background: #ffffff;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background: #000000;
  color: #ffffff;
  border-color: #000000;
}

.step.completed .step-number {
  background: #000000;
  color: #ffffff;
  border-color: #000000;
}

.step-label {
  font-size: 0.75rem;
  color: #999999;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.step.active .step-label {
  color: #000000;
  font-weight: 400;
}

.step-line {
  width: 80px;
  height: 1px;
  background: #e5e5e5;
}

/* Content Layout */
.checkout-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 60px;
  margin-bottom: 40px;
}

.checkout-step {
  background: #ffffff;
  padding: 40px;
  border: 1px solid #e5e5e5;
}

.step-title {
  font-size: 1.25rem;
  font-weight: 400;
  letter-spacing: 1px;
  color: #000000;
  margin-bottom: 30px;
  text-transform: uppercase;
  font-size: 0.9375rem;
}

/* Forms */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.form-grid-half {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 0.8125rem;
  color: #666666;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-weight: 400;
}

.form-input {
  padding: 14px 16px;
  border: 1px solid #e5e5e5;
  background: #ffffff;
  font-size: 0.9375rem;
  color: #000000;
  transition: border-color 0.2s ease;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #000000;
}

.form-input.error {
  border-color: #d32f2f;
}

.form-input::placeholder {
  color: #cccccc;
}

.error-message {
  font-size: 0.75rem;
  color: #d32f2f;
  letter-spacing: 0.3px;
}

.error-message.general {
  margin-top: 20px;
  padding: 12px;
  background: #ffebee;
  text-align: center;
}

/* Payment Methods */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 30px;
}

.payment-method {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid #e5e5e5;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.payment-method:hover {
  border-color: #000000;
}

.payment-method input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.method-label {
  font-size: 0.9375rem;
  color: #000000;
  letter-spacing: 0.3px;
}

.payment-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cambio-info {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  background: #f5f5f5;
  border: 1px solid #e5e5e5;
}

.cambio-label {
  font-size: 0.875rem;
  color: #666666;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.cambio-value {
  font-size: 1rem;
  color: #000000;
  font-weight: 400;
}

.info-message {
  padding: 20px;
  background: #f5f5f5;
  border: 1px solid #e5e5e5;
  text-align: center;
}

.info-message p {
  font-size: 0.875rem;
  color: #666666;
  letter-spacing: 0.3px;
  margin: 0;
}

/* Confirmation */
.confirmation {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 40px;
}

.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 30px auto;
  background: #000000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-icon svg {
  color: #ffffff;
}

.success-title {
  font-size: 1.75rem;
  font-weight: 300;
  letter-spacing: 2px;
  color: #000000;
  margin-bottom: 16px;
}

.success-message {
  font-size: 1rem;
  color: #666666;
  letter-spacing: 0.3px;
  margin-bottom: 8px;
}

.success-submessage {
  font-size: 0.875rem;
  color: #999999;
  letter-spacing: 0.3px;
  margin-bottom: 40px;
}

/* Order Summary Sidebar */
.order-summary {
  background: #ffffff;
  padding: 30px;
  border: 1px solid #e5e5e5;
  height: fit-content;
  position: sticky;
  top: 100px;
}

.summary-title {
  font-size: 0.9375rem;
  font-weight: 400;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #000000;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e5e5;
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e5e5;
}

.summary-item {
  display: grid;
  grid-template-columns: 60px 1fr auto;
  gap: 12px;
}

.summary-item-img {
  width: 60px;
  height: 75px;
  object-fit: cover;
  background: #fafafa;
}

.summary-item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-item-name {
  font-size: 0.875rem;
  color: #000000;
  font-weight: 400;
  margin: 0;
}

.summary-item-details {
  font-size: 0.75rem;
  color: #999999;
  margin: 0;
}

.summary-item-qty {
  font-size: 0.75rem;
  color: #666666;
  margin: 0;
}

.summary-item-price {
  font-size: 0.875rem;
  color: #000000;
  font-weight: 400;
}

.summary-total {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #666666;
}

.summary-row.total {
  padding-top: 12px;
  border-top: 1px solid #e5e5e5;
  font-size: 1rem;
  color: #000000;
  font-weight: 400;
}

/* Actions */
.checkout-actions {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  max-width: 800px;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 16px 40px;
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background: #000000;
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background: #333333;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  color: #000000;
  border: 1px solid #e5e5e5;
}

.btn-secondary:hover {
  border-color: #000000;
}

/* Responsive */
@media (max-width: 992px) {
  .checkout-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .order-summary {
    position: static;
    order: -1;
  }

  .confirmation {
    grid-column: 1;
  }
}

@media (max-width: 768px) {
  .checkout-page {
    padding: 80px 15px 40px 15px;
  }

  .checkout-title {
    font-size: 1.5rem;
    letter-spacing: 2px;
  }

  .steps-indicator {
    gap: 10px;
  }

  .step-number {
    width: 32px;
    height: 32px;
    font-size: 0.75rem;
  }

  .step-label {
    font-size: 0.625rem;
  }

  .step-line {
    width: 40px;
  }

  .checkout-step {
    padding: 24px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .checkout-actions {
    flex-direction: column-reverse;
  }

  .order-summary {
    padding: 20px;
  }
}
</style>
