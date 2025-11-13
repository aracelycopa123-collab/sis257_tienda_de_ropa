<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-lg-8">
        <div class="card shadow mb-4">
          <div class="card-body">
            <h4 class="card-title mb-4">
              <i class="fas fa-info-circle"></i> Detalles del Producto
            </h4>

            <div v-if="loading" class="text-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
            </div>

            <div v-else-if="producto" class="row">
              <div class="col-md-6">
                <div class="bg-light d-flex align-items-center justify-content-center" style="height: 400px">
                  <i class="fas fa-image text-secondary fa-5x"></i>
                </div>
              </div>
              <div class="col-md-6">
                <h2>{{ producto.nombre }}</h2>
                <p class="text-muted">{{ producto.descripcion }}</p>

                <div class="mb-3">
                  <span class="badge bg-info">{{ producto.categoria?.nombre }}</span>
                  <span v-if="producto.stock > 0" class="badge bg-success ms-2">
                    Stock: {{ producto.stock }}
                  </span>
                  <span v-else class="badge bg-danger ms-2">Sin Stock</span>
                </div>

                <h3 class="text-danger mb-3">Bs. {{ producto.precio }}</h3>

                <div class="card bg-light p-3 mb-3">
                  <h6>Especificaciones:</h6>
                  <ul class="list-unstyled">
                    <li><strong>Talla:</strong> M, L, XL</li>
                    <li><strong>Material:</strong> 100% Algodón</li>
                    <li><strong>Color:</strong> {{ producto.nombre }}</li>
                  </ul>
                </div>

                <div class="input-group mb-3" style="width: 150px">
                  <button @click="cantidad--" class="btn btn-outline-secondary" :disabled="cantidad <= 1">
                    -
                  </button>
                  <input
                    v-model.number="cantidad"
                    type="number"
                    class="form-control text-center"
                    min="1"
                  />
                  <button @click="cantidad++" class="btn btn-outline-secondary" :disabled="cantidad >= producto.stock">
                    +
                  </button>
                </div>

                <button
                  @click="agregarAlCarrito"
                  :disabled="producto.stock === 0"
                  class="btn btn-danger btn-lg w-100 mb-2"
                >
                  <i class="fas fa-shopping-cart"></i> Agregar al Carrito
                </button>

                <router-link to="/productos" class="btn btn-outline-secondary w-100">
                  <i class="fas fa-arrow-left"></i> Volver
                </router-link>
              </div>
            </div>

            <div v-else class="alert alert-warning">
              <i class="fas fa-exclamation-triangle"></i> Producto no encontrado
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card shadow">
          <div class="card-body">
            <h5 class="card-title">
              <i class="fas fa-shield-alt"></i> Garantía
            </h5>
            <p class="card-text">
              30 días de garantía de cambio o devolución sin preguntas.
            </p>
            <hr />
            <h5 class="card-title">
              <i class="fas fa-truck"></i> Envío
            </h5>
            <p class="card-text">
              Envío gratuito a partir de Bs. 100. Entrega en 24-48 horas.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import apiService from '../services/apiService'

const route = useRoute()
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

const producto = ref<Producto | null>(null)
const loading = ref(false)
const cantidad = ref(1)

const cargarProducto = async () => {
  try {
    loading.value = true
    const id = parseInt(route.params.id as string)
    const response = await apiService.getProductoById(id)
    producto.value = response.data
  } catch (error) {
    console.error('Error al cargar producto:', error)
  } finally {
    loading.value = false
  }
}

const agregarAlCarrito = () => {
  if (producto.value) {
    cartStore.addItem({
      id: producto.value.id,
      nombre: producto.value.nombre,
      precio: producto.value.precio,
      cantidad: cantidad.value,
      imagen: ''
    })
    alert('Producto agregado al carrito')
    router.push('/carrito')
  }
}

onMounted(() => {
  cargarProducto()
})
</script>
