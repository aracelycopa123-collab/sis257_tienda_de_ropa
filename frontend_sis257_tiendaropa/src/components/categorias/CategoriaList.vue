<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import type { Categoria } from '@/models/categoria'
import http from '@/plugins/axios'
import CategoriaSave from './CategoriaSave.vue'

const categorias = ref<Categoria[]>([])
const showModal = ref(false)
const categoriaSeleccionada = ref<Categoria | undefined>(undefined)
const busqueda = ref('')

// Filtrar categorías por búsqueda
const categoriasFiltradas = computed(() => {
  if (!busqueda.value.trim()) return categorias.value
  const termino = busqueda.value.toLowerCase().trim()
  return categorias.value.filter(cat => 
    cat.nombre.toLowerCase().includes(termino) ||
    cat.id.toString().includes(termino)
  )
})

const cargarCategorias = async () => {
  try {
    const { data } = await http.get('categorias')
    // Ordenar por ID de forma ascendente
    categorias.value = data.sort((a: Categoria, b: Categoria) => a.id - b.id)
  } catch (error) {
    console.error('Error al cargar categorías:', error)
  }
}

const eliminarCategoria = async (id: number) => {
  if (confirm('¿Está seguro de eliminar esta categoría?')) {
    try {
      await http.delete(`categorias/${id}`)
      await cargarCategorias()
    } catch (error) {
      console.error('Error al eliminar categoría:', error)
      alert('No se pudo eliminar la categoría')
    }
  }
}

const abrirModalCrear = () => {
  categoriaSeleccionada.value = undefined
  showModal.value = true
}

const abrirModalEditar = (categoria: Categoria) => {
  categoriaSeleccionada.value = categoria
  showModal.value = true
}

const cerrarModal = () => {
  showModal.value = false
  categoriaSeleccionada.value = undefined
}

const onCategoriaGuardada = () => {
  cargarCategorias()
}

onMounted(() => {
  cargarCategorias()
})
</script>

<template>
  <div class="list-container">
    <div class="list-header">
      <div>
        <h1 class="page-title">Categorías</h1>
        <p class="page-subtitle">Gestión de categorías de productos</p>
      </div>
      <button class="btn-action" @click="abrirModalCrear">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Nueva Categoría
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
          placeholder="Buscar categoría..."
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
            <th class="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="categoria in categoriasFiltradas" :key="categoria.id">
            <td>
              <span class="id-badge">#{{ categoria.id }}</span>
            </td>
            <td class="fw-medium">{{ categoria.nombre }}</td>
            <td class="text-end actions-cell">
              <button class="btn-icon btn-edit" @click="abrirModalEditar(categoria)" title="Editar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button class="btn-icon btn-delete" @click="eliminarCategoria(categoria.id)" title="Eliminar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </button>
            </td>
          </tr>
          <tr v-if="categoriasFiltradas.length === 0 && busqueda">
            <td colspan="3" class="empty-state">
              <div class="empty-content">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <p>No se encontraron resultados para "{{ busqueda }}"</p>
              </div>
            </td>
          </tr>
          <tr v-if="categorias.length === 0 && !busqueda">
            <td colspan="3" class="empty-state">
              <div class="empty-content">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
                <p>No hay categorías registradas</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Contador de registros abajo a la derecha -->
      <div class="table-footer">
        <span class="records-count">
          Mostrando {{ categoriasFiltradas.length }} de {{ categorias.length }} registros
        </span>
      </div>
    </div>

    <!-- Modal -->
    <CategoriaSave
      :show="showModal"
      :categoria="categoriaSeleccionada"
      @close="cerrarModal"
      @saved="onCategoriaGuardada"
    />
  </div>
</template>

<style scoped>
/* Container */
.list-container {
  background: #ffffff;
  min-height: calc(100vh - 140px);
}

/* Header */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 30px 0;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 0;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 300;
  letter-spacing: -0.5px;
  color: #000;
  margin-bottom: 6px;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #888;
  margin: 0;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #000 0%, #333 100%);
  color: #fff;
  border: none;
  padding: 12px 24px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.btn-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
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
  background: #fafafa;
}

.data-table th {
  padding: 14px 20px;
  text-align: left;
  font-weight: 600;
  font-size: 0.7rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  border-bottom: 2px solid #e5e5e5;
}

.data-table tbody tr {
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.2s ease;
}

.data-table tbody tr:hover {
  background: linear-gradient(90deg, #fafafa 0%, #fff 100%);
  transform: scale(1.002);
}

.data-table td {
  padding: 16px 20px;
  color: #333;
  vertical-align: middle;
}

.data-table td.fw-medium {
  font-weight: 500;
  color: #000;
}

/* ID Badge */
.id-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 28px;
  padding: 0 10px;
  background: #f5f5f5;
  color: #666;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 4px;
}

/* Action Buttons */
.actions-cell {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid #e5e5e5;
  background: #fff;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px;
}

.btn-icon:hover {
  border-color: transparent;
}

.btn-edit:hover {
  background: #000;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.btn-delete:hover {
  background: #dc3545;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220,53,69,0.3);
}

/* Empty State */
.empty-state {
  padding: 60px 20px !important;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: #999;
}

.empty-content svg {
  opacity: 0.3;
}

.empty-content p {
  font-size: 0.9rem;
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
  
  .actions-cell {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
