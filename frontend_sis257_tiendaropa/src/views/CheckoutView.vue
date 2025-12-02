<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCarritoStore, useAuthStore } from '@/stores'
import http from '@/plugins/axios'

const router = useRouter()
const carritoStore = useCarritoStore()
const authStore = useAuthStore()

// Protección: redirigir si el carrito está vacío
onMounted(async () => {
  if (carritoStore.estaVacio) {
    router.push('/')
    return
  }
  
  // Pre-llenar datos del cliente si ya está logueado
  await cargarDatosCliente()
})

// Cargar datos del cliente logueado
const cargarDatosCliente = async () => {
  try {
    // Primero intentar desde el store
    if (authStore.cliente) {
      preLlenarFormulario(authStore.cliente)
      return
    }
    
    // Si no está en el store, obtener del backend
    const { data } = await http.get('clientes/me')
    if (data) {
      preLlenarFormulario(data)
      // Guardar en el store para futuras referencias
      authStore.cliente = data
      localStorage.setItem('cliente', JSON.stringify(data))
    }
  } catch (error) {
    // Si no hay cliente asociado, el formulario queda vacío
    console.log('No hay datos de cliente previos')
  }
}

const preLlenarFormulario = (cliente: any) => {
  if (cliente.nombre) formCliente.value.nombre = cliente.nombre
  if (cliente.apellido) formCliente.value.apellido = cliente.apellido
  if (cliente.telefono) formCliente.value.telefono = cliente.telefono
  
  // La dirección puede venir como string completo o necesitar separarse
  if (cliente.direccion) {
    // Si la dirección contiene coma, intentar separar ciudad
    const partes = cliente.direccion.split(',').map((p: string) => p.trim())
    formCliente.value.direccion = partes[0] || cliente.direccion
    if (partes.length > 1) {
      formCliente.value.ciudad = partes[1] || ''
    }
  }
  

}

// Paso del checkout (1: datos, 2: pago, 3: confirmación)
const pasoActual = ref(1)

// Datos del cliente
const formCliente = ref({
  nombre: '',
  apellido: '',
  telefono: '',
  direccion: '',
  ciudad: '',
  codigoPostal: '',
})

// Datos de pago
const formPago = ref({
  metodoPago: 'tarjeta' as 'tarjeta' | 'transferencia' | 'qr',
  numeroTarjeta: '',
  nombreTarjeta: '',
  fechaExpiracion: '',
  cvv: '',
})

// Estados
const cargando = ref(false)
const errores = ref<Record<string, string>>({})
const ventaId = ref<number | null>(null)

// Snapshot del carrito para el comprobante (porque se vacía después de la compra)
const carritoItemsSnapshot = ref<any[]>([])
const totalSnapshot = ref<number>(0)

// Computed
const totalCarrito = computed(() => carritoStore.precioTotal)

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

    let clienteId: number | null = null

    // Caso 1: Usuario logueado como cliente
    if (authStore.token && authStore.role === 'cliente') {
      // Intentar obtener cliente existente del backend
      try {
        const { data } = await http.get('clientes/me')
        if (data?.id) {
          // Cliente existe, actualizar datos
          await http.patch(`clientes/${data.id}`, {
            nombre: formCliente.value.nombre,
            apellido: formCliente.value.apellido,
            telefono: formCliente.value.telefono,
            direccion: `${formCliente.value.direccion}, ${formCliente.value.ciudad}`.trim(),
          })
          clienteId = data.id
          // Actualizar store
          authStore.cliente = { ...data }
          localStorage.setItem('cliente', JSON.stringify(data))
        }
      } catch (e) {
        // No existe cliente para este usuario, crear uno asociado
        const clienteResponse = await http.post('clientes/me', {
          nombre: formCliente.value.nombre,
          apellido: formCliente.value.apellido,
          telefono: formCliente.value.telefono,
          direccion: `${formCliente.value.direccion}, ${formCliente.value.ciudad}`.trim(),
        })
        clienteId = clienteResponse.data.id
        // Actualizar store
        authStore.cliente = clienteResponse.data
        localStorage.setItem('cliente', JSON.stringify(clienteResponse.data))
      }
    }
    // Caso 2: Admin haciendo una venta (puede crear clientes directamente)
    else if (authStore.token && authStore.role === 'admin') {
      const clienteResponse = await http.post('clientes', {
        nombre: formCliente.value.nombre,
        apellido: formCliente.value.apellido,
        telefono: formCliente.value.telefono,
        direccion: `${formCliente.value.direccion}, ${formCliente.value.ciudad}`.trim(),
      })
      clienteId = clienteResponse.data.id
    }
    // Caso 3: Sin login - redirigir a login
    else {
      errores.value.general = 'Debes iniciar sesión para completar la compra'
      setTimeout(() => {
        router.push('/login')
      }, 2000)
      return
    }

    // 2. Crear venta con detalles
    const detalles = carritoStore.items.map((item) => ({
      idProducto: item.productoId,
      cantidad: item.cantidad,
    }))

    const ventaData = {
      idCliente: clienteId,
      metodoPago: formPago.value.metodoPago,
      detalles: detalles,
      montoPagado: totalCarrito.value,
      cambio: 0,
    }

    const ventaResponse = await http.post('ventas', ventaData)
    ventaId.value = ventaResponse.data.id

    // 3. Simular procesamiento (2 segundos)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // 4. Guardar snapshot del carrito ANTES de vaciarlo
    carritoItemsSnapshot.value = [...carritoStore.items]
    totalSnapshot.value = totalCarrito.value

    // 5. Ir a confirmación
    pasoActual.value = 3
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // 6. Vaciar carrito después de mostrar confirmación
    setTimeout(() => {
      carritoStore.vaciarCarrito()
    }, 1000)
  } catch (error: any) {
    console.error('Error al procesar pago:', error)
    errores.value.general =
      error.response?.data?.message || 'Error al procesar el pago. Intenta nuevamente.'
  } finally {
    cargando.value = false
  }
}

const volverInicio = () => {
  router.push('/')
}

const imprimirComprobante = () => {
  const comprobante = document.getElementById('comprobante-pago')
  if (!comprobante) return
  
  const ventanaImpresion = window.open('', '_blank')
  if (!ventanaImpresion) return
  
  ventanaImpresion.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Comprobante de Pago - Pedido #${ventaId.value}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
        .comprobante-header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #000; }
        .comprobante-logo { font-size: 28px; font-weight: 300; letter-spacing: 8px; margin-bottom: 8px; }
        .comprobante-tipo { font-size: 14px; letter-spacing: 3px; color: #666; }
        .comprobante-info { margin-bottom: 30px; }
        .comprobante-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; font-size: 14px; }
        .comprobante-row span { color: #666; }
        .comprobante-row strong { color: #000; }
        .comprobante-productos { margin: 30px 0; }
        .comprobante-table-header { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; padding: 12px 0; border-bottom: 2px solid #000; font-size: 12px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }
        .comprobante-table-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; padding: 12px 0; border-bottom: 1px solid #eee; font-size: 14px; }
        .comprobante-totales { margin-top: 20px; padding-top: 20px; border-top: 2px solid #000; }
        .comprobante-totales .comprobante-row.total { font-size: 18px; padding-top: 12px; margin-top: 12px; border-top: 1px solid #000; }
        .comprobante-metodo { margin-top: 20px; padding: 16px; background: #f5f5f5; font-size: 14px; }
        .comprobante-footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; }
        .comprobante-footer p { font-size: 16px; margin-bottom: 8px; }
        .comprobante-nota { font-size: 12px; color: #999; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      ${comprobante.innerHTML}
    </body>
    </html>
  `)
  ventanaImpresion.document.close()
  ventanaImpresion.focus()
  setTimeout(() => {
    ventanaImpresion.print()
  }, 250)
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
          
          <!-- Aviso de datos pre-llenados -->
          <div v-if="authStore.cliente" class="prefilled-notice">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
            Hemos pre-llenado tus datos. Puedes modificarlos si lo deseas.
          </div>

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

            <!--<div class="form-group">
              <label class="form-label">Código Postal</label>
              <input
                v-model="formCliente.codigoPostal"
                type="text"
                class="form-input"
                placeholder="0000"
              />
            </div>-->
          </div>
        </div>

        <!-- Paso 2: Método de Pago -->
        <div v-if="pasoActual === 2" class="checkout-step">
          <h2 class="step-title">Método de Pago</h2>

          <!-- Selector de Método -->
          <div class="payment-methods">
            <label
              v-for="metodo in ['tarjeta', 'transferencia', 'qr']"
              :key="metodo"
              class="payment-method"
            >
              <input type="radio" v-model="formPago.metodoPago" :value="metodo" name="metodoPago" />
              <span class="method-label">{{
                metodo === 'tarjeta'
                  ? 'Tarjeta de Crédito/Débito'
                  : metodo === 'transferencia'
                    ? 'Transferencia Bancaria'
                    : 'QR'
              }}</span>
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
              <span v-if="errores.numeroTarjeta" class="error-message">{{
                errores.numeroTarjeta
              }}</span>
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
              <span v-if="errores.nombreTarjeta" class="error-message">{{
                errores.nombreTarjeta
              }}</span>
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
                <span v-if="errores.fechaExpiracion" class="error-message">{{
                  errores.fechaExpiracion
                }}</span>
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

          <!-- Mensaje para otros métodos -->
          <div
            v-if="formPago.metodoPago === 'transferencia' || formPago.metodoPago === 'qr'"
            class="info-message"
          >
            <p>
              Los datos para realizar la {{ formPago.metodoPago }} se enviarán por correo
              electrónico.
            </p>
          </div>

          <!-- Formulario de QR -->
          <div v-if="formPago.metodoPago === 'qr'" class="payment-form qr-form">
            <div class="qr-container">
              <img src="@/assets/img/gallery/qr.png" alt="Código QR de pago" class="qr-image" />
              <p class="qr-instruction">
                Escanea este código QR con tu aplicación bancaria para realizar el pago
              </p>
            </div>
          </div>

          <div v-if="errores.general" class="error-message general">{{ errores.general }}</div>
        </div>

        <!-- Paso 3: Confirmación -->
        <div v-if="pasoActual === 3" class="checkout-step confirmation">
          <div class="success-icon">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>

          <h2 class="success-title">¡Pedido Confirmado!</h2>
          <p class="success-message">Tu pedido #{{ ventaId }} ha sido procesado exitosamente.</p>
          <p class="success-submessage">
            Recibirás un email de confirmación con los detalles del envío.
          </p>

          <!-- Comprobante de Pago -->
          <div class="comprobante" id="comprobante-pago">
            <div class="comprobante-header">
              <div class="comprobante-logo">MAJESTIC</div>
              <div class="comprobante-tipo">COMPROBANTE DE PAGO</div>
            </div>
            
            <div class="comprobante-info">
              <div class="comprobante-row">
                <span>Número de Pedido:</span>
                <strong>#{{ ventaId }}</strong>
              </div>
              <div class="comprobante-row">
                <span>Fecha:</span>
                <strong>{{ new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) }}</strong>
              </div>
              <div class="comprobante-row">
                <span>Cliente:</span>
                <strong>{{ formCliente.nombre }} {{ formCliente.apellido }}</strong>
              </div>
              <div class="comprobante-row">
                <span>Teléfono:</span>
                <strong>{{ formCliente.telefono }}</strong>
              </div>
              <div class="comprobante-row">
                <span>Dirección de envío:</span>
                <strong>{{ formCliente.direccion }}, {{ formCliente.ciudad }}</strong>
              </div>
            </div>

            <div class="comprobante-productos">
              <div class="comprobante-table-header">
                <span>Producto</span>
                <span>Cant.</span>
                <span>Precio</span>
                <span>Subtotal</span>
              </div>
              <div v-for="item in carritoItemsSnapshot" :key="item.id" class="comprobante-table-row">
                <span class="producto-nombre">{{ item.nombre }}</span>
                <span>{{ item.cantidad }}</span>
                <span>{{ item.precio.toFixed(2) }} Bs</span>
                <span>{{ (item.precio * item.cantidad).toFixed(2) }} Bs</span>
              </div>
            </div>

            <div class="comprobante-totales">
              <div class="comprobante-row">
                <span>Subtotal:</span>
                <strong>{{ totalSnapshot.toFixed(2) }} Bs</strong>
              </div>
              <div class="comprobante-row">
                <span>Envío:</span>
                <strong>Gratis</strong>
              </div>
              <div class="comprobante-row total">
                <span>TOTAL:</span>
                <strong>{{ totalSnapshot.toFixed(2) }} Bs</strong>
              </div>
            </div>

            <div class="comprobante-metodo">
              <span>Método de pago:</span>
              <strong>{{ formPago.metodoPago === 'tarjeta' ? 'Tarjeta de Crédito/Débito' : formPago.metodoPago === 'transferencia' ? 'Transferencia Bancaria' : 'QR' }}</strong>
            </div>

            <div class="comprobante-footer">
              <p>¡Gracias por tu compra!</p>
              <p class="comprobante-nota">Este documento es un comprobante válido de tu transacción.</p>
            </div>
          </div>

          <div class="confirmation-actions">
            <button @click="imprimirComprobante" class="btn-secondary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
              </svg>
              Imprimir Comprobante
            </button>
            <button @click="volverInicio" class="btn-primary">Volver al Inicio</button>
          </div>
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
              <span class="summary-item-price"
                >{{ (item.precio * item.cantidad).toFixed(2) }} Bs</span
              >
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
        <button v-if="pasoActual > 1" @click="pasoAnterior" class="btn-secondary">Volver</button>
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

.prefilled-notice {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  background: #f0fdf4;
  border: 1px solid #86efac;
  color: #166534;
  font-size: 0.875rem;
  margin-bottom: 24px;
}

.prefilled-notice svg {
  flex-shrink: 0;
  color: #22c55e;
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

.payment-method input[type='radio'] {
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

/* Comprobante de Pago */
.comprobante {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  padding: 40px;
  margin: 30px auto;
  max-width: 600px;
  text-align: left;
}

.comprobante-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #000000;
}

.comprobante-logo {
  font-size: 1.75rem;
  font-weight: 300;
  letter-spacing: 6px;
  margin-bottom: 8px;
}

.comprobante-tipo {
  font-size: 0.75rem;
  letter-spacing: 3px;
  color: #666666;
  text-transform: uppercase;
}

.comprobante-info {
  margin-bottom: 24px;
}

.comprobante-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.875rem;
}

.comprobante-row span {
  color: #666666;
}

.comprobante-row strong {
  color: #000000;
}

.comprobante-productos {
  margin: 24px 0;
}

.comprobante-table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 12px 0;
  border-bottom: 2px solid #000000;
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #666666;
}

.comprobante-table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 14px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.875rem;
  align-items: center;
}

.producto-nombre {
  font-weight: 500;
  color: #000000;
}

.comprobante-totales {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #000000;
}

.comprobante-totales .comprobante-row {
  border-bottom: none;
  padding: 6px 0;
}

.comprobante-totales .comprobante-row.total {
  font-size: 1.125rem;
  padding-top: 12px;
  margin-top: 8px;
  border-top: 1px solid #e5e5e5;
}

.comprobante-metodo {
  margin-top: 20px;
  padding: 16px;
  background: #fafafa;
  border: 1px solid #e5e5e5;
  font-size: 0.875rem;
  display: flex;
  justify-content: space-between;
}

.comprobante-footer {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e5e5e5;
}

.comprobante-footer p {
  font-size: 1rem;
  margin-bottom: 8px;
  color: #000000;
}

.comprobante-nota {
  font-size: 0.75rem !important;
  color: #999999 !important;
}

.confirmation-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 30px;
}

.confirmation-actions .btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
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

/* QR Payment Form */
.qr-form {
  display: flex;
  justify-content: center;
}

.qr-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.qr-image {
  width: 200px;
  height: 200px;
  border: 2px solid #e5e5e5;
  padding: 10px;
  background: #ffffff;
}

.qr-instruction {
  font-size: 0.875rem;
  color: #666666;
  text-align: center;
  margin: 0;
  letter-spacing: 0.3px;
}
</style>
