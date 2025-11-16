<script setup lang="ts">
import { onMounted, ref } from 'vue'
import http from '@/plugins/axios'
import VentaDetalle from './VentaDetalle.vue'

interface Cliente {
  id: number
  nombre: string
  apellido: string
  telefono?: string
  direccion?: string
}

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

const ventas = ref<Venta[]>([])
const loading = ref(true)
const ventaSeleccionada = ref<Venta | null>(null)

const cargarVentas = async () => {
  try {
    loading.value = true
    const { data } = await http.get('ventas')
    // Ordenar por ID de forma descendente (más recientes primero)
    ventas.value = data.sort((a: Venta, b: Venta) => b.id - a.id)
    console.log('Ventas cargadas:', ventas.value)
  } catch (error) {
    console.error('Error al cargar ventas:', error)
  } finally {
    loading.value = false
  }
}

const getNombreCliente = (venta: Venta): string => {
  if (venta.cliente) {
    return `${venta.cliente.nombre} ${venta.cliente.apellido || ''}`.trim()
  }
  return 'Cliente no registrado'
}

const formatearFecha = (fecha: string): string => {
  const date = new Date(fecha)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getEstadoClass = (estado: string): string => {
  const estados: Record<string, string> = {
    'realizada': 'badge-success',
    'pendiente': 'badge-warning',
    'anulada': 'badge-danger',
    'cancelada': 'badge-danger'
  }
  return estados[estado] || 'badge-default'
}

const getEstadoLabel = (estado: string): string => {
  const labels: Record<string, string> = {
    'realizada': 'Confirmada',
    'pendiente': 'Pendiente',
    'anulada': 'Anulada',
    'cancelada': 'Cancelada'
  }
  return labels[estado] || estado
}

const getMetodoPagoLabel = (metodo: string): string => {
  const metodos: Record<string, string> = {
    'efectivo': 'Efectivo',
    'tarjeta': 'Tarjeta',
    'transferencia': 'Transferencia',
    'qr': 'QR',
    'cotización': 'Cotización',
    'otro': 'Otro'
  }
  return metodos[metodo] || metodo
}

const abrirDetalle = (venta: Venta) => {
  ventaSeleccionada.value = venta
}

const cerrarDetalle = () => {
  ventaSeleccionada.value = null
}

onMounted(() => cargarVentas())
</script>

<template>
  <div class="list-container">
    <div class="list-header">
      <div>
        <h1 class="page-title">Ventas</h1>
        <p class="page-subtitle">Historial de ventas realizadas</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p class="loading-text">Cargando ventas...</p>
    </div>

    <!-- Table -->
    <div v-else class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Método de Pago</th>
            <th>Estado</th>
            <th>Total</th>
            <th>Productos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="venta in ventas" :key="venta.id">
            <td class="id-cell">{{ venta.id }}</td>
            <td class="fw-medium">{{ getNombreCliente(venta) }}</td>
            <td class="date-cell">{{ formatearFecha(venta.fechaCreacion) }}</td>
            <td>{{ getMetodoPagoLabel(venta.metodoPago) }}</td>
            <td>
              <span :class="['badge', getEstadoClass(venta.estado)]">
                {{ getEstadoLabel(venta.estado) }}
              </span>
            </td>
            <td class="price">{{ Number(venta.totalVenta).toFixed(2) }} Bs</td>
            <td class="items-cell">{{ venta.ventadetalles?.length || 0 }} items</td>
            <td class="actions-cell">
              <button @click="abrirDetalle(venta)" class="btn-detail" title="Ver detalle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                Ver Detalle
              </button>
            </td>
          </tr>
          <tr v-if="ventas.length === 0">
            <td colspan="8" class="empty-cell">
              <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                </svg>
                <p class="empty-message">No hay ventas registradas</p>
                <p class="empty-submessage">Las ventas realizadas desde el checkout aparecerán aquí</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de Detalle -->
    <VentaDetalle :venta="ventaSeleccionada" @close="cerrarDetalle" />
  </div>
</template>

<style scoped>
.list-container { 
  background: #ffffff; 
  min-height: calc(100vh - 140px); 
}

.list-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: flex-start; 
  padding: 30px 0; 
  border-bottom: 1px solid #e5e5e5; 
  margin-bottom: 30px; 
}

.page-title { 
  font-size: 2rem; 
  font-weight: 300; 
  letter-spacing: -0.5px; 
  color: #000000; 
  margin-bottom: 8px; 
}

.page-subtitle { 
  font-size: 0.875rem; 
  color: #666666; 
  letter-spacing: 0.3px; 
  margin: 0; 
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 16px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 1px solid #e5e5e5;
  border-top-color: #000000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 0.875rem;
  color: #999999;
  letter-spacing: 0.3px;
}

/* Table */
.table-wrapper { 
  overflow-x: auto; 
}

.data-table { 
  width: 100%; 
  border-collapse: collapse; 
  font-size: 0.875rem; 
}

.data-table thead { 
  border-bottom: 1px solid #e5e5e5; 
}

.data-table th { 
  padding: 16px 20px; 
  text-align: left; 
  font-weight: 400; 
  font-size: 0.75rem; 
  color: #666666; 
  text-transform: uppercase; 
  letter-spacing: 1px; 
}

.data-table tbody tr { 
  border-bottom: 1px solid #f5f5f5; 
  transition: background 0.2s ease; 
}

.data-table tbody tr:hover { 
  background: #fafafa; 
}

.data-table td { 
  padding: 20px; 
  color: #000000; 
  vertical-align: middle; 
}

.data-table td.fw-medium { 
  font-weight: 500; 
}

.id-cell {
  font-weight: 500;
  color: #666666;
}

.date-cell {
  font-size: 0.8125rem;
  color: #666666;
}

.items-cell {
  color: #999999;
  font-size: 0.8125rem;
}

.actions-cell {
  text-align: center;
}

.btn-detail {
  background: transparent;
  color: #666666;
  border: 1px solid #e5e5e5;
  padding: 8px 16px;
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-detail:hover {
  background: #000000;
  color: #ffffff;
  border-color: #000000;
}

.btn-detail svg {
  width: 14px;
  height: 14px;
}

.price { 
  font-weight: 500; 
  font-size: 0.9375rem; 
}

/* Badge */
.badge {
  display: inline-block;
  padding: 4px 12px;
  font-size: 0.6875rem;
  font-weight: 400;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border-radius: 2px;
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

/* Empty State */
.empty-cell {
  padding: 0 !important;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  color: #999999;
}

.empty-state svg {
  margin-bottom: 20px;
  opacity: 0.3;
}

.empty-message {
  font-size: 1rem;
  letter-spacing: 0.3px;
  font-weight: 400;
  color: #666666;
  margin: 0 0 8px 0;
}

.empty-submessage {
  font-size: 0.875rem;
  color: #999999;
  letter-spacing: 0.3px;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) { 
  .page-title { 
    font-size: 1.5rem; 
  }
  
  .table-wrapper {
    overflow-x: scroll;
  }
  
  .data-table {
    min-width: 800px;
  }
}
</style>
