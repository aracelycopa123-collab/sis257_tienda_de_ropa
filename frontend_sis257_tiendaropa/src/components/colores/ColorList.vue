<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import type { Color } from '@/models/color'
import http from '@/plugins/axios'
import ColorSave from './ColorSave.vue'

const colores = ref<Color[]>([])
const showModal = ref(false)
const colorSeleccionado = ref<Color | undefined>(undefined)
const busqueda = ref('')

// Filtrar colores por búsqueda
const coloresFiltrados = computed(() => {
  if (!busqueda.value.trim()) return colores.value
  const termino = busqueda.value.toLowerCase().trim()
  return colores.value.filter(c => 
    c.nombre?.toLowerCase().includes(termino) ||
    c.codigoHex?.toLowerCase().includes(termino) ||
    c.id.toString().includes(termino)
  )
})

const cargarColores = async () => {
  try {
    const { data } = await http.get('colores')
    colores.value = data.sort((a: Color, b: Color) => a.id - b.id)
  } catch (error) {
    console.error('Error al cargar colores:', error)
  }
}

const eliminarColor = async (id: number) => {
  if (confirm('¿Está seguro de eliminar este color?')) {
    try {
      await http.delete(`colores/${id}`)
      await cargarColores()
    } catch (error) {
      console.error('Error al eliminar color:', error)
      alert('No se pudo eliminar el color. Puede estar asociado a productos.')
    }
  }
}

const abrirModalCrear = () => {
  colorSeleccionado.value = undefined
  showModal.value = true
}

const abrirModalEditar = (color: Color) => {
  colorSeleccionado.value = color
  showModal.value = true
}

const cerrarModal = () => {
  showModal.value = false
  colorSeleccionado.value = undefined
}

const onColorGuardado = () => {
  cargarColores()
}

onMounted(() => cargarColores())
</script>

<template>
  <div class="list-container">
    <div class="list-header">
      <div>
        <h1 class="page-title">Colores</h1>
        <p class="page-subtitle">Gestión de colores para productos</p>
      </div>
      <button class="btn-action" @click="abrirModalCrear">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Nuevo Color
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
          placeholder="Buscar color..."
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
            <th>Vista Previa</th>
            <th>Nombre</th>
            <th>Código Hex</th>
            <th class="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="color in coloresFiltrados" :key="color.id">
            <td>
              <span class="id-badge">#{{ color.id }}</span>
            </td>
            <td>
              <div class="color-preview">
                <div 
                  class="color-swatch" 
                  :style="{ backgroundColor: color.codigoHex || '#ccc' }"
                ></div>
                <div class="color-ring" :style="{ borderColor: color.codigoHex || '#ccc' }"></div>
              </div>
            </td>
            <td class="fw-medium">{{ color.nombre }}</td>
            <td>
              <span class="hex-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                </svg>
                {{ color.codigoHex || '-' }}
              </span>
            </td>
            <td class="actions-cell">
              <button class="btn-icon btn-edit" @click="abrirModalEditar(color)" title="Editar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button class="btn-icon btn-delete" @click="eliminarColor(color.id)" title="Eliminar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </td>
          </tr>
          <tr v-if="coloresFiltrados.length === 0 && busqueda">
            <td colspan="5" class="empty-state">
              <div class="empty-content">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <p>No se encontraron resultados para "{{ busqueda }}"</p>
              </div>
            </td>
          </tr>
          <tr v-if="colores.length === 0 && !busqueda">
            <td colspan="5" class="empty-state">
              <div class="empty-content">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <circle cx="13.5" cy="6.5" r="2.5"/>
                  <circle cx="17.5" cy="10.5" r="2.5"/>
                  <circle cx="8.5" cy="7.5" r="2.5"/>
                  <circle cx="6.5" cy="12.5" r="2.5"/>
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/>
                </svg>
                <p>No hay colores registrados</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Contador de registros -->
      <div class="table-footer">
        <span class="records-count">
          Mostrando {{ coloresFiltrados.length }} de {{ colores.length }} registros
        </span>
      </div>
    </div>

    <!-- Modal -->
    <ColorSave
      :show="showModal"
      :color="colorSeleccionado"
      @close="cerrarModal"
      @saved="onColorGuardado"
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
  color: #1a1a1a;
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

.color-preview {
  position: relative;
  width: 44px;
  height: 44px;
}

.color-swatch {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.color-ring {
  position: absolute;
  top: -4px;
  left: -4px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 3px solid;
  opacity: 0.3;
  transition: all 0.3s ease;
}

.data-table tbody tr:hover .color-swatch {
  transform: scale(1.15);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.data-table tbody tr:hover .color-ring {
  opacity: 0.6;
  transform: scale(1.1);
}

.hex-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  color: #7b1fa2;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 20px;
  font-family: 'Courier New', monospace;
  transition: all 0.3s ease;
}

.hex-badge:hover {
  background: linear-gradient(135deg, #e1bee7 0%, #ce93d8 100%);
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
