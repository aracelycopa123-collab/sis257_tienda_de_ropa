<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand fw-bold">
        <i class="fas fa-tshirt text-danger me-2"></i>
        <span>Tienda Ropa</span>
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link" active-class="active">
              <i class="fas fa-home me-1"></i> Inicio
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/productos" class="nav-link" active-class="active">
              <i class="fas fa-shopping-bag me-1"></i> Catálogo
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/carrito" class="nav-link position-relative" active-class="active">
              <i class="fas fa-shopping-cart me-1"></i> Carrito
              <span
                v-if="cartCount > 0"
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              >
                {{ cartCount }}
              </span>
            </router-link>
          </li>
          <li v-if="!isAuthenticated" class="nav-item">
            <router-link to="/login" class="nav-link" active-class="active">
              <i class="fas fa-sign-in-alt me-1"></i> Login
            </router-link>
          </li>
          <li v-else class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="userDropdown"
              role="button"
              data-bs-toggle="dropdown"
            >
              <i class="fas fa-user me-1"></i> {{ user?.nombre }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li>
                <a class="dropdown-item" href="#">Mi Perfil</a>
              </li>
              <li>
                <a class="dropdown-item" href="#">Mis Compras</a>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <a @click="handleLogout" class="dropdown-item cursor-pointer">
                  <i class="fas fa-sign-out-alt me-1"></i> Cerrar Sesión
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useCartStore } from '../stores/cartStore'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const user = computed(() => authStore.user)
const isAuthenticated = computed(() => authStore.isAuthenticated)
const cartCount = computed(() => cartStore.items.length)

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.navbar {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
