<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Cliente } from '@/models/cliente'
import http from '@/plugins/axios'
import ClienteSave from './ClienteSave.vue'

const clientes = ref<Cliente[]>([])
const showModal = ref(false)
const clienteSeleccionado = ref<Cliente | undefined>(undefined)

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
      <button class="btn-action" @click="abrirModalCrear">+ Nuevo Cliente</button>
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
          <tr v-for="cliente in clientes" :key="cliente.id">
            <td>{{ cliente.id }}</td>
            <td class="fw-medium">{{ cliente.nombre }}</td>
            <td>{{ cliente.apellido || '-' }}</td>
            <td>{{ cliente.telefono || '-' }}</td>
            <td>{{ cliente.direccion || '-' }}</td>
            <td class="text-end">
              <button class="btn-table" @click="abrirModalEditar(cliente)">Editar</button>
              <button class="btn-table btn-delete" @click="eliminarCliente(cliente.id)">Eliminar</button>
            </td>
          </tr>
          <tr v-if="clientes.length === 0">
            <td colspan="6" class="text-center text-muted py-4">No hay clientes registrados</td>
          </tr>
        </tbody>
      </table>
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
.list-container { background: #ffffff; min-height: calc(100vh - 140px); }
.list-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 30px 0 30px 0; border-bottom: 1px solid #e5e5e5; margin-bottom: 30px; }
.page-title { font-size: 2rem; font-weight: 300; letter-spacing: -0.5px; color: #000000; margin-bottom: 8px; }
.page-subtitle { font-size: 0.875rem; color: #666666; letter-spacing: 0.3px; margin: 0; }
.btn-action { background: #000000; color: #ffffff; border: none; padding: 12px 28px; font-size: 0.875rem; font-weight: 400; letter-spacing: 0.3px; cursor: pointer; transition: all 0.2s ease; }
.btn-action:hover { background: #333333; }
.table-wrapper { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
.data-table thead { border-bottom: 1px solid #e5e5e5; }
.data-table th { padding: 16px 20px; text-align: left; font-weight: 400; font-size: 0.75rem; color: #666666; text-transform: uppercase; letter-spacing: 1px; }
.data-table tbody tr { border-bottom: 1px solid #f5f5f5; transition: background 0.2s ease; }
.data-table tbody tr:hover { background: #fafafa; }
.data-table td { padding: 20px; color: #000000; vertical-align: middle; }
.data-table td.fw-medium { font-weight: 500; }
.btn-table { background: transparent; border: 1px solid #e5e5e5; color: #000000; padding: 6px 16px; font-size: 0.8125rem; font-weight: 400; cursor: pointer; margin-left: 8px; transition: all 0.2s ease; }
.btn-table:hover { background: #000000; border-color: #000000; color: #ffffff; }
.btn-delete:hover { background: #dc3545; border-color: #dc3545; color: #ffffff; }
@media (max-width: 768px) { .list-header { flex-direction: column; gap: 20px; align-items: stretch; } .btn-action { width: 100%; } .page-title { font-size: 1.5rem; } }
</style>
