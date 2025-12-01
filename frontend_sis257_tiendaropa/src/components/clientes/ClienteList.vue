<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import type { Cliente } from '@/models/cliente'
import http from '@/plugins/axios'
import ClienteSave from './ClienteSave.vue'

const clientes = ref<Cliente[]>([])
const showModal = ref(false)
const clienteSeleccionado = ref<Cliente | undefined>(undefined)
const busqueda = ref('')

// Filtrar clientes por búsqueda
const clientesFiltrados = computed(() => {
  if (!busqueda.value.trim()) return clientes.value
  const termino = busqueda.value.toLowerCase().trim()
  return clientes.value.filter(cli => 
    cli.nombre?.toLowerCase().includes(termino) ||
    cli.apellido?.toLowerCase().includes(termino) ||
    cli.telefono?.toLowerCase().includes(termino) ||
    cli.direccion?.toLowerCase().includes(termino) ||
    cli.id.toString().includes(termino)
  )
})

const cargarClientes = async () => {
  try {
    const { data } = await http.get('clientes')
    // Ordenar por ID de forma ascendente
    clientes.value = data.sort((a: Cliente, b: Cliente) => a.id - b.id)
  } catch (error) {
    console.error('Error al cargar clientes:', error)
  }
}

const eliminarCliente = async (id: number) => {
  if (confirm('¿Está seguro de eliminar este cliente?')) {
    try {
      await http.delete(`clientes/${id}`)
      await cargarClientes()
    } catch (error) {
      console.error('Error al eliminar cliente:', error)
      alert('No se pudo eliminar el cliente')
    }
  }
}

const abrirModalCrear = () => {
  clienteSeleccionado.value = undefined
  showModal.value = true
}

const abrirModalEditar = (cliente: Cliente) => {
  clienteSeleccionado.value = cliente
  showModal.value = true
}

const cerrarModal = () => {
  showModal.value = false
  clienteSeleccionado.value = undefined
}

const onClienteGuardado = () => {
  cargarClientes()
}

onMounted(() => cargarClientes())
</script>

<template>
  <div class="list-container">
    <div class="list-header">
      <div>
        <h1 class="page-title">Clientes</h1>
        <p class="page-subtitle">Gestión de información de clientes</p>
      </div>
      <button class="btn-action" @click="abrirModalCrear">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Nuevo Cliente
      </button>
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
          placeholder="Buscar cliente..."
        />
        <button v-if="busqueda" @click="busqueda = ''" class="search-clear">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th class="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cliente in clientesFiltrados" :key="cliente.id">
            <td>
              <span class="id-badge">#{{ cliente.id }}</span>
            </td>
            <td>
              <div class="cliente-info">
                <div class="cliente-avatar">
                  {{ (cliente.nombre?.charAt(0) || '?').toUpperCase() }}
                </div>
                <span class="fw-medium">{{ cliente.nombre }}</span>
              </div>
            </td>
            <td>{{ cliente.apellido || '-' }}</td>
            <td>
              <span v-if="cliente.telefono" class="info-badge phone-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                {{ cliente.telefono }}
              </span>
              <span v-else class="text-muted">-</span>
            </td>
            <td>
              <span v-if="cliente.direccion" class="info-badge address-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {{ cliente.direccion }}
              </span>
              <span v-else class="text-muted">-</span>
            </td>
            <td class="actions-cell">
              <button class="btn-icon btn-edit" @click="abrirModalEditar(cliente)" title="Editar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button class="btn-icon btn-delete" @click="eliminarCliente(cliente.id)" title="Eliminar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </td>
          </tr>
          <tr v-if="clientesFiltrados.length === 0 && busqueda">
            <td colspan="6" class="empty-state">
              <div class="empty-content">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <p>No se encontraron resultados para "{{ busqueda }}"</p>
              </div>
            </td>
          </tr>
          <tr v-if="clientes.length === 0 && !busqueda">
            <td colspan="6" class="empty-state">
              <div class="empty-content">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <p>No hay clientes registrados</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Contador de registros -->
      <div class="table-footer">
        <span class="records-count">
          Mostrando {{ clientesFiltrados.length }} de {{ clientes.length }} registros
        </span>
      </div>
    </div>

    <!-- Modal -->
    <ClienteSave
      :show="showModal"
      :cliente="clienteSeleccionado"
      @close="cerrarModal"
      @saved="onClienteGuardado"
    />
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

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%);
  color: #ffffff;
  border: none;
  padding: 12px 28px;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #333333 0%, #555555 100%);
}

.btn-action svg {
  transition: transform 0.3s ease;
}

.btn-action:hover svg {
  transform: rotate(90deg);
}

/* Search Bar */
.search-bar {
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
}

.search-input-wrapper {
  position: relative;
  max-width: 350px;
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
  padding: 16px 20px;
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
  padding: 16px 20px;
  color: #000000;
  vertical-align: middle;
}

.data-table td.fw-medium {
  font-weight: 600;
}

.id-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
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
  gap: 12px;
}

.cliente-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.data-table tbody tr:hover .cliente-avatar {
  transform: scale(1.1);
}

.info-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 0.8rem;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.phone-badge {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  color: #2e7d32;
}

.address-badge {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  color: #1565c0;
}

.text-muted {
  color: #adb5bd;
}

.actions-cell {
  text-align: right;
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
  margin-left: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-edit {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  color: #1976d2;
}

.btn-edit:hover {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4);
}

.btn-delete {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  color: #d32f2f;
}

.btn-delete:hover {
  background: linear-gradient(135deg, #d32f2f 0%, #c62828 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(211, 47, 47, 0.4);
}

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

.empty-content p {
  color: #757575;
  font-size: 1rem;
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

@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }

  .btn-action {
    width: 100%;
    justify-content: center;
  }

  .page-title {
    font-size: 1.5rem;
  }
}
</style>
