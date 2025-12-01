<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import type { Producto } from '@/models/producto'
import http from '@/plugins/axios'
import ProductoSave from './ProductoSave.vue'

const productos = ref<Producto[]>([])
const showModal = ref(false)
const productoSeleccionado = ref<Producto | undefined>(undefined)
const busqueda = ref('')
const imagenHover = ref<{ src: string; nombre: string } | null>(null)

// Filtrar productos por búsqueda
const productosFiltrados = computed(() => {
  if (!busqueda.value.trim()) return productos.value
  const termino = busqueda.value.toLowerCase().trim()
  return productos.value.filter(prod => 
    prod.nombre.toLowerCase().includes(termino) ||
    prod.categoria?.nombre?.toLowerCase().includes(termino) ||
    prod.genero?.toLowerCase().includes(termino) ||
    prod.id.toString().includes(termino)
  )
})

const cargarProductos = async () => {
  try {
    const { data } = await http.get('productos')
    // Ordenar por ID de forma ascendente
    productos.value = data.sort((a: Producto, b: Producto) => a.id - b.id)
  } catch (error) {
    console.error('Error al cargar productos:', error)
  }
}

const eliminarProducto = async (id: number) => {
  if (confirm('¿Está seguro de eliminar este producto?')) {
    try {
      await http.delete(`productos/${id}`)
      await cargarProductos()
    } catch (error) {
      console.error('Error al eliminar producto:', error)
      alert('No se pudo eliminar el producto')
    }
  }
}

const abrirModalCrear = () => {
  productoSeleccionado.value = undefined
  showModal.value = true
}

const abrirModalEditar = (producto: Producto) => {
  productoSeleccionado.value = producto
  showModal.value = true
}

const cerrarModal = () => {
  showModal.value = false
  productoSeleccionado.value = undefined
}

const onProductoGuardado = () => {
  cargarProductos()
}

const getGeneroLabel = (genero: string) => {
  const labels: Record<string, string> = {
    hombre: 'Hombre',
    mujer: 'Mujer',
    unisex: 'Unisex'
  }
  return labels[genero] || 'Unisex'
}

const getGeneroClass = (genero: string) => {
  const classes: Record<string, string> = {
    hombre: 'genero-hombre',
    mujer: 'genero-mujer',
    unisex: 'genero-unisex'
  }
  return classes[genero] || 'genero-unisex'
}

// Función para formatear tallas (ahora acepta array o string)
const formatTallas = (tallas: string[] | string | undefined) => {
  if (!tallas) return { visible: [], extra: 0 }
  
  let tallasArray: string[]
  if (Array.isArray(tallas)) {
    tallasArray = tallas
  } else {
    tallasArray = tallas.split(',').map(t => t.trim()).filter(t => t)
  }
  
  const maxVisible = 3 // Mostrar máximo 3 tallas
  return {
    visible: tallasArray.slice(0, maxVisible),
    extra: Math.max(0, tallasArray.length - maxVisible)
  }
}

// Función para formatear colores (ahora acepta array de objetos Color)
const formatColores = (colores: any[] | undefined) => {
  if (!colores || !Array.isArray(colores) || colores.length === 0) {
    return { visible: [], extra: 0 }
  }
  
  const maxVisible = 3 // Mostrar máximo 3 colores
  return {
    visible: colores.slice(0, maxVisible),
    extra: Math.max(0, colores.length - maxVisible)
  }
}

onMounted(() => {
  cargarProductos()
})

// Funciones para el modal de imagen
const mostrarImagenGrande = (producto: Producto) => {
  if (producto.imagenes) {
    imagenHover.value = {
      src: producto.imagenes,
      nombre: producto.nombre
    }
  }
}

const cerrarImagenGrande = () => {
  imagenHover.value = null
}
</script>

<template>
  <div class="list-container">
    <div class="list-header">
      <div>
        <h1 class="page-title">Productos</h1>
        <p class="page-subtitle">Gestión del inventario de productos</p>
      </div>
      <button class="btn-action" @click="abrirModalCrear">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Nuevo Producto
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
          placeholder="Buscar producto, categoría, género..."
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
            <th style="width: 70px;">Imagen</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Género</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Tallas</th>
            <th>Colores</th>
            <th class="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="producto in productosFiltrados" :key="producto.id">
            <td>
              <div 
                class="product-thumb-wrapper"
                @click="mostrarImagenGrande(producto)"
              >
                <img 
                  :src="producto.imagenes || '/placeholder.jpg'" 
                  :alt="producto.nombre"
                  class="product-thumb"
                />
                <div class="zoom-hint">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                    <path d="M11 8v6M8 11h6"/>
                  </svg>
                </div>
              </div>
            </td>
            <td class="fw-medium">{{ producto.nombre }}</td>
            <td>
              <span class="category-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
                {{ producto.categoria?.nombre || 'Sin categoría' }}
              </span>
            </td>
            <td>
              <span :class="['genero-badge', getGeneroClass(producto.genero || 'unisex')]">
                {{ getGeneroLabel(producto.genero || 'unisex') }}
              </span>
            </td>
            <td class="price-cell">
              <span class="price">{{ Number(producto.precio).toFixed(2) }}</span>
              <span class="currency">Bs</span>
            </td>
            <td>
              <span :class="['stock-badge', Number(producto.stock) > 10 ? 'stock-good' : Number(producto.stock) > 0 ? 'stock-low' : 'stock-out']">
                <span class="stock-dot"></span>
                {{ producto.stock }}
              </span>
            </td>
            <td>
              <div class="tallas-container" v-if="formatTallas(producto.tallas).visible.length > 0">
                <span 
                  v-for="t in formatTallas(producto.tallas).visible" 
                  :key="t" 
                  class="talla-chip"
                >
                  {{ t }}
                </span>
                <span 
                  v-if="formatTallas(producto.tallas).extra > 0" 
                  class="talla-more"
                  :title="`${formatTallas(producto.tallas).extra} tallas más`"
                >
                  +{{ formatTallas(producto.tallas).extra }}
                </span>
              </div>
              <span v-else class="no-data">Sin tallas</span>
            </td>
            <td>
              <div class="colores-container" v-if="formatColores(producto.colores).visible.length > 0">
                <div 
                  v-for="color in formatColores(producto.colores).visible" 
                  :key="color.id" 
                  class="color-indicator"
                  :style="{ background: color.codigoHex || '#ccc' }"
                  :title="color.nombre"
                ></div>
                <span 
                  v-if="formatColores(producto.colores).extra > 0" 
                  class="color-more"
                  :title="`${formatColores(producto.colores).extra} colores más`"
                >
                  +{{ formatColores(producto.colores).extra }}
                </span>
              </div>
              <span v-else class="no-data">Sin colores</span>
            </td>
            <td class="actions-cell">
              <button class="btn-icon btn-edit" @click="abrirModalEditar(producto)" title="Editar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button class="btn-icon btn-delete" @click="eliminarProducto(producto.id)" title="Eliminar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </td>
          </tr>
          <tr v-if="productosFiltrados.length === 0 && busqueda">
            <td colspan="9" class="empty-state">
              <div class="empty-content">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <p>No se encontraron resultados para "{{ busqueda }}"</p>
              </div>
            </td>
          </tr>
          <tr v-if="productos.length === 0 && !busqueda">
            <td colspan="9" class="empty-state">
              <div class="empty-content">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                <p>No hay productos registrados</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Contador de registros -->
      <div class="table-footer">
        <span class="records-count">
          Mostrando {{ productosFiltrados.length }} de {{ productos.length }} registros
        </span>
      </div>
    </div>

    <!-- Modal -->
    <ProductoSave
      :show="showModal"
      :producto="productoSeleccionado"
      @close="cerrarModal"
      @saved="onProductoGuardado"
    />

    <!-- Modal de Imagen -->
    <Teleport to="body">
      <Transition name="image-modal">
        <div v-if="imagenHover" class="image-modal-overlay" @click="cerrarImagenGrande">
          <button class="image-modal-close" @click="cerrarImagenGrande">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <div class="image-modal-content" @click.stop>
            <img 
              :src="imagenHover.src" 
              :alt="imagenHover.nombre"
              class="image-modal-img"
            />
            <div class="image-modal-caption">{{ imagenHover.nombre }}</div>
          </div>
        </div>
      </Transition>
    </Teleport>
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
  max-width: 400px;
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
  padding: 16px 12px;
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
  padding: 14px 12px;
  color: #000000;
  vertical-align: middle;
}

.data-table td.fw-medium {
  font-weight: 600;
  color: #1a1a1a;
}

.product-thumb-wrapper {
  position: relative;
  width: 55px;
  height: 55px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.product-thumb-wrapper:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.zoom-hint {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 20px;
  height: 20px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.zoom-hint svg {
  color: white;
}

.product-thumb-wrapper:hover .zoom-hint {
  opacity: 1;
}

.product-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
  color: #495057;
  font-size: 0.75rem;
  letter-spacing: 0.3px;
  font-weight: 500;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.category-badge:hover {
  background: linear-gradient(135deg, #dee2e6 0%, #ced4da 100%);
}

.genero-badge {
  display: inline-block;
  padding: 5px 14px;
  font-size: 0.7rem;
  letter-spacing: 0.5px;
  font-weight: 600;
  border-radius: 20px;
  text-transform: uppercase;
  transition: all 0.3s ease;
}

.genero-hombre {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  color: #1565c0;
}

.genero-mujer {
  background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%);
  color: #c2185b;
}

.genero-unisex {
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  color: #7b1fa2;
}

.price-cell {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price {
  font-weight: 700;
  font-size: 1.1rem;
  color: #2e7d32;
}

.currency {
  font-size: 0.7rem;
  color: #666;
  font-weight: 500;
}

.stock-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.stock-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.stock-good {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  color: #2e7d32;
}

.stock-good .stock-dot {
  background: #4caf50;
}

.stock-low {
  background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
  color: #f57f17;
}

.stock-low .stock-dot {
  background: #ffc107;
}

.stock-out {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  color: #c62828;
}

.stock-out .stock-dot {
  background: #f44336;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.color-indicator {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  display: inline-block;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.color-indicator:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.colores-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.color-more {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 24px;
  padding: 0 6px;
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: help;
}

.no-data {
  color: #adb5bd;
  font-size: 0.8rem;
  font-style: italic;
}

.tallas-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.talla-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  height: 26px;
  padding: 0 8px;
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
  color: #333;
  font-size: 0.7rem;
  font-weight: 600;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.talla-chip:hover {
  background: linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%);
  transform: translateY(-1px);
}

.talla-more {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  height: 26px;
  padding: 0 8px;
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 600;
  border-radius: 4px;
  cursor: help;
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

/* Image Modal Styles */
.image-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(8px);
  cursor: pointer;
}

.image-modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10000;
}

.image-modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.image-modal-content {
  position: relative;
  max-width: 80vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-modal-img {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.image-modal-caption {
  margin-top: 16px;
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* Transiciones del modal */
.image-modal-enter-active,
.image-modal-leave-active {
  transition: all 0.2s ease;
}

.image-modal-enter-from,
.image-modal-leave-to {
  opacity: 0;
}

.image-modal-enter-from .image-modal-content,
.image-modal-leave-to .image-modal-content {
  transform: scale(0.9);
}
</style>
