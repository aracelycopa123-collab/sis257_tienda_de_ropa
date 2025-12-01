<script setup lang="ts">
import { ref, computed } from 'vue'

interface Producto {
  id: number
  nombre: string
  imagenes: string
}

interface VentaDetalle {
  id: number
  cantidad: number
  precioUnitario: number
  subtotal: number
  producto: Producto
}

interface Cliente {
  id: number
  nombre: string
  apellido: string
  telefono?: string
  direccion?: string
}

interface Venta {
  id: number
  totalVenta: number
  metodoPago: string
  estado: string
  fechaCreacion: string
  montoPagado: number | null
  cambio: number | null
  cliente: Cliente
  ventadetalles: VentaDetalle[]
}

interface Props {
  venta: Venta | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const formatearFecha = (fecha: string): string => {
  const date = new Date(fecha)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getMetodoPagoLabel = (metodo: string): string => {
  const metodos: Record<string, string> = {
    tarjeta: 'Tarjeta de Crédito/Débito',
    transferencia: 'Transferencia Bancaria',
    qr: 'Código QR',
    cotización: 'Cotización',
    otro: 'Otro',
  }
  return metodos[metodo] || metodo
}

const getEstadoClass = (estado: string): string => {
  const estados: Record<string, string> = {
    realizada: 'badge-success',
    pendiente: 'badge-warning',
    anulada: 'badge-danger',
    cancelada: 'badge-danger',
  }
  return estados[estado] || 'badge-default'
}

const getEstadoLabel = (estado: string): string => {
  const labels: Record<string, string> = {
    realizada: 'Confirmada',
    pendiente: 'Pendiente',
    anulada: 'Anulada',
    cancelada: 'Cancelada',
  }
  return labels[estado] || estado
}

const cantidadTotalProductos = computed(() => {
  if (!props.venta?.ventadetalles) return 0
  return props.venta.ventadetalles.reduce((total, detalle) => total + detalle.cantidad, 0)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="venta" class="modal-overlay" @click="emit('close')">
        <div class="modal-container" @click.stop>
          <!-- Header -->
          <div class="modal-header">
            <div class="header-content">
              <h2 class="modal-title">Detalle de Venta #{{ venta.id }}</h2>
              <p class="modal-subtitle">{{ formatearFecha(venta.fechaCreacion) }}</p>
            </div>
            <button @click="emit('close')" class="btn-close">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path d="M15 5L5 15M5 5l10 10" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <!-- Información del Cliente -->
            <section class="info-section">
              <h3 class="section-title">Información del Cliente</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Nombre</span>
                  <span class="info-value"
                    >{{ venta.cliente.nombre }} {{ venta.cliente.apellido }}</span
                  >
                </div>
                <div class="info-item" v-if="venta.cliente.telefono">
                  <span class="info-label">Teléfono</span>
                  <span class="info-value">{{ venta.cliente.telefono }}</span>
                </div>
                <div class="info-item full-width" v-if="venta.cliente.direccion">
                  <span class="info-label">Dirección</span>
                  <span class="info-value">{{ venta.cliente.direccion }}</span>
                </div>
              </div>
            </section>

            <!-- Información de Pago -->
            <section class="info-section">
              <h3 class="section-title">Información de Pago</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Método de Pago</span>
                  <span class="info-value">{{ getMetodoPagoLabel(venta.metodoPago) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Estado</span>
                  <span :class="['badge', getEstadoClass(venta.estado)]">
                    {{ getEstadoLabel(venta.estado) }}
                  </span>
                </div>
                <div class="info-item" v-if="venta.montoPagado !== null">
                  <span class="info-label">Monto Pagado</span>
                  <span class="info-value">{{ Number(venta.montoPagado).toFixed(2) }} Bs</span>
                </div>
                <div class="info-item" v-if="venta.cambio !== null && venta.cambio > 0">
                  <span class="info-label">Cambio</span>
                  <span class="info-value">{{ Number(venta.cambio).toFixed(2) }} Bs</span>
                </div>
              </div>
            </section>

            <!-- Productos -->
            <section class="info-section products-section">
              <h3 class="section-title">Productos ({{ cantidadTotalProductos }} items)</h3>
              <div v-if="venta.ventadetalles && venta.ventadetalles.length > 0" class="products-list">
                <article
                  v-for="detalle in venta.ventadetalles"
                  :key="detalle.id"
                  class="product-card"
                >
                  <div class="product-image">
                    <img :src="detalle.producto.imagenes" :alt="detalle.producto.nombre" />
                  </div>
                  <div class="product-info">
                    <h4 class="product-name">{{ detalle.producto.nombre }}</h4>
                    <div class="product-details">
                      <span class="product-qty">Cantidad: {{ detalle.cantidad }}</span>
                      <span class="product-separator">·</span>
                      <span class="product-price"
                        >{{ Number(detalle.precioUnitario).toFixed(2) }} Bs c/u</span
                      >
                    </div>
                  </div>
                  <div class="product-subtotal">{{ Number(detalle.subtotal).toFixed(2) }} Bs</div>
                </article>
              </div>
              <div v-else class="no-products">
                <span>No hay detalles de productos disponibles</span>
              </div>
            </section>

            <!-- Total -->
            <section class="total-section">
              <div class="total-row">
                <span class="total-label">Total de la Venta</span>
                <span class="total-value">{{ Number(venta.totalVenta).toFixed(2) }} Bs</span>
              </div>
            </section>
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <button @click="emit('close')" class="btn-secondary">Cerrar</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Reset para el modal */
.modal-container *,
.modal-container *::before,
.modal-container *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.modal-container h1, .modal-container h2, .modal-container h3, 
.modal-container h4, .modal-container h5, .modal-container h6,
.modal-container p, .modal-container span {
  margin: 0;
  padding: 0;
}

/* Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  overflow-y: auto;
}

/* Container */
.modal-container {
  background: #ffffff;
  width: 100%;
  max-width: 700px;
  max-height: 85vh;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e5e5;
}

.header-content {
  flex: 1;
}

.modal-title {
  font-size: 1.1rem;
  font-weight: 500;
  color: #000;
  margin: 0 0 2px 0;
}

.modal-subtitle {
  font-size: 0.75rem;
  color: #888;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #999999;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  margin-left: 20px;
}

.btn-close:hover {
  color: #000000;
}

/* Body */
.modal-body {
  overflow-y: auto;
  padding: 12px 20px;
  max-height: 55vh;
}

.modal-body * {
  box-sizing: border-box;
}

/* Info Sections */
.info-section {
  display: block;
  margin: 0 0 10px 0;
  padding: 0 0 10px 0;
  border-bottom: 1px solid #eee;
}

.info-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-title {
  display: block;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #888;
  margin: 0 0 6px 0;
  padding: 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px 12px;
  margin: 0;
  padding: 0;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 1px;
  margin: 0;
  padding: 0;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 0.65rem;
  color: #999;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  margin: 0;
  padding: 0;
}

.info-value {
  font-size: 0.875rem;
  color: #000;
  font-weight: 400;
  line-height: 1.3;
  margin: 0;
  padding: 0;
}

/* Badge */
.badge {
  display: inline-block;
  padding: 3px 8px;
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  border-radius: 3px;
  width: fit-content;
}

.badge-success {
  background: #e8f5e9;
  color: #2e7d32;
}

.badge-danger {
  background: #ffebee;
  color: #c62828;
}

.badge-warning {
  background: #fff8e1;
  color: #f57c00;
}

.badge-default {
  background: #f5f5f5;
  color: #666666;
}

/* Products */
.products-section {
  margin-bottom: 10px;
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-card {
  display: grid;
  grid-template-columns: 50px 1fr auto;
  gap: 10px;
  padding: 10px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
}

.product-card:hover {
  background: #f5f5f5;
}

.product-image {
  width: 50px;
  height: 60px;
  background: #ffffff;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
}

.product-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: #000;
  margin: 0;
}

.product-details {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #666;
}

.product-separator {
  color: #ccc;
}

.product-qty {
  color: #666;
}

.product-price {
  color: #999;
}

.product-subtotal {
  font-size: 0.85rem;
  font-weight: 600;
  color: #000;
  display: flex;
  align-items: center;
}

/* No products message */
.no-products {
  padding: 14px;
  background: #f9f9f9;
  border: 1px dashed #ddd;
  text-align: center;
  color: #999;
  font-size: 0.8rem;
}

/* Total Section */
.total-section {
  padding: 12px 14px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  margin-top: 10px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #666;
}

.total-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #000;
}

/* Footer */
.modal-footer {
  padding: 14px 24px;
  border-top: 1px solid #e5e5e5;
  display: flex;
  justify-content: flex-end;
}

.btn-secondary {
  background: #000;
  color: #fff;
  border: none;
  padding: 10px 24px;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-secondary:hover {
  background: #333;
}

/* Animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container {
  transform: scale(0.95);
}

.modal-leave-to .modal-container {
  transform: scale(0.95);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-container {
    max-height: 95vh;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 20px 24px;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .product-card {
    grid-template-columns: 60px 1fr;
    gap: 12px;
  }

  .product-image {
    width: 60px;
    height: 75px;
  }

  .product-subtotal {
    grid-column: 2;
    justify-content: flex-end;
    margin-top: 8px;
  }

  .total-value {
    font-size: 1.25rem;
  }
}
</style>
