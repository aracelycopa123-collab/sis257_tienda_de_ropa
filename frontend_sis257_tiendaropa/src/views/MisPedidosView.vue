<script setup lang="ts">
import { ref, onMounted } from 'vue'
import http from '@/plugins/axios'

interface VentaDetalle {
  id: number
  cantidad: number
  precioUnitario: number
  subtotal: number
  producto: {
    id: number
    nombre: string
    imagenes: string
  }
}

interface Venta {
  id: number
  fechaCreacion: string
  totalVenta: number
  metodoPago: string
  estado: string
  numeroSeguimiento: string | null
  fechaConfirmacion: string | null
  fechaEnvio: string | null
  fechaEntrega: string | null
  ventadetalles: VentaDetalle[]
}

const pedidos = ref<Venta[]>([])
const cargando = ref(true)
const error = ref('')
const pedidoExpandido = ref<number | null>(null)

// Estados del pedido en orden
const estadosPedido = [
  { key: 'pendiente', label: 'Pedido Recibido', icon: '📦' },
  { key: 'confirmado', label: 'Confirmado', icon: '✓' },
  { key: 'en_preparacion', label: 'En Preparación', icon: '👔' },
  { key: 'enviado', label: 'Enviado', icon: '🚚' },
  { key: 'entregado', label: 'Entregado', icon: '🏠' }
]

onMounted(async () => {
  await cargarPedidos()
})

const cargarPedidos = async () => {
  try {
    cargando.value = true
    error.value = ''
    
    const { data } = await http.get('ventas/mis-pedidos')
    pedidos.value = data.sort((a: Venta, b: Venta) => 
      new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
    )
  } catch (err: any) {
    console.error('Error al cargar pedidos:', err)
    error.value = 'No se pudieron cargar tus pedidos'
  } finally {
    cargando.value = false
  }
}

const toggleDetalle = (id: number) => {
  pedidoExpandido.value = pedidoExpandido.value === id ? null : id
}

const formatFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatFechaCorta = (fecha: string | null) => {
  if (!fecha) return null
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getMetodoPagoLabel = (metodo: string) => {
  const labels: Record<string, string> = {
    tarjeta: 'Tarjeta de Crédito/Débito',
    transferencia: 'Transferencia Bancaria',
    qr: 'Pago QR',
    efectivo: 'Efectivo'
  }
  return labels[metodo] || metodo
}

const totalProductos = (detalles: VentaDetalle[]) => {
  return detalles.reduce((sum, d) => sum + d.cantidad, 0)
}

// Obtener el índice del estado actual
const getEstadoIndex = (estado: string) => {
  if (estado === 'anulada') return -1
  const index = estadosPedido.findIndex(e => e.key === estado)
  return index >= 0 ? index : 0
}

// Verificar si un paso está completado
const isPasoCompletado = (pedido: Venta, pasoKey: string) => {
  const estadoActualIndex = getEstadoIndex(pedido.estado)
  const pasoIndex = estadosPedido.findIndex(e => e.key === pasoKey)
  return pasoIndex <= estadoActualIndex
}

// Verificar si un paso es el actual
const isPasoActual = (pedido: Venta, pasoKey: string) => {
  return pedido.estado === pasoKey
}

// Obtener fecha para un paso específico
const getFechaPaso = (pedido: Venta, pasoKey: string): string | null => {
  switch (pasoKey) {
    case 'pendiente':
      return pedido.fechaCreacion
    case 'confirmado':
      return pedido.fechaConfirmacion
    case 'enviado':
      return pedido.fechaEnvio
    case 'entregado':
      return pedido.fechaEntrega
    default:
      return null
  }
}

// Obtener clase de estado para badge
const getEstadoClass = (estado: string) => {
  const clases: Record<string, string> = {
    pendiente: 'estado-pendiente',
    confirmado: 'estado-confirmado',
    en_preparacion: 'estado-preparacion',
    enviado: 'estado-enviado',
    entregado: 'estado-entregado',
    anulada: 'estado-anulada'
  }
  return clases[estado] || 'estado-pendiente'
}

const getEstadoLabel = (estado: string) => {
  const labels: Record<string, string> = {
    pendiente: 'Pendiente',
    confirmado: 'Confirmado',
    en_preparacion: 'En Preparación',
    enviado: 'Enviado',
    entregado: 'Entregado',
    anulada: 'Anulado'
  }
  return labels[estado] || estado
}
</script>

<template>
  <div class="mis-pedidos-page">
    <div class="container py-5">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">Mis Pedidos</h1>
        <p class="page-subtitle">Realiza el seguimiento de tus compras</p>
      </div>

      <!-- Loading -->
      <div v-if="cargando" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando tus pedidos...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
        </svg>
        <p>{{ error }}</p>
        <button @click="cargarPedidos" class="btn-retry">Reintentar</button>
      </div>

      <!-- Sin pedidos -->
      <div v-else-if="pedidos.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
          <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l1.25 5h8.22l1.25-5H3.14zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/>
        </svg>
        <h3>No tienes pedidos aún</h3>
        <p>Cuando realices una compra, aparecerá aquí</p>
        <router-link to="/" class="btn-shop">Ir a comprar</router-link>
      </div>

      <!-- Lista de pedidos -->
      <div v-else class="pedidos-list">
        <div 
          v-for="pedido in pedidos" 
          :key="pedido.id" 
          class="pedido-card"
          :class="{ expanded: pedidoExpandido === pedido.id, 'pedido-anulado': pedido.estado === 'anulada' }"
        >
          <!-- Header del pedido -->
          <div class="pedido-header" @click="toggleDetalle(pedido.id)">
            <div class="pedido-info">
              <div class="pedido-numero-row">
                <span class="pedido-numero">Pedido #{{ pedido.id }}</span>
                <span class="pedido-estado" :class="getEstadoClass(pedido.estado)">
                  {{ getEstadoLabel(pedido.estado) }}
                </span>
              </div>
              <span class="pedido-fecha">{{ formatFecha(pedido.fechaCreacion) }}</span>
            </div>
            <div class="pedido-resumen">
              <span class="pedido-items">{{ totalProductos(pedido.ventadetalles) }} producto(s)</span>
              <span class="pedido-total">{{ Number(pedido.totalVenta).toFixed(2) }} Bs</span>
            </div>
            <div class="pedido-toggle">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                fill="currentColor" 
                viewBox="0 0 16 16"
                :class="{ rotated: pedidoExpandido === pedido.id }"
              >
                <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
              </svg>
            </div>
          </div>

          <!-- Detalles del pedido -->
          <div v-if="pedidoExpandido === pedido.id" class="pedido-detalles">
            
            <!-- TRACKING TIMELINE -->
            <div v-if="pedido.estado !== 'anulada'" class="tracking-section">
              <h4 class="tracking-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
                Seguimiento del Pedido
              </h4>
              
              <!-- Número de seguimiento si existe -->
              <div v-if="pedido.numeroSeguimiento" class="tracking-number">
                <span class="label">N° de Seguimiento:</span>
                <span class="value">{{ pedido.numeroSeguimiento }}</span>
              </div>

              <!-- Timeline de estados -->
              <div class="tracking-timeline">
                <div 
                  v-for="(paso, index) in estadosPedido" 
                  :key="paso.key"
                  class="timeline-step"
                  :class="{
                    'step-completed': isPasoCompletado(pedido, paso.key),
                    'step-current': isPasoActual(pedido, paso.key),
                    'step-pending': !isPasoCompletado(pedido, paso.key)
                  }"
                >
                  <!-- Línea conectora -->
                  <div v-if="index > 0" class="timeline-line" :class="{ 'line-completed': isPasoCompletado(pedido, paso.key) }"></div>
                  
                  <!-- Círculo del paso -->
                  <div class="step-circle">
                    <span v-if="isPasoCompletado(pedido, paso.key) && !isPasoActual(pedido, paso.key)" class="step-check">✓</span>
                    <span v-else class="step-icon">{{ paso.icon }}</span>
                  </div>
                  
                  <!-- Info del paso -->
                  <div class="step-info">
                    <span class="step-label">{{ paso.label }}</span>
                    <span v-if="getFechaPaso(pedido, paso.key)" class="step-date">
                      {{ formatFechaCorta(getFechaPaso(pedido, paso.key)) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Mensaje de estado actual -->
              <div class="tracking-message">
                <template v-if="pedido.estado === 'pendiente'">
                  <span class="message-icon">⏳</span>
                  <span>Tu pedido está siendo procesado. Te notificaremos cuando sea confirmado.</span>
                </template>
                <template v-else-if="pedido.estado === 'confirmado'">
                  <span class="message-icon">✅</span>
                  <span>¡Pedido confirmado! Estamos preparando tu paquete.</span>
                </template>
                <template v-else-if="pedido.estado === 'en_preparacion'">
                  <span class="message-icon">👔</span>
                  <span>Estamos seleccionando y empacando tus productos con cuidado.</span>
                </template>
                <template v-else-if="pedido.estado === 'enviado'">
                  <span class="message-icon">🚚</span>
                  <span>¡Tu pedido está en camino! Pronto llegará a tu dirección.</span>
                </template>
                <template v-else-if="pedido.estado === 'entregado'">
                  <span class="message-icon">🎉</span>
                  <span>¡Pedido entregado! Gracias por tu compra.</span>
                </template>
              </div>
            </div>

            <!-- Mensaje de pedido anulado -->
            <div v-else class="anulado-message">
              <span class="anulado-icon">❌</span>
              <div class="anulado-info">
                <strong>Pedido Anulado</strong>
                <p>Este pedido ha sido cancelado y no será procesado.</p>
              </div>
            </div>

            <!-- Productos -->
            <div class="detalles-productos">
              <h4 class="productos-title">Productos del pedido</h4>
              <div 
                v-for="detalle in pedido.ventadetalles" 
                :key="detalle.id" 
                class="detalle-item"
              >
                <img 
                  :src="detalle.producto?.imagenes || '/placeholder.jpg'" 
                  :alt="detalle.producto?.nombre"
                  class="detalle-imagen"
                />
                <div class="detalle-info">
                  <p class="detalle-nombre">{{ detalle.producto?.nombre || 'Producto' }}</p>
                  <p class="detalle-cantidad">Cantidad: {{ detalle.cantidad }}</p>
                </div>
                <div class="detalle-precio">
                  <span class="precio-unitario">{{ Number(detalle.precioUnitario).toFixed(2) }} Bs c/u</span>
                  <span class="precio-subtotal">{{ Number(detalle.subtotal).toFixed(2) }} Bs</span>
                </div>
              </div>
            </div>

            <div class="detalles-footer">
              <div class="metodo-pago">
                <span class="label">Método de pago:</span>
                <span class="value">{{ getMetodoPagoLabel(pedido.metodoPago) }}</span>
              </div>
              <div class="total-final">
                <span class="label">Total:</span>
                <span class="value">{{ Number(pedido.totalVenta).toFixed(2) }} Bs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mis-pedidos-page {
  min-height: calc(100vh - 200px);
  background: #f8f9fa;
  padding-top: 80px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: 2px;
  color: #000;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 1rem;
  color: #666;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e5e5;
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #666;
  text-align: center;
}

.error-state svg {
  color: #dc3545;
  margin-bottom: 16px;
}

.btn-retry {
  margin-top: 16px;
  padding: 12px 24px;
  background: #000;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.2s;
}

.btn-retry:hover {
  background: #333;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-state svg {
  color: #ccc;
  margin-bottom: 24px;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.empty-state p {
  color: #666;
  margin-bottom: 24px;
}

.btn-shop {
  padding: 14px 32px;
  background: #000;
  color: #fff;
  text-decoration: none;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
  transition: background 0.2s;
}

.btn-shop:hover {
  background: #333;
  color: #fff;
}

/* Pedidos List */
.pedidos-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 900px;
  margin: 0 auto;
}

.pedido-card {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  transition: box-shadow 0.2s;
  overflow: hidden;
}

.pedido-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.pedido-card.pedido-anulado {
  opacity: 0.7;
  border-color: #dc3545;
}

.pedido-header {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  align-items: center;
  padding: 20px 24px;
  cursor: pointer;
  gap: 16px;
}

.pedido-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.pedido-numero-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.pedido-numero {
  font-weight: 600;
  color: #000;
  font-size: 1rem;
}

.pedido-estado {
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.estado-pendiente {
  background: #fff3cd;
  color: #856404;
}

.estado-confirmado {
  background: #cce5ff;
  color: #004085;
}

.estado-preparacion {
  background: #e2e3e5;
  color: #383d41;
}

.estado-enviado {
  background: #d4edda;
  color: #155724;
}

.estado-entregado {
  background: #28a745;
  color: #fff;
}

.estado-anulada {
  background: #f8d7da;
  color: #721c24;
}

.pedido-fecha {
  font-size: 0.8125rem;
  color: #666;
}

.pedido-resumen {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.pedido-items {
  font-size: 0.8125rem;
  color: #666;
}

.pedido-total {
  font-weight: 600;
  font-size: 1.125rem;
  color: #000;
}

.pedido-toggle svg {
  transition: transform 0.2s;
  color: #666;
}

.pedido-toggle svg.rotated {
  transform: rotate(180deg);
}

/* Detalles */
.pedido-detalles {
  border-top: 1px solid #e5e5e5;
  padding: 24px;
  background: #fafafa;
}

/* TRACKING SECTION */
.tracking-section {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
}

.tracking-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.tracking-number {
  background: #f0f0f0;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tracking-number .label {
  color: #666;
  font-size: 0.875rem;
}

.tracking-number .value {
  font-weight: 600;
  color: #000;
  font-family: monospace;
  font-size: 0.95rem;
  letter-spacing: 1px;
}

/* TIMELINE */
.tracking-timeline {
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 20px 0;
  margin-bottom: 20px;
}

.timeline-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
  z-index: 1;
}

.timeline-line {
  position: absolute;
  top: 20px;
  left: -50%;
  width: 100%;
  height: 3px;
  background: #e0e0e0;
  z-index: 0;
}

.timeline-line.line-completed {
  background: #28a745;
}

.step-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  background: #e0e0e0;
  color: #999;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.step-completed .step-circle {
  background: #28a745;
  color: #fff;
}

.step-current .step-circle {
  background: #007bff;
  color: #fff;
  box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.25);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.25); }
  50% { box-shadow: 0 0 0 8px rgba(0, 123, 255, 0.15); }
}

.step-check {
  font-weight: bold;
}

.step-info {
  text-align: center;
  margin-top: 12px;
}

.step-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: #666;
  margin-bottom: 4px;
}

.step-current .step-label {
  color: #007bff;
  font-weight: 600;
}

.step-completed .step-label {
  color: #28a745;
}

.step-date {
  display: block;
  font-size: 0.7rem;
  color: #999;
}

/* Mensaje de tracking */
.tracking-message {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8f9fa;
  padding: 16px;
  border-radius: 6px;
  border-left: 4px solid #007bff;
}

.tracking-message .message-icon {
  font-size: 1.5rem;
}

.tracking-message span:last-child {
  color: #333;
  font-size: 0.9rem;
}

/* Mensaje anulado */
.anulado-message {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #f8d7da;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
  border-left: 4px solid #dc3545;
}

.anulado-icon {
  font-size: 2rem;
}

.anulado-info strong {
  display: block;
  color: #721c24;
  margin-bottom: 4px;
}

.anulado-info p {
  margin: 0;
  color: #856404;
  font-size: 0.875rem;
}

/* Productos */
.productos-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.detalles-productos {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.detalle-item {
  display: grid;
  grid-template-columns: 60px 1fr auto;
  gap: 16px;
  align-items: center;
  padding: 12px;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
}

.detalle-imagen {
  width: 60px;
  height: 60px;
  object-fit: cover;
  background: #f5f5f5;
  border-radius: 4px;
}

.detalle-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detalle-nombre {
  font-weight: 500;
  color: #000;
  margin: 0;
  font-size: 0.9375rem;
}

.detalle-cantidad {
  font-size: 0.8125rem;
  color: #666;
  margin: 0;
}

.detalle-precio {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.precio-unitario {
  font-size: 0.75rem;
  color: #999;
}

.precio-subtotal {
  font-weight: 600;
  color: #000;
}

.detalles-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #e5e5e5;
}

.metodo-pago,
.total-final {
  display: flex;
  gap: 8px;
}

.metodo-pago .label,
.total-final .label {
  color: #666;
  font-size: 0.875rem;
}

.metodo-pago .value {
  color: #000;
  font-size: 0.875rem;
}

.total-final .value {
  font-weight: 700;
  font-size: 1.125rem;
  color: #000;
}

/* Responsive */
@media (max-width: 768px) {
  .pedido-header {
    grid-template-columns: 1fr auto;
    gap: 12px;
  }

  .pedido-resumen {
    display: none;
  }

  .tracking-timeline {
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
  }

  .timeline-step {
    flex-direction: row;
    align-items: center;
    gap: 16px;
    padding: 12px 0;
  }

  .timeline-line {
    top: 0;
    left: 21px;
    width: 3px;
    height: 100%;
  }

  .step-circle {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .step-info {
    text-align: left;
    margin-top: 0;
  }

  .detalle-item {
    grid-template-columns: 50px 1fr;
  }

  .detalle-precio {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 8px;
  }

  .detalles-footer {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>
