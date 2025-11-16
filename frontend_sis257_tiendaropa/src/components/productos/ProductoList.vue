<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Producto } from '@/models/producto'
import http from '@/plugins/axios'
import ProductoSave from './ProductoSave.vue'

const productos = ref<Producto[]>([])
const showModal = ref(false)
const productoSeleccionado = ref<Producto | undefined>(undefined)

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

onMounted(() => {
  cargarProductos()
})
</script>

<template>
  <div class="list-container">
    <div class="list-header">
      <div>
        <h1 class="page-title">Productos</h1>
        <p class="page-subtitle">Gestión del inventario de productos</p>
      </div>
      <button class="btn-action" @click="abrirModalCrear">
        + Nuevo Producto
      </button>
    </div>

    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 80px;">Imagen</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Género</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Talla</th>
            <th>Color</th>
            <th class="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="producto in productos" :key="producto.id">
            <td>
              <img 
                :src="producto.imagenes || '/placeholder.jpg'" 
                :alt="producto.nombre"
                class="product-thumb"
              />
            </td>
            <td class="fw-medium">{{ producto.nombre }}</td>
            <td>
              <span class="category-badge">{{ producto.categoria?.nombre || 'Sin categoría' }}</span>
            </td>
            <td>
              <span :class="['genero-badge', getGeneroClass(producto.genero || 'unisex')]">
                {{ getGeneroLabel(producto.genero || 'unisex') }}
              </span>
            </td>
            <td class="price">Bs. {{ Number(producto.precio).toFixed(2) }}</td>
            <td>
              <span :class="['stock-badge', Number(producto.stock) > 10 ? 'stock-good' : Number(producto.stock) > 0 ? 'stock-low' : 'stock-out']">
                {{ producto.stock }}
              </span>
            </td>
            <td>{{ producto.talla }}</td>
            <td>
              <div class="color-indicator" :style="{ background: producto.color }"></div>
            </td>
            <td class="text-end">
              <button class="btn-table" @click="abrirModalEditar(producto)" title="Editar">
                Editar
              </button>
              <button class="btn-table btn-delete" @click="eliminarProducto(producto.id)" title="Eliminar">
                Eliminar
              </button>
            </td>
          </tr>
          <tr v-if="productos.length === 0">
            <td colspan="9" class="text-center text-muted py-4">No hay productos registrados</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <ProductoSave
      :show="showModal"
      :producto="productoSeleccionado"
      @close="cerrarModal"
      @saved="onProductoGuardado"
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

.product-thumb {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border: 1px solid #e5e5e5;
}

.category-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #f5f5f5;
  color: #666666;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  font-weight: 400;
}

.genero-badge {
  display: inline-block;
  padding: 4px 12px;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  font-weight: 400;
  border: 1px solid;
}

.genero-hombre {
  background: #e3f2fd;
  color: #1565c0;
  border-color: #90caf9;
}

.genero-mujer {
  background: #fce4ec;
  color: #c2185b;
  border-color: #f48fb1;
}

.genero-unisex {
  background: #f5f5f5;
  color: #666666;
  border-color: #e0e0e0;
}

.price {
  font-weight: 500;
  font-size: 0.9375rem;
}

.stock-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid #e5e5e5;
  font-weight: 500;
  font-size: 0.8125rem;
}

.stock-good {
  background: #f0fff4;
  color: #22543d;
  border-color: #9ae6b4;
}

.stock-low {
  background: #fffbeb;
  color: #744210;
  border-color: #fbd38d;
}

.stock-out {
  background: #fff5f5;
  color: #742a2a;
  border-color: #fc8181;
}

.color-indicator {
  width: 24px;
  height: 24px;
  border: 1px solid #e5e5e5;
  display: inline-block;
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
