<template>
  <div class="card h-100 shadow-sm producto-card">
    <div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 200px">
      <img v-if="producto.imagen" :src="producto.imagen" :alt="producto.nombre" class="img-fluid" />
      <i v-else class="fas fa-image text-secondary fa-2x"></i>
    </div>
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">{{ producto.nombre }}</h5>
      <p class="card-text text-muted small">{{ producto.descripcion?.substring(0, 50) }}...</p>
      <div class="mb-2">
        <span v-if="producto.categoria" class="badge bg-info">
          {{ producto.categoria.nombre }}
        </span>
        <span :class="['badge', producto.stock > 0 ? 'bg-success' : 'bg-danger']">
          {{ producto.stock > 0 ? `Stock: ${producto.stock}` : 'Sin Stock' }}
        </span>
      </div>
      <h6 class="text-danger mb-3 mt-auto">Bs. {{ producto.precio }}</h6>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends { id: number; nombre: string; descripcion: string; precio: number; stock: number; imagen?: string; categoria?: any }">
defineProps<{
  producto: T
}>()
</script>

<style scoped>
.producto-card {
  transition: transform 0.3s, box-shadow 0.3s;
  overflow: hidden;
}

.producto-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15) !important;
}

.card-img-top {
  overflow: hidden;
}

.card-img-top img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style>
