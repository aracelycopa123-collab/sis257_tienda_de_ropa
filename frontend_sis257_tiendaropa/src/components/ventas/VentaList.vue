<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
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
const busqueda = ref('')
const openDropdownId = ref<number | null>(null)

// Filtrar ventas por búsqueda
const ventasFiltradas = computed(() => {
  if (!busqueda.value.trim()) return ventas.value
  const termino = busqueda.value.toLowerCase().trim()
  return ventas.value.filter(venta => {
    const nombreCliente = getNombreCliente(venta).toLowerCase()
    const estadoLabel = getEstadoLabel(venta.estado).toLowerCase()
    const metodoPagoLabel = getMetodoPagoLabel(venta.metodoPago).toLowerCase()
    return (
      venta.id.toString().includes(termino) ||
      nombreCliente.includes(termino) ||
      estadoLabel.includes(termino) ||
      metodoPagoLabel.includes(termino) ||
      venta.totalVenta.toString().includes(termino)
    )
  })
})

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
    minute: '2-digit',
  })
}

const getEstadoClass = (estado: string): string => {
  const estados: Record<string, string> = {
    pendiente: 'badge-warning',
    confirmado: 'badge-info',
    en_preparacion: 'badge-preparation',
    enviado: 'badge-shipped',
    entregado: 'badge-success',
    anulada: 'badge-danger',
    cancelada: 'badge-danger',
  }
  return estados[estado] || 'badge-default'
}

const getEstadoLabel = (estado: string): string => {
  const labels: Record<string, string> = {
    pendiente: 'Pendiente',
    confirmado: 'Confirmado',
    en_preparacion: 'En Preparación',
    enviado: 'Enviado',
    entregado: 'Entregado',
    anulada: 'Anulada',
    cancelada: 'Cancelada',
  }
  return labels[estado] || estado
}

const getMetodoPagoLabel = (metodo: string): string => {
  const metodos: Record<string, string> = {
    tarjeta: 'Tarjeta',
    transferencia: 'Transferencia',
    qr: 'QR',
    cotización: 'Cotización',
    otro: 'Otro',
  }
  return metodos[metodo] || metodo
}

const abrirDetalle = (venta: Venta) => {
  ventaSeleccionada.value = venta
}

const cerrarDetalle = () => {
  ventaSeleccionada.value = null
}

const cambiarEstado = async (venta: Venta, nuevoEstado: string) => {
  console.log('cambiarEstado called for', venta.id, nuevoEstado)
  try {
    const confirmMsg = `¿Confirmas cambiar el estado de la venta #${venta.id} a "${nuevoEstado}"?`;
    if (!confirm(confirmMsg)) return;
    // Llamada al endpoint dedicado para actualizar el estado (protegido para administradores)
    await http.patch(`ventas/${venta.id}/estado`, { estado: nuevoEstado })
    // recargar lista
    await cargarVentas()
    alert('Estado actualizado correctamente')
  } catch (err: any) {
    console.error('Error actualizando estado:', err)
    // mostrar mensaje más informativo si viene del servidor
    const msg = (err as any)?.response?.data?.message || 'Error al actualizar el estado. Revisa la consola del servidor.'
    alert(msg)
  }
}

const toggleDropdown = (id: number) => {
  console.log('toggleDropdown', id, 'current', openDropdownId.value)
  openDropdownId.value = openDropdownId.value === id ? null : id
}

// Cerrar dropdown si clic fuera
if (typeof window !== 'undefined') {
  window.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.status-dropdown')) {
      openDropdownId.value = null
    }
  })
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

    <!-- Barra de búsqueda -->
    <div class="search-bar">
      <div class="search-input-wrapper">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          v-model="busqueda"
          type="text"
          class="search-input"
          placeholder="Buscar venta (cliente, estado, método de pago...)"
        />
        <button v-if="busqueda" @click="busqueda = ''" class="search-clear">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
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
          <tr v-for="venta in ventasFiltradas" :key="venta.id">
            <td>
              <span class="id-badge">#{{ venta.id }}</span>
            </td>
            <td>
              <div class="cliente-info">
                <div class="cliente-avatar">
                  {{ getNombreCliente(venta).charAt(0).toUpperCase() }}
                </div>
                <span class="fw-medium">{{ getNombreCliente(venta) }}</span>
              </div>
            </td>
            <td>
              <div class="date-info">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                {{ formatearFecha(venta.fechaCreacion) }}
              </div>
            </td>
            <td>
              <span class="payment-badge">
                <svg v-if="venta.metodoPago === 'tarjeta'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                <svg v-else-if="venta.metodoPago === 'qr'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                  <rect x="14" y="14" width="4" height="4"/>
                </svg>
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                  <path d="M12 18V6"/>
                </svg>
                {{ getMetodoPagoLabel(venta.metodoPago) }}
              </span>
            </td>
            <td>
              <span :class="['status-badge', getEstadoClass(venta.estado)]">
                <span class="status-dot"></span>
                {{ getEstadoLabel(venta.estado) }}
              </span>
            </td>
            <td class="price-cell">
              <span class="price">{{ Number(venta.totalVenta).toFixed(2) }}</span>
              <span class="currency">Bs</span>
            </td>
            <td>
              <span class="items-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                {{ venta.ventadetalles?.length || 0 }} items
              </span>
            </td>
            <td class="actions-cell">
              <div class="actions-wrapper">
                <button @click="abrirDetalle(venta)" class="btn-icon btn-view" title="Ver detalle">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
                <div :class="['status-dropdown', { open: openDropdownId === venta.id }]">
                  <button @click.stop="toggleDropdown(venta.id)" class="btn-icon btn-status" title="Cambiar estado">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="1"/>
                      <circle cx="19" cy="12" r="1"/>
                      <circle cx="5" cy="12" r="1"/>
                    </svg>
                  </button>
                  <div class="dropdown-menu">
                    <div class="dropdown-header">Cambiar estado</div>
                    <button v-if="venta.estado === 'pendiente'" @click.prevent="cambiarEstado(venta, 'confirmado')">
                      <span class="dropdown-dot confirmed"></span> Confirmar pago
                    </button>
                    <button v-if="venta.estado === 'confirmado'" @click.prevent="cambiarEstado(venta, 'en_preparacion')">
                      <span class="dropdown-dot preparation"></span> En preparación
                    </button>
                    <button v-if="venta.estado === 'en_preparacion'" @click.prevent="cambiarEstado(venta, 'enviado')">
                      <span class="dropdown-dot shipped"></span> Marcar enviado
                    </button>
                    <button v-if="venta.estado === 'enviado'" @click.prevent="cambiarEstado(venta, 'entregado')">
                      <span class="dropdown-dot success"></span> Marcar entregado
                    </button>
                    <div class="dropdown-divider" v-if="venta.estado !== 'anulada' && venta.estado !== 'entregado'"></div>
                    <button v-if="venta.estado !== 'anulada' && venta.estado !== 'entregado'" @click.prevent="cambiarEstado(venta, 'anulada')" class="danger">
                      <span class="dropdown-dot danger"></span> Anular venta
                    </button>
                  </div>
                </div>
              </div>
            </td>
          </tr>
          <tr v-if="ventasFiltradas.length === 0 && busqueda">
            <td colspan="8" class="empty-state">
              <div class="empty-content">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <p class="empty-message">No se encontraron resultados para "{{ busqueda }}"</p>
              </div>
            </td>
          </tr>
          <tr v-if="ventas.length === 0 && !busqueda">
            <td colspan="8" class="empty-state">
              <div class="empty-content">
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

      <!-- Contador de registros -->
      <div class="table-footer">
        <span class="records-count">
          Mostrando {{ ventasFiltradas.length }} de {{ ventas.length }} registros
        </span>
      </div>
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
  margin-bottom: 0;
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

/* Search Bar */
.search-bar {
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
}

.search-input-wrapper {
  position: relative;
  max-width: 450px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 44px;
  padding: 0 40px 0 44px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #333;
  background: #fafafa;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #000;
  background: #fff;
}

.search-input::placeholder {
  color: #aaa;
}

.search-clear {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.search-clear:hover {
  color: #333;
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
  border: 2px solid #e5e5e5;
  border-top-color: #667eea;
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
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.data-table thead {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.data-table th {
  padding: 16px 14px;
  text-align: left;
  font-weight: 600;
  font-size: 0.7rem;
  color: #495057;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 2px solid #dee2e6;
}

.data-table tbody tr {
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.data-table tbody tr:hover {
  background: linear-gradient(135deg, #f8f9fa 0%, #fff 100%);
  transform: scale(1.005);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.data-table td {
  padding: 16px 14px;
  color: #000000;
  vertical-align: middle;
}

.id-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 42px;
  padding: 4px 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 20px;
}

.cliente-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cliente-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.85rem;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.data-table tbody tr:hover .cliente-avatar {
  transform: scale(1.1);
}

.fw-medium {
  font-weight: 600;
  color: #1a1a1a;
}

.date-info {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 0.8rem;
}

.date-info svg {
  color: #adb5bd;
}

.payment-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
  color: #495057;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 20px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 20px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.badge-success {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  color: #2e7d32;
}

.badge-success .status-dot {
  background: #4caf50;
}

.badge-danger {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  color: #c62828;
}

.badge-danger .status-dot {
  background: #f44336;
}

.badge-warning {
  background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
  color: #f57f17;
}

.badge-warning .status-dot {
  background: #ffc107;
}

.badge-info {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  color: #1565c0;
}

.badge-info .status-dot {
  background: #2196f3;
}

.badge-preparation {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  color: #e65100;
}

.badge-preparation .status-dot {
  background: #ff9800;
}

.badge-shipped {
  background: linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%);
  color: #303f9f;
}

.badge-shipped .status-dot {
  background: #3f51b5;
}

.badge-default {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  color: #1565c0;
}

.badge-default .status-dot {
  background: #2196f3;
}

.price-cell {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price {
  font-weight: 700;
  font-size: 1rem;
  color: #2e7d32;
}

.currency {
  font-size: 0.7rem;
  color: #666;
  font-weight: 500;
}

.items-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  color: #7b1fa2;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 20px;
}

.actions-cell {
  text-align: center;
}

.actions-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-view {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  color: #1976d2;
}

.btn-view:hover {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4);
}

.btn-status {
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
  color: #616161;
}

.btn-status:hover {
  background: linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%);
}

.status-dropdown {
  position: relative;
  z-index: 200;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 4px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  min-width: 140px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 100;
}

.status-dropdown:hover .dropdown-menu,
.status-dropdown.open .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-header {
  padding: 8px 16px 4px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dropdown-divider {
  height: 1px;
  background: #eee;
  margin: 6px 0;
}

.dropdown-menu button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 16px;
  background: none;
  border: none;
  font-size: 0.8rem;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dropdown-menu button:hover {
  background: #f5f5f5;
}

.dropdown-menu button.danger {
  color: #c62828;
}

.dropdown-menu button.danger:hover {
  background: #ffebee;
}

.dropdown-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dropdown-dot.pending { background: #ffc107; }
.dropdown-dot.confirmed { background: #2196f3; }
.dropdown-dot.preparation { background: #ff9800; }
.dropdown-dot.shipped { background: #3f51b5; }
.dropdown-dot.success { background: #4caf50; }
.dropdown-dot.danger { background: #f44336; }

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px !important;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.empty-content svg {
  color: #bdbdbd;
}

.empty-message {
  font-size: 1rem;
  color: #666666;
  margin: 0;
}

.empty-submessage {
  font-size: 0.875rem;
  color: #999999;
  margin: 0;
}

/* Table Footer */
.table-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}

.records-count {
  font-size: 0.8rem;
  color: #888;
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
    min-width: 900px;
  }
}
</style>
