<template>
  <div id="app">
    <NavBar />

    <main class="min-vh-100">
      <RouterView />
    </main>

    <footer class="bg-dark text-white text-center py-4 mt-5">
      <div class="container">
        <div class="row">
          <div class="col-md-4 mb-3">
            <h6>Sobre Nosotros</h6>
            <p class="small">La mejor tienda de ropa en línea</p>
          </div>
          <div class="col-md-4 mb-3">
            <h6>Contacto</h6>
            <p class="small">Email: info@tiendasropa.com</p>
          </div>
          <div class="col-md-4 mb-3">
            <h6>Síguenos</h6>
            <div>
              <a href="#" class="text-white me-2">
                <i class="fab fa-facebook"></i>
              </a>
              <a href="#" class="text-white me-2">
                <i class="fab fa-instagram"></i>
              </a>
              <a href="#" class="text-white">
                <i class="fab fa-twitter"></i>
              </a>
            </div>
          </div>
        </div>
        <hr />
        <p class="mb-0">&copy; 2024 Tienda de Ropa. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import NavBar from './components/NavBar.vue'
import { useAuthStore } from './stores/authStore'

const authStore = useAuthStore()

onMounted(() => {
  authStore.loadUserFromStorage()
})
</script>

<style scoped>
main {
  min-height: calc(100vh - 200px);
}
</style>
