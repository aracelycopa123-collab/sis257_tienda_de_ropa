<template>
  <div class="container mt-5">
    <h1 class="mb-4">
      <i class="fas fa-shopping-bag"></i> Nuestros Productos
    </h1>

    <!-- Filtros -->
    <div class="row mb-4">
      <div class="col-md-12">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-md-4">
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fas fa-search"></i>
                  </span>
                  <input
                    v-model="searchTerm"
                    type="text"
                    class="form-control"
                    placeholder="Buscar productos..."
                  />
                </div>
              </div>
              <div class="col-md-4">
                <select v-model="selectedCategory" class="form-select">
                  <option value="">Todas las categorías</option>
                  <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
                    {{ cat.nombre }}
                  </option>
                </select>
              </div>
              <div class="col-md-4">
                <select v-model="sortBy" class="form-select">
                  <option value="">Ordenar por</option>
                  <option value="precio-asc">Precio: menor a mayor</option>
                  <option value="precio-desc">Precio: mayor a menor</option>
                  <option value="nombre">Nombre A-Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <!-- Productos -->
    <div v-else class="row">
      <div v-if="productosFiltrados.length === 0" class="col-12">
        <div class="alert alert-info text-center">
          <i class="fas fa-inbox"></i> No se encontraron productos
        </div>
      </div>
      <div v-for="producto in productosFiltrados" :key="producto.id" class="col-md-4 mb-4">
        <div class="card h-100 shadow-sm hover-card">
          <div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 250px">
            <i class="fas fa-image text-secondary fa-3x"></i>
          </div>
          <div class="card-body">
            <h5 class="card-title">{{ producto.nombre }}</h5>
            <p class="card-text text-muted">{{ producto.descripcion?.substring(0, 60) }}...</p>
            <div class="mb-3">
              <span class="badge bg-info">{{ producto.categoria?.nombre }}</span>
              <span class="badge bg-success ms-2">Stock: {{ producto.stock }}</span>
            </div>
            <h4 class="text-danger mb-3">Bs. {{ producto.precio }}</h4>
            <button
              @click="irAlDetalle(producto.id)"
              class="btn btn-outline-primary w-100 mb-2"
            >
              <i class="fas fa-eye"></i> Ver Detalles
            </button>
            <button
              @click="agregarAlCarrito(producto)"
              :disabled="producto.stock === 0"
              class="btn btn-danger w-100"
            >
              <i class="fas fa-shopping-cart"></i> Agregar al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import apiService from '../services/apiService'

const router = useRouter()
const cartStore = useCartStore()

interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  stock: number
  categoria?: any
}

const productos = ref<Producto[]>([])
const categorias = ref<any[]>([])
const loading = ref(false)
const searchTerm = ref('')
const selectedCategory = ref('')
const sortBy = ref('')

const productosFiltrados = computed(() => {
  let filtered = [...productos.value]

  // Filtrar por búsqueda
  if (searchTerm.value) {
    filtered = filtered.filter(p =>
      p.nombre.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }

  // Filtrar por categoría
  if (selectedCategory.value) {
    filtered = filtered.filter(p => p.categoria?.id === parseInt(selectedCategory.value))
  }

  // Ordenar
  if (sortBy.value === 'precio-asc') {
    filtered.sort((a, b) => a.precio - b.precio)
  } else if (sortBy.value === 'precio-desc') {
    filtered.sort((a, b) => b.precio - a.precio)
  } else if (sortBy.value === 'nombre') {
    filtered.sort((a, b) => a.nombre.localeCompare(b.nombre))
  }

  return filtered
})

const cargarProductos = async () => {
  try {
    loading.value = true
    const response = await apiService.getProductos()
    productos.value = response.data
  } catch (error) {
    console.error('Error al cargar productos:', error)
  } finally {
    loading.value = false
  }
}

const cargarCategorias = async () => {
  try {
    const response = await apiService.getCategorias()
    categorias.value = response.data
  } catch (error) {
    console.error('Error al cargar categorías:', error)
  }
}

const agregarAlCarrito = (producto: Producto) => {
  cartStore.addItem({
    id: producto.id,
    nombre: producto.nombre,
    precio: producto.precio,
    cantidad: 1,
    imagen: ''
  })
  alert('Producto agregado al carrito')
}

const irAlDetalle = (id: number) => {
  router.push(`/productos/${id}`)
}

onMounted(() => {
  cargarProductos()
  cargarCategorias()
})
</script>

<style scoped>
.hover-card {
  transition: transform 0.3s, box-shadow 0.3s;
}

.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15) !important;
}
</style>
