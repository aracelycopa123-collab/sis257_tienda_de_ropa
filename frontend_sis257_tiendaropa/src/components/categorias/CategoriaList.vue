<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Categoria } from '@/models/categoria'
import http from '@/plugins/axios'
import CategoriaSave from './CategoriaSave.vue'

const categorias = ref<Categoria[]>([])
const showModal = ref(false)
const categoriaSeleccionada = ref<Categoria | undefined>(undefined)

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
        + Nueva Categoría
      </button>
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
          <tr v-for="categoria in categorias" :key="categoria.id">
            <td>{{ categoria.id }}</td>
            <td class="fw-medium">{{ categoria.nombre }}</td>
            <td class="text-end">
              <button class="btn-table" @click="abrirModalEditar(categoria)" title="Editar">
                Editar
              </button>
              <button class="btn-table btn-delete" @click="eliminarCategoria(categoria.id)" title="Eliminar">
                Eliminar
              </button>
            </td>
          </tr>
          <tr v-if="categorias.length === 0">
            <td colspan="3" class="text-center text-muted py-4">No hay categorías registradas</td>
          </tr>
        </tbody>
      </table>
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
/* Estilo premium para tablas */
.list-container {
  background: #ffffff;
  min-height: calc(100vh - 140px);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 30px 0 30px 0;
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

.btn-action {
  background: #000000;
  color: #ffffff;
  border: none;
  padding: 12px 28px;
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-action:hover {
  background: #333333;
}

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

.btn-table {
  background: transparent;
  border: 1px solid #e5e5e5;
  color: #000000;
  padding: 6px 16px;
  font-size: 0.8125rem;
  font-weight: 400;
  cursor: pointer;
  margin-left: 8px;
  transition: all 0.2s ease;
}

.btn-table:hover {
  background: #000000;
  border-color: #000000;
  color: #ffffff;
}

.btn-delete:hover {
  background: #dc3545;
  border-color: #dc3545;
  color: #ffffff;
}

@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }
  
  .btn-action {
    width: 100%;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
}
</style>
